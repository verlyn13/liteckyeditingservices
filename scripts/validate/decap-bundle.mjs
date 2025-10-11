#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const adminIndex = path.join(root, 'public', 'admin', 'index.html');

let hasError = false;

if (!fs.existsSync(adminIndex)) {
  console.error('❌ Missing public/admin/index.html');
  process.exit(1);
}

const html = fs.readFileSync(adminIndex, 'utf8');

// Find decap bundle references
const scriptSrcRegex = /<script[^>]+src=["']([^"']+)["'][^>]*><\/script>/gi;
const matches = [];
let m;
while ((m = scriptSrcRegex.exec(html)) !== null) {
  matches.push(m[1]);
}

const decapRefs = matches.filter((src) => /decap-cms(\.min)?\.js/i.test(src));
const npmCmsRefs = matches.filter((src) => /\/admin\/cms\.js$/i.test(src));

if (npmCmsRefs.length === 1) {
  console.log('✅ NPM decap-cms-app delivery detected:', npmCmsRefs[0]);
} else if (decapRefs.length === 0) {
  console.error('❌ No decap-cms or npm cms.js referenced in public/admin/index.html');
  hasError = true;
} else if (decapRefs.length > 1) {
  console.error('❌ Multiple decap-cms bundle references found:');
  for (const ref of decapRefs) console.error('   - ' + ref);
  hasError = true;
} else {
  const ref = decapRefs[0];
  // Disallow CDN or wildcard versions
  const cdn = /(unpkg\.com|jsdelivr\.net|cdn\.)/i.test(ref) || /^https?:\/\//i.test(ref);
  const expected = '/vendor/decap/decap-cms.js';
  if (cdn) {
    console.error('❌ decap-cms bundle must be self-hosted, not CDN: ' + ref);
    hasError = true;
  } else if (!ref.startsWith(expected)) {
    console.error(`❌ decap-cms bundle must be ${expected}; found: ${ref}`);
    hasError = true;
  } else {
    console.log('✅ Single self-hosted decap-cms bundle pinned:', ref);
  }
}

process.exit(hasError ? 1 : 0);
