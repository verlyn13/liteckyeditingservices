# Architecture Overview

## System Summary

- Static site built with Astro 5 and Svelte 5 components, styled via Tailwind v4 (single stylesheet `src/styles/global.css`).
- Hosted on Cloudflare Pages. One serverless endpoint implemented as a Pages Function: `functions/api/contact.ts`.
- Outbound email via SendGrid (direct from Pages Function) or asynchronously via Cloudflare Queues + a Queue Consumer Worker.
- CMS: Decap CMS served from `public/admin/` using a Cloudflare Worker (`workers/decap-oauth`) for GitHub OAuth.

## Components

- UI
  - Astro pages: `src/pages/*.astro`
  - Svelte 5 components: `src/components/*.svelte`
  - Global styles and tokens: `src/styles/global.css`

- Serverless (Pages Functions)
  - `functions/api/contact.ts` — Accepts JSON POST, validates payload, and:
    - Enqueues to `SEND_EMAIL` queue if producer binding exists; or
    - Sends email directly via SendGrid with `SENDGRID_API_KEY`, `SENDGRID_FROM`, `SENDGRID_TO`.

- Workers
  - `workers/decap-oauth` — OAuth proxy for Decap CMS (GitHub backend)
  - `workers/queue-consumer` — Consumes `contact` messages and sends email via SendGrid

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

CMS Authentication
1. `/admin` serves Decap CMS
2. CMS initiates GitHub OAuth against `workers/decap-oauth`
3. Worker exchanges code for token and redirects back to `/admin`

## Configuration

Environment Variables (selected)
- Pages Functions: `SENDGRID_API_KEY`, `SENDGRID_FROM`, `SENDGRID_TO`, `TURNSTILE_SECRET_KEY`
- Public: `PUBLIC_TURNSTILE_SITE_KEY`
- Worker (decap-oauth): `GITHUB_OAUTH_ID`, `GITHUB_OAUTH_SECRET`

See `ENVIRONMENT.md` and `SECRETS.md` for the complete matrix.

## Security Considerations

- Turnstile used for spam mitigation on the contact form.
- CORS on the contact endpoint limited to `POST, OPTIONS` with JSON media type.
- Secrets are stored in Cloudflare (encrypted) and in gopass for development; never committed.

## Planned Extensions

- Persistence: D1 for submissions, R2 for uploads, KV for caching.
- Queue-first email path for reliability and backpressure handling.

