# Academic Editor - Complete Cloudflare Deployment Setup

## Updated Project Structure (Monorepo)

```
academic-editor/
├── apps/
│   └── site/                        # Astro site (Pages)
│       ├── src/
│       │   ├── components/
│       │   ├── layouts/
│       │   ├── pages/
│       │   ├── scripts/
│       │   └── styles/
│       ├── functions/               # Pages Functions (SSR handlers)
│       │   ├── api/
│       │   │   ├── submit-quote.ts
│       │   │   ├── upload-document.ts
│       │   │   └── verify-turnstile.ts
│       │   └── _middleware.ts
│       ├── public/
│       ├── .dev.vars
│       ├── .env.example
│       ├── astro.config.mjs
│       ├── package.json
│       ├── tsconfig.json
│       └── wrangler.toml
├── workers/
│   ├── cron/                       # Scheduled Workers
│   │   ├── src/
│   │   │   └── worker.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── wrangler.toml
│   └── queue-consumer/             # Queue consumers
│       ├── src/
│       │   └── worker.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── wrangler.toml
├── packages/
│   └── shared/                     # Shared utilities
│       ├── src/
│       │   ├── types.ts
│       │   └── utils.ts
│       └── package.json
├── .github/
│   └── workflows/
│       ├── deploy-site.yml
│       ├── deploy-workers.yml
│       └── test-a11y.yml
├── .gitignore
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

## Root Configuration Files

### `pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'workers/*'
  - 'packages/*'
```

### Root `package.json`

```json
{
  "name": "academic-editor-monorepo",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@10.16.0",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=10.16.0"
  },
  "scripts": {
    "dev": "pnpm --filter @ae/site dev",
    "dev:all": "pnpm --parallel dev",
    "build": "pnpm --filter '*' build",
    "build:site": "pnpm --filter @ae/site build",
    "preview": "pnpm --filter @ae/site preview",
    "deploy:site": "pnpm --filter @ae/site deploy",
    "deploy:workers": "pnpm --filter '@ae/worker-*' deploy",
    "test": "pnpm --filter '*' test",
    "test:a11y": "pnpm --filter @ae/site test:a11y",
    "lint": "pnpm --filter '*' lint",
    "format": "prettier --write .",
    "clean": "pnpm --filter '*' clean && rm -rf node_modules"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20250920.0",
    "@types/node": "^22.0.0",
    "prettier": "^3.3.0",
    "typescript": "^5.6.0",
    "wrangler": "^3.78.0"
  }
}
```

### `.gitignore`

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
.astro/
*.log

# Environment files
.env
.env.*
!.env.example
.dev.vars
!.dev.vars.example

# Cloudflare
.wrangler/
.mf/

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Temp files
*.tmp
*.temp
```

## Astro Site Configuration

### `apps/site/package.json`

```json
{
  "name": "@ae/site",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "dev:cf": "wrangler pages dev -- pnpm astro dev",
    "build": "astro build",
    "preview": "wrangler pages dev ./dist",
    "deploy": "pnpm build && wrangler pages deploy ./dist --project-name=academic-editor",
    "deploy:preview": "pnpm build && wrangler pages deploy ./dist --project-name=academic-editor --branch=preview",
    "test:a11y": "pa11y-ci --sitemap http://localhost:4321/sitemap.xml",
    "test:lighthouse": "lighthouse http://localhost:4321 --view --budget-path=./lighthouse-budget.json",
    "lint": "astro check && tsc --noEmit",
    "clean": "rm -rf dist .astro node_modules"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^11.0.0",
    "@astrojs/sitemap": "^3.2.0",
    "@astrojs/svelte": "^7.0.0",
    "@fontsource-variable/inter": "^5.0.0",
    "@fontsource/lora": "^5.0.0",
    "astro": "^5.13.0",
    "svelte": "^5.39.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20250920.0",
    "@types/node": "^22.0.0",
    "autoprefixer": "^10.4.20",
    "lighthouse": "^12.2.0",
    "pa11y-ci": "^3.1.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^4.1.0",
    "typescript": "^5.6.0",
    "wrangler": "^3.78.0"
  }
}
```

