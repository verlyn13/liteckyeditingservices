# Academic Editor - Complete CMS Setup with Decap

## Overview

This setup provides a user-friendly content management system that allows non-technical users to edit website content through a web interface. Changes are automatically committed to GitHub and deployed via Cloudflare Pages.

## Content Structure

### `src/content.config.ts` - Content Collections Schema
```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Main pages collection (services, about, process, etc.)
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    updated: z.coerce.date().default(() => new Date()),
    draft: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

// Testimonials collection
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/testimonials' }),
  schema: z.object({
    author: z.string(),
    credentials: z.string(),
    institution: z.string(),
    program: z.enum(['Psychology', 'Social Sciences', 'STEM', 'Medical', 'Humanities', 'Other']),
    rating: z.number().min(1).max(5).default(5),
    featured: z.boolean().default(false),
    date: z.coerce.date(),
    quote: z.string(),
  }),
});

// FAQ collection
const faqs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    category: z.enum(['Pricing', 'Process', 'Timeline', 'Technical', 'General']),
    order: z.number().default(0),
    featured: z.boolean().default(false),
  }),
});

// Service features/benefits
const features = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/features' }),
  schema: z.object({
    title: z.string(),
    icon: z.string().default('📝'),
    description: z.string(),
    order: z.number().default(0),
    category: z.enum(['Trust', 'Process', 'Quality', 'Support']),
  }),
});

// Blog/News (optional but useful)
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Academic Editor Team'),
    publishDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    category: z.enum(['Tips', 'News', 'Guide', 'Case Study']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  pages,
  testimonials,
  faqs,
  features,
  blog,
};
```

## CMS Configuration

### `public/admin/index.html` - CMS Entry Point
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>Academic Editor - Content Manager</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
<body>
  <!-- Include the Decap CMS script -->
  <script src="https://unpkg.com/decap-cms@^3.1.0/dist/decap-cms.js"></script>
  
  <!-- Custom styles for the CMS -->
  <style>
    /* Academic Editor branding */
    [data-slate-editor] {
      -webkit-font-smoothing: antialiased;
    }
    
    /* Custom preview styles */
    .frame-content {
      font-family: 'Lato', system-ui, sans-serif;
    }
    
    .frame-content h1,
    .frame-content h2,
    .frame-content h3 {
      font-family: 'Lora', Georgia, serif;
      color: #192A51;
    }
  </style>
  
  <!-- Initialize CMS with custom preview styles -->
  <script>
    CMS.registerPreviewStyle('/admin/preview.css');
  </script>
</body>
</html>
```

### `public/admin/config.yml` - CMS Configuration
```yaml
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/academic-editor # UPDATE THIS
  branch: main
  commit_messages:
    create: 'Content: Create {{collection}} "{{slug}}"'
    update: 'Content: Update {{collection}} "{{slug}}"'
    delete: 'Content: Delete {{collection}} "{{slug}}"'
    uploadMedia: 'Media: Upload "{{path}}"'
    deleteMedia: 'Media: Delete "{{path}}"'

# Uncomment for OAuth (if using the OAuth proxy)
# base_url: https://academic-editor.com
# auth_endpoint: api/auth

# Use editorial workflow for content review
publish_mode: editorial_workflow

# Media files configuration
media_folder: "public/images/uploads"
public_folder: "/images/uploads"

# Site configuration
site_url: https://academic-editor.com
display_url: https://academic-editor.com
logo_url: /images/logo.svg

