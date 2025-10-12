# Architecture Audit Checklist: Edge-Native Blueprint (October 2025)

Objective: Systematically compare the current application against the "Blueprint for an Edge-Native Architecture" to identify gaps, confirm alignment, and plan updates.

How to Use:
- For each item, document the Current Implementation, set a Status, and add Notes/Actions.
- Status key: ✅ Matched · ⚠️ Partially Matched · ❌ Mismatched · N/A Not Applicable

---

## Section 1: Foundational Architecture — Astro & Svelte

| Area | Blueprint Recommendation | Current Implementation | Status | Notes / Action Items |
| :--- | :--- | :--- | :--- | :--- |
| Astro Configuration (`astro.config.mjs`) | Set `output: 'static'` (static-first; enable on-demand only where needed). |  |  |  |
| Cloudflare Adapter | Use `@astrojs/cloudflare` to target Cloudflare runtime. |  |  |  |
| Local Development | Enable `platformProxy: { enabled: true }` for Cloudflare emulation. |  |  |  |
| Component Framework | Use Svelte 5 for interactive islands. |  |  |  |
| Reactivity Model | Prefer Svelte 5 Runes (`$state`, `$derived`, `$effect`). |  |  |  |
| Dynamic Content | Use Astro Server Islands for request-time data on static pages. |  |  |  |
| Type Safety: Env Vars | Use `astro:env` for typed environment variables. |  |  |  |
| Type Safety: Svelte | Use native TypeScript in Svelte 5 (no preprocessor). |  |  |  |
| Type Safety: Cloudflare | Generate and reference Cloudflare bindings types (e.g., `wrangler types`). |  |  |  |
| Type Safety: App Locals | Augment `App.Locals` for Cloudflare runtime in middleware/endpoints. |  |  |  |

---

## Section 2: Infrastructure and Deployment

| Area | Blueprint Recommendation | Current Implementation | Status | Notes / Action Items |
| :--- | :--- | :--- | :--- | :--- |
| Configuration Source of Truth | Keep `wrangler.toml` in VCS as authoritative config. |  |  |  |
| Environments | Define `[env.production]` and `[env.preview]` with distinct bindings. |  |  |  |
| Compatibility Flags | Set required `compatibility_date` and `compatibility_flags` (e.g., `nodejs_als` if needed). |  |  |  |
| CI/CD Strategy | Prefer GitHub Actions pipeline over native Git integration for control. |  |  |  |
| CI/CD Pipeline Steps | Steps: 1) Test/Lint 2) Secrets 3) Build 4) Upload Source Maps 5) Deploy via Wrangler. |  |  |  |
| Serverless Logic | Use Pages Functions in `/functions` for server-side API. |  |  |  |
| Middleware | Use root `_middleware.(js|ts)` for auth/logging/Sentry. |  |  |  |
| Dynamic Headers | Set CSP/CORS/security headers per `Response` in dynamic routes. |  |  |  |

---

## Section 3: Headless Content Management (Decap CMS)

| Area | Blueprint Recommendation | Current Implementation | Status | Notes / Action Items |
| :--- | :--- | :--- | :--- | :--- |
| Authentication | Implement serverless OAuth proxy (GitHub) on Cloudflare. |  |  |  |
| Security (PKCE) | Enforce PKCE flow in OAuth proxy. |  |  |  |
| CMS Configuration | `config.yml` sets `auth_endpoint` to custom proxy path. |  |  |  |
| Content Schema | Align Decap collections with Astro Content Layer schemas. |  |  |  |

---

## Section 4: Security and Secrets Management (Infisical)

| Area | Blueprint Recommendation | Current Implementation | Status | Notes / Action Items |
| :--- | :--- | :--- | :--- | :--- |
| Secrets Source of Truth | Use Infisical as central SoT for secrets/env. |  |  |  |
| Build-time Secrets | Fetch secrets in CI with Infisical actions. |  |  |  |
| Runtime Secrets | Sync runtime secrets to Pages via Secret Sync. |  |  |  |
| Local Development | Use `infisical run -- <cmd>` (avoid `.env`), or guarded dev vars. |  |  |  |

---

## Section 5: Full-Stack Observability (Sentry)

