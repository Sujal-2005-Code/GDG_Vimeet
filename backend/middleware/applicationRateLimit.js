const { createRateLimiter } = require('./rateLimit');

// Per-IP limiter for the public recruitment submission endpoint. Generous
// enough that a genuine applicant never hits it (including a resubmission
// after fixing a typo), but closes off scripted bulk submissions.
const applicationRateLimit = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  windowMax: 5,
  message: 'Too many submissions from this network in a short time. Please wait a few minutes and try again.',
});

module.exports = { applicationRateLimit };
