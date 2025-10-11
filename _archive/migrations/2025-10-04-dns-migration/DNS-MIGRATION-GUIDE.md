# DNS Migration Guide - liteckyeditingservices.com
**Date**: October 2, 2025
**Status**: In Progress
**Project**: litecky-editing-services (Cloudflare Pages)

## Current Status

### ✅ Pre-Migration Checklist
- [x] SendGrid DNS authentication configured
  - `s1._domainkey.liteckyeditingservices.com` → `s1.domainkey.u54920324.wl075.sendgrid.net`
  - `s2._domainkey.liteckyeditingservices.com` → `s2.domainkey.u54920324.wl075.sendgrid.net`
- [x] Domain on Cloudflare nameservers
  - `carol.ns.cloudflare.com`
  - `ignacio.ns.cloudflare.com`
- [x] Production deployment validated
  - Preview URL: https://b9ee6806.liteckyeditingservices.pages.dev
  - Status: Production ready (see POST-DEPLOYMENT-VALIDATION-2025-10-02.md)

### Current DNS Configuration

**Root Domain** (`liteckyeditingservices.com`):
```
Type: CNAME
Target: www.liteckyeditingservices.com
Proxy: Enabled (orange cloud)
Effect: Redirects to www, which serves Google Sites
```

**WWW Subdomain** (`www.liteckyeditingservices.com`):
```
Type: CNAME
Target: ghs.googlehosted.com
Proxy: Enabled (orange cloud)
Status: Serving Google Sites content
```

**SendGrid DNS** (Complete - No Changes Needed):
```
✅ s1._domainkey.liteckyeditingservices.com → s1.domainkey.u54920324.wl075.sendgrid.net
✅ s2._domainkey.liteckyeditingservices.com → s2.domainkey.u54920324.wl075.sendgrid.net
✅ em1041.liteckyeditingservices.com → u54920324.wl075.sendgrid.net
✅ SPF: v=spf1 include:_spf.google.com include:sendgrid.net ~all
✅ DMARC: v=DMARC1; p=none; rua=mailto:dmarc@liteckyeditingservices.com
```

## Migration Steps

### Step 1: Add Custom Domain to Cloudflare Pages

**Via Cloudflare Dashboard**:
1. Navigate to https://dash.cloudflare.com/
2. Select account → Pages
3. Click on `litecky-editing-services` project
4. Go to **Custom domains** tab
5. Click **Set up a custom domain**
6. Enter: `liteckyeditingservices.com`
7. Click **Continue**
8. Cloudflare will detect existing DNS and offer to update automatically
9. Click **Activate domain**

**Expected Outcome**:
- Cloudflare will update existing DNS records automatically
- SSL certificate will be provisioned (usually within minutes)

### Step 2: Add WWW Subdomain

Repeat Step 1 for `www.liteckyeditingservices.com`:
1. Click **Set up a custom domain** again
2. Enter: `www.liteckyeditingservices.com`
3. Click **Continue** → **Activate domain**

**What Happens Behind the Scenes**:
Pages will update these DNS records in Cloudflare:
```
OLD:
liteckyeditingservices.com       CNAME  www.liteckyeditingservices.com (proxied)
www.liteckyeditingservices.com   CNAME  ghs.googlehosted.com (proxied)

NEW:
liteckyeditingservices.com       CNAME  liteckyeditingservices.pages.dev (proxied)
www.liteckyeditingservices.com   CNAME  liteckyeditingservices.pages.dev (proxied)
```

**Note**: All existing SendGrid DNS records remain untouched.

### Step 3: Verify DNS Records

After adding domains via dashboard, verify the DNS records were updated:

```bash
# Check root domain
dig liteckyeditingservices.com A +short

# Check www subdomain
dig www.liteckyeditingservices.com CNAME +short

# Should see something like:
# www.liteckyeditingservices.com -> liteckyeditingservices.pages.dev
```

### Step 4: Wait for SSL Certificate Provisioning

Cloudflare Pages automatically provisions SSL certificates:
- Usually takes 1-5 minutes
- Can take up to 24 hours in rare cases
- Check status in Custom domains tab (will show "Active" with green checkmark)

### Step 5: Test Production Domain

```bash
# Test root domain
curl -I https://liteckyeditingservices.com

# Test www subdomain
curl -I https://www.liteckyeditingservices.com

# Should see:
# - HTTP/2 200 or 301/302 redirect
# - Server: cloudflare
# - No Google Sites headers
```

### Step 6: Verify Deployment Content

```bash
# Check homepage loads correctly
curl -s https://liteckyeditingservices.com | grep -i "litecky"

# Test contact API
curl -X POST https://liteckyeditingservices.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"DNS Test","email":"test@example.com","service":"proofreading","message":"Testing DNS migration"}'

# Expected: {"status":"enqueued"} with HTTP 202
```

### Step 7: Run Full E2E Tests Against Production Domain

```bash
# Update test configuration
export PAGES_BASE_URL=https://liteckyeditingservices.com

# Run full E2E suite
pnpm test:e2e

# Run accessibility tests
pnpm test:a11y
```

## Rollback Plan

If issues occur, revert DNS to Google Sites:

```bash
# Via Cloudflare Dashboard:
# 1. Go to DNS tab for liteckyeditingservices.com
# 2. Update A records back to original values
# 3. Or remove custom domain from Pages project

# Alternatively, use Cloudflare API:
# (Requires account ID and zone ID)
```

**Note**: DNS propagation can take 5-60 minutes for changes to take effect globally.

## Post-Migration Tasks

- [ ] Update any external links pointing to Google Sites
- [ ] Update GitHub OAuth callback URL if using custom domain for CMS
- [ ] Enable Cloudflare Analytics
- [ ] Set up uptime monitoring (e.g., UptimeRobot, Pingdom)
- [ ] Configure error alerting
- [ ] Update documentation with new production URL
- [ ] Test email delivery from production domain

## Verification Checklist

After migration completes:
- [ ] Root domain loads correctly (https://liteckyeditingservices.com)
- [ ] WWW subdomain loads correctly (https://www.liteckyeditingservices.com)
- [ ] SSL certificate valid (green padlock in browser)
- [ ] Contact form submits successfully
- [ ] Queue processing works (check worker logs)
- [ ] No JavaScript errors in browser console
- [ ] All pages accessible
- [ ] CMS login works (if using custom domain for OAuth)
- [ ] SendGrid emails deliver successfully

## Notes

- **SendGrid DNS**: Already configured, no changes needed
- **Cloudflare Proxy**: Pages custom domains are automatically proxied (orange cloud)
- **Cache**: May need to purge Cloudflare cache after migration
- **Preview URLs**: Will continue to work (b9ee6806.liteckyeditingservices.pages.dev)

## References

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Current deployment: https://b9ee6806.liteckyeditingservices.pages.dev
- Validation report: POST-DEPLOYMENT-VALIDATION-2025-10-02.md
- Project status: PROJECT-STATUS.md
