#!/usr/bin/env node
// Simple repo-side sanity: ensure media/public folders are aligned with config
import { existsSync, readFileSync, statSync } from 'node:fs';

function fail(msg) {
  console.error(`MEDIA PATHS CHECK: FAIL: ${msg}`);
  process.exit(1);
}
function ok(msg) {
  console.log(`MEDIA PATHS CHECK: OK: ${msg}`);
}

// 1) Folder existence: public/uploads should exist in repo
const mediaDir = 'public/uploads';
if (!existsSync(mediaDir))
  fail(`'${mediaDir}' not found. Create this directory or adjust media_folder.`);
const st = statSync(mediaDir);
if (!st.isDirectory()) fail(`'${mediaDir}' exists but is not a directory.`);
ok(`'${mediaDir}' directory exists`);

// 2) Config source of truth: ensure dynamic config emits the expected values (static assertion)
// We check the function files contain the expected strings to avoid network calls.
const adminCfg = readFileSync('functions/admin/config.yml.ts', 'utf8');
if (!/media_folder:\s*"public\/uploads"/.test(adminCfg))
  fail('functions/admin/config.yml.ts missing media_folder: "public/uploads"');
if (!/public_folder:\s*"\/uploads"/.test(adminCfg))
  fail('functions/admin/config.yml.ts missing public_folder: "/uploads"');
ok('functions/admin/config.yml.ts media/public folders OK');

const apiCfg = readFileSync('functions/api/config.yml.ts', 'utf8');
if (!/media_folder:\s*"public\/uploads"/.test(apiCfg))
  fail('functions/api/config.yml.ts missing media_folder: "public/uploads"');
if (!/public_folder:\s*"\/uploads"/.test(apiCfg))
  fail('functions/api/config.yml.ts missing public_folder: "/uploads"');
ok('functions/api/config.yml.ts media/public folders OK');

console.log('MEDIA PATHS CHECK: PASS');
