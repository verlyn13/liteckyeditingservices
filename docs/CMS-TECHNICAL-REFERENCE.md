# Decap CMS Technical Reference

## Architecture Overview

This document explains the technical implementation of the Decap CMS configuration for developers.

---

## Configuration Structure

### Dynamic Configuration

**File**: `functions/admin/config.yml.ts`

The CMS configuration is **dynamically generated** as a Cloudflare Pages Function. This allows:
- Origin-aware `base_url` for both dev and production
- Environment-specific OAuth endpoints
- Single configuration source for all environments

**Key Features**:
- Auto-discovery mode (`CMS.init()` with no params)
- Editorial workflow enabled
- Media stored in `public/uploads/`

---

## Collections Architecture

### File Collections vs. Folder Collections

**File Collections** (`files:` array within a collection):
- Used for unique, one-off pages
- Each file has custom field structure
- Examples: Homepage, About, Settings

**Folder Collections** (standard collection type):
- Used for repeatable content
- All items share the same field structure
- Examples: Services, Testimonials, FAQ

---

## Content Schema (Astro)

**File**: `src/content/config.ts`

Defines TypeScript schemas for all content collections using Zod.

**Collection Types**:

1. **`sitePages`** - JSON-based unique pages (type: `data`)
2. **`settings`** - JSON-based configuration (type: `data`)
3. **`pages`** - Markdown generic pages (type: `content`)
4. **`services`** - Markdown service descriptions (type: `content`)
5. **`testimonials`** - Markdown testimonials (type: `content`)
6. **`faq`** - Markdown FAQ entries (type: `content`)

**Schema Union Types**:
- `sitePages` uses `z.union([...])` to handle different page schemas
- `settings` uses `z.union([...])` for general vs navigation settings

---

## CMS Collections Configuration

### 🏠 Site Pages

```yaml
- name: "site_pages"
  label: "🏠 Site Pages"
  files:
    - name: "homepage"
      file: "content/pages/home.json"
      fields: [...]
    - name: "about"
      file: "content/pages/about.json"
      fields: [...]
    - name: "process"
      file: "content/pages/process.json"
      fields: [...]
```

**Storage**: JSON files in `content/pages/`
**Access**: `import { getEntry } from 'astro:content'`

### ⚙️ Site Settings

```yaml
- name: "settings"
  label: "⚙️ Site Settings"
  files:
    - name: "general"
      file: "content/settings/general.json"
    - name: "navigation"
      file: "content/settings/navigation.json"
```

**Storage**: JSON files in `content/settings/`
**Purpose**: Site-wide configuration

### 📁 Content Collections

Standard folder collections for repeatable content:

```yaml
- name: "services"
  folder: "src/content/services"
  extension: "md"
  format: "frontmatter"

- name: "testimonials"
  folder: "src/content/testimonials"
  extension: "md"

- name: "faq"
  folder: "src/content/faq"
  extension: "md"

- name: "pages"
  folder: "src/content/pages"
  extension: "md"
```

---

## Widget Reference

### Field Widgets Used

| Widget       | Purpose                          | Example Use                |
|--------------|----------------------------------|----------------------------|
| `string`     | Single-line text input           | Titles, names, short text  |
| `text`       | Multi-line textarea              | Descriptions, paragraphs   |
| `markdown`   | Rich text editor                 | Page body content          |
| `image`      | Image uploader                   | Photos, logos, graphics    |
| `list`       | Repeatable list of items         | Features, steps, nav links |
| `object`     | Group of related fields          | Hero section, CTAs         |
| `number`     | Numeric input                    | Order, rating              |
| `boolean`    | Toggle switch                    | Featured flag              |
| `datetime`   | Date/time picker                 | Testimonial date           |
| `select`     | Dropdown menu                    | FAQ category               |

---

## Data Flow

### 1. CMS Edit → Git Commit

```
User edits in CMS
  ↓
CMS creates/updates JSON or Markdown file
  ↓
Changes committed to git branch
  ↓
Pull Request created in GitHub
```

### 2. Build Time → Data Access

```
Astro build starts
  ↓
Content collections parsed and validated
  ↓
Components import data via getEntry/getCollection
  ↓
Static pages generated
```

### 3. Accessing Content in Astro

**For JSON-based collections** (sitePages, settings):
```typescript
import { getEntry } from 'astro:content';

// Homepage data
const homeData = await getEntry('sitePages', 'home');
const { hero, trustBar } = homeData.data;

// Settings
const navData = await getEntry('settings', 'navigation');
const { headerNav } = navData.data;
```

**For Markdown collections** (services, testimonials, FAQ):
```typescript
import { getCollection } from 'astro:content';

// All services
const services = await getCollection('services');
const sortedServices = services.sort((a, b) => a.data.order - b.data.order);

// Featured testimonials
const featured = await getCollection('testimonials',
  ({ data }) => data.featured === true
);
```

---

## File Structure

```
content/
├── pages/              # JSON-based unique pages
│   ├── home.json      # Homepage content
│   ├── about.json     # About page content
│   └── process.json   # Process page content
└── settings/          # JSON-based site configuration
    ├── general.json   # Site-wide settings
    └── navigation.json # Nav menus

src/content/
├── pages/             # Markdown generic pages
├── services/          # Markdown service descriptions
├── testimonials/      # Markdown testimonials
└── faq/               # Markdown FAQ entries

public/uploads/        # CMS-uploaded media files
```

---

## Integration Examples

### Example 1: Using Homepage Data

**File**: `src/pages/index.astro`

