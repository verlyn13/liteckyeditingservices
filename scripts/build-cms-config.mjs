#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const srcYaml = path.join(root, 'config', 'cms.config.yml');
const outTs = path.join(root, 'src', 'admin', 'cms-config.ts');

if (!fs.existsSync(srcYaml)) {
  console.error(`[cms-config] Missing ${srcYaml}`);
  process.exit(1);
}

const raw = fs.readFileSync(srcYaml, 'utf8');
const data = YAML.parse(raw);

// Minimal validation
const errors = [];
if (!data?.backend?.name) errors.push('backend.name required');
if (!data?.backend?.repo) errors.push('backend.repo required');
if (!data?.media_folder) errors.push('media_folder required');
if (!data?.public_folder) errors.push('public_folder required');
if (!Array.isArray(data?.collections) || data.collections.length === 0)
  errors.push('collections required');

if (errors.length) {
  console.error(`[cms-config] Invalid YAML:\n - ${errors.join('\n - ')}`);
  process.exit(1);
}

const header = '// Generated from config/cms.config.yml — do not edit manually\n';
const body = `export default ${JSON.stringify(data, null, 2)} as const;\n`;
fs.mkdirSync(path.dirname(outTs), { recursive: true });
fs.writeFileSync(outTs, header + body);
console.log('[cms-config] Wrote', path.relative(root, outTs));
