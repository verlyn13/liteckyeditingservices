# Repository Guidelines

## Project Structure & Modules

- `src/` — App code (Astro pages, Svelte components, lib, styles).
- `public/` — Static assets served as-is.
- `tests/` — `unit/` (Vitest) and `e2e/` (Playwright).
- `scripts/` — Validation gates and repo checks.
- `policy/` — Rego policies for quality/infra.
- `docs/` — Developer docs and playbooks.
- `desired-state/` — Deployment/config templates.

## Build, Test, and Development

- `pnpm install` — Install deps (Node ≥24, pnpm ≥10.16).
- `pnpm dev` — Run locally at http://localhost:4321.
- `pnpm build` — Type-check then build for production.
- `pnpm preview` — Serve the production build.
- `pnpm test` — Run unit tests (Vitest).
- `pnpm test:e2e` — Run Playwright tests.
- `pnpm test:a11y` — Run accessibility checks (pa11y-ci).
- `pnpm check` — Typecheck + lint; used by hooks/CI.
- `pnpm validate:all` and `pnpm policy:check` — Repo gates.

## Coding Style & Conventions

- Indentation: 2 spaces; no tabs.
- Languages: TypeScript preferred; avoid `any`.
- Components: Astro for pages/layouts; Svelte 5 for interactivity.
- CSS: Tailwind v4 utilities; custom CSS only when necessary.
- Single source of truth for styles: `src/styles/global.css` (tokens + base). Prettier `tailwindStylesheet` points here.
- Formatting: Prettier (`.prettierrc.json`). Fix with `pnpm format`.
- Linting: ESLint (`eslint.config.js`). Fix with `pnpm lint:fix`.
- File naming: kebab-case for files; PascalCase for Svelte components.

## Testing Guidelines

- Unit tests: place in `tests/unit`, name `*.test.ts`.
- E2E tests: place in `tests/e2e` (Playwright).
- Target ≥80% meaningful coverage; mock external calls.
- Run `pnpm test && pnpm test:e2e` before PRs.

## Commit & Pull Requests

- Branches: `feature/*`, `fix/*`, `docs/*`, `deps/*`.
- Conventional Commits, e.g. `feat: add pricing table`.
- Before push: `pnpm check`; hooks (lefthook) also validate structure.
- PRs: clear description, linked issues, screenshots for UI, and note breaking changes.

## Security & Configuration

- Never commit secrets. Use env vars; see `.env.example` and `ENVIRONMENT.md`.
- Protected files: hooks block `*.env`, `*.env.local`, `*.dev.vars`.
- Follow `desired-state/` templates for deploy-related config.

## Agent Tips

- Use `pnpm` (repo is pinned: `packageManager` in `package.json`).
- Keep changes minimal and align with existing patterns. Update docs when behavior changes.

## Development Environment

- Version manager: `mise` controls Node and pnpm versions from `.mise.toml`.
- Env loading: `.envrc` + `direnv` load `.dev.vars` and `.env` when present. Optional.
- If direnv is unavailable: `pnpm run dev:env` loads `.dev.vars` and starts dev.
- First-time setup:
  - `mise install` to install tool versions
  - `direnv allow .` to trust and auto-load env on `cd` (optional)
- Quality gates: `pnpm validate:all` and `pnpm policy:check` must pass locally.
- Hooks: `lefthook` enforces pre-commit/pre-push checks (auto-installed via pnpm dlx).
