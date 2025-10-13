# Decap CMS Editing Guide

## Overview

This guide explains what content you can edit through the Decap CMS admin interface and how the CMS is organized.

**CMS URL**: `/admin` (requires GitHub authentication)

## Understanding the CMS Structure

The CMS has **two types of collections**:

1. **📄 File Collections** - For editing specific, unique pages (Homepage, About, Process, Settings)
2. **📁 Folder Collections** - For managing groups of similar content (Services, Testimonials, FAQs, Pages)

---

## 🏠 Site Pages (File Collections)

These are unique pages with custom content structures. Each has specific fields tailored to its purpose.

### Homepage

**Location**: Content → Site Pages → Homepage

**What You Can Edit**:

**Hero Section**:
- Main Headline (e.g., "Expert Academic Editing")
- Subtitle paragraph
- Primary CTA button text and link
- Secondary CTA button text and link
- Stats Badge (e.g., "20+ Years Experience", "5,000+ Papers Edited")

**Trust Bar**:
- Tagline text (e.g., "Trusted by scholars from")
- University logos (upload images and provide alt text)

**Process Snapshot**:
- 3 process steps (title + description for each)

**Featured Testimonial**:
- Quote text
- Author name
- Author role/title

**File**: `content/pages/home.json`

---

### About Page

**Location**: Content → Site Pages → About Page

**What You Can Edit**:
- Page Title
- Meta Description (for SEO)
- Main Headline
- Introduction text (Markdown supported)
- Founder Information:
  - Name
  - Credentials
  - Years of experience
- Expertise Areas (list of skills/specialties)

**File**: `content/pages/about.json`

---

### Process Page

**Location**: Content → Site Pages → Process Page

**What You Can Edit**:
- Page Title
- Meta Description
- Main Headline
- Intro Text
- Process Steps (can have 3 or more):
  - Step Title
  - Step Description
  - Additional Info (small detail text)
  - Icon/Emoji (optional)

**File**: `content/pages/process.json`

---

## ⚙️ Site Settings (File Collections)

### General Settings

**Location**: Content → Site Settings → General Settings

**What You Can Edit**:
- Site Title
- Site Description
- Contact Email
- Phone Number
- Social Media Links:
  - Twitter
  - LinkedIn
  - Facebook

**File**: `content/settings/general.json`

---

### Navigation

**Location**: Content → Site Settings → Navigation

**What You Can Edit**:

**Header Navigation**:
- Link text
- Link URL
- Order (determines display order)

**Footer Navigation** (organized in columns):
- Services Column (list of service links)
- Company Column (list of company links)
- Legal Column (list of legal links)

**File**: `content/settings/navigation.json`

---

## 📁 Content Collections (Folder Collections)

These are groups of similar content where you can add, edit, or delete multiple entries.

### 💼 Services

**Location**: Content → Services

**What You Can Edit for Each Service**:
- Title
- Description
- Price (e.g., "Starting at $0.03/word")
- Features (list of bullet points)
- Order (lower numbers appear first)
- Full Description (Markdown body)

**Files**: `src/content/services/*.md`

**How to Add a New Service**:
1. Go to Services collection
2. Click "New Service"
3. Fill in all fields
4. Set the "Order" field to control placement
5. Click "Save" then "Publish"

---

### ⭐ Testimonials

**Location**: Content → Testimonials

**What You Can Edit for Each Testimonial**:
- Quote (short testimonial text)
- Author name
- Role (e.g., "PhD Candidate")
- University
- Rating (1-5 stars)
- Featured (toggle to show on homepage)
- Date
- Full Testimonial (extended content in Markdown)

**Files**: `src/content/testimonials/*.md`

**Slug Format**: `YYYY-MM-author-name`

---

### ❓ FAQ

**Location**: Content → FAQ

**What You Can Edit for Each FAQ**:
- Question
- Brief Answer
- Category:
  - General
  - Services
  - Process
  - Pricing
  - Security
- Order (controls display order within category)
- Detailed Answer (Markdown body)

**Files**: `src/content/faq/*.md`

**Slug Format**: `category-question-slug`

---

