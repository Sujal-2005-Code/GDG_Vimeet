// Minimal in-memory brute-force guard for the admin login endpoint.
// Not distributed-safe, but this backend runs as a single instance, and it
// meaningfully slows down credential-guessing without adding a dependency.
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

const attemptsByIp = new Map();

function loginRateLimit(req, res, next) {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const record = attemptsByIp.get(ip);

  if (record && now - record.firstAttempt < WINDOW_MS && record.count >= MAX_ATTEMPTS) {
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - record.firstAttempt)) / 1000);
    res.set('Retry-After', String(retryAfterSec));
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }

  next();
}

function recordFailedAttempt(req) {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const record = attemptsByIp.get(ip);

  if (!record || now - record.firstAttempt >= WINDOW_MS) {
    attemptsByIp.set(ip, { count: 1, firstAttempt: now });
  } else {
    record.count += 1;
  }
}

function clearAttempts(req) {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  attemptsByIp.delete(ip);
}

module.exports = { loginRateLimit, recordFailedAttempt, clearAttempts };
