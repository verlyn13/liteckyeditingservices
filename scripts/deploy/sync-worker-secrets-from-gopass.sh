#!/usr/bin/env bash
set -euo pipefail

# Sync Worker secrets (wrangler) from gopass mapping file.
# Usage: scripts/deploy/sync-worker-secrets-from-gopass.sh <worker_dir> <map_file>
# Example worker_dir: workers/decap-oauth

WORKER_DIR=${1:-}
MAP_FILE=${2:-}

if [[ -z "$WORKER_DIR" || -z "$MAP_FILE" ]]; then
  echo "Usage: $0 <worker_dir> <secrets_map_file>" >&2
  exit 1
fi

command -v gopass >/dev/null || { echo "gopass not found" >&2; exit 1; }
command -v wrangler >/dev/null || { echo "wrangler not found (pnpm add -D wrangler)" >&2; exit 1; }

pushd "$WORKER_DIR" >/dev/null
echo "▶ Wrangler auth check (worker: $WORKER_DIR)"
wrangler whoami >/dev/null || { echo "Wrangler not authenticated" >&2; exit 1; }

echo "▶ Syncing Worker secrets from $MAP_FILE"
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
  printf "%s" "$VAL" | wrangler secret put "$KEY" >/dev/null
done < "$MAP_FILE"

echo "✅ Worker secrets synced"
popd >/dev/null

