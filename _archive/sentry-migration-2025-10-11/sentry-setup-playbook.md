# Sentry Setup Playbook

Complete guide to configure Sentry error tracking across client, server, and CI/CD for the Litecky Editing Services project.

## Overview

Sentry provides full-stack observability:
- **Client-side**: Browser errors, performance tracking, session replay
- **Server-side**: Pages Functions errors, middleware issues
- **CI/CD**: Automated source map uploads, release tracking

## Project Details

- **Organization**: `happy-patterns-llc` (ID: `4510172424699904`)
- **Project**: `javascript-astro` (ID: `4510172426731520`)
- **DSN**: `https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520`
- **Dashboard**: https://sentry.io/organizations/happy-patterns-llc/projects/javascript-astro/

## Quick Start

### 1. Store Sentry Tokens in Gopass

Run the interactive setup script:

```bash
./scripts/secrets/store-sentry-tokens.sh
```

When prompted, enter:
- **Org Token**: `sntrys_************CsAY` (from gopass or Sentry dashboard)
- **Personal Token**: `************2244` (from gopass or Sentry dashboard)

This stores tokens at:
- `sentry/happy-patterns-llc/org-token-sentry`
- `sentry/happy-patterns-llc/personal-token-sentry`
- `sentry/happy-patterns-llc/auth-token` (copy of org token for CI)

### 2. Configure GitHub Actions (CI/CD)

Set repository variables and secrets:

**Variables** (`Settings → Secrets and variables → Actions → Variables`):
```bash
SENTRY_ORG=happy-patterns-llc
SENTRY_PROJECT=javascript-astro
```

**Secrets** (`Settings → Secrets and variables → Actions → Secrets`):
```bash
# Get auth token from gopass
gopass show sentry/happy-patterns-llc/auth-token

# Add as secret SENTRY_AUTH_TOKEN in GitHub UI
# Or use GitHub CLI:
gh secret set SENTRY_AUTH_TOKEN --body "$(gopass show -o sentry/happy-patterns-llc/auth-token)"
```

Verify by checking `.github/workflows/quality-gate.yml` uses these correctly.

### 3. Configure Cloudflare Pages (Production & Preview)

Navigate to `Pages → liteckyeditingservices → Settings → Environment variables`

**Production Environment:**
```bash
# Variables (NOT encrypted)
PUBLIC_SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
PUBLIC_SENTRY_ENVIRONMENT=production
PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
SENTRY_ORG=happy-patterns-llc
SENTRY_PROJECT=javascript-astro
ENVIRONMENT=production

# Secrets (encrypted)
# Use Cloudflare dashboard or wrangler:
gopass show -o sentry/happy-patterns-llc/auth-token | \
  pnpm wrangler pages secret put SENTRY_AUTH_TOKEN --project-name=liteckyeditingservices --env production
```

**Preview Environment:**
```bash
# Variables (same as production except environment)
PUBLIC_SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
PUBLIC_SENTRY_ENVIRONMENT=preview
PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
SENTRY_ORG=happy-patterns-llc
SENTRY_PROJECT=javascript-astro
ENVIRONMENT=preview

# Secrets
gopass show -o sentry/happy-patterns-llc/auth-token | \
  pnpm wrangler pages secret put SENTRY_AUTH_TOKEN --project-name=liteckyeditingservices --env preview
```

### 4. Local Development (.dev.vars)

Generate local dev vars from gopass:

```bash
./scripts/generate-dev-vars.sh
```

Verify `.dev.vars` contains:
```bash
PUBLIC_SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
PUBLIC_SENTRY_ENVIRONMENT=development
PUBLIC_SENTRY_RELEASE=1.0.0
```

## Verification Steps

### Test Local Development

1. Start dev server:
   ```bash
   pnpm dev
   ```

2. Visit test page:
   ```
   http://localhost:4321/test-sentry
   ```

3. Click test buttons to trigger errors
4. Check Sentry dashboard for events

### Test CI/CD Source Maps

1. Push a commit to trigger CI:
   ```bash
   git commit -m "test: verify sentry sourcemaps"
   git push
   ```

2. Check GitHub Actions workflow `Quality Gate`
3. Verify step "Create Sentry release and upload source maps" succeeds
4. Check Sentry dashboard → Releases for your commit SHA

### Test Production Deployment

1. Deploy to production
2. Trigger an error (e.g., via `/test-sentry` if enabled in prod, or intentional error)
3. Check Sentry dashboard for:
   - Error event with stack trace
   - Source maps correctly applied (readable code, not minified)
   - Release tagged with commit SHA
   - Environment correctly set to `production`

### Test Server-Side Sentry

1. Make a request to a Pages Function (e.g., `/api/contact`)
2. Trigger a server error
3. Check Sentry for server-side error event
4. Verify security headers are present in response:
   ```bash
   curl -I https://www.liteckyeditingservices.com/api/contact
   # Should include:
   # X-Frame-Options: DENY
   # X-Content-Type-Options: nosniff
   # Referrer-Policy: no-referrer-when-downgrade
   ```

## Environment Variable Reference

### Client-Side (Astro/Browser)

| Variable | Purpose | Example |
|----------|---------|---------|
| `PUBLIC_SENTRY_DSN` | Client-side error reporting endpoint | `https://...@o4510...` |
| `PUBLIC_SENTRY_ENVIRONMENT` | Environment tag for filtering | `production`, `preview`, `development` |
| `PUBLIC_SENTRY_RELEASE` | Version/commit for release tracking | `$CF_PAGES_COMMIT_SHA` or `1.0.0` |

