const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'gdg_admin_session';
const TOKEN_TTL = '12h';
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

function signAdminToken(username) {
  return jwt.sign({ role: 'admin', username }, getJwtSecret(), { expiresIn: TOKEN_TTL });
}

function cookieOptions() {
  // Don't rely on NODE_ENV alone — some hosts don't set it reliably.
  // CORS_ORIGIN being configured is this codebase's own existing signal for
  // "deployed", so treat either as production for cookie security flags.
  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.CORS_ORIGIN);
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: TOKEN_TTL_MS,
    path: '/',
  };
}

function setAdminCookie(res, username) {
  res.cookie(COOKIE_NAME, signAdminToken(username), cookieOptions());
}

function clearAdminCookie(res) {
  const { maxAge, ...opts } = cookieOptions();
  res.clearCookie(COOKIE_NAME, opts);
}

// Verifies the admin session cookie. Rejects the request outright rather
// than trusting anything the client sends (no header/localStorage/body
// flags are ever treated as proof of admin identity).
function requireAdmin(req, res, next) {
  // Admin data must never be cached by an intermediary (browser, Vercel's
  // /api rewrite proxy, etc.) — a stale cached list would look exactly like
  // "missing" applications to whoever's viewing it.
  res.set('Cache-Control', 'no-store');

  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.admin = { username: payload.username };
    next();
  } catch {
    return res.status(401).json({ error: 'Session expired or invalid' });
  }
}

module.exports = {
  COOKIE_NAME,
  setAdminCookie,
  clearAdminCookie,
  requireAdmin,
};
