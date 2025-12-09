# Environment Variables Reference

> **📋 Quick Reference**: For a complete audit of all environment variables, their sources, and setup procedures, see [docs/ENVIRONMENT-AUDIT.md](./docs/ENVIRONMENT-AUDIT.md)

## Variable Matrix

| Variable                                                         | Production                                   | Preview                | Development                         | Type     | Required |
| ---------------------------------------------------------------- | -------------------------------------------- | ---------------------- | ----------------------------------- | -------- | -------- |
| **Cloudflare (CI/Pages)**                                        |
| `CLOUDFLARE_API_TOKEN`                                           | Via gopass (GitHub Secret)                   | Via gopass             | Via gopass                          | Secret   | Yes      |
| `CLOUDFLARE_ZONE_ID`                                             | a5e7c69768502d649a8f2c615f555eca             | Same                   | Same                                | Secret   | Yes      |
| `CLOUDFLARE_ACCOUNT_ID`                                          | 13eb584192d9cefb730fde0cfd271328             | Same                   | Same                                | Variable | Yes      |
| _(Local aliases used by scripts: `CF_ZONE_ID`, `CF_ACCOUNT_ID`)_ |
| **Workers**                                                      |
| `DISPATCH_NAMESPACE`                                             | production                                   | staging                | staging                             | Variable | No       |
| `WORKERS_SUBDOMAIN`                                              | Set after first deploy                       | Same                   | localhost                           | Variable | No       |
| **OAuth (Pages Functions)**                                      |
| `GITHUB_CLIENT_ID`                                               | Production ID                                | Preview ID             | Dev ID                              | Variable | Yes      |
| `GITHUB_CLIENT_SECRET`                                           | Via wrangler secret                          | Via wrangler secret    | Dev secret                          | Secret   | Yes      |
| **Turnstile**                                                    |
| `PUBLIC_TURNSTILE_SITE_KEY`                                      | 0x4AAAAAAB27CNFPS0wEzPP5                     | Same                   | 1x00000000000000000000AA            | Public   | Yes      |
| `TURNSTILE_SECRET_KEY`                                           | Via wrangler secret                          | Via wrangler secret    | 2x0000000000000000000000000000000AA | Secret   | Yes      |
| `USE_TURNSTILE_TEST`                                             | -                                            | `1`                    | `1`                                 | Variable | No       |
| `TURNSTILE_TEST_SITE_KEY`                                        | -                                            | Test key               | Test key                            | Variable | No       |
| `TURNSTILE_TEST_SECRET_KEY`                                      | -                                            | Test secret            | Test secret                         | Secret   | No       |
| **Postal (Email)**                                               |
| `POSTAL_API_KEY`                                                 | Server API key                               | Server API key         | Test key                            | Secret   | Yes      |
| `POSTAL_FROM_EMAIL`                                              | contact@liteckyeditingservices.com           | Same                   | Same                                | Variable | Yes      |
| `POSTAL_TO_EMAIL`                                                | ahnie@liteckyeditingservices.com             | Same                   | Same                                | Variable | Yes      |
| **Admin**                                                        |
| `ADMIN_EMAIL`                                                    | admin@domain                                 | admin@domain           | test@test                           | Variable | Yes      |
| **Site**                                                         |
| `PUBLIC_SITE_NAME`                                               | Litecky Editing                              | Litecky (Preview)      | Litecky (Dev)                       | Variable | Yes      |
| `PUBLIC_SITE_URL`                                                | https://site.com                             | Preview URL            | http://localhost                    | Variable | Yes      |
| **System**                                                       |
| `ENVIRONMENT`                                                    | `production`                                 | `preview`              | `development`                       | Variable | Yes      |
| `DEBUG`                                                          | -                                            | `true`                 | `true`                              | Variable | No       |
| **Error Tracking (Sentry)**                                      |
| `PUBLIC_SENTRY_DSN`                                              | `https://ceac9b5e...@o4510...`               | Same DSN               | Same DSN (or dev project)           | Public   | No       |
| `SENTRY_DSN`                                                     | Same as PUBLIC_SENTRY_DSN                    | Same DSN               | Same DSN                            | Variable | No       |
| `PUBLIC_SENTRY_ENVIRONMENT`                                      | `production`                                 | `preview`              | `development`                       | Public   | No       |
| `PUBLIC_SENTRY_RELEASE`                                          | `$CF_PAGES_COMMIT_SHA`                       | `$CF_PAGES_COMMIT_SHA` | `1.0.0`                             | Public   | No       |
| `SENTRY_ORG`                                                     | `happy-patterns-llc`                         | Same                   | Same                                | Variable | Yes (CI) |
| `SENTRY_PROJECT`                                                 | `javascript-astro`                           | Same                   | Same                                | Variable | Yes (CI) |
| `SENTRY_AUTH_TOKEN`                                              | From gopass (secret)                         | Same secret            | Not needed locally                  | Secret   | Yes (CI) |
| **Admin Feature Flags**                                          |
| `ADMIN_CMS_NPM`                                                  | `0` (off)                                    | `1` (preview flip)     | `0` (off)                           | Variable | No       |
| **Cal.com (Scheduling)**                                         |
| `CALCOM_API_KEY`                                                 | Production key                               | Production key         | Test key                            | Secret   | Yes      |
| `CALCOM_WEBHOOK_SECRET`                                          | Production secret                            | Production secret      | Test secret                         | Secret   | Yes      |
| `PUBLIC_CALCOM_EMBED_URL`                                        | https://cal.com/litecky-editing/consultation | Same                   | Same (or test)                      | Public   | Yes      |

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
POSTAL_API_KEY=your_postal_api_key_here
POSTAL_FROM_EMAIL=contact@liteckyeditingservices.com
POSTAL_TO_EMAIL=ahnie@liteckyeditingservices.com
GITHUB_CLIENT_ID=iv_DEV_CLIENT_ID
GITHUB_CLIENT_SECRET=dev_client_secret
```

#### Gopass Organization

Credentials are stored in the following gopass paths:

- `development/turnstile/*` - Turnstile test keys
- `seven-springs/litecky-editing/postal-api-key` - Postal API key
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
  - e.g., `ADMIN_CMS_NPM=1` enables the npm-based admin bundle during migration

### Security

- Never log secret values
- Don't commit .dev.vars
- Use encrypted secrets in Cloudflare
- Rotate keys regularly

### Validation

```typescript
// Validate at startup
function validateEnv(env: unknown): Env {
  if (!env.POSTAL_API_KEY) {
    throw new Error('POSTAL_API_KEY required');
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

| Key                         | Value                                 | Purpose               |
| --------------------------- | ------------------------------------- | --------------------- |
| `TURNSTILE_TEST_SITE_KEY`   | `1x00000000000000000000AA`            | Always passes         |
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
  PUBLIC_SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
  PUBLIC_SENTRY_ENVIRONMENT=production
  PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
  SENTRY_ORG=happy-patterns-llc
  SENTRY_PROJECT=javascript-astro
  SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
  SENTRY_AUTH_TOKEN=sntrys_... (set as secret from gopass sentry/happy-patterns-llc/auth-token)

Preview:
  PUBLIC_SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
  PUBLIC_SENTRY_ENVIRONMENT=preview
  PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA
  SENTRY_ORG=happy-patterns-llc
  SENTRY_PROJECT=javascript-astro
  SENTRY_DSN=https://ceac9b5e11c505c52360476db9fa80e8@o4510172424699904.ingest.us.sentry.io/4510172426731520
  SENTRY_AUTH_TOKEN=sntrys_... (set as secret from gopass sentry/happy-patterns-llc/auth-token)
```

**Sentry Project Details:**

- Project: `javascript-astro`
- Project ID: `4510172426731520`
- Organization: `happy-patterns-llc`
- Organization ID: `4510172424699904`
- Org Token: `gopass sentry/happy-patterns-llc/org-token-sentry`
- Personal Token: `gopass sentry/happy-patterns-llc/personal-token-sentry`
- Auth Token (CI): `gopass sentry/happy-patterns-llc/auth-token`

**Testing:**
Visit `/test-sentry` in development to verify integration.

**Documentation:**

- Complete setup guide: [docs/SENTRY-SETUP.md](./docs/SENTRY-SETUP.md)
- Integration reference: [docs/SENTRY-INTEGRATIONS.md](./docs/SENTRY-INTEGRATIONS.md)
- Quick reference: [docs/SENTRY-README.md](./docs/SENTRY-README.md)

## Related Documentation

- [docs/onboarding.md](./docs/onboarding.md) - Developer setup
- [\_archive/secrets-env-setup.md](./_archive/secrets-env-setup.md) - Advanced secret management
- [docs/SENTRY-README.md](./docs/SENTRY-README.md) - Sentry quick reference

### Cloudflare Pages (Site)

Set the following in Pages (Project → Settings → Environment variables):

- POSTAL_API_KEY — Postal server API key (secret)
- POSTAL_FROM_EMAIL — Sender address (e.g., contact@liteckyeditingservices.com)
- POSTAL_TO_EMAIL — Internal recipient for quote requests (e.g., ahnie@liteckyeditingservices.com)

These enable `/api/contact` to send emails via Postal. If not set, the endpoint still accepts requests but responds with `accepted-no-email`.

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
