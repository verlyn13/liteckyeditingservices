# Email System Implementation Roadmap

**Created**: 2025-10-14
**Status**: Planning Phase
**Goal**: Unified, scholarly minimalist email system across all touchpoints

---

## Overview

This roadmap implements a complete email system that unifies SendGrid, Cal.com, and Gmail into one consistent "scholarly minimalist" experience. All 11 customer-facing email templates use identical design tokens, voice, and structure.

---

## Phase 1: Foundation (Week 1) — ✅ Complete

### 1.1 Update Existing Templates
**Goal**: Align current templates with new design system

**Tasks**:
- [x] Update `createAdminNotification()` colors to match site (`#192a51` navy)
- [x] Update `createUserConfirmation()` colors to match site
- [x] Test existing templates render correctly after color updates
- [x] Add List-Id headers in contact sends (API + Queue)

**Files to Modify**:
- `src/lib/email.ts` (lines 305-477)
- `functions/api/contact.ts` (add List-Id)

**Testing**:
```bash
pnpm test:sendgrid  # Send test emails
# Verify in Gmail, Outlook, Apple Mail
```

### 1.2 Add Email Infrastructure Enhancements
**Goal**: List-Id, categories, quiet hours support

**Tasks**:
- [x] Add List-Id header support to `sendEmail()` function
- [x] Add `categories` parameter to `EmailMessage` interface (already exists)
- [x] Implement quiet hours helper (`shouldQueueForQuietHours()`) — flagging only
- [x] Implement Alaska timezone date/time formatter helper

**New Files**:
```typescript
// src/lib/email-helpers.ts
export function shouldQueueForQuietHours(now: Date, timezone: string): boolean;
export function formatAKT(isoDate: string): { day: string; date: string; time: string };
export function getListId(category: string): string;
```

**List-Id Mapping**:
```typescript
const LIST_IDS = {
  booking: 'les-bookings.liteckyeditingservices.com',
  project: 'les-projects.liteckyeditingservices.com',
  billing: 'les-billing.liteckyeditingservices.com',
  intake: 'les-projects.liteckyeditingservices.com', // Same as project
};
```

---

## Phase 2: Cal.com Integration (Week 2)

### 2.1 Implement Booking Email Templates
**Goal**: Add 3 Cal.com templates to `src/lib/email.ts`

**Tasks**:
- [ ] Implement `createBookingConfirmation()` - See `docs/email-templates/01-booking-confirmation.md`
- [ ] Implement `createBookingRescheduled()` - See `docs/email-templates/02-booking-rescheduled.md`
- [ ] Implement `createBookingCancelled()` - See `docs/email-templates/03-booking-cancelled.md`
- [ ] Create shared button component helper for consistency
- [ ] Test all 3 templates in email clients

**Button Helper** (add to `src/lib/email.ts`):
```typescript
function renderButton(text: string, url: string): string {
  return `
    <a href="${url}"
       style="display: inline-block; padding: 12px 32px; background-color: #5a716a;
              color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;
              min-height: 44px; line-height: 20px;">
      ${text}
    </a>
  `;
}
```

### 2.2 Create Cal.com Webhook Handler
**Goal**: Receive Cal.com events, trigger SendGrid emails

**Tasks**:
- [ ] Create `functions/api/cal/webhook.ts`
- [ ] Implement HMAC signature verification
- [ ] Map Cal.com payload to template data contracts
- [ ] Handle `booking.created`, `booking.rescheduled`, `booking.cancelled`
- [ ] Queue emails via Cloudflare Queue (or send directly)
- [ ] Add error handling and Sentry logging

**Implementation**:
```typescript
// functions/api/cal/webhook.ts
import type { PagesFunction } from '@astrojs/cloudflare';
import { createBookingConfirmation, createBookingRescheduled, createBookingCancelled } from '@/lib/email';
import { sendEmail } from '@/lib/email';

interface Env {
  CALCOM_WEBHOOK_SECRET: string;
  SEND_EMAIL: Queue;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }): Promise<Response> => {
  // 1. Verify signature
  const signature = request.headers.get('X-Cal-Signature-256');
  const body = await request.text();

  // ... signature verification logic

  // 2. Parse payload
  const payload = JSON.parse(body);

  // 3. Route to correct template
  switch (payload.triggerEvent) {
    case 'BOOKING_CREATED':
      const confirmationEmail = createBookingConfirmation({/* map data */});
      await sendEmail({
        to: payload.payload.attendees[0].email,
        from: 'hello@liteckyeditingservices.com',
        subject: `[LES] Booking confirmed — ...`,
        text: confirmationEmail.text,
        html: confirmationEmail.html,
        categories: ['booking'],
      }, {
        listId: 'les-bookings.liteckyeditingservices.com'
      });
      break;
    // ... other cases
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};
```

### 2.3 Create Post-Booking Upload Page
**Goal**: Allow file uploads after booking

**Tasks**:
- [ ] Create `src/pages/upload/[bookingId].astro`
- [ ] Verify booking ID via Cal.com API
- [ ] Integrate `FileUpload.svelte` component
- [ ] Store uploaded files in R2 bucket
- [ ] Link files to booking ID in D1 database (optional)

