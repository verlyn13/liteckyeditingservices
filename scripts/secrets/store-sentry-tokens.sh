#!/usr/bin/env bash
set -euo pipefail

# Store Sentry tokens in gopass at canonical paths for this project
# Usage:
#   scripts/secrets/store-sentry-tokens.sh
# Prompts for tokens if not provided via env vars.

ORG_SLUG=${SENTRY_ORG:-happy-patterns-llc}

echo "🔐 Storing Sentry tokens in gopass (org: ${ORG_SLUG})..."

if ! command -v gopass >/dev/null 2>&1; then
  echo "❌ gopass not found. Please install and initialize gopass first." >&2
  exit 1
fi

read -r -p "Enter Sentry ORG token (sntrys_…): " ORG_TOKEN
read -r -p "Enter Sentry PERSONAL token (sntryu_…): " USER_TOKEN

echo -n "$ORG_TOKEN"   | gopass insert -f "sentry/${ORG_SLUG}/org-token" >/dev/null
echo -n "$USER_TOKEN"  | gopass insert -f "sentry/${ORG_SLUG}/personal-token" >/dev/null

# Use org token for build-time source maps upload by default
echo -n "$ORG_TOKEN"   | gopass insert -f "sentry/${ORG_SLUG}/auth-token" >/dev/null

echo "✅ Stored:"
echo "  • sentry/${ORG_SLUG}/org-token"
echo "  • sentry/${ORG_SLUG}/personal-token"
echo "  • sentry/${ORG_SLUG}/auth-token (for SENTRY_AUTH_TOKEN)"

echo ""
echo "Next: add to Cloudflare Pages secrets (build env):"
echo "  gopass show -o sentry/${ORG_SLUG}/auth-token | \"
echo "    pnpm wrangler pages secret put SENTRY_AUTH_TOKEN --project-name=liteckyeditingservices"

