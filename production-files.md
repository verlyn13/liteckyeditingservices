# Litecky Editing Services - Production Files

## Part A: Decap OAuth Proxy Worker

### Directory Structure
```
workers/decap-oauth/
├── package.json
├── wrangler.toml
├── tsconfig.json
└── src/
    └── index.ts
```

### `workers/decap-oauth/package.json`
```json
{
  "name": "litecky-decap-oauth",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "tail": "wrangler tail"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20250922.0",
    "typescript": "^5.6.0",
    "wrangler": "^3.78.0"
  }
}
```

### `workers/decap-oauth/wrangler.toml`
```toml
name = "litecky-decap-oauth"
main = "src/index.ts"
compatibility_date = "2025-09-22"
compatibility_flags = ["nodejs_compat"]

# Custom domain for the OAuth proxy
routes = [
  { pattern = "cms-auth.liteckyeditingservices.com", custom_domain = true }
]

# Optional: Enable during testing
# workers_dev = true

[vars]
ENVIRONMENT = "production"
```

### `workers/decap-oauth/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "moduleResolution": "node",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### `workers/decap-oauth/src/index.ts`
```typescript
import { randomBytes } from "node:crypto";

type Env = {
  GITHUB_OAUTH_ID: string;
  GITHUB_OAUTH_SECRET: string;
};

const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN = "https://github.com/login/oauth/access_token";

// Hardcoded origin for liteckyeditingservices.com
function getSiteOrigin(): string {
  return "https://liteckyeditingservices.com";
}

function htmlPostMessage(token: string, origin: string): string {
  // HTML that posts the token back to Decap CMS and closes the popup
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Authenticating...</title>
</head>
<body>
  <script>
    (function(){
      try {
        const token = ${JSON.stringify(token)};
        const target = ${JSON.stringify(origin)};
        // Post token back to the CMS opener window
        if (window.opener && token) {
          window.opener.postMessage({ token: token }, target);
        }
      } catch (e) {
        console.error('Auth error:', e);
      }
      // Close this popup
      setTimeout(() => window.close(), 100);
    })();
  </script>
  <p>Authentication successful! This window should close automatically.</p>
</body>
</html>`;
}

function setStateCookie(state: string, host: string): string {
  // 10 minute state cookie for CSRF protection
  return `decap_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/; Domain=${host}`;
}

function getCookie(request: Request, name: string): string | undefined {
  const cookie = request.headers.get("cookie") || "";
  const found = cookie
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith(name + "="));
  return found?.split("=")[1];
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === "/") {
      return new Response("Litecky Decap OAuth Proxy - Operational", {
        headers: { "Content-Type": "text/plain" }
      });
    }

    // Start OAuth flow
    if (url.pathname === "/auth") {
      const state = randomBytes(16).toString("hex");
      const redirectUri = `https://${url.hostname}/callback`;
      
      // Use "repo,user" for private repos or "public_repo,user" for public repos
      const scope = "repo,user";

      const authUrl = new URL(GITHUB_AUTHORIZE);
      authUrl.searchParams.set("client_id", env.GITHUB_OAUTH_ID);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("scope", scope);
      authUrl.searchParams.set("state", state);

      return new Response(null, {
        status: 302,
        headers: {
          "Location": authUrl.toString(),
          "Set-Cookie": setStateCookie(state, url.hostname),
          "Cache-Control": "no-store"
        }
      });
    }

    // Handle OAuth callback
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const expectedState = getCookie(request, "decap_oauth_state");

      // Validate state for CSRF protection
      if (!code || !state || !expectedState || state !== expectedState) {
        return new Response("Invalid OAuth state", { 
          status: 400,
          headers: { "Content-Type": "text/plain" }
        });
      }

      // Exchange code for token
      const tokenResponse = await fetch(GITHUB_TOKEN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          client_id: env.GITHUB_OAUTH_ID,
          client_secret: env.GITHUB_OAUTH_SECRET,
          code,
          redirect_uri: `https://${url.hostname}/callback`
        })
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Token exchange failed:", errorText);
        return new Response(`Authentication failed: ${errorText}`, { 
          status: 502,
          headers: { "Content-Type": "text/plain" }
        });
      }

      const tokenData = await tokenResponse.json() as { 
        access_token?: string; 
        error?: string;
        error_description?: string;
      };

      if (!tokenData.access_token) {
        const error = tokenData.error_description || tokenData.error || "Unknown error";
        console.error("No access token:", error);
        return new Response(`Authentication failed: ${error}`, { 
          status: 502,
          headers: { "Content-Type": "text/plain" }
        });
      }

      // Return HTML that posts token back to Decap CMS
      const origin = getSiteOrigin();
      const html = htmlPostMessage(tokenData.access_token, origin);

      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          // Clear the state cookie
          "Set-Cookie": `decap_oauth_state=; Max-Age=0; Path=/; Domain=${url.hostname}`
        }
      });
    }

    // 404 for all other paths
    return new Response("Not found", { 
      status: 404,
      headers: { "Content-Type": "text/plain" }
    });
  }
};
```

### Deployment Commands
```bash
# Navigate to worker directory
cd workers/decap-oauth

