#!/usr/bin/env bash
# Update visual regression baseline screenshots
# Usage: ./scripts/test/update-visual-baselines.sh [--ci]

set -euo pipefail

MODE="${1:-local}"
BROWSERS=("chromium" "firefox" "webkit" "Mobile Chrome" "Mobile Safari")

echo "🎨 Updating Visual Regression Baselines"
echo "========================================"
echo ""

# Check if we're in CI mode
if [ "$MODE" == "--ci" ]; then
    echo "⚠️  CI Mode: Will update baselines for all browsers"
    echo "This should only be done when intentional UI changes are made!"
    echo ""
    read -p "Are you sure you want to update baselines? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

# Clean existing screenshots
echo "🧹 Cleaning existing baselines..."
rm -rf tests/e2e/visual-improved.spec.ts-snapshots/
rm -rf tests/e2e/visual.spec.ts-snapshots/

# Update baselines for each browser
echo "📸 Generating new baselines..."

if [ "$MODE" == "--ci" ]; then
    # Run for all browsers
    for browser in "${BROWSERS[@]}"; do
        echo "  → Updating for $browser..."
        pnpm exec playwright test tests/e2e/visual-improved.spec.ts \
            --project="$browser" \
            --update-snapshots \
            --reporter=list || true
    done
else
    # Run only for chromium locally
    echo "  → Updating for chromium (local development)..."
    pnpm exec playwright test tests/e2e/visual-improved.spec.ts \
        --project=chromium \
        --update-snapshots \
        --reporter=list
fi

echo ""
echo "✅ Baselines updated!"
echo ""
echo "📋 Next steps:"
echo "1. Review the new screenshots in tests/e2e/*-snapshots/"
echo "2. Verify they look correct"
echo "3. Commit the changes if they're intentional"
echo "4. Push to trigger CI validation"

# Show what was created
echo ""
echo "📁 Created files:"
find tests/e2e -name "*.png" -type f | head -20