# Email Template: Admin Notification (Contact Form)

**Template ID**: `createAdminNotification()` ✅ **Already Implemented**
**Trigger**: Contact form submission
**Sent To**: Admin team (SENDGRID_TO)
**Category**: `['intake']`
**List-Id**: `les-projects.liteckyeditingservices.com`

---

## Subject Line

```
[LES] New quote request — {Quote ID}
```

**Example**: `[LES] New quote request — Q-2025-10-001`

---

## Preheader

```
Contact form submission from {clientName}
```

---

## Email Body (Prose Version)

### Header
**"New Contact Form Submission"**

### ID Badge
**Quote ID**: {quoteId}

### Contact Details

**Name**: {name}
**Email**: {email}
**Service**: {service}
**Deadline**: {deadline}

### Message

{message}

### Received

{timestamp} (America/New_York)

---

*This is an automated notification.*

---

## Data Contract

```typescript
interface AdminNotificationData {
  name: string;              // Client's full name
  email: string;             // Client's email
  service: string;           // Service requested
  deadline: string;          // Project deadline
  message: string;           // Client's message
  quoteId: string;           // Unique quote ID
}
```

---

## Current Implementation

✅ **Location**: `src/lib/email.ts` lines 305-382

### HTML Features
- Navy header with white text
- Yellow quote ID badge (warning color)
- Field/value pairs in white boxes
- Light gray background
- Footer with timestamp

### Plain Text Features
- Clear section separators
- All fields labeled
- Timestamp in Eastern Time

---

## Notes

This template is already implemented and working. It follows the email design system but uses slightly different colors than the site design system:

- **Header**: `#1e3a8a` (different from site's `#192a51`)
- **Quote ID badge**: `#fef3c7` background, `#f59e0b` border ✅ (matches)

### Recommendation

When updating other templates, consider aligning admin notification to use exact site colors:
- Change header from `#1e3a8a` → `#192a51` (primary navy)
- Keep quote ID badge as-is (warning yellow)

---

## Related Files

- Implementation: `src/lib/email.ts` - `createAdminNotification()`
- API handler: `functions/api/contact.ts`
- Queue consumer: `workers/send-email-consumer.ts` (if applicable)