# Install dependencies
pnpm install

# Set secrets (you'll be prompted to enter values)
wrangler secret put GITHUB_OAUTH_ID
# Paste your GitHub OAuth App Client ID

wrangler secret put GITHUB_OAUTH_SECRET
# Paste your GitHub OAuth App Client Secret

# Deploy to Cloudflare
wrangler deploy

# Verify it's working
curl https://cms-auth.liteckyeditingservices.com/
# Should return: "Litecky Decap OAuth Proxy - Operational"
```

## Part B: Decap CMS Files

### `apps/site/public/admin/index.html`
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>Litecky Editing Services - Content Manager</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <style>
    /* Custom branding for Litecky */
    .css-1gj57a0-LoginPage {
      background: linear-gradient(135deg, #192A51 0%, #2C4170 100%);
    }
    .css-mnekmp-AppHeaderContent {
      background: #192A51;
    }
  </style>
</head>
<body>
  <!-- Load Decap CMS -->
  <script src="https://unpkg.com/decap-cms@^3.1.10/dist/decap-cms.js"></script>
  
  <!-- Initialize with custom settings -->
  <script>
    if (window.CMS) {
      // Optional: Register custom preview styles
      CMS.registerPreviewStyle('/css/cms-preview.css');
    }
  </script>
</body>
</html>
```

