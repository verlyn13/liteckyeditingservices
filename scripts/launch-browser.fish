#!/usr/bin/env fish

# Browser launcher script for development and testing
# Usage: ./scripts/launch-browser.fish [browser] [mode]

set BROWSERS "chromium" "puppeteer" "playwright"
set MODES "dev" "headless" "debug" "test"

# Colors
set GREEN '\033[0;32m'
set BLUE '\033[0;34m'
set YELLOW '\033[1;33m'
set NC '\033[0m'

function show_usage
    echo "Usage: $argv[0] [browser] [mode]"
    echo ""
    echo "Browsers:"
    echo "  chromium   - System Chromium (Fedora package)"
    echo "  puppeteer  - Puppeteer managed Chrome"
    echo "  playwright - Playwright managed browsers"
    echo ""
    echo "Modes:"
    echo "  dev       - GUI mode with DevTools"
    echo "  headless  - Headless automation mode"
    echo "  debug     - Debug mode with remote debugging"
    echo "  test      - Test runner mode"
    echo ""
    echo "Examples:"
    echo "  $argv[0] chromium dev"
    echo "  $argv[0] puppeteer headless"
    echo "  $argv[0] playwright test"
end

function launch_chromium
    set mode $argv[1]
    
    switch $mode
        case dev
            echo -e "$BLUE→ Launching system Chromium in dev mode$NC"
            chromium-browser \
                --remote-debugging-port=9222 \
                --user-data-dir=/tmp/chrome-dev \
                --disable-web-security \
                http://localhost:4321 &
            
            echo -e "$GREEN✓ DevTools available at: http://localhost:9222$NC"
            
        case headless
            echo -e "$BLUE→ Launching system Chromium in headless mode$NC"
            chromium-browser \
                --headless \
                --remote-debugging-port=9222 \
                --disable-gpu \
                --no-sandbox \
                --dump-dom http://localhost:4321
                
        case debug
            echo -e "$BLUE→ Launching system Chromium for debugging$NC"
            chromium-browser \
                --remote-debugging-port=9222 \
                --user-data-dir=/tmp/chrome-debug \
                --enable-logging=stderr \
                --v=1 &
            
            echo -e "$GREEN✓ Debug info at: http://localhost:9222/json$NC"
            
        case test
            echo -e "$BLUE→ Running accessibility tests with Chromium$NC"
            pnpm test:a11y
            
        case '*'
            echo "Unknown mode: $mode"
            return 1
    end
end

function launch_puppeteer
    set mode $argv[1]
    
    switch $mode
        case dev
            echo -e "$BLUE→ Launching Puppeteer Chrome in dev mode$NC"
            npx puppeteer browsers launch chrome
            
        case headless
            echo -e "$BLUE→ Running headless Puppeteer example$NC"
            node -e "
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:4321');
  console.log('Title:', await page.title());
  await browser.close();
})();"
            
        case debug
            echo -e "$BLUE→ Launching Puppeteer Chrome with debugging$NC"
            node -e "
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ 
    headless: false, 
    devtools: true,
    args: ['--remote-debugging-port=9223']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:4321');
  console.log('Browser launched with DevTools');
})();"
            
        case test
            echo -e "$BLUE→ Running admin smoke test$NC"
            pnpm test:admin
            
        case '*'
            echo "Unknown mode: $mode"
            return 1
    end
end

function launch_playwright
    set mode $argv[1]
    
    switch $mode
        case dev
            echo -e "$BLUE→ Running Playwright tests in UI mode$NC"
            pnpm test:e2e:ui
            
        case headless
            echo -e "$BLUE→ Running Playwright tests headless$NC"
            pnpm test:e2e
            
        case debug
            echo -e "$BLUE→ Running Playwright with debug$NC"
            npx playwright test --debug
            
        case test
            echo -e "$BLUE→ Running all Playwright tests$NC"
            npx playwright test --project=chromium
            
        case '*'
            echo "Unknown mode: $mode"
            return 1
    end
end

# Main script
if test (count $argv) -lt 2
    show_usage
    exit 1
end

set browser $argv[1]
set mode $argv[2]

# Check if dev server is running
if not curl -s http://localhost:4321 > /dev/null
    echo -e "$YELLOW⚠ Dev server not running. Start with: pnpm dev$NC"
    if test "$mode" != "test"
        exit 1
    end
end

switch $browser
    case chromium
        launch_chromium $mode
    case puppeteer
        launch_puppeteer $mode
    case playwright
        launch_playwright $mode
    case '*'
        echo "Unknown browser: $browser"
        show_usage
        exit 1
end
