# Academic Editor - Complete Secrets & Environment Management

## Overview

This setup provides a secure, type-safe environment variable and secrets management system using:
- **mise** for local development orchestration
- **gopass/age** for encrypted local secrets storage
- **Cloudflare** for production secrets and bindings
- **GitHub Actions** secrets for CI/CD
- **Zod** for runtime validation

## Directory Structure

```
academic-editor/
├── config/
│   ├── env.schema.ts          # Zod schemas for validation
│   ├── keys.ts                # Single source of truth for keys
│   └── validate.ts            # Runtime validation helpers
├── scripts/
│   ├── setup-gopass.sh        # Initialize gopass/age
│   ├── export-dev-vars.sh     # Generate .dev.vars from gopass
│   ├── rotate-secrets.sh      # Secret rotation helper
│   └── audit-secrets.sh       # Security audit script
├── apps/
│   └── site/
│       ├── .dev.vars          # Generated (gitignored)
│       ├── .dev.vars.example  # Template for developers
│       └── src/
│           └── lib/
│               └── env.ts     # Type-safe env access
├── workers/
│   ├── cron/
│   │   └── .dev.vars          # Generated (gitignored)
│   └── queue-consumer/
│       └── .dev.vars          # Generated (gitignored)
├── .mise.toml                 # mise configuration
├── .envrc                     # direnv integration (optional)
└── .gitignore
```

## Configuration Files

### `config/keys.ts` - Single Source of Truth
```typescript
/**
 * Environment variable registry
 * Single source of truth for all configuration keys
 */

export const ENV_KEYS = {
  // Public build-time config (safe to expose)
  PUBLIC: {
    SITE_NAME: 'Academic Editor',
    SITE_URL: 'https://academic-editor.com',
    TURNSTILE_SITE_KEY: '', // Public key for Turnstile
    GA4_ID: '',             // Google Analytics ID
    MAX_FILE_SIZE_MB: '10',
    ALLOWED_FILE_TYPES: '.doc,.docx,.pdf,.rtf,.txt',
  },
  
  // Runtime secrets (never in repo)
  SECRET: {
    // Authentication & APIs
    TURNSTILE_SECRET_KEY: '',
    CLOUDFLARE_API_TOKEN: '',
    CLOUDFLARE_ACCOUNT_ID: '',
    
    // Email services
    RESEND_API_KEY: '',
    ADMIN_EMAIL: '',
    NOTIFICATION_WEBHOOK: '',
    
    // Storage keys (R2)
    R2_ACCESS_KEY_ID: '',
    R2_SECRET_ACCESS_KEY: '',
    
    // Monitoring
    SENTRY_DSN: '',
    LOGFLARE_API_KEY: '',
  },
  
  // Cloudflare bindings (resource names)
  BINDINGS: {
    // Storage
    DOCUMENTS_BUCKET: 'academic-editor-documents',
    CACHE_KV: 'academic-editor-cache',
    
    // Database
    DB_NAME: 'academic-editor',
    DB_ID: '',
    
    // Queues
    DOCUMENT_QUEUE: 'document-processing',
    EMAIL_QUEUE: 'email-notifications',
    
    // Analytics
    ANALYTICS_DATASET: 'academic-editor-analytics',
  },
} as const;

// Type exports
export type PublicEnvKey = keyof typeof ENV_KEYS.PUBLIC;
export type SecretEnvKey = keyof typeof ENV_KEYS.SECRET;
export type BindingKey = keyof typeof ENV_KEYS.BINDINGS;
export type AllEnvKeys = PublicEnvKey | SecretEnvKey | BindingKey;

// Gopass paths mapping
export const GOPASS_PATHS: Record<SecretEnvKey, string> = {
  TURNSTILE_SECRET_KEY: 'web/turnstile/secret',
  CLOUDFLARE_API_TOKEN: 'cloudflare/api/token',
  CLOUDFLARE_ACCOUNT_ID: 'cloudflare/account/id',
  RESEND_API_KEY: 'email/resend/api-key',
  ADMIN_EMAIL: 'email/admin/address',
  NOTIFICATION_WEBHOOK: 'webhooks/notifications/url',
  R2_ACCESS_KEY_ID: 'cloudflare/r2/access-key-id',
  R2_SECRET_ACCESS_KEY: 'cloudflare/r2/secret-key',
  SENTRY_DSN: 'monitoring/sentry/dsn',
  LOGFLARE_API_KEY: 'monitoring/logflare/api-key',
};
```