# Collections
collections:
  # Main Pages
  - name: "pages"
    label: "📄 Pages"
    label_singular: "Page"
    folder: "src/content/pages"
    create: true
    delete: false # Prevent accidental deletion of main pages
    extension: "md"
    format: "frontmatter"
    slug: "{{slug}}"
    preview_path: "/{{slug}}"
    editor:
      preview: true
    fields:
      - {label: "Title", name: "title", widget: "string", required: true}
      - {label: "Description", name: "description", widget: "text", required: true, hint: "Brief description for navigation and SEO"}
      - {label: "Hero Title", name: "heroTitle", widget: "string", required: false, hint: "Large title shown at top of page (defaults to Title)"}
      - {label: "Hero Subtitle", name: "heroSubtitle", widget: "text", required: false}
      - {label: "SEO Title", name: "seoTitle", widget: "string", required: false, hint: "For search results (defaults to Title)"}
      - {label: "SEO Description", name: "seoDescription", widget: "text", required: false, pattern: ['.{50,160}', "Must be between 50-160 characters"]}
      - {label: "Updated Date", name: "updated", widget: "datetime", default: "", required: false}
      - {label: "Draft", name: "draft", widget: "boolean", default: false}
      - {label: "Order", name: "order", widget: "number", default: 0, hint: "Lower numbers appear first in navigation"}
      - {label: "Content", name: "body", widget: "markdown", required: true}

  # Testimonials
  - name: "testimonials"
    label: "⭐ Testimonials"
    label_singular: "Testimonial"
    folder: "src/content/testimonials"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{year}}-{{month}}-{{author}}"
    summary: "{{author}} - {{institution}}"
    sortable_fields: ['date', 'author', 'featured']
    editor:
      preview: false
    fields:
      - {label: "Author Name", name: "author", widget: "string", required: true}
      - {label: "Credentials", name: "credentials", widget: "string", required: true, hint: "e.g., PhD in Psychology"}
      - {label: "Institution", name: "institution", widget: "string", required: true, hint: "e.g., Stanford University"}
      - label: "Program"
        name: "program"
        widget: "select"
        options: ["Psychology", "Social Sciences", "STEM", "Medical", "Humanities", "Other"]
        default: "Psychology"
      - {label: "Rating", name: "rating", widget: "number", default: 5, min: 1, max: 5}
      - {label: "Featured", name: "featured", widget: "boolean", default: false, hint: "Show on homepage"}
      - {label: "Date", name: "date", widget: "datetime", default: ""}
      - {label: "Quote", name: "quote", widget: "text", required: true}
      - {label: "Full Testimonial", name: "body", widget: "markdown", required: false, hint: "Extended version for testimonials page"}

  # FAQs
  - name: "faqs"
    label: "❓ FAQs"
    label_singular: "FAQ"
    folder: "src/content/faqs"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{category}}-{{question}}"
    summary: "{{category}}: {{question}}"
    sortable_fields: ['category', 'order']
    editor:
      preview: false
    fields:
      - {label: "Question", name: "question", widget: "string", required: true}
      - label: "Category"
        name: "category"
        widget: "select"
        options: ["Pricing", "Process", "Timeline", "Technical", "General"]
        default: "General"
      - {label: "Order", name: "order", widget: "number", default: 0, hint: "Lower numbers appear first"}
      - {label: "Featured", name: "featured", widget: "boolean", default: false, hint: "Show on homepage"}
      - {label: "Answer", name: "body", widget: "markdown", required: true}

  # Features/Benefits
  - name: "features"
    label: "✨ Features"
    label_singular: "Feature"
    folder: "src/content/features"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{category}}-{{title}}"
    summary: "{{category}}: {{title}}"
    sortable_fields: ['category', 'order']
    editor:
      preview: false
    fields:
      - {label: "Title", name: "title", widget: "string", required: true}
      - {label: "Icon", name: "icon", widget: "string", default: "📝", hint: "Emoji or icon name"}
      - {label: "Short Description", name: "description", widget: "text", required: true, hint: "1-2 sentences"}
      - label: "Category"
        name: "category"
        widget: "select"
        options: ["Trust", "Process", "Quality", "Support"]
        default: "Quality"
      - {label: "Order", name: "order", widget: "number", default: 0}
      - {label: "Details", name: "body", widget: "markdown", required: false, hint: "Extended description"}

  # Blog/Updates (Optional)
  - name: "blog"
    label: "📰 Blog & Updates"
    label_singular: "Post"
    folder: "src/content/blog"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    preview_path: "/blog/{{slug}}"
    sortable_fields: ['publishDate', 'title', 'category']
    editor:
      preview: true
    fields:
      - {label: "Title", name: "title", widget: "string", required: true}
      - {label: "Description", name: "description", widget: "text", required: true}
      - {label: "Author", name: "author", widget: "string", default: "Academic Editor Team"}
      - {label: "Publish Date", name: "publishDate", widget: "datetime", default: ""}
      - {label: "Update Date", name: "updateDate", widget: "datetime", required: false}
      - {label: "Hero Image", name: "heroImage", widget: "image", required: false}
      - label: "Category"
        name: "category"
        widget: "select"
        options: ["Tips", "News", "Guide", "Case Study"]
        default: "Tips"
      - {label: "Tags", name: "tags", widget: "list", required: false}
      - {label: "Draft", name: "draft", widget: "boolean", default: true}
      - {label: "Content", name: "body", widget: "markdown", required: true}

  # Site Settings (Singleton)
  - name: "settings"
    label: "⚙️ Site Settings"
    delete: false
    editor:
      preview: false
    files:
      - name: "general"
        label: "General Settings"
        file: "src/data/settings.json"
        fields:
          - {label: "Site Name", name: "siteName", widget: "string"}
          - {label: "Site URL", name: "siteUrl", widget: "string"}
          - {label: "Contact Email", name: "contactEmail", widget: "string"}
          - {label: "Phone", name: "phone", widget: "string", required: false}
          - label: "Office Hours"
            name: "officeHours"
            widget: "object"
            fields:
              - {label: "Days", name: "days", widget: "string", default: "Monday - Friday"}
              - {label: "Hours", name: "hours", widget: "string", default: "9:00 AM - 5:00 PM EST"}
          - label: "Social Media"
            name: "social"
            widget: "object"
            required: false
            fields:
              - {label: "LinkedIn", name: "linkedin", widget: "string", required: false}
              - {label: "Twitter", name: "twitter", widget: "string", required: false}
      
      - name: "pricing"
        label: "Pricing"
        file: "src/data/pricing.json"
        fields:
          - label: "Services"
            name: "services"
            widget: "list"
            fields:
              - {label: "Name", name: "name", widget: "string"}
              - {label: "Description", name: "description", widget: "text"}
              - {label: "Starting Price", name: "startingPrice", widget: "string", hint: "e.g., $0.03 per word"}
              - {label: "Turnaround", name: "turnaround", widget: "string", hint: "e.g., 2-3 business days"}
              - {label: "Features", name: "features", widget: "list", field: {label: "Feature", name: "feature", widget: "string"}}
