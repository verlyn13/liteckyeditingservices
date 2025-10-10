# Decap CMS Spec Compliance (October 2025 - Same-Origin OAuth)

This document records how our Decap CMS integration complies with current specs, 2025 best practices, and how to verify it.

## Admin Page (Spec: Install Decap CMS)

- File: `public/admin/index.html` (static HTML, no framework)
- Single `<script>` tag loading `/vendor/decap/decap-cms.js`
- No manual `CMS.init()` call - auto-init only
- Rationale: Single static HTML page with one bundle prevents React double-mount and `removeChild` crashes. Per [Decap install docs](https://decapcms.org/docs/install-decap-cms/).
- Verify (console): `Array.from(document.scripts).map(s=>s.src).filter(s=>/decap-cms/i.test(s)).length === 1`

## Config Discovery (Spec: Configuration Options)

- File: `public/admin/index.html`
- Link element:
  - `<link href="/admin/config.yml" type="text/yaml" rel="cms-config-url" />`
- Rationale: Decap discovers YAML config via a link with `rel="cms-config-url"` and `type="text/yaml"`.
- Verify (console):
  - `const link = document.querySelector('link[rel="cms-config-url"]');`
  - `link && link.href.endsWith('/admin/config.yml') && link.type === 'text/yaml'`

## Initialization Mode (Spec: Manual Initialization)

- Mode: Auto‑init (default). We do not call `CMS.init()` anywhere.
- Implementation: Single `<script>` in `public/admin/index.html` loads bundle; Decap auto-inits from config link.
- Why: Mixing manual init + auto init causes double render and React `removeChild` crashes.
- Verify (console): `Array.from(document.scripts).filter(s=>/decap-cms\.js/.test(s.src)).length === 1` and searching all scripts for "CMS.init" returns 0 results

## GitHub Backend Configuration (Spec: GitHub Backend)

- File: `public/admin/config.yml`
- Backend block:
  ```yml
  backend:
    name: github
    repo: verlyn13/liteckyeditingservices
    branch: main
    base_url: https://www.liteckyeditingservices.com
    auth_endpoint: /api/auth
  ```
- Rationale: Uses on-site OAuth via Pages Functions with same-origin `auth_endpoint`. **IMPORTANT**: `base_url` is required to prevent Decap from falling back to Netlify's OAuth proxy (api.netlify.com). The `base_url` tells Decap where to resolve the `auth_endpoint`, resulting in correct OAuth flow: `https://www.liteckyeditingservices.com/api/auth` instead of `https://api.netlify.com/api/auth`.
- Works in production and in local dev with `wrangler pages dev` (functions share the same origin as admin).

## OAuth Provider (Spec: External OAuth Clients - Same-Origin Implementation)

- Files: `functions/api/auth.ts`, `functions/api/callback.ts`
- Flow (server-side OAuth with popup postMessage):
  1) `/api/auth` (server-side, same origin as `/admin`)
     - Honors Decap `state` and `site_id`/`origin` (opener)
     - Persists state in HttpOnly cookie
     - Redirects to GitHub authorize (includes `redirect_uri`, `scope`, `state`, and carries `decap_origin`)
  2) `/api/callback` (server-side, GitHub redirect target - RETURNS HTML)
     - Validates state cookie
     - Exchanges code for access token
     - **Returns HTML with inline postMessage script** (not a redirect)
     - The popup window IS this page - it posts message to its opener
     - Token embedded server-side in HTML (never in URL)
     - Posts success message to opener in both formats:
       - String: `authorization:github:success:` + JSON.stringify({ token, provider:'github', token_type:'bearer', state })
       - Object: `{ type:'authorization:github:success', data:{ token, provider:'github', token_type:'bearer', state } }`
     - Resends multiple times (0ms/100ms/200ms) for reliability
     - Auto-closes after 3s
     - CSP: Allows 'unsafe-inline' (this response only, not admin pages)

- Verify (prod, after login):
  - `await CMS.getToken().then(Boolean) === true`
  - `await CMS.getBackend().then(b=>b?.listCollections?.())` resolves (or clear 401/403 if scopes needed)

## Local Development (2025 Best Practice)

