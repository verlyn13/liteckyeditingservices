# Litecky Editing Services - Complete Deployment Configuration

## Project Overview

- **Domain**: liteckyeditingservices.com
- **Hosting**: Cloudflare Pages
- **Email**: SendGrid
- **CMS**: Decap CMS with GitHub backend
- **Forms**: Turnstile for spam protection
- **Authentication**: GitHub OAuth via Cloudflare Worker

## 1. Cloudflare Configuration

### DNS Records (Cloudflare Dashboard)
```
Type  Name                          Value                    Proxy
A     @                            192.0.2.1                 ✓ (Proxied)
AAAA  @                            100::                     ✓ (Proxied)
CNAME www                          liteckyeditingservices.com ✓ (Proxied)
CNAME cms-auth                     decap-oauth.workers.dev   ✓ (Proxied)

# SendGrid Domain Authentication (will be added after setup)
CNAME em1234                       u12345678.wl123.sendgrid.net  ✗
CNAME s1._domainkey                s1.domainkey.u12345678.wl123.sendgrid.net  ✗
CNAME s2._domainkey                s2.domainkey.u12345678.wl123.sendgrid.net  ✗

# Email Routing (optional)
MX    @                            route1.mx.cloudflare.net  Priority: 1
MX    @                            route2.mx.cloudflare.net  Priority: 2
TXT   @                            "v=spf1 include:spf.sendgrid.net include:_spf.mx.cloudflare.net ~all"
```

### Pages Project Settings
```yaml
Project Name: litecky-editing
Production Branch: main
Build Configuration:
  Framework preset: Astro
  Build command: pnpm build
  Build output directory: dist
  Root directory: apps/site

Environment Variables:
  # Public (visible in browser)
  PUBLIC_SITE_NAME: "Litecky Editing Services"
  PUBLIC_SITE_URL: "https://liteckyeditingservices.com"
  PUBLIC_TURNSTILE_SITE_KEY: "0x4AAAAAAAxxxxx"  # Get from Turnstile dashboard
  PUBLIC_GA4_ID: "G-XXXXXXXXXX"  # Optional
  
  # Secret (server-only)
  TURNSTILE_SECRET_KEY: [encrypted]  # Get from Turnstile dashboard
  SENDGRID_API_KEY: [encrypted]  # From SendGrid
  SENDGRID_CONTACT_TEMPLATE_ID: [encrypted]  # Template ID from SendGrid
  SENDGRID_QUOTE_TEMPLATE_ID: [encrypted]  # Template ID from SendGrid
  SENDGRID_CONFIRMATION_TEMPLATE_ID: [encrypted]  # Template ID from SendGrid
  ADMIN_EMAIL: "admin@liteckyeditingservices.com"
```

## 2. GitHub OAuth Worker (Decap CMS Authentication)

### `workers/decap-oauth/wrangler.toml`
```toml
name = "litecky-decap-oauth"
main = "src/index.ts"
compatibility_date = "2025-09-22"
compatibility_flags = ["nodejs_compat"]

[route]
pattern = "cms-auth.liteckyeditingservices.com/*"
custom_domain = true
zone_name = "liteckyeditingservices.com"

[vars]
ENVIRONMENT = "production"

# Secrets to add via CLI:
# wrangler secret put GITHUB_OAUTH_ID
# wrangler secret put GITHUB_OAUTH_SECRET
```

