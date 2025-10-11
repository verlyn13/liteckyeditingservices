# ADR-002: Move Admin CMS Delivery from CDN Bundle to `decap-cms-app` (npm)

Date: 2025-10-11
Status: Proposed → Accepted (behind flag) → Rollout

## Context
- Current admin boot uses a vendored CDN bundle (`public/vendor/decap/decap-cms.js`).
- We’ve observed mixed-version boots (core/app banner) causing unreliable LS hydration after OAuth.
- We added a post-boot hydrator to nudge hydration safely, but we still depend on timing of Decap’s auto-init path.

## Decision
Migrate to `decap-cms-app` (npm) with an explicit CMS entry we control and bundle as `/admin/cms.js`.

## Rationale
- Deterministic init: we control CMS.init and can dispatch `LOGIN_SUCCESS` on the store when needed.
- No mixed bundles: remove ambiguity between core/app console banners.
- Extensibility: custom widgets, previews, and instrumentation become first-class.
- CSP simplicity: remove reliance on vendor bundle versioning; single built asset with our CSP profile.

## Plan (Phased)
1) Scaffold (no prod impact)
   - Create `src/cms/index.ts` with CMS.init and message listener for canonical auth success.
   - Keep CDN bundle live while we iterate; do not change admin HTML yet.
2) Build path
   - Add a dedicated build step to output `public/admin/cms.js` (Vite library mode or esbuild script).
   - Ensure sourcemaps and license banners are disabled or CSP-safe.
3) Dual-boot flag
   - Add feature flag `ADMIN_CMS_NPM=1` to switch admin HTML from vendor to `/admin/cms.js` in preview.
   - Purge CDN and validate preview boots with a single version line.
4) Flip + soak
   - Flip flag in production after preview passes OAuth/E2E.
   - Keep post-boot hydrator as belt-and-suspenders for one release.
5) Retire vendor bundle
   - Remove `/public/vendor/decap/*` and cache-bust references.

## Risks & Mitigations
- Build output not emitted to `public/`: use explicit build script that writes to `public/admin/cms.js`.
- Timing regressions in auth: retain hydrator; dispatch store action if token is present.
- CSP drift: keep the existing `/admin/*` CSP; no inline/module scripts required.

## Consequences
- More control over admin boot; easier debugging; stable hydration.
- Slightly more build complexity (one extra asset). 

## Alternatives Considered
- Staying on CDN with hydrator only: works, but timing remains coupled to Decap’s auto-init internals.
- Hybrid (CDN + small npm shim): keeps mixed concerns, doesn’t solve version skew cleanly.

## Rollback Plan
- Revert admin HTML to vendor bundle and purge CDN.
- Leave `src/cms/index.ts` in tree for later reattempt.

