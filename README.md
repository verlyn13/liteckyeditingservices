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
# Prerequisites: mise (version manager)
# Optional: gopass/age for secret management

# 1. Clone and install
git clone https://github.com/verlyn13/liteckyeditingservices
cd liteckyeditingservices
mise install  # Installs Node 24 and pnpm 10.16
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
├── docs/               # Detailed documentation
└── _archive/           # Original specification documents
```

## Deployment

- **Automatic**: Push to `main` branch triggers deployment via Cloudflare Pages
- **Preview**: Every PR gets a preview URL automatically
- **Rollback**: Revert commit or use Cloudflare dashboard

## Content Management

- **For editors**: Use the CMS at `/admin` (requires GitHub access)
- **For developers**: Edit Markdown files in `apps/site/src/content/`

## Getting Help

- **Project Status**: See [PROJECT-STATUS.md](./PROJECT-STATUS.md)
- **Implementation Roadmap**: See [IMPLEMENTATION-ROADMAP.md](./IMPLEMENTATION-ROADMAP.md)
- **Documentation Index**: See [DOCUMENTATION-MASTER-INDEX.md](./DOCUMENTATION-MASTER-INDEX.md)
- **New developer setup**: See [docs/onboarding.md](./docs/onboarding.md)
- **Specific problems**: Check [docs/playbooks/](./docs/playbooks/)

## License

Private repository - All rights reserved