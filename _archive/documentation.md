# Litecky Editing Services - Documentation Suite

## README.md
```markdown
# Litecky Editing Services — Website

Professional academic editing services for graduate students, built with modern web technologies and a focus on simplicity and reliability.

**Production**: https://liteckyeditingservices.com  
**Preview**: Auto-deployed via Cloudflare Pages on PRs  
**CMS**: https://liteckyeditingservices.com/admin (GitHub auth required)

## Stack

- **Frontend**: Astro 5 + Svelte 5 + Tailwind CSS 4
- **Hosting**: Cloudflare Pages (static + SSR functions)
- **Workers**: Cloudflare Workers (OAuth proxy, future cron jobs)
- **CMS**: Decap CMS with GitHub backend
- **Email**: SendGrid (transactional templates)
- **Security**: Cloudflare Turnstile (spam protection)
- **Analytics**: Cloudflare Web Analytics (privacy-first)

## Quick Start (Development)

```bash
# Prerequisites: Node 24+, pnpm 10.16+
# Optional: gopass/age for secret management

# 1. Clone and install
git clone https://github.com/YOUR_USERNAME/litecky-editing
cd litecky-editing
pnpm install

# 2. Set up local environment
cp apps/site/.env.example apps/site/.env
cp apps/site/.dev.vars.example apps/site/.dev.vars
# Edit .dev.vars with your test keys

# 3. Run development server
pnpm dev

# Site available at http://localhost:4321
# CMS available at http://localhost:4321/admin
```

## Key Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm check        # Run all quality checks
pnpm test:e2e     # Run Playwright tests
pnpm lint:fix     # Auto-fix linting issues
```

## Project Structure

```
├── apps/site/          # Main website (Astro)
├── workers/            # Cloudflare Workers
│   └── decap-oauth/    # GitHub OAuth proxy for CMS
├── config/             # Shared configuration
├── scripts/            # Build and deployment scripts
└── docs/               # Detailed documentation
```

## Deployment

- **Automatic**: Push to `main` branch triggers deployment via Cloudflare Pages
- **Preview**: Every PR gets a preview URL automatically
- **Rollback**: Revert commit or use Cloudflare dashboard

## Content Management

- **For editors**: Use the CMS at `/admin` (requires GitHub access)
- **For developers**: Edit Markdown files in `apps/site/src/content/`

## Getting Help

- **Operations issues**: See [RUNBOOK.md](./RUNBOOK.md)
- **Architecture questions**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **New developer setup**: See [docs/onboarding.md](./docs/onboarding.md)
- **Specific problems**: Check [docs/playbooks/](./docs/playbooks/)

## License

Private repository - All rights reserved
```

## CONTRIBUTING.md
```markdown
# Contributing to Litecky Editing Services

## Development Workflow

### Branch Strategy
- `main` - Production branch (protected)
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `deps/*` - Dependency updates (usually automated)

### Commit Messages
We follow conventional commits:
```
feat: add contact form validation
fix: correct Turnstile token refresh
docs: update deployment guide
chore: update dependencies
```

### Pull Request Process
1. Create feature branch from `main`
2. Make changes and test locally
3. Run quality checks: `pnpm check`
4. Push and open PR
5. Wait for CI checks to pass
6. Request review if needed
7. Merge after approval

## Development Setup

### Required Tools
- Node.js 24+ (use nvm or volta)
- pnpm 10.16+
- Git

### Optional Tools
- gopass + age (for secret management)
- Playwright browsers (for E2E testing)
- VS Code with recommended extensions

### Environment Variables
See [ENVIRONMENT.md](./ENVIRONMENT.md) for complete reference.

For local development, copy and edit:
```bash
cp apps/site/.dev.vars.example apps/site/.dev.vars
```

## Quality Standards

### Before Committing
```bash
# Run all checks
pnpm check

# Or individually:
pnpm exec biome check .          # Linting and formatting
pnpm exec prettier --check "**/*.{astro,svelte}"
pnpm exec eslint .
pnpm exec tsc --noEmit
pnpm --filter @ae/site exec astro check
pnpm --filter @ae/site exec sv check
```

### Testing
```bash
# Unit tests (if any)
pnpm test

# E2E tests
pnpm test:e2e

# E2E with UI
pnpm test:e2e:headed
```

## Code Style

### JavaScript/TypeScript
- Biome handles formatting and linting
- Prefer `const` over `let`
- Use TypeScript for new code
- Avoid `any` types

### Astro Components
- Use TypeScript in frontmatter
- Minimize client-side JavaScript
- Prefer static rendering when possible

### Svelte Components
- Use Svelte 5 runes
- Keep components focused and small
- Document props with TypeScript