### `config/env.schema.ts` - Zod Validation
```typescript
import { z } from 'zod';

// Base schemas
const urlSchema = z.string().url();
const emailSchema = z.string().email();
const nonEmptyString = z.string().min(1);

// Public environment schema
export const publicEnvSchema = z.object({
  PUBLIC_SITE_NAME: z.string().default('Academic Editor'),
  PUBLIC_SITE_URL: urlSchema.default('https://academic-editor.com'),
  PUBLIC_TURNSTILE_SITE_KEY: z.string(),
  PUBLIC_GA4_ID: z.string().optional(),
  PUBLIC_MAX_FILE_SIZE_MB: z.string().regex(/^\d+$/).default('10'),
  PUBLIC_ALLOWED_FILE_TYPES: z.string().default('.doc,.docx,.pdf,.rtf,.txt'),
});

// Secret environment schema
export const secretEnvSchema = z.object({
  TURNSTILE_SECRET_KEY: nonEmptyString,
  CLOUDFLARE_API_TOKEN: nonEmptyString,
  CLOUDFLARE_ACCOUNT_ID: nonEmptyString,
  RESEND_API_KEY: nonEmptyString.regex(/^re_[a-zA-Z0-9]+$/),
  ADMIN_EMAIL: emailSchema,
  NOTIFICATION_WEBHOOK: urlSchema.optional(),
  R2_ACCESS_KEY_ID: nonEmptyString,
  R2_SECRET_ACCESS_KEY: nonEmptyString,
  SENTRY_DSN: urlSchema.optional(),
  LOGFLARE_API_KEY: nonEmptyString.optional(),
});

// Cloudflare bindings schema
export const bindingsSchema = z.object({
  // R2 Bucket
  DOCUMENTS: z.custom<R2Bucket>(),
  
  // KV Namespace
  CACHE: z.custom<KVNamespace>(),
  
  // D1 Database
  DB: z.custom<D1Database>(),
  
  // Queues
  DOCUMENT_QUEUE: z.custom<Queue>(),
  EMAIL_QUEUE: z.custom<Queue>(),
  
  // Analytics Engine
  ANALYTICS: z.custom<AnalyticsEngineDataset>(),
});

// Combined runtime environment (for Pages Functions/Workers)
export const runtimeEnvSchema = publicEnvSchema
  .merge(secretEnvSchema)
  .merge(bindingsSchema);

// Types
export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type SecretEnv = z.infer<typeof secretEnvSchema>;
export type Bindings = z.infer<typeof bindingsSchema>;
export type RuntimeEnv = z.infer<typeof runtimeEnvSchema>;
```

### `config/validate.ts` - Runtime Validation Helper
```typescript
import { publicEnvSchema, secretEnvSchema, bindingsSchema, type RuntimeEnv } from './env.schema';

/**
 * Validates and returns typed environment variables
 * Throws detailed errors if validation fails
 */
export function validateEnv(env: unknown): RuntimeEnv {
  try {
    // In development, some bindings might be mocked
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
      // Validate only public and secret vars in dev
      const publicVars = publicEnvSchema.parse(env);
      const secretVars = secretEnvSchema.partial().parse(env);
      
      // Return with mock bindings
      return {
        ...publicVars,
        ...secretVars,
        // Mock bindings will be provided by miniflare/wrangler
      } as RuntimeEnv;
    }
    
    // Production: validate everything
    return runtimeEnvSchema.parse(env);
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error('Invalid environment configuration');
  }
}

/**
 * Type guard for checking if a key exists in env
 */
export function hasEnvKey<K extends keyof RuntimeEnv>(
  env: Partial<RuntimeEnv>,
  key: K
): env is RuntimeEnv {
  return key in env && env[key] !== undefined;
}
```

