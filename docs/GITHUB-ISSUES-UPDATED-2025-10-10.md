# GitHub Issues - Updated Backlog (October 10, 2025)

## Current Focus: PKCE OAuth Implementation

**Context**: Base OAuth flow is working (commit `49f48e5b`). Now implementing PKCE (Proof Key for Code Exchange) for enhanced security and proper token handling.

**Timeline**: October 11-13, 2025
**Reference**: `/docs/playbooks/DECAP-OAUTH-WORKFLOW.md` (lines 82-88)

---

## 🔴 Priority 1: PKCE Implementation (In Progress)

### Issue 1: Implement PKCE Client-Side Flow
**Priority**: Critical
**Estimated**: 3-4 hours

**Description**:
Add PKCE (Proof Key for Code Exchange) to OAuth flow for enhanced security and proper separation of concerns (frontend generates verifier, backend exchanges token).

**Tasks**:
- [ ] Create `public/admin/pkce-login.js`:
  - Generate `code_verifier` (random 43-128 char string)
  - Create `code_challenge` using SHA-256 (S256 method)
  - Pre-write state to localStorage before popup
  - Override Decap's login button to use PKCE flow

- [ ] Update `/functions/api/auth.ts`:
  - Accept `client_state` parameter from PKCE script
  - Accept `code_challenge` and `code_challenge_method` parameters
  - Pass PKCE params to GitHub authorize URL
  - Store `code_challenge` in cookie for validation

- [ ] Update `/functions/api/callback.ts`:
  - Post `code` (authorization code) to opener instead of `access_token`
  - Use compatibility format: `"authorization:github:code:{\"code\":\"...\",\"state\":\"...\"}`
  - Remove direct token exchange (will be done client-side)

- [ ] Create `/functions/api/exchange-token.ts`:
  - Accept `{ code, verifier }` from client
  - Validate `code_challenge` from cookie matches verifier
  - Exchange code for token with GitHub
  - Return `{ token, token_type }` to client
  - Client then emits canonical success message to Decap

**Definition of Done**:
- [ ] PKCE flow completes without errors
- [ ] Authorization code properly exchanged for token
- [ ] Decap CMS loads editor successfully
- [ ] No security warnings in browser console
- [ ] Works in both dev and production

**References**:
- RFC 7636: PKCE specification
- GitHub OAuth docs: PKCE support
- Decap CMS external OAuth documentation

---

### Issue 2: PKCE Testing & Validation
**Priority**: Critical
**Estimated**: 2 hours

**Description**:
Comprehensive testing of PKCE implementation across environments and edge cases.

**Tasks**:
- [ ] Test complete PKCE flow in development (`http://127.0.0.1:8788`)
- [ ] Test complete PKCE flow in production (`https://www.liteckyeditingservices.com`)
- [ ] Verify `code_challenge` validation (reject mismatched verifier)
- [ ] Test state parameter handling (CSRF protection)
- [ ] Verify token storage in Decap localStorage
- [ ] Test editor transition and content loading
- [ ] Document any issues or edge cases discovered

**Definition of Done**:
- [ ] All environments tested successfully
- [ ] Security validations confirmed working
- [ ] Edge cases documented
- [ ] Test results recorded in `/docs/troubleshooting/`

---

## 🟡 Priority 2: Monitoring & Reliability (Deferred - Post-PKCE)

**Status**: Documentation complete, implementation deferred until after PKCE

### Issue 3: External Uptime Monitoring
**Priority**: High (after PKCE)
**Estimated**: 30 minutes

**Description**:
Set up external uptime monitoring using UptimeRobot (free tier).

**Reference**: `/docs/infrastructure/UPTIME-MONITORING.md`

**Tasks**:
- [ ] Create UptimeRobot account
- [ ] Add 3 monitors:
  - Homepage: `https://www.liteckyeditingservices.com/`
  - Contact form: `https://www.liteckyeditingservices.com/contact`
  - Admin health: `https://www.liteckyeditingservices.com/api/cms-health`
- [ ] Configure alert email
- [ ] Set check interval (5min free / 1min paid)
- [ ] Test alerts

**Definition of Done**:
- [ ] 3 monitors active and reporting
- [ ] Alert email configured and tested
- [ ] Screenshots of dashboard saved to `/docs/infrastructure/`

---

### Issue 4: Cloudflare Error Alerting Worker
**Priority**: High (after PKCE)
**Estimated**: 2 hours

**Description**:
Implement scheduled Worker to monitor Pages/Workers errors and send alerts.

**Reference**: `/docs/infrastructure/ERROR-ALERTING.md`

