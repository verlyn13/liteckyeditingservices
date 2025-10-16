---
name: Policy Gate
trigger: /policy_gate
version: 1.0
description: Enforces build, test, lint, and security checks before merge
---

# Policy Gate Workflow

Run comprehensive quality gates to ensure code is merge-ready.

## Steps

1. **Install dependencies** (if not already installed)
   ```fish
   pnpm install
   ```

2. **Run repository structure validation**
   ```fish
   pnpm validate:all
   ```
   - Checks for required files, directory structure
   - Validates package.json scripts and dependencies
   - Ensures git hooks are configured

3. **Run policy checks**
   ```fish
   pnpm policy:check
   ```
   - Executes OPA/Rego policies from `policy/`
   - Validates infrastructure-as-code patterns
   - Checks for security anti-patterns

4. **Type check**
   ```fish
   pnpm typecheck
   ```
   - TypeScript strict mode validation
   - Ensures no `any` types in critical paths
   - Validates type imports and exports

5. **Lint check**
   ```fish
   pnpm biome check
   ```
   - Biome linter for code quality
   - Checks formatting consistency
   - Validates import order and unused vars

6. **Run unit tests**
   ```fish
   pnpm test
   ```
   - Vitest unit tests with coverage
   - Expects ≥80% coverage on changed files
   - Mocks external dependencies

7. **Run E2E tests** (optional, use for pre-merge)
   ```fish
   pnpm test:e2e
   ```
   - Playwright end-to-end tests
   - Validates critical user flows
   - Checks responsive behavior

8. **Run accessibility checks**
   ```fish
   pnpm test:a11y
   ```
   - pa11y-ci automated accessibility tests
   - Checks WCAG 2.1 Level AA compliance
   - Validates semantic HTML and ARIA labels

## Success Criteria

All commands must exit with code 0. If any fail:
- Review the error output
- Fix the issue
- Re-run the failed command
- Re-run full policy gate before merging

## Usage

In Cascade, type `/policy_gate` to execute this workflow.

## Integration

This workflow aligns with:
- **Lefthook pre-push hooks** (runs `pnpm check` automatically)
- **GitHub Actions CI** (`.github/workflows/ci.yml`)
- **Cloudflare Pages build** (validates before deploy)