---

## Phase 3: Project Flow Templates (Week 3)

### 3.1 Implement Project Email Templates
**Goal**: Add 5 project lifecycle templates

**Tasks**:
- [ ] Implement `createProjectStarted()` - See `docs/email-templates/06-project-started.md`
- [ ] Implement `createDeliveryReady()` - See `docs/email-templates/07-delivery-ready.md`
- [ ] Implement `createRevisionReminder()` - See `docs/email-templates/08-revision-reminder.md`
- [ ] Implement `createReviewRequest()` - See `docs/email-templates/09-review-request.md`
- [ ] Test all templates

### 3.2 Create Automated Triggers
**Goal**: Cron jobs and Drive watchers for project emails

**Tasks**:
- [ ] Create Cloudflare Worker cron for revision reminders (check daily at 8am AKT)
- [ ] Create Cloudflare Worker cron for review requests (check weekly)
- [ ] Implement Drive folder watcher or manual trigger for delivery emails
- [ ] Implement quiet hours respect (queue if outside 8am-8pm AKT)

**Cron Configuration** (wrangler.toml):
```toml
[triggers]
crons = [
  "0 8 * * * America/Anchorage",  # 8am AKT daily - revision reminders
  "0 8 * * 1 America/Anchorage"   # 8am AKT Monday - review requests
]
```

---

## Phase 4: Billing Templates (Week 4)

### 4.1 Implement Billing Email Templates
**Goal**: Add 2 billing templates

**Tasks**:
- [ ] Implement `createInvoiceIssued()` - See `docs/email-templates/10-invoice-issued.md`
- [ ] Implement `createPaymentReceived()` - See `docs/email-templates/11-payment-received.md`
- [ ] Test with sample invoice/payment data

### 4.2 Integrate with Billing System
**Goal**: Connect QuickBooks or Stripe webhooks

**Tasks**:
- [ ] **If using QuickBooks**: Create `functions/api/quickbooks/webhook.ts`
- [ ] **If using Stripe**: Create `functions/api/stripe/webhook.ts`
- [ ] Verify webhook signatures
- [ ] Map billing system data to email templates
- [ ] Handle invoice creation → send email
- [ ] Handle payment received → send email

**Decision Point**: Stripe vs QuickBooks vs Custom
- **Stripe**: Use Stripe's hosted invoices + payment (less work, but less brand control)
- **QuickBooks**: Keep separate billing system, send custom branded emails (more work, more control)
- **Custom**: Build payment flow on site (most work, most control)

---

## Phase 5: Testing & Refinement (Week 5)

### 5.1 Comprehensive Email Testing

**Email Client Matrix**:
- [ ] Gmail (web) - Chrome, Safari
- [ ] Gmail (mobile) - iOS, Android
- [ ] Outlook (web)
- [ ] Outlook (desktop) - Windows, Mac
- [ ] Apple Mail (macOS)
- [ ] Apple Mail (iOS)
- [ ] Thunderbird

**Test Checklist Per Template**:
- [ ] Subject line renders correctly
- [ ] Preheader shows
- [ ] Colors match design system
- [ ] Buttons have 44px min-height
- [ ] Links work (not broken)
- [ ] Plain text version includes all info
- [ ] No CSP violations (if applicable)
- [ ] Contrast meets WCAG AA

### 5.2 Accessibility Audit

**Tasks**:
- [ ] Run axe DevTools on HTML email previews
- [ ] Verify color contrast ratios (WCAG AA minimum)
- [ ] Test with screen reader (VoiceOver on macOS)
- [ ] Confirm semantic HTML structure
- [ ] Verify alt text on images (if any)

### 5.3 Deliverability Testing

**Tasks**:
- [ ] Test SPF, DKIM, DMARC alignment
- [ ] Send to Mail Tester (mail-tester.com) - aim for 10/10 score
- [ ] Check spam scores (SpamAssassin, etc.)
- [ ] Verify List-Unsubscribe headers work (if applicable)
- [ ] Test "Report Spam" handling

---

## Phase 6: Documentation & Training (Week 6)

### 6.1 Gmail Filter Setup

**Tasks**:
- [ ] Create Gmail filters for List-Id routing
- [ ] Document filter rules in `docs/email-templates/GMAIL-FILTERS.md`
- [ ] Test filters with sample emails

**Filter Examples**:
```
Filter 1:
  Match: listid:les-bookings.liteckyeditingservices.com
  Action: Apply label "Stage/Scheduled", Never send to Spam

Filter 2:
  Match: listid:les-projects.liteckyeditingservices.com
  Action: Apply label "Stage/Active", Star, Never send to Spam

Filter 3:
  Match: listid:les-billing.liteckyeditingservices.com
  Action: Apply label "Stage/Invoice", Never send to Spam
```

### 6.2 Update Documentation

**Tasks**:
- [ ] Update `docs/EMAIL-TEMPLATES.md` with new system overview
- [ ] Create `docs/email-templates/EDITING-GUIDE.md` (how to edit templates)
- [ ] Create `docs/email-templates/TESTING-GUIDE.md` (how to test emails)
- [ ] Update `ENVIRONMENT.md` with new email env vars (List-Id, categories)
- [ ] Update `SECRETS.md` with Cal.com secrets rotation procedures

