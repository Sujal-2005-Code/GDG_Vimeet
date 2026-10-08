const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');

process.env.JWT_SECRET ??= 'test-secret-for-queries-tests';

const Query = require('../models/Query');
const queriesRouter = require('./queries');

// Real Express app + a real HTTP server + the actual route/validation/rate-
// limit code, with only the Mongoose model call replaced — no live MongoDB
// needed, and nothing here touches a database that CI doesn't have.
//
// Keep this file to at most 4-5 requests total: queryRateLimit's counter is
// a module-level singleton (5 requests / 10 min, shared across every test in
// this process), so a 6th request anywhere in this file would 429 and make
// an unrelated test flaky. Rate-limiting itself is covered thoroughly and in
// isolation in middleware/rateLimit.test.js.
function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/queries', queriesRouter);
  return app;
}

async function withServer(t, run) {
  const app = buildApp();
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return run(base);
}

test('valid public query submission succeeds and stores nothing extra', async (t) => {
  let created = null;
  t.mock.method(Query, 'create', async (doc) => {
    created = doc;
    return { _id: 'fake-id', ...doc };
  });

  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/queries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'How do I join the Technical team?' }),
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.success, true);
    assert.match(body.message, /submitted/i);
    assert.deepEqual(Object.keys(created), ['question', 'source']);
    assert.equal(created.question, 'How do I join the Technical team?');
  });
});

test('rejects an empty question without touching the database', async (t) => {
  let createCalled = false;
  t.mock.method(Query, 'create', async () => {
    createCalled = true;
  });

  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/queries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: '   ' }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.match(body.error, /enter a question/i);
    assert.equal(createCalled, false);
  });
});

test('rejects an oversized question without touching the database', async (t) => {
  let createCalled = false;
  t.mock.method(Query, 'create', async () => {
    createCalled = true;
  });

  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/queries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'a'.repeat(5000) }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.match(body.error, /under/i);
    assert.equal(createCalled, false);
  });
});

test('a database failure returns a generic message with no internal details leaked', async (t) => {
  t.mock.method(Query, 'create', async () => {
    throw new Error('MongoServerError: E11000 duplicate key at mongodb://internal-host:27017/gdg_vimeet');
  });

  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/queries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'A real question that is long enough' }),
    });
    const body = await response.json();

    assert.equal(response.status, 500);
    assert.ok(!body.error.toLowerCase().includes('mongo'));
    assert.ok(!body.error.includes('27017'));
    assert.ok(!body.error.includes('internal-host'));
    assert.equal(body.stack, undefined);
  });
});
