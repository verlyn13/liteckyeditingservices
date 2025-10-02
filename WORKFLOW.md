# Project Workflow (At-a-Glance)

This is the quickest way to understand how to work with the repo.

## Daily Flow

1. Setup: `mise install && pnpm install`
2. Run: `pnpm dev` (http://localhost:4321)
3. Validate: `pnpm check`
4. Test: `pnpm test && pnpm test:e2e && pnpm test:a11y`
5. Push PR: CI runs Quality Gate + Docs Health + Preview deploy

## Key Docs

- README.md — Quick start and stack
- PROJECT-STATUS.md — Current progress and next actions
- DOCUMENTATION-MASTER-INDEX.md — Full docs inventory and gaps
- DEPLOYMENT.md — Pages/Workers deployment
- SECRETS.md — Secrets inventory and rotation
- ARCHITECTURE.md — System overview and flows
- docs/onboarding.md — New developer setup

## Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Type-check and build
- `pnpm preview` — Serve production build
- `pnpm check` — Validate versions/structure/paths + Biome + TypeScript
- `pnpm test:e2e` — Playwright tests (auto-starts dev server)
- `pnpm test:a11y` — Accessibility checks

