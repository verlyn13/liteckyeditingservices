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
- **Pages Subdomain**: https://litecky-editing-services.pages.dev

### Workers
- **OAuth Proxy**: https://litecky-decap-oauth.jeffreyverlynjohnson.workers.dev
- **Queue Consumer**: https://litecky-queue-consumer.jeffreyverlynjohnson.workers.dev

## 🏗️ Infrastructure Overview

### Cloudflare Pages
- **Project**: `litecky-editing-services`
- **Build command**: `pnpm build`
- **Output directory**: `dist`
- **Framework**: Astro (static output)
- **Functions**: `/api/contact` (queue producer)
- **Environment variables**: SendGrid API keys, Turnstile keys

### Workers
1. **Decap OAuth** (`workers/decap-oauth/`)
   - Handles GitHub OAuth for CMS
   - KV namespace: `CACHE` (ID: `6d85733ce2654d9980caf3239a12540a`)
   - Posts token back to opener window's origin captured at `/auth` (supports apex and www); strict allowlist. Clears cookie at `/callback`.

2. **Queue Consumer** (`workers/queue-consumer/`)
   - Processes email queue
   - Queue binding: `send-email-queue`
   - SendGrid integration

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
- **SendGrid DNS**: All DKIM, SPF, DMARC records configured
- **Google Workspace**: MX records configured

## 🔧 Common Operations

### Deploy Site (Pages)
```bash
# Automatic via GitHub push to main
git push origin main

# Or manual via Wrangler
pnpm wrangler pages deploy dist --project-name=litecky-editing-services
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
pnpm wrangler pages deployment tail --project-name=litecky-editing-services

# Worker logs
pnpm wrangler tail litecky-queue-consumer
```

### Manage Secrets
```bash
# Pages secrets
pnpm wrangler pages secret put SENDGRID_API_KEY --project-name=litecky-editing-services

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
pnpm wrangler pages deployment list --project-name=litecky-editing-services

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