```

### `public/admin/preview.css` - CMS Preview Styles
```css
/* Preview pane styles to match your site */
body {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 18px;
  line-height: 1.6;
  color: #2C2C2C;
  background-color: #F7F7F5;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Lora', Georgia, serif;
  color: #192A51;
  line-height: 1.2;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }

a {
  color: #192A51;
  text-decoration: underline;
  text-underline-offset: 2px;
}

blockquote {
  border-left: 4px solid #5A716A;
  padding-left: 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  color: #6B6B6B;
}

code {
  background: #E8E8E6;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

pre {
  background: #E8E8E6;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
}

ul, ol {
  margin: 1rem 0;
  padding-left: 2rem;
}

li {
  margin: 0.5rem 0;
}
```

## Initial Content Files

### `src/content/pages/services.md`
```markdown
---
title: "Our Services"
description: "Professional academic editing services for graduate students"
heroTitle: "Academic Editing Services"
heroSubtitle: "Transform your complex ideas into clear, polished prose"
order: 1
draft: false
---

## Dissertation Editing

Our comprehensive dissertation editing service is designed specifically for doctoral candidates who need expert support in polishing their most important academic work.

### What's Included:
- Complete grammar and syntax review
- APA/MLA/Chicago formatting
- Consistency checks across all chapters
- Reference list formatting
- Feedback on clarity and flow

## Thesis Editing

Master's students trust us to refine their thesis projects with the same attention to detail we bring to doctoral dissertations.

### Our Process:
1. Initial review and assessment
2. Detailed editing with tracked changes
3. Comments and suggestions for improvement
4. Final formatting check

## Journal Article Editing

Increase your chances of publication with our specialized journal article editing service.

[Continue with more content...]
```

### `src/content/testimonials/2024-10-sarah-chen.md`
```markdown
---
author: "Dr. Sarah Chen"
credentials: "PhD in Clinical Psychology"
institution: "Stanford University"
program: "Psychology"
rating: 5
featured: true
date: 2024-10-15
quote: "My editor didn't just fix my grammar—they helped me clarify my arguments and strengthen my methodology section."
---

Working with Academic Editor was a game-changer for my dissertation. I was struggling with consistency across my chapters and feeling overwhelmed by the formatting requirements. 

My editor not only caught every grammatical error but also provided invaluable feedback on the flow of my arguments. They helped me restructure several key sections, making my work much more compelling.

I passed my defense with no revisions required—something my advisor said was extremely rare. I couldn't have done it without this service.
```

### `src/content/faqs/pricing-how-much.md`
```markdown
---
question: "How much does editing cost?"
category: "Pricing"
order: 1
featured: true
---

Our pricing is transparent and based on word count and turnaround time. Most dissertations (80,000-100,000 words) range from $2,400-$3,000 for standard turnaround (5-7 business days).

We offer:
- **Free sample edit** of 500 words
- **Flat-rate pricing** with no hidden fees
- **Payment plans** for larger projects
- **Rush delivery** available for an additional fee

Contact us for a personalized quote based on your specific needs.
```

## OAuth Setup (Optional but Recommended)

### `apps/site/functions/api/auth/[[auth]].ts` - GitHub OAuth Proxy
```typescript
/**
 * GitHub OAuth proxy for Decap CMS
 * Allows editors to authenticate without direct repo access
 */
import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth';

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const url = new URL(request.url);
  const path = params.auth as string[];
  
  // Handle different OAuth endpoints
  if (!path || path.length === 0 || path[0] === '') {
    // Initial auth request - redirect to GitHub
    const state = crypto.randomUUID();
    const redirectUrl = new URL(`${GITHUB_OAUTH_URL}/authorize`);
    redirectUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    redirectUrl.searchParams.set('scope', 'repo,user');
    redirectUrl.searchParams.set('state', state);
    
    return Response.redirect(redirectUrl.toString());
  }
  
  if (path[0] === 'callback') {
    // Handle OAuth callback
    const code = url.searchParams.get('code');
    
    if (!code) {
      return new Response('Missing authorization code', { status: 400 });
    }
    
    // Exchange code for token
    const tokenResponse = await fetch(`${GITHUB_OAUTH_URL}/access_token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    // Return token to CMS
    const script = `
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("receiveMessage", e);
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify(tokenData)}',
              e.origin
            );
            window.removeEventListener("message", receiveMessage, false);
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })();
      </script>
    `;
    
    return new Response(script, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
  
  return new Response('Not found', { status: 404 });
};
```

