#!/usr/bin/env bash
set -euo pipefail

# Prepare Cloudflare Pages variables from Infisical (production)
# Outputs two files under secrets/:
#  - public.env   (keys starting with PUBLIC_)
#  - secrets.env  (all other keys)

PROJECT_ID_DEFAULT="d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7"
INFISICAL_ENV="prod"
OUT_DIR="secrets"

PROJECT_ID="${INFISICAL_PROJECT_ID:-$PROJECT_ID_DEFAULT}"

mkdir -p "$OUT_DIR"

if ! command -v infisical >/dev/null 2>&1; then
  echo "Error: infisical CLI not found. Install with: brew install infisical" >&2
  exit 1
fi

TMP_JSON=$(mktemp)
cleanup() { rm -f "$TMP_JSON"; }
trap cleanup EXIT

echo "Exporting Infisical secrets (projectId=$PROJECT_ID, env=$INFISICAL_ENV)"
infisical export \
  --projectId "$PROJECT_ID" \
  --env "$INFISICAL_ENV" \
  --format json > "$TMP_JSON"

echo "Splitting into public.env and secrets.env"
# Infisical JSON export is an array of objects: [{key, value, ...}, ...]
jq -r '.[] | select(.key | startswith("PUBLIC_")) | "\(.key)=\(.value)"' "$TMP_JSON" > "$OUT_DIR/public.env" || true
jq -r '.[] | select(.key | startswith("PUBLIC_") | not) | "\(.key)=\(.value)"' "$TMP_JSON" > "$OUT_DIR/secrets.env" || true

PUB_COUNT=$(wc -l < "$OUT_DIR/public.env" 2>/dev/null || echo 0)
SEC_COUNT=$(wc -l < "$OUT_DIR/secrets.env" 2>/dev/null || echo 0)
echo "✓ Prepared: $OUT_DIR/public.env ($PUB_COUNT vars), $OUT_DIR/secrets.env ($SEC_COUNT vars)"
echo "Next: Add public.env as Environment Variables and secrets.env as Secrets in Cloudflare Pages (Production)."