- Use `npx wrangler pages dev` (after `pnpm build`) to serve static output and Pages Functions on **one origin**
- This matches production behavior where `/admin` and `/api/*` are same-origin
- Prevents origin/state mismatch that causes "token never set" in dev
- Per [Cloudflare Pages local development docs](https://developers.cloudflare.com/pages/functions/local-development/)
- Verify:
  - In `wrangler pages dev`, navigate to `/admin`
  - Complete OAuth flow (popup opens to same origin)
  - After auth: `await CMS.getToken().then(Boolean) === true`

## Security Headers

- `/admin/*` (Pages Function):
  - CSP: no third‑party script hosts; `script-src 'self' 'unsafe-eval'` only; `connect-src` includes GitHub endpoints
  - COOP: `unsafe-none`; COEP: not set
- `/api/callback` (Function response):
  - Inline‑allowed CSP (tiny handoff script); COOP: `unsafe-none`

## Cache & Deployment

- Purge Pages cache after changes to `/admin/*` or vendor bundle to prevent stale assets.
- See DEPLOYMENT.md "Admin Cache Purge".

## Migration Notes (October 2025)

**Changes from previous implementation:**
- Removed `src/pages/admin/index.astro` (Astro framework page with dynamic initialization)
- Removed `public/admin/boot.js`, `debug.js`, `diagnose.js` (runtime injection scripts with HMR guards and cache-busting)
- Replaced with single static `public/admin/index.html` with direct `<script src="/vendor/decap/decap-cms.js">`
- Archived old files to `_archive/admin-migration-2025-10-09/`
- **October 2025 OAuth fix #1**: Added `base_url` to config.yml to prevent Netlify API fallback
- **October 2025 OAuth fix #2**: Disabled debug-oauth.js (MIME type error - file not copied to dist)
- **October 2025 OAuth fix #3**: Added `/admin/oauth-callback.html` (two-callback architecture)
  - `/api/callback` now redirects to `/admin/oauth-callback` with token in hash
  - This is the proper Decap CMS OAuth pattern (server callback + client popup callback)

**Why:**
- Eliminates React double-mount/"removeChild" errors from multiple init paths
- Simplifies local dev: `wrangler pages dev` serves admin + Pages Functions on one origin (localhost:8788)
- Follows Decap install docs exactly (static HTML, single bundle, auto-init from config link)
- `base_url` + `auth_endpoint` ensures OAuth goes to our domain, not api.netlify.com
- Removing debug-oauth.js prevents console errors in production (file wasn't being deployed)

## References
- [Decap CMS: Install](https://decapcms.org/docs/install-decap-cms/) - Single bundle, auto-init
- [Decap CMS: Configuration Options](https://decapcms.org/docs/configuration-options/) - Config link: `rel="cms-config-url"`, `type="text/yaml"`
- [Decap CMS: Manual Initialization](https://decapcms.org/docs/manual-initialization/) - Auto‑init vs manual
- [Decap CMS: GitHub Backend](https://decapcms.org/docs/github-backend/) - `auth_endpoint` (with or without `base_url`)
- [Cloudflare Pages: Local Development](https://developers.cloudflare.com/pages/functions/local-development/) - `wrangler pages dev` for same-origin testing
- [Community OAuth Provider Standard](https://github.com/vencax/netlify-cms-github-oauth-provider) - Success message formats

---

## Decap bundle pin (stability note)

Pinned to: decap-cms 3.8.4 as a single vendored file at `/vendor/decap/decap-cms.js`.

When bumping:
1) Replace the vendored file (or update a versioned CDN URL if you switch to CDN).
2) Run the smoke test below.
3) Purge Pages cache for `/admin/*` and `/vendor/decap/*`.

### Smoke test (console)
- Open `/admin`, then:
  1) Before login: `localStorage.getItem('netlify-cms-auth:state')` — copy value
  2) Login with GitHub; wait for popup to close.
  3) Confirm token: `await CMS.getToken().then(Boolean)` — should be `true`
  4) Optional collections check: `await CMS.getBackend().then(Boolean)` — should be `true`
Minor CSP hash update for debug logging
