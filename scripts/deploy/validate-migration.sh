#!/usr/bin/env bash
# Comprehensive validation script for Git-connected Pages migration
# Usage: ./scripts/deploy/validate-migration.sh [project-name]

set -euo pipefail

PROJECT_NAME="${1:-litecky-editing-services-git}"
PROD_URL="https://www.liteckyeditingservices.com"
ROOT_URL="https://liteckyeditingservices.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Validating Git-Connected Pages Migration"
echo "Project: $PROJECT_NAME"
echo "============================================"

# Function to check status
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        return 0
    else
        echo -e "${RED}❌ $2${NC}"
        return 1
    fi
}

# Function to warn
warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo ""
echo "1️⃣  CLOUDFLARE PROJECT CHECKS"
echo "--------------------------------"

# Check if wrangler is authenticated
if wrangler whoami >/dev/null 2>&1; then
    check 0 "Wrangler authenticated"
else
    check 1 "Wrangler not authenticated"
    exit 1
fi

# Check if project exists
if wrangler pages project list 2>/dev/null | grep -q "$PROJECT_NAME"; then
    check 0 "Project exists: $PROJECT_NAME"
else
    check 1 "Project not found: $PROJECT_NAME"
fi

# List secrets (names only for security)
echo ""
echo "Production Secrets:"
wrangler pages secret list --project-name="$PROJECT_NAME" 2>/dev/null | head -10 || warn "Could not list secrets"

echo ""
echo "2️⃣  DOMAIN & SSL CHECKS"
echo "------------------------"

# Check domain responses
for url in "$PROD_URL" "$ROOT_URL"; do
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    if [ "$http_code" = "200" ]; then
        check 0 "$url responds with 200"
    else
        check 1 "$url returned $http_code"
    fi
done

# Check SSL certificate
if echo | openssl s_client -servername www.liteckyeditingservices.com -connect www.liteckyeditingservices.com:443 2>/dev/null | openssl x509 -noout -dates >/dev/null 2>&1; then
    check 0 "SSL certificate valid"
else
    check 1 "SSL certificate check failed"
fi

echo ""
echo "3️⃣  SECURITY HEADERS"
echo "--------------------"

headers=$(curl -sI "$PROD_URL")

# Check required headers
for header in "strict-transport-security" "content-security-policy" "x-frame-options" "x-content-type-options"; do
    if echo "$headers" | grep -qi "$header"; then
        check 0 "Header present: $header"
    else
        check 1 "Header missing: $header"
    fi
done

echo ""
echo "4️⃣  ADMIN PANEL CHECKS"
echo "----------------------"

# Check admin loads
admin_response=$(curl -s "$PROD_URL/admin/" || echo "")

# Check for Decap CMS
if echo "$admin_response" | grep -q "decap-cms"; then
    check 0 "Admin panel loads Decap CMS"

    # Check version
    if echo "$admin_response" | grep -q "3.8.4"; then
        check 0 "Decap CMS version 3.8.4 confirmed"
    else
        warn "Could not verify Decap CMS version 3.8.4"
    fi
else
    check 1 "Admin panel not loading correctly"
fi

echo ""
echo "5️⃣  CONTENT DELIVERY"
echo "--------------------"

# Check a JS asset loads (with cache busting)
js_check=$(curl -s "$PROD_URL" | grep -o "_assets/.*\.js" | head -1 || echo "")
if [ -n "$js_check" ]; then
    asset_url="$PROD_URL/$js_check"
    asset_code=$(curl -s -o /dev/null -w "%{http_code}" "$asset_url" || echo "000")
    if [ "$asset_code" = "200" ]; then
        check 0 "JS assets loading correctly"
    else
        check 1 "JS assets not loading (got $asset_code)"
    fi
else
    warn "Could not find JS assets to test"
fi

echo ""
echo "6️⃣  API ENDPOINTS"
echo "-----------------"

# Check contact API exists (expect 405 for GET)
api_code=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL/api/contact" || echo "000")
if [ "$api_code" = "405" ] || [ "$api_code" = "200" ]; then
    check 0 "Contact API endpoint exists"
else
    check 1 "Contact API returned unexpected code: $api_code"
fi

echo ""
echo "7️⃣  GIT CONNECTION STATUS"
echo "-------------------------"

# Check if CF_GIT_CONNECTED is set (via GitHub CLI if available)
if command -v gh >/dev/null 2>&1; then
    if gh secret list 2>/dev/null | grep -q "CF_GIT_CONNECTED"; then
        check 0 "CF_GIT_CONNECTED secret exists in GitHub"
    else
        warn "CF_GIT_CONNECTED not set - manual deployments still active"
    fi
else
    warn "GitHub CLI not available - cannot check CF_GIT_CONNECTED"
fi

echo ""
echo "8️⃣  BUILD & DEPLOYMENT"
echo "-----------------------"

# Get latest deployment info
echo "Recent deployments:"
wrangler pages deployment list --project-name="$PROJECT_NAME" 2>/dev/null | head -5 || warn "Could not list deployments"

echo ""
echo "============================================"
echo "📊 VALIDATION SUMMARY"
echo "============================================"

# Quick tests that can be run immediately
echo ""
echo "Quick smoke tests you can run:"
echo "  pnpm smoke:prod"
echo "  pnpm test:admin:prod"
echo "  pnpm test:e2e:prod"

echo ""
echo "Manual verification URLs:"
echo "  Dashboard: https://dash.cloudflare.com/?to=/:account/pages/view/$PROJECT_NAME"
echo "  Production: $PROD_URL"
echo "  Admin: $PROD_URL/admin/"

echo ""
echo "Next steps if validation fails:"
echo "1. Check Cloudflare Pages dashboard for build errors"
echo "2. Verify all secrets are set: wrangler pages secret list --project-name='$PROJECT_NAME'"
echo "3. Check GitHub Actions tab for workflow failures"
echo "4. Review migration checklist: docs/migrations/COMPLETE-GIT-MIGRATION-CHECKLIST.md"

echo ""
echo "✨ Validation complete!"