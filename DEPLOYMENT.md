# Deployment Guide (Cloudflare Pages + Workers)

This project deploys to Cloudflare Pages (site) and Cloudflare Workers (Decap OAuth and Queue consumer for async email processing).

**Current Status** (October 5, 2025):
- ✅ **Git-Connected Deployment Active** - Automatic deployment on push to main
- ✅ **Project Name**: `liteckyeditingservices` (Cloudflare Pages)
- ✅ Site deployed to Cloudflare Pages
- ✅ Queue consumer worker deployed
- ✅ OAuth worker deployed
- ✅ DNS migration complete (production domain live)

## Deployment Mode: Git-Connected (Automatic)

**This project uses Git-connected deployment** - Cloudflare Pages automatically builds and deploys when you push to the repository.

### How It Works
- **Push to `main`** → Automatic production deployment
- **Open a PR** → Automatic preview deployment
- **No manual `wrangler pages deploy` needed** - Cloudflare handles it

### GitHub Configuration
Required for CI/CD workflows to work correctly:

**Repository Variables** (Settings → Secrets and variables → Actions → Variables):
- `CF_GIT_CONNECTED=true` - Tells deploy-production.yml to skip manual deployment

**Repository Secrets** (Settings → Secrets and variables → Actions → Secrets):
- `CLOUDFLARE_API_TOKEN` - For API access (if needed for other workflows)
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

## Environments

- **Preview**: Automatic on pull requests via Git-connected Pages
- **Production**: Automatic on push to `main` branch
- **Workers**: Deployed independently via `wrangler deploy`

## Prerequisites

- Cloudflare account with Pages enabled
- Node 24 and pnpm 10.16+ (see `.mise.toml`)
- Wrangler available via `pnpm wrangler`

## Configure Environment Variables (Pages)

**Status**: ✅ All variables configured (October 2, 2025)

Pages → Project → Settings → Environment variables

Required (Production and Preview):
- ✅ SENDGRID_API_KEY (secret) - Configured via `wrangler pages secret put`
- ✅ SENDGRID_FROM (secret) - Configured via `wrangler pages secret put`
- ✅ SENDGRID_TO (secret) - Configured via `wrangler pages secret put`
- ✅ TURNSTILE_SECRET_KEY (secret) - Configured via `wrangler pages secret put`
- PUBLIC_TURNSTILE_SITE_KEY (variable) - Set in code: `0x4AAAAAAB27CNFPS0wEzPP5`

These enable `/api/contact` to send emails via queue. All variables are currently configured and operational.

## Deploy the Site (Pages)

**Status**: ✅ Git-Connected Deployment Active (October 5, 2025)
- **Production URL**: https://liteckyeditingservices.com
- **Alternate URL**: https://www.liteckyeditingservices.com
- **Pages Project**: `liteckyeditingservices` (Git-connected to GitHub)

### Deployment Happens Automatically

**You don't need to deploy manually.** Cloudflare Pages is connected to this GitHub repository:

1. **Push to `main`** → Production deployment triggers automatically
2. **Open a PR** → Preview deployment created automatically
3. **Merge PR** → Production updated automatically

### Cloudflare Pages Configuration

If you need to verify or update settings in Cloudflare dashboard:

**Pages → liteckyeditingservices → Settings → Builds & deployments**
- Build command: `pnpm build`
- Build output directory: `dist`
- Root directory: `/` (default)
- Node version: 24.x
- Package manager: pnpm 10.17.1

**Pages → liteckyeditingservices → Settings → Environment variables**
- See "Configure Environment Variables" section below

### Manual Deploy (Only if Git-connected fails)

⚠️ **Not normally needed** - use only for troubleshooting:

```bash
pnpm install
pnpm build
pnpm wrangler pages deploy dist --project-name=liteckyeditingservices
pnpm wrangler pages deployment list --project-name=liteckyeditingservices
```

Rollback
- Use Cloudflare Pages → Deployments → Promote a previous successful deployment
- Or revert the commit on `main` and redeploy

## Deploy Workers

### CMS OAuth (Current - On-Site Pages Functions)
Uses on-site Pages Functions at `/api/auth` and `/api/callback`. No custom OAuth subdomain or external worker required.

**Configuration**: Pages → Settings → Environment variables
- `GITHUB_CLIENT_ID` (secret)
- `GITHUB_CLIENT_SECRET` (secret)

**CMS Config**: `public/admin/config.yml` → `base_url: https://www.liteckyeditingservices.com`, `auth_endpoint: /api/auth`

### Legacy OAuth Worker (Decommissioned Oct 2025)
External worker `litecky-decap-oauth` is no longer used. Legacy deployment instructions moved to `_archive/DEPLOYMENT-legacy-oauth.md`.

Queue Consumer Worker ✅ **DEPLOYED**
```bash
# Queue already created: send-email-queue (ID: a2fafae4567242b5b9acb8a4a32fa615)
# Worker already deployed: litecky-queue-consumer.jeffreyverlynjohnson.workers.dev

# To redeploy or update:
cd workers/queue-consumer
pnpm install
pnpm wrangler deploy --cwd workers/queue-consumer

# Configure secrets (already set):
pnpm wrangler secret put SENDGRID_API_KEY --cwd workers/queue-consumer
pnpm wrangler secret put SENDGRID_FROM --cwd workers/queue-consumer
pnpm wrangler secret put SENDGRID_TO --cwd workers/queue-consumer
```

**Current Configuration**:
- Queue producer binding `SEND_EMAIL` is active on Pages Functions
- `/api/contact` enqueues messages (returns 202/enqueued)
- Queue consumer processes batches (max 10 messages, 30s timeout)
- Fallback to direct SendGrid if queue unavailable

## DNS and Domains

- Add custom domains to the Pages project (production and preview subdomain if desired)
- If migrating from another host, update DNS records to point to Cloudflare Pages
- Verify HTTPS certificates and propagation

## Post-Deployment Validation

```bash
pnpm test:e2e        # Playwright E2E
pnpm test:a11y       # Accessibility checks
```
- Verify `/contact` form end-to-end (Turnstile + email delivery)
- Verify `/admin` GitHub OAuth login flow (Decap CMS)
- Review Cloudflare logs for Pages and Workers

### Admin Cache Purge (After CMS Changes)

When updating admin boot scripts, initialization logic, or Decap bundle versions, purge Cloudflare Pages cache to prevent stale asset issues:

**Option 1: Via Cloudflare Dashboard**
1. Pages → `liteckyeditingservices` → Deployments
2. Click "..." menu on latest deployment → "Retry deployment"
3. This rebuilds and purges the cache

**Option 2: Via Wrangler (if needed)**
```bash
# Purge specific paths
wrangler pages deployment tail --project-name=liteckyeditingservices

# Or trigger fresh deployment
git commit --allow-empty -m "chore: purge admin cache"
git push origin main
```

**Why this matters**: Cached `/admin/*` assets (especially boot scripts) can cause:
- Double-initialization errors (React "removeChild" crashes)
- Stale OAuth flow configurations
- Outdated security headers

**When to purge**:
- After changing `public/admin/boot.js` or bundle loading logic
- After updating `src/pages/admin/index.astro`
- After modifying `/admin/config.yml` authentication settings
- When switching between manual and auto-initialization modes

## Troubleshooting

- Endpoint returns `accepted-no-email`: Check Pages env vars for SendGrid/Turnstile
- OAuth login fails: Re-check worker secrets and GitHub OAuth app settings
- Email not delivered: See `docs/playbooks/email-issues.md`

