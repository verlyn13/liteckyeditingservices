# Images, Favicons, and Icons

Purpose: document the single sources of truth, file locations, and the build + wiring for site icons and images.

Last verified: 2025-10-12

## Overview

- Main site logo (on-page): `public/images/les-logo.png` (1024×1024 PNG)
- Icon source (simplified, with baked-in padding): `public/icons/logo.svg`
- Generated outputs (favicons + PWA icons):
  - `public/icons/favicon.ico` (multi-resolution 16–256)
  - `public/icons/icon-{16,32,48,64,180,192,256,384,512}.png`
  - `public/site.webmanifest` (references 192 and 512 PNGs)

## Where it’s wired

- Head links and manifest: `src/layouts/BaseLayout.astro:35`
  - Serves the existing `public/favicon.svg` plus `.ico` + PNGs
  - Adds `<link rel="manifest" href="/site.webmanifest" />` and `<meta name="theme-color" ... />`

## Build Pipeline (ImageMagick)

- Script: `scripts/build-icons.sh`
- Command: `pnpm icons:build`
  - Sets `PADDING_PCT=6` to respect the icon SVG’s existing internal padding
  - Renders a large 1024×1024 master with transparency, then downsamples with a Triangle filter + light unsharp for crisp small sizes
  - Optionally runs `oxipng` and `pngquant` if installed

Requirements:
- ImageMagick (`magick` CLI)
- Optional optimizers: `svgo`, `oxipng`, `pngquant` (script will gracefully skip if missing)

Notes:
- The icon SVG has baked-in padding; additional pipeline padding is intentionally small (`6%`) to avoid double-safe-area look.
- Some legacy images (e.g., `images/les-logo3.png` at 294×273) are small and will blur if upscaled; they are not referenced.

## Source of Truth

- On-page logo: update `public/images/les-logo.png` (keep 1024×1024 or higher, transparent if needed)
- Icons: update `public/icons/logo.svg` (simplified mark)

After updating sources, rebuild icons:

```
pnpm icons:build
```

## PWA Manifest

- File: `public/site.webmanifest`
- Declares 192×192 and 512×512 icons for PWA usage and sets theme color to match brand navy.

## Design Guidance

- Keep the header as text-first for clarity and accessibility; consider optional small mark placement only if it remains balanced and legible (e.g., a 24–32px square mark left of the site name).
- Maintain generous padding in the SVG for maskable/rounded shapes on various platforms.
- Avoid thin strokes and intricate details that disappear at 16×16.

## Troubleshooting

- SVGO errors on complex SVGs: script will fall back to the original SVG automatically.
- Blurry icons: verify small sizes (16, 32) directly; adjust `PADDING_PCT` slightly or simplify the SVG if details vanish.
- Browser caching: after regeneration, hard-refresh or bust caches to see updates.

## Quick Verify Checklist

- Favicon looks centered and sharp at 16/32 in the browser tab.
- Apple touch icon (180×180) displays with correct safe padding on iOS.
- PWA manifest is served and valid; icons load (`/site.webmanifest`).
- Main on-page logo renders crisp; no upscaling beyond native size.

