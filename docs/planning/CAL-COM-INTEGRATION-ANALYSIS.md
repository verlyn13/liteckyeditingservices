# Cal.com Integration Analysis

**Project**: Litecky Editing Services Website
**Cal.com Profile**: https://cal.com/litecky-editing
**Date**: 2025-10-14 (Updated: 2025-10-16)
**Status**: Phase 1 Complete (Secrets Management) - Planning for Phases 2-8
**Purpose**: Comprehensive examination of Cal.com integration requirements across all system components

**Related Documentation**:
- **API Strategy**: [`docs/planning/CAL-COM-API.md`](./CAL-COM-API.md) - Configuration as Code blueprint, v2 API reference
- **Secrets Setup**: [`docs/planning/CAL-COM-SECRETS-SETUP.md`](./CAL-COM-SECRETS-SETUP.md) - Complete secrets management guide
- **Username Config**: [`docs/planning/CAL-COM-USERNAME.md`](./CAL-COM-USERNAME.md) - Profile configuration

---

## Executive Summary

### Integration Approach

**Recommended**: **Cal.com Inline Embed** (cloud-hosted) with optional React components for enhanced control.

**Rationale**:
- **Fastest Implementation**: Cal Atoms claim "hours not weeks" integration time
- **Minimal Infrastructure**: No need to self-host Cal.com (reduces maintenance burden)
- **API Flexibility**: Cal.com API v2 provides Bearer token authentication for backend integrations
- **Design Control**: Embeds are "white-label by design" with extensive CSS customization
- **Compliance Ready**: HIPAA, SOC2, GDPR compliant out of box (important for academic client data)

**Key Implementation Areas**:
1. Replace current contact form on `src/pages/contact.astro` with Cal.com inline embed
2. Update CSP headers in `public/_headers` to allowlist Cal.com domains
3. Add Cal.com API key to secrets management (gopass → Infisical → Cloudflare Pages)
4. Create custom CSS to match Tailwind v4 design tokens (navy primary, sage accent, Lora/Inter fonts)
5. Add webhook endpoint for booking confirmations (Cloudflare Pages Function)
6. Update visual regression tests to capture Cal.com embed screenshots
7. Optionally expose Cal.com event types in Decap CMS for non-technical editing

---

## 1. Frontend Integration

### 1.1 Contact Page Replacement

**Current**: `src/pages/contact.astro` (111 lines)
- Form-based quote request with:
  - Name, email, service dropdown, message textarea
  - Deadline date picker
  - File upload component (FileUpload.svelte)
  - Turnstile CAPTCHA
  - POST to `/api/contact` endpoint

**Proposed Changes**:
```astro
---
// src/pages/contact.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import { Icon } from 'astro-icon/components';

const calcomEmbedUrl = import.meta.env.PUBLIC_CALCOM_EMBED_URL; // e.g., https://cal.com/litecky-editing/consultation
---

<BaseLayout
  title="Schedule a Consultation"
  description="Book a time to discuss your editing needs with our academic editing experts."
>
  <main id="main" class="site-container py-section">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-serif font-bold text-primary-navy mb-4">
        Schedule Your Free Consultation
      </h1>
      <p class="text-lg text-gray-700 max-w-2xl mx-auto">
        Choose a convenient time to discuss your project requirements and receive a personalized quote.
      </p>
    </div>

    <!-- Cal.com Inline Embed -->
    <div
      class="cal-inline-embed max-w-3xl mx-auto"
      data-cal-link={calcomEmbedUrl}
      data-cal-config='{"theme":"light","styles":{"branding":{"brandColor":"#192a51"}}}'
    ></div>

    <!-- Embed Script -->
    <script is:inline>
      (function (C, A, L) {
        let p = function (a, ar) { a.q.push(ar); };
        let d = C.document;
        C.Cal = C.Cal || function () {
          let cal = C.Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () { p(api, arguments); };
            const namespace = ar[1];
            api.q = api.q || [];
            typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar);
            return;
          }
          p(cal, ar);
        };
      })(window, "https://app.cal.com/embed/embed.js", "init");
      Cal("init", {origin:"https://cal.com"});
      Cal("inline", {
        elementOrSelector:".cal-inline-embed",
        calLink: document.querySelector('.cal-inline-embed').dataset.calLink
      });
    </script>
  </main>
</BaseLayout>
```

**Key Decisions**:
- **Inline embed** (not popup/floating button) for primary booking flow
- **Embedded script** loads from `https://app.cal.com/embed/embed.js`
- **Brand color** set to `#192a51` (primary-navy) for consistency
- **File upload**: Consider custom pre-booking form field or post-booking email attachment flow

**Alternative**: Use React component if more control needed:
```tsx
import Cal, { getCalApi } from "@calcom/embed-react";

<Cal
  calLink="litecky-editing/consultation"
  config={{
    theme: 'light',
    styles: {
      branding: { brandColor: '#192a51' }
    }
  }}
/>
```

### 1.2 Layout Modifications

**Current**: `src/layouts/BaseLayout.astro` (85 lines)
- No Cal.com script references
- Sentry integration in head
- Menu toggle script deferred

**Proposed Changes**:
- **Option A**: Load Cal.com script in `<head>` for global availability (if multiple pages need booking)
- **Option B**: Load inline on contact page only (current recommendation - fewer dependencies)

**No changes required to BaseLayout.astro** if using inline embed approach.

### 1.3 Navigation Updates

**Current**: Navigation likely links to `/contact`
**Proposed**: Update navigation text from "Contact" to "Schedule Consultation" or "Book Now"

**Location**: `src/components/Header.astro` (check navigation links)

---

## 2. Content Security Policy (CSP) & Security

### 2.1 CSP Directives Update

**Current**: `public/_headers` (line 20)
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' https://challenges.cloudflare.com https://browser.sentry-cdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://github.com https://www.githubstatus.com https://browser.sentry-cdn.com https://*.sentry.io; frame-src 'self' https://challenges.cloudflare.com; worker-src 'self' blob:; child-src 'self' blob:; form-action 'self' https://github.com; base-uri 'none'; frame-ancestors 'self'
```

**Required Changes**:
```diff
Content-Security-Policy:
  default-src 'self';
- script-src 'self' 'unsafe-eval' https://challenges.cloudflare.com https://browser.sentry-cdn.com;
+ script-src 'self' 'unsafe-eval' https://challenges.cloudflare.com https://browser.sentry-cdn.com https://app.cal.com https://cal.com;
- style-src 'self' 'unsafe-inline';
+ style-src 'self' 'unsafe-inline' https://app.cal.com https://cal.com;
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
- connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://github.com https://www.githubstatus.com https://browser.sentry-cdn.com https://*.sentry.io;
+ connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://github.com https://www.githubstatus.com https://browser.sentry-cdn.com https://*.sentry.io https://app.cal.com https://api.cal.com;
- frame-src 'self' https://challenges.cloudflare.com;
+ frame-src 'self' https://challenges.cloudflare.com https://app.cal.com https://cal.com;
  worker-src 'self' blob:;
  child-src 'self' blob:;
  form-action 'self' https://github.com;
  base-uri 'none';
  frame-ancestors 'self'
```

**Domains to Allowlist**:
- `https://app.cal.com` - Embed script and iframe source
- `https://cal.com` - Main Cal.com domain
- `https://api.cal.com` - API calls from embed

**Testing**: Verify no CSP violations in browser console after integration.

### 2.2 Security Considerations

**Current Security Controls**:
- Turnstile CAPTCHA on contact form
- CSP enforcement
- HSTS, X-Frame-Options, X-Content-Type-Options headers

**Cal.com Security**:
- **Spam Protection**: Cal.com has built-in spam prevention (no Turnstile needed on booking flow)
- **Data Privacy**: Booking data stored on Cal.com servers (GDPR/HIPAA compliant)
- **API Key Security**: Cal.com API key must be server-side only (never expose in client-side code)

**Risk Mitigation**:
- Cal.com is a trusted third-party service (SOC2 Type II certified)
- Embed loads in iframe (sandboxed execution context)
- No client-side Cal.com API key exposure (API calls from Cloudflare Pages Functions only)

---

## 3. Backend Infrastructure

### 3.1 Current Contact Flow

