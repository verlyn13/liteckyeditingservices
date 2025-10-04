# Queue Health Monitoring

## Overview

Monitor the `send-email-queue` to detect and alert on backlogs, stuck messages, or processing failures.

## Queue Details

- **Name**: `send-email-queue`
- **Queue ID**: `a2fafae4567242b5b9acb8a4a32fa615`
- **Producer**: Pages Function `/api/contact`
- **Consumer**: Worker `queue-consumer`
- **Purpose**: Asynchronous email delivery via SendGrid

## Health Metrics

### 1. Queue Size
- **Normal**: 0-10 messages
- **Warning**: 10-50 messages
- **Critical**: 50+ messages

**Causes of Backlog**:
- Consumer Worker errors
- SendGrid API down/rate limited
- High form submission volume
- Consumer Worker not deployed

### 2. Message Age
- **Normal**: < 5 minutes
- **Warning**: 5-30 minutes
- **Critical**: > 30 minutes

**Causes of Stuck Messages**:
- Consumer repeatedly failing
- Retries exhausted
- Dead letter queue (DLQ) issues

### 3. Processing Rate
- **Normal**: > 90% success rate
- **Warning**: 80-90% success rate
- **Critical**: < 80% success rate

### 4. Retry Rate
- **Normal**: < 10% messages retried
- **Warning**: 10-25% retried
- **Critical**: > 25% retried

## Monitoring Approach

### Option A: Scheduled Worker (Recommended)

Create a Worker that runs every 15 minutes to check queue health.

**Note**: As of October 2025, Cloudflare doesn't have a direct Queue Metrics API. We'll use proxy metrics.

#### Proxy Metrics Strategy

Since direct queue metrics aren't available via API, we track:
1. **Producer counts** (messages enqueued) - from contact form submissions
2. **Consumer counts** (messages processed) - from consumer Worker logs
3. **Store difference** in KV or D1 to estimate queue size

---

### Implementation: Queue Health Worker

**File**: `workers/queue-health/src/index.ts`

```typescript
interface Env {
  QUEUE_STATS: KVNamespace; // Store queue metrics
  DB: D1Database; // Optional: Long-term storage
  SENDGRID_API_KEY: string;
  ALERT_EMAIL: string;
}

interface QueueMetrics {
  produced: number; // Messages sent to queue
  consumed: number; // Messages processed
  estimatedSize: number; // Approximate queue size
  errors: number; // Consumer errors
  timestamp: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const metrics = await getQueueMetrics(env);
    
    // Check thresholds
    const alerts: string[] = [];
    
    if (metrics.estimatedSize > 50) {
      alerts.push(
        `🚨 CRITICAL: Queue backlog of ~${metrics.estimatedSize} messages`
      );
    } else if (metrics.estimatedSize > 10) {
      alerts.push(
        `⚠️ WARNING: Queue has ~${metrics.estimatedSize} pending messages`
      );
    }
    
    const errorRate = metrics.consumed > 0 
      ? metrics.errors / metrics.consumed 
      : 0;
    
    if (errorRate > 0.25) {
      alerts.push(
        `🚨 CRITICAL: High error rate ${(errorRate * 100).toFixed(1)}%`
      );
    } else if (errorRate > 0.10) {
      alerts.push(
        `⚠️ WARNING: Elevated error rate ${(errorRate * 100).toFixed(1)}%`
      );
    }
    
    // Store metrics
    await storeMetrics(env, metrics);
    
    // Send alerts if any
    if (alerts.length > 0) {
      await sendAlert(env, alerts.join('\n\n'), metrics);
    }
    
    // Daily health report (at 9 AM UTC)
    if (isDailyReportTime()) {
      await sendDailyReport(env);
    }
  },
  
  // HTTP endpoint to manually check or update stats
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/metrics') {
      const metrics = await getQueueMetrics(env);
      return Response.json(metrics);
    }
    
    if (url.pathname === '/increment-produced') {
      // Called by contact form after enqueuing
      await incrementProducedCount(env);
      return new Response('OK');
    }
    
    if (url.pathname === '/increment-consumed') {
      // Called by queue consumer after successful processing
      await incrementConsumedCount(env);
      return new Response('OK');
    }
    
    if (url.pathname === '/increment-error') {
      // Called by queue consumer on error
      await incrementErrorCount(env);
      return new Response('OK');
    }
    
    return new Response('Queue Health Monitor', { status: 200 });
  }
};

async function getQueueMetrics(env: Env): Promise<QueueMetrics> {
  const produced = parseInt(await env.QUEUE_STATS.get('produced') || '0');
  const consumed = parseInt(await env.QUEUE_STATS.get('consumed') || '0');
  const errors = parseInt(await env.QUEUE_STATS.get('errors') || '0');
  
  return {
    produced,
    consumed,
    estimatedSize: Math.max(0, produced - consumed),
    errors,
    timestamp: new Date().toISOString(),
  };
}

async function incrementProducedCount(env: Env) {
  const current = parseInt(await env.QUEUE_STATS.get('produced') || '0');
  await env.QUEUE_STATS.put('produced', (current + 1).toString());
}

async function incrementConsumedCount(env: Env) {
  const current = parseInt(await env.QUEUE_STATS.get('consumed') || '0');
  await env.QUEUE_STATS.put('consumed', (current + 1).toString());
}

async function incrementErrorCount(env: Env) {
  const current = parseInt(await env.QUEUE_STATS.get('errors') || '0');
  await env.QUEUE_STATS.put('errors', (current + 1).toString());
}

async function storeMetrics(env: Env, metrics: QueueMetrics) {
  if (!env.DB) return;
  
  await env.DB.prepare(`
    INSERT INTO queue_metrics (timestamp, produced, consumed, estimated_size, errors)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    metrics.timestamp,
    metrics.produced,
    metrics.consumed,
    metrics.estimatedSize,
    metrics.errors
  ).run();
}

