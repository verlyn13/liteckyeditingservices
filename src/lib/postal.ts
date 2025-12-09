/**
 * Postal Email Service
 *
 * Simple email delivery via self-hosted Postal instance.
 * Replaces SendGrid for all transactional email.
 *
 * @see https://postal.jefahnierocks.com
 */

export interface PostalEmailOptions {
  to: string | string[];
  from: string;
  subject: string;
  plainBody: string;
  htmlBody?: string;
  replyTo?: string;
}

export interface PostalResponse {
  status: 'success' | 'error';
  time: number;
  data?: {
    message_id: string;
    messages: Record<string, { id: number; token: string }>;
  };
  error?: string;
}

const POSTAL_API_URL = 'https://postal.jefahnierocks.com/api/v1/send/message';

/**
 * Send email via Postal API
 */
export async function sendPostalEmail(
  apiKey: string,
  options: PostalEmailOptions
): Promise<PostalResponse> {
  const { to, from, subject, plainBody, htmlBody, replyTo } = options;

  const recipients = Array.isArray(to) ? to : [to];

  const body: Record<string, unknown> = {
    to: recipients,
    from,
    subject,
    plain_body: plainBody,
  };

  if (htmlBody) {
    body.html_body = htmlBody;
  }

  if (replyTo) {
    body.reply_to = replyTo;
  }

  try {
    console.log('[Postal] Sending email to:', recipients.join(', '));

    const response = await fetch(POSTAL_API_URL, {
      method: 'POST',
      headers: {
        'X-Server-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log(
      '[Postal] Response status:',
      response.status,
      'body:',
      responseText.substring(0, 500)
    );

    let result: PostalResponse;
    try {
      result = JSON.parse(responseText) as PostalResponse;
    } catch {
      console.error('[Postal] Failed to parse response as JSON');
      return {
        status: 'error',
        time: 0,
        error: `Invalid JSON response: ${responseText.substring(0, 200)}`,
      };
    }

    if (!response.ok) {
      console.error('[Postal] API error:', {
        status: response.status,
        error: result.error,
      });
      return {
        status: 'error',
        time: 0,
        error: result.error || `HTTP ${response.status}`,
      };
    }

    console.log('[Postal] Email sent:', {
      to: recipients,
      subject,
      messageId: result.data?.message_id,
    });

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Postal] Send failed:', message, error);
    return {
      status: 'error',
      time: 0,
      error: message,
    };
  }
}
