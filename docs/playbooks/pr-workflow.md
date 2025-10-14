# Pull Request Workflow

> **Professional CI/CD workflow for visual regression testing and quality gates**
>
> Last updated: 2025-10-14

## Overview

This project uses a **professional CI/CD workflow** with automated quality gates that enforce code quality, visual regression testing, and documentation standards before code can be merged to `main`.

The workflow is designed to:
- **Catch visual regressions automatically** via Playwright snapshots
- **Fail PRs when snapshots don't match** (not warnings - hard failures)
- **Require developers to update baselines locally** before PRs can pass
- **Provide preview deployments** via Cloudflare Pages for manual verification
- **Enforce documentation updates** when code changes

## The Professional Workflow

### 1. Developer Makes Changes

Developer creates a feature branch and makes code/UI changes:

```bash
git checkout -b feature/my-change
# Make changes to code, components, styles, etc.
git add .
git commit -m "feat: implement new feature"
git push -u origin feature/my-change
```

### 2. Create Pull Request

When you push to a feature branch and open a PR, **GitHub Actions automatically runs**:

#### Quality Gate Workflow (`.github/workflows/quality-gate.yml`)

Runs on every PR and includes:
- **Preflight checks** - Validates CI configuration
- **Structure validation** - Ensures required files/directories exist
- **Code quality** - Biome linting, TypeScript checks, build verification
- **Documentation gate** - Ensures docs are updated with code changes

#### Visual Regression Workflow (`.github/workflows/e2e-visual.yml`)

Runs on every PR and validates:
- **Visual snapshots** - Compares current UI against baseline screenshots
- **Component rendering** - Tests header, footer, hero, contact form
- **Cross-platform consistency** - Validates Linux (CI) and Darwin (local) baselines

**Key behavior**: If visual changes are detected, the workflow **FAILS** the PR. This is intentional.

### 3. Visual Regression Test Failure (Expected!)

When you change UI elements (like favicons, colors, layout), the visual regression tests will fail:

```
Error: Screenshot comparison failed!

Expected: tests/e2e/__screenshots__/visual.spec.ts/header-chromium-linux.png
Received: tests/e2e/__screenshots__/visual.spec.ts/header-chromium-linux-actual.png

Diff: tests/e2e/__screenshots__/visual.spec.ts/header-chromium-linux-diff.png
```

**This is expected and correct behavior!** The CI is telling you: "The UI changed. Did you intend this?"

### 4. Developer Updates Baselines Locally

If the visual changes are intentional, update the baselines:

```bash
# Run visual tests locally and update snapshots
pnpm test:visual:update

# This regenerates baseline screenshots for your platform (darwin/linux)
# Example output:
#   ✓ header.png - regenerated
#   ✓ hero.png - regenerated
#   ✓ footer.png - unchanged
#   ✓ contact-form.png - unchanged

# Review the changes
git status
# Should show:
#   M tests/e2e/__screenshots__/visual.spec.ts/header-chromium-darwin.png
#   M tests/e2e/__screenshots__/visual.spec.ts/hero-chromium-darwin.png

# Commit the updated baselines
git add tests/e2e/__screenshots__/
git commit -m "test: update visual baselines for favicon change"
git push
```

### 5. CI Re-Runs and Passes

After pushing updated baselines:
- GitHub Actions re-runs the visual regression tests
- Tests now pass because baselines match the current UI
- Quality gate turns green ✅
- PR is ready for review and merge

### 6. Cloudflare Pages Preview Deployment

Every PR automatically gets a preview deployment:

```
Preview URL: https://COMMIT_HASH.liteckyeditingservices.pages.dev
```

Use this to:
- Manually verify the changes in a live environment
- Share with stakeholders for approval
- Test on real devices/browsers

### 7. Merge to Main

Once all checks pass:
- Code quality ✅
- Visual regression tests ✅
- Documentation updates ✅
- Manual review ✅

**Merge the PR** → Triggers production deployment to `www.liteckyeditingservices.com`

## Automated Quality Gates

### Pre-Commit Hooks (Lefthook)

Runs **locally before commit**:
- **Package version validation** - Ensures Node 24, pnpm 10.16+, correct package versions
- **Repository structure** - Validates required files/directories exist
- **Linting** - Auto-fixes formatting issues (if files are staged)

```bash
# Example output on commit:
╭───────────────────────────────────────╮
│ 🥊 lefthook v1.13.6  hook: pre-commit │
╰───────────────────────────────────────╯
┃  package-versions ❯ ✅ All package versions are correct
┃  repo-structure ❯ ✅ Repository structure is valid
```

### Pre-Push Hooks (Lefthook)