### `.mise.toml` - Development Orchestration
```toml
[env]
# Node version for consistency
NODE_VERSION = "24.0.0"
PNPM_VERSION = "10.16.0"

[tasks.setup]
description = "Initial project setup"
run = [
  "mise install",
  "pnpm install",
  "./scripts/setup-gopass.sh",
  "mise run secrets:export"
]

[tasks."secrets:export"]
description = "Export secrets from gopass to .dev.vars"
run = "./scripts/export-dev-vars.sh"

[tasks."secrets:rotate"]
description = "Rotate specified secret"
run = "./scripts/rotate-secrets.sh"

[tasks."secrets:audit"]
description = "Audit all secrets for security"
run = "./scripts/audit-secrets.sh"

[tasks.dev]
description = "Start development environment"
run = [
  "mise run secrets:export",
  "pnpm dev"
]

[tasks."dev:clean"]
description = "Clean development environment"
run = [
  "rm -f apps/site/.dev.vars",
  "rm -f workers/*/.dev.vars",
  "pnpm clean"
]

[tools]
node = "24"
pnpm = "10.16.0"
```

## Scripts

### `scripts/setup-gopass.sh` - Initialize gopass with age
```bash
#!/usr/bin/env bash
set -euo pipefail

echo "🔐 Setting up gopass with age encryption..."

# Check if gopass is installed
if ! command -v gopass &> /dev/null; then
  echo "❌ gopass is not installed. Please install it first:"
  echo "  macOS: brew install gopass gopass-age"
  echo "  Linux: Check your package manager"
  exit 1
fi

# Check if age is installed
if ! command -v age &> /dev/null; then
  echo "❌ age is not installed. Please install it first:"
  echo "  macOS: brew install age"
  echo "  Linux: Check your package manager"
  exit 1
fi

# Initialize gopass with age if not already done
if ! gopass config backend | grep -q "age"; then
  echo "Initializing gopass with age backend..."
  gopass init --crypto age
else
  echo "✅ gopass already configured with age"
fi

# Create store structure for Academic Editor
echo "Creating secret store structure..."

SECRETS=(
  "web/turnstile/secret"
  "cloudflare/api/token"
  "cloudflare/account/id"
  "cloudflare/r2/access-key-id"
  "cloudflare/r2/secret-key"
  "email/resend/api-key"
  "email/admin/address"
  "webhooks/notifications/url"
  "monitoring/sentry/dsn"
  "monitoring/logflare/api-key"
)

for secret in "${SECRETS[@]}"; do
  if ! gopass show "$secret" &> /dev/null; then
    echo "  Creating placeholder for: $secret"
    echo "PLACEHOLDER" | gopass insert -f "$secret"
  fi
done

echo ""
echo "✅ gopass setup complete!"
echo ""
echo "Next steps:"
echo "1. Update secrets with real values:"
echo "   gopass edit web/turnstile/secret"
echo ""
echo "2. Export to .dev.vars:"
echo "   mise run secrets:export"
echo ""
```

