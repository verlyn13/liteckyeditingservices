/**
 * Cal.com Webhook Endpoint
 *
 * Receives and processes booking events from Cal.com:
 * - BOOKING_CREATED: New booking scheduled
 * - BOOKING_RESCHEDULED: Booking time changed
 * - BOOKING_CANCELLED: Booking cancelled by client
 *
 * Security:
 * - Verifies HMAC-SHA256 signature to prevent unauthorized requests
 * - Uses timing-safe comparison to prevent timing attacks
 * - Validates webhook secret before processing
 *
 * Integration:
 * - Queues email notifications via Postal
 * - Logs events for monitoring and debugging
 * - Reports errors to Sentry
 *
 * @see https://cal.com/docs/api-reference/v2/webhooks
 */

import type { Response as CFResponse, PagesFunction } from '@cloudflare/workers-types';
import {
  type CalcomWebhookEvent,
  type CalcomWebhookPayload,
  formatBookingForEmail,
  verifyWebhookSignature,
} from '../../src/lib/calcom-webhook';
import { sendPostalEmail } from '../../src/lib/postal';

// Environment bindings for Cloudflare Pages
interface Env {
  CALCOM_WEBHOOK_SECRET?: string;
  SEND_EMAIL?: {
    send: (msg: unknown) => Promise<void>;
  };
  POSTAL_API_KEY?: string;
  POSTAL_TO_EMAIL?: string;
  POSTAL_FROM_EMAIL?: string;
  ENVIRONMENT?: string;
  NODE_ENV?: string;
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export const onRequestOptions: PagesFunction<Env> = async (): Promise<CFResponse> => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Cal-Signature-256',
    },
  }) as unknown as CFResponse;
};

/**
 * Handle POST requests from Cal.com webhooks
 */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }): Promise<CFResponse> => {
  const startTime = Date.now();

  try {
    // 1. Validate webhook secret is configured
    const webhookSecret = env.CALCOM_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('[Cal.com Webhook] CALCOM_WEBHOOK_SECRET not configured');
      return json({ error: 'Webhook not configured' }, 500);
    }

    // 2. Get signature from header
    const signature = request.headers.get('X-Cal-Signature-256');
    if (!signature) {
      console.warn('[Cal.com Webhook] Missing X-Cal-Signature-256 header');
      return json({ error: 'Missing signature header' }, 401);
    }

    // 3. Read raw request body (must be raw text for signature verification)
    const rawBody = await request.text();
    if (!rawBody) {
      console.warn('[Cal.com Webhook] Empty request body');
      return json({ error: 'Empty request body' }, 400);
    }

    // 4. Verify webhook signature
    const isValidSignature = await verifyWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValidSignature) {
      console.warn('[Cal.com Webhook] Invalid signature');
      return json({ error: 'Invalid webhook signature' }, 401);
    }

    // 5. Parse webhook payload
    let payload: CalcomWebhookPayload;
    try {
      payload = JSON.parse(rawBody) as CalcomWebhookPayload;
    } catch (error) {
      console.error('[Cal.com Webhook] Invalid JSON payload:', error);
      return json({ error: 'Invalid JSON payload' }, 400);
    }

    // 6. Validate payload structure
    if (!payload.triggerEvent || !payload.payload) {
      console.warn('[Cal.com Webhook] Missing required fields in payload');
      return json({ error: 'Invalid payload structure' }, 400);
    }

    const { triggerEvent, payload: booking } = payload;

    // 7. Log webhook event
    console.log(`[Cal.com Webhook] Received: ${triggerEvent} (uid: ${booking.uid})`);

    // 8. Process webhook event
    await processWebhookEvent(triggerEvent, booking, env);

    // 9. Return success response
    const duration = Date.now() - startTime;
    console.log(`[Cal.com Webhook] Processed ${triggerEvent} in ${duration}ms`);

    return json(
      {
        status: 'processed',
        event: triggerEvent,
        bookingUid: booking.uid,
      },
      200
    );
  } catch (error) {
    // Log error for debugging
    console.error('[Cal.com Webhook] Unexpected error:', error);

    // Return generic error (don't leak internal details)
    return json({ error: 'Internal server error' }, 500);
  }
};

/**
 * Process webhook event and send notifications
 */
async function processWebhookEvent(
  event: CalcomWebhookEvent,
  booking: CalcomWebhookPayload['payload'],
  env: Env
): Promise<void> {
  // Format booking details for email
  const { subject, summary, details } = formatBookingForEmail(event, booking);

  // Prepare email notification
  const emailData = {
    kind: 'calcom-webhook' as const,
    event,
    booking: {
      uid: booking.uid,
      title: booking.title,
      startTime: booking.startTime,
      endTime: booking.endTime,
      attendee: booking.attendees[0],
    },
    email: {
      subject,
      summary,
      details,
    },
  };

  // Try to queue email via SEND_EMAIL queue (preferred)
  const queue = env.SEND_EMAIL;
  if (queue && typeof queue.send === 'function') {
    try {
      await queue.send(emailData);
      console.log(`[Cal.com Webhook] Email queued for booking: ${booking.uid}`);
      return;
    } catch (error) {
      console.error('[Cal.com Webhook] Failed to queue email:', error);
      // Fall through to direct Postal send
    }
  }

  // Fallback: Send email directly via Postal
  const apiKey = env.POSTAL_API_KEY;
  const to = env.POSTAL_TO_EMAIL;
  const from = env.POSTAL_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.warn('[Cal.com Webhook] Postal not configured, email not sent');
    return;
  }

  try {
    const result = await sendPostalEmail(apiKey, {
      to,
      from,
      subject,
      plainBody: `${summary}\n\n${details}`,
      htmlBody: formatEmailHtml(subject, summary, details),
    });

    if (result.status === 'success') {
      console.log(`[Cal.com Webhook] Email sent directly for booking: ${booking.uid}`);
    } else {
      console.error('[Cal.com Webhook] Failed to send email via Postal:', result.error);
    }
  } catch (error) {
    console.error('[Cal.com Webhook] Failed to send email via Postal:', error);
    // Don't throw - webhook should still return 200 to Cal.com
  }
}

/**
 * Format email content as HTML
 */
function formatEmailHtml(subject: string, summary: string, details: string): string {
  // Convert markdown-style details to HTML
  const htmlDetails = details
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/^- (.+)$/gm, '&bull; $1');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #1e3a8a;
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #f9fafb;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    .summary {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #1e3a8a;
    }
    .details {
      background-color: white;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 24px;">${subject}</h1>
  </div>
  <div class="content">
    <div class="summary">${summary}</div>
    <div class="details">${htmlDetails}</div>
  </div>
  <div class="footer">
    <p>This is an automated notification from Cal.com booking system.</p>
    <p>Litecky Editing Services &copy; ${new Date().getFullYear()}</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Helper function to create JSON response
 */
function json(body: unknown, status = 200): CFResponse {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  }) as unknown as CFResponse;
}
