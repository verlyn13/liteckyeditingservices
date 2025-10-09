# Complete Git-Connected Pages Migration Checklist

**Project Name**: `litecky-editing-services-git` (confirm your exact name)
**Date**: ___________
**Migration Lead**: ___________

## Phase 1: Pre-Migration Setup ✅

### 1.1 Git-Connected Project Creation
- [ ] Created new Pages project via Cloudflare Dashboard
- [ ] Selected "Connect to Git" option
- [ ] Connected to `verlyn13/liteckyeditingservices` repository
- [ ] Set production branch to `main`
- [ ] Build command: `pnpm install && pnpm build`
- [ ] Output directory: `dist`

### 1.2 Dashboard Environment Variables (Non-Sensitive)
**Production Environment:**
- [ ] NODE_VERSION = 24
- [ ] PNPM_VERSION = 10.17.1
- [ ] PUBLIC_TURNSTILE_SITE_KEY = 0x4AAAAAAB27CNFPS0wEzPP5
- [ ] SENDGRID_FROM = noreply@liteckyeditingservices.com
- [ ] ENVIRONMENT = production

**Preview Environment:**
- [ ] NODE_VERSION = 24
- [ ] PNPM_VERSION = 10.17.1
- [ ] PUBLIC_TURNSTILE_SITE_KEY = 1x00000000000000000000AA
- [ ] SENDGRID_FROM = noreply@liteckyeditingservices.com
- [ ] ENVIRONMENT = preview
- [ ] USE_TURNSTILE_TEST = 1
- [ ] TURNSTILE_TEST_SITE_KEY = 1x00000000000000000000AA
- [ ] TURNSTILE_TEST_SECRET_KEY = 2x0000000000000000000000000000000AA

## Phase 2: Secrets Configuration

### 2.1 Gopass Setup Verification
```bash
# Verify gopass has required secrets
- [ ] gopass show cloudflare/pages/turnstile/secret
- [ ] gopass show sendgrid/api-key
- [ ] gopass show sendgrid/template/contact
- [ ] gopass show sendgrid/template/confirmation
- [ ] gopass show github/oauth/client-id
- [ ] gopass show github/oauth/client-secret
```

### 2.2 Pages Secrets Sync
```bash
# Run Pages secrets sync (replace PROJECT_NAME with actual)
PROJECT_NAME="litecky-editing-services-git"

# Create mapping file if needed
cp secrets/pages.secrets.map.example secrets/pages.secrets.map

# Sync secrets
./scripts/deploy/sync-pages-secrets-from-gopass.sh "$PROJECT_NAME" secrets/pages.secrets.map
```
- [ ] Script ran successfully
- [ ] Verified with: `wrangler pages secret list --project-name="$PROJECT_NAME"`
- [ ] All required secrets present

### 2.3 Worker Secrets Sync (OAuth)
```bash
# Sync OAuth worker secrets
./scripts/deploy/sync-worker-secrets-from-gopass.sh workers/decap-oauth secrets/worker.decap-oauth.secrets.map
```
- [ ] Script ran successfully
- [ ] Worker still accessible at: https://litecky-decap-oauth.jeffreyverlynjohnson.workers.dev

## Phase 3: Preview Validation

### 3.1 Create Test PR
- [ ] Create small PR (e.g., update README)
- [ ] Cloudflare creates preview deployment automatically
- [ ] Note preview URL: _______________________

### 3.2 Run Preview Smoke Tests
```bash
# Automated smoke test
pnpm smoke:url https://[preview-url].pages.dev

# Manual checks
curl -I https://[preview-url].pages.dev | grep "200 OK"
curl -s https://[preview-url].pages.dev/admin/ | grep "decap-cms"
```
- [ ] Homepage loads (200 OK)
- [ ] Admin panel loads
- [ ] No console errors
- [ ] Preview validation workflow passes

## Phase 4: Domain Cutover

### 4.1 Pre-Cutover Checklist
- [ ] Analytics checked - low traffic period confirmed
- [ ] Team notified and available
- [ ] Old project name confirmed: `litecky-editing-services`
- [ ] New project name confirmed: `litecky-editing-services-git`
- [ ] Rollback procedure ready

### 4.2 Execute Domain Transfer
**Time Started**: _______

