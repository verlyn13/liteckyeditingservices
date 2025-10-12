# Secrets Inventory and Rotation

This document lists secrets used by the project, where they live, and how to rotate them. Do not commit secret values.

> For a step-by-step operational guide (seed → verify → prepare), see `docs/INFISICAL-QUICKSTART.md`.

## Inventory

Cloudflare Pages (site + Functions)

- GITHUB_CLIENT_ID — GitHub OAuth Client ID for Decap CMS (Pages env secret)
- GITHUB_CLIENT_SECRET — GitHub OAuth Client Secret for Decap CMS (Pages env secret)
- TURNSTILE_SECRET_KEY — Server-side verification secret (Pages env secret)
- SENDGRID_API_KEY — API key for email delivery (Pages env secret)
- SENDGRID_FROM — Verified sender address, e.g., quotes@liteckyeditingservices.com (env var)
- SENDGRID_TO — Internal recipient for quote requests (env var)

Cloudflare Workers

- workers/queue-consumer
  - SENDGRID_API_KEY — Same as Pages (for queue-based email sending)

GitHub Actions (CI)

- CLOUDFLARE_API_TOKEN — API token for CI deploys (repository secret)
- CLOUDFLARE_ACCOUNT_ID — Account identifier (repository variable or secret)

Local Development (via gopass → .dev.vars)

- GITHUB_CLIENT_ID — GitHub OAuth Client ID (from gopass github/litecky/oauth/client-id)
- GITHUB_CLIENT_SECRET — GitHub OAuth Client Secret (from gopass github/litecky/oauth/client-secret)
- TURNSTILE_SECRET_KEY — Use test secret: 1x0000000000000000000000000000000AA
- PUBLIC_TURNSTILE_SITE_KEY — Test site key: 1x00000000000000000000AA
- SENDGRID_API_KEY — Test key (optional; leave commented to disable emails)
- SENDGRID_FROM / SENDGRID_TO — Local testing values (optional)

Reference: ENVIRONMENT.md for full variable matrix and usage.

## Storage Locations

- Gopass (authoritative for dev/test credentials):
  - github/litecky/oauth/\* (GitHub OAuth for Decap CMS)
  - development/turnstile/\* (Turnstile test keys)
  - development/sendgrid/\* (SendGrid test config)
  - sentry/happy-patterns-llc/\* (Sentry configuration):
    - org-token (sntrys\_... organization auth token)
    - personal-token (sntryu\_... personal auth token)
    - auth-token (CI/CD sourcemap upload token)
    - dsn (project DSN for error reporting)
    - org (organization slug: happy-patterns-llc)
    - project (project slug: javascript-astro)
  - cloudflare/litecky/turnstile/\* (Turnstile production keys)
  - sendgrid/api-keys/liteckyeditingservices-\* (SendGrid production)
  - cloudflare/account/_, cloudflare/api-tokens/_ (Cloudflare API access)
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

SendGrid API Key

1. Create new API key in SendGrid (Restricted: Mail Send + Stats)
2. Update Cloudflare Pages secret `SENDGRID_API_KEY` (Production and Preview)
3. Update gopass entry for development
4. Validate by sending a test via `/api/contact` (preview)
5. Revoke old API key after validation

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

**4. Configure Cloudflare Pages manually** (or via Infisical sync):

**Production Environment:**

```
PUBLIC_SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
PUBLIC_SENTRY_ENVIRONMENT=production
PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
SENTRY_ORG=happy-patterns-llc
SENTRY_PROJECT=javascript-astro
```

Secret (encrypted):

```bash
gopass show -o sentry/happy-patterns-llc/auth-token | \
  pnpm wrangler pages secret put SENTRY_AUTH_TOKEN --project-name=liteckyeditingservices --env production
```

**Preview Environment:**

```
PUBLIC_SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
PUBLIC_SENTRY_ENVIRONMENT=preview
PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
SENTRY_ORG=happy-patterns-llc
SENTRY_PROJECT=javascript-astro
```

Secret (encrypted):

```bash
gopass show -o sentry/happy-patterns-llc/auth-token | \
  pnpm wrangler pages secret put SENTRY_AUTH_TOKEN --project-name=liteckyeditingservices --env preview
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

## Emergency Procedures

If you suspect compromise:

- Immediately revoke affected keys in their provider dashboards (SendGrid/Turnstile/GitHub/Cloudflare)
- Replace with new secrets following rotation steps
- Temporarily disable email sending by clearing `SENDGRID_API_KEY` in Preview environment to reduce risk while investigating
- Review Cloudflare Pages/Workers logs and GitHub Actions logs
- Document incident and follow up with tighter scopes/permissions
