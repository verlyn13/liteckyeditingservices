#!/usr/bin/env bash
#
# Test Cal.com Webhook Endpoint
#
# This script tests the webhook endpoint with a valid HMAC-SHA256 signature.
# It can test both local development and production environments.
#
# Usage:
#   ./scripts/test-calcom-webhook.sh [local|production]
#
# Examples:
#   ./scripts/test-calcom-webhook.sh local
#   ./scripts/test-calcom-webhook.sh production
#
# Requirements:
#   - openssl (for HMAC-SHA256 signature generation)
#   - curl (for HTTP requests)
#   - gopass (for retrieving webhook secret)

set -euo pipefail

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-local}"
WEBHOOK_SECRET=""
WEBHOOK_URL=""

# Function to print colored output
print_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Function to retrieve webhook secret from gopass
get_webhook_secret() {
  if ! command -v gopass &> /dev/null; then
    print_error "gopass not found. Please install gopass or set CALCOM_WEBHOOK_SECRET manually."
    exit 1
  fi

  print_info "Retrieving webhook secret from gopass..."
  WEBHOOK_SECRET=$(gopass show calcom/litecky-editing/webhook-secret 2>/dev/null || echo "")

  if [[ -z "$WEBHOOK_SECRET" ]]; then
    print_error "Webhook secret not found in gopass at: calcom/litecky-editing/webhook-secret"
    print_info "Store the secret with: echo 'whsec_xxx' | gopass insert -f calcom/litecky-editing/webhook-secret"
    exit 1
  fi

  print_success "Webhook secret retrieved"
}

# Function to compute HMAC-SHA256 signature
compute_signature() {
  local payload="$1"
  local secret="$2"

  # Compute HMAC-SHA256 and extract hex digest
  echo -n "$payload" | openssl dgst -sha256 -hmac "$secret" | cut -d' ' -f2
}

# Function to test webhook endpoint
test_webhook() {
  local url="$1"
  local payload="$2"
  local signature="$3"

  print_info "Testing webhook endpoint: $url"
  print_info "Payload: ${payload:0:100}..."

  # Send POST request with signature
  local response
  local http_code

  response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
    -H "Content-Type: application/json" \
    -H "X-Cal-Signature-256: sha256=$signature" \
    -d "$payload")

  # Extract HTTP status code (last line)
  http_code=$(echo "$response" | tail -n1)
  # Extract response body (all but last line)
  local body=$(echo "$response" | sed '$d')

  echo ""
  print_info "Response:"
  echo "  HTTP Status: $http_code"
  echo "  Body: $body"
  echo ""

  # Check response
  if [[ "$http_code" == "200" ]]; then
    print_success "Webhook test PASSED ✓"
    return 0
  else
    print_error "Webhook test FAILED ✗"
    return 1
  fi
}

# Main execution
main() {
  echo ""
  echo "=========================================="
  echo "  Cal.com Webhook Endpoint Test"
  echo "=========================================="
  echo ""

  # Determine webhook URL based on environment
  case "$ENVIRONMENT" in
    local|dev|development)
      WEBHOOK_URL="http://localhost:4321/api/calcom-webhook"
      print_info "Environment: Local Development"
      ;;
    production|prod)
      # Use www to avoid canonical redirect in middleware
      WEBHOOK_URL="https://www.liteckyeditingservices.com/api/calcom-webhook"
      print_info "Environment: Production"
      ;;
    preview)
      print_error "Preview environment requires a specific URL. Please provide it manually."
      print_info "Usage: WEBHOOK_URL='https://xxx.pages.dev/api/calcom-webhook' $0"
      exit 1
      ;;
    *)
      print_error "Invalid environment: $ENVIRONMENT"
      print_info "Usage: $0 [local|production]"
      exit 1
      ;;
  esac

  # Get webhook secret
  get_webhook_secret

  # Create test payload
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  local payload=$(cat <<EOF
{
  "triggerEvent": "BOOKING_CREATED",
  "payload": {
    "uid": "test-$(date +%s)",
    "title": "Test Consultation - Webhook Verification",
    "description": "This is a test booking created by the webhook test script.",
    "startTime": "$timestamp",
    "endTime": "$(date -u -v+30M +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -d '+30 minutes' +"%Y-%m-%dT%H:%M:%SZ")",
    "attendees": [
      {
        "name": "Test User",
        "email": "test@example.com",
        "timeZone": "America/Anchorage"
      }
    ],
    "organizer": {
      "name": "Litecky Editing Services",
      "email": "contact@liteckyeditingservices.com",
      "timeZone": "America/Anchorage"
    },
    "status": "ACCEPTED",
    "metadata": {
      "testRun": true,
      "scriptVersion": "1.0.0"
    }
  }
}
EOF
)

  # Compute signature
  print_info "Computing HMAC-SHA256 signature..."
  local signature=$(compute_signature "$payload" "$WEBHOOK_SECRET")
  print_success "Signature computed: sha256=${signature:0:16}..."

  # Test webhook
  echo ""
  test_webhook "$WEBHOOK_URL" "$payload" "$signature"

  # Additional test: Invalid signature
  echo ""
  print_info "Testing with invalid signature (should fail with 401)..."
  local invalid_signature="0000000000000000000000000000000000000000000000000000000000000000"

  local response
  local http_code

  response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -H "X-Cal-Signature-256: sha256=$invalid_signature" \
    -d "$payload")

  http_code=$(echo "$response" | tail -n1)
  local body=$(echo "$response" | sed '$d')

  echo "  HTTP Status: $http_code"
  echo "  Body: $body"
  echo ""

  if [[ "$http_code" == "401" ]]; then
    print_success "Invalid signature correctly rejected ✓"
  else
    print_warning "Expected 401 Unauthorized, got $http_code"
  fi

  echo ""
  echo "=========================================="
  echo "  Test Complete"
  echo "=========================================="
  echo ""

  # Summary
  if [[ "$ENVIRONMENT" == "local" ]]; then
    print_info "Next steps:"
    echo "  1. Check dev server logs for webhook processing"
    echo "  2. Verify email was queued (if SendGrid configured)"
    echo "  3. Create a real booking at: https://cal.com/litecky-editing/consultation"
  else
    print_info "Next steps:"
    echo "  1. Check Cloudflare logs: wrangler pages deployment tail liteckyeditingservices --production"
    echo "  2. Check Sentry for any errors"
    echo "  3. Verify email notification was sent"
  fi

  echo ""
}

# Run main function
main