### `apps/site/public/admin/config.yml`
```yaml
# Site configuration
site_url: "https://liteckyeditingservices.com"
display_url: "https://liteckyeditingservices.com"
logo_url: "/images/logo.svg"

# GitHub backend with OAuth proxy
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/litecky-editing  # REPLACE WITH YOUR REPO
  branch: main
  base_url: "https://cms-auth.liteckyeditingservices.com"
  # auth_endpoint and callback are implicit at /auth and /callback
  commit_messages:
    create: 'Content: Create {{collection}} "{{slug}}"'
    update: 'Content: Update {{collection}} "{{slug}}"'
    delete: 'Content: Delete {{collection}} "{{slug}}"'
    uploadMedia: 'Media: Upload "{{path}}"'
    deleteMedia: 'Media: Delete "{{path}}"'

# Media storage
media_folder: "apps/site/public/images/uploads"
public_folder: "/images/uploads"

# Optional: Use editorial workflow for PR-based review
# publish_mode: editorial_workflow

# Content collections
collections:
  # Main website pages
  - name: "pages"
    label: "📄 Website Pages"
    label_singular: "Page"
    folder: "apps/site/src/content/pages"
    create: true
    delete: false  # Prevent accidental deletion of main pages
    extension: "md"
    format: "frontmatter"
    slug: "{{slug}}"
    preview_path: "/{{slug}}"
    sortable_fields: ["title", "updated", "order"]
    summary: "{{title}} ({{order}})"
    fields:
      - {label: "Title", name: "title", widget: "string", required: true}
      - {label: "Navigation Title", name: "navTitle", widget: "string", required: false, hint: "Short title for navigation menu"}
      - {label: "Description", name: "description", widget: "text", required: true, hint: "Used for page previews and SEO"}
      - {label: "Hero Title", name: "heroTitle", widget: "string", required: false, hint: "Large title at top of page"}
      - {label: "Hero Subtitle", name: "heroSubtitle", widget: "text", required: false}
      - {label: "SEO Title", name: "seoTitle", widget: "string", required: false, hint: "For search results (60 chars max)"}
      - {label: "SEO Description", name: "seoDescription", widget: "text", required: false, pattern: ['.{50,160}', "Must be 50-160 characters"]}
      - {label: "Updated Date", name: "updated", widget: "datetime", format: "YYYY-MM-DD", date_format: true, time_format: false}
      - {label: "Order", name: "order", widget: "number", default: 0, hint: "Lower numbers appear first in navigation"}
      - {label: "Draft", name: "draft", widget: "boolean", default: false}
      - {label: "Content", name: "body", widget: "markdown", required: true}

  # Client testimonials
  - name: "testimonials"
    label: "⭐ Testimonials"
    label_singular: "Testimonial"
    folder: "apps/site/src/content/testimonials"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{year}}-{{month}}-{{day}}-{{fields.slug}}"
    identifier_field: "author"
    summary: "{{author}} - {{institution}} ({{featured}})"
    sortable_fields: ["date", "author", "featured"]
    fields:
      - {label: "Author Name", name: "author", widget: "string", required: true}
      - {label: "Slug", name: "slug", widget: "string", required: true, pattern: ['^[a-z0-9]+(?:-[a-z0-9]+)*$', "Must be lowercase with hyphens"]}
      - {label: "Degree/Credentials", name: "credentials", widget: "string", required: true, hint: "e.g., PhD in Psychology, MA in English"}
      - {label: "University/Institution", name: "institution", widget: "string", required: true}
      - label: "Academic Field"
        name: "field"
        widget: "select"
        options: 
          - {label: "Psychology & Counseling", value: "psychology"}
          - {label: "Social Sciences", value: "social-sciences"}
          - {label: "STEM", value: "stem"}
          - {label: "Medical & Health", value: "medical"}
          - {label: "Humanities", value: "humanities"}
          - {label: "Business", value: "business"}
          - {label: "Education", value: "education"}
          - {label: "Other", value: "other"}
        default: "psychology"
      - {label: "Service Used", name: "service", widget: "select", options: ["Dissertation Editing", "Thesis Editing", "Journal Article", "Formatting", "Comprehensive Package"]}
      - {label: "Date", name: "date", widget: "datetime", format: "YYYY-MM-DD", date_format: true, time_format: false}
      - {label: "Featured on Homepage", name: "featured", widget: "boolean", default: false, hint: "Show in homepage testimonial section"}
      - {label: "Short Quote", name: "quote", widget: "text", required: true, hint: "1-2 sentences for homepage display"}
      - {label: "Full Testimonial", name: "body", widget: "markdown", required: false, hint: "Extended testimonial for testimonials page"}

  # FAQs
  - name: "faqs"
    label: "❓ FAQs"
    label_singular: "FAQ"
    folder: "apps/site/src/content/faqs"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{fields.category}}-{{fields.slug}}"
    identifier_field: "question"
    summary: "{{category}}: {{question}}"
    sortable_fields: ["category", "order", "featured"]
    fields:
      - {label: "Question", name: "question", widget: "string", required: true}
      - {label: "Slug", name: "slug", widget: "string", required: true, pattern: ['^[a-z0-9]+(?:-[a-z0-9]+)*$', "Must be lowercase with hyphens"]}
      - label: "Category"
        name: "category"
        widget: "select"
        options: 
          - {label: "Pricing & Payment", value: "pricing"}
          - {label: "Process & Timeline", value: "process"}
          - {label: "Services", value: "services"}
          - {label: "Formatting & Style", value: "formatting"}
          - {label: "Confidentiality", value: "confidentiality"}
          - {label: "Technical", value: "technical"}
          - {label: "General", value: "general"}
        default: "general"
      - {label: "Order", name: "order", widget: "number", default: 0, value_type: "int", min: 0, hint: "Lower numbers appear first"}
      - {label: "Featured", name: "featured", widget: "boolean", default: false, hint: "Show in homepage FAQ section"}
      - {label: "Answer", name: "body", widget: "markdown", required: true}

  # Service features/benefits
  - name: "features"
    label: "✨ Features & Benefits"
    label_singular: "Feature"
    folder: "apps/site/src/content/features"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{fields.category}}-{{fields.slug}}"
    identifier_field: "title"
    summary: "{{category}}: {{title}}"
    sortable_fields: ["category", "order"]
    fields:
      - {label: "Title", name: "title", widget: "string", required: true}
      - {label: "Slug", name: "slug", widget: "string", required: true}
      - {label: "Icon", name: "icon", widget: "string", default: "📝", hint: "Emoji or icon class"}
      - {label: "Short Description", name: "description", widget: "text", required: true, hint: "1-2 sentences"}
      - label: "Category"
        name: "category"
        widget: "select"
        options:
          - {label: "Trust & Security", value: "trust"}
          - {label: "Process & Experience", value: "process"}
          - {label: "Quality & Expertise", value: "quality"}
          - {label: "Support & Communication", value: "support"}
        default: "quality"
      - {label: "Order", name: "order", widget: "number", default: 0, value_type: "int", min: 0}
      - {label: "Show on Homepage", name: "homepage", widget: "boolean", default: false}
      - {label: "Extended Description", name: "body", widget: "markdown", required: false}

  # Settings (singleton files)
  - name: "settings"
    label: "⚙️ Site Settings"
    delete: false
    editor:
      preview: false
    files:
      - name: "general"
        label: "General Settings"
        file: "apps/site/src/data/settings.json"
        fields:
          - {label: "Business Name", name: "businessName", widget: "string", default: "Litecky Editing Services"}
          - {label: "Tagline", name: "tagline", widget: "string", default: "Professional Academic Editing"}
          - {label: "Contact Email", name: "contactEmail", widget: "string"}
          - {label: "Phone", name: "phone", widget: "string", required: false}
          - {label: "Response Time", name: "responseTime", widget: "string", default: "within 24 hours"}
          - label: "Office Hours"
            name: "officeHours"
            widget: "object"
            fields:
              - {label: "Days", name: "days", widget: "string", default: "Monday - Friday"}
              - {label: "Hours", name: "hours", widget: "string", default: "9:00 AM - 5:00 PM"}
              - {label: "Timezone", name: "timezone", widget: "string", default: "EST"}
          - label: "Social Links"
            name: "social"
            widget: "object"
            required: false
            fields:
              - {label: "LinkedIn", name: "linkedin", widget: "string", required: false}
              - {label: "Facebook", name: "facebook", widget: "string", required: false}

      - name: "pricing"
        label: "Pricing Information"
        file: "apps/site/src/data/pricing.json"
        fields:
          - label: "Services"
            name: "services"
            widget: "list"
            fields:
              - {label: "Service Name", name: "name", widget: "string"}
              - {label: "Description", name: "description", widget: "text"}
              - {label: "Starting Price", name: "startingPrice", widget: "string", hint: "e.g., $2,400"}
              - {label: "Price Per Word", name: "pricePerWord", widget: "string", hint: "e.g., $0.03"}
              - {label: "Typical Turnaround", name: "turnaround", widget: "string", hint: "e.g., 5-7 business days"}
              - {label: "Rush Available", name: "rushAvailable", widget: "boolean", default: true}
              - {label: "Sample Edit Available", name: "sampleAvailable", widget: "boolean", default: true}
```

