#!/usr/bin/env fish

# DNS Management Script for liteckyeditingservices.com
# Safe DNS record management with backup and rollback capabilities

# Load configuration from desired-state
set ZONE_CONFIG (cat desired-state/cloudflare-env.json 2>/dev/null)
if test -z "$ZONE_CONFIG"
    echo "Error: Could not load desired-state/cloudflare-env.json"
    exit 1
end
set ZONE_ID (echo $ZONE_CONFIG | python3 -c "import sys, json; print(json.load(sys.stdin)['zone']['id'])")
set ZONE_NAME (echo $ZONE_CONFIG | python3 -c "import sys, json; print(json.load(sys.stdin)['zone']['name'])")
set -x CF_API_TOKEN (gopass show -o cloudflare/api-tokens/initial-project-setup-master)

# Colors
set GREEN '\033[0;32m'
set RED '\033[0;31m'
set YELLOW '\033[1;33m'
set BLUE '\033[0;34m'
set NC '\033[0m'

function show_usage
    echo "Usage: $argv[0] [command] [options]"
    echo ""
    echo "Commands:"
    echo "  list                    - List all DNS records"
    echo "  backup                  - Backup current DNS configuration"
    echo "  add [type] [name] [content] [priority]  - Add a new DNS record"
    echo "  update [record-id] [content]            - Update existing record"
    echo "  delete [record-id]                      - Delete a record (with confirmation)"
    echo "  prepare-pages           - Prepare DNS for Cloudflare Pages deployment"
    echo "  rollback [backup-file]  - Restore DNS from backup"
    echo ""
    echo "Examples:"
    echo "  $argv[0] list"
    echo "  $argv[0] backup"
    echo "  $argv[0] add CNAME www liteckyeditingservices.pages.dev"
    echo "  $argv[0] add MX mail mail.example.com 10"
    echo "  $argv[0] delete abc123def456"
end

function list_records
    echo -e "$BLUE→ Fetching DNS records for $ZONE_NAME...$NC"
    curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" | \
        python3 -c "import sys, json; 
records = json.load(sys.stdin)['result']
for r in records:
    print(f\"{r['type']:6} {r['name']:40} {r.get('content', '')[:50]:50} {'Proxied' if r.get('proxied') else 'DNS only':8} {r['id']}\")"
end

function backup_dns
    set backup_file "dns-backup-"(date +%Y%m%d-%H%M%S)".json"
    echo -e "$BLUE→ Creating DNS backup: $backup_file$NC"
    
    curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?per_page=100" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" > $backup_file
    
    if test -s $backup_file
        echo -e "$GREEN✓ Backup saved to $backup_file$NC"
        echo "Records backed up: "(cat $backup_file | python3 -c "import sys, json; print(len(json.load(sys.stdin)['result']))")
    else
        echo -e "$RED✗ Backup failed$NC"
        rm -f $backup_file
        return 1
    end
end

function add_record
    set record_type $argv[1]
    set record_name $argv[2]
    set record_content $argv[3]
    set record_priority $argv[4]
    
    echo -e "$BLUE→ Adding $record_type record: $record_name → $record_content$NC"
    
    # Build JSON payload
    if test "$record_type" = "MX"
        set json_data "{\"type\":\"$record_type\",\"name\":\"$record_name\",\"content\":\"$record_content\",\"priority\":$record_priority}"
    else
        set json_data "{\"type\":\"$record_type\",\"name\":\"$record_name\",\"content\":\"$record_content\",\"proxied\":true}"
    end
    
    set response (curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" \
        -d $json_data)
    
    if echo $response | grep -q '"success":true'
        echo -e "$GREEN✓ Record added successfully$NC"
    else
        echo -e "$RED✗ Failed to add record$NC"
        echo $response | python3 -m json.tool
    end
end

function delete_record
    set record_id $argv[1]
    
    echo -e "$YELLOW⚠ Are you sure you want to delete record $record_id? (yes/no)$NC"
    read -P "> " confirm
    
    if test "$confirm" != "yes"
        echo "Cancelled"
        return
    end
    
    echo -e "$BLUE→ Deleting record $record_id...$NC"
    
    set response (curl -s -X DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$record_id" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json")
    
    if echo $response | grep -q '"success":true'
        echo -e "$GREEN✓ Record deleted successfully$NC"
    else
        echo -e "$RED✗ Failed to delete record$NC"
        echo $response | python3 -m json.tool
    end
end

function prepare_pages
    echo -e "$BLUE→ Preparing DNS for Cloudflare Pages deployment$NC"
    echo ""
    echo "This will:"
    echo "1. Backup current DNS configuration"
    echo "2. Update CNAME records for Pages deployment"
    echo "3. Keep email (MX) records intact"
    echo ""
    echo -e "$YELLOW⚠ Continue? (yes/no)$NC"
    read -P "> " confirm
    
    if test "$confirm" != "yes"
        echo "Cancelled"
        return
    end
    
    # First, create backup
    backup_dns
    
    echo -e "$BLUE→ Ready to update DNS records$NC"
    echo "Next steps:"
    echo "1. Deploy your site to Cloudflare Pages first"
    echo "2. Get your .pages.dev subdomain"
    echo "3. Run: $argv[0] add CNAME www your-project.pages.dev"
    echo "4. Update root domain after testing"
end

# Main command handler
if test (count $argv) -eq 0
    show_usage
    exit 1
end

switch $argv[1]
    case list
        list_records
    case backup
        backup_dns
    case add
        if test (count $argv) -lt 4
            echo -e "$RED✗ Missing arguments for add command$NC"
            show_usage
            exit 1
        end
        add_record $argv[2..]
    case delete
        if test (count $argv) -lt 2
            echo -e "$RED✗ Missing record ID$NC"
            show_usage
            exit 1
        end
        delete_record $argv[2]
    case prepare-pages
        prepare_pages
    case '*'
        echo -e "$RED✗ Unknown command: $argv[1]$NC"
        show_usage
        exit 1
end
