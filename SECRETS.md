# Secrets Inventory and Rotation

This document lists secrets used by the project, where they live, and how to rotate them. Do not commit secret values.

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
  - github/litecky/oauth/* (GitHub OAuth for Decap CMS)
  - development/turnstile/* (Turnstile test keys)
  - development/sendgrid/* (SendGrid test config)
  - cloudflare/litecky/turnstile/* (Turnstile production keys)
  - sendgrid/api-keys/liteckyeditingservices-* (SendGrid production)
  - cloudflare/account/*, cloudflare/api-tokens/* (Cloudflare API access)
- Cloudflare Dashboard → Pages → Settings → Environment variables (production/preview)
- Cloudflare Dashboard → Workers → Worker → Settings → Variables (for decap-oauth)
- GitHub → Settings → Secrets and variables → Actions (CI/CD)

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

