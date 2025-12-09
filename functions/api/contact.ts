import type { Response as CFResponse, PagesFunction } from '@cloudflare/workers-types';

// Environment bindings for Cloudflare Pages
interface Env {
  SEND_EMAIL?: {
    send: (msg: unknown) => Promise<void>;
  };
  SENDGRID_API_KEY?: string;
  SENDGRID_TO?: string;
  SENDGRID_FROM?: string;
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

    // Prefer queue if bound; quiet-hours aware (log-only default)
    const queue = env.SEND_EMAIL;
    if (queue && typeof queue.send === 'function') {
      await queue.send({ kind: 'contact', data });
      return json({ status: 'enqueued' }, 202);
    }

    // Otherwise, if SendGrid env vars are present, attempt to send an email directly
    const apiKey = env.SENDGRID_API_KEY;
    const to = env.SENDGRID_TO;
    const from = env.SENDGRID_FROM;

    if (apiKey && to && from) {
      // Build branded templates and metadata
      const { createAdminNotification, createUserConfirmation } = await import(
        '../../src/lib/email'
      );
      const { getListId, shouldQueueForQuietHours } = await import('../../src/lib/email-helpers');

      const admin = createAdminNotification({
        name: data.name,
        email: data.email,
        service: data.service ?? '-',
        deadline: '-',
        message: data.message ?? '-',
        quoteId: `Q-${Date.now()}`,
      });

      const listId = getListId('intake');
      const quiet = shouldQueueForQuietHours(new Date(), 'America/Anchorage');

      const payload = {
        personalizations: [
          {
            to: [{ email: to }],
            subject: `New Quote Request from ${data.name}`,
          },
        ],
        from: { email: from },
        reply_to: { email: data.email },
        headers: { 'List-Id': listId },
        categories: ['intake', 'project'],
        custom_args: { quiet_hours: String(quiet) },
        content: [
          { type: 'text/plain', value: admin.text },
          { type: 'text/html', value: admin.html },
        ],
      } as Record<string, unknown>;

      const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        return json({ status: 'accepted-no-email', reason: 'sendgrid_error' }, 202);
      }

      // Optionally send user confirmation when FROM is configured
      try {
        const user = createUserConfirmation({
          name: data.name,
          service: data.service ?? '-',
          deadline: '-',
          message: data.message ?? '-',
          quoteId: `Q-${Date.now()}`,
        });
        const userPayload = {
          personalizations: [
            {
              to: [{ email: data.email }],
              subject: '[LES] Inquiry received — Thank you',
            },
          ],
          from: { email: from },
          headers: { 'List-Id': listId },
          categories: ['intake', 'customer'],
          custom_args: { quiet_hours: String(quiet) },
          content: [
            { type: 'text/plain', value: user.text },
            { type: 'text/html', value: user.html },
          ],
        } as Record<string, unknown>;
        await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userPayload),
        });
      } catch {}

      return json({ status: 'sent' }, 202);
    }

    // Accept without email if SendGrid not configured yet
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
