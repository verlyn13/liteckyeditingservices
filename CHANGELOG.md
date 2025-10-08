# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

- fix(admin-cms): allow 'unsafe-eval' in admin CSP when self-hosting Decap CMS to resolve AJV codegen console errors. Scoped to `/admin/*` via Pages Function; no change to main-site CSP.
- fix(oauth): post token to opener origin captured at `/auth` so GitHub login completes on both apex and www. Strict allowlist; cookie cleared at `/callback`.
