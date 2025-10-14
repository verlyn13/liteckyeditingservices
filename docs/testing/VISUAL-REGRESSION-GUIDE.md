# Visual Regression Testing Guide

**Last Updated**: October 14, 2025
**Status**: ✅ Modernized with October 2025 best practices

> **For PR workflow and developer usage**, see **[docs/playbooks/pr-workflow.md](../playbooks/pr-workflow.md)**
>
> This guide focuses on **technical implementation details** and configuration.

## Overview

Visual regression testing ensures our UI remains consistent across deployments by comparing screenshots against baseline images. We use **Playwright's built-in visual testing** with modern stability techniques integrated into our professional CI/CD workflow.

## Modern Configuration (October 2025)

### Status: ✅ Stable and Production-Ready

All visual regression issues have been resolved with October 2025 Playwright best practices:

**Configuration Applied**:

- ✅ Svelte async SSR enabled (future-proof for Svelte 5.39+)
- ✅ Locked rendering environment (viewport, deviceScale, colorScheme)
- ✅ Deterministic readiness (domcontentloaded + optional readySelector; no networkidle)
- ✅ Snapshot options with animations disabled and caret hidden
- ✅ Platform-specific baselines (darwin for local, linux for CI)

**Results**:

- Fixed 1-pixel height differences (deviceScaleFactor: 1)
- 0.5% visual tolerance (maxDiffPixelRatio: 0.005)
- Consistent rendering across local and CI environments

## Test Implementation

### Current Test Suite: `tests/e2e/visual.spec.ts`

We test 4 targeted components instead of full-page screenshots for faster, more reliable tests:

1. **Header** (`getByRole("banner")`)
2. **Footer** (`getByRole("contentinfo")`)
3. **Hero Section** (first `<section>`)
4. **Contact Form** (first `<form>` on /contact/)

### 1. Playwright Configuration (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    headless: true,
    viewport: { width: 1280, height: 960 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    locale: 'en-US',
    baseURL: process.env.BASE_URL ?? 'http://localhost:4321',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.005 } },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer:
    process.env.BASE_URL && !process.env.BASE_URL.includes('localhost')
      ? undefined
      : {
          command: 'pnpm build && pnpm preview --port 4321',
          url: 'http://localhost:4321',
          reuseExistingServer: true,
        },
  snapshotPathTemplate:
    '{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}-{platform}.png',
});
```

### 2. Svelte Configuration (`svelte.config.js` + `astro.config.mjs`)

```javascript
// svelte.config.js
export default {
  compilerOptions: {
    experimental: { async: true }, // Enable async SSR for Svelte 5.39+
  },
};
```

### 3. Visual Helper (`tests/helpers/visual.ts`)

```typescript
export async function prepareForVisualTest(
  page: Page,
  el?: Locator,
  opts?: { readySelector?: string }
) {
  await page.waitForLoadState('domcontentloaded');
  if (opts?.readySelector) {
    await page
      .locator(opts.readySelector)
      .first()
      .waitFor({ state: 'visible', timeout: 10_000 })
      .catch(() => {});
  }

  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    const pending = Array.from(document.images)
      .filter((img) => !img.complete)
      .map(
        (img) =>
          new Promise<void>((res) => {
            img.addEventListener('load', () => res(), { once: true });
            img.addEventListener('error', () => res(), { once: true });
          })
      );
    await Promise.all(pending);
  });

  await page.addStyleTag({
    content: `
      /* Option A: keep baselines at full viewport width (no gutter) */
      :root { scrollbar-gutter: auto !important; }
      html, body { overflow-y: hidden !important; }
      [data-flaky], .live-chat, .cookie-banner { visibility: hidden !important; }
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      ::selection { background: transparent !important; }
    `,
  });

  if (el) {
    await el.scrollIntoViewIfNeeded();
    await el.waitFor({ state: 'visible' });
  }

  await page.waitForTimeout(50);
}
```

### 4. Snapshot Options (`tests/e2e/visual.spec.ts`)

```typescript
const snapshotOptions = {
  animations: 'disabled',
  caret: 'hide',
  maxDiffPixelRatio: 0.005, // 0.5% tolerance
};

await expect(header).toHaveScreenshot('header.png', snapshotOptions);
```

## Workflow Management

> **For complete PR workflow with visual regression testing**, see **[docs/playbooks/pr-workflow.md](../playbooks/pr-workflow.md)**

### Running Visual Tests Locally

```bash
# Run all visual tests
pnpm test:visual

# Update baselines (when UI changes are intentional)
pnpm test:visual:update

# Run specific test
pnpm exec playwright test tests/e2e/visual.spec.ts -g "header"

# Debug with UI mode
pnpm exec playwright test tests/e2e/visual.spec.ts --ui
```

### CI/CD Workflows

See [.github/workflows/README.md](../../.github/workflows/README.md) for complete workflow documentation.

**1. e2e-visual.yml** (Auto on push to main and PRs; blocking)

- Runs automatically on every PR and push to main
- Uses Linux baselines (platform-specific)
- Installs system fonts to match seeding env; kills port 4321 before server start
- **Fails PRs when snapshots don't match** (expected behavior for UI changes)

**2. Visual Tests (Modern)** (Manual trigger for baseline updates)

- Trigger with `updateBaselines=true` (optionally pass `ref=<SHA>` to seed from exact commit)
- Uploads artifacts and can auto-open a PR with updated baselines
- Use when UI changes are intentional or environment changed

### Updating Baselines

**Standard Workflow** (Developers - see [pr-workflow.md](../playbooks/pr-workflow.md)):

```bash
# Local update (macOS/darwin)
pnpm test:visual:update