### `apps/site/astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://academic-editor.com',
  output: 'hybrid', // SSR for dynamic routes, static for others
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      configPath: 'wrangler.toml',
    },
    imageService: 'passthrough',
    routes: {
      strategy: 'include',
      include: ['/api/*', '/contact', '/upload/*'], // SSR routes
    },
  }),
  integrations: [
    svelte(),
    sitemap({
      filter: (page) => !page.includes('/api/'),
    }),
  ],
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'svelte-runtime': ['svelte'],
          },
        },
      },
    },
    ssr: {
      noExternal: ['@fontsource/*'],
    },
  },
  image: {
    domains: [],
    remotePatterns: [],
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport',
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
```

### `apps/site/wrangler.toml`

```toml
name = "academic-editor-site"
compatibility_date = "2025-09-22"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "./dist"

# Environment variables (use dashboard or .dev.vars for secrets)
[vars]
TURNSTILE_SITE_KEY = "0x4AAAAAAAxxxxx"  # Public key - safe to commit
MAX_FILE_SIZE_MB = "10"
ALLOWED_FILE_TYPES = ".doc,.docx,.pdf,.rtf,.txt"

# Bindings for Pages Functions
[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"

[[r2_buckets]]
binding = "DOCUMENTS"
bucket_name = "academic-editor-documents"

[[d1_databases]]
binding = "DB"
database_name = "academic-editor"
database_id = "your-d1-database-id"

[[queues.producers]]
queue = "document-processing"
binding = "DOCUMENT_QUEUE"

[[analytics_engine_datasets]]
binding = "ANALYTICS"

# Development overrides
[env.development]
vars = { ENVIRONMENT = "development" }

[env.preview]
vars = { ENVIRONMENT = "preview" }

[env.production]
vars = { ENVIRONMENT = "production" }
```

### `apps/site/.dev.vars`

```bash
# Secret keys - NEVER commit this file
TURNSTILE_SECRET_KEY=0x4AAAAAAAxxxxx_secret
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
RESEND_API_KEY=re_xxxxx
WEBHOOK_SECRET=whsec_xxxxx

# R2 Signing Keys
R2_ACCESS_KEY_ID=xxxxx
R2_SECRET_ACCESS_KEY=xxxxx

# Database
DATABASE_URL=your-d1-connection-string

# Analytics
PUBLIC_GA4_ID=G-XXXXXXXXXX
```

## Pages Functions (Server-side)

### `apps/site/functions/_middleware.ts`

```typescript
import type { PagesFunction, EventContext } from '@cloudflare/workers-types';

interface Env {
  TURNSTILE_SECRET_KEY: string;
  ANALYTICS: AnalyticsEngineDataset;
  ENVIRONMENT: string;
}

// Rate limiting middleware
const rateLimiter = new Map<string, number[]>();

function isRateLimited(ip: string, limit = 10, window = 60000): boolean {
  const now = Date.now();
  const requests = rateLimiter.get(ip) || [];
  const recentRequests = requests.filter((time) => now - time < window);

  if (recentRequests.length >= limit) {
    return true;
  }

  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);
  return false;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Add security headers
  const response = await next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // HSTS (only in production)
  if (env.ENVIRONMENT === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Rate limiting for API routes
  if (url.pathname.startsWith('/api/')) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response('Too many requests', { status: 429 });
    }
  }

  // Log to Analytics Engine
  if (env.ANALYTICS) {
    env.ANALYTICS.writeDataPoint({
      blobs: [url.pathname],
      doubles: [Date.now()],
      indexes: [request.method],
    });
  }

  return response;
};
```

### `apps/site/functions/api/submit-quote.ts`

```typescript
import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  TURNSTILE_SECRET_KEY: string;
  DOCUMENT_QUEUE: Queue;
  DB: D1Database;
  RESEND_API_KEY: string;
}

interface QuoteRequest {
  name: string;
  email: string;
  serviceType: string;
  deadline: string;
  message?: string;
  documentId?: string;
  turnstileToken: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body: QuoteRequest = await request.json();

    // Verify Turnstile token
    const turnstileVerified = await verifyTurnstile(body.turnstileToken, env.TURNSTILE_SECRET_KEY);

    if (!turnstileVerified) {
      return Response.json({ error: 'Security verification failed' }, { status: 400 });
    }

