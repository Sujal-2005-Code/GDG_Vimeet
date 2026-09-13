/**
 * GDG ViMEET Admin Auth Service
 * Talks to the backend's cookie-based admin session (httpOnly JWT cookie).
 * There is no client-side notion of "is admin" — every check here is a
 * network call the backend verifies; nothing is inferred from localStorage
 * or a hardcoded value.
 */
const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://gdg-vimeet-backend-production.up.railway.app');

export const adminLogin = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed. Please try again.' };
    }

    return { success: true, username: data.username };
  } catch {
    return { success: false, error: 'Could not reach the server. Please try again.' };
  }
};

export const adminLogout = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Best-effort — the cookie will also just expire on its own.
  }
};

export const adminMe = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/me`, {
      credentials: 'include',
    });
    if (!response.ok) return { authenticated: false };
    return await response.json();
  } catch {
    return { authenticated: false };
  }
};
