#!/usr/bin/env bash
set -euo pipefail

REPO=${REPO:-"verlyn13/liteckyeditingservices"}

echo "🔐 Setting up GitHub repository secrets for Infisical → Cloudflare sync"
echo "Repository: $REPO"

if ! command -v gh >/dev/null 2>&1; then
  echo "❌ gh CLI not installed" >&2; exit 1; fi

echo "\n✅ Prerequisites OK"

echo "\n📝 Setting repository variables..."
gh variable set INFISICAL_PROJECT_ID -R "$REPO" -b "${INFISICAL_PROJECT_ID:-d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7}"
gh variable set INFISICAL_ENV -R "$REPO" -b "${INFISICAL_ENV:-production}"
gh variable set CLOUDFLARE_PROJECT_NAME -R "$REPO" -b "${CLOUDFLARE_PROJECT_NAME:-liteckyeditingservices}"
gh variable set CLOUDFLARE_ACCOUNT_ID -R "$REPO" -b "${CLOUDFLARE_ACCOUNT_ID:-}" || true
echo "✅ Variables set"

echo "\n🔒 Setting repository secrets from gopass..."
if command -v gopass >/dev/null 2>&1; then
  INFISICAL_API_URL_VALUE=${INFISICAL_API_URL:-"https://secrets.jefahnierocks.com/api"}
  echo -n "$INFISICAL_API_URL_VALUE" | gh secret set INFISICAL_API_URL -R "$REPO" --app actions
  if gopass show -o infisical/service-tokens/liteckyeditingservices/prod/read >/dev/null 2>&1; then
    gopass show -o infisical/service-tokens/liteckyeditingservices/prod/read | gh secret set INFISICAL_TOKEN -R "$REPO" --app actions
  else
    echo "⚠️ Infisical service token not found in gopass; set INFISICAL_TOKEN manually"
  fi
  if gopass show -o cloudflare/api-tokens/initial-project-setup-master >/dev/null 2>&1; then
    gopass show -o cloudflare/api-tokens/initial-project-setup-master | gh secret set CLOUDFLARE_API_TOKEN -R "$REPO" --app actions
  else
    echo "⚠️ Cloudflare API token not found in gopass; set CLOUDFLARE_API_TOKEN manually"
  fi
else
  echo "⚠️ gopass not available; skipping secret fetch"
fi
echo "✅ Secrets set"

echo "\n════════════════════════════════════════════════════════════════"
echo "✅ GitHub Repository Setup Complete"
echo "════════════════════════════════════════════════════════════════"

echo "\nNext steps:"
echo "1. Verify secrets: gh secret list -R $REPO"
echo "2. Verify variables: gh variable list -R $REPO"
echo "3. Test the workflow (dry run): gh workflow run infisical-to-cloudflare.yml -R $REPO -f dry_run=true"
echo "4. Apply: gh workflow run infisical-to-cloudflare.yml -R $REPO -f dry_run=false"

