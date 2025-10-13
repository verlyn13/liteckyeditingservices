# Sentry Integration - Quick Reference

This document provides a quick overview of the Sentry setup for Litecky Editing Services. For detailed guides, see the linked documentation.

## 📁 Documentation Structure

| File | Purpose |
|------|---------|
| **SENTRY-SETUP.md** | Complete setup guide with environment variables, configuration, and testing |
| **SENTRY-INTEGRATIONS.md** | Detailed integration reference with examples and best practices |
| **This file (SENTRY-README.md)** | Quick reference and getting started guide |

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
# This installs @sentry/browser and @sentry/astro
```

### 2. Configure Environment Variables

Create `.env` file:

```bash
PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
PUBLIC_SENTRY_ENVIRONMENT=development
PUBLIC_SENTRY_RELEASE=1.0.0
```

**Get your DSN:** https://sentry.io/settings/[org]/projects/[project]/keys/

### 3. Test the Integration

```bash
pnpm dev
# Visit http://localhost:4321/test-sentry
# Click buttons to test error tracking, performance, and logging
```

Admin (Decap) integration

- The admin panel uses a classic (non-ESM) initializer at `public/admin/sentry-admin.js` to avoid CSP/module constraints.
- The SDK is self-hosted as `public/admin/sentry.browser.bundle.js`; the initializer prefers self-hosted and only falls back to the CDN if the self-hosted bundle is missing.
- Provide DSN via `<meta name="sentry-dsn" content="…">` in `public/admin/index.html` or via `window.SENTRY_DSN` from an external script.
- Ensure `/admin/*` CSP allows `https://browser.sentry-cdn.com` (script-src) and `https://*.sentry.io` (connect-src). The Pages Function for `/admin/*` includes these hosts.

### 4. Verify in Sentry Dashboard

Go to https://sentry.io/ and check:
- **Issues** → See captured errors
- **Performance** → See transaction traces
- **Replays** → Watch session recordings
- **Logs** → View structured logs

---

## 📋 Implementation Checklist

- [x] Sentry packages installed (`@sentry/browser`, `@sentry/astro`)
- [x] Main site initialization (`src/lib/sentry.ts`)
- [x] Client-side init script (`src/scripts/sentry-init.ts`)
- [x] Admin/CMS instrumentation (`public/admin/sentry-admin.js`)
- [x] BaseLayout integration (`src/layouts/BaseLayout.astro`)
- [x] Test page created (`src/pages/test-sentry.astro`)
- [ ] Environment variables configured (`.env` and Cloudflare Pages)
- [ ] Sentry account and project created
- [ ] DSN added to environment variables
- [ ] Test errors verified in Sentry dashboard
- [ ] Production deployment with environment variables

---

## 🔧 Configuration Overview

### Main Site (`src/lib/sentry.ts`)

```typescript
{
  dsn: PUBLIC_SENTRY_DSN,
  environment: PUBLIC_SENTRY_ENVIRONMENT,
  tracesSampleRate: 0.1,              // 10% of transactions
  replaysSessionSampleRate: 0.1,      // 10% of sessions
  replaysOnErrorSampleRate: 1.0,      // 100% of error sessions
  enableLogs: true,                   // Structured logging
  integrations: [
    browserTracingIntegration(),      // Performance tracking
    replayIntegration(),               // Session replay
    consoleLoggingIntegration(),      // Console log capture
    // httpClientIntegration(),        // HTTP request tracking
  ],
}
```

Note: In `src/lib/sentry.ts`, `httpClientIntegration` is feature-detected and added only if present in the runtime bundle. Some CDN bundles or older versions might not expose it; the site guards against this to avoid runtime errors.

### Admin Area (`public/admin/sentry-admin.js`)

- Loads Sentry from CDN
- Tracks OAuth flow (login, callbacks)
- Monitors CMS state changes
- Captures admin-specific errors

---

## 💻 Usage Examples

### Capture Exceptions

```typescript
import { captureException } from '@/lib/sentry';

try {
  await riskyOperation();
} catch (error) {
  captureException(error, {
    context: 'contact_form',
    userId: user.id,
  });
}
```

### Track Performance

```typescript
import { startSpan } from '@/lib/sentry';

async function fetchData() {
  return startSpan(
    {
      op: 'http.client',
      name: 'GET /api/data',
    },
    async () => {
      const response = await fetch('/api/data');
      return response.json();
    }
  );
}
```

### Structured Logging

```typescript
import { logger } from '@/lib/sentry';

logger.info('User action', { action: 'form_submit', formType: 'contact' });
logger.warn('Rate limit approaching', { endpoint: '/api/contact', limit: 100 });
logger.error('Payment failed', { orderId: 'ABC123', amount: 99.99 });
```

### Set User Context

```typescript
import { setUser } from '@/lib/sentry';

// After login
setUser({
  id: user.id,
  email: user.email,
  username: user.username,
});

// After logout
setUser(null);
```

---

## 🧪 Testing

### Local Testing

1. **Start dev server:**
   ```bash
   pnpm dev
   ```

2. **Visit test page:**
   ```
   http://localhost:4321/test-sentry
   ```

3. **Test features:**
   - Click "Throw Error" → Should appear in Sentry Issues
   - Click "Create Custom Span" → Should appear in Sentry Performance
   - Click "Info Log" → Should appear in Sentry Logs

### Browser Console Testing

```javascript
// Test error capture
throw new Error('Test error');

// Test Sentry availability
console.log(window.__sentry ? 'Sentry loaded' : 'Sentry not loaded');

// Test exception capture
window.__sentry?.captureException(new Error('Test exception'));

// Test message capture
window.__sentry?.captureMessage('Test message', 'info');
```

---

## 🌐 Production Deployment

### Cloudflare Pages Environment Variables

Add these in **Cloudflare Dashboard → Pages → [Project] → Settings → Environment Variables**:

**Production:**
```
PUBLIC_SENTRY_DSN=https://xxx@o0.ingest.sentry.io/0
PUBLIC_SENTRY_ENVIRONMENT=production
PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
```

**Preview:**
```
PUBLIC_SENTRY_DSN=https://xxx@o0.ingest.sentry.io/0
PUBLIC_SENTRY_ENVIRONMENT=preview
PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
```

**Note:** `$CF_PAGES_COMMIT_SHA` is automatically available in Cloudflare Pages.

### Verify Production

1. Deploy to Cloudflare Pages
2. Visit production site
3. Open browser DevTools console
4. Run: `console.log(window.__sentry ? 'Loaded' : 'Not loaded')`
5. Trigger a test error (if `/test-sentry` is not available in production)
6. Check Sentry dashboard for captured event

---

## 📊 Quota Management

### Free Tier Limits
- **Events:** 5,000/month
- **Replays:** 50/month

### Optimize for Free Tier

```typescript
{
  tracesSampleRate: 0.05,              // 5% instead of 10%
  replaysSessionSampleRate: 0.01,      // 1% instead of 10%
  replaysOnErrorSampleRate: 1.0,       // Keep at 100%
  ignoreTransactions: ['/health', '/ping'],
  ignoreErrors: ['ResizeObserver loop limit exceeded'],
}
```

### Monitor Quota

- Check Sentry dashboard weekly
- Go to **Settings → Subscription → Usage**
- Adjust sampling rates if approaching limits

---

## 🛠️ Troubleshooting

### Sentry Not Loading

**Check:**
1. DSN is set: `console.log(import.meta.env.PUBLIC_SENTRY_DSN)`
2. Environment variables are prefixed with `PUBLIC_`
3. `.env` file exists in project root
4. Dev server was restarted after changing `.env`

**Solution:**
```bash
# Verify .env file
cat .env

# Restart dev server
pnpm dev
```

### Events Not Appearing

**Check:**
1. Sample rate: Set `tracesSampleRate: 1.0` for testing
2. Environment filter in Sentry dashboard
3. Project status (not disabled)
4. Network tab for requests to `ingest.sentry.io`

**Solution:**
```typescript
// In src/lib/sentry.ts, temporarily set:
{
  tracesSampleRate: 1.0,  // 100% for testing
  debug: true,            // Enable debug logs
}
```

### High Quota Usage

**Solution:**
1. Lower sample rates: `tracesSampleRate: 0.05` (5%)
2. Filter health checks:
   ```typescript
   ignoreTransactions: ['/health', '/ping', '/metrics']
   ```
3. Filter noisy errors:
   ```typescript
   ignoreErrors: ['ResizeObserver loop limit exceeded']
   ```

---

## 📚 File Reference

### Source Files

| File | Purpose |
|------|---------|
| `src/lib/sentry.ts` | Main Sentry configuration and helpers |
| `src/scripts/sentry-init.ts` | Client-side initialization |
| `src/layouts/BaseLayout.astro` | Sentry script loader |
| `public/admin/sentry-admin.js` | Admin/CMS instrumentation |
| `src/pages/test-sentry.astro` | Testing page (dev only) |

### Documentation Files

| File | Purpose |
|------|---------|
| `docs/SENTRY-SETUP.md` | Complete setup guide (14 sections) |
| `docs/SENTRY-INTEGRATIONS.md` | Integration reference |
| `docs/SENTRY-README.md` | This file (quick reference) |

---

## 🔗 External Resources

### Official Documentation
- **Configuration Options:** https://docs.sentry.io/platforms/javascript/configuration/options/
- **Error Tracking:** https://docs.sentry.io/platforms/javascript/usage/
- **Performance Monitoring:** https://docs.sentry.io/platforms/javascript/tracing/
- **Session Replay:** https://docs.sentry.io/platforms/javascript/session-replay/
- **Structured Logging:** https://docs.sentry.io/platforms/javascript/logs/

### Sentry Dashboard
- **Issues:** https://sentry.io/organizations/[org]/issues/
- **Performance:** https://sentry.io/organizations/[org]/performance/
- **Replays:** https://sentry.io/organizations/[org]/replays/
- **Logs:** https://sentry.io/organizations/[org]/logs/

### Support
- **Discord:** https://discord.gg/sentry
- **GitHub Issues:** https://github.com/getsentry/sentry-javascript/issues
- **Documentation:** https://docs.sentry.io/

---

## 📞 Need Help?

1. **Check documentation:** Start with `docs/SENTRY-SETUP.md`
2. **Test locally:** Use `http://localhost:4321/test-sentry`
3. **Enable debug mode:** Set `debug: true` in `src/lib/sentry.ts`
4. **Check browser console:** Look for Sentry initialization logs
5. **Check network tab:** Verify requests to `ingest.sentry.io`
6. **Consult official docs:** https://docs.sentry.io/

---

## ✅ Next Steps

After setting up Sentry:

1. [ ] Create Sentry account and project
2. [ ] Add DSN to environment variables
3. [ ] Test locally with `/test-sentry`
4. [ ] Verify events in Sentry dashboard
5. [ ] Deploy to production with env vars
6. [ ] Monitor quota usage weekly
7. [ ] Adjust sampling rates as needed
8. [ ] Set up alerts in Sentry dashboard
9. [ ] Review captured errors regularly
10. [ ] Use session replays to debug user issues

---

**Last Updated:** October 11, 2025
**Sentry SDK Version:** 8.48.0+
**Status:** ✅ Configured and ready for testing
