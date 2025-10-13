// Bundle @sentry/browser for the admin shell as a self-hosted script
// Outputs: public/admin/sentry.browser.bundle.js (IIFE exposing window.Sentry)
import { build } from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const outFile = path.join(root, 'public', 'admin', 'sentry.browser.bundle.js');

await build({
  entryPoints: ['@sentry/browser'],
  bundle: true,
  platform: 'browser',
  format: 'iife',
  globalName: 'Sentry',
  outfile: outFile,
  sourcemap: false,
  minify: true,
  target: ['es2021'],
});

console.log(`[sentry-admin] Wrote ${path.relative(root, outFile)}`);

