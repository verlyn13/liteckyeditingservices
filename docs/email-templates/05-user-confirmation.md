# Email Template: User Confirmation (Contact Form)

**Template ID**: `createUserConfirmation()` ✅ **Already Implemented**
**Trigger**: After successful contact form submission
**Sent To**: Client (form submitter)
**Category**: `['intake']`
**List-Id**: `les-projects.liteckyeditingservices.com`

---

## Subject Line

```
[LES] Quote request received — {Quote ID}
```

**Example**: `[LES] Quote request received — Q-2025-10-001`

---

## Preheader

```
We'll respond within 24 hours with your quote.
```

---

## Email Body (Prose Version)

### Header
**"Thank You for Your Inquiry"**

### Main Content

Dear {name},

We have received your inquiry about **{service}** with a deadline of **{deadline}**.

### ID Badge
**Your Quote ID**: {quoteId}
Please reference this ID in any future correspondence.

### What Happens Next

Our team will review your request and respond within 24 hours with a quote and next steps.

### Your Message (for reference)

{message}

### Questions?

If you have any urgent questions, please feel free to email us at hello@liteckyeditingservices.com.

---

Best regards,
**Litecky Editing Services Team**

---

*This is an automated confirmation. Please do not reply to this email.*
*For questions, please email hello@liteckyeditingservices.com*

---

## Data Contract

```typescript
interface UserConfirmationData {
  name: string;              // Customer's first name or full name
  service: string;           // Service requested
  deadline: string;          // Project deadline
  message: string;           // Customer's original message
  quoteId: string;           // Unique quote identifier
}
```

---

## Current Implementation

✅ **Location**: `src/lib/email.ts` lines 398-477

### HTML Features
- Navy header with centered white text
- Blue quote ID badge (light blue background, navy border)
- Message quoted back in gray box
- Clean white content area
- Centered footer

### Plain Text Features
- Clear structure with line breaks
- All essential info included
- Professional formatting

---

## Notes

This template is already implemented and working. Minor color differences from site design system:

- **Header**: `#1e3a8a` (should be `#192a51`)
- **Quote ID badge**: `#dbeafe` background, `#1e3a8a` border (currently blue, could use sage/navy)

### Recommendation

When updating, consider:
1. Change header to `#192a51` (primary navy from site)
2. Quote ID badge could use warning yellow (`#fef3c7` bg, `#f59e0b` border) for consistency with admin email
3. Keep message box with sage accent border (`#5a716a`)

---

## Related Files

- Implementation: `src/lib/email.ts` - `createUserConfirmation()`
- API handler: `functions/api/contact.ts`
- Queue consumer: `workers/send-email-consumer.ts` (if applicable)
