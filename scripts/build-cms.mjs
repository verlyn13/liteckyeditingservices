#!/usr/bin/env node
import { build } from 'esbuild';

await build({
  entryPoints: ['src/admin/cms.ts'],
  outfile: 'public/admin/cms.js',
  bundle: true,
  format: 'iife',
  target: ['es2024'],
  platform: 'browser',
  sourcemap: false,
  minify: true,
  external: ['node:*'],
});
console.log('[build] cms -> public/admin/cms.js');
