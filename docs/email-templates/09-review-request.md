# Email Template: Review/Testimonial Request

**Template ID**: `createReviewRequest()`
**Trigger**: 1-2 weeks after final delivery (cron job checks project status)
**Sent To**: Client
**Category**: `['project']`
**List-Id**: `les-projects.liteckyeditingservices.com`

---

## Subject Line

```
[LES] How did we do?
```

---

## Preheader

```
Your feedback helps us serve graduate students better.
```

---

## Email Body (Prose Version)

### Header
**"Share Your Experience?"**

### Main Content

Dear {clientName},

A few weeks ago, we completed editing for **"{projectTitle}"**. We hope the process went smoothly and that your work is progressing well.

### We'd Value Your Feedback

Your experience helps us improve our service for graduate students and academic researchers. Would you share a brief review?

[Leave a Review](#)
*(Takes 2 minutes)*

### What We'd Love to Know

- How was the editing quality and clarity of feedback?
- Did the Track Changes approach work well for you?
- Would you recommend us to colleagues?

### Optional: Public Testimonial

If you're comfortable, we'd be honored to feature your feedback (first name + discipline only) on our website. You can indicate your preference when you submit.

### No Pressure

If now isn't a good time, we completely understand. Either way, thank you for trusting us with your work.

---

Best regards,
**Litecky Editing Services**

---

*Project ID: {projectId} • Completed: {completedDate}*

---

## Data Contract

```typescript
interface ReviewRequestData {
  // Client info
  clientName: string;
  clientEmail: string;

  // Project details
  projectId: string;
  projectTitle: string;
  service: string;

  // Timeline
  completedDate: string;       // "October 20, 2025"
  daysSinceCompletion: number; // 14

  // Review links
  reviewUrl: string;           // Could be Google Form, Typeform, or custom page

  // Metadata
  sentAt: string;              // ISO 8601
}
```

---

## Plain Text Version

```
[LES] HOW DID WE DO?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Share Your Experience?

Project ID: {projectId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear {clientName},

A few weeks ago, we completed editing for "{projectTitle}".
We hope the process went smoothly and your work is progressing well.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WE'D VALUE YOUR FEEDBACK

Your experience helps us improve service for graduate students
and academic researchers. Would you share a brief review?

{reviewUrl}
(Takes 2 minutes)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT WE'D LOVE TO KNOW

• How was the editing quality and clarity of feedback?
• Did the Track Changes approach work well?
• Would you recommend us to colleagues?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPTIONAL: PUBLIC TESTIMONIAL

If comfortable, we'd be honored to feature your feedback
(first name + discipline only) on our website. You can
indicate your preference when you submit.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NO PRESSURE

If now isn't a good time, we completely understand.
Either way, thank you for trusting us with your work.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
Litecky Editing Services

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project completed: {completedDate}
```

---

## Implementation Notes

### Timing

Send **14 days** after project marked "Complete". This gives clients time to:
- Review the edits thoroughly
- Use the document (submit, present, etc.)
- Form an opinion on the outcome

### Opt-Out

Include unsubscribe option for clients who don't want follow-up emails. Respect CAN-SPAM and similar regulations.

### Review Platform Options

- **Google Form**: Simple, free, exports to Sheets
- **Typeform**: Better UX, can embed rating widgets
- **Custom page**: `liteckyeditingservices.com/review/{projectId}` with pre-filled data

---

## Related Files

- Implementation: `src/lib/email.ts` - `createReviewRequest()`
- Review page: `src/pages/review/[projectId].astro` (if custom)
- Cron trigger: Weekly check for projects completed 14 days ago
