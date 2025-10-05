# ADR-001: Decap CMS Editorial Workflow

Date: 2025-10-04

Status: Accepted

Context
- Admin edits are currently committed directly to `main`, which deploys immediately. We want safer, reviewable content changes.

Decision
- Enable `publish_mode: editorial_workflow` in `public/admin/config.yml` so Decap creates branches + pull requests for content edits.
- Use GitHub Actions to validate PR previews and the admin panel.
- Let Cloudflare Pages (Git-connected) build PR previews automatically; fall back to Wrangler preview deploy if not Git-connected.

Consequences
- Editors submit content as PRs; maintainers review/merge.
- CI validates PR previews, runs admin smoke tests, and surfaces issues before merge.
- Production stays stable; merges to `main` trigger production deploy + post-deploy validation.

Related
- `.github/workflows/preview-validation.yml` — PR preview validation
- `.github/workflows/deploy-production.yml` — Deploy + promote (disabled when Git-connected)
- `.github/workflows/post-deploy-validation.yml` — Production validation