| Area | Blueprint Recommendation | Current Implementation | Status | Notes / Action Items |
| :--- | :--- | :--- | :--- | :--- |
| Server-Side Sentry | Instrument Functions with `@sentry/cloudflare` via `_middleware`. |  |  |  |
| Client-Side Sentry | Use `@sentry/astro` in the frontend. |  |  |  |
| Decap CMS Sentry | Inject Sentry in admin (separate DSN) for CMS errors. |  |  |  |
| Source Maps | Upload source maps in CI as a dedicated step. |  |  |  |
| Release Tagging | Tag Sentry release with unique ID (e.g., `github.sha`). |  |  |  |

---

## Section 6: Asynchronous Task Architecture (Cloudflare Queues)

| Area | Blueprint Recommendation | Current Implementation | Status | Notes / Action Items |
| :--- | :--- | :--- | :--- | :--- |
| Async Task Pattern | Use Queues for critical non-idempotent ops (e.g., email). |  |  |  |
| User Experience | Producer enqueues job; return `202 Accepted` immediately. |  |  |  |
| Reliability | Separate consumer Worker with retries; idempotency where applicable. |  |  |  |
| Implementation | Split: Pages Function producer + Worker consumer. |  |  |  |

---

## Evidence Collection Commands (Quick Reference)

- Astro output: `rg -n "output:\s*'?(static|server|hybrid)'?" astro.config.mjs`
- Cloudflare adapter: `rg -n "@astrojs/cloudflare" astro.config.mjs package.json`
- platformProxy: `rg -n "platformProxy\s*:\s*\{\s*enabled:\s*true" astro.config.mjs`
- Svelte 5: `jq -r '.dependencies.svelte' package.json`
- Runes usage: `rg -n "\\$state\\(|\\$derived\\(|\\$effect\\(" src/**/*.svelte`
- Server Islands: `rg -n "server:" src/**/*.astro`
- astro:env usage: `rg -n "astro:env" -S src/**/*`
- Svelte TS usage: `rg -n "<script lang=\\"ts\\">" src/**/*.svelte`
- Cloudflare types: `rg -n "wrangler types|declare global|interface Env" -S src functions workers`
- App Locals: `rg -n "App\\.Locals|declare namespace App" -S src/**/*.d.ts src/**/*.ts`
- wrangler.toml present: `test -f wrangler.toml && sed -n '1,120p' wrangler.toml || echo missing`
- Environments in wrangler.toml: `rg -n "^\\[env\\." wrangler.toml`
- Compatibility flags/date: `rg -n "^compatibility_flags|^compatibility_date" wrangler.toml`
- Workflows: `ls .github/workflows/*.yml`
- Functions present: `ls -la functions | wc -l`
- Middleware: `rg -n "_middleware\\.(js|ts)$" functions`
- Response headers: `rg -n "new Response\\(|headers:" functions`
- Decap endpoints: `rg -n "/api/auth|/api/callback" functions`
- PKCE hints: `rg -n "code_verifier|PKCE|verifier" functions/api/**/*`
- CMS config live: `curl -s $BASE_URL/admin/config.yml | rg -n "auth_endpoint|base_url"`
- Content schemas: `sed -n '1,160p' src/content/config.ts`
- Infisical usage: `rg -n "Infisical|infisical" -S docs scripts .github`
- Secrets in CI: `rg -n "infisical.*action|secrets-action" -S .github/workflows`
- Pages secret sync: `rg -n "wrangler pages secret|project variable" -S scripts .github/workflows`
- Server Sentry: `rg -n "@sentry/cloudflare|Sentry" -S functions`
- Client Sentry: `rg -n "@sentry/astro|@sentry/browser" -S src`
- Admin Sentry: `rg -n "sentry-admin|sentry" public/admin/index.html public/admin/*.js`
- Sourcemap upload: `rg -n "sentry-cli|sourcemaps|upload" -S .github/workflows astro.config.mjs`
- Release tagging: `rg -n "SENTRY_RELEASE|github\\.sha|release" -S .github/workflows astro.config.mjs`
- Queues producer/consumer: `rg -n "queue\\.send\\(|queue\\(" -S functions workers`
- HTTP 202: `rg -n "return new Response\\(.*202" -S functions`

