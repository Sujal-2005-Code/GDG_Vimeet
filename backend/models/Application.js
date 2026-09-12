const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  rollNo: { type: String, required: true },
  department: { type: String },
  year: { type: String },
  mobile: { type: String },
  email: { type: String },
  teams: { type: [String], default: [] },
  graphicsDriveLink: { type: String },
  motivation: { type: String },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending Review' }
});

module.exports = mongoose.model('Application', applicationSchema);
