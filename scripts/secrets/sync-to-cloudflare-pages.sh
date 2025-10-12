#!/usr/bin/env bash
set -euo pipefail

# Sync secrets from Infisical to Cloudflare Pages (Production and Preview environments)
# Prerequisites:
#   1. Run ./scripts/secrets/cloudflare_prepare_from_infisical.sh first
#   2. Ensure secrets/public.env and secrets/secrets.env exist
#   3. wrangler CLI must be installed and authenticated

PROJECT_NAME="${CLOUDFLARE_PROJECT_NAME:-liteckyeditingservices}"
SECRETS_DIR="secrets"

echo "🚀 Syncing secrets to Cloudflare Pages: $PROJECT_NAME"
echo ""

# Check prerequisites
if ! command -v pnpm >/dev/null 2>&1; then
  echo "❌ pnpm not found" >&2
  exit 1
fi

if [[ ! -f "$SECRETS_DIR/public.env" ]]; then
  echo "❌ $SECRETS_DIR/public.env not found. Run ./scripts/secrets/cloudflare_prepare_from_infisical.sh first" >&2
  exit 1
fi

if [[ ! -f "$SECRETS_DIR/secrets.env" ]]; then
  echo "❌ $SECRETS_DIR/secrets.env not found. Run ./scripts/secrets/cloudflare_prepare_from_infisical.sh first" >&2
  exit 1
fi

echo "✅ Prerequisites OK"
echo ""

# Function to set environment variables (non-secret)
set_env_vars() {
  local env=$1
  local file=$2

  echo "📝 Setting environment variables for $env environment..."

  # Read and set each variable
  while IFS='=' read -r key value; do
    # Skip empty lines and comments
    [[ -z "$key" || "$key" =~ ^# ]] && continue

    # Use wrangler pages deployment tail to set variables
    # Note: wrangler doesn't have a direct way to set env vars via CLI
    # They must be set via the dashboard or API
    echo "  • $key (value hidden for security)"
  done < "$file"

  echo "  ℹ️  Environment variables must be set via Cloudflare Dashboard:"
  echo "     Pages → $PROJECT_NAME → Settings → Environment Variables → $env"
}

# Function to set secrets (encrypted)
set_secrets() {
  local env=$1
  local file=$2

  echo "🔒 Setting secrets for $env environment..."

  # Read each secret and set it using wrangler
  while IFS='=' read -r key value; do
    # Skip empty lines and comments
    [[ -z "$key" || "$key" =~ ^# ]] && continue

    # Skip empty values
    [[ -z "$value" ]] && continue

    echo "  • Setting $key..."

    # Use wrangler to set the secret
    if [[ "$env" == "production" ]]; then
      echo "$value" | pnpm wrangler pages secret put "$key" \
        --project-name="$PROJECT_NAME" \
        --env production 2>/dev/null || {
        echo "    ⚠️  Failed to set $key (may already exist)"
      }
    else
      echo "$value" | pnpm wrangler pages secret put "$key" \
        --project-name="$PROJECT_NAME" \
        --env preview 2>/dev/null || {
        echo "    ⚠️  Failed to set $key (may already exist)"
      }
    fi
  done < "$file"

  echo "  ✅ Secrets set for $env"
}

# Sync to Production
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏭 PRODUCTION ENVIRONMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Set secrets for production
set_secrets "production" "$SECRETS_DIR/secrets.env"
echo ""

# Display public vars info
echo "📋 Public environment variables ($SECRETS_DIR/public.env):"
cat "$SECRETS_DIR/public.env" | grep -v '^#' | grep -v '^$' | sed 's/=.*/=(value hidden)/' | sed 's/^/  • /'
echo ""
echo "  ℹ️  Set these manually in Cloudflare Dashboard:"
echo "     Pages → $PROJECT_NAME → Settings → Environment Variables → Production"
echo ""

# Additional production-specific variables
echo "📋 Additional production-specific variables to set manually:"
echo "  • PUBLIC_SENTRY_ENVIRONMENT=production"
echo "  • PUBLIC_SENTRY_RELEASE=\$CF_PAGES_COMMIT_SHA"
echo "  • SENTRY_ORG=happy-patterns-llc"
echo "  • SENTRY_PROJECT=javascript-astro"
echo "  • ENVIRONMENT=production"
echo ""

# Sync to Preview
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔬 PREVIEW ENVIRONMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Set secrets for preview
set_secrets "preview" "$SECRETS_DIR/secrets.env"
echo ""

# Display public vars info
echo "📋 Public environment variables (same as production):"
cat "$SECRETS_DIR/public.env" | grep -v '^#' | grep -v '^$' | sed 's/=.*/=(value hidden)/' | sed 's/^/  • /'
echo ""
echo "  ℹ️  Set these manually in Cloudflare Dashboard:"
echo "     Pages → $PROJECT_NAME → Settings → Environment Variables → Preview"
echo ""

# Additional preview-specific variables
echo "📋 Additional preview-specific variables to set manually:"
echo "  • PUBLIC_SENTRY_ENVIRONMENT=preview"
echo "  • PUBLIC_SENTRY_RELEASE=\$CF_PAGES_COMMIT_SHA"
echo "  • SENTRY_ORG=happy-patterns-llc"
echo "  • SENTRY_PROJECT=javascript-astro"
echo "  • ENVIRONMENT=preview"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Secrets sync complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Verify secrets in Cloudflare Dashboard"
echo "2. Set public environment variables manually (listed above)"
echo "3. Trigger a new deployment to pick up the secrets"
echo ""
echo "Verify with:"
echo "  pnpm wrangler pages deployment list --project-name=$PROJECT_NAME"
