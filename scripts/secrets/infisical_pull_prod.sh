#!/usr/bin/env bash
set -euo pipefail

# Pull production secrets from Infisical for the liteckyeditingservices workspace
# Writes dotenv to secrets/.env.production.local (git-ignored)

PROJECT_ID_DEFAULT="d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7"
ENVIRONMENT="prod"
OUT_FILE="secrets/.env.production.local"

PROJECT_ID="${INFISICAL_PROJECT_ID:-$PROJECT_ID_DEFAULT}"

mkdir -p secrets

if ! command -v infisical >/dev/null 2>&1; then
  echo "Error: infisical CLI not found. Install with: brew install infisical" >&2
  exit 1
fi

echo "Exporting Infisical secrets: projectId=$PROJECT_ID env=$ENVIRONMENT -> $OUT_FILE"
infisical export \
  --projectId "$PROJECT_ID" \
  --env "$ENVIRONMENT" \
  --format dotenv \
  > "$OUT_FILE"

echo "✓ Wrote $OUT_FILE"
echo "Tip: never commit this file. It is git-ignored by default."