```astro
---
import { getEntry } from 'astro:content';
import Hero from '../components/Hero.astro';

const home = await getEntry('sitePages', 'home');
const { hero, trustBar, processSnapshot, featuredTestimonial } = home.data;
---

<Hero
  title={hero.title}
  subtitle={hero.subtitle}
  primaryCta={hero.primaryCta}
  secondaryCta={hero.secondaryCta}
  statsBadge={hero.statsBadge}
/>

<TrustBar
  tagline={trustBar.tagline}
  logos={trustBar.logos}
/>
```

### Example 2: Using Settings Data

**File**: `src/components/Header.astro`

```astro
---
import { getEntry } from 'astro:content';

const nav = await getEntry('settings', 'navigation');
const { headerNav } = nav.data;

// Sort by order field
const sortedNav = headerNav.sort((a, b) => a.order - b.order);
---

<nav>
  {sortedNav.map(link => (
    <a href={link.href}>{link.label}</a>
  ))}
</nav>
```

### Example 3: Using Folder Collections

**File**: `src/pages/services.astro`

```astro
---
import { getCollection } from 'astro:content';

const services = await getCollection('services');
const sorted = services.sort((a, b) => a.data.order - b.data.order);
---

{sorted.map(service => (
  <article>
    <h2>{service.data.title}</h2>
    <p>{service.data.description}</p>
    <ul>
      {service.data.features.map(f => <li>{f}</li>)}
    </ul>
    <div set:html={service.body} />
  </article>
))}
```

---

## Adding New Collections

### To Add a New File Collection

1. **Update `functions/admin/config.yml.ts`**:

```typescript
- name: "new_page"
  label: "New Page"
  file: "content/pages/new-page.json"
  fields:
    - { label: "Title", name: "title", widget: "string" }
    - { label: "Content", name: "content", widget: "markdown" }
```

2. **Update `src/content/config.ts`**:

```typescript
const sitePages = defineCollection({
  type: 'data',
  schema: z.union([
    // ... existing schemas ...
    z.object({
      title: z.string(),
      content: z.string(),
    }),
  ]),
});
```

3. **Create initial data file**:

```bash
mkdir -p content/pages
echo '{"title":"New Page","content":""}' > content/pages/new-page.json
```

### To Add a New Folder Collection

1. **Update `functions/admin/config.yml.ts`**:

```yaml
- name: "blog"
  label: "📝 Blog Posts"
  folder: "src/content/blog"
  create: true
  fields:
    - { label: "Title", name: "title", widget: "string" }
    - { label: "Date", name: "date", widget: "datetime" }
    - { label: "Body", name: "body", widget: "markdown" }
```

2. **Update `src/content/config.ts`**:

```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});

export const collections = { ..., blog };
```

3. **Create folder**:

```bash
mkdir -p src/content/blog
```

---

## OAuth Configuration

**Endpoints**:
- Auth start: `/api/auth`
- Callback: `/api/callback`
- Token exchange: `/api/exchange-token` (fallback)

**Flow**:
1. User clicks "Login with GitHub" in `/admin`
2. Redirected to `/api/auth` (sets state cookie, redirects to GitHub)
3. GitHub redirects to `/api/callback` with code
4. Callback exchanges code for token, posts to opener window
5. Admin receives token, persists to localStorage
6. User is authenticated and can edit content

**Configuration** (in `config.yml.ts`):
```yaml
backend:
  name: github
  repo: verlyn13/liteckyeditingservices
  branch: main
  base_url: ${origin}  # Dynamic - set per request
  auth_endpoint: /api/auth
```

---

## Media Upload Configuration

**Storage**: `public/uploads/`
**Public URL**: `/uploads/`
**Size Limit**: 10MB (Cloudflare Pages limit)

**Configuration**:
```yaml
media_folder: "public/uploads"
public_folder: "/uploads"
```

**Accessing in Components**:
```astro
<img src={logo.src} alt={logo.alt} />
<!-- Resolves to /uploads/logo.png -->
```

---

## Editorial Workflow

**Enabled**: Yes
**Publish Mode**: `editorial_workflow`

**States**:
1. **Draft** - Branch created, not in PR
2. **In Review** - PR created, not ready
3. **Ready** - PR ready to merge

**Git Flow**:
```
Draft → cms/collection-name/entry-name branch
In Review → Opens PR to main
Ready → PR approved and mergeable
Published → PR merged to main → Auto-deploy
```

---

## Troubleshooting

### CMS Shows "Config cannot be found"

**Cause**: Config endpoint not returning YAML
**Fix**: Verify `functions/admin/config.yml.ts` is deployed

### Fields Not Showing in CMS

**Cause**: YAML syntax error in config
**Fix**: Validate YAML syntax, check indentation

### Content Not Updating on Site

**Cause**: Build cache or content not committed
**Fix**: Rebuild Astro, verify git commit

### Schema Validation Errors

**Cause**: Mismatch between CMS config and Astro schema
**Fix**: Ensure `config.yml.ts` fields match `src/content/config.ts` schema

---

## Performance Considerations

**Build Time**:
- JSON collections load faster than Markdown
- Use JSON for simple structured data
- Use Markdown for rich content with formatting

**Content Query Optimization**:
```typescript
// ❌ Slow: Load all, filter in JS
const all = await getCollection('testimonials');
const featured = all.filter(t => t.data.featured);

// ✅ Fast: Filter at collection level
const featured = await getCollection('testimonials',
  ({ data }) => data.featured === true
);
```

---

## Security Notes

1. **Authentication**: GitHub OAuth with PKCE flow
2. **Authorization**: GitHub repo permissions control who can edit
3. **Content Validation**: Zod schemas validate all content at build time
4. **Media Uploads**: Stored in public folder, no server-side execution

---

**Last Updated**: October 12, 2025
**Configuration Version**: 2.0 (Comprehensive File + Folder Collections)
