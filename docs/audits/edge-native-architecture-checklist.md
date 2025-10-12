# Architecture Audit Checklist: Edge-Native Blueprint (October 2025)

Objective: Systematically compare the current application against the "Blueprint for an Edge-Native Architecture" to identify gaps, confirm alignment, and plan updates.

How to Use:
- For each item, document the Current Implementation, set a Status, and add Notes/Actions.
- Status key: ✅ Matched · ⚠️ Partially Matched · ❌ Mismatched · N/A Not Applicable

---

## Notes and Clarifications (Repo Facts)

- Static-first on Cloudflare Pages with Pages Functions is the current deployment model. No adapter is required while output is `static` and all server logic lives in `/functions`.
- Use `@astrojs/cloudflare` only when introducing on-demand rendering (SSR) such as Server Islands or routes with `export const prerender = false`.
- Local development for static + Functions: run Astro dev for the site and `wrangler pages dev` to emulate Functions. `platformProxy` applies only when the Cloudflare adapter is in use.
- Server Islands require on-demand rendering and therefore the Cloudflare adapter; the rest of the site can remain static and cacheable.
- `astro:env` is available inside Astro code (components/pages), not in `astro.config.mjs` or arbitrary scripts. Client-exposed vars must be prefixed `PUBLIC_`.
- Cloudflare compatibility flags: enable `nodejs_als` only if AsyncLocalStorage-based tracing is needed; otherwise keep the current compatibility date and minimal flags.
- Headers: set security headers in Functions via `new Response(body, { headers })` for dynamic responses. `_headers` applies to static assets only.

Example (Functions response headers):

```
return new Response(JSON.stringify(body), {
  status: 202,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-app-route': '/api/contact'
  }
});
```

## Section 1: Foundational Architecture — Astro & Svelte

| Area | Blueprint Recommendation | Current Implementation | Status | Notes / Action Items |
| :--- | :--- | :--- | :--- | :--- |
| Astro Configuration (`astro.config.mjs`) | Set `output: 'static'` (static-first; enable on-demand only where needed). | output: 'static' (astro.config.mjs:34) | ✅ Matched | Static build with Pages Functions covers server needs. |
| Cloudflare Adapter | Use `@astrojs/cloudflare` to target Cloudflare runtime. | No adapter (static output on Cloudflare Pages) | N/A | Not required until SSR/hybrid; revisit if enabling SSR. |
| Local Development | Enable `platformProxy: { enabled: true }` for Cloudflare emulation. | Not configured | N/A | Applies only with Cloudflare adapter. |
| Component Framework | Use Svelte 5 for interactive islands. | package.json: svelte "latest"; pnpm-lock: 5.39.7; components in `src/components/` | ✅ Matched | Verified presence of Svelte components. |
| Reactivity Model | Prefer Svelte 5 Runes (`$state`, `$derived`, `$effect`). | No runes usage detected | ⚠️ Partially Matched | Optional; consider runes in new interactive components. |
| Dynamic Content | Use Astro Server Islands for request-time data on static pages. | No `server:` islands found | N/A | Current site is static; add islands only if needed. |
| Type Safety: Env Vars | Use `astro:env` for typed environment variables. | No `astro:env` usage found | ⚠️ Partially Matched | ENVIRONMENT.md present; adopt `astro:env` where env is read in frontend. |
| Type Safety: Svelte | Use native TypeScript in Svelte 5 (no preprocessor). | `<script lang="ts">` present in Svelte files | ✅ Matched | `src/components/FileUpload.svelte:1`, `src/components/ValueProp.svelte:1`. |
| Type Safety: Cloudflare | Generate and reference Cloudflare bindings types (e.g., `wrangler types`). | Manual `interface Env { ... }` in functions/workers (`functions/api/contact.ts:4`, `workers/decap-oauth/src/index.ts:1`) | ⚠️ Partially Matched | Consider generating runtime types via `wrangler types` and centralizing in `src/env.d.ts`. |
| Type Safety: App Locals | Augment `App.Locals` for Cloudflare runtime in middleware/endpoints. | Not present | ⚠️ Partially Matched | For Astro, type `Astro.locals` in middleware/endpoint handlers where used. |

---

## Section 2: Infrastructure and Deployment

| Area | Blueprint Recommendation | Current Implementation | Status | Notes / Action Items |
| :--- | :--- | :--- | :--- | :--- |
| Configuration Source of Truth | Keep `wrangler.toml` in VCS as authoritative config. | wrangler.toml present, versioned | ✅ Matched | Pages project configured; observability enabled. |
| Environments | Define `[env.production]` and `[env.preview]` with distinct bindings. | No `[env.*]` sections found | ⚠️ Partially Matched | Action: add `[env.preview]` and `[env.production]` with distinct bindings if needed. |
| Compatibility Flags | Set required `compatibility_date` and `compatibility_flags` (e.g., `nodejs_als` if needed). | date=2025-09-30; flags=["nodejs_compat"] | ⚠️ Partially Matched | Evaluate `nodejs_als` if enabling server-side Sentry traces. |
| CI/CD Strategy | Prefer GitHub Actions pipeline over native Git integration for control. | Multiple workflows present; site is Git-connected to Pages | ⚠️ Partially Matched | Consider wrangler-based deploy in Actions for full control; keep preview gate. |
| CI/CD Pipeline Steps | Steps: 1) Test/Lint 2) Secrets 3) Build 4) Upload Source Maps 5) Deploy via Wrangler. | Tests/quality present; Infisical sync present; sourcemap upload not found | ⚠️ Partially Matched | Action: add Sentry sourcemap upload + release tagging; consider wrangler deploy step. |
| Serverless Logic | Use Pages Functions in `/functions` for server-side API. | `/functions` used for API routes | ✅ Matched | Auth, callback, config.yml, contact implemented. |
| Middleware | Use root `_middleware.(js|ts)` for auth/logging/Sentry. | No functions/_middleware.* | ❌ Mismatched | Action: add `_middleware.ts` for Sentry/auth headers/logging. |
| Dynamic Headers | Set CSP/CORS/security headers per `Response` in dynamic routes. | Headers set (e.g., `Content-Type`, `Cache-Control` in `functions/api/config.yml.ts:132`) | ✅ Matched | Verify CSP completeness per route. |

