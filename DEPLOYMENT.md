# Deployment Guide (Cloudflare Pages + Workers)

This project deploys to Cloudflare Pages (site) and Cloudflare Workers (Queue consumer for async email processing). Decap CMS OAuth now runs on Pages Functions at the production origin.

**Current Status** (October 10, 2025):

- ✅ **Git-Connected Deployment Active** - Automatic deployment on push to main
- ✅ **Project Name**: `liteckyeditingservices` (Cloudflare Pages)
- ✅ Site deployed to Cloudflare Pages
- ✅ Queue consumer worker deployed
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

### CMS OAuth (On-Site Pages Functions)

Uses on-site Pages Functions at `/api/auth` and `/api/callback`. Admin is a static HTML shell (`public/admin/index.html`). Functions deploy automatically with Pages. No external OAuth worker is required.

**Configuration**: Pages → Settings → Environment variables

- `GITHUB_CLIENT_ID` (secret)
- `GITHUB_CLIENT_SECRET` (secret)

**CMS Config**: Admin config is bundled in `public/admin/cms.js` (built from `src/admin/cms.ts`). The legacy endpoint `/admin/config.yml` is deprecated and returns 410 Gone to prevent double-loading. A diagnostic config remains available at `/api/config.yml` with:

- `backend.base_url: <request origin>` (e.g., `https://www.liteckyeditingservices.com`)
- `backend.auth_endpoint: /api/auth`
  Headers: `Content-Type: text/yaml; charset=utf-8`, `Cache-Control: no-store`

**Local Testing**: Use `npx wrangler pages dev` (after `pnpm build`) to serve `./dist` + Pages Functions on one origin (http://127.0.0.1:8788) for OAuth testing. `.dev.vars` is loaded automatically. See CLOUDFLARE.md § Local Development.

### Legacy OAuth Worker (Decommissioned Oct 2025)

External worker `litecky-decap-oauth` is no longer used. Legacy instructions are archived. CSP may still include its URL for troubleshooting, but production uses on-site `/api/auth` + `/api/callback`.

Admin CSP allows Sentry CDN and ingest endpoints:

- `script-src`: include `https://browser.sentry-cdn.com`
- `connect-src`: include `https://*.sentry.io`

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

### Apex → WWW Redirect (Required for OAuth)

**CRITICAL**: Decap CMS OAuth requires a canonical origin. Configure Cloudflare to redirect apex → www at the zone level.

**Why**: OAuth callbacks must use a single origin (`https://www.liteckyeditingservices.com`). `_redirects` files cannot handle cross-host redirects reliably.

**Setup via Cloudflare Dashboard**:

1. Log in to Cloudflare → Select your zone (`liteckyeditingservices.com`)
2. Navigate to **Rules** → **Redirect Rules**
3. Click **Create rule**
4. Configure redirect:
   - **Rule name**: `Apex to WWW`
   - **When incoming requests match**:
     - Field: `Hostname`
     - Operator: `equals`
     - Value: `liteckyeditingservices.com`
   - **Then**:
     - Type: `Dynamic`
     - Expression: `concat("https://www.", http.host, http.request.uri.path)`
     - Status code: `301` (Permanent Redirect)
     - Preserve query string: ✅ Enabled
5. Click **Deploy**

**Verify**:

```bash
curl -sI https://liteckyeditingservices.com | grep -i location
# Expected: Location: https://www.liteckyeditingservices.com/
```

**CLI Helper**: See `scripts/cloudflare-redirect-setup.sh` for API-based setup

## Post-Deployment Validation

```bash
pnpm test:e2e        # Playwright E2E
pnpm test:a11y       # Accessibility checks
```

- Verify `/contact` form end-to-end (Turnstile + email delivery)
- Verify `/admin` GitHub OAuth login flow (Decap CMS)
- Review Cloudflare logs for Pages and Workers

### Admin Cache Purge (After CMS Changes)

When updating the admin shell or Decap bundle, purge Cloudflare Pages cache to prevent stale assets:

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

**Why this matters**: Cached `/admin/*` assets can cause:

- Stale OAuth flow behavior
- Outdated security headers

**When to purge**:

- After building `/admin/cms.<hash>.js`
- After editing `public/admin/index.html`
- After changing `functions/admin/config.yml.ts` or `functions/admin/[[path]].ts`

### Admin CMS Rollback (Hashed)

If a rollback is needed:

1. Note the previous hashed filename from the prior deploy (e.g., `cms.abc12345.js`).
2. Update `public/admin/index.html` to reference the previous hash (or re-run the hash step with the prior file pre-copied).
3. Purge CDN cache for `/admin/*`.
4. Verify `/admin` loads and `window.CMS` initializes.

## Troubleshooting

- Endpoint returns `accepted-no-email`: Check Pages env vars for SendGrid/Turnstile
- OAuth login fails: Re-check worker secrets and GitHub OAuth app settings
- Email not delivered: See `docs/playbooks/email-issues.md`
