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
  POSTAL_API_KEY?: string;
  POSTAL_FROM_EMAIL?: string;
  POSTAL_TO_EMAIL?: string;
};

import type { MessageBatch } from '@cloudflare/workers-types';

const POSTAL_API_URL = 'https://postal.jefahnierocks.com/api/v1/send/message';

export default {
  async queue(batch: MessageBatch<ContactMessage>, env: Env): Promise<void> {
    for (const msg of batch.messages) {
      try {
        if (msg.body.kind !== 'contact') {
          continue;
        }
        const { name, email, service, message } = msg.body.data;

        const apiKey = env.POSTAL_API_KEY;
        const from = env.POSTAL_FROM_EMAIL;
        const to = env.POSTAL_TO_EMAIL;
        if (!apiKey || !from || !to) {
          // No email config; ack and continue
          msg.ack();
          continue;
        }

        // Build branded admin email
        const { createAdminNotification } = await import('../../../src/lib/email');
        const admin = createAdminNotification({
          name,
          email,
          service: service ?? '-',
          deadline: '-',
          message: message ?? '-',
          quoteId: `Q-${Date.now()}`,
        });

        const payload = {
          to: [to],
          from,
          reply_to: email,
          subject: `New Quote Request from ${name}`,
          plain_body: admin.text,
          html_body: admin.html,
        };

        const resp = await fetch(POSTAL_API_URL, {
          method: 'POST',
          headers: {
            'X-Server-API-Key': apiKey,
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