**Implementation**: `functions/api/contact.ts` (102 lines)
- Accepts POST with name, email, service, message
- Validates Turnstile token
- Enqueues email via Cloudflare Queue (`env.SEND_EMAIL`)
- Fallback to direct SendGrid send if queue unavailable
- Returns 202 Accepted (enqueued) or 200 OK (sent)

**Current Data Flow**:
```
User fills form → POST /api/contact → Validate Turnstile → Enqueue to Cloudflare Queue
→ Queue consumer sends email via SendGrid → Email arrives at SENDGRID_TO address
```

### 3.2 Cal.com Webhook Integration

**Purpose**: Receive booking confirmations, cancellations, rescheduling events from Cal.com.

**New Endpoint**: `functions/api/calcom-webhook.ts`

**Implementation Outline**:
```typescript
// functions/api/calcom-webhook.ts
import type { PagesFunction } from '@astrojs/cloudflare';
import { json } from '@/lib/json';

interface Env {
  CALCOM_WEBHOOK_SECRET: string;
  SEND_EMAIL: Queue;
  SENDGRID_API_KEY: string;
  SENDGRID_FROM: string;
  SENDGRID_TO: string;
}

interface CalcomWebhookPayload {
  triggerEvent: 'BOOKING_CREATED' | 'BOOKING_RESCHEDULED' | 'BOOKING_CANCELLED';
  payload: {
    uid: string;
    title: string;
    startTime: string;
    endTime: string;
    attendees: Array<{
      name: string;
      email: string;
      timeZone: string;
    }>;
    metadata: Record<string, unknown>;
  };
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }): Promise<Response> => {
  // 1. Verify webhook signature (Cal.com uses HMAC SHA256)
  const signature = request.headers.get('X-Cal-Signature-256');
  const body = await request.text();

  const expectedSignature = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${env.CALCOM_WEBHOOK_SECRET}.${body}`)
  );

  if (signature !== btoa(String.fromCharCode(...new Uint8Array(expectedSignature)))) {
    return json({ error: 'Invalid signature' }, 401);
  }

  // 2. Parse payload
  const payload: CalcomWebhookPayload = JSON.parse(body);

  // 3. Handle event
  switch (payload.triggerEvent) {
    case 'BOOKING_CREATED':
      // Send confirmation email via queue
      await env.SEND_EMAIL.send({
        kind: 'booking-confirmation',
        data: {
          bookingId: payload.payload.uid,
          attendeeName: payload.payload.attendees[0].name,
          attendeeEmail: payload.payload.attendees[0].email,
          startTime: payload.payload.startTime,
          endTime: payload.payload.endTime,
        },
      });
      break;

    case 'BOOKING_CANCELLED':
      // Send cancellation email
      await env.SEND_EMAIL.send({
        kind: 'booking-cancelled',
        data: { bookingId: payload.payload.uid },
      });
      break;

    case 'BOOKING_RESCHEDULED':
      // Send reschedule email
      await env.SEND_EMAIL.send({
        kind: 'booking-rescheduled',
        data: { bookingId: payload.payload.uid },
      });
      break;
  }

  return json({ received: true }, 200);
};
```

**Webhook URL**: `https://www.liteckyeditingservices.com/api/calcom-webhook` (www required; apex redirects)

**Configuration in Cal.com Dashboard**:
1. Go to Settings → Webhooks
2. Add webhook URL: `https://www.liteckyeditingservices.com/api/calcom-webhook`
3. Select events: Booking Created, Booking Rescheduled, Booking Cancelled
4. Copy webhook secret → store in secrets management

### 3.3 Queue Consumer Updates

**Current**: `workers/send-email-consumer.ts` (not read yet, but referenced in contact.ts)
- Processes `kind: 'contact'` messages
- Sends quote request emails via SendGrid

**Required Changes**:
Add handlers for new message kinds:
- `kind: 'booking-confirmation'` → Send confirmation email to client + internal notification
- `kind: 'booking-cancelled'` → Send cancellation email
- `kind: 'booking-rescheduled'` → Send reschedule notification

**SendGrid Template IDs**:
- Create new dynamic templates in SendGrid:
  - `d-xxxxx` - Booking confirmation template
  - `d-yyyyy` - Booking cancellation template
  - `d-zzzzz` - Booking rescheduled template

### 3.4 File Upload Consideration

**Current**: Contact form includes `FileUpload.svelte` component for attaching documents.

**Cal.com Limitation**: Cal.com booking forms do not natively support file uploads.

**Workaround Options**:

**Option A**: Pre-booking form (current contact form)
1. User fills out contact form with file upload
2. Form submission creates record in D1 database with file stored in R2
3. Contact form redirects to Cal.com booking with pre-filled email
4. Webhook links booking UID to contact form submission via email address

**Option B**: Post-booking email attachment
1. User completes Cal.com booking
2. Confirmation email includes link to upload files: `https://liteckyeditingservices.com/upload/{bookingId}`
3. Upload page uses booking ID to associate files with appointment

**Option C**: Cal.com custom fields + external link
1. Add custom field to Cal.com booking: "Upload documents" (URL field)
2. User uploads to third-party service (Dropbox, Google Drive) and pastes link
3. Not ideal UX

**Recommendation**: **Option B** (post-booking upload link) for simplest implementation.

---

## 4. Secrets Management

### 4.1 New Secrets Required

| Secret Name | Purpose | Scope | Example Value |
|-------------|---------|-------|---------------|
| `CALCOM_API_KEY` | Cal.com API v2 Bearer token for backend calls | Server-side only | `cal_live_xxxxxxxxxxxx` |
| `CALCOM_WEBHOOK_SECRET` | Verify webhook signatures from Cal.com | Server-side only | `whsec_xxxxxxxxxxxxxxxx` |
| `PUBLIC_CALCOM_EMBED_URL` | Embed URL for inline/popup Cal.com widget | Public (client-side) | `https://cal.com/litecky-editing/consultation` |

### 4.2 Secret Storage Workflow

**Current Workflow** (from `SECRETS.md`):
1. **Gopass** (local, authoritative source) → Developer stores secrets locally
2. **Infisical** (production source of truth) → Sync from gopass
3. **Cloudflare Pages Dashboard** → Manually copy from Infisical for production/preview
4. **GitHub Actions Secrets** → For CI/CD workflows

**Cal.com Secret Workflow**:

#### Step 1: Generate Cal.com API Key
```bash
# In Cal.com dashboard:
# Settings → API Keys → Generate new key
# Copy key: cal_live_xxxxxxxxxxxx
```

#### Step 2: Store in gopass
```bash
gopass insert liteckyeditingservices/calcom-api-key
# Paste: cal_live_xxxxxxxxxxxx

gopass insert liteckyeditingservices/calcom-webhook-secret
# Paste: whsec_xxxxxxxxxxxxxxxx (from Cal.com webhook config)

gopass insert liteckyeditingservices/public-calcom-embed-url
# Paste: https://cal.com/litecky-editing/consultation
```

#### Step 3: Sync to Infisical
```bash
# Infisical CLI sync (if automated)
infisical secrets set CALCOM_API_KEY "$(gopass show -o liteckyeditingservices/calcom-api-key)" --env=production
infisical secrets set CALCOM_WEBHOOK_SECRET "$(gopass show -o liteckyeditingservices/calcom-webhook-secret)" --env=production
infisical secrets set PUBLIC_CALCOM_EMBED_URL "$(gopass show -o liteckyeditingservices/public-calcom-embed-url)" --env=production
```

#### Step 4: Add to Cloudflare Pages
```bash
# Via Cloudflare Pages Dashboard:
# Pages → liteckyeditingservices → Settings → Environment Variables

# Production + Preview:
CALCOM_API_KEY = cal_live_xxxxxxxxxxxx (encrypted)
CALCOM_WEBHOOK_SECRET = whsec_xxxxxxxxxxxxxxxx (encrypted)
PUBLIC_CALCOM_EMBED_URL = https://cal.com/litecky-editing/consultation (plain text)
```

#### Step 5: Add to Local Development
```bash
# .dev.vars (local development only, gitignored)
CALCOM_API_KEY=cal_test_xxxxxxxxxxxx  # Use Cal.com test key for dev
CALCOM_WEBHOOK_SECRET=whsec_test_xxxxxxxxxxxx
PUBLIC_CALCOM_EMBED_URL=https://cal.com/litecky-editing-test/consultation
```

### 4.3 Secret Rotation

