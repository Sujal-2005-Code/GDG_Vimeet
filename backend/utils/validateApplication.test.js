const test = require('node:test');
const assert = require('node:assert/strict');
const { validateApplication } = require('./validateApplication');

const VALID = {
  fullName: 'Rahul Sharma',
  rollNo: '23ce045',
  department: 'Computer Engineering',
  year: 'SE',
  mobile: '9876543210',
  email: 'rahul@example.com',
  teams: ['Technical'],
};

test('accepts a valid submission and normalises fields', () => {
  const { error, application } = validateApplication(VALID);
  assert.equal(error, undefined);
  assert.equal(application.rollNo, '23CE045'); // uppercased
  assert.equal(application.fullName, 'Rahul Sharma');
  assert.deepEqual(application.teams, ['Technical']);
});

test('strips fields not in the allowlist — the core mass-assignment fix', () => {
  const { application } = validateApplication({
    ...VALID,
    status: 'Shortlisted',
    id: 'gdg-attacker-controlled',
    isAdmin: true,
    __proto__: { polluted: true },
  });

  assert.equal('status' in application, false);
  assert.equal('id' in application, false);
  assert.equal('isAdmin' in application, false);
  assert.equal(Object.getPrototypeOf(application), Object.prototype);
});

test('rejects a missing full name', () => {
  const { error } = validateApplication({ ...VALID, fullName: '' });
  assert.match(error, /full name/i);
});

test('rejects an invalid department not in the fixed list', () => {
  const { error } = validateApplication({ ...VALID, department: 'Astrophysics' });
  assert.match(error, /department/i);
});

test('rejects an invalid year not in the fixed list', () => {
  const { error } = validateApplication({ ...VALID, year: 'FE' });
  assert.match(error, /year/i);
});

for (const bad of ['12345', '5876543210', '98765432101', 'abcdefghij', '']) {
  test(`rejects invalid mobile number: "${bad}"`, () => {
    const { error } = validateApplication({ ...VALID, mobile: bad });
    assert.match(error, /mobile/i);
  });
}

test('accepts mobile numbers starting 6-9', () => {
  for (const prefix of ['6', '7', '8', '9']) {
    const { error } = validateApplication({ ...VALID, mobile: prefix + '123456789' });
    assert.equal(error, undefined);
  }
});

for (const bad of ['not-an-email', 'missing@domain', '@example.com', 'a b@example.com']) {
  test(`rejects invalid email: "${bad}"`, () => {
    const { error } = validateApplication({ ...VALID, email: bad });
    assert.match(error, /email/i);
  });
}

test('rejects an empty teams array', () => {
  const { error } = validateApplication({ ...VALID, teams: [] });
  assert.match(error, /team/i);
});

test('rejects a team id that is not one of the five real teams', () => {
  const { error } = validateApplication({ ...VALID, teams: ['Not A Real Team'] });
  assert.match(error, /team/i);
});

test('rejects if teams is not an array', () => {
  const { error } = validateApplication({ ...VALID, teams: 'Technical' });
  assert.match(error, /team/i);
});

test('accepts multiple valid teams', () => {
  const { error, application } = validateApplication({ ...VALID, teams: ['Technical', 'Event Management'] });
  assert.equal(error, undefined);
  assert.deepEqual(application.teams, ['Technical', 'Event Management']);
});

test('drops graphicsDriveLink when Graphics & Design is not selected', () => {
  const { application } = validateApplication({ ...VALID, teams: ['Technical'], graphicsDriveLink: 'https://drive.google.com/x' });
  assert.equal(application.graphicsDriveLink, '');
});

test('keeps a valid graphicsDriveLink when Graphics & Design is selected', () => {
  const { application } = validateApplication({
    ...VALID,
    teams: ['Graphics & Design'],
    graphicsDriveLink: 'https://drive.google.com/file/d/abc',
  });
  assert.equal(application.graphicsDriveLink, 'https://drive.google.com/file/d/abc');
});

test('rejects a graphicsDriveLink without http when Graphics & Design is selected', () => {
  const { error } = validateApplication({ ...VALID, teams: ['Graphics & Design'], graphicsDriveLink: 'not-a-link' });
  assert.match(error, /valid URL/i);
});

test('allows an empty graphicsDriveLink even for Graphics & Design (it is optional)', () => {
  const { error } = validateApplication({ ...VALID, teams: ['Graphics & Design'], graphicsDriveLink: '' });
  assert.equal(error, undefined);
});

test('rejects a body that is not an object', () => {
  assert.match(validateApplication(null).error, /invalid/i);
  assert.match(validateApplication(undefined).error, /invalid/i);
  assert.match(validateApplication('string').error, /invalid/i);
});

test('rejects an overly long motivation', () => {
  const { error } = validateApplication({ ...VALID, motivation: 'x'.repeat(2001) });
  assert.match(error, /too long/i);
});

test('trims whitespace from text fields', () => {
  const { application } = validateApplication({ ...VALID, fullName: '  Rahul Sharma  ', email: '  rahul@example.com  ' });
  assert.equal(application.fullName, 'Rahul Sharma');
  assert.equal(application.email, 'rahul@example.com');
});
