## Infisical → Cloudflare CI Sync

**Complete guide for syncing production secrets from Infisical to Cloudflare Pages via GitHub Actions**

---

## Overview

This workflow enables **one-click deployment** of all production secrets from Infisical (source of truth) to Cloudflare Pages.

**Flow**: Infisical (prod env) → GitHub Actions → Cloudflare Pages (Production)

**Security**:
- All secrets are masked in logs
- Infisical service token is read-only
- Values never appear in workflow logs
- Secrets are encrypted at rest in both Infisical and Cloudflare

---

## Prerequisites

### 1. Infisical Setup

**Create Service Token** (read-only for prod):

1. Go to: https://secrets.jefahnierocks.com
2. Navigate to: Project `liteckyeditingservices` → Settings → Service Tokens
3. Create new token:
   - Name: `GitHub CI - Production Read`
   - Environment: `prod`
   - Permissions: **Read-only**
4. Copy the token (starts with `st.`)
5. Store in gopass:
   ```bash
   gopass insert -f infisical/service-tokens/liteckyeditingservices/prod/read
   # Paste the service token when prompted
   ```

### 2. GitHub Repository Setup

**Option A: Automated Setup** (Recommended)

```bash
# Run the setup script
./scripts/secrets/setup-github-secrets.sh

# This sets:
# - INFISICAL_API_URL (secret)
# - INFISICAL_TOKEN (secret, from gopass)
# - INFISICAL_PROJECT_ID (variable)
# - INFISICAL_ENV (variable)
# - CLOUDFLARE_API_TOKEN (secret, from gopass)
# - CLOUDFLARE_ACCOUNT_ID (variable)
# - CLOUDFLARE_PROJECT_NAME (variable)
```

**Option B: Manual Setup**

Set repository variables:
```bash
gh variable set INFISICAL_PROJECT_ID -R verlyn13/liteckyeditingservices -b "d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7"
gh variable set INFISICAL_ENV -R verlyn13/liteckyeditingservices -b "prod"
gh variable set CLOUDFLARE_PROJECT_NAME -R verlyn13/liteckyeditingservices -b "liteckyeditingservices"
gh variable set CLOUDFLARE_ACCOUNT_ID -R verlyn13/liteckyeditingservices -b "13eb584192d9cefb730fde0cfd271328"
```

Set repository secrets:
```bash
# Infisical API URL
echo -n "https://secrets.jefahnierocks.com/api" | \
  gh secret set INFISICAL_API_URL -R verlyn13/liteckyeditingservices

# Infisical Token (from gopass)
gopass show -o infisical/service-tokens/liteckyeditingservices/prod/read | \
  gh secret set INFISICAL_TOKEN -R verlyn13/liteckyeditingservices

# Cloudflare API Token (from gopass)
gopass show -o cloudflare/api-tokens/initial-project-setup-master | \
  gh secret set CLOUDFLARE_API_TOKEN -R verlyn13/liteckyeditingservices
```

### 3. Verify Setup

```bash
# List variables
gh variable list -R verlyn13/liteckyeditingservices

# List secrets (names only, values are hidden)
gh secret list -R verlyn13/liteckyeditingservices
```

Expected output:
```
Variables:
  CLOUDFLARE_ACCOUNT_ID
  CLOUDFLARE_PROJECT_NAME
  INFISICAL_ENV
  INFISICAL_PROJECT_ID

Secrets:
  CLOUDFLARE_API_TOKEN
  INFISICAL_API_URL
  INFISICAL_TOKEN
```

---

## Usage

### Dry Run (Recommended First)

Test without applying changes:

```bash
# Via GitHub CLI
gh workflow run infisical-to-cloudflare.yml \
  -R verlyn13/liteckyeditingservices \
  -f dry_run=true

# Or via GitHub UI
# Go to: Actions → "Infisical → Cloudflare (Production)" → Run workflow
# Set dry_run: true
```

**Dry run output** shows:
- List of public variables (without values)
- List of secrets (without values)
- No changes are applied

