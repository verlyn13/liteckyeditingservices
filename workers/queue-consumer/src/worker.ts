export interface ContactMessage {
  kind: 'contact';
  data: {
    name: string;
    email: string;
    service?: string;
    message?: string;
  };
}

type Env = {
  SENDGRID_API_KEY?: string;
  SENDGRID_FROM?: string;
  SENDGRID_TO?: string;
};

import type { MessageBatch } from '@cloudflare/workers-types';

export default {
  async queue(batch: MessageBatch<ContactMessage>, env: Env): Promise<void> {
    for (const msg of batch.messages) {
      try {
        if (msg.body.kind !== 'contact') {
          continue;
        }
        const { name, email, service, message } = msg.body.data;

        const apiKey = env.SENDGRID_API_KEY;
        const from = env.SENDGRID_FROM;
        const to = env.SENDGRID_TO;
        if (!apiKey || !from || !to) {
          // No email config; ack and continue
          msg.ack();
          continue;
        }

        const payload = {
          personalizations: [{ to: [{ email: to }], subject: `New Quote Request from ${name}` }],
          from: { email: from },
          reply_to: { email },
          content: [
            {
              type: 'text/plain',
              value: `Name: ${name}\nEmail: ${email}\nService: ${service ?? '-'}\nMessage: ${message ?? '-'}`,
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
          msg.ack();
        } else {
          // Retry later
          msg.retry();
        }
      } catch (_e) {
        // Retry transient failures
        msg.retry();
      }
    }
  },
};
