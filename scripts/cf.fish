#!/usr/bin/env fish

# Cloudflare CLI wrapper for liteckyeditingservices.com
# Usage: ./scripts/cf.fish <flarectl-command>

# Load zone configuration
set -x CF_ZONE_ID a5e7c69768502d649a8f2c615f555eca
set -x CF_ZONE_NAME liteckyeditingservices.com

# Load API token from gopass
set -x CF_API_TOKEN (gopass show -o cloudflare/api-tokens/initial-project-setup-master)

if test -z "$CF_API_TOKEN"
    echo "Error: Could not load API token from gopass"
    exit 1
end

# Execute flarectl with all arguments
~/go/bin/flarectl $argv
