# Cal.com Phase 2: Cloudflare Pages Deployment

**Date**: October 16, 2025  
**Status**: Ready to Execute  
**Estimated Time**: 10 minutes  
**Prerequisites**: Phase 1 Complete (secrets in gopass + Infisical)

---

## 📋 Overview

This guide deploys Cal.com secrets to your **existing mature Cloudflare Pages setup** using your established Infisical → Cloudflare workflow.

### **Your Current Infrastructure** ✅

- **Project Name**: `liteckyeditingservices`
- **Infisical Project ID**: `d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7`
- **Environments**: Production + Preview
- **Secrets Flow**: gopass → Infisical → Cloudflare Pages
- **Deployment Scripts**: Mature, tested, production-ready

### **What We're Adding**

3 new Cal.com secrets to your existing secret management:
- `CALCOM_API_KEY` (secret, encrypted)
- `CALCOM_WEBHOOK_SECRET` (secret, encrypted) - *Not yet configured*
- `PUBLIC_CALCOM_EMBED_URL` (public variable)

---

## ✅ Phase 1 Verification

Before proceeding, verify Phase 1 completion:

```bash
# 1. Check gopass storage
gopass ls calcom/

# Expected output:
# calcom/
# └── litecky-editing/
#     ├── api-key
#     └── embed-url

# 2. Verify Infisical sync
infisical secrets get CALCOM_API_KEY --env prod --projectId d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7

# Expected: Should return the API key (value hidden in output)

# 3. Verify PUBLIC_CALCOM_EMBED_URL
infisical secrets get PUBLIC_CALCOM_EMBED_URL --env prod --projectId d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7

# Expected: https://cal.com/litecky-editing/consultation
```

**If any verification fails**, return to Phase 1:
- Run: `./scripts/secrets/infisical_seed_prod_from_gopass.sh`
- See: [`CALCOM-IMPLEMENTATION-CHECKLIST.md`](../../CALCOM-IMPLEMENTATION-CHECKLIST.md)

---

## 🚀 Deployment Steps

### **Step 1: Prepare Secrets from Infisical** (2 minutes)

This script pulls all production secrets from Infisical and splits them into two files:

```bash
./scripts/secrets/cloudflare_prepare_from_infisical.sh
```

**What it does**:
- Exports all secrets from Infisical `prod` environment
- Creates `secrets/public.env` (PUBLIC_* variables)
- Creates `secrets/secrets.env` (encrypted secrets)
- **Includes your new Cal.com secrets** along with existing ones

**Expected output**:
```
Exporting Infisical secrets (projectId=d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7, env=prod)
Splitting into public.env and secrets.env
✓ Prepared: secrets/public.env (X vars), secrets/secrets.env (Y vars)
Next: Add public.env as Environment Variables and secrets.env as Secrets in Cloudflare Pages (Production).
```

**Verify**:
```bash
# Check that Cal.com secrets are present
grep CALCOM secrets/secrets.env
# Expected: CALCOM_API_KEY=cal_live_...

grep CALCOM secrets/public.env
# Expected: PUBLIC_CALCOM_EMBED_URL=https://cal.com/litecky-editing/consultation
```

---

### **Step 2: Deploy Secrets to Cloudflare Pages** (5 minutes)

This script uses `wrangler` to upload encrypted secrets to both Production and Preview environments:

```bash
./scripts/secrets/sync-to-cloudflare-pages.sh
```

**What it does**:
1. Validates prerequisites (wrangler installed, files exist)
2. Sets encrypted secrets for **Production** environment
3. Sets encrypted secrets for **Preview** environment
4. Displays public variables that need manual dashboard configuration