**Cal.com API Key Rotation**:
- **Frequency**: Every 90 days (same cadence as GitHub OAuth, Turnstile)
- **Process**:
  1. Generate new API key in Cal.com dashboard
  2. Update gopass → Infisical → Cloudflare Pages → `.dev.vars`
  3. Test in preview environment
  4. Deploy to production
  5. Revoke old API key in Cal.com dashboard

**Webhook Secret Rotation**:
- **Frequency**: Every 180 days (less critical, only used for webhook signature verification)
- **Process**: Same as API key rotation

### 4.4 Environment Variable Types

**Add to `src/env.d.ts`**:
```typescript
interface ImportMetaEnv {
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
  readonly PUBLIC_SITE_NAME: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_CALCOM_EMBED_URL: string; // NEW
}

interface Env {
  TURNSTILE_SECRET_KEY: string;
  SENDGRID_API_KEY: string;
  SEND_EMAIL: Queue;
  CALCOM_API_KEY: string; // NEW
  CALCOM_WEBHOOK_SECRET: string; // NEW
}
```

**Update `ENVIRONMENT.md`**:
Add Cal.com variables to environment matrix table:

| Variable | Production | Preview | Development | Type | Public |
|----------|-----------|---------|-------------|------|--------|
| `PUBLIC_CALCOM_EMBED_URL` | `https://cal.com/litecky-editing/consultation` | `https://cal.com/litecky-editing-test/consultation` | `https://cal.com/litecky-editing-test/consultation` | string | Yes |
| `CALCOM_API_KEY` | `cal_live_xxxxxxxxxxxx` | `cal_test_xxxxxxxxxxxx` | `cal_test_xxxxxxxxxxxx` | string | No |
| `CALCOM_WEBHOOK_SECRET` | `whsec_xxxxxxxxxxxxxxxx` | `whsec_test_xxxxxxxxxxxx` | `whsec_test_xxxxxxxxxxxx` | string | No |

---

## 5. Styling Integration

### 5.1 Design System Tokens

**Current**: `src/styles/global.css` (Tailwind v4 with `@theme` tokens)

**Key Design Tokens**:
```css
@theme {
  /* Colors */
  --color-primary-navy: #192a51;
  --color-accent-sage: #5a716a;
  --color-secondary-gold: #d4af37;
  --color-neutral-cream: #f5f3ed;

  /* Typography */
  --font-family-serif: "Lora", Georgia, serif;
  --font-family-sans: "Inter", system-ui, sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.6;

  /* Spacing */
  --spacing-section: 5rem;
  --spacing-container: 2rem;
}
```

### 5.2 Cal.com Embed Customization

Cal.com embeds support CSS customization via `data-cal-config` attribute:

```html
<div
  class="cal-inline-embed"
  data-cal-link="litecky-editing/consultation"
  data-cal-config='{
    "theme": "light",
    "styles": {
      "branding": {
        "brandColor": "#192a51"
      }
    }
  }'
></div>
```

**Additional CSS Overrides** (add to `global.css`):
```css
/* Cal.com Embed Customization */
.cal-inline-embed {
  /* Match container styling */
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  background: white;
  padding: 2rem;
}

/* Override Cal.com default fonts */
.cal-inline-embed * {
  font-family: var(--font-family-sans) !important;
}

.cal-inline-embed h1,
.cal-inline-embed h2,
.cal-inline-embed h3 {
  font-family: var(--font-family-serif) !important;
  color: var(--color-primary-navy) !important;
}

/* Override Cal.com button styling */
.cal-inline-embed button[type="submit"] {
  background-color: var(--color-primary-navy) !important;
  border-radius: 0.5rem !important;
  font-weight: 600 !important;
  padding: 0.75rem 1.5rem !important;
  transition: all 0.2s !important;
}

.cal-inline-embed button[type="submit"]:hover {
  background-color: var(--color-accent-sage) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
}

/* Override Cal.com input styling */
.cal-inline-embed input,
.cal-inline-embed select,
.cal-inline-embed textarea {
  border: 1px solid #d1d5db !important;
  border-radius: 0.375rem !important;
  padding: 0.5rem 0.75rem !important;
  font-size: 1rem !important;
}

.cal-inline-embed input:focus,
.cal-inline-embed select:focus,
.cal-inline-embed textarea:focus {
  outline: 2px solid var(--color-primary-navy) !important;
  outline-offset: 2px !important;
  border-color: var(--color-primary-navy) !important;
}
```

**Testing**:
- Test embed appearance in Chrome, Firefox, Safari
- Verify mobile responsiveness (Cal.com embeds are responsive by default)
- Check dark mode compatibility (if site adds dark mode in future)

### 5.3 Mobile Responsiveness

Cal.com embeds are responsive by default, but ensure container width is appropriate:

```css
/* Responsive container */
.cal-inline-embed {
  max-width: 100%;
  width: 100%;
}

@media (min-width: 768px) {
  .cal-inline-embed {
    max-width: 48rem; /* 768px */
  }
}
```

---

## 6. CMS Integration (Decap CMS)

### 6.1 Current CMS Structure

**Current Collections** (`config/cms.config.yml`):
- **Pages** (homepage, about, services, contact, privacy, terms)
- **Services** (with pricing, features, order)
- **Testimonials** (with ratings, featured flag)
- **FAQ** (with categories: General, Services, Process, Pricing, Security)

**Backend**: GitHub with editorial workflow (draft → review → publish)

### 6.2 Cal.com CMS Integration Options

#### Option A: Hardcode Cal.com Configuration (Recommended)

**Approach**: Cal.com embed URL and event types configured directly in code.

**Pros**:
- Simple, no CMS complexity
- Cal.com dashboard is already the "CMS" for calendar management
- Non-technical users unlikely to need to change embed URLs

**Cons**:
- Requires code deployment to change embed URL

**Implementation**: No CMS changes needed.

#### Option B: CMS-Managed Cal.com Settings

**Approach**: Create `Booking Settings` collection in Decap CMS to manage Cal.com embed URL.

**New Collection** (`config/cms.config.yml`):
```yaml
collections:
  - name: "booking_settings"
    label: "Booking Settings"
    files:
      - name: "calcom_config"
        label: "Cal.com Configuration"
        file: "content/settings/calcom.json"
        fields:
          - { label: "Embed URL", name: "embedUrl", widget: "string", hint: "Cal.com booking link (e.g., https://cal.com/litecky-editing/consultation)" }
          - { label: "Event Type Name", name: "eventTypeName", widget: "string", default: "Free Consultation" }
          - { label: "Event Duration (minutes)", name: "duration", widget: "number", default: 30 }
          - { label: "Enable Booking", name: "enabled", widget: "boolean", default: true, hint: "Turn off to disable booking widget site-wide" }
```

**Usage in Astro**:
```astro
---
import calcomConfig from '@/content/settings/calcom.json';

const { embedUrl, enabled } = calcomConfig;
---

{enabled && (
  <div class="cal-inline-embed" data-cal-link={embedUrl}></div>
)}
```

**Pros**:
- Non-technical users can update embed URL via CMS
- Can disable booking widget site-wide without code changes

**Cons**:
- Adds complexity for minimal benefit (Cal.com URLs rarely change)

**Recommendation**: **Option A** (hardcode) unless non-technical admins need to manage Cal.com URLs.

#### Option C: CMS-Managed Availability Override

**Approach**: Use CMS to display "booking temporarily unavailable" message without disabling Cal.com embed.

**Implementation**:
```yaml
# Add to existing Pages collection (contact.md frontmatter)
fields:
  - { label: "Booking Available", name: "bookingAvailable", widget: "boolean", default: true }
  - { label: "Unavailable Message", name: "unavailableMessage", widget: "text", default: "Booking is temporarily unavailable. Please email us directly." }
```

**Usage**:
```astro
---
const { bookingAvailable, unavailableMessage } = Astro.props;
---

{bookingAvailable ? (
  <div class="cal-inline-embed" data-cal-link={embedUrl}></div>
) : (
  <div class="alert alert-warning">{unavailableMessage}</div>
)}
```

**Use Case**: Temporarily disable booking during holidays without deleting Cal.com configuration.

### 6.3 Content Migration

**Current Contact Page Content** (`src/pages/contact.astro`):
- Heading: "Get Your Free Quote"
- Subheading: "Submit your project details..."
- Form fields: name, email, service, message, deadline, file upload