### CSS
- Use Tailwind utility classes
- Custom CSS only when necessary
- Mobile-first responsive design

## Documentation

### When to Update Docs
- New features or significant changes
- Configuration changes
- Dependency major version updates
- Incident post-mortems

### Documentation Standards
- Keep it concise and actionable
- Include examples and commands
- Update CHANGELOG.md for user-facing changes
- ADRs for architectural decisions

## CI/CD Pipeline

### Automated Checks
Every PR runs:
1. Code quality (Biome, Prettier, ESLint)
2. Type checking (TypeScript, Astro, Svelte)
3. Build verification
4. E2E tests (Playwright)
5. Deployment preview

### Nightly Tests
- Smoke tests run at 2:30 AM Alaska time
- Monitor homepage, CMS, API endpoints
- Failures trigger notifications

## Dependency Management

### Renovate Bot
- Runs weekly (weekends)
- Auto-merges minor/patch for devDependencies
- Groups related packages
- Requires approval for major updates

### Manual Updates
```bash
# Check for updates
pnpm update --interactive

# Security audit
pnpm audit
```

## Troubleshooting

### Common Issues

**Build fails locally but works in CI**
- Clear caches: `rm -rf .astro node_modules`
- Reinstall: `pnpm install`

**Turnstile widget not loading**
- Check PUBLIC_TURNSTILE_SITE_KEY is set
- Verify you're using test keys in development

**CMS login fails**
- Ensure GitHub OAuth app is configured
- Check Worker logs: `wrangler tail --name litecky-decap-oauth`

## Getting Help

- Check existing issues on GitHub
- Review relevant playbook in `docs/playbooks/`
- Contact maintainer (see SUPPORT.md)
```

## ARCHITECTURE.md
```markdown
# System Architecture

## Overview

Litecky Editing Services is a JAMstack application with content management and transactional email capabilities.

## Architecture Diagram

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────┐
│              │────▶│                  │────▶│             │
│   Browser    │     │ Cloudflare Pages │     │   GitHub    │
│              │◀────│     (CDN + SSR)   │◀────│    Repo     │
└──────────────┘     └──────────────────┘     └─────────────┘
       │                      │                      ▲
       │                      │                      │
       ▼                      ▼                      │
┌──────────────┐     ┌──────────────────┐          │
│  Turnstile   │     │  Pages Functions │          │
│   (Widget)   │     │  (/api/contact)  │          │
└──────────────┘     └──────────────────┘          │
                              │                      │
                              ▼                      │
                     ┌──────────────────┐           │
                     │    SendGrid      │           │
                     │  (Email API)     │           │
                     └──────────────────┘           │
                                                     │
┌──────────────┐     ┌──────────────────┐          │
│              │────▶│  Decap CMS       │──────────┘
│   Editor     │     │   (/admin)       │
│  (Browser)   │     └──────────────────┘
└──────────────┘              │
                              ▼
                     ┌──────────────────┐     ┌─────────────┐
                     │  Worker: OAuth   │────▶│   GitHub    │
                     │    Proxy          │◀────│    OAuth    │
                     └──────────────────┘     └─────────────┘
