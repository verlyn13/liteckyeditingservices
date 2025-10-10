# OAuth Troubleshooting Status - October 10, 2025

## Current Situation

**Symptom**: OAuth flow completes successfully, popup shows "Authentication successful" and closes, but Decap CMS admin page doesn't transition to the editor.

**Latest Deploy**: Commit `9d5eb129` - Added CSP hash for debug postMessage listener

## What's Working

1. ✅ OAuth popup opens to `/api/auth`
2. ✅ Redirects to GitHub authorization
3. ✅ GitHub redirects back to `/api/callback` with authorization code
4. ✅ `/api/callback` exchanges code for access token
5. ✅ Popup displays "Authentication successful" message
6. ✅ Popup closes automatically after 3 seconds
7. ✅ No JavaScript errors in popup console

## What's Not Working

❌ **Decap CMS doesn't receive or process the postMessage to transition to editor**

## Implementation Details

### OAuth Flow Architecture

```
1. User clicks "Login with GitHub" on /admin/
   └─> Decap opens popup to /api/auth

2. /api/auth (Pages Function)
   ├─> Generates CSRF state (UUID)
   ├─> Sets cookies: decap_oauth_state, decap_opener_origin
   └─> Redirects to GitHub authorize

3. GitHub OAuth
   └─> User authorizes, redirects to /api/callback?code=...&state=...

4. /api/callback (Pages Function)
   ├─> Validates state from cookie
   ├─> Exchanges code for access_token
   └─> Returns HTML with inline postMessage script

5. Popup window (same window from step 1)
   ├─> Executes inline script
   ├─> Calls window.opener.postMessage() 3 times (0ms, 100ms, 200ms)
   └─> Auto-closes after 3 seconds

6. /admin/ (opener window) - SHOULD receive postMessage
   └─> Decap CMS SHOULD process message and load editor
```

### Message Format

Both formats sent for compatibility:

**String format** (Decap 3.x standard):
```
authorization:github:success:{"token":"gho_...","provider":"github","token_type":"bearer","state":"uuid"}
```

**Object format** (newer):
```javascript
{
  type: "authorization:github:success",
  data: {
    token: "gho_...",
    provider: "github",
    token_type: "bearer",
    state: "uuid"
  }
}
```

### Critical Configuration

**config.yml** (lines 1-6):
```yaml
backend:
  name: github
  repo: verlyn13/liteckyeditingservices
  branch: main
  base_url: https://www.liteckyeditingservices.com
  auth_endpoint: /api/auth
```

**Security Headers**:
- COOP: `unsafe-none` (preserves window.opener)
- CSP: Allows 'unsafe-eval' for Decap, hash-whitelisted debug listener

## Diagnostic Tools Deployed

### Debug Listener (public/admin/index.html:14-32)

Logs ALL postMessage events before Decap loads:

```javascript
window.addEventListener('message', function(event) {
  console.log('[ADMIN DEBUG] postMessage received:', {
    origin: event.origin,
    data: event.data,
    type: typeof event.data,
    timestamp: new Date().toISOString()
  });

  if (typeof event.data === 'string' && event.data.includes('authorization')) {
    console.log('[ADMIN DEBUG] ✅ OAuth message detected!');
  }
}, false);
```

### Auth Shim (public/admin/decap-auth-shim.js)

Optional retry logic (enable with `?auth_shim=1`):
- Re-emits messages if Decap misses them
- Checks if token stored after 500ms and retries

## Next Diagnostic Steps

### Step 1: Verify Debug Listener Captures Messages

After latest deploy completes:

1. Open `https://www.liteckyeditingservices.com/admin/` with DevTools console
2. Look for: `[ADMIN DEBUG] PostMessage listener registered`
3. Click "Login with GitHub"
4. Complete OAuth flow
5. Check console for `[ADMIN DEBUG] postMessage received` logs

**Expected Outcomes:**

**Scenario A**: Debug listener captures postMessage events
- ✅ Messages are being sent correctly
- ❌ Decap isn't processing them
- **Next**: Check message format, state validation, timing

**Scenario B**: Debug listener doesn't capture any postMessage
- ❌ Messages aren't reaching the admin page
- **Next**: Check window.opener, targetOrigin, popup timing

### Step 2: If Messages ARE Received

Check Decap CMS state:

```javascript
// In /admin/ console after OAuth attempt
console.log('CMS loaded:', !!window.CMS);
await window.CMS.getToken().then(Boolean); // Should be true if token stored
localStorage.getItem('netlify-cms-auth:state'); // Check stored auth
```

**Possible Issues:**
1. Message format doesn't match Decap 3.8.4 expectations
2. State parameter mismatch (Decap rejecting due to CSRF validation)
3. Timing - Decap not ready when message arrives