# Commit and push
git add tests/e2e/__screenshots__/
git commit -m "test: update visual baselines for [reason]"
git push
```

**Advanced: CI Baseline Update** (Linux baselines on GitHub Actions):

```bash
# Trigger workflow manually (requires gh auth)
gh workflow run .github/workflows/visual-modern.yml -f updateBaselines=true -f ref=<SHA>

# The workflow uploads an artifact and can auto-open a PR
# Manual commit alternative:
gh run download <RUN_ID> -n updated-baselines -D tmp/baselines
mv tmp/baselines/visual.spec.ts/*.png tests/e2e/__screenshots__/visual.spec.ts/
git add tests/e2e/__screenshots__/visual.spec.ts/
git commit -m "test: update Linux visual baselines"
```

## Best Practices

### 1. Prevent Dynamic Content Issues

```css
/* Add to test styles */
.timestamp,
.date-display,
time {
  visibility: hidden !important;
}
.loading,
.skeleton,
.shimmer {
  display: none !important;
}
```

### 2. Mock Dynamic Data

```typescript
test.beforeEach(async ({ page }) => {
  await page.context().addInitScript(() => {
    // Mock Date for consistency
    const constantDate = new Date('2025-01-01T12:00:00Z');
    Date = class extends Date {
      constructor(...args) {
        if (args.length === 0) {
          super(constantDate);
        } else {
          super(...args);
        }
      }
    } as any;
  });
});
```

### 3. Component-Level Testing

Instead of full-page screenshots, consider component-level tests:

```typescript
test('header navigation', async ({ page }) => {
  const header = page.locator('header').first();
  await expect(header).toHaveScreenshot('header-nav.png');
});
```

## Troubleshooting

### Issue: Tests Pass Locally but Fail in CI

**Solutions**:

1. Ensure same viewport settings
2. Use Docker locally to match CI environment
3. Increase wait times for CI (slower machines)
4. Use higher tolerance in CI

### Issue: Flaky Tests

**Solutions**:

1. Increase `waitForTimeout` to 2000ms or more
2. Add explicit waits for specific elements
3. Use `waitForLoadState("networkidle")`
4. Disable service workers during tests

### Issue: Font Rendering Differences

**Solutions**:

1. Wait for `document.fonts.ready`
2. Use web fonts with consistent rendering
3. Increase `maxDiffPixelRatio` to 0.05-0.08
4. Consider font-smoothing CSS normalization

## Maintenance Schedule

### Weekly

- Review any failed visual tests
- Update baselines if UI changes are intentional

### Monthly

- Audit screenshot coverage
- Clean up obsolete baselines
- Review tolerance settings

### Quarterly

- Evaluate if visual testing provides value
- Consider switching to Percy.io or similar service for better stability

## Alternative Solutions

If visual regression remains unstable, consider:

1. **Percy.io**: Cloud-based visual testing service
2. **BackstopJS**: Alternative visual regression tool
3. **Chromatic**: Storybook visual testing
4. **Component Testing**: Focus on critical components only
5. **Increase Tolerances**: Accept more variation (trade-off: may miss real issues)

## Commands Reference

```bash
# Run improved visual tests
pnpm exec playwright test visual-improved.spec.ts

# Update baselines for single browser
pnpm exec playwright test visual-improved.spec.ts --update-snapshots --project=chromium

# Debug visual tests with UI
pnpm exec playwright test visual-improved.spec.ts --ui

# Generate HTML report
pnpm exec playwright show-report

# Clean all screenshots
rm -rf tests/e2e/*-snapshots/
```

## Current Configuration

**Test Suite**: `tests/e2e/visual.spec.ts`

- **Tests**: 4 (header, footer, hero, contact form)
- **Browser**: Chromium only (for speed and consistency)
- **Viewport**: 1280×960
- **Device Scale**: 1 (prevents fractional pixels)
- **Base Tolerance**: 0.5% (config), 2% (per-test)
- **Wait Strategy**: networkidle + element visibility
- **Platforms**: darwin (local), linux (CI)

## References

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots) - Official docs
- [Svelte October 2025 Updates](https://svelte.dev/blog/whats-new-in-svelte-october-2025) - Async SSR feature
- Commit `10b480d` - Visual stability improvements implementation

## Maintenance

### When to Update Baselines

✅ **Update when**:

- Intentional UI changes (new styles, layouts, colors)
- Font updates or typography changes
- Component structure modifications

❌ **Don't update for**:

- Random CI failures (investigate root cause first)
- Single pixel differences (adjust tolerance instead)
- Flaky tests (fix stability issues first)

### Monitoring

**Weekly**: Review visual test results in CI
**Monthly**: Audit baseline files for obsolete screenshots
**Quarterly**: Review tolerance settings and test coverage
