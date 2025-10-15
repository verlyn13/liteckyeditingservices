# Email Templates Documentation

**Design System**: Scholarly Minimalist
**Status**: Planning Complete, Ready for Implementation
**Created**: 2025-10-14

---

## Quick Start

This directory contains **human-readable markdown versions** of all 11 email templates for Litecky Editing Services. Each template documents structure, copy, design tokens, data contracts, and implementation notes before code is written.

### Why Markdown First?

1. **Review wording and structure** without wrestling with HTML/CSS
2. **Stakeholder approval** before investing in code
3. **Single source of truth** for copy and design decisions
4. **Future reference** when editing templates

---

## Complete Template Set

### Scheduling (Cal.com Integration)
| # | Template | File | Status |
|---|----------|------|--------|
| 1 | Booking Confirmation | [01-booking-confirmation.md](01-booking-confirmation.md) | 📝 Documented |
| 2 | Booking Rescheduled | [02-booking-rescheduled.md](02-booking-rescheduled.md) | 📝 Documented |
| 3 | Booking Cancelled | [03-booking-cancelled.md](03-booking-cancelled.md) | 📝 Documented |

### Intake & Project Flow
| # | Template | File | Status |
|---|----------|------|--------|
| 4 | Admin Notification | [04-admin-notification.md](04-admin-notification.md) | ✅ Implemented |
| 5 | User Confirmation | [05-user-confirmation.md](05-user-confirmation.md) | ✅ Implemented |
| 6 | Project Started | [06-project-started.md](06-project-started.md) | 📝 Documented |
| 7 | Delivery Ready | [07-delivery-ready.md](07-delivery-ready.md) | 📝 Documented |
| 8 | Revision Reminder | [08-revision-reminder.md](08-revision-reminder.md) | 📝 Documented |

### Post-Project
| # | Template | File | Status |
|---|----------|------|--------|
| 9 | Review Request | [09-review-request.md](09-review-request.md) | 📝 Documented |

### Billing
| # | Template | File | Status |
|---|----------|------|--------|
| 10 | Invoice Issued | [10-invoice-issued.md](10-invoice-issued.md) | 📝 Documented |
| 11 | Payment Received | [11-payment-received.md](11-payment-received.md) | 📝 Documented |

**Legend**: ✅ Implemented | 📝 Documented | 🚧 In Progress | ❌ Not Started

---

## Design System at a Glance

### Colors (Email-Safe)
```css
Primary Navy:    #192a51  /* Headers, headings, links */
Accent Sage:     #5a716a  /* Buttons, accents */
Light Sage:      #87a96b  /* Hover states */
Off-White:       #f7f7f5  /* Backgrounds */
Text Primary:    #2c2c2c  /* Body text */
Warning:         #f59e0b  /* ID badges */
Success:         #10b981  /* Confirmations */
```

### Typography
- **Headings**: Lora (serif)
- **Body**: Inter (sans-serif)
- **Base size**: 16px
- **Line height**: 1.6

### Layout
- **Max width**: 600px
- **Padding**: 20-30px
- **Border radius**: 8px
- **Button min-height**: 44px (WCAG AA)

### Subject Line Format
```
[LES] {Action/Event} — {Specific Detail}
```

---

## File Structure

```
docs/email-templates/
├── README.md                         ← You are here
├── 00-TEMPLATE-TAXONOMY.md           ← Overview and design system
├── IMPLEMENTATION-ROADMAP.md         ← 7-week implementation plan
├── 01-booking-confirmation.md        ← Cal.com booking created
├── 02-booking-rescheduled.md         ← Cal.com booking rescheduled
├── 03-booking-cancelled.md           ← Cal.com booking cancelled
├── 04-admin-notification.md          ← Contact form (admin)
├── 05-user-confirmation.md           ← Contact form (client)
├── 06-project-started.md             ← Drive folder ready
├── 07-delivery-ready.md              ← Edits delivered
├── 08-revision-reminder.md           ← Revision window closing
├── 09-review-request.md              ← Post-project feedback
├── 10-invoice-issued.md              ← Invoice created
└── 11-payment-received.md            ← Payment received
```

---

## Each Template Document Includes

1. **Metadata**: Template ID, trigger, recipient, category, List-Id
2. **Subject Line**: Format with example
3. **Preheader**: First line preview
4. **Email Body** (prose version): Human-readable content structure
5. **Data Contract**: TypeScript interface for template data
6. **HTML Structure Notes**: Key components and CSS patterns
7. **Plain Text Version**: Complete plain text alternative
8. **Testing Checklist**: Email client and accessibility tests
9. **Implementation Notes**: Integration details and considerations

---

## How to Use These Templates

### For Review/Approval
1. Read the prose version to understand copy and tone
2. Review data contract to ensure all needed info is available
3. Check testing checklist for quality standards
4. Approve before implementation begins

### For Implementation
1. Copy data contract interface to `src/lib/email.ts`
2. Implement HTML version using structure notes and design tokens
3. Implement plain text version (keep in sync with HTML)
4. Return `{ text, html }` object
5. Test against checklist

### For Editing (Future)
1. Open markdown file for template you want to change
2. Edit prose version AND update HTML/text sections
3. Update implementation in `src/lib/email.ts`
4. Re-test email clients
5. Commit changes (markdown + code together)

---

## Implementation Status

### Phase 1: Foundation ⏳
- Update existing template colors
- Add List-Id and categorization support
- Implement quiet hours helper
- **Target**: Week 1

### Phase 2: Cal.com Integration ⏳
- Implement 3 booking templates
- Create webhook handler
- Build post-booking upload page
- **Target**: Week 2

### Phase 3: Project Flow ⏳
- Implement 4 project lifecycle templates
- Create cron jobs for reminders
- **Target**: Week 3

### Phase 4: Billing ⏳
- Implement 2 billing templates
- Integrate with QuickBooks/Stripe
- **Target**: Week 4

### Phase 5: Testing ⏳
- Email client compatibility testing
- Accessibility audit
- Deliverability testing
- **Target**: Week 5

### Phase 6: Documentation ⏳
- Gmail filters setup
- Update main EMAIL-TEMPLATES.md
- Admin training materials
- **Target**: Week 6

### Phase 7: Deployment ⏳
- Staged rollout (preview → production)
- Monitoring setup
- Performance tracking
- **Target**: Week 7

**Full roadmap**: See [IMPLEMENTATION-ROADMAP.md](IMPLEMENTATION-ROADMAP.md)

---

## Key Design Principles

### One Brain, One Voice
All customer-facing emails:
- Use same design system
- Share consistent tone (calm, competent, predictable)
- Answer "Where am I? What next?" in first paragraph

### Scholarly Minimalist
- Clarity over cleverness
- Specificity (dates, times, names)
- No marketing fluff
- Single primary CTA per email

### Accessibility First
- WCAG AA color contrast
- 44px minimum touch targets
- Semantic HTML
- Plain text parity

### Technical Standards
- Email-safe CSS (inline styles)
- 600px max width
- List-Id headers for Gmail routing
- Quiet hours respect (8am-8pm AKT)

---

## Questions or Issues?

1. **Template wording**: Edit the markdown file, then update implementation
2. **Design tokens**: See `00-TEMPLATE-TAXONOMY.md`
3. **Implementation details**: See `IMPLEMENTATION-ROADMAP.md`
4. **Current templates**: See `src/lib/email.ts` and `docs/EMAIL-TEMPLATES.md`

---

**Next Step**: Review all markdown templates, then proceed with Phase 1 implementation.
