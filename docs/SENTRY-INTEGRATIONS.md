# Sentry Integrations Guide

Complete reference for Sentry integrations enabled in Litecky Editing Services.

## Overview

Sentry integrations extend the SDK's functionality to automatically instrument your application. This document covers all integrations configured in `src/lib/sentry.ts`.

---

## Enabled Integrations

### 1. Browser Tracing Integration ⭐

**Purpose:** Automatic performance monitoring for browser applications

**Enabled by default:** No (must be explicitly added)

**Configuration:**
```typescript
Sentry.browserTracingIntegration({
  enableInp: true,  // Track Interaction to Next Paint
})
```

**What it tracks:**
- Page loads and navigation
- XHR/Fetch requests
- User interactions (clicks, form submissions)
- Web Vitals (LCP, FID, CLS, INP)
- Route changes (SPA navigation)

**Automatic Spans Created:**
- `pageload` - Initial page load
- `navigation` - SPA route changes
- `http.client` - HTTP requests
- `ui.interaction` - User interactions

**Example in Sentry:**
```
Transaction: GET /services
  Span: pageload (2.3s)
    Child: http.client GET /api/config.yml (150ms)
    Child: resource.link (stylesheet, 80ms)
    Child: resource.script (bundle.js, 200ms)
  Span: ui.interaction (button click, 50ms)
```

**When to use:**
- Always enabled for production sites
- Essential for tracking user experience metrics
- Helps identify slow page loads and API calls

---

### 2. Replay Integration 📹

**Purpose:** Record user sessions for debugging

**Enabled by default:** No (must be explicitly added)

**Configuration:**
```typescript
Sentry.replayIntegration({
  maskAllText: true,      // Hide all text content
  blockAllMedia: true,    // Hide images and videos
})
```

**What it captures:**
- DOM mutations (adds/removes/updates)
- Mouse movements and clicks
- Scroll position
- Console logs and network requests
- Canvas elements (if `replayCanvasIntegration` added)

**Privacy Controls:**
- `maskAllText: true` - Replaces all text with asterisks
- `blockAllMedia: true` - Replaces images/videos with placeholders
- CSS class `sentry-unmask` - Exempts specific elements from masking
- CSS class `sentry-block` - Blocks specific elements entirely

**Sampling:**
```typescript
replaysSessionSampleRate: 0.1,    // 10% of normal sessions
replaysOnErrorSampleRate: 1.0,    // 100% of sessions with errors
```

**When to use:**
- Essential for debugging user-reported issues
- Understanding how users interact with your site
- Reproducing edge-case bugs

**Example unmasking:**
```html
<div class="sentry-unmask">
  This text will be visible in replays
</div>
```

---

### 3. Console Logging Integration 📝

**Purpose:** Automatically capture console logs as Sentry logs

**Enabled by default:** No (must be explicitly added)

**Configuration:**
```typescript
Sentry.consoleLoggingIntegration({
  levels: ['error', 'warn'],  // Only log errors and warnings
})
```

**Supported levels:**
- `'log'` - console.log()
- `'info'` - console.info()
- `'warn'` - console.warn()
- `'error'` - console.error()
- `'debug'` - console.debug()
- `'assert'` - console.assert()
- `'trace'` - console.trace()

**What it captures:**
```javascript
console.error('API call failed', { endpoint: '/api/contact', status: 500 });
// Captured as Sentry log with attributes:
// {
//   message: "API call failed",
//   attributes: {
//     "message.parameter.0": { endpoint: '/api/contact', status: 500 }
//   },
//   level: "error"
// }
```

**When to use:**
- Quick integration without changing existing console.log calls
- Legacy codebases with extensive console logging
- Development → Production transition

**⚠️ Caution:**
- Can generate high volume of logs if `'log'` and `'debug'` are enabled
- May capture sensitive data in console logs
- Prefer structured `Sentry.logger` for production

---

### 4. HTTP Client Integration 🌐

**Purpose:** Automatically instrument HTTP requests and capture failed requests

**Enabled by default:** No (must be explicitly added)

**Configuration:**
```typescript
Sentry.httpClientIntegration({
  failedRequestStatusCodes: [400, 599],  // Capture 4xx and 5xx errors
})
```

**What it captures:**
- Failed HTTP requests (based on status code)
- Request details (URL, method, headers)
- Response details (status, headers, body preview)

**Automatic Spans:**
```
Transaction: Button Click
  Span: http.client POST /api/contact (500ms)
    Attributes:
      - http.method: POST
      - http.url: https://example.com/api/contact
      - http.status_code: 200
      - http.response_content_length: 1234
```

**Failed Request Capture:**
```javascript
// This automatically creates a Sentry error event
const response = await fetch('/api/contact', {
  method: 'POST',
  body: JSON.stringify(formData)
});
// If response.status >= 400, Sentry captures it
```

