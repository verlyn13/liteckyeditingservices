# CMS Content Update Playbook

## Overview

This playbook covers the end-to-end process for updating website content via Decap CMS, including automatic deployment and cache invalidation.

## Quick Reference

**CMS URL**: https://liteckyeditingservices.com/admin
**Authentication**: GitHub (requires repository access)
**Typical Update Time**: 2-3 minutes from save to live

## Content Update Workflow

### For Content Editors

#### 1. Login to CMS

1. Navigate to https://liteckyeditingservices.com/admin
2. Click "Login with GitHub"
3. Authorize the application if prompted (first time only)
4. You'll be redirected to the CMS dashboard

#### 2. Edit Content

1. Select the collection you want to edit (Pages, Settings, etc.)
2. Choose the specific page/item
3. Make your changes in the editor
4. Use the preview pane to see how it will look
5. Click "Save" when done

#### 3. Publish Changes

1. Review the changes summary
2. Click "Publish" or "Publish now"
3. The CMS will commit your changes to GitHub
4. GitHub Actions automatically triggers deployment

#### 4. Verify Changes

1. Wait 2-3 minutes for deployment to complete
2. Visit the live site to confirm changes
3. If changes don't appear, check the deployment status (see Monitoring section)

### For Developers

#### Direct File Editing

If you prefer editing content files directly:

```bash
# 1. Edit content files in content/ directory
vim content/pages/home.json

# 2. Commit and push
git add content/
git commit -m "Update homepage content"
git push origin main

# 3. Workflow automatically triggers on push
```

#### Manual Workflow Trigger

To manually trigger deployment with specific options:

```bash
# Deploy with selective cache purge (default)
gh workflow run cms-content-sync.yml

# Deploy and purge ALL cache
gh workflow run cms-content-sync.yml -f purge_type=all

# Deploy WITHOUT purging cache (testing only)
gh workflow run cms-content-sync.yml -f purge_type=none
```

## Automatic Deployment Process

When content is saved via CMS or pushed to `main`:

### 1. Workflow Trigger

The `cms-content-sync.yml` workflow triggers on:
- Push to `main` branch with changes in `content/` directory
- Manual workflow dispatch via GitHub Actions UI or CLI

### 2. Preflight Checks

The workflow verifies required secrets are configured:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_ZONE_ID`

If any secret is missing, the workflow fails immediately with a clear error message.

### 3. Change Detection

The workflow detects which content files changed:
- Compares current commit with previous commit
- Lists all changed files in `content/` directory
- Outputs list for selective cache purging

### 4. Build & Deploy

The workflow:
1. Installs dependencies
2. Builds the site (`pnpm build`)
3. Deploys to Cloudflare Pages via Wrangler
4. Waits 10 seconds for propagation

### 5. Cache Purge

Based on changed files, the workflow purges cache:

**Content Purge** (default):
- Purges specific page URLs based on changed content files
- Always purges homepage (most common change)
- Purges `/services/` if `services.json` changed
- Purges `/about/` if `about.json` changed
- Includes both apex and www URLs

**All Purge** (manual trigger):
- Purges entire cache
- Use only when necessary (CSS changes, major updates)

**No Purge** (manual trigger):
- Deploys without cache purge
- For testing deployment process

### 6. Verification

The workflow verifies deployment:
- Checks HTTP response code
- Outputs deployment URL
- Provides summary in GitHub Actions

## Monitoring & Troubleshooting

### Check Deployment Status

```bash
# View recent workflow runs
gh run list --workflow=cms-content-sync.yml --limit 5

# Watch a specific run in real-time
gh run watch <run-id>

# View detailed logs
gh run view <run-id> --log
```

### View Deployment in GitHub Actions UI

1. Navigate to: https://github.com/verlyn13/liteckyeditingservices/actions/workflows/cms-content-sync.yml
2. Click on the most recent run
3. Review job outputs:
   - ✓ **preflight**: Secrets validation
   - ✓ **detect-changes**: Changed files list
   - ✓ **deploy-and-purge**: Build, deploy, purge logs
   - ✓ **notify**: Summary

### Verify Cache Headers

Check if cache is properly configured:

```bash
# Check HTML page cache headers
curl -I https://liteckyeditingservices.com

