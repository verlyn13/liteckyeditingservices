# Decap CMS + GitHub OAuth Workflow (Production‑First)

Last updated: 2025-10-10

This runbook verifies and fixes the Decap CMS OAuth handoff on Cloudflare Pages. It matches the current code paths and headers in this repo.

Key files
- `public/admin/index.html` — Admin shell; loads pkce-boot first, then Decap bundle
- `public/admin/pkce-boot.js` — Early shim; wraps window.open/location before Decap
- `public/admin/pkce-login.js` — PKCE login handler; state-gated exchange; neuters Decap authorizer
- `public/admin/diagnostics.js` — External diagnostics (no inline scripts for CSP)
- `public/admin/preview-banner.js` — Non‑production banner (pages.dev and local)
- `functions/api/config.yml.ts` — Dynamic config with `base_url` and `auth_endpoint`
- `functions/admin/[[path]].ts` — Admin CSP/COOP headers
- `functions/api/auth.ts` — Starts OAuth; honors client state; passes PKCE params to GitHub
- `functions/api/callback.ts` — Validates state; posts authorization code to opener
- `functions/api/exchange-token.ts` — Exchanges code + verifier for access token
- `functions/api/cms-health.ts` — JSON health summary (origin, endpoints, expected Decap)

Production one‑pass (10 minutes)
1) Canonical host + callback
- Console `location.origin` → `https://www.liteckyeditingservices.com`
- GitHub OAuth App callback → `https://www.liteckyeditingservices.com/api/callback`

2) Dynamic config served
- `curl -sI https://www.liteckyeditingservices.com/api/config.yml`
- Expect: `Content-Type: text/yaml`, `Cache-Control: no-store`
- YAML includes:
  - `backend.base_url: https://www.liteckyeditingservices.com`
  - `backend.auth_endpoint: /api/auth`

3) Single Decap bundle + version sanity
- On `/admin` console:
  - `Array.from(document.scripts).filter(s=>/decap-cms/i.test(s.src)).length` → `1`
  - Banners show consistent Decap version from `/vendor/decap/decap-cms.js`

4) OAuth start
- Click Login → verify `/api/auth` 302 to GitHub; HttpOnly cookie `decap_oauth_state` set (Secure on HTTPS)
- Pre‑login console: `localStorage.getItem('netlify-cms-auth:state')` present

5) Callback handoff (server-side exchange with fallback)
- Popup Network → open `/api/callback` response
  - If `oauth_pkce_verifier` cookie present: server exchanges code→token
  - Else: callback posts `{ code, state }` and admin will use `/api/exchange-token`
  - Expect headers:
  - `Cross-Origin-Opener-Policy: unsafe-none`
  - `Content-Security-Policy: default-src 'none'; script-src 'unsafe-inline'; ...`
  - `Cache-Control: no-store`
- Body: inline script posts a token (or code as fallback) to opener origin

6) Acceptance
- Admin receives `{ token }` (or exchanges `{ code, verifier }` as fallback)
- Admin persists the user to localStorage and dispatches store actions (or reloads) so UI flips
- In `/admin` console: `await CMS.getToken().then(Boolean)` → `true`

If any step fails → map to fix
- Host/callback mismatch → update OAuth App; enforce apex→www redirect
- Missing base_url/auth_endpoint → ensure function‑served config; keep `no-store`
- Multiple/mixed bundles → keep one vendored bundle; purge `/admin/*` and `/vendor/decap/*`
- No opener → ensure COOP `unsafe-none` on callback
- CSP violations → admin CSP allows `'unsafe-eval'`; callback CSP allows inline
- State/cookie issues → `/api/auth` must echo Decap `state`; cookie attributes as in code

Local development parity
- Run: `pnpm build && npx wrangler pages dev`
- Dev OAuth App callback: `http://127.0.0.1:8788/api/callback`
- Confirm `/api/config.yml` → `backend.base_url: http://localhost:8788`

Diagnostics
- Health endpoint: `GET /api/cms-health` → origin, config URL, auth/callback, expected Decap version
- Callback header check: `GET /api/callback?diag=1` → returns HTML with the same COOP/CSP/no‑store headers used on successful OAuth handoff
- Preview banner: auto‑visible on non‑production hosts via `public/admin/preview-banner.js`

Logging and correlation
- Correlation cookie: `oauth_trace` is set in `/api/auth` and echoed in `/api/callback` logs as `id`.
- Structured logs: Functions emit single‑line JSON with `evt` and `id` (e.g., `oauth_auth_begin`, `oauth_state_set`, `oauth_token_response`, `oauth_render_callback_html`).
- Dry runs: `/api/auth?dry_run=1` returns a JSON summary (origin, state preview, redirect URL) without redirecting, for quick `redirect_uri` validation.

Cache guidance
- Purge after changes to:
  - `/vendor/decap/decap-cms.js`
  - `public/admin/index.html`
  - `functions/admin/config.yml.ts` or `functions/admin/[[path]].ts`

Current Implementation (PKCE-Only - October 10, 2025)
✅ **PKCE Flow Enforced**:
- `public/admin/pkce-boot.js` - Early boot shim (loads before Decap):
  - Wraps `window.open`, `location.assign/replace` before Decap mounts
  - Intercepts any `/api/auth` calls, prevents Decap's internal authorizer
  - Preserves real opener as `window.__realWindowOpen` for PKCE popup
- `public/admin/pkce-login.js` - PKCE login handler:
  - Generates `code_verifier`/`code_challenge` (S256) and pre-writes state
  - Uses `__realWindowOpen` to launch popup with PKCE params
  - State-gated exchange: only processes codes matching `sessionStorage['oauth_state']`
  - Neuters Decap's OAuth authorizer after CMS mounts (belt and suspenders)
  - Capture-phase click listener blocks Decap's login handler
  - Visual "PKCE" badge on login button
- `/api/auth` - Honors client `state` and passes PKCE params to GitHub
- `/api/callback` - Posts authorization `code` (not token) to opener
- `/api/exchange-token` - Swaps `{ code, verifier }` → `{ token }` server-side
- After exchange, emits canonical success string with token to Decap
- String‑only callback success message (canonical format)
- Dynamic config at `/api/config.yml` with `backend.base_url` + `auth_endpoint: api/auth`
- External diagnostics (no inline): state sweeps, storage write tracer, window.open probe, `__dumpUser()`

**Single Flow Enforcement**:
- No "Invalid OAuth state" popup errors
- No repeated `/api/exchange-token` 400s
- Only one `/api/auth` request with state + S256 PKCE
- Code exchange only runs for messages with matching session state
