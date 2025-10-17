/**
 * Cal.com Webhook Signature Verification
 *
 * Verifies HMAC-SHA256 signatures from Cal.com webhooks to ensure authenticity
 * and prevent unauthorized requests.
 *
 * @see https://cal.com/docs/api-reference/v2/webhooks
 */

/**
 * Verifies a Cal.com webhook signature using HMAC-SHA256
 *
 * @param payload - Raw request body as string (must not be parsed as JSON)
 * @param signature - Signature from X-Cal-Signature-256 header (format: "sha256=<hash>")
 * @param secret - Webhook secret from Cal.com dashboard (format: "whsec_...")
 * @returns Promise<boolean> - True if signature is valid, false otherwise
 *
 * @example
 * ```typescript
 * const body = await request.text();
 * const signature = request.headers.get('X-Cal-Signature-256');
 * const secret = env.CALCOM_WEBHOOK_SECRET;
 *
 * const isValid = await verifyWebhookSignature(body, signature, secret);
 * if (!isValid) {
 *   return new Response('Invalid signature', { status: 401 });
 * }
 * ```
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): Promise<boolean> {
  // Validate inputs
  if (!signature || !secret || !payload) {
    return false;
  }

  // Extract hash from signature (format: "sha256=<hash>")
  const signatureParts = signature.split('=');
  if (signatureParts.length !== 2 || signatureParts[0] !== 'sha256') {
    return false;
  }
  const receivedHash = signatureParts[1];

  try {
    // Compute expected signature using Web Crypto API
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(payload);

    // Import secret as HMAC key
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Compute HMAC-SHA256 signature
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, messageData);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    const expectedHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    // Timing-safe comparison to prevent timing attacks
    return timingSafeEqual(expectedHash, receivedHash);
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Timing-safe string comparison to prevent timing attacks
 *
 * Compares two strings in constant time, preventing attackers from
 * using timing information to guess the correct signature.
 *
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns boolean - True if strings are equal, false otherwise
 */
function timingSafeEqual(a: string, b: string): boolean {
  // If lengths differ, comparison is not constant-time, but that's OK
  // because the attacker already knows the expected length
  if (a.length !== b.length) {
    return false;
  }

  // XOR all characters and accumulate result
  // This ensures comparison takes the same time regardless of where strings differ
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Type definitions for Cal.com webhook payloads
 */

export type CalcomWebhookEvent = 'BOOKING_CREATED' | 'BOOKING_RESCHEDULED' | 'BOOKING_CANCELLED';

export interface CalcomWebhookPayload {
  triggerEvent: CalcomWebhookEvent;
  payload: CalcomBookingPayload;
}

export interface CalcomBookingPayload {
  uid: string;
  title: string;
  description?: string;
  startTime: string; // ISO 8601 datetime
  endTime: string; // ISO 8601 datetime
  attendees: CalcomAttendee[];
  organizer: CalcomOrganizer;
  metadata?: Record<string, unknown>;
  status?: 'ACCEPTED' | 'PENDING' | 'CANCELLED';
  location?: string;
  rescheduleUid?: string; // Present for BOOKING_RESCHEDULED events
  cancellationReason?: string; // Present for BOOKING_CANCELLED events
}

export interface CalcomAttendee {
  name: string;
  email: string;
  timeZone: string;
  locale?: string;
}

export interface CalcomOrganizer {
  name: string;
  email: string;
  timeZone: string;
  id?: number;
}

/**
 * Formats a Cal.com booking for email notification
 *
 * @param event - Webhook event type
 * @param booking - Booking payload from Cal.com
 * @returns Formatted booking details for email
 */
export function formatBookingForEmail(
  event: CalcomWebhookEvent,
  booking: CalcomBookingPayload
): {
  subject: string;
  summary: string;
  details: string;
} {
  const eventLabels: Record<CalcomWebhookEvent, string> = {
    BOOKING_CREATED: 'New Booking',
    BOOKING_RESCHEDULED: 'Booking Rescheduled',
    BOOKING_CANCELLED: 'Booking Cancelled',
  };

  const attendee = booking.attendees[0]; // Primary attendee
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  // Format date and time
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: booking.organizer.timeZone,
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: booking.organizer.timeZone,
  });

  const date = dateFormatter.format(startTime);
  const time = `${timeFormatter.format(startTime)} - ${timeFormatter.format(endTime)}`;

  const subject = `${eventLabels[event]}: ${booking.title}`;

  const summary = `${attendee.name} (${attendee.email}) - ${date} at ${time}`;

  let details = `
**Event**: ${booking.title}
**Date**: ${date}
**Time**: ${time}
**Duration**: ${Math.round((endTime.getTime() - startTime.getTime()) / 60000)} minutes

**Attendee**:
- Name: ${attendee.name}
- Email: ${attendee.email}
- Time Zone: ${attendee.timeZone}

**Booking ID**: ${booking.uid}
`;

  if (booking.description) {
    details += `\n**Description**: ${booking.description}`;
  }

  if (booking.location) {
    details += `\n**Location**: ${booking.location}`;
  }

  if (event === 'BOOKING_RESCHEDULED' && booking.rescheduleUid) {
    details += `\n**Previous Booking ID**: ${booking.rescheduleUid}`;
  }

  if (event === 'BOOKING_CANCELLED' && booking.cancellationReason) {
    details += `\n**Cancellation Reason**: ${booking.cancellationReason}`;
  }

  if (booking.metadata && Object.keys(booking.metadata).length > 0) {
    details += '\n\n**Additional Information**:';
    for (const [key, value] of Object.entries(booking.metadata)) {
      details += `\n- ${key}: ${value}`;
    }
  }

  return { subject, summary, details };
}
