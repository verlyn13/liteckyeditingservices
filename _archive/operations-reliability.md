# Litecky Editing - Complete Operations & Reliability Setup

## Overview

This setup provides automated testing, monitoring, dependency updates, and incident response procedures requiring minimal ongoing maintenance.

## 1. Playwright E2E Testing

### `package.json` (Add to root)
```json
{
  "devDependencies": {
    "@playwright/test": "^1.47.0"
  },
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:ci": "playwright test --reporter=github",
    "test:e2e:report": "playwright show-report"
  }
}
```

### `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI 
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'on-failure' }]],
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
  
  webServer: process.env.CI ? undefined : {
    command: 'pnpm dev',
    port: 4321,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### `tests/e2e/smoke.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Critical User Paths', () => {
  test('homepage loads with essential elements', async ({ page }) => {
    await page.goto('/');
    
    // Title and meta
    await expect(page).toHaveTitle(/Litecky Editing Services/i);
    
    // Critical content visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // CTA buttons present
    await expect(page.getByRole('button', { name: /quote/i })).toBeVisible();
    
    // Contact form link works
    const contactLink = page.getByRole('link', { name: /contact/i });
    await expect(contactLink).toBeVisible();
  });

  test('navigation works on mobile', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    
    await page.goto('/');
    
    // Mobile menu toggle
    const menuButton = page.getByRole('button', { name: /menu/i });
    await expect(menuButton).toBeVisible();
    
    await menuButton.click();
    
    // Menu opens with links
    await expect(page.getByRole('link', { name: /services/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /process/i })).toBeVisible();
  });

  test('contact form renders with Turnstile', async ({ page }) => {
    await page.goto('/contact');
    
    // Form fields present
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
    
    // Turnstile widget loads
    await expect(page.locator('.cf-turnstile')).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Self-Test Mode (Preview Only)', () => {
  test.beforeEach(async ({ page }) => {
    // Skip if not in preview/test mode
    const response = await page.goto('/self-test');
    if (response?.status() === 404) {
      test.skip(true, 'Self-test disabled in production');
    }
  });

  test('self-test form submits successfully', async ({ page }) => {
    await page.goto('/self-test');
    
    // Wait for Turnstile test widget
    await page.waitForSelector('.cf-turnstile iframe', { timeout: 15000 });
    
    // Submit form (test widget auto-provides token)
    const submitButton = page.getByRole('button', { name: /send/i });
    
    // Listen for API response
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/contact') && response.ok()
    );
    
    await submitButton.click();
    const response = await responsePromise;
    
    // Verify success response
    const json = await response.json();
    expect(json).toHaveProperty('ok', true);
  });
});

test.describe('Accessibility', () => {
  test('homepage meets WCAG basics', async ({ page }) => {
    await page.goto('/');
    
    // All images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      await expect(images.nth(i)).toHaveAttribute('alt', /.+/);
    }
    
    // Headings in order
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    
    // Links have accessible text
    const links = page.locator('a');
    const linkCount = await links.count();
    for (let i = 0; i < linkCount; i++) {
      const text = await links.nth(i).textContent();
      const ariaLabel = await links.nth(i).getAttribute('aria-label');
      expect(text || ariaLabel).toBeTruthy();
    }
  });
});
```

## 2. Self-Test Page (Preview/Dev Only)

### `apps/site/src/pages/self-test.astro`
```astro
---
// Only render in preview/dev environments
const isTestMode = import.meta.env.USE_TURNSTILE_TEST === '1';
const isLocal = import.meta.env.DEV;

if (!isTestMode && !isLocal) {
  return Astro.redirect('/404');
}

// Test keys from Cloudflare Turnstile docs
const TURNSTILE_TEST_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_TEST_SITE_KEY || '1x00000000000000000000AA';
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>System Self-Test</title>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 600px;
      margin: 2rem auto;
      padding: 1rem;
      background: #f5f5f5;
    }
    form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 600;
    }
    input, textarea, select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      background: #5A716A;
      color: white;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }
    button:hover {
      background: #4a5d5a;
    }
    .notice {
      background: #fff3cd;
      border: 1px solid #ffc107;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .result {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 4px;
    }
    .success {
      background: #d4edda;
      border: 1px solid #28a745;
      color: #155724;
    }
    .error {
      background: #f8d7da;
      border: 1px solid #dc3545;
      color: #721c24;
    }
  </style>
