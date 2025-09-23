#!/bin/bash

# Flarectl setup script for Litecky Editing Services
# This script sets up the Cloudflare CLI tool (flarectl) for project use

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if flarectl is installed
if ! command -v flarectl &> /dev/null && ! [ -f "$HOME/go/bin/flarectl" ]; then
    echo -e "${RED}flarectl is not installed!${NC}"
    echo "Install it with: go install github.com/cloudflare/cloudflare-go/cmd/flarectl@latest"
    exit 1
fi

# Use the Go binary if not in PATH
FLARECTL="flarectl"
if ! command -v flarectl &> /dev/null; then
    FLARECTL="$HOME/go/bin/flarectl"
fi

echo -e "${GREEN}✓ flarectl found at: $(which $FLARECTL 2>/dev/null || echo $FLARECTL)${NC}"

# Check for Cloudflare credentials
if [ -z "$CF_API_TOKEN" ] && [ -z "$CF_API_KEY" ]; then
    echo -e "${YELLOW}⚠ No Cloudflare credentials found in environment${NC}"
    echo ""
    echo "To use flarectl, you need to set one of:"
    echo "  1. CF_API_TOKEN (recommended - scoped token)"
    echo "  2. CF_API_KEY + CF_API_EMAIL (legacy global key)"
    echo ""
    echo "For this project, add to .dev.vars:"
    echo "  CF_API_TOKEN=your-api-token"
    echo "  CF_ZONE_ID=your-zone-id"
    echo ""
    echo "Or set temporarily:"
    echo "  export CF_API_TOKEN='your-token-here'"
    echo "  export CF_ZONE_ID='your-zone-id'"
else
    echo -e "${GREEN}✓ Cloudflare credentials found${NC}"
    
    # Test the connection
    echo "Testing Cloudflare API connection..."
    if $FLARECTL user info &> /dev/null; then
        echo -e "${GREEN}✓ Successfully connected to Cloudflare API${NC}"
        
        # Show user info
        echo ""
        echo "Account Information:"
        $FLARECTL user info
    else
        echo -e "${RED}✗ Failed to connect to Cloudflare API${NC}"
        echo "Please check your credentials."
    fi
fi

# Show common commands
echo ""
echo "Common flarectl commands for this project:"
echo "  $FLARECTL zone list                    # List all zones"
echo "  $FLARECTL dns list -z <zone-id>        # List DNS records"
echo "  $FLARECTL zone info -z <zone-id>       # Zone details"
echo "  $FLARECTL pagerules list -z <zone-id>  # List page rules"
echo ""
echo "For JSON output, add --json flag to any command"
