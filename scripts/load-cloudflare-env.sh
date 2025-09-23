#!/bin/bash

# Load Cloudflare credentials from gopass for project use
# Source this file to set environment variables: source scripts/load-cloudflare-env.sh

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gopass is available
if ! command -v gopass &> /dev/null; then
    echo -e "${RED}✗ gopass is not installed${NC}"
    exit 1
fi

# Retrieve the API token from gopass
echo "Loading Cloudflare credentials from gopass..."
# Try password field first, then body
CF_API_TOKEN=$(gopass show -o cloudflare/api-tokens/initial-project-setup-master 2>/dev/null)
if [ -z "$CF_API_TOKEN" ]; then
    # If password field is empty, get first non-empty line from body
    CF_API_TOKEN=$(gopass show cloudflare/api-tokens/initial-project-setup-master 2>/dev/null | grep -v '^$' | head -1)
fi

if [ -z "$CF_API_TOKEN" ]; then
    echo -e "${RED}✗ Failed to retrieve API token from gopass${NC}"
    echo "Make sure you've stored it with:"
    echo "  gopass insert cloudflare/api-tokens/initial-project-setup-master"
    return 1 2>/dev/null || exit 1
fi

export CF_API_TOKEN
echo -e "${GREEN}✓ CF_API_TOKEN loaded from gopass${NC}"

# Also set these if you know them (you can update this script with your values)
# export CF_ZONE_ID="your-zone-id-here"
# export CF_ACCOUNT_ID="your-account-id-here"

# Verify the token works
if command -v flarectl &> /dev/null || [ -f "$HOME/go/bin/flarectl" ]; then
    FLARECTL="flarectl"
    if ! command -v flarectl &> /dev/null; then
        FLARECTL="$HOME/go/bin/flarectl"
    fi
    
    echo "Verifying Cloudflare API connection..."
    if $FLARECTL user info &> /dev/null; then
        echo -e "${GREEN}✓ Successfully authenticated with Cloudflare API${NC}"
        echo ""
        echo "You can now use flarectl commands:"
        echo "  flarectl zone list"
        echo "  flarectl dns list -z <zone-id>"
    else
        echo -e "${YELLOW}⚠ Could not verify API token${NC}"
        echo "The token is loaded but may not have the correct permissions."
    fi
else
    echo -e "${YELLOW}⚠ flarectl not found, skipping verification${NC}"
fi

echo ""
echo "Environment variables set:"
echo "  CF_API_TOKEN=<loaded from gopass>"
[ ! -z "$CF_ZONE_ID" ] && echo "  CF_ZONE_ID=$CF_ZONE_ID"
[ ! -z "$CF_ACCOUNT_ID" ] && echo "  CF_ACCOUNT_ID=$CF_ACCOUNT_ID"
