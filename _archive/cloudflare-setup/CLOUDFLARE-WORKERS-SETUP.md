# Cloudflare Workers Setup for Litecky Editing Services

## Account Configuration

### Workers Plan Enabled ✅
- **Account ID**: `13eb584192d9cefb730fde0cfd271328`
- **Plan**: Workers Plan ($5/month)
- **Capabilities**: Workers for Platforms, Dispatch Namespaces, Enhanced limits
- **Wrangler**: v4.38.0 installed in project

## Workers Architecture for This Project

### 1. OAuth Proxy Worker (Decap CMS)
**Purpose**: Handle GitHub OAuth for Decap CMS admin interface

```
Decap CMS Admin (/admin)
        ↓
    OAuth Worker
        ↓
    GitHub OAuth
```

**Location**: `workers/decap-oauth/`
**Route**: `cms-auth.liteckyeditingservices.com/*`
**Status**: ❌ Not yet implemented

### 2. Contact Form Worker (API)
**Purpose**: Handle contact form submissions

```
Contact Form (Svelte)
        ↓
    Pages Function
        ↓
    SendGrid API
```

**Location**: `functions/api/contact.ts`
**Route**: `/api/contact`
**Status**: ❌ Not yet implemented

### 3. Document Processing Worker (Future)
**Purpose**: Process uploaded documents using Workers for Platforms

```
Dispatch Worker
        ↓
   Namespace: document-processors
        ↓
   Customer-specific Workers
```

**Status**: 🔄 Future enhancement

## Implementation Plan

### Phase 1: Basic Workers Setup

#### 1.1 Create OAuth Worker
```bash
# Navigate to workers directory
cd workers

# Create OAuth worker
npm create cloudflare@latest decap-oauth -- --type=worker
cd decap-oauth

# Configure wrangler.toml
cat > wrangler.toml << 'EOF'
name = "litecky-decap-oauth"
compatibility_date = "2025-09-23"

[vars]
OAUTH_GITHUB_CLIENT_ID = "your-github-client-id"

[[routes]]
pattern = "cms-auth.liteckyeditingservices.com/*"
zone_id = "a5e7c69768502d649a8f2c615f555eca"

[secrets]
# OAUTH_GITHUB_CLIENT_SECRET
EOF

# Set secret
pnpm wrangler secret put OAUTH_GITHUB_CLIENT_SECRET
```

#### 1.2 Deploy OAuth Worker
```bash
pnpm wrangler deploy
```

### Phase 2: Workers for Platforms Setup

#### 2.1 Create Dispatch Namespace
```bash
# Create staging namespace
pnpm wrangler dispatch-namespace create staging

# Create production namespace  
pnpm wrangler dispatch-namespace create production

# Store namespace IDs in gopass
gopass insert cloudflare/workers/dispatch-namespace/staging
gopass insert cloudflare/workers/dispatch-namespace/production
```

#### 2.2 Create Dispatch Worker
```bash
# Create dispatcher
npm create cloudflare@latest document-dispatcher -- --type=worker
cd document-dispatcher

# Configure wrangler.toml
cat > wrangler.toml << 'EOF'
name = "litecky-document-dispatcher"
compatibility_date = "2025-09-23"

[[dispatch_namespaces]]
binding = "processors"
namespace = "production"  # or "staging" for dev

[[routes]]
pattern = "api.liteckyeditingservices.com/process/*"
zone_id = "a5e7c69768502d649a8f2c615f555eca"
EOF
```

#### 2.3 Implement Dispatch Logic
```javascript
// index.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const customerId = request.headers.get('x-customer-id');
    
    if (!customerId) {
      return new Response('Customer ID required', { status: 400 });
    }
    
    // Get customer-specific worker
    const workerName = `processor-${customerId}`;
    const processor = env.processors.get(workerName);
    
    if (!processor) {
      return new Response('Processor not found', { status: 404 });
    }
    
    // Forward request to customer worker
    return processor.fetch(request);
  }
};
```

### Phase 3: Customer Worker Template

#### 3.1 Create Template Worker
```bash
# Create template for customer workers
npm create cloudflare@latest processor-template -- --type=worker
cd processor-template

# This will be cloned for each customer
```

#### 3.2 Deploy Customer Worker
```bash
# Deploy to namespace for a specific customer
pnpm wrangler deploy \
  --name processor-customer-123 \
  --dispatch-namespace production
```

## Environment Variables

### Required Secrets
```bash
# OAuth Worker
OAUTH_GITHUB_CLIENT_ID=<from GitHub>
OAUTH_GITHUB_CLIENT_SECRET=<from GitHub>

# SendGrid (for contact form)
SENDGRID_API_KEY=<from SendGrid>

# Turnstile (for forms)
TURNSTILE_SECRET_KEY=<from Cloudflare>
```

### Setting Secrets
```bash
# For Workers
pnpm wrangler secret put SECRET_NAME

# For Pages Functions
pnpm wrangler pages secret put SECRET_NAME
```

## DNS Configuration for Workers

### Required DNS Records
```bash
# OAuth subdomain
./scripts/cf-dns-manage.fish add CNAME cms-auth litecky-decap-oauth.workers.dev

# API subdomain (if using)
./scripts/cf-dns-manage.fish add CNAME api litecky-api.workers.dev
```

## Testing Workers

### Local Development
```bash
# Run worker locally
pnpm wrangler dev

# Test with curl
curl http://localhost:8787/test
```

### Production Testing
```bash
# Tail logs
pnpm wrangler tail

# Test deployed worker
curl https://cms-auth.liteckyeditingservices.com/auth
```

## Monitoring & Debugging

### View Logs
```bash
# Real-time logs
pnpm wrangler tail worker-name

# With filters
pnpm wrangler tail worker-name --status 500
```

### Analytics
- Dashboard: https://dash.cloudflare.com → Workers & Pages
- Metrics: Requests, errors, CPU time, duration
- Real User Monitoring (RUM) available

## Cost Tracking

### Workers Plan Includes
- 10 million requests/month
- 30 seconds CPU time per request
- Dispatch namespaces
- No Worker count limit

### Additional Costs
- $0.30 per million requests over 10M
- $0.12 per million KV reads
- $5.00 per million KV writes
- R2: $0.015/GB storage, $0.36/million requests

## Troubleshooting

### Common Issues

#### Authentication Error
```bash
# Re-login to Wrangler
pnpm wrangler login

# Or use API token
export CLOUDFLARE_API_TOKEN=$(gopass show -o cloudflare/api-tokens/initial-project-setup-master)
```

#### Route Conflicts
- Check existing routes: `pnpm wrangler routes list`
- Remove route: `pnpm wrangler routes delete route-id`

#### Namespace Issues
- List namespaces: `pnpm wrangler dispatch-namespace list`
- Check bindings in wrangler.toml

## Next Steps

1. ✅ Wrangler installed (`pnpm add -D wrangler`)
2. ❌ Create OAuth Worker for Decap CMS
3. ❌ Set up GitHub OAuth App
4. ❌ Deploy OAuth Worker
5. ❌ Update DNS for cms-auth subdomain
6. ❌ Test CMS authentication flow
7. 🔄 Implement contact form as Pages Function
8. 🔄 Consider Workers for Platforms for document processing

## References

- [Workers Documentation](https://developers.cloudflare.com/workers/)
- [Workers for Platforms](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Pages Functions](https://developers.cloudflare.com/pages/functions/)