**New Contact Page Content**:
- Heading: "Schedule Your Free Consultation"
- Subheading: "Choose a convenient time to discuss your project requirements..."
- Cal.com embed replaces form

**Migration Steps**:
1. Update page title and meta description in `BaseLayout` props
2. Update heading/subheading text
3. Remove form HTML
4. Add Cal.com embed
5. Keep trust indicators (testimonials, security badges) below embed

---

## 7. Testing Strategy

### 7.1 Unit Tests

**Current**: Vitest for utility functions (not heavily used yet based on package.json)

**New Tests Needed**:
- `functions/api/calcom-webhook.ts` - Test webhook signature verification
- Webhook payload parsing and message queueing logic

**Example Test**:
```typescript
// tests/unit/calcom-webhook.test.ts
import { describe, it, expect, vi } from 'vitest';

describe('Cal.com Webhook Signature Verification', () => {
  it('should accept valid HMAC signature', async () => {
    const secret = 'test_secret';
    const payload = '{"triggerEvent":"BOOKING_CREATED"}';
    const signature = await generateHmacSignature(secret, payload);

    expect(verifyWebhookSignature(signature, payload, secret)).toBe(true);
  });

  it('should reject invalid signature', () => {
    expect(verifyWebhookSignature('invalid', '{}', 'secret')).toBe(false);
  });
});
```

### 7.2 E2E Tests (Playwright)

**Current Tests** (`package.json` line 24-34):
- `pnpm test:e2e` - General E2E tests
- `pnpm test:e2e:ui` - Playwright UI mode

**New Test Scenarios**:

```typescript
// tests/e2e/booking.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Cal.com Booking Flow', () => {
  test('should load Cal.com embed on contact page', async ({ page }) => {
    await page.goto('/contact');

    // Wait for Cal.com iframe to load
    const iframe = page.frameLocator('iframe[title*="cal.com"]');
    await expect(iframe.locator('text=Select a date')).toBeVisible({ timeout: 10000 });
  });

  test('should match brand colors in embed', async ({ page }) => {
    await page.goto('/contact');

    const iframe = page.frameLocator('iframe[title*="cal.com"]');
    const button = iframe.locator('button[type="submit"]').first();

    // Verify primary navy color (#192a51) is applied
    const bgColor = await button.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bgColor).toBe('rgb(25, 42, 81)'); // #192a51 in RGB
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/contact');

    const iframe = page.frameLocator('iframe[title*="cal.com"]');
    await expect(iframe.locator('text=Select a date')).toBeVisible();
  });
});
```

**Test Environment**:
- Use Cal.com **test event type** (not production calendar) for E2E tests
- Set `PUBLIC_CALCOM_EMBED_URL` to test calendar in `.dev.vars`

### 7.3 Visual Regression Tests

**Current Tests** (`tests/e2e/visual.spec.ts`):
- Captures screenshots of 4 components: header, footer, hero, contact form
- Compares against baseline snapshots (`tests/e2e/__screenshots__/`)
- Platform-specific baselines: `*-chromium-linux.png` (CI), `*-chromium-darwin.png` (local macOS)

**Impact on Existing Tests**:
- **Contact form snapshot will fail** after replacing form with Cal.com embed
- **Expected behavior** - visual changes require baseline update

**Updated Visual Test**:
```typescript
// tests/e2e/visual.spec.ts
test('captures contact page with Cal.com embed', async ({ page }) => {
  await page.goto('/contact');

  // Wait for Cal.com embed to fully load
  await page.waitForLoadState('networkidle');
  const iframe = page.frameLocator('iframe[title*="cal.com"]');
  await iframe.locator('text=Select a date').waitFor({ state: 'visible', timeout: 15000 });

  // Capture full contact page
  const contactPage = page.locator('main#main');
  await expect(contactPage).toHaveScreenshot('contact-page-with-calcom.png', {
    fullPage: true,
    animations: 'disabled',
  });
});
```

**Baseline Update Process** (from `CONTRIBUTING.md` lines 89-99):
```bash
# After implementing Cal.com embed
pnpm test:visual:update  # Regenerate baselines locally
git add tests/e2e/__screenshots__/
git commit -m "test: update visual baselines for Cal.com embed"
git push  # CI re-runs and passes
```

**CI Workflow** (`.github/workflows/e2e-visual.yml`):
- Runs on every PR (blocking check)
- Fails if snapshots don't match
- Requires developer to update baselines locally and commit

### 7.4 Accessibility Tests

**Current**: `pnpm test:a11y` - pa11y accessibility checks

**Cal.com Accessibility**:
- Cal.com embeds are WCAG 2.1 AA compliant by default
- Keyboard navigation supported
- Screen reader compatible

**Test Updates**:
```bash
# Verify contact page with embed passes a11y checks
pnpm test:a11y
```