**Tasks**:
- [ ] Create `workers/error-monitor/` Worker
- [ ] Implement Workers Analytics API integration
- [ ] Add Pages deployment failure detection
- [ ] Configure SendGrid email alerts
- [ ] Set alert thresholds (5% error rate, deployment failures)
- [ ] Deploy with Wrangler
- [ ] Set secrets: `CLOUDFLARE_API_TOKEN`, `SENDGRID_API_KEY`, `ALERT_EMAIL`

**Definition of Done**:
- [ ] Worker deployed and running on schedule (every 15 minutes)
- [ ] Alert thresholds validated
- [ ] Test alert received successfully
- [ ] Documented in `/docs/infrastructure/`

---

### Issue 5: Queue Health Monitoring Worker
**Priority**: Medium (after PKCE)
**Estimated**: 2.5 hours

**Description**:
Monitor `send-email-queue` health with KV-based metrics.

**Reference**: `/docs/infrastructure/QUEUE-HEALTH.md`

**Tasks**:
- [ ] Create `workers/queue-health/` Worker
- [ ] Create KV namespace: `wrangler kv:namespace create QUEUE_STATS`
- [ ] Implement metrics tracking (produced vs consumed)
- [ ] Instrument `/functions/api/contact.ts` (producer)
- [ ] Instrument `workers/queue-consumer/` (consumer)
- [ ] Add alert logic (>10 messages = warning, >50 = critical)
- [ ] Configure daily health report email
- [ ] Deploy and test

**Definition of Done**:
- [ ] Queue metrics tracking accurately
- [ ] Alerts trigger at correct thresholds
- [ ] Daily report email received
- [ ] Documented in `/docs/infrastructure/`

---

## 🟢 Priority 3: Testing & Quality (After PKCE)

### Issue 6: Production E2E Test Suite ✅ DONE
**Status**: Complete
**Completed**: October 4, 2025

Tests passing against `https://liteckyeditingservices.com`:
- ✅ Homepage load and navigation
- ✅ Contact form submission
- ✅ Security headers validation
- ✅ Visual regression (4 baseline screenshots)

**No action needed** - Tests are current and passing.

---

### Issue 7: Expand E2E Failure State Coverage
**Priority**: Medium (after PKCE)
**Estimated**: 3 hours

**Description**:
Add E2E tests for error states and edge cases.

**Tasks**:
- [ ] Form validation errors (missing fields, invalid email)
- [ ] Turnstile edge cases (failure, timeout, network error)
- [ ] Rate limiting scenarios (trigger 429 responses)
- [ ] Network failures (simulate offline, timeout)
- [ ] OAuth failure states (GitHub deny, invalid state, expired code)

**Definition of Done**:
- [ ] 10+ failure state tests added
- [ ] Tests documented in `/tests/e2e/`
- [ ] CI pipeline runs all tests
- [ ] Coverage report shows >80% edge case coverage

---

### Issue 8: Visual Regression - Additional Pages
**Priority**: Low (after PKCE)
**Estimated**: 30 minutes

**Description**:
Expand visual regression testing to all 7 pages.

**Current**: Home + Services (4 screenshots)
**Needed**: About, Testimonials, FAQ, Process, Contact

**Tasks**:
- [ ] Update `/tests/e2e/visual.spec.ts`
- [ ] Add tests for 5 remaining pages
- [ ] Generate baselines: `pnpm test:e2e:prod -g "@visual" --update-snapshots`
- [ ] Commit baseline images
- [ ] Verify CI detects visual changes

**Definition of Done**:
- [ ] 14 baseline screenshots (7 pages × 2 devices)
- [ ] CI fails on visual regressions
- [ ] Documented in `/docs/testing/VISUAL-REGRESSION-GUIDE.md`

---

### Issue 9: Accessibility Audit (WCAG 2.1 AA)
**Priority**: High (after PKCE)
**Estimated**: 4 hours

**Description**:
Complete accessibility sweep for all 7 pages.

**Tasks**:
- [ ] Run pa11y on all pages:
  ```bash
  pa11y --standard WCAG2AA https://www.liteckyeditingservices.com/
  pa11y --standard WCAG2AA https://www.liteckyeditingservices.com/services
  # ... (5 more pages)
  ```
- [ ] Manual screen reader testing (VoiceOver/NVDA)
- [ ] Keyboard navigation testing
- [ ] Color contrast validation
- [ ] Fix all critical/serious violations
- [ ] Document findings and fixes

**Definition of Done**:
- [ ] All pages pass pa11y WCAG2AA
- [ ] Manual testing complete (checklist)
- [ ] Fixes deployed and verified
- [ ] Documented in `/docs/testing/A11Y-AUDIT-REPORT.md`

---

## 🔵 Priority 4: Performance (After PKCE)

### Issue 10: Image Optimization
**Priority**: Medium
**Estimated**: 3 hours

