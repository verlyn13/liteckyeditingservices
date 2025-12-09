# Secrets Inventory and Rotation

This document lists secrets used by the project, where they live, and how to rotate them. Do not commit secret values.

> For a step-by-step operational guide (seed → verify → prepare), see `docs/INFISICAL-QUICKSTART.md`.

## Inventory

Cloudflare Pages (site + Functions)

- GITHUB_CLIENT_ID — GitHub OAuth Client ID for Decap CMS (Pages env secret)
- GITHUB_CLIENT_SECRET — GitHub OAuth Client Secret for Decap CMS (Pages env secret)
- TURNSTILE_SECRET_KEY — Server-side verification secret (Pages env secret)
- POSTAL_API_KEY — Postal server API key for email delivery (Pages env secret)
- POSTAL_FROM_EMAIL — Sender address, e.g., contact@liteckyeditingservices.com (env var)
- POSTAL_TO_EMAIL — Internal recipient for quote requests (env var)
- CALCOM_API_KEY — Cal.com API v2 Bearer token for backend calls (Pages env secret)
- CALCOM_WEBHOOK_SECRET — Webhook signature verification secret (Pages env secret)
- PUBLIC_CALCOM_EMBED_URL — Public booking URL (env var)

Cloudflare Workers

- workers/queue-consumer
  - POSTAL_API_KEY — Same as Pages (for queue-based email sending)
  - POSTAL_FROM_EMAIL — Sender address
  - POSTAL_TO_EMAIL — Recipient address

GitHub Actions (CI)

- CLOUDFLARE_API_TOKEN — API token for CI deploys (repository secret)
- CLOUDFLARE_ACCOUNT_ID — Account identifier (repository variable or secret)

Local Development (via gopass → .dev.vars)

- GITHUB_CLIENT_ID — GitHub OAuth Client ID (from gopass github/litecky/oauth/client-id)
- GITHUB_CLIENT_SECRET — GitHub OAuth Client Secret (from gopass github/litecky/oauth/client-secret)
- TURNSTILE_SECRET_KEY — Use test secret: 1x0000000000000000000000000000000AA
- PUBLIC_TURNSTILE_SITE_KEY — Test site key: 1x00000000000000000000AA
- POSTAL_API_KEY — Postal server API key (from gopass seven-springs/litecky-editing/postal-api-key)
- POSTAL_FROM_EMAIL — contact@liteckyeditingservices.com
- POSTAL_TO_EMAIL — ahnie@liteckyeditingservices.com

Reference: ENVIRONMENT.md for full variable matrix and usage.

## Storage Locations

