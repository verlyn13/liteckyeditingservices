#!/usr/bin/env bash
set -euo pipefail

# Sync Cloudflare Pages secrets from gopass.
# Usage: scripts/deploy/sync-pages-secrets-from-gopass.sh <project_name> <map_file>
# map_file format (KEY=GOPASS_PATH per line, no spaces):
#   TURNSTILE_SECRET_KEY=cloudflare/pages/turnstile/secret
#   SENDGRID_API_KEY=sendgrid/api-key

PROJECT_NAME=${1:-}
MAP_FILE=${2:-}

if [[ -z "$PROJECT_NAME" || -z "$MAP_FILE" ]]; then
  echo "Usage: $0 <cloudflare_pages_project_name> <secrets_map_file>" >&2
  exit 1
fi

command -v gopass >/dev/null || { echo "gopass not found" >&2; exit 1; }
command -v wrangler >/dev/null || { echo "wrangler not found (pnpm add -D wrangler)" >&2; exit 1; }

echo "▶ Wrangler auth check"
wrangler whoami >/dev/null || { echo "Wrangler not authenticated" >&2; exit 1; }

echo "▶ Syncing secrets to Pages project: $PROJECT_NAME"
while IFS= read -r line; do
  [[ -z "$line" || "$line" =~ ^# ]] && continue
  KEY="${line%%=*}"
  PATH_ENTRY="${line#*=}"
  if [[ -z "$KEY" || -z "$PATH_ENTRY" ]]; then continue; fi
  VAL=$(gopass show -o "$PATH_ENTRY")
  if [[ -z "$VAL" ]]; then
    echo "! Skipping $KEY (empty)"
    continue
  fi
  echo "  • $KEY <= $PATH_ENTRY"
  printf "%s" "$VAL" | wrangler pages secret put "$KEY" --project-name="$PROJECT_NAME" >/dev/null
done < "$MAP_FILE"

echo "✅ Pages secrets synced"

