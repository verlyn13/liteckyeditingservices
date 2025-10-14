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

> **For complete PR workflow with visual regression testing**, see **[docs/playbooks/pr-workflow.md](docs/playbooks/pr-workflow.md)**

1. Create feature branch from `main`
2. Make changes and test locally
3. Run quality checks: `pnpm check`
4. **Run visual tests**: `pnpm test:visual` (update baselines if UI changed)
5. Push and open PR
6. **CI runs automatically**: Quality Gate + Visual Regression Tests
7. **If visual tests fail**: Run `pnpm test:visual:update`, commit baselines, push
8. Wait for all CI checks to pass (green ✅)
9. Request review if needed
10. Merge after approval

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
cp .dev.vars.example .dev.vars
direnv allow .  # loads .dev.vars via .envrc
```

## Quality Standards

### Before Committing

```bash
# Run all checks
pnpm check

# Or individually:
pnpm run typecheck               # TypeScript checks (root + workers)
pnpm run lint                    # ESLint for Astro/Svelte
pnpm exec prettier --check .     # verify formatting (optional)
```

### Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# E2E with UI
pnpm test:e2e:ui

# Visual regression tests
pnpm test:visual

# Update visual baselines (after UI changes)
pnpm test:visual:update

# Accessibility tests
pnpm test:a11y
```

**Important**: Always run visual tests before pushing UI changes. See [docs/playbooks/pr-workflow.md](docs/playbooks/pr-workflow.md) for complete workflow.

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

> **For complete CI/CD workflow details**, see **[docs/playbooks/pr-workflow.md](docs/playbooks/pr-workflow.md)**

### Automated Checks

Every PR runs:

1. **Quality Gate** (`quality-gate.yml`):
   - Preflight checks (CI configuration validation)
   - Structure validation (required files/directories)
   - Code quality (Biome, Prettier, ESLint)
   - Type checking (TypeScript, Astro, Svelte)
   - Build verification
   - Sentry sourcemap upload

2. **Visual Regression Tests** (`e2e-visual.yml`):
   - Component screenshots (header, footer, hero, contact form)
   - Comparison against baseline snapshots
   - **Fails PR if snapshots don't match** (expected for UI changes)
   - Platform-specific baselines (Linux in CI, Darwin locally)

3. **Preview Deployment**:
   - Automatic Cloudflare Pages preview deployment
   - Preview URL posted in PR comments
   - Manual verification in live environment

### Handling Visual Test Failures

When visual tests fail (snapshot mismatch):

1. **Review the changes**: Is this expected? (e.g., you changed colors, layout, favicon)
2. **Update baselines locally**: `pnpm test:visual:update`
3. **Commit updated snapshots**: `git add tests/e2e/__screenshots__/ && git commit -m "test: update visual baselines for [reason]"`
4. **Push to PR**: CI re-runs and passes

See [docs/playbooks/pr-workflow.md](docs/playbooks/pr-workflow.md) for detailed troubleshooting.

## Branch Management

- Default branch: `main`
- Protect `main` with required status checks:
  - Require passing: "Quality Gate", "Documentation Health"
  - Require PR review before merging
  - Disallow force pushes and deletions
- Feature flow:
  - Create `feature/*`, `fix/*`, `docs/*`, `deps/*` branches
  - Open PRs to `main`; ensure CI is green
  - Use Conventional Commits in PR titles/descriptions

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
