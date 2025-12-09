# Cal.com Secrets Setup Guide

**Date**: October 16, 2025  
**Status**: Ready for implementation

---

## Quick Setup (One-Time)

You have a production Cal.com API key ready to store. Follow these steps to configure it across all environments.

---

## Step 1: Store Production API Key in gopass

```bash
# Store the production API key
echo "cal_live_3853635c57f18e2c202fdd459561d410" | gopass insert -f calcom/litecky-editing/api-key

# Verify it's stored
gopass show calcom/litecky-editing/api-key
```

**Expected output**: `cal_live_3853635c57f18e2c202fdd459561d410`

---

## Step 2: Store Webhook Secret (when available)

When you configure the webhook in Cal.com dashboard, store the secret:

```bash
# After creating webhook at https://app.cal.com/settings/developer/webhooks
# Copy the webhook secret (format: whsec_xxxxxxxxxxxx)
echo "whsec_YOUR_SECRET_HERE" | gopass insert -f calcom/litecky-editing/webhook-secret

# Verify
gopass show calcom/litecky-editing/webhook-secret
```

---

## Step 3: Store Public Embed URL

```bash
# Store the public booking URL
echo "https://cal.com/litecky-editing/consultation" | gopass insert -f calcom/litecky-editing/embed-url

# Verify
gopass show calcom/litecky-editing/embed-url
```

---

## Step 4: Regenerate Local Development Variables

```bash
# This will add Cal.com variables to your .dev.vars file
./scripts/generate-dev-vars.sh
```

**Expected additions to `.dev.vars`**:
```bash
# Cal.com Configuration (Scheduling)
CALCOM_API_KEY=cal_live_3853635c57f18e2c202fdd459561d410
CALCOM_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
PUBLIC_CALCOM_EMBED_URL=https://cal.com/litecky-editing/consultation
```

---

## Step 5: Sync to Infisical (Production Source of Truth)

```bash
# Seed Infisical production environment from gopass
./scripts/secrets/infisical_seed_prod_from_gopass.sh
```

**Expected output**:
```
Seeding Infisical (d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7, env=prod) from gopass...
✓ Queued PUBLIC_TURNSTILE_SITE_KEY
✓ Queued TURNSTILE_SECRET_KEY
...
✓ Queued CALCOM_API_KEY
✓ Queued CALCOM_WEBHOOK_SECRET
✓ Queued PUBLIC_CALCOM_EMBED_URL
---
Seeded 18 keys into Infisical (d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7, prod).
```

---

## Step 6: Deploy to Cloudflare Pages

### Option A: Automated (Recommended)

```bash
# Pull from Infisical and prepare for Cloudflare
./scripts/secrets/cloudflare_prepare_from_infisical.sh

# Upload to both Production and Preview environments
./scripts/secrets/sync-to-cloudflare-pages.sh
```

### Option B: Manual (via Dashboard)

Navigate to: **Cloudflare Dashboard → Pages → liteckyeditingservices → Settings → Environment Variables**

**Production Environment**:
- Add Secret: `CALCOM_API_KEY` = `cal_live_3853635c57f18e2c202fdd459561d410`
- Add Secret: `CALCOM_WEBHOOK_SECRET` = `whsec_xxxxxxxxxxxx`
- Add Variable: `PUBLIC_CALCOM_EMBED_URL` = `https://cal.com/litecky-editing/consultation`

**Preview Environment**:
- Same values as Production (or use test account if available)

---

## Step 7: Add to Environment Type Definitions

The environment variable types are already configured in:

**File**: `src/env.d.ts`

Add these types (if not already present):

```typescript
interface ImportMetaEnv {
  // ... existing vars ...
  
  // Cal.com
  readonly CALCOM_API_KEY: string;
  readonly CALCOM_WEBHOOK_SECRET: string;
  readonly PUBLIC_CALCOM_EMBED_URL: string;
}
```

---

## Verification Checklist

After completing all steps, verify:

- [ ] **gopass**: `gopass ls calcom/` shows 3 entries
  - `calcom/litecky-editing/api-key`
  - `calcom/litecky-editing/webhook-secret`
  - `calcom/litecky-editing/embed-url`

- [ ] **Local dev**: `.dev.vars` contains Cal.com variables
  ```bash
  grep CALCOM .dev.vars
  ```

- [ ] **Infisical**: Production environment has Cal.com secrets
  ```bash
  infisical secrets get CALCOM_API_KEY --env prod --projectId d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7
  ```

- [ ] **Cloudflare Pages**: Environment variables visible in dashboard
  - Production: 3 Cal.com variables
  - Preview: 3 Cal.com variables

- [ ] **Type safety**: No TypeScript errors when accessing `import.meta.env.CALCOM_API_KEY`

---

## Test the Integration

Once secrets are deployed:

1. **Local development**:
   ```bash
   pnpm dev
   # Visit http://localhost:4321/contact
   # Cal.com embed should load (if page is implemented)
   ```

2. **Preview environment**:
   - Push to a feature branch
   - Cloudflare builds preview
   - Test Cal.com embed loads
   - Test webhook endpoint (if implemented)

3. **Production**:
   - Merge to main
   - Automatic deployment
   - Verify Cal.com booking flow works end-to-end

---

## Troubleshooting

### API Key Not Working

```bash
# Verify the key is correct
gopass show calcom/litecky-editing/api-key

# Test the API key manually
curl https://api.cal.com/v1/me \
  -H "Authorization: Bearer $(gopass show -o calcom/litecky-editing/api-key)"
```

**Expected response**: Your Cal.com user profile (JSON)

### Webhook Secret Mismatch

```bash
# Verify the secret matches Cal.com dashboard
gopass show calcom/litecky-editing/webhook-secret

# Compare with: https://app.cal.com/settings/developer/webhooks
```

### Environment Variables Not Loading

```bash
# Regenerate .dev.vars
./scripts/generate-dev-vars.sh

# Check Cloudflare Pages deployment logs
# Dashboard → Pages → liteckyeditingservices → Deployments → [Latest] → View logs
```

---

## Alternative: Interactive Setup Script

For a guided setup experience:

```bash
./scripts/secrets/store-calcom-secrets.sh
```

This script will prompt you for:
- Production API key
- Production webhook secret
- Production embed URL
- Test/development credentials (optional)

---

## Security Notes

- ✅ **API Key Format**: `cal_live_` prefix indicates production key
- ✅ **Never commit**: `.dev.vars` is gitignored
- ✅ **Encrypted at rest**: Cloudflare Pages secrets are encrypted
- ✅ **Rotation**: Rotate every 90 days (same as GitHub OAuth)
- ✅ **Least privilege**: API key has minimal required permissions

---

## Related Documentation

- **Secrets Management**: `SECRETS.md` (rotation procedures)
- **Environment Variables**: `ENVIRONMENT.md` (variable matrix)
- **Cal.com Integration**: `docs/planning/CAL-COM-INTEGRATION-ANALYSIS.md` (comprehensive requirements)
- **Cal.com API Strategy**: `docs/planning/CAL-COM-API.md` (Configuration as Code blueprint)
- **Infisical Workflow**: `docs/INFISICAL-QUICKSTART.md`

---

## Next Steps

After secrets are configured:

1. ✅ Implement Cal.com embed on contact page (`src/pages/contact.astro`)
2. ✅ Create webhook endpoint (`functions/api/calcom-webhook.ts`)
3. ✅ Update CSP headers to allow Cal.com domains
4. ✅ Test booking flow end-to-end
5. ✅ Configure webhook in Cal.com dashboard pointing to your endpoint
