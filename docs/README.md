# Documentation Directory

This directory contains all developer documentation, playbooks, and technical guides for the Litecky Editing Services project.

## 📖 Quick Navigation

### 🎯 New to the Project?
Start here: **[../README.md](../README.md)** → **[onboarding.md](onboarding.md)**

### 🔍 Looking for Something Specific?
See **[DOCUMENTATION-INDEX.md](DOCUMENTATION-INDEX.md)** for complete documentation inventory.

---

## 📚 Documentation by Category

### Error Tracking & Monitoring (Sentry)
- **[SENTRY-README.md](SENTRY-README.md)** - Quick reference and getting started
- **[SENTRY-SETUP.md](SENTRY-SETUP.md)** - Complete setup guide (15 sections)
- **[SENTRY-INTEGRATIONS.md](SENTRY-INTEGRATIONS.md)** - Integration patterns and API reference

### Infrastructure & Secrets
- **[INFISICAL-QUICKSTART.md](INFISICAL-QUICKSTART.md)** - Production secrets workflow
- **[INFISICAL-CI-SYNC.md](INFISICAL-CI-SYNC.md)** - CI automation for secrets
- **[infrastructure/](infrastructure/)** - Cloudflare, DNS, monitoring setup

### CMS & Content Management
- **[DECAP-SPEC-COMPLIANCE.md](DECAP-SPEC-COMPLIANCE.md)** - Current CMS setup and compliance
- **[decisions/ADR-001-decap-editorial-workflow.md](decisions/ADR-001-decap-editorial-workflow.md)** - Editorial workflow decision
- **[decisions/ADR-002-decap-delivery-npm-app.md](decisions/ADR-002-decap-delivery-npm-app.md)** - NPM bundle delivery decision

### Security & Compliance
- **[SECURITY-HEADERS.md](SECURITY-HEADERS.md)** - CSP, HSTS, security headers
- **[playbooks/security-headers-validation.md](playbooks/security-headers-validation.md)** - Post-deployment validation

### Operations & Troubleshooting
- **[playbooks/](playbooks/)** - Operational playbooks and troubleshooting guides
  - `email-issues.md` - SendGrid troubleshooting
  - `cloudflare-queues.md` - Queue health monitoring
  - `ADMIN-ACCESS.md` - Configure Cloudflare Access
  - `DECAP-NPM-MIGRATION.md` - CMS bundle migration
  - `DECAP-OAUTH-WORKFLOW.md` - OAuth debugging

### Testing
- **[testing/](testing/)** - Testing guides and strategies
  - `E2E-CMS-TESTING.md` - CMS end-to-end testing
  - `VISUAL-REGRESSION-GUIDE.md` - Visual regression testing
  - `ACCESSIBILITY-TESTING.md` - A11y testing procedures

### Migrations & Deployment
- **[migrations/](migrations/)** - Migration checklists and runbooks
  - `PAGES-GIT-MIGRATION.md` - Git-connected deployment
  - `COMPLETE-GIT-MIGRATION-CHECKLIST.md` - Full migration checklist
  - `PAGES-ENV-CHECKLIST.md` - Environment variable migration

### Architecture & Decisions
- **[decisions/](decisions/)** - Architecture Decision Records (ADRs)
  - `2025-10-12-biome-2.2.5.md` - Biome v2.2.5 strategy
  - ADR-001, ADR-002 (see above)
- **[audits/](audits/)** - Architecture audit checklists
  - `edge-native-architecture-checklist.md` - Edge-first architecture validation

### Developer Experience
- **[onboarding.md](onboarding.md)** - New developer setup guide
- **[training/](training/)** - Training materials
  - `EDITORIAL-WORKFLOW.md` - Editor training guide

---

## 🗺️  Which Doc Should I Read?

### I want to...

**Set up my local development environment**
→ [onboarding.md](onboarding.md)

**Configure error tracking**
→ [SENTRY-README.md](SENTRY-README.md)

**Understand the architecture**
→ [../ARCHITECTURE.md](../ARCHITECTURE.md)

**Manage production secrets**
→ [INFISICAL-QUICKSTART.md](INFISICAL-QUICKSTART.md) and [../SECRETS.md](../SECRETS.md)

**Debug the CMS/admin**
→ [playbooks/DECAP-OAUTH-WORKFLOW.md](playbooks/DECAP-OAUTH-WORKFLOW.md) and [troubleshooting/](troubleshooting/)

**Deploy to production**
→ [../DEPLOYMENT.md](../DEPLOYMENT.md) and [deployment/WORKER-DEPLOYMENT.md](deployment/WORKER-DEPLOYMENT.md)

**Troubleshoot email delivery**
→ [playbooks/email-issues.md](playbooks/email-issues.md) and [infrastructure/SENDGRID-SETUP.md](infrastructure/SENDGRID-SETUP.md)

**Run tests**
→ [testing/](testing/) directory

**Understand a past decision**
→ [decisions/](decisions/) directory (ADRs)

---

## 📋 Documentation Standards

- **Date Format**: Use "October 12, 2025" or "2025-10-12" consistently
- **Cross-References**: Always use relative paths (e.g., `../SECRETS.md`)
- **Code Examples**: Include working commands with expected output
- **Status Indicators**: Use ✅ (complete), ⚠️  (partial), 🔴 (blocked)
- **Last Updated**: Include "Last Updated: YYYY-MM-DD" in long-lived docs

---

## 🔄 Recently Updated

- **October 12, 2025**: Sentry documentation consolidated (3 active docs now)
- **October 12, 2025**: Infisical CLI automation documented (sync-to-cloudflare-pages.sh)
- **October 11, 2025**: Sentry integration complete (setup + tests)
- **October 11, 2025**: Admin CMS npm bundle build pipeline documented
- **October 11, 2025**: Biome 2.2.5 strategy decision (docs/decisions/)
- **October 10, 2025**: PKCE OAuth flow hardened and documented
- **October 5, 2025**: Git-connected deployment migration complete

---

## 🆘 Getting Help

1. **Check the docs**: Use search (Cmd+F) or check the [documentation index](DOCUMENTATION-INDEX.md)
2. **Check playbooks**: Operational issues often have playbooks in [playbooks/](playbooks/)
3. **Check troubleshooting**: Known issues documented in [troubleshooting/](troubleshooting/)
4. **Check archived docs**: Historical context in [../_archive/](../_archive/)
5. **Ask the team**: If docs don't help, ask and then update the docs!

---

**For the complete project overview**: See [../README.md](../README.md)
**For implementation status**: See [../PROJECT-STATUS.md](../PROJECT-STATUS.md)
**For complete documentation index**: See [DOCUMENTATION-INDEX.md](DOCUMENTATION-INDEX.md)
**For implementation roadmap**: See [planning/IMPLEMENTATION-ROADMAP.md](planning/IMPLEMENTATION-ROADMAP.md)
