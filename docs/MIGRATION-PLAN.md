# Migration Plan: Google Sites to Astro + Cloudflare Pages

## Current Setup (Google Sites)
- **Website**: Hosted on Google Sites (www → ghs.googlehosted.com)
- **Email**: Google Workspace (MX records pointing to Google)
- **Authentication**: Google DKIM for email authentication
- **SPF**: Includes Google email servers

## Target Setup (Astro + Cloudflare Pages)
- **Website**: Cloudflare Pages (www → liteckyeditingservices.pages.dev)
- **Email**:
  - Google Workspace for regular email (keep existing)
  - SendGrid for transactional emails (contact form, notifications)
- **Authentication**: Both Google and SendGrid DKIM
- **SPF**: Include both Google and SendGrid

## DNS Records to Add (SendGrid - Safe to add now)
These won't conflict with existing Google services:
1. `email.liteckyeditingservices.com` → `sendgrid.net` (link branding)
2. `54920324.liteckyeditingservices.com` → `sendgrid.net` (domain verification)
3. `em1041.liteckyeditingservices.com` → `u54920324.wl075.sendgrid.net` (tracking)
4. `s1._domainkey.liteckyeditingservices.com` → `s1.domainkey.u54920324.wl075.sendgrid.net` (DKIM)
5. `s2._domainkey.liteckyeditingservices.com` → `s2.domainkey.u54920324.wl075.sendgrid.net` (DKIM)
6. `_dmarc.liteckyeditingservices.com` → `v=DMARC1; p=none;` (DMARC policy)

## DNS Records to Update
1. **SPF Record**: Update to include both Google and SendGrid
   - Current: `v=spf1 include:_spf.google.com ~all`
   - New: `v=spf1 include:_spf.google.com include:sendgrid.net ~all`

## DNS Records to Change Later (When migrating website)
**DO NOT CHANGE YET** - These will break the current Google Sites:
1. `liteckyeditingservices.com` CNAME → Change from `www.liteckyeditingservices.com` to Pages
2. `www.liteckyeditingservices.com` CNAME → Change from `ghs.googlehosted.com` to Pages

## Migration Steps

### Phase 1: Add SendGrid (NOW - Safe)
1. ✅ Configure SendGrid API
2. ✅ Store credentials in gopass
3. ⏳ Add SendGrid DNS records (won't affect Google Sites)
4. ⏳ Update SPF to include SendGrid
5. ⏳ Add DMARC record
6. ⏳ Verify domain in SendGrid
7. ⏳ Set up sender identity

### Phase 2: Complete Development (In Progress)
1. Finish building Astro site
2. Test all functionality locally
3. Deploy to Cloudflare Pages (staging URL)
4. Test on staging environment

### Phase 3: Website Migration (LATER)
1. **Schedule migration window** (low traffic time)
2. **Backup current DNS configuration**
3. **Update DNS records**:
   - Change root domain CNAME
   - Change www CNAME to Cloudflare Pages
4. **Monitor**:
   - DNS propagation
   - Site availability
   - Email deliverability

## Important Notes

### Email Service Separation
- **Google Workspace**: Continue handling @liteckyeditingservices.com mailboxes
- **SendGrid**: Handle transactional emails (contact form, notifications)
- Both services can coexist without conflicts

### DNS Propagation
- SendGrid records: 5-15 minutes (new records)
- Website migration: 24-48 hours globally (changing existing records)

### Rollback Plan
If issues occur during website migration:
1. Revert DNS changes to point back to Google Sites
2. DNS will propagate back within hours
3. Google Workspace email unaffected throughout

## Current Safe Actions
✅ Add all SendGrid DNS records
✅ Update SPF record to include SendGrid
✅ Add DMARC record
✅ Verify SendGrid domain
❌ DO NOT change website CNAME records yet