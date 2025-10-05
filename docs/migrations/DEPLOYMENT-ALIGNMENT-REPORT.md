# Deployment Alignment Report

Date: 2025-10-04

Author: Site Engineering

## Summary

There is a critical misalignment between the intended Cloudflare Pages architecture and the current project setup.

## Intended Architecture (from specs)
- Git-connected Cloudflare Pages project (Dashboard)
- GitHub Actions CI/CD
- Push to `main` → automatic Production deploy
- Full validation pipeline (pre/post-deploy, E2E, admin smoke)

## Current Reality
- Direct-upload Pages project created by `wrangler pages deploy`
- No Git connection (Git Provider = No)
- Manual deploys; Production out-of-sync risk
- GitHub workflows exist but cannot trigger auto-production without manual promotion

## Root Cause
- Initial deployment followed CLI scripts using `wrangler pages deploy`, which bootstrapped a direct-upload Pages project. Direct-upload and Git-connected project types are immutable.

## Recommendation (Option 1 – Strongly Recommended)
Create a new Git-connected Pages project and migrate Production to align with original design.

### Benefits
- Automatic Production deployments on push to `main`
- First-class PR preview deployments
- Consistent, auditable CI/CD pipeline

### Migration Overview (no DNS changes required)
1) Create a new Pages project via Dashboard → Connect to Git → select `verlyn13/liteckyeditingservices`, branch `main`.
2) Configure build:
   - Build command: `pnpm install && pnpm build`
   - Output: `dist`
   - Environment: `NODE_VERSION=24` (and optional `PNPM_VERSION=10.17.1`)
   - Add existing env vars (SendGrid, Turnstile, OAuth, etc.)
3) Validate PR preview + test builds with existing GitHub workflows.
4) Move custom domains from the old project to the new project:
   - Remove `liteckyeditingservices.com` and `www.liteckyeditingservices.com` from old project
   - Attach the same domains to the new project (no DNS edits required)
5) Run post-deploy validation (headers, admin, E2E).
6) Set GitHub secret `CF_GIT_CONNECTED=true` (to disable wrangler-based deploy job).
7) Retire old direct-upload project.

## Alternatives (Not Recommended)
- Option 2: Continue with direct-upload + auto-promotion via API
  - Works but diverges from intended Git-connected workflow and PR previews.
- Option 3: Hybrid
  - Keep current project for Production, create a separate Git-connected project for previews only; adds complexity.

## Next Actions
- Execute the migration checklist in `docs/migrations/PAGES-GIT-MIGRATION.md`.

