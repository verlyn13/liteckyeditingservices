# Architecture Overview

## System Summary

- Static site built with Astro 5 and Svelte 5 components, styled via Tailwind v4 (single stylesheet `src/styles/global.css`).
- Hosted on Cloudflare Pages. Serverless endpoints implemented as Pages Functions.
- Outbound email via SendGrid (direct from Pages Function) or asynchronously via Cloudflare Queues + a Queue Consumer Worker.
- CMS: Decap CMS served from `public/admin/` using **on-site Cloudflare Pages Functions** for GitHub OAuth.
  - Start: `/api/auth` (state cookie + redirect to GitHub authorize)
  - Callback: `/api/callback` (state check, code→token, postMessage to opener, close)
  - Legacy: External worker `litecky-decap-oauth` **(decommissioned Oct 2025)** is retained only in `_archive/` docs.

## Components

- UI
  - Astro pages: `src/pages/*.astro`
  - Svelte 5 components: `src/components/*.svelte`
  - Global styles and tokens: `src/styles/global.css`

- Serverless (Pages Functions)
  - `functions/api/contact.ts` — Accepts JSON POST, validates payload, and:
    - Enqueues to `SEND_EMAIL` queue if producer binding exists; or
    - Sends email directly via SendGrid with `SENDGRID_API_KEY`, `SENDGRID_FROM`, `SENDGRID_TO`.
  - `functions/api/auth.ts` — Initiates GitHub OAuth flow for Decap CMS (sets state cookie, redirects to GitHub)
  - `functions/api/callback.ts` — Completes OAuth flow (validates state, exchanges code for token, posts to opener window)
  - `functions/admin/[[path]].ts` — Sets admin-specific CSP and security headers for `/admin/*` routes

- Workers
  - `workers/queue-consumer` — Consumes `contact` messages and sends email via SendGrid
  - `workers/decap-oauth` — **Legacy (decommissioned Oct 2025)** — Previously handled OAuth; now superseded by Pages Functions

## Data Flows

Contact Submission (Direct)
1. Browser loads Turnstile widget using `PUBLIC_TURNSTILE_SITE_KEY`
2. User submits form; client sends JSON to `/api/contact`
3. Pages Function validates and, if SendGrid vars are set, calls SendGrid API to deliver email
4. Returns `202 { status: "sent" }` on success or `accepted-no-email` when SendGrid is not configured

Contact Submission (Queued)
1. Steps 1–2 same as Direct
2. Pages Function detects a queue producer binding and enqueues `{ kind: "contact", data }`
3. Queue Consumer Worker receives batch, sends via SendGrid, and `ack`s on success or `retry`s on failure

CMS Authentication (Current - On-Site OAuth, 2025 Spec-Aligned)
1. `/admin` serves static HTML (`public/admin/index.html`) with single Decap bundle and **spec-required** config discovery: `<link href="/admin/config.yml" type="text/yaml" rel="cms-config-url">`
2. Decap **auto-initializes** from the single vendored bundle (no manual `CMS.init()` call, per official defaults) - eliminates double-mount errors
3. `config.yml` specifies `backend: { name: github, repo: ..., base_url: https://www.liteckyeditingservices.com, auth_endpoint: /api/auth }` (on-site Pages Functions)
4. On login, Decap opens popup to `https://www.liteckyeditingservices.com/api/auth` (GitHub OAuth start)
5. Pages Function `/api/auth` sets state cookie and redirects to GitHub authorize
6. GitHub redirects to `/api/callback` with authorization code
7. Pages Function `/api/callback`:
   - Validates state cookie
   - Exchanges code for access token
   - Posts **community-standard** success message to opener: `authorization:github:success:{token,provider,token_type,state}`
   - Also posts object-style message for broader compatibility
   - Waits for `authorization:ack` from Decap, then closes popup
8. Decap receives token and completes authentication

**Spec Compliance & 2025 Best Practices**:
- Single static HTML admin page with one bundle (per [Decap install docs](https://decapcms.org/docs/install-decap-cms/)) - prevents React double-mount errors
- Config discovery via `<link type="text/yaml" rel="cms-config-url">` (per [Decap docs](https://decapcms.org/docs/configuration-options/))
- Auto-init mode (default behavior, per [Decap docs](https://decapcms.org/docs/manual-initialization/))
- On-site OAuth with `base_url` + `auth_endpoint` (per [GitHub backend docs](https://decapcms.org/docs/github-backend/)); works in dev with `wrangler pages dev` (localhost:8788)
- Success message format matches [community OAuth provider standard](https://github.com/vencax/netlify-cms-github-oauth-provider)

## Configuration

Environment Variables (selected)
- Pages Functions: `SENDGRID_API_KEY`, `SENDGRID_FROM`, `SENDGRID_TO`, `TURNSTILE_SECRET_KEY`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- Public: `PUBLIC_TURNSTILE_SITE_KEY`
- Worker (queue-consumer): `SENDGRID_API_KEY`, `SENDGRID_FROM`, `SENDGRID_TO`

See `ENVIRONMENT.md` and `SECRETS.md` for the complete matrix.

## Security Considerations

- Turnstile used for spam mitigation on the contact form.
- CORS on the contact endpoint limited to `POST, OPTIONS` with JSON media type.
- Secrets are stored in Cloudflare (encrypted) and in gopass for development; never committed.

## Planned Extensions

- Persistence: D1 for submissions, R2 for uploads, KV for caching.
- Queue-first email path for reliability and backpressure handling.

