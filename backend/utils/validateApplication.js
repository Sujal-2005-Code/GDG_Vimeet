// Server-side mirror of the client validation in
// frontend/src/sections/Recruitment.jsx. The client checks exist for UX;
// this is what actually protects the database, since a public endpoint must
// never trust the browser to have run its own rules.
//
// Keep TEAM_IDS / DEPARTMENTS / YEARS in sync with
// frontend/src/data/recruitment.js and frontend/src/sections/Recruitment.jsx
// — duplicated here because that file is an ES module this CommonJS backend
// cannot require directly.
const TEAM_IDS = ['Technical', 'Graphics & Design', 'Content & Social Media', 'PR & Outreach', 'Event Management'];
const DEPARTMENTS = ['Computer Engineering', 'CSE (AIML)', 'Mechanical', 'EXTC', 'Civil', 'Electrical'];
const YEARS = ['SE', 'TE', 'BE'];

const MOBILE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TEXT = 200;
const MAX_MOTIVATION = 2000;

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

/**
 * Builds a clean application document from untrusted input, or returns an
 * error. Never spreads req.body — every field is read, checked and
 * re-assigned explicitly, so a caller cannot set `status`, `id`, or any
 * field this schema doesn't define.
 */
function validateApplication(body) {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body.' };
  }

  const { fullName, rollNo, department, year, mobile, email, teams, graphicsDriveLink, motivation } = body;

  if (!isNonEmptyString(fullName) || fullName.length > MAX_TEXT) {
    return { error: 'Please enter your full name.' };
  }
  if (!isNonEmptyString(rollNo) || rollNo.length > MAX_TEXT) {
    return { error: 'Please enter your college roll number.' };
  }
  if (!DEPARTMENTS.includes(department)) {
    return { error: 'Please select a valid department.' };
  }
  if (!YEARS.includes(year)) {
    return { error: 'Please select a valid year of study.' };
  }
  if (!isNonEmptyString(mobile) || !MOBILE_RE.test(mobile.trim())) {
    return { error: 'Please enter a valid 10-digit Indian mobile number.' };
  }
  if (!isNonEmptyString(email) || !EMAIL_RE.test(email.trim()) || email.length > MAX_TEXT) {
    return { error: 'Please enter a valid email address.' };
  }
  if (!Array.isArray(teams) || teams.length === 0 || !teams.every((t) => TEAM_IDS.includes(t))) {
    return { error: 'Please select at least one valid team.' };
  }

  const isGraphics = teams.includes('Graphics & Design');
  const drive = typeof graphicsDriveLink === 'string' ? graphicsDriveLink.trim() : '';
  if (isGraphics && drive && !drive.includes('http')) {
    return { error: 'Please enter a valid URL (starting with https://).' };
  }
  if (typeof motivation === 'string' && motivation.length > MAX_MOTIVATION) {
    return { error: 'Motivation is too long.' };
  }

  return {
    application: {
      fullName: fullName.trim(),
      rollNo: rollNo.trim().toUpperCase(),
      department,
      year,
      mobile: mobile.trim(),
      email: email.trim(),
      teams,
      graphicsDriveLink: isGraphics ? drive : '',
      motivation: typeof motivation === 'string' ? motivation.trim() : '',
    },
  };
}

module.exports = { validateApplication, TEAM_IDS, DEPARTMENTS, YEARS };
