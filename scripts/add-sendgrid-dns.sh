#!/bin/bash

# Add SendGrid DNS Records to Cloudflare
# This script adds all required SendGrid domain authentication records

set -e  # Exit on any error

echo "===================================="
echo "Adding SendGrid DNS Records"
echo "===================================="

# Load Cloudflare credentials
export CF_API_TOKEN=$(gopass show -o cloudflare/api-tokens/initial-project-setup-master 2>/dev/null)
export ZONE_ID=a5e7c69768502d649a8f2c615f555eca

if [ -z "$CF_API_TOKEN" ]; then
    echo "❌ Error: Could not retrieve Cloudflare API token from gopass"
    exit 1
fi

echo "✓ Cloudflare credentials loaded"
echo ""

# Function to add DNS record
add_dns_record() {
    local TYPE=$1
    local NAME=$2
    local CONTENT=$3
    local PROXIED=${4:-false}

    echo "Adding $TYPE record: $NAME → $CONTENT"

    response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data "{
            \"type\": \"$TYPE\",
            \"name\": \"$NAME\",
            \"content\": \"$CONTENT\",
            \"proxied\": $PROXIED,
            \"ttl\": 1
        }")

    success=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('success', False))")

    if [ "$success" = "True" ]; then
        echo "  ✅ Successfully added $NAME"
    else
        error=$(echo "$response" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('errors', [{'message': 'Unknown error'}])[0].get('message', 'Unknown error'))")
        echo "  ⚠️  Error adding $NAME: $error"

        # Check if it's a duplicate error
        if [[ "$error" == *"already exists"* ]]; then
            echo "  ℹ️  Record already exists, skipping..."
        else
            return 1
        fi
    fi
}

# Add SendGrid CNAME Records
echo "📝 Adding SendGrid CNAME Records..."
echo ""

add_dns_record "CNAME" "email.liteckyeditingservices.com" "sendgrid.net"
add_dns_record "CNAME" "54920324.liteckyeditingservices.com" "sendgrid.net"
add_dns_record "CNAME" "em1041.liteckyeditingservices.com" "u54920324.wl075.sendgrid.net"
add_dns_record "CNAME" "s1._domainkey.liteckyeditingservices.com" "s1.domainkey.u54920324.wl075.sendgrid.net"
add_dns_record "CNAME" "s2._domainkey.liteckyeditingservices.com" "s2.domainkey.u54920324.wl075.sendgrid.net"

echo ""
echo "📝 Adding SendGrid TXT Record (DMARC)..."
echo ""

add_dns_record "TXT" "_dmarc.liteckyeditingservices.com" "v=DMARC1; p=none;"

echo ""
echo "📝 Updating SPF Record to include SendGrid..."
echo ""

# First, get the existing SPF record ID
spf_record=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=TXT&name=liteckyeditingservices.com" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" | \
    python3 -c "import sys, json;
records = json.load(sys.stdin).get('result', [])
for r in records:
    if 'v=spf1' in r.get('content', ''):
        print(r['id'])
        break")

if [ -n "$spf_record" ]; then
    echo "Found existing SPF record: $spf_record"
    echo "Updating SPF to include SendGrid..."

    update_response=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$spf_record" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data '{
            "type": "TXT",
            "name": "liteckyeditingservices.com",
            "content": "v=spf1 include:_spf.google.com include:sendgrid.net ~all",
            "ttl": 1
        }')

    update_success=$(echo "$update_response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('success', False))")

    if [ "$update_success" = "True" ]; then
        echo "  ✅ Successfully updated SPF record to include SendGrid"
    else
        echo "  ⚠️  Error updating SPF record"
    fi
else
    echo "  ℹ️  No existing SPF record found, creating new one with SendGrid..."
    add_dns_record "TXT" "liteckyeditingservices.com" "v=spf1 include:_spf.google.com include:sendgrid.net ~all"
fi

echo ""
echo "===================================="
echo "✅ SendGrid DNS Records Added!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Wait 5-15 minutes for DNS propagation"
echo "2. Return to SendGrid domain authentication"
echo "3. Click 'Verify' to confirm records"
echo "4. Set up Single Sender Verification for hello@liteckyeditingservices.com"
echo ""
echo "To verify DNS propagation, run:"
echo "  dig email.liteckyeditingservices.com CNAME"
echo "  dig _dmarc.liteckyeditingservices.com TXT"
echo ""