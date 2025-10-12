# Playbook: Cloudflare Queues + Workers for Email

This playbook sets up a queue-based email pipeline for the contact form, aligned with our Cloudflare-only policy.

## Overview

- Producer: Pages Function at `functions/api/contact.ts` (binding `SEND_EMAIL`)
- Consumer: Worker at `workers/queue-consumer` (binding `SEND_EMAIL`)
- Email: SendGrid via API (secrets on the consumer and/or Pages)

## 1) Create Queue

```bash
wrangler queues create send-email
```

## 2) Bind Producer (Pages)

In Cloudflare Pages → Project → Settings → Functions → Queues → Add producer

- Queue: `send-email`
- Binding name: `SEND_EMAIL`

## 3) Deploy Consumer Worker

```bash
cd workers/queue-consumer
wrangler secret put SENDGRID_API_KEY
wrangler secret put SENDGRID_FROM
wrangler secret put SENDGRID_TO
wrangler deploy
```

## 4) Test Locally

```bash
pnpm dev
# Submit the contact form at /contact
```

If producer is bound, the API responds with `{ status: "enqueued" }`. Otherwise, it tries direct SendGrid send if vars are set on Pages.

## 5) Monitor

```bash
wrangler tail --name litecky-queue-consumer
```

## Notes

- Keep secrets in Cloudflare; never commit keys.
- For preview environments, use test SendGrid keys.
