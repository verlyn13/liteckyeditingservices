# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

- feat(sentry): migrate to official @sentry/astro integration with proper client/server config files
- fix(sentry): add DSN check to prevent "DSN not configured" warnings when environment variables are missing
- fix(sentry): resolve MIME type error for TypeScript module loading by using static import instead of ?url suffix in BaseLayout.astro
- fix(types): replace `any` types with proper Sentry Event types in functions/\_middleware.ts
- refactor(lint): apply template literal suggestions in path shims (biome auto-fix)
- docs(sentry): add troubleshooting section for MIME type errors and update integration point documentation
- feat(cms): comprehensive CMS configuration with 9 editable sections (3 file collections, 2 settings, 4 folder collections)
- docs(cms): add CMS-EDITING-GUIDE.md and CMS-TECHNICAL-REFERENCE.md for user and developer documentation
- fix(admin-cms): allow 'unsafe-eval' in admin CSP when self-hosting Decap CMS to resolve AJV codegen console errors. Scoped to `/admin/*` via Pages Function; no change to main-site CSP.
- feat(cms): enable Decap auto-init — admin HTML links to `/admin/config.yml` (dynamic YAML) and programmatic `CMS.init` removed
- feat(csp): allow Sentry CDN and ingest on admin (`script-src https://browser.sentry-cdn.com`, `connect-src https://*.sentry.io`)
- fix(sentry): guard `httpClientIntegration` to avoid runtime errors on bundles that do not ship it
- feat(sentry-admin): self-hosted @sentry/browser bundle for admin with CDN fallback for robustness under ETP/ad-blockers
- fix(oauth): post token to opener origin captured at `/auth` so GitHub login completes on both apex and www. Strict allowlist; cookie cleared at `/callback`.
- chore(cms): pin decap-cms to 3.8.4 across builds; vendor from node_modules at build time via scripts/vendor-decap.mjs
