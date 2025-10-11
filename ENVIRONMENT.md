# Environment Variables Reference

> **📋 Quick Reference**: For a complete audit of all environment variables, their sources, and setup procedures, see [docs/ENVIRONMENT-AUDIT.md](./docs/ENVIRONMENT-AUDIT.md)

## Variable Matrix

| Variable | Production | Preview | Development | Type | Required |
|----------|------------|---------|-------------|------|----------|
| **Cloudflare** |
| `CF_API_TOKEN` | Via gopass | Via gopass | Via gopass | Secret | Yes |
| `CF_ZONE_ID` | a5e7c69768502d649a8f2c615f555eca | Same | Same | Variable | Yes |
| `CF_ACCOUNT_ID` | 13eb584192d9cefb730fde0cfd271328 | Same | Same | Variable | Yes |
| **Workers** |
| `DISPATCH_NAMESPACE` | production | staging | staging | Variable | No |
| `WORKERS_SUBDOMAIN` | Set after first deploy | Same | localhost | Variable | No |
| **OAuth (Pages Functions)** |
| `GITHUB_CLIENT_ID` | Production ID | Preview ID | Dev ID | Variable | Yes |
| `GITHUB_CLIENT_SECRET` | Via wrangler secret | Via wrangler secret | Dev secret | Secret | Yes |
| **Turnstile** |
| `PUBLIC_TURNSTILE_SITE_KEY` | 0x4AAAAAAB27CNFPS0wEzPP5 | Same | 1x00000000000000000000AA | Public | Yes |
| `TURNSTILE_SECRET_KEY` | Via wrangler secret | Via wrangler secret | 2x0000000000000000000000000000000AA | Secret | Yes |
| `USE_TURNSTILE_TEST` | - | `1` | `1` | Variable | No |
| `TURNSTILE_TEST_SITE_KEY` | - | Test key | Test key | Variable | No |
| `TURNSTILE_TEST_SECRET_KEY` | - | Test secret | Test secret | Secret | No |
| **SendGrid** |
| `SENDGRID_API_KEY` | Real key | Real key | Test key | Secret | Yes |
| `SENDGRID_FROM` | noreply@liteckyeditingservices.com | Same | Same | Variable | Yes |
| `SENDGRID_CONTACT_TEMPLATE_ID` | `d-prod123` | `d-prev456` | `d-test789` | Variable | Yes |
| `SENDGRID_CONFIRMATION_TEMPLATE_ID` | `d-prod234` | `d-prev567` | `d-test890` | Variable | Yes |
| **Admin** |
| `ADMIN_EMAIL` | admin@domain | admin@domain | test@test | Variable | Yes |
| **Site** |
| `PUBLIC_SITE_NAME` | Litecky Editing | Litecky (Preview) | Litecky (Dev) | Variable | Yes |
| `PUBLIC_SITE_URL` | https://site.com | Preview URL | http://localhost | Variable | Yes |
| **System** |
| `ENVIRONMENT` | `production` | `preview` | `development` | Variable | Yes |
| `DEBUG` | - | `true` | `true` | Variable | No |
| **Error Tracking (Sentry)** |
| `PUBLIC_SENTRY_DSN` | Production DSN | Production DSN | Dev DSN | Variable | No |
| `PUBLIC_SENTRY_ENVIRONMENT` | `production` | `preview` | `development` | Variable | No |
| `PUBLIC_SENTRY_RELEASE` | `$CF_PAGES_COMMIT_SHA` | `$CF_PAGES_COMMIT_SHA` | `1.0.0` | Variable | No |

## Setting Environment Variables

### Cloudflare Pages Dashboard

1. Navigate to Pages project
2. Settings → Environment variables
3. Choose environment (Production/Preview)
4. Add variable (public) or secret (encrypted)

### Local Development (.dev.vars)

All development credentials are stored in gopass for security and portability:

```bash
# Store credentials in gopass (first time setup)
./store-dev-vars-in-gopass.sh

# Generate .dev.vars from gopass (on any system)
./scripts/generate-dev-vars.sh
```

Example `.dev.vars` structure:
```bash
# .dev.vars (project root)
PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAB27CNFPS0wEzPP5
TURNSTILE_SECRET_KEY=0x4AAAAAAB27CNz7ilbhng3rNxH8TK2Bg7Q
SENDGRID_API_KEY=SG.test_key_here
EMAIL_FROM=hello@liteckyeditingservices.com
EMAIL_TO=ahnie@liteckyeditingservices.com
SENDGRID_DOMAIN_ID=54920324
# SENDGRID_FORCE_SEND=true  # Uncomment to send real emails in dev
GITHUB_CLIENT_ID=iv_DEV_CLIENT_ID
GITHUB_CLIENT_SECRET=dev_client_secret
```

#### Gopass Organization

Credentials are stored in the following gopass paths:
- `development/turnstile/*` - Turnstile test keys
- `development/sendgrid/*` - SendGrid configuration
- `github/oauth/litecky-editing/*` - GitHub OAuth credentials

### Pages Functions Secrets (OAuth)

Set in Cloudflare Pages → Project → Settings → Variables and Secrets:

```bash
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```

### GitHub Actions Secrets

Repository → Settings → Secrets and variables → Actions

Required:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Accessing Variables in Code

### Astro Pages
```typescript
// In .astro files
const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
```

