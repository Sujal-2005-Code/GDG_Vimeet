const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET ??= 'test-secret-for-adminQueries-tests';

const { COOKIE_NAME } = require('../middleware/adminAuth');
const Query = require('../models/Query');
const adminQueriesRouter = require('./adminQueries');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/admin/queries', adminQueriesRouter);
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

const adminCookie = () => `${COOKIE_NAME}=${jwt.sign({ role: 'admin', username: 'test-admin' }, process.env.JWT_SECRET)}`;
const userCookie = () => `${COOKIE_NAME}=${jwt.sign({ role: 'user', username: 'someone' }, process.env.JWT_SECRET)}`;

const FAKE_DOC = { _id: '507f1f77bcf86cd799439011', question: 'A real question', status: 'new' };

function mockFind(t, docs) {
  t.mock.method(Query, 'find', () => ({
    sort: () => ({ lean: async () => docs }),
  }));
}

function mockUpdate(t, doc) {
  t.mock.method(Query, 'findByIdAndUpdate', () => ({ lean: async () => doc }));
}

function mockDelete(t, doc) {
  t.mock.method(Query, 'findByIdAndDelete', () => ({ lean: async () => doc }));
}

// --- Unauthenticated ---------------------------------------------------

test('unauthenticated GET /api/admin/queries -> 401', async (t) => {
  mockFind(t, [FAKE_DOC]);
  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/admin/queries`);
    assert.equal(response.status, 401);
  });
});

test('unauthenticated PATCH -> 401', async (t) => {
  mockUpdate(t, FAKE_DOC);
  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/admin/queries/${FAKE_DOC._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'reviewing' }),
    });
    assert.equal(response.status, 401);
  });
});

test('unauthenticated DELETE -> 401', async (t) => {
  mockDelete(t, FAKE_DOC);
  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/admin/queries/${FAKE_DOC._id}`, { method: 'DELETE' });
    assert.equal(response.status, 401);
  });
});

// --- Authenticated as a non-admin user ----------------------------------

test('normal user GET /api/admin/queries -> 403', async (t) => {
  mockFind(t, [FAKE_DOC]);
  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/admin/queries`, { headers: { Cookie: userCookie() } });
    assert.equal(response.status, 403);
  });
});

test('normal user PATCH -> 403, and the document is never touched', async (t) => {
  let updateCalled = false;
  t.mock.method(Query, 'findByIdAndUpdate', () => {
    updateCalled = true;
    return { lean: async () => FAKE_DOC };
  });

  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/admin/queries/${FAKE_DOC._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: userCookie() },
      body: JSON.stringify({ status: 'reviewing' }),
    });
    assert.equal(response.status, 403);
    assert.equal(updateCalled, false);
  });
});

test('normal user DELETE -> 403, and the document is never touched', async (t) => {
  let deleteCalled = false;
  t.mock.method(Query, 'findByIdAndDelete', () => {
    deleteCalled = true;
    return { lean: async () => FAKE_DOC };
  });

  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/admin/queries/${FAKE_DOC._id}`, {
      method: 'DELETE',
      headers: { Cookie: userCookie() },
    });
    assert.equal(response.status, 403);
    assert.equal(deleteCalled, false);
  });
});

// --- Authenticated as admin ----------------------------------------------

test('admin GET -> success, newest first via sort', async (t) => {
  let sortArg = null;
  t.mock.method(Query, 'find', () => ({
    sort: (arg) => {
      sortArg = arg;
      return { lean: async () => [FAKE_DOC] };
    },
  }));

  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/admin/queries`, { headers: { Cookie: adminCookie() } });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.deepEqual(body, [FAKE_DOC]);
    assert.deepEqual(sortArg, { createdAt: -1 });
  });
});

test('admin PATCH with a valid status -> success', async (t) => {
  const updated = { ...FAKE_DOC, status: 'reviewing' };
  mockUpdate(t, updated);

  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/admin/queries/${FAKE_DOC._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie() },
      body: JSON.stringify({ status: 'reviewing' }),
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.status, 'reviewing');
  });
});

test('admin PATCH with an invalid status -> 400, database never touched', async (t) => {
  let updateCalled = false;
  t.mock.method(Query, 'findByIdAndUpdate', () => {
    updateCalled = true;
    return { lean: async () => FAKE_DOC };
  });

  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/admin/queries/${FAKE_DOC._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie() },
      body: JSON.stringify({ status: 'approved-by-hacker' }),
    });
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.match(body.error, /must be one of/i);
    assert.equal(updateCalled, false);
  });
});

test('admin PATCH for a query id that does not exist -> 404', async (t) => {
  mockUpdate(t, null);
  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/admin/queries/${FAKE_DOC._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie() },
      body: JSON.stringify({ status: 'resolved' }),
    });
    assert.equal(response.status, 404);
  });
});

test('admin DELETE -> success', async (t) => {
  mockDelete(t, FAKE_DOC);
  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/admin/queries/${FAKE_DOC._id}`, {
      method: 'DELETE',
      headers: { Cookie: adminCookie() },
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
  });
});

test('a malformed id is a 400, not a 500 leaking a Mongoose CastError', async (t) => {
  t.mock.method(Query, 'findByIdAndDelete', () => {
    const err = new Error('Cast to ObjectId failed for value "not-an-id"');
    err.name = 'CastError';
    throw err;
  });

  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/admin/queries/not-an-id`, {
      method: 'DELETE',
      headers: { Cookie: adminCookie() },
    });
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.ok(!body.error.includes('Cast to ObjectId'));
    assert.equal(body.stack, undefined);
  });
});

test('admin responses set Cache-Control: no-store (inherited from requireAdmin)', async (t) => {
  mockFind(t, []);
  await withServer(t, async (base) => {
    const response = await fetch(`${base}/api/admin/queries`, { headers: { Cookie: adminCookie() } });
    assert.equal(response.headers.get('cache-control'), 'no-store');
  });
});