# Check static asset cache headers
curl -I https://liteckyeditingservices.com/favicon.svg
```

Expected headers (Phase 1):
```
cache-control: public, max-age=0, must-revalidate
```

### Common Issues

#### Changes Not Appearing

**Symptom**: Content updated in CMS but not showing on live site.

**Solutions**:
1. Check GitHub Actions for failed workflows
2. Wait full 2-3 minutes (deployment takes time)
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
4. Check deployment URL in workflow logs
5. Manually trigger cache purge: `gh workflow run cms-content-sync.yml -f purge_type=all`

#### Workflow Failing at Preflight

**Symptom**: Red X on preflight job with "Missing secrets" error.

**Solution**: Secrets need to be configured in GitHub repository settings:
1. Navigate to: https://github.com/verlyn13/liteckyeditingservices/settings/secrets/actions
2. Ensure these secrets exist:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_ZONE_ID`
3. Contact repository admin if you don't have access

#### CMS Login Issues

**Symptom**: "Authentication error" or redirect loop.

**Solutions**:
1. Verify you have GitHub access to the repository
2. Check OAuth app configuration in GitHub settings
3. Clear browser cookies for the site
4. Try incognito/private browsing mode
5. See `docs/playbooks/DECAP-OAUTH-WORKFLOW.md` for detailed troubleshooting

#### Build Failure

**Symptom**: Workflow fails during "Build site" step.

**Solutions**:
1. Check build logs for TypeScript errors
2. Verify content JSON is valid
3. Run `pnpm build` locally to reproduce
4. Fix any errors and push again

## Emergency Procedures

### Force Full Cache Purge

If content is stuck in cache:

```bash
# Purge everything immediately
gh workflow run cms-content-sync.yml -f purge_type=all

# Or via Cloudflare API directly
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

### Rollback Content

If bad content was published:

**Via GitHub**:
```bash
# 1. Find the bad commit
git log content/

# 2. Revert the commit
git revert <commit-sha>

# 3. Push to trigger re-deployment
git push origin main
```

**Via CMS**:
1. Edit the content back to previous state
2. Save and publish
3. Workflow automatically deploys correction

### Disable Automatic Deployment

If you need to pause automatic deployments:

1. Go to: https://github.com/verlyn13/liteckyeditingservices/actions/workflows/cms-content-sync.yml
2. Click "⋮" menu → "Disable workflow"
3. Make necessary changes
4. Re-enable when ready

## Caching Strategy

### Current State (Phase 1: Freshness-First)

**Goal**: Ensure content changes appear immediately

**Configuration**:
- HTML pages: `max-age=0, must-revalidate` (always fresh)
- Assets: Same as HTML (will be optimized in Phase 2)
- Automatic purge on content changes
- Security headers via `public/_headers` and Functions

**Trade-off**: Higher origin load, but instant content updates

### Future State (Phase 2: Performance-First)

**Goal**: Maximize cache hit ratio while maintaining reasonable freshness

**Planned Configuration**:
- Immutable assets (fonts, JS, CSS): 1 year edge cache
- HTML pages: 4 hours edge, 5 minutes browser cache
- Images: 1 month edge, 1 week browser cache
- Granular purging via dedicated Worker
- Cache Rules configured in Cloudflare dashboard

**Benefits**: 90%+ cache hit ratio, reduced costs, faster performance

**Migration**: Will happen when site traffic increases (see `CACHING-STRATEGY.md`)

## Related Documentation

- **Workflow File**: `.github/workflows/cms-content-sync.yml`
- **Caching Strategy**: `CACHING-STRATEGY.md`
- **Environment Variables**: `ENVIRONMENT.md`
- **CMS Authentication**: `docs/playbooks/DECAP-OAUTH-WORKFLOW.md`
- **Admin Access**: `docs/playbooks/ADMIN-ACCESS.md`
- **Project Status**: `PROJECT-STATUS.md`

## Contact

If you encounter issues not covered in this playbook:
1. Check GitHub Issues for similar problems
2. Review GitHub Actions logs
3. Contact the development team
4. Document the issue for future reference
