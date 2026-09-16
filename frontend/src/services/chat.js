/**
 * GDG ViMEET assistant client.
 * Same relative-path rule as services/db.js — the browser only ever talks to
 * its own origin, and Vercel rewrites /api to the backend. No credentials are
 * sent: this endpoint is public and has no session.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const fetchChatSuggestions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/suggestions`);
    if (!response.ok) return { enabled: false, suggestions: [] };
    return await response.json();
  } catch {
    return { enabled: false, suggestions: [] };
  }
};

export const sendChatMessage = async (messages) => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
  } catch {
    const error = new Error('Could not reach the assistant. Check your connection and try again.');
    error.status = 0;
    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'The assistant could not answer that. Please try again.');
    error.status = response.status;
    const retryAfter = Number(response.headers.get('Retry-After'));
    if (Number.isFinite(retryAfter) && retryAfter > 0) error.retryAfter = retryAfter;
    throw error;
  }

  return data;
};
