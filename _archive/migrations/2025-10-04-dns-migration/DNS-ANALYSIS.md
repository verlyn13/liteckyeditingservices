# DNS Analysis - liteckyeditingservices.com

**Date**: October 3, 2025
**Status**: Partial Migration Complete

---

## Current DNS Configuration (October 3, 2025 15:59:10)

### ✅ Root Domain - CORRECT

```
liteckyeditingservices.com    CNAME    liteckyeditingservices.pages.dev (proxied)
```

**Status**: ✅ **MIGRATED** - Points to Cloudflare Pages
**Behavior**: Redirects (301) to www.liteckyeditingservices.com
**Expected**: Root domain should serve Pages content directly OR redirect to www

---

### ❌ WWW Subdomain - INCORRECT (Still on Google Sites)

```
www.liteckyeditingservices.com    CNAME    ghs.googlehosted.com (proxied)
```

**Status**: ❌ **NOT MIGRATED** - Still points to Google Sites
**Current Title**: "Litecky Editing Services" (Google Sites version)
**Expected Title**: "Home | Litecky Editing Services" (Pages version)
**Evidence**: CSP headers show `frame-ancestors https://google-admin.corp.google.com/`

---

### ✅ SendGrid Email DNS - ALL CORRECT

```
DKIM Records:
✅ s1._domainkey.liteckyeditingservices.com → s1.domainkey.u54920324.wl075.sendgrid.net
✅ s2._domainkey.liteckyeditingservices.com → s2.domainkey.u54920324.wl075.sendgrid.net
✅ s1._domainkey.em.liteckyeditingservices.com → s1.domainkey.u54920324.wl075.sendgrid.net
✅ s2._domainkey.em.liteckyeditingservices.com → s2.domainkey.u54920324.wl075.sendgrid.net

Link Tracking:
✅ 54920324.em.liteckyeditingservices.com → sendgrid.net
✅ em1041.liteckyeditingservices.com → u54920324.wl075.sendgrid.net
✅ em2287.em.liteckyeditingservices.com → u54920324.wl075.sendgrid.net
✅ url1796.em.liteckyeditingservices.com → sendgrid.net

SPF/DMARC:
✅ TXT: v=spf1 include:_spf.google.com include:sendgrid.net ~all
✅ _dmarc.liteckyeditingservices.com: v=DMARC1; p=none; rua=mailto:dmarc@liteckyeditingservices.com

Google Workspace:
✅ MX Records: aspmx.l.google.com (priority 1), alt1/alt2 (priority 5), alt3/alt4 (priority 10)
✅ google._domainkey DKIM configured
```

**Status**: All email DNS records are correct. No changes needed.

---

## Verification Results

### Pages Deployment (liteckyeditingservices.pages.dev)

```bash
$ curl -sI https://liteckyeditingservices.pages.dev
HTTP/2 200
server: cloudflare
```

**Title**: "Home | Litecky Editing Services"
**Status**: ✅ **HEALTHY** - Serving correct Astro site

---

### Root Domain (liteckyeditingservices.com)

```bash
$ curl -sI https://liteckyeditingservices.com
HTTP/2 301
location: https://www.liteckyeditingservices.com/
```

**Status**: ✅ DNS updated, redirects to www (which still shows old site)

---

### WWW Subdomain (www.liteckyeditingservices.com)

```bash
$ curl -sI https://www.liteckyeditingservices.com
HTTP/2 200
content-security-policy: ... frame-ancestors https://google-admin.corp.google.com/
```

**Title**: "Litecky Editing Services" (Google Sites)
**Status**: ❌ **SERVING OLD SITE** - Still pointing to Google Sites

---

## Required Action

### Update WWW Subdomain DNS Record

**In Cloudflare Dashboard** → DNS → liteckyeditingservices.com:

1. Find the record:

   ```
   Type: CNAME
   Name: www
   Target: ghs.googlehosted.com
   Proxy: Proxied (orange cloud)
   ```

2. **Edit** the record to:

   ```
   Type: CNAME
   Name: www
   Target: liteckyeditingservices.pages.dev
   Proxy: Proxied (orange cloud) ← Keep this enabled
   ```

3. Click **Save**

---

## Expected Behavior After Update

### Root Domain (liteckyeditingservices.com)

- DNS: `CNAME → liteckyeditingservices.pages.dev` ✅ Already correct
- HTTP: Serves Pages content OR redirects to www (Pages decides)

### WWW Subdomain (www.liteckyeditingservices.com)

- DNS: `CNAME → liteckyeditingservices.pages.dev` ← Will update
- HTTP: Serves Pages content directly
- Title: "Home | Litecky Editing Services"

### Propagation Time

- **Cloudflare DNS update**: Instant (1-5 minutes)
- **Browser cache**: Clear browser cache or test in incognito
- **DNS cache**: May take up to TTL (currently 1 second, so very fast)

---

## Post-Migration Verification Commands

After updating the www CNAME record, run these commands:

```bash
# Check DNS propagation
dig www.liteckyeditingservices.com CNAME +short
# Expected: (empty - because Cloudflare proxies it)

dig www.liteckyeditingservices.com A +short
# Expected: Cloudflare proxy IPs (172.67.x.x, 104.21.x.x)

# Test HTTPS response
curl -sI https://www.liteckyeditingservices.com | grep -E "(HTTP|server|location)"
# Expected: HTTP/2 200, server: cloudflare

# Verify page title
curl -s https://www.liteckyeditingservices.com | grep -o '<title>[^<]*</title>'
# Expected: <title>Home | Litecky Editing Services</title>

# Check CSP headers (should NOT mention google-admin)
curl -sI https://www.liteckyeditingservices.com | grep -i "content-security"
# Expected: No Google Sites CSP headers

# Test root domain
curl -sI https://liteckyeditingservices.com | grep -E "(HTTP|location)"
# Expected: Either HTTP/2 200 OR 301 redirect to www (both acceptable)
```

---

## Summary

| Record                                 | Current Status           | Action Needed          |
| -------------------------------------- | ------------------------ | ---------------------- |
| Root (`liteckyeditingservices.com`)    | ✅ Migrated to Pages     | None - Already correct |
| WWW (`www.liteckyeditingservices.com`) | ❌ Still on Google Sites | Update CNAME to Pages  |
| SendGrid DNS (all records)             | ✅ Configured            | None - Keep as-is      |
| MX Records (Google Workspace)          | ✅ Configured            | None - Keep as-is      |

**Next Step**: Update the single WWW CNAME record in Cloudflare DNS dashboard.
