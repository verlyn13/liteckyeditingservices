import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

console.log('Checking latest versions...\n');
console.log('Package | Current | Latest');
console.log('--------|---------|-------');

for (const [name, current] of Object.entries(allDeps)) {
  const cleanVersion = current.replace(/^[\^~]/, '');
  console.log(`${name} | ${cleanVersion} | checking...`);
}