**Description**:
Optimize images for performance (LCP < 2.5s on mobile 4G).

**Tasks**:
- [ ] Audit current images (formats, sizes, loading)
- [ ] Convert to WebP/AVIF with fallbacks
- [ ] Implement responsive images (`srcset`, `sizes`)
- [ ] Add lazy loading for below-fold images
- [ ] Optimize hero images (largest contentful paint)
- [ ] Test LCP on mobile 4G (Lighthouse throttling)

**Definition of Done**:
- [ ] LCP < 2.5s for home and services pages (mobile 4G)
- [ ] All images optimized (WebP/AVIF)
- [ ] Lighthouse performance score >90
- [ ] Documented in `/docs/PERFORMANCE-OPTIMIZATIONS.md`

---

### Issue 11: Code Splitting & Lazy Loading
**Priority**: Low
**Estimated**: 2 hours

**Description**:
Review and optimize JavaScript bundle size.

**Tasks**:
- [ ] Analyze current bundle with Astro build output
- [ ] Identify heavy components (FileUpload.svelte, etc.)
- [ ] Implement lazy loading for interactive components
- [ ] Code-split by route/page
- [ ] Measure bundle size reduction

**Definition of Done**:
- [ ] Initial JS bundle < 100KB gzipped
- [ ] Interactive components lazy-loaded
- [ ] Bundle analysis documented
- [ ] No regression in functionality

---

### Issue 12: Cloudflare Caching Strategy
**Priority**: Medium
**Estimated**: 2 hours

**Description**:
Optimize Cloudflare caching for static assets and selective HTML caching.

**Tasks**:
- [ ] Audit current cache headers (`/public/_headers`)
- [ ] Set long TTL for static assets (images, CSS, JS)
- [ ] Implement short TTL for HTML where safe (5min for static pages)
- [ ] Test cache hit rates in Cloudflare dashboard
- [ ] Document cache strategy

**Definition of Done**:
- [ ] Static assets cached for 1 year
- [ ] HTML caching enabled for static pages
- [ ] Cache hit rate >80%
- [ ] Documented in `/docs/infrastructure/CACHING-STRATEGY.md`

---

### Issue 13: Core Web Vitals Monitoring
**Priority**: Medium
**Estimated**: 1 hour

**Description**:
Set up Core Web Vitals monitoring using Cloudflare Web Analytics or alternative.

**Tasks**:
- [ ] Enable Cloudflare Web Analytics (free, privacy-friendly)
- [ ] Configure real user monitoring (RUM)
- [ ] Set up alerts for degraded metrics
- [ ] Monitor LCP, FID, CLS over 28 days
- [ ] Document baseline metrics

**Definition of Done**:
- [ ] Web Analytics enabled
- [ ] 7 days of baseline data collected
- [ ] Alerts configured for degraded metrics
- [ ] Dashboard screenshot in `/docs/infrastructure/`

---

## 🟣 Priority 5: Security (After PKCE)

### Issue 14: CSP Hardening with Nonces ✅ PARTIALLY DONE
**Status**: CSP implemented, nonces pending
**Completed**: October 4, 2025 (basic CSP)
**Remaining**: Nonce implementation

**Current**: CSP with `'unsafe-inline'` for scripts/styles
**Needed**: Replace with nonce-based CSP

**Tasks**:
- [ ] Generate nonces in Astro layout
- [ ] Update `public/_headers` to use nonces
- [ ] Remove `'unsafe-inline'` from CSP
- [ ] Test all pages for CSP violations
- [ ] Update Svelte components to use nonces

**Definition of Done**:
- [ ] No `'unsafe-inline'` in CSP
- [ ] All scripts/styles use nonces
- [ ] No CSP violations in console
- [ ] SecurityHeaders.com grade A+

---

### Issue 15: Dependency Security Audit
**Priority**: High
**Estimated**: 1 hour

**Description**:
Regular dependency audits and updates.

**Tasks**:
- [ ] Run `pnpm audit` and review vulnerabilities
- [ ] Update dependencies with fixes
- [ ] Test for breaking changes
- [ ] Set up automated Dependabot/Renovate
- [ ] Document update process

**Definition of Done**:
- [ ] `pnpm audit` shows 0 high/critical vulnerabilities
- [ ] All dependencies current (within 1 minor version)
- [ ] Automated updates configured
- [ ] Update process documented

---

## 🟠 Priority 6: SEO & Content (After PKCE)

### Issue 16: Meta Descriptions & Open Graph Images
**Priority**: Medium
**Estimated**: 2 hours

**Description**:
Add SEO metadata to all pages.

