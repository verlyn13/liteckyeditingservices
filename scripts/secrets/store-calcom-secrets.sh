#!/usr/bin/env bash
set -euo pipefail

# Store Cal.com secrets in gopass
# Run this script to securely store Cal.com API key and webhook secret

echo "🔐 Storing Cal.com secrets in gopass..."
echo ""

# Check if gopass is available
if ! command -v gopass &> /dev/null; then
    echo "❌ Error: gopass is not installed or not in PATH"
    exit 1
fi

echo "📝 This script will store the following Cal.com secrets in gopass:"
echo "   • calcom/litecky-editing/api-key (Production API key)"
echo "   • calcom/litecky-editing/webhook-secret (Webhook signature secret)"
echo "   • calcom/litecky-editing/embed-url (Public booking URL)"
echo "   • calcom/litecky-editing-test/api-key (Test/Development API key)"
echo "   • calcom/litecky-editing-test/webhook-secret (Test webhook secret)"
echo "   • calcom/litecky-editing-test/embed-url (Test booking URL)"
echo ""

# Production API Key
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 PRODUCTION Cal.com API Key"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Get your production API key from:"
echo "  https://app.cal.com/settings/developer/api-keys"
echo ""
echo "Format: cal_live_xxxxxxxxxxxx"
echo ""
read -r -p "Enter production API key (or press Enter to skip): " prod_api_key

if [ -n "$prod_api_key" ]; then
    echo "$prod_api_key" | gopass insert -f calcom/litecky-editing/api-key
    echo "✅ Stored: calcom/litecky-editing/api-key"
else
    echo "⏭️  Skipped production API key"
fi

echo ""

# Production Webhook Secret
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 PRODUCTION Webhook Secret"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Get your webhook secret from:"
echo "  https://app.cal.com/settings/developer/webhooks"
echo ""
echo "Format: whsec_xxxxxxxxxxxx"
echo ""
read -r -p "Enter production webhook secret (or press Enter to skip): " prod_webhook_secret

if [ -n "$prod_webhook_secret" ]; then
    echo "$prod_webhook_secret" | gopass insert -f calcom/litecky-editing/webhook-secret
    echo "✅ Stored: calcom/litecky-editing/webhook-secret"
else
    echo "⏭️  Skipped production webhook secret"
fi

echo ""

# Production Embed URL
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 PRODUCTION Embed URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your production booking URL:"
echo "  https://cal.com/litecky-editing/consultation"
echo ""
read -r -p "Confirm or enter custom URL (or press Enter to use default): " prod_embed_url

if [ -z "$prod_embed_url" ]; then
    prod_embed_url="https://cal.com/litecky-editing/consultation"
fi

echo "$prod_embed_url" | gopass insert -f calcom/litecky-editing/embed-url
echo "✅ Stored: calcom/litecky-editing/embed-url"

echo ""

# Test/Development API Key
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 TEST/DEVELOPMENT Cal.com API Key"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Create a test Cal.com account or use test API key"
echo "Format: cal_test_xxxxxxxxxxxx"
echo ""
read -r -p "Enter test API key (or press Enter to skip): " test_api_key

if [ -n "$test_api_key" ]; then
    echo "$test_api_key" | gopass insert -f calcom/litecky-editing-test/api-key
    echo "✅ Stored: calcom/litecky-editing-test/api-key"
else
    echo "⏭️  Skipped test API key"
fi

echo ""

# Test Webhook Secret
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 TEST Webhook Secret"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -r -p "Enter test webhook secret (or press Enter to skip): " test_webhook_secret

if [ -n "$test_webhook_secret" ]; then
    echo "$test_webhook_secret" | gopass insert -f calcom/litecky-editing-test/webhook-secret
    echo "✅ Stored: calcom/litecky-editing-test/webhook-secret"
else
    echo "⏭️  Skipped test webhook secret"
fi

echo ""

# Test Embed URL
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 TEST Embed URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your test booking URL (if different from production):"
echo ""
read -r -p "Enter test embed URL (or press Enter to skip): " test_embed_url

if [ -n "$test_embed_url" ]; then
    echo "$test_embed_url" | gopass insert -f calcom/litecky-editing-test/embed-url
    echo "✅ Stored: calcom/litecky-editing-test/embed-url"
else
    echo "⏭️  Skipped test embed URL"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Cal.com secrets stored in gopass!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Stored secrets:"
gopass ls calcom/ 2>/dev/null || echo "   (none stored yet)"
echo ""
echo "🔄 Next steps:"
echo "   1. Run: ./scripts/generate-dev-vars.sh (regenerate .dev.vars)"
echo "   2. Run: ./scripts/secrets/infisical_seed_prod_from_gopass.sh (sync to Infisical)"
echo "   3. Deploy to Cloudflare Pages (secrets will be synced)"
echo ""
