const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

// Kept inside backend/ (not a sibling repo folder) so this works regardless
// of whether the deploy target uploads the whole monorepo or just this
// service's directory. This file is just a local backup mirror of MongoDB —
// nothing serves or downloads it — so it doesn't need to live alongside the
// rest of the repo, and it's fine if it doesn't persist across deploys.
const EXCEL_FILE_PATH = path.join(__dirname, '..', 'data', 'applications.xlsx');

/**
 * Syncs the given applications to an Excel file.
 * This overwrites the sheet with the latest database state.
 */
async function syncToExcel(applications) {
  try {
    fs.mkdirSync(path.dirname(EXCEL_FILE_PATH), { recursive: true });
    const workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('Applications');

    worksheet.columns = [
      { header: 'Application ID', key: 'id', width: 25 },
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Roll No', key: 'rollNo', width: 15 },
      { header: 'Department', key: 'department', width: 25 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Selected Teams', key: 'teams', width: 35 },
      { header: 'Graphics Poster Drive Link', key: 'graphicsDriveLink', width: 40 },
      { header: 'Motivation / Pitch', key: 'motivation', width: 50 },
      { header: 'Submission Date', key: 'submittedAt', width: 25 },
      { header: 'Status', key: 'status', width: 20 }
    ];

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add rows
    applications.forEach(app => {
      worksheet.addRow({
        id: app.id,
        fullName: app.fullName,
        rollNo: app.rollNo,
        department: app.department,
        year: app.year,
        mobile: app.mobile,
        email: app.email,
        teams: (app.teams || []).join(', '),
        graphicsDriveLink: app.graphicsDriveLink || '',
        motivation: app.motivation || '',
        submittedAt: app.submittedAt ? new Date(app.submittedAt).toLocaleString() : '',
        status: app.status
      });
    });

    await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
    console.log(`Successfully synced ${applications.length} applications to ${EXCEL_FILE_PATH}`);
  } catch (error) {
    console.error('Error syncing to Excel:', error);
  }
}

module.exports = { syncToExcel };
