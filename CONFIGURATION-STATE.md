# Configuration State Document

## Current Production Configuration

**Last Updated**: October 5, 2025 (03:50 UTC)
**Environment**: Production
**Deployment Method**: Git-Connected (Cloudflare Pages)

---

## 📋 Cloudflare Pages Configuration

### Project Details

- **Project Name**: `liteckyeditingservices`
- **Project Type**: Git-connected (automatic deployments)
- **Repository**: `github.com/verlyn13/liteckyeditingservices`
- **Branch**: `main` (production)
- **Build Command**: `pnpm build`
- **Build Output Directory**: `dist`
- **Framework**: Astro (auto-detected)

### Custom Domains

- **Primary**: https://liteckyeditingservices.com
- **WWW**: https://www.liteckyeditingservices.com
- **Pages Subdomain**: https://liteckyeditingservices.pages.dev
- **SSL**: Cloudflare-managed certificates (active)
- **Proxy**: Enabled (orange-clouded)

### Environment Variables (Production)

```bash
# Turnstile (Cloudflare CAPTCHA)
TURNSTILE_SECRET_KEY=<secret>     # gopass: cloudflare/litecky/turnstile/secret-key

# SendGrid (Email Service)
SENDGRID_API_KEY=<secret>         # gopass: sendgrid/api-keys/liteckyeditingservices-key
SENDGRID_FROM=<email>             # gopass: development/sendgrid/email-from
SENDGRID_TO=<email>               # gopass: development/sendgrid/email-to
```

### Bindings

- **Queue**: `SEND_EMAIL` → `send-email-queue` (producer)
- **Functions**: `/api/contact` (TypeScript Pages Function)

---

## 🔧 Cloudflare Workers Configuration

### 1. Decap OAuth (On-Site Pages Functions)

OAuth now runs on Pages Functions at the production origin. The external OAuth worker is decommissioned.

- Start: `/api/auth` — generates/echoes state, sets cookies, redirects to GitHub
- Callback: `/api/callback` — validates state, exchanges code→token, posts token to opener, clears cookies
- Config: `/admin/config.yml` — dynamic YAML with `base_url` and `auth_endpoint`
- Admin wrapper: `/admin/*` — CSP/COOP headers applied in `functions/admin/[[path]].ts`
- Env vars (Pages): `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

### 2. Queue Consumer Worker (Email Processing)

**Worker Name**: `litecky-queue-consumer`
**URL**: https://litecky-queue-consumer.jeffreyverlynjohnson.workers.dev
**Purpose**: Async email processing from queue

#### Configuration (`workers/queue-consumer/wrangler.toml`)

```toml
name = "litecky-queue-consumer"
main = "src/index.ts"
compatibility_date = "2025-09-30"

[[queues.consumers]]
queue = "send-email-queue"
max_batch_size = 10
max_batch_timeout = 30
```

#### Secrets

```bash
SENDGRID_API_KEY=<secret>              # gopass: sendgrid/api-keys/liteckyeditingservices-key
SENDGRID_FROM=<email>                  # gopass: development/sendgrid/email-from
SENDGRID_TO=<email>                    # gopass: development/sendgrid/email-to
```

---

## 🗄️ Cloudflare Infrastructure

### D1 Database

- **Name**: `litecky-db`
- **ID**: `208dd91d-8f15-40ef-b23d-d79672590112`
- **Status**: Created (schema not yet deployed)
- **Purpose**: Future content/analytics storage

### R2 Bucket

- **Name**: `litecky-uploads`
- **Status**: Created
- **Purpose**: Media storage for CMS uploads

### KV Namespace

- **Name**: `CACHE`
- **ID**: `6d85733ce2654d9980caf3239a12540a`
- **Status**: Created
- **Purpose**: Caching layer for future optimization

### Queue

- **Name**: `send-email-queue`
- **ID**: `a2fafae4567242b5b9acb8a4a32fa615`
- **Status**: Active
- **Producers**: 1 (Pages Function `/api/contact`)
- **Consumers**: 1 (Queue Consumer Worker)
- **Created**: October 2, 2025

---

## 🌐 DNS Configuration

### Domain: liteckyeditingservices.com

**Zone ID**: `a5e7c69768502d649a8f2c615f555eca`
**Registrar**: Cloudflare-managed

### DNS Records (Active)

```
# Website
www.liteckyeditingservices.com  CNAME  liteckyeditingservices.pages.dev (Proxied)
@                                CNAME  liteckyeditingservices.pages.dev (Proxied, CNAME flattening)

# Email (Google Workspace)
@  MX  1   ASPMX.L.GOOGLE.COM.
@  MX  5   ALT1.ASPMX.L.GOOGLE.COM.
@  MX  5   ALT2.ASPMX.L.GOOGLE.COM.
@  MX  10  ALT3.ASPMX.L.GOOGLE.COM.
@  MX  10  ALT4.ASPMX.L.GOOGLE.COM.

# SPF
@  TXT  v=spf1 include:_spf.google.com include:sendgrid.net ~all

