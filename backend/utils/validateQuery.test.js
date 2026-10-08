const test = require('node:test');
const assert = require('node:assert/strict');

const { validateQuery, MAX_QUESTION_LENGTH } = require('./validateQuery');

test('accepts a normal question and normalizes it', () => {
  const { error, query } = validateQuery({ question: '  How do I join the Technical team?  ' });
  assert.equal(error, undefined);
  assert.equal(query.question, 'How do I join the Technical team?');
  assert.equal(query.status, undefined); // status is server-set at the Query model default, not here
  assert.equal(query.source, 'manual');
});

test('rejects a missing question', () => {
  const { error } = validateQuery({});
  assert.match(error, /enter a question/i);
});

test('rejects an empty/whitespace-only question', () => {
  const { error } = validateQuery({ question: '   ' });
  assert.match(error, /enter a question/i);
});

test('rejects a question that is too short to be meaningful', () => {
  const { error } = validateQuery({ question: 'hi' });
  assert.match(error, /more complete/i);
});

test('rejects an oversized question', () => {
  const { error } = validateQuery({ question: 'a'.repeat(MAX_QUESTION_LENGTH + 1) });
  assert.match(error, /under/i);
});

test('accepts a question exactly at the max length', () => {
  const { error, query } = validateQuery({ question: 'a'.repeat(MAX_QUESTION_LENGTH) });
  assert.equal(error, undefined);
  assert.equal(query.question.length, MAX_QUESTION_LENGTH);
});

test('rejects a non-object body', () => {
  assert.match(validateQuery(null).error, /invalid/i);
  assert.match(validateQuery('a string').error, /invalid/i);
  assert.match(validateQuery(42).error, /invalid/i);
});

test('ignores a client-supplied status or admin-only field — never spreads the body', () => {
  const { query } = validateQuery({ question: 'A real question here', status: 'resolved', isAdmin: true });
  assert.deepEqual(Object.keys(query), ['question', 'source']);
  assert.equal(Object.getPrototypeOf(query), Object.prototype);
});

test('falls back to source "manual" for an invalid or missing source', () => {
  assert.equal(validateQuery({ question: 'A real question here' }).query.source, 'manual');
  assert.equal(validateQuery({ question: 'A real question here', source: 'not-a-real-source' }).query.source, 'manual');
});

test('accepts each valid source value', () => {
  for (const source of ['manual', 'chat-unavailable', 'chat-no-answer', 'faq-feedback']) {
    assert.equal(validateQuery({ question: 'A real question here', source }).query.source, source);
  }
});

test('rejects a non-string question (type confusion)', () => {
  assert.match(validateQuery({ question: 12345 }).error, /enter a question/i);
  assert.match(validateQuery({ question: { toString: () => 'x' } }).error, /enter a question/i);
  assert.match(validateQuery({ question: ['a', 'b'] }).error, /enter a question/i);
});
