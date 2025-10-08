# Security Headers Configuration

## Overview

This document describes the security headers configured for Litecky Editing Services to protect against common web vulnerabilities.

## Implementation

- Global headers are configured in `public/_headers` and applied by Cloudflare Pages at deploy time.
- Admin routes (`/admin/*`) are served by a Pages Function at `functions/admin/[[path]].ts`, which sets a single authoritative `Content-Security-Policy` for Decap CMS. This replaces any CSP that might otherwise come from `_headers`, avoiding duplicate/merged policies.

## Headers Reference

### 1. Strict-Transport-Security (HSTS)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Purpose**: Forces browsers to only connect via HTTPS
**Configuration**:
- `max-age=31536000`: 1 year duration
- `includeSubDomains`: Applies to all subdomains
- `preload`: Eligible for browser preload lists

### 2. Content-Security-Policy (CSP)

**Purpose**: Prevents XSS attacks by restricting resource loading

**Main Site Policy**:
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https://challenges.cloudflare.com;
frame-src https://challenges.cloudflare.com;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

**Key Directives**:
- `default-src 'self'`: Only load resources from same origin by default
- `script-src`: Allow scripts from self and Turnstile CDN
- `unsafe-inline`: Temporarily allowed for Svelte reactive styles (see Future Improvements)
- `object-src 'none'`: Block plugins like Flash
- `frame-ancestors 'none'`: Prevent embedding in iframes (clickjacking protection)
- `upgrade-insecure-requests`: Auto-upgrade HTTP to HTTPS

**Admin Panel Policy** (`/admin/*` via Pages Function):
- Relaxed to allow Decap CMS requirements
- Permits `unsafe-eval` for CMS runtime
- Allows external resources from `cdn.jsdelivr.net` (primary), `unpkg.com` (optional mirror), GitHub APIs, Netlify Identity, and the OAuth Worker endpoint
- Served and enforced by `functions/admin/[[path]].ts` to ensure a single CSP source of truth

### 3. X-Frame-Options

```
X-Frame-Options: SAMEORIGIN
```

**Purpose**: Legacy protection against clickjacking
**Note**: Matches `frame-ancestors 'self'` in CSP to permit same-origin previews while blocking cross-origin framing

### 4. X-Content-Type-Options

```
X-Content-Type-Options: nosniff
```

**Purpose**: Prevents MIME-type sniffing attacks

### 5. Referrer-Policy

```
Referrer-Policy: strict-origin-when-cross-origin
```

**Purpose**: Controls referrer information sent with requests
**Behavior**:
- Same-origin: Full URL
- Cross-origin HTTPS: Origin only
- Cross-origin HTTP: No referrer

### 6. Permissions-Policy

```
Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
```

**Purpose**: Disables unnecessary browser features to reduce attack surface

### 7. Additional Headers

```
X-Download-Options: noopen
X-Permitted-Cross-Domain-Policies: none
```

**Purpose**: Additional protections for IE and Flash (legacy browsers)

## Testing

### Automated Tests

Run security header tests:
```bash
pnpm test:e2e -g "Security Headers"
```

### Manual Testing

1. **SecurityHeaders.com Scan**:
   ```bash
   open https://securityheaders.com/?q=https://www.liteckyeditingservices.com
   ```
   Target grade: **A** or better

2. **CSP Evaluator**:
   ```bash
   open https://csp-evaluator.withgoogle.com/
   ```
   Paste the CSP policy for analysis

3. **Browser DevTools**:
   - Open DevTools → Network tab
   - Check response headers for homepage
   - Monitor Console for CSP violations

## CSP Violation Monitoring

CSP violations are logged to the browser console during development. In production, consider adding a `report-uri` or `report-to` directive to collect violations.

### Example Report Configuration

```
Content-Security-Policy: ... ; report-uri /api/csp-report
```

## Future Improvements

### 1. Replace `unsafe-inline` with Nonces

**Current Issue**: Svelte reactive styles require `unsafe-inline`

**Solution**:
1. Generate nonce per request in middleware
2. Pass nonce to Svelte components
3. Update CSP: `style-src 'self' 'nonce-${nonce}'`
4. Remove `unsafe-inline`

### 2. Subresource Integrity (SRI)

For external scripts (if added in future):
```html
<script 
  src="https://cdn.example.com/lib.js" 
  integrity="sha384-..."
  crossorigin="anonymous"
></script>
```

### 3. CSP Reporting Endpoint

Implement `/api/csp-report` to collect violations:
- Store in D1 database
- Alert on threshold breaches
- Dashboard for monitoring

### 4. HSTS Preload Submission

After verifying HSTS works correctly for 3+ months:
1. Visit https://hstspreload.org/
2. Submit domain for inclusion in browser preload lists
3. Verify all subdomains are HTTPS-ready

## Troubleshooting

### CSP Violations

**Symptom**: Content blocked, console errors

**Debug Steps**:
1. Check DevTools Console for specific violation
2. Identify blocked resource (script, style, image, etc.)
3. Update CSP directive to allow legitimate resource
4. Test in dev environment first
5. Deploy and verify

### Headers Not Applied

**Symptom**: securityheaders.com shows missing headers

**Possible Causes**:
1. `_headers` file not in `/public/`
2. Syntax error in `_headers` file
3. Cloudflare Pages cache (wait 5 min or purge)
4. Testing wrong domain (naked vs www)

**Resolution**:
```bash
# Rebuild and redeploy
pnpm build
# Deploy via Cloudflare Pages dashboard or Wrangler
```

## References

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Cloudflare Pages Headers](https://developers.cloudflare.com/pages/configuration/headers/)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [Security Headers Scanner](https://securityheaders.com/)

## Related Files

- `/public/_headers` - Header definitions
- `/tests/e2e/security-headers.spec.ts` - Automated tests
- `ENVIRONMENT.md` - Environment variable security
- `SECRETS.md` - Secret management

---

**Last Updated**: October 4, 2025  
**Maintained By**: Development Team  
**Review Frequency**: Quarterly or after security incidents
