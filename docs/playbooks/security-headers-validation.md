# Security Headers Validation Playbook

## Pre-Deployment Checklist

- [ ] `_headers` file exists in `/public/` directory
- [ ] No syntax errors in `_headers` file
- [ ] Security tests pass locally: `pnpm test:e2e -g "Security Headers"`
- [ ] Build succeeds: `pnpm build`
- [ ] Preview build includes `_headers`: `ls -la dist/_headers`
- [ ] No CSP violations in local testing

## Post-Deployment Validation

### 1. Verify Headers Deployment (5 minutes)

```bash
# Check all security headers are present
curl -sI https://www.liteckyeditingservices.com | grep -i "strict-transport-security\|content-security-policy\|x-frame-options\|x-content-type-options\|permissions-policy"
```

**Expected**: All 5 headers should be present

### 2. SecurityHeaders.com Scan (2 minutes)

1. Visit: https://securityheaders.com/
2. Enter: `https://www.liteckyeditingservices.com`
3. Click "Scan"

**Success Criteria**: Grade **A** or better

**If Grade < A**:
- Review specific warnings
- Check if headers are being overridden by Cloudflare
- Verify `_headers` file deployed correctly

### 3. CSP Evaluation (3 minutes)

1. Copy CSP header value from curl output
2. Visit: https://csp-evaluator.withgoogle.com/
3. Paste and analyze

**Expected Issues** (acceptable for now):
- `'unsafe-inline'` in `script-src` - Marked for future improvement
- `'unsafe-inline'` in `style-src` - Svelte requires this temporarily

**Red Flags** (fix immediately):
- Missing `object-src 'none'`
- Missing `base-uri 'self'`
- Wildcard in `script-src` or `default-src`

### 4. Manual Browser Testing (10 minutes)

#### Navigate Key Pages
```
1. Homepage: https://www.liteckyeditingservices.com/
2. Services: https://www.liteckyeditingservices.com/services
3. Contact: https://www.liteckyeditingservices.com/contact
4. Admin: https://www.liteckyeditingservices.com/admin/
```

#### Check for CSP Violations

**In Chrome DevTools**:
1. Open DevTools (F12)
2. Go to Console tab
3. Filter for "Content Security Policy"
4. Navigate through pages above

**Success**: No CSP violation errors

**If Violations Found**:
1. Note the blocked resource (script/style/image/font)
2. Determine if it's legitimate (our code vs attack)
3. If legitimate, add to CSP whitelist
4. Redeploy and retest

#### Verify Functionality

- [ ] Homepage loads correctly
- [ ] Navigation works (menu, links)
- [ ] Images display
- [ ] Contact form renders (including Turnstile)
- [ ] File upload component works
- [ ] Admin panel loads (may need GitHub auth)
- [ ] No visual regressions

### 5. Turnstile Compatibility (5 minutes)

Cloudflare Turnstile is critical for contact form. Verify:

```bash
# Check Turnstile domain is allowed
curl -sI https://www.liteckyeditingservices.com | grep "content-security-policy" | grep "challenges.cloudflare.com"
```

**Manual Test**:
1. Go to: https://www.liteckyeditingservices.com/contact
2. Fill out form
3. Verify Turnstile widget appears
4. Complete captcha
5. Submit form

**Success**: Turnstile renders and validates without errors

### 6. Admin Panel CSP (3 minutes)

Decap CMS requires relaxed CSP:

```bash
# Verify admin has separate policy
curl -sI https://www.liteckyeditingservices.com/admin/ | grep "content-security-policy" | grep "unsafe-eval"
```

**Manual Test**:
1. Go to: https://www.liteckyeditingservices.com/admin/
2. Click "Login with GitHub"
3. Check DevTools Console for CSP errors

**Success**: 
- Admin panel loads
- GitHub OAuth initiates
- No CSP errors blocking functionality

### 7. HSTS Verification (2 minutes)

```bash
# Check HSTS header
curl -sI https://www.liteckyeditingservices.com | grep -i "strict-transport-security"
```

**Expected**: `max-age=31536000; includeSubDomains; preload`

**Browser Test**:
1. Clear browser cache
2. Visit: `http://www.liteckyeditingservices.com` (HTTP)
3. Should auto-redirect to HTTPS

### 8. Run Automated E2E Tests (5 minutes)

```bash
# From local machine, test production
pnpm test:e2e:prod -g "Security Headers"
```

**Success**: All tests pass

**If Tests Fail**:
- Check test expectations vs actual headers
- Verify production deployment completed
- Allow 5 minutes for Cloudflare cache propagation
- Purge cache if needed

## Rollback Plan

If security headers cause issues:

### Quick Fix (removes all custom headers)
```bash
# 1. Remove _headers file
git mv public/_headers public/_headers.disabled
git commit -m "fix: disable security headers temporarily"
git push

# 2. Redeploy via Cloudflare Pages dashboard
# 3. Verify site functions normally
```

### Surgical Fix (adjust specific headers)
```bash
# Edit public/_headers
# Comment out problematic directive
# Test locally
pnpm build && pnpm preview
# Commit and push
```

## Monitoring

### Weekly Check (5 minutes)
```bash
# Verify headers still present
curl -sI https://www.liteckyeditingservices.com | grep -c "content-security-policy"
# Expected: 1 or more
```

### After Each Deployment
- Run security headers E2E test
- Spot-check homepage in DevTools Console
- Verify no user reports of blocked content

## Common Issues

### Issue: Headers not appearing

**Cause**: `_headers` file not in build output

**Fix**:
```bash
pnpm build
ls -la dist/_headers  # Should exist
```

### Issue: CSP blocking images

**Symptom**: Images return 404 or don't load

**Fix**: Check `img-src` directive allows required domains:
```
img-src 'self' data: https:;
```

### Issue: CSP blocking fonts

**Symptom**: System fonts used instead of custom fonts

**Fix**: Verify `font-src` allows `data:` for base64 fonts:
```
font-src 'self' data:;
```

### Issue: Turnstile blocked

**Symptom**: Captcha widget doesn't render

**Fix**: Ensure Turnstile CDN is whitelisted:
```
script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com;
connect-src 'self' https://challenges.cloudflare.com;
frame-src https://challenges.cloudflare.com;
```

### Issue: Admin panel broken

**Symptom**: Decap CMS doesn't load or has console errors

**Fix**: For self-hosted Decap, verify `/admin/*` CSP (set by Pages Function) allows:
- `unsafe-eval` in `script-src` (AJV codegen)
- GitHub/Netlify Identity/OAuth Worker in `connect-src` as needed
- No third‑party script CDNs (should NOT include unpkg/jsdelivr)

## Success Criteria

After completing all validation steps:

- ✅ SecurityHeaders.com grade: **A** or better
- ✅ No CSP violations in normal navigation
- ✅ All E2E tests pass
- ✅ Contact form + Turnstile work
- ✅ Admin panel accessible
- ✅ HSTS forces HTTPS
- ✅ No visual or functional regressions

## Documentation

After successful deployment, update:
- [ ] `IMPLEMENTATION-ROADMAP.md` - Mark security headers complete
- [ ] `PROJECT-STATUS.md` - Update security section
- [ ] GitHub issue #17 & #18 - Close with test results
- [ ] This playbook - Note any deviations or lessons learned

---

**Playbook Version**: 1.0  
**Last Updated**: October 4, 2025  
**Owner**: Development Team