## Cloudflare Access Protection

### Zero Trust Configuration (via Dashboard)
```yaml
# Application Configuration
Application Name: Academic Editor CMS
Application Domain: academic-editor.com
Path: /admin

# Policy Configuration
Policy Name: CMS Editors
Decision: Allow
Include:
  - Emails: 
    - your-wife@email.com
    - your@email.com

# Additional Security
Session Duration: 24 hours
Purpose Justification: Not required
```

## Updated Astro Pages to Use Content

### `apps/site/src/pages/[...slug].astro` - Dynamic Page Router
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '@/layouts/BaseLayout.astro';
import { marked } from 'marked';

export async function getStaticPaths() {
  const pages = await getCollection('pages', ({ data }) => {
    return data.draft !== true;
  });
  
  return pages.map(page => ({
    params: { slug: page.id.replace('.md', '') },
    props: { page },
  }));
}

const { page } = Astro.props;
const { Content } = await page.render();
---

<BaseLayout 
  title={page.data.seoTitle || page.data.title}
  description={page.data.seoDescription || page.data.description}
>
  <div class="container section">
    {page.data.heroTitle && (
      <header class="page-hero">
        <h1>{page.data.heroTitle}</h1>
        {page.data.heroSubtitle && (
          <p class="hero-subtitle">{page.data.heroSubtitle}</p>
        )}
      </header>
    )}
    
    <article class="prose">
      <Content />
    </article>
    
    {page.data.updated && (
      <footer class="page-meta">
        <p>Last updated: {new Date(page.data.updated).toLocaleDateString()}</p>
      </footer>
    )}
  </div>
