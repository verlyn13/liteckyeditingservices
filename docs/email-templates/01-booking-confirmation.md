# Email Template: Booking Confirmation

**Template ID**: `createBookingConfirmation()`
**Trigger**: Cal.com `booking.created` webhook
**Sent To**: Client (person who booked)
**Category**: `['booking']`
**List-Id**: `les-bookings.liteckyeditingservices.com`

---

## Subject Line

```
[LES] Booking confirmed — {Day}, {Date}, {Time} {TZ}
```

**Example**: `[LES] Booking confirmed — Tue, Oct 28, 2:00 PM AKT`

---

## Preheader

```
Your consultation is scheduled. Details and preparation steps inside.
```

---

## Email Body (Prose Version)

### Header
**"Your Consultation is Confirmed"**

### ID Badge
**Booking ID**: {bookingId}
Please reference this ID in any correspondence about this consultation.

### Main Content

Dear {clientName},

Your consultation with Litecky Editing Services is confirmed for:

**{Day}, {Date} at {Time} {Timezone}**
Duration: {duration} minutes
Location: {location} (Zoom link will be sent 15 minutes before)

### What to Prepare

To make the most of our time together:

- **Your document** (or excerpt) in Word format with Track Changes enabled
- **Key concerns** - specific sections or recurring feedback you've received
- **Deadline** - your target submission date

You can upload materials before the consultation using this link:
[Upload Documents](#)

### Need to Change Plans?

[Reschedule Consultation](#) or [Cancel Booking](#)

### What Happens Next

1. You'll receive a calendar invite (check your email)
2. 24 hours before: Reminder email with Zoom link
3. 15 minutes before: Final reminder with direct join link

### Questions?

Reply to this email or contact us at hello@liteckyeditingservices.com

---

Best regards,
**Litecky Editing Services**

---

*This is an automated confirmation. All times shown in {Timezone}.*

---

## Data Contract

```typescript
interface BookingConfirmationData {
  // Client info
  clientName: string;        // "Dr. Sarah Chen"
  clientEmail: string;       // "sarah@example.edu"

  // Booking details
  bookingId: string;         // "bk_abc123xyz"
  eventType: string;         // "Free Consultation"

  // Timing (all ISO 8601)
  startsAt: string;          // "2025-10-28T14:00:00-08:00"
  endsAt: string;            // "2025-10-28T14:30:00-08:00"
  timezone: string;          // "America/Anchorage"
  duration: number;          // 30 (minutes)

  // Formatted display strings (computed server-side)
  dayName: string;           // "Tuesday"
  dateFormatted: string;     // "October 28, 2025"
  timeFormatted: string;     // "2:00 PM"

  // Location
  location: string;          // "Zoom" | "Phone" | "Google Meet"
  locationDetails?: string;  // Zoom link (sent separately, not in initial email)

  // Actions
  rescheduleUrl: string;     // Cal.com reschedule link
  cancelUrl: string;         // Cal.com cancel link
  uploadUrl: string;         // `/upload/{bookingId}` - custom page

  // Metadata
  createdAt: string;         // "2025-10-14T10:30:00Z"
}
```

---

## HTML Structure Notes

### ID Badge Styling
```css
background: #fef3c7;
border-left: 4px solid #f59e0b;
padding: 15px;
margin: 20px 0;
```

### Date/Time Display
```html
<div style="background: #f7f7f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3 style="color: #192a51; margin: 0 0 10px 0;">Tuesday, October 28, 2025</h3>
  <p style="font-size: 24px; font-weight: 600; color: #2c2c2c; margin: 0;">2:00 PM AKT</p>
  <p style="color: #6b6b6b; margin: 10px 0 0 0;">Duration: 30 minutes • Zoom</p>
</div>
```

### Primary Button
```html
<a href="{uploadUrl}"
   style="display: inline-block; padding: 12px 32px; background-color: #5a716a; color: #fff;
          text-decoration: none; border-radius: 6px; font-weight: 600; min-height: 44px;
          line-height: 20px;">
  Upload Documents
</a>
```

### Secondary Links (Reschedule/Cancel)
```html
<p style="text-align: center; margin: 30px 0;">
  <a href="{rescheduleUrl}" style="color: #192a51; margin: 0 15px;">Reschedule</a> •
  <a href="{cancelUrl}" style="color: #192a51; margin: 0 15px;">Cancel</a>
</p>
```

---

## Plain Text Version

```
[LES] BOOKING CONFIRMED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Consultation is Confirmed

Booking ID: {bookingId}
Please reference this ID in any correspondence.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear {clientName},

Your consultation with Litecky Editing Services is confirmed for:

{Day}, {Date} at {Time} {Timezone}
Duration: {duration} minutes
Location: {location}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT TO PREPARE

To make the most of our time together:

• Your document (or excerpt) in Word format with Track Changes
• Key concerns - specific sections or feedback you've received
• Deadline - your target submission date

Upload materials before the consultation:
{uploadUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEED TO CHANGE PLANS?

Reschedule: {rescheduleUrl}
Cancel: {cancelUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT HAPPENS NEXT

1. You'll receive a calendar invite (check your email)
2. 24 hours before: Reminder email with Zoom link
3. 15 minutes before: Final reminder with join link

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions?
Reply to this email or contact: hello@liteckyeditingservices.com

Best regards,
Litecky Editing Services

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated confirmation.
All times shown in {Timezone}.
```

---

## Testing Checklist

- [ ] Subject line includes correct day/date/time
- [ ] Booking ID displays prominently
- [ ] Date/time formatted correctly for AKT
- [ ] Upload link points to `/upload/{bookingId}`
- [ ] Reschedule/cancel links work (Cal.com)
- [ ] Plain text version includes all essential info
- [ ] Renders correctly in Gmail, Outlook, Apple Mail
- [ ] Button has 44px min-height (accessible)
- [ ] Color contrast meets WCAG AA

---

## Related Files

- Implementation: `src/lib/email.ts` - `createBookingConfirmation()`
- Webhook handler: `functions/api/cal/webhook.ts`
- Upload page: `src/pages/upload/[bookingId].astro`
- Test: `tests/unit/email-templates.test.ts`
