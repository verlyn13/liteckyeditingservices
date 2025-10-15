# Email Template: Project Started

**Template ID**: `createProjectStarted()`
**Trigger**: After Google Drive folder provisioned and project record created
**Sent To**: Client
**Category**: `['project']`
**List-Id**: `les-projects.liteckyeditingservices.com`

---

## Subject Line

```
[LES] Project started — {Project Title}
```

**Example**: `[LES] Project started — Dissertation Methods Chapter`

---

## Preheader

```
Your project folder is ready. Upload files to begin.
```

---

## Email Body (Prose Version)

### Header
**"Your Project Has Started"**

### ID Badges
**Project ID**: {projectId}
**Quote ID**: {quoteId} *(for reference)*

### Main Content

Dear {clientName},

Your editing project **"{projectTitle}"** is now active. We've created a dedicated Google Drive folder for secure file exchange.

### Access Your Project Folder

[Open Project Folder](#)

### What to Upload

Please upload the following to your project folder:

- **Main document** in Word format (.docx) with Track Changes enabled
- **Style guide** (if you have specific formatting requirements)
- **Any reference materials** that provide context

### File Naming

Use descriptive names: `LastName_Chapter3_Draft1.docx`

### Timeline

**Editing begins**: {startDate}
**Estimated delivery**: {estimatedDeliveryDate}
**Revision window ends**: {revisionDeadline}

### Track Changes & Comments

All edits will be made using Microsoft Word's Track Changes feature. Comments will explain our editorial decisions and suggest improvements.

### Questions During Editing?

Email us anytime at hello@liteckyeditingservices.com. We typically respond within 4 business hours.

---

Best regards,
**{editorName}**
Litecky Editing Services

---

*Project created: {createdDate}*

---

## Data Contract

```typescript
interface ProjectStartedData {
  // Client info
  clientName: string;
  clientEmail: string;

  // Project details
  projectId: string;           // "PRJ-2025-10-001"
  quoteId: string;             // Original quote ID for reference
  projectTitle: string;        // "Dissertation Methods Chapter"
  service: string;             // "Dissertation Editing"

  // Drive folder
  folderUrl: string;           // Google Drive shared folder link
  folderName: string;          // "LES_Chen_Methods_2025-10"

  // Timeline
  startDate: string;           // "October 28, 2025"
  estimatedDeliveryDate: string; // "November 4, 2025"
  revisionDeadline: string;    // "November 11, 2025"

  // Assignment
  editorName: string;          // "Sarah at Litecky Editing Services" or just "The Team"

  // Metadata
  createdAt: string;           // ISO 8601
}
```

---

## HTML Structure Notes

### Dual ID Badges
```html
<div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
  <p style="margin: 0 0 5px 0; font-weight: 600;">Project ID: {projectId}</p>
  <p style="margin: 0; font-size: 14px; color: #6b6b6b;">Quote ID: {quoteId}</p>
</div>
```

### Timeline Box
```html
<div style="background: #f7f7f5; padding: 20px; border-radius: 8px; margin: 20px 0;
            border-left: 4px solid #5a716a;">
  <h3 style="color: #192a51; margin: 0 0 15px 0;">Timeline</h3>
  <p style="margin: 0 0 10px 0;">
    <strong>Editing begins:</strong> {startDate}
  </p>
  <p style="margin: 0 0 10px 0;">
    <strong>Estimated delivery:</strong> {estimatedDeliveryDate}
  </p>
  <p style="margin: 0;">
    <strong>Revision window ends:</strong> {revisionDeadline}
  </p>
</div>
```

### Primary Button (Open Folder)
```html
<a href="{folderUrl}"
   style="display: inline-block; padding: 12px 32px; background-color: #5a716a; color: #fff;
          text-decoration: none; border-radius: 6px; font-weight: 600; min-height: 44px;
          line-height: 20px;">
  Open Project Folder
</a>
```

---

## Plain Text Version

```
[LES] PROJECT STARTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Project Has Started

Project ID: {projectId}
Quote ID: {quoteId} (for reference)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear {clientName},

Your editing project "{projectTitle}" is now active.
We've created a dedicated Google Drive folder for secure file exchange.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACCESS YOUR PROJECT FOLDER

{folderUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT TO UPLOAD

Please upload the following:

• Main document in Word format (.docx) with Track Changes
• Style guide (if you have specific requirements)
• Any reference materials that provide context

FILE NAMING

Use descriptive names: LastName_Chapter3_Draft1.docx

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIMELINE

Editing begins: {startDate}
Estimated delivery: {estimatedDeliveryDate}
Revision window ends: {revisionDeadline}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRACK CHANGES & COMMENTS

All edits will be made using Microsoft Word's Track Changes.
Comments will explain our editorial decisions and suggest improvements.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUESTIONS DURING EDITING?

Email anytime: hello@liteckyeditingservices.com
Typical response time: 4 business hours

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
{editorName}
Litecky Editing Services

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project created: {createdDate}
```

---

## Testing Checklist

- [ ] Subject line includes project title
- [ ] Both project ID and quote ID displayed
- [ ] Folder link opens correctly in Drive
- [ ] Timeline dates formatted consistently
- [ ] Editor name personalized (or "The Team")
- [ ] Plain text version includes all essential info
- [ ] Color contrast meets WCAG AA

---

## Implementation Notes

### Drive Folder Auto-Provisioning

This email depends on a Drive folder being created first. Typical flow:

1. Admin approves quote → Creates project record in system
2. Automation provisions Google Drive folder via Drive API
3. Folder permissions set: client (edit), staff (edit)
4. `createProjectStarted()` email triggered with folder URL

### Timeline Calculation

- **Start date**: Typically "today" or next business day
- **Estimated delivery**: Based on word count / service type / turnaround tier
- **Revision window**: Delivery + 7 days (configurable)

---

## Related Files

- Implementation: `src/lib/email.ts` - `createProjectStarted()`
- Trigger: Likely a server-side script or manual admin action
- Drive API: Google Drive folder provisioning script