## Part C: Contact Form Function

### `apps/site/functions/api/contact.ts`
```typescript
export interface Env {
  TURNSTILE_SECRET_KEY: string;
  SENDGRID_API_KEY: string;
  SENDGRID_CONTACT_TEMPLATE_ID: string;
  SENDGRID_CONFIRMATION_TEMPLATE_ID: string;
  ADMIN_EMAIL: string;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  // Handle CORS preflight
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    // Validate origin
    const origin = request.headers.get("origin") || "";
    const allowedOrigins = [
      "https://liteckyeditingservices.com",
      "https://www.liteckyeditingservices.com",
      "http://localhost:4321",
      "http://localhost:8788"
    ];
    
    if (!allowedOrigins.includes(origin)) {
      return new Response("Forbidden", { status: 403 });
    }

    // Parse form data
    const contentType = request.headers.get("content-type") || "";
    let formData: any = {};
    
    if (contentType.includes("application/json")) {
      formData = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      for (const [key, value] of form.entries()) {
        formData[key] = value;
      }
    } else {
      const form = await request.formData();
      for (const [key, value] of form.entries()) {
        formData[key] = value;
      }
    }

    // Extract fields
    const name = String(formData.name || "").trim();
    const email = String(formData.email || "").trim();
    const service = String(formData.service || "general").trim();
    const deadline = String(formData.deadline || "").trim();
    const message = String(formData.message || "").trim();
    const wordCount = String(formData.wordCount || "").trim();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Step 1: Verify Turnstile token
    const turnstileToken = String(formData["cf-turnstile-response"] || "").trim();
    
    if (!turnstileToken) {
      return new Response(
        JSON.stringify({ error: "Security verification required" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        })
      }
    );

    const turnstileData = await turnstileResponse.json() as any;
    
    if (!turnstileData.success) {
      console.error("Turnstile validation failed:", turnstileData);
      return new Response(
        JSON.stringify({ error: "Security verification failed. Please try again." }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Step 2: Send notification email to admin
    const adminPayload = {
      personalizations: [{
        to: [{ email: env.ADMIN_EMAIL || "admin@liteckyeditingservices.com" }],
        dynamic_template_data: {
          name,
          email,
          service,
          deadline: deadline || "Not specified",
          wordCount: wordCount || "Not specified",
          message,
          timestamp: new Date().toISOString(),
        }
      }],
      from: {
        email: "noreply@liteckyeditingservices.com",
        name: "Litecky Editing Services"
      },
      reply_to: { email, name },
      template_id: env.SENDGRID_CONTACT_TEMPLATE_ID,
    };

    const adminEmailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(adminPayload)
    });

    if (!adminEmailResponse.ok) {
      const errorText = await adminEmailResponse.text();
      console.error("SendGrid admin email error:", errorText);
      // Don't fail the whole request if admin email fails
    }

    // Step 3: Send confirmation email to client
    if (env.SENDGRID_CONFIRMATION_TEMPLATE_ID) {
      const clientPayload = {
        personalizations: [{
          to: [{ email, name }],
          dynamic_template_data: {
            name,
            service,
            expectedReplyTime: "within 24 hours",
          }
        }],
        from: {
          email: "noreply@liteckyeditingservices.com",
          name: "Litecky Editing Services"
        },
        reply_to: {
          email: env.ADMIN_EMAIL || "admin@liteckyeditingservices.com",
          name: "Litecky Editing Services"
        },
        template_id: env.SENDGRID_CONFIRMATION_TEMPLATE_ID,
      };

      const clientEmailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(clientPayload)
      });

      if (!clientEmailResponse.ok) {
        const errorText = await clientEmailResponse.text();
        console.error("SendGrid confirmation email error:", errorText);
        // Don't fail the whole request if confirmation email fails
      }
    }

    // Step 4: Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Thank you for your inquiry. We'll respond within 24 hours."
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Access-Control-Allow-Origin": origin,
          "Vary": "Origin"
        }
      }
    );

  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({ 
        error: "An error occurred processing your request. Please try again." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
```

