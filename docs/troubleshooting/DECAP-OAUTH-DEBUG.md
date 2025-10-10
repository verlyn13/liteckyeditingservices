# Decap CMS OAuth Troubleshooting Guide

**Status**: OAuth flow completes but handoff to editor fails
**Last Updated**: 2025-10-10
**Current Issue**: Popup window closes, but admin page doesn't load editor

## Current OAuth Architecture

### Flow Overview
```
1. User clicks "Login with GitHub" on /admin/
2. Decap opens popup to /api/auth
3. /api/auth redirects to GitHub OAuth
4. GitHub redirects back to /api/callback with code
5. /api/callback exchanges code for token
6. /api/callback redirects to /admin/oauth-callback#token=xxx
7. /admin/oauth-callback parses token from hash
8. /admin/oauth-callback posts message to window.opener
9. /admin/ (opener) should receive message and load editor
```

### Implementation Files
- **Admin page**: `public/admin/index.html` (static HTML)
- **Config**: `public/admin/config.yml` (base_url + auth_endpoint)
- **Auth shim**: `public/admin/decap-auth-shim.js` (optional, disabled by default)
- **OAuth callback**: `public/admin/oauth-callback.html` (popup page)
- **Server auth start**: `functions/api/auth.ts`
- **Server callback**: `functions/api/callback.ts`
- **Admin security headers**: `functions/admin/[[path]].ts`

## Current Configuration

### config.yml
```yaml
backend:
  name: github
  repo: verlyn13/liteckyeditingservices
  branch: main
  base_url: https://www.liteckyeditingservices.com
  auth_endpoint: /api/auth
```

**Why base_url?** Prevents fallback to Netlify OAuth proxy (api.netlify.com)

### CSP Hash
- **File**: `functions/admin/[[path]].ts:39`
- **Hash**: `sha256-PDMtGDfBsO9ZxKnfZlAj0HwihdlIruXKZOzRElc1oSk=`
- **Purpose**: Allows inline script in `/admin/oauth-callback.html`

### Message Format
OAuth callback sends TWO formats for compatibility:

**String format** (Decap 3.x standard):
```javascript
'authorization:github:success:' + JSON.stringify({
  provider: 'github',
  token_type: 'bearer',
  token: 'gho_...',
  state: 'uuid'
})
```

**Object format** (newer):
```javascript
{
  type: 'authorization:github:success',
  data: {
    provider: 'github',
    token_type: 'bearer',
    token: 'gho_...',
    state: 'uuid'
  }
}
```

## Known Issues

### Issue #1: postMessage Not Received by Opener
**Symptom**: Popup closes, console shows messages sent, but admin page doesn't change

**Possible Causes**:
1. **Decap not listening**: CMS bundle hasn't registered postMessage listener yet
2. **Origin mismatch**: postMessage targetOrigin doesn't match actual origin
3. **State mismatch**: Decap rejects message due to invalid state
4. **Timing**: Message arrives before Decap is ready to receive it
5. **Window.opener severed**: COOP headers may break opener reference

**Current Mitigations**:
- Send message 3 times (0ms, 100ms, 200ms)
- COOP set to `unsafe-none` (preserves window.opener)
- Both string and object formats sent

### Issue #2: Auth Shim Disabled
**Status**: `decap-auth-shim.js` only activates with `?auth_shim=1`

**What it does**:
- Re-emits messages in case Decap misses first ones
- Retries if token not stored after 500ms

**To enable**: Visit `/admin/?auth_shim=1`

### Issue #3: Debug Script Missing
**File**: `public/admin/debug-oauth.js`
**Status**: Commented out in index.html (line 15)
**Reason**: MIME type error in production (404 returns HTML)

## Diagnostic Steps

### Step 1: Verify OAuth Callback Executes
Open browser DevTools console before logging in.

**Expected logs from oauth-callback.html**:
```
[OAuth Callback] Sending messages to opener
[OAuth Callback] String message: authorization:github:success:{"provider":"github",...
[OAuth Callback] Object message: {type: 'authorization:github:success', data: {...}}
[OAuth Callback] Messages posted to opener
```

**If missing**: Script failed to execute (CSP violation)

### Step 2: Check window.opener
In oauth-callback popup console:
```javascript
console.log('Has opener:', !!window.opener);
console.log('Opener closed:', window.opener?.closed);
```

**Expected**: `Has opener: true`, `Opener closed: false`
**If false**: Popup-opener relationship severed (COOP issue)

### Step 3: Monitor postMessage on Admin Page
In /admin/ console BEFORE logging in:
```javascript
window.addEventListener('message', (e) => {
  console.log('[ADMIN] Received message:', e.origin, e.data);
});
```

**Expected after OAuth**: See authorization:github:success messages
**If missing**: Messages not reaching admin page

### Step 4: Check Decap CMS State
After OAuth attempt, in /admin/ console:
```javascript
// Check if CMS loaded
console.log('CMS object:', window.CMS);

// Check if token stored
await window.CMS.getToken().then(Boolean);

// Check localStorage (Decap stores token here)
console.log('Stored auth:', localStorage.getItem('netlify-cms-auth:state'));
```

### Step 5: Verify Decap Event Listeners
In /admin/ console before login:
```javascript
// Check if Decap registered listeners
const listeners = getEventListeners(window);
console.log('Message listeners:', listeners.message);
```

## Testing Workarounds

### Workaround 1: Enable Auth Shim
Visit: `https://www.liteckyeditingservices.com/admin/?auth_shim=1`

This enables retry logic and message re-emission.

### Workaround 2: Manual Token Injection
If you have a valid GitHub token:
```javascript
// In /admin/ console
const token = 'gho_yourTokenHere';
const payload = 'authorization:github:success:' + JSON.stringify({
  provider: 'github',
  token_type: 'bearer',
  token: token
});
window.postMessage(payload, window.location.origin);
```

### Workaround 3: Force Decap Re-check
```javascript
// In /admin/ console after OAuth
window.location.reload();
```

## Next Investigation Steps

1. **Add debug listener** to admin page to log ALL postMessages
2. **Check Decap source** - when does it register postMessage listener?
3. **Test timing** - does delaying popup close help?
4. **Verify state** - is Decap rejecting due to state mismatch?
5. **Check Decap version** - are we using correct message format for 3.8.4?

## References
- Decap CMS GitHub backend: https://decapcms.org/docs/github-backend/
- External OAuth clients: https://decapcms.org/docs/external-oauth-clients/
- PostMessage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
