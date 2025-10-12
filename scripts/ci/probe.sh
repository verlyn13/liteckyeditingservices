#!/usr/bin/env bash
set -euo pipefail

# probe.sh - Standardized URL readiness checker with exponential backoff
#
# Usage:
#   probe.sh <URL> [EXPECTED_SHA] [MAX_ATTEMPTS] [INITIAL_DELAY]
#
# Arguments:
#   URL             - URL to probe for HTTP 200 status
#   EXPECTED_SHA    - (Optional) Expected CF-Pages-Commit-SHA header value
#   MAX_ATTEMPTS    - (Optional) Maximum retry attempts (default: 30)
#   INITIAL_DELAY   - (Optional) Initial delay in seconds (default: 10)
#
# Examples:
#   probe.sh "https://example.com"
#   probe.sh "https://example.com" "abc123" 20 5
#   probe.sh "https://preview.example.com" "$CF_PAGES_COMMIT_SHA"
#
# Exit codes:
#   0 - URL returned 200 (and SHA matched if provided)
#   1 - Timed out or error occurred

URL="${1:-}"
EXPECTED_SHA="${2:-}"
MAX_ATTEMPTS="${3:-30}"
INITIAL_DELAY="${4:-10}"

if [ -z "$URL" ]; then
  echo "❌ Usage: probe.sh <URL> [EXPECTED_SHA] [MAX_ATTEMPTS] [INITIAL_DELAY]"
  exit 1
fi

echo "🔍 Probing: $URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -n "$EXPECTED_SHA" ]; then
  echo "Expected SHA: $EXPECTED_SHA"
fi
echo "Max attempts: $MAX_ATTEMPTS"
echo "Initial delay: ${INITIAL_DELAY}s (exponential backoff)"
echo ""

attempt=0
delay=$INITIAL_DELAY

while [ $attempt -lt "$MAX_ATTEMPTS" ]; do
  attempt=$((attempt + 1))

  # Fetch status code and headers
  http_code=$(curl -s -o /dev/null -w "%{http_code}" "$URL" || echo "000")

  echo "[$attempt/$MAX_ATTEMPTS] HTTP $http_code"

  # Check if we got 200
  if [ "$http_code" = "200" ]; then

    # If SHA verification requested, check it
    if [ -n "$EXPECTED_SHA" ]; then
      # Fetch the CF-Pages-Commit-SHA header (case-insensitive)
      actual_sha=$(curl -sI "$URL" | grep -i '^cf-pages-commit-sha:' | awk '{print $2}' | tr -d '\r' || echo "")

      if [ -z "$actual_sha" ]; then
        echo "  ⚠️  No CF-Pages-Commit-SHA header found"
      elif [ "$actual_sha" = "$EXPECTED_SHA" ]; then
        echo "  ✅ SHA match: $actual_sha"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ URL is live and SHA verified!"
        exit 0
      else
        echo "  ⚠️  SHA mismatch: got $actual_sha, expected $EXPECTED_SHA"
        echo "  (Old deployment still serving, retrying...)"
      fi
    else
      # No SHA verification needed, just 200 is enough
      echo ""
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo "✅ URL is live!"
      exit 0
    fi
  fi

  # Not ready yet, wait with exponential backoff
  if [ $attempt -lt "$MAX_ATTEMPTS" ]; then
    echo "  Waiting ${delay}s before retry..."
    sleep "$delay"

    # Exponential backoff (cap at 60s)
    delay=$((delay * 2))
    if [ $delay -gt 60 ]; then
      delay=60
    fi
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "❌ Timeout: URL did not return 200 after $MAX_ATTEMPTS attempts"
exit 1
