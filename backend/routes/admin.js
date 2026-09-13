const express = require('express');
const bcrypt = require('bcryptjs');

const { setAdminCookie, clearAdminCookie, requireAdmin } = require('../middleware/adminAuth');
const { loginRateLimit, recordFailedAttempt, clearAttempts } = require('../middleware/loginRateLimit');

const router = express.Router();

// POST /api/admin/login
// Credentials are verified against backend-only environment variables
// (ADMIN_USERNAME, ADMIN_PASSWORD_HASH) — never against anything the
// frontend sends besides the submitted username/password themselves.
router.post('/login', loginRateLimit, async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminUsername || !adminPasswordHash) {
    console.error('ADMIN_USERNAME / ADMIN_PASSWORD_HASH are not configured on the server.');
    return res.status(500).json({ error: 'Admin login is not configured' });
  }

  // Generic "Invalid credentials" for both a wrong username and a wrong
  // password so the endpoint can't be used to enumerate valid usernames.
  const invalidResponse = () => {
    recordFailedAttempt(req);
    return res.status(401).json({ error: 'Invalid credentials' });
  };

  if (username !== adminUsername) {
    return invalidResponse();
  }

  const passwordMatches = await bcrypt.compare(password, adminPasswordHash).catch(() => false);
  if (!passwordMatches) {
    return invalidResponse();
  }

  clearAttempts(req);
  setAdminCookie(res, adminUsername);
  res.json({ success: true, username: adminUsername });
});

// POST /api/admin/logout
router.post('/logout', (req, res) => {
  clearAdminCookie(res);
  res.json({ success: true });
});

// GET /api/admin/me — used by the frontend to check/restore session state.
router.get('/me', requireAdmin, (req, res) => {
  res.json({ authenticated: true, username: req.admin.username });
});

module.exports = router;
