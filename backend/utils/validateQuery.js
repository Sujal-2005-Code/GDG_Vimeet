// Same discipline as validateApplication.js: never spread req.body. This is
// a public, unauthenticated endpoint, so the only fields that ever reach the
// database are the ones read and checked explicitly here.
const MAX_QUESTION_LENGTH = 1000;
const MIN_QUESTION_LENGTH = 3;
const VALID_SOURCES = ['manual', 'chat-unavailable', 'chat-no-answer', 'faq-feedback'];

function validateQuery(body) {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body.' };
  }

  const question = typeof body.question === 'string' ? body.question.trim() : '';
  if (!question) {
    return { error: 'Please enter a question.' };
  }
  if (question.length < MIN_QUESTION_LENGTH) {
    return { error: 'Please enter a more complete question.' };
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return { error: `Please keep your question under ${MAX_QUESTION_LENGTH} characters.` };
  }

  const source = VALID_SOURCES.includes(body.source) ? body.source : 'manual';

  return { query: { question, source } };
}

module.exports = { validateQuery, MAX_QUESTION_LENGTH, MIN_QUESTION_LENGTH, VALID_SOURCES };
