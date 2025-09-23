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
- mise (for version management)
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
- Contact maintainer (see package.json)