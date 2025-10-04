# Cloudflare Error Alerting

## Overview

Monitor and alert on errors from Cloudflare Pages and Workers to proactively detect issues before users report them.

## Error Sources

1. **Cloudflare Pages** (main site)
   - 4xx errors (client errors)
   - 5xx errors (server errors)
   - Build failures

2. **Workers**
   - `decap-oauth` - OAuth authentication
   - `queue-consumer` - Email queue processing
   - Pages Functions (`/api/contact`)

3. **Infrastructure**
   - Queue failures
   - D1 database errors
   - KV namespace issues

## Monitoring Approaches

### Option A: Cloudflare Workers Analytics + Scheduled Worker (Recommended)

**Cost**: Free (included with Workers)

**Approach**:
1. Create a monitoring Worker with scheduled trigger
2. Query Workers Analytics API for error metrics
3. Check thresholds and send alerts via SendGrid
4. Store metrics in D1 for trending

**Advantages**:
- No external dependencies
- Free
- Full control over logic
- Can aggregate multiple sources

**Disadvantages**:
- Requires implementation effort
- ~15 minute delay (Analytics API lag)

---

### Option B: Cloudflare Notifications (Email Alerts)

**Cost**: Free (included)

**Approach**:
Use Cloudflare Dashboard notifications for basic alerts.

**Available Notifications**:
- Pages deployment failures
- SSL certificate expiration
- Load balancing health checks (Business+ plans)

**Limitations**:
- Limited granularity
- No custom thresholds
- No Worker error alerts
- Email only (no webhooks)

**Setup**:
```
Cloudflare Dashboard → Notifications

Enable:
1. Pages Deployment Notifications
   - Alert on: Build failed, Deployment failed
   - Recipient: your-email@example.com

2. SSL/TLS Certificate Notifications
   - Alert on: Expiring soon (30 days)
   - Recipient: your-email@example.com
```

---

### Option C: Cloudflare Logpush (Enterprise/Business)

**Cost**: $200+/month (requires Business or Enterprise plan)

**Approach**:
1. Push logs to R2 or external storage
2. Process logs with Worker or external tool
3. Alert on patterns

**Advantages**:
- Real-time logs
- Complete request data
- Can feed into external tools (Datadog, Splunk)

**Disadvantages**:
- Expensive
- Requires Business+ plan
- Overkill for current needs

---

### Option D: Sentry Integration

**Cost**: Free tier (5k events/month) or $26+/month

**Approach**:
1. Instrument Workers with Sentry SDK
2. Automatic error tracking
3. Alerts via email, Slack, PagerDuty

**Advantages**:
- Purpose-built for error tracking
- Excellent UX
- Stack traces, breadcrumbs
- Issue deduplication

**Disadvantages**:
- Additional service dependency
- Requires instrumentation
- Limited free tier

---

## Recommended Implementation: Scheduled Monitoring Worker

### Architecture

```
┌─────────────────┐
│ Scheduled       │
│ Monitoring      │──┐
│ Worker          │  │
└─────────────────┘  │
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼─────┐          ┌─────▼────┐
    │ Workers  │          │  Pages   │
    │ Analytics│          │  Status  │
    │   API    │          │   API    │
    └────┬─────┘          └─────┬────┘
         │                      │
         └───────────┬──────────┘
                     │
              ┌──────▼──────┐
              │   Analyze   │
              │  Thresholds │
              └──────┬──────┘
                     │
              ┌──────▼──────┐
              │Send Alerts  │
              │ (SendGrid)  │
              └──────┬──────┘
                     │
              ┌──────▼──────┐
              │  Store in   │
              │  D1 (trend) │
              └─────────────┘
```

### Worker Implementation

Create: `workers/error-monitor/src/index.ts`