### Apply Changes

Sync secrets to Cloudflare:

```bash
# Via GitHub CLI
gh workflow run infisical-to-cloudflare.yml \
  -R verlyn13/liteckyeditingservices \
  -f dry_run=false

# Or via GitHub UI
# Go to: Actions → "Infisical → Cloudflare (Production)" → Run workflow
# Set dry_run: false
```

**Apply output** shows:
- Number of secrets set successfully
- All values are masked in logs
- Final summary of what was updated

---

## What Gets Synced

### Secrets (Encrypted)

These are set via `wrangler pages secret put`:
- `GITHUB_CLIENT_SECRET`
- `TURNSTILE_SECRET_KEY`
- `SENDGRID_API_KEY`
- `SENTRY_AUTH_TOKEN`
- Any other non-PUBLIC_ variables

### Public Environment Variables

These must be set manually via Cloudflare Dashboard:
- `PUBLIC_SENTRY_DSN`
- `PUBLIC_SENTRY_ENVIRONMENT`
- `PUBLIC_SENTRY_RELEASE`
- `PUBLIC_TURNSTILE_SITE_KEY`
- `PUBLIC_SITE_NAME`
- `PUBLIC_SITE_URL`
- Any other PUBLIC_ variables

**Why manual?** Cloudflare Pages doesn't have a CLI command for setting environment variables (non-secret). The workflow lists them for you to copy.

---

## Workflow Details

**File**: `.github/workflows/infisical-to-cloudflare.yml`

**Steps**:
1. **Checkout** - Get repo code
2. **Install Infisical CLI** - Download v0.43.6
3. **Setup Node & pnpm** - For wrangler
4. **Install Wrangler** - Cloudflare CLI
5. **Export from Infisical** - Pull all prod secrets as JSON
6. **Split** - Separate PUBLIC_ vars from secrets
7. **Mask values** - Prevent logging (::add-mask::)
8. **Apply secrets** - Use wrangler to set encrypted secrets
9. **Summary** - Report what was set

**Security Features**:
- All values masked before any operation
- Service token is read-only
- No values logged at any point
- Secrets encrypted in transit and at rest

---

## Verification

### Check Cloudflare Dashboard

After running the workflow:

