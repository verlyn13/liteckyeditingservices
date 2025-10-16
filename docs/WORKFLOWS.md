# Windsurf / Cascade Workflows

This document catalogs all available Windsurf/Cascade workflows for this repository.

## Overview

Workflows are organized into two categories:

1. **Automated Workflows** — Defined in `.windsurf/cascade.yaml`, run via Cascade UI
2. **Cascade Workflows** — Markdown-based prompts in `.windsurf/workflows/`, triggered with `/` commands

---

## Automated Workflows (cascade.yaml)

These workflows execute predefined command sequences. Trigger them from the Cascade panel in Windsurf.

### Dev Loop
**Description:** Plan, implement, and validate changes with tests and linting  
**Commands:**
```fish
pnpm install
pnpm check
pnpm test
pnpm test:e2e
pnpm lint:fix
```
**Use when:** Starting feature work or making code changes

---

### Quick Validate
**Description:** Fast repo gates + typecheck  
**Commands:**
```fish
pnpm validate:all
pnpm typecheck
```
**Use when:** Quick pre-commit validation

---

### A11y + E2E
**Description:** Accessibility checks and E2E tests  
**Commands:**
```fish
pnpm test:a11y
pnpm test:e2e
```
**Use when:** Validating UI changes for accessibility and user flows

---

### Prod E2E Sweep
**Description:** Run Playwright tests against the production domain  
**Commands:**
```fish
pnpm test:e2e:prod
```
**Use when:** Verifying production deployment health

---

### Dev Setup
**Description:** Set up local toolchain and dependencies  
**Commands:**
```fish
mise install
pnpm install
```
**Use when:** First-time setup or after pulling major changes

---

### Build Preview
**Description:** Typecheck and build for local preview  
**Commands:**
```fish
pnpm build
pnpm preview
```
**Use when:** Testing production build locally

---

### Docs Gate
**Description:** Ensure docs are in sync before push  
**Commands:**
```fish
pnpm gate:docs
```
**Use when:** Validating documentation changes

---

### Admin Check (Prod)
**Description:** Run Playwright admin smoke test against production  
**Commands:**
```fish
pnpm test:admin:prod
```
**Use when:** Verifying CMS admin functionality in production

---

### Policy Gate
**Description:** Validate repo structure and policy checks  
**Commands:**
```fish
pnpm validate:all
pnpm policy:check
```
**Use when:** Pre-merge validation (comprehensive)

---

## Cascade Workflows (Slash Commands)

These workflows are context-aware AI prompts that guide Cascade's behavior. Trigger them by typing `/` in Cascade chat.

### /policy_gate
**File:** `.windsurf/workflows/policy_gate.md`  
**Description:** Enforces build, test, lint, and security checks before merge

**What it does:**
1. Validates repository structure
2. Runs OPA/Rego policy checks
3. Type checks with strict TypeScript
4. Lints with Biome
5. Runs unit tests with coverage
6. Runs E2E tests (optional)
7. Checks accessibility compliance

**When to use:**
- Before opening a PR
- Before merging to main
- After major refactoring
- When CI fails unexpectedly

**Success criteria:** All checks must pass (exit code 0)

---

### /test_gen
**File:** `.windsurf/workflows/test_gen.md`  
**Description:** Generate or patch missing tests based on diff context

**What it does:**
1. Analyzes changed files via git diff
2. Identifies testable units (functions, components, APIs)
3. Generates Vitest test scaffolds for unit tests
4. Generates Playwright test scaffolds for E2E
5. Follows existing test patterns and conventions
6. Mocks external dependencies appropriately

**When to use:**
- After adding new functions or components
- When test coverage is below 80%
- When adding new API endpoints
- When implementing new user flows

**Output:** Test files in `tests/unit/` or `tests/e2e/` ready to run

---

### /refactor_plan
**File:** `.windsurf/workflows/refactor_plan.md`  
**Description:** Produce staged refactor checklist before execution

**What it does:**
1. Analyzes refactor scope (files, functions, dependencies)
2. Identifies public API surface and breaking changes
3. Creates behavior-preservation strategy
4. Generates step-by-step execution plan
5. Proposes test-first verification approach
6. Documents rollback procedures

**When to use:**
- Before multi-file refactoring
- When extracting shared logic
- When renaming core abstractions
- When changing architectural patterns

**Output:** Incremental checklist with test gates between steps

