const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

// Kept inside backend/ (not a sibling repo folder) so this works regardless
// of whether the deploy target uploads the whole monorepo or just this
// service's directory. This file is just a local backup mirror of MongoDB —
// nothing serves or downloads it — so it doesn't need to live alongside the
// rest of the repo, and it's fine if it doesn't persist across deploys.
const EXCEL_FILE_PATH = path.join(__dirname, '..', 'data', 'applications.xlsx');

const TEAMS = [
  'Technical',
  'Graphics & Design',
  'Content & Social Media',
  'PR & Outreach',
  'Event Management',
];

const IST_OFFSET_MS = 330 * 60 * 1000;

const HEADER_FILL = 'FF1A73E8';
const STRIPE_FILL = 'FFF5F8FC';
const BORDER_COLOR = 'FFDADCE0';
const STATUS_STYLES = {
  'Pending Review': { fill: 'FFFEF7E0', font: 'FFB06000' },
  Reviewed: { fill: 'FFE8F0FE', font: 'FF1967D2' },
  Shortlisted: { fill: 'FFE6F4EA', font: 'FF137333' },
  Rejected: { fill: 'FFFCE8E6', font: 'FFC5221F' },
};

const thinBorder = { style: 'thin', color: { argb: BORDER_COLOR } };
const cellBorder = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };

// Older submissions stored team names with a " Team" suffix ("Technical Team").
const belongsToTeam = (app, team) =>
  (app.teams || []).some((t) => t === team || t === `${team} Team`);

function buildColumns(includePosterLink) {
  return [
    { header: '#', key: 'serial', width: 6 },
    { header: 'Full Name', key: 'fullName', width: 26 },
    { header: 'Roll No', key: 'rollNo', width: 12 },
    { header: 'Department', key: 'department', width: 24 },
    { header: 'Year', key: 'year', width: 8 },
    { header: 'Mobile', key: 'mobile', width: 15 },
    { header: 'Email', key: 'email', width: 32 },
    { header: 'Teams Applied', key: 'teams', width: 38 },
    ...(includePosterLink ? [{ header: 'Poster Drive Link', key: 'graphicsDriveLink', width: 42 }] : []),
    { header: 'Motivation', key: 'motivation', width: 50 },
    { header: 'Status', key: 'status', width: 16 },
    { header: 'Submitted On (IST)', key: 'submittedAt', width: 22 },
    { header: 'Application ID', key: 'id', width: 22 },
  ];
}

function addSheet(workbook, name, applications, { includePosterLink }) {
  const sheet = workbook.addWorksheet(name, {
    views: [{ state: 'frozen', ySplit: 1 }],
  });
  sheet.columns = buildColumns(includePosterLink);

  const header = sheet.getRow(1);
  header.height = 26;
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_FILL } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = cellBorder;
  });

  applications.forEach((app, index) => {
    const link = (app.graphicsDriveLink || '').trim();
    const status = app.status || 'Pending Review';

    const row = sheet.addRow({
      serial: index + 1,
      fullName: app.fullName || '',
      rollNo: String(app.rollNo ?? ''),
      department: app.department || '',
      year: app.year || '',
      mobile: String(app.mobile ?? ''),
      email: app.email || '',
      teams: (app.teams || []).join(', '),
      // Only real web links become clickable — the value is user-submitted.
      graphicsDriveLink: /^https?:\/\//i.test(link) ? { text: link, hyperlink: link } : link,
      motivation: app.motivation || '',
      status,
      // exceljs writes Dates as UTC; shift so Excel shows India wall-clock time.
      submittedAt: app.submittedAt ? new Date(new Date(app.submittedAt).getTime() + IST_OFFSET_MS) : '',
      id: app.id || '',
    });

    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = cellBorder;
      cell.alignment = { vertical: 'top', wrapText: true };
      if (index % 2 === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: STRIPE_FILL } };
      }
    });

    row.getCell('serial').alignment = { vertical: 'top', horizontal: 'center' };
    row.getCell('year').alignment = { vertical: 'top', horizontal: 'center' };
    row.getCell('rollNo').numFmt = '@';
    row.getCell('mobile').numFmt = '@';
    row.getCell('fullName').font = { bold: true };
    row.getCell('submittedAt').numFmt = 'dd mmm yyyy, hh:mm AM/PM';

    if (includePosterLink && typeof row.getCell('graphicsDriveLink').value === 'object') {
      row.getCell('graphicsDriveLink').font = { color: { argb: 'FF1A73E8' }, underline: true };
    }

    const statusStyle = STATUS_STYLES[status];
    const statusCell = row.getCell('status');
    statusCell.alignment = { vertical: 'top', horizontal: 'center' };
    if (statusStyle) {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusStyle.fill } };
      statusCell.font = { bold: true, color: { argb: statusStyle.font } };
    }
  });

  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: sheet.columns.length },
  };
}

/**
 * Builds the recruitment workbook: one "All Applications" sheet plus one sheet
 * per team. An applicant who chose several teams appears on each of those
 * team sheets.
 */
function buildWorkbook(applications) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'GDG ViMEET Admin';
  workbook.created = new Date();

  addSheet(workbook, 'All Applications', applications, { includePosterLink: true });

  TEAMS.forEach((team) => {
    addSheet(
      workbook,
      team,
      applications.filter((app) => belongsToTeam(app, team)),
      { includePosterLink: team === 'Graphics & Design' }
    );
  });

  return workbook;
}

/**
 * Syncs the given applications to the local Excel backup file.
 * This overwrites the file with the latest database state.
 */
async function syncToExcel(applications) {
  try {
    fs.mkdirSync(path.dirname(EXCEL_FILE_PATH), { recursive: true });
    await buildWorkbook(applications).xlsx.writeFile(EXCEL_FILE_PATH);
    console.log(`Successfully synced ${applications.length} applications to ${EXCEL_FILE_PATH}`);
  } catch (error) {
    console.error('Error syncing to Excel:', error);
  }
}

module.exports = { syncToExcel, buildWorkbook };
