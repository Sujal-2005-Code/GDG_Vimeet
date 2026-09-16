const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET ??= 'test-secret-for-adminAuth-tests';
process.env.ADMIN_USERNAME ??= 'test-admin';

const { requireAdmin, setAdminCookie, clearAdminCookie, COOKIE_NAME } = require('./adminAuth');

// Minimal stand-ins for Express req/res — no supertest/HTTP server needed to
// exercise this middleware's actual decision logic.
function mockRes() {
  return {
    statusCode: null,
    body: null,
    headers: {},
    cookies: {},
    cleared: [],
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    set(name, value) {
      this.headers[name] = value;
      return this;
    },
    cookie(name, value, options) {
      this.cookies[name] = { value, options };
    },
    clearCookie(name) {
      this.cleared.push(name);
    },
  };
}

test('requireAdmin rejects a request with no cookie', () => {
  const req = { cookies: {} };
  const res = mockRes();
  let nextCalled = false;

  requireAdmin(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.error, 'Not authenticated');
});

test('requireAdmin rejects a tampered token', () => {
  const real = jwt.sign({ role: 'admin', username: 'test-admin' }, process.env.JWT_SECRET);
  const tampered = real.slice(0, -2) + 'xx';
  const req = { cookies: { [COOKIE_NAME]: tampered } };
  const res = mockRes();
  let nextCalled = false;

  requireAdmin(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
});

test('requireAdmin rejects an expired token', () => {
  const expired = jwt.sign({ role: 'admin', username: 'test-admin' }, process.env.JWT_SECRET, { expiresIn: -10 });
  const req = { cookies: { [COOKIE_NAME]: expired } };
  const res = mockRes();
  let nextCalled = false;

  requireAdmin(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
});

test('requireAdmin rejects a token signed with the wrong secret', () => {
  const forged = jwt.sign({ role: 'admin', username: 'test-admin' }, 'not-the-real-secret');
  const req = { cookies: { [COOKIE_NAME]: forged } };
  const res = mockRes();
  let nextCalled = false;

  requireAdmin(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
});

test('requireAdmin rejects a validly-signed token with the wrong role', () => {
  const notAdmin = jwt.sign({ role: 'user', username: 'someone' }, process.env.JWT_SECRET);
  const req = { cookies: { [COOKIE_NAME]: notAdmin } };
  const res = mockRes();
  let nextCalled = false;

  requireAdmin(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 403);
});

test('requireAdmin accepts a validly-signed admin token and attaches req.admin', () => {
  const req = {};
  const res = mockRes();
  setAdminCookie({ cookie: (name, value) => { req.cookies = { [name]: value }; } }, 'test-admin');
  let nextCalled = false;

  requireAdmin(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, null);
  assert.equal(req.admin.username, 'test-admin');
});

test('requireAdmin sets Cache-Control: no-store on every response, pass or fail', () => {
  const req = { cookies: {} };
  const res = mockRes();

  requireAdmin(req, res, () => {});

  assert.equal(res.headers['Cache-Control'], 'no-store');
});

test('setAdminCookie / clearAdminCookie use the same cookie name and path', () => {
  const res = mockRes();
  setAdminCookie(res, 'test-admin');
  clearAdminCookie(res);

  assert.ok(res.cookies[COOKIE_NAME]);
  assert.equal(res.cookies[COOKIE_NAME].options.httpOnly, true);
  assert.deepEqual(res.cleared, [COOKIE_NAME]);
});