</BaseLayout>
```

## Editor Instructions Document

### `EDITOR_GUIDE.md` - For Your Wife
```markdown
# Content Editing Guide

## Getting Started

1. **Access the CMS**: Go to https://academic-editor.com/admin
2. **Login**: Click "Login with GitHub" and use your GitHub account
3. **Dashboard**: You'll see all content organized in collections

## Editing Content

### To Edit a Page:
1. Click on "Pages" in the sidebar
2. Find the page you want to edit
3. Click on it to open the editor
4. Make your changes in the editor
5. Click "Save" to create a draft
6. Click "Publish" → "Publish now" to make it live

### Rich Text Editor Features:
- **Bold**: Select text and click B or press Ctrl/Cmd+B
- **Italic**: Select text and click I or press Ctrl/Cmd+I
- **Headers**: Use the dropdown to select heading levels
- **Lists**: Click the bullet or number icons
- **Links**: Select text and click the link icon
- **Images**: Click the image icon to upload or select

### Adding Testimonials:
1. Click "Testimonials" → "New Testimonial"
2. Fill in all fields (author, credentials, etc.)
3. Check "Featured" to show on homepage
4. Save and Publish

### Managing FAQs:
1. Click "FAQs" → "New FAQ" 
2. Enter the question and select a category
3. Write the answer in markdown
4. Set order (lower numbers appear first)

## Important Notes

- **Save vs Publish**: "Save" creates a draft, "Publish" makes it live
- **Preview**: Use the preview pane to see how content will look
- **Images**: Keep images under 2MB for best performance
- **Drafts**: Set "Draft: true" to hide content from the site

## Getting Help

- Changes typically appear on the site within 2-3 minutes
- If something doesn't look right, you can always revert changes
- Contact [your name] if you need technical assistance
```

## Setup Instructions

```bash
# 1. Update the GitHub repo reference in config.yml
sed -i '' 's/YOUR_GITHUB_USERNAME/your-actual-username/g' public/admin/config.yml

# 2. Create initial content directories
mkdir -p src/content/{pages,testimonials,faqs,features,blog}
mkdir -p src/data
mkdir -p public/images/uploads

# 3. Create placeholder data files
echo '{"siteName":"Academic Editor"}' > src/data/settings.json
echo '{"services":[]}' > src/data/pricing.json

# 4. Add OAuth environment variables to Cloudflare Pages
# GITHUB_CLIENT_ID=your_github_app_client_id
# GITHUB_CLIENT_SECRET=your_github_app_client_secret

# 5. Set up GitHub OAuth App
# Go to GitHub Settings > Developer settings > OAuth Apps
# Create new app with:
# - Homepage URL: https://academic-editor.com
# - Callback URL: https://academic-editor.com/api/auth/callback

# 6. Configure Cloudflare Access (optional)
# Dashboard > Zero Trust > Access > Applications
# Add application protecting /admin path

# 7. Grant your wife repo access
# GitHub repo > Settings > Manage access
# Add her GitHub account as collaborator with write access

# 8. Deploy
git add .
git commit -m "feat: add Decap CMS for content management"
git push origin main
```

## What Your Wife Will Experience

1. **Simple Login**: Goes to `/admin`, clicks "Login with GitHub" once
2. **Friendly Interface**: Clean, intuitive editor with live preview
3. **No Code**: Never sees HTML, terminal, or Git commands
4. **Immediate Publishing**: Click "Publish" and changes go live in ~2 minutes
5. **Safety**: Editorial workflow means drafts are saved, can preview before publishing
6. **Rollback**: Can revert changes if needed through the CMS interface

The system handles all the technical complexity - she just focuses on writing and editing content!
