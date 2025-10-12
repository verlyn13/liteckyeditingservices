# SendGrid Email Configuration

## Overview

This document details the production-grade SendGrid email configuration for Litecky Editing Services, implementing enterprise-level email delivery with full authentication, tracking, and monitoring.

## Domain Configuration

### Primary Domain Authentication

- **Domain**: `liteckyeditingservices.com`
- **Link Branding**: `email.liteckyeditingservices.com`
- **Purpose**: Primary domain authentication for general emails

### Transactional Email Subdomain

- **Domain**: `em.liteckyeditingservices.com`
- **Authentication**: Automated Security enabled (auto-rotating DKIM keys)
- **Purpose**: Dedicated subdomain for transactional emails (contact forms, notifications)
- **Benefits**: Better deliverability, separate reputation tracking

## DNS Records

### Root Domain Records

```
SPF: v=spf1 include:_spf.google.com include:sendgrid.net ~all
DMARC: v=DMARC1; p=none; rua=mailto:dmarc@liteckyeditingservices.com; aspf=s; adkim=s
```

### SendGrid Authentication Records

All records must be set to **DNS-only** (gray cloud) in Cloudflare:

**Root Domain Records:**

```
54920324.liteckyeditingservices.com → sendgrid.net
em1041.liteckyeditingservices.com → u54920324.wl075.sendgrid.net
s1._domainkey.liteckyeditingservices.com → s1.domainkey.u54920324.wl075.sendgrid.net
s2._domainkey.liteckyeditingservices.com → s2.domainkey.u54920324.wl075.sendgrid.net
```

**Transactional Subdomain Records (em.liteckyeditingservices.com):**

```
url1796.em.liteckyeditingservices.com → sendgrid.net
54920324.em.liteckyeditingservices.com → sendgrid.net
em2287.em.liteckyeditingservices.com → u54920324.wl075.sendgrid.net
s1._domainkey.em.liteckyeditingservices.com → s1.domainkey.u54920324.wl075.sendgrid.net
s2._domainkey.em.liteckyeditingservices.com → s2.domainkey.u54920324.wl075.sendgrid.net
_dmarc.em.liteckyeditingservices.com → v=DMARC1; p=none; rua=mailto:dmarc@liteckyeditingservices.com; aspf=s; adkim=s
```

## API Implementation

### Email Service (`src/lib/email.ts`)

Key features:

- SendGrid SDK integration (`@sendgrid/mail`)
- Automatic subdomain selection (em for transactional)
- Categories for analytics
- Custom arguments for tracking
- Rate limiting (5/10min per IP, 2/hour per email)
- Content validation for spam prevention
- Sandbox mode for development
- Professional HTML templates

### Contact Form API (`src/pages/api/contact.ts`)

Features:

- Turnstile verification for security
- Dual rate limiting (IP and email)
- Content validation
- Quote ID generation
- Sends two emails:
  1. Admin notification to `admin@liteckyeditingservices.com`
  2. User confirmation with reply-to `hello@liteckyeditingservices.com`

## Email Categories

All emails include categories for tracking:

- `contact_form` - All contact form submissions
- `admin_notification` - Admin notifications
- `user_confirmation` - User confirmations
- `transactional` - All transactional emails

## Development Configuration

### Environment Variables

**Local Development (`.dev.vars`):**

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM=hello@liteckyeditingservices.com
EMAIL_TO=admin@liteckyeditingservices.com
SENDGRID_DOMAIN_ID=54920324

# Force real sends in dev (default: sandbox mode)
# SENDGRID_FORCE_SEND=true
```

**Cloudflare Pages (Production):**
Set these as environment variables in Cloudflare Pages dashboard:

```bash
SENDGRID_API_KEY  # Secret (encrypted)
EMAIL_FROM        # Plain text: hello@liteckyeditingservices.com
EMAIL_TO          # Plain text: admin@liteckyeditingservices.com
SENDGRID_DOMAIN_ID # Plain text: 54920324
```

### Testing

1. **Sandbox Mode** (default in dev):

   ```bash
   node test-production-contact.mjs
   ```

   - Validates emails without sending
   - Logs all details to console

2. **Production Mode** (real sends):
   ```bash
   # Enable in .dev.vars: SENDGRID_FORCE_SEND=true
   node test-production-email.mjs
   ```

   - Sends real emails from `hello@em.liteckyeditingservices.com`
   - Full DKIM signing and link tracking

## Security Features

1. **Rate Limiting**:
   - 5 requests per 10 minutes per IP
   - 2 requests per hour per email address
   - Returns 429 with Retry-After header

2. **Content Validation**:
   - Minimum message length: 10 characters
   - Maximum message length: 10,000 characters
   - Maximum links: 5
   - Spam pattern detection

3. **Turnstile Integration**:
   - Required for all submissions
   - Test tokens accepted in dev mode

## Monitoring & Analytics

### SendGrid Dashboard

Track in real-time:

- Delivery rate
- Open rate
- Click rate
- Bounce rate
- Spam reports

### Custom Arguments

Every email includes:

- `quoteId` - Unique identifier
- `source` - Origin (web_form)
- `service` - Service type selected
- `env` - Environment (development/production)
- `timestamp` - ISO timestamp

### Google Postmaster Tools

Monitor reputation and delivery to Gmail:

1. Add `liteckyeditingservices.com` to Postmaster Tools
2. Verify ownership via DNS TXT record
3. Monitor spam rate and authentication status

## Production Checklist

✅ **Completed**:

- [x] SendGrid account configured
- [x] Domain authentication (root + em subdomain)
- [x] Link branding configured
- [x] DKIM signing active
- [x] SPF record includes SendGrid
- [x] DMARC policy configured
- [x] Rate limiting implemented
- [x] Sandbox mode for development
- [x] Production email templates
- [x] Categories and tracking
- [x] Turnstile integration

⏳ **Pending**:

- [ ] Google Postmaster Tools setup
- [ ] Event webhook for bounces/complaints
- [ ] DMARC policy upgrade (p=none → p=quarantine)
- [ ] Microsoft SNDS (if dedicated IP obtained)

## Maintenance

### Regular Tasks

- Review SendGrid analytics weekly
- Monitor DMARC reports
- Check Google Postmaster Tools
- Update SPF/DKIM if needed
- Rotate API keys every 6 months

### Troubleshooting

**Low delivery rate**:

- Check SendGrid suppressions
- Verify DKIM/SPF alignment
- Review content for spam triggers

**High bounce rate**:

- Check for typos in email addresses
- Implement double opt-in
- Clean email list regularly

**Rate limiting triggered**:

- Check logs for abuse patterns
- Adjust limits if legitimate traffic
- Implement CAPTCHA if needed

## Scripts

### DNS Management

```bash
# List all DNS records
./scripts/cf-dns-manage.fish list

# Add new record
./scripts/cf-dns-manage.fish add CNAME subdomain.domain.com target.com

# Update existing record
./scripts/cf-dns-manage.fish update record-id new-content
```

### Testing

```bash
# Test with sandbox mode
node test-production-contact.mjs

# Test with real sends (requires SENDGRID_FORCE_SEND=true)
node test-production-email.mjs
```

## Support

For issues or questions:

- SendGrid Support: https://support.sendgrid.com
- Cloudflare DNS: https://developers.cloudflare.com/dns
- Project documentation: `/docs` directory
