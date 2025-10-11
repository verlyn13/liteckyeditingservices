#!/usr/bin/env bash
set -euo pipefail

# Setup GitHub repository secrets and variables for Infisical → Cloudflare sync
# Requires: gh CLI (GitHub CLI) and gopass

REPO="verlyn13/liteckyeditingservices"

echo "🔐 Setting up GitHub repository secrets for Infisical → Cloudflare sync"
echo "Repository: $REPO"
echo ""

# Check prerequisites
if ! command -v gh &> /dev/null; then
    echo "❌ Error: gh CLI not found. Install: https://cli.github.com/"
    exit 1
fi

if ! command -v gopass &> /dev/null; then
    echo "❌ Error: gopass not found. Install gopass first."
    exit 1
fi

# Check gh authentication
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with gh CLI. Run: gh auth login"
    exit 1
fi

echo "✅ Prerequisites OK"
echo ""

# Set variables (non-secret)
echo "📝 Setting repository variables..."

echo "  • INFISICAL_PROJECT_ID"
gh variable set INFISICAL_PROJECT_ID \
    -R "$REPO" \
    -b "d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7"

echo "  • INFISICAL_ENV"
gh variable set INFISICAL_ENV \
    -R "$REPO" \
    -b "prod"

echo "  • CLOUDFLARE_PROJECT_NAME"
gh variable set CLOUDFLARE_PROJECT_NAME \
    -R "$REPO" \
    -b "liteckyeditingservices"

echo "  • CLOUDFLARE_ACCOUNT_ID"
gh variable set CLOUDFLARE_ACCOUNT_ID \
    -R "$REPO" \
    -b "13eb584192d9cefb730fde0cfd271328"

echo "✅ Variables set"
echo ""

# Set secrets (from gopass)
echo "🔒 Setting repository secrets from gopass..."

# Infisical API URL
echo "  • INFISICAL_API_URL"
echo -n "https://secrets.jefahnierocks.com/api" | \
    gh secret set INFISICAL_API_URL -R "$REPO"

# Infisical Token (from gopass)
echo "  • INFISICAL_TOKEN"
if gopass show "infisical/service-tokens/liteckyeditingservices/prod/read" &> /dev/null; then
    gopass show -o "infisical/service-tokens/liteckyeditingservices/prod/read" | \
        gh secret set INFISICAL_TOKEN -R "$REPO"
else
    echo "    ⚠️  Not found in gopass: infisical/service-tokens/liteckyeditingservices/prod/read"
    echo "    You'll need to set this manually after creating the service token in Infisical"
fi

# Cloudflare API Token (from gopass)
echo "  • CLOUDFLARE_API_TOKEN"
if gopass show "cloudflare/api-tokens/initial-project-setup-master" &> /dev/null; then
    gopass show -o "cloudflare/api-tokens/initial-project-setup-master" | \
        gh secret set CLOUDFLARE_API_TOKEN -R "$REPO"
else
    echo "    ⚠️  Not found in gopass: cloudflare/api-tokens/initial-project-setup-master"
    echo "    Trying alternate path..."
    if gopass show "cloudflare/account/api-token" &> /dev/null; then
        gopass show -o "cloudflare/account/api-token" | \
            gh secret set CLOUDFLARE_API_TOKEN -R "$REPO"
    else
        echo "    ⚠️  No Cloudflare API token found in gopass"
        echo "    You'll need to set this manually"
    fi
fi

echo "✅ Secrets set"
echo ""

# Summary
echo "════════════════════════════════════════════════════════════════"
echo "✅ GitHub Repository Setup Complete"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Variables set:"
echo "  • INFISICAL_PROJECT_ID"
echo "  • INFISICAL_ENV"
echo "  • CLOUDFLARE_PROJECT_NAME"
echo "  • CLOUDFLARE_ACCOUNT_ID"
echo ""
echo "Secrets set:"
echo "  • INFISICAL_API_URL"
echo "  • INFISICAL_TOKEN (if available in gopass)"
echo "  • CLOUDFLARE_API_TOKEN (if available in gopass)"
echo ""
echo "Next steps:"
echo "1. Verify secrets: gh secret list -R $REPO"
echo "2. Verify variables: gh variable list -R $REPO"
echo "3. If INFISICAL_TOKEN is missing:"
echo "   - Create service token in Infisical (read-only for prod)"
echo "   - Store: gopass insert -f infisical/service-tokens/liteckyeditingservices/prod/read"
echo "   - Set: gopass show -o infisical/service-tokens/liteckyeditingservices/prod/read | gh secret set INFISICAL_TOKEN -R $REPO"
echo "4. Test the workflow:"
echo "   gh workflow run infisical-to-cloudflare.yml -R $REPO -f dry_run=true"
echo ""