async function sendAlert(env: Env, message: string, metrics: QueueMetrics) {
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
          subject: '[Litecky] Queue Health Alert',
        },
      ],
      from: { email: 'alerts@liteckyeditingservices.com' },
      content: [
        {
          type: 'text/plain',
          value: `Queue Health Alert\n\n${message}\n\nMetrics:\n` +
                 `- Produced: ${metrics.produced}\n` +
                 `- Consumed: ${metrics.consumed}\n` +
                 `- Estimated queue size: ${metrics.estimatedSize}\n` +
                 `- Errors: ${metrics.errors}\n` +
                 `- Time: ${metrics.timestamp}`,
        },
      ],
    }),
  });
}

async function sendDailyReport(env: Env) {
  // Fetch last 24 hours of metrics from D1
  // Calculate stats: total processed, error rate, avg queue size
  // Send email report
  
  // TODO: Implement
}

function isDailyReportTime(): boolean {
  const hour = new Date().getUTCHours();
  return hour === 9; // 9 AM UTC
}
```

---

### Instrumentation: Update Contact Form and Queue Consumer

#### 1. Contact Form (`functions/api/contact.ts`)

Add after successful queue.send():

```typescript
// After enqueueing message
await queue.send({
  name,
  email,
  service,
  message,
  timestamp: new Date().toISOString(),
  turnstileToken
});

// Increment produced counter
await fetch('https://queue-health.your-subdomain.workers.dev/increment-produced', {
  method: 'POST'
}).catch(() => {}); // Don't fail form submission if this fails
```

#### 2. Queue Consumer (`workers/queue-consumer/src/index.ts`)

Add after successful/failed processing:

```typescript
async queue(batch: MessageBatch<EmailMessage>, env: Env): Promise<void> {
  for (const message of batch.messages) {
    try {
      await sendEmail(message.body, env);
      message.ack();
      
      // Increment consumed counter
      await fetch('https://queue-health.your-subdomain.workers.dev/increment-consumed', {
        method: 'POST'
      }).catch(() => {});
      
    } catch (error) {
      console.error('Failed to send email:', error);
      message.retry();
      
      // Increment error counter
      await fetch('https://queue-health.your-subdomain.workers.dev/increment-error', {
        method: 'POST'
      }).catch(() => {});
    }
  }
}
```

---

### Configuration

**wrangler.toml**:

```toml
name = "queue-health"
main = "src/index.ts"
compatibility_date = "2024-10-01"

# Check every 15 minutes
[triggers]
crons = ["*/15 * * * *"]

# KV binding for stats
[[kv_namespaces]]
binding = "QUEUE_STATS"
id = "your_kv_namespace_id"

# Optional: D1 for historical data
# [[d1_databases]]
# binding = "DB"
# database_name = "litecky-db"
# database_id = "208dd91d-8f15-40ef-b23d-d79672590112"

# Secrets: SENDGRID_API_KEY, ALERT_EMAIL
```

### Deployment

```bash
# 1. Create KV namespace for queue stats
wrangler kv:namespace create QUEUE_STATS
# Copy ID to wrangler.toml

# 2. Set secrets
cd workers/queue-health
wrangler secret put SENDGRID_API_KEY
wrangler secret put ALERT_EMAIL

# 3. Deploy
wrangler deploy

# 4. Verify
curl https://queue-health.your-subdomain.workers.dev/metrics
```

---

## Option B: Simpler Approach - Consumer Worker Logging

If the scheduled Worker approach is too complex, use this simpler method:

### Track Errors in Consumer

Modify `queue-consumer` to track consecutive failures:

```typescript
let consecutiveFailures = 0;