    // Validate input
    if (!body.name || !body.email || !body.serviceType) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Store quote request in D1
    const quote = await env.DB.prepare(
      `
      INSERT INTO quotes (name, email, service_type, deadline, message, document_id, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', datetime('now'))
      RETURNING id
    `
    )
      .bind(
        body.name,
        body.email,
        body.serviceType,
        body.deadline,
        body.message || null,
        body.documentId || null
      )
      .first();

    // Queue email notification
    await env.DOCUMENT_QUEUE.send({
      type: 'quote-notification',
      quoteId: quote.id,
      email: body.email,
      name: body.name,
    });

    // Send confirmation email via Resend
    await sendEmail(env.RESEND_API_KEY, {
      to: body.email,
      subject: 'Quote Request Received - Academic Editor',
      html: generateQuoteEmailHtml(body.name, quote.id),
    });

    return Response.json({
      success: true,
      quoteId: quote.id,
      message: "Your quote request has been received. We'll respond within 24 hours.",
    });
  } catch (error) {
    console.error('Quote submission error:', error);
    return Response.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
};

async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token }),
  });

  const data = await response.json();
  return data.success;
}

async function sendEmail(apiKey: string, params: any): Promise<void> {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Academic Editor <noreply@academic-editor.com>',
      ...params,
    }),
  });
}

