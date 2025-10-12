#!/usr/bin/env bash
set -euo pipefail

# Store Sentry tokens in gopass at canonical paths for this project
# Usage:
#   scripts/secrets/store-sentry-tokens.sh
# Prompts for tokens if not provided via env vars.

ORG_SLUG=${SENTRY_ORG:-happy-patterns-llc}
PROJECT_SLUG=${SENTRY_PROJECT:-javascript-astro}
DEFAULT_DSN="https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520"

echo "🔐 Storing Sentry configuration in gopass (org: ${ORG_SLUG}, project: ${PROJECT_SLUG})..."

if ! command -v gopass >/dev/null 2>&1; then
  echo "❌ gopass not found. Please install and initialize gopass first." >&2
  exit 1
fi

# Prompt for tokens
read -r -p "Enter Sentry ORG token (sntrys_…): " ORG_TOKEN
read -r -p "Enter Sentry PERSONAL token (sntryu_…): " USER_TOKEN

# Prompt for DSN (with default)
echo ""
echo "Default DSN: $DEFAULT_DSN"
read -r -p "Enter Sentry DSN [press Enter to use default]: " DSN_INPUT
DSN="${DSN_INPUT:-$DEFAULT_DSN}"

# Store tokens
echo -n "$ORG_TOKEN"   | gopass insert -f "sentry/${ORG_SLUG}/org-token" >/dev/null
echo -n "$USER_TOKEN"  | gopass insert -f "sentry/${ORG_SLUG}/personal-token" >/dev/null

# Use org token for build-time source maps upload by default
echo -n "$ORG_TOKEN"   | gopass insert -f "sentry/${ORG_SLUG}/auth-token" >/dev/null

# Store configuration
echo -n "$DSN"         | gopass insert -f "sentry/${ORG_SLUG}/dsn" >/dev/null
echo -n "$ORG_SLUG"    | gopass insert -f "sentry/${ORG_SLUG}/org" >/dev/null
echo -n "$PROJECT_SLUG" | gopass insert -f "sentry/${ORG_SLUG}/project" >/dev/null

echo "✅ Stored:"
echo "  • sentry/${ORG_SLUG}/org-token (sntrys_...)"
echo "  • sentry/${ORG_SLUG}/personal-token (sntryu_...)"
echo "  • sentry/${ORG_SLUG}/auth-token (for CI/CD)"
echo "  • sentry/${ORG_SLUG}/dsn (${DSN:0:50}...)"
echo "  • sentry/${ORG_SLUG}/org (${ORG_SLUG})"
echo "  • sentry/${ORG_SLUG}/project (${PROJECT_SLUG})"

echo ""
echo "Next steps:"
echo "1. Seed to Infisical:"
echo "   ./scripts/secrets/infisical_seed_prod_from_gopass.sh"
echo ""
echo "2. Set GitHub Actions secrets:"
echo "   gh secret set SENTRY_AUTH_TOKEN --body \"\$(gopass show -o sentry/${ORG_SLUG}/auth-token)\""
echo "   gh variable set SENTRY_ORG --body \"${ORG_SLUG}\""
echo "   gh variable set SENTRY_PROJECT --body \"${PROJECT_SLUG}\""
echo ""
echo "3. Generate local dev vars:"
echo "   ./scripts/generate-dev-vars.sh"

