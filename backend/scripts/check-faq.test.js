const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const SCRIPT = path.join(__dirname, 'check-faq.js');

test('check-faq.js exits 0 against the real, current faq.json', () => {
  // No assertion beyond "did not throw" — execFileSync throws on a non-zero
  // exit code, which is exactly the failure mode this guards.
  const output = execFileSync('node', [SCRIPT], { encoding: 'utf8' });
  assert.match(output, /faq\.json is valid and in sync/);
});
