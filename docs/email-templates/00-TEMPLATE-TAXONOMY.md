# Email Template Taxonomy

**Last Updated**: 2025-10-14
**Design System**: Scholarly Minimalist
**Brand Colors**: Navy (#192a51), Sage (#5a716a), Off-white (#f7f7f5)

---

## Philosophy: One Brain, One Voice

All customer-facing emails are:
- **Visually identical** - Same design system, colors, typography
- **Centrally versioned** - All templates in `src/lib/email.ts`
- **Dual format** - HTML + plain text versions (always in sync)
- **Predictable** - Answer "Where am I? What next?" in first paragraph

SendGrid sends all branded emails. Cal.com triggers via webhooks. Gmail is for admin triage only.

---

## Complete Template Set (11 Templates)

### A) Scheduling (Cal.com Integration)

1. **Booking Confirmation** - After Cal.com `booking.created` webhook
2. **Booking Rescheduled** - After `booking.rescheduled` webhook
3. **Booking Cancelled** - After `booking.cancelled` webhook

### B) Intake & Project Flow

4. **Admin Notification** ✅ *Already implemented*
5. **User Confirmation** ✅ *Already implemented*
6. **Project Started** - After Drive folder provisioned
7. **Delivery Ready** - When edited files posted to Drive
8. **Revision Reminder** - 48-72 hours before window closes

### C) Post-Project

9. **Review Request** - 1-2 weeks after final delivery

### D) Billing

10. **Invoice Issued** - When deposit/invoice created
11. **Payment Received** - After payment posted

---

## Design System Specification

### Colors (Email-Safe Hex)

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Navy | `#192a51` | Headers, headings, links, primary buttons |
| Accent Sage | `#5a716a` | Accents, hover states |
| Light Sage | `#87a96b` | Button hover backgrounds |
| Dark Navy | `#1e3a5f` | Link hover states |
| Off-White | `#f7f7f5` | Backgrounds, card fills |
| Soft Gray | `#e8e8e6` | Borders, dividers |
| Text Primary | `#2c2c2c` | Body text |
| Text Secondary | `#6b6b6b` | Metadata, timestamps |
| Warning | `#f59e0b` | ID badges, alerts |
| Success | `#10b981` | Confirmation indicators |
| Error | `#ef4444` | Error messages (rare) |

### Typography

```css
font-family: "Lora", Georgia, serif;  /* Headings */
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;  /* Body */
font-size: 16px;  /* Base size (use pixels for email compatibility) */
line-height: 1.6;  /* Readability */
```

### Layout Standards

- **Max width**: 600px (optimal for all email clients)
- **Padding**: 20-30px (mobile-safe minimum)
- **Border radius**: 8px (modern, not too round)
- **Button min-height**: 44px (accessible touch target)
- **Single column** (mobile-first)

### Subject Line Format

```
[LES] {Action/Event} — {Specific Detail}
```

**Examples**:
- `[LES] Booking confirmed — Tue Oct 28, 2:00 PM AKT`
- `[LES] Delivery ready — "Methods chapter" edits`
- `[LES] Revision window ends Friday`

### Email Structure Pattern

1. **Header** - Navy background, site name/logo, clear title
2. **ID Badge** - Warning yellow background, left border, prominent ID
3. **Content** - Single column, clear hierarchy, 3 bullets max
4. **Primary CTA** - One prominent button (sage green)
5. **Footer** - Muted, contact info, unsubscribe/preferences

---

## Technical Standards

### Headers & Categorization

```typescript
categories: ['booking'] | ['project'] | ['billing']
customArgs: { clientId, projectId, quoteId, bookingId, env }
headers: { 'List-Id': 'les-bookings.liteckyeditingservices.com' }
```

### From/Reply-To

- **From**: `hello@liteckyeditingservices.com`
- **Reply-To**: `hello@liteckyeditingservices.com`
- **Transactional**: `no-reply@em.liteckyeditingservices.com` (optional, for high-volume)

### Quiet Hours

- Non-urgent emails: Queue for 8am-8pm **America/Anchorage**
- Urgent (bookings): Send immediately

### Accessibility

- ✅ High contrast (WCAG AA minimum)
- ✅ Single column layout
- ✅ Semantic HTML (`<h1>`, `<p>`, `<button>`)
- ✅ Alt text for images (if any)
- ✅ Plain text version with all critical info

---

## Copy Tone Guidelines

**Voice**: Calm, competent, predictable. Scholarly without stuffiness.

**Structure**:
1. First sentence = outcome/status
2. Second paragraph = next steps (3 bullets max)
3. One primary CTA
4. Always include ID for reference

**Avoid**:
- Marketing fluff
- Exclamation points (except genuine congratulations)
- "Click here" (use descriptive links)
- Shortened URLs
- Multiple CTAs competing for attention

**Embrace**:
- Clarity over cleverness
- Specificity (dates, times, file names)
- Helpful context (what to expect next)
- Consistent terminology

---

## List-Id Routing (Gmail Filters)

| List-Id | Gmail Label | Auto-Action |
|---------|-------------|-------------|
| `les-bookings.liteckyeditingservices.com` | `Stage/Scheduled` | None |
| `les-projects.liteckyeditingservices.com` | `Stage/Active` | Star |
| `les-billing.liteckyeditingservices.com` | `Stage/Invoice` | None |

---

## Implementation Checklist

- [ ] Add 9 new template functions to `src/lib/email.ts`
- [ ] Create markdown documentation for each template
- [ ] Implement `/api/cal/webhook` endpoint
- [ ] Add List-Id headers to `sendEmail()` helper
- [ ] Implement quiet hours logic (AKT timezone)
- [ ] Test in Gmail, Outlook, Apple Mail
- [ ] Update visual regression baselines (if applicable)
- [ ] Document Gmail filter rules
- [ ] Create SendGrid suppression groups (if needed)

---

**Next**: See individual template markdown files for exact wording and structure.
