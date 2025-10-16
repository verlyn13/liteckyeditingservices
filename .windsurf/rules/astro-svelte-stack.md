# Astro + Svelte + TypeScript Stack Rules

**Scope:** This repository (Litecky Editing Services)  
**Stack:** Astro + Svelte 5 + TypeScript + pnpm + Cloudflare Pages/Workers  
**Updated:** 2025-10-15

---

## Build & Development

- **Install:** `pnpm install` (Node ≥24, pnpm ≥10.16 via `mise`)
- **Dev server:** `pnpm dev` → http://localhost:4321
- **Build:** `pnpm build` (runs typecheck + Astro build)
- **Preview:** `pnpm preview` (serve production build locally)

---

## Code Quality

- **Typecheck:** `pnpm typecheck` (TypeScript strict mode)
- **Lint:** `pnpm biome check` (Biome linter + formatter)
- **Format:** `pnpm biome format --write` (auto-fix formatting)
- **Fix lint:** `pnpm lint:fix` (ESLint + Biome auto-fixes)
- **Pre-commit:** `pnpm check` (typecheck + lint; enforced by lefthook)

---

## Testing

- **Unit tests:** `pnpm test` (Vitest)
  - Place in `tests/unit/`, name `*.test.ts`
  - Target ≥80% meaningful coverage
  - Mock external calls (fetch, API, CMS)
- **E2E tests:** `pnpm test:e2e` (Playwright)
  - Place in `tests/e2e/`, name `*.spec.ts`
  - Use `@playwright/test` fixtures
- **Accessibility:** `pnpm test:a11y` (pa11y-ci)
- **Visual regression:** `pnpm test:e2e:visual` (Playwright screenshots)

**Rule:** Always add/update tests when changing behavior. Prefer extending existing test files over creating new ones.

---

## Components & Styling

- **Pages/Layouts:** Use `.astro` files (server-rendered by default)
- **Interactive components:** Use `.svelte` files (Svelte 5 runes: `$state`, `$derived`, `$effect`)
- **TypeScript:** Prefer interfaces over types; avoid `any`; use strict mode
- **CSS:** Tailwind v4 utilities first; custom CSS in `src/styles/global.css` only when necessary
- **File naming:** kebab-case for files; PascalCase for Svelte components
- **Indentation:** 2 spaces (enforced by Prettier + Biome)

**Rule:** Do not inline large style blocks. Extract to `global.css` or Tailwind utilities.

---

## Cloudflare Integration

- **Functions:** `functions/` directory (Cloudflare Pages Functions)
  - Middleware: `functions/_middleware.ts`
  - Admin CMS: `functions/admin/[[path]].ts`
  - OAuth callbacks: `functions/api/callback.ts`
- **Workers:** `workers/` directory (separate Wrangler projects)
  - `decap-oauth/` → OAuth provider for Decap CMS
  - `cache-purge/` → Cache invalidation on content changes
- **Environment:** Secrets in Cloudflare Pages/Workers env vars (never commit `.env` or `.dev.vars`)
- **Deployment:** See `DEPLOYMENT.md` and `desired-state/` templates

**Rule:** Do not modify Cloudflare deployment workflows (`.github/workflows/deploy-*.yml`) without PR review and schema sync.

---

## Repository Structure

- `src/` → Application code (pages, components, lib, styles)
- `public/` → Static assets (images, fonts, icons)
- `tests/` → Test suites (unit, e2e, a11y)
- `functions/` → Cloudflare Pages Functions
- `workers/` → Cloudflare Workers (separate projects)
- `scripts/` → Build scripts, gates, validation
- `policy/` → OPA/Rego policies for quality checks
- `docs/` → Developer documentation and ADRs
- `desired-state/` → Deployment config templates

---

## Workflow Constraints

1. **Build changes:** Never replace `astro.config.mjs` or `vite` plugins without explicit approval.
2. **Schema changes:** Always sync with Cloudflare Pages/Workers environment before deploy.
3. **Dependency upgrades:** Run full test suite (`pnpm test && pnpm test:e2e`) and update lockfile.
4. **Breaking changes:** Document in `CHANGELOG.md` and update migration notes.
5. **GitHub Actions:** Do not modify `.github/workflows/` without PR review.

---

## Security

- **Secrets:** Use Cloudflare env vars; reference in `.env.example` but never commit real values.
- **Protected files:** Lefthook blocks `*.env`, `*.env.local`, `*.dev.vars` from commits.
- **Input validation:** Always validate user input in functions and API routes.
- **CSP:** Follow Content Security Policy in `astro.config.mjs` headers.

---

## Documentation

- **Architecture notes:** `ARCHITECTURE.md` for high-level patterns.
- **ADRs:** `docs/decisions/ADR-*.md` for significant design decisions.
- **API changes:** Update `docs/api/` when adding/modifying endpoints.
- **Playbooks:** `docs/*.md` for operational procedures.

**Rule:** Update docs when changing public APIs, deployment config, or architectural patterns.

---

## Commit & PR Guidelines

- **Conventional Commits:** `feat:`, `fix:`, `docs:`, `chore:`, `test:`, etc.
- **Branch naming:** `feature/*`, `fix/*`, `docs/*`, `deps/*`
- **Pre-push:** `pnpm check` must pass (enforced by lefthook)
- **PRs:** Link issues, include screenshots for UI, note breaking changes.

---

## When in Doubt

- Check `AGENTS.md` for agent-specific guidelines.
- Check `ENVIRONMENT.md` for env var setup.
- Check `DEPLOYMENT.md` for Cloudflare deployment details.
- Run `pnpm validate:all` and `pnpm policy:check` before pushing.
