const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');

// GET /api/teams -> returns all members grouped by teamName, formatted like previousTenureGroups
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ orderIndex: 1, _id: 1 }).lean();
    
    // Group by teamName
    const groupsMap = new Map();
    
    members.forEach(member => {
      if (!groupsMap.has(member.teamName)) {
        groupsMap.set(member.teamName, {
          heading: member.teamName,
          members: []
        });
      }
      groupsMap.get(member.teamName).members.push({
        _id: member._id,
        name: member.name,
        role: member.role,
        image: member.image,
        birthDate: member.birthDate,
        description: member.description,
        skills: member.skills,
        socials: member.socials,
        showOnHomepage: member.showOnHomepage
      });
    });

    // To ensure a consistent order, we could also sort the groups here if needed.
    // For now, we rely on the insertion order in the Map or we can return them as they appear.
    const groups = Array.from(groupsMap.values());
    res.json(groups);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

module.exports = router;
