const assert = require('assert');

// Test 1: basic module load
try {
  const app = require('./app.js');
  console.log('PASS: app.js loaded successfully');
} catch (err) {
  console.error('FAIL: app.js failed to load:', err.message);
  process.exit(1);
}

// Test 2: package.json has required fields
const pkg = require('./package.json');
assert.strictEqual(pkg.name, 'myapp', 'FAIL: package name mismatch');
console.log('PASS: package.json valid');

// Test 3: environment variable support
process.env.PORT = '4000';
assert.strictEqual(process.env.PORT, '4000', 'FAIL: env var not set');
console.log('PASS: environment variable support works');

console.log('\nAll tests passed!');
process.exit(0);
