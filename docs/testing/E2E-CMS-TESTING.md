# E2E Testing with CMS Functions

## Overview

CMS endpoints (`/api/*` and `/admin/config.yml`) are implemented as Cloudflare Pages Functions and only work when running via Wrangler, not with the standard Astro dev server.

## Running CMS Tests

### Option 1: Automated (Playwright webServer)

Playwright is configured to automatically build and start Wrangler:

```bash
pnpm test:cms
```

The `playwright.config.ts` webServer configuration:
- Runs `pnpm build` to create the dist folder
- Starts `wrangler pages dev dist --port 4321 --local`
- Waits for the server to be ready before running tests

**Configuration:**
- `reuseExistingServer: !process.env.CI` - Reuses server locally, fresh in CI
- `timeout: 180_000` - 3 minutes for build + startup
- `stdout/stderr: 'pipe'` - Captures logs for debugging

### Option 2: Manual (Two Terminal Approach)

If Playwright's webServer isn't starting properly:

**Terminal 1 - Start server:**
```bash
pnpm dev:functions
# or manually:
# pnpm build && pnpm exec wrangler pages dev dist --port 4321 --local
```

**Terminal 2 - Run tests:**
```bash
pnpm test:cms
```

### Option 3: Test Against Production

```bash
pnpm test:cms:prod
```

This sets `BASE_URL=https://www.liteckyeditingservices.com` and skips the local server.

## Troubleshooting

### Server Not Starting

If Playwright hangs waiting for the server:

1. Check if port 4321 is already in use:
   ```bash
   lsof -i :4321
   ```

2. Kill any existing processes:
   ```bash
   kill -9 <PID>
   ```

3. Try manual approach (Option 2 above)

### Functions Return 404

This means you're hitting the Astro dev server instead of Wrangler:

- ✅ Correct: `wrangler pages dev dist` serves Functions
- ❌ Wrong: `astro dev` does NOT serve Functions

### Environment Variables

Local testing uses `.dev.vars` file (gitignored). Required variables:
- `PUBLIC_TURNSTILE_SITE_KEY` - Test key from Cloudflare
- `TURNSTILE_SECRET_KEY` - Test secret from Cloudflare
- `SENDGRID_API_KEY` - SendGrid API key (optional for CMS tests)

See `ENVIRONMENT.md` for complete list.

## CI/CD Considerations

In GitHub Actions:
- Wrangler is available in CI
- `CI=true` ensures fresh server start (no reuse)
- Environment secrets are injected from repository secrets
- Build artifacts are cached for faster subsequent runs

## Related Files

- `playwright.config.ts` - Main Playwright configuration
- `scripts/dev-with-functions.sh` - Helper script for manual testing
- `package.json` - Contains `dev:functions` and `test:cms` scripts
- `functions/` - Cloudflare Pages Functions implementations
