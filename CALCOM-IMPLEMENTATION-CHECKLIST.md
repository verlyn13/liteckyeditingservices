# Cal.com Integration - Implementation Checklist

**Last Updated**: October 16, 2025
**Status**: Phase 3 Code Complete (Webhook Implementation) - Ready for Configuration & Testing
**Next Action**: Configure webhook in Cal.com dashboard and test endpoint

**Related Documentation**:

- **Integration Analysis**: [`docs/planning/CAL-COM-INTEGRATION-ANALYSIS.md`](docs/planning/CAL-COM-INTEGRATION-ANALYSIS.md) - Comprehensive requirements (1,922 lines)
- **API Strategy**: [`docs/planning/CAL-COM-API.md`](docs/planning/CAL-COM-API.md) - Configuration as Code blueprint (372 lines)
- **Secrets Setup**: [`docs/planning/CAL-COM-SECRETS-SETUP.md`](docs/planning/CAL-COM-SECRETS-SETUP.md) - Complete setup guide
- **Phase 1 Summary**: [`CALCOM-PHASE-1-SUMMARY.md`](CALCOM-PHASE-1-SUMMARY.md) - Secrets management completion
- **Phase 2 Guide**: [`docs/planning/CAL-COM-PHASE-2-DEPLOYMENT.md`](docs/planning/CAL-COM-PHASE-2-DEPLOYMENT.md) - Cloudflare deployment guide
- **Phase 3 Guide**: [`docs/planning/CAL-COM-PHASE-3-WEBHOOK.md`](docs/planning/CAL-COM-PHASE-3-WEBHOOK.md) - Webhook implementation guide ⭐ **NEW**

---

## ✅ Completed: Secrets Management Infrastructure

All secrets management infrastructure has been configured and is ready for Cal.com integration.

### Files Created/Updated (11 files)

#### 📝 Documentation (3 files)

- [x] **CALCOM-SETUP-NOW.md** - Quick action guide with copy-paste commands
- [x] **docs/planning/CAL-COM-SECRETS-SETUP.md** - Complete setup and verification guide
- [x] **docs/planning/CAL-COM-USERNAME.md** - Username configuration reference

#### 🔧 Scripts (3 files)

- [x] **scripts/secrets/store-calcom-secrets.sh** - Interactive secrets storage (executable, shellcheck clean)
- [x] **scripts/generate-dev-vars.sh** - Updated to include Cal.com variables
- [x] **scripts/secrets/infisical_seed_prod_from_gopass.sh** - Updated to sync Cal.com to Infisical

#### 📄 Configuration Files (5 files)

- [x] **.dev.vars.example** - Updated with Cal.com section
- [x] **ENVIRONMENT.md** - Added Cal.com to environment variable matrix
- [x] **SECRETS.md** - Added Cal.com secrets inventory and rotation procedures
- [x] **secrets/PRODUCTION_KEYS.md** - Added Cal.com to production keys list
- [x] **docs/DOCUMENTATION-INDEX.md** - Indexed all Cal.com documentation

### Validation Status

All checks passing:

- [x] **pnpm validate:all** - ✅ All validations passed
- [x] **pnpm gate:docs** - ✅ No documentation issues
- [x] **shellcheck** - ✅ All scripts pass lint checks
- [x] **Username consistency** - ✅ `litecky-editing` used consistently across 72 references in 9 files

---

## ✅ Phase 1: Store API Key (COMPLETE)

**Status**: ✅ Complete - API key stored in gopass and synced to Infisical
**Time Spent**: ~5 minutes
**Success Rate**: 100%

### Quick Setup (Recommended)

```bash
# 1. Store production API key
echo "cal_live_3853635c57f18e2c202fdd459561d410" | gopass insert -f calcom/litecky-editing/api-key

# 2. Store public embed URL
echo "https://cal.com/litecky-editing/consultation" | gopass insert -f calcom/litecky-editing/embed-url

# 3. Regenerate .dev.vars
./scripts/generate-dev-vars.sh

# 4. Verify storage
gopass show calcom/litecky-editing/api-key
grep CALCOM .dev.vars
```

### Interactive Setup (Alternative)

```bash
./scripts/secrets/store-calcom-secrets.sh
```

### Verification Checklist ✅

- [x] API key stored in gopass at `calcom/litecky-editing/api-key`
- [x] Embed URL stored in gopass at `calcom/litecky-editing/embed-url`
- [x] `.dev.vars` contains `CALCOM_API_KEY=cal_live_...`
- [x] `.dev.vars` contains `PUBLIC_CALCOM_EMBED_URL=https://cal.com/litecky-editing/consultation`
- [x] Infisical production environment synced
- [x] All verification commands passed