# SendGrid DKIM (example - confirm in SendGrid dashboard)
s1._domainkey  CNAME  s1.domainkey.uXXXX.wl.sendgrid.net
s2._domainkey  CNAME  s2.domainkey.uXXXX.wl.sendgrid.net

# DMARC
_dmarc  TXT  v=DMARC1; p=quarantine; rua=mailto:dmarc@liteckyeditingservices.com
```

---

## 🔐 Security Configuration

### Security Headers (global via `public/_headers`, admin via Pages Function)

#### Global Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' data: https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests;
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
```

**Key CSP Notes**:

- `data:` in script-src: Required for Vite-inlined small scripts (menu-toggle.js, contact-form.js)
- `unsafe-inline`: Required for Svelte reactive styles (will be replaced with nonces in future)
- `frame-ancestors 'self'`: Allows same-origin frames for admin preview

#### Admin Headers (`/admin/*`) — set by `functions/admin/[[path]].ts`

```
content-security-policy: default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; script-src 'self' 'unsafe-eval' https://challenges.cloudflare.com https://browser.sentry-cdn.com; connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://github.com https://browser.sentry-cdn.com https://*.sentry.io; frame-src 'self' https://challenges.cloudflare.com; child-src 'self' blob:; worker-src 'self' blob:; frame-ancestors 'self'; base-uri 'none'; object-src 'none'; form-action 'self' https://github.com
x-frame-options: SAMEORIGIN
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=(), usb=(), payment=()
cross-origin-opener-policy: unsafe-none
```

**Notes**:

- Self-hosted Decap bundle; Sentry CDN allowed for admin instrumentation.
- `'unsafe-eval'` required by Decap.
- COOP left as `unsafe-none` to preserve popup `window.opener`.
 - `/admin/config.yml` returns 410 Gone (config bundled); diagnostic config available at `/api/config.yml`.

### Turnstile Configuration

- **Widget ID**: `litecky-editing-production`
- **Site Key**: `0x4AAAAAAB27CNFPS0wEzPP5` (public)
- **Secret Key**: Stored in gopass + Pages environment
- **Mode**: Managed with pre-clearance
- **Integration**: Contact form (/contact)

---

## 📦 Package Configuration

### Core Framework

- **Astro**: 5.14.1
- **Svelte**: 5.39.7
- **Node**: 24.x (managed via mise)
- **pnpm**: 10.17.1 (managed via `packageManager` field)

### Styling

- **Tailwind CSS**: 4.1.13 (using Vite plugin, NOT v3 config)
- **@tailwindcss/vite**: 4.1.13
- **Fonts**: @fontsource-variable/inter, @fontsource/lora

### Build & Deploy

- **Vite**: 7.1.7
- **Wrangler**: 4.40.3
- **@cloudflare/workers-types**: 4.20251001.0

### Testing

- **Playwright**: 1.55.1 (E2E tests, 5 browser configs)
- **Vitest**: 3.2.4 (unit tests)
- **pa11y**: 9.0.1 (accessibility tests)

### Code Quality

- **TypeScript**: 5.9.3 (strict mode)
- **Biome**: 2.2.4
- **ESLint**: 9.36.0
- **Prettier**: 3.6.2

**Update Strategy**: All packages use `latest` specifier with validation scripts to prevent downgrades.

---

## 🔄 CI/CD Configuration

### GitHub Actions Workflows

#### 1. Quality Gate (`.github/workflows/quality-gate.yml`)

**Trigger**: Pull requests, pushes to main
**Purpose**: Code quality checks before merge
**Steps**: TypeScript check, linting, validation scripts

#### 2. Deploy Production (`.github/workflows/deploy-production.yml`)

**Trigger**: Push to main (when NOT Git-connected)
**Status**: Noop mode (`CF_GIT_CONNECTED=true`)
**Purpose**: Automated Wrangler deploy (disabled for Git-connected)

#### 3. Post-Deploy Validation (`.github/workflows/post-deploy-validation.yml`)

**Trigger**: Push to main
**Purpose**: Validate production deployment
**Tests**: Security headers (15/15 passing), admin smoke tests

#### 4. Preview Validation (`.github/workflows/preview-validation.yml`)

**Trigger**: Pull requests
**Purpose**: Test PR preview deployments
**Tests**: Homepage, admin panel

#### 5. E2E Visual (`.github/workflows/e2e-visual.yml`)

**Trigger**: Push to main
**Purpose**: Visual regression testing
**Tests**: 4 baseline screenshots (home + services, desktop + mobile)

#### 6. Admin Check (`.github/workflows/admin-check.yml`)

**Trigger**: Schedule (every 6 hours)
**Purpose**: Periodic admin health checks

### GitHub Secrets

```bash
CLOUDFLARE_ACCOUNT_ID=<account-id>    # Required for Wrangler
CLOUDFLARE_API_TOKEN=<api-token>       # Required for deployments
CF_GIT_CONNECTED=true                  # Disables manual Wrangler deploys
```

---

## 📊 Monitoring & Observability

### Current State

- ✅ **Cloudflare Analytics**: Enabled (Web Analytics)
- ✅ **GitHub Actions**: Automated validation on each deployment
- ✅ **E2E Tests**: Production validation (15/15 security headers passing)

