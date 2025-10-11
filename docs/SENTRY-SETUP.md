# Sentry Setup Guide

Complete guide to configuring Sentry error tracking, performance monitoring, and logging for Litecky Editing Services.

## Overview

This project uses **Sentry** for:
- **Error Tracking**: Capture exceptions and errors across frontend and admin
- **Performance Monitoring**: Track page load times, API calls, and user interactions
- **Session Replay**: Record user sessions to debug issues
- **Structured Logging**: Centralized logging with context and severity levels

---

## 1. Environment Variables

### Required Variables

Add these to your `.env` file (local) and Cloudflare Pages dashboard (production):

```bash
# Sentry DSN (Data Source Name)
# Get this from: https://sentry.io/settings/[org]/projects/[project]/keys/
PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0

# Environment name (production, staging, development)
PUBLIC_SENTRY_ENVIRONMENT=production

# Release version (git commit SHA or version tag)
PUBLIC_SENTRY_RELEASE=1.0.0
```

### Variable Details

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `PUBLIC_SENTRY_DSN` | string | **Yes** | Tells SDK where to send events. Without this, no data is sent. |
| `PUBLIC_SENTRY_ENVIRONMENT` | string | No | Environment identifier. Defaults to `production` |
| `PUBLIC_SENTRY_RELEASE` | string | No | Version/commit identifier for tracking regressions |

**Note:** All variables prefixed with `PUBLIC_` are exposed to the client-side code.

---

## 2. Getting Your Sentry DSN

1. **Create a Sentry Account**: https://sentry.io/signup/
2. **Create a Project**:
   - Go to Settings → Projects → Create Project
   - Platform: **Browser JavaScript**
   - Project name: `litecky-editing-services`
3. **Get Your DSN**:
   - Navigate to Settings → Projects → [Your Project] → Client Keys (DSN)
   - Copy the "DSN" value (starts with `https://`)

---

## 3. Configuration Options

### Current Configuration

See `src/lib/sentry.ts` for the complete configuration. Key settings:

```typescript
{
  dsn: PUBLIC_SENTRY_DSN,
  environment: PUBLIC_SENTRY_ENVIRONMENT || "production",
  release: PUBLIC_SENTRY_RELEASE,

  // Sample 10% of transactions (reduce for high-traffic sites)
  tracesSampleRate: 0.1,

  // Session Replay: 10% of normal sessions, 100% with errors
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Enable structured logging
  enableLogs: true,

  // Integrations
  integrations: [
    browserTracingIntegration(),    // Automatic performance tracking
    replayIntegration(),             // Session replay
    consoleLoggingIntegration(),    // Console log capture
    httpClientIntegration(),         // HTTP request tracking
  ],
}
```

### Sampling Rates Explained

| Option | Default | Recommendation | Impact |
|--------|---------|----------------|--------|
| `tracesSampleRate` | 0.1 (10%) | 0.1-0.2 for production | Performance overhead |
| `replaysSessionSampleRate` | 0.1 (10%) | 0.05-0.1 for production | Storage cost |
| `replaysOnErrorSampleRate` | 1.0 (100%) | Keep at 1.0 | Critical for debugging |

**Cost vs Value:**
- Lower sampling = lower Sentry quota usage
- Higher sampling = more complete data
- Always keep error replay at 100% for debugging

---

## 4. Integration Points

### Main Site (`src/layouts/BaseLayout.astro`)

Sentry initializes early in the page lifecycle:

```astro
<script type="module" src={sentryInitUrl}></script>
```

This loads `src/scripts/sentry-init.ts`, which calls `initSentry()`.

### Admin/CMS (`public/admin/index.html`)

Sentry loads via CDN for the admin area:

```html
<script src="/admin/sentry-admin.js"></script>
```

This provides:
- OAuth flow tracking
- Login attempt monitoring
- CMS state change tracking
- User authentication tracking

---

## 5. Usage Examples

### Capturing Exceptions

```typescript
import { captureException } from '@/lib/sentry';

try {
  await riskyOperation();
} catch (error) {
  captureException(error, {
    operation: 'riskyOperation',
    userId: currentUser.id,
  });
}
```

### Creating Custom Spans (Performance Tracking)

```typescript
import { startSpan } from '@/lib/sentry';

async function fetchUserData(userId: string) {
  return startSpan(
    {
      op: 'http.client',
      name: `GET /api/users/${userId}`,
      attributes: { userId },
    },
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      return response.json();
    }
  );
}
```

### UI Interaction Tracking

```typescript
import { startSpan, logger } from '@/lib/sentry';

function handleSubmit() {
  startSpan(
    {
      op: 'ui.click',
      name: 'Contact Form Submit',
    },
    () => {
      logger.info('Contact form submitted', {
        formType: 'contact',
        fields: ['name', 'email', 'message'],
      });

      // Form submission logic
    }
  );
}
```