</head>
<body>
  <h1>🧪 System Self-Test</h1>
  
  <div class="notice">
    <strong>⚠️ Test Mode Only</strong><br>
    This page is only available in preview/development environments.
    It uses Turnstile test keys and SendGrid sandbox mode.
  </div>

  <form id="self-test-form" action="/api/contact" method="POST">
    <div class="form-group">
      <label for="name">Name (Test)</label>
      <input type="text" id="name" name="name" value="Test User" required>
    </div>
    
    <div class="form-group">
      <label for="email">Email (Test)</label>
      <input type="email" id="email" name="email" value="test@example.com" required>
    </div>
    
    <div class="form-group">
      <label for="service">Service</label>
      <select id="service" name="service">
        <option value="smoke-test">Smoke Test</option>
        <option value="dissertation">Dissertation Editing</option>
        <option value="thesis">Thesis Editing</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" name="message" rows="3" required>This is an automated self-test submission.</textarea>
    </div>
    
    <!-- Turnstile Test Widget -->
    <div class="cf-turnstile" 
         data-sitekey={TURNSTILE_TEST_SITE_KEY}
         data-callback="onTurnstileSuccess"
         data-error-callback="onTurnstileError"></div>
    
    <!-- Sandbox Mode Flag -->
    <input type="hidden" name="sandbox" value="1">
    
    <button type="submit">Run Test</button>
    
    <div id="result"></div>
  </form>

  <script>
    window.onTurnstileSuccess = function(token) {
      console.log('Turnstile token received:', token.substring(0, 20) + '...');
    };
    
    window.onTurnstileError = function() {
      console.error('Turnstile error');
      document.getElementById('result').innerHTML = 
        '<div class="result error">Turnstile verification failed</div>';
    };
    
    document.getElementById('self-test-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = '<div class="result">Testing...</div>';
      
      const formData = new FormData(e.target);
      
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (response.ok && data.ok) {
          resultDiv.innerHTML = `
            <div class="result success">
              ✅ Test Passed!<br>
              API responded with: ${JSON.stringify(data)}
            </div>
          `;
        } else {
          resultDiv.innerHTML = `
            <div class="result error">
              ❌ Test Failed<br>
              Status: ${response.status}<br>
              Response: ${JSON.stringify(data)}
            </div>
          `;
        }
      } catch (error) {
        resultDiv.innerHTML = `
          <div class="result error">
            ❌ Network Error<br>
            ${error.message}
          </div>
        `;
      }
    });
  </script>
