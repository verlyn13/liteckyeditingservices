import crypto from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { formatBookingForEmail, verifyWebhookSignature } from '../../src/lib/calcom-webhook';

describe('Cal.com webhook security utilities', () => {
  const payload = JSON.stringify({ hello: 'world', n: 42 });
  const secret = 'whsec_test_secret_value_123';

  function hmac(payloadText: string, sec: string): string {
    return crypto.createHmac('sha256', sec).update(payloadText).digest('hex');
  }

  it('verifies a valid signature (sha256=...)', async () => {
    const sig = `sha256=${hmac(payload, secret)}`;
    const ok = await verifyWebhookSignature(payload, sig, secret);
    expect(ok).toBe(true);
  });

  it('rejects invalid signature', async () => {
    const sig = `sha256=${'00'.repeat(32)}`;
    const ok = await verifyWebhookSignature(payload, sig, secret);
    expect(ok).toBe(false);
  });

  it('rejects wrong header format', async () => {
    const badFormat = hmac(payload, secret); // missing sha256=
    const ok = await verifyWebhookSignature(payload, badFormat, secret);
    expect(ok).toBe(false);
  });

  it('rejects when inputs are missing', async () => {
    const ok1 = await verifyWebhookSignature('', null, secret);
    expect(ok1).toBe(false);
    const ok2 = await verifyWebhookSignature(payload, 'sha256=abcd', '');
    expect(ok2).toBe(false);
  });
});

describe('formatBookingForEmail', () => {
  it('produces subject, summary, details with key fields', () => {
    const booking = {
      uid: 'abc123',
      title: 'Consultation',
      description: 'Discuss project scope',
      startTime: '2025-10-16T18:00:00Z',
      endTime: '2025-10-16T18:30:00Z',
      attendees: [
        {
          name: 'Test User',
          email: 'test@example.com',
          timeZone: 'America/Anchorage',
        },
      ],
      organizer: {
        name: 'Org',
        email: 'org@example.com',
        timeZone: 'America/Anchorage',
      },
      status: 'ACCEPTED' as const,
      metadata: { source: 'test' },
    };

    const formatted = formatBookingForEmail('BOOKING_CREATED', booking);
    expect(formatted.subject).toContain('New Booking');
    expect(formatted.subject).toContain('Consultation');
    expect(formatted.summary).toContain('Test User');
    expect(formatted.details).toContain('**Event**: Consultation');
    expect(formatted.details).toContain('**Booking ID**: abc123');
    expect(formatted.details).toContain('- Email: test@example.com');
  });
});
