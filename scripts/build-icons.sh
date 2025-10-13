#!/usr/bin/env bash
set -euo pipefail

# ImageMagick-based icon pipeline
# Usage: ./scripts/build-icons.sh path/to/logo.svg public/icons

SRC_SVG="${1:-public/icons/logo.svg}"
OUTDIR="${2:-public/icons}"
PADDING_PCT="${PADDING_PCT:-12}"    # % inset (visual safe area)
BASE_SIZE="${BASE_SIZE:-1024}"      # render master at 1024x1024 for quality

# Core sizes (tweak as you like)
SIZES=(16 32 48 64 180 192 256 384 512)

mkdir -p "$OUTDIR"

echo ">> 1) Sanitize/normalize SVG (SVGO)"
if command -v svgo >/dev/null 2>&1; then
  svgo --multipass -o "$OUTDIR/logo.norm.svg" "$SRC_SVG" >/dev/null 2>&1 || true
  if [ -s "$OUTDIR/logo.norm.svg" ]; then
    SRC="$OUTDIR/logo.norm.svg"
  else
    echo "   SVGO failed; using original SVG."
    SRC="$SRC_SVG"
  fi
else
  echo "   SVGO not found; using original SVG."
  SRC="$SRC_SVG"
fi

# Helpers:
# - Render a master square with padding.
# - Use high density, controlled filter for crisp downscales.
# - Keep transparency; strip metadata.
MASTER="$OUTDIR/master-${BASE_SIZE}.png"
PAD_PX="$(python3 - <<EOF
import math; print(int(${BASE_SIZE}*${PADDING_PCT}/100))
EOF
)"

echo ">> 2) Render master ${BASE_SIZE}x${BASE_SIZE} with ${PADDING_PCT}% padding"
# Step A: rasterize SVG to a large square (temporarily without padding)
magick -background none -density 768 "$SRC" -resize ${BASE_SIZE}x${BASE_SIZE} \
  -strip PNG32:"$OUTDIR/_temp.png"

# Step B: fit artwork into padded box (centered extent)
# We scale down to (100 - PADDING_PCT)% and then extent to full size.
INNER=$(( BASE_SIZE - 2*PAD_PX ))
magick "$OUTDIR/_temp.png" -filter Triangle -define filter:blur=0.985 \
  -resize ${INNER}x${INNER} \
  -gravity center -background none -extent ${BASE_SIZE}x${BASE_SIZE} \
  -strip PNG32:"$MASTER"

rm -f "$OUTDIR/_temp.png"

echo ">> 3) Produce PNG sizes"
for s in "${SIZES[@]}"; do
  magick "$MASTER" -filter Triangle -define filter:blur=0.985 \
    -resize ${s}x${s} -unsharp 0.5x0.5+0.5+0 \
    -strip PNG32:"$OUTDIR/icon-${s}.png"
done

echo ">> 4) Build multi-resolution favicon.ico"
# Note: start from the master to avoid cumulative resampling.
magick "$MASTER" -filter Triangle -define filter:blur=0.985 \
  -define icon:auto-resize=256,128,64,48,32,16 \
  -strip "$OUTDIR/favicon.ico"

echo ">> 5) Optimize PNGs (lossless + perceptual)"
if command -v oxipng >/dev/null 2>&1; then
  oxipng -o6 --strip all "$OUTDIR"/icon-*.png >/dev/null || true
fi
if command -v pngquant >/dev/null 2>&1; then
  pngquant --skip-if-larger --strip --speed 1 --quality 70-95 \
    --ext .png --force "$OUTDIR"/icon-*.png >/dev/null || true
fi

echo ">> Done. Outputs in: $OUTDIR"
echo "   - favicon.ico (multi-size)"
echo "   - icon-{16,32,48,64,180,192,256,384,512}.png"
