# Cache Management System Documentation

## Overview

This document provides a comprehensive technical overview of the Litecky Editing Services caching strategy, implementation, and management procedures.

**Last Updated**: October 13, 2025
**Current Phase**: Phase 1 (Freshness-First)
**Status**: ✅ Production-Ready and Validated

## System Architecture

### Phase 1: Freshness-First (Current)

**Goal**: Ensure content changes appear immediately on the live site.

#### Cache Headers Configuration

**HTML Pages** (`public/_headers:1-15`):
```
Cache-Control: public, max-age=0, must-revalidate
```

**Immutable Assets** (`public/_headers:22-30`):
```
# Versioned JS/CSS with content hashes
Cache-Control: public, max-age=31536000, immutable
```

**Media Files** (`public/_headers:32-37`):
```
# Conservative caching during Phase 1
Cache-Control: public, max-age=3600  # 1 hour
```

**Admin Panel** (`public/_headers:17-20`):
```
Cache-Control: no-store  # Never cache
```

#### Security Headers

**Global Middleware** (`functions/_middleware.ts:99-119`):
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security` (production only): `max-age=31536000; includeSubDomains; preload`

**Admin Override** (`functions/admin/[[path]].ts:26`):
- `X-Frame-Options: SAMEORIGIN` (allows OAuth popup)
- `Cross-Origin-Opener-Policy: unsafe-none` (required for GitHub OAuth)
- Hardened CSP with Turnstile and Sentry

### Content Sync Workflow

**Trigger Patterns** (`.github/workflows/cms-content-sync.yml:4-10`):
```yaml
on:
  push:
    branches: [main]
    paths:
      - 'content/**/*.json'
      - 'content/**/*.md'
      - 'content/**/*.yaml'
      - 'content/**/*.yml'
  workflow_dispatch:
