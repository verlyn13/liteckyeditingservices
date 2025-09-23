# Cloudflare Management Guide

## 🚀 Quick Start

### Essential Commands

```bash
# Run full domain audit
./scripts/cloudflare-audit.fish

# List all DNS records
./scripts/cf-dns-manage.fish list

# Backup DNS configuration
./scripts/cf-dns-manage.fish backup

# Check deployment status
./scripts/cf-pages-deploy.fish status
```

## 🔧 Available Management Scripts

### 1. `cloudflare-audit.fish`
Comprehensive domain audit that checks:
- Zone configuration
- DNS records (full access ✅)
- SSL/TLS settings
- Page rules
- Cloudflare Pages projects
- Firewall rules (full access ✅)
- Workers configuration (full access ✅)
- DNS propagation
- Website availability

### 2. `cf-dns-manage.fish`
DNS record management with safety features:
- **list** - Display all DNS records with IDs
- **backup** - Create timestamped JSON backup
- **add** - Add new DNS records
- **delete** - Remove records (with confirmation)
- **prepare-pages** - Prepare for Pages deployment

### 3. `cf-pages-deploy.fish`
Cloudflare Pages deployment helper:
- **status** - Show current deployment status
- **prepare** - Build and prepare for deployment
- **config** - Create wrangler.toml
- **deploy** - Deploy to Cloudflare Pages
- **dns** - Show DNS update commands

### 4. `cf.fish`
Quick wrapper for flarectl commands with automatic token loading.

## 🔐 API Token Capabilities

### ✅ Full Access (Working)
- Zone Read/Edit
- DNS Read/Edit
- SSL/TLS Read/Edit
- Firewall Rules Read/Edit
- Workers Routes Read/Edit
- Cloudflare Pages Read/Edit

### ❌ Limited Access
- Page Rules (requires zone-specific token)
- Some user-level operations

## 📝 Current Domain Configuration

### DNS Records Summary
- **Root Domain**: CNAME to www (proxied)
- **WWW**: CNAME to ghs.googlehosted.com (Google Sites)
- **Email**: 5 MX records for Google Workspace
- **Authentication**: SPF and DKIM for Google

### Important IDs
- **Zone ID**: `a5e7c69768502d649a8f2c615f555eca`
- **Account ID**: Available via API
- **Name Servers**: carol.ns.cloudflare.com, ignacio.ns.cloudflare.com

## 🚀 Deployment Workflow

### Phase 1: Prepare
```bash
# 1. Backup current configuration
./scripts/cf-dns-manage.fish backup

# 2. Build Astro site
pnpm build

# 3. Install Wrangler
pnpm add -D wrangler
```

### Phase 2: Deploy to Pages
```bash
# 1. Create wrangler config
./scripts/cf-pages-deploy.fish config

# 2. Deploy to Pages
pnpm wrangler pages deploy dist/ --project-name=litecky-editing-services

# 3. Note the .pages.dev URL
```

### Phase 3: Update DNS
```bash
# 1. List current records to get IDs
./scripts/cf-dns-manage.fish list

# 2. Delete old www record
./scripts/cf-dns-manage.fish delete a8b747e6dffdb95e0bea543316e6d3cf

# 3. Add new www pointing to Pages
./scripts/cf-dns-manage.fish add CNAME www litecky-editing-services.pages.dev

# 4. Test before updating apex domain
```

## 🔄 Rollback Procedure

If something goes wrong:

1. **Restore from backup**:
   ```bash
   # Find your backup file
   ls dns-backup-*.json
   
   # Restore (manual process for safety)
   # Review the backup file and restore records as needed
   ```

2. **Quick revert to Google Sites**:
   ```bash
   # Delete Pages CNAME
   ./scripts/cf-dns-manage.fish delete [record-id]
   
   # Restore Google Sites CNAME
   ./scripts/cf-dns-manage.fish add CNAME www ghs.googlehosted.com
   ```

## 📧 Email Configuration

### Current Setup (Google Workspace)
- MX records pointing to Google servers
- SPF: `v=spf1 include:_spf.google.com ~all`
- DKIM: Google domain key configured

### Adding SendGrid (Future)
When ready to add transactional email:
```bash
# Update SPF to include SendGrid
./scripts/cf-dns-manage.fish add TXT @ "v=spf1 include:_spf.google.com include:sendgrid.net ~all"
```

## 🔒 Security Considerations

1. **API Token Storage**: Secured in gopass
2. **DNS Backups**: Created before any changes
3. **Confirmation Prompts**: Required for deletions
4. **SSL/TLS**: Set to "Full" encryption
5. **Proxy Status**: Enabled for web traffic

## 📊 Monitoring

### Check DNS Propagation
```bash
# Check A records
dig liteckyeditingservices.com +short

# Check specific record type
dig CNAME www.liteckyeditingservices.com +short

# Check from Cloudflare's perspective
./scripts/cloudflare-audit.fish | grep "DNS Propagation" -A 10
```

### Website Status
```bash
# Check HTTP status
curl -I https://liteckyeditingservices.com

# Check www redirect
curl -I https://www.liteckyeditingservices.com
```

## 🌟 Best Practices

1. **Always backup before changes**: `./scripts/cf-dns-manage.fish backup`
2. **Test on preview first**: Deploy to preview branch before production
3. **Monitor after changes**: Check propagation and site availability
4. **Keep email separate**: Don't modify MX records unless necessary
5. **Document changes**: Update this guide with any new procedures

## 🆘 Getting Help

- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler/
- **Pages Docs**: https://developers.cloudflare.com/pages/
- **API Reference**: https://api.cloudflare.com/
