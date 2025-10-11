# Complete Cloudflare Requirements for Litecky Editing Services

## Executive Summary

This document outlines ALL Cloudflare services, configurations, and resources required to run the complete Litecky Editing Services application in production. Based on analysis of the project's architecture documents, the application requires a comprehensive Cloudflare setup including Pages, Workers, storage services, and security features.

---

## 🎯 Core Cloudflare Services Required

### 1. **Cloudflare Pages** (Primary Hosting)
- **Purpose**: Host the Astro-based frontend application with SSR capabilities
- **Configuration**:
  - Project name: `litecky-editing` or `academic-editor`
  - Production branch: `main`
  - Build command: `pnpm build`
  - Output directory: `dist`
  - Framework preset: Astro with `@astrojs/cloudflare` adapter
  - Output mode: `hybrid` (SSR for dynamic routes, static for others)

### 2. **Cloudflare Workers** (5 Workers Required)
- **Decap OAuth Worker** (`cms-auth.liteckyeditingservices.com`)
  - GitHub OAuth proxy for CMS authentication
  - Custom domain routing required
- **Cron Scheduler Worker**
  - Daily follow-ups at 10:00 UTC
  - Document cleanup every 6 hours
  - Weekly reports on Mondays
- **Queue Consumer Worker**
  - Process email notifications
  - Handle document scanning
  - Manage async tasks
- **Document Processing Worker** (implied)
  - Virus scanning
  - File validation
- **Email Worker** (implied)
  - SendGrid/Resend integration
  - Template rendering

### 3. **D1 Database** (SQL Database)
- **Database Name**: `academic-editor` or `litecky-editing`
- **Required Tables**:
  - `quotes` - Store quote requests and status
  - `documents` - Track uploaded documents
  - `projects` - Manage editing projects
  - `users` - User accounts (if needed)
- **Schema**: Includes timestamps, status tracking, relationships

### 4. **R2 Storage** (Object Storage)
- **Bucket Name**: `academic-editor-documents` or `litecky-documents`
- **Purpose**:
  - Store uploaded academic documents securely
  - Serve edited documents
  - Archive completed projects
- **Features Required**:
  - Signed URLs for secure downloads
  - Custom metadata for tracking
  - 30-day retention policy for orphaned files

### 5. **KV Namespace** (Key-Value Storage)
- **Namespace**: `CACHE`
- **Purpose**:
  - Session storage
  - Rate limiting counters
  - Temporary data caching
  - OAuth state management

### 6. **Queues**
- **Queue Name**: `document-processing`
- **Purpose**:
  - Async email sending
  - Document processing pipeline
  - Follow-up scheduling
  - Notification management

### 7. **Turnstile** (Bot Protection)
- **Required Keys**:
  - Site Key (public): `PUBLIC_TURNSTILE_SITE_KEY`
  - Secret Key: `TURNSTILE_SECRET_KEY`
- **Integration Points**:
  - Contact form submission
  - Quote request form
  - Document upload

### 8. **Analytics Engine**
- **Dataset Binding**: `ANALYTICS`
- **Purpose**:
  - Track API usage
  - Monitor performance
  - Generate usage reports
  - Debug issues

---

## 🌐 DNS Configuration Requirements

### Primary Domain Setup
```
Type    Name                          Value                         Proxy
A       @                            192.0.2.1                      ✓
AAAA    @                            100::                          ✓
CNAME   www                          liteckyeditingservices.com     ✓
CNAME   cms-auth                     [worker-subdomain].workers.dev ✓
```

### Email Configuration (SendGrid)
```
CNAME   em[xxxx]                     u[xxxxx].wl[xxx].sendgrid.net  ✗
CNAME   s1._domainkey                s1.domainkey.[sendgrid]         ✗
CNAME   s2._domainkey                s2.domainkey.[sendgrid]         ✗
TXT     @                            "v=spf1 include:sendgrid.net ~all"
```

---

## 🔐 Environment Variables & Secrets

### Public Variables (Client-Safe)
```env
PUBLIC_SITE_NAME="Litecky Editing Services"
PUBLIC_SITE_URL="https://liteckyeditingservices.com"
PUBLIC_TURNSTILE_SITE_KEY="0x4AAAAAAAA[...]"
PUBLIC_GA4_ID="G-XXXXXXXXXX"
MAX_FILE_SIZE_MB="10"
ALLOWED_FILE_TYPES=".doc,.docx,.pdf,.rtf,.txt"
```

### Secret Variables (Server-Only)
```env
# Authentication
GITHUB_OAUTH_ID="[github-oauth-app-id]"
GITHUB_OAUTH_SECRET="[github-oauth-secret]"
TURNSTILE_SECRET_KEY="0x4AAAAAAAA[...]"

# Email Service
SENDGRID_API_KEY="SG.[...]"  # OR
RESEND_API_KEY="re_[...]"
SENDGRID_CONTACT_TEMPLATE_ID="d-[...]"
SENDGRID_QUOTE_TEMPLATE_ID="d-[...]"
SENDGRID_CONFIRMATION_TEMPLATE_ID="d-[...]"
ADMIN_EMAIL="admin@liteckyeditingservices.com"

# Cloudflare Resources
CLOUDFLARE_ACCOUNT_ID="[account-id]"
CLOUDFLARE_API_TOKEN="[api-token]"

# R2 Storage
R2_ACCESS_KEY_ID="[access-key]"
R2_SECRET_ACCESS_KEY="[secret-key]"

# Database
DATABASE_URL="[d1-connection-string]"

# Webhook Security
WEBHOOK_SECRET="whsec_[...]"
```