### `workers/decap-oauth/src/index.ts`
```typescript
/**
 * Decap CMS GitHub OAuth Proxy for Cloudflare Workers
 * Based on: https://github.com/sterlingwes/decap-proxy
 */

export interface Env {
  GITHUB_OAUTH_ID: string;
  GITHUB_OAUTH_SECRET: string;
}

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth';
const GITHUB_API_URL = 'https://api.github.com';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers for Decap CMS
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://liteckyeditingservices.com',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // OAuth flow endpoints
    if (url.pathname === '/auth') {
      // Start OAuth flow
      const provider = url.searchParams.get('provider') || 'github';
      if (provider !== 'github') {
        return new Response('Only GitHub OAuth is supported', { status: 400 });
      }
      
      const redirectUrl = new URL(`${GITHUB_OAUTH_URL}/authorize`);
      redirectUrl.searchParams.set('client_id', env.GITHUB_OAUTH_ID);
      redirectUrl.searchParams.set('scope', 'repo,user');
      
      return Response.redirect(redirectUrl.toString());
    }
    
    if (url.pathname === '/callback') {
      // Handle OAuth callback
      const code = url.searchParams.get('code');
      
      if (!code) {
        return new Response('Missing authorization code', { status: 400 });
      }
      
      try {
        // Exchange code for token
        const tokenResponse = await fetch(`${GITHUB_OAUTH_URL}/access_token`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: env.GITHUB_OAUTH_ID,
            client_secret: env.GITHUB_OAUTH_SECRET,
            code,
          }),
        });
        
        const tokenData = await tokenResponse.json();
        
        if (tokenData.error) {
          throw new Error(tokenData.error_description || 'OAuth failed');
        }
        
        // Get user data
        const userResponse = await fetch(`${GITHUB_API_URL}/user`, {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'Accept': 'application/json',
          },
        });
        
        const userData = await userResponse.json();
        
        // Return success page that posts message to opener
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Authentication Success</title>
            <script>
              const authData = {
                token: "${tokenData.access_token}",
                provider: "github",
                user: ${JSON.stringify(userData)}
              };
              
              if (window.opener) {
                window.opener.postMessage(
                  "authorization:github:success:" + JSON.stringify(authData),
                  "*"
                );
                window.close();
              } else {
                document.body.innerHTML = "Authentication successful! You can close this window.";
              }
            </script>
          </head>
          <body>Authenticating...</body>
          </html>
        `;
        
        return new Response(html, {
          headers: { 
            'Content-Type': 'text/html',
            ...corsHeaders 
          },
        });
        
      } catch (error) {
        console.error('OAuth error:', error);
        return new Response(`Authentication failed: ${error.message}`, { 
          status: 500,
          headers: corsHeaders,
        });
      }
    }
    
    if (url.pathname === '/success') {
      // Success endpoint for Decap
      const token = url.searchParams.get('token');
      const provider = url.searchParams.get('provider') || 'github';
      
      return new Response(JSON.stringify({ token, provider }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
    
    return new Response('Not found', { status: 404 });
  },
};
```

### Deploy OAuth Worker
```bash
cd workers/decap-oauth
pnpm install
wrangler secret put GITHUB_OAUTH_ID
# Enter your GitHub OAuth App Client ID
wrangler secret put GITHUB_OAUTH_SECRET
# Enter your GitHub OAuth App Client Secret
wrangler deploy
```

## 3. GitHub OAuth App Setup

### Create GitHub OAuth App
1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Litecky Editing CMS
   - **Homepage URL**: https://liteckyeditingservices.com
   - **Authorization callback URL**: https://cms-auth.liteckyeditingservices.com/callback
4. Save and copy the Client ID and Client Secret

### Repository Settings
```yaml
Repository: YOUR_GITHUB_USERNAME/litecky-editing
Collaborators:
  - YOUR_WIFE_GITHUB_USERNAME (Write access)

Branch Protection (main):
  - Require pull request reviews: No (for direct CMS commits)
  - Require status checks: Yes
    - github/pages-build-deployment
  - Allow force pushes: No
  - Allow deletions: No
```

## 4. Decap CMS Configuration

### `public/admin/index.html`
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
    /* Custom branding */
    .nc-app-header {
      background: #192A51 !important;
    }
  </style>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.1.0/dist/decap-cms.js"></script>
</body>
</html>
```

### `public/admin/config.yml`
```yaml
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/litecky-editing  # UPDATE THIS
  branch: main
  base_url: https://cms-auth.liteckyeditingservices.com
  auth_endpoint: auth
  commit_messages:
    create: 'Content: Create {{collection}} "{{slug}}"'
    update: 'Content: Update {{collection}} "{{slug}}"'
    delete: 'Content: Delete {{collection}} "{{slug}}"'

# Site configuration
site_url: https://liteckyeditingservices.com
display_url: https://liteckyeditingservices.com
logo_url: /images/logo.svg

# Editorial workflow (optional - creates PRs instead of direct commits)
# publish_mode: editorial_workflow

# Media storage
media_folder: "apps/site/public/images/uploads"
public_folder: "/images/uploads"

# Content Collections
collections:
  - name: "pages"
    label: "📄 Website Pages"
    label_singular: "Page"
    folder: "apps/site/src/content/pages"
    create: true
    delete: false
    extension: "md"
    slug: "{{slug}}"
    preview_path: "/{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string", required: true}
      - {label: "Description", name: "description", widget: "text", required: true}
      - {label: "Hero Title", name: "heroTitle", widget: "string", required: false}
      - {label: "Hero Subtitle", name: "heroSubtitle", widget: "text", required: false}
      - {label: "Updated Date", name: "updated", widget: "datetime", default: "", required: false}
      - {label: "Draft", name: "draft", widget: "boolean", default: false}
      - {label: "Content", name: "body", widget: "markdown"}

  - name: "testimonials"
    label: "⭐ Client Testimonials"
    folder: "apps/site/src/content/testimonials"
    create: true
    extension: "md"
    slug: "{{year}}-{{month}}-{{author}}"
    fields:
      - {label: "Author", name: "author", widget: "string"}
      - {label: "Credentials", name: "credentials", widget: "string"}
      - {label: "Institution", name: "institution", widget: "string"}
      - {label: "Featured on Homepage", name: "featured", widget: "boolean", default: false}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Quote", name: "quote", widget: "text"}
      - {label: "Full Story", name: "body", widget: "markdown", required: false}

  - name: "faqs"
    label: "❓ FAQs"
    folder: "apps/site/src/content/faqs"
    create: true
    extension: "md"
    slug: "{{category}}-{{slug}}"
    fields:
      - {label: "Question", name: "question", widget: "string"}
      - label: "Category"
        name: "category"
        widget: "select"
        options: ["Pricing", "Process", "Timeline", "Formatting", "General"]
      - {label: "Order", name: "order", widget: "number", default: 0}
      - {label: "Answer", name: "body", widget: "markdown"}

  - name: "settings"
    label: "⚙️ Site Settings"
    files:
      - name: "contact"
        label: "Contact Information"
        file: "apps/site/src/data/contact.json"
        fields:
          - {label: "Business Name", name: "businessName", widget: "string"}
          - {label: "Email", name: "email", widget: "string"}
          - {label: "Phone", name: "phone", widget: "string", required: false}
          - {label: "Response Time", name: "responseTime", widget: "string", default: "within 24 hours"}
          - label: "Office Hours"
            name: "officeHours"
            widget: "object"
            fields:
              - {label: "Days", name: "days", widget: "string"}
              - {label: "Hours", name: "hours", widget: "string"}
              - {label: "Timezone", name: "timezone", widget: "string"}

      - name: "pricing"
        label: "Service Pricing"
        file: "apps/site/src/data/pricing.json"
        fields:
          - label: "Services"
            name: "services"
            widget: "list"
            fields:
              - {label: "Name", name: "name", widget: "string"}
              - {label: "Description", name: "description", widget: "text"}
              - {label: "Starting Price", name: "startingPrice", widget: "string"}
              - {label: "Price Per Word", name: "pricePerWord", widget: "string"}
              - {label: "Typical Turnaround", name: "turnaround", widget: "string"}
```

## 5. SendGrid Configuration

### Domain Authentication Setup
1. Login to SendGrid Dashboard
2. Go to Settings → Sender Authentication → Authenticate Your Domain
3. Enter: liteckyeditingservices.com
4. Choose DNS host: Cloudflare
5. Add the provided CNAME records to Cloudflare DNS
6. Verify authentication

### API Key Creation
```
Settings → API Keys → Create API Key
Name: litecky-production
Permissions: 
  - Mail Send: Full Access
  - Template Engine: Read
Copy the key and add to Cloudflare Pages secrets
```

### Email Templates (Dynamic Templates)

#### Contact Form Received (Internal)
**Template Name**: Contact Form Submission
**Template ID**: d-xxxxxxxxxxxxx
```html
Subject: New Contact Form Submission - {{service}}

<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> {{name}}</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Service:</strong> {{service}}</p>
<p><strong>Deadline:</strong> {{deadline}}</p>
<p><strong>Message:</strong></p>
<blockquote>{{message}}</blockquote>
<p><strong>Submitted:</strong> {{timestamp}}</p>
```

#### Contact Confirmation (To Client)
**Template Name**: Contact Confirmation
**Template ID**: d-yyyyyyyyyyy
```html
Subject: We've received your inquiry - Litecky Editing Services

<h2>Thank you for contacting Litecky Editing Services, {{name}}!</h2>
<p>We've received your inquiry about {{service}} and will respond within 24 hours.</p>
<h3>What happens next?</h3>
<ol>
  <li>We'll review your requirements</li>
  <li>Prepare a detailed quote</li>
  <li>Send you our quote and timeline</li>
</ol>
<p>If you have any urgent questions, please don't hesitate to reply to this email.</p>
<p>Best regards,<br>The Litecky Editing Team</p>
```

#### Quote Delivery (To Client)
**Template Name**: Your Quote is Ready
**Template ID**: d-zzzzzzzzzz
```html
Subject: Your quote from Litecky Editing Services

<h2>Your Quote is Ready, {{name}}</h2>
<p>Thank you for your interest in our {{service}} service.</p>
<h3>Quote Details:</h3>
<ul>
  <li><strong>Service:</strong> {{service}}</li>
  <li><strong>Word Count:</strong> {{wordCount}}</li>
  <li><strong>Quote:</strong> {{quote}}</li>
  <li><strong>Turnaround:</strong> {{turnaround}}</li>
</ul>
<p>This quote is valid for 30 days. To proceed, simply reply to this email.</p>
<p>View our full terms: {{termsLink}}</p>
```

## 6. Contact Form Implementation

### `apps/site/src/components/ContactForm.svelte`
```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  
  let formData = {
    name: '',
    email: '',
    service: 'dissertation',
    deadline: '',
    message: '',
  };
  
  let turnstileToken = '';
  let submitting = false;
  let submitted = false;
  let error = '';
  
  const TURNSTILE_SITE_KEY = 'YOUR_TURNSTILE_SITE_KEY'; // Replace
  
  onMount(() => {
    // Load Turnstile
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    script.onload = () => {
      if (window.turnstile) {
        window.turnstile.render('#turnstile-widget', {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            turnstileToken = token;
          },
        });
      }
    };
  });
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!turnstileToken) {
      error = 'Please complete the security check';
      return;
    }
    
    submitting = true;
    error = '';
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          'cf-turnstile-response': turnstileToken,
        }),
      });
      
      if (response.ok) {
        submitted = true;
      } else {
        error = 'Something went wrong. Please try again.';
      }
    } catch (err) {
      error = 'Network error. Please check your connection.';
    } finally {
      submitting = false;
    }
  }
</script>

<form on:submit={handleSubmit} class="contact-form">
  {#if submitted}
    <div class="success-message">
      <h3>Thank you!</h3>
      <p>We've received your inquiry and will respond within 24 hours.</p>
    </div>
  {:else}
    <label>
      Name *
      <input type="text" bind:value={formData.name} required />
    </label>
    
    <label>
      Email *
      <input type="email" bind:value={formData.email} required />
    </label>
    
    <label>
      Service *
      <select bind:value={formData.service}>
        <option value="dissertation">Dissertation Editing</option>
        <option value="thesis">Thesis Editing</option>
        <option value="journal">Journal Article</option>
        <option value="formatting">Formatting Only</option>
      </select>
    </label>
    
    <label>
      Deadline
      <input type="date" bind:value={formData.deadline} />
    </label>
    
    <label>
      Message *
      <textarea bind:value={formData.message} rows="5" required></textarea>
    </label>
    
    <div id="turnstile-widget" class="turnstile-container"></div>
    
    {#if error}
      <p class="error">{error}</p>
    {/if}
    
    <button type="submit" disabled={submitting}>
      {submitting ? 'Sending...' : 'Send Inquiry'}
    </button>
  {/if}
</form>
```

### `apps/site/functions/api/contact.ts`
```typescript
import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  TURNSTILE_SECRET_KEY: string;
  SENDGRID_API_KEY: string;
  SENDGRID_CONTACT_TEMPLATE_ID: string;
  SENDGRID_CONFIRMATION_TEMPLATE_ID: string;
  ADMIN_EMAIL: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const data = await request.json();
    const { name, email, service, deadline, message } = data;
    const turnstileToken = data['cf-turnstile-response'];
    
    // 1. Verify Turnstile
    const turnstileResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      }
    );
    
    const turnstileData = await turnstileResponse.json();
    if (!turnstileData.success) {
      return new Response('Security verification failed', { status: 400 });
    }
    
    // 2. Send internal notification
    await sendEmail(env.SENDGRID_API_KEY, {
      personalizations: [{
        to: [{ email: env.ADMIN_EMAIL }],
        dynamic_template_data: {
          name,
          email,
          service,
          deadline: deadline || 'Not specified',
          message,
          timestamp: new Date().toISOString(),
        },
      }],
      from: { 
        email: 'noreply@liteckyeditingservices.com',
        name: 'Litecky Editing Services',
      },
      reply_to: { email },
      template_id: env.SENDGRID_CONTACT_TEMPLATE_ID,
    });
    
    // 3. Send confirmation to client
    await sendEmail(env.SENDGRID_API_KEY, {
      personalizations: [{
        to: [{ email }],
        dynamic_template_data: {
          name,
          service,
        },
      }],
      from: {
        email: 'noreply@liteckyeditingservices.com',
        name: 'Litecky Editing Services',
      },
      reply_to: { 
        email: env.ADMIN_EMAIL,
        name: 'Litecky Editing Services',
      },
      template_id: env.SENDGRID_CONFIRMATION_TEMPLATE_ID,
    });
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

async function sendEmail(apiKey: string, data: any): Promise<void> {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid error: ${error}`);
  }
}
```

## 7. Deployment Checklist

### Initial Setup
```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/litecky-editing.git
cd litecky-editing

