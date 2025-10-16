# Litecky Editing Services

![Quality Gate](https://github.com/verlyn13/liteckyeditingservices/actions/workflows/quality-gate.yml/badge.svg)
![Docs Health](https://github.com/verlyn13/liteckyeditingservices/actions/workflows/docs-health.yml/badge.svg)

Academic editing services website built with Astro, Svelte, and Cloudflare Pages.

**Production**: https://liteckyeditingservices.com
**Status**: Live with automatic deployments
**CMS**: /admin (requires GitHub authentication)

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
# Development
pnpm dev               # Start development server
pnpm build             # Build for production
pnpm preview           # Preview production build

# Quality & Testing
pnpm check             # Run all quality checks
pnpm test              # Unit tests (Vitest)
pnpm test:e2e          # E2E tests (Playwright)
pnpm test:visual       # Visual regression tests
pnpm test:visual:update  # Update visual baselines
pnpm test:a11y         # Accessibility tests

# Code Quality
pnpm lint:fix          # Auto-fix linting issues
pnpm biome:check       # Biome v2.2.5 (format+lint JS/TS/JSON)
pnpm typecheck         # TypeScript validation

# Assets
pnpm icons:build       # Rebuild favicon.ico and PNG icons from SVG
```

## Icons

- Source SVG: `public/icons/logo.svg` (copied from your `~/Pictures`)
- Build script: `scripts/build-icons.sh`
- Outputs: `public/icons/favicon.ico`, `public/icons/icon-{16,32,48,64,180,192,256,384,512}.png`

See also: `docs/assets-images-icons.md` for full guidance (sources of truth, manifest, and troubleshooting).

Rebuild icons after changing the SVG:

```bash
pnpm icons:build
```

## Windsurf / Cascade

This repository integrates [Windsurf](https://windsurf.codeium.com) and Cascade for AI-assisted development workflows.

### Configuration

- **Global rules**: `~/.codeium/windsurf/memories/global_rules.md` (v1.0-prod, cross-workspace)
- **Local config**: `.windsurf/cascade.yaml` + `.windsurf/mcp.json`
- **Workspace rules**: `.windsurf/rules/astro-svelte-stack.md` (project-specific conventions)
- **Workflows**: `.windsurf/workflows/` (trigger with `/` in Cascade)
- **Policy Gate**: ensures build + test + lint + security pass before merge

### Available Workflows

**Automated (via `cascade.yaml`):**

- **Dev Loop**: `pnpm install` → `pnpm check` → `pnpm test` → `pnpm test:e2e` → `pnpm lint:fix`
- **Quick Validate**: `pnpm validate:all` → `pnpm typecheck`
- **A11y + E2E**: `pnpm test:a11y` → `pnpm test:e2e`
- **Build Preview**: `pnpm build` → `pnpm preview`
- **Docs Gate**: `pnpm gate:docs`
- **Policy Gate**: `pnpm validate:all` → `pnpm policy:check`

**Cascade Workflows** (trigger with `/` command):

- `/policy_gate` — Comprehensive quality gates before merge
- `/test_gen` — Generate or patch missing tests based on context
- `/refactor_plan` — Staged refactor checklist with behavior preservation
- `/doc_sync` — Update docs after API, schema, or architecture changes

See `docs/WORKFLOWS.md` for detailed workflow documentation.

### Tools & Context

- **MCP servers**: Filesystem, Ripgrep, and Git via `pnpm dlx` (see `.windsurf/mcp.json`)
- **Context scope**: `src/`, `tests/`, `docs/`, `policy/`, `scripts/`, `desired-state/`, `workers/`, `functions/`, and key config files
- **Prerequisites**: Run `mise install` then `pnpm install` before using workflows

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

### Updating Content

**Via CMS** (Recommended):

1. Login: https://liteckyeditingservices.com/admin
2. Edit and save changes
3. Auto-commits to GitHub `main` branch
4. Auto-deploys within 2-3 minutes
5. Cache purges automatically

**Via Git** (Developers):

1. Edit files in `content/` directory
2. Commit and push to `main`
3. Triggers same deployment workflow

### Caching Strategy

**Current** (Phase 1 - Freshness First):

- HTML: `max-age=0, must-revalidate` (always fresh)
- Assets: Standard caching
- Auto-purge on content changes

**Future** (Phase 2 - Performance):

- Immutable assets: 1 year cache
- HTML: 4 hours edge, 5 minutes browser
- Granular purging via worker

See `docs/architecture/CACHING-STRATEGY.md` for details.

### Manual Operations

```bash
# Purge all cache (emergency)
gh workflow run cms-content-sync.yml -f purge_type=all

# Check cache headers
curl -I https://liteckyeditingservices.com

# View recent deployments
gh run list --workflow=cms-content-sync.yml --limit 5
```

## Getting Help

### Quick Start

- **New developer setup**: `docs/onboarding.md`
- **Daily workflow**: `WORKFLOW.md`
- **PR workflow & visual testing**: `docs/playbooks/pr-workflow.md` ⭐

### Project Documentation

- **Project Status**: `PROJECT-STATUS.md`
- **Implementation Roadmap**: `docs/planning/IMPLEMENTATION-ROADMAP.md`
- **Documentation Index**: `docs/DOCUMENTATION-INDEX.md`

### Technical Guides

- **Visual Regression Testing**: `docs/testing/VISUAL-REGRESSION-GUIDE.md`
- **Biome Playbook**: `docs/playbooks/biome.md`
- **Biome Strategy (v2.2.5)**: `docs/decisions/2025-10-12-biome-2.2.5.md`
- **Architecture Checklist**: `docs/audits/edge-native-architecture-checklist.md`

### Operations

- **Production secrets**: `docs/INFISICAL-QUICKSTART.md`
- **Troubleshooting**: `docs/playbooks/` (specific problem guides)

## License

Private repository - All rights reserved