Runs **locally before push**:
- **Documentation gate** - Ensures docs/ADRs/status files are updated when code changes

```bash
# Example output on push:
╭─────────────────────────────────────╮
│ 🥊 lefthook v1.13.6  hook: pre-push │
╰─────────────────────────────────────╯
┃  docs-gate ❯ ✅ Docs gate: OK
```

If docs gate fails, update one of:
- `PROJECT-STATUS.md` (progress tracking)
- `IMPLEMENTATION-ROADMAP.md` (plan changes)
- `docs/decisions/*.md` (architectural decisions)
- `docs/*.md` (feature documentation)

### GitHub Actions Workflows

#### `quality-gate.yml` - Runs on every PR
- Validates structure, code quality, build, and documentation
- Uploads Sentry sourcemaps automatically
- **Must pass** before PR can be merged

#### `e2e-visual.yml` - Runs on every PR and push to main
- Captures screenshots of key components
- Compares against baseline snapshots
- **Fails if visual changes detected** (requires baseline update)
- Uploads Playwright reports for debugging

#### `visual-modern.yml` - Manual baseline update workflow
- **Manually triggered** when you need to update baselines in CI
- Runs visual tests with `--update-snapshots` flag
- Automatically creates a PR with updated baselines
- Useful for bulk baseline updates or CI-only updates

#### `deploy-production.yml` - Runs on merge to main
- Deploys to Cloudflare Pages production
- Triggers post-deployment validation
- Updates production environment

#### `post-deploy-validation.yml` - Runs after production deploy
- Validates production deployment
- Checks critical pages load correctly
- Verifies CMS accessibility

## Visual Regression Testing Details

### Test Locations

- **Test file**: `tests/e2e/visual.spec.ts`
- **Baseline snapshots**: `tests/e2e/__screenshots__/visual.spec.ts/`
- **Playwright config**: `playwright.config.ts`

### Tested Components

1. **Header** (`header.png`)
   - Site logo/branding
   - Navigation menu
   - Favicon (visible in browser chrome)

2. **Footer** (`footer.png`)
   - Copyright information
   - Footer navigation links
   - Contact information

3. **Hero Section** (`hero.png`)
   - Homepage hero content
   - Primary CTAs
   - Trust bar/stats badges

4. **Contact Form** (`contact-form.png`)
   - Form inputs and styling
   - Submit button
   - Validation states

### Platform-Specific Baselines

Visual snapshots are platform-specific because font rendering differs:

- **Linux baselines** (`*-chromium-linux.png`) - Used in CI (GitHub Actions)
- **Darwin baselines** (`*-chromium-darwin.png`) - Used locally on macOS

**Important**: When you update baselines locally on macOS, you update `*-darwin.png` files. The CI uses `*-linux.png` files. Playwright is configured to tolerate small cross-platform rendering differences, but significant changes should be validated on both platforms.

### Updating Baselines

#### Local Update (Recommended)

```bash
# Update all baselines for your platform
pnpm test:visual:update

# Review changes
git diff tests/e2e/__screenshots__/

# Commit if intentional
git add tests/e2e/__screenshots__/
git commit -m "test: update visual baselines for [reason]"
```

#### CI Update (Advanced)

For bulk updates or CI-only baseline regeneration:

1. Go to **Actions** → **Visual Tests (Modern)**
2. Click **Run workflow**
3. Set `updateBaselines: true`
4. Select branch/ref to seed from
5. Click **Run workflow**

This will:
- Generate new baselines in CI
- Create a PR with updated `*-linux.png` files
- Require manual review and merge

### Common Visual Test Failures

#### Favicon Changes
```
header-chromium-linux.png differs
→ Update baselines: pnpm test:visual:update
```

#### Color/Theme Changes
```
All snapshots differ (color changes affect all components)
→ Update baselines: pnpm test:visual:update
```

#### Layout/Spacing Changes
```
hero-chromium-linux.png differs (layout shift detected)
→ Update baselines: pnpm test:visual:update
```

#### Font Loading Issues
```
Snapshots differ: font not fully loaded
→ Check prepareForVisualTest() helper
→ Ensure fonts are cached in CI
```

## Troubleshooting

### Visual tests fail but UI looks correct

**Cause**: Baselines are outdated or platform-specific differences.

**Solution**:
```bash
pnpm test:visual:update
git add tests/e2e/__screenshots__/
git commit -m "test: update visual baselines"
git push
```

### Docs gate fails on push

**Cause**: Code changed but docs weren't updated.

