# Email Template: Delivery Ready

**Template ID**: `createDeliveryReady()`
**Trigger**: When edited files posted to Google Drive
**Sent To**: Client
**Category**: `['project']`
**List-Id**: `les-projects.liteckyeditingservices.com`

---

## Subject Line

```
[LES] Delivery ready — {Project Title}
```

**Example**: `[LES] Delivery ready — Dissertation Methods Chapter`

---

## Preheader

```
Your edited document is in your project folder. Review by {revisionDeadline}.
```

---

## Email Body (Prose Version)

### Header
**"Your Editing is Complete"**

### ID Badge
**Project ID**: {projectId}

### Main Content

Dear {clientName},

Your edited document **"{documentName}"** is ready for review.

### Access Your Edited Files

[Open Project Folder](#)

### What You'll Find

- **{documentName} (Edited)** - Your document with Track Changes showing all edits
- **Summary of Changes** - Overview of major edits and patterns we addressed
- **Clean Version** - Accepted changes for final submission (optional)

### Review Your Edits

Take your time reviewing the Track Changes and comments. Each edit includes an explanation of:

- Grammar and style improvements
- Clarity and flow enhancements
- Discipline-specific conventions

### Revision Window

**Request revisions by**: {revisionDeadline}

If anything needs clarification or adjustment, reply to this email with specific passages. We'll address your questions within 24 business hours.

### After the Revision Window

The clean version (with all changes accepted) becomes your final document. You're free to use it for submission or publication.

---

Best regards,
**{editorName}**
Litecky Editing Services

---

*Delivered: {deliveryDate}*

---

## Data Contract

```typescript
interface DeliveryReadyData {
  // Client info
  clientName: string;
  clientEmail: string;

  // Project details
  projectId: string;
  projectTitle: string;
  documentName: string;        // "Chen_Methods_Chapter3.docx"

  // Drive folder
  folderUrl: string;

  // Files delivered
  editedFileName: string;      // "Chen_Methods_Chapter3_EDITED.docx"
  summaryFileName: string;     // "Summary_of_Changes.pdf"
  cleanFileName?: string;      // Optional clean version

  // Timeline
  deliveryDate: string;        // "November 4, 2025"
  revisionDeadline: string;    // "November 11, 2025"

  // Assignment
  editorName: string;

  // Metadata
  deliveredAt: string;         // ISO 8601
}
```

---

## Plain Text Version

```
[LES] DELIVERY READY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Editing is Complete

Project ID: {projectId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear {clientName},

Your edited document "{documentName}" is ready for review.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACCESS YOUR EDITED FILES

{folderUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT YOU'LL FIND

• {documentName} (Edited) - Track Changes showing all edits
• Summary of Changes - Overview of major patterns addressed
• Clean Version - Accepted changes for final submission

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REVIEW YOUR EDITS

Take your time reviewing Track Changes and comments. Each edit
includes explanation of:

• Grammar and style improvements
• Clarity and flow enhancements
• Discipline-specific conventions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REVISION WINDOW

Request revisions by: {revisionDeadline}

If anything needs clarification, reply with specific passages.
We'll respond within 24 business hours.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
{editorName}
Litecky Editing Services

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Delivered: {deliveryDate}
```

---

## Related Files

- Implementation: `src/lib/email.ts` - `createDeliveryReady()`
- Trigger: Drive file watcher or manual upload notification