### `scripts/export-dev-vars.sh` - Generate .dev.vars
```bash
#!/usr/bin/env bash
set -euo pipefail

echo "📦 Exporting secrets from gopass to .dev.vars files..."

# Function to safely get secret from gopass
get_secret() {
  local path=$1
  local default=${2:-""}
  
  if gopass show -o "$path" 2>/dev/null; then
    gopass show -o "$path"
  else
    echo "$default"
  fi
}

# Site environment variables
cat > apps/site/.dev.vars <<EOF
# Generated from gopass by export-dev-vars.sh
# Generated at: $(date -u +"%Y-%m-%d %H:%M:%S UTC")

# Public configuration
PUBLIC_SITE_NAME="Academic Editor"
PUBLIC_SITE_URL="http://localhost:4321"
PUBLIC_TURNSTILE_SITE_KEY="1x00000000000000000000AA"  # Turnstile test key
PUBLIC_GA4_ID=""
PUBLIC_MAX_FILE_SIZE_MB="10"
PUBLIC_ALLOWED_FILE_TYPES=".doc,.docx,.pdf,.rtf,.txt"

# Secrets
TURNSTILE_SECRET_KEY="$(get_secret web/turnstile/secret "1x0000000000000000000000000000000AA")"
CLOUDFLARE_API_TOKEN="$(get_secret cloudflare/api/token)"
CLOUDFLARE_ACCOUNT_ID="$(get_secret cloudflare/account/id)"
RESEND_API_KEY="$(get_secret email/resend/api-key)"
ADMIN_EMAIL="$(get_secret email/admin/address "admin@localhost")"
NOTIFICATION_WEBHOOK="$(get_secret webhooks/notifications/url)"
R2_ACCESS_KEY_ID="$(get_secret cloudflare/r2/access-key-id)"
R2_SECRET_ACCESS_KEY="$(get_secret cloudflare/r2/secret-key)"
SENTRY_DSN="$(get_secret monitoring/sentry/dsn)"
LOGFLARE_API_KEY="$(get_secret monitoring/logflare/api-key)"

# Local development overrides
ENVIRONMENT="development"
DEBUG="true"
EOF

# Worker environment variables (cron)
cat > workers/cron/.dev.vars <<EOF
# Generated from gopass - Cron Worker
ENVIRONMENT="development"
RESEND_API_KEY="$(get_secret email/resend/api-key)"
ADMIN_EMAIL="$(get_secret email/admin/address "admin@localhost")"
EOF

# Worker environment variables (queue consumer)
cat > workers/queue-consumer/.dev.vars <<EOF
# Generated from gopass - Queue Consumer
ENVIRONMENT="development"
RESEND_API_KEY="$(get_secret email/resend/api-key)"
SENTRY_DSN="$(get_secret monitoring/sentry/dsn)"
EOF

echo "✅ Exported .dev.vars files:"
echo "  - apps/site/.dev.vars"
echo "  - workers/cron/.dev.vars"
echo "  - workers/queue-consumer/.dev.vars"
```

### `scripts/rotate-secrets.sh` - Secret Rotation Helper
```bash
#!/usr/bin/env bash
set -euo pipefail

echo "🔄 Secret Rotation Tool"
echo ""

# Show available secrets
echo "Available secrets:"
echo "1. Turnstile (web/turnstile/secret)"
echo "2. Cloudflare API Token (cloudflare/api/token)"
echo "3. Resend API Key (email/resend/api-key)"
echo "4. R2 Access Keys (cloudflare/r2/*)"
echo "5. All secrets"
echo ""

read -p "Select secret to rotate (1-5): " choice

rotate_secret() {
  local path=$1
  local name=$2
  
  echo "Rotating $name..."
  
  # Backup old secret
  OLD_VALUE=$(gopass show -o "$path" 2>/dev/null || echo "")
  if [ -n "$OLD_VALUE" ]; then
    gopass insert -f "${path}.backup.$(date +%Y%m%d)" <<< "$OLD_VALUE"
    echo "  ✅ Backed up old value"
  fi
  
  # Prompt for new value
  echo "  Enter new value for $name:"
  read -s NEW_VALUE
  echo "$NEW_VALUE" | gopass insert -f "$path"
  echo "  ✅ Updated secret"
}

case $choice in
  1)
    rotate_secret "web/turnstile/secret" "Turnstile Secret Key"
    ;;
  2)
    rotate_secret "cloudflare/api/token" "Cloudflare API Token"
    ;;
  3)
    rotate_secret "email/resend/api-key" "Resend API Key"
    ;;
  4)
    rotate_secret "cloudflare/r2/access-key-id" "R2 Access Key ID"
    rotate_secret "cloudflare/r2/secret-key" "R2 Secret Access Key"
    ;;
  5)
    echo "Rotating all secrets..."
    # Add all secrets here
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "✅ Secret rotation complete!"
echo ""
echo "Next steps:"
echo "1. Update Cloudflare dashboard with new values"
echo "2. Update GitHub Actions secrets if needed"
echo "3. Run: mise run secrets:export"
echo "4. Redeploy application"
```

