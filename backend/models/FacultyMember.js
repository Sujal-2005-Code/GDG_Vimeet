const mongoose = require('mongoose');

const facultyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, default: '' },
  orderIndex: { type: Number, default: 0 },
}, {
  timestamps: true
});

module.exports = mongoose.model('FacultyMember', facultyMemberSchema);
