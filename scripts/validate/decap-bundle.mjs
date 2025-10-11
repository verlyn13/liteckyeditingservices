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
const npmCmsRefs = matches.filter((src) => /\/admin\/cms\.js/i.test(src));

if (npmCmsRefs.length === 1 && decapRefs.length === 0) {
  console.log('✅ NPM decap-cms-app delivery detected:', npmCmsRefs[0]);
} else if (npmCmsRefs.length === 0 && decapRefs.length === 0) {
  console.error('❌ No admin CMS bundle referenced (expected /admin/cms.js).');
  hasError = true;
} else {
  console.error('❌ Found legacy decap-cms references. Admin must use /admin/cms.js only:');
  for (const ref of decapRefs) console.error('   - ' + ref);
  hasError = true;
}

process.exit(hasError ? 1 : 0);