```

## Components

### Frontend (Astro + Svelte)
- **Purpose**: Static site generation with selective hydration
- **Technology**: Astro 5, Svelte 5, Tailwind CSS 4
- **Deployment**: Cloudflare Pages
- **SLA**: 99.9% uptime (Cloudflare guarantee)

### Content Management (Decap CMS)
- **Purpose**: Non-technical content editing interface
- **Technology**: Decap CMS 3.1
- **Backend**: GitHub (requires write access)
- **Authentication**: GitHub OAuth via Worker proxy

### API Layer (Pages Functions)
- **Purpose**: Server-side logic for forms and integrations
- **Endpoints**:
  - `/api/contact` - Contact form processing
  - Future: `/api/quote`, `/api/upload`
- **Runtime**: Cloudflare Workers runtime
- **Limits**: 10ms CPU time, 128MB memory

### Email Service (SendGrid)
- **Purpose**: Transactional email delivery
- **Templates**: Dynamic templates with personalization
- **Authentication**: API key based
- **Volume**: ~100 emails/month expected

### OAuth Proxy (Cloudflare Worker)
- **Purpose**: GitHub OAuth flow for Decap CMS
- **Deployment**: Separate Worker at cms-auth.liteckyeditingservices.com
- **Security**: CSRF protection via state parameter

### Spam Protection (Turnstile)
- **Purpose**: Bot prevention without user friction
- **Integration**: Client widget + server verification
- **Fallback**: Hidden honeypot field

### Analytics (Cloudflare Web Analytics)
- **Purpose**: Privacy-first visitor analytics
- **Data**: Page views, Core Web Vitals, referrers
- **Retention**: 90 days
- **GDPR**: Compliant, no cookies

## Data Flows

### Content Publishing
1. Editor logs into `/admin`
2. Decap CMS authenticates via GitHub OAuth (Worker proxy)
3. Editor makes changes in WYSIWYG interface
4. Decap commits changes to GitHub
5. GitHub webhook triggers Cloudflare Pages build
6. New version deployed globally (~2 minutes)

### Contact Form Submission
1. User fills form with Turnstile challenge
2. Browser POSTs to `/api/contact`
3. Pages Function verifies Turnstile token
4. Function sends emails via SendGrid:
   - Notification to admin
   - Confirmation to user
5. JSON response to browser

### Static Asset Serving
1. Browser requests page/asset
2. Cloudflare edge checks cache
3. If cached: serve from nearest PoP
4. If not: fetch from origin, cache, serve
5. Analytics beacon fires (privacy-preserving)

## Security Model

### Authentication
- **CMS**: GitHub OAuth (editors need repo write access)
- **Admin areas**: Optional Cloudflare Access overlay
- **API**: No auth (public forms only)

### Authorization
- **Content**: GitHub repository permissions
- **Secrets**: Cloudflare dashboard access
- **DNS**: Cloudflare account access

### Data Protection
- **In transit**: TLS 1.3 everywhere
- **At rest**: GitHub encryption, SendGrid encryption
- **Secrets**: Environment variables in Cloudflare
- **PII**: Not stored (pass-through only)

## Scaling Characteristics

### What scales automatically
- Static content (Cloudflare CDN)
- API requests (Workers auto-scale)
- Email sending (SendGrid handles queuing)

### What has limits
- GitHub API: 5000 requests/hour
- SendGrid: 100 emails/day (free tier)
- Workers: 100,000 requests/day (free tier)
- Build minutes: 500/month (Pages free tier)

## Disaster Recovery

### RTO/RPO Targets
- **RTO**: 15 minutes (rollback via Git)
- **RPO**: 0 (all content in Git)

### Backup Strategy
- **Code/Content**: Git (GitHub)
- **Secrets**: Document in SECRETS.md, rotate regularly
- **Email templates**: Export to repo quarterly

### Failure Modes
1. **GitHub down**: Site continues serving, no CMS access
2. **SendGrid down**: Forms fail gracefully, log errors
3. **Cloudflare down**: Extremely rare, no mitigation
4. **Worker down**: CMS auth fails, site continues

## Monitoring

### Automated
- Nightly smoke tests (GitHub Actions)
- Build success/failure notifications
- Web Analytics for traffic and performance

### Manual
- Weekly review of Web Analytics
- Monthly review of SendGrid metrics
- Quarterly security audit

## Future Considerations

### Potential Enhancements
- R2 for document uploads
- D1 for quote database
- Queue for async processing
- Durable Objects for real-time features

### Technical Debt
- Migrate to Edge Config for feature flags
- Add structured logging
- Implement rate limiting at edge
- Add A/B testing capability

## Related Documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment procedures
- [SECURITY.md](./SECURITY.md) - Security details
- [RUNBOOK.md](./RUNBOOK.md) - Operations procedures
```

## DEPLOYMENT.md
```markdown
# Deployment Guide

## Overview

The application uses continuous deployment via Cloudflare Pages with automatic preview deployments for pull requests.

## Environments

### Production
- **URL**: https://liteckyeditingservices.com
- **Branch**: `main`
- **Deployment**: Automatic on push
- **Rollback**: Via Cloudflare dashboard or Git revert

### Preview
- **URL**: `https://<hash>.litecky-editing.pages.dev`
- **Branches**: All PRs
- **Deployment**: Automatic on PR update
- **Cleanup**: Automatic on PR close

### Local Development
- **URL**: http://localhost:4321
- **Command**: `pnpm dev`
- **Environment**: `.dev.vars` file

## Deployment Paths

### Website (Cloudflare Pages)

#### Automatic Deployment
```bash
# Simply push to main
git push origin main

# Deployment happens automatically:
# 1. GitHub webhook triggers Pages
# 2. Pages pulls code
# 3. Runs build command
# 4. Deploys to global network
# 5. Purges cache if needed
```

#### Manual Deployment
```bash
# Build locally
pnpm build:site

# Deploy with Wrangler
wrangler pages deploy apps/site/dist \
  --project-name=litecky-editing \
  --branch=main
```

#### Rollback
Option 1: Via Dashboard
1. Go to Cloudflare Dashboard
2. Pages → litecky-editing → Deployments
3. Find previous good deployment
4. Click "Rollback"

