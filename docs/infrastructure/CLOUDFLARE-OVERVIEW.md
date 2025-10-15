# Cloudflare Configuration Reference

**Last Updated**: October 4, 2025
**Status**: ✅ Production - All services deployed and operational (Git-connected Pages)

## 🔑 Account Information

- **Account ID**: `13eb584192d9cefb730fde0cfd271328`
- **Zone ID** (liteckyeditingservices.com): `a5e7c69768502d649a8f2c615f555eca`
- **Plan**: Workers Paid ($5/month)
- **Capabilities**: Pages, Workers, D1, R2, KV, Queues

> Note: As of Oct 2025, Pages deployment is Git-connected. Any direct `wrangler pages deploy` commands in this document are legacy/fallback-only.

## 🌐 Production URLs

### Primary Domains

- **Root**: https://liteckyeditingservices.com
- **WWW**: https://www.liteckyeditingservices.com
- **Pages Subdomain**: https://liteckyeditingservices.pages.dev

### Workers

- **OAuth Proxy (Legacy)**: https://litecky-decap-oauth.jeffreyverlynjohnson.workers.dev
  - **Status**: Decommissioned Oct 2025
  - **Replacement**: On-site Pages Functions (`/api/auth`, `/api/callback`)
- **Queue Consumer**: https://litecky-queue-consumer.jeffreyverlynjohnson.workers.dev

## 🏗️ Infrastructure Overview

### Cloudflare Pages

- **Project**: `liteckyeditingservices`
- **Build command**: `pnpm build`
- **Output directory**: `dist`
- **Framework**: Astro (static output)
- **Functions**:
  - `/api/contact` (queue producer)
  - `/api/auth` (Decap OAuth start)
  - `/api/callback` (Decap OAuth callback → posts token to opener)
- **Environment variables**: SendGrid API keys, Turnstile keys

### Pages Functions (Serverless)

1. **Decap OAuth** (On-Site Authentication)
   - Start: `/api/auth` — Generates state cookie and redirects to GitHub authorize
   - Callback: `/api/callback` — Validates state, exchanges code→token, posts token to opener (`authorization:github:success:…` string), then closes popup
   - Headers: COOP `unsafe-none` on both; minimal CSP on callback to allow inline postMessage script
   - Env vars: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` configured in Pages

2. **Contact Form** (`/api/contact`)
   - Accepts contact form submissions
   - Queue producer or direct SendGrid fallback

### Workers

1. **Queue Consumer** (`workers/queue-consumer/`)
   - Processes email queue
   - Queue binding: `send-email-queue`
   - SendGrid integration

2. **Decap OAuth (Legacy)** (`workers/decap-oauth/`)
   - **Status**: Decommissioned Oct 2025
   - **Replacement**: On-site Pages Functions (see above)

### Queues

- **Name**: `send-email-queue`
- **ID**: `a2fafae4567242b5b9acb8a4a32fa615`
- **Producer**: Pages Function (`/api/contact`)
- **Consumer**: Queue Consumer Worker
- **Status**: Active

### DNS Configuration

- **Nameservers**: `carol.ns.cloudflare.com`, `ignacio.ns.cloudflare.com`
- **Custom domains**: Root and WWW (proxied/orange-clouded)
- **SSL/TLS**: Full (strict) - Cloudflare managed certificates
- **Google Workspace**: MX records configured

#### Email Authentication (SendGrid Domain Verification)

**Status**: Authenticated (Verified Oct 2025)

SendGrid domain authentication configured with the following DNS records:

- **DKIM Records**: CNAME records for `s1._domainkey` and `s2._domainkey` pointing to SendGrid
- **SPF Record**: TXT record at `@` including `include:sendgrid.net ~all`
- **DMARC Record**: TXT record at `_dmarc` with policy configuration

**Verification**:

```bash
# Verify DKIM records
dig s1._domainkey.liteckyeditingservices.com CNAME +short
dig s2._domainkey.liteckyeditingservices.com CNAME +short

# Verify SPF record
dig liteckyeditingservices.com TXT +short | grep sendgrid

