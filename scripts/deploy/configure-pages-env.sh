#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="${1:-}"
ENV_FILE=".env.pages"
ALT_ENV_FILE="env.pages"

if [[ -z "$PROJECT_NAME" ]]; then
  echo "Usage: $0 <cloudflare_pages_project_name>" >&2
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  if [[ -f "$ALT_ENV_FILE" ]]; then
    ENV_FILE="$ALT_ENV_FILE"
  else
    echo "Missing $ENV_FILE (or $ALT_ENV_FILE). Copy from env.pages.example and fill in secrets." >&2
    exit 1
  fi
fi

if ! command -v wrangler >/dev/null 2>&1; then
  echo "Wrangler not found. Install with: pnpm add -D wrangler" >&2
  exit 1
fi

echo "▶ Verifying Cloudflare auth..."
wrangler whoami || { echo "Wrangler not authenticated" >&2; exit 1; }

echo "▶ Configuring secrets for Pages project: $PROJECT_NAME"

# Normalize env file (strip comments/blank lines)
mapfile -t lines < <(grep -vE '^(#|\s*$)' "$ENV_FILE")

for line in "${lines[@]}"; do
  key="${line%%=*}"
  val="${line#*=}"
  if [[ -z "$key" || -z "$val" ]]; then
    continue
  fi
  echo "  • Setting secret: $key"
  # Use stdin to avoid echoing secrets into shell history
  printf "%s" "$val" | wrangler pages secret put "$key" --project-name="$PROJECT_NAME" >/dev/null
done

echo "✅ Secrets set for project: $PROJECT_NAME"

cat << 'INFO'

Next steps (non-sensitive variables to set in Dashboard):
- NODE_VERSION = 24
- PNPM_VERSION = 10.17.1
- PUBLIC_TURNSTILE_SITE_KEY = 0x4AAAAAAB27CNFPS0wEzPP5
- SENDGRID_FROM = noreply@liteckyeditingservices.com
- ENVIRONMENT = production (and preview = preview)

If you need different secrets for Preview vs Production, set Preview overrides in the Pages dashboard (Environment Variables → Preview) after running this script.

INFO