---

## Section 3: Headless Content Management (Decap CMS)

| Area | Blueprint Recommendation | Current Implementation | Status | Notes / Action Items |
| :--- | :--- | :--- | :--- | :--- |
| Authentication | Implement serverless OAuth proxy (GitHub) on Cloudflare. | `/api/auth` and `/api/callback` implemented | ✅ Matched | Uses Pages Functions. |
| Security (PKCE) | Enforce PKCE flow in OAuth proxy. | `code_verifier` used in callback for server-side exchange (`functions/api/callback.ts:160`) | ✅ Matched | Falls back to postMessage code if needed. |
| CMS Configuration | `config.yml` sets `auth_endpoint` to custom proxy path. | `auth_endpoint: api/auth`, `base_url: <origin>` (`functions/api/config.yml.ts:132`) | ✅ Matched | Both `/admin/config.yml` and `/api/config.yml` supported. |
| Content Schema | Align Decap collections with Astro Content Layer schemas. | `src/content/config.ts` present; alignment not verified | ⚠️ Partially Matched | Action: cross-check fields vs Decap collections, update as needed. |

---

## Section 4: Security and Secrets Management (Infisical)

| Area | Blueprint Recommendation | Current Implementation | Status | Notes / Action Items |
| :--- | :--- | :--- | :--- | :--- |
| Secrets Source of Truth | Use Infisical as central SoT for secrets/env. | Infisical docs + scripts + workflows present | ⚠️ Partially Matched | Continue consolidation; minimize UI-managed secrets. |
| Build-time Secrets | Fetch secrets in CI with Infisical actions. | `.github/workflows/infisical-to-cloudflare.yml` present | ✅ Matched | Dry-run + apply supported. |
| Runtime Secrets | Sync runtime secrets to Pages via Secret Sync. | Scripts sync variables to Pages | ✅ Matched | Validate preview vs production scope. |
| Local Development | Use `infisical run -- <cmd>` (avoid `.env`), or guarded dev vars. | Using `.envrc` + `.dev.vars` | ⚠️ Partially Matched | Optional: add `infisical run` path for teams using Infisical locally. |

---

## Section 5: Full-Stack Observability (Sentry)

| Area | Blueprint Recommendation | Current Implementation | Status | Notes / Action Items |
| :--- | :--- | :--- | :--- | :--- |
| Server-Side Sentry | Instrument Functions with `@sentry/cloudflare` via `_middleware`. | Implemented: `functions/_middleware.ts:1` (Sentry Cloudflare middleware + headers) | ✅ Matched | Uses `@sentry/cloudflare`; shared headers applied. |
| Client-Side Sentry | Use `@sentry/astro` in the frontend. | `@sentry/astro` configured (`astro.config.mjs:18..31`) | ✅ Matched | `sourceMapsUploadOptions` present (org/project/token).
| Decap CMS Sentry | Inject Sentry in admin (separate DSN) for CMS errors. | `public/admin/sentry-admin.js` present | ✅ Matched | CSP permits Sentry loader. |
| Source Maps | Upload source maps in CI as a dedicated step. | Implemented: `.github/workflows/quality-gate.yml` Sentry release upload step | ✅ Matched | Uses `getsentry/action-release@v3` with `${{ github.sha }}`.
| Release Tagging | Tag Sentry release with unique ID (e.g., `github.sha`). | Implemented: `.github/workflows/quality-gate.yml` step uses `release: ${{ github.sha }}` | ✅ Matched | Release tagged with commit SHA; finalize=true + set_commits=auto enabled. |

---

## Section 6: Asynchronous Task Architecture (Cloudflare Queues)

| Area | Blueprint Recommendation | Current Implementation | Status | Notes / Action Items |
| :--- | :--- | :--- | :--- | :--- |
| Async Task Pattern | Use Queues for critical non-idempotent ops (e.g., email). | Queues used for email (producer/consumer) | ✅ Matched | `SEND_EMAIL` binding present. |
| User Experience | Producer enqueues job; return `202 Accepted` immediately. | `functions/api/contact.ts:29..63` returns 202 for enqueue and accepted-no-email | ✅ Matched | Enqueue path returns 202; fallback accept returns 202. |
| Reliability | Separate consumer Worker with retries; idempotency where applicable. | Consumer worker implemented | ✅ Matched | Uses Cloudflare retries; consider idempotency keys. |
| Implementation | Split: Pages Function producer + Worker consumer. | Producer in `/functions`, consumer in `/workers/queue-consumer` | ✅ Matched | Clear separation in repo structure. |

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