1. Go to: https://dash.cloudflare.com
2. Navigate to: **Pages** → **liteckyeditingservices** → **Settings** → **Environment variables**
3. Select: **Production** environment
4. Verify secrets exist (you won't see values, just names)

### Test a Secret

```bash
# Test SENTRY_AUTH_TOKEN is set correctly
pnpm wrangler pages secret list --project-name=liteckyeditingservices

# Should show:
# - SENTRY_AUTH_TOKEN
# - SENDGRID_API_KEY
# - GITHUB_CLIENT_SECRET
# - TURNSTILE_SECRET_KEY
```

### Trigger a Build

```bash
# Create a commit to trigger Cloudflare Pages build
git commit --allow-empty -m "test: verify secrets sync"
git push origin main

# Watch build logs for:
# - Source maps upload (uses SENTRY_AUTH_TOKEN)
# - No errors about missing environment variables
```

---

## Troubleshooting

### Error: "Infisical CLI not found"

The workflow automatically installs Infisical CLI. If this fails:
- Check GitHub Actions has internet access
- Verify https://github.com/Infisical/cli/releases/ is accessible

### Error: "Invalid Infisical token"

1. Verify token is correct:
   ```bash
   gopass show infisical/service-tokens/liteckyeditingservices/prod/read
   ```
2. Test token locally:
   ```bash
   export INFISICAL_TOKEN="$(gopass show -o infisical/service-tokens/liteckyeditingservices/prod/read)"
   infisical export --token "$INFISICAL_TOKEN" --projectId "d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7" --env prod
   ```
3. If expired, create new token in Infisical and update gopass

### Error: "Wrangler authentication failed"

1. Verify Cloudflare API token:
   ```bash
   gopass show cloudflare/api-tokens/initial-project-setup-master
   ```
2. Test token:
   ```bash
   export CLOUDFLARE_API_TOKEN="$(gopass show -o cloudflare/api-tokens/initial-project-setup-master)"
   pnpm wrangler pages project list
   ```
3. If invalid, create new token with `Pages:Edit` permissions

### Error: "Secret not found in Infisical"

1. Check Infisical web UI for the secret
2. Verify environment is `prod`
3. Check spelling matches `secrets/PRODUCTION_KEYS.md`

### Workflow succeeds but secrets not working

1. **Cache issue**: Purge Cloudflare cache
   ```bash
   # Via dashboard or:
   pnpm wrangler pages deployment list --project-name=liteckyeditingservices
   ```
2. **Wrong environment**: Verify you set them in **Production**, not Preview
3. **Propagation delay**: Wait 1-2 minutes, then trigger new deployment

---

## Maintenance

### Rotate Infisical Service Token

```bash
# 1. Create new token in Infisical (read-only, prod)
# 2. Store in gopass
gopass insert -f infisical/service-tokens/liteckyeditingservices/prod/read
# 3. Update GitHub secret
gopass show -o infisical/service-tokens/liteckyeditingservices/prod/read | \
  gh secret set INFISICAL_TOKEN -R verlyn13/liteckyeditingservices
# 4. Test with dry run
gh workflow run infisical-to-cloudflare.yml -R verlyn13/liteckyeditingservices -f dry_run=true
```

### Rotate Cloudflare API Token

```bash
# 1. Create new token in Cloudflare Dashboard
# 2. Store in gopass
gopass insert -f cloudflare/api-tokens/initial-project-setup-master
# 3. Update GitHub secret
gopass show -o cloudflare/api-tokens/initial-project-setup-master | \
  gh secret set CLOUDFLARE_API_TOKEN -R verlyn13/liteckyeditingservices
# 4. Test
gh workflow run infisical-to-cloudflare.yml -R verlyn13/liteckyeditingservices -f dry_run=true
```

### Add New Secret

1. **Add to Infisical** (prod environment)
2. **Update** `secrets/PRODUCTION_KEYS.md` if needed
3. **Run workflow** to sync
4. **Verify** in Cloudflare Dashboard

---

## Security Best Practices

1. **Service Token Permissions**:
   - Always use read-only tokens for CI
   - Limit to specific environment (`prod`)
   - Rotate every 90 days

2. **GitHub Secrets**:
   - Never log secret values
   - Use `::add-mask::` for any dynamic values
   - Review workflow logs regularly

3. **Cloudflare Secrets**:
   - Use encrypted secrets, not environment variables, for sensitive data
   - Audit access logs monthly
   - Rotate credentials after team member changes

4. **Infisical Audit**:
   - Review service token usage in Infisical
   - Check for unauthorized access
   - Monitor for unusual export patterns

---

## Reference

### Related Files

- **Workflow**: `.github/workflows/infisical-to-cloudflare.yml`
- **Setup Script**: `scripts/secrets/setup-github-secrets.sh`
- **Secret List**: `secrets/PRODUCTION_KEYS.md`
- **Quick start**: `docs/INFISICAL-QUICKSTART.md`
- **Secret inventory**: `SECRETS.md`

### Commands Cheat Sheet

```bash
# Setup (one-time)
./scripts/secrets/setup-github-secrets.sh

# Verify setup
gh secret list -R verlyn13/liteckyeditingservices
gh variable list -R verlyn13/liteckyeditingservices

# Dry run
gh workflow run infisical-to-cloudflare.yml -R verlyn13/liteckyeditingservices -f dry_run=true

# Apply
gh workflow run infisical-to-cloudflare.yml -R verlyn13/liteckyeditingservices -f dry_run=false

# Check Cloudflare secrets
pnpm wrangler pages secret list --project-name=liteckyeditingservices

# Watch workflow
gh run watch
```

---

**Last Updated**: October 11, 2025
**Status**: ✅ Ready for production use
