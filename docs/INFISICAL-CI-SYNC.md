# Infisical → Cloudflare CI Sync

This guide covers how production secrets flow from Infisical to Cloudflare Pages using GitHub Actions.

## Prerequisites
- Infisical project (read-only service token for prod)
- GitHub repo access (set repository secrets/variables)
- Cloudflare Pages project name + account ID
- Wrangler installed in CI steps

## Files
- .github/workflows/infisical-to-cloudflare.yml — CI workflow (dry_run input supported)
- scripts/secrets/setup-github-secrets.sh — helper to set repo variables and secrets via gh + gopass
- scripts/secrets/cloudflare_prepare_from_infisical.sh — splits PUBLIC_ vars for Pages Variables vs Secrets

## Secrets / Variables
Set in GitHub:
- Secrets:
  - INFISICAL_TOKEN (read-only service token) — from gopass path infisical/service-tokens/liteckyeditingservices/prod/read
  - INFISICAL_API_URL (optional, default provided)
  - CLOUDFLARE_API_TOKEN (Pages:Edit)
- Variables:
  - INFISICAL_PROJECT_ID = d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7
  - INFISICAL_ENV = production
  - CLOUDFLARE_PROJECT_NAME = liteckyeditingservices
  - CLOUDFLARE_ACCOUNT_ID = (your account id)

## Usage
- Dry run:
  gh workflow run infisical-to-cloudflare.yml -R verlyn13/liteckyeditingservices -f dry_run=true
- Apply:
  gh workflow run infisical-to-cloudflare.yml -R verlyn13/liteckyeditingservices -f dry_run=false

## What gets synced
- PUBLIC_* → Cloudflare Pages Variables
- Non-PUBLIC → Cloudflare Pages Secrets (encrypted)

## Security
- Values masked via ::add-mask::; no raw secrets echoed
- Read-only service token scope

## Troubleshooting
- Ensure wrangler version supports pages project variable/secret commands
- Verify Infisical token is valid and scoped to prod
- Check Actions logs for API responses

## Maintenance
- Rotate service tokens periodically; update gopass + GitHub secret
- Update Infisical as SoT; rerun workflow to sync

