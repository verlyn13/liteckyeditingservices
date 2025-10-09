#!/usr/bin/env bash
# Complete migration script for Git-connected Pages project
# Project: liteckyeditingservices (Git-connected)

set -euo pipefail

PROJECT_NAME="liteckyeditingservices"
OLD_PROJECT="litecky-editing-services"

echo "🚀 Completing Git-Connected Pages Migration"
echo "==========================================="
echo "New Project: $PROJECT_NAME (Git-connected)"
echo "Old Project: $OLD_PROJECT (Direct upload)"
echo ""

# Step 1: Sync secrets from gopass
echo "📦 Step 1: Syncing Pages secrets from gopass..."
echo "------------------------------------------------"

if command -v gopass >/dev/null 2>&1; then
    echo "✅ gopass found"

    # Check for secrets mapping file
    if [ -f "secrets/pages.secrets.map" ]; then
        MAP_FILE="secrets/pages.secrets.map"
    elif [ -f "secrets/pages.secrets.map.example" ]; then
        MAP_FILE="secrets/pages.secrets.map.example"
        echo "⚠️  Using example map file. Create secrets/pages.secrets.map for custom mappings."
    else
        echo "❌ No secrets mapping file found"
        exit 1
    fi

    echo "Running: ./scripts/deploy/sync-pages-secrets-from-gopass.sh $PROJECT_NAME $MAP_FILE"
    ./scripts/deploy/sync-pages-secrets-from-gopass.sh "$PROJECT_NAME" "$MAP_FILE"
else
    echo "⚠️  gopass not found. Set secrets manually:"
    echo "  wrangler pages secret put TURNSTILE_SECRET_KEY --project-name=$PROJECT_NAME"
    echo "  wrangler pages secret put SENDGRID_API_KEY --project-name=$PROJECT_NAME"
fi

echo ""
echo "📋 Step 2: Verify environment variables in Dashboard"
echo "----------------------------------------------------"
echo "Ensure these are set in Cloudflare Dashboard:"
echo ""
echo "Production Environment:"
echo "  ✓ NODE_VERSION = 24"
echo "  ✓ PNPM_VERSION = 10.17.1"
echo "  ✓ PUBLIC_TURNSTILE_SITE_KEY = 0x4AAAAAAB27CNFPS0wEzPP5"
echo "  ✓ SENDGRID_FROM = noreply@liteckyeditingservices.com"
echo "  ✓ ENVIRONMENT = production"
echo ""
echo "Preview Environment:"
echo "  ✓ Same as above, but ENVIRONMENT = preview"
echo "  ✓ Optional: USE_TURNSTILE_TEST = 1 for test keys"
echo ""
echo "Dashboard URL: https://dash.cloudflare.com/?to=/:account/pages/view/$PROJECT_NAME/settings/environment-variables"
echo ""

# Step 3: Verify secrets are set
echo "🔍 Step 3: Verifying secrets..."
echo "--------------------------------"
echo "Production secrets:"
wrangler pages secret list --project-name="$PROJECT_NAME" 2>/dev/null || echo "Could not list secrets"

echo ""
echo "🌐 Step 4: Domain Migration Status"
echo "-----------------------------------"
echo "Current Git-connected project URL: https://liteckyeditingservices.pages.dev"
echo ""
echo "⚠️  DOMAIN CUTOVER REQUIRED:"
echo "The custom domains (liteckyeditingservices.com) are still on the old project."
echo ""
echo "When ready to cutover:"
echo "1. Remove domains from old project: $OLD_PROJECT"
echo "2. Add domains to new project: $PROJECT_NAME"
echo "3. Wait 1-5 minutes for SSL"
echo "4. Run: pnpm smoke:prod"
echo ""

# Step 5: Test preview deployment
echo "🧪 Step 5: Testing preview deployment..."
echo "----------------------------------------"
PREVIEW_URL="https://12f121aa.liteckyeditingservices.pages.dev"
echo "Testing preview: $PREVIEW_URL"

if curl -s -o /dev/null -w "%{http_code}" "$PREVIEW_URL" | grep -q "200"; then
    echo "✅ Preview deployment is live"
    echo "Run: pnpm smoke:url $PREVIEW_URL"
else
    echo "⚠️  Preview might still be building"
fi

echo ""
echo "✅ Step 6: Enable Git-connected mode in CI"
echo "-------------------------------------------"
echo "After domain cutover, run:"
echo "  gh secret set CF_GIT_CONNECTED --body='true'"
echo ""
echo "This disables the manual wrangler deployment workflow."
echo ""

echo "📊 Summary"
echo "========="
echo "✅ Git-connected project created: $PROJECT_NAME"
echo "✅ Automatic deployments enabled on push to main"
echo "✅ Preview URL: $PREVIEW_URL"
echo "⏳ Pending: Domain cutover from $OLD_PROJECT"
echo ""
echo "Next actions:"
echo "1. Verify all secrets are set (check above)"
echo "2. Test preview with: pnpm smoke:url $PREVIEW_URL"
echo "3. When ready, perform domain cutover"
echo "4. After cutover: gh secret set CF_GIT_CONNECTED --body='true'"
echo ""
echo "Full validation: ./scripts/deploy/validate-migration.sh $PROJECT_NAME"