---

## 🚀 Phase 2: Deploy to Cloudflare Pages (10 minutes)

**Status**: ⏳ READY TO EXECUTE  
**Prerequisites**: Phase 1 complete (secrets in gopass + Infisical)  
**Detailed Guide**: [`docs/planning/CAL-COM-PHASE-2-DEPLOYMENT.md`](docs/planning/CAL-COM-PHASE-2-DEPLOYMENT.md)

### Quick Steps

```bash
# 1. Prepare secrets from Infisical (2 min)
./scripts/secrets/cloudflare_prepare_from_infisical.sh

# 2. Deploy to Cloudflare Pages (5 min)
./scripts/secrets/sync-to-cloudflare-pages.sh

# 3. Set public variables in Dashboard (3 min)
# Go to: Pages → liteckyeditingservices → Settings → Environment Variables
# Add to Production: PUBLIC_CALCOM_EMBED_URL = https://cal.com/litecky-editing/consultation
# Add to Preview: PUBLIC_CALCOM_EMBED_URL = https://cal.com/litecky-editing/consultation
```

### Integration with Existing Infrastructure ✅

Your mature Cloudflare setup:

- ✅ Project: `liteckyeditingservices`
- ✅ Infisical Project ID: `d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7`
- ✅ Existing secrets flow: gopass → Infisical → Cloudflare
- ✅ Production-tested deployment scripts

**What we're adding**: 3 new Cal.com secrets to your existing secret management (non-breaking).

### 2.3 Verification Checklist

- [ ] Infisical production environment has `CALCOM_API_KEY`
- [ ] Infisical production environment has `PUBLIC_CALCOM_EMBED_URL`
- [ ] Cloudflare Pages Production has Cal.com secrets (check dashboard)
- [ ] Cloudflare Pages Preview has Cal.com secrets (check dashboard)

---

## 🔌 Phase 3: Webhook Implementation (2-3 hours)

**Status**: ✅ CODE COMPLETE - Ready for Configuration & Testing  
**Prerequisites**: Phase 2 complete (secrets deployed to Cloudflare)  
**Detailed Guide**: [`docs/planning/CAL-COM-PHASE-3-WEBHOOK.md`](docs/planning/CAL-COM-PHASE-3-WEBHOOK.md)

### Implementation Summary

**Files Created** (3 files):

- ✅ `functions/api/calcom-webhook.ts` - Webhook endpoint with signature verification
- ✅ `src/lib/calcom-webhook.ts` - Signature verification utilities and type definitions
- ✅ `scripts/test-calcom-webhook.sh` - Automated testing script

**Files Updated** (1 file):

- ✅ `src/types/import-meta.d.ts` - Added Cal.com environment variable types

**Features Implemented**:

- ✅ HMAC-SHA256 signature verification (prevents spoofing)
- ✅ Timing-safe comparison (prevents timing attacks)
- ✅ Support for all booking events (CREATED, RESCHEDULED, CANCELLED)
- ✅ Email notification queuing via SendGrid
- ✅ Structured logging and error handling
- ✅ Sentry integration for error tracking

### 3.1 Create Webhook Endpoint ✅ COMPLETE

**Files created**:

- `functions/api/calcom-webhook.ts` - Main webhook handler
- `src/lib/calcom-webhook.ts` - Signature verification and utilities

### 3.2 Configure Webhook in Cal.com Dashboard

1. Go to: https://app.cal.com/settings/developer/webhooks
2. Click **"Add Webhook"**
3. Configure webhook:
   - **Subscriber URL**: `https://www.liteckyeditingservices.com/api/calcom-webhook` (www required; apex redirects)
   - **Events**: Select:
     - ✅ BOOKING_CREATED
     - ✅ BOOKING_RESCHEDULED
     - ✅ BOOKING_CANCELLED
4. Click **"Create"**
5. Copy the **Webhook Secret** (format: `whsec_xxxxxxxxxxxx`)

### 3.3 Store Webhook Secret

```bash
# Store the webhook secret (replace with actual value)
echo "whsec_YOUR_SECRET_HERE" | gopass insert -f calcom/litecky-editing/webhook-secret

# Sync to all environments
./scripts/generate-dev-vars.sh
./scripts/secrets/infisical_seed_prod_from_gopass.sh
./scripts/secrets/cloudflare_prepare_from_infisical.sh
./scripts/secrets/sync-to-cloudflare-pages.sh
```

### 3.4 Test Webhook

**Automated Testing** (Recommended):

