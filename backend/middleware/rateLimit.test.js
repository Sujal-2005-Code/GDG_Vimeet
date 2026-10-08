const test = require('node:test');
const assert = require('node:assert/strict');

const { createRateLimiter } = require('./rateLimit');

// Every route-specific limiter (applicationRateLimit, chatRateLimit,
// queryRateLimit, ...) is a thin wrapper around this one factory, so testing
// it directly here — with a fresh instance per test — covers all of them
// without any shared in-memory state leaking between tests.
function mockReqRes(ip = '10.0.0.1') {
  const req = { ip, socket: { remoteAddress: ip } };
  const res = {
    statusCode: null,
    body: null,
    headers: {},
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
  };
  return { req, res };
}

test('allows requests under the window limit', () => {
  const limiter = createRateLimiter({ windowMs: 60_000, windowMax: 3, message: 'too many' });
  for (let i = 0; i < 3; i += 1) {
    const { req, res } = mockReqRes();
    let called = false;
    limiter(req, res, () => {
      called = true;
    });
    assert.equal(called, true, `request ${i + 1} should be allowed`);
    assert.equal(res.statusCode, null);
  }
});

test('blocks the request that exceeds the window limit, with 429 and Retry-After', () => {
  const limiter = createRateLimiter({ windowMs: 60_000, windowMax: 2, message: 'too many, slow down' });
  const ip = '10.0.0.2';
  for (let i = 0; i < 2; i += 1) {
    const { req, res } = mockReqRes(ip);
    limiter(req, res, () => {});
  }
  const { req, res } = mockReqRes(ip);
  let called = false;
  limiter(req, res, () => {
    called = true;
  });
  assert.equal(called, false);
  assert.equal(res.statusCode, 429);
  assert.equal(res.body.error, 'too many, slow down');
  assert.ok(Number(res.headers['Retry-After']) > 0);
});

test('tracks each IP independently', () => {
  const limiter = createRateLimiter({ windowMs: 60_000, windowMax: 1, message: 'too many' });
  const { req: reqA, res: resA } = mockReqRes('10.0.0.3');
  const { req: reqB, res: resB } = mockReqRes('10.0.0.4');

  let calledA = false;
  let calledB = false;
  limiter(reqA, resA, () => {
    calledA = true;
  });
  limiter(reqB, resB, () => {
    calledB = true;
  });

  assert.equal(calledA, true);
  assert.equal(calledB, true);
  assert.equal(resA.statusCode, null);
  assert.equal(resB.statusCode, null);
});

test('enforces a daily cap independently of the short window', () => {
  const limiter = createRateLimiter({
    windowMs: 1000, // short window so it resets quickly...
    windowMax: 1000, // ...but keep it high so only the day cap is being tested
    dayMax: 2,
    message: 'window message',
    dailyMessage: 'daily cap reached',
  });
  const ip = '10.0.0.5';
  for (let i = 0; i < 2; i += 1) {
    const { req, res } = mockReqRes(ip);
    limiter(req, res, () => {});
    assert.equal(res.statusCode, null);
  }
  const { req, res } = mockReqRes(ip);
  let called = false;
  limiter(req, res, () => {
    called = true;
  });
  assert.equal(called, false);
  assert.equal(res.statusCode, 429);
  assert.equal(res.body.error, 'daily cap reached');
});

test('falls back to the window message when no dailyMessage is set', () => {
  const limiter = createRateLimiter({ windowMs: 60_000, windowMax: 1000, dayMax: 1, message: 'shared message' });
  const ip = '10.0.0.6';
  const first = mockReqRes(ip);
  limiter(first.req, first.res, () => {});
  assert.equal(first.res.statusCode, null);

  const second = mockReqRes(ip);
  limiter(second.req, second.res, () => {});
  assert.equal(second.res.statusCode, 429);
  assert.equal(second.res.body.error, 'shared message');
});
