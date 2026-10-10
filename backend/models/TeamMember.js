const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href: { type: String, required: true }
}, { _id: false });

const teamMemberSchema = new mongoose.Schema({
  teamName: { type: String, required: true }, // e.g., 'Web-Dev Team'
  name: { type: String, required: true },
  role: { type: String, required: true }, // corresponds to 'post'
  image: { type: String, default: '' },
  birthDate: { type: Date },
  description: { type: String, default: '' },
  skills: { type: [String], default: [] },
  socials: { type: [socialSchema], default: [] },
  orderIndex: { type: Number, default: 0 },
  showOnHomepage: { type: Boolean, default: false },
}, {
  timestamps: true
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);
