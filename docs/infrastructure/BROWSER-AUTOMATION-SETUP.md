# Browser Automation Setup - Fedora Linux

## System Browser Configuration

### Installed Browsers

#### System Chromium (Fedora Package)
- **Binary**: `/usr/bin/chromium-browser`
- **Actual Binary**: `/usr/lib64/chromium-browser/chromium-browser`
- **Version**: Chromium 140.0.7339.127 Fedora Project
- **Wrapper Script**: `/usr/lib64/chromium-browser/chromium-browser.sh`

#### Puppeteer Managed Chrome
- **Location**: `~/.cache/puppeteer/chrome/`
- **Available Versions**:
  - `chrome@131.0.6778.204` - `$HOME/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome`
  - `chrome@140.0.7339.82` - `$HOME/.cache/puppeteer/chrome/linux-140.0.7339.82/chrome-linux64/chrome`
  - `chrome-headless-shell@131.0.6778.204` - For headless automation

## Puppeteer Configuration

### Project Setup
- **Package**: `puppeteer@24.22.0` (dev dependency)
- **Browser Management**: Via `npx puppeteer browsers` command
- **Default Chrome**: Downloaded and managed by Puppeteer

### Available Commands

#### Browser Management
```bash
# List installed browsers
npx puppeteer browsers list

# Install specific browser
npx puppeteer browsers install chrome
npx puppeteer browsers install chrome-headless-shell

# Launch browser for manual testing
npx puppeteer browsers launch chrome

# Clear browser cache
npx puppeteer browsers clear
```

#### Browser Usage
```bash
# Launch system Chromium with dev tools
chromium-browser --remote-debugging-port=9222

# Launch headless Chromium for automation
chromium-browser --headless --remote-debugging-port=9222 --disable-gpu --no-sandbox

# Launch Puppeteer's Chrome
~/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome --remote-debugging-port=9222
```

## Playwright Configuration

### Current Setup (playwright.config.ts)
```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
]
```

### Playwright Browser Management
```bash
# Install Playwright browsers
npx playwright install

# Install specific browser
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit

# Run tests with specific browser
npx playwright test --project=chromium
```

## Development Workflow

### For Manual Testing

#### System Chromium (Native Fedora)
```bash
# Launch with dev tools (GUI)
chromium-browser --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-dev

# Access dev tools at: http://localhost:9222
# Then navigate to your site: http://localhost:4321
```

#### Puppeteer Chrome (Recommended for automation)
```bash
# Launch latest Puppeteer Chrome
npx puppeteer browsers launch chrome

# Or launch with specific flags
$HOME/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-dev \
  --disable-web-security \
  --disable-features=VizDisplayCompositor
```

### For Automated Testing

#### Puppeteer Script Example
```javascript
// puppeteer-test.js
const puppeteer = require('puppeteer');

(async () => {
  // Use Puppeteer's Chrome
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true
  });
  
  // Or use system Chromium
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.goto('http://localhost:4321');
  
  // Your automation code here
  
  await browser.close();
})();
```

#### Playwright Test Example
```bash
# Run E2E tests
pnpm test:e2e

# Run with UI mode
pnpm test:e2e:ui

# Run specific browser
npx playwright test --project=chromium
```

## Browser Flags for Development

### Essential Dev Flags
```bash
--remote-debugging-port=9222   # Enable DevTools Protocol
--user-data-dir=/tmp/chrome-dev # Separate profile
--disable-web-security         # CORS bypass (dev only)
--disable-features=VizDisplayCompositor # Stability
--no-sandbox                   # Linux compatibility
--disable-dev-shm-usage        # Docker/CI compatibility
```

### Headless Automation Flags
```bash
--headless                     # No GUI
--disable-gpu                  # Headless GPU
--no-first-run                 # Skip setup
--disable-background-timer-throttling
--disable-backgrounding-occluded-windows
--disable-renderer-backgrounding
```

## Environment Configuration

### For CI/CD (GitHub Actions)
```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium

- name: Run tests
  run: pnpm test:e2e
  env:
    CI: true
```

### For Local Development
```bash
# In .dev.vars or environment
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
PLAYWRIGHT_BROWSERS_PATH=~/.cache/ms-playwright
```

## Troubleshooting

### Common Issues

#### "Chrome not found" Error
```bash
# Install Puppeteer Chrome
npx puppeteer browsers install chrome

# Or specify system Chromium
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

#### Sandbox Issues (Linux)
```bash
# Add --no-sandbox flag
chromium-browser --no-sandbox --remote-debugging-port=9222
```

#### Display Issues (Headless)
```bash
# Install virtual display
sudo dnf install xvfb

# Run with virtual display
xvfb-run -a chromium-browser --remote-debugging-port=9222
```

### Debug Commands
```bash
# Check browser versions
chromium-browser --version
npx puppeteer browsers list

# Test browser launch
chromium-browser --headless --dump-dom http://example.com

# Check DevTools connectivity
curl http://localhost:9222/json/version
```

## Project Integration

### Test Scripts (package.json)
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:admin": "node tests/admin-smoke.spec.mjs",
    "browser:install": "npx playwright install chromium"
  }
}
```

### Admin Interface Testing
```bash
# Test Decap CMS admin
pnpm test:admin

# Manual admin testing
chromium-browser http://localhost:4321/admin
```

## Best Practices

### Development
1. **Use Puppeteer Chrome** for consistent automation
2. **Use System Chromium** for manual testing with system integration
3. **Enable DevTools** during development
4. **Separate user profiles** for testing

### Testing
1. **Playwright for E2E tests** (multiple browsers)
2. **Puppeteer for admin testing** (Chrome-specific)
3. **Headless in CI**, **headed in dev**
4. **Consistent browser versions** across environments

### Performance
1. **Reuse browser instances** when possible
2. **Use headless-shell** for pure automation
3. **Close browsers** properly to free resources
4. **Limit concurrent browser instances**

## Related Documentation

- [Playwright Configuration](../tests/README.md)
- [E2E Testing Guide](../tests/e2e/README.md)
- [Admin Testing](../tests/admin-smoke.spec.mjs)
- [CI/CD Pipeline](.github/workflows/)
