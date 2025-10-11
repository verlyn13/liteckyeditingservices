#!/bin/bash

# Generate .dev.vars from gopass credentials
# This script recreates the development environment from stored secrets

set -e

echo "🔐 Generating .dev.vars from gopass credentials..."

# Check if gopass is available
if ! command -v gopass &> /dev/null; then
    echo "❌ Error: gopass is not installed or not in PATH"
    exit 1
fi

# Backup existing .dev.vars if it exists
if [ -f ".dev.vars" ]; then
    echo "📦 Backing up existing .dev.vars to .dev.vars.backup"
    cp .dev.vars .dev.vars.backup
fi

# Create new .dev.vars file
cat > .dev.vars << 'EOF'
# Turnstile Configuration (Development)
EOF

# Get Turnstile keys
echo -n "PUBLIC_TURNSTILE_SITE_KEY=" >> .dev.vars
(gopass show -o development/turnstile/site-key 2>/dev/null || echo "# Missing turnstile/site-key") >> .dev.vars
echo "" >> .dev.vars

echo -n "TURNSTILE_SECRET_KEY=" >> .dev.vars
(gopass show -o development/turnstile/secret-key 2>/dev/null || echo "# Missing turnstile/secret-key") >> .dev.vars
echo "" >> .dev.vars

cat >> .dev.vars << 'EOF'

# SendGrid Configuration
EOF

# Get SendGrid configuration
echo -n "SENDGRID_API_KEY=" >> .dev.vars
(gopass show -o development/sendgrid/api-key 2>/dev/null || echo "# Missing sendgrid/api-key") >> .dev.vars
echo "" >> .dev.vars

echo -n "EMAIL_FROM=" >> .dev.vars
(gopass show -o development/sendgrid/email-from 2>/dev/null || echo "# Missing sendgrid/email-from") >> .dev.vars
echo "" >> .dev.vars

echo -n "EMAIL_TO=" >> .dev.vars
(gopass show -o development/sendgrid/email-to 2>/dev/null || echo "# Missing sendgrid/email-to") >> .dev.vars
echo "" >> .dev.vars

echo -n "SENDGRID_DOMAIN_ID=" >> .dev.vars
(gopass show -o development/sendgrid/domain-id 2>/dev/null || echo "# Missing sendgrid/domain-id") >> .dev.vars
echo "" >> .dev.vars

cat >> .dev.vars << 'EOF'

# GitHub OAuth (for Decap CMS)
EOF

# Get GitHub OAuth credentials
echo -n "GITHUB_CLIENT_ID=" >> .dev.vars
(gopass show -o github/litecky/oauth/client-id 2>/dev/null || echo "# Missing github/litecky/oauth/client-id") >> .dev.vars
echo "" >> .dev.vars

echo -n "GITHUB_CLIENT_SECRET=" >> .dev.vars
(gopass show -o github/litecky/oauth/client-secret 2>/dev/null || echo "# Missing github/litecky/oauth/client-secret") >> .dev.vars
echo "" >> .dev.vars

cat >> .dev.vars << 'EOF'

# Sentry (client-side; DSN is non-secret)
PUBLIC_SENTRY_DSN=
PUBLIC_SENTRY_ENVIRONMENT=development
PUBLIC_SENTRY_RELEASE=1.0.0

# Sentry build-time (sensitive: pulled from gopass)
SENTRY_ORG=happy-patterns-llc
SENTRY_PROJECT=javascript-astro
EOF

# Build-time Sentry auth token from gopass (if available)
echo -n "SENTRY_AUTH_TOKEN=" >> .dev.vars
(gopass show -o sentry/happy-patterns-llc/auth-token 2>/dev/null || echo "# Missing sentry/happy-patterns-llc/auth-token") >> .dev.vars
echo "" >> .dev.vars

cat >> .dev.vars << 'EOF'

# Force SendGrid to actually send emails in dev (bypasses sandbox mode)
# Uncomment to send real emails during testing
# SENDGRID_FORCE_SEND=true
EOF

echo ""
echo "✅ .dev.vars generated successfully!"
echo ""
echo "📋 Credentials loaded from gopass:"
echo "   • GitHub OAuth: github/litecky/oauth/*"
echo "   • Turnstile keys: development/turnstile/*"
echo "   • SendGrid config: development/sendgrid/*"
echo "   • Sentry tokens: sentry/happy-patterns-llc/*"
echo ""

# Check if any credentials are missing
missing=false
for path in "github/litecky/oauth/client-id" "github/litecky/oauth/client-secret" \
            "development/turnstile/site-key" "development/turnstile/secret-key" \
            "development/sendgrid/api-key" "development/sendgrid/email-from" \
            "development/sendgrid/email-to" "development/sendgrid/domain-id"; do
    if ! gopass show "$path" &>/dev/null; then
        echo "⚠️  Missing credential: $path"
        missing=true
    fi
done

if [ "$missing" = true ]; then
    echo ""
    echo "📝 Some credentials are missing. Run store-dev-vars-in-gopass.sh to populate them."
fi

# Make the file readable only by owner for security
chmod 600 .dev.vars

echo ""
echo "🔒 File permissions set to 600 (owner read/write only)"