## Part D: Environment Variables

### `.dev.vars` (Local Development)
```bash
# Turnstile (get from Cloudflare Dashboard)
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

# SendGrid (get from SendGrid Dashboard)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_CONTACT_TEMPLATE_ID=d-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_CONFIRMATION_TEMPLATE_ID=d-yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy

# Admin
ADMIN_EMAIL=admin@liteckyeditingservices.com

# Environment
ENVIRONMENT=development
```

### Cloudflare Pages Environment Variables
```yaml
# Add these in Cloudflare Dashboard → Pages → Settings → Environment Variables

# Production Environment:
TURNSTILE_SECRET_KEY: [encrypted - from Turnstile dashboard]
SENDGRID_API_KEY: [encrypted - from SendGrid]
SENDGRID_CONTACT_TEMPLATE_ID: d-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_CONFIRMATION_TEMPLATE_ID: d-yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
ADMIN_EMAIL: admin@liteckyeditingservices.com
ENVIRONMENT: production

# Preview Environment (same but with test keys):
TURNSTILE_SECRET_KEY: 2x0000000000000000000000000000000AA
# ... etc
```

## Part E: Setup Checklist

### 1. GitHub OAuth App
```
1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: Litecky CMS Auth
   - Homepage URL: https://liteckyeditingservices.com
   - Authorization callback URL: https://cms-auth.liteckyeditingservices.com/callback
4. Copy Client ID and Client Secret
```

