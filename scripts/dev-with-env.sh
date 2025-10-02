#!/usr/bin/env bash
set -euo pipefail

# Load .dev.vars and .env if present, then run Astro dev

export_if_file() {
  local file="$1"
  if [[ -f "$file" ]];n  then
    # shellcheck disable=SC2046
    export $(grep -v '^#' "$file" | xargs -I{} echo {})
    echo "Loaded env from $file"
  fi
}

export_if_file .dev.vars
export_if_file .env

exec pnpm dev