### 📄 Generic Pages

**Location**: Content → Pages

**What You Can Edit for Each Page**:
- Title
- Description
- SEO Settings:
  - Meta Title (optional)
  - Meta Description (optional)
  - No Index flag (prevents search engine indexing)
- Page Content (Markdown body)

**Files**: `src/content/pages/*.md`

**Use Case**: For creating additional content pages like Privacy Policy, Terms of Service, etc.

---

## 📸 Media Management

**Upload Location**: `public/uploads/`
**Public URL**: `/uploads/filename.ext`

**How to Upload Images**:
1. Click any "Image" field in the CMS
2. Click "Choose an image"
3. Either:
   - Select from previously uploaded images, or
   - Click "Upload" to add a new image

**Supported Formats**: JPG, PNG, GIF, SVG, WebP

**Best Practices**:
- Use descriptive filenames (e.g., `testimonial-john-doe.jpg`)
- Optimize images before uploading (recommended max width: 2000px)
- Always provide meaningful alt text for accessibility

---

## ✍️ Editorial Workflow

The CMS uses an **editorial workflow** with three states:

1. **Draft** - Work in progress, not visible on live site
2. **In Review** - Ready for review, still not published
3. **Ready** - Approved and will be published when merged

**How It Works**:
1. Make edits in the CMS
2. Click "Save" to save as draft
3. Click "Set status to 'In Review'" when ready
4. Review changes in the GitHub PR preview
5. Click "Set status to 'Ready'" when approved
6. Changes go live when the PR is merged to main

---

## 🔄 Saving and Publishing

**Save Draft**:
- Saves your work without publishing
- Creates a git branch with your changes
- You can come back and edit later

**Publish**:
- Creates or updates a Pull Request in GitHub
- Triggers a preview deployment
- Changes go live when PR is merged to `main`

**Preview Changes**:
- After saving, click "Check for Preview" to see your changes
- Preview URL will be shown in the PR

---

## 🎨 Markdown Editing

Several fields support Markdown for rich text formatting:

**Basic Syntax**:
- `**bold**` → **bold**
- `*italic*` → *italic*
- `[link text](URL)` → clickable link
- `# Heading` → Large heading
- `## Subheading` → Medium heading
- `- Item` → Bullet point

**The Markdown Editor provides**:
- Rich text toolbar
- Preview mode
- Syntax highlighting

---

## 🚀 Quick Start Checklist

**First-Time CMS Users**:

1. ✅ Navigate to `/admin` and authenticate with GitHub
2. ✅ Explore the "Site Pages" collection to edit homepage content
3. ✅ Try editing a service in the "Services" collection
4. ✅ Save as draft first, then review the preview
5. ✅ When confident, set status to "Ready" and publish

**Regular Editing Tasks**:

- **Update homepage headline**: Site Pages → Homepage → Hero Section
- **Add a new testimonial**: Testimonials → New Testimonial
- **Edit navigation**: Site Settings → Navigation
- **Update process steps**: Site Pages → Process Page
- **Add FAQ**: FAQ → New FAQ

---

## 🆘 Troubleshooting

**I don't see my changes on the live site**:
- Check that you clicked "Publish" (not just "Save")
- Verify the Pull Request was merged to `main`
- Allow 2-3 minutes for deployment

**The editor is slow or unresponsive**:
- Try refreshing the page
- Clear browser cache
- Check your internet connection

**I can't upload an image**:
- Verify file size is under 10MB
- Check that the file format is supported (JPG, PNG, GIF, SVG, WebP)
- Try a different browser

**My Markdown isn't rendering correctly**:
- Use the Preview tab to check formatting
- Ensure you're using correct Markdown syntax
- Check for unclosed formatting tags

---

## 📚 Additional Resources

- **Decap CMS Documentation**: https://decapcms.org/docs/
- **Markdown Guide**: https://www.markdownguide.org/basic-syntax/
- **Editorial Workflow**: https://decapcms.org/docs/configuration-options/#publish-mode

---

**Last Updated**: October 12, 2025
**CMS Version**: Decap CMS 3.8.4 (self-hosted)
