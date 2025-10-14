# Assets and Images - Modern Standards Guide

**Last Updated:** 2025-10-13
**Status:** Comprehensive asset system documentation

## Table of Contents

1. [Overview](#overview)
2. [Asset Types and Locations](#asset-types-and-locations)
3. [Icon System](#icon-system)
4. [Content Images](#content-images)
5. [Astro Image Component](#astro-image-component)
6. [Image Optimization](#image-optimization)
7. [Responsive Images](#responsive-images)
8. [Performance Best Practices](#performance-best-practices)
9. [CDN and Caching](#cdn-and-caching)
10. [Accessibility](#accessibility)
11. [Troubleshooting](#troubleshooting)

---

## Overview

This document defines the complete asset management system for Litecky Editing Services, following modern web standards for performance, accessibility, and user experience.

### Key Principles

1. **Automated Optimization** - Use build-time optimization for all images
2. **Modern Formats** - Serve WebP/AVIF with fallbacks
3. **Responsive Images** - Appropriate sizes for all devices
4. **Performance First** - Lazy loading, proper dimensions, optimized delivery
5. **Accessibility** - Semantic alt text, proper ARIA labels
6. **Source Control** - Track original high-quality sources

---

## Asset Types and Locations

### Directory Structure

```
public/
├── images/              # Content images (manually optimized)
│   ├── les-logo.png     # Main logo (1024×1024, source of truth)
│   └── editor-workspace.svg  # Hero image
├── icons/               # Generated icon files
│   ├── logo.svg         # Icon source (simplified mark)
│   ├── master-1024.png  # Generated master
│   ├── icon-{size}.png  # Generated icon sizes
│   └── favicon.ico      # Multi-resolution favicon
└── favicon.svg          # Legacy (not actively used)

src/
└── images/              # Source images for Astro Image component
    └── (currently unused - to be implemented)

_assets/                 # Build output directory (hashed filenames)
```

### Asset Types

| Type | Location | Optimization | Format |
|------|----------|-------------|--------|
| **Icons/Favicons** | `public/icons/` | Automated via script | PNG, ICO |
| **Logo** | `public/images/les-logo.png` | Manual | PNG with transparency |
| **Hero Images** | `public/images/` | Manual (SVG preferred) | SVG, PNG, WebP |
| **Content Images** | `src/images/` (future) | Astro Image | All formats |
| **CMS Uploads** | `public/uploads/` | Manual/CMS | Various |

---

## Icon System

### Overview

The icon system generates all required favicon and PWA icon sizes from a single source file using an automated ImageMagick pipeline.

### Icon Pipeline

**Script:** `scripts/build-icons.sh`
**Command:** `pnpm icons:build`

#### Supported Source Formats

- **SVG** (recommended): Vector graphics with automatic optimization via SVGO
- **PNG**: Raster graphics (minimum 512×512 recommended)
- **JPG/WebP**: Supported but PNG preferred for transparency

#### Configuration

```bash
# Environment variables
ICON_SRC=public/icons/logo.svg  # Source file (SVG or PNG)
PADDING_PCT=6                    # Visual safe area (default: 12%)
BASE_SIZE=1024                   # Master resolution

# Run build
ICON_SRC=public/icons/source.png pnpm icons:build
```

#### Generated Outputs

```
public/icons/
├── favicon.ico              # Multi-resolution: 16,32,48,64,128,256
├── icon-16.png              # Browser tab
├── icon-32.png              # Browser tab (HiDPI)
├── icon-48.png              # Desktop shortcut
├── icon-64.png              # Desktop shortcut (HiDPI)
├── icon-180.png             # Apple Touch Icon
├── icon-192.png             # PWA (standard)
├── icon-256.png             # Windows tiles
├── icon-384.png             # PWA (intermediate)
├── icon-512.png             # PWA (high-res)
└── master-1024.png          # Source master
```

#### Pipeline Details

1. **Sanitization** - SVGO optimization (if SVG source)
2. **Master Render** - 1024×1024 at high density (768 DPI)
3. **Padding Application** - Configurable visual safe area
4. **Multi-Resolution** - Triangle filter downscaling with light unsharp
5. **Optimization** - oxipng (lossless) + pngquant (perceptual, 70-95% quality)

#### Favicon Integration

**File:** `src/layouts/BaseLayout.astro`

```astro
<!-- Favicon and PWA Icons -->
<link rel="icon" type="image/x-icon" href="/icons/favicon.ico" sizes="16x16 32x32 48x48" />
<link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
<link rel="icon" type="image/png" sizes="48x48" href="/icons/icon-48.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png" />
<link rel="manifest" href="/site.webmanifest" />
```

#### PWA Manifest

**File:** `public/site.webmanifest`

```json
{
  "name": "Litecky Editing Services",
  "short_name": "Litecky",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "theme_color": "#1e3a8a",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

### Icon Design Guidelines

#### Visual Requirements

- **Minimum size:** 512×512px (for raster sources)
- **Safe area:** 80-85% of canvas (icons get further padding in pipeline)
- **Simplicity:** Avoid fine details that disappear at 16×16
- **Contrast:** Ensure visibility on light and dark backgrounds
- **Transparency:** Use PNG with alpha channel for non-square marks

#### Testing Checklist

- [ ] 16×16 favicon clear in browser tab
- [ ] 32×32 favicon sharp on HiDPI displays
- [ ] 180×180 Apple Touch Icon has proper padding
- [ ] 192×192 PWA icon displays correctly
- [ ] 512×512 PWA icon renders without artifacts
- [ ] Maskable icons work with circular/rounded masks
- [ ] Icons visible on both light and dark OS themes

---

## Content Images

### Current Implementation

Content images are currently stored in `public/images/` and referenced directly with `<img>` tags.

**Example (Current):**
```astro
<img
  src="/images/editor-workspace.svg"
  alt="Professional academic editor at work"
  class="h-full w-full object-cover"
  loading="eager"
/>
```

### Future: Astro Image Component

**Status:** Planned but not yet implemented

The modern approach uses Astro's `<Image />` component for automatic optimization.

**Example (Planned):**
```astro
---
import { Image } from 'astro:assets';
import heroImage from '../images/editor-workspace.png';
---

<Image
  src={heroImage}
  alt="Professional academic editor at work"
  width={1200}
  height={900}
  format="webp"
  quality={85}
  loading="eager"
  class="h-full w-full object-cover"
/>
```

---

## Astro Image Component

### Configuration

**File:** `astro.config.mjs`

```javascript
export default defineConfig({
  image: {
    domains: [],
    remotePatterns: [{ protocol: 'https' }],
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 268402689,  // ~16384×16384
      },
    },
  },
});
```

### Usage Patterns

#### Local Images (Type-Safe)

```astro
---
import { Image } from 'astro:assets';
import logo from '../images/logo.png';
---

<Image
  src={logo}
  alt="Company logo"
  width={200}
  height={200}
  format="webp"
  quality={90}
/>
```

#### Remote Images

```astro
---
import { Image } from 'astro:assets';
---

<Image
  src="https://example.com/image.jpg"
  alt="Remote image"
  width={800}
  height={600}
  inferSize
/>
```

#### Public Directory Images

For images in `public/`, use regular `<img>` tags or the `<Image />` component with public paths:

```astro
<img src="/images/logo.png" alt="Logo" width="200" height="200" />
```

### Image Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string \| ImageMetadata | required | Image source |
| `alt` | string | required | Alternative text |
| `width` | number | - | Output width (px) |
| `height` | number | - | Output height (px) |
| `format` | 'webp' \| 'avif' \| 'png' \| 'jpg' | 'webp' | Output format |
| `quality` | number | 80 | Quality (0-100) |
| `loading` | 'lazy' \| 'eager' | 'lazy' | Loading strategy |
| `decoding` | 'async' \| 'sync' \| 'auto' | 'async' | Decode timing |
| `inferSize` | boolean | false | Infer from source |
| `densities` | number[] | [1, 2] | Pixel densities |
| `widths` | number[] | - | Generate srcset |

---

## Image Optimization

### Build-Time Optimization

Astro automatically optimizes images at build time using Sharp:

1. **Format Conversion** - Converts to modern formats (WebP, AVIF)
2. **Resizing** - Generates multiple sizes for responsive images
3. **Compression** - Optimizes file size while maintaining quality
4. **Hashing** - Generates cache-friendly filenames

### Manual Optimization Tools

For images in `public/` directory:

#### PNG Optimization

```bash
# Lossless compression
oxipng -o6 --strip all image.png

# Perceptual compression (lossy but smaller)
pngquant --quality 70-95 --strip --speed 1 image.png
```

#### JPEG Optimization

```bash
# Using ImageMagick
magick image.jpg -strip -quality 85 image-optimized.jpg

# Using mozjpeg
cjpeg -quality 85 -progressive image.jpg > image-optimized.jpg
```

#### WebP Conversion

```bash
# From PNG/JPEG
magick image.png -define webp:lossless=false -quality 85 image.webp

# Lossless WebP
magick image.png -define webp:lossless=true image.webp
```

#### AVIF Conversion

```bash
# From PNG/JPEG (requires ImageMagick with AVIF support)
magick image.png -quality 75 image.avif
```

### Optimization Guidelines

| Image Type | Format | Quality | Max Size |
|------------|--------|---------|----------|
| **Icons** | PNG | Lossless | 50KB |
| **Logos** | PNG/SVG | Lossless | 100KB |
| **Hero Images** | WebP | 85% | 500KB |
| **Content Images** | WebP | 80% | 300KB |
| **Thumbnails** | WebP | 75% | 100KB |
| **Backgrounds** | WebP/AVIF | 70% | 200KB |

---

## Responsive Images

### Using `srcset` and `sizes`

```astro
<img
  src="/images/hero-800.webp"
  srcset="
    /images/hero-400.webp 400w,
    /images/hero-800.webp 800w,
    /images/hero-1200.webp 1200w,
    /images/hero-1600.webp 1600w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 90vw,
    1200px
  "
  alt="Hero image"
  loading="lazy"
/>
```

### Using `<picture>` for Art Direction

```astro
<picture>
  <source
    media="(min-width: 1024px)"
    srcset="/images/hero-desktop.webp"
    type="image/webp"
  />
  <source
    media="(min-width: 640px)"
    srcset="/images/hero-tablet.webp"
    type="image/webp"
  />
  <source
    srcset="/images/hero-mobile.webp"
    type="image/webp"
  />
  <img
    src="/images/hero-mobile.jpg"
    alt="Hero image"
    loading="lazy"
  />
</picture>
```

### With Astro Image Component

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../images/hero.png';
---

<Image
  src={heroImage}
  alt="Hero image"
  widths={[400, 800, 1200, 1600]}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
  format="webp"
  loading="lazy"
/>
```

---

## Performance Best Practices

### Loading Strategies

#### Above-the-Fold Images

Use `loading="eager"` and high priority:

```astro
<img
  src="/images/hero.webp"
  alt="Hero"
  loading="eager"
  fetchpriority="high"
/>
```

#### Below-the-Fold Images

Use lazy loading (default):

```astro
<img
  src="/images/content.webp"
  alt="Content"
  loading="lazy"
/>
```

### Dimensions and Aspect Ratio

Always specify width and height to prevent layout shift:

```astro
<!-- Explicit dimensions -->
<img src="/image.webp" width="800" height="600" alt="..." />

<!-- Or use aspect-ratio CSS -->
<img
  src="/image.webp"
  alt="..."
  class="w-full"
  style="aspect-ratio: 16/9;"
/>
```

### Image Sizing Guidelines

| Viewport | Max Width | Recommended Sizes |
|----------|-----------|-------------------|
| **Mobile** | 640px | 400, 640, 800 |
| **Tablet** | 1024px | 800, 1024, 1280 |
| **Desktop** | 1920px | 1200, 1600, 1920 |
| **4K** | 3840px | 2560, 3200, 3840 |

### Performance Metrics

Target metrics for images:

- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

#### Optimization Checklist

- [ ] All images have explicit width/height
- [ ] Hero images use `loading="eager"` and `fetchpriority="high"`
- [ ] Below-fold images use `loading="lazy"`
- [ ] Images are served in modern formats (WebP/AVIF)
- [ ] Responsive images use srcset for multiple sizes
- [ ] Images are compressed (quality 70-85%)
- [ ] No images larger than necessary for viewport
- [ ] Alt text provided for all content images

---

## CDN and Caching

### Cloudflare Pages CDN

All static assets are automatically served through Cloudflare's global CDN.

#### Cache Headers

**File:** `public/_headers`

```
/_assets/*
  Cache-Control: public, max-age=31536000, immutable

/icons/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=2592000
```

### Cache Purging

When updating images in `public/`:

```bash
# Purge specific files
gh workflow run cms-content-sync.yml -f purge_type=urls -f purge_items='/images/logo.png'

# Purge prefix
gh workflow run cms-content-sync.yml -f purge_type=prefixes -f purge_items='/images/'

# Purge all content
gh workflow run cms-content-sync.yml -f purge_type=content
```

### Cache Strategy

| Asset Type | Cache Duration | Strategy |
|------------|----------------|----------|
| **Hashed Assets** (`_assets/`) | 1 year | Immutable |
| **Icons** | 1 year | Immutable (after rebuild) |
| **Images** | 30 days | Versioned URLs recommended |
| **CMS Uploads** | 30 days | Purge on update |

---

## Accessibility

### Alt Text Guidelines

#### Decorative Images

```astro
<img src="/decorative.webp" alt="" role="presentation" />
```

#### Informative Images

```astro
<img
  src="/chart.webp"
  alt="Bar chart showing 95% customer satisfaction rate over 20 years"
/>
```

#### Functional Images

```astro
<a href="/contact">
  <img src="/email-icon.svg" alt="Contact us" />
</a>
```

### Color Contrast

Ensure text over images meets WCAG AA standards:

- **Normal text**: 4.5:1 contrast ratio
- **Large text**: 3:1 contrast ratio

Use overlays or filters when necessary:

```astro
<div class="relative">
  <img src="/background.webp" alt="" role="presentation" />
  <div class="absolute inset-0 bg-black/40"></div>
  <div class="relative z-10 text-white">Content</div>
</div>
```

### ARIA Labels

For complex images:

```astro
<figure role="img" aria-label="Organizational structure diagram">
  <img src="/diagram.webp" alt="" />
  <figcaption class="sr-only">
    Detailed description of the organizational structure...
  </figcaption>
</figure>
```

---

## Troubleshooting

### Icons

**Problem:** Blurry icons at small sizes
**Solution:** Simplify source SVG, reduce fine details, or provide larger source image

**Problem:** Icons have wrong padding
**Solution:** Adjust `PADDING_PCT` environment variable

**Problem:** Build script fails
**Solution:** Ensure ImageMagick is installed: `magick --version`

### Images

**Problem:** Images loading slowly
**Solution:**
- Check file size (should be < 500KB)
- Convert to WebP format
- Use responsive images with srcset

**Problem:** Layout shift when images load
**Solution:** Always specify width and height attributes

**Problem:** Images not optimized
**Solution:** Use Astro Image component instead of plain `<img>` tags

### Build Errors

**Problem:** `limitInputPixels` exceeded
**Solution:** Reduce source image size or increase limit in astro.config.mjs

**Problem:** Sharp errors during build
**Solution:** Ensure Sharp is installed: `pnpm add sharp`

---

## Quick Reference Commands

```bash
# Icon generation
pnpm icons:build                                    # Build from default source
ICON_SRC=path/to/image.png pnpm icons:build       # Build from custom source
PADDING_PCT=8 pnpm icons:build                     # Custom padding

# Image optimization
oxipng -o6 --strip all image.png                   # Optimize PNG
pngquant --quality 70-95 image.png                 # Compress PNG
magick image.jpg -quality 85 out.webp              # Convert to WebP

# Cache management
gh workflow run cms-content-sync.yml -f purge_type=content    # Purge content cache
gh workflow run cms-content-sync.yml -f purge_type=everything  # Purge all

# Development
pnpm dev                                            # Start dev server
pnpm build && pnpm preview                          # Preview production build
```

---

## Related Documentation

- `docs/assets-images-icons.md` - Original icon documentation (legacy)
- `IMPLEMENTATION-ROADMAP.md` - Project implementation status
- `CACHING-STRATEGY.md` - CDN and caching details
- Astro Image Docs: https://docs.astro.build/en/guides/images/

---

## Changelog

- **2025-10-13** - Comprehensive modern standards documentation created
- **2025-10-12** - Icon pipeline updated to support PNG sources
- **2025-10-11** - Initial icon documentation