**Manual Testing**:
- Tab through booking flow with keyboard only
- Test with screen reader (VoiceOver on macOS, NVDA on Windows)
- Verify color contrast meets WCAG AA standards (primary navy #192a51 on white has 10.7:1 ratio - passes AAA)

### 7.5 Integration Testing (Webhook)

**Test Webhook Locally**:
```bash
# 1. Start Wrangler dev server
pnpm wrangler pages dev dist --live-reload

# 2. Use ngrok to expose localhost
ngrok http 8788

# 3. Add ngrok URL to Cal.com webhook settings
https://xxxx.ngrok.io/api/calcom-webhook

# 4. Create test booking in Cal.com
# 5. Verify webhook received in Wrangler logs
```

**Test Webhook in Preview Environment**:
- Deploy PR to Cloudflare Pages preview
- Update Cal.com webhook URL to preview URL: `https://abc123.liteckyeditingservices.pages.dev/api/calcom-webhook`
- Create test booking
- Verify email sent

---

## 8. CI/CD Pipeline Changes

### 8.1 Current CI Workflows

**From `.github/workflows/README.md`**:
1. **quality-gate.yml** - TypeScript, linting, build verification (required)
2. **e2e-visual.yml** - Visual regression tests (blocking on PRs)
3. **preview-validation.yml** - Preview deployment smoke tests
4. **post-deploy-validation.yml** - Production validation after deploy
5. **deploy-production.yml** - Git-connected mode (noop job runs)

### 8.2 Required Workflow Updates

#### 8.2.1 Environment Variables in CI

**Current Secrets** (`.github/workflows/README.md` lines 14-17):
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

**New Secrets to Add**:
```bash
# GitHub repository secrets (for CI/CD)
gh secret set CALCOM_API_KEY --body "cal_test_xxxxxxxxxxxx"
gh secret set CALCOM_WEBHOOK_SECRET --body "whsec_test_xxxxxxxxxxxx"
gh secret set PUBLIC_CALCOM_EMBED_URL --body "https://cal.com/litecky-editing-test/consultation"
```

**Used In**:
- `quality-gate.yml` - Build step needs `PUBLIC_CALCOM_EMBED_URL` to resolve imports
- `e2e-visual.yml` - Visual tests need embed URL to load Cal.com iframe
- `preview-validation.yml` - Smoke tests verify Cal.com embed loads

#### 8.2.2 Visual Regression Workflow Updates

**Current** (`.github/workflows/e2e-visual.yml`):
- Captures 4 component screenshots: header, footer, hero, contact form
- Runs on push to `main` and PRs
- Fails PR if snapshots don't match

**Expected Changes**:
- Contact form snapshot **will differ** (form → Cal.com embed)
- Developer must update baselines locally: `pnpm test:visual:update`
- Commit updated snapshots: `git add tests/e2e/__screenshots__/ && git commit`
- CI re-runs and passes

**Workflow Configuration** (no changes needed to workflow file itself):
```yaml
# .github/workflows/e2e-visual.yml (existing)
- name: Run visual tests
  run: pnpm test:visual
  env:
    PUBLIC_CALCOM_EMBED_URL: ${{ secrets.PUBLIC_CALCOM_EMBED_URL }}  # Add this
```

#### 8.2.3 Preview Validation Updates

**Current** (`preview-validation.yml`):
- Fetches preview URL from Cloudflare Pages API
- Runs smoke tests against preview

**New Test**:
```typescript
// Add to smoke test suite
test('Cal.com embed loads on contact page', async ({ page }) => {
  await page.goto(`${previewUrl}/contact`);
  const iframe = page.frameLocator('iframe[title*="cal.com"]');
  await expect(iframe.locator('text=Select a date')).toBeVisible({ timeout: 10000 });
});
```

#### 8.2.4 Post-Deploy Validation Updates

**Current** (`post-deploy-validation.yml`):
- Tests security headers (15 tests)
- Smoke tests critical pages
- CMS admin route contract test

**New Tests**:
```typescript
// Add to post-deploy validation suite
test('Cal.com CSP directives are correct', async ({ page }) => {
  const response = await page.goto('https://liteckyeditingservices.com/contact');
  const csp = response.headers()['content-security-policy'];

  expect(csp).toContain('https://app.cal.com');
  expect(csp).toContain('https://cal.com');
  expect(csp).toContain('https://api.cal.com');
});

test('Cal.com embed loads in production', async ({ page }) => {
  await page.goto('https://liteckyeditingservices.com/contact');
  const iframe = page.frameLocator('iframe[title*="cal.com"]');
  await expect(iframe.locator('text=Select a date')).toBeVisible({ timeout: 10000 });
});
```

### 8.3 Build Process Changes

**Current Build** (`package.json` line 8):
```json
"build": "pnpm run check && astro check && astro build"
```

**No changes needed** - Cal.com embed is client-side JavaScript, doesn't affect build process.

**Build Time Considerations**:
- Cal.com script loaded at runtime (not bundled)
- No impact on Astro build performance
- Public env vars (`PUBLIC_CALCOM_EMBED_URL`) resolved at build time

---

## 9. Monitoring & Observability (Sentry)

### 9.1 Current Sentry Configuration

**Setup**: Astro official Sentry integration (`@sentry/astro`)
**Config File**: `sentry.client.config.js` (referenced in `BaseLayout.astro`)
**Environment Variables** (`ENVIRONMENT.md`):
- `PUBLIC_SENTRY_DSN` - Client-side error tracking
- `SENTRY_AUTH_TOKEN` - For sourcemap uploads (CI only)
- `SENTRY_ORG` - Organization slug
- `SENTRY_PROJECT` - Project slug

### 9.2 Cal.com Error Tracking

#### 9.2.1 Client-Side Errors

**Automatic Tracking**:
- Sentry automatically captures JavaScript errors in Cal.com embed (if embed script fails to load)
- CSP violations logged to Sentry if Cal.com domains missing from CSP

**Custom Tracking**:
```javascript
// In contact.astro script section
import * as Sentry from '@sentry/astro';

// Track Cal.com embed load failures
window.addEventListener('error', (event) => {
  if (event.filename && event.filename.includes('cal.com')) {
    Sentry.captureException(new Error('Cal.com embed failed to load'), {
      tags: { component: 'calcom-embed' },
      extra: { url: event.filename },
    });
  }
});

// Track Cal.com API errors (if using Cal.com API directly)
Cal('on', {
  action: 'error',
  callback: (error) => {
    Sentry.captureException(error, {
      tags: { component: 'calcom-api' },
    });
  },
});
```

#### 9.2.2 Server-Side Errors (Webhook Endpoint)

**Add to `functions/api/calcom-webhook.ts`**:
```typescript
import * as Sentry from '@sentry/astro';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }): Promise<Response> => {
  try {
    // Webhook processing logic
    const payload = await request.json();
    // ... process webhook

  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: 'calcom-webhook' },
      extra: {
        headers: Object.fromEntries(request.headers.entries()),
        url: request.url,
      },
    });

    return json({ error: 'Internal server error' }, 500);
  }
};
```

#### 9.2.3 Performance Monitoring

**Track Cal.com Embed Load Time**:
```javascript
// In contact.astro
const transaction = Sentry.startTransaction({
  name: 'Cal.com Embed Load',
  op: 'embed.load',
});

Cal('on', {
  action: 'loaded',
  callback: () => {
    transaction.finish();
  },
});
```

### 9.3 Custom Sentry Alerts

**Recommended Alerts**:
1. **Cal.com Embed Failure** - Alert if >5 embed load errors in 5 minutes
2. **Webhook Signature Mismatch** - Alert on any 401 responses from webhook endpoint
3. **Booking Notification Failure** - Alert if email queue fails to enqueue booking messages

**Sentry Alert Configuration** (in Sentry dashboard):
- Go to Alerts → Create Alert Rule
- Condition: `error.type:CalcomEmbedError` OR `http.status_code:401 AND endpoint:calcom-webhook`
- Action: Email notification + Slack webhook

---

## 10. Local Development Setup

### 10.1 Cal.com Test Account Setup

#### Option A: Cal.com Cloud (Recommended)

**Steps**:
1. Sign up for free Cal.com account: https://cal.com/signup
2. Create test event type: "Test Consultation" (30 min)
3. Generate API key: Settings → API Keys → "Generate Key"
4. Copy embed URL: Event Types → Test Consultation → "Get Embed Code"

**Embed URL Format**: `https://cal.com/your-username/test-consultation`

#### Option B: Self-Hosted Cal.com (Advanced)

**Requirements**:
- Docker + Docker Compose
- PostgreSQL database
- Node.js 24.x

**Setup**:
```bash
# Clone Cal.com
git clone https://github.com/calcom/cal.com.git
cd cal.com

# Configure environment
cp .env.example .env
# Edit .env with database credentials

# Start with Docker
docker compose up -d

# Access at http://localhost:3000
```

**Recommendation**: Use **Option A** (cloud) for local development - self-hosting adds unnecessary complexity.

### 10.2 Local Environment Configuration

**Update `.dev.vars`**:
```bash
# Cal.com Configuration (Test Environment)
CALCOM_API_KEY=cal_test_xxxxxxxxxxxx
CALCOM_WEBHOOK_SECRET=whsec_test_xxxxxxxxxxxx
PUBLIC_CALCOM_EMBED_URL=https://cal.com/your-test-username/test-consultation

# Existing variables
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
SENDGRID_API_KEY=SG.test_key
# ... etc
```

**Update `direnv` (if used)**:
```bash
# .envrc already sources .dev.vars
direnv allow .
```

### 10.3 Local Testing Workflow

#### Step 1: Start Dev Server
```bash
pnpm dev
# Server runs at http://localhost:4321
```

#### Step 2: Test Contact Page
```bash
# Open http://localhost:4321/contact
# Verify Cal.com embed loads
# Test booking flow with test calendar
```

#### Step 3: Test Webhook Locally (Optional)
```bash
# Terminal 1: Start Wrangler dev
pnpm wrangler pages dev dist --live-reload --port 8788

# Terminal 2: Expose with ngrok
ngrok http 8788

# Copy ngrok URL: https://xxxx.ngrok.io
# Add to Cal.com webhook settings: https://xxxx.ngrok.io/api/calcom-webhook
```

#### Step 4: Test Booking End-to-End
```bash
# 1. Book appointment on http://localhost:4321/contact
# 2. Check webhook received (Wrangler logs)
# 3. Verify email sent (check SENDGRID_TO email inbox)
```

### 10.4 Troubleshooting Local Development

**Issue**: Cal.com embed doesn't load
**Solution**:
- Check browser console for CSP violations
- Verify `PUBLIC_CALCOM_EMBED_URL` is set in `.dev.vars`
- Ensure Cal.com test event type is public (not private)

**Issue**: Webhook returns 401 (signature mismatch)
**Solution**:
- Verify `CALCOM_WEBHOOK_SECRET` matches Cal.com webhook secret
- Check webhook payload is parsed as raw text before signature verification

**Issue**: Booking email not sent
**Solution**:
- Check `SENDGRID_API_KEY` is valid (test with `curl` to SendGrid API)
- Verify queue consumer is processing messages (check Wrangler logs)

---

## 11. Production Deployment

### 11.1 Pre-Deployment Checklist

- [ ] Cal.com production account created
- [ ] Production event type configured (e.g., "Free Consultation")
- [ ] Cal.com API key generated and stored in gopass
- [ ] Webhook secret generated and stored in gopass
- [ ] Secrets synced to Infisical
- [ ] Environment variables added to Cloudflare Pages (production + preview)
- [ ] CSP headers updated in `public/_headers`
- [ ] Visual regression baselines updated
- [ ] E2E tests pass locally
- [ ] Preview deployment tested with test bookings
- [ ] Webhook endpoint tested in preview environment

### 11.2 Deployment Strategy (Phased Rollout)

#### Phase 1: Preview Environment (1 week)
**Goal**: Validate integration with limited traffic

**Steps**:
1. Deploy Cal.com integration to preview environment
2. Share preview URL with internal team: `https://preview.liteckyeditingservices.pages.dev/contact`
3. Test booking flow 5-10 times
4. Monitor Sentry for errors
5. Verify webhook emails arrive correctly

**Success Criteria**:
- Zero Sentry errors related to Cal.com
- All test bookings receive confirmation emails
- Visual appearance matches design system

#### Phase 2: Production (Soft Launch)
**Goal**: Deploy to production with low-key announcement

**Steps**:
1. Merge PR to `main` (triggers Cloudflare Pages deploy)
2. Verify production contact page loads Cal.com embed
3. Create 2-3 test bookings in production
4. Monitor Sentry for 24 hours
5. Check Google Analytics for booking page engagement

**Success Criteria**:
- No production errors
- Booking flow completes successfully
- Page load time acceptable (<3s for contact page)

#### Phase 3: Full Launch
**Goal**: Announce booking feature to customers

**Steps**:
1. Update homepage hero CTA to "Schedule Consultation" (links to /contact)
2. Send email announcement to existing clients
3. Update social media links
4. Monitor booking volume and feedback

**Rollback Plan**:
- If critical errors: Revert PR, restore old contact form
- If minor issues: Disable Cal.com embed via environment variable (`PUBLIC_CALCOM_EMBED_URL=""`)

### 11.3 Post-Deployment Monitoring

**Metrics to Track** (first 30 days):
- **Booking Conversion Rate**: Contact page visits → completed bookings
- **Cal.com Embed Load Time**: Track with Sentry performance monitoring
- **Error Rate**: Cal.com-related errors in Sentry
- **Email Delivery Rate**: Webhook confirmations → successful email sends
- **User Feedback**: Collect feedback on booking experience

**Sentry Dashboards**:
- Create "Cal.com Integration Health" dashboard with:
  - Error rate by component (embed, webhook, email)
  - P95 embed load time
  - Webhook success rate (200 responses / total requests)

**Weekly Review**:
- Review Sentry errors and trends
- Check Cal.com dashboard for booking analytics
- Gather qualitative feedback from clients

---

## 12. Migration Strategy (Contact Form → Cal.com)

### 12.1 Decision: Replace or Augment?

**Option A: Full Replacement** (Recommended)
- Remove existing contact form entirely
- Cal.com booking becomes primary contact method
- Backup: Add "Email us directly" link below embed

**Option B: Hybrid Approach**
- Keep simplified contact form for general inquiries
- Add Cal.com embed for scheduling consultations
- Two separate CTAs: "Schedule Consultation" vs "Send Message"

**Recommendation**: **Option A** (full replacement) to:
- Simplify UX (one clear CTA)
- Reduce maintenance burden (no need to maintain form + embed)
- Increase booking conversion (scheduling > async email)

**Fallback Email Link**:
```html
<div class="mt-8 text-center text-sm text-gray-600">
  <p>Prefer email? <a href="mailto:contact@liteckyeditingservices.com" class="text-primary-navy underline">Contact us directly</a></p>
</div>
```

### 12.2 File Upload Migration

**Current**: `FileUpload.svelte` component allows attaching documents to quote requests

**New Flow**:
1. User schedules consultation via Cal.com
2. Confirmation email includes link: "Upload documents for your consultation"
3. Link goes to `/upload/{bookingId}` page
4. Upload page:
   - Verifies booking ID exists (query Cal.com API or D1 database)
   - Allows file upload to R2 bucket
   - Associates files with booking
   - Sends notification email to staff

**Implementation**:
```astro
---
// src/pages/upload/[bookingId].astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import FileUpload from '@/components/FileUpload.svelte';

const { bookingId } = Astro.params;

// Verify booking exists (call Cal.com API)
const booking = await fetch(`https://api.cal.com/v1/bookings/${bookingId}`, {
  headers: { Authorization: `Bearer ${import.meta.env.CALCOM_API_KEY}` },
});

