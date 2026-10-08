const mongoose = require('mongoose');

// Deliberately minimal: no name, email, or any identifying field is
// collected by default (see utils/validateQuery.js) — a query is a question
// text plus enough metadata for the admin inbox to triage it.
const querySchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 1000 },
    status: { type: String, enum: ['new', 'reviewing', 'resolved', 'dismissed'], default: 'new' },
    // Where the question came from — lets the admin inbox distinguish a
    // direct submission from a chatbot handoff without a second collection.
    source: {
      type: String,
      enum: ['manual', 'chat-unavailable', 'chat-no-answer', 'faq-feedback'],
      default: 'manual',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Query', querySchema);
