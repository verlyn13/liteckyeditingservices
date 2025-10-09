# Decap CMS Spec Compliance (October 2025)

This document records how our Decap CMS integration complies with current specs and common patterns, and how to verify it.

## Config Discovery (Spec: Configuration Options)

- File: `src/pages/admin/index.astro`
- Link element:
  - `<link href="/admin/config.yml" type="text/yaml" rel="cms-config-url" />`
- Rationale: Decap discovers YAML config via a link with `rel="cms-config-url"` and `type="text/yaml"`.
- Verify (console):
  - `const link = document.querySelector('link[rel="cms-config-url"]');`
  - `link && link.href.endsWith('/admin/config.yml') && link.type === 'text/yaml'`

## Initialization Mode (Spec: Manual Initialization)

- Mode: Auto‑init (default). We do not call `CMS.init()`.
- File: `public/admin/boot.js`
  - Injects bundle once (guarded) and relies on auto‑init from config link.
- Why: Mixing manual init + auto init causes double render and React `removeChild` crashes.
- Verify (console):
  - `fetch('/admin/boot.js').then(r=>r.text()).then(t=>!t.includes('CMS.init'))`
  - `Array.from(document.scripts).filter(s=>/decap-cms\.js/.test(s.src)).length === 1`

## GitHub Backend Configuration (Spec: GitHub Backend)

- File: `public/admin/config.yml`
- Top block:
  ```yml
  backend:
    name: github
    repo: verlyn13/liteckyeditingservices
    branch: main
    base_url: https://www.liteckyeditingservices.com
    auth_endpoint: /api/auth
  ```
- Rationale: On‑site OAuth behind Pages Functions keeps origin consistent with `/admin`.

## OAuth Provider (Spec: External OAuth Clients)

- Files: `functions/api/auth.ts`, `functions/api/callback.ts`
- Flow:
  1) `/api/auth`
     - Honors Decap `state` and `site_id`/`origin` (opener)
     - Persists state in HttpOnly cookie
     - Redirects to GitHub authorize (includes `redirect_uri`, `scope`, `state`, and carries `decap_origin`)
  2) `/api/callback`
     - Validates state cookie
     - Exchanges code for access token
     - Posts success message to opener in both formats:
       - String: `authorization:github:success:` + JSON.stringify({ token, provider:'github', token_type:'bearer', state })
       - Object: `{ type:'authorization:github:success', data:{ token, provider:'github', token_type:'bearer', state } }`
     - Resends (0/120/300ms) + ACK; closes popup
     - Headers: COOP `unsafe-none`; minimal inline‑allowed CSP for the callback page only

- Verify (prod, after login):
  - Debug logs include the string payload above; `state` equals `localStorage.getItem('netlify-cms-auth:state')`
  - `await CMS.getToken().then(Boolean) === true`
  - `await CMS.getBackend().then(b=>b?.listCollections?.())` resolves (or clear 401/403 if scopes needed)

## Security Headers

- `/admin/*` (Pages Function):
  - CSP: no third‑party script hosts; `script-src 'self' 'unsafe-eval'` only; `connect-src` includes GitHub endpoints
  - COOP: `unsafe-none`; COEP: not set
- `/api/callback` (Function response):
  - Inline‑allowed CSP (tiny handoff script); COOP: `unsafe-none`

## Cache & Deployment

- Purge Pages cache after changes to `/admin/*` or vendor bundle to prevent stale assets.
- See DEPLOYMENT.md “Admin Cache Purge”.

## References
- Decap Configuration Options — Config link: `rel="cms-config-url"`, `type="text/yaml"`
- Decap Manual Initialization — auto‑init vs manual
- Decap GitHub Backend — `base_url` + `auth_endpoint`
- Community OAuth Provider — success message formats

