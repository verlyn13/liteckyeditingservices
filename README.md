# Litecky Editing Services — Website

![Quality Gate](https://github.com/verlyn13/liteckyeditingservices/actions/workflows/quality-gate.yml/badge.svg)
![Docs Health](https://github.com/verlyn13/liteckyeditingservices/actions/workflows/docs-health.yml/badge.svg)

Professional academic editing services for graduate students, built with modern web technologies and a focus on simplicity and reliability.

**Status**: ✅ Deployed to Production (October 2, 2025)
**Production**: https://b9ee6806.litecky-editing-services.pages.dev (DNS migration pending)
**Future Domain**: https://liteckyeditingservices.com
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

- Automatic: Push to `main` branch triggers deployment via Cloudflare Pages
- Preview: Every PR gets a preview URL automatically
- Rollback: Revert commit or use Cloudflare dashboard

### Deployment Constraints
- Cloudflare Pages only. Do not add Vercel/Netlify adapters.
- Current output is `static`; when SSR is required, use `@astrojs/cloudflare`.
- Validators and Rego policies enforce these constraints to prevent drift.

### ⚠️ Deployment Constraints

This project deploys ONLY to Cloudflare Pages. Do not add or use:
- `@astrojs/vercel` adapter
- `@astrojs/netlify` adapter
- Any non-Cloudflare deployment adapters

The project runs as a static site. When SSR is needed, we'll add `@astrojs/cloudflare`.

## Content Management

- For editors: Use the CMS at `/admin` (requires GitHub access)
- For developers: Edit Markdown files in `src/content/`

## Getting Help

- Project Status: see `PROJECT-STATUS.md`
- Implementation Roadmap: see `IMPLEMENTATION-ROADMAP.md`
- Documentation Index: see `DOCUMENTATION-MASTER-INDEX.md`
- New developer setup: see `docs/onboarding.md`
- Workflow overview: see `WORKFLOW.md`
- Specific problems: check `docs/playbooks/`

## License

Private repository - All rights reserved