async queue(batch: MessageBatch<EmailMessage>, env: Env): Promise<void> {
  let batchErrors = 0;
  
  for (const message of batch.messages) {
    try {
      await sendEmail(message.body, env);
      message.ack();
      consecutiveFailures = 0; // Reset on success
    } catch (error) {
      batchErrors++;
      consecutiveFailures++;
      message.retry();
      
      // Alert after 5 consecutive failures
      if (consecutiveFailures >= 5) {
        await sendAlertEmail(env, 'Multiple queue processing failures');
        consecutiveFailures = 0; // Reset to avoid spam
      }
    }
  }
}
```

**Pros**: Simple, no additional Workers  
**Cons**: No proactive size monitoring, only error detection

---

## Alert Thresholds

```typescript
const THRESHOLDS = {
  // Queue size
  queueSizeWarning: 10,
  queueSizeCritical: 50,
  
  // Message age (if we can track it)
  messageAgeWarning: 5 * 60 * 1000, // 5 minutes
  messageAgeCritical: 30 * 60 * 1000, // 30 minutes
  
  // Error rate
  errorRateWarning: 0.10, // 10%
  errorRateCritical: 0.25, // 25%
  
  // Consecutive failures
  consecutiveFailuresAlert: 5,
};
```

## Daily Health Report

Send daily summary email with:

- Total messages processed (last 24h)
- Total errors
- Average queue size
- Peak queue size
- Error rate trend

**Example**:

```
Litecky Editing Services - Queue Health Report
Date: October 4, 2025

Summary (Last 24 Hours):
- Messages processed: 42
- Errors: 2 (4.8% error rate)
- Average queue size: 1.2 messages
- Peak queue size: 8 messages (at 14:30 UTC)

Status: ✅ Healthy

No action required.
```

---

## D1 Schema (Optional)

If storing historical metrics:

```sql
CREATE TABLE queue_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  produced INTEGER NOT NULL,
  consumed INTEGER NOT NULL,
  estimated_size INTEGER NOT NULL,
  errors INTEGER NOT NULL
);

CREATE INDEX idx_timestamp ON queue_metrics(timestamp);

-- Query example: Last 24 hours
SELECT 
  AVG(estimated_size) as avg_size,
  MAX(estimated_size) as peak_size,
  SUM(errors) as total_errors,
  SUM(consumed) as total_consumed
FROM queue_metrics
WHERE timestamp >= datetime('now', '-1 day');
```

---

## Dashboard (Future Enhancement)

Create a simple dashboard Worker to visualize queue health:

**Endpoint**: `https://queue-dashboard.your-subdomain.workers.dev`

**Display**:
- Current queue size (gauge)
- Messages processed (last hour/day/week)
- Error rate (chart)
- Recent errors (log)

---

## Testing

### Simulate Queue Backlog

```bash
# Submit multiple contact forms rapidly
for i in {1..20}; do
  curl -X POST https://www.liteckyeditingservices.com/api/contact \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test User '$i'",
      "email": "test'$i'@example.com",
      "service": "proofreading",
      "message": "Load test"
    }'
  sleep 1
done

# Check queue health
curl https://queue-health.your-subdomain.workers.dev/metrics
```

### Simulate Consumer Failure

Temporarily break the consumer Worker (e.g., invalid SendGrid key), then:

```bash
# Submit form
curl -X POST https://www.liteckyeditingservices.com/api/contact ...

# Wait 15 minutes for health check
# Should receive alert email
```

---

## Troubleshooting

### Issue: Metrics Counter Drift

**Symptom**: `estimatedSize` doesn't match reality

**Cause**: 
- Producer/consumer didn't call increment endpoints
- KV writes failed
- Counter reset

**Solution**:
```bash
# Reset counters
wrangler kv:key put --namespace-id=YOUR_KV_ID "produced" "0"
wrangler kv:key put --namespace-id=YOUR_KV_ID "consumed" "0"
wrangler kv:key put --namespace-id=YOUR_KV_ID "errors" "0"

# Or accept eventual consistency
```

### Issue: False Positive Alerts

**Symptom**: Alerts for backlog, but queue is empty

**Solution**: 
- Check if both producer and consumer are calling increment endpoints
- Add logging to verify API calls succeed
- Accept ~15 minute lag in detection

---

## Cost Analysis

**Queue Health Worker**:
- Scheduled runs: 96/day (every 15 min) = Free
- HTTP requests: ~200/day (from producer/consumer) = Free
- KV writes: ~200/day = Free
- KV reads: ~96/day = Free

**Total**: $0/month

---

## Related Documentation

- `docs/infrastructure/ERROR-ALERTING.md` - General error monitoring
- `workers/queue-consumer/README.md` - Queue consumer details
- `functions/api/contact.ts` - Message producer

---

**Status**: Implementation guide ready  
**Estimated Setup Time**: 2-3 hours  
**Last Updated**: October 4, 2025