**Key principle:** Keep each step small (< 200 lines) and keep tests green

---

### /doc_sync
**File:** `.windsurf/workflows/doc_sync.md`  
**Description:** Update docs when API, schema, or architecture changes

**What it does:**
1. Identifies documentation affected by code changes
2. Generates update checklist for relevant docs
3. Proposes ADR creation for significant decisions
4. Updates API documentation
5. Syncs environment variable references
6. Validates documentation consistency

**When to use:**
- After adding/changing API endpoints
- After schema changes (DB, CMS, env vars)
- After architectural refactoring
- After introducing breaking changes
- After deployment procedure changes

**Affected docs:**
- `README.md` — Project overview
- `ARCHITECTURE.md` — Design patterns
- `DEPLOYMENT.md` — Deploy procedures
- `ENVIRONMENT.md` — Env var setup
- `docs/api/` — API endpoint docs
- `docs/decisions/ADR-*.md` — Architecture decisions

---

## Workflow Integration

### Git Hooks (Lefthook)
- **pre-commit:** Runs `pnpm check` (typecheck + lint)
- **pre-push:** Runs `pnpm validate:all` (structure + policy)

### GitHub Actions CI
- **quality-gate.yml:** Runs full Policy Gate on every PR
- **deploy-preview.yml:** Builds and deploys preview for PRs
- **cms-content-sync.yml:** Syncs content changes and purges cache

### Cloudflare Pages
- **Build command:** `pnpm build`
- **Build checks:** Runs typecheck before deploy
- **Preview:** Every PR gets a preview URL

---

## Best Practices

### When to Use Which Workflow

**Starting work:**
1. `Dev Setup` (if first time or after pulling)
2. Create feature branch
3. Make changes
4. `/test_gen` (if new functionality)
5. `Dev Loop` (validate changes)

**Before committing:**
1. `Quick Validate` (fast checks)
2. `/test_gen` (ensure coverage)
3. Git commit (pre-commit hook runs automatically)

**Before opening PR:**
1. `/policy_gate` (comprehensive validation)
2. `/doc_sync` (if docs affected)
3. `Build Preview` (test production build)
4. Push (pre-push hook runs automatically)

**During code review:**
1. Address feedback
2. Re-run affected workflows
3. Use `/refactor_plan` if significant changes needed

**Before merging:**
1. `/policy_gate` (final check)
2. Ensure CI passes
3. Verify preview deployment

---

## Troubleshooting

### "Invalid argument" error in Cascade
- **Cause:** Malformed YAML in `cascade.yaml`
- **Fix:** Validate YAML syntax, ensure commands exist in `package.json`

### Workflow doesn't appear in Cascade
- **Cause:** Windsurf needs to re-index the workspace
- **Fix:** Reload Windsurf window or restart Windsurf

### `/` command doesn't trigger workflow
- **Cause:** Workflow file not in `.windsurf/workflows/` or missing metadata
- **Fix:** Check file location and ensure YAML frontmatter is present

### Tests fail in workflow but pass locally
- **Cause:** Environment differences (missing env vars, stale deps)
- **Fix:** Run `mise install && pnpm install`, check `.dev.vars` is loaded

---

## Adding New Workflows

### Automated Workflow (cascade.yaml)

1. Edit `.windsurf/cascade.yaml`
2. Add new workflow under `workflows:` section
3. Follow existing pattern (name, description, steps)
4. Validate YAML syntax
5. Reload Windsurf to see changes

### Cascade Workflow (Slash Command)

1. Create `.windsurf/workflows/[name].md`
2. Add YAML frontmatter:
   ```yaml
   ---
   name: Workflow Name
   trigger: /workflow_name
   version: 1.0
   description: Brief description
   ---
   ```
3. Write workflow content (steps, guidelines, examples)
4. Update this `WORKFLOWS.md` with workflow documentation
5. Test by typing `/workflow_name` in Cascade

---

## Related Documentation

- **Global Rules:** `~/.codeium/windsurf/memories/global_rules.md` (cross-workspace)
- **Workspace Rules:** `.windsurf/rules/astro-svelte-stack.md` (project-specific)
- **Agent Guidelines:** `AGENTS.md` (development conventions)
- **Windsurf Config:** `.windsurf/README.md` (setup and prerequisites)

---

**Last Updated:** 2025-10-15  
**Version:** 1.0  
**Maintainer:** Repository owner
