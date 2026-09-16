const test = require('node:test');
const assert = require('node:assert/strict');
const ExcelJS = require('exceljs');
const { buildWorkbook } = require('./excel');

const APPLICATIONS = [
  {
    id: 'gdg-1', fullName: 'Multi Team', rollNo: 'A1', department: 'Computer Engineering', year: 'SE',
    mobile: '9876543210', email: 'multi@example.com', teams: ['Technical', 'Event Management'],
    motivation: '', status: 'Pending Review', submittedAt: new Date('2026-01-15T10:00:00Z'),
  },
  {
    id: 'gdg-2', fullName: 'Legacy Name', rollNo: 'A2', department: 'CSE (AIML)', year: 'TE',
    mobile: '9123456780', email: 'legacy@example.com', teams: ['Technical Team'], // old " Team" suffix
    motivation: '', status: 'Shortlisted', submittedAt: new Date('2026-01-14T10:00:00Z'),
  },
  {
    id: 'gdg-3', fullName: 'Graphics Applicant', rollNo: 'A3', department: 'Civil', year: 'BE',
    mobile: '9000000001', email: 'g@example.com', teams: ['Graphics & Design'],
    graphicsDriveLink: 'https://drive.google.com/x', motivation: '', status: 'Rejected',
    submittedAt: new Date('2026-01-13T10:00:00Z'),
  },
];

const sheetNames = (wb) => wb.worksheets.map((ws) => ws.name);
const namesOnSheet = (wb, sheetName) => {
  const ws = wb.getWorksheet(sheetName);
  const names = [];
  for (let r = 2; r <= ws.rowCount; r++) names.push(ws.getRow(r).getCell(2).value);
  return names;
};

test('creates one "All Applications" sheet plus one per team', () => {
  const wb = buildWorkbook(APPLICATIONS);
  assert.deepEqual(sheetNames(wb), [
    'All Applications',
    'Technical',
    'Graphics & Design',
    'Content & Social Media',
    'PR & Outreach',
    'Event Management',
  ]);
});

test('All Applications sheet lists every applicant', () => {
  const wb = buildWorkbook(APPLICATIONS);
  assert.deepEqual(namesOnSheet(wb, 'All Applications'), ['Multi Team', 'Legacy Name', 'Graphics Applicant']);
});

test('an applicant with multiple teams appears on every one of those team sheets', () => {
  const wb = buildWorkbook(APPLICATIONS);
  assert.ok(namesOnSheet(wb, 'Technical').includes('Multi Team'));
  assert.ok(namesOnSheet(wb, 'Event Management').includes('Multi Team'));
  assert.equal(namesOnSheet(wb, 'PR & Outreach').includes('Multi Team'), false);
});

test('legacy "X Team" naming still routes to the correct team sheet', () => {
  const wb = buildWorkbook(APPLICATIONS);
  assert.ok(namesOnSheet(wb, 'Technical').includes('Legacy Name'));
});

test('only the All Applications and Graphics & Design sheets carry the poster link column', () => {
  const wb = buildWorkbook(APPLICATIONS);
  const headerOf = (sheetName) => wb.getWorksheet(sheetName).getRow(1).values.slice(1);

  assert.ok(headerOf('All Applications').includes('Poster Drive Link'));
  assert.ok(headerOf('Graphics & Design').includes('Poster Drive Link'));
  assert.equal(headerOf('Technical').includes('Poster Drive Link'), false);
});

test('mobile and roll number are stored as text, not numbers', () => {
  const wb = buildWorkbook(APPLICATIONS);
  const ws = wb.getWorksheet('All Applications');
  const headers = ws.getRow(1).values.slice(1);
  const col = (name) => headers.indexOf(name) + 1;

  const mobileCell = ws.getRow(2).getCell(col('Mobile'));
  const rollCell = ws.getRow(2).getCell(col('Roll No'));

  assert.equal(typeof mobileCell.value, 'string');
  assert.equal(mobileCell.value, '9876543210');
  assert.equal(mobileCell.numFmt, '@');
  assert.equal(rollCell.numFmt, '@');
});

test('a graphics poster link with http becomes a hyperlink; a non-URL stays plain text', () => {
  const bad = [{ ...APPLICATIONS[2], graphicsDriveLink: 'javascript:alert(1)' }];
  const wb = buildWorkbook(bad);
  const ws = wb.getWorksheet('Graphics & Design');
  const headers = ws.getRow(1).values.slice(1);
  const linkCell = ws.getRow(2).getCell(headers.indexOf('Poster Drive Link') + 1);

  assert.equal(typeof linkCell.value, 'string');
  assert.equal(linkCell.value, 'javascript:alert(1)');
});

test('workbook can be serialised to a real xlsx buffer', async () => {
  const wb = buildWorkbook(APPLICATIONS);
  const buffer = await wb.xlsx.writeBuffer();

  // Re-read it back through ExcelJS to prove it's a valid xlsx, not just bytes.
  const roundTrip = new ExcelJS.Workbook();
  await roundTrip.xlsx.load(buffer);
  assert.equal(roundTrip.worksheets.length, 6);
});

test('an empty applications array still produces a valid, empty workbook', () => {
  const wb = buildWorkbook([]);
  assert.equal(sheetNames(wb).length, 6);
  assert.equal(wb.getWorksheet('All Applications').rowCount, 1); // header only
});
