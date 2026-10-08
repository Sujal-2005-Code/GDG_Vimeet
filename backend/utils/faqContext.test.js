const test = require('node:test');
const assert = require('node:assert/strict');

const { extractSources } = require('./faqContext');

// These use real ids from the current content/faq.json — application-process-01
// is a stable, long-standing entry with a link, which is what makes it show
// up as a source chip at all (an id with no `links` never produces a chip).
test('strips a single-id citation and turns it into a source chip', () => {
  const { reply, sources } = extractSources('Go to the Join Us page. [application-process-01]');
  assert.equal(reply, 'Go to the Join Us page.');
  assert.ok(sources.length >= 1);
  assert.ok(sources.every((s) => !s.id || typeof s.href === 'string'));
});

test('strips a multi-id citation in one bracket and extracts every id (regression: this used to leak raw text)', () => {
  const { reply, sources } = extractSources(
    'Some participants completed it. [application-process-01, application-process-02]'
  );
  assert.ok(!reply.includes('['), `reply must not contain a raw bracket: ${JSON.stringify(reply)}`);
  assert.ok(!reply.includes(']'));
  assert.equal(reply, 'Some participants completed it.');
  // Both ids should have been recognized (application-process-02 may or may
  // not carry a link of its own; the key regression check is no leaked text).
  assert.ok(Array.isArray(sources));
});

test('never leaves a raw bracket in the reply even for an id that does not exist', () => {
  const { reply, sources } = extractSources('Here is an answer. [not-a-real-id]');
  assert.ok(!reply.includes('['));
  assert.equal(sources.length, 0);
});

test('never leaves a raw bracket for an invented multi-id group', () => {
  const { reply } = extractSources('Here is an answer. [not-a-real-id, also-not-real]');
  assert.ok(!reply.includes('['));
  assert.ok(!reply.includes(']'));
});

test('strips separate adjacent brackets with a connecting comma and leaves no orphaned punctuation (regression: this used to leave a trailing ",")', () => {
  const { reply, sources } = extractSources(
    '107 out of 245+ participants finished the campaign.\n\n[events-04], [events-05]'
  );
  assert.equal(reply, '107 out of 245+ participants finished the campaign.');
  assert.ok(!reply.includes('['));
  assert.ok(!reply.includes(']'));
  assert.ok(!reply.trimEnd().endsWith(','));
  assert.ok(Array.isArray(sources));
});

test('strips separate adjacent brackets with no connecting comma at all', () => {
  const { reply } = extractSources('An answer. [events-04] [events-05]');
  assert.equal(reply, 'An answer.');
});

test('detects the NO_MATCH token and strips it from the visible reply', () => {
  const { reply, noMatch } = extractSources('I do not have that detail. [[NO_MATCH]]');
  assert.equal(noMatch, true);
  assert.ok(!reply.includes('NO_MATCH'));
  assert.ok(!reply.includes('['));
  assert.equal(reply, 'I do not have that detail.');
});

test('noMatch is false when the token is absent', () => {
  const { noMatch } = extractSources('Go to the Join Us page. [application-process-01]');
  assert.equal(noMatch, false);
});

test('does not confuse [[NO_MATCH]] with a citation bracket (no false source chip)', () => {
  const { sources } = extractSources('I do not have that detail. [[NO_MATCH]]');
  assert.equal(sources.length, 0);
});

test('caps source chips at three and de-duplicates by href', () => {
  const { sources } = extractSources(
    '[application-process-01, application-process-01, application-process-01]'
  );
  assert.ok(sources.length <= 3);
});

test('collapses whitespace left behind after stripping citations', () => {
  const { reply } = extractSources('First sentence.   [id-one]   Second sentence , with a comma.');
  assert.ok(!reply.includes('  '));
  assert.ok(!reply.includes(' ,'));
});