---

## 📦 Wrangler Configuration Files

### Site (Cloudflare Pages)
- Code-first configuration via root `wrangler.toml` (Pages V2 build system).
- Build output: `dist` (see `astro.config.mjs`).
- Environment variables and secrets set per environment in Pages settings (do not inline secrets in `wrangler.toml`).

### OAuth Worker (`workers/decap-oauth/wrangler.toml`)
```toml
name = "litecky-decap-oauth"
main = "src/index.ts"
compatibility_date = "2025-09-22"
compatibility_flags = ["nodejs_compat"]

routes = [
  { pattern = "cms-auth.liteckyeditingservices.com/*", custom_domain = true }
]
```

### Cron Worker (`workers/cron/wrangler.toml`)
```toml
name = "litecky-cron"
main = "src/worker.ts"
compatibility_date = "2025-09-22"

[triggers]
crons = [
  "0 10 * * *",     # Daily follow-ups
  "0 */6 * * *",    # Document cleanup
  "0 0 * * 1"       # Weekly reports
]
```

---

## 🚀 Deployment Steps (Order Matters)

### Phase 1: Infrastructure Setup
1. **Create Cloudflare Account** (if not exists)
2. **Add Domain** to Cloudflare
3. **Configure DNS** records (A, AAAA, CNAME)
4. **Create D1 Database**
   ```bash
   wrangler d1 create litecky-editing
   wrangler d1 execute litecky-editing --file=./schema.sql
   ```
5. **Create R2 Bucket**
   ```bash
   wrangler r2 bucket create litecky-documents
   ```
6. **Create KV Namespace**
   ```bash
   wrangler kv:namespace create CACHE
   ```
7. **Create Queue**
   ```bash
   wrangler queues create document-processing
   ```

### Phase 2: Security & Auth
1. **Enable Turnstile** in dashboard
2. **Create GitHub OAuth App**
   - Homepage URL: `https://liteckyeditingservices.com`
   - Callback URL: `https://cms-auth.liteckyeditingservices.com/callback`
3. **Deploy OAuth Worker**
   ```bash
   cd workers/decap-oauth
   wrangler secret put GITHUB_OAUTH_ID
   wrangler secret put GITHUB_OAUTH_SECRET
   wrangler deploy
   ```

### Phase 3: Workers Deployment
1. **Deploy Cron Worker**
   ```bash
   cd workers/cron
   wrangler deploy
   ```
2. **Deploy Queue Consumer**
   ```bash
   cd workers/queue-consumer
   wrangler deploy
   ```

### Phase 4: Main Application
1. **Configure Pages Project**
2. **Set Environment Variables** in dashboard
3. **Deploy Site**
   ```bash
   cd apps/site
   pnpm build
   wrangler pages deploy dist --project-name=liteckyeditingservices
   ```

### Phase 5: Email Setup
1. **Configure SendGrid** domain authentication
2. **Create Email Templates** in SendGrid
3. **Update DNS** with SendGrid records
4. **Test Email Flow**

---

## 💰 Cost Considerations

### Free Tier Limits
- **Workers**: 100,000 requests/day
- **KV**: 100,000 reads/day, 1,000 writes/day
- **R2**: 10GB storage, 1M Class A operations/month
- **D1**: 5GB storage, 5M rows read/day
- **Pages**: Unlimited sites, 500 builds/month

### Estimated Monthly Costs (After Free Tier)
- **Workers**: ~$5-10 (based on usage)
- **R2 Storage**: ~$0.015/GB
- **D1 Database**: ~$5 base
- **Domain**: ~$10/year
- **Total Estimate**: ~$15-25/month

---

## 🔒 Security Checklist

- [ ] Turnstile configured on all forms
- [ ] CORS headers properly set
- [ ] Rate limiting implemented
- [ ] Security headers configured (HSTS, CSP, etc.)
- [ ] Secrets stored in Wrangler/Dashboard (never in code)
- [ ] GitHub OAuth scope limited to necessary permissions
- [ ] R2 signed URLs with expiration
- [ ] Database queries parameterized
- [ ] Input validation on all endpoints
- [ ] Regular security audits scheduled

---

## 📊 Monitoring & Maintenance

### Required Monitoring
- **Cloudflare Analytics**: Built-in traffic monitoring
- **Worker Analytics**: Request counts, errors, latency
- **R2 Metrics**: Storage usage, bandwidth
- **D1 Metrics**: Query performance, storage
- **Email Delivery**: SendGrid dashboard
- **Uptime Monitoring**: External service recommended

### Maintenance Tasks
- **Daily**: Check error logs, monitor queues
- **Weekly**: Review analytics, check storage usage
- **Monthly**: Security updates, cost review
- **Quarterly**: Performance optimization, capacity planning

---

## 🚨 Critical Dependencies

1. **GitHub Account**: Required for CMS backend and OAuth
2. **SendGrid Account**: Email service (alternative: Resend)
3. **npm/pnpm**: Build toolchain
4. **Node.js 20+**: Runtime requirement
5. **Wrangler CLI**: Cloudflare deployment tool

---

## 📝 Notes

- The project uses a **monorepo structure** which may migrate from single repo
- **Astro with hybrid rendering** requires Cloudflare adapter
- **Decap CMS** requires OAuth proxy worker for GitHub authentication
- **Document processing** is async via queues for better performance
- **Email templates** should follow the "Supportive Authority" design pattern
- All times in **UTC** for consistency
- Consider implementing **staged rollouts** for production changes

This comprehensive setup ensures a robust, scalable, and secure deployment of the Litecky Editing Services application on Cloudflare's infrastructure.
