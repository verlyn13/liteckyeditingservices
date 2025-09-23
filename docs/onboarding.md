# Developer Onboarding

Welcome! This guide will get you productive in ~45 minutes.

## Prerequisites

### Required Tools
- **mise** (version manager - [install](https://mise.jdx.dev/))
- **Node.js 24+** (managed via mise)
- **pnpm 10.16+** (managed via mise)
- **Git** (with GitHub account)

### Optional Tools
- **gopass + age** (for secret management)
- **VS Code** (with recommended extensions)
- **Wrangler** (installed automatically)

## Step 1: Clone and Install (5 minutes)

```bash
# Clone repository
git clone https://github.com/verlyn13/liteckyeditingservices
cd liteckyeditingservices

# Activate mise (will install Node 24 and pnpm 10.16)
mise install
mise trust

# Install dependencies
pnpm install

# Install Playwright browsers (for testing)
pnpm exec playwright install chromium
```

## Step 2: Environment Setup (10 minutes)

### Option A: Using gopass (Recommended for team members)
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
# - Use Turnstile test keys (see ENVIRONMENT.md)
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
- `_archive/` - Original specification documents

### Important Files
- `PROJECT-STATUS.md` - Current implementation status
- `IMPLEMENTATION-ROADMAP.md` - Build order and dependencies
- `DOCUMENTATION-MASTER-INDEX.md` - All documentation references
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
- **Rollback**: Via Cloudflare dashboard

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
- `PROJECT-STATUS.md` - Implementation progress
- `IMPLEMENTATION-ROADMAP.md` - Build sequence
- `docs/playbooks/` - Specific guides
- `_archive/` - Original specifications

### Tools
- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [SendGrid Dashboard](https://app.sendgrid.com)
- [GitHub Issues](https://github.com/verlyn13/liteckyeditingservices/issues)

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

1. Review PROJECT-STATUS.md for current state
2. Check IMPLEMENTATION-ROADMAP.md for what's next
3. Browse existing code
4. Pick a small issue to work on

Welcome aboard! 🚀