Option 2: Via Git
```bash
# Revert the bad commit
git revert HEAD
git push origin main
```

### OAuth Worker (Cloudflare Workers)

#### Deployment
```bash
cd workers/decap-oauth
pnpm install
wrangler deploy
```

#### Rollback
```bash
# List deployments
wrangler deployments list

# Rollback to previous
wrangler rollback
```

## Build Configuration

### Cloudflare Pages Settings
```yaml
Build command: pnpm build
Build output directory: apps/site/dist
Root directory: /
Node version: 24
Environment variables: (see ENVIRONMENT.md)
```

### Build Process
1. Install dependencies (`pnpm install`)
2. Run build (`astro build`)
3. Generate static assets
4. Compile Pages Functions
5. Upload to Cloudflare

## Deployment Checklist

### Before Deployment
- [ ] Run `pnpm check` locally
- [ ] Test critical paths
- [ ] Review environment variables
- [ ] Check for console.log statements
- [ ] Update CHANGELOG if needed

### After Deployment
- [ ] Verify homepage loads
- [ ] Test contact form
- [ ] Check CMS access
- [ ] Monitor error logs (first 10 minutes)
- [ ] Run smoke test manually if critical change

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
main branch push →
  1. Quality checks (lint, type, build)
  2. E2E tests (Playwright)
  3. Deploy to Cloudflare Pages
  4. Run smoke tests
  5. Notify on failure
```

### Preview Deployments
```yaml
PR opened/updated →
  1. Quality checks
  2. Build
  3. Deploy preview
  4. Comment URL on PR
  5. Run basic tests
```

## Monitoring Deployments

### Real-time Monitoring
- Cloudflare Dashboard → Pages → litecky-editing → Deployments
- GitHub Actions tab for CI status
- `wrangler tail` for Worker logs

### Alerts
- GitHub Actions failures → Email
- Build failures → Cloudflare dashboard
- Runtime errors → Function logs

## Environment-Specific Configuration

### Production
- Real Turnstile keys
- Production SendGrid templates
- Analytics enabled
- Caching aggressive

### Preview
- Test Turnstile keys available
- Sandbox mode for emails
- Analytics enabled
- Caching moderate

### Development
- Test keys only
- Local email testing
- No analytics
- No caching

## Troubleshooting Deployments

### Build Failures
```bash
# Check build logs
# Cloudflare Dashboard → Pages → Deployments → View build log

# Common issues:
- Missing environment variable
- TypeScript error
- Dependency issue
- Memory limit exceeded
```

### Deployment Stuck
```bash
# Cancel and retry
# Dashboard → Cancel deployment

# Or trigger new build
git commit --allow-empty -m "chore: trigger build"
git push origin main
```

### Wrong Content Deployed
```bash
# Verify correct branch
git branch --show-current

# Check latest commit
git log -1 --oneline

# Force cache purge
# Dashboard → Caching → Purge Everything
```

## Performance Optimization

### Build Optimization
- Cache dependencies in CI
- Minimize build output
- Use production builds
- Tree-shake unused code

### Deployment Speed
- Average build time: 2-3 minutes
- Propagation time: <1 minute
- Cache purge: ~30 seconds

## Security Considerations

### Secrets Management
- Never commit secrets
- Use environment variables
- Rotate keys regularly
- Document in SECRETS.md

### Access Control
- Limit deployment permissions
- Use API tokens, not global keys
- Enable 2FA on all accounts
- Audit access quarterly

## Related Documentation
- [ENVIRONMENT.md](./ENVIRONMENT.md) - Environment variables
- [SECRETS.md](./SECRETS.md) - Secret management
- [RUNBOOK.md](./RUNBOOK.md) - Operations procedures
```

