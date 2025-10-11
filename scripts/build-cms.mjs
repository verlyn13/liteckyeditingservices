#!/usr/bin/env node
import { build } from 'esbuild';

await build({
  entryPoints: ['src/admin/cms.ts'],
  outfile: 'public/admin/cms.js',
  bundle: true,
  format: 'iife',
  target: ['es2025'],
  sourcemap: false,
  minify: true,
});
console.log('[build] cms -> public/admin/cms.js');