# 2. Install dependencies
pnpm install

# 3. Create environment files
cp apps/site/.env.example apps/site/.env
cp apps/site/.dev.vars.example apps/site/.dev.vars

# 4. Update CMS config
sed -i '' 's/YOUR_GITHUB_USERNAME/actual-username/g' public/admin/config.yml

# 5. Commit and push
git add .
git commit -m "feat: initial deployment configuration"
git push origin main
```

### Cloudflare Setup
1. **Create Turnstile widget**:
   - Dashboard → Turnstile → Add Site
   - Domain: liteckyeditingservices.com
   - Copy Site Key and Secret Key

2. **Create Pages project**:
   - Dashboard → Pages → Create Project
   - Connect GitHub repository
   - Set build configuration (see above)
   - Add environment variables

3. **Deploy OAuth Worker**:
   ```bash
   cd workers/decap-oauth
   wrangler deploy
   ```

4. **Add custom domain**:
   - Pages project → Custom domains
   - Add: liteckyeditingservices.com

### GitHub Setup
1. **Create OAuth App**:
   - Settings → Developer settings → OAuth Apps
   - New OAuth App (see configuration above)

2. **Add collaborator**:
   - Repository → Settings → Manage access
   - Add your wife with Write permission

### SendGrid Setup
1. **Authenticate domain**:
   - Settings → Sender Authentication
   - Add liteckyeditingservices.com
   - Add CNAME records to Cloudflare

2. **Create API key**:
   - Settings → API Keys → Create

3. **Create templates**:
   - Email API → Dynamic Templates
   - Create the three templates above
   - Copy template IDs

### Email Routing (Optional)
1. **Enable Email Routing**:
   - Cloudflare Dashboard → Email → Email Routing
   - Add destination address
   - Create routes:
     - info@ → your personal email
     - admin@ → your personal email

### Final Verification
```bash
# Test build locally
pnpm build

