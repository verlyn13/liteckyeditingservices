# Litecky Editing Services — Website

![Quality Gate](https://github.com/verlyn13/liteckyeditingservices/actions/workflows/quality-gate.yml/badge.svg)
![Docs Health](https://github.com/verlyn13/liteckyeditingservices/actions/workflows/docs-health.yml/badge.svg)

Professional academic editing services for graduate students, built with modern web technologies and a focus on simplicity and reliability.

**Status**: ✅ Live in Production (DNS migrated October 4, 2025)
**Production**: https://liteckyeditingservices.com | https://www.liteckyeditingservices.com
**Preview**: Auto-deployed via Cloudflare Pages on PRs
**CMS**: /admin (GitHub auth required)

## Stack

- Frontend: Astro 5 + Svelte 5 + Tailwind CSS 4
- Hosting: Cloudflare Pages (static + Pages Functions for API)
- Workers: Cloudflare Workers (OAuth proxy, Queue consumer for async email)
- Queue: Cloudflare Queues (async email processing)
- CMS: Decap CMS with GitHub backend
- Email: SendGrid (via queue-based async processing)
- Security: Cloudflare Turnstile (spam protection)
- Analytics: Cloudflare Web Analytics (privacy-first)

## Quick Start (Development)

```bash
# Prerequisites: mise (version manager)
# Optional: gopass/age for secret management

# 1. Clone and install
git clone https://github.com/verlyn13/liteckyeditingservices
cd liteckyeditingservices
mise install  # Installs Node 24 and pnpm 10.16
pnpm install

# 2. Set up local environment (choose one)

# A) Generate from gopass (recommended)
./scripts/generate-dev-vars.sh
# If direnv is unavailable, use: pnpm run dev:env
direnv allow .  # load .dev.vars via .envrc (optional)

# B) Manual templates
cp .env.example .env
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your test keys
# If direnv is unavailable, use: pnpm run dev:env
direnv allow .  # load .dev.vars via .envrc (optional)

# 3. Run development server
pnpm dev

# Site available at http://localhost:4321
# CMS available at http://localhost:4321/admin
```

## Key Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm check        # Run all quality checks
pnpm test:e2e     # Run Playwright tests
pnpm lint:fix     # Auto-fix linting issues
```

## Windsurf/Cascade

- **Config location**: `.windsurf/` contains `cascade.yaml` and `mcp.json`.
- **Workflows** (run from Windsurf/Cascade panel):
  - **Dev Loop**: `pnpm install` → `pnpm check` → `pnpm test` → `pnpm test:e2e` → `pnpm lint:fix`
  - **Quick Validate**: `pnpm validate:all` → `pnpm typecheck`
  - **A11y + E2E**: `pnpm test:a11y` → `pnpm test:e2e`
  - **Build Preview**: `pnpm build` → `pnpm preview`
  - **Docs Gate**: `pnpm gate:docs`
  - **Policy Gate**: `pnpm validate:all` → `pnpm policy:check`
- **Context**: Cascade focuses on `src/`, `tests/`, `docs/`, `policy/`, `scripts/`, `desired-state/`, `workers/`, `functions/`, and key config files (`astro.config.mjs`, `package.json`, etc.).
- **MCP servers**: Filesystem, Ripgrep, and Git via `pnpm dlx` (see `.windsurf/mcp.json`). No global installs required.
- **Prereqs**: Run `mise install` then `pnpm install` before using workflows that start the dev server.

## Styling

- Single source of truth: `src/styles/global.css`.
- Tailwind v4 is enabled via `@import "tailwindcss"` in that file.
- Design tokens live under the `@theme { ... }` block (colors, fonts, spacing, breakpoints).
- Global base styles, minimal utilities, and simple components (e.g., `.btn`) are defined there.

## Project Structure

```
├── src/                # Astro pages, Svelte components, content, styles
├── public/             # Static assets
├── workers/            # Cloudflare Workers (decap-oauth, queue-consumer)
├── functions/          # Cloudflare Pages Functions (API routes)
├── scripts/            # Validation and automation scripts
├── policy/             # Rego policies (quality/infra)
├── desired-state/      # Deployment/config templates
├── docs/               # Developer docs and playbooks
├── tests/              # Unit, E2E, a11y tests
└── _archive/           # Historical/reference docs
```

## Deployment

- **Automatic**: Push to `main` branch triggers deployment via Cloudflare Pages
- **Preview**: Every PR gets a preview URL automatically
- **Rollback**: Revert commit or use Cloudflare dashboard

### ⚠️ Deployment Constraints

This project deploys **ONLY to Cloudflare Pages**. Do not add or use:
- `@astrojs/vercel` adapter
- `@astrojs/netlify` adapter
- Any non-Cloudflare deployment adapters

Current output is `static`. When SSR is required, use `@astrojs/cloudflare`.
Validators and Rego policies enforce these constraints to prevent drift.

## Content Management

- For editors: Use the CMS at `/admin` (requires GitHub access)
- For developers: Edit Markdown files in `src/content/`

## Getting Help

- Project Status: see `PROJECT-STATUS.md`
- Implementation Roadmap: see `IMPLEMENTATION-ROADMAP.md`
- Documentation Index: see `DOCUMENTATION-MASTER-INDEX.md`
- Production secrets: see `docs/INFISICAL-QUICKSTART.md`
- New developer setup: see `docs/onboarding.md`
- Workflow overview: see `WORKFLOW.md`
- Specific problems: check `docs/playbooks/`

## License

Private repository - All rights reserved
