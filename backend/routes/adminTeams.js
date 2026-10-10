const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');
const { requireAdmin } = require('../middleware/adminAuth');

router.use(requireAdmin);

// GET /api/admin/teams (flat list of all members for admin table)
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ teamName: 1, orderIndex: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// POST /api/admin/teams
router.post('/', async (req, res) => {
  try {
    const newMember = new TeamMember(req.body);
    const saved = await newMember.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create member', details: err });
  }
});

// PUT /api/admin/teams/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Member not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update member', details: err });
  }
});

// DELETE /api/admin/teams/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Member not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

module.exports = router;
