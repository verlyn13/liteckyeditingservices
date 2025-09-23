# Environment Variables Reference

## Variable Matrix

| Variable | Production | Preview | Development | Type | Required |
|----------|------------|---------|-------------|------|----------|
| **Turnstile** |
| `PUBLIC_TURNSTILE_SITE_KEY` | Real key | Real key | Test key | Public | Yes |
| `TURNSTILE_SECRET_KEY` | Real secret | Real secret | Test secret | Secret | Yes |
| `USE_TURNSTILE_TEST` | - | `1` | `1` | Variable | No |
| `TURNSTILE_TEST_SITE_KEY` | - | Test key | Test key | Variable | No |
| `TURNSTILE_TEST_SECRET_KEY` | - | Test secret | Test secret | Secret | No |
| **SendGrid** |
| `SENDGRID_API_KEY` | Real key | Real key | Test key | Secret | Yes |
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

## Setting Environment Variables

### Cloudflare Pages Dashboard

1. Navigate to Pages project
2. Settings → Environment variables
3. Choose environment (Production/Preview)
4. Add variable (public) or secret (encrypted)

### Local Development (.dev.vars)

```bash
# apps/site/.dev.vars
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=2x0000000000000000000000000000000AA
SENDGRID_API_KEY=SG.test_key_here
ADMIN_EMAIL=test@example.com
ENVIRONMENT=development
DEBUG=true
```

### Worker Secrets

```bash
cd workers/decap-oauth
wrangler secret put GITHUB_OAUTH_ID
wrangler secret put GITHUB_OAUTH_SECRET
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

### Workers
```typescript
export default {
  async fetch(request: Request, env: Env) {
    const clientId = env.GITHUB_OAUTH_ID;
  }
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

## Related Documentation
- [docs/onboarding.md](./docs/onboarding.md) - Developer setup
- [_archive/secrets-env-setup.md](./_archive/secrets-env-setup.md) - Advanced secret management