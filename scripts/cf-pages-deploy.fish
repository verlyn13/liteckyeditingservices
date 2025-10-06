#!/usr/bin/env fish

# Cloudflare Pages Deployment Helper
# Prepares and manages Cloudflare Pages deployment for liteckyeditingservices.com

set ZONE_ID a5e7c69768502d649a8f2c615f555eca
set ZONE_NAME liteckyeditingservices.com
set PROJECT_NAME liteckyeditingservices
set -x CF_API_TOKEN (gopass show -o cloudflare/api-tokens/initial-project-setup-master)

# Colors
set GREEN '\033[0;32m'
set RED '\033[0;31m'
set YELLOW '\033[1;33m'
set BLUE '\033[0;34m'
set NC '\033[0m'

function show_deployment_status
    echo -e "$BLUE███ Cloudflare Pages Deployment Status ███$NC"
    echo ""
    
    # Check for existing Pages project
    echo -e "$BLUE→ Checking for existing Pages projects...$NC"
    
    # Get account ID
    set ACCOUNT_ID (curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" | \
        python3 -c "import sys, json; print(json.load(sys.stdin)['result']['account']['id'])" 2>/dev/null)
    
    if test -z "$ACCOUNT_ID"
        echo -e "$RED✗ Could not get account ID$NC"
        return 1
    end
    
    echo "Account ID: $ACCOUNT_ID"
    
    # Check Pages projects
    set projects (curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json")
    
    echo $projects | python3 -c "import sys, json
data = json.load(sys.stdin)
if data['success'] and data['result']:
    print('\n✅ Existing Pages Projects:')
    for p in data['result']:
        print(f\"  - {p['name']}: {p['subdomain']}\")
        if p.get('domains'):
            for d in p['domains']:
                print(f\"    Custom domain: {d}\")
else:
    print('\n⚠️  No Pages projects found')"
    
    echo ""
    echo -e "$BLUE→ Current DNS Configuration:$NC"
    ./scripts/cf-dns-manage.fish list | head -10
end

function prepare_deployment
    echo -e "$BLUE███ Preparing Cloudflare Pages Deployment ███$NC"
    echo ""
    echo "This process will:"
    echo "  1. Build your Astro site for production"
    echo "  2. Create a Pages project (if needed)"
    echo "  3. Deploy to Cloudflare Pages"
    echo "  4. Configure custom domain"
    echo ""
    
    # Check if site is built
    if not test -d dist
        echo -e "$YELLOW⚠ No dist/ directory found. Building site...$NC"
        pnpm build
        if test $status -ne 0
            echo -e "$RED✗ Build failed. Fix errors and try again.$NC"
            return 1
        end
    end
    
    echo -e "$GREEN✓ Site built successfully$NC"
    echo ""
    echo "Next steps:"
    echo "1. Install Wrangler: pnpm add -D wrangler"
    echo "2. Deploy to Pages: pnpm wrangler pages deploy dist/"
    echo "3. Configure domain in Cloudflare dashboard"
    echo "4. Update DNS records with: ./scripts/cf-dns-manage.fish"
end

function create_wrangler_config
    echo -e "$BLUE→ Creating wrangler.toml configuration...$NC"
    
    cat > wrangler.toml << 'EOF'
name = "liteckyeditingservices"
compatibility_date = "2025-09-23"

[site]
bucket = "./dist"

[env.production]
route = "liteckyeditingservices.com/*"
zone_id = "a5e7c69768502d649a8f2c615f555eca"

[env.preview]
name = "litecky-editing-preview"

# D1 Database binding (when ready)
# [[d1_databases]]
# binding = "DB"
# database_name = "litecky-db"
# database_id = "your-database-id"

# R2 Storage binding (when ready)
# [[r2_buckets]]
# binding = "UPLOADS"
# bucket_name = "litecky-uploads"

# KV Namespace binding (when ready)
# [[kv_namespaces]]
# binding = "CACHE"
# id = "your-kv-id"
EOF
    
    echo -e "$GREEN✓ Created wrangler.toml$NC"
end

function deploy_to_pages
    echo -e "$BLUE→ Deploying to Cloudflare Pages...$NC"
    
    # Check if wrangler is installed
    if not command -v wrangler > /dev/null
        if not test -f node_modules/.bin/wrangler
            echo -e "$YELLOW⚠ Wrangler not installed. Installing...$NC"
            pnpm add -D wrangler
        end
    end
    
    # Deploy
    echo -e "$BLUE→ Running deployment...$NC"
    pnpm wrangler pages deploy dist/ --project-name=$PROJECT_NAME
end

function show_dns_update_commands
    echo -e "$BLUE███ DNS Update Commands for Pages ███$NC"
    echo ""
    echo "After deploying to Pages, update DNS with these commands:"
    echo ""
    echo -e "$YELLOW# 1. Backup current DNS$NC"
    echo "./scripts/cf-dns-manage.fish backup"
    echo ""
    echo -e "$YELLOW# 2. Get the www CNAME record ID to update$NC"
    echo "./scripts/cf-dns-manage.fish list"
    echo ""
    echo -e "$YELLOW# 3. Update www to point to Pages$NC"
    echo "./scripts/cf-dns-manage.fish delete [old-www-record-id]"
    echo "./scripts/cf-dns-manage.fish add CNAME www $PROJECT_NAME.pages.dev"
    echo ""
    echo -e "$YELLOW# 4. Update apex domain$NC"
    echo "./scripts/cf-dns-manage.fish delete [old-apex-record-id]"
    echo "./scripts/cf-dns-manage.fish add CNAME @ $PROJECT_NAME.pages.dev"
end

# Main menu
if test (count $argv) -eq 0
    echo "Usage: $argv[0] [command]"
    echo ""
    echo "Commands:"
    echo "  status     - Show current deployment status"
    echo "  prepare    - Prepare for deployment"
    echo "  config     - Create wrangler.toml configuration"
    echo "  deploy     - Deploy to Cloudflare Pages"
    echo "  dns        - Show DNS update commands"
    exit 1
end

switch $argv[1]
    case status
        show_deployment_status
    case prepare
        prepare_deployment
    case config
        create_wrangler_config
    case deploy
        deploy_to_pages
    case dns
        show_dns_update_commands
    case '*'
        echo -e "$RED✗ Unknown command: $argv[1]$NC"
        exit 1
end
