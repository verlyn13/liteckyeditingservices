# SendGrid Configuration - Litecky Editing Services

## Domain Authentication Setup

### SendGrid Account Details

- **Account**: Litecky Editing Services
- **API Key Name**: sendgrid-liteckyeditingservices-key
- **API Key Permissions**: Full Access (all endpoints except billing and Email Address Validation)
- **From Domain**: liteckyeditingservices.com
- **Custom Link Subdomain**: email.liteckyeditingservices.com
- **Automated Security**: Enabled (DKIM key rotation)

## DNS Records for Cloudflare

### Required CNAME Records

```
Type: CNAME
Name: email.liteckyeditingservices.com
Value: sendgrid.net

Type: CNAME
Name: 54920324.liteckyeditingservices.com
Value: sendgrid.net

Type: CNAME
Name: em1041.liteckyeditingservices.com
Value: u54920324.wl075.sendgrid.net

Type: CNAME
Name: s1._domainkey.liteckyeditingservices.com
Value: s1.domainkey.u54920324.wl075.sendgrid.net

Type: CNAME
Name: s2._domainkey.liteckyeditingservices.com
Value: s2.domainkey.u54920324.wl075.sendgrid.net
```

### Required TXT Record

```
Type: TXT
Name: _dmarc.liteckyeditingservices.com
Value: v=DMARC1; p=none;
```

## Environment Configuration

### Production Environment Variables

```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx  # Store in gopass: development/sendgrid/api-key
EMAIL_FROM=hello@liteckyeditingservices.com
EMAIL_TO=ahnie@liteckyeditingservices.com
SENDGRID_DOMAIN_ID=54920324
```

### Gopass Storage Structure

```
sendgrid/
├── api-keys/
│   ├── liteckyeditingservices-key      # API key value
│   ├── liteckyeditingservices-name     # API key name
│   └── liteckyeditingservices-permissions # API key permissions
├── domain/
│   ├── from-domain                     # liteckyeditingservices.com
│   ├── link-subdomain                  # email.liteckyeditingservices.com
│   └── domain-id                       # 54920324
└── dns/
    ├── cname-records                   # All CNAME records
    ├── txt-records                     # DMARC TXT record
    └── verification-status             # Domain verification status
```

## Setup Steps

### 1. Add DNS Records to Cloudflare

1. Log into Cloudflare dashboard
2. Select liteckyeditingservices.com domain
3. Go to DNS → Records
4. Add all CNAME and TXT records listed above
5. Wait for DNS propagation (usually 5-15 minutes)

### 2. Verify Domain in SendGrid

1. Return to SendGrid domain authentication
2. Click "Verify" to check DNS records
3. Confirm all records are properly configured

### 3. Set Up Sender Identity

1. Go to SendGrid → Settings → Sender Authentication
2. Choose "Single Sender Verification"
3. Add sender: hello@liteckyeditingservices.com
4. Complete verification process

### 4. Test Email Functionality

```bash
pnpm test:sendgrid
```

## Security Notes

- API key stored in gopass with agent-accessible path
- Domain authentication provides SPF, DKIM, and DMARC alignment
- Automated DKIM key rotation enabled for security
- Link branding uses custom subdomain for professional appearance

## Related Files

- `.dev.vars` - Development environment variables
- `.env.example` - Environment variable template
- `tests/sendgrid-test.mjs` - SendGrid API testing script
- `package.json` - Contains `test:sendgrid` script
