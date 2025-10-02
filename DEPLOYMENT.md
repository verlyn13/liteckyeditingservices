# Deployment Guide (Cloudflare Pages + Workers)

This project deploys to Cloudflare Pages (site) and Cloudflare Workers (Decap OAuth and Queue consumer for async email processing).

**Current Status** (October 2, 2025):
- ✅ Site deployed to Cloudflare Pages
- ✅ Queue consumer worker deployed
- ✅ OAuth worker deployed
- ⏳ DNS migration pending (currently using Pages subdomain)

## Environments

- Preview: Auto on pull requests via Pages (recommended) or manual deploys
- Production: Pages main branch or manual promotion
- Workers: Deployed independently via `wrangler`

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

**Status**: ✅ Deployed (October 2, 2025)
- **Production URL**: https://b9ee6806.litecky-editing-services.pages.dev
- **Latest deployment**: 67 files (55 cached, 12 new)

Option A — GitHub Integration (recommended)
1. Connect repository in Cloudflare Pages
2. Build command: `pnpm build`
3. Build output directory: `dist`
4. Node version: 24.x, pnpm 10.x
5. Save and deploy; verify preview URL

Option B — Manual Deploy
```bash
pnpm install
pnpm build
pnpm wrangler pages deploy dist --project-name=litecky-editing-services --commit-dirty=true
pnpm wrangler pages deployments list --project-name=litecky-editing-services
```

Rollback
- Use Cloudflare Pages → Deployments → Promote a previous successful deployment
- Or revert the commit on `main` and redeploy

## Deploy Workers

Decap OAuth Worker
```bash
cd workers/decap-oauth
pnpm install
pnpm wrangler secret put GITHUB_OAUTH_ID
pnpm wrangler secret put GITHUB_OAUTH_SECRET
pnpm wrangler deploy
# Optional: configure custom domain (e.g., cms-auth.liteckyeditingservices.com)
```
Set `public/admin/config.yml` → `base_url` to your worker domain, `auth_endpoint: /auth`.

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

## Troubleshooting

- Endpoint returns `accepted-no-email`: Check Pages env vars for SendGrid/Turnstile
- OAuth login fails: Re-check worker secrets and GitHub OAuth app settings
- Email not delivered: See `docs/playbooks/email-issues.md`

