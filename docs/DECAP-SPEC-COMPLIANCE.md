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

## GitHub Backend Configuration (Spec: GitHub Backend - Same-Origin OAuth)

- File: `public/admin/config.yml`
- Backend block:
  ```yml
  backend:
    name: github
    repo: verlyn13/liteckyeditingservices
    branch: main
    auth_endpoint: /api/auth  # same-origin OAuth; no base_url needed
  ```
- Rationale: Same-origin OAuth works in both dev (`wrangler pages dev`) and prod. No `base_url` needed when admin and OAuth are on the same origin. Per [Decap GitHub backend docs](https://decapcms.org/docs/github-backend/).

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
- Removed `src/pages/admin/index.astro` (Astro page with framework overhead)
- Removed `public/admin/boot.js` (external boot script with HMR guards)
- Removed `base_url` from `config.yml` (not needed for same-origin OAuth)
- Replaced with single static `public/admin/index.html` with one bundle
- Archived old files to `_archive/admin-migration-2025-10-09/`

**Why:**
- Eliminates React double-mount/"removeChild" errors from multiple init paths
- Simplifies local dev (one command: `wrangler pages dev` for full OAuth testing)
- Follows Decap install docs exactly (static HTML, single bundle, auto-init)
- Same config works in dev and prod (no environment-specific `base_url`)

## References
- [Decap CMS: Install](https://decapcms.org/docs/install-decap-cms/) - Single bundle, auto-init
- [Decap CMS: Configuration Options](https://decapcms.org/docs/configuration-options/) - Config link: `rel="cms-config-url"`, `type="text/yaml"`
- [Decap CMS: Manual Initialization](https://decapcms.org/docs/manual-initialization/) - Auto‑init vs manual
- [Decap CMS: GitHub Backend](https://decapcms.org/docs/github-backend/) - `auth_endpoint` (with or without `base_url`)
- [Cloudflare Pages: Local Development](https://developers.cloudflare.com/pages/functions/local-development/) - `wrangler pages dev` for same-origin testing
- [Community OAuth Provider Standard](https://github.com/vencax/netlify-cms-github-oauth-provider) - Success message formats