**Custom Status Codes:**
```typescript
// Only capture 5xx errors (server errors)
httpClientIntegration({
  failedRequestStatusCodes: [500, 599],
})

// Capture specific codes
httpClientIntegration({
  failedRequestStatusCodes: [401, 403, 404, 500, 502, 503],
})
```

**When to use:**
- Always enabled for production sites
- Essential for tracking API reliability
- Helps identify client-side vs server-side errors

---

## Default Integrations (Auto-Enabled)

These integrations are enabled automatically and don't need to be added to the `integrations` array:

### 1. Global Handlers

**What it does:** Captures uncaught exceptions and unhandled promise rejections

```javascript
// Automatically captured
throw new Error('Uncaught error');

// Automatically captured
Promise.reject(new Error('Unhandled rejection'));
```

### 2. Browser API Errors

**What it does:** Wraps native APIs (`setTimeout`, `setInterval`, `requestAnimationFrame`, `addEventListener`)

```javascript
// Errors in these callbacks are automatically captured
setTimeout(() => {
  throw new Error('Error in timeout');
}, 1000);

button.addEventListener('click', () => {
  throw new Error('Error in event listener');
});
```

### 3. Breadcrumbs

**What it does:** Automatically records user actions as breadcrumbs

**Captured breadcrumbs:**
- Console messages
- HTTP requests
- Navigation events
- Click events
- Form submissions

**Example breadcrumb trail:**
```
1. [navigation] User visited /services
2. [http] GET /api/services → 200 OK
3. [ui.click] Clicked "Contact Us" button
4. [navigation] User visited /contact
5. [http] POST /api/contact → 500 Error
6. [error] Form submission failed
```

### 4. HTTP Context

**What it does:** Automatically attaches HTTP request information to errors

**Captured context:**
- URL
- User-Agent
- Referrer
- Headers

### 5. Linked Errors

**What it does:** Captures error chains (error.cause)

```javascript
const originalError = new Error('Database connection failed');
const wrappedError = new Error('Failed to save user', { cause: originalError });
// Both errors are captured and linked in Sentry
throw wrappedError;
```

### 6. Dedupe

**What it does:** Prevents duplicate error events from being sent

---

## Integration Comparison

| Integration | Errors | Tracing | Replay | Context | Auto-Enabled |
|-------------|--------|---------|--------|---------|--------------|
| `globalHandlersIntegration` | ✅ | ❌ | ❌ | ❌ | ✅ |
| `browserApiErrorsIntegration` | ✅ | ❌ | ❌ | ❌ | ✅ |
| `browserTracingIntegration` | ❌ | ✅ | ❌ | ✅ | ❌ |
| `replayIntegration` | ❌ | ❌ | ✅ | ✅ | ❌ |
| `consoleLoggingIntegration` | ✅ | ❌ | ❌ | ✅ | ❌ |
| `httpClientIntegration` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `breadcrumbsIntegration` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `dedupeIntegration` | ✅ | ❌ | ❌ | ❌ | ✅ |

---

## Advanced Integration Patterns

### Lazy Loading Integrations

For large bundles, you can lazy-load integrations:

```typescript
// Load replay only when needed
document.getElementById('enable-replay')?.addEventListener('click', async () => {
  const { replayIntegration } = await import('@sentry/browser');
  Sentry.addIntegration(replayIntegration());
});
```

**Lazy-loadable integrations:**
- `replayIntegration`
- `replayCanvasIntegration`
- `captureConsoleIntegration`
- `httpClientIntegration`
- `browserProfilingIntegration`

### Removing Default Integrations

```typescript
Sentry.init({
  // Remove breadcrumbs integration
  integrations: (integrations) => {
    return integrations.filter(integration => integration.name !== 'Breadcrumbs');
  },
});
```

### Modifying Default Integrations

```typescript
Sentry.init({
  integrations: [
    // Override default linked errors limit
    Sentry.linkedErrorsIntegration({
      limit: 7,  // Default is 5
    }),
  ],
});
```

---

## Integration-Specific Options

### Browser Tracing

```typescript
browserTracingIntegration({
  enableInp: true,                     // Track INP (Interaction to Next Paint)
  enableLongTask: true,                // Track long tasks
  enableLongAnimationFrame: true,      // Track long animation frames
  idleTimeout: 1000,                   // Idle time before finishing transaction
  finalTimeout: 30000,                 // Max transaction duration
  heartbeatInterval: 5000,             // Heartbeat interval for long transactions
})
```

### Replay

