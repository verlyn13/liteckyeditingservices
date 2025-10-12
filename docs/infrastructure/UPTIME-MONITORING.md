# Uptime Monitoring Setup

## Overview

External uptime monitoring provides alerts when the site becomes unavailable from different geographic locations.

## Recommended Service: UptimeRobot

**Free Tier Includes**:

- 50 monitors
- 5-minute check intervals
- Email, SMS, webhook alerts
- Public status page
- 2-month log retention

**Paid Plans** ($7-58/month):

- 1-minute intervals
- More monitors
- Advanced alerting
- Longer retention

## Monitor Configuration

### Primary Monitors (Required)

#### 1. Homepage Monitor

- **URL**: `https://www.liteckyeditingservices.com`
- **Type**: HTTPS
- **Interval**: 5 minutes (free) or 1 minute (paid)
- **Alert Threshold**: Down for 1 check
- **Expected**: HTTP 200
- **Keyword Check**: "Litecky Editing Services" (optional)

#### 2. Contact Page Monitor

- **URL**: `https://www.liteckyeditingservices.com/contact`
- **Type**: HTTPS
- **Interval**: 5 minutes
- **Alert Threshold**: Down for 1 check
- **Expected**: HTTP 200
- **Keyword Check**: "Get My Free Quote" (verifies form renders)

#### 3. Admin Panel Monitor

- **URL**: `https://www.liteckyeditingservices.com/admin/`
- **Type**: HTTPS
- **Interval**: 5 minutes
- **Alert Threshold**: Down for 2 checks (admin less critical)
- **Expected**: HTTP 200
- **Keyword Check**: "Decap CMS" or "Content Manager"

### Secondary Monitors (Optional)

#### 4. Services Page

- **URL**: `https://www.liteckyeditingservices.com/services`
- **Type**: HTTPS
- **Interval**: 5 minutes
- **Alert Threshold**: Down for 1 check

#### 5. API Health Check

- **URL**: `https://www.liteckyeditingservices.com/api/contact`
- **Type**: HTTP POST (if UptimeRobot supports)
- **Interval**: 5 minutes
- **Expected**: HTTP 400 (validation error) or 415 (missing content-type)
- **Note**: UptimeRobot may only support GET; consider Pingdom for POST

#### 6. Sitemap Monitor

- **URL**: `https://www.liteckyeditingservices.com/sitemap-index.xml`
- **Type**: HTTPS
- **Interval**: 30 minutes
- **Alert Threshold**: Down for 2 checks
- **Expected**: HTTP 200
- **Keyword Check**: `<urlset` or `<sitemapindex`

## Alert Configuration

### Alert Contacts

**Primary** (Immediate):

- Email: `your-email@example.com`
- SMS: `+1-XXX-XXX-XXXX` (if available)

**Secondary** (Daily digest):

- Team email or Slack webhook

### Alert Rules

1. **Immediate Alert** (Critical monitors):
   - Homepage down
   - Contact page down
   - Down from multiple locations

2. **Delayed Alert** (Non-critical):
   - Admin panel down for 10 minutes
   - Services page down for 5 minutes

3. **Recovery Notification**:
   - Alert when service recovers
   - Include downtime duration

## Setup Steps

### Option A: UptimeRobot (Recommended - Free)

#### 1. Create Account

```
1. Visit: https://uptimerobot.com/signUp
2. Enter email, create password
3. Verify email address
```

#### 2. Add Monitors

**Homepage Monitor**:

```
Dashboard → Add New Monitor

Monitor Type: HTTPS
Friendly Name: Litecky - Homepage
URL: https://www.liteckyeditingservices.com
Monitoring Interval: 5 minutes
Alert Contacts: [Your Email]
Advanced Settings:
  - Response status code: 200
  - Keyword exists: "Litecky Editing Services"
```

**Contact Page Monitor**:

```
Monitor Type: HTTPS
Friendly Name: Litecky - Contact Form
URL: https://www.liteckyeditingservices.com/contact
Monitoring Interval: 5 minutes
Keyword exists: "Get My Free Quote"
```

**Admin Panel Monitor**:

```
Monitor Type: HTTPS
Friendly Name: Litecky - Admin Panel
URL: https://www.liteckyeditingservices.com/admin/
Monitoring Interval: 5 minutes
Alert When Down For: 10 minutes
```

#### 3. Configure Alert Settings

```
My Settings → Alert Contacts

Add Email:
  - Email: your-primary-email@example.com
  - Receive alerts when: Monitor Down
  - Receive alerts when: Monitor Up

Optional - Add SMS:
  - Phone: +1-XXX-XXX-XXXX
  - Only for critical monitors (homepage)
```

#### 4. Create Public Status Page (Optional)

```
My Settings → Status Pages → Add New

Page URL: status-litecky (or custom domain)
Monitors: Select all public-facing monitors
Show: Uptime percentages, response times
Brand: Add logo, colors
```

#### 5. Configure Maintenance Windows

```
For planned deployments:
My Settings → Maintenance Windows

Add window before deploying:
  - Duration: 15-30 minutes
  - Affected monitors: All
  - Suppress alerts during window
```

### Option B: Pingdom (Paid - More Features)

**Pricing**: Starting at $10/month

**Advantages**:

- 1-minute intervals
- True multi-location checks (not synthetic)
- Transaction monitoring (can test full user flows)
- Root cause analysis
- Real user monitoring (RUM)

**Setup**:

```
1. Sign up: https://www.pingdom.com/
2. Add Uptime Check
3. Configure:
   - Check type: HTTP(S)
   - URL: https://www.liteckyeditingservices.com
   - Check from: Multiple locations (US, EU, Asia)
   - Interval: 1 minute
   - Alerts: Email + SMS
```

### Option C: Cloudflare Health Checks

**Availability**: Requires Business plan ($200/month) or higher

**Advantages**:

- Native Cloudflare integration
- Can trigger failover if using load balancer
- No additional cost if already on Business plan

**Setup** (if available):

```
Cloudflare Dashboard → Traffic → Health Checks

Create Health Check:
  - Origin: www.liteckyeditingservices.com
  - Path: /
  - Interval: 60 seconds
  - Regions: All regions
  - Alert on failure
```

## Monitoring Locations

Recommended geographic distribution:

1. **North America** (Primary market):
   - US West Coast (Seattle/SF)
   - US East Coast (NYC/Virginia)
2. **Europe** (Secondary market):
   - UK (London)
   - Germany (Frankfurt)
3. **Asia-Pacific** (Global coverage):
   - Singapore or Tokyo

**Note**: UptimeRobot free tier checks from random locations. Paid plans offer location selection.

## Alerting Strategy

### Alert Fatigue Prevention

1. **Use Confirmation Checks**:
   - Wait for 2 consecutive failures before alerting
   - Reduces false positives from network blips

2. **Progressive Escalation**:
   - First alert: Email (low severity)
   - Still down after 5 min: Email (high severity)
   - Still down after 15 min: SMS + Slack

3. **Maintenance Windows**:
   - Schedule before deployments
   - Suppress alerts during known maintenance

### Alert Message Template

```
Subject: [Litecky] Site Down - {monitor_name}

{monitor_name} is currently down.

URL: {url}
Status: {status_code}
Location: {check_location}
Duration: {down_duration}

Last check: {timestamp}

View details: {monitor_dashboard_url}
```

## Integration with Other Systems

### Slack Webhook (Optional)

```bash
# UptimeRobot → Alert Contacts → Webhook

Webhook URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
POST data:
{
  "text": "*{monitorFriendlyName}* is {alertTypeFriendlyName}",
  "attachments": [{
    "color": "{alertTypeColor}",
    "fields": [
      {"title": "Status", "value": "{monitorURL}"},
      {"title": "Duration", "value": "{alertDuration}"}
    ]
  }]
}
```

### PagerDuty (For On-Call Teams)

```bash
# UptimeRobot → Alert Contacts → Webhook

Webhook URL: https://events.pagerduty.com/v2/enqueue
POST data:
{
  "routing_key": "YOUR_PAGERDUTY_KEY",
  "event_action": "trigger",
  "payload": {
    "summary": "{monitorFriendlyName} is down",
    "severity": "critical",
    "source": "uptimerobot"
  }
}
```

