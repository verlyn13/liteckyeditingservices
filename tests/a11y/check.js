#!/usr/bin/env node
import pa11y from 'pa11y';

const urls = [
  'http://localhost:4321/',
  'http://localhost:4321/services',
  'http://localhost:4321/process',
  'http://localhost:4321/about',
  'http://localhost:4321/testimonials',
  'http://localhost:4321/faq',
  'http://localhost:4321/contact',
];

const options = {
  standard: 'WCAG2AA',
  runners: ['axe', 'htmlcs'],
  timeout: 60000,
  wait: 1000,
  // Remove Turnstile widget before testing to avoid timeouts
  beforeScript: () => {
    const turnstile = document.querySelector('.cf-turnstile');
    if (turnstile) {
      turnstile.remove();
    }
  },
  ignore: [
    // Ignore known false positives
  ],
};

async function runTests() {
  console.log('Running accessibility tests...\n');
  let hasErrors = false;

  for (const url of urls) {
    try {
      console.log(`Testing: ${url}`);
      const results = await pa11y(url, options);

      if (results.issues.length > 0) {
        hasErrors = true;
        console.error(`\n❌ ${url} has ${results.issues.length} accessibility issues:`);
        results.issues.forEach((issue) => {
          console.error(`  - [${issue.type}] ${issue.message}`);
          if (issue.selector) {
            console.error(`    Element: ${issue.selector}`);
          }
        });
      } else {
        console.log(`✅ ${url} - No accessibility issues found`);
      }
    } catch (error) {
      console.error(`\n❌ Error testing ${url}:`, error.message);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('\n❌ Accessibility tests failed');
    process.exit(1);
  } else {
    console.log('\n✅ All accessibility tests passed!');
  }
}

runTests();
