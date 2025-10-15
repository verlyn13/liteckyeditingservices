# Email Template: Booking Rescheduled

**Template ID**: `createBookingRescheduled()`
**Trigger**: Cal.com `booking.rescheduled` webhook
**Sent To**: Client (person who rescheduled)
**Category**: `['booking']`
**List-Id**: `les-bookings.liteckyeditingservices.com`

---

## Subject Line

```
[LES] Booking rescheduled — Now {Day}, {Date}, {Time} {TZ}
```

**Example**: `[LES] Booking rescheduled — Now Fri, Nov 1, 3:00 PM AKT`

---

## Preheader

```
Your consultation has been moved to a new time.
```

---

## Email Body (Prose Version)

### Header
**"Your Consultation Has Been Rescheduled"**

### ID Badge
**Booking ID**: {bookingId}

### Main Content

Dear {clientName},

Your consultation has been successfully rescheduled.

### New Time

**{Day}, {Date} at {Time} {Timezone}**
Duration: {duration} minutes
Location: {location}

### Previous Time (for reference)

Was: {oldDay}, {oldDate} at {oldTime} {oldTimezone}

### Everything Else Stays the Same

- Your uploaded documents remain attached to this booking
- The Zoom link will be the same (sent 15 minutes before)
- No action needed from you

### Need to Change Again?

[Reschedule Consultation](#) or [Cancel Booking](#)

---

Best regards,
**Litecky Editing Services**

---

*Updated calendar invite sent separately. All times shown in {Timezone}.*

---

## Data Contract

```typescript
interface BookingRescheduledData {
  // Client info
  clientName: string;
  clientEmail: string;

  // Booking details
  bookingId: string;
  eventType: string;

  // NEW timing
  startsAt: string;          // ISO 8601
  endsAt: string;
  timezone: string;
  duration: number;
  dayName: string;
  dateFormatted: string;
  timeFormatted: string;

  // OLD timing (for comparison)
  oldStartsAt: string;
  oldDayName: string;
  oldDateFormatted: string;
  oldTimeFormatted: string;
  oldTimezone: string;

  // Location (unchanged)
  location: string;

  // Actions
  rescheduleUrl: string;
  cancelUrl: string;

  // Metadata
  rescheduledAt: string;     // When reschedule happened
}
```

---

## HTML Structure Notes

### Time Comparison Block
```html
<div style="background: #f7f7f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3 style="color: #192a51; margin: 0 0 15px 0;">New Time</h3>
  <p style="font-size: 24px; font-weight: 600; color: #2c2c2c; margin: 0;">
    {Day}, {Date} at {Time} {TZ}
  </p>
  <p style="color: #6b6b6b; margin: 10px 0 0 0;">Duration: {duration} minutes • {location}</p>

  <hr style="border: none; border-top: 1px solid #e8e8e6; margin: 20px 0;" />

  <p style="color: #6b6b6b; font-size: 14px; margin: 0;">
    <strong>Was:</strong> {oldDay}, {oldDate} at {oldTime} {oldTZ}
  </p>
</div>
```

---

## Plain Text Version

```
[LES] BOOKING RESCHEDULED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Consultation Has Been Rescheduled

Booking ID: {bookingId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear {clientName},

Your consultation has been successfully rescheduled.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEW TIME

{Day}, {Date} at {Time} {Timezone}
Duration: {duration} minutes
Location: {location}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PREVIOUS TIME (for reference)

Was: {oldDay}, {oldDate} at {oldTime} {oldTimezone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EVERYTHING ELSE STAYS THE SAME

• Your uploaded documents remain attached
• The Zoom link will be the same
• No action needed from you

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEED TO CHANGE AGAIN?

Reschedule: {rescheduleUrl}
Cancel: {cancelUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
Litecky Editing Services

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Updated calendar invite sent separately.
All times shown in {Timezone}.
```

---

## Testing Checklist

- [ ] Subject line shows NEW time
- [ ] Email body clearly distinguishes old vs new time
- [ ] Booking ID unchanged
- [ ] Reschedule/cancel links still work
- [ ] Plain text version readable
- [ ] Color contrast meets WCAG AA

---

## Related Files

- Implementation: `src/lib/email.ts` - `createBookingRescheduled()`
- Webhook handler: `functions/api/cal/webhook.ts`
