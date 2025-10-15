# Email Template: Revision Reminder

**Template ID**: `createRevisionReminder()`
**Trigger**: 48-72 hours before revision window closes (cron job)
**Sent To**: Client
**Category**: `['project']`
**List-Id**: `les-projects.liteckyeditingservices.com`

---

## Subject Line

```
[LES] Revision window ends {Day}
```

**Example**: `[LES] Revision window ends Friday`

---

## Preheader

```
Last chance for revisions on {projectTitle}.
```

---

## Email Body (Prose Version)

### Header
**"Revision Window Closing Soon"**

### ID Badge
**Project ID**: {projectId}

### Main Content

Dear {clientName},

The revision window for **"{projectTitle}"** closes **{dayName}, {revisionDeadline}**.

### Need Any Clarifications?

If you have questions about specific edits or need adjustments, reply to this email with:

- The passage or page number
- Your question or requested change
- Any additional context

We'll respond within 24 business hours.

### No Action Needed?

If the edits look good, no response is needed. After {revisionDeadline}, your clean version becomes final and you're free to use it for submission.

[Review Files in Folder](#)

---

Best regards,
**Litecky Editing Services**

---

*Revision window closes: {revisionDeadline}*

---

## Data Contract

```typescript
interface RevisionReminderData {
  // Client info
  clientName: string;
  clientEmail: string;

  // Project details
  projectId: string;
  projectTitle: string;

  // Drive folder
  folderUrl: string;

  // Timeline
  revisionDeadline: string;    // "November 11, 2025"
  dayName: string;             // "Friday"
  hoursRemaining: number;      // 48 or 72

  // Metadata
  sentAt: string;              // ISO 8601
}
```

---

## Plain Text Version

```
[LES] REVISION WINDOW CLOSING SOON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Revision Window Ends {Day}

Project ID: {projectId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear {clientName},

The revision window for "{projectTitle}" closes:

{dayName}, {revisionDeadline}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEED ANY CLARIFICATIONS?

Reply with:
• The passage or page number
• Your question or requested change
• Any additional context

Response time: 24 business hours

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NO ACTION NEEDED?

If edits look good, no response needed. After {revisionDeadline},
your clean version is final and ready for submission.

Review files: {folderUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
Litecky Editing Services

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Revision window closes: {revisionDeadline}
```

---

## Implementation Notes

### Cron Job Timing

Schedule to send **48-72 hours** before revision deadline:

- **48 hours**: If deadline is Monday-Thursday
- **72 hours**: If deadline is Friday-Sunday (to avoid weekend send)

### Quiet Hours

Respect Alaska timezone 8am-8pm. If cron fires outside hours, queue for next 8am.

---

## Related Files

- Implementation: `src/lib/email.ts` - `createRevisionReminder()`
- Cron trigger: Cloudflare Worker cron or scheduled function
