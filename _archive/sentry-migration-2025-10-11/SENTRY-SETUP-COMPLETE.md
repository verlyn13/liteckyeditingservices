# Sentry Setup - Complete Configuration Guide

**Date**: October 11, 2025
**Status**: ✅ COMPLETE - All secrets stored, DSN configured, ready for testing

---

## ✅ Completed Steps

### 1. Sentry Project Created

- **Organization**: `happy-patterns-llc`
- **Project**: `javascript-astro`
- **Project ID**: `4510172426731520`
- **Platform**: Astro

### 2. Tokens Secured in gopass

All authentication tokens are now securely stored:

```bash
gopass ls sentry/
# sentry/
# └── happy-patterns-llc/
#     ├── auth-token          (org token for builds)
#     ├── dsn                 (https://...@o0.ingest.us.sentry.io/...)
#     ├── org-token           (sntrys_...)
#     ├── personal-token      (sntryu_...)
#     └── security-token      (f374114aa6d511f08832befdb131e6c1)
```

**Verification:**

```bash
# Verify tokens are stored
gopass ls sentry/happy-patterns-llc/

# Check format (without revealing full token)
gopass show sentry/happy-patterns-llc/org-token | head -c 30
# Output: sntrys_eyJpYXQiOjE3NjAyMTA1MjA...

gopass show sentry/happy-patterns-llc/personal-token | head -c 30
# Output: sntryu_40cebf462d3639236444551...
```

### 3. Local Development Variables Generated

`.dev.vars` has been generated with Sentry configuration:

```bash
# Sentry (client-side; DSN is non-secret)
PUBLIC_SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520  # ✅ CONFIGURED
PUBLIC_SENTRY_ENVIRONMENT=development
PUBLIC_SENTRY_RELEASE=1.0.0

# Sentry build-time (sensitive: pulled from gopass)
SENTRY_ORG=happy-patterns-llc
SENTRY_PROJECT=javascript-astro
SENTRY_AUTH_TOKEN=sntrys_...          # ✅ Loaded from gopass
```

---

## 🚀 Next Steps

### 1. Test Locally

```bash
# Start dev server
pnpm dev

# Visit test page
open http://localhost:4321/test-sentry

# Click test buttons and verify in Sentry dashboard:
# https://sentry.io/organizations/happy-patterns-llc/issues/
```

### 2. Run Validation

```bash
# Validate setup
pnpm validate:sentry
# Expected: ✅ Sentry setup validation PASSED

# Run integration tests
pnpm test:sentry
# Expected: 17 tests passing
```

### 3. Configure Cloudflare Pages

#### Set Build Secret (SENTRY_AUTH_TOKEN)

```bash
# Sync from gopass to Cloudflare Pages
gopass show -o sentry/happy-patterns-llc/auth-token | \
  pnpm wrangler pages secret put SENTRY_AUTH_TOKEN \
  --project-name=liteckyeditingservices
```

#### Set Environment Variables (via Dashboard)

Go to: **Cloudflare Dashboard → Pages → liteckyeditingservices → Settings → Environment variables**

**Production:**

```
SENTRY_ORG=happy-patterns-llc
SENTRY_PROJECT=javascript-astro
PUBLIC_SENTRY_DSN=https://YOUR_KEY@o0.ingest.sentry.io/4510172426731520
PUBLIC_SENTRY_ENVIRONMENT=production
PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
```

**Preview:**

```
SENTRY_ORG=happy-patterns-llc
SENTRY_PROJECT=javascript-astro
PUBLIC_SENTRY_DSN=https://YOUR_KEY@o0.ingest.sentry.io/4510172426731520
PUBLIC_SENTRY_ENVIRONMENT=preview
PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
```

### 4. Deploy with Source Maps

```bash
# Commit changes
git add .
git commit -m "feat: complete Sentry integration with gopass secrets"
git push origin main

# Watch build logs for source maps upload
# Expected log: "Uploading source maps to Sentry..."
```

### 5. Verify Production

```bash
# After deployment, check Sentry dashboard
open https://sentry.io/organizations/happy-patterns-llc/issues/

# Test error capture in production console:
# window.__sentry?.captureException(new Error("Production test"))
```

---

## 📋 Quick Reference Commands

```bash
# List all Sentry secrets
gopass ls sentry/

# Show auth token (for manual sync)
gopass show sentry/happy-patterns-llc/auth-token

# Regenerate .dev.vars (if needed)
./scripts/generate-dev-vars.sh

# Validate setup
pnpm validate:sentry

# Run tests
pnpm test:sentry

# Sync secret to Cloudflare
gopass show -o sentry/happy-patterns-llc/auth-token | \
  pnpm wrangler pages secret put SENTRY_AUTH_TOKEN \
  --project-name=liteckyeditingservices

# List Cloudflare Pages secrets
pnpm wrangler pages secret list --project-name=liteckyeditingservices
```

