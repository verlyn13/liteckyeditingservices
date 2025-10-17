# Cal.com Phase 3: Webhook Implementation Guide

**Last Updated**: October 16, 2025  
**Status**: Ready to Execute  
**Prerequisites**: Phase 2 complete (secrets deployed to Cloudflare)  
**Time Estimate**: 2-3 hours (implementation + testing)

---

## 📋 Overview

Phase 3 implements the webhook endpoint that receives booking events from Cal.com. This enables:

- **Real-time notifications** when bookings are created, rescheduled, or cancelled
- **Email confirmations** sent to staff via SendGrid
- **Future extensibility** for CRM integration, analytics, and automation

---

## 🎯 What We're Building

### Webhook Endpoint: `/api/calcom-webhook`

**Purpose**: Receive and process booking events from Cal.com

**Events Handled**:
- ✅ `BOOKING_CREATED` - New booking scheduled
- ✅ `BOOKING_RESCHEDULED` - Booking time changed
- ✅ `BOOKING_CANCELLED` - Booking cancelled by client

**Security**:
- ✅ HMAC-SHA256 signature verification (prevents spoofing)
- ✅ Webhook secret validation
- ✅ Request body integrity checks

**Integration**:
- ✅ SendGrid email notifications (via existing queue system)
- ✅ Sentry error tracking
- ✅ Structured logging

---

## 🏗️ Architecture

### Request Flow

```
Cal.com → Webhook Endpoint → Signature Verification → Event Processing → Email Queue → SendGrid
```

### Components

1. **`functions/api/calcom-webhook.ts`** - Main webhook handler
2. **`src/lib/calcom-webhook.ts`** - Signature verification logic
3. **`src/lib/email.ts`** - Email template creation (existing)
4. **Environment Variables** - Webhook secret configuration

---

## 📝 Implementation Steps

### Step 1: Create Webhook Endpoint (30 minutes)

Create the main webhook handler that receives Cal.com events.

**File**: `functions/api/calcom-webhook.ts`

This endpoint will:
- Accept POST requests from Cal.com
- Verify webhook signature (HMAC-SHA256)
- Parse booking event payload
- Queue email notification
- Return appropriate HTTP status codes

**Key Features**:
- ✅ Signature verification prevents unauthorized requests
- ✅ Graceful error handling with Sentry integration
- ✅ Structured logging for debugging
- ✅ Queue-based email sending (non-blocking)

---

### Step 2: Implement Signature Verification (20 minutes)

Create the cryptographic verification logic to validate webhook authenticity.

**File**: `src/lib/calcom-webhook.ts`

This module will:
- Compute HMAC-SHA256 signature from request body
- Compare with Cal.com's signature header
- Use timing-safe comparison to prevent timing attacks
- Return boolean verification result

**Security Notes**:
- Uses Web Crypto API (Cloudflare Workers compatible)
- Constant-time comparison prevents side-channel attacks
- Validates signature format before processing

---

### Step 3: Update Type Definitions (10 minutes)

Add Cal.com webhook types to environment definitions.

**Files to Update**:
- `src/env.d.ts` - Add `CALCOM_WEBHOOK_SECRET` type
- `functions/api/calcom-webhook.ts` - Define webhook payload types

**Types Needed**:
```typescript
interface CalcomWebhookPayload {
  triggerEvent: 'BOOKING_CREATED' | 'BOOKING_RESCHEDULED' | 'BOOKING_CANCELLED';
  payload: {
    uid: string;
    title: string;
    startTime: string;
    endTime: string;
    attendees: Array<{
      name: string;
      email: string;
      timeZone: string;
    }>;
    organizer: {
      name: string;
      email: string;
      timeZone: string;
    };
    metadata?: Record<string, unknown>;
  };
}
```

---

### Step 4: Configure Webhook in Cal.com Dashboard (15 minutes)

Set up the webhook subscription in your Cal.com account.

#### 4.1 Access Webhook Settings

1. Go to: https://app.cal.com/settings/developer/webhooks
2. Click **"New Webhook"**

#### 4.2 Configure Webhook

**Subscriber URL**:
```
https://www.liteckyeditingservices.com/api/calcom-webhook
```

