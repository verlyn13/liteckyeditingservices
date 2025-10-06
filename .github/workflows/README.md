# GitHub Actions Workflows

## Deployment Configuration

**This project uses Git-connected Cloudflare Pages deployment** - automatic deployment happens when you push to GitHub. No manual `wrangler deploy` needed.

### Required Configuration

#### Repository Variables (Settings → Secrets and variables → Actions → Variables)
- **`CF_GIT_CONNECTED=true`** - Tells `deploy-production.yml` to skip manual deployment (set to `true` for Git-connected mode)

#### Repository Secrets (Settings → Secrets and variables → Actions → Secrets)
- **`CLOUDFLARE_API_TOKEN`** - Cloudflare API token (only needed for manual deployments or API calls)
- **`CLOUDFLARE_ACCOUNT_ID`** - Cloudflare account ID

### How Deployment Works

1. **Git-Connected Mode (Current)**:
   - `CF_GIT_CONNECTED=true` → `deploy-production.yml` runs the `noop` job and skips deployment
   - Cloudflare Pages automatically deploys when you push to `main`
   - Preview deployments automatically created for PRs

2. **Manual Mode** (if Git connection is disabled):
   - `CF_GIT_CONNECTED` not set or `false` → `deploy-production.yml` runs the `deploy` job
   - Uses Wrangler CLI to deploy `dist/` to Cloudflare Pages
   - Uses Cloudflare Pages REST API to promote preview to production

## Workflow Files

### deploy-production.yml
**Trigger**: Push to `main` or manual dispatch

**Jobs**:
- **`noop`** - Runs when `CF_GIT_CONNECTED=true`, logs that Git-connected deployment is active
- **`deploy`** - Runs when `CF_GIT_CONNECTED!=true`, manually deploys via Wrangler and promotes to production

**Current Status**: Git-connected mode active, `noop` job runs on every push to `main`

### post-deploy-validation.yml
**Trigger**: After successful deployments (workflow_run) or manual dispatch

**Purpose**: Validates production deployment
- Tests security headers (15 tests)
- Smoke tests critical pages
- CMS admin route contract test

### preview-validation.yml
**Trigger**: Pull requests to `main`

**Purpose**: Validates preview deployments
- Fetches preview URL from Cloudflare Pages API
- Runs smoke tests against preview
- Comments on PR with results

### quality-gate.yml
**Trigger**: Pull requests

**Purpose**: Code quality checks
- TypeScript compilation
- Linting (Biome)
- Package version validation
- Repository structure validation

### e2e-visual.yml
**Trigger**: Push to `main` and PRs (blocking)

**Purpose**: Visual regression testing
- 4 targeted screenshots (header, footer, hero, contact form)
- Platform-specific baselines (darwin for local, linux for CI)
- Blocking check on main (Linux baselines seeded)

### visual-modern.yml
**Trigger**: Manual dispatch only (baseline update)

**Purpose**: Baseline update workflow
- Protected runner for seeding/updating Linux visual baselines
- Uses `concurrency: baselines-${{ github.ref }}` to prevent overlap
- Accepts `ref` input to seed from an exact branch/SHA
- Uploads `updated-baselines` artifact and attempts PR creation (policy permitting)

### Required vs Advisory Checks
- Required: Quality Gate, preview-validation, post-deploy-validation, e2e-visual

### Version Pin Policy
- Playwright toolchain is pinned to exact versions in `package.json` (no caret/range)
- CI runs `playwright install --with-deps` before tests to ensure consistent browsers

## Project Configuration

**Cloudflare Pages Project**: `liteckyeditingservices`
**Production URL**: https://liteckyeditingservices.com
**Build Command**: `pnpm build`
**Output Directory**: `dist`
**Node Version**: 24.x
**Package Manager**: pnpm 10.17.1

## Troubleshooting

### "deploy-production.yml is failing"
- **Check**: Is `CF_GIT_CONNECTED` set to `true` in repository variables?
- **Fix**: `gh variable set CF_GIT_CONNECTED --body "true"`
- **Expected**: The `deploy` job should be skipped, only `noop` should run

### "Cloudflare Pages isn't deploying automatically"
- **Check**: Is the GitHub repository connected in Cloudflare Pages dashboard?
- **Check**: Pages → liteckyeditingservices → Settings → Builds & deployments → Git configuration
- **Expected**: Repository should show as connected, branch should be `main`

### "Need to deploy manually"
- **Why**: Only if Git-connected deployment is broken
- **How**: See DEPLOYMENT.md for manual deployment instructions
- **Note**: Set `CF_GIT_CONNECTED` to empty or `false` to enable manual mode