- Gopass (authoritative for dev/test credentials):
  - github/litecky/oauth/\* (GitHub OAuth for Decap CMS)
  - development/turnstile/\* (Turnstile test keys)
  - seven-springs/litecky-editing/postal-api-key (Postal API key)
  - sentry/happy-patterns-llc/\* (Sentry configuration):
    - org-token (sntrys\_... organization auth token)
    - personal-token (sntryu\_... personal auth token)
    - auth-token (CI/CD sourcemap upload token)
    - dsn (project DSN for error reporting)
    - org (organization slug: happy-patterns-llc)
    - project (project slug: javascript-astro)
  - cloudflare/litecky/turnstile/\* (Turnstile production keys)
  - cloudflare/account/_, cloudflare/api-tokens/_ (Cloudflare API access)
  - calcom/litecky-editing/\* (Cal.com production):
    - api-key (cal_live_xxxxxxxxxxxx)
    - webhook-secret (whsec_xxxxxxxxxxxx)
    - embed-url (https://cal.com/litecky-editing/consultation)
  - calcom/litecky-editing-test/\* (Cal.com test/development):
    - api-key (cal_test_xxxxxxxxxxxx)
    - webhook-secret (whsec_test_xxxxxxxxxxxx)
    - embed-url (test booking URL)
- Cloudflare Dashboard → Pages → Settings → Environment variables (production/preview)
- Cloudflare Dashboard → Workers → Worker → Settings → Variables (for decap-oauth)
- GitHub → Settings → Secrets and variables → Actions (CI/CD)

## Infisical (Production Source of Truth)

Production values are managed in Infisical and synced to Cloudflare Pages.

- Workspace: `liteckyeditingservices` (project id `d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7`)
- Infisical environment: `prod`
- Cloudflare Pages environment: `Production`

Commands:

```bash
# 0) Seed Infisical prod from gopass (no values printed)
./scripts/secrets/infisical_seed_prod_from_gopass.sh || true

# 1) Pull Infisical prod secrets to a local dotenv (git-ignored)
./scripts/secrets/infisical_pull_prod.sh

# 2) Prepare Cloudflare files (splits PUBLIC_* vs secrets)
./scripts/secrets/cloudflare_prepare_from_infisical.sh

# 3) Upload to Cloudflare Pages (Production)
#    - public.env   → Environment Variables
#    - secrets.env  → Secrets (encrypted at rest)
```

See `secrets/PRODUCTION_KEYS.md` for the canonical list of required keys.

## Rotation Procedures

Postal API Key

1. Generate new server API key in Postal admin (https://postal.jefahnierocks.com)
2. Update gopass: `gopass insert -f seven-springs/litecky-editing/postal-api-key`
3. Update Cloudflare Pages secret `POSTAL_API_KEY` (Production and Preview)
4. Update queue consumer worker secrets
5. Validate by sending a test via `/api/contact` (preview)

Turnstile Secret

1. Generate/rotate secret in Cloudflare Turnstile
2. Update `TURNSTILE_SECRET_KEY` in Cloudflare Pages (both environments)
3. Update gopass test secret if needed
4. Validate server-side verification on `/contact`

GitHub OAuth (Pages Functions /api/auth, /api/callback)

1. Rotate Client Secret in GitHub OAuth app (https://github.com/settings/developers)
2. Update in Cloudflare Pages:
   ```bash
   gopass show -o github/litecky/oauth/client-secret | pnpm wrangler pages secret put GITHUB_CLIENT_SECRET --project-name=liteckyeditingservices
   ```
3. Update local development:
   ```bash
   ./scripts/generate-dev-vars.sh
   ```
4. Validate login at https://www.liteckyeditingservices.com/admin/

Sentry Tokens and Configuration (Error tracking + sourcemaps)

**Project Details:**

- Organization: `happy-patterns-llc` (ID: 4510172424699904)
- Project: `javascript-astro` (ID: 4510172426731520)
- DSN: `https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520`

**1. Store tokens and configuration in gopass:**

```bash
# Interactive script prompts for tokens and DSN
./scripts/secrets/store-sentry-tokens.sh
```

This stores:

- `sentry/happy-patterns-llc/org-token` (sntrys\_... token)
- `sentry/happy-patterns-llc/personal-token` (sntryu\_... token)
- `sentry/happy-patterns-llc/auth-token` (copy of org token for CI/CD)
- `sentry/happy-patterns-llc/dsn` (project DSN)
- `sentry/happy-patterns-llc/org` (organization slug)
- `sentry/happy-patterns-llc/project` (project slug)

**2. Sync to GitHub Actions (CI/CD):**

```bash
# Automated setup from gopass
./scripts/secrets/setup-sentry-github-actions.sh
```

This configures:

- Variable: `SENTRY_ORG=happy-patterns-llc`
- Variable: `SENTRY_PROJECT=javascript-astro`
- Secret: `SENTRY_AUTH_TOKEN` (from gopass)

**3. Sync to Infisical (Production):**

```bash
# Seeds Sentry config along with other production secrets
./scripts/secrets/infisical_seed_prod_from_gopass.sh
```

This includes:

- `PUBLIC_SENTRY_DSN` (client-side)
- `SENTRY_DSN` (server-side)
- `SENTRY_ORG`, `SENTRY_PROJECT` (build-time)
- `SENTRY_AUTH_TOKEN` (build-time sourcemap upload)

**4. Sync to Cloudflare Pages** (automated via Infisical + wrangler):

**Automated Workflow:**

```bash
# Step 1: Pull secrets from Infisical and prepare for Cloudflare
./scripts/secrets/cloudflare_prepare_from_infisical.sh

# Step 2: Push all secrets to Cloudflare Pages (both Production and Preview)
./scripts/secrets/sync-to-cloudflare-pages.sh
```

This automatically uploads all encrypted secrets to both environments via wrangler CLI:

- ✅ GitHub OAuth: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- ✅ Postal: `POSTAL_API_KEY`, `POSTAL_FROM_EMAIL`, `POSTAL_TO_EMAIL`
- ✅ Sentry: `SENTRY_AUTH_TOKEN`, `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`
- ✅ Turnstile: `TURNSTILE_SECRET_KEY`

**Manual Step** (public variables via Dashboard):

Navigate to: Pages → liteckyeditingservices → Settings → Environment Variables

**Production Environment Variables:**

```
PUBLIC_SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAB27CNFPS0wEzPP5
PUBLIC_SENTRY_ENVIRONMENT=production
PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
ENVIRONMENT=production
```

**Preview Environment Variables:**

```
PUBLIC_SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAB27CNFPS0wEzPP5
PUBLIC_SENTRY_ENVIRONMENT=preview
PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
ENVIRONMENT=preview
```

**5. Local development:**

```bash
# Generates .dev.vars from gopass (includes Sentry config)
./scripts/generate-dev-vars.sh
```

Cloudflare API Token (CI)

1. Create new token (Pages:Edit, Workers:Edit as needed)
2. Update GitHub Actions secret `CLOUDFLARE_API_TOKEN`
3. Validate CI runs that access Cloudflare

Cal.com API Key & Webhook Secret

**Frequency**: Every 90 days (same cadence as GitHub OAuth)

**Rotation Steps**:

1. Generate new API key in Cal.com dashboard:
   - Go to: https://app.cal.com/settings/developer/api-keys
   - Click "Generate new key"
   - Copy new key: `cal_live_xxxxxxxxxxxx`

2. Update gopass:

   ```bash
   # Store new production API key
   echo "cal_live_NEW_KEY_HERE" | gopass insert -f calcom/litecky-editing/api-key
   ```

3. Sync to Infisical:

   ```bash
   ./scripts/secrets/infisical_seed_prod_from_gopass.sh
   ```

4. Deploy to Cloudflare Pages:

   ```bash
   ./scripts/secrets/cloudflare_prepare_from_infisical.sh
   ./scripts/secrets/sync-to-cloudflare-pages.sh
   ```

5. Test in preview environment:
   - Trigger preview deployment
   - Test Cal.com webhook endpoint
   - Verify booking confirmation emails

6. Deploy to production (automatic via Git push)

7. Revoke old API key in Cal.com dashboard

**Webhook Secret Rotation**:

1. Create new webhook in Cal.com:
   - Go to: https://app.cal.com/settings/developer/webhooks
   - Update webhook URL: `https://www.liteckyeditingservices.com/api/calcom-webhook`
   - Copy new secret: `whsec_xxxxxxxxxxxx`

2. Update gopass and sync (same steps as API key above)

**Quick Setup Script**:

```bash
# Interactive script to store all Cal.com secrets
./scripts/secrets/store-calcom-secrets.sh
```

## Emergency Procedures

If you suspect compromise:

- Immediately revoke affected keys in their provider dashboards (Postal/Turnstile/GitHub/Cloudflare)
- Replace with new secrets following rotation steps
- Temporarily disable email sending by clearing `POSTAL_API_KEY` in Preview environment to reduce risk while investigating
- Review Cloudflare Pages/Workers logs and GitHub Actions logs
- Document incident and follow up with tighter scopes/permissions