### Planned (Week 2)

- ⏳ **UptimeRobot**: External uptime monitoring (30 min setup)
- ⏳ **Error Monitoring Worker**: Cloudflare Worker for error tracking (2 hours)
- ⏳ **Queue Health Worker**: Monitor send-email-queue health (2.5 hours)

### Documentation

- `docs/infrastructure/UPTIME-MONITORING.md` - Implementation guide
- `docs/infrastructure/ERROR-ALERTING.md` - Error monitoring setup
- `docs/infrastructure/QUEUE-HEALTH.md` - Queue monitoring setup

---

## 🗂️ Secrets Management

### Storage: gopass + age

- **gopass**: Secret management tool
- **age**: Encryption backend
- **mise**: Version manager for Node/pnpm

### Secret Paths (gopass)

```bash
# Cloudflare
cloudflare/litecky/turnstile/site-key
cloudflare/litecky/turnstile/secret-key
cloudflare/api-token

# GitHub
github/oauth-apps/litecky-decap-cms/client-id
github/oauth-apps/litecky-decap-cms/client-secret

# SendGrid
sendgrid/api-keys/liteckyeditingservices-key
development/sendgrid/email-from
development/sendgrid/email-to
```

### Sync Scripts

- `scripts/deploy/sync-pages-secrets-from-gopass.sh` - Sync secrets to Pages project
- `scripts/deploy/sync-worker-secrets-from-gopass.sh` - Sync secrets to Workers

### Usage

```bash
# Pages secrets
./scripts/deploy/sync-pages-secrets-from-gopass.sh liteckyeditingservices secrets/pages.secrets.map.example

# Worker secrets
./scripts/deploy/sync-worker-secrets-from-gopass.sh workers/decap-oauth secrets/worker.decap-oauth.secrets.map.example
```

---

## 📝 Configuration Files Inventory

### Root Configuration

- `astro.config.mjs` - Astro framework config
- `tsconfig.json` - TypeScript configuration (root)
- `biome.json` - Biome linter/formatter config
- `eslint.config.mjs` - ESLint flat config
- `.prettierrc.json` - Prettier formatting config
- `playwright.config.ts` - E2E test configuration
- `vitest.config.ts` - Unit test configuration
- `package.json` - Package dependencies and scripts
- `pnpm-lock.yaml` - Locked dependency versions

### Cloudflare Configuration

- `wrangler.toml` - Root Pages project config (queue producer binding)
- `workers/decap-oauth/wrangler.toml` - OAuth worker config
- `workers/queue-consumer/wrangler.toml` - Queue consumer config
- `functions/tsconfig.json` - Pages Functions TypeScript config
- `workers/queue-consumer/tsconfig.json` - Worker TypeScript config

### Security & Validation

- `public/_headers` - Cloudflare Pages security headers
- `policy/` - OPA/Rego validation policies (6 files)
- `scripts/validate/` - Validation scripts (3 files)
- `desired-state/` - Expected configuration states

### Version Management

- `.mise.toml` - mise configuration (Node 24 + pnpm 10.16)
- `.nvmrc` - Node version specification (backup)
- `.npmrc` - npm/pnpm configuration

---

## 🔍 Verification Commands

### DNS Verification

```bash
# Check CNAME records
dig +short www.liteckyeditingservices.com CNAME
dig +short liteckyeditingservices.com CNAME

# Check SSL
curl -Iv https://www.liteckyeditingservices.com 2>&1 | sed -n '1,20p'
```

### Security Headers

```bash
# Check production headers
curl -sI https://www.liteckyeditingservices.com | grep -i 'strict-transport-security\|content-security-policy\|x-frame-options'

# Check admin headers
curl -sI https://www.liteckyeditingservices.com/admin/ | grep -i 'content-security-policy'
```

### Deployment Status

```bash
# Check Wrangler authentication
pnpm wrangler whoami

# List Pages deployments
pnpm wrangler pages deployment list --project-name=liteckyeditingservices

# Check queue status
pnpm wrangler queues list
```

### Application Health

```bash
# Production smoke test
pnpm smoke:prod

# Run full E2E suite against production
BASE_URL=https://www.liteckyeditingservices.com pnpm test:e2e
```

---

## 📋 Change Log

### October 5, 2025

- ✅ Migrated to Git-connected Pages deployment
- ✅ Fixed CSP: Added `data:` to script-src for Vite-inlined scripts
- ✅ Updated CI/CD workflows for Git-connected mode
- ✅ Created secrets automation scripts (gopass sync)
- ✅ All security header tests passing (15/15)

### October 4, 2025

- ✅ Implemented comprehensive security headers
- ✅ Created E2E tests for security validation
- ✅ Added visual regression testing (4 baselines)
- ✅ Documented monitoring strategies

### October 2, 2025

- ✅ Initial production deployment
- ✅ Queue-based email processing operational
- ✅ All infrastructure resources created

---

**Document Maintained By**: Development team
**Review Frequency**: After significant configuration changes
**Related Documentation**: PROJECT-STATUS.md, IMPLEMENTATION-ROADMAP.md, DEPLOYMENT.md
