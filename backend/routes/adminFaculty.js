const express = require('express');
const router = express.Router();
const FacultyMember = require('../models/FacultyMember');
const { requireAdmin } = require('../middleware/adminAuth');

router.use(requireAdmin);

// GET /api/admin/faculty
router.get('/', async (req, res) => {
  try {
    const members = await FacultyMember.find().sort({ orderIndex: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch faculty members' });
  }
});

// POST /api/admin/faculty
router.post('/', async (req, res) => {
  try {
    const newMember = new FacultyMember(req.body);
    const saved = await newMember.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create faculty member', details: err });
  }
});

// PUT /api/admin/faculty/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await FacultyMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Faculty member not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update faculty member', details: err });
  }
});

// DELETE /api/admin/faculty/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await FacultyMember.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Faculty member not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete faculty member' });
  }
});

module.exports = router;