### 6.3 Admin Training

**Tasks**:
- [ ] Document how to trigger each email type manually (if needed)
- [ ] Create troubleshooting guide for common email issues
- [ ] Document how to view email logs in SendGrid dashboard
- [ ] Create Gmail Template parity guide (quick manual sends)

---

## Phase 7: Deployment & Monitoring (Week 7)

### 7.1 Staged Rollout

**Stage 1: Preview Environment**
- [ ] Deploy all email templates to preview
- [ ] Test Cal.com webhook with test bookings
- [ ] Send test emails for all 11 templates
- [ ] Verify Sentry error tracking works

**Stage 2: Production (Soft Launch)**
- [ ] Deploy to production
- [ ] Monitor first 10 emails of each type
- [ ] Check SendGrid activity logs
- [ ] Verify no spam reports

**Stage 3: Full Launch**
- [ ] Enable all automated triggers (cron jobs)
- [ ] Monitor for 7 days
- [ ] Collect user feedback

### 7.2 Monitoring Setup

**Tasks**:
- [ ] Create Sentry dashboard for email errors
- [ ] Set up SendGrid webhook for bounce/spam notifications
- [ ] Create weekly email health report (delivery rate, open rate, bounce rate)
- [ ] Set up alerts for email failures (> 5% bounce rate)

**Metrics to Track**:
- Delivery rate (target: >99%)
- Bounce rate (target: <2%)
- Spam complaints (target: <0.1%)
- Open rate (informational only)
- Click rate (for buttons/links)

---

## Success Criteria

### Technical Metrics
- ✅ All 11 templates implemented
- ✅ 100% email client compatibility (Gmail, Outlook, Apple Mail)
- ✅ >99% delivery rate
- ✅ <2% bounce rate
- ✅ WCAG AA color contrast compliance
- ✅ 44px minimum button height (accessibility)

### Business Metrics
- ✅ Zero customer confusion about email source
- ✅ Consistent brand experience across all touchpoints
- ✅ Reduced admin time (automated triggers working)
- ✅ Positive user feedback on email clarity

### Code Quality Metrics
- ✅ All templates type-safe (TypeScript)
- ✅ 100% test coverage for email rendering
- ✅ Visual regression tests pass
- ✅ No Sentry errors related to email sending

---

## Rollback Plan

If critical issues arise:

1. **Cal.com emails failing**: Temporarily disable webhook, let Cal.com send default emails
2. **Template rendering broken**: Revert to previous template version in git
3. **Deliverability drop**: Roll back SPF/DKIM changes, investigate with SendGrid support
4. **Major bug**: Feature flag to disable new templates, fall back to simple text emails

---

## Files Created in This Planning Phase

```
docs/email-templates/
├── 00-TEMPLATE-TAXONOMY.md          ✅ Design system and template overview
├── 01-booking-confirmation.md       ✅ Cal.com booking created
├── 02-booking-rescheduled.md        ✅ Cal.com booking rescheduled
├── 03-booking-cancelled.md          ✅ Cal.com booking cancelled
├── 04-admin-notification.md         ✅ Contact form (admin copy)
├── 05-user-confirmation.md          ✅ Contact form (client copy)
├── 06-project-started.md            ✅ Drive folder provisioned
├── 07-delivery-ready.md             ✅ Edits delivered
├── 08-revision-reminder.md          ✅ Revision window closing
├── 09-review-request.md             ✅ Post-project feedback
├── 10-invoice-issued.md             ✅ Invoice created
├── 11-payment-received.md           ✅ Payment posted
└── IMPLEMENTATION-ROADMAP.md        ✅ This file
```

---

## Next Steps

1. **Review markdown templates** with stakeholders (you)
2. **Approve design system** and color choices
3. **Begin Phase 1** (update existing templates)
4. **Prioritize phases** based on immediate needs:
   - **If Cal.com integration is urgent**: Start Phase 2 first
   - **If project flow is more important**: Start Phase 3 first
   - **If everything is equal**: Follow phases 1→2→3→4 in order

---

## Questions to Resolve Before Implementation

1. **Cal.com Configuration**:
   - Use Cal.com cloud or self-host?
   - Disable Cal.com default emails in favor of custom templates?
   - What event types to create (30-min consultation, 60-min consultation, etc.)?

2. **File Upload Flow**:
   - Post-booking upload link vs keep separate contact form?
   - R2 bucket structure: `/bookings/{bookingId}/` or `/projects/{projectId}/`?

3. **Billing System**:
   - Stripe hosted invoices vs QuickBooks vs custom?
   - Attach PDF receipt to email or link to hosted receipt?

4. **Editor Assignment**:
   - Personalize emails with actual editor name ("Best regards, Sarah") or generic ("The Team")?

5. **Timezone Handling**:
   - Display all times in client's timezone or Alaska timezone (AKT)?
   - Cal.com handles this automatically - do we need server-side conversion?

---

**Status**: Ready for review and implementation. All markdown documentation is complete.
