# Email Template: Invoice Issued

**Template ID**: `createInvoiceIssued()`
**Trigger**: When invoice created in QuickBooks (webhook or polling)
**Sent To**: Client
**Category**: `['billing']`
**List-Id**: `les-billing.liteckyeditingservices.com`

---

## Subject Line

```
[LES] Invoice {invoiceNumber} — {totalAmount}
```

**Example**: `[LES] Invoice #2025-10-042 — $450.00`

---

## Preheader

```
Payment due by {dueDate}.
```

---

## Email Body (Prose Version)

### Header
**"Invoice for {projectTitle}"**

### ID Badges
**Invoice #**: {invoiceNumber}
**Project ID**: {projectId}

### Main Content

Dear {clientName},

Here's your invoice for **"{projectTitle}"**.

### Invoice Details

**Amount Due**: {totalAmount}
**Due Date**: {dueDate}
**Service**: {service}

[View & Pay Invoice](#)

### Payment Methods

We accept:

- **Credit/Debit Card** (via Stripe - instant confirmation)
- **Bank Transfer** (ACH - 2-3 business days)
- **Check** (mail to address below)

### Payment Terms

Payment is due within {paymentTerms} days of invoice date. If you need to arrange a different payment schedule, please contact us—we're happy to work with you.

### Questions About This Invoice?

Reply to this email or contact us at hello@liteckyeditingservices.com.

---

**Mailing Address** (for checks):
Litecky Editing Services
[Address Line 1]
[City, State ZIP]

---

Best regards,
**Litecky Editing Services**

---

*Invoice issued: {issueDate}*

---

## Data Contract

```typescript
interface InvoiceIssuedData {
  // Client info
  clientName: string;
  clientEmail: string;

  // Invoice details
  invoiceNumber: string;       // "2025-10-042"
  invoiceId: string;           // Internal/QuickBooks ID

  // Project details
  projectId: string;
  projectTitle: string;
  service: string;

  // Amounts
  subtotal: string;            // "$450.00"
  tax?: string;                // "$0.00" or amount
  total: string;               // "$450.00"
  currency: string;            // "USD"

  // Timeline
  issueDate: string;           // "October 28, 2025"
  dueDate: string;             // "November 11, 2025"
  paymentTerms: number;        // 14 (days)

  // Payment
  paymentUrl: string;          // Stripe invoice link or custom payment page
  paymentMethods: string[];    // ["card", "ach", "check"]

  // Mailing address (for check payments)
  mailingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };

  // Metadata
  issuedAt: string;            // ISO 8601
}
```

---

## HTML Structure Notes

### Amount Display
```html
<div style="background: #f7f7f5; padding: 20px; border-radius: 8px; margin: 20px 0;
            text-align: center;">
  <p style="color: #6b6b6b; font-size: 14px; margin: 0 0 5px 0;">AMOUNT DUE</p>
  <p style="font-size: 32px; font-weight: 700; color: #192a51; margin: 0 0 10px 0;">
    {totalAmount}
  </p>
  <p style="color: #6b6b6b; font-size: 14px; margin: 0;">
    Due by {dueDate}
  </p>
</div>
```

### Primary Button
```html
<a href="{paymentUrl}"
   style="display: inline-block; padding: 12px 32px; background-color: #5a716a; color: #fff;
          text-decoration: none; border-radius: 6px; font-weight: 600; min-height: 44px;
          line-height: 20px;">
  View & Pay Invoice
</a>
```

---

## Plain Text Version

```
[LES] INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Invoice for {projectTitle}

Invoice #: {invoiceNumber}
Project ID: {projectId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear {clientName},

Here's your invoice for "{projectTitle}".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INVOICE DETAILS

Amount Due: {totalAmount}
Due Date: {dueDate}
Service: {service}

View & pay: {paymentUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT METHODS

We accept:

• Credit/Debit Card (via Stripe - instant confirmation)
• Bank Transfer (ACH - 2-3 business days)
• Check (mail to address below)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT TERMS

Payment due within {paymentTerms} days of invoice date.
Need a different schedule? Contact us—we're happy to work with you.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUESTIONS?

Reply to this email or contact: hello@liteckyeditingservices.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MAILING ADDRESS (for checks):

Litecky Editing Services
{address.line1}
{address.city}, {address.state} {address.zip}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
Litecky Editing Services

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Invoice issued: {issueDate}
```

---

## Implementation Notes

### QuickBooks Integration

If using QuickBooks webhook:
- Listen for `Invoice.Create` event
- Extract invoice data
- Send via SendGrid with this template

### Stripe Integration Alternative

If using Stripe for invoicing:
- Stripe sends its own invoice emails (customizable)
- Consider: Use Stripe's email OR this template (not both)
- This template recommended if you want full brand control

---

## Related Files

- Implementation: `src/lib/email.ts` - `createInvoiceIssued()`
- Webhook handler: `functions/api/quickbooks/webhook.ts` or `functions/api/stripe/webhook.ts`
- Payment page: Custom payment gateway or Stripe hosted invoice
