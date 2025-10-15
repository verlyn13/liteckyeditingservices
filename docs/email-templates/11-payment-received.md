# Email Template: Payment Received

**Template ID**: `createPaymentReceived()`
**Trigger**: After payment posted in QuickBooks or Stripe (webhook)
**Sent To**: Client
**Category**: `['billing']`
**List-Id**: `les-billing.liteckyeditingservices.com`

---

## Subject Line

```
[LES] Payment received — {invoiceNumber}
```

**Example**: `[LES] Payment received — #2025-10-042`

---

## Preheader

```
Thank you. Your receipt is attached.
```

---

## Email Body (Prose Version)

### Header
**"Payment Received"**

### ID Badge
**Receipt #**: {receiptNumber}
**Invoice #**: {invoiceNumber}

### Main Content

Dear {clientName},

We've received your payment of **{amountPaid}** for **"{projectTitle}"**.

### Payment Details

**Amount Paid**: {amountPaid}
**Payment Method**: {paymentMethod}
**Date**: {paymentDate}

[Download Receipt (PDF)](#)

### Balance

{balanceMessage}

### Thank You

We appreciate your business and the opportunity to support your academic work. If you have future editing needs, we'd be honored to work with you again.

---

Best regards,
**Litecky Editing Services**

---

*Payment processed: {processedDate}*

---

## Data Contract

```typescript
interface PaymentReceivedData {
  // Client info
  clientName: string;
  clientEmail: string;

  // Receipt details
  receiptNumber: string;       // "RCT-2025-10-042"
  receiptId: string;           // Internal/QuickBooks ID

  // Invoice reference
  invoiceNumber: string;
  invoiceId: string;

  // Project details
  projectId: string;
  projectTitle: string;

  // Payment details
  amountPaid: string;          // "$450.00"
  paymentMethod: string;       // "Credit Card (Visa ****1234)" | "ACH" | "Check #5678"
  paymentDate: string;         // "November 3, 2025"

  // Balance
  previousBalance: string;     // "$450.00"
  newBalance: string;          // "$0.00"
  balanceStatus: 'paid' | 'partial' | 'overpaid';

  // Receipt file
  receiptUrl: string;          // PDF download link or attachment

  // Metadata
  processedAt: string;         // ISO 8601
}
```

---

## HTML Structure Notes

### Balance Message Logic
```typescript
const balanceMessage =
  balanceStatus === 'paid'
    ? 'Your invoice is paid in full. Thank you!'
    : balanceStatus === 'partial'
    ? `Remaining balance: {newBalance}`
    : `Overpayment of {Math.abs(newBalance)} will be refunded or credited to your next invoice.`;
```

### Payment Confirmation Box
```html
<div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
  <p style="color: #047857; font-weight: 600; margin: 0 0 10px 0;">
    ✓ PAYMENT RECEIVED
  </p>
  <p style="font-size: 24px; font-weight: 700; color: #192a51; margin: 0 0 10px 0;">
    {amountPaid}
  </p>
  <p style="color: #6b6b6b; margin: 0;">
    {paymentMethod} • {paymentDate}
  </p>
</div>
```

---

## Plain Text Version

```
[LES] PAYMENT RECEIVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Payment Received — Thank You

Receipt #: {receiptNumber}
Invoice #: {invoiceNumber}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear {clientName},

We've received your payment of {amountPaid} for "{projectTitle}".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT DETAILS

Amount Paid: {amountPaid}
Payment Method: {paymentMethod}
Date: {paymentDate}

Download receipt: {receiptUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BALANCE

{balanceMessage}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THANK YOU

We appreciate your business and the opportunity to support
your academic work. If you have future editing needs, we'd
be honored to work with you again.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
Litecky Editing Services

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Payment processed: {processedDate}
```

---

## Implementation Notes

### Receipt PDF Attachment

**Option A**: Attach PDF to email
```typescript
attachments: [{
  content: receiptPdfBase64,
  filename: `Receipt_{receiptNumber}.pdf`,
  type: 'application/pdf',
  disposition: 'attachment'
}]
```

**Option B**: Link to hosted PDF
```typescript
receiptUrl: `https://liteckyeditingservices.com/receipts/{receiptId}.pdf`
```

Recommendation: **Option B** (link) to keep email size small and deliverability high.

### Stripe Integration

Stripe automatically sends payment confirmations. Options:
1. **Disable Stripe email**, use this template (full brand control)
2. **Keep Stripe email**, skip this template (less work, Stripe handles receipts)
3. **Both** (redundant, not recommended)

### QuickBooks Integration

If using QuickBooks:
- Listen for `Payment.Create` webhook
- Generate/fetch receipt PDF via QuickBooks API
- Send this email with receipt link

---

## Related Files

- Implementation: `src/lib/email.ts` - `createPaymentReceived()`
- Webhook handler: `functions/api/quickbooks/webhook.ts` or `functions/api/stripe/webhook.ts`
- Receipt generation: QuickBooks API or custom PDF generator
