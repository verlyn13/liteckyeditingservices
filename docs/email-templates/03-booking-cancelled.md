# Email Template: Booking Cancelled

**Template ID**: `createBookingCancelled()`
**Trigger**: Cal.com `booking.cancelled` webhook
**Sent To**: Client (person who cancelled) OR admin (if client cancelled)
**Category**: `['booking']`
**List-Id**: `les-bookings.liteckyeditingservices.com`

---

## Subject Line

```
[LES] Booking cancelled — {Day}, {Date}, {Time} {TZ}
```

**Example**: `[LES] Booking cancelled — Fri, Nov 1, 3:00 PM AKT`

---

## Preheader

```
Your consultation has been cancelled. Rebook anytime.
```

---

## Email Body (Prose Version)

### Header
**"Your Consultation Has Been Cancelled"**

### ID Badge
**Booking ID**: {bookingId} *(Cancelled)*

### Main Content

Dear {clientName},

Your consultation scheduled for **{Day}, {Date} at {Time} {Timezone}** has been cancelled.

### No Charge, No Obligation

There's no cancellation fee. If your plans change, you're welcome to schedule a new consultation anytime.

### Book Again When Ready

[Schedule New Consultation](#)

We're here whenever you need editing support.

---

Best regards,
**Litecky Editing Services**

---

*Cancelled: {cancelledDate}. All times shown in {Timezone}.*

---

## Data Contract

```typescript
interface BookingCancelledData {
  // Client info
  clientName: string;
  clientEmail: string;

  // Booking details
  bookingId: string;
  eventType: string;

  // Cancelled booking timing (for reference)
  startsAt: string;          // ISO 8601 of the cancelled time
  timezone: string;
  dayName: string;
  dateFormatted: string;
  timeFormatted: string;

  // Location (for reference)
  location: string;

  // Metadata
  cancelledAt: string;       // When cancellation happened
  cancelledBy: 'client' | 'admin';  // Who cancelled
  cancellationReason?: string;      // Optional reason

  // Actions
  rebookUrl: string;         // Link back to Cal.com booking page
}
```

---

## HTML Structure Notes

### Cancelled Booking Info
```html
<div style="background: #f7f7f5; padding: 20px; border-radius: 8px; margin: 20px 0;
            border-left: 4px solid #6b6b6b;">
  <p style="color: #6b6b6b; margin: 0 0 5px 0; font-size: 14px; font-weight: 600;">
    CANCELLED
  </p>
  <p style="font-size: 18px; color: #2c2c2c; margin: 0;">
    {Day}, {Date} at {Time} {TZ}
  </p>
  <p style="color: #6b6b6b; margin: 5px 0 0 0; font-size: 14px;">
    Duration: {duration} minutes • {location}
  </p>
</div>
```

### Primary Button (Rebook)
```html
<a href="{rebookUrl}"
   style="display: inline-block; padding: 12px 32px; background-color: #5a716a; color: #fff;
          text-decoration: none; border-radius: 6px; font-weight: 600; min-height: 44px;
          line-height: 20px;">
  Schedule New Consultation
</a>
```

---

## Plain Text Version

```
[LES] BOOKING CANCELLED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Consultation Has Been Cancelled

Booking ID: {bookingId} (Cancelled)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear {clientName},

Your consultation scheduled for:

{Day}, {Date} at {Time} {Timezone}

has been cancelled.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NO CHARGE, NO OBLIGATION

There's no cancellation fee. If your plans change,
you're welcome to schedule a new consultation anytime.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BOOK AGAIN WHEN READY

{rebookUrl}

We're here whenever you need editing support.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
Litecky Editing Services

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cancelled: {cancelledDate}
All times shown in {Timezone}.
```

---

## Testing Checklist

- [ ] Subject line shows cancelled time
- [ ] ID badge shows "(Cancelled)" status
- [ ] Rebook button links to Cal.com booking page
- [ ] Tone is supportive, not punitive
- [ ] Plain text version readable
- [ ] Color contrast meets WCAG AA

---

## Related Files

- Implementation: `src/lib/email.ts` - `createBookingCancelled()`
- Webhook handler: `functions/api/cal/webhook.ts`
