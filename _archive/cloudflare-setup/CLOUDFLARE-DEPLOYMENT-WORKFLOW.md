# Cloudflare Deployment Workflow - Litecky Editing Services

## Overview

This workflow integrates with our existing PROJECT-STATUS.md and IMPLEMENTATION-ROADMAP.md tracking system, leveraging our established Cloudflare management infrastructure.

---

## 📦 Current Infrastructure Status

### ✅ Already In Place

- **Domain**: liteckyeditingservices.com (Zone ID: a5e7c69768502d649a8f2c615f555eca)
- **Cloudflare Account**: Active (Account ID: 13eb584192d9cefb730fde0cfd271328)
- **DNS**: Currently pointing to Google (ghs.googlehosted.com)
- **MX Records**: Google Mail configured
- **flarectl CLI**: Installed and configured
- **Management Scripts**:
  - `cloudflare-audit.fish` - Domain auditing
  - `cf-dns-manage.fish` - DNS management
  - `cf-pages-deploy.fish` - Pages deployment
- **API Credentials**: Stored in gopass

### 🔄 Migration Required

- DNS from Google Sites to Cloudflare Pages
- Remove Google-specific CNAME records
- Add Pages deployment records

---

## 🚀 Deployment Phases (Aligned with IMPLEMENTATION-ROADMAP.md)

### Phase 0: Pre-Deployment Preparation ✅

**Status**: COMPLETE
**Blockers**: None

- [x] Complete frontend development to deployable state
- [x] Run all validation scripts (`pnpm validate:all`)
- [x] Pass all tests (configured)
- [x] Build production bundle (`pnpm build`)
- [x] Verify build output in `dist/` directory

### Phase 1: Cloudflare Infrastructure Setup ✅

**Status**: COMPLETE
**Dependencies**: Frontend completion

#### 1.1 Create Core Resources ✅

```bash
# COMPLETED using wrangler:
# 1. D1 Database: litecky-db (ID: 208dd91d-8f15-40ef-b23d-d79672590112)
# 2. R2 Bucket: litecky-uploads
# 3. KV Namespace: CACHE (ID: 6d85733ce2654d9980caf3239a12540a)
# 4. Queue: Deferred (requires $5/month Workers Paid plan)
```

#### 1.2 Update PROJECT-STATUS.md ✅

- [x] Mark D1 Database as created
- [x] Mark R2 Bucket as created
- [x] Mark KV Namespace as created
- [x] Mark Queue as deferred (paid plan required)

### Phase 2: Security & Authentication Setup 🟡

**Status**: PARTIALLY COMPLETE
**Dependencies**: Phase 1 ✅

#### 2.1 Turnstile Setup ✅

```bash
# COMPLETED:
# 1. Widget created: litecky-editing-production
# 2. Mode: Managed with pre-clearance
# 3. Keys stored in gopass:
#    Site key: 0x4AAAAAAB27CNFPS0wEzPP5
#    Secret stored at: cloudflare/litecky/turnstile/secret-key
# 4. Integrated into contact form
# 5. Server-side validation active
```

#### 2.2 GitHub OAuth App

```bash
# Create via GitHub Settings > Developer settings
# Homepage: https://liteckyeditingservices.com
# Callback: https://cms-auth.liteckyeditingservices.com/callback

# Store credentials:
gopass insert github/litecky/oauth/client-id
gopass insert github/litecky/oauth/client-secret
```

#### 2.3 Update Trackers

- [x] Update PROJECT-STATUS.md: Turnstile configured
- [ ] Update PROJECT-STATUS.md: GitHub OAuth created

### Phase 3: Workers Deployment 👷

**Status**: Not Started
**Dependencies**: Phase 2

#### 3.1 Deploy OAuth Worker

```bash
cd workers/decap-oauth
pnpm install

# Set secrets
wrangler secret put GITHUB_OAUTH_ID
wrangler secret put GITHUB_OAUTH_SECRET

# Deploy
wrangler deploy

# Update DNS for cms-auth subdomain
./scripts/cf-dns-manage.fish add CNAME cms-auth litecky-decap-oauth.workers.dev
```

#### 3.2 Deploy Cron Worker

```bash
cd workers/cron
pnpm install
wrangler deploy
```

#### 3.3 Deploy Queue Consumer

```bash
cd workers/queue-consumer
pnpm install
wrangler deploy
```

#### 3.4 Update Tracking

- [ ] Mark OAuth Worker deployed in PROJECT-STATUS.md
- [ ] Mark Cron Worker deployed
- [ ] Mark Queue Consumer deployed

### Phase 4: Main Site Deployment 🟡

**Status**: PARTIALLY COMPLETE
**Dependencies**: Phase 1 ✅

#### 4.1 Initial Pages Setup ✅

```bash
# COMPLETED:
wrangler pages project create liteckyeditingservices --production-branch main
# Site deployed to: https://c9bfafd5.liteckyeditingservices.pages.dev
```

#### 4.2 Configure Environment Variables ⏳

```bash
# TODO: Via dashboard or wrangler
wrangler pages secret put PUBLIC_TURNSTILE_SITE_KEY
wrangler pages secret put TURNSTILE_SECRET_KEY
wrangler pages secret put SENDGRID_API_KEY
# ... (see CLOUDFLARE-REQUIREMENTS.md for full list)
```

#### 4.3 DNS Migration ⏳

```bash
# TODO: After ready for production
# Backup current DNS (COMPLETED)
./scripts/cloudflare-audit.fish > dns-backup-$(date +%Y%m%d).json

# Remove Google CNAME
./scripts/cf-dns-manage.fish delete www

# Add Pages CNAME
./scripts/cf-dns-manage.fish add CNAME @ liteckyeditingservices.pages.dev
```

#### 4.4 Deploy Site ✅