**Events to Subscribe** (select all):
- ✅ `BOOKING_CREATED`
- ✅ `BOOKING_RESCHEDULED`
- ✅ `BOOKING_CANCELLED`

**Payload Template** (optional - leave default):
```json
{
  "triggerEvent": "{{triggerEvent}}",
  "payload": "{{payload}}"
}
```

#### 4.3 Save and Copy Secret

1. Click **"Create Webhook"**
2. Copy the **Webhook Secret** (format: `whsec_xxxxxxxxxxxx`)
3. **Important**: Save this secret immediately - it's only shown once!

---

### Step 5: Store Webhook Secret (10 minutes)

Add the webhook secret to your secure secret management system.

#### 5.1 Store in gopass

```bash
# Store the webhook secret (replace with actual value from Cal.com)
echo "whsec_YOUR_SECRET_HERE" | gopass insert -f calcom/litecky-editing/webhook-secret

# Verify storage
gopass show calcom/litecky-editing/webhook-secret
```

#### 5.2 Sync to Local Development

```bash
# Regenerate .dev.vars with new secret
./scripts/generate-dev-vars.sh

# Verify .dev.vars contains the secret
grep CALCOM_WEBHOOK_SECRET .dev.vars
```

**Expected Output**:
```bash
CALCOM_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

#### 5.3 Sync to Infisical (Production)

```bash
# Sync gopass → Infisical
./scripts/secrets/infisical_seed_prod_from_gopass.sh

# Verify sync
infisical secrets get CALCOM_WEBHOOK_SECRET --env=prod
```

**Expected Output**:
```
KEY                      | VALUE
CALCOM_WEBHOOK_SECRET    | whsec_xxxxxxxxxxxx
```

#### 5.4 Deploy to Cloudflare Pages

```bash
# Prepare secrets from Infisical
./scripts/secrets/cloudflare_prepare_from_infisical.sh

# Deploy to Production + Preview
./scripts/secrets/sync-to-cloudflare-pages.sh
```

**Verification**:
1. Go to: https://dash.cloudflare.com/
2. Navigate to: **Pages → liteckyeditingservices → Settings → Environment Variables**
3. Verify **Production** environment has: `CALCOM_WEBHOOK_SECRET`
4. Verify **Preview** environment has: `CALCOM_WEBHOOK_SECRET`

---

### Step 6: Test Webhook Locally (30 minutes)

Test the webhook endpoint in your local development environment.

#### 6.1 Start Dev Server

```bash
# Terminal 1: Start Astro dev server
pnpm dev
# Server runs at http://localhost:4321
```

#### 6.2 Test Signature Verification

```bash
# Test with valid signature (will fail - expected)
curl -X POST http://localhost:4321/api/calcom-webhook \
  -H "Content-Type: application/json" \
  -H "X-Cal-Signature-256: sha256=invalid" \
  -d '{
    "triggerEvent": "BOOKING_CREATED",
    "payload": {
      "uid": "test-123",
      "title": "Test Booking",
      "startTime": "2025-10-20T14:00:00Z",
      "endTime": "2025-10-20T15:00:00Z",
      "attendees": [{
        "name": "Test User",
        "email": "test@example.com",
        "timeZone": "America/Anchorage"
      }],
      "organizer": {
        "name": "Litecky Editing",
        "email": "contact@liteckyeditingservices.com",
        "timeZone": "America/Anchorage"
      }
    }
  }'
```

**Expected Response** (401 Unauthorized):
```json
{
  "error": "Invalid webhook signature"
}
```

#### 6.3 Test with Correct Signature

To generate a valid signature, you'll need to compute HMAC-SHA256:

```bash
# Create test script: test-webhook.sh
cat > test-webhook.sh << 'EOF'
#!/bin/bash
WEBHOOK_SECRET="whsec_YOUR_SECRET_HERE"  # Replace with actual secret
PAYLOAD='{"triggerEvent":"BOOKING_CREATED","payload":{"uid":"test-123"}}'

# Compute HMAC-SHA256 signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | cut -d' ' -f2)

# Send request with signature
curl -X POST http://localhost:4321/api/calcom-webhook \
  -H "Content-Type: application/json" \
  -H "X-Cal-Signature-256: sha256=$SIGNATURE" \
  -d "$PAYLOAD"
