#!/usr/bin/env bash
set -euo pipefail

# Seed Infisical production secrets for liteckyeditingservices from gopass.
# - Never prints secret values
# - Tries multiple gopass paths per key; first hit wins

PROJECT_ID="${INFISICAL_PROJECT_ID:-d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7}"
ENVIRONMENT="prod"

require() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: missing dependency: $1" >&2
    exit 1
  fi
}

require infisical
require gopass

echo "Seeding Infisical ($PROJECT_ID, env=$ENVIRONMENT) from gopass..."
TMP_DOTENV=$(mktemp)
cleanup() { rm -f "$TMP_DOTENV"; }
trap cleanup EXIT

MAPPING=$(cat <<'EOF'
PUBLIC_TURNSTILE_SITE_KEY|cloudflare/turnstile/site-key cloudflare/litecky/turnstile/site-key
TURNSTILE_SECRET_KEY|cloudflare/turnstile/secret-key cloudflare/litecky/turnstile/secret-key
SENDGRID_API_KEY|sendgrid/litecky/api-key sendgrid/api-keys/liteckyeditingservices-key sendgrid/api-key
SENDGRID_CONTACT_TEMPLATE_ID|sendgrid/litecky/template/contact
SENDGRID_CONFIRMATION_TEMPLATE_ID|sendgrid/litecky/template/confirmation
GITHUB_CLIENT_ID|github/litecky/oauth/client-id github/oauth/litecky-editing/client-id github/oauth/client-id
GITHUB_CLIENT_SECRET|github/litecky/oauth/client-secret github/oauth/litecky-editing/client-secret github/oauth/client-secret
SENTRY_AUTH_TOKEN|sentry/happy-patterns-llc/auth-token
PUBLIC_SENTRY_DSN|sentry/happy-patterns-llc/dsn
SENTRY_DSN|sentry/happy-patterns-llc/dsn
SENTRY_ORG|sentry/happy-patterns-llc/org
SENTRY_PROJECT|sentry/happy-patterns-llc/project
SENDGRID_FROM|sendgrid/litecky/from development/sendgrid/email-from
SENDGRID_TO|sendgrid/litecky/to development/sendgrid/email-to
EOF
)

# Helper to fetch first existing gopass path value
get_secret() {
  local paths="$1"
  for p in $paths; do
    if gopass show "$p" >/dev/null 2>&1; then
      gopass show -o "$p"
      return 0
    fi
  done
  return 1
}

seeded=0
missing_list=""

while IFS='|' read -r key paths; do
  [ -z "$key" ] && continue
  if val=$(get_secret "$paths" 2>/dev/null); then
    # Queue into temp dotenv for batch set
    printf '%s=%s\n' "$key" "$val" >> "$TMP_DOTENV"
    echo "✓ Queued $key"
    seeded=$((seeded+1))
  else
    echo "- Missing $key (paths tried: $paths)" >&2
    missing_list+="$key:$paths
"
  fi
done <<< "$MAPPING"

echo "---"
if [ $seeded -gt 0 ]; then
  infisical secrets set --file "$TMP_DOTENV" --env "$ENVIRONMENT" --projectId "$PROJECT_ID" >/dev/null
fi
echo "Seeded $seeded keys into Infisical ($PROJECT_ID, $ENVIRONMENT)."
if [ -n "$missing_list" ]; then
  echo "Missing keys (not found in gopass):"
  printf "%s" "$missing_list" | sed 's/^/  /'
  exit 2
fi

exit 0
