# Decap CMS + GitHub OAuth Workflow (Production‑First)

Last updated: 2025-10-10

This runbook verifies and fixes the Decap CMS OAuth handoff on Cloudflare Pages. It matches the current code paths and headers in this repo.

Key files
- `public/admin/index.html` — Admin shell; single Decap bundle; debug listener
- `public/admin/preview-banner.js` — Non‑production banner (pages.dev and local)
- `functions/admin/config.yml.ts` — Dynamic config with `base_url` and `auth_endpoint`
- `functions/admin/[[path]].ts` — Admin CSP/COOP headers
- `functions/api/auth.ts` — Starts OAuth; echoes Decap `state`/`origin`; sets cookies
- `functions/api/callback.ts` — Validates state; exchanges token; posts success message; clears cookies
- `functions/api/cms-health.ts` — JSON health summary (origin, endpoints, expected Decap)

Production one‑pass (10 minutes)
1) Canonical host + callback
- Console `location.origin` → `https://www.liteckyeditingservices.com`
- GitHub OAuth App callback → `https://www.liteckyeditingservices.com/api/callback`

2) Dynamic config served
- `curl -sI https://www.liteckyeditingservices.com/admin/config.yml`
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

5) Callback handoff
- Popup Network → open `/api/callback` response
- Expect headers:
  - `Cross-Origin-Opener-Policy: unsafe-none`
  - `Content-Security-Policy: default-src 'none'; script-src 'unsafe-inline'; ...`
  - `Cache-Control: no-store`
- Body: inline script posts both formats to opener origin

6) Acceptance
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
- Confirm `/admin/config.yml` → `backend.base_url: http://localhost:8788`

Diagnostics
- Health endpoint: `GET /api/cms-health` → origin, config URL, auth/callback, expected Decap version
- Callback header check: `GET /api/callback?diag=1` → returns HTML with the same COOP/CSP/no‑store headers used on successful OAuth handoff
- Preview banner: auto‑visible on non‑production hosts via `public/admin/preview-banner.js`

Cache guidance
- Purge after changes to:
  - `/vendor/decap/decap-cms.js`
  - `public/admin/index.html`
  - `functions/admin/config.yml.ts` or `functions/admin/[[path]].ts`

Notes
- Canonical success string: `authorization:github:success:...` (we also send object format)
- `functions/api/auth.ts` honors Decap `state` and `origin`; `functions/api/callback.ts` clears cookies