EOF

chmod +x test-webhook.sh
./test-webhook.sh
```

**Expected Response** (200 OK):
```json
{
  "status": "processed",
  "event": "BOOKING_CREATED"
}
```

#### 6.4 Verify Email Queue

Check that the webhook queued an email notification:

```bash
# Check dev server logs for queue message
# Look for: "Webhook processed: BOOKING_CREATED"
# Look for: "Email queued for booking: test-123"
```

---

### Step 7: Test Webhook in Production (20 minutes)

Test the webhook with a real booking in your production environment.

#### 7.1 Create Test Booking

1. Go to: https://cal.com/litecky-editing/consultation
2. Select a test time slot
3. Fill in test details:
   - **Name**: Test Booking (Phase 3)
   - **Email**: your-email@example.com
   - **Notes**: Testing webhook integration
4. Click **"Confirm Booking"**

#### 7.2 Verify Webhook Delivery

1. Go to: https://app.cal.com/settings/developer/webhooks
2. Click on your webhook
3. Check **"Recent Deliveries"** tab
4. Verify latest delivery shows:
   - ✅ Status: `200 OK`
   - ✅ Event: `BOOKING_CREATED`
   - ✅ Timestamp: Recent

#### 7.3 Verify Email Notification

Check your email inbox for:
- ✅ Subject: "New Cal.com Booking: [Event Name]"
- ✅ From: `contact@liteckyeditingservices.com`
- ✅ Contains booking details (name, email, time)

#### 7.4 Check Cloudflare Logs

```bash
# View recent webhook requests
wrangler pages deployment tail liteckyeditingservices --production

# Look for:
# - POST /api/calcom-webhook
# - Status: 200
# - Log: "Webhook processed: BOOKING_CREATED"
```

---

## ✅ Verification Checklist

### Code Implementation
- [ ] `functions/api/calcom-webhook.ts` created with signature verification
- [ ] `src/lib/calcom-webhook.ts` created with crypto utilities
- [ ] `src/env.d.ts` updated with `CALCOM_WEBHOOK_SECRET` type
- [ ] TypeScript compiles without errors (`pnpm check`)

### Secret Management
- [ ] Webhook secret stored in gopass at `calcom/litecky-editing/webhook-secret`
- [ ] `.dev.vars` contains `CALCOM_WEBHOOK_SECRET`
- [ ] Infisical production environment has `CALCOM_WEBHOOK_SECRET`
- [ ] Cloudflare Pages Production has `CALCOM_WEBHOOK_SECRET`
- [ ] Cloudflare Pages Preview has `CALCOM_WEBHOOK_SECRET`

### Cal.com Configuration
- [ ] Webhook created in Cal.com dashboard
- [ ] Subscriber URL: `https://www.liteckyeditingservices.com/api/calcom-webhook`
- [ ] Events subscribed: `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`
- [ ] Webhook secret matches gopass value

### Local Testing
- [ ] Dev server starts without errors
- [ ] Invalid signature returns `401 Unauthorized`
- [ ] Valid signature returns `200 OK`
- [ ] Webhook logs show event processing
- [ ] Email queue receives booking notification

### Production Testing
- [ ] Test booking created successfully
- [ ] Cal.com webhook delivery shows `200 OK`
- [ ] Email notification received
- [ ] Cloudflare logs show successful webhook processing
- [ ] No errors in Sentry

---

## 🔧 Troubleshooting

### Issue: Webhook Returns 401 (Invalid Signature)

**Cause**: Signature mismatch between Cal.com and your endpoint

**Solutions**:
1. Verify webhook secret matches in all locations:
   ```bash
   # Check gopass
   gopass show calcom/litecky-editing/webhook-secret
   
   # Check .dev.vars
   grep CALCOM_WEBHOOK_SECRET .dev.vars
   
   # Check Cloudflare
   wrangler pages secret list --project-name=liteckyeditingservices
   ```

2. Ensure webhook secret in Cal.com dashboard matches stored secret
3. Check request body is parsed as raw text (not JSON) before verification
4. Verify signature header format: `X-Cal-Signature-256: sha256=<hash>`

---