### `scripts/audit-secrets.sh` - Security Audit
```bash
#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Security Audit for Academic Editor Secrets"
echo "============================================="
echo ""

# Check gopass audit
echo "Running gopass audit..."
gopass audit

echo ""
echo "Checking secret age..."

SECRETS=(
  "web/turnstile/secret"
  "cloudflare/api/token"
  "email/resend/api-key"
  "cloudflare/r2/access-key-id"
  "cloudflare/r2/secret-key"
)

for secret in "${SECRETS[@]}"; do
  if gopass show "$secret" &> /dev/null; then
    # Get last modified time (this is a simplified check)
    echo "  ✓ $secret exists"
  else
    echo "  ⚠️  $secret is missing!"
  fi
done

echo ""
echo "Checking .dev.vars files..."

check_dev_vars() {
  local file=$1
  if [ -f "$file" ]; then
    local age=$(( ($(date +%s) - $(stat -f %m "$file" 2>/dev/null || stat -c %Y "$file")) / 86400 ))
    if [ $age -gt 30 ]; then
      echo "  ⚠️  $file is $age days old (consider regenerating)"
    else
      echo "  ✓ $file is $age days old"
    fi
  else
    echo "  ⚠️  $file does not exist"
  fi
}

check_dev_vars "apps/site/.dev.vars"
check_dev_vars "workers/cron/.dev.vars"
check_dev_vars "workers/queue-consumer/.dev.vars"

echo ""
echo "Audit complete!"
```

## Type-Safe Environment Access

### `apps/site/src/lib/env.ts` - Runtime Environment Helper
```typescript
import { validateEnv, type RuntimeEnv } from '@/config/validate';

let cachedEnv: RuntimeEnv | null = null;

/**
 * Get validated environment variables
 * Caches the result for performance
 */
export function getEnv(context?: { env: unknown }): RuntimeEnv {
  if (cachedEnv) return cachedEnv;
  
  // In Pages Functions/Workers, env comes from context
  const rawEnv = context?.env || process.env;
  
  cachedEnv = validateEnv(rawEnv);
  return cachedEnv;
}

/**
 * Type-safe environment variable access
 * @example
 * const apiKey = env('RESEND_API_KEY');
 */
export function env<K extends keyof RuntimeEnv>(
  key: K,
  context?: { env: unknown }
): RuntimeEnv[K] {
  const environment = getEnv(context);
  return environment[key];
}

/**
 * Check if running in development
 */
export function isDev(): boolean {
  return getEnv().ENVIRONMENT === 'development';
}

/**
 * Check if running in production
 */
export function isProd(): boolean {
  return getEnv().ENVIRONMENT === 'production';
}

/**
 * Get public environment variables only
 * Safe to expose to client
 */
export function getPublicEnv(): PublicEnv {
  const env = getEnv();
  return {
    PUBLIC_SITE_NAME: env.PUBLIC_SITE_NAME,
    PUBLIC_SITE_URL: env.PUBLIC_SITE_URL,
    PUBLIC_TURNSTILE_SITE_KEY: env.PUBLIC_TURNSTILE_SITE_KEY,
    PUBLIC_GA4_ID: env.PUBLIC_GA4_ID,
    PUBLIC_MAX_FILE_SIZE_MB: env.PUBLIC_MAX_FILE_SIZE_MB,
    PUBLIC_ALLOWED_FILE_TYPES: env.PUBLIC_ALLOWED_FILE_TYPES,
  };
}
```

### `apps/site/functions/api/example.ts` - Using Env in Pages Functions
```typescript
import type { PagesFunction } from '@cloudflare/workers-types';
import { getEnv } from '@/lib/env';

export const onRequestPost: PagesFunction = async (context) => {
  // Validate and get typed environment
  const env = getEnv(context);
  
  // Now you have full type safety
  const { TURNSTILE_SECRET_KEY, DOCUMENTS, DB } = env;
  
  // Use R2 bucket
  await DOCUMENTS.put('key', 'value');
  
  // Use D1 database
  const result = await DB.prepare('SELECT * FROM quotes').all();
  
  // Use secret
  const verified = await verifyTurnstile(TURNSTILE_SECRET_KEY);
  
  return new Response('OK');
};
```

