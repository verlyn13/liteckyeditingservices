# Playbook: Migrate Admin from CDN Bundle to `decap-cms-app` (npm)

Status: In progress (flagged rollout)
Owner: Web Platform

## Objectives
- Eliminate mixed-version Decap loads.
- Control CMS.init and hydration deterministically.
- Keep CSP clean (no inline/module requirements).

## Architecture Delta
- Before: `public/vendor/decap/decap-cms.js` auto-inits from `<link rel="cms-config-url">`.
- After: `src/cms/index.ts` imports `decap-cms-app` and calls `CMS.init({ config })`.
- Admin HTML loads `/admin/cms.js` instead of the vendor bundle.

## Build Strategy
- Option A (simple): esbuild script that bundles `src/cms/index.ts` → `public/admin/cms.js`.
- Option B (Astro/Vite): use Vite library mode via a small `vite.cms.config.ts` that outputs to `public/admin`.

Recommended (A) for speed:
- Create `scripts/build/cms-build.mjs`:
  - Programmatic esbuild bundle `src/cms/index.ts` to `public/admin/cms.js`.
  - `sourcemap:false`, `minify:true`, `target:['es2025']`, `platform:'browser'`.
- Add `"cms:build": "node scripts/build/cms-build.mjs"` and run it before `astro build`.

## Auth & Hydration Flow (npm path)
1. OAuth completes; opener receives canonical message:
   `authorization:github:success:{ token, state }`
2. `src/cms/index.ts` listener:
   - Persists `{ token, backendName:'github', login:'github', isGuest:false }` to `decap-cms-user` and `netlify-cms-user`.
   - If store exists, dispatches `LOGIN_SUCCESS`.
   - Navigates `location.replace('/admin/#/')`.
3. Post-boot hydrator (kept initially):
   - Waits for store, re-emits canonical string, dispatches `LOGIN_SUCCESS` as fallback, soft reload once.

## CSP Considerations
- Keep current `/admin/*` CSP. No inline scripts are needed.
- If using Sentry CDN, keep `https://browser.sentry-cdn.com` in `script-src`.

## Admin HTML Switch (Feature Flag)
- Add `ADMIN_CMS_NPM=1`.
- If set, load `/admin/cms.js`; else load vendor bundle.
- Purge CDN after switching; hard-reload with cache disabled.

## Tests & Validation
- Update Playwright admin tests to look for a single Decap version line.
- Keep existing probes:
  - `JSON.parse(localStorage.getItem('decap-cms-user')||'null')`
  - `await window.CMS?.getToken?.()` → non-null after init/hydrator
  - `Boolean(window.CMS?.reduxStore || window.CMS?.store)`
- Sentry optional: breadcrumbs visible as `hydr:*` when enabled.

## Rollback
- Swap admin HTML back to vendor bundle and purge CDN.
- Leave `/admin/cms.js` unreferenced for future reattempt.

## Acceptance Criteria
- Admin boots with a single Decap version line.
- After OAuth, editor view loads with a token present (`CMS.getToken()` not null).
- No CSP violations in console; no ESM/import.meta errors.
