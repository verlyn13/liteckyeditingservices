#!/usr/bin/env bash
# Start development server with Cloudflare Pages Functions support
# This builds the site and runs Wrangler to serve both static assets and Functions

set -e

echo "Building site..."
pnpm build

echo ""
echo "Starting Wrangler Pages dev server with Functions..."
echo "  - Site: http://localhost:4321"
echo "  - Functions: /api/* and /admin/config.yml will work"
echo ""
echo "Press Ctrl+C to stop"
echo ""

pnpm exec wrangler pages dev dist --port 4321 --local
