/**
 * GDG ViMEET Database Service
 * Handles applicant persistence with Node.js + MongoDB backend
 */

export const getApplications = async () => {
  try {
    const response = await fetch('https://gdg-vimeet.onrender.com/api/applications');
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    return await response.json();
  } catch (err) {
    console.error('Error fetching applications from backend:', err);
    return [];
  }
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
    graphicsDriveLink: formData.teams.includes('Graphics Team') ? (formData.graphicsDriveLink || '').trim() : '',
    motivation: (formData.motivation || '').trim(),
  };

  try {
    const response = await fetch('https://gdg-vimeet.onrender.com/api/applications', {
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
  try {
    const response = await fetch(`https://gdg-vimeet.onrender.com/api/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error('Failed to update application status');
    }

    return await response.json();
  } catch (err) {
    console.error('Failed to update application status:', err);
    return [];
  }
};

export const exportToCsv = (applications) => {
  if (!applications || !applications.length) return;

  const headers = [
    'Application ID',
    'Full Name',
    'Roll No',
    'Department',
    'Year',
    'Mobile',
    'Email',
    'Selected Teams',
    'Graphics Poster Drive Link',
    'Motivation / Pitch',
    'Submission Date',
    'Status'
  ];

  const rows = applications.map(app => [
    `"${app.id}"`,
    `"${app.fullName.replace(/"/g, '""')}"`,
    `"${app.rollNo}"`,
    `"${app.department}"`,
    `"${app.year}"`,
    `"${app.mobile}"`,
    `"${app.email}"`,
    `"${(app.teams || []).join(', ')}"`,
    `"${(app.graphicsDriveLink || '').replace(/"/g, '""')}"`,
    `"${(app.motivation || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${new Date(app.submittedAt).toLocaleString()}"`,
    `"${app.status}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `GDG_ViMEET_Recruitment_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