# Verify DMARC record
dig _dmarc.liteckyeditingservices.com TXT +short
```

**Dashboard Check**: SendGrid → Settings → Sender Authentication should show green "Authenticated" status.

See `docs/playbooks/email-issues.md` for troubleshooting email delivery problems.

## 🔧 Common Operations

### Local Development

**For UI-only development** (no OAuth):

```bash
pnpm dev  # Astro dev server at localhost:4321
```

**For full OAuth testing** (same-origin admin + functions):

```bash
pnpm build                    # Build static output to ./dist
npx wrangler pages dev        # Serves ./dist + /functions on one origin
# Visit the URL Wrangler prints (e.g., http://127.0.0.1:8788)
# Navigate to /admin for CMS with working OAuth
```

> **Why `wrangler pages dev` for OAuth?** Decap CMS requires same-origin for state validation. `wrangler pages dev` serves static assets and Pages Functions on one origin, matching production behavior. See [Cloudflare Docs: Local Development](https://developers.cloudflare.com/pages/functions/local-development/).

### Deploy Site (Pages)

```bash
# Automatic via GitHub push to main
git push origin main

# Or manual via Wrangler
pnpm wrangler pages deploy dist --project-name=liteckyeditingservices
```

### Deploy Worker

```bash
# From worker directory
cd workers/queue-consumer
pnpm wrangler deploy

# Or from root
pnpm --filter queue-consumer deploy
```

### View Logs

```bash
# Pages Functions logs
pnpm wrangler pages deployment tail --project-name=liteckyeditingservices

# Worker logs
pnpm wrangler tail litecky-queue-consumer
```

### Manage Secrets

```bash
# Pages secrets
pnpm wrangler pages secret put SENDGRID_API_KEY --project-name=liteckyeditingservices

# Worker secrets
cd workers/queue-consumer
pnpm wrangler secret put SENDGRID_API_KEY
```

### Check Queue Status

```bash
# View queue details
pnpm wrangler queues list

# View consumer details
pnpm wrangler queues consumer list send-email-queue
```

## 🔐 Authentication

### API Token

Stored in gopass. Load with:

```bash
# Fish shell
source scripts/load-cloudflare-env.fish

# Or directly
export CF_API_TOKEN=$(gopass show -o cloudflare/api-tokens/initial-project-setup-master)
```

### Wrangler Login

```bash
pnpm wrangler login
# Or use CF_API_TOKEN environment variable
```

## 📋 Environment Variables

### Pages Production Environment

- `SENDGRID_API_KEY` (secret)
- `SENDGRID_FROM` (secret)
- `SENDGRID_TO` (secret)
- `TURNSTILE_SECRET_KEY` (secret)
- `PUBLIC_TURNSTILE_SITE_KEY`: `0x4AAAAAAB27CNFPS0wEzPP5`

Tip: Generate current values from Infisical

- Follow `docs/INFISICAL-QUICKSTART.md` to produce `secrets/public.env` and `secrets/secrets.env`
- Upload their contents to Cloudflare Pages → liteckyeditingservices → Production

### Worker Environment

Queue consumer has same SendGrid variables as secrets.

## 📚 Additional Documentation

For detailed setup and deployment history, see:

- `_archive/cloudflare-setup/` - Detailed deployment guides
- `docs/infrastructure/` - Infrastructure management docs
- `DEPLOYMENT.md` - Current deployment procedures
- `ENVIRONMENT.md` - Environment variable details

## 🔗 Useful Links

- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **Pages Project**: https://dash.cloudflare.com/pages
- **Workers Dashboard**: https://dash.cloudflare.com/workers
- **DNS Management**: https://dash.cloudflare.com/dns
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler/

## 🆘 Troubleshooting

### Pages Deployment Failed

```bash
# Check build logs
pnpm wrangler pages deployment list --project-name=liteckyeditingservices

# Re-trigger deployment
git commit --allow-empty -m "trigger deployment"
git push origin main
```

### Worker Not Responding

```bash
# Check logs
pnpm wrangler tail <worker-name>

# Redeploy
cd workers/<worker-name>
pnpm wrangler deploy
```

### Queue Not Processing

```bash
# Check queue status
pnpm wrangler queues consumer list send-email-queue

# Check worker logs
pnpm wrangler tail litecky-queue-consumer
```

### DNS Issues

```bash
# Verify DNS records
dig liteckyeditingservices.com A +short
dig www.liteckyeditingservices.com A +short

# Check Cloudflare DNS dashboard
# https://dash.cloudflare.com/dns
```

For more troubleshooting, see `docs/playbooks/`.