### Pages Functions
```typescript
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const apiKey = env.SENDGRID_API_KEY;
};
```

### Svelte Components
```typescript
const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
```

### Pages Functions
```typescript
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const clientId = ctx.env.GITHUB_CLIENT_ID;
};
```

## Type Safety

### Type Definition
```typescript
// env.d.ts
interface ImportMetaEnv {
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
  readonly PUBLIC_SITE_NAME: string;
  readonly PUBLIC_SITE_URL: string;
  // ... other public vars
}

interface Env {
  TURNSTILE_SECRET_KEY: string;
  SENDGRID_API_KEY: string;
  // ... other secrets
}
```

## Best Practices

### Naming Convention
- `PUBLIC_*` - Available in browser
- `*_KEY/*_SECRET` - Sensitive values
- `*_ID` - Identifiers
- `USE_*` - Feature flags

### Security
- Never log secret values
- Don't commit .dev.vars
- Use encrypted secrets in Cloudflare
- Rotate keys regularly

### Validation
```typescript
// Validate at startup
function validateEnv(env: unknown): Env {
  if (!env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY required');
  }
  // ... more checks
  return env as Env;
}
```

## Troubleshooting

### Variable Not Found
1. Check spelling (case-sensitive)
2. Verify environment (prod/preview/dev)
3. Restart dev server after changes
4. Check .dev.vars exists locally

### Wrong Value Used
1. Check environment precedence
2. Clear cache if needed
3. Verify no hardcoded values
4. Check build logs

## Test/Development Keys

These are safe for development use only:

| Key | Value | Purpose |
|-----|-------|---------|
| `TURNSTILE_TEST_SITE_KEY` | `1x00000000000000000000AA` | Always passes |
| `TURNSTILE_TEST_SECRET_KEY` | `2x0000000000000000000000000000000AA` | Validates test tokens |

## Sentry Error Tracking

### Configuration
Sentry is configured in `src/lib/sentry.ts` and automatically initialized in `src/layouts/BaseLayout.astro`.

**Environment Variables:**
- `PUBLIC_SENTRY_DSN` - Data Source Name from Sentry project settings
- `PUBLIC_SENTRY_ENVIRONMENT` - Environment identifier (production/preview/development)
- `PUBLIC_SENTRY_RELEASE` - Version/commit for tracking regressions
 - `SENTRY_ORG` - Organization slug for source maps upload (Astro integration)
 - `SENTRY_PROJECT` - Project slug for source maps upload (Astro integration)
 - `SENTRY_AUTH_TOKEN` - Auth token for source maps upload (sensitive; set in CI via gopass)

**Getting Your DSN:**
1. Sign up at https://sentry.io/
2. Create a project (Platform: Browser JavaScript)
3. Go to Settings → Projects → [Your Project] → Client Keys (DSN)
4. Copy the DSN value

**Local Development:**
```bash
# .dev.vars or .env
PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
PUBLIC_SENTRY_ENVIRONMENT=development
PUBLIC_SENTRY_RELEASE=1.0.0
```

**Cloudflare Pages:**
```
Production:
  PUBLIC_SENTRY_DSN=https://...@o0.ingest.sentry.io/0
  PUBLIC_SENTRY_ENVIRONMENT=production
  PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
  SENTRY_ORG=happy-patterns-llc
  SENTRY_PROJECT=javascript-astro
  SENTRY_AUTH_TOKEN=sntrys_... (set as secret)

Preview:
  PUBLIC_SENTRY_DSN=https://...@o0.ingest.sentry.io/0
  PUBLIC_SENTRY_ENVIRONMENT=preview
  PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
  SENTRY_ORG=happy-patterns-llc
  SENTRY_PROJECT=javascript-astro
  SENTRY_AUTH_TOKEN=sntrys_... (set as secret)
```

**Testing:**
Visit `/test-sentry` in development to verify integration.

**Documentation:**
- Complete setup guide: [docs/SENTRY-SETUP.md](./docs/SENTRY-SETUP.md)
- Integration reference: [docs/SENTRY-INTEGRATIONS.md](./docs/SENTRY-INTEGRATIONS.md)
- Quick reference: [docs/SENTRY-README.md](./docs/SENTRY-README.md)

## Related Documentation
- [docs/onboarding.md](./docs/onboarding.md) - Developer setup
- [_archive/secrets-env-setup.md](./_archive/secrets-env-setup.md) - Advanced secret management
- [docs/SENTRY-README.md](./docs/SENTRY-README.md) - Sentry quick reference
### Cloudflare Pages (Site)

Set the following in Pages (Project → Settings → Environment variables):

- SENDGRID_API_KEY — SendGrid API key (secret)
- SENDGRID_FROM — Verified sender address (e.g., quotes@liteckyeditingservices.com)
- SENDGRID_TO — Internal recipient for quote requests

These enable `/api/contact` to send emails. If not set, the endpoint still accepts requests but responds with `accepted-no-email`.

### Decap OAuth (Pages Functions)

OAuth runs at the site origin via Pages Functions. No external OAuth worker is required.

- Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in Pages (Production and Preview)
- Dev credentials live in `.dev.vars`
- Config (`/admin/config.yml`) sets `backend.base_url` to the current origin and `auth_endpoint: /api/auth`

### Future Queues and Storage (planned)

- Queue: `send-email` — async email processing
- R2 bucket: document storage
- D1 database: quotes/submissions data
- KV: cache