if (!booking.ok) {
  return Astro.redirect('/404');
}
---

<BaseLayout title="Upload Documents">
  <main class="site-container py-section">
    <h1 class="text-3xl font-serif font-bold mb-6">Upload Your Documents</h1>
    <p class="mb-8">Upload materials for your consultation (booking ID: {bookingId})</p>

    <FileUpload bookingId={bookingId} client:load />
  </main>
</BaseLayout>
```

**API Endpoint**: `functions/api/upload.ts`
- Accepts multipart form data
- Stores files in R2 bucket: `bookings/{bookingId}/filename.docx`
- Creates record in D1 database: `booking_files` table
- Sends notification email to staff

### 12.3 Data Retention

**Current Contact Form Data**: Stored transiently (email sent, data not persisted)

**Cal.com Booking Data**:
- Stored in Cal.com cloud (GDPR compliant)
- Accessible via Cal.com API for 1 year
- Can export via Cal.com dashboard: Settings → Data Export

**File Upload Data**:
- Files stored in R2 bucket (Cloudflare)
- Metadata in D1 database (booking ID, filename, upload timestamp)
- Retention policy: 90 days after consultation (automate with Cloudflare Worker cron)

**GDPR Compliance**:
- Add privacy notice above Cal.com embed: "By scheduling, you agree to our Privacy Policy"
- Cal.com booking data subject to Cal.com's DPA (Data Processing Agreement)
- File uploads subject to site's privacy policy (update `/privacy` page)

---

## 13. Cost Analysis

### 13.1 Cal.com Pricing (as of 2025)

**Free Tier**:
- 1 event type
- Unlimited bookings
- Basic integrations
- Cal.com branding

**Startup Tier** ($12/month):
- Unlimited event types
- Custom branding
- Webhooks
- API access
- Priority support

**Recommendation**: **Startup Tier** ($12/month) for:
- Webhooks (needed for email confirmations)
- API access (needed for upload verification)
- Professional appearance (no Cal.com branding)

**Annual Cost**: $144/year

### 13.2 Infrastructure Costs (Cloudflare)

**Current Cloudflare Usage**:
- Pages: Free (under 500 builds/month, 100GB bandwidth)
- Workers: Free (under 100k requests/day)
- R2 Storage: ~$0.015/GB/month
- D1 Database: Free (under 5M rows, 1GB storage)
- Queues: $0.40/million operations

**Additional Cal.com Costs**:
- Webhook endpoint: +~1000 requests/month (negligible)
- File upload storage: +5GB R2 storage (~$0.08/month)
- API calls to Cal.com: Free (Cal.com doesn't charge for API calls)

**Estimated Monthly Increase**: <$1/month

### 13.3 ROI Considerations

**Benefits**:
- **Reduced friction**: Booking vs email back-and-forth (faster conversion)
- **Automated scheduling**: No manual calendar coordination (saves staff time)
- **Professional appearance**: Builds trust with academic clients
- **Analytics**: Cal.com provides booking data (conversion insights)

**Time Savings**:
- Current: Average 3 email exchanges to schedule (15 min staff time)
- With Cal.com: Instant booking (0 min staff time)
- If 10 bookings/month: **2.5 hours/month saved** (~$75/month value at $30/hr)

**Break-Even**: Cal.com pays for itself with 2 bookings/month (given time savings).

---

## 14. Risks & Mitigation

### 14.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Cal.com service outage | Low | High | Fallback email link below embed; monitor Cal.com status page |
| CSP blocks Cal.com script | Medium | High | Test thoroughly in preview; add CSP report-uri to catch violations |
| Webhook signature fails | Low | Medium | Implement robust signature verification with detailed logging |
| Visual regression tests fail | High | Low | Expected; update baselines as part of deployment process |
| Cal.com API rate limiting | Low | Medium | Cache booking data; implement exponential backoff for API calls |
| Mobile embed rendering issues | Medium | Medium | Test on iOS Safari, Chrome Mobile; Cal.com embeds are responsive by default |

### 14.2 Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Customers prefer email over booking | Medium | Medium | Keep "Email us" link as fallback; monitor conversion rates |
| Double-booking due to calendar sync issues | Low | High | Use Cal.com's Google Calendar integration; set buffer times |
| Spam bookings | Low | Medium | Enable Cal.com's built-in spam prevention; add manual approval for first-time bookers |
| Lost file uploads (user forgets to upload after booking) | Medium | Low | Send reminder email 1 day before consultation with upload link |

### 14.3 Compliance Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| GDPR violation (booking data) | Low | High | Cal.com is GDPR compliant; sign DPA with Cal.com; update privacy policy |
| PII exposure in webhook logs | Medium | Medium | Sanitize webhook logs; don't log full payloads to Sentry |
| Inadequate data retention policy | Low | Medium | Define clear retention periods; automate deletion after 90 days |

---

## 15. Alternative Approaches Considered

### 15.1 Build Custom Booking System

**Approach**: Implement booking calendar from scratch with Astro + D1 database

**Pros**:
- Full control over UX and data
- No third-party dependencies
- No recurring Cal.com subscription cost

**Cons**:
- Significant development time (estimated 40+ hours)
- Maintenance burden (calendar logic, timezone handling, reminders)
- Reinventing wheel (Cal.com solves this well)
- No built-in spam prevention or analytics

**Verdict**: **Not recommended** - Cal.com provides professional solution at $12/month, saving weeks of development time.

### 15.2 Use Calendly Instead of Cal.com

**Approach**: Integrate Calendly (popular Cal.com alternative)

**Pros**:
- More polished UI
- Larger user base (more mature product)
- Better integrations (Salesforce, HubSpot)

**Cons**:
- More expensive ($10/month Professional, $16/month Teams)
- Less customizable (no white-label on lower tiers)
- No self-hosting option (vendor lock-in)
- Cal.com is open-source (better long-term control)

**Verdict**: **Cal.com preferred** for white-label capability and open-source advantage.

### 15.3 Keep Contact Form, Add Cal.com Link

**Approach**: Maintain existing form, add "or schedule a call" button that opens Cal.com in new tab

**Pros**:
- Less disruptive (no form removal)
- Two contact methods (flexibility)

**Cons**:
- Split focus (reduces booking conversion)
- Maintains two systems (more maintenance)
- Confusing UX (when to use form vs booking?)

**Verdict**: **Not recommended** - Cal.com should be primary CTA for clarity.

---

## 16. Implementation Timeline

### 16.1 Estimated Effort

| Phase | Tasks | Estimated Time |
|-------|-------|---------------|
| **Phase 1: Setup** | Cal.com account, API keys, secrets management | 2 hours |
| **Phase 2: Frontend** | Replace contact form with embed, update CSP, styling | 4 hours |
| **Phase 3: Backend** | Webhook endpoint, email notifications, queue consumer updates | 6 hours |
| **Phase 4: File Upload** | Post-booking upload page, R2 storage, API endpoint | 8 hours |
| **Phase 5: Testing** | E2E tests, visual regression, webhook testing | 6 hours |
| **Phase 6: CI/CD** | Update workflows, environment variables, deployment | 2 hours |
| **Phase 7: Documentation** | Update docs, privacy policy, ENVIRONMENT.md | 2 hours |
| **Phase 8: Deployment** | Preview testing, production rollout, monitoring | 4 hours |
| **Total** | | **34 hours** |

### 16.2 Recommended Schedule (2-Week Sprint)

**Week 1: Core Implementation**
- **Day 1-2**: Cal.com setup, frontend integration, CSP updates (6 hours)
- **Day 3-4**: Webhook endpoint, email notifications (6 hours)
- **Day 5**: E2E and visual regression tests (6 hours)

**Week 2: Refinement & Deployment**
- **Day 1-2**: File upload flow (8 hours)
- **Day 3**: CI/CD updates, documentation (4 hours)
- **Day 4**: Preview testing, bug fixes (4 hours)
- **Day 5**: Production deployment, monitoring (4 hours)

**Contingency**: +1 week buffer for unexpected issues

### 16.3 Minimal Viable Integration (MVP)

If time is constrained, implement in two phases:

**MVP (Week 1)**:
- Cal.com embed on contact page (replace form)
- CSP updates
- Webhook endpoint (basic email notification)
- Visual regression baseline updates
- Deploy to production

**Enhancements (Week 2+)**:
- Post-booking file upload flow
- Advanced email templates
- Sentry monitoring dashboards
- CMS integration (if desired)

---

## 17. Success Metrics (KPIs)

### 17.1 Technical Metrics

**Baseline (Before Cal.com)**:
- Contact form submissions: X per month
- Average response time to inquiries: Y hours
- Email coordination time: Z minutes per booking

**Target Metrics (After Cal.com)**:
- **Booking conversion rate**: >15% of contact page visitors complete booking
- **Embed load time**: <2 seconds (P95)
- **Webhook success rate**: >99.5% (200 responses)
- **Email delivery rate**: >99% (SendGrid success)
- **Zero critical Sentry errors** related to Cal.com integration

### 17.2 Business Metrics

**Month 1 Targets**:
- **10+ completed bookings** via Cal.com
- **Zero manual calendar coordination** (all via Cal.com)
- **Positive user feedback** (survey or informal check-ins)

**Month 3 Targets**:
- **30+ bookings/month** (assuming growing client base)
- **5% increase in overall conversions** (booking vs old email flow)
- **2+ hours/week time savings** for staff (no calendar coordination)

### 17.3 Monitoring Dashboard

**Create Grafana/Sentry Dashboard** with:
1. **Cal.com Embed Performance**: Load time, error rate
2. **Booking Funnel**: Contact page views → embed loads → completed bookings
3. **Webhook Health**: Request volume, success rate, error types
4. **Email Notifications**: Queue depth, delivery rate, failures

---

## 18. Documentation Updates Required

### 18.1 Technical Documentation

**Files to Update**:
1. **ENVIRONMENT.md** - Add Cal.com environment variables table
2. **SECRETS.md** - Add Cal.com API key rotation procedures
3. **DEPLOYMENT.md** - Add Cal.com webhook URL configuration
4. **ARCHITECTURE.md** - Add Cal.com integration diagram
5. **.github/workflows/README.md** - Document Cal.com secrets in CI

### 18.2 User-Facing Documentation

**Files to Update**:
1. **src/pages/privacy.astro** - Add Cal.com data processing disclosure
2. **src/pages/terms.astro** - Add booking cancellation policy
3. **README.md** - Update feature list (add "Online booking")

### 18.3 Developer Onboarding

**Add to `docs/onboarding.md`**:
```markdown
## Cal.com Integration