### Server-Side (Pages Functions)

| Variable | Purpose | Example |
|----------|---------|---------|
| `SENTRY_DSN` | Server-side error reporting endpoint | Same as PUBLIC_SENTRY_DSN |
| `ENVIRONMENT` | Environment identifier | `production`, `preview` |
| `CF_PAGES_COMMIT_SHA` | Auto-set by Cloudflare, used for release | `abc123...` |

### CI/CD (Build-time)

| Variable | Type | Purpose |
|----------|------|---------|
| `SENTRY_ORG` | Variable | Organization slug for API access |
| `SENTRY_PROJECT` | Variable | Project slug for releases |
| `SENTRY_AUTH_TOKEN` | Secret | Auth token for sourcemap upload |

## Troubleshooting

### Sourcemaps Not Uploading

**Symptom**: CI step succeeds but sourcemaps don't appear in Sentry

**Check**:
1. Verify `SENTRY_AUTH_TOKEN` is set in GitHub secrets
2. Confirm token has `project:releases` scope
3. Check build emits sourcemaps to `./dist` directory
4. Verify workflow step uses correct `version: ${{ github.sha }}`

**Fix**: Re-run failed workflow after confirming secrets

### Client Errors Not Appearing

**Symptom**: No events in Sentry despite errors in browser console

**Check**:
1. Verify `PUBLIC_SENTRY_DSN` is set in environment
2. Confirm DSN is public (not a secret)
3. Check browser network tab for requests to `ingest.us.sentry.io`
4. Verify Sentry SDK loaded: `window.__sentry` should exist

**Fix**: Check environment variable configuration in Cloudflare Pages

### Server Errors Not Appearing

**Symptom**: Pages Functions errors don't appear in Sentry

**Check**:
1. Verify `SENTRY_DSN` (without PUBLIC_ prefix) is set
2. Confirm `functions/_middleware.ts` is deployed
3. Check Cloudflare Pages logs for middleware initialization
4. Test with deliberate error in a function

**Fix**: Ensure both `SENTRY_DSN` and `PUBLIC_SENTRY_DSN` are set

### Wrong Environment Tagged

**Symptom**: Events show wrong environment in Sentry

**Check**:
1. Verify `PUBLIC_SENTRY_ENVIRONMENT` matches deployment
2. Confirm `ENVIRONMENT` variable is set correctly
3. Check middleware reads correct env variable

**Fix**: Update environment variable in Cloudflare Pages settings

## Token Management

### Rotating Sentry Tokens

1. **Generate new token** in Sentry dashboard:
   - Settings → Developer Settings → Auth Tokens
   - Create token with `project:releases` scope

2. **Update gopass**:
   ```bash
   gopass edit sentry/happy-patterns-llc/auth-token
   # Or use insert -f to force overwrite
   ```

3. **Update GitHub secret**:
   ```bash
   gh secret set SENTRY_AUTH_TOKEN --body "$(gopass show -o sentry/happy-patterns-llc/auth-token)"
   ```

4. **Update Cloudflare Pages** (if using for builds):
   ```bash
   gopass show -o sentry/happy-patterns-llc/auth-token | \
     pnpm wrangler pages secret put SENTRY_AUTH_TOKEN --project-name=liteckyeditingservices
   ```

5. **Revoke old token** in Sentry dashboard

### Token Scopes Required

- **Org Token** (`org-token-sentry`): `org:read`, `project:releases`
- **Personal Token** (`personal-token-sentry`): `project:read`, `project:releases`
- **Auth Token** (CI): `project:releases` (minimum required for sourcemap upload)

## Related Documentation

- [ENVIRONMENT.md](../../ENVIRONMENT.md) - Complete environment variable reference
- [SECRETS.md](../../SECRETS.md) - Secret management and rotation procedures
- [docs/SENTRY-SETUP.md](../SENTRY-SETUP.md) - Detailed Sentry integration guide
- [docs/SENTRY-INTEGRATIONS.md](../SENTRY-INTEGRATIONS.md) - Integration reference
- [functions/_middleware.ts](../../functions/_middleware.ts) - Server-side implementation
- [.github/workflows/quality-gate.yml](../../.github/workflows/quality-gate.yml) - CI configuration

## Quick Reference Commands

```bash
# Store tokens in gopass
./scripts/secrets/store-sentry-tokens.sh

# Generate local .dev.vars
./scripts/generate-dev-vars.sh

# Set GitHub secret
gh secret set SENTRY_AUTH_TOKEN --body "$(gopass show -o sentry/happy-patterns-llc/auth-token)"

# Set Cloudflare Pages secret (production)
gopass show -o sentry/happy-patterns-llc/auth-token | \
  pnpm wrangler pages secret put SENTRY_AUTH_TOKEN --project-name=liteckyeditingservices --env production

# Set Cloudflare Pages secret (preview)
gopass show -o sentry/happy-patterns-llc/auth-token | \
  pnpm wrangler pages secret put SENTRY_AUTH_TOKEN --project-name=liteckyeditingservices --env preview

# Test local Sentry
pnpm dev
# Visit http://localhost:4321/test-sentry

# View Sentry dashboard
open "https://sentry.io/organizations/happy-patterns-llc/projects/javascript-astro/"
```
