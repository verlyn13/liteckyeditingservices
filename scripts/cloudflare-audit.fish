#!/usr/bin/env fish

# Comprehensive Cloudflare domain audit script
# Generates a full status report for liteckyeditingservices.com

# Colors
set GREEN '\033[0;32m'
set YELLOW '\033[1;33m'
set BLUE '\033[0;34m'
set NC '\033[0m'

# Configuration
set ZONE_ID a5e7c69768502d649a8f2c615f555eca
set ZONE_NAME liteckyeditingservices.com
set REPORT_FILE CLOUDFLARE-STATUS.md

# Load API token
set -x CF_API_TOKEN (gopass show -o cloudflare/api-tokens/initial-project-setup-master)

if test -z "$CF_API_TOKEN"
    echo -e "$RED✗ Failed to load API token from gopass$NC"
    exit 1
end

echo -e "$BLUE→ Starting Cloudflare domain audit for $ZONE_NAME$NC"

# Initialize report
echo "# Cloudflare Domain Status Report" > $REPORT_FILE
echo "**Domain:** liteckyeditingservices.com" >> $REPORT_FILE
echo "**Generated:** "(date) >> $REPORT_FILE
echo "**Zone ID:** $ZONE_ID" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# 1. Zone Information
echo -e "$GREEN✓ Fetching zone information...$NC"
echo "## 1. Zone Configuration" >> $REPORT_FILE
echo '```' >> $REPORT_FILE
~/go/bin/flarectl zone info --zone $ZONE_NAME >> $REPORT_FILE 2>&1
echo '```' >> $REPORT_FILE
echo "" >> $REPORT_FILE

# 2. DNS Records (using curl API since flarectl has issues)
echo -e "$GREEN✓ Fetching DNS records...$NC"
echo "## 2. DNS Records" >> $REPORT_FILE
echo '```json' >> $REPORT_FILE
curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" | python3 -m json.tool >> $REPORT_FILE 2>&1
echo '```' >> $REPORT_FILE
echo "" >> $REPORT_FILE

# 3. SSL/TLS Settings
echo -e "$GREEN✓ Checking SSL/TLS settings...$NC"
echo "## 3. SSL/TLS Configuration" >> $REPORT_FILE
echo '```json' >> $REPORT_FILE
curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" | python3 -m json.tool >> $REPORT_FILE 2>&1
echo '```' >> $REPORT_FILE
echo "" >> $REPORT_FILE

# 4. Page Rules
echo -e "$GREEN✓ Fetching page rules...$NC"
echo "## 4. Page Rules" >> $REPORT_FILE
echo '```json' >> $REPORT_FILE
curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/pagerules" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" | python3 -m json.tool >> $REPORT_FILE 2>&1
echo '```' >> $REPORT_FILE
echo "" >> $REPORT_FILE

# 5. Cloudflare Pages Projects
echo -e "$GREEN✓ Checking Cloudflare Pages...$NC"
echo "## 5. Cloudflare Pages Projects" >> $REPORT_FILE
echo '```json' >> $REPORT_FILE
# Get account ID first
set ACCOUNT_ID (curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" | python3 -c "import sys, json; print(json.load(sys.stdin)['result']['account']['id'])" 2>/dev/null)

if test -n "$ACCOUNT_ID"
    curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" | python3 -m json.tool >> $REPORT_FILE 2>&1
else
    echo "Could not fetch Pages projects - missing account ID" >> $REPORT_FILE
end
echo '```' >> $REPORT_FILE
echo "" >> $REPORT_FILE

# 6. DNS Propagation Check
echo -e "$GREEN✓ Checking DNS propagation...$NC"
echo "## 6. DNS Propagation Status" >> $REPORT_FILE
echo "### A Records" >> $REPORT_FILE
echo '```' >> $REPORT_FILE
dig $ZONE_NAME +short >> $REPORT_FILE 2>&1
echo '```' >> $REPORT_FILE
echo "" >> $REPORT_FILE
echo "### Name Servers" >> $REPORT_FILE
echo '```' >> $REPORT_FILE
dig NS $ZONE_NAME +short >> $REPORT_FILE 2>&1
echo '```' >> $REPORT_FILE
echo "" >> $REPORT_FILE

# 7. Website Availability
echo -e "$GREEN✓ Testing website availability...$NC"
echo "## 7. Website Status" >> $REPORT_FILE
echo "### HTTPS Status (apex domain)" >> $REPORT_FILE
echo '```' >> $REPORT_FILE
curl -sI https://$ZONE_NAME | head -10 >> $REPORT_FILE 2>&1
echo '```' >> $REPORT_FILE
echo "" >> $REPORT_FILE
echo "### HTTPS Status (www subdomain)" >> $REPORT_FILE
echo '```' >> $REPORT_FILE
curl -sI https://www.$ZONE_NAME | head -10 >> $REPORT_FILE 2>&1
echo '```' >> $REPORT_FILE
echo "" >> $REPORT_FILE

# 8. Firewall Rules
echo -e "$GREEN✓ Checking firewall rules...$NC"
echo "## 8. Firewall Rules" >> $REPORT_FILE
echo '```json' >> $REPORT_FILE
curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/firewall/rules" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" | python3 -m json.tool >> $REPORT_FILE 2>&1
echo '```' >> $REPORT_FILE
echo "" >> $REPORT_FILE

# 9. Workers
echo -e "$GREEN✓ Checking Workers...$NC"
echo "## 9. Workers Configuration" >> $REPORT_FILE
echo '```json' >> $REPORT_FILE
curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/workers/routes" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" | python3 -m json.tool >> $REPORT_FILE 2>&1
echo '```' >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Summary
echo "" >> $REPORT_FILE
echo "## Summary" >> $REPORT_FILE
echo "" >> $REPORT_FILE
echo "### Key Information:" >> $REPORT_FILE
echo "- **Zone ID:** $ZONE_ID" >> $REPORT_FILE
echo "- **Plan:** Free Website" >> $REPORT_FILE
echo "- **Status:** Active" >> $REPORT_FILE
echo "- **Name Servers:** carol.ns.cloudflare.com, ignacio.ns.cloudflare.com" >> $REPORT_FILE
echo "- **Proxy Status:** Full (Orange Cloud)" >> $REPORT_FILE
echo "" >> $REPORT_FILE
echo "### Next Steps for Development:" >> $REPORT_FILE
echo "1. Deploy Astro site to Cloudflare Pages" >> $REPORT_FILE
echo "2. Configure custom domain in Pages settings" >> $REPORT_FILE
echo "3. Set up environment variables for production" >> $REPORT_FILE
echo "4. Configure email routing for contact forms" >> $REPORT_FILE
echo "5. Set up Workers for backend functionality" >> $REPORT_FILE

echo -e "$BLUE✓ Audit complete! Report saved to $REPORT_FILE$NC"
echo -e "$YELLOW→ View report with: cat $REPORT_FILE$NC"
