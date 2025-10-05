# Visual Regression Testing Guide

## Overview

Visual regression testing ensures our UI remains consistent across deployments by comparing screenshots against baseline images. This guide covers our setup, common issues, and maintenance procedures.

## Current Issues & Solutions

### Problem: Height Differences (1702px vs 1730px)
**Symptoms**:
- Expected height: 1702px
- Received height: 1730px
- 43,409 pixel differences (ratio 0.07)

**Root Causes**:
1. **Dynamic Content**: Elements that change between test runs
2. **Font Loading**: Inconsistent font rendering timing
3. **Layout Shifts**: Content jumping after initial render
4. **Viewport Differences**: CI vs local environment variations

## Improved Test Implementation

We've created `visual-improved.spec.ts` with these enhancements:

### 1. Stabilization Techniques

```typescript
async function preparePageForScreenshot(page: Page) {
    // Disable animations
    await page.addStyleTag({
        content: `*, *::before, *::after {
            animation: none !important;
            transition: none !important;
        }`
    });

    // Wait for fonts
    await page.evaluate(() => document.fonts.ready);

    // Wait for images
    await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return Promise.all(images.filter(img => !img.complete)...);
    });

    // Increased wait time for stability
    await page.waitForTimeout(1500); // Up from 500ms
}
```

### 2. Consistent Environment

```typescript
test.use({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    hasTouch: false,
    isMobile: false,
});
```

### 3. Tolerance Settings

```typescript
await expect(page).toHaveScreenshot("home-desktop.png", {
    fullPage: true,
    maxDiffPixelRatio: 0.05,  // 5% tolerance
    maxDiffPixels: 1000,       // Allow up to 1000 different pixels
    animations: "disabled",
});
```

## Workflow Management

### Running Visual Tests Locally

```bash
# Run visual tests
pnpm test:e2e:visual

# Update baselines (when UI changes are intentional)
./scripts/test/update-visual-baselines.sh

# Update for all browsers (CI mode)
./scripts/test/update-visual-baselines.sh --ci
```

### CI/CD Workflow

The `visual-regression.yml` workflow:
1. Runs on PRs that modify UI files
2. Can be manually triggered to update baselines
3. Uses only Chromium by default for stability
4. Uploads artifacts for review

### Updating Baselines via GitHub Actions

1. Go to Actions → visual-regression workflow
2. Click "Run workflow"
3. Set "Update baseline screenshots" to "true"
4. Download artifacts after completion
5. Commit new baselines to the PR

## Best Practices

### 1. Prevent Dynamic Content Issues

```css
/* Add to test styles */
.timestamp, .date-display, time {
    visibility: hidden !important;
}
.loading, .skeleton, .shimmer {
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
test("header navigation", async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toHaveScreenshot("header-nav.png");
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

- **Browsers**: Chromium (primary), Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Viewport**: 1280x720 (desktop), 375x667 (mobile)
- **Tolerance**: 5% pixel difference, max 1000 pixels
- **Wait Time**: 1500ms after page load
- **Full Page**: Yes, with scroll to top first

## Next Steps

1. **Immediate**: Update baselines with improved test file
2. **This Week**: Monitor CI stability with new settings
3. **Next Sprint**: Evaluate if we need Percy.io or similar service
4. **Long Term**: Consider component visual testing instead of full-page