### Step 3: If Messages Are NOT Received

Check popup-opener relationship:

In popup console (must be quick, window closes fast):

```javascript
console.log('Has opener:', !!window.opener);
console.log('Opener closed:', window.opener?.closed);
console.log('Target origin:', /* see callback script */);
```

**Possible Issues:**
1. window.opener severed (COOP issue - but we set unsafe-none)
2. targetOrigin mismatch (strict origin check failing)
3. Popup closing before postMessage completes

## Potential Solutions

### If Timing Issue

Increase retry window in `/functions/api/callback.ts`:

```javascript
// Current: 0ms, 100ms, 200ms
// Proposed: 0ms, 100ms, 200ms, 500ms, 1000ms

send();
setTimeout(send, 100);
setTimeout(send, 200);
setTimeout(send, 500);  // ADD
setTimeout(send, 1000); // ADD
```

### If State Mismatch

Verify state is being passed correctly:

1. Check `/api/auth` sets state cookie correctly
2. Check `/api/callback` reads state correctly
3. Check message includes correct state parameter
4. Compare with Decap's expected state (check localStorage)

### If Message Format Issue

We send both formats from the callback for maximum compatibility. The canonical format is the string beginning with `authorization:github:success:`. No change needed in current code.

### If Window.opener Issue

This would be critical - COOP is set to unsafe-none, so this shouldn't happen.

## Test Workarounds

### Workaround 1: Enable Auth Shim

Visit: `https://www.liteckyeditingservices.com/admin/?auth_shim=1`

This enables additional retry logic and message re-emission.

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

### Workaround 3: External Worker OAuth (Legacy)

An external OAuth worker was previously used but is now decommissioned. Production uses on‑site Pages Functions at `/api/auth` and `/api/callback`.

## Files Modified This Session

1. `public/admin/index.html` - Added debug listener (no inline init)
2. `functions/admin/config.yml.ts` - Dynamic config (`base_url` + `auth_endpoint`)
3. `functions/api/auth.ts` - Echo Decap `state`/`origin`, set cookies
4. `functions/api/callback.ts` - HTML with postMessage; COOP + inline CSP; clears cookies
5. `functions/admin/[[path]].ts` - Admin CSP/COOP (single source of truth)
6. `docs/DECAP-SPEC-COMPLIANCE.md` - Implementation spec updated

## Related Documentation

- `docs/DECAP-SPEC-COMPLIANCE.md` - OAuth implementation spec
- `docs/troubleshooting/DECAP-OAUTH-DEBUG.md` - Comprehensive debugging guide
- `workers/decap-oauth/src/index.ts` - Alternative Worker implementation

## Resolution (October 10, 2025)

### Root Cause Identified

Debug listener confirmed postMessage events were arriving correctly, but Decap wasn't processing them.

**Issue**: Missing `base_url` in config.yml prevented Decap from entering "external-auth" mode.

Without `base_url`, Decap doesn't attach the postMessage listener that processes `authorization:github:success:` messages, even though the messages arrive.

### Fix Implemented

**Commit**: `49f48e5b` - fix(cms): implement dynamic config.yml with base_url for OAuth

Created `functions/admin/config.yml.ts` (Pages Function) that:
- Dynamically generates config.yml with `base_url` set to request origin
- Works in both dev (`http://127.0.0.1:8788`) and prod (`https://www.liteckyeditingservices.com`)
- Prevents environment-specific configuration drift

**Key insight**: The Decap docs for GitHub + external OAuth handler require **both** `base_url` AND `auth_endpoint`. This is not optional for external OAuth to work.

### References

- [Decap Backends Overview](https://decapcms.org/docs/backends-overview/) - Requires base_url for OAuth proxy
- [Cloud.gov Decap docs](https://docs.cloud.gov/pages/using-pages/getting-started-with-netlify-cms/) - Shows both fields required
- [vencax OAuth provider](https://github.com/vencax/netlify-cms-github-oauth-provider) - Standard implementation

### Action Items

- [x] Wait for commit `9d5eb129` to deploy
- [x] Test OAuth flow with console open
- [x] Check for debug listener postMessage logs - ✅ Messages arriving correctly
- [x] Identified root cause - missing base_url
- [x] Implement dynamic config.yml with base_url
- [ ] Test OAuth flow after deployment of commit `49f48e5b`
- [ ] Verify Decap transitions to editor successfully

---

**Last Updated**: 2025-10-10 (Post-fix)
**Status**: Fix deployed, awaiting production test
**Next Review**: After Cloudflare Pages deploys commit `49f48e5b`
