const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const getAdminTeams = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/teams`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch team members');
  return response.json();
};

export const createTeamMember = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create team member');
  return response.json();
};

export const updateTeamMember = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/teams/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update team member');
  return response.json();
};

export const deleteTeamMember = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/teams/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete team member');
  return response.json();
};

export const getPublicTeams = async () => {
  const response = await fetch(`${API_BASE_URL}/api/teams`);
  if (!response.ok) throw new Error('Failed to fetch public teams');
  return response.json();
};
