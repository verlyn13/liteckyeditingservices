# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is the Litecky Editing Services website - a professional academic editing service for graduate students. The project is in early development (15% complete) with foundation and validation framework complete, but blocked on core styling implementation.

## Critical Project Constraints

1. **Node 24 + pnpm 10.16 required** - Managed via mise (.mise.toml)
2. **Tailwind CSS v4** - Using @tailwindcss/vite plugin, NOT v3 config files
3. **September 2025 versions** - All packages must use latest versions as of Sept 2025
4. **Policy enforcement** - Validation scripts prevent version downgrades and enforce standards
5. **Cloudflare deployment** - NO Vercel/Netlify adapters. Static site now, will add @astrojs/cloudflare when SSR needed

## Essential Commands

```bash
# Development
pnpm dev              # Start dev server at localhost:4321
pnpm build            # Production build (runs checks first)
pnpm preview          # Preview production build

# Quality Checks (MUST pass before commits)
pnpm check            # TypeScript + linting
pnpm lint:fix         # Auto-fix formatting and linting
pnpm validate:all     # Validate versions and structure
pnpm gate:docs        # Check documentation requirements

# Testing
pnpm test             # Unit tests (Vitest)
pnpm test:e2e         # E2E tests (Playwright)
pnpm test:a11y        # Accessibility tests (pa11y)

# Policy Validation
pnpm validate:versions    # Ensure correct package versions
pnpm validate:structure   # Check required files/dirs exist
pnpm policy:check        # Run all validations + doc gate
```

## Architecture & Key Files

### Current Structure (Not Final)
- **Single repo** - Will migrate to monorepo (apps/, workers/, packages/)
- **src/** - Astro components and pages
- **_archive/** - Original 15 specification documents (8,818 lines total)
- **policy/** - Rego policies for validation
- **scripts/** - Validation and drift detection scripts
- **desired-state/** - Expected configuration states

### Critical Implementation References

**project-document.md** contains exact implementations:
- Lines 229-496: global.css with Tailwind v4 tokens (BLOCKER - needed first)
- Lines 499-561: menu-toggle.js implementation
- Lines 599-775: Header.astro component
- Lines 777-959: Hero.astro component
- Lines 961-1034: TrustBar.astro component
- Lines 1036-1308: FileUpload.svelte component

### Technology Stack

**Frontend**: Astro 5.13 + Svelte 5 + Tailwind CSS v4
**Deployment**: Cloudflare Pages with SSR Functions
**CMS**: Decap CMS with GitHub backend
**Workers**: OAuth proxy, cron jobs (future)
**Storage**: D1 database, R2 bucket, KV namespace
**Email**: SendGrid with dynamic templates
**Security**: Turnstile for spam protection

### Critical Path & Dependencies

Current blocker: **src/styles/global.css** must be created first (extract from project-document.md lines 229-496)

Build sequence:
1. global.css → 2. Components (8 total) → 3. Pages (7 total) → 4. CMS → 5. Backend → 6. Deploy

## Project Status Tracking

**PROJECT-STATUS.md** - Single source of truth for progress (currently 15% complete)
**IMPLEMENTATION-ROADMAP.md** - Detailed build order with dependencies
**DOCUMENTATION-MASTER-INDEX.md** - Index of all documentation

Check these files to understand current state and next actions.

## Memory Bank System

The project includes Memory Bank configuration files in `_archive/` that define operational modes:
- **.clinerules-architect** - High-level planning and system design mode
- **.clinerules-ask** - Q&A and exploration mode
- **.clinerules-code** - Implementation and coding mode
- **.clinerules-debug** - Troubleshooting and debugging mode
- **.clinerules-test** - Testing and validation mode

These files provide context-specific rules and behaviors for different types of work. Switch modes based on the task at hand for optimal assistance.

## Validation Framework

The project has strict validation to prevent drift:
- Package versions cannot be downgraded
- Required files/directories are enforced
- Documentation updates required with code changes
- Pre-commit hooks run validation automatically
- CI/CD enforces all checks on PRs

## Environment Setup

Local development uses `.dev.vars` for secrets (never commit):
- Turnstile test keys for development
- SendGrid API key for email testing
- See ENVIRONMENT.md for complete variable reference

## Current Development Priority

**IMMEDIATE BLOCKER**: Create `src/styles/global.css` with Tailwind v4 tokens. This blocks all component development. Extract exact implementation from `_archive/project-document.md` lines 229-496.

After unblocking, build in order:
1. BaseLayout.astro enhancements (SEO, Schema.org)
2. menu-toggle.js (mobile nav)
3. 8 core components
4. 7 pages
5. CMS integration
6. Backend services