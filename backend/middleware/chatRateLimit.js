const { createRateLimiter } = require('./rateLimit');

// Per-IP limiter for the public chat endpoint. Each call costs real money,
// so the budget is the thing being protected.
const chatRateLimit = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  windowMax: 10,
  dayMax: 50,
  message: 'Too many messages in a short time. Please wait a moment and try again.',
  dailyMessage: 'Daily chat limit reached. Please email gdgvimeet@gmail.com and we will help you directly.',
});

module.exports = { chatRateLimit };
