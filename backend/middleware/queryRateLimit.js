const { createRateLimiter } = require('./rateLimit');

// Same shape as applicationRateLimit.js: generous enough that a genuine
// visitor never hits it, tight enough to close off scripted spam.
const queryRateLimit = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  windowMax: 5,
  message: 'Too many questions submitted from this network in a short time. Please wait a few minutes and try again.',
});

module.exports = { queryRateLimit };
