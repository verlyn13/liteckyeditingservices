#!/usr/bin/env fish

# Load Cloudflare credentials from gopass for project use (Fish shell version)
# Source this file to set environment variables: source scripts/load-cloudflare-env.fish

# Colors for output
set GREEN '\033[0;32m'
set RED '\033[0;31m'
set YELLOW '\033[1;33m'
set NC '\033[0m' # No Color

# Check if gopass is available
if not command -v gopass > /dev/null
    echo "$RED✗ gopass is not installed$NC"
    exit 1
end

# Retrieve the API token from gopass
echo "Loading Cloudflare credentials from gopass..."
# Try password field first, then body
set -gx CF_API_TOKEN (gopass show -o cloudflare/api-tokens/initial-project-setup-master 2>/dev/null)
if test -z "$CF_API_TOKEN"
    # If password field is empty, get first non-empty line from body
    set -gx CF_API_TOKEN (gopass show cloudflare/api-tokens/initial-project-setup-master 2>/dev/null | grep -v '^$' | head -1)
end

if test -z "$CF_API_TOKEN"
    echo "$RED✗ Failed to retrieve API token from gopass$NC"
    echo "Make sure you've stored it with:"
    echo "  gopass insert cloudflare/api-tokens/initial-project-setup-master"
    return 1
end

echo "$GREEN✓ CF_API_TOKEN loaded from gopass$NC"

# Set zone ID from config
set -gx CF_ZONE_ID a5e7c69768502d649a8f2c615f555eca

# Try to get account ID from API
echo "Retrieving Account ID..."
set -gx CF_ACCOUNT_ID (curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" | \
    python3 -c "import sys, json; data = json.load(sys.stdin); print(data['result']['account']['id']) if data.get('success') else ''" 2>/dev/null)

if test -n "$CF_ACCOUNT_ID"
    echo "$GREEN✓ CF_ACCOUNT_ID retrieved: $CF_ACCOUNT_ID$NC"
else
    echo "$YELLOW⚠ Could not retrieve Account ID$NC"
end

# Verify the token works
if command -v flarectl > /dev/null; or test -f "$HOME/go/bin/flarectl"
    set FLARECTL flarectl
    if not command -v flarectl > /dev/null
        set FLARECTL "$HOME/go/bin/flarectl"
    end
    
    echo "Verifying Cloudflare API connection..."
    if $FLARECTL user info > /dev/null 2>&1
        echo "$GREEN✓ Successfully authenticated with Cloudflare API$NC"
        echo ""
        echo "You can now use flarectl commands:"
        echo "  flarectl zone list"
        echo "  flarectl dns list -z <zone-id>"
    else
        echo "$YELLOW⚠ Could not verify API token$NC"
        echo "The token is loaded but may not have the correct permissions."
    end
else
    echo "$YELLOW⚠ flarectl not found, skipping verification$NC"
end

echo ""
echo "Environment variables set:"
echo "  CF_API_TOKEN=<loaded from gopass>"
echo "  CF_ZONE_ID=$CF_ZONE_ID"
if test -n "$CF_ACCOUNT_ID"
    echo "  CF_ACCOUNT_ID=$CF_ACCOUNT_ID"
end