## SECRETS.md
```markdown
# Secrets Inventory and Management

⚠️ **This document contains NO actual secret values** ⚠️

## Secret Inventory

| Key | Service | Location | Purpose | Rotation | Last Rotated | Owner |
|-----|---------|----------|---------|----------|--------------|-------|
| `TURNSTILE_SITE_KEY` | Cloudflare Pages | Variable (public) | Client-side widget | Never | N/A | Tech Lead |
| `TURNSTILE_SECRET_KEY` | Cloudflare Pages | Secret | Server-side verification | 6 months | 2025-09 | Tech Lead |
| `SENDGRID_API_KEY` | Cloudflare Pages | Secret | Email sending | 6 months | 2025-09 | Tech Lead |
| `SENDGRID_CONTACT_TEMPLATE_ID` | Cloudflare Pages | Variable | Email template | On change | 2025-09 | Marketing |
| `SENDGRID_CONFIRMATION_TEMPLATE_ID` | Cloudflare Pages | Variable | Email template | On change | 2025-09 | Marketing |
| `GITHUB_OAUTH_ID` | Worker (decap-oauth) | Secret | CMS authentication | Yearly | 2025-09 | Tech Lead |
| `GITHUB_OAUTH_SECRET` | Worker (decap-oauth) | Secret | CMS authentication | Yearly | 2025-09 | Tech Lead |
| `CLOUDFLARE_API_TOKEN` | GitHub Actions | Secret | CI/CD deployment | 6 months | 2025-09 | DevOps |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions | Secret | CI/CD deployment | Never | N/A | DevOps |

## Test/Development Keys

These are safe for development use only:

| Key | Value | Purpose |
|-----|-------|---------|
| `TURNSTILE_TEST_SITE_KEY` | `1x00000000000000000000AA` | Always passes |
| `TURNSTILE_TEST_SECRET_KEY` | `2x0000000000000000000000000000000AA` | Validates test tokens |

## Secret Sources

### Cloudflare Turnstile
1. Log into Cloudflare Dashboard
2. Navigate to Turnstile
3. Create/manage widgets
4. Copy keys

### SendGrid
1. Log into SendGrid Dashboard
2. Settings → API Keys
3. Create key with "Mail Send" permission
4. Save immediately (shown once)

### GitHub OAuth
1. GitHub Settings → Developer settings
2. OAuth Apps → New OAuth App
3. Set callback: `https://cms-auth.liteckyeditingservices.com/callback`
4. Generate client secret

### Cloudflare API
1. Cloudflare Dashboard → My Profile
2. API Tokens → Create Token
3. Use "Edit Cloudflare Workers" template
4. Scope to specific zone

## Local Development Setup

### Using gopass (Recommended)
```bash
# Install gopass and age
brew install gopass age

# Initialize with age backend
gopass init --crypto age

# Add secrets
gopass insert cloudflare/turnstile/secret
gopass insert sendgrid/api-key

# Export to .dev.vars
./scripts/export-dev-vars.sh
```

### Manual Setup
```bash
# Copy template
cp apps/site/.dev.vars.example apps/site/.dev.vars

# Edit with your values
vim apps/site/.dev.vars
```

## Rotation Procedures

### Turnstile Keys
1. Create new widget in Cloudflare Dashboard
2. Update `TURNSTILE_SITE_KEY` in Pages variables
3. Update `TURNSTILE_SECRET_KEY` in Pages secrets
4. Update client-side code if site key hardcoded
5. Redeploy
6. Delete old widget after verification

### SendGrid API Key
```bash
# 1. Create new key in SendGrid
# 2. Update in Cloudflare Pages
# 3. Test with preview deployment
# 4. Delete old key in SendGrid
```

### GitHub OAuth
```bash
# 1. Generate new secret in GitHub OAuth App
# 2. Update Worker secret
cd workers/decap-oauth
wrangler secret put GITHUB_OAUTH_SECRET
# 3. Deploy Worker
wrangler deploy
# 4. Test CMS login
```

### Cloudflare API Token
1. Create new token in Cloudflare Dashboard
2. Update in GitHub Actions secrets
3. Test with manual workflow run
4. Delete old token

## Emergency Access

### Break Glass Procedure
1. Log into Cloudflare Dashboard with admin account
2. Pages → Settings → Environment variables
3. Update compromised secret immediately
4. Trigger redeploy
5. Document incident

### Recovery Contacts
- Primary: tech-lead@company.com
- Secondary: ops@company.com
- Cloudflare Support: (if account issue)

## Compliance Notes

- No PII stored in secrets
- No shared accounts
- Secrets never in code
- Audit trail via Cloudflare Audit Log
- Quarterly rotation review

## Verification Commands

```bash
# Test Turnstile is working
curl -X POST https://liteckyeditingservices.com/api/contact \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "test=1&sandbox=1"

# Test SendGrid connection
# (Requires valid API key in Pages)
# Check via preview deployment with test form

# Test OAuth proxy
curl https://cms-auth.liteckyeditingservices.com/
# Should return: "Litecky Decap OAuth Proxy - Operational"
```

## Related Documentation
- [ENVIRONMENT.md](./ENVIRONMENT.md) - Where secrets are used
- [RUNBOOK.md](./RUNBOOK.md) - Rotation procedures
- [docs/playbooks/](./docs/playbooks/) - Service-specific guides
```

## ENVIRONMENT.md
```markdown
# Environment Variables Reference

## Variable Matrix

