#!/bin/bash

echo "Storing development environment variables in gopass..."

# Turnstile Keys
echo "0x4AAAAAAB27CNFPS0wEzPP5" | gopass insert -f development/turnstile/site-key
echo "0x4AAAAAAB27CNz7ilbhng3rNxH8TK2Bg7Q" | gopass insert -f development/turnstile/secret-key

# SendGrid Configuration
# API key should be stored manually for security
# gopass insert development/sendgrid/api-key
echo "hello@liteckyeditingservices.com" | gopass insert -f development/sendgrid/email-from
echo "ahnie@liteckyeditingservices.com" | gopass insert -f development/sendgrid/email-to
echo "54920324" | gopass insert -f development/sendgrid/domain-id

# GitHub OAuth (stored earlier)
# Already in gopass at github/oauth/litecky-editing/client-id and client-secret

echo "✅ All credentials stored in gopass!"
echo ""
echo "To recreate .dev.vars on another system, run:"
echo "  ./scripts/generate-dev-vars.sh"