function generateQuoteEmailHtml(name: string, quoteId: string): string {
  return `
    <h2>Thank you for your quote request, ${name}!</h2>
    <p>We've received your request (ID: ${quoteId}) and will review it shortly.</p>
    <p>You can expect a detailed quote within 24 hours.</p>
    <p>Best regards,<br>Academic Editor Team</p>
  `;
}
```

### `apps/site/functions/api/upload-document.ts`

```typescript
import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  DOCUMENTS: R2Bucket;
  DB: D1Database;
  DOCUMENT_QUEUE: Queue;
  MAX_FILE_SIZE_MB: string;
  ALLOWED_FILE_TYPES: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const file = formData.get('document') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    const maxSize = parseInt(env.MAX_FILE_SIZE_MB) * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json(
        { error: `File exceeds maximum size of ${env.MAX_FILE_SIZE_MB}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = env.ALLOWED_FILE_TYPES.split(',');
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      return Response.json(
        { error: `File type not allowed. Accepted: ${env.ALLOWED_FILE_TYPES}` },
        { status: 400 }
      );
    }

    // Generate secure filename
    const timestamp = Date.now();
    const randomId = crypto.randomUUID();
    const secureFilename = `${userId}/${timestamp}-${randomId}${fileExt}`;

    // Upload to R2
    await env.DOCUMENTS.put(secureFilename, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        originalName: file.name,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Store metadata in D1
    const document = await env.DB.prepare(
      `
      INSERT INTO documents (user_id, filename, original_name, size, mime_type, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'uploaded', datetime('now'))
      RETURNING id
    `
    )
      .bind(userId, secureFilename, file.name, file.size, file.type)
      .first();

    // Queue for virus scanning (optional)
    await env.DOCUMENT_QUEUE.send({
      type: 'scan-document',
      documentId: document.id,
      filename: secureFilename,
    });

    return Response.json({
      success: true,
      documentId: document.id,
      message: 'Document uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Failed to upload document' }, { status: 500 });
  }
};

// Generate signed URL for secure download
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const documentId = url.searchParams.get('id');

  if (!documentId) {
    return Response.json({ error: 'Document ID required' }, { status: 400 });
  }

  try {
    // Get document from DB
    const doc = await env.DB.prepare('SELECT * FROM documents WHERE id = ?')
      .bind(documentId)
      .first();

    if (!doc) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }

    // Generate signed URL (valid for 1 hour)
    const signedUrl = await env.DOCUMENTS.createSignedUrl(doc.filename, {
      expiresIn: 3600,
    });

    return Response.json({
      url: signedUrl,
      expiresIn: 3600,
      filename: doc.original_name,
    });
  } catch (error) {
    console.error('Download error:', error);
    return Response.json({ error: 'Failed to generate download link' }, { status: 500 });
  }
};
```

## Worker Configurations

### `workers/cron/package.json`

```json
{
  "name": "@ae/worker-cron",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "test:scheduled": "wrangler dev --test-scheduled",
    "tail": "wrangler tail",
    "types": "wrangler types"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20250920.0",
    "typescript": "^5.6.0",
    "wrangler": "^3.78.0"
  }
}
```

### `workers/cron/wrangler.toml`

```toml
name = "ae-cron"
main = "src/worker.ts"
compatibility_date = "2025-09-22"
compatibility_flags = ["nodejs_compat"]

[triggers]
crons = [
  "0 10 * * *",      # Daily at 10:00 UTC - Send follow-ups
  "0 */6 * * *",     # Every 6 hours - Clean up expired documents
  "0 0 * * 1",       # Weekly on Monday - Generate reports
]

[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"

[[d1_databases]]
binding = "DB"
database_name = "academic-editor"
database_id = "your-d1-database-id"

[[r2_buckets]]
binding = "DOCUMENTS"
bucket_name = "academic-editor-documents"

[[queues.producers]]
queue = "document-processing"
binding = "DOCUMENT_QUEUE"

[vars]
RESEND_API_KEY = "re_xxxxx"
ADMIN_EMAIL = "admin@academic-editor.com"
```

### `workers/cron/src/worker.ts`

```typescript
export interface Env {
  DB: D1Database;
  DOCUMENTS: R2Bucket;
  CACHE: KVNamespace;
  DOCUMENT_QUEUE: Queue;
  RESEND_API_KEY: string;
  ADMIN_EMAIL: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const cronTime = new Date(event.scheduledTime).toISOString();
    console.log(`Cron triggered at ${cronTime}, cron: ${event.cron}`);

    switch (event.cron) {
      case '0 10 * * *':
        await ctx.waitUntil(sendDailyFollowUps(env));
        break;
      case '0 */6 * * *':
        await ctx.waitUntil(cleanupExpiredDocuments(env));
        break;
      case '0 0 * * 1':
        await ctx.waitUntil(generateWeeklyReport(env));
        break;
    }
  },
};

async function sendDailyFollowUps(env: Env): Promise<void> {
  // Get quotes that need follow-up (3 days old, no response)
  const quotes = await env.DB.prepare(
    `
    SELECT * FROM quotes 
    WHERE status = 'pending' 
    AND datetime(created_at) < datetime('now', '-3 days')
    AND follow_up_sent = 0
  `
  ).all();

  for (const quote of quotes.results) {
    // Queue follow-up email
    await env.DOCUMENT_QUEUE.send({
      type: 'follow-up-email',
      quoteId: quote.id,
      email: quote.email,
      name: quote.name,
    });

    // Mark as followed up
    await env.DB.prepare('UPDATE quotes SET follow_up_sent = 1 WHERE id = ?').bind(quote.id).run();
  }

  console.log(`Sent ${quotes.results.length} follow-up emails`);
}

async function cleanupExpiredDocuments(env: Env): Promise<void> {
  // Delete documents older than 30 days that aren't associated with active projects
  const expiredDocs = await env.DB.prepare(
    `
    SELECT * FROM documents 
    WHERE status = 'uploaded' 
    AND datetime(created_at) < datetime('now', '-30 days')
    AND project_id IS NULL
  `
  ).all();

  for (const doc of expiredDocs.results) {
    // Delete from R2
    await env.DOCUMENTS.delete(doc.filename);

    // Delete from DB
    await env.DB.prepare('DELETE FROM documents WHERE id = ?').bind(doc.id).run();
  }

  console.log(`Cleaned up ${expiredDocs.results.length} expired documents`);
}

async function generateWeeklyReport(env: Env): Promise<void> {
  // Generate stats for the past week
  const stats = await env.DB.prepare(
    `
    SELECT 
      COUNT(CASE WHEN datetime(created_at) >= datetime('now', '-7 days') THEN 1 END) as new_quotes,
      COUNT(CASE WHEN status = 'completed' AND datetime(updated_at) >= datetime('now', '-7 days') THEN 1 END) as completed_projects,
      AVG(CASE 
        WHEN status = 'completed' 
        THEN julianday(updated_at) - julianday(created_at) 
      END) as avg_turnaround_days
    FROM quotes
  `
  ).first();

  // Send report email
  const reportHtml = `
    <h2>Weekly Report - Academic Editor</h2>
    <p>Week ending: ${new Date().toLocaleDateString()}</p>
    <ul>
      <li>New quotes: ${stats.new_quotes}</li>
      <li>Completed projects: ${stats.completed_projects}</li>
      <li>Average turnaround: ${Math.round(stats.avg_turnaround_days * 10) / 10} days</li>
    </ul>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Academic Editor <noreply@academic-editor.com>',
      to: env.ADMIN_EMAIL,
      subject: 'Weekly Report - Academic Editor',
      html: reportHtml,
    }),
  });

  console.log('Weekly report sent');
}
```

### `workers/queue-consumer/src/worker.ts`

```typescript
export interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
}

