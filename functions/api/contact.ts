export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

export const onRequestPost: PagesFunction = async ({ request, env }) => {
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

    // If a Queue producer is bound, enqueue an email job
    const queue = (env as any).SEND_EMAIL as { send: (msg: unknown) => Promise<void> } | undefined;
    if (queue && typeof queue.send === 'function') {
      await queue.send({ kind: 'contact', data });
      return json({ status: 'enqueued' }, 202);
    }

    // Otherwise, if SendGrid env vars are present, attempt to send an email directly
    const apiKey = (env as any).SENDGRID_API_KEY as string | undefined;
    const to = (env as any).SENDGRID_TO as string | undefined;
    const from = (env as any).SENDGRID_FROM as string | undefined;

    if (apiKey && to && from) {
      const payload = {
        personalizations: [{ to: [{ email: to }], subject: `New Quote Request from ${data.name}` }],
        from: { email: from },
        reply_to: { email: data.email },
        content: [
          {
            type: 'text/plain',
            value: `Name: ${data.name}\nEmail: ${data.email}\nService: ${data.service ?? '-'}\nMessage: ${data.message ?? '-'}`,
          },
        ],
      };

      const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        return json({ status: 'sent' }, 202);
      }
      return json({ status: 'accepted-no-email', reason: 'sendgrid_error' }, 202);
    }

    // Accept without email if SendGrid not configured yet
    return json({ status: 'accepted-no-email' }, 202);
  } catch (err) {
    return json({ error: 'Invalid JSON' }, 400);
  }
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