---

## 🔐 Security Notes

### Sentry Security Token

A **Security Token** is configured for outbound requests:

- **Token**: `f374114aa6d511f08832befdb131e6c1`
- **Location**: `sentry/happy-patterns-llc/security-token`
- **Purpose**: Appended as header to outbound requests matching allowed domains

This token is used for API requests from Sentry's SDK to their ingest endpoints.

### Token Rotation

If you need to rotate tokens:

```bash
# Store new tokens
./scripts/secrets/store-sentry-tokens.sh

# Regenerate .dev.vars
./scripts/generate-dev-vars.sh

# Re-sync to Cloudflare
gopass show -o sentry/happy-patterns-llc/auth-token | \
  pnpm wrangler pages secret put SENTRY_AUTH_TOKEN \
  --project-name=liteckyeditingservices
```

See `SECRETS.md` for complete rotation procedures.

---

## 📊 Integration Status

| Component               | Status       | Location                            |
| ----------------------- | ------------ | ----------------------------------- |
| **Tokens in gopass**    | ✅ Complete  | `sentry/happy-patterns-llc/*`       |
| **Local .dev.vars**     | ⚠️ Needs DSN | `.dev.vars` (line 16)               |
| **SDK Configuration**   | ✅ Complete  | `src/lib/sentry.ts`                 |
| **Client Init**         | ✅ Complete  | `src/scripts/sentry-init.ts`        |
| **Admin Tracking**      | ✅ Complete  | `public/admin/sentry-admin.js`      |
| **Test Page**           | ✅ Complete  | `src/pages/test-sentry.astro`       |
| **Integration Tests**   | ✅ Complete  | `tests/sentry-integration.spec.ts`  |
| **Validation Script**   | ✅ Complete  | `scripts/validate/sentry-setup.mjs` |
| **Documentation**       | ✅ Complete  | `docs/SENTRY-*.md` (3 files)        |
| **Cloudflare Secret**   | 🔴 Pending   | Run `wrangler pages secret put`     |
| **Cloudflare Env Vars** | 🔴 Pending   | Add via dashboard                   |
| **Production Deploy**   | 🔴 Pending   | After above steps                   |

---

## ✅ Verification Checklist

- [x] Sentry project created (`javascript-astro`)
- [x] Org token stored in gopass (`sntrys_...`)
- [x] Personal token stored in gopass (`sntryu_...`)
- [x] Auth token alias created
- [x] Security token stored
- [x] DSN stored in gopass
- [x] `.dev.vars` generated with auth token
- [x] **DSN added to `.dev.vars`** ✅
- [x] Validation passed (`pnpm validate:sentry`) ✅
- [ ] Local test completed (`/test-sentry`) - **READY TO TEST**
- [ ] Integration tests passed (`pnpm test:sentry`)
- [ ] Cloudflare secret synced (`SENTRY_AUTH_TOKEN`)
- [ ] Cloudflare env vars set (DSN, ORG, PROJECT, etc.)
- [ ] Production deployment with source maps
- [ ] Production error captured and verified

---

## 🆘 Troubleshooting

### DSN Not Working

```bash
# Check DSN format
echo $PUBLIC_SENTRY_DSN
# Should be: https://[key]@o0.ingest.sentry.io/4510172426731520

# Verify in Sentry dashboard
open https://sentry.io/settings/happy-patterns-llc/projects/javascript-astro/keys/
```

### Source Maps Not Uploading

```bash
# Check auth token
gopass show sentry/happy-patterns-llc/auth-token | head -c 20
# Should start with: sntrys_

# Verify in build logs
# Look for: "Uploading source maps to Sentry"

# Check Cloudflare secret
pnpm wrangler pages secret list --project-name=liteckyeditingservices | grep SENTRY
```

### Events Not Appearing

1. Check DSN is correct in browser console:

   ```javascript
   window.__sentry?.getClient()?.getOptions()?.dsn;
   ```

2. Check sampling rates (may be 10% by default):

   ```javascript
   window.__sentry?.getClient()?.getOptions()?.tracesSampleRate;
   ```

3. Test with manual capture:
   ```javascript
   window.__sentry?.captureException(new Error('Manual test'));
   ```

---

## 📚 Related Documentation

- **Quick Reference**: [docs/SENTRY-README.md](./SENTRY-README.md)
- **Complete Setup**: [docs/SENTRY-SETUP.md](./SENTRY-SETUP.md)
- **Integrations**: [docs/SENTRY-INTEGRATIONS.md](./SENTRY-INTEGRATIONS.md)
- **Environment Vars**: [ENVIRONMENT.md](../ENVIRONMENT.md) (lines 198-246)
- **Secrets Management**: [SECRETS.md](../SECRETS.md) (lines 74-91)

---

**Last Updated**: October 11, 2025
**Next Action**: Add DSN to `.dev.vars` and test locally