| Variable | Production | Preview | Development | Type | Required |
|----------|------------|---------|-------------|------|----------|
| **Turnstile** |
| `PUBLIC_TURNSTILE_SITE_KEY` | Real key | Real key | Test key | Public | Yes |
| `TURNSTILE_SECRET_KEY` | Real secret | Real secret | Test secret | Secret | Yes |
| `USE_TURNSTILE_TEST` | - | `1` | `1` | Variable | No |
| `TURNSTILE_TEST_SITE_KEY` | - | Test key | Test key | Variable | No |
| `TURNSTILE_TEST_SECRET_KEY` | - | Test secret | Test secret | Secret | No |
| **SendGrid** |
| `SENDGRID_API_KEY` | Real key | Real key | Test key | Secret | Yes |
| `SENDGRID_CONTACT_TEMPLATE_ID` | `d-prod123` | `d-prev456` | `d-test789` | Variable | Yes |
| `SENDGRID_CONFIRMATION_TEMPLATE_ID` | `d-prod234` | `d-prev567` | `d-test890` | Variable | Yes |
| **Admin** |
| `ADMIN_EMAIL` | admin@domain | admin@domain | test@test | Variable | Yes |
| **Site** |
| `PUBLIC_SITE_NAME` | Litecky Editing | Litecky (Preview) | Litecky (Dev) | Variable | Yes |
| `PUBLIC_SITE_URL` | https://site.com | Preview URL | http://localhost | Variable | Yes |
| **System** |
| `ENVIRONMENT` | `production` | `preview` | `development` | Variable | Yes |
| `DEBUG` | - | `true` | `true` | Variable | No |

## Setting Environment Variables

### Cloudflare Pages Dashboard

1. Navigate to Pages project
2. Settings → Environment variables
3. Choose environment (Production/Preview)
4. Add variable (public) or secret (encrypted)

### Local Development (.dev.vars)

```bash
# apps/site/.dev.vars
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=2x0000000000000000000000000000000AA
SENDGRID_API_KEY=SG.test_key_here
ADMIN_EMAIL=test@example.com
ENVIRONMENT=development
DEBUG=true
```

### Worker Secrets

```bash
cd workers/decap-oauth
wrangler secret put GITHUB_OAUTH_ID
wrangler secret put GITHUB_OAUTH_SECRET
```

### GitHub Actions Secrets

Repository → Settings → Secrets and variables → Actions

Required:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Accessing Variables in Code

### Astro Pages
```typescript
// In .astro files
const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
```

### Pages Functions
```typescript
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const apiKey = env.SENDGRID_API_KEY;
};
```

### Svelte Components
```typescript
const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
```

### Workers
```typescript
export default {
  async fetch(request: Request, env: Env) {
    const clientId = env.GITHUB_OAUTH_ID;
  }
};
```

## Type Safety

### Type Definition
```typescript
// env.d.ts
interface ImportMetaEnv {
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
  readonly PUBLIC_SITE_NAME: string;
  readonly PUBLIC_SITE_URL: string;
  // ... other public vars
}

interface Env {
  TURNSTILE_SECRET_KEY: string;
  SENDGRID_API_KEY: string;
  // ... other secrets
}
```

## Best Practices

### Naming Convention
- `PUBLIC_*` - Available in browser
- `*_KEY/*_SECRET` - Sensitive values
- `*_ID` - Identifiers
- `USE_*` - Feature flags

### Security
- Never log secret values
- Don't commit .dev.vars
- Use encrypted secrets in Cloudflare
- Rotate keys regularly

### Validation
```typescript
// Validate at startup
function validateEnv(env: unknown): Env {
  if (!env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY required');
  }
  // ... more checks
  return env as Env;
}
```

## Troubleshooting

### Variable Not Found
1. Check spelling (case-sensitive)
2. Verify environment (prod/preview/dev)
3. Restart dev server after changes
4. Check .dev.vars exists locally

### Wrong Value Used
1. Check environment precedence
2. Clear cache if needed
3. Verify no hardcoded values
4. Check build logs

## Related Documentation
- [SECRETS.md](./SECRETS.md) - Secret management
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Environment setup
- [docs/onboarding.md](./docs/onboarding.md) - Developer setup
```

## Additional Key Documents

### docs/onboarding.md
```markdown
# Developer Onboarding

Welcome! This guide will get you productive in ~45 minutes.

## Prerequisites

