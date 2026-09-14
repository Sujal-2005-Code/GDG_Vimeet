/**
 * GDG ViMEET Database Service
 * Handles applicant persistence with Node.js + MongoDB backend
 */

// Always a relative path: in dev, Vite's proxy (vite.config.js) forwards
// /api to the local backend; in production, vercel.json rewrites /api to
// the Railway backend. This keeps every request same-origin from the
// browser's point of view, which matters because the admin session is a
// cookie — a cross-site cookie between two unrelated domains (Vercel and
// Railway) gets silently dropped by modern browsers' third-party cookie
// blocking (Chrome, Safari ITP) even with SameSite=None; Secure set
// correctly server-side. VITE_API_BASE_URL remains as an explicit escape
// hatch for pointing straight at a backend, bypassing the proxy.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const getApplications = async () => {
  const response = await fetch(`${API_BASE_URL}/api/applications`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = new Error('Failed to fetch applications');
    error.status = response.status;
    throw error;
  }

  return await response.json();
};

export const saveApplication = async (formData) => {
  const newSubmission = {
    fullName: formData.fullName.trim(),
    rollNo: formData.rollNo.trim().toUpperCase(),
    department: formData.department,
    year: formData.year,
    mobile: formData.mobile.trim(),
    email: formData.email.trim(),
    teams: formData.teams || [],
    graphicsDriveLink: formData.teams.includes('Graphics & Design') ? (formData.graphicsDriveLink || '').trim() : '',
    motivation: (formData.motivation || '').trim(),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubmission),
    });

    if (!response.ok) {
      throw new Error('Failed to save application');
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (err) {
    console.error('Error saving application:', err);
    return { success: false };
  }
};

export const updateApplicationStatus = async (id, newStatus) => {
  const response = await fetch(`${API_BASE_URL}/api/applications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    const error = new Error('Failed to update application status');
    error.status = response.status;
    throw error;
  }

  return await response.json();
};

export const deleteApplication = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/applications/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = new Error('Failed to delete application');
    error.status = response.status;
    throw error;
  }

  return await response.json();
};

export const deleteAllApplications = async () => {
  // The confirmation goes in the query string (and the body) because some
  // proxies drop the body of a DELETE request.
  const response = await fetch(`${API_BASE_URL}/api/applications?confirm=${encodeURIComponent('DELETE ALL')}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ confirm: 'DELETE ALL' }),
  });

  if (!response.ok) {
    const error = new Error('Failed to delete all applications');
    error.status = response.status;
    throw error;
  }

  return await response.json();
};

// Pass `ids` to export only those applications; omit it to export everything.
export const exportApplicationsToExcel = async (ids) => {
  const response = await fetch(`${API_BASE_URL}/api/applications/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(ids ? { ids } : {}),
  });

  if (!response.ok) {
    const error = new Error('Failed to export applications');
    error.status = response.status;
    throw error;
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `GDG_ViMEET_Recruitment_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revoking synchronously can cancel the download in some browsers.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