```

#### Workflow Jobs

**1. Preflight** (`.github/workflows/cms-content-sync.yml:24-58`):
- Validates required secrets exist
- Accepts `CLOUDFLARE_ACCOUNT_ID` from Secret OR Variable
- Fails fast with clear error message
- **Validated**: ✅ October 13, 2025

**2. Detect Changes** (`.github/workflows/cms-content-sync.yml:60-89`):
- Compares HEAD with HEAD~1
- Identifies modified content files
- Outputs changed file list for selective purging

**3. Deploy and Purge** (`.github/workflows/cms-content-sync.yml:91-200`):
- Builds site with `pnpm build`
- Deploys to Cloudflare Pages via Wrangler
- Waits 10 seconds for propagation
- Purges cache based on changed files

**4. Notify** (`.github/workflows/cms-content-sync.yml:202-222`):
- Creates GitHub Actions summary
- Reports success/failure status
- Lists changed files

#### Cache Purge Logic

**Content Purge** (default, `.github/workflows/cms-content-sync.yml:158-189`):
- Always purges homepage (most frequent change)
- Purges `/services/` if `services.json` changed
- Purges `/about/` if `about.json` changed
- Includes both apex and www URLs
- **Test Result**: ✅ Successfully purged on October 13, 2025

**All Purge** (manual trigger):
```bash
gh workflow run cms-content-sync.yml -f purge_type=all
```

**No Purge** (testing only):
```bash
gh workflow run cms-content-sync.yml -f purge_type=none
```

## Validation Results

### End-to-End Testing (October 13, 2025)

**Test 1: Workflow Trigger**
- ✅ Workflow triggered automatically on content change
- ✅ Preflight checks passed
- ✅ Change detection identified `content/pages/home.json`
- ✅ Build completed successfully
- ✅ Deployment to Cloudflare Pages succeeded
- ✅ Cache purge completed with `{"success":true}`
- **Run**: https://github.com/verlyn13/liteckyeditingservices/actions/runs/18475844084

**Test 2: Cache Headers**
- ✅ HTML: `Cache-Control: public, max-age=0, must-revalidate`
- ✅ Security headers present (HSTS, X-Frame-Options, etc.)
- ✅ ETag for efficient revalidation
- ✅ Admin override with SAMEORIGIN

**Test 3: Secrets Configuration**
- ✅ All required secrets present in GitHub
- ✅ Preflight accepts Account ID from Secret or Variable
- ✅ No secret exposure in logs

### Performance Metrics

**Deployment Time**: ~58 seconds (build + deploy + purge)
**Workflow Total Time**: ~1 minute 10 seconds
**Cache Purge Response**: <200ms
**Deployment Success Rate**: 100% (2/2 test runs)

## Phase 2: Performance-First (Prepared, Not Deployed)

### Goals
- Maximize cache hit ratio (target: >90% for assets)
- Reduce origin load and costs
- Maintain reasonable content freshness

### Planned Configuration

**Immutable Assets**:
```
Cache-Control: public, max-age=31536000, immutable
```

**HTML Pages**:
```
Cache-Control: public, max-age=14400, s-maxage=14400  # 4 hours edge
```

**Images**:
```
Cache-Control: public, max-age=2592000, s-maxage=604800  # 1 month edge, 1 week browser
```

### Granular Purging Worker

**Location**: `workers/cache-purge/index.ts`
**Route**: `api.liteckyeditingservices.com/cache/purge`
**Status**: Code complete, not deployed

**Capabilities**:
- Purge by exact URLs
- Purge by prefixes (e.g., `/blog/*`)
- Purge by cache tags
- Purge everything
- Secure API with shared secret

**Required Secrets** (via `wrangler secret`):
- `CLOUDFLARE_API_TOKEN` - Zone cache purge permission
- `CLOUDFLARE_ZONE_ID` - Zone identifier
- `PURGE_SECRET` - Shared secret with GitHub Actions

### Migration Triggers

Consider Phase 2 migration when:
- Site traffic increases significantly (>10k visits/month)
- Cache hit ratio drops below 80%
- Origin bandwidth costs become material
- Content update frequency stabilizes

### Deployment Procedure

```bash
# 1. Navigate to worker directory
cd workers/cache-purge

# 2. Set required secrets
pnpm exec wrangler secret put CLOUDFLARE_API_TOKEN --env production
pnpm exec wrangler secret put CLOUDFLARE_ZONE_ID --env production
pnpm exec wrangler secret put PURGE_SECRET --env production

# 3. Deploy worker
pnpm exec wrangler deploy --env production

# 4. Verify route is active
curl -X POST https://api.liteckyeditingservices.com/cache/purge \
  -H "Content-Type: application/json" \
  -d '{"type":"urls","items":["/test/"],"secret":"TEST_SECRET"}'

# 5. Update workflow to use worker API (manual edit)

# 6. Configure Cloudflare Cache Rules in dashboard
```

## Monitoring & Observability

### Key Metrics

**Workflow Health**:
- Deployment success rate
- Average deployment time
- Cache purge latency
- Build failure frequency

**Cache Performance**:
- Cache hit ratio (Cloudflare Analytics)
- Origin request count
- Bandwidth usage
- Response time distribution

**Content Freshness**:
- Time from commit to live site
- Cache purge success rate
- Stale content incidents

### Monitoring Commands

```bash
# Check recent deployments
gh run list --workflow=cms-content-sync.yml --limit 10

# Watch specific run
gh run watch <run-id>

# View detailed logs
gh run view <run-id> --log

# Check cache headers
curl -I https://liteckyeditingservices.com

# Verify cache purge
curl -I https://liteckyeditingservices.com | grep -i cache
```

### Cloudflare Analytics Dashboard

**URL**: https://dash.cloudflare.com/[account]/liteckyeditingservices.com/analytics

**Key Metrics**:
- Cache hit ratio trend
- Bandwidth by cache status
- Top cached resources
- Cache response time

## Emergency Procedures

### Force Full Cache Purge

If content is stuck in cache:

```bash
# Via GitHub Actions
gh workflow run cms-content-sync.yml -f purge_type=all

# Via Cloudflare API directly
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# Via Cloudflare Dashboard
# 1. Navigate to Caching → Configuration
# 2. Click "Purge Everything"
# 3. Confirm action
```

### Rollback Deployment

If bad content was published:

```bash
# 1. Revert Git commit
git revert <commit-sha>
git push origin main

# 2. Wait for automatic deployment

# OR manually trigger rollback
# 1. Navigate to Cloudflare Pages dashboard
# 2. Go to deployments
# 3. Find good deployment
# 4. Click "Rollback to this deployment"
```

### Disable Workflow

If continuous deployment needs to pause:

```bash
# Via GitHub CLI
gh workflow disable cms-content-sync.yml

# Via GitHub UI
# 1. Navigate to Actions → cms-content-sync
# 2. Click "⋮" menu
# 3. Select "Disable workflow"

# Re-enable when ready
gh workflow enable cms-content-sync.yml
```

## Security Considerations

### Secrets Management

**GitHub Secrets** (encrypted at rest):
- `CLOUDFLARE_API_TOKEN` - Scoped to Zone:Cache Purge permission only
- `CLOUDFLARE_ACCOUNT_ID` - Can be Secret or Variable (Variable preferred)
- `CLOUDFLARE_ZONE_ID` - Zone identifier (not sensitive, can be Variable)

**Best Practices**:
- Use least-privilege scoped tokens
- Rotate tokens every 90 days
- Never commit secrets to Git
- Use gopass/1Password for local secrets
- Monitor API token usage in Cloudflare Audit Logs

### Cache Poisoning Prevention

**Phase 1 Mitigations**:
- Short max-age (0 seconds) on HTML
- ETag validation on every request
- Immediate purge on content changes
- Security headers prevent injection

**Phase 2 Additional Measures**:
- Cache key normalization
- Origin validation headers
- Rate limiting on purge endpoint
- Signed URLs for sensitive content

### DDoS & Rate Limiting

**Cloudflare Protection**:
- Automatic DDoS mitigation
- Rate limiting rules on /admin/*
- Bot protection via Turnstile
- Challenge page for suspicious traffic

**Worker Protection** (Phase 2):
- Shared secret validation
- Request signature verification
- Rate limiting via Durable Objects
- IP allowlisting option

## Related Documentation

- **Workflow File**: `.github/workflows/cms-content-sync.yml`
- **Cache Headers**: `public/_headers`
- **Middleware**: `functions/_middleware.ts`
- **Admin Headers**: `functions/admin/[[path]].ts`
- **Phase 2 Worker**: `workers/cache-purge/index.ts`
- **Caching Strategy**: `CACHING-STRATEGY.md`
- **Content Update Playbook**: `docs/playbooks/cms-content-update.md`
- **Environment Variables**: `ENVIRONMENT.md`

## Changelog

### October 13, 2025
- ✅ Phase 1 implementation validated end-to-end
- ✅ Preflight checks added to workflow
- ✅ Cache purge tested successfully with real content change
- ✅ Documentation completed and verified
- ✅ All secrets configured and validated
- 🔜 Phase 2 worker prepared (not deployed)

### October 12, 2025
- Implemented cache-purge worker for Phase 2
- Configured wrangler.toml for production route
- Added security headers via Functions middleware

### October 11, 2025
- Initial caching strategy documentation
- Static _headers file configuration
- Phase 1 cache control headers defined

## Future Improvements

### Short Term (Next 30 Days)
1. Add workflow failure notifications (Slack/email)
2. Create Cloudflare Analytics dashboard for cache metrics
3. Document cache hit ratio targets and alerts
4. Set up weekly cache performance reports

### Medium Term (Next 90 Days)
1. Evaluate Phase 2 migration based on traffic growth
2. Implement cache tags for granular invalidation
3. Add cache warming for high-traffic pages
4. Create automated cache testing in CI/CD

### Long Term (Next 180 Days)
1. Multi-CDN strategy with fallback
2. Edge compute for dynamic content assembly
3. Predictive cache preloading
4. Advanced cache analytics and optimization
