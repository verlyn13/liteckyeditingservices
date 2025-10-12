# CLOUDFLARE DEPLOYMENT DIRECTIVE

## ⚠️ IMPORTANT: How to Use Our Cloudflare Setup

This directive explains the Cloudflare management infrastructure we've established and how to properly use it for deployment.

---

## 🔑 Authentication & Credentials

### Loading API Token

The API token is stored in gopass. To load it:

```bash
# For Fish shell (our default)
source scripts/load-cloudflare-env.fish

# Or directly set it
set -x CF_API_TOKEN (gopass show -o cloudflare/api-tokens/initial-project-setup-master)
```

### Getting Account ID

The account ID is NOT stored locally. Retrieve it dynamically:

```bash
# Method 1: From the audit script
./scripts/cloudflare-audit.fish | grep "Account ID" | cut -d: -f2 | xargs

# Method 2: Using curl with the API
set -x CF_API_TOKEN (gopass show -o cloudflare/api-tokens/initial-project-setup-master)
curl -s -X GET "https://api.cloudflare.com/client/v4/zones/a5e7c69768502d649a8f2c615f555eca" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" | \
    python3 -c "import sys, json; print(json.load(sys.stdin)['result']['account']['id'])"
```

### Zone Information

All zone configuration is stored in `desired-state/cloudflare-env.json`:

- Zone ID: `a5e7c69768502d649a8f2c615f555eca`
- Zone Name: `liteckyeditingservices.com`

---

## 🛠️ Available Management Scripts

### 1. Domain Audit

```bash
# Run comprehensive domain audit
./scripts/cloudflare-audit.fish
# Output: docs/infrastructure/CLOUDFLARE-STATUS.md
```

### 2. DNS Management

```bash
# List all DNS records
./scripts/cf-dns-manage.fish list

# Backup DNS before changes
./scripts/cf-dns-manage.fish backup

# Add new DNS record
./scripts/cf-dns-manage.fish add CNAME www project.pages.dev

# Delete record (requires ID from list)
./scripts/cf-dns-manage.fish delete [record-id]
```

### 3. Pages Deployment Helper

```bash
# Check deployment status
./scripts/cf-pages-deploy.fish status

# Create wrangler.toml config
./scripts/cf-pages-deploy.fish config

# Deploy to Pages
./scripts/cf-pages-deploy.fish deploy
```

---

## 📋 DEPLOYMENT WORKFLOW

### Phase 0: Pre-Deployment (Current Phase)

✅ Complete - Site is built and ready

### Phase 1: Infrastructure Setup

#### Step 1.1: Get Account ID

```bash
# Load API token
set -x CF_API_TOKEN (gopass show -o cloudflare/api-tokens/initial-project-setup-master)

# Get account ID
set -x CF_ACCOUNT_ID (curl -s -X GET "https://api.cloudflare.com/client/v4/zones/a5e7c69768502d649a8f2c615f555eca" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" | \
    python3 -c "import sys, json; print(json.load(sys.stdin)['result']['account']['id'])")

echo "Account ID: $CF_ACCOUNT_ID"
```

#### Step 1.2: Create D1 Database

```bash
pnpm wrangler d1 create litecky-db
# Save the database ID that's returned
```

#### Step 1.3: Create R2 Bucket

```bash
pnpm wrangler r2 bucket create litecky-uploads
```

#### Step 1.4: Create KV Namespace

```bash
pnpm wrangler kv:namespace create "CACHE"
# Save the namespace ID that's returned
```

### Phase 2: Security & Auth

#### Step 2.1: Turnstile Setup

1. Go to https://dash.cloudflare.com/?to=/:account/turnstile
2. Create a new widget for the domain
3. Store the keys in gopass:

```bash
gopass insert cloudflare/turnstile/site-key
gopass insert cloudflare/turnstile/secret-key
```

### Phase 3: Workers Deployment

Workers are not yet created. Skip this phase until workers are implemented.

### Phase 4: Main Site Deployment

#### Step 4.1: Create Pages Project

```bash
# Install Wrangler if not already installed
pnpm add -D wrangler

# Deploy to Pages (creates project on first run)
pnpm wrangler pages deploy dist/ --project-name=liteckyeditingservices
```

#### Step 4.2: Configure Custom Domain

After first deployment:

1. Note the `.pages.dev` URL
2. Update DNS records:

```bash
# Backup current DNS
./scripts/cf-dns-manage.fish backup

# List records to get IDs
./scripts/cf-dns-manage.fish list

# Update www CNAME (replace ID with actual)
./scripts/cf-dns-manage.fish delete a8b747e6dffdb95e0bea543316e6d3cf
./scripts/cf-dns-manage.fish add CNAME www liteckyeditingservices.pages.dev
```

#### Step 4.3: Set Environment Variables

In Cloudflare Dashboard → Pages → Settings → Environment Variables:

- Add all variables from ENVIRONMENT.md
- Use production values for Production environment
- Use preview values for Preview environment

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### Issue: "No CF_API_TOKEN environment set"

**Solution**: The token must be loaded for EACH command:

```bash
CF_API_TOKEN=$(gopass show -o cloudflare/api-tokens/initial-project-setup-master) command-here
```

### Issue: "Authentication error (10000)"

**Solution**: Some endpoints need different permissions. The token has full access to:

- Zone, DNS, SSL/TLS, Firewall, Workers, Pages

### Issue: Can't find account ID

**Solution**: Get it from the zone API (see Step 1.1 above)

### Issue: DNS changes not propagating

**Solution**:

1. Check proxy status (orange cloud vs grey cloud)
2. Wait 1-5 minutes for propagation
3. Verify with: `dig liteckyeditingservices.com`

---

## 📁 File Locations

### Configuration

- Zone config: `desired-state/cloudflare-env.json`
- Environment vars: `ENVIRONMENT.md`
- Deployment workflow: `CLOUDFLARE-DEPLOYMENT-WORKFLOW.md`

### Documentation

- Current status: `docs/infrastructure/CLOUDFLARE-STATUS.md`
- Management guide: `docs/infrastructure/CLOUDFLARE-MANAGEMENT.md`
- DNS backups: `docs/infrastructure/dns-backup-*.json`

### Scripts

- All in `scripts/` directory
- Must be run from project root
- Require Fish shell

---

## 🚀 QUICK START FOR DEPLOYMENT

```bash
# 1. Verify build
pnpm build

# 2. Load credentials
set -x CF_API_TOKEN (gopass show -o cloudflare/api-tokens/initial-project-setup-master)

# 3. Deploy to Pages
pnpm wrangler pages deploy dist/ --project-name=liteckyeditingservices

# 4. Note the URL and update DNS when ready
```

---

## 📞 NEED HELP?

1. Check audit results: `./scripts/cloudflare-audit.fish`
2. Review this directive: `CLOUDFLARE-DEPLOYMENT-DIRECTIVE.md`
3. Check deployment workflow: `CLOUDFLARE-DEPLOYMENT-WORKFLOW.md`
4. Review infrastructure docs: `docs/infrastructure/README.md`
