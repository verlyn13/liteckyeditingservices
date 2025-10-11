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
  - `<link href="/api/config.yml" type="text/yaml" rel="cms-config-url" />`
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

- File: `functions/api/config.yml.ts` (dynamic Pages Function)
- Backend block (generated):
  ```yml
  backend:
    name: github
    repo: verlyn13/liteckyeditingservices
    branch: main
    base_url: ${origin}  # Dynamically set to request origin
    auth_endpoint: /api/auth
  ```
- Rationale: **CRITICAL**: When using external/self-hosted OAuth handlers, `base_url` is **required** for Decap to enter "external-auth" mode. Without it, Decap won't attach the postMessage listener that processes `authorization:github:success:` messages, even if the messages arrive correctly.
- Dynamic config ensures both dev (`http://127.0.0.1:8788`) and prod (`https://www.liteckyeditingservices.com`) get correct `base_url` without environment-specific files.
- References:
  - [Decap Backends Overview](https://decapcms.org/docs/backends-overview/) - GitHub + OAuth proxy requires `base_url` and `auth_endpoint`
  - [Cloud.gov Decap docs](https://docs.cloud.gov/pages/using-pages/getting-started-with-netlify-cms/) - Authoritative example showing both fields
  - [vencax OAuth provider](https://github.com/vencax/netlify-cms-github-oauth-provider) - Requires `base_url` in CMS config
- Served via Pages Function at `/admin/config.yml` (no static file).

## OAuth Provider (Spec: External OAuth Clients - Same-Origin Implementation)

- Files: `functions/api/auth.ts`, `functions/api/callback.ts`, `functions/api/exchange-token.ts`
- Flow (split exchange with popup postMessage):
  1) `/api/auth` (server-side, same origin as `/admin`)
     - Honors client-provided `state` and PKCE params; persists `state` in HttpOnly cookie
     - Redirects to GitHub authorize with `redirect_uri`, `scope`, `state`, and `code_challenge`
  2) `/api/callback` (server-side; RETURNS HTML)
     - Validates `state` and posts the authorization `code` (not token) to the opener via `postMessage`
     - COOP: `unsafe-none`; CSP: inline allowed for this tiny handoff HTML only
  3) Admin window receives `{ code, state }`, verifies `state` matches its session, and calls `/api/exchange-token` with `{ code, verifier }`.
  4) `/api/exchange-token` (server-side)
     - Exchanges code+verifier with GitHub; responds JSON containing both `access_token` and `token` for compatibility
  5) Admin re-emits the canonical Decap success string with the token, persists the user to `localStorage` under both keys, and dispatches store actions (or reloads) so the UI flips reliably without the Decap authorizer.

- Verify (prod, after login):
  - `await CMS.getToken().then(Boolean) === true`
  - `localStorage.getItem('decap-cms-user')` or `'netlify-cms-user'` is present
  - Page is on the editor, not the login screen

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
- **October 2025 OAuth fix #1**: Disabled debug-oauth.js (MIME type error - file not copied to dist)
- **October 2025 OAuth fix #2**: Changed `/api/callback` to return HTML directly (not redirect to separate page)
  - Maintains popup window context for postMessage to work
  - Sends both string and object message formats for compatibility
- **October 2025 OAuth fix #3**: Added debug postMessage listener to diagnose message delivery
  - Confirmed messages arriving but Decap not processing them
- **October 2025 OAuth fix #4 (CRITICAL)**: Created dynamic config.yml Pages Function
  - `base_url` is **required** for external OAuth to work
  - Without it, Decap doesn't enter "external-auth" mode and ignores postMessage
  - Dynamic config ensures correct origin in both dev and prod
  - Archived static `public/admin/config.yml` to `config.yml.static-archive`

**Why:**
- Eliminates React double-mount/"removeChild" errors from multiple init paths
- Simplifies local dev: `wrangler pages dev` serves admin + Pages Functions on one origin
- Follows Decap install docs exactly (static HTML, single bundle, auto-init from config link)
- `base_url` + `auth_endpoint` tells Decap to use external OAuth and listen for postMessage events
- Dynamic config prevents env-specific configuration drift

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