```bash
# Test local development endpoint
./scripts/test-calcom-webhook.sh local

# Test production endpoint
./scripts/test-calcom-webhook.sh production
```

**Manual Testing**:

```bash
# Local testing (with pnpm dev running)
# Use test script for proper signature generation
./scripts/test-calcom-webhook.sh local

# Production testing (after deployment)
# Create a test booking at: https://cal.com/litecky-editing/consultation
# Check webhook delivery in Cal.com dashboard
```

### 3.5 Verification Checklist

**Code Implementation**:

- [x] Webhook endpoint implemented at `functions/api/calcom-webhook.ts`
- [x] Signature verification implemented in `src/lib/calcom-webhook.ts`
- [x] Type definitions added to `src/types/import-meta.d.ts`
- [x] Test script created at `scripts/test-calcom-webhook.sh`

**Configuration** (To Do):

- [ ] Webhook configured in Cal.com dashboard
- [ ] Webhook secret stored in gopass
- [ ] Webhook secret synced to Infisical and Cloudflare

**Testing** (To Do):

- [ ] Local test passes: `./scripts/test-calcom-webhook.sh local`
- [ ] Production test passes: `./scripts/test-calcom-webhook.sh production`
- [ ] Test booking triggers webhook successfully
- [ ] Webhook logs show successful delivery in Cal.com dashboard
- [ ] Email notification received

---

## 🎨 Phase 4: Frontend Integration (2-3 hours)

Replace the contact form with Cal.com inline embed.

### 4.1 Update Contact Page

**File to modify**: `src/pages/contact.astro`

Add Cal.com embed using `@calcom/embed-react` or inline embed script. See [CAL-COM-INTEGRATION-ANALYSIS.md](docs/planning/CAL-COM-INTEGRATION-ANALYSIS.md) lines 680-843 for implementation.

### 4.2 Update CSP Headers

**File to modify**: `functions/_middleware.ts`

Add Cal.com domains to Content Security Policy:

```typescript
"script-src": [
  // ... existing sources ...
  "'sha256-CALCOM_INLINE_SCRIPT_HASH'",
  "https://app.cal.com",
],
"frame-src": [
  "'self'",
  "https://cal.com",
  "https://app.cal.com",
],
"connect-src": [
  // ... existing sources ...
  "https://api.cal.com",
  "https://app.cal.com",
],
```

### 4.3 Add Type Definitions ✅ COMPLETE

**File updated**: `src/types/import-meta.d.ts`

```typescript
interface ImportMetaEnv {
  // ... existing vars ...

  // Cal.com Integration
  readonly CALCOM_API_KEY: string;
  readonly CALCOM_WEBHOOK_SECRET: string;
  readonly PUBLIC_CALCOM_EMBED_URL: string;
}
```

### 4.4 Test Embed Loading

```bash
# Start dev server
pnpm dev

# Visit contact page
open http://localhost:4321/contact

# Verify:
# - Cal.com embed loads without CSP errors
# - Booking flow works end-to-end
# - Console shows no errors
```

### 4.5 Verification Checklist

- [ ] Contact page displays Cal.com embed
- [ ] No CSP errors in browser console
- [ ] Embed is responsive on mobile/tablet/desktop
- [ ] Booking flow completes successfully
- [ ] Confirmation email received (if configured)
- [ ] TypeScript has no errors for Cal.com env vars

---

## 🧪 Phase 5: Testing (1-2 hours)

Comprehensive testing before production deployment.

### 5.1 E2E Tests

Create Playwright tests for Cal.com integration:

**File to create**: `tests/e2e/calcom-integration.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Cal.com Integration', () => {
  test('should load Cal.com embed on contact page', async ({ page }) => {
    await page.goto('/contact');

    // Wait for Cal.com iframe to load
    const calcomIframe = page.frameLocator('iframe[src*="cal.com"]');
    await expect(calcomIframe.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('should not have CSP violations', async ({ page }) => {
    const cspViolations: string[] = [];
    page.on('console', (msg) => {
      if (msg.text().includes('Content Security Policy')) {
        cspViolations.push(msg.text());
      }
    });

    await page.goto('/contact');
    await page.waitForTimeout(3000);

    expect(cspViolations).toHaveLength(0);
  });
});
```

### 5.2 Accessibility Tests

```bash
# Run pa11y on contact page
pnpm test:a11y -- --url http://localhost:4321/contact
```

### 5.3 Visual Regression Tests

```bash
# Create baseline
pnpm test:visual:baseline -- contact.astro

# Run comparison
pnpm test:visual
```