### Required Tools
- **Node.js 24+** (install via [nvm](https://github.com/nvm-sh/nvm))
- **pnpm 10.16+** (`npm install -g pnpm@10.16.0`)
- **Git** (with GitHub account)

### Optional Tools
- **gopass + age** (for secret management)
- **VS Code** (with recommended extensions)
- **Wrangler** (installed automatically)

## Step 1: Clone and Install (5 minutes)

```bash
# Clone repository
git clone https://github.com/YOUR_ORG/litecky-editing
cd litecky-editing

# Install dependencies
pnpm install

# Install Playwright browsers (for testing)
pnpm exec playwright install chromium
```

## Step 2: Environment Setup (10 minutes)

### Option A: Using gopass (Recommended)
```bash
# Get access to gopass store from team lead
# Then export secrets
./scripts/export-dev-vars.sh
```

### Option B: Manual Setup
```bash
# Copy templates
cp apps/site/.dev.vars.example apps/site/.dev.vars

# Edit with test values
# - Use Turnstile test keys (see SECRETS.md)
# - Use SendGrid test key or sandbox mode
# - Set USE_TURNSTILE_TEST=1
```

## Step 3: Verify Setup (5 minutes)

```bash
# Start development server
pnpm dev

# Open in browser
open http://localhost:4321

# Verify:
# ✓ Homepage loads
# ✓ Navigation works
# ✓ Contact form renders
```

## Step 4: Test CMS Access (5 minutes)

```bash
# CMS is at /admin
open http://localhost:4321/admin

# For local testing:
# - You'll see GitHub login
# - Need write access to repo
# - Contact team lead for access
```

## Step 5: Run Quality Checks (5 minutes)

```bash
# Run all checks
pnpm check

# Run E2E tests
pnpm test:e2e

# You should see all green!
```

## Step 6: Make a Test Change (10 minutes)

```bash
# Create feature branch
git checkout -b test/your-name-onboarding

# Edit a page
vim apps/site/src/content/pages/about.md

# Run checks
pnpm check

# Commit
git add .
git commit -m "test: onboarding edit"

# Push and open PR
git push origin test/your-name-onboarding
```

## Step 7: Understand the Codebase (5 minutes)

### Key Directories
- `apps/site/` - Main website (Astro)
- `workers/` - Cloudflare Workers
- `docs/` - Documentation
- `scripts/` - Build and utility scripts

### Important Files
- `RUNBOOK.md` - Operations guide
- `ARCHITECTURE.md` - System design
- `.github/workflows/` - CI/CD pipelines

## Development Workflow

### Daily Flow
1. Pull latest: `git pull origin main`
2. Create branch: `git checkout -b feature/thing`
3. Make changes
4. Test: `pnpm check`
5. Commit and push
6. Open PR
7. Wait for checks
8. Merge after approval

### Testing
- **Local**: `pnpm test:e2e`
- **CI**: Automatic on PR
- **Smoke**: Nightly at 2:30 AM Alaska

### Deployment
- **Automatic**: Push to main → deployed
- **Preview**: Every PR gets URL
- **Rollback**: See RUNBOOK.md

## Common Tasks

### Update Content
- Edit files in `src/content/`
- Or use CMS at `/admin`

### Add Environment Variable
1. Add to `.dev.vars` locally
2. Add to Cloudflare dashboard
3. Document in ENVIRONMENT.md

### Debug Issue
1. Check browser console
2. Check Pages Functions logs
3. Check Worker logs if OAuth issue

## Getting Help

### Documentation
- `RUNBOOK.md` - Operations
- `docs/playbooks/` - Specific guides
- `docs/decisions/` - Why things are done

### People
- Team Lead: @github-username
- Ops: ops@company.com

### Tools
- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [SendGrid Dashboard](https://app.sendgrid.com)
- [GitHub Issues](https://github.com/YOUR_ORG/litecky-editing/issues)

## VS Code Setup (Optional)

### Install Extensions
```bash
code --install-extension biomejs.biome
code --install-extension astro-build.astro-vscode
code --install-extension svelte.svelte-vscode
code --install-extension bradlc.vscode-tailwindcss
```

### Settings
Already configured in `.vscode/settings.json`

## Troubleshooting

### Port already in use
```bash
lsof -i :4321
kill -9 <PID>
```

### Dependencies won't install
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### CMS won't load
- Check you have repo access
- Verify OAuth proxy is running
- Check browser console for errors

## Next Steps

1. Review ARCHITECTURE.md
2. Browse existing code
3. Pick a small issue to work on
4. Ask questions in Slack/Discord

Welcome aboard! 🚀
```

### docs/playbooks/email-issues.md
```markdown
# Email Issues Playbook

## Diagnosing Email Problems

### Step 1: Check SendGrid Status
1. Log into [SendGrid Dashboard](https://app.sendgrid.com)
2. Check Activity Feed
3. Look for:
   - Bounces (bad email address)
   - Blocks (spam/reputation issue)
   - Deferred (temporary failure)
   - Delivered (success)

### Step 2: Verify Domain Authentication
```bash
# Check DKIM records
dig txt s1._domainkey.liteckyeditingservices.com
dig txt s2._domainkey.liteckyeditingservices.com

# Check SPF record
dig txt liteckyeditingservices.com | grep spf
```

Dashboard: Settings → Sender Authentication → Verify

### Step 3: Test API Connection
```bash
# Test with curl
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "personalizations": [{
      "to": [{"email": "test@example.com"}]
    }],
    "from": {"email": "noreply@liteckyeditingservices.com"},
    "subject": "Test",
    "content": [{"type": "text/plain", "value": "Test"}]
  }'
```

### Step 4: Check Template IDs
- Dashboard → Email API → Dynamic Templates
- Verify IDs match environment variables
- Test template with preview send

## Common Issues and Solutions

### Emails Not Sending

**Symptom**: Form submits but no email received

**Check**:
1. Pages Function logs for errors
2. SendGrid Activity for blocks
3. Spam folders
4. Template ID correct

**Fix**:
```bash
# Verify API key
wrangler pages secret list --project-name=litecky-editing

# Update if needed
wrangler pages secret put SENDGRID_API_KEY --project-name=litecky-editing
```

### Authentication Failures

**Symptom**: 401 errors in logs

**Fix**:
1. Regenerate API key in SendGrid
2. Update in Cloudflare Pages
3. Redeploy

### Domain Verification Lost

**Symptom**: Emails go to spam or bounce

**Fix**:
1. Re-authenticate domain in SendGrid
2. Update DNS records in Cloudflare
3. Wait 24-48 hours for propagation

### Rate Limiting

**Symptom**: 429 errors after multiple sends

**Fix**:
1. Check SendGrid plan limits
2. Implement client-side throttling
3. Use queue for bulk sends

## Testing Email Delivery

### Local Testing with Sandbox
```javascript
// In contact function
const sandboxMode = env.ENVIRONMENT === 'development';

const payload = {
  // ... normal payload
  mail_settings: sandboxMode ? {
    sandbox_mode: { enable: true }
  } : undefined
};
```

### Preview Environment Testing
1. Use preview deployment URL
2. Submit form with real email
3. Check SendGrid Activity
4. Verify both emails sent

### Load Testing
```bash
# Don't do this in production!
for i in {1..10}; do
  curl -X POST https://preview.litecky-editing.pages.dev/api/contact \
    -d "name=Test$i&email=test@example.com&message=Test&sandbox=1"
  sleep 2
done
```

## Monitoring

### Set Up Webhooks
1. SendGrid → Settings → Mail Settings → Event Webhook
2. Point to Worker endpoint
3. Track bounces, opens, clicks

### Daily Health Check
```bash
# Add to nightly smoke test
curl -X POST $URL/api/contact \
  -d "name=Health&email=health@test.com&message=Daily&sandbox=1"
```

## Emergency Procedures

### All Emails Failing
1. **Immediate**: Enable fallback notifications
2. **Check**: SendGrid account status
3. **Verify**: API key not revoked
4. **Test**: Manual send via dashboard
5. **Escalate**: SendGrid support if needed

### Switch to Backup Provider
```javascript
// In contact function
try {
  await sendViaSendGrid(payload);
} catch (error) {
  console.error('SendGrid failed:', error);
  await sendViaBackup(payload); // Implement backup
}
```

## Related Documentation
- [SECRETS.md](../../SECRETS.md) - API key management
- [ENVIRONMENT.md](../../ENVIRONMENT.md) - Template IDs
- [RUNBOOK.md](../../RUNBOOK.md) - General operations
```

### .github/CODEOWNERS
```
# Default owner for everything
* @YOUR_GITHUB_USERNAME

# Documentation
/docs/ @YOUR_GITHUB_USERNAME
*.md @YOUR_GITHUB_USERNAME

# Infrastructure
/workers/ @YOUR_GITHUB_USERNAME
/.github/ @YOUR_GITHUB_USERNAME
/functions/ @YOUR_GITHUB_USERNAME

# Configuration
*.toml @YOUR_GITHUB_USERNAME
*.json @YOUR_GITHUB_USERNAME
*.yml @YOUR_GITHUB_USERNAME
*.yaml @YOUR_GITHUB_USERNAME

# Content can be edited by editors
/apps/site/src/content/ @YOUR_GITHUB_USERNAME @YOUR_WIFE_USERNAME
```

This comprehensive documentation suite ensures that any developer can understand, run, and maintain your system with minimal ramp-up time. Each document is focused, actionable, and cross-referenced for easy navigation.