**Tasks**:
- [ ] Write meta descriptions for all 7 pages (155-160 chars)
- [ ] Create Open Graph images (1200×630px)
- [ ] Add Twitter Card metadata
- [ ] Implement in Astro layouts/pages
- [ ] Test with social media preview tools

**Definition of Done**:
- [ ] All pages have unique meta descriptions
- [ ] All pages have OG images
- [ ] Preview renders correctly on Facebook/Twitter/LinkedIn
- [ ] Documented in page frontmatter

---

### Issue 17: Sitemap & Search Console Setup
**Priority**: Medium
**Estimated**: 1 hour

**Description**:
Submit sitemap and verify in Google Search Console.

**Tasks**:
- [ ] Verify sitemap.xml is generated correctly
- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Verify indexing (wait 48 hours)
- [ ] Check for coverage errors
- [ ] Fix any indexing issues

**Definition of Done**:
- [ ] Sitemap submitted to Google & Bing
- [ ] All 7 pages indexed
- [ ] No coverage errors
- [ ] Screenshots in `/docs/SEO-SETUP.md`

---

### Issue 18: High-Value Content Creation
**Priority**: Low
**Estimated**: 6-8 hours (content creation)

**Description**:
Add 2-3 high-value content pieces for SEO and authority.

**Ideas**:
1. Case study: "How We Helped [Client] Publish Their Dissertation"
2. Resource: "Academic Writing Style Guide for Graduate Students"
3. Guide: "Dissertation Editing Checklist: 50 Points to Review"

**Tasks**:
- [ ] Plan content topics and outlines
- [ ] Write content (or collaborate with domain expert)
- [ ] Add to Decap CMS as blog posts/resources
- [ ] Optimize for SEO (keywords, structure, links)
- [ ] Promote on social media

**Definition of Done**:
- [ ] 2-3 pieces published
- [ ] SEO-optimized (target keywords, internal links)
- [ ] Promoted via social channels
- [ ] Analytics tracking setup

---

## ⚫ Priority 7: Developer Experience (After PKCE)

### Issue 19: Validate Windsurf Cascade Workflows
**Priority**: Low
**Estimated**: 30 minutes

**Description**:
Verify all Cascade workflows are functional.

**Tasks**:
- [ ] List all `.cascade` files in `.cascade/`
- [ ] Test each workflow in Windsurf
- [ ] Fix any broken workflows
- [ ] Document usage in README

**Definition of Done**:
- [ ] All workflows tested and functional
- [ ] Documentation updated
- [ ] Screenshots added to `/docs/WINDSURF-SETUP.md`

---

### Issue 20: MCP Server Configuration
**Priority**: Low
**Estimated**: 30 minutes

**Description**:
Verify MCP servers available in Windsurf.

**Tasks**:
- [ ] Check filesystem MCP server
- [ ] Check ripgrep MCP server
- [ ] Check git MCP server
- [ ] (Optional) Add web search MCP server
- [ ] (Optional) Add OpenAPI MCP server
- [ ] Document MCP setup

**Definition of Done**:
- [ ] All core MCP servers verified working
- [ ] Optional servers evaluated
- [ ] Configuration documented

---

## 📊 Summary & Prioritization

### Immediate Focus (Next 48 hours)
1. **PKCE Implementation** (Issues #1-2) - 5-6 hours total
2. **PKCE Testing & Documentation** - 2 hours

### Post-PKCE (Week of Oct 14)
3. **Monitoring Setup** (Issues #3-5) - 5 hours total
4. **A11y Audit** (Issue #9) - 4 hours
5. **Security Audit** (Issue #15) - 1 hour

### Ongoing/Lower Priority
- Performance optimizations (Issues #10-13)
- SEO enhancements (Issues #16-18)
- Testing expansion (Issues #7-8)
- Developer tooling (Issues #19-20)

---

## Issue Creation Guidelines

When creating GitHub Issues from this backlog:

1. **Title Format**: `[Category] Short descriptive title`
   - Examples: `[Auth] Implement PKCE OAuth flow`, `[A11y] WCAG 2.1 AA audit`

2. **Labels to Apply**:
   - Priority: `p0-critical`, `p1-high`, `p2-medium`, `p3-low`
   - Category: `auth`, `monitoring`, `testing`, `performance`, `security`, `seo`, `dx`
   - Status: `in-progress`, `blocked`, `ready`

3. **Required Sections**:
   - Description
   - Tasks (checkboxes)
   - Definition of Done
   - References (documentation links)
   - Estimated hours

4. **Link Related Issues**:
   - Use "Depends on #X" for dependencies
   - Use "Related to #X" for connections
   - Create milestones for grouped work (e.g., "PKCE Implementation")

---

**Created**: October 10, 2025
**Last Updated**: October 10, 2025
**Next Review**: After PKCE implementation complete
