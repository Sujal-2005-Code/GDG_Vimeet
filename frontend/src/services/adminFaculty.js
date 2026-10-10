const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const getAdminFaculty = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/faculty`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch faculty members');
  return response.json();
};

export const createFacultyMember = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/faculty`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create faculty member');
  return response.json();
};

export const updateFacultyMember = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/faculty/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update faculty member');
  return response.json();
};

export const deleteFacultyMember = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/faculty/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete faculty member');
  return response.json();
};

export const getPublicFaculty = async () => {
  const response = await fetch(`${API_BASE_URL}/api/faculty`);
  if (!response.ok) throw new Error('Failed to fetch public faculty');
  return response.json();
};