</body>
</html>
```

### Updated `functions/api/contact.ts` (Add sandbox support)
```typescript
// Add to existing contact.ts function

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const formData = await request.formData();
  
  // Check for sandbox mode
  const isSandbox = formData.get('sandbox') === '1';
  const isTestMode = env.USE_TURNSTILE_TEST === '1';
  
  // ... existing validation ...
  
  // Use test secret in test mode
  const turnstileSecret = isTestMode 
    ? (env.TURNSTILE_TEST_SECRET_KEY || '2x0000000000000000000000000000000AA')
    : env.TURNSTILE_SECRET_KEY;
  
  // Verify Turnstile with appropriate secret
  const turnstileResponse = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: turnstileToken,
      })
    }
  );
  
  // ... existing verification ...
  
  // Prepare SendGrid payload with optional sandbox mode
  const emailPayload: any = {
    // ... existing payload setup ...
  };
  
  // Add sandbox mode if testing
  if (isSandbox) {
    emailPayload.mail_settings = {
      sandbox_mode: { enable: true }
    };
    
    // Log for debugging
    console.log('Sandbox mode enabled - no emails will be sent');
  }
  
  // ... rest of function ...
  
  // Return test-friendly response
  return new Response(
    JSON.stringify({ 
      ok: true,
      message: 'Contact form submitted successfully',
      sandbox: isSandbox
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
```

## 3. GitHub Actions Workflows

### `.github/workflows/quality-and-deploy.yml`
```yaml
name: Quality, Test, and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  deployments: write
  pull-requests: write

env:
  NODE_VERSION: '24'
  PNPM_VERSION: '10.16.0'

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run quality checks
        run: |
          pnpm exec biome ci .
          pnpm exec prettier --check "**/*.{astro,svelte}"
          pnpm exec eslint . --max-warnings 0
          pnpm exec tsc --noEmit
          pnpm --filter @ae/site exec astro check
          pnpm --filter @ae/site exec sv check --threshold error
      
      - name: Build site
        run: pnpm build:site
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: apps/site/dist
          retention-days: 7

  e2e-tests:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium
      
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build-output
          path: apps/site/dist
      
      - name: Run E2E tests
        run: pnpm test:e2e:ci
        env:
          BASE_URL: http://localhost:8788
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  deploy:
    needs: [quality, e2e-tests]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build-output
          path: apps/site/dist
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy apps/site/dist --project-name=litecky-editing --branch=main
      
      - name: Comment deployment URL
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Deployed to Cloudflare Pages'
            });
```

### `.github/workflows/nightly-smoke.yml`
```yaml
name: Nightly Smoke Tests

on:
  schedule:
    - cron: '30 10 * * *'  # 10:30 UTC daily (2:30 AM Alaska time)
  workflow_dispatch:
    inputs:
      verbose:
        description: 'Enable verbose logging'
        required: false
        default: false
        type: boolean

jobs:
  smoke-test:
    runs-on: ubuntu-latest
    steps:
      - name: Test homepage availability
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://liteckyeditingservices.com/)
          if [ $response -ne 200 ]; then
            echo "❌ Homepage returned $response"
            exit 1
          fi
          echo "✅ Homepage returned 200"
      
      - name: Test CMS availability
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://liteckyeditingservices.com/admin/)
          if [ $response -ne 200 ]; then
            echo "❌ CMS page returned $response"
            exit 1
          fi
          echo "✅ CMS page returned 200"
      
      - name: Test OAuth proxy health
        run: |
          response=$(curl -s https://cms-auth.liteckyeditingservices.com/)
          if [[ ! "$response" =~ "Operational" ]]; then
            echo "❌ OAuth proxy not operational"
            exit 1
          fi
          echo "✅ OAuth proxy operational"
      
      - name: Test contact API with sandbox
        run: |
          response=$(curl -s -X POST https://liteckyeditingservices.com/api/contact \
            -H "Content-Type: application/x-www-form-urlencoded" \
            -H "Origin: https://liteckyeditingservices.com" \
            -d "name=Nightly+Test&email=test@example.com&message=Automated+test&service=test&sandbox=1&cf-turnstile-response=test")
          
          if [[ "$response" =~ "error" ]] || [[ -z "$response" ]]; then
            echo "❌ Contact API test failed: $response"
            exit 1
          fi
          echo "✅ Contact API test passed"
      
      - name: Performance check
        run: |
          # Basic performance check using curl
          time=$(curl -o /dev/null -s -w '%{time_total}\n' https://liteckyeditingservices.com/)
          
          # Convert to milliseconds and check if under 3 seconds
          time_ms=$(echo "$time * 1000" | bc | cut -d. -f1)
          if [ $time_ms -gt 3000 ]; then
            echo "⚠️ Homepage load time: ${time_ms}ms (>3s)"
          else
            echo "✅ Homepage load time: ${time_ms}ms"
          fi
      
      - name: Send failure notification
        if: failure()
        run: |
          echo "Smoke tests failed! Check GitHub Actions log for details."
          # Optional: Add SendGrid notification here using curl
```

### `.github/workflows/dependency-updates.yml`
```yaml
name: Dependency Updates

on:
  schedule:
    - cron: '0 9 * * 1'  # Weekly on Monday
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  update-dependencies:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v4
        with:
          version: 10.16.0
      
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'pnpm'
      
      - name: Update dependencies
        run: |
          pnpm update --interactive false
          pnpm audit --fix
      
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'chore: update dependencies'
          title: 'Weekly dependency updates'
          body: |
            ## Weekly Dependency Updates
            
            This PR contains:
            - Package updates from `pnpm update`
            - Security fixes from `pnpm audit --fix`
            
            Please review the changes and merge if all tests pass.
          branch: deps/weekly-update
          labels: dependencies, automated
```

## 4. Renovate Configuration

### `renovate.json`
```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":dependencyDashboard",
    ":semanticCommitTypeAll(chore)"
  ],
  "timezone": "America/Anchorage",
  "schedule": ["every weekend"],
  "rangeStrategy": "bump",
  "postUpdateOptions": ["pnpmDedupe"],
  "labels": ["dependencies"],
  "assignees": ["YOUR_GITHUB_USERNAME"],
  
  "packageRules": [
    {
      "description": "Auto-merge non-major devDependencies",
      "matchDepTypes": ["devDependencies"],
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true,
      "automergeType": "branch"
    },
    {
      "description": "Group Astro ecosystem",
      "groupName": "astro",
      "matchPackagePatterns": ["^astro", "^@astrojs/"],
      "matchUpdateTypes": ["minor", "patch"]
    },
    {
      "description": "Group Svelte ecosystem",
      "groupName": "svelte",
      "matchPackagePatterns": ["^svelte", "^@sveltejs/"],
      "matchUpdateTypes": ["minor", "patch"]
    },
    {
      "description": "Group Cloudflare tools",
      "groupName": "cloudflare",
      "matchPackagePatterns": ["^wrangler$", "^@cloudflare/"],
      "matchUpdateTypes": ["minor", "patch"]
    },
    {
      "description": "Group linting tools",
      "groupName": "linters",
      "matchPackageNames": [
        "@biomejs/biome",
        "eslint",
        "prettier",
        "typescript"
      ],
      "matchPackagePatterns": ["^eslint-", "^prettier-plugin-"],
      "matchUpdateTypes": ["minor", "patch"]
    },
    {
      "description": "Require approval for major updates",
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "labels": ["dependencies", "major"]
    },
    {
      "description": "Security updates",
      "matchManagers": ["npm"],
      "matchDatasources": ["npm"],
      "vulnerabilityAlerts": {
        "labels": ["security"],
        "assignees": ["YOUR_GITHUB_USERNAME"],
        "reviewers": ["YOUR_GITHUB_USERNAME"]
      }
    },
    {
      "description": "Pin GitHub Actions",
      "matchManagers": ["github-actions"],
      "automerge": true,
      "automergeType": "branch"
    }
  ],
  
  "prConcurrentLimit": 3,
  "prCreation": "not-pending",
  "rebaseWhen": "behind-base-branch",
  "semanticCommits": "enabled",
  "commitMessagePrefix": "chore(deps):",
  
  "ignoreDeps": [],
  "ignorePaths": ["**/node_modules/**", "**/dist/**", "**/.astro/**"]
}
```

## 5. Operations Runbook

### `RUNBOOK.md`
```markdown
# Operations Runbook - Litecky Editing Services

## Quick Reference

- **Site**: https://liteckyeditingservices.com (Cloudflare Pages)
- **CMS**: https://liteckyeditingservices.com/admin (Decap CMS)
- **OAuth**: https://cms-auth.liteckyeditingservices.com (Cloudflare Worker)
- **Repository**: github.com/YOUR_USERNAME/litecky-editing
- **Dashboard**: [Cloudflare Pages](https://dash.cloudflare.com)

## Common Tasks

### 🔄 Roll Back a Bad Deploy

```bash
# Option 1: Revert commit
git revert HEAD
git push origin main

# Option 2: Deploy previous version from Cloudflare Dashboard
# Pages → Deployments → Select previous → Rollback
```

### 🔑 Rotate Secrets

#### SendGrid API Key
1. Create new key in SendGrid Dashboard
2. Update in Cloudflare Pages: Settings → Variables → SENDGRID_API_KEY
3. Redeploy from dashboard
4. Delete old key in SendGrid

#### Turnstile Keys
1. Create new site in Turnstile Dashboard
2. Update in Cloudflare Pages:
   - PUBLIC_TURNSTILE_SITE_KEY (variable)
   - TURNSTILE_SECRET_KEY (secret)
3. Update in code if hardcoded
4. Redeploy

#### GitHub OAuth
```bash
cd workers/decap-oauth
wrangler secret put GITHUB_OAUTH_ID
wrangler secret put GITHUB_OAUTH_SECRET
wrangler deploy
```

### 📧 Email Issues

#### Emails Not Sending
1. Check SendGrid Activity Feed for blocks/bounces
2. Verify domain authentication still valid
3. Check Pages Function logs in Cloudflare
4. Run self-test: `/self-test` (preview only)

#### Template Updates
1. Edit in SendGrid Dashboard
2. Test with preview/test send
3. Note template ID if creating new

### 🔐 CMS Access Issues

#### Login Fails
- Verify GitHub OAuth callback URL: `https://cms-auth.liteckyeditingservices.com/callback`
- Check Worker logs: `wrangler tail --name litecky-decap-oauth`
- Ensure user has write access to repo

#### Content Not Publishing
- Check GitHub Actions for build failures
- Verify branch protection rules aren't blocking
- Check Cloudflare Pages deployment logs

### 🚨 Incident Response

#### Site Down
1. Check Cloudflare status page
2. Check Pages deployment status
3. Check GitHub Actions for failed builds
4. Roll back if recent deploy caused issue

#### High Error Rate
1. Check Pages Function logs
2. Check Worker logs for OAuth proxy
3. Review recent commits for issues
4. Enable maintenance mode if needed

#### Security Incident
1. Rotate all secrets immediately
2. Review access logs in Cloudflare
3. Check GitHub audit log
4. Update dependencies if vulnerability

## Monitoring

### Daily Automated Checks
- **Nightly Smoke Test**: Runs at 2:30 AM Alaska time
- Tests: Homepage, CMS, OAuth proxy, Contact API
- Failures trigger GitHub notification email

### Manual Health Checks
```bash
# Test homepage
curl -I https://liteckyeditingservices.com

# Test OAuth proxy
curl https://cms-auth.liteckyeditingservices.com/

# Test contact API (sandbox mode)
curl -X POST https://liteckyeditingservices.com/api/contact \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=Test&email=test@test.com&message=Test&sandbox=1"
```

### Performance Monitoring
- Cloudflare Web Analytics: Pages → Analytics
- Core Web Vitals targets:
  - LCP < 2.5s
  - INP < 200ms
  - CLS < 0.1

## Environment Variables

### Production (Cloudflare Pages)
```
TURNSTILE_SECRET_KEY=***
SENDGRID_API_KEY=***
SENDGRID_CONTACT_TEMPLATE_ID=d-xxx
SENDGRID_CONFIRMATION_TEMPLATE_ID=d-yyy
ADMIN_EMAIL=admin@liteckyeditingservices.com
```

### Preview (Additional)
```
USE_TURNSTILE_TEST=1
TURNSTILE_TEST_SITE_KEY=1x00000000000000000000AA
TURNSTILE_TEST_SECRET_KEY=2x0000000000000000000000000000000AA
```

### Worker (OAuth Proxy)
```
GITHUB_OAUTH_ID=***
GITHUB_OAUTH_SECRET=***
```

## Maintenance Windows

Best times for maintenance (lowest traffic):
- Tuesday-Thursday, 2-4 AM Alaska time
- Avoid: Sunday evening, Monday morning

## Recovery Procedures

### Backup Locations
- **Code**: GitHub repository (full history)
- **Content**: GitHub repository (Markdown files)
- **Images**: GitHub repository or R2 bucket
- **Templates**: SendGrid Dashboard + `ops/sendgrid-templates/`

### Disaster Recovery
1. **Code corruption**: Clone from GitHub, redeploy
2. **CMS issues**: Edit directly in GitHub, merge to main
3. **Email service down**: Switch to backup provider (configure in env)
4. **DNS issues**: Use Cloudflare DNS failover

## Contact Points

- **Primary**: YOUR_EMAIL
- **Secondary**: YOUR_WIFE_EMAIL
- **GitHub Issues**: For non-urgent ops tasks
- **Cloudflare Support**: For infrastructure issues
- **SendGrid Support**: For email delivery issues

## Useful Commands

```bash
# View recent deployments
wrangler pages deployment list --project-name=litecky-editing

# Tail Worker logs
wrangler tail --name litecky-decap-oauth

# Check DNS propagation
dig liteckyeditingservices.com

# Test email deliverability
curl -I https://liteckyeditingservices.com/api/contact

# Force cache purge
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
  -H "Authorization: Bearer API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

---
Last Updated: September 2025
Next Review: December 2025
```

## 6. Environment Setup Summary

### Cloudflare Pages Variables

#### Production Environment
```yaml
# Public Variables
PUBLIC_SITE_NAME: "Litecky Editing Services"
PUBLIC_TURNSTILE_SITE_KEY: "your-production-site-key"

# Secrets
TURNSTILE_SECRET_KEY: [encrypted]
SENDGRID_API_KEY: [encrypted]
SENDGRID_CONTACT_TEMPLATE_ID: "d-xxxxx"
SENDGRID_CONFIRMATION_TEMPLATE_ID: "d-yyyyy"
ADMIN_EMAIL: "admin@liteckyeditingservices.com"
```

#### Preview Environment
```yaml
# All production variables plus:
USE_TURNSTILE_TEST: "1"
TURNSTILE_TEST_SITE_KEY: "1x00000000000000000000AA"
TURNSTILE_TEST_SECRET_KEY: "2x0000000000000000000000000000000AA"
```

## 7. Initial Setup Commands

```bash
# Install Playwright
pnpm add -D @playwright/test
pnpm exec playwright install --with-deps chromium

# Set up Renovate
# Go to: https://github.com/apps/renovate
# Install for your repository

# Enable GitHub Actions
# Repository → Settings → Actions → Allow all actions

# Configure notifications
# Repository → Settings → Notifications
# Add email for workflow failures

# Test locally
pnpm test:e2e:headed

# Deploy and verify
git add .
git commit -m "feat: add operations and monitoring"
git push origin main
```

This operations setup will run with minimal intervention, automatically catching issues before they affect users and keeping dependencies up to date.