### Structured Logging

```typescript
import { logger } from '@/lib/sentry';

// Different severity levels
logger.trace('Database connection pooling', { pool: 'main', size: 10 });
logger.debug(logger.fmt`Cache miss for user: ${userId}`);
logger.info('Profile updated', { profileId: 123 });
logger.warn('Rate limit approaching', { endpoint: '/api/contact', limit: 100 });
logger.error('Payment processing failed', { orderId: 'ABC123', amount: 99.99 });
logger.fatal('Database connection lost', { reconnectAttempts: 5 });
```

**Template Literals with `logger.fmt`:**
```typescript
// ✅ Good: Uses logger.fmt for variable interpolation
logger.debug(logger.fmt`User ${userId} logged in from ${ipAddress}`);

// ❌ Avoid: String concatenation loses structure
logger.debug(`User ${userId} logged in from ${ipAddress}`);
```

### Setting User Context

```typescript
import { setUser } from '@/lib/sentry';

// After successful login
setUser({
  id: user.id,
  email: user.email,
  username: user.username,
});

// After logout
setUser(null);
```

### Adding Breadcrumbs

```typescript
import { addBreadcrumb } from '@/lib/sentry';

addBreadcrumb({
  message: 'User navigated to pricing page',
  level: 'info',
  category: 'navigation',
  data: {
    from: '/services',
    to: '/pricing',
  },
});
```

---

## 6. Testing Sentry Integration

### Manual Testing (Browser Console)

```javascript
// Test error capture
throw new Error('Sentry test error');

// Test exception capture
window.__sentry?.captureException(new Error('Test exception'));

// Test message capture
window.__sentry?.captureMessage('Test message', 'info');

// Check if Sentry is loaded
console.log(window.__sentry ? 'Sentry loaded' : 'Sentry not loaded');
```

### Automated Test Script

Run the test endpoint:

```bash
# Visit in browser
http://localhost:4321/test-sentry

# Or via curl
curl http://localhost:4321/test-sentry
```

This will send a test error to Sentry and confirm the integration works.

### Verify in Sentry Dashboard

1. Go to https://sentry.io/organizations/[org]/issues/
2. Look for "Sentry test error" or your test message
3. Verify environment, release, and user context are correct
4. Check breadcrumbs and stack trace are populated

---

## 7. Filtering Sensitive Data

### Before Send Hook (Automatic)

