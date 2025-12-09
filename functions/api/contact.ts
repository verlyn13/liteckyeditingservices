import type { Response as CFResponse, PagesFunction } from '@cloudflare/workers-types';
import { sendPostalEmail } from '../../src/lib/postal';
import { createAdminNotification, createUserConfirmation } from '../../src/lib/email';

// Environment bindings for Cloudflare Pages
interface Env {
  SEND_EMAIL?: {
    send: (msg: unknown) => Promise<void>;
  };
  POSTAL_API_KEY?: string;
  POSTAL_TO_EMAIL?: string;
  POSTAL_FROM_EMAIL?: string;
}

export const onRequestOptions: PagesFunction<Env> = async (): Promise<CFResponse> => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  }) as unknown as CFResponse;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }): Promise<CFResponse> => {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return json({ error: 'Unsupported Media Type' }, 415);
    }
    const data = (await request.json()) as {
      name?: string;
      email?: string;
      service?: string;
      message?: string;
    };

    if (!data?.name || !data?.email) {
      return json({ error: 'Missing required fields: name, email' }, 400);
    }

    // Prefer queue if bound
    const queue = env.SEND_EMAIL;
    if (queue && typeof queue.send === 'function') {
      await queue.send({ kind: 'contact', data });
      return json({ status: 'enqueued' }, 202);
    }

    // Otherwise, send directly via Postal if configured
    const apiKey = env.POSTAL_API_KEY;
    const to = env.POSTAL_TO_EMAIL;
    const from = env.POSTAL_FROM_EMAIL;

    if (apiKey && to && from) {
      const quoteId = `Q-${Date.now()}`;

      // Build branded admin notification
      const admin = createAdminNotification({
        name: data.name,
        email: data.email,
        service: data.service ?? '-',
        deadline: '-',
        message: data.message ?? '-',
        quoteId,
      });

      // Send admin notification
      const adminResult = await sendPostalEmail(apiKey, {
        to,
        from,
        replyTo: data.email,
        subject: `New Quote Request from ${data.name}`,
        plainBody: admin.text,
        htmlBody: admin.html,
      });

      if (adminResult.status !== 'success') {
        console.error('[Contact] Failed to send admin notification:', adminResult.error);
        return json({ status: 'accepted-no-email', reason: 'postal_error' }, 202);
      }

      // Send user confirmation
      try {
        const user = createUserConfirmation({
          name: data.name,
          service: data.service ?? '-',
          deadline: '-',
          message: data.message ?? '-',
          quoteId,
        });

        await sendPostalEmail(apiKey, {
          to: data.email,
          from,
          subject: '[LES] Inquiry received — Thank you',
          plainBody: user.text,
          htmlBody: user.html,
        });
      } catch {
        // User confirmation is optional, don't fail the request
      }

      return json({ status: 'sent' }, 202);
    }

    // Accept without email if Postal not configured
    return json({ status: 'accepted-no-email' }, 202);
  } catch (_err) {
    return json({ error: 'Invalid JSON' }, 400);
  }
};

function json(body: unknown, status = 200): CFResponse {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  }) as unknown as CFResponse;
}