### Issue: Webhook Returns 500 (Internal Server Error)

**Cause**: Runtime error in webhook handler

**Solutions**:
1. Check Sentry for error details:
   ```bash
   # Go to: https://sentry.io/organizations/happy-patterns-llc/projects/
   # Filter by: /api/calcom-webhook
   ```

2. Check Cloudflare logs:
   ```bash
   wrangler pages deployment tail liteckyeditingservices --production
   ```

3. Verify environment variables are set:
   ```bash
   # Check Cloudflare dashboard
   # Pages → liteckyeditingservices → Settings → Environment Variables
   # Verify: CALCOM_WEBHOOK_SECRET, SENDGRID_API_KEY, EMAIL_TO, EMAIL_FROM
   ```

4. Test locally with detailed logging:
   ```bash
   # Add console.log statements to webhook handler
   # Run: pnpm dev
   # Send test webhook request
   ```

---

### Issue: Email Not Sent After Webhook

**Cause**: Email queue or SendGrid configuration issue

**Solutions**:
1. Verify SendGrid API key is valid:
   ```bash
   curl -X POST https://api.sendgrid.com/v3/mail/send \
     -H "Authorization: Bearer $SENDGRID_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "personalizations": [{"to": [{"email": "test@example.com"}]}],
       "from": {"email": "contact@liteckyeditingservices.com"},
       "subject": "Test",
       "content": [{"type": "text/plain", "value": "Test"}]
     }'
   ```

2. Check queue consumer is running:
   ```bash
   # Check Cloudflare Workers dashboard
   # Verify: queue-consumer worker is active
   ```

3. Verify email environment variables:
   ```bash
   # Check Cloudflare dashboard
   # Verify: EMAIL_TO, EMAIL_FROM, SENDGRID_API_KEY
   ```

4. Check SendGrid activity feed:
   ```bash
   # Go to: https://app.sendgrid.com/email_activity
   # Filter by: contact@liteckyeditingservices.com
   ```

---

### Issue: Webhook Delivery Fails in Cal.com Dashboard

**Cause**: Endpoint unreachable or returning non-200 status

**Solutions**:
1. Verify endpoint is accessible:
   ```bash
   curl -I https://www.liteckyeditingservices.com/api/calcom-webhook
   # Should return: HTTP/1.1 405 Method Not Allowed (GET not allowed)
   ```

2. Check Cloudflare Pages deployment status:
   ```bash
   # Go to: https://dash.cloudflare.com/
   # Pages → liteckyeditingservices → Deployments
   # Verify: Latest deployment is "Active"
   ```

3. Test webhook endpoint directly:
   ```bash
   # Use test-webhook.sh script from Step 6.3
   # Replace localhost with production URL
   ```

4. Check Cal.com webhook logs:
   ```bash
   # Go to: https://app.cal.com/settings/developer/webhooks
   # Click webhook → Recent Deliveries
   # Check response body and status code
   ```

---

## 🔐 Security Considerations

### Signature Verification

**Why It's Critical**:
- Prevents unauthorized requests from spoofing Cal.com
- Ensures webhook payload hasn't been tampered with
- Protects against replay attacks (when combined with timestamp validation)

**How It Works**:
1. Cal.com computes HMAC-SHA256 of request body using webhook secret
2. Signature sent in `X-Cal-Signature-256` header
3. Your endpoint recomputes signature using same secret
4. Timing-safe comparison prevents side-channel attacks

**Best Practices**:
- ✅ Always verify signature before processing payload
- ✅ Use constant-time comparison (prevents timing attacks)
- ✅ Rotate webhook secret every 90 days
- ✅ Never log webhook secret in plaintext

---

### Secret Rotation

**When to Rotate**:
- Every 90 days (scheduled maintenance)
- If secret is compromised or exposed
- When team member with access leaves
- After security incident

**How to Rotate**:
```bash
# 1. Generate new webhook in Cal.com dashboard
# 2. Store new secret in gopass
echo "whsec_NEW_SECRET_HERE" | gopass insert -f calcom/litecky-editing/webhook-secret

# 3. Sync to all environments
./scripts/generate-dev-vars.sh
./scripts/secrets/infisical_seed_prod_from_gopass.sh
./scripts/secrets/cloudflare_prepare_from_infisical.sh
./scripts/secrets/sync-to-cloudflare-pages.sh

# 4. Test webhook delivery
# Create test booking and verify webhook succeeds

# 5. Delete old webhook in Cal.com dashboard
```