**Expected output**:
```
🚀 Syncing secrets to Cloudflare Pages: liteckyeditingservices

✅ Prerequisites OK

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏭 PRODUCTION ENVIRONMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔒 Setting secrets for production environment...
  • Setting CALCOM_API_KEY...
  • Setting CALCOM_WEBHOOK_SECRET...  (will fail - not configured yet)
  • Setting GITHUB_CLIENT_ID...
  • Setting GITHUB_CLIENT_SECRET...
  • Setting SENDGRID_API_KEY...
  • Setting TURNSTILE_SECRET_KEY...
  • Setting SENTRY_AUTH_TOKEN...
  ✅ Secrets set for production

📋 Public environment variables (secrets/public.env):
  • PUBLIC_CALCOM_EMBED_URL=(value hidden)
  • PUBLIC_TURNSTILE_SITE_KEY=(value hidden)
  • PUBLIC_SENTRY_DSN=(value hidden)

  ℹ️  Set these manually in Cloudflare Dashboard:
     Pages → liteckyeditingservices → Settings → Environment Variables → Production

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 PREVIEW ENVIRONMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔒 Setting secrets for preview environment...
  [Same as production]
  ✅ Secrets set for preview

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Secrets sync complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Note**: `CALCOM_WEBHOOK_SECRET` will show a warning because it's not configured yet (Phase 3).

---

### **Step 3: Set Public Variables in Dashboard** (3 minutes)

The `sync-to-cloudflare-pages.sh` script **cannot** set public environment variables via CLI. You must set these manually in the Cloudflare Dashboard.

#### **3.1 Navigate to Cloudflare Dashboard**

1. Go to: https://dash.cloudflare.com/
2. Select: **Pages** → **liteckyeditingservices**
3. Go to: **Settings** → **Environment variables**

#### **3.2 Add Production Variables**

Click **"Add variable"** for Production environment:

| Variable Name | Value | Type |
|---------------|-------|------|
| `PUBLIC_CALCOM_EMBED_URL` | `https://cal.com/litecky-editing/consultation` | Plain text |

**Note**: Your existing public variables (PUBLIC_TURNSTILE_SITE_KEY, PUBLIC_SENTRY_DSN, etc.) should already be set. Only add the new Cal.com variable.

#### **3.3 Add Preview Variables**

Click **"Add variable"** for Preview environment (same value):

| Variable Name | Value | Type |
|---------------|-------|------|
| `PUBLIC_CALCOM_EMBED_URL` | `https://cal.com/litecky-editing/consultation` | Plain text |

**Save changes** after adding variables.

---

## ✅ Verification

### **1. Verify Secrets in Dashboard**

**Production Secrets**:
1. Go to: Pages → liteckyeditingservices → Settings → Environment variables → Production
2. Under **"Encrypted"** section, verify:
   - ✅ `CALCOM_API_KEY` is listed (value hidden)
   - ✅ `GITHUB_CLIENT_ID` (existing)
   - ✅ `GITHUB_CLIENT_SECRET` (existing)
   - ✅ `SENDGRID_API_KEY` (existing)
   - ✅ `TURNSTILE_SECRET_KEY` (existing)
   - ✅ `SENTRY_AUTH_TOKEN` (existing)

**Production Variables**:
Under **"Plain text"** section, verify:
   - ✅ `PUBLIC_CALCOM_EMBED_URL` = `https://cal.com/litecky-editing/consultation`
   - ✅ `PUBLIC_TURNSTILE_SITE_KEY` (existing)
   - ✅ `PUBLIC_SENTRY_DSN` (existing)
   - ✅ `ENVIRONMENT` = `production` (existing)

**Preview Environment**:
Repeat the same checks for Preview environment.

---

### **2. Trigger Test Deployment**

Force a new deployment to pick up the secrets:

```bash
# Option A: Via Git (recommended)
git commit --allow-empty -m "test: verify Cal.com secrets deployment"
git push origin main

# Option B: Via Dashboard
# Pages → liteckyeditingservices → Deployments → "Retry deployment"
```

---

### **3. Verify Secrets in Deployment**

Once deployment completes:

```bash
# Check deployment logs
pnpm wrangler pages deployment list --project-name=liteckyeditingservices | head -10

# Get latest deployment ID
DEPLOYMENT_ID=$(pnpm wrangler pages deployment list --project-name=liteckyeditingservices --json | jq -r '.[0].id')

# View deployment details
pnpm wrangler pages deployment tail $DEPLOYMENT_ID
```

**Look for**:
- No errors related to missing environment variables
- Successful build completion
- No Cal.com-related warnings

---

### **4. Test in Development**

Verify local development still works:

```bash
# Regenerate .dev.vars (should already have Cal.com vars from Phase 1)
./scripts/generate-dev-vars.sh

# Verify Cal.com vars present
grep CALCOM .dev.vars

# Expected output:
# CALCOM_API_KEY=cal_live_3853635c57f18e2c202fdd459561d410
# CALCOM_WEBHOOK_SECRET=# Missing calcom webhook-secret
# PUBLIC_CALCOM_EMBED_URL=https://cal.com/litecky-editing/consultation

# Start dev server
pnpm dev

# Verify no errors in console
```

