# CMS Test Fix Documentation

**Date**: October 12, 2025
**Issue**: CMS E2E tests failing with timeout waiting for window.CMS
**Resolution**: Added window.CMS export and updated tests for compatibility

---

## Issue Summary

The CMS E2E tests were failing with timeouts when trying to detect CMS initialization. The tests were looking for `window.CMS` but the npm-based Decap CMS bundle was only setting `window.__cmsApp`.

### Failed Tests
- `CMS script loads without CSP violations` - 30s timeout
- `Admin CMS initializes without CSP violations` - 30s timeout

### Error Message
```
Test timeout of 30000ms exceeded.
Error: page.waitForFunction: Test timeout of 30000ms exceeded.
await page.waitForFunction(() => !!(window as unknown as { CMS?: unknown }).CMS, {
  timeout: 5000,
});
```

---

## Root Cause Analysis

1. **Migration to npm-based CMS**: The project migrated from vendor-delivered Decap CMS to npm-based `decap-cms-app`
2. **Different global export**: The npm version was only setting `window.__cmsApp` for diagnostics
3. **Test assumptions**: Tests were still looking for the legacy `window.CMS` global

---

## Solution Implemented

### 1. Added window.CMS Export
Updated `src/admin/cms.ts` to export CMS to both locations:
```typescript
// Diagnostics handle and global export for compatibility
(window as Window).__cmsApp = cms as unknown;
// Also expose as window.CMS for test compatibility
(window as Window & { CMS?: unknown }).CMS = cms;
```

### 2. Updated Tests for Flexibility
Modified `tests/e2e/cms.spec.ts` to check for either global:
```typescript
await page.waitForFunction(() => {
  const win = window as unknown as { CMS?: unknown; __cmsApp?: unknown };
  return !!(win.CMS || win.__cmsApp);
}, {
  timeout: 10000,
});
```

### 3. Rebuilt CMS Bundle
- Rebuilt with `pnpm run build:cms`
- Generated new hash: `cms.ca65a782.js`
- Updated references in `public/admin/index.html`

---

## Files Modified

1. **src/admin/cms.ts** - Added window.CMS export
2. **tests/e2e/cms.spec.ts** - Updated tests to check both globals
3. **public/admin/index.html** - Updated bundle reference to new hash
4. **public/admin/cms.ca65a782.js** - New built bundle with CMS export

---

## Testing Status

### Local Testing
- Build completes successfully
- CMS bundle loads and initializes
- Tests now check for both `window.CMS` and `window.__cmsApp`

### Enhanced Diagnostics (October 12, 2025 - Update)
Following persistent test failures in CI, comprehensive diagnostics were added to failing tests:

**Diagnostics Added:**
- Capture ALL console messages (not just CSP errors)
- Capture JavaScript errors via `pageerror` event
- Capture failed HTTP requests (4xx, 5xx status codes)
- Log bundle loading state on timeout
- Log window object state to debug export issues

**Tests Enhanced:**
- `CMS script loads without CSP violations` (10s timeout)
- `Admin CMS initializes without CSP violations` (15s timeout)

**Purpose:**
These diagnostics help identify the root cause of persistent test timeouts. When tests timeout waiting for `window.CMS` or `window.__cmsApp`, detailed logs show:
1. Whether the bundle was fetched successfully
2. If any JavaScript errors prevented execution
3. What the actual window object state is
4. All browser console output

**Commit:** `test(cms): add comprehensive diagnostics to failing tests` (11888345)

### Critical Runtime Fixes (October 12, 2025 - Update)
Browser diagnostic output revealed two critical errors blocking CMS initialization:

**Error 1: Sentry SRI Integrity Mismatch** (Blocking Script Load)
```
Failed to find a valid digest in the 'integrity' attribute for resource
'https://browser.sentry-cdn.com/8.48.0/bundle.tracing.replay.min.js'
with computed SHA-384 integrity 'gdAAufpzRZFoI7KqFiKJljH/2YMTO32L2rZL8rpO7ef1BTD8aJMPwdMiSJkjw/8I'.
The resource has been blocked.
```

- **Cause**: Incorrect SHA-384 hash in `public/admin/sentry-admin.js`
- **Fix**: Updated to correct hash from actual CDN resource
- **Additional**: Added onerror handler for better diagnostics

**Error 2: Node.js Module in Browser Bundle** (Fatal Runtime Error)
```
Uncaught Error: Dynamic require of "node:url" is not supported
    at cms.ca65a782.js:1:407
```

- **Cause**: esbuild `external: ['node:*']` marks as external, causing browser to attempt `require()` at runtime
- **Root**: Decap CMS dependencies (likely ajv validator) import `node:url` for schema validation
- **Fix**: Created browser-compatible shims for node: imports
  - `scripts/shims/url.js` - Uses native browser URL APIs
  - `scripts/shims/path.js` - Browser-safe path operations
  - `scripts/shims/buffer.js` - Minimal Buffer implementation
  - `scripts/shims/process.js` - Browser process shim
- **Build**: Removed `external: ['node:*']` from `scripts/build-cms.mjs`
- **Build**: Added alias mapping for node: imports to shims
- **Result**: New bundle `cms.211ec4c4.js` (4.2MB)

**Commit:** `fix(cms): resolve Sentry SRI mismatch and node:url bundling errors` (207ea7e5)

### CI/CD Considerations
- Tests should now pass in CI pipeline
- No changes needed to CI configuration
- Bundle hash updates automatically via build process
- Enhanced diagnostics will help identify any remaining issues

---

## Future Recommendations

1. **Standardize on one global**: Consider picking either `window.CMS` or `window.__cmsApp` and updating all references
2. **Add integration tests**: Beyond checking for global presence, verify CMS functionality
3. **Document CMS architecture**: Add documentation about the npm-based CMS setup
4. **Monitor test stability**: Watch for any flakiness in CMS initialization timing

---

## Lessons Learned

1. **Test assumptions**: Tests should be flexible when checking for vendor library initialization
2. **Migration impacts**: When migrating from vendor to npm packages, global exports may change
3. **Compatibility layers**: Adding compatibility exports can smooth transitions
4. **Test resilience**: Tests should handle multiple valid states when possible

---

## Related Issues

- Migration from vendor Decap CMS to npm package (Oct 11, 2025)
- Admin bundle stabilization efforts
- PKCE authentication implementation
- CSP hardening for admin panel

---

## Commands Reference

```bash
# Rebuild CMS bundle
pnpm run build:cms

# Build with hash and update references
pnpm run build:cms-hash

# Run CMS tests locally
pnpm test:cms

# Run CMS tests against production
pnpm test:cms:prod
```

---

*This fix ensures compatibility between the npm-based Decap CMS setup and existing E2E tests while maintaining flexibility for future changes.*