1. **Remove from old project:**
```bash
# In Cloudflare Dashboard
# Pages > litecky-editing-services > Custom domains
```
- [ ] Removed `liteckyeditingservices.com`
- [ ] Removed `www.liteckyeditingservices.com`

2. **Add to new project:**
```bash
# Pages > litecky-editing-services-git > Custom domains
```
- [ ] Added `liteckyeditingservices.com`
- [ ] Added `www.liteckyeditingservices.com`
- [ ] SSL certificates issued (wait 1-5 minutes)

**Time Completed**: _______
**Total Downtime**: _______

## Phase 5: Production Validation

### 5.1 Immediate Checks (T+5 minutes)
```bash
# Quick validation
curl -I https://www.liteckyeditingservices.com | grep "200 OK"
curl -I https://liteckyeditingservices.com | grep "200 OK"

# Admin check
curl -s https://www.liteckyeditingservices.com/admin/ | grep "3.8.4"

# Run production smoke
pnpm smoke:prod
```
- [ ] Both domains responding (200 OK)
- [ ] SSL certificates valid
- [ ] Admin loads with correct Decap version
- [ ] No errors in smoke test

### 5.2 Comprehensive Validation (T+15 minutes)
```bash
# Run full E2E suite
pnpm test:e2e:prod

# Admin specific test
pnpm test:admin:prod

# Security headers check
curl -I https://www.liteckyeditingservices.com | grep -E "strict-transport|content-security|x-frame"
```
- [ ] All E2E tests pass
- [ ] Admin test passes
- [ ] Security headers present

### 5.3 Workflow Validation
- [ ] Push small commit to main
- [ ] Cloudflare auto-deploys (check Pages dashboard)
- [ ] post-deploy-validation workflow runs
- [ ] Site updates correctly

## Phase 6: Finalize Git-Connected Mode

### 6.1 Update GitHub Secrets
```bash
# Set flag to disable manual deployment workflow
gh secret set CF_GIT_CONNECTED --body="true"
```
- [ ] CF_GIT_CONNECTED set to "true"
- [ ] deploy-production workflow now skips (if check works)

### 6.2 Monitor for 24 Hours
- [ ] admin-check scheduled workflow running (every 6 hours)
- [ ] No unexpected errors in Cloudflare Pages logs
- [ ] No user complaints
- [ ] Build times acceptable (<3 minutes)

## Phase 7: Cleanup

### 7.1 After 48 Hours of Stability
- [ ] Delete old direct-upload project `litecky-editing-services`
- [ ] Update all documentation references
- [ ] Archive migration documents

### 7.2 Documentation Updates
- [ ] Update README with new deployment process
- [ ] Update DEPLOYMENT.md
- [ ] Update CLOUDFLARE.md
- [ ] Remove migration warnings from PROJECT-STATUS.md

## Rollback Procedure (If Needed)

### Emergency Rollback Steps
1. **Return domains to old project:**
```bash
# Remove from new project
# Add back to old project
# Total time: ~5 minutes
```

2. **Verify old site working:**
```bash
curl -I https://www.liteckyeditingservices.com
pnpm smoke:prod
```

3. **Investigate issues before retry**

## Verification Commands Reference

```bash
# Check current Pages project details
wrangler pages project list

# List all secrets (names only)
wrangler pages secret list --project-name="litecky-editing-services-git"

# Check preview secrets
wrangler pages secret list --project-name="litecky-editing-services-git" --env=preview

# View recent deployments
wrangler pages deployment list --project-name="litecky-editing-services-git"

# Check domain status
curl -I https://www.liteckyeditingservices.com
curl -I https://liteckyeditingservices.com

# Admin panel verification
curl -s https://www.liteckyeditingservices.com/admin/ | grep -o "decap-cms@[0-9.]*"

# Full smoke test
pnpm smoke:prod

# E2E test suite
pnpm test:e2e:prod
pnpm test:admin:prod
```

## Success Criteria

### Must Pass All:
- ✅ Zero errors during domain cutover
- ✅ Downtime < 5 minutes
- ✅ All smoke tests pass
- ✅ Admin panel functional with Decap 3.8.4
- ✅ Auto-deployment working on push to main
- ✅ PR previews generating automatically
- ✅ No rollback required

## Sign-Off

**Migration Complete**: ☐
**Date**: ___________
**Completed By**: ___________
**Reviewed By**: ___________

## Notes Section

_Record any issues, observations, or deviations from plan:_

---

---

---