interface QueueMessage {
  type: 'quote-notification' | 'follow-up-email' | 'scan-document';
  [key: string]: any;
}

export default {
  async queue(batch: MessageBatch<QueueMessage>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      try {
        await processMessage(message.body, env);
        message.ack();
      } catch (error) {
        console.error(`Failed to process message: ${error}`);
        message.retry();
      }
    }
  },
};

async function processMessage(message: QueueMessage, env: Env): Promise<void> {
  switch (message.type) {
    case 'quote-notification':
      await sendQuoteNotification(message, env);
      break;
    case 'follow-up-email':
      await sendFollowUpEmail(message, env);
      break;
    case 'scan-document':
      await scanDocument(message, env);
      break;
    default:
      console.warn(`Unknown message type: ${message.type}`);
  }
}

async function sendQuoteNotification(message: any, env: Env): Promise<void> {
  // Implementation for quote notifications
  console.log('Sending quote notification:', message);
}

async function sendFollowUpEmail(message: any, env: Env): Promise<void> {
  // Implementation for follow-up emails
  console.log('Sending follow-up email:', message);
}

async function scanDocument(message: any, env: Env): Promise<void> {
  // Implementation for document scanning (virus scan, etc.)
  console.log('Scanning document:', message);
}
```

## GitHub Actions Workflows

### `.github/workflows/deploy-site.yml`

```yaml
name: Deploy Site to Cloudflare Pages

on:
  push:
    branches: [main]
    paths:
      - 'apps/site/**'
      - 'packages/shared/**'
      - '.github/workflows/deploy-site.yml'
  pull_request:
    branches: [main]
    paths:
      - 'apps/site/**'
  workflow_dispatch:

permissions:
  contents: read
  deployments: write
  pull-requests: write

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10.16.0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm --filter @ae/site lint

      - name: Build site
        run: pnpm --filter @ae/site build

      - name: Run Lighthouse CI
        run: |
          pnpm --filter @ae/site preview &
          sleep 5
          pnpm --filter @ae/site test:lighthouse
        continue-on-error: true

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10.16.0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build site
        run: pnpm --filter @ae/site build
        env:
          PUBLIC_TURNSTILE_SITE_KEY: ${{ vars.TURNSTILE_SITE_KEY }}

      - name: Deploy to Cloudflare Pages
        id: deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy apps/site/dist --project-name=academic-editor --branch=main

      - name: Comment deployment URL
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Deployed to: ${{ steps.deploy.outputs.deployment-url }}`
            })

      - name: Run post-deploy tests
        run: |
          sleep 10
          curl -f ${{ steps.deploy.outputs.deployment-url }} || exit 1
```

### `.github/workflows/deploy-workers.yml`

```yaml
name: Deploy Workers

on:
  push:
    branches: [main]
    paths:
      - 'workers/**'
      - '.github/workflows/deploy-workers.yml'
  workflow_dispatch:

permissions:
  contents: read

jobs:
  deploy-cron:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: workers/cron

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10.16.0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        working-directory: .

      - name: Deploy Cron Worker
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: workers/cron
          command: deploy

      - name: Test cron triggers
        run: pnpm test:scheduled
        continue-on-error: true

  deploy-queue-consumer:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: workers/queue-consumer

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10.16.0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        working-directory: .

      - name: Deploy Queue Consumer
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: workers/queue-consumer
          command: deploy
```