---

## 🎯 Success Criteria

Phase 2 is complete when:

- [x] `secrets/public.env` and `secrets/secrets.env` generated from Infisical
- [x] Encrypted secrets uploaded to Production environment
- [x] Encrypted secrets uploaded to Preview environment
- [x] `PUBLIC_CALCOM_EMBED_URL` set in Production dashboard
- [x] `PUBLIC_CALCOM_EMBED_URL` set in Preview dashboard
- [x] Test deployment completes successfully
- [x] No environment variable errors in deployment logs
- [x] Local development still works

---

## 🔧 Troubleshooting

### **Issue: `wrangler` not found**

```bash
# Install wrangler
pnpm add -D wrangler

# Verify installation
pnpm wrangler --version
```

### **Issue: `wrangler` not authenticated**

```bash
# Login to Cloudflare
pnpm wrangler login

# Verify authentication
pnpm wrangler whoami
```

### **Issue: Infisical export fails**

```bash
# Check Infisical login
infisical login --domain https://secrets.jefahnierocks.com/api

# Verify project access
infisical export --projectId d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7 --env prod --format dotenv | head -5
```

### **Issue: Secret already exists warning**

This is **normal** for existing secrets. The script will show:
```
⚠️  Failed to set GITHUB_CLIENT_ID (may already exist)
```

This means the secret was already set in a previous deployment. Only new secrets (like `CALCOM_API_KEY`) will be added.

### **Issue: CALCOM_WEBHOOK_SECRET fails**

This is **expected** in Phase 2. The webhook secret will be configured in Phase 3 after you set up the webhook in Cal.com dashboard.

---

## 📊 What Changed

### **Before Phase 2**
- Cal.com secrets: ✅ In gopass
- Cal.com secrets: ✅ In Infisical
- Cal.com secrets: ❌ Not in Cloudflare Pages

### **After Phase 2**
- Cal.com secrets: ✅ In gopass
- Cal.com secrets: ✅ In Infisical
- Cal.com secrets: ✅ In Cloudflare Pages (Production + Preview)
- Ready for: Phase 3 (Webhook Configuration)

---

## 🔐 Security Notes

- ✅ All secrets transmitted via encrypted channels
- ✅ Secrets stored encrypted at rest in Cloudflare
- ✅ No secrets exposed in logs or shell history
- ✅ `secrets/*.env` files are gitignored
- ✅ Follows your existing security patterns

---

## 📚 Related Documentation

- **Phase 1 Summary**: [`CALCOM-PHASE-1-SUMMARY.md`](../../CALCOM-PHASE-1-SUMMARY.md)
- **Implementation Checklist**: [`CALCOM-IMPLEMENTATION-CHECKLIST.md`](../../CALCOM-IMPLEMENTATION-CHECKLIST.md)
- **Infisical Workflow**: [`docs/INFISICAL-QUICKSTART.md`](../INFISICAL-QUICKSTART.md)
- **Secrets Management**: [`SECRETS.md`](../../SECRETS.md)
- **Cloudflare Infrastructure**: [`docs/infrastructure/CLOUDFLARE-MANAGEMENT.md`](../infrastructure/CLOUDFLARE-MANAGEMENT.md)

---

## 🚀 Next Steps (Phase 3)

After Phase 2 is complete:

1. **Configure webhook in Cal.com dashboard**
   - Go to: https://app.cal.com/settings/developer/webhooks
   - Create webhook pointing to: `https://www.liteckyeditingservices.com/api/calcom-webhook`
   - Copy webhook secret

2. **Store webhook secret**
   ```bash
   echo "whsec_YOUR_SECRET" | gopass insert -f calcom/litecky-editing/webhook-secret
   ```

3. **Re-sync to Cloudflare**
   ```bash
   ./scripts/secrets/infisical_seed_prod_from_gopass.sh
   ./scripts/secrets/cloudflare_prepare_from_infisical.sh
   ./scripts/secrets/sync-to-cloudflare-pages.sh
   ```

See: [`CALCOM-IMPLEMENTATION-CHECKLIST.md`](../../CALCOM-IMPLEMENTATION-CHECKLIST.md) Phase 3 for details.

---

**Phase 2 Estimated Time**: 10 minutes  
**Phase 2 Complexity**: Low (uses existing infrastructure)  
**Phase 2 Risk**: Minimal (non-breaking addition to existing secrets)
