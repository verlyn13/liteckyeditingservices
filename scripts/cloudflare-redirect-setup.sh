#!/usr/bin/env bash
# Cloudflare Redirect Rule Setup - Apex → WWW
#
# This script creates a zone-level redirect rule to redirect apex domain
# to www subdomain. Required for Decap CMS OAuth to work correctly.
#
# Prerequisites:
#   - CLOUDFLARE_API_TOKEN with Zone.Zone Read + Zone.Zone Settings Edit permissions
#   - CLOUDFLARE_ZONE_ID for liteckyeditingservices.com
#
# Usage:
#   ./scripts/cloudflare-redirect-setup.sh
#
# Or with inline env vars:
#   CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_ZONE_ID=yyy ./scripts/cloudflare-redirect-setup.sh

set -euo pipefail

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m' # No Color

# Configuration
readonly RULE_NAME="Apex to WWW"
readonly APEX_DOMAIN="liteckyeditingservices.com"
readonly WWW_DOMAIN="www.liteckyeditingservices.com"

# Check prerequisites
check_prerequisites() {
  if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
    echo -e "${RED}Error: CLOUDFLARE_API_TOKEN not set${NC}"
    echo "Export it or pass it inline:"
    echo "  export CLOUDFLARE_API_TOKEN=your_token_here"
    echo "  ./scripts/cloudflare-redirect-setup.sh"
    exit 1
  fi

  if [[ -z "${CLOUDFLARE_ZONE_ID:-}" ]]; then
    echo -e "${RED}Error: CLOUDFLARE_ZONE_ID not set${NC}"
    echo "Export it or pass it inline:"
    echo "  export CLOUDFLARE_ZONE_ID=your_zone_id_here"
    echo "  ./scripts/cloudflare-redirect-setup.sh"
    echo ""
    echo "Find your zone ID:"
    echo "  1. Log in to Cloudflare dashboard"
    echo "  2. Select ${APEX_DOMAIN}"
    echo "  3. Zone ID is on the right sidebar"
    exit 1
  fi

  if ! command -v curl >/dev/null 2>&1; then
    echo -e "${RED}Error: curl not found${NC}"
    exit 1
  fi

  if ! command -v jq >/dev/null 2>&1; then
    echo -e "${YELLOW}Warning: jq not found, output will be raw JSON${NC}"
  fi
}

# Check if redirect rule already exists
check_existing_rule() {
  echo "Checking for existing redirect rules..."

  local response
  response=$(curl -s -X GET \
    "https://api.cloudflare.com/v4/zones/${CLOUDFLARE_ZONE_ID}/rulesets/phases/http_request_dynamic_redirect/entrypoint" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json")

  if command -v jq >/dev/null 2>&1; then
    local existing_rule
    existing_rule=$(echo "$response" | jq -r ".result.rules[] | select(.description == \"${RULE_NAME}\") | .id")

    if [[ -n "$existing_rule" ]]; then
      echo -e "${YELLOW}Found existing rule: ${existing_rule}${NC}"
      echo "Rule already exists. Do you want to:"
      echo "  1) Skip (keep existing rule)"
      echo "  2) Delete and recreate"
      read -rp "Choice [1/2]: " choice

      case $choice in
        2)
          echo "Deleting existing rule..."
          delete_rule "$existing_rule"
          return 1
          ;;
        *)
          echo -e "${GREEN}Keeping existing rule${NC}"
          return 0
          ;;
      esac
    fi
  fi

  return 1
}

# Delete a redirect rule
delete_rule() {
  local rule_id="$1"

  curl -s -X DELETE \
    "https://api.cloudflare.com/v4/zones/${CLOUDFLARE_ZONE_ID}/rulesets/phases/http_request_dynamic_redirect/entrypoint/rules/${rule_id}" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" >/dev/null

  echo "Deleted rule: ${rule_id}"
}

# Create the redirect rule
create_redirect_rule() {
  echo "Creating redirect rule: ${RULE_NAME}"
  echo "  From: https://${APEX_DOMAIN}"
  echo "  To:   https://${WWW_DOMAIN}"

  local payload
  payload=$(cat <<EOF
{
  "rules": [
    {
      "action": "redirect",
      "action_parameters": {
        "from_value": {
          "target_url": {
            "expression": "concat(\"https://www.\", http.host, http.request.uri.path)"
          },
          "status_code": 301,
          "preserve_query_string": true
        }
      },
      "expression": "(http.host eq \"${APEX_DOMAIN}\")",
      "description": "${RULE_NAME}",
      "enabled": true
    }
  ]
}
EOF
)

  local response
  response=$(curl -s -X PUT \
    "https://api.cloudflare.com/v4/zones/${CLOUDFLARE_ZONE_ID}/rulesets/phases/http_request_dynamic_redirect/entrypoint" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "$payload")

  if command -v jq >/dev/null 2>&1; then
    local success
    success=$(echo "$response" | jq -r '.success')

    if [[ "$success" == "true" ]]; then
      echo -e "${GREEN}✓ Redirect rule created successfully${NC}"
      echo ""
      echo "Rule ID: $(echo "$response" | jq -r '.result.rules[0].id')"
    else
      echo -e "${RED}✗ Failed to create redirect rule${NC}"
      echo "$response" | jq '.'
      return 1
    fi
  else
    echo "$response"
  fi
}

# Verify the redirect is working
verify_redirect() {
  echo ""
  echo "Verifying redirect (may take a few seconds to propagate)..."
  sleep 3

  local location
  location=$(curl -sI "https://${APEX_DOMAIN}" | grep -i "^location:" | awk '{print $2}' | tr -d '\r')

  if [[ "$location" == "https://${WWW_DOMAIN}/"* ]]; then
    echo -e "${GREEN}✓ Redirect is working correctly${NC}"
    echo "  ${APEX_DOMAIN} → ${location}"
  else
    echo -e "${YELLOW}⚠ Redirect may still be propagating${NC}"
    echo "  Expected: https://${WWW_DOMAIN}/"
    echo "  Got: ${location:-"(empty)"}"
    echo ""
    echo "Try again in a few seconds:"
    echo "  curl -sI https://${APEX_DOMAIN} | grep -i location"
  fi
}

# Main execution
main() {
  echo "================================================================"
  echo "Cloudflare Redirect Rule Setup: Apex → WWW"
  echo "================================================================"
  echo ""

  check_prerequisites

  if check_existing_rule; then
    echo ""
    echo "Nothing to do - rule already exists and is active"
    verify_redirect
    exit 0
  fi

  create_redirect_rule
  verify_redirect

  echo ""
  echo "================================================================"
  echo "Setup complete!"
  echo ""
  echo "Next steps:"
  echo "  1. Verify redirect: curl -sI https://${APEX_DOMAIN}"
  echo "  2. Update GitHub OAuth App callback URL to:"
  echo "     https://${WWW_DOMAIN}/api/callback"
  echo "  3. Test Decap CMS login at https://${WWW_DOMAIN}/admin"
  echo "================================================================"
}

main "$@"