```bash
# COMPLETED:
pnpm build
wrangler pages deploy dist --project-name=liteckyeditingservices
# Initial deployment: https://c9bfafd5.liteckyeditingservices.pages.dev
# With Turnstile: https://22910e05.liteckyeditingservices.pages.dev
```

#### 4.5 Update Trackers ✅

- [x] Mark Cloudflare Pages created
- [ ] Mark DNS migrated (pending)
- [x] Mark site deployed
- [x] Update PROJECT-STATUS.md deployment section

### Phase 5: Email Configuration 📧

**Status**: Not Started
**Dependencies**: SendGrid account setup

#### 5.1 SendGrid Setup

```bash
# After SendGrid account creation
# 1. Domain authentication
# 2. Create templates (3 required)
# 3. Store API key:
gopass insert sendgrid/litecky/api-key
gopass insert sendgrid/litecky/template/contact
gopass insert sendgrid/litecky/template/quote
gopass insert sendgrid/litecky/template/confirmation
```

#### 5.2 DNS Records for Email

```bash
# Add SendGrid records
./scripts/cf-dns-manage.fish add CNAME em1234 u12345.wl123.sendgrid.net false
./scripts/cf-dns-manage.fish add CNAME s1._domainkey s1.domainkey.u12345.wl123.sendgrid.net false
./scripts/cf-dns-manage.fish add TXT @ "v=spf1 include:sendgrid.net ~all"
```

### Phase 6: Post-Deployment Verification ✅

**Status**: Not Started
**Dependencies**: All phases complete

#### 6.1 Functional Tests

```bash
# Run from project root
./scripts/verify-deployment.fish

# Manual checks:
# - [ ] Homepage loads
# - [ ] Contact form submits
# - [ ] CMS login works
# - [ ] Documents upload
# - [ ] Email delivery works
```

#### 6.2 Update Documentation

- [ ] Update PROJECT-STATUS.md to 100% deployed
- [ ] Update IMPLEMENTATION-ROADMAP.md completion
- [ ] Create production runbook
- [ ] Document rollback procedures

---

## 📊 Progress Tracking Integration

### PROJECT-STATUS.md Updates

After each phase completion, update the deployment section:

```markdown
| Deployment | ⚠️ | X% | Phase X/6 complete |
```

### IMPLEMENTATION-ROADMAP.md Updates

Update the Cloudflare Infrastructure section:

```markdown
| Cloudflare Infra | 🟡 In Progress | X% | Phase details |
```

---

## 🛠️ Helper Scripts

### Create All Resources Script

```fish
#!/usr/bin/env fish
# scripts/cloudflare-setup-all.fish

echo "Setting up Cloudflare resources for Litecky Editing Services..."

# Load credentials
source ./scripts/load-cloudflare-env.fish

# Create resources
echo "Creating D1 Database..."
~/go/bin/flarectl d1 create litecky-editing --account-id=$CF_ACCOUNT_ID

echo "Creating R2 Bucket..."
~/go/bin/flarectl r2 bucket create litecky-documents --account-id=$CF_ACCOUNT_ID

echo "Creating KV Namespace..."
~/go/bin/flarectl kv namespace create CACHE --account-id=$CF_ACCOUNT_ID

echo "Creating Queue..."
~/go/bin/flarectl queues create document-processing --account-id=$CF_ACCOUNT_ID

echo "✅ All resources created!"
```

### Deployment Status Check

```fish
#!/usr/bin/env fish
# scripts/cloudflare-deploy-status.fish

echo "Checking deployment status..."

# Check Pages
wrangler pages project list | grep liteckyeditingservices

# Check Workers
wrangler deployments list

# Check DNS
./scripts/cloudflare-audit.fish | grep -A5 "DNS Records"

# Check resources
echo "D1 Databases:"
~/go/bin/flarectl d1 list --account-id=$CF_ACCOUNT_ID

echo "R2 Buckets:"
~/go/bin/flarectl r2 bucket list --account-id=$CF_ACCOUNT_ID
```

---

## 🚨 Rollback Procedures

### Emergency DNS Rollback

```bash
# Restore from backup
./scripts/cf-dns-restore.fish dns-backup-YYYYMMDD.json
```

### Pages Deployment Rollback

```bash
# List deployments
wrangler pages deployment list --project-name=liteckyeditingservices

# Rollback to previous
wrangler pages deployment rollback --project-name=liteckyeditingservices
```

### Worker Rollback

```bash
cd workers/[worker-name]
wrangler rollback
```

---

## 📝 Checklist Summary

### Pre-Flight Checklist

- [ ] Frontend complete and tested
- [ ] Build passes all validations
- [ ] Credentials stored in gopass
- [ ] Backup current DNS configuration

### Deployment Checklist

- [ ] Phase 1: Infrastructure created
- [ ] Phase 2: Security configured
- [ ] Phase 3: Workers deployed
- [ ] Phase 4: Site deployed
- [ ] Phase 5: Email configured
- [ ] Phase 6: Verification complete

### Post-Deployment Checklist

- [ ] All trackers updated
- [ ] Documentation complete
- [ ] Monitoring enabled
- [ ] Team notified

---

## 🔗 Related Documents

- [PROJECT-STATUS.md](./PROJECT-STATUS.md) - Current progress tracking
- [IMPLEMENTATION-ROADMAP.md](./IMPLEMENTATION-ROADMAP.md) - Build sequence
- [CLOUDFLARE-REQUIREMENTS.md](./CLOUDFLARE-REQUIREMENTS.md) - Full requirements
- [docs/infrastructure/](./docs/infrastructure/) - Infrastructure documentation
- [scripts/](./scripts/) - Management scripts

---

**Next Action**: Complete frontend development to enable Phase 1 infrastructure setup.