### 2. Deploy OAuth Worker
```bash
cd workers/decap-oauth
pnpm install
wrangler login
wrangler secret put GITHUB_OAUTH_ID   # Paste Client ID
wrangler secret put GITHUB_OAUTH_SECRET # Paste Client Secret
wrangler deploy
```

### 3. Update CMS Config
```bash
# Replace YOUR_GITHUB_USERNAME in config.yml
sed -i '' 's/YOUR_GITHUB_USERNAME/your-actual-username/g' apps/site/public/admin/config.yml
```

### 4. Add GitHub Collaborator
```
1. Go to your repo settings
2. Manage access → Add people
3. Add your wife's GitHub username with Write permission
```

### 5. Create SendGrid Templates
```
1. Login to SendGrid
2. Email API → Dynamic Templates → Create Template
3. Create three templates and copy their IDs:
   - Contact Form Notification (to admin)
   - Contact Confirmation (to client)  
   - Quote Delivery (to client)
```

### 6. DNS Configuration
```
# Add to Cloudflare DNS:
CNAME cms-auth litecky-decap-oauth.workers.dev (Proxied)

# SendGrid DKIM records (from SendGrid dashboard):
CNAME em1234.liteckyeditingservices.com u12345678.wl123.sendgrid.net (DNS only)
CNAME s1._domainkey s1.domainkey.u12345678.wl123.sendgrid.net (DNS only)
CNAME s2._domainkey s2.domainkey.u12345678.wl123.sendgrid.net (DNS only)
```

### 7. Test Everything
```bash
# Test OAuth proxy
curl https://cms-auth.liteckyeditingservices.com/

# Test CMS access
open https://liteckyeditingservices.com/admin

# Test contact form
# Submit a test form and verify emails arrive
```

## Troubleshooting

### CMS Login Issues
- Verify GitHub OAuth App callback URL exactly matches
- Check Worker logs: `wrangler tail --name litecky-decap-oauth`
- Ensure your wife has Write access to the repo

### Email Not Sending
- Verify SendGrid API key is correct
- Check template IDs match
- Verify domain authentication in SendGrid
- Check Pages Function logs in Cloudflare dashboard

### Form Submission Errors
- Ensure Turnstile keys are set correctly
- Check browser console for JavaScript errors
- Verify origin is in allowed list in contact.ts

### Build Failures
- Check Cloudflare Pages build logs
- Verify all environment variables are set
- Ensure file paths in config.yml are correct
