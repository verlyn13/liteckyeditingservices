# Infrastructure Documentation

## Overview

This directory contains all Cloudflare infrastructure documentation and configuration for liteckyeditingservices.com.

### Account Status

- **Account Plan**: Workers Plan ($5/month) \u2705
- **Account ID**: `13eb584192d9cefb730fde0cfd271328`
- **Enhanced Capabilities**: Workers for Platforms, Dispatch Namespaces, Extended limits

## Files

### Status Reports

- **CLOUDFLARE-ANALYSIS.md** - Analysis of DNS, SSL/TLS, and deployment requirements
- **CLOUDFLARE-MANAGEMENT.md** - Complete management guide with commands and procedures
- **BROWSER-AUTOMATION-SETUP.md** - Browser automation configuration for testing
- **DNS-CONFIGURATION.md** - Current DNS records and email configuration
- **SENDGRID-SETUP.md** - Complete SendGrid email configuration (root + em subdomain)

### Monitoring Documentation

- **UPTIME-MONITORING.md** - External uptime monitoring setup (UptimeRobot/Pingdom)
- **ERROR-ALERTING.md** - Cloudflare error monitoring with Workers
- **QUEUE-HEALTH.md** - Queue health monitoring implementation
- **CLOUDFLARE-CUSTOM-RULE-CI.md** - CI/CD custom rule configuration

### Backups

- **dns-backup-\*.json** - DNS configuration backups (timestamped)

## Management Scripts

All infrastructure management scripts are located in `/scripts/`:

| Script                     | Purpose                      | Key Commands                              |
| -------------------------- | ---------------------------- | ----------------------------------------- |
| `cloudflare-audit.fish`    | Full domain audit            | `./scripts/cloudflare-audit.fish`         |
| `cf-dns-manage.fish`       | DNS record management        | `list`, `backup`, `add`, `delete`         |
| `cf-pages-deploy.fish`     | Pages deployment helper      | `status`, `prepare`, `deploy`             |
| `cf.fish`                  | Quick flarectl wrapper       | Direct flarectl commands                  |
| `load-cloudflare-env.fish` | Load credentials from gopass | `source scripts/load-cloudflare-env.fish` |
| `launch-browser.fish`      | Browser automation launcher  | `dev`, `headless`, `debug`, `test`        |

## Configuration Files

### Environment Variables

- **desired-state/.env.cloudflare** - Zone IDs and configuration constants
- **.dev.vars.example** - Template for local development secrets

## Quick Reference

### Zone Information

```
Domain: liteckyeditingservices.com
Zone ID: a5e7c69768502d649a8f2c615f555eca
Name Servers: carol.ns.cloudflare.com, ignacio.ns.cloudflare.com
Plan: Free Website
SSL/TLS: Full
```

### Current DNS Configuration

- **Apex**: CNAME (flattened) to `liteckyeditingservices.pages.dev` (proxied)
- **WWW**: CNAME to `liteckyeditingservices.pages.dev` (proxied)
- **Email**: Google Workspace MX records
- **Auth**: SPF and DKIM for Google email + SendGrid

### API Token

- **Storage**: gopass at `cloudflare/api-tokens/initial-project-setup-master`
- **Permissions**: Zone, DNS, SSL/TLS, Firewall, Workers, Pages (all read/write)

### Secrets Source of Truth (Production)

- Infisical workspace: `liteckyeditingservices`
- Quickstart: `docs/INFISICAL-QUICKSTART.md` (seed → verify → prepare)

## Deployment Workflow

### Prerequisites (Workers Plan)

```bash
# Ensure wrangler is installed
pnpm add -D wrangler  # Already added: v4.38.0

# Load credentials
source scripts/load-cloudflare-env.fish
# Sets: CF_API_TOKEN, CF_ZONE_ID, CF_ACCOUNT_ID
```

### Standard Deployment

1. **Audit Current State**

   ```bash
   ./scripts/cloudflare-audit.fish
   ```

2. **Backup DNS**

   ```bash
   ./scripts/cf-dns-manage.fish backup
   ```

3. **Deploy to Pages (Git-connected)**
   - Cloudflare builds & deploys on push to `main` (no manual deploy required)
   - Manual fallback (only if Git-connected is unavailable):
     ```bash
     pnpm build
     pnpm wrangler pages deploy dist/ --project-name=liteckyeditingservices
     ```

4. **Update DNS**
   ```bash
   ./scripts/cf-dns-manage.fish list
   ./scripts/cf-dns-manage.fish add CNAME www liteckyeditingservices.pages.dev
   ```

### Workers Deployment

```bash
# Deploy standard Worker
cd workers/worker-name
pnpm wrangler deploy

# Deploy with dispatch namespace
pnpm wrangler deploy --dispatch-namespace production
```

## Related Documentation

- [Cloudflare Deployment Plan](/cloudflare-deployment.md)
- [Deployment Configuration](/deployment-config.md)
- [Environment Variables](/ENVIRONMENT.md)
- [Project Status](/PROJECT-STATUS.md)
