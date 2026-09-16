// Generic per-IP request-count limiter. Counts every matching request, not
// just failures — unlike loginRateLimit.js, which only counts failed logins.
// Each call this guards costs something (an LLM call, a write, an email),
// so the budget itself is what is being protected.
//
// In-memory and therefore single-instance only, which is fine: the backend
// runs as one long-lived Railway process. Each createRateLimiter() call owns
// an independent counter map, so unrelated endpoints never share a quota.
const PRUNE_ABOVE = 1000;

function createRateLimiter({ windowMs, windowMax, dayMax, message, dailyMessage }) {
  const hits = new Map();
  const ipOf = (req) => req.ip || req.socket?.remoteAddress || 'unknown';
  const secondsLeft = (startedAt, span, now) => Math.max(1, Math.ceil((span - (now - startedAt)) / 1000));
  const DAY_MS = 24 * 60 * 60 * 1000;

  function prune(now) {
    if (hits.size < PRUNE_ABOVE) return;
    for (const [ip, record] of hits) {
      if (now - record.dayStart >= DAY_MS) hits.delete(ip);
    }
  }

  return function rateLimit(req, res, next) {
    const ip = ipOf(req);
    const now = Date.now();
    prune(now);

    const record = hits.get(ip) ?? { windowStart: now, windowCount: 0, dayStart: now, dayCount: 0 };

    if (now - record.windowStart >= windowMs) {
      record.windowStart = now;
      record.windowCount = 0;
    }
    if (now - record.dayStart >= DAY_MS) {
      record.dayStart = now;
      record.dayCount = 0;
    }

    if (record.windowCount >= windowMax) {
      hits.set(ip, record);
      res.set('Retry-After', String(secondsLeft(record.windowStart, windowMs, now)));
      return res.status(429).json({ error: message });
    }

    if (dayMax && record.dayCount >= dayMax) {
      hits.set(ip, record);
      res.set('Retry-After', String(secondsLeft(record.dayStart, DAY_MS, now)));
      return res.status(429).json({ error: dailyMessage ?? message });
    }

    record.windowCount += 1;
    record.dayCount += 1;
    hits.set(ip, record);
    next();
  };
}

module.exports = { createRateLimiter };
