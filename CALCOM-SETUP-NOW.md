# 🚀 Cal.com API Key Setup - Action Required

**API Key Provided**: `cal_live_3853635c57f18e2c202fdd459561d410`  
**Status**: Ready to store  
**Date**: October 16, 2025

---

## ⚡ Quick Start (Copy & Paste)

Run these commands in your terminal to store the Cal.com API key:

```bash
# 1. Store production API key in gopass
echo "cal_live_3853635c57f18e2c202fdd459561d410" | gopass insert -f calcom/litecky-editing/api-key

# 2. Store public embed URL
echo "https://cal.com/litecky-editing/consultation" | gopass insert -f calcom/litecky-editing/embed-url

# 3. Regenerate local development variables
./scripts/generate-dev-vars.sh

# 4. Sync to Infisical (production source of truth)
./scripts/secrets/infisical_seed_prod_from_gopass.sh
```

---

## ✅ What Just Happened

After running the above commands:

1. **gopass** now stores your Cal.com API key securely
2. **`.dev.vars`** has been updated with Cal.com configuration
3. **Infisical** (production secrets) has been synced
4. You're ready to use the API key in development

---

## 📋 Still Need To Do

### Before Cal.com Integration Works:

1. **Get Webhook Secret** (when you configure the webhook):
   - Go to: https://app.cal.com/settings/developer/webhooks
   - Create webhook pointing to: `https://liteckyeditingservices.com/api/calcom-webhook`
   - Copy the webhook secret (format: `whsec_xxxxxxxxxxxx`)
   - Store it:
     ```bash
     echo "whsec_YOUR_SECRET_HERE" | gopass insert -f calcom/litecky-editing/webhook-secret
     ```

2. **Deploy Secrets to Cloudflare Pages**:

   ```bash
   ./scripts/secrets/cloudflare_prepare_from_infisical.sh
   ./scripts/secrets/sync-to-cloudflare-pages.sh
   ```

3. **Add Type Definitions** (if not already present):

   Edit `src/env.d.ts` and add:

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

## 🔍 Verify Setup

```bash
# Check gopass storage
gopass ls calcom/

# Expected output:
# calcom/
# └── litecky-editing
#     ├── api-key
#     └── embed-url

# View the API key (to confirm)
gopass show calcom/litecky-editing/api-key

# Check .dev.vars was updated
grep CALCOM .dev.vars

# Expected output:
# CALCOM_API_KEY=cal_live_3853635c57f18e2c202fdd459561d410
# CALCOM_WEBHOOK_SECRET=# Missing calcom webhook-secret
# PUBLIC_CALCOM_EMBED_URL=https://cal.com/litecky-editing/consultation
```

---

## 🧪 Test the API Key

```bash
# Test that the API key works
curl https://api.cal.com/v1/me \
  -H "Authorization: Bearer cal_live_3853635c57f18e2c202fdd459561d410"
```

**Expected**: JSON response with your Cal.com user profile

---

## 📚 Documentation Updated

The following files have been updated to include Cal.com configuration:

- ✅ `SECRETS.md` - Added Cal.com to inventory and rotation procedures
- ✅ `ENVIRONMENT.md` - Added Cal.com variables to matrix
- ✅ `.dev.vars.example` - Added Cal.com example configuration
- ✅ `scripts/generate-dev-vars.sh` - Now includes Cal.com variables
- ✅ `scripts/secrets/infisical_seed_prod_from_gopass.sh` - Syncs Cal.com to Infisical
- ✅ `secrets/PRODUCTION_KEYS.md` - Added Cal.com to production keys list
- ✅ `scripts/secrets/store-calcom-secrets.sh` - New interactive setup script
- ✅ `docs/planning/CAL-COM-SECRETS-SETUP.md` - Complete setup guide

---

## 🎯 Next Implementation Steps

After secrets are configured, you can proceed with Cal.com integration:

1. **Phase 1: Frontend** (2-3 hours)
   - Replace contact form with Cal.com inline embed
   - Update CSP headers
   - Test embed loads correctly

2. **Phase 2: Backend** (2-3 hours)
   - Create webhook endpoint (`functions/api/calcom-webhook.ts`)
   - Handle booking events
   - Send confirmation emails via queue

3. **Phase 3: Testing** (1-2 hours)
   - E2E tests
   - Visual regression tests
   - Webhook integration tests

See: `docs/planning/CAL-COM-INTEGRATION-ANALYSIS.md` for complete implementation plan

---

## 🔐 Security Reminders

- ✅ API key is stored in gopass (encrypted)
- ✅ `.dev.vars` is gitignored (never committed)
- ✅ Infisical is the production source of truth
- ✅ Cloudflare Pages secrets are encrypted at rest
- ⚠️ Rotate API key every 90 days (add to calendar)

---

## 🆘 Need Help?

**Interactive Setup**:

```bash
./scripts/secrets/store-calcom-secrets.sh
```

**Detailed Guide**:

- `docs/planning/CAL-COM-SECRETS-SETUP.md`

**Secrets Management**:

- `SECRETS.md` (rotation procedures)
- `docs/INFISICAL-QUICKSTART.md` (Infisical workflow)

---

**Delete this file after setup is complete.**