```typescript
replayIntegration({
  maskAllText: true,                   // Hide all text
  blockAllMedia: true,                 // Hide images/videos
  maskAllInputs: true,                 // Hide input values
  block: ['.sensitive-data'],          // Block specific selectors
  mask: ['.personal-info'],            // Mask specific selectors
  unmask: ['.public-content'],         // Unmask specific selectors
  networkDetailAllowUrls: [            // Capture request/response for specific URLs
    'https://api.example.com/public'
  ],
  networkCaptureBodies: true,          // Capture request/response bodies
})
```

### HTTP Client

```typescript
httpClientIntegration({
  failedRequestStatusCodes: [400, 599],  // Which status codes to capture
  failedRequestTargets: [                // Which URLs to monitor
    /api\.example\.com/,
    'https://cdn.example.com'
  ],
})
```

---

## Custom Integrations

You can create custom integrations for specialized instrumentation:

```typescript
import { defineIntegration } from '@sentry/browser';

const myCustomIntegration = defineIntegration(() => {
  return {
    name: 'MyCustomIntegration',
    setup(client) {
      // Initialize your integration
      console.log('Custom integration initialized');
    },
    processEvent(event, hint) {
      // Modify events before they're sent
      event.tags = { ...event.tags, custom: 'value' };
      return event;
    },
  };
});

Sentry.init({
  integrations: [myCustomIntegration()],
});
```

---

## Integration Best Practices

### 1. Start Conservative

```typescript
// Production start
{
  tracesSampleRate: 0.1,           // 10% of transactions
  replaysSessionSampleRate: 0.05,  // 5% of sessions
  enableLogs: false,               // Disable logs initially
  integrations: [
    browserTracingIntegration(),   // Essential
    replayIntegration(),            // Essential for debugging
    // Skip consoleLoggingIntegration initially
  ],
}
```

### 2. Monitor Quota Usage

- Check Sentry quota usage weekly
- Increase sampling if under quota
- Decrease if approaching limits
- Use `ignoreTransactions` for health checks

### 3. Privacy First

```typescript
// Always use privacy-preserving defaults
replayIntegration({
  maskAllText: true,      // ✅ Good
  blockAllMedia: true,    // ✅ Good
})

// Only unmask public, non-sensitive content
```

### 4. Filter Noise

```typescript
{
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',  // Browser quirk
    'Non-Error promise rejection',         // Not actionable
  ],
  ignoreTransactions: [
    '/health',           // Health checks
    '/ping',             // Monitoring endpoints
  ],
  beforeSend(event) {
    // Filter browser extension errors
    if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
      frame => frame.filename?.includes('chrome-extension://')
    )) {
      return null;
    }
    return event;
  },
}
```

---

## Integration Debugging

### Check Loaded Integrations

```javascript
// Browser console
const client = window.__sentry?.getClient();
const integrations = client?.getIntegrationByName?.();
console.log('Loaded integrations:', integrations);
```

### Verify Integration Behavior

```javascript
// Test browserTracingIntegration
window.__sentry?.startSpan({ op: 'test', name: 'Test Span' }, () => {
  console.log('Span created');
});

// Test replayIntegration
console.log('Replay active:', window.__sentry?.getReplay?.()?.isEnabled());

// Test httpClientIntegration
fetch('/api/test').catch(err => console.log('HTTP error captured:', err));
```

---

## Further Reading

- **Official Integration Docs:** https://docs.sentry.io/platforms/javascript/integrations/
- **Browser Tracing:** https://docs.sentry.io/platforms/javascript/tracing/instrumentation/automatic-instrumentation/
- **Session Replay:** https://docs.sentry.io/platforms/javascript/session-replay/
- **Custom Integrations:** https://docs.sentry.io/platforms/javascript/configuration/integrations/custom/

---

## Quick Reference

### Minimal Setup
```typescript
Sentry.init({
  dsn: '...',
  tracesSampleRate: 0.1,
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
});
```

### Recommended Production Setup
```typescript
Sentry.init({
  dsn: '...',
  environment: 'production',
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
  enableLogs: true,
  integrations: [
    Sentry.browserTracingIntegration({ enableInp: true }),
    Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
    Sentry.consoleLoggingIntegration({ levels: ['error', 'warn'] }),
    Sentry.httpClientIntegration({ failedRequestStatusCodes: [400, 599] }),
  ],
});
```

### Full-Featured Setup
```typescript
Sentry.init({
  dsn: '...',
  environment: 'production',
  release: 'v1.0.0',
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
  enableLogs: true,
  integrations: [
    Sentry.browserTracingIntegration({
      enableInp: true,
      enableLongTask: true,
    }),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
      networkDetailAllowUrls: ['https://api.example.com'],
    }),
    Sentry.consoleLoggingIntegration({ levels: ['error', 'warn'] }),
    Sentry.httpClientIntegration({
      failedRequestStatusCodes: [400, 599],
    }),
  ],
  beforeSend(event) {
    // Custom filtering
    return event;
  },
});
```