This site uses Cal.com for online booking. To develop locally:

1. **Get Cal.com test account**: Sign up at https://cal.com/signup
2. **Create test event type**: "Test Consultation" (30 min)
3. **Generate API key**: Settings → API Keys → Generate
4. **Update `.dev.vars`**:
   ```bash
   CALCOM_API_KEY=cal_test_xxxxxxxxxxxx
   PUBLIC_CALCOM_EMBED_URL=https://cal.com/your-username/test-consultation
   ```
5. **Test locally**: Visit http://localhost:4321/contact

For webhook testing, use ngrok to expose localhost (see CAL-COM-INTEGRATION-ANALYSIS.md).
```

---

## 19. Open Questions & Decisions Needed

### 19.1 Business Decisions

1. **Event Type Configuration**:
   - What appointment durations? (15 min, 30 min, 60 min?)
   - What availability hours? (9am-5pm EST? Include evenings/weekends?)
   - Buffer time between bookings? (15 min recommended)

2. **Booking Policy**:
   - Require manual approval for first-time clients?
   - Allow same-day bookings or require 24-hour notice?
   - Cancellation policy? (24-hour notice required?)

3. **File Upload Requirements**:
   - Max file size? (Current FileUpload.svelte config?)
   - Allowed file types? (.docx, .pdf, .tex, etc.)
   - Required before consultation or optional?

4. **Pricing Integration**:
   - Display pricing on booking page? (Cal.com custom fields)
   - Collect payment at booking? (Cal.com supports Stripe)
   - Or invoice after consultation? (current model)

### 19.2 Technical Decisions

1. **Self-Hosted vs Cloud Cal.com**:
   - **Recommendation**: Cloud (simpler, faster)
   - Only self-host if data sovereignty required

2. **Embed Type**:
   - **Recommendation**: Inline embed on /contact page
   - Alternative: Floating button on all pages (less disruptive to current design)

3. **CMS Integration**:
   - **Recommendation**: Skip CMS integration (hardcode config)
   - Alternative: Add Booking Settings collection (if non-technical admins need control)

4. **File Upload Implementation**:
   - **Recommendation**: Post-booking upload link in confirmation email
   - Alternative: Keep separate contact form for document submissions (hybrid approach)

5. **Webhook Error Handling**:
   - Retry failed webhook deliveries? (Cal.com retries automatically)
   - Store webhook payloads in D1 for debugging? (adds complexity)

---

## 20. Conclusion & Recommendations

### 20.1 Summary

**Cal.com integration is technically feasible** and recommended for Litecky Editing Services. The implementation touches multiple system components but aligns well with existing architecture:

- **Frontend**: Clean replacement of contact form with Cal.com inline embed
- **Backend**: Straightforward webhook endpoint using existing Cloudflare Queue pattern
- **Infrastructure**: Minimal CSP changes, standard secrets management workflow
- **Testing**: Visual regression baselines update required (expected with UI changes)
- **Cost**: $12/month Cal.com + <$1/month Cloudflare increase = **negligible operational cost**
- **ROI**: 2.5 hours/month staff time savings (~$75/month value) = **6x ROI**

### 20.2 Implementation Recommendation

**Recommended Approach**: Phased rollout with MVP focus

1. **Phase 1 (Week 1)**: Core integration
   - Cal.com embed on contact page
   - CSP updates
   - Basic webhook email notifications
   - Deploy to preview → production

2. **Phase 2 (Week 2)**: Enhancements
   - Post-booking file upload flow
   - Advanced monitoring
   - Documentation updates

**Total Effort**: 34 hours (2-week sprint with 1 week buffer)

### 20.3 Risk Assessment

**Overall Risk**: **Low**

- Cal.com is mature, GDPR/SOC2 compliant service
- Integration pattern (iframe embed + webhook) is standard
- Rollback plan straightforward (revert PR, restore old form)
- Cloudflare infrastructure already handles similar patterns (Turnstile, Decap OAuth)

### 20.4 Go/No-Go Decision Factors

**Green Flags (Go Ahead)**:
- ✅ Clear business value (time savings, improved UX)
- ✅ Existing codebase architecture supports integration cleanly
- ✅ Low operational cost (<$15/month)
- ✅ Minimal infrastructure changes (CSP, environment variables)
- ✅ Established testing framework handles validation (visual regression, E2E)

**Red Flags (Reconsider)**:
- ❌ Budget constraints (<$15/month too expensive) → Use free tier (limited features)
- ❌ Data sovereignty requirements (must self-host all services) → Self-host Cal.com (adds complexity)
- ❌ Immediate production launch required (<2 weeks) → Focus on MVP only (defer file uploads)

**Verdict**: **Proceed with Cal.com integration** using recommended phased approach.

---

## Appendix A: Cal.com API Reference

### A.1 API Authentication

```bash
# All API requests require Bearer token
curl https://api.cal.com/v1/bookings \
  -H "Authorization: Bearer cal_live_xxxxxxxxxxxx"
