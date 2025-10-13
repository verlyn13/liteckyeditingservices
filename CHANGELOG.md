# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

- fix(admin-cms): allow 'unsafe-eval' in admin CSP when self-hosting Decap CMS to resolve AJV codegen console errors. Scoped to `/admin/*` via Pages Function; no change to main-site CSP.
- feat(cms): enable Decap auto-init — admin HTML links to `/admin/config.yml` (dynamic YAML) and programmatic `CMS.init` removed
- feat(csp): allow Sentry CDN and ingest on admin (`script-src https://browser.sentry-cdn.com`, `connect-src https://*.sentry.io`)
- fix(sentry): guard `httpClientIntegration` to avoid runtime errors on bundles that do not ship it
- feat(sentry-admin): self-hosted @sentry/browser bundle for admin with CDN fallback for robustness under ETP/ad-blockers
- fix(oauth): post token to opener origin captured at `/auth` so GitHub login completes on both apex and www. Strict allowlist; cookie cleared at `/callback`.
- chore(cms): pin decap-cms to 3.8.4 across builds; vendor from node_modules at build time via scripts/vendor-decap.mjs