### 5.4 Manual Testing Checklist

- [ ] Desktop: Embed loads and booking works
- [ ] Tablet: Responsive layout, no overflow
- [ ] Mobile: Touch interactions work, readable text
- [ ] Keyboard navigation: All focusable elements accessible
- [ ] Screen reader: Proper ARIA labels and announcements
- [ ] Slow connection: Graceful loading state
- [ ] Embed failure: Fallback UI shown (if implemented)

---

## 📋 Phase 6: Documentation Updates (30 minutes)

Update documentation to reflect Cal.com integration.

### 6.1 Update README.md

Add Cal.com to the **Features** section:

```markdown
## Features

- ... (existing features)
- **Cal.com Integration**: Inline scheduling with automatic email confirmations
```

### 6.2 Update ARCHITECTURE.md

Add Cal.com to system diagram and integrations section.

### 6.3 Update CHANGELOG.md

```markdown
## [Unreleased]

### Added

- Cal.com integration for appointment scheduling on contact page
- Webhook endpoint for booking event handling
- Email notifications for booking confirmations (via queue)
```

### 6.4 Create Playbook

**File to create**: `docs/playbooks/calcom-troubleshooting.md`

Document common issues:

- Embed not loading (CSP issues)
- Webhook delivery failures
- API rate limiting
- Email notification delays

### 6.5 Update SECRETS.md

Already complete! Cal.com secrets documented with rotation procedures.

### 6.6 Verification Checklist

- [ ] README.md mentions Cal.com integration
- [ ] ARCHITECTURE.md includes Cal.com in system diagram
- [ ] CHANGELOG.md documents Cal.com addition
- [ ] Playbook created for Cal.com troubleshooting
- [ ] All documentation cross-references are valid

---

## 🚢 Phase 7: Production Deployment (30 minutes)

Deploy Cal.com integration to production.

### 7.1 Pre-Deployment Checklist

- [ ] All secrets stored in gopass
- [ ] All secrets synced to Infisical
- [ ] All secrets deployed to Cloudflare Pages
- [ ] Webhook configured in Cal.com dashboard
- [ ] All E2E tests passing locally
- [ ] Visual regression tests show acceptable changes
- [ ] Documentation updated

### 7.2 Deploy to Preview

```bash
# Create feature branch
git checkout -b feature/calcom-integration

# Commit changes
git add .
git commit -m "feat: add Cal.com scheduling integration

- Add Cal.com inline embed to contact page
- Implement webhook endpoint for booking events
- Update CSP headers to allow Cal.com domains
- Add E2E and visual regression tests
- Update documentation

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push -u origin feature/calcom-integration

# Cloudflare automatically creates preview deployment
```

### 7.3 Test Preview Deployment

```bash
# Get preview URL from Cloudflare dashboard or GitHub PR
# Example: https://abc123.liteckyeditingservices.pages.dev

# Test embed loading
open https://abc123.liteckyeditingservices.pages.dev/contact

# Test webhook delivery
# Create test booking on preview site
# Check Cal.com webhook logs for delivery confirmation
```

### 7.4 Deploy to Production

```bash
# Merge to main
git checkout main
git merge feature/calcom-integration
git push origin main

# Cloudflare automatically deploys to production
# Monitor deployment in dashboard
```

### 7.5 Post-Deployment Verification

```bash
# Test production site
open https://liteckyeditingservices.com/contact

# Create real booking to verify:
# - Embed loads correctly
# - Booking is created in Cal.com
# - Webhook is delivered
# - Confirmation email is sent
# - Booking appears in Cal.com dashboard

# Monitor Sentry for any errors
open https://sentry.io/organizations/happy-patterns-llc/projects/
```

### 7.6 Production Checklist

- [ ] Production site loads Cal.com embed without errors
- [ ] Test booking created successfully
- [ ] Webhook delivered to production endpoint
- [ ] Confirmation email received
- [ ] Booking visible in Cal.com dashboard
- [ ] No Sentry errors related to Cal.com
- [ ] Page load time acceptable (< 3s)
- [ ] Lighthouse score > 90

---

## 🔒 Phase 8: Security & Maintenance (Ongoing)

Post-deployment security and maintenance tasks.

### 8.1 API Key Rotation (Every 90 Days)

See [SECRETS.md](SECRETS.md) lines 235-260 for complete rotation procedure.

