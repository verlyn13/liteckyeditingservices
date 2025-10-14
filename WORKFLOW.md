# Project Workflow (At-a-Glance)

This is the quickest way to understand how to work with the repo.

> **For complete PR workflow with visual regression testing**, see **[docs/playbooks/pr-workflow.md](docs/playbooks/pr-workflow.md)**

## Daily Flow

1. **Setup**: `mise install && pnpm install`
2. **Run**: `pnpm dev` (http://localhost:4321)
3. **Validate**: `pnpm check`
4. **Test**:
   - `pnpm test` (unit tests)
   - `pnpm test:e2e` (E2E tests)
   - `pnpm test:visual` (visual regression - **run before pushing UI changes**)
   - `pnpm test:a11y` (accessibility)
5. **Push PR**: CI runs Quality Gate + Visual Regression + Docs Health + Preview deploy
6. **If visual tests fail**: `pnpm test:visual:update`, commit baselines, push again

## Key Docs

- README.md — Quick start and stack
- PROJECT-STATUS.md — Current progress and next actions
- DOCUMENTATION-MASTER-INDEX.md — Full docs inventory and gaps
- DEPLOYMENT.md — Pages/Workers deployment
- SECRETS.md — Secrets inventory and rotation
- ARCHITECTURE.md — System overview and flows
- docs/onboarding.md — New developer setup

## Commands

### Development
- `pnpm dev` — Start dev server
- `pnpm build` — Type-check and build
- `pnpm preview` — Serve production build

### Quality & Validation
- `pnpm check` — Validate versions/structure/paths + Biome + TypeScript
- `pnpm typecheck` — TypeScript validation only
- `pnpm lint:fix` — Auto-fix linting issues

### Testing
- `pnpm test` — Unit tests (Vitest)
- `pnpm test:e2e` — E2E tests (Playwright, auto-starts dev server)
- `pnpm test:visual` — Visual regression tests ⭐
- `pnpm test:visual:update` — Update visual baselines ⭐
- `pnpm test:a11y` — Accessibility checks (pa11y)

### Workflows
- See [docs/playbooks/pr-workflow.md](docs/playbooks/pr-workflow.md) for PR workflow with visual testing
