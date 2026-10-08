/**
 * Admin-only client for the user query inbox. Same cookie-credentialed,
 * same-origin pattern as services/db.js.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const getQueries = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/queries`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = new Error('Failed to fetch queries');
    error.status = response.status;
    throw error;
  }

  return await response.json();
};

export const updateQueryStatus = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/queries/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = new Error('Failed to update query');
    error.status = response.status;
    throw error;
  }

  return await response.json();
};

export const deleteQuery = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/queries/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = new Error('Failed to delete query');
    error.status = response.status;
    throw error;
  }

  return await response.json();
};
