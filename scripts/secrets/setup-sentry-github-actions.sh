#!/usr/bin/env bash
set -euo pipefail

# Setup Sentry configuration for GitHub Actions
# This script sets up the necessary variables and secrets for Sentry integration in CI/CD

REPO=${REPO:-"verlyn13/liteckyeditingservices"}
ORG_SLUG="happy-patterns-llc"
PROJECT_SLUG="javascript-astro"

echo "🔐 Setting up Sentry configuration for GitHub Actions"
echo "Repository: $REPO"

if ! command -v gh >/dev/null 2>&1; then
  echo "❌ gh CLI not installed" >&2
  exit 1
fi

if ! command -v gopass >/dev/null 2>&1; then
  echo "❌ gopass not installed" >&2
  exit 1
fi

echo ""
echo "✅ Prerequisites OK"

echo ""
echo "📝 Setting Sentry variables..."
gh variable set SENTRY_ORG -R "$REPO" -b "$ORG_SLUG"
gh variable set SENTRY_PROJECT -R "$REPO" -b "$PROJECT_SLUG"
echo "✅ Variables set"

echo ""
echo "🔒 Setting Sentry auth token secret from gopass..."
if gopass show -o "sentry/${ORG_SLUG}/auth-token" >/dev/null 2>&1; then
  gopass show -o "sentry/${ORG_SLUG}/auth-token" | gh secret set SENTRY_AUTH_TOKEN -R "$REPO" --app actions
  echo "✅ SENTRY_AUTH_TOKEN secret set"
else
  echo "❌ Sentry auth token not found in gopass at: sentry/${ORG_SLUG}/auth-token"
  echo ""
  echo "Please run first:"
  echo "  ./scripts/secrets/store-sentry-tokens.sh"
  exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ Sentry GitHub Actions Setup Complete"
echo "════════════════════════════════════════════════════════════════"

echo ""
echo "Configured:"
echo "  • SENTRY_ORG=${ORG_SLUG} (variable)"
echo "  • SENTRY_PROJECT=${PROJECT_SLUG} (variable)"
echo "  • SENTRY_AUTH_TOKEN (secret from gopass)"

echo ""
echo "Next steps:"
echo "1. Verify configuration:"
echo "   gh variable list -R $REPO | grep SENTRY"
echo "   gh secret list -R $REPO | grep SENTRY"
echo ""
echo "2. Test in a workflow run (commits will now upload sourcemaps to Sentry)"
