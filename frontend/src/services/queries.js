/**
 * Public "have a question?" submission client — used both by the standalone
 * query box (chatbot unavailable) and the chatbot's no-match handoff.
 * Same relative-path, no-credentials rule as services/chat.js: this is a
 * public, unauthenticated endpoint.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const submitQuery = async (question, source = 'manual') => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/queries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, source }),
    });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || "Couldn't submit your question right now. Please try again later.");
    error.status = response.status;
    throw error;
  }

  return data;
};
