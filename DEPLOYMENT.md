# Deployment Guide (Cloudflare Pages + Workers)

This project deploys to Cloudflare Pages (site) and Cloudflare Workers (Decap OAuth and optional Queue consumer).

## Environments

- Preview: Auto on pull requests via Pages (recommended) or manual deploys
- Production: Pages main branch or manual promotion
- Workers: Deployed independently via `wrangler`

## Prerequisites

- Cloudflare account with Pages enabled
- Node 24 and pnpm 10.16+ (see `.mise.toml`)
- Wrangler available via `pnpm wrangler`

## Configure Environment Variables (Pages)

Pages → Project → Settings → Environment variables

Required (Production and Preview):
- SENDGRID_API_KEY (secret)
- SENDGRID_FROM (variable) — e.g., quotes@liteckyeditingservices.com
- SENDGRID_TO (variable) — internal recipient
- TURNSTILE_SECRET_KEY (secret)
- PUBLIC_TURNSTILE_SITE_KEY (variable)

These enable `/api/contact` to send emails. If not set, the endpoint still accepts but responds `accepted-no-email`.

## Deploy the Site (Pages)

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
pnpm wrangler pages deploy dist --project-name=litecky-editing-services
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

Queue Consumer Worker (optional)
```bash
# Create queue (one-time)
pnpm wrangler queues create send-email-queue

# Ensure wrangler.toml has queue bindings, then deploy
cd workers/queue-consumer
pnpm install
pnpm wrangler deploy
```
If a queue producer binding `SEND_EMAIL` is configured for Pages Functions, `/api/contact` enqueues email jobs; otherwise falls back to direct SendGrid send.

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