**Solution**: Update one of the required documentation files:
```bash
# Update project status
vim PROJECT-STATUS.md

# Or update feature docs
vim docs/ASSETS-AND-IMAGES.md

# Then amend or make new commit
git add PROJECT-STATUS.md
git commit --amend --no-edit
git push --force-with-lease
```

### CI visual tests pass but local tests fail

**Cause**: Platform-specific rendering differences (Linux vs Darwin).

**Solution**:
- CI uses Linux baselines (`*-linux.png`)
- Local tests use Darwin baselines (`*-darwin.png`)
- Update local baselines: `pnpm test:visual:update`
- Don't worry if Linux baselines remain unchanged in CI

### Pre-commit hook fails on package versions

**Cause**: Wrong Node/pnpm version or outdated packages.

**Solution**:
```bash
# Check versions
node --version  # Should be >=24 <25
pnpm --version  # Should be >=10.16.0

# If using mise:
mise install

# Update pnpm if needed:
corepack enable
corepack prepare pnpm@10.17.1 --activate
```

## Best Practices

### 1. Always Run Visual Tests Locally Before Pushing

```bash
# Run visual tests (compare mode)
pnpm test:visual

# If intentional changes, update baselines
pnpm test:visual:update

# Commit baselines with code changes
git add tests/e2e/__screenshots__/
git commit -m "feat: update header + visual baselines"
```

### 2. Keep Baselines in Sync with UI Changes

- **Never ignore visual test failures** - They're telling you something changed
- **Always update baselines** when you intentionally change UI
- **Review baseline diffs** before committing to ensure changes are expected

### 3. Use Semantic Commit Messages

```bash
# Good commit messages:
git commit -m "feat: add dark mode toggle"
git commit -m "test: update visual baselines for dark mode"
git commit -m "fix: correct header alignment on mobile"
git commit -m "docs: document dark mode implementation"

# Include baseline updates in the same PR as the UI change
```

### 4. Document Visual Changes

When making UI changes that update baselines, explain why in:
- Commit message body
- PR description
- `PROJECT-STATUS.md` or `IMPLEMENTATION-ROADMAP.md`

Example:
```bash
git commit -m "feat: implement new book_and_check.svg favicon

Replace logo.svg with book_and_check.svg as the official site favicon.

- Updated BaseLayout.astro favicon links
- Added cache-busting query parameters (?v=2)
- Regenerated all icon sizes (16-512px)
- Updated visual baselines (hero snapshot shows new favicon)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### 5. Use Preview Deployments for Stakeholder Review

Every PR gets a Cloudflare Pages preview:
- Share the preview URL with stakeholders
- Test on multiple devices/browsers
- Verify before merging to production

### 6. Monitor CI Workflows

After pushing:
```bash
# Watch workflow execution
gh run list --limit 5

# View specific run
gh run view <run-id>

# View logs if failed
gh run view <run-id> --log
```

## Workflow Commands Reference

### Running Tests Locally

```bash
# All tests
pnpm test                    # Unit tests (Vitest)
pnpm test:e2e                # E2E tests (Playwright)
pnpm test:visual             # Visual regression tests (compare mode)
pnpm test:visual:update      # Update visual baselines

# Specific test suites
pnpm test:a11y               # Accessibility tests (pa11y)
pnpm test:cms                # CMS integration tests
pnpm test:smoke              # Smoke tests (critical paths)
```

### Quality Checks

```bash
# Full quality check (recommended before pushing)
pnpm check                   # TypeScript + linting + build

# Individual checks
pnpm typecheck               # TypeScript validation
pnpm lint                    # ESLint
pnpm biome:check             # Biome linting and formatting
pnpm format                  # Prettier formatting
```

### Build and Preview

```bash
# Development
pnpm dev                     # Start dev server (localhost:4321)

# Production build
pnpm build                   # Build for production
pnpm preview                 # Preview production build locally
```

### Validation

```bash
# Policy validation
pnpm validate:all            # Run all validation scripts
pnpm validate:versions       # Check Node/pnpm/package versions
pnpm validate:structure      # Check required files/directories
pnpm validate:decap          # Validate Decap CMS bundle
pnpm validate:sentry         # Validate Sentry setup

# Documentation gate
pnpm gate:docs               # Check docs are updated
```

## Related Documentation

- **Visual Testing Setup**: `tests/e2e/README.md` (if exists)
- **Playwright Configuration**: `playwright.config.ts`
- **CI/CD Workflows**: `.github/workflows/`
- **Quality Gates**: `scripts/gates/`
- **Validation Scripts**: `scripts/validate/`

## Changelog

- **2025-10-14** - Created PR workflow documentation with professional CI/CD approach
- **2025-10-14** - Documented visual regression testing workflow
- **2025-10-14** - Added troubleshooting guide for common failures