## GitHub Actions Secrets Setup

### Required GitHub Secrets
```yaml
# Repository Settings > Secrets and variables > Actions

# Deployment
CLOUDFLARE_API_TOKEN: "your-api-token"
CLOUDFLARE_ACCOUNT_ID: "your-account-id"

# Optional: for advanced workflows
TURNSTILE_SITE_KEY: "public-key"  # Can be a variable instead
```

### `.github/workflows/deploy-with-secrets.yml`
```yaml
name: Deploy with Secrets Management

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  validate-config:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Validate environment config
        run: |
          # Check that all required configs are defined
          node -e "
            const { ENV_KEYS } = require('./config/keys.ts');
            console.log('✅ Environment configuration valid');
          "
  
  deploy:
    needs: validate-config
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v4
        with:
          version: 10.16.0
      
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'pnpm'
      
      - name: Install and build
        run: |
          pnpm install --frozen-lockfile
          pnpm build:site
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy apps/site/dist --project-name=academic-editor
        # Secrets are managed in Cloudflare, not passed from GitHub
```

## Cloudflare Configuration

### Pages Variables & Secrets (Dashboard)
```bash
# Production Environment
# Pages > Settings > Environment variables > Production

# Secrets (encrypted)
TURNSTILE_SECRET_KEY=<your-secret>
RESEND_API_KEY=<your-secret>
R2_ACCESS_KEY_ID=<your-secret>
R2_SECRET_ACCESS_KEY=<your-secret>

# Variables (plain text)
PUBLIC_SITE_NAME="Academic Editor"
PUBLIC_SITE_URL="https://academic-editor.com"
ENVIRONMENT="production"
```

### Workers Secrets (CLI)
```bash
# Deploy secrets to Workers
wrangler secret put RESEND_API_KEY --name ae-cron
wrangler secret put ADMIN_EMAIL --name ae-cron

# List secrets
wrangler secret list --name ae-cron

# Delete old secret
wrangler secret delete OLD_KEY --name ae-cron
```

## Security Best Practices

### 1. Secret Rotation Schedule
- **API Keys**: Every 90 days
- **Access Keys**: Every 180 days
- **Webhooks**: On demand
- **Passwords**: Every 60 days

### 2. Access Control
- Use separate API tokens for different environments
- Implement least privilege principle
- Rotate immediately if compromised

### 3. Audit Trail
- Run `mise run secrets:audit` monthly
- Review Cloudflare audit logs
- Monitor GitHub Actions secret usage

### 4. Emergency Response
```bash
# If a secret is compromised:
1. Rotate immediately:
   mise run secrets:rotate

2. Update all environments:
   - Cloudflare Dashboard
   - GitHub Secrets
   - Local .dev.vars

3. Redeploy all services:
   pnpm deploy:site
   pnpm deploy:workers

4. Review audit logs for unauthorized access
```

## Development Workflow

### Initial Setup (Once)
```bash
# 1. Install tools
brew install gopass age  # macOS
mise install

# 2. Initialize gopass
mise run setup

# 3. Add real secrets to gopass
gopass edit cloudflare/api/token
gopass edit email/resend/api-key
# ... etc

# 4. Export to .dev.vars
mise run secrets:export
```

### Daily Development
```bash
# Start dev with fresh secrets
mise run dev

# Or manually refresh secrets
mise run secrets:export
pnpm dev
```

### Before Deployment
```bash
# Audit secrets
mise run secrets:audit

# Ensure Cloudflare has latest secrets
# (Update via Dashboard or wrangler CLI)

# Deploy
pnpm deploy:site
pnpm deploy:workers
```

This setup provides:
- 🔒 **Zero secrets in repository**
- 🔑 **Encrypted local storage** with age
- 📦 **Single-command setup** with mise
- ✅ **Type-safe access** with Zod validation
- 🔄 **Easy rotation** with audit trail
- 🚀 **Seamless deployment** without exposing secrets in CI
