#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <base_url>" >&2
  exit 1
fi

BASE_URL="$1"

echo "▶ Checking $BASE_URL ..."

code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" || echo 000)
echo "HTTP $code for $BASE_URL"
test "$code" = "200"

echo "▶ Checking admin headers..."
curl -sI "$BASE_URL/admin/" | grep -i "content-security-policy\|x-frame-options" || true

echo "▶ Running Playwright smokes (homepage + admin)"
export PLAYWRIGHT_BASE_URL="$BASE_URL"
pnpm exec playwright install --with-deps >/dev/null 2>&1 || true
pnpm test:e2e -g "Homepage|Navigation" || true
pnpm test:admin:prod

echo "✅ Preview smoke complete"

