# Secrets Inventory and Rotation

This document lists secrets used by the project, where they live, and how to rotate them. Do not commit secret values.

## Inventory

Cloudflare Pages (site)
- TURNSTILE_SECRET_KEY — Server-side verification secret (Pages env secret)
- SENDGRID_API_KEY — API key for email delivery (Pages env secret)
- SENDGRID_FROM — Verified sender address, e.g., quotes@liteckyeditingservices.com (env var)
- SENDGRID_TO — Internal recipient for quote requests (env var)

Cloudflare Workers
- workers/decap-oauth
  - GITHUB_OAUTH_ID — GitHub OAuth Client ID (secret)
  - GITHUB_OAUTH_SECRET — GitHub OAuth Client Secret (secret)

GitHub Actions (CI)
- CLOUDFLARE_API_TOKEN — API token for CI deploys (repository secret)
- CLOUDFLARE_ACCOUNT_ID — Account identifier (repository variable or secret)

Local Development (via gopass → .dev.vars)
- TURNSTILE_SECRET_KEY — Use test secret in development
- PUBLIC_TURNSTILE_SITE_KEY — Test site key (public)
- SENDGRID_API_KEY — Test key (optional; leave unset to avoid sending)
- EMAIL_FROM / EMAIL_TO — Local testing values

Reference: ENVIRONMENT.md for full variable matrix and usage.

## Storage Locations

- Gopass (authoritative for dev/test credentials):
  - development/turnstile/*
  - development/sendgrid/*
  - github/oauth/litecky-editing/*
  - cloudflare/litecky/* (account/API tokens)
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

GitHub OAuth (decap-oauth worker)
1. Rotate Client Secret in GitHub OAuth app
2. `cd workers/decap-oauth && pnpm wrangler secret put GITHUB_OAUTH_SECRET`
3. Validate login at `/admin`

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

