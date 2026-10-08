const express = require('express');

const Query = require('../models/Query');
const { requireAdmin } = require('../middleware/adminAuth');

const router = express.Router();

// Every route below is admin-only — mirrors the same requireAdmin guard used
// by /api/applications, reusing the project's one existing auth system.
router.use(requireAdmin);

const VALID_STATUSES = ['new', 'reviewing', 'resolved', 'dismissed'];

// GET /api/admin/queries — newest first.
router.get('/', async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 }).lean();
    res.json(queries);
  } catch (err) {
    console.error('Failed to list queries:', err);
    res.status(500).json({ error: 'Could not load queries.' });
  }
});

// PATCH /api/admin/queries/:id — status transitions only. Explicit enum
// check server-side; the client cannot set any other field this way.
router.patch('/:id', async (req, res) => {
  const { status } = req.body || {};
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const updated = await Query.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
    if (!updated) {
      return res.status(404).json({ error: 'Query not found.' });
    }
    res.json(updated);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid query id.' });
    }
    console.error('Failed to update query:', err);
    res.status(500).json({ error: 'Could not update the query.' });
  }
});

// DELETE /api/admin/queries/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Query.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      return res.status(404).json({ error: 'Query not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid query id.' });
    }
    console.error('Failed to delete query:', err);
    res.status(500).json({ error: 'Could not delete the query.' });
  }
});

module.exports = router;