### `.github/workflows/test-a11y.yml`

```yaml
name: Accessibility Tests

on:
  pull_request:
    paths:
      - 'apps/site/**'
  schedule:
    - cron: '0 9 * * 1' # Weekly on Monday
  workflow_dispatch:

permissions:
  contents: read
  pull-requests: write

jobs:
  a11y:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10.16.0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build and start site
        run: |
          pnpm --filter @ae/site build
          pnpm --filter @ae/site preview &
          sleep 10

      - name: Run Pa11y tests
        run: pnpm --filter @ae/site test:a11y
        continue-on-error: true

      - name: Upload results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: accessibility-report
          path: apps/site/.pa11yci/
```

## Database Schema (D1)

### `workers/schema.sql`

```sql
-- Quotes table
CREATE TABLE quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service_type TEXT NOT NULL,
  deadline DATE,
  message TEXT,
  document_id INTEGER,
  status TEXT DEFAULT 'pending',
  follow_up_sent INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  size INTEGER NOT NULL,
  mime_type TEXT,
  status TEXT DEFAULT 'uploaded',
  project_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_id INTEGER,
  status TEXT DEFAULT 'active',
  started_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quote_id) REFERENCES quotes(id)
);

-- Indexes
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created ON quotes(created_at);
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_projects_status ON projects(status);
```

## Turnstile Integration (Client-side)

### `apps/site/src/components/ContactForm.svelte`

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  let turnstileToken = '';
  let turnstileWidgetId: string | null = null;

  // Your public site key from Cloudflare Dashboard
  const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

  onMount(() => {
    // Load Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      // Initialize Turnstile
      if (window.turnstile) {
        turnstileWidgetId = window.turnstile.render('#turnstile-container', {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            turnstileToken = token;
          },
          'error-callback': () => {
            console.error('Turnstile error');
          },
          theme: 'light',
          size: 'normal',
        });
      }
    };

    return () => {
      if (window.turnstile && turnstileWidgetId) {
        window.turnstile.remove(turnstileWidgetId);
      }
    };
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!turnstileToken) {
      alert('Please complete the security check');
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    const response = await fetch('/api/submit-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        turnstileToken,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      alert(`Success! Your quote ID is: ${result.quoteId}`);
    } else {
      alert('An error occurred. Please try again.');
    }
  }
</script>

<form on:submit={handleSubmit} class="quote-form">
  <!-- Form fields here -->

  <!-- Turnstile widget -->
  <div id="turnstile-container" class="turnstile-wrapper"></div>

  <button type="submit" class="btn btn-primary">
    Get Your Free Quote
  </button>
</form>

<style>
  .turnstile-wrapper {
    margin: 1.5rem 0;
  }
</style>
```

## Setup Instructions

```bash
# 1. Clone and install
git clone <your-repo>
cd academic-editor
pnpm install

# 2. Set up Cloudflare resources
wrangler d1 create academic-editor
wrangler r2 bucket create academic-editor-documents
wrangler kv:namespace create CACHE
wrangler queues create document-processing

# 3. Configure environment
cp apps/site/.env.example apps/site/.env
cp apps/site/.dev.vars.example apps/site/.dev.vars
# Edit with your actual values

# 4. Initialize database
wrangler d1 execute academic-editor --file=workers/schema.sql

# 5. Development
pnpm dev              # Run site locally
pnpm dev:all          # Run everything in parallel
pnpm test:scheduled   # Test cron jobs

# 6. Deploy
pnpm deploy:site      # Deploy to Pages
pnpm deploy:workers   # Deploy Workers
```

## Production Checklist

- [ ] Set up Cloudflare account and obtain API tokens
- [ ] Create D1 database and run schema
- [ ] Create R2 bucket for document storage
- [ ] Create KV namespace for caching
- [ ] Set up Queues for async processing
- [ ] Configure Turnstile and get site/secret keys
- [ ] Set up Resend account for transactional emails
- [ ] Configure GitHub secrets for CI/CD
- [ ] Enable Web Analytics in Pages dashboard
- [ ] Set up custom domain and SSL
- [ ] Configure firewall rules and rate limiting
- [ ] Set up monitoring and alerts
- [ ] Test backup and recovery procedures