---

## 📊 Monitoring & Observability

### Metrics to Track

**Webhook Delivery Success Rate**:
- Target: > 99.5%
- Alert if: < 95% over 1 hour
- Check: Cal.com webhook dashboard

**Webhook Response Time**:
- Target: < 500ms (p95)
- Alert if: > 2s (p95)
- Check: Cloudflare Analytics

**Email Delivery Success Rate**:
- Target: > 99%
- Alert if: < 95% over 1 hour
- Check: SendGrid activity feed

**Error Rate**:
- Target: < 0.1%
- Alert if: > 1% over 1 hour
- Check: Sentry dashboard

---

### Sentry Integration

**Error Tracking**:
- All webhook errors automatically sent to Sentry
- Includes request context (headers, body, signature)
- Sensitive data scrubbed by middleware

**Alerts**:
- Configure Sentry alert for webhook errors:
  - Go to: Sentry → Alerts → New Alert Rule
  - Condition: `event.tags.endpoint:calcom-webhook AND level:error`
  - Threshold: > 5 errors in 1 hour
  - Action: Email notification

---

### Logging Best Practices

**What to Log**:
- ✅ Webhook event type (`BOOKING_CREATED`, etc.)
- ✅ Booking UID (for tracing)
- ✅ Signature verification result
- ✅ Email queue status
- ✅ Processing duration

**What NOT to Log**:
- ❌ Webhook secret
- ❌ Full request body (may contain PII)
- ❌ Email addresses in plaintext
- ❌ Signature values

**Example Log Output**:
```
[INFO] Webhook received: BOOKING_CREATED (uid: abc123)
[INFO] Signature verified successfully
[INFO] Email queued for booking: abc123
[INFO] Webhook processed in 234ms
```

---

## 🚀 Next Steps

After Phase 3 is complete, you'll be ready for:

### Phase 4: Frontend Integration (2-3 hours)
- Replace contact form with Cal.com inline embed
- Update CSP headers to allow Cal.com domains
- Add responsive styling for embed
- Test booking flow end-to-end

### Phase 5: Testing (1-2 hours)
- Create E2E tests for booking flow
- Add accessibility tests for embed
- Visual regression tests for contact page
- Manual testing on mobile/tablet/desktop

### Phase 6: Documentation (30 minutes)
- Update README.md with Cal.com feature
- Update ARCHITECTURE.md with webhook flow
- Create troubleshooting playbook
- Update CHANGELOG.md

### Phase 7: Production Deployment (30 minutes)
- Deploy to preview environment
- Test with real bookings
- Monitor for 24 hours
- Deploy to production
- Announce feature to customers

---

## 📚 Related Documentation

- **Phase 2 Guide**: [`docs/planning/CAL-COM-PHASE-2-DEPLOYMENT.md`](CAL-COM-PHASE-2-DEPLOYMENT.md)
- **Integration Analysis**: [`docs/planning/CAL-COM-INTEGRATION-ANALYSIS.md`](CAL-COM-INTEGRATION-ANALYSIS.md)
- **API Strategy**: [`docs/planning/CAL-COM-API.md`](CAL-COM-API.md)
- **Secrets Setup**: [`docs/planning/CAL-COM-SECRETS-SETUP.md`](CAL-COM-SECRETS-SETUP.md)
- **Implementation Checklist**: [`CALCOM-IMPLEMENTATION-CHECKLIST.md`](../../CALCOM-IMPLEMENTATION-CHECKLIST.md)

---

## 🆘 Support Resources

- **Cal.com Webhook Docs**: https://cal.com/docs/api-reference/v2/webhooks
- **Cal.com API Reference**: https://cal.com/docs/api-reference
- **Cloudflare Workers Docs**: https://developers.cloudflare.com/workers/
- **SendGrid API Docs**: https://docs.sendgrid.com/api-reference/mail-send/mail-send

---

**Ready to implement?** Start with Step 1: Create Webhook Endpoint 🚀
