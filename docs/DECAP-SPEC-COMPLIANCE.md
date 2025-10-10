# Decap CMS Spec Compliance (October 2025 - Same-Origin OAuth)

This document records how our Decap CMS integration complies with current specs, 2025 best practices, and how to verify it.

## Admin Page (Spec: Install Decap CMS)

- File: `public/admin/index.html` (static HTML, no framework)
- Single `<script>` tag loading `/vendor/decap/decap-cms.js`
- No manual `CMS.init()` call - auto-init only
- Rationale: Single static HTML page with one bundle prevents React double-mount and `removeChild` crashes. Per [Decap install docs](https://decapcms.org/docs/install-decap-cms/).
- Verify (console):
  - `Array.from(document.scripts).map(s=>s.src).filter(s=>/decap-cms/i.test(s)).length === 1`

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
- Verify (console):
  - `Array.from(document.scripts).filter(s=>/decap-cms\.js/.test(s.src)).length === 1`
  - Search all scripts for "CMS.init" - should return 0 results

## GitHub Backend Configuration (Spec: GitHub Backend)

- File: `public/admin/config.yml`
- Backend block:
  ```yml
  backend:
    name: github
    repo: verlyn13/liteckyeditingservices
    branch: main
    auth_endpoint: /api/auth
  ```
- Rationale: Uses on-site OAuth via Pages Functions. `base_url` + `auth_endpoint` pattern per [Decap GitHub backend docs](https://decapcms.org/docs/github-backend/). Works in production and in local dev with `wrangler pages dev` (functions share same origin as admin).

## OAuth Provider (Spec: External OAuth Clients - Same-Origin Implementation)

- Files: `functions/api/auth.ts`, `functions/api/callback.ts`
- Flow:
  1) `/api/auth` (same origin as `/admin`)
     - Honors Decap `state` and `site_id`/`origin` (opener)
     - Persists state in HttpOnly cookie
     - Redirects to GitHub authorize (includes `redirect_uri`, `scope`, `state`, and carries `decap_origin`)
  2) `/api/callback` (same origin as `/admin`)
     - Validates state cookie
     - Exchanges code for access token
     - Posts success message to opener in both formats:
       - String: `authorization:github:success:` + JSON.stringify({ token, provider:'github', token_type:'bearer', state })
       - Object: `{ type:'authorization:github:success', data:{ token, provider:'github', token_type:'bearer', state } }`
     - Resends (0/120/300ms) + ACK; closes popup
     - Headers: COOP `unsafe-none`; minimal inline‑allowed CSP for the callback page only

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
- Kept `base_url` + `auth_endpoint` in config.yml per Decap GitHub backend spec

**Why:**
- Eliminates React double-mount/"removeChild" errors from multiple init paths
- Simplifies local dev: `wrangler pages dev` serves admin + Pages Functions on one origin (localhost:8788)
- Follows Decap install docs exactly (static HTML, single bundle, auto-init from config link)
- Same static HTML works in dev and prod; `base_url` points to production OAuth origin

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
