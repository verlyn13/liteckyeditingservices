/**
 * Cloudflare Pages Function for /admin/config.yml
 * Dynamically generates Decap CMS config with origin-aware base_url
 *
 * CRITICAL: base_url is REQUIRED when using external OAuth handlers.
 * Without it, Decap doesn't enter "external-auth" mode and won't process
 * the authorization:github:success postMessage events.
 *
 * References:
 * - https://decapcms.org/docs/backends-overview/
 * - https://github.com/vencax/netlify-cms-github-oauth-provider
 * - https://docs.cloud.gov/pages/using-pages/getting-started-with-netlify-cms/
 */

type Env = Record<string, never>;

interface EventContext<Env> {
  request: Request;
  env: Env;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, unknown>;
}

type PagesFunction<Env> = (context: EventContext<Env>) => Response | Promise<Response>;

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const origin = new URL(context.request.url).origin;

  try {
    console.log(
      JSON.stringify({
        evt: 'cms_config_emit',
        origin,
        path: '/admin/config.yml',
      })
    );
  } catch {}

  // Dynamic YAML config with origin-aware base_url for external auth mode
  const yaml = `backend:
  name: github
  repo: verlyn13/liteckyeditingservices
  branch: main
  base_url: ${origin}
  auth_endpoint: /api/auth

publish_mode: editorial_workflow

media_folder: "public/uploads"
public_folder: "/uploads"

# Site-wide settings editable in CMS
site_url: ${origin}
logo_url: ${origin}/favicon.svg

collections:
  # ========================================
  # 📄 UNIQUE PAGES (File Collections)
  # ========================================
  # These are single, specific pages with unique content structures

  - name: "site_pages"
    label: "🏠 Site Pages"
    label_singular: "Page"
    description: "Edit unique pages like Homepage, About, Process"
    files:
      # Homepage content
      - name: "homepage"
        label: "Homepage"
        file: "content/pages/home.json"
        description: "Homepage hero, taglines, and featured content"
        fields:
          # Hero Section
          - label: "Hero Section"
            name: "hero"
            widget: "object"
            fields:
              - { label: "Main Headline", name: "title", widget: "string", default: "Expert Academic Editing", hint: "Primary headline on homepage" }
              - { label: "Subtitle", name: "subtitle", widget: "text", default: "Expert academic editing for dissertations and theses. PhD-qualified editors, 2–3 day turnaround, secure and confidential." }
              - label: "Primary CTA"
                name: "primaryCta"
                widget: "object"
                fields:
                  - { label: "Text", name: "label", widget: "string", default: "Get Started" }
                  - { label: "Link", name: "href", widget: "string", default: "/contact" }
              - label: "Secondary CTA"
                name: "secondaryCta"
                widget: "object"
                fields:
                  - { label: "Text", name: "label", widget: "string", default: "View Services" }
                  - { label: "Link", name: "href", widget: "string", default: "/services" }
              - label: "Stats Badge"
                name: "statsBadge"
                widget: "object"
                fields:
                  - { label: "Primary Stat", name: "primary", widget: "string", default: "20+ Years Experience" }
                  - { label: "Secondary Stat", name: "secondary", widget: "string", default: "5,000+ Papers Edited" }

          # Trust Bar Section
          - label: "Trust Bar"
            name: "trustBar"
            widget: "object"
            fields:
              - { label: "Tagline", name: "tagline", widget: "string", default: "Trusted by scholars from" }
              - label: "University Logos"
                name: "logos"
                widget: "list"
                required: false
                fields:
                  - { label: "Logo Image", name: "src", widget: "image" }
                  - { label: "University Name", name: "alt", widget: "string" }

          # Process Snapshot Section
          - label: "Process Snapshot"
            name: "processSnapshot"
            widget: "object"
            fields:
              - label: "Steps"
                name: "steps"
                widget: "list"
                min: 3
                max: 3
                fields:
                  - { label: "Step Title", name: "title", widget: "string" }
                  - { label: "Step Description", name: "body", widget: "text" }

          # Featured Testimonial
          - label: "Featured Testimonial"
            name: "featuredTestimonial"
            widget: "object"
            fields:
              - { label: "Quote", name: "quote", widget: "text" }
              - { label: "Author Name", name: "author", widget: "string" }
              - { label: "Author Role", name: "role", widget: "string" }

      # About Page content
      - name: "about"
        label: "About Page"
        file: "content/pages/about.json"
        description: "About page content and company information"
        fields:
          - { label: "Page Title", name: "title", widget: "string", default: "About" }
          - { label: "Meta Description", name: "description", widget: "text", default: "Academic editing grounded in clarity and care" }
          - { label: "Main Headline", name: "headline", widget: "string", default: "About Litecky Editing Services" }
          - { label: "Introduction", name: "intro", widget: "markdown", hint: "Main content for the about page" }
          - label: "Founder Information"
            name: "founder"
            widget: "object"
            required: false
            fields:
              - { label: "Name", name: "name", widget: "string", default: "Dr. Litecky" }
              - { label: "Credentials", name: "credentials", widget: "string", default: "PhD University" }
              - { label: "Years of Experience", name: "years", widget: "string", default: "20+" }
          - label: "Expertise Areas"
            name: "expertise"
            widget: "list"
            default: ["Academic Writing", "Dissertation Editing", "Thesis Editing", "APA Style", "MLA Style", "Chicago Style"]
            field: { label: "Area", name: "area", widget: "string" }

      # Process Page content
      - name: "process"
        label: "Process Page"
        file: "content/pages/process.json"
        description: "Detailed editing process steps"
        fields:
          - { label: "Page Title", name: "title", widget: "string", default: "The Process" }
          - { label: "Meta Description", name: "description", widget: "text", default: "A simple, predictable editing journey" }
          - { label: "Main Headline", name: "headline", widget: "string", default: "The Process" }
          - { label: "Intro Text", name: "intro", widget: "text", default: "A linear, stress-free experience. You'll always know what happens next." }
          - label: "Process Steps"
            name: "steps"
            widget: "list"
            min: 3
            fields:
              - { label: "Step Title", name: "title", widget: "string" }
              - { label: "Step Description", name: "description", widget: "text" }
              - { label: "Additional Info", name: "detail", widget: "string", hint: "Small detail text below description" }
              - { label: "Icon/Emoji", name: "icon", widget: "string", required: false }

  # ========================================
  # 🎨 SITE-WIDE SETTINGS (File Collection)
  # ========================================

  - name: "settings"
    label: "⚙️ Site Settings"
    description: "Global site configuration"
    files:
      - name: "general"
        label: "General Settings"
        file: "content/settings/general.json"
        fields:
          - { label: "Site Title", name: "siteTitle", widget: "string", default: "Litecky Editing Services" }
          - { label: "Site Description", name: "siteDescription", widget: "text", default: "Professional academic editing services for graduate students" }
          - { label: "Contact Email", name: "contactEmail", widget: "string", default: "contact@liteckyeditingservices.com" }
          - { label: "Phone Number", name: "phone", widget: "string", required: false }
          - label: "Social Media"
            name: "social"
            widget: "object"
            required: false
            fields:
              - { label: "Twitter", name: "twitter", widget: "string", required: false }
              - { label: "LinkedIn", name: "linkedin", widget: "string", required: false }
              - { label: "Facebook", name: "facebook", widget: "string", required: false }

      - name: "navigation"
        label: "Navigation"
        file: "content/settings/navigation.json"
        fields:
          - label: "Header Navigation"
            name: "headerNav"
            widget: "list"
            fields:
              - { label: "Link Text", name: "label", widget: "string" }
              - { label: "Link URL", name: "href", widget: "string" }
              - { label: "Order", name: "order", widget: "number", default: 0 }
          - label: "Footer Navigation"
            name: "footerNav"
            widget: "object"
            fields:
              - label: "Services Column"
                name: "services"
                widget: "list"
                fields:
                  - { label: "Link Text", name: "label", widget: "string" }
                  - { label: "Link URL", name: "href", widget: "string" }
              - label: "Company Column"
                name: "company"
                widget: "list"
                fields:
                  - { label: "Link Text", name: "label", widget: "string" }
                  - { label: "Link URL", name: "href", widget: "string" }
              - label: "Legal Column"
                name: "legal"
                widget: "list"
                fields:
                  - { label: "Link Text", name: "label", widget: "string" }
                  - { label: "Link URL", name: "href", widget: "string" }

  # ========================================
  # 📁 CONTENT COLLECTIONS (Folder Collections)
  # ========================================
  # These are groups of similar content items

  # Generic pages collection - matches src/content/config.ts schema
  - name: pages
    label: "📄 Pages"
    label_singular: "Page"
    folder: "src/content/pages"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{slug}}"
    editor:
      preview: false
    fields:
      - { label: "Title", name: "title", widget: "string", required: true }
      - { label: "Description", name: "description", widget: "text", required: false }
      - label: "SEO"
        name: "seo"
        widget: "object"
        required: false
        fields:
          - { label: "Meta Title", name: "metaTitle", widget: "string", required: false }
          - { label: "Meta Description", name: "metaDescription", widget: "text", required: false }
          - { label: "No Index", name: "noindex", widget: "boolean", default: false, required: false }
      - { label: "Body", name: "body", widget: "markdown", required: true }

  # Services collection - matches src/content/config.ts schema
  - name: services
    label: "💼 Services"
    label_singular: "Service"
    folder: "src/content/services"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{slug}}"
    sortable_fields: ['order', 'title']
    editor:
      preview: false
    fields:
      - { label: "Title", name: "title", widget: "string", required: true }
      - { label: "Description", name: "description", widget: "text", required: true }
      - { label: "Price", name: "price", widget: "string", required: false, hint: "e.g., Starting at $0.03/word" }
      - { label: "Features", name: "features", widget: "list", field: { label: "Feature", name: "feature", widget: "string" }, default: [] }
      - { label: "Order", name: "order", widget: "number", default: 0, hint: "Lower numbers appear first" }
      - { label: "Body", name: "body", widget: "markdown", required: true }

  # Testimonials collection - matches src/content/config.ts schema
  - name: testimonials
    label: "⭐ Testimonials"
    label_singular: "Testimonial"
    folder: "src/content/testimonials"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{year}}-{{month}}-{{author}}"
    summary: "{{author}} - {{university}}"
    sortable_fields: ['date', 'author', 'featured', 'rating']
    editor:
      preview: false
    fields:
      - { label: "Quote", name: "quote", widget: "text", required: true, hint: "Short testimonial quote" }
      - { label: "Author", name: "author", widget: "string", required: true }
      - { label: "Role", name: "role", widget: "string", required: false, hint: "e.g., PhD Candidate" }
      - { label: "University", name: "university", widget: "string", required: false }
      - { label: "Rating", name: "rating", widget: "number", default: 5, min: 1, max: 5, value_type: "int" }
      - { label: "Featured", name: "featured", widget: "boolean", default: false, hint: "Show on homepage" }
      - { label: "Date", name: "date", widget: "datetime", required: true }
      - { label: "Full Testimonial", name: "body", widget: "markdown", required: false, hint: "Extended testimonial content" }

  # FAQ collection - matches src/content/config.ts schema
  - name: faq
    label: "❓ FAQ"
    label_singular: "FAQ"
    folder: "src/content/faq"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{category}}-{{slug}}"
    summary: "{{category}}: {{question}}"
    sortable_fields: ['category', 'order']
    editor:
      preview: false
    fields:
      - { label: "Question", name: "question", widget: "string", required: true }
      - { label: "Answer", name: "answer", widget: "text", required: true, hint: "Brief answer (full answer goes in body)" }
      - label: "Category"
        name: "category"
        widget: "select"
        options: ["General", "Services", "Process", "Pricing", "Security"]
        default: "General"
      - { label: "Order", name: "order", widget: "number", default: 0, hint: "Lower numbers appear first" }
      - { label: "Detailed Answer", name: "body", widget: "markdown", required: true }
`;

  return new Response(yaml, {
    headers: {
      'Content-Type': 'text/yaml; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Config-Origin': origin, // Debug header
    },
  });
};