The `beforeSend` hook in `src/lib/sentry.ts` automatically filters:
- Browser extension errors (chrome-extension://, moz-extension://)
- Network errors in development
- Cross-origin errors

### Manual PII Stripping

If you need to strip additional data:

```typescript
Sentry.init({
  beforeSend(event, hint) {
    // Remove sensitive data from event
    if (event.request?.headers) {
      delete event.request.headers['Authorization'];
      delete event.request.headers['Cookie'];
    }

    // Redact sensitive fields
    if (event.extra?.userData) {
      event.extra.userData = '[REDACTED]';
    }

    return event;
  },
});
```

### Session Replay Privacy

Session Replay is configured with privacy by default:

```typescript
replayIntegration({
  maskAllText: true,      // Masks all text content
  blockAllMedia: true,    // Blocks all images/video
})
```

To allow specific elements:
```html
<div class="sentry-unmask">This text will be visible in replays</div>
```

---

## 8. Performance Best Practices

### Optimize Sample Rates

For high-traffic production sites:

```typescript
{
  tracesSampleRate: 0.05,              // 5% of transactions
  replaysSessionSampleRate: 0.01,      // 1% of sessions
  replaysOnErrorSampleRate: 1.0,       // Keep at 100%
}
```

### Filter Noisy Transactions

```typescript
{
  ignoreTransactions: [
    '/health',
    '/ping',
    '/metrics',
    /^\/api\/health.*/,
  ],
}
```

### Filter Noisy Errors

```typescript
{
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    /^ChunkLoadError/,
  ],
}
```

---

## 9. Admin-Specific Instrumentation

The admin area (`/admin`) has additional instrumentation:

### OAuth Flow Tracking

Automatically tracks:
- Login button clicks
- OAuth callback messages (success/failure)
- User authentication state changes
- localStorage writes (user persistence)

### CMS State Monitoring

Monitors Redux store for:
- User login/logout
- Authentication state changes
- CMS errors

### Debugging Admin Issues

```javascript
// In /admin console
window.__sentryAdmin         // Access Sentry instance
window.__adminLog            // View structured logs
copy(window.__adminLog)      // Copy logs to clipboard
```

---

## 10. Troubleshooting

### Sentry Not Initializing

**Symptom:** No errors appear in Sentry dashboard

**Check:**
1. DSN is set: `console.log(import.meta.env.PUBLIC_SENTRY_DSN)`
2. Sentry loaded: `console.log(window.__sentry)`
3. Browser console for errors: Look for Sentry SDK errors
4. Network tab: Check for requests to `o0.ingest.sentry.io`

**Solution:**
- Verify DSN is correct (copy from Sentry dashboard)
- Ensure `.env` file exists and variables are prefixed with `PUBLIC_`
- Restart dev server after changing `.env`

### Events Not Appearing

**Symptom:** Sentry initializes but no events are captured

**Check:**
1. Sample rate: `tracesSampleRate: 1.0` for testing
2. Environment filter in Sentry dashboard
3. `beforeSend` hook isn't filtering events
4. Check project status in Sentry (not disabled)

### High Quota Usage

**Symptom:** Sentry quota exhausted quickly

**Solution:**
1. Lower sample rates: `tracesSampleRate: 0.05` (5%)
2. Filter health checks: Add to `ignoreTransactions`
3. Filter browser extensions: Already filtered in `beforeSend`
4. Consider upgrading Sentry plan or using multiple projects

### Session Replay Not Working

**Symptom:** No replays in Sentry dashboard

**Check:**
1. Replay integration enabled: Check `integrations` array
2. Sample rate not zero: `replaysSessionSampleRate > 0`
3. Browser compatibility: Replay requires modern browsers
4. Storage quota: Check Sentry project settings

---

## 11. CI/CD Integration

### Build-Time Release Tracking

Add to your build script:

```bash
# package.json
"build": "export PUBLIC_SENTRY_RELEASE=$(git rev-parse --short HEAD) && pnpm cms:vendor && astro build"
```

### Cloudflare Pages Environment

Add variables in:
**Cloudflare Dashboard → Pages → [Project] → Settings → Environment Variables**

```
Production:
  PUBLIC_SENTRY_DSN=https://...
  PUBLIC_SENTRY_ENVIRONMENT=production
  PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA

Preview:
  PUBLIC_SENTRY_DSN=https://...
  PUBLIC_SENTRY_ENVIRONMENT=preview
  PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
```

**Note:** `$CF_PAGES_COMMIT_SHA` is automatically available in Cloudflare Pages builds.

---

## 12. Cost Estimation

### Free Tier (Hobby)
- **Events:** 5,000/month
- **Replays:** 50/month
- **Best for:** Small sites, development

### Team Tier ($26/month)
- **Events:** 50,000/month
- **Replays:** 500/month
- **Best for:** Production sites with moderate traffic

### Quota Management

With conservative sampling:
```
Daily visitors: 1,000
tracesSampleRate: 0.1 (10%)
replaysSessionSampleRate: 0.05 (5%)
replaysOnErrorSampleRate: 1.0 (100%)

Estimated monthly usage:
- Transactions: ~3,000
- Session Replays: ~150
- Error Replays: ~50 (assuming 5% error rate)

Total: ~3,200 events + ~200 replays
Fits in: Free tier ✅
```

---

## 13. Additional Resources

### Official Documentation
- **Configuration Options:** https://docs.sentry.io/platforms/javascript/configuration/options/
- **Performance Monitoring:** https://docs.sentry.io/platforms/javascript/tracing/
- **Session Replay:** https://docs.sentry.io/platforms/javascript/session-replay/
- **Structured Logging:** https://docs.sentry.io/platforms/javascript/logs/

### Sentry Best Practices
- **Filtering PII:** https://docs.sentry.io/platforms/javascript/data-management/sensitive-data/
- **Source Maps:** https://docs.sentry.io/platforms/javascript/sourcemaps/
- **Releases:** https://docs.sentry.io/product/releases/

### Project-Specific Files
- Main config: `src/lib/sentry.ts`
- Client init: `src/scripts/sentry-init.ts`
- Admin init: `public/admin/sentry-admin.js`
- Base layout: `src/layouts/BaseLayout.astro`

---

## 14. Quick Start Checklist

- [ ] Create Sentry account and project
- [ ] Copy DSN from Sentry dashboard
- [ ] Add `PUBLIC_SENTRY_DSN` to `.env`
- [ ] Add `PUBLIC_SENTRY_ENVIRONMENT=development` to `.env`
- [ ] Run `pnpm install` to install Sentry packages
- [ ] Run `pnpm dev` and test error capture
- [ ] Visit `/test-sentry` to verify integration
- [ ] Check Sentry dashboard for test error
- [ ] Deploy to production with environment variables
- [ ] Verify production errors are captured
- [ ] Adjust sampling rates based on traffic
- [ ] Set up alerts in Sentry dashboard

---

**Need Help?** Check the [Sentry Discord](https://discord.gg/sentry) or [GitHub Issues](https://github.com/getsentry/sentry-javascript/issues).