```

### A.2 Key Endpoints

**Get Bookings**:
```bash
GET https://api.cal.com/v1/bookings?status=upcoming
```

**Get Event Types**:
```bash
GET https://api.cal.com/v1/event-types
```

**Cancel Booking**:
```bash
DELETE https://api.cal.com/v1/bookings/{bookingId}
```

### A.3 Webhook Payload Examples

**Booking Created**:
```json
{
  "triggerEvent": "BOOKING_CREATED",
  "createdAt": "2025-10-14T10:30:00.000Z",
  "payload": {
    "type": "Free Consultation",
    "title": "Free Consultation between Alice Smith and Litecky Editing",
    "description": "Discuss editing project requirements",
    "startTime": "2025-10-20T14:00:00.000Z",
    "endTime": "2025-10-20T14:30:00.000Z",
    "organizer": {
      "name": "Litecky Editing",
      "email": "contact@liteckyeditingservices.com",
      "timeZone": "America/Anchorage"
    },
    "attendees": [
      {
        "email": "alice@example.com",
        "name": "Alice Smith",
        "timeZone": "America/New_York"
      }
    ],
    "uid": "bk_abc123xyz",
    "metadata": {}
  }
}
```

---

## Appendix B: CSP Directive Reference

### B.1 Current CSP (Before Cal.com)

```
default-src 'self';
script-src 'self' 'unsafe-eval' https://challenges.cloudflare.com https://browser.sentry-cdn.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https:;
font-src 'self' data:;
connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://github.com https://www.githubstatus.com https://browser.sentry-cdn.com https://*.sentry.io;
frame-src 'self' https://challenges.cloudflare.com;
worker-src 'self' blob:;
child-src 'self' blob:;
form-action 'self' https://github.com;
base-uri 'none';
frame-ancestors 'self';
```

### B.2 Updated CSP (After Cal.com)

```diff
default-src 'self';
-script-src 'self' 'unsafe-eval' https://challenges.cloudflare.com https://browser.sentry-cdn.com;
+script-src 'self' 'unsafe-eval' https://challenges.cloudflare.com https://browser.sentry-cdn.com https://app.cal.com https://cal.com;
-style-src 'self' 'unsafe-inline';
+style-src 'self' 'unsafe-inline' https://app.cal.com https://cal.com;
img-src 'self' data: blob: https:;
font-src 'self' data:;
-connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://github.com https://www.githubstatus.com https://browser.sentry-cdn.com https://*.sentry.io;
+connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://github.com https://www.githubstatus.com https://browser.sentry-cdn.com https://*.sentry.io https://app.cal.com https://api.cal.com;
-frame-src 'self' https://challenges.cloudflare.com;
+frame-src 'self' https://challenges.cloudflare.com https://app.cal.com https://cal.com;
worker-src 'self' blob:;
child-src 'self' blob:;
form-action 'self' https://github.com;
base-uri 'none';
frame-ancestors 'self';
```

---

## Appendix C: File Locations Reference

### C.1 Files to Create

1. **`functions/api/calcom-webhook.ts`** - Webhook endpoint (102 lines estimated)
2. **`src/pages/upload/[bookingId].astro`** - Post-booking file upload page (85 lines estimated)
3. **`functions/api/upload.ts`** - File upload API endpoint (120 lines estimated)
4. **`tests/e2e/booking.spec.ts`** - Cal.com E2E tests (60 lines)
5. **`docs/CAL-COM-INTEGRATION-ANALYSIS.md`** - This document (already created)

### C.2 Files to Modify

1. **`src/pages/contact.astro`** - Replace form with Cal.com embed (111 → ~80 lines)
2. **`public/_headers`** - Update CSP directives (1 line change)
3. **`src/env.d.ts`** - Add Cal.com environment variable types (3 lines)
4. **`ENVIRONMENT.md`** - Document Cal.com variables (3 rows in table)
5. **`SECRETS.md`** - Add Cal.com secret rotation procedures (1 section)
6. **`.dev.vars.example`** - Add Cal.com example variables (3 lines)
7. **`tests/e2e/visual.spec.ts`** - Update contact page screenshot test (10 lines)
8. **`src/styles/global.css`** - Add Cal.com embed custom styles (40 lines)
9. **`workers/send-email-consumer.ts`** - Add booking email handlers (30 lines estimated)
10. **`.github/workflows/quality-gate.yml`** - Add Cal.com secrets (3 lines)
11. **`.github/workflows/e2e-visual.yml`** - Add Cal.com secrets (3 lines)
12. **`src/pages/privacy.astro`** - Add Cal.com data processing disclosure (1 paragraph)
13. **`README.md`** - Add "Online booking" to features list (1 line)
14. **`docs/onboarding.md`** - Add Cal.com local setup section (1 section)

### C.3 Files to Review (No Changes Likely)

1. **`src/layouts/BaseLayout.astro`** - May need changes if loading Cal.com script globally
2. **`src/components/Header.astro`** - Update navigation text ("Contact" → "Book Consultation")
3. **`config/cms.config.yml`** - Optional CMS integration (only if business requires it)
4. **`ARCHITECTURE.md`** - Add Cal.com integration flow diagram (optional documentation enhancement)

---

**End of Report**

**Next Steps**: Review report with stakeholders → Make go/no-go decision → If go: begin Phase 1 (Cal.com setup + frontend integration)
