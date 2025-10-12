# Accessibility Testing

## Overview

Accessibility tests use pa11y to check WCAG 2.1 AA compliance across all pages. Tests run against a local dev server.

## Running Tests

```bash
# Ensure dev server is running first
pnpm dev

# In another terminal
pnpm test:a11y
```

## Test Configuration

File: `tests/a11y/check.js`

### Standards
- **WCAG 2.1 Level AA** compliance
- Dual runners: `axe` and `htmlcs` for comprehensive coverage

### Tested Pages
- Homepage (`/`)
- Services (`/services`)
- Process (`/process`)
- About (`/about`)
- Testimonials (`/testimonials`)
- FAQ (`/faq`)
- Contact (`/contact`)

## Turnstile Widget Handling

The contact page includes a Cloudflare Turnstile widget which can timeout during automated testing. The a11y test handles this by:

```javascript
beforeScript: function() {
  const turnstile = document.querySelector('.cf-turnstile');
  if (turnstile) {
    turnstile.remove();
  }
}
```

This removes the widget before running accessibility checks, preventing:
- Timeout errors
- False positives from the iframe
- Inconsistent test results

**Note:** The Turnstile widget itself is provided by Cloudflare and meets accessibility standards. We remove it only for test reliability, not for accessibility concerns.

## Common Issues

### Timeout Errors

If tests timeout:

1. Increase timeout in `tests/a11y/check.js`:
   ```javascript
   timeout: 90000, // 90 seconds
   ```

2. Add wait time for page load:
   ```javascript
   wait: 2000, // 2 seconds
   ```

3. Check if dev server is running and responsive:
   ```bash
   curl -I http://localhost:4321
   ```

### False Positives

To ignore known false positives, add to the `ignore` array:

```javascript
ignore: [
  'notice', // Ignore all notice-level issues
  'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail', // Specific rule
]
```

### Color Contrast Issues

Pa11y is strict about color contrast. If you get contrast warnings:

1. Check actual contrast ratio: https://webaim.org/resources/contrastchecker/
2. Verify issue isn't from dynamic content (ads, embeds, etc.)
3. If valid, update design tokens in `src/styles/global.css`

## Test Output

Successful run:
```
Testing: http://localhost:4321/
✅ http://localhost:4321/ - No accessibility issues found
Testing: http://localhost:4321/services
✅ http://localhost:4321/services - No accessibility issues found
...
✅ All accessibility tests passed!
```

Failed run shows:
- Issue type (error, warning, notice)
- WCAG guideline violated
- Element selector where issue occurred
- Descriptive message

## CI/CD Integration

In GitHub Actions, accessibility tests:
- Run after build completes
- Use headless Chrome
- Fail the build if issues are found
- Generate reports as artifacts

## Best Practices

1. **Run tests frequently** during development
2. **Test with real assistive technology** (screen readers, keyboard nav)
3. **Don't rely solely on automated tests** - manual testing is essential
4. **Fix errors first**, then warnings, then notices
5. **Document exceptions** when ignoring issues

## Related Standards

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Axe Core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [HTML CodeSniffer Rules](https://squizlabs.github.io/HTML_CodeSniffer/)

## Tools

- **pa11y**: CLI tool for automated testing
- **axe DevTools**: Browser extension for manual testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Included in Chrome DevTools