## Verification

After setup, verify monitoring works:

### 1. Test Alert

**In UptimeRobot**:

```
1. Select a monitor
2. Click "Pause Monitoring"
3. Wait for alert (should receive within 5-10 minutes)
4. Resume monitoring
5. Verify recovery notification
```

### 2. Check Monitor Status

```bash
# Via UptimeRobot API
curl "https://api.uptimerobot.com/v2/getMonitors" \
  -d "api_key=YOUR_API_KEY" \
  -d "format=json"
```

### 3. Review Historical Data

Check that monitors have been collecting data:

- Uptime percentage (should be 99.9%+)
- Response times (should be < 1000ms)
- No extended outages

## Metrics to Track

### Uptime SLA Targets

- **Homepage**: 99.9% uptime (< 43 minutes downtime/month)
- **Contact Form**: 99.9% uptime
- **Admin Panel**: 99.5% uptime (less critical)
- **Overall Site**: 99.9% uptime

### Response Time Targets

- **Homepage**: < 500ms (median)
- **Contact Page**: < 800ms (includes form assets)
- **API Endpoint**: < 200ms

### Alert Response Targets

- **Acknowledge**: < 15 minutes
- **Investigate**: < 30 minutes
- **Resolve**: < 1 hour (for critical issues)

## Monthly Review Checklist

- [ ] Review uptime percentages for all monitors
- [ ] Check for patterns in downtime (time of day, day of week)
- [ ] Review false positive alerts
- [ ] Update alert thresholds if needed
- [ ] Verify all monitors are active
- [ ] Check for SSL certificate expiration warnings
- [ ] Review response time trends

## Cost Estimate

### Free Option (UptimeRobot)

- **Cost**: $0/month
- **Limitations**: 5-minute intervals, basic features
- **Suitable for**: Initial setup, small projects

### Paid Option (UptimeRobot Pro)

- **Cost**: $7/month (10 monitors, 1-min intervals)
- **Cost**: $15/month (50 monitors, 1-min intervals)
- **Recommended for**: Production sites

### Premium Option (Pingdom)

- **Cost**: $10-15/month (basic plan)
- **Cost**: $40+/month (advanced features)
- **Recommended for**: High-traffic or revenue-critical sites

## Troubleshooting

### Issue: False Positive Alerts

**Symptom**: Alerts for site being down, but site is accessible

**Causes**:

- Cloudflare rate limiting monitor IP
- Temporary network issue
- SSL certificate renewal

**Solutions**:

1. Increase failure threshold (2-3 consecutive failures)
2. Whitelist UptimeRobot IPs in Cloudflare
3. Check Cloudflare Analytics for blocked requests

### Issue: Delayed Alerts

**Symptom**: Site was down, but alert came late

**Causes**:

- 5-minute check interval
- Email delivery delay
- Alert contact not verified

**Solutions**:

1. Upgrade to 1-minute intervals
2. Add SMS alerts for critical monitors
3. Verify all alert contact emails

### Issue: Monitor Shows Down, Site is Up

**Symptom**: Monitor reports site down, but manual checks work

**Causes**:

- Geo-blocking monitor's location
- Keyword check failing
- SSL/TLS version mismatch

**Solutions**:

1. Check monitor location vs Cloudflare rules
2. Update keyword check string
3. Review SSL settings in Cloudflare

## Related Documentation

- `docs/infrastructure/CLOUDFLARE-MANAGEMENT.md` - Cloudflare configuration
- `docs/playbooks/incident-response.md` - What to do when alerts fire (TODO)
- `DEPLOYMENT.md` - Maintenance window scheduling

## API Integration (Optional)

### UptimeRobot API

Store API key securely:

```bash
# In .env (not committed)
UPTIMEROBOT_API_KEY=your_api_key_here
```

Fetch monitor status:

```javascript
// Example: Worker to check monitor status
const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: env.UPTIMEROBOT_API_KEY,
    format: 'json',
    logs: 1,
  }),
});

const data = await response.json();
// Process monitor data
```

---

**Status**: Ready for implementation  
**Estimated Setup Time**: 30-45 minutes  
**Last Updated**: October 4, 2025