```bash
# 1. Generate new API key in Cal.com dashboard
# 2. Store new key in gopass
echo "cal_live_NEW_KEY_HERE" | gopass insert -f calcom/litecky-editing/api-key

# 3. Sync to all environments
./scripts/generate-dev-vars.sh
./scripts/secrets/infisical_seed_prod_from_gopass.sh
./scripts/secrets/cloudflare_prepare_from_infisical.sh
./scripts/secrets/sync-to-cloudflare-pages.sh

# 4. Test production site
open https://liteckyeditingservices.com/contact

# 5. Revoke old key in Cal.com dashboard
```

### 8.2 Monitoring

Add to monitoring dashboard:

- Cal.com API response times
- Webhook delivery success rate
- Booking creation rate
- Failed booking attempts

### 8.3 Webhook Secret Rotation

```bash
# 1. Generate new webhook secret in Cal.com dashboard
# 2. Store new secret
echo "whsec_NEW_SECRET_HERE" | gopass insert -f calcom/litecky-editing/webhook-secret

# 3. Sync to all environments
./scripts/generate-dev-vars.sh
./scripts/secrets/infisical_seed_prod_from_gopass.sh
./scripts/secrets/cloudflare_prepare_from_infisical.sh
./scripts/secrets/sync-to-cloudflare-pages.sh

# 4. Test webhook delivery
# Create test booking and verify webhook is received
```

### 8.4 Regular Checks

**Weekly**:

- [ ] Check webhook delivery logs in Cal.com dashboard
- [ ] Verify no failed webhook deliveries
- [ ] Check Sentry for Cal.com-related errors

**Monthly**:

- [ ] Review booking analytics
- [ ] Check API rate limit usage
- [ ] Verify all bookings are being processed

**Quarterly (90 days)**:

- [ ] Rotate API key (see 8.1)
- [ ] Review and update documentation
- [ ] Check for Cal.com SDK updates

---

## 📊 Success Metrics

Track these metrics to measure Cal.com integration success:

### Technical Metrics

- **Embed Load Time**: < 2 seconds
- **Webhook Delivery Success**: > 99.5%
- **API Error Rate**: < 0.1%
- **Page Load Impact**: < 300ms added to contact page

### Business Metrics

- **Booking Conversion Rate**: Track pre/post integration
- **Booking Completion Rate**: Track abandoned vs completed
- **Time to First Booking**: Measure from page load to booking
- **Mobile Booking Rate**: Track mobile vs desktop bookings

---

## 🆘 Troubleshooting Reference

### Common Issues

| Issue                     | Solution                                     | Reference                                                                                        |
| ------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Embed not loading         | Check CSP headers in `_middleware.ts`        | [CAL-COM-INTEGRATION-ANALYSIS.md](docs/planning/CAL-COM-INTEGRATION-ANALYSIS.md) lines 1036-1131 |
| Webhook delivery failures | Verify webhook secret in Cloudflare env vars | [CAL-COM-SECRETS-SETUP.md](docs/planning/CAL-COM-SECRETS-SETUP.md) lines 207-226                 |
| API rate limiting         | Implement caching, reduce API calls          | Cal.com API docs                                                                                 |
| Email delays              | Check queue consumer logs                    | [ERROR-ALERTING.md](docs/infrastructure/ERROR-ALERTING.md)                                       |

### Support Resources

- **Cal.com Documentation**: https://cal.com/docs
- **Cal.com API Reference**: https://cal.com/docs/api-reference
- **Community Support**: https://cal.com/slack
- **Internal Docs**: [docs/planning/CAL-COM-INTEGRATION-ANALYSIS.md](docs/planning/CAL-COM-INTEGRATION-ANALYSIS.md)

---

## 📚 Related Documentation

- **Quick Setup**: [CALCOM-SETUP-NOW.md](CALCOM-SETUP-NOW.md) ← **Start here!**
- **Secrets Setup**: [docs/planning/CAL-COM-SECRETS-SETUP.md](docs/planning/CAL-COM-SECRETS-SETUP.md)
- **Complete Integration Analysis**: [docs/planning/CAL-COM-INTEGRATION-ANALYSIS.md](docs/planning/CAL-COM-INTEGRATION-ANALYSIS.md)
- **Username Configuration**: [docs/planning/CAL-COM-USERNAME.md](docs/planning/CAL-COM-USERNAME.md)
- **Secrets Management**: [SECRETS.md](SECRETS.md)
- **Environment Variables**: [ENVIRONMENT.md](ENVIRONMENT.md)
- **Implementation Roadmap**: [docs/planning/IMPLEMENTATION-ROADMAP.md](docs/planning/IMPLEMENTATION-ROADMAP.md)

---

**Next Immediate Action**: Store API key in gopass (see [CALCOM-SETUP-NOW.md](CALCOM-SETUP-NOW.md))
