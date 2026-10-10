const express = require('express');
const router = express.Router();
const FacultyMember = require('../models/FacultyMember');

// GET /api/faculty -> returns all faculty members sorted by orderIndex
router.get('/', async (req, res) => {
  try {
    const members = await FacultyMember.find().sort({ orderIndex: 1 }).lean();
    res.json(members);
  } catch (err) {
    console.error('Error fetching faculty:', err);
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
});

module.exports = router;
