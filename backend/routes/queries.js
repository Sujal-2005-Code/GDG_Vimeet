const express = require('express');

const Query = require('../models/Query');
const { validateQuery } = require('../utils/validateQuery');
const { queryRateLimit } = require('../middleware/queryRateLimit');

const router = express.Router();

// POST /api/queries — public. Used both by the standalone "have a question"
// box and by the chatbot's unavailable/no-match handoff. No admin fields are
// ever accepted from the client; status is always server-set to 'new'.
router.post('/', queryRateLimit, async (req, res) => {
  const { error, query } = validateQuery(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    await Query.create(query);
    res.status(201).json({ success: true, message: 'Your question has been submitted.' });
  } catch (err) {
    console.error('Failed to save user query:', err);
    res.status(500).json({ error: "Couldn't submit your question right now. Please try again later." });
  }
});

module.exports = router;