# Test CMS access
open https://liteckyeditingservices.com/admin

# Test contact form
open https://liteckyeditingservices.com/contact

# Verify email delivery
# Submit test form and check both emails arrive
```

## 8. Maintenance Commands

### Update content via Git
```bash
git pull origin main
pnpm dev  # Test locally
git add .
git commit -m "content: update [page]"
git push origin main
```

### Monitor deployments
```bash
# View Pages deployments
open https://dash.cloudflare.com/pages/view/litecky-editing

# Check Worker logs
wrangler tail --name litecky-decap-oauth
```

### Rotate secrets
```bash
# Cloudflare Pages
# Dashboard → Pages → Settings → Environment variables

# SendGrid
# Dashboard → Settings → API Keys → Create new, delete old

# GitHub OAuth
# Settings → OAuth Apps → Generate new secret
wrangler secret put GITHUB_OAUTH_SECRET --name litecky-decap-oauth
```

## Support Information

### DNS Propagation
After adding the domain to Cloudflare Pages, DNS propagation typically takes 5-15 minutes.

### Email Deliverability
- SPF record includes both SendGrid and Cloudflare Email Routing
- DKIM records authenticate SendGrid emails
- Monitor reputation in SendGrid dashboard

### CMS Access
Your wife accesses the CMS at: https://liteckyeditingservices.com/admin
- Logs in with her GitHub account
- Changes publish directly to the main branch
- Site rebuilds automatically (2-3 minutes)

### Troubleshooting
- **CMS login issues**: Verify GitHub OAuth App settings
- **Email not sending**: Check SendGrid API key and template IDs
- **Form errors**: Verify Turnstile keys match
- **Build failures**: Check Cloudflare Pages build logs