```typescript
interface Env {
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  SENDGRID_API_KEY: string;
  ALERT_EMAIL: string;
  DB: D1Database; // Optional: for storing metrics
}

interface WorkerAnalytics {
  errors: number;
  requests: number;
  errorRate: number;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const alerts: string[] = [];

    // Check Workers Analytics
    const workersData = await checkWorkersErrors(env);
    if (workersData.errorRate > 0.05) { // 5% error rate
      alerts.push(
        `⚠️ Workers error rate: ${(workersData.errorRate * 100).toFixed(2)}%\n` +
        `Errors: ${workersData.errors}/${workersData.requests} requests`
      );
    }

    // Check Pages status
    const pagesData = await checkPagesErrors(env);
    if (pagesData.recentFailures > 0) {
      alerts.push(
        `⚠️ Pages deployment failures: ${pagesData.recentFailures} in last hour`
      );
    }

    // Check Queue health (separate function)
    const queueData = await checkQueueHealth(env);
    if (queueData.size > 100) {
      alerts.push(
        `⚠️ Email queue backlog: ${queueData.size} messages`
      );
    }

    // Send alerts if any
    if (alerts.length > 0) {
      await sendAlert(env, alerts.join('\n\n'));
    }

    // Store metrics (optional)
    if (env.DB) {
      await storeMetrics(env.DB, { workersData, pagesData, queueData });
    }
  }
};

async function checkWorkersErrors(env: Env): Promise<WorkerAnalytics> {
  // Query Workers Analytics API
  // https://developers.cloudflare.com/analytics/graphql-api/
  
  const query = `
    query {
      viewer {
        accounts(filter: { accountTag: "${env.CLOUDFLARE_ACCOUNT_ID}" }) {
          workersInvocationsAdaptive(
            filter: {
              datetime_geq: "${getTimeAgo(15)}"
              datetime_lt: "${new Date().toISOString()}"
            }
            limit: 10000
          ) {
            sum {
              requests
              errors
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  const sum = data.data.viewer.accounts[0].workersInvocationsAdaptive[0]?.sum;
  
  return {
    errors: sum?.errors || 0,
    requests: sum?.requests || 0,
    errorRate: sum?.requests > 0 ? sum.errors / sum.requests : 0,
  };
}

async function checkPagesErrors(env: Env): Promise<{ recentFailures: number }> {
  // Check Pages deployments for failures
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/pages/projects/litecky-editing-services/deployments`,
    {
      headers: {
        'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      },
    }
  );

  const data = await response.json();
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  
  const recentFailures = data.result.filter((d: any) => 
    new Date(d.created_on).getTime() > oneHourAgo &&
    (d.latest_stage.status === 'failure' || d.latest_stage.status === 'canceled')
  ).length;

  return { recentFailures };
}

async function checkQueueHealth(env: Env): Promise<{ size: number }> {
  // Note: Queue metrics API may not be available yet
  // Alternative: Keep counter in KV or D1
  
  // Placeholder - implement based on available APIs
  return { size: 0 };
}

async function sendAlert(env: Env, message: string) {
  await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: env.ALERT_EMAIL }],
          subject: '[Litecky] Error Alert',
        },
      ],
      from: { email: 'alerts@liteckyeditingservices.com' },
      content: [
        {
          type: 'text/plain',
          value: `Litecky Editing Services - Error Alert\n\n${message}`,
        },
      ],
    }),
  });
}

async function storeMetrics(db: D1Database, metrics: any) {
  await db.prepare(
    'INSERT INTO error_metrics (timestamp, workers_errors, workers_requests, pages_failures, queue_size) VALUES (?, ?, ?, ?, ?)'
  ).bind(
    new Date().toISOString(),
    metrics.workersData.errors,
    metrics.workersData.requests,
    metrics.pagesData.recentFailures,
    metrics.queueData.size
  ).run();
}

function getTimeAgo(minutes: number): string {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
}
```

### Configuration

**wrangler.toml** (add to existing or create new):

```toml
name = "error-monitor"
main = "src/index.ts"
compatibility_date = "2024-10-01"

# Run every 15 minutes
[triggers]
crons = ["*/15 * * * *"]

# Secrets (set via wrangler secret put)
# CLOUDFLARE_API_TOKEN
# SENDGRID_API_KEY
# ALERT_EMAIL

[vars]
CLOUDFLARE_ACCOUNT_ID = "your_account_id"

# Optional: D1 binding for storing metrics
# [[d1_databases]]
# binding = "DB"
# database_name = "litecky-db"
# database_id = "208dd91d-8f15-40ef-b23d-d79672590112"
```

### Deployment Steps

```bash
# 1. Create worker directory
mkdir -p workers/error-monitor/src

# 2. Create the worker (code above)
# Edit workers/error-monitor/src/index.ts

# 3. Create wrangler.toml

# 4. Set secrets
cd workers/error-monitor
wrangler secret put CLOUDFLARE_API_TOKEN
# Enter API token (created in Cloudflare Dashboard → My Profile → API Tokens)

wrangler secret put SENDGRID_API_KEY
# Enter SendGrid API key

wrangler secret put ALERT_EMAIL
# Enter email address for alerts

# 5. Deploy
wrangler deploy

# 6. Verify scheduled trigger
wrangler deployments list
# Should show CRON trigger

# 7. Test manually (optional)
wrangler tail --format=pretty
# Trigger will run on schedule, or use `wrangler triggers` to test
```

### Alert Thresholds

Customize based on your needs:

```typescript
const THRESHOLDS = {
  // Worker error rate threshold (5%)
  workerErrorRate: 0.05,
  
  // Pages deployment failures in last hour
  pagesFailures: 1,
  
  // Queue size threshold
  queueSize: 100,
  
  // Queue message age threshold (1 hour in milliseconds)
  queueMaxAge: 60 * 60 * 1000,
  
  // 4xx rate threshold (50% of requests)
  clientErrorRate: 0.5,
  
  // 5xx rate threshold (1% of requests)
  serverErrorRate: 0.01,
};
```

## Alert Message Examples

### Worker Error Alert
```
⚠️ Litecky Editing Services - Worker Errors Detected

Worker error rate: 7.2%
Errors: 36/500 requests in last 15 minutes

Workers affected:
- queue-consumer: 32 errors
- decap-oauth: 4 errors

View logs: https://dash.cloudflare.com/...

Time: 2025-10-04 14:30 UTC
```

### Pages Deployment Failure
```
⚠️ Litecky Editing Services - Deployment Failed

Latest deployment to production failed.

Project: litecky-editing-services
Branch: main
Commit: abc1234
Time: 2025-10-04 14:25 UTC

Error: Build step failed
View details: https://dash.cloudflare.com/...
```

### Queue Backlog Alert
```
⚠️ Litecky Editing Services - Email Queue Backlog

Queue size: 150 messages (threshold: 100)
Oldest message: 2 hours ago (threshold: 1 hour)

Possible causes:
- Consumer Worker errors
- SendGrid rate limiting
- Network issues

View queue: https://dash.cloudflare.com/...
```

## Testing

### Test Error Detection

```bash
# 1. Cause intentional error in test Worker
# 2. Wait for next scheduled run (up to 15 min)
# 3. Check email for alert

# Or trigger manually:
curl -X POST https://error-monitor.your-subdomain.workers.dev/__scheduled
# (if exposed; normally scheduled only)
```

### Test Alert Delivery

```bash
# Send test alert via wrangler
wrangler tail error-monitor

# Then in another terminal, trigger errors in other Workers
```

## Cloudflare API Token Setup

Create a token with minimal permissions:

```
Cloudflare Dashboard → My Profile → API Tokens → Create Token

Permissions:
- Account: Analytics:Read
- Account: Workers Scripts:Read
- Pages: Projects:Read

Account Resources:
- Include: Your Account

TTL: No expiry (or 1 year)

Copy token and store as CLOUDFLARE_API_TOKEN secret
```

## Maintenance

### Weekly Review
- Check alert accuracy (false positives/negatives)
- Adjust thresholds if needed
- Review error trends in D1 (if storing metrics)

### Monthly Review
- Verify alerting Worker is running (check logs)
- Review alert history
- Update error patterns as needed

## Cost Analysis

**Free Tier (Recommended)**:
- Workers requests: Free (100k/day)
- Scheduled triggers: Free
- SendGrid emails: Free (100/day)
- **Total**: $0/month

**If Storing Metrics in D1**:
- D1 storage: Free (up to 500MB)
- D1 reads: Free (5M/day)
- **Total**: $0/month

**Alternative: Sentry**:
- Free tier: 5k events/month
- Developer plan: $26/month (50k events)

## Troubleshooting

### Issue: No alerts received

**Debug**:
```bash
# Check Worker logs
wrangler tail error-monitor

# Verify scheduled trigger is active
wrangler deployments list

# Check SendGrid activity
# Visit: https://app.sendgrid.com/email_activity
```

### Issue: Too many false positives

**Solution**: Adjust thresholds in Worker code

```typescript
// Increase error rate threshold
const THRESHOLDS = {
  workerErrorRate: 0.10, // 10% instead of 5%
  // ...
};
```

### Issue: Delayed alerts

**Cause**: 15-minute check interval + Analytics API lag

**Solution**:
- Reduce cron interval to `*/5 * * * *` (every 5 min)
- Accept ~5-10 minute delay inherent to Analytics API
- For real-time alerts, consider Sentry

## Related Documentation

- `docs/infrastructure/UPTIME-MONITORING.md` - External uptime checks
- `docs/infrastructure/QUEUE-HEALTH.md` - Queue-specific monitoring
- `SECRETS.md` - Managing API tokens securely

---

**Status**: Implementation guide ready  
**Estimated Setup Time**: 2-3 hours  
**Last Updated**: October 4, 2025
