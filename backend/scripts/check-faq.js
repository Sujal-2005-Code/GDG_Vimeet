#!/usr/bin/env node
// Validates backend/content/faq.json and checks that the facts it duplicates
// still exist in the frontend source. Run as `npm run check:faq`, and in CI.
//
// The frontend files are read as TEXT, not required — they are ES modules
// (site.js uses import.meta.env), which this CommonJS script cannot import
// directly. This only proves the literal strings still appear somewhere in
// the file; it cannot verify they're used correctly. That's a deliberate
// trade-off for a zero-dependency sync check.
const fs = require('fs');
const path = require('path');

const FAQ_PATH = path.join(__dirname, '..', 'content', 'faq.json');
const FRONTEND_SRC = path.join(__dirname, '..', '..', 'frontend', 'src');
const REQUIRED_FIELDS = ['id', 'category', 'question', 'variations', 'answer', 'tags', 'links', 'sources', 'status', 'lastReviewed', 'featured'];
const VALID_STATUS = new Set(['confirmed', 'placeholder']);
const STALE_AFTER_DAYS = 120;

// Facts the FAQ repeats from the frontend — if one of these disappears from
// its source file, the FAQ is describing something that no longer exists.
const SYNCED_FACTS = [
  { value: 'Technical', file: 'data/recruitment.js' },
  { value: 'Graphics & Design', file: 'data/recruitment.js' },
  { value: 'Content & Social Media', file: 'data/recruitment.js' },
  { value: 'PR & Outreach', file: 'data/recruitment.js' },
  { value: 'Event Management', file: 'data/recruitment.js' },
  { value: 'gdgvimeet@gmail.com', file: 'data/site.js' },
  { value: 'instagram.com/gdgvimeet', file: 'data/site.js' },
  { value: 'linkedin.com/company/gdgvimeet', file: 'data/site.js' },
  { value: 'github.com/gdgvimeet', file: 'data/site.js' },
  { value: 'Google Cloud Study Jams Campaign', file: 'data/events.js' },
  { value: 'Git & GitHub Workshop', file: 'data/events.js' },
  { value: 'Nirmaan', file: 'data/events.js' },
  { value: 'Jamming Session', file: 'data/events.js' },
];

const readFrontend = (relativePath) => {
  try {
    return fs.readFileSync(path.join(FRONTEND_SRC, relativePath), 'utf8');
  } catch {
    return null;
  }
};

function main() {
  const errors = [];
  const warnings = [];

  const faq = JSON.parse(fs.readFileSync(FAQ_PATH, 'utf8'));
  if (!Array.isArray(faq) || faq.length === 0) {
    console.error('faq.json must be a non-empty array.');
    process.exit(1);
  }

  const seenIds = new Set();
  const now = Date.now();

  for (const entry of faq) {
    const label = entry?.id ?? '(missing id)';

    for (const field of REQUIRED_FIELDS) {
      if (!(field in entry)) errors.push(`${label}: missing field "${field}"`);
    }
    if (entry.id) {
      if (seenIds.has(entry.id)) errors.push(`${label}: duplicate id`);
      seenIds.add(entry.id);
    }
    if (entry.status && !VALID_STATUS.has(entry.status)) {
      errors.push(`${label}: invalid status "${entry.status}" (must be confirmed|placeholder)`);
    }
    if (!Array.isArray(entry.variations) || entry.variations.length === 0) {
      errors.push(`${label}: needs at least one entry in "variations"`);
    }
    if (typeof entry.answer !== 'string' || entry.answer.trim().length < 15) {
      errors.push(`${label}: "answer" is missing or too short`);
    }
    if (entry.lastReviewed) {
      const reviewed = new Date(entry.lastReviewed);
      if (Number.isNaN(reviewed.getTime())) {
        errors.push(`${label}: "lastReviewed" is not a valid date`);
      } else {
        const ageDays = (now - reviewed.getTime()) / 86_400_000;
        if (ageDays > STALE_AFTER_DAYS) {
          warnings.push(`${label}: last reviewed ${Math.round(ageDays)} days ago (>${STALE_AFTER_DAYS})`);
        }
      }
    }
  }

  const fileCache = new Map();
  for (const fact of SYNCED_FACTS) {
    if (!fileCache.has(fact.file)) fileCache.set(fact.file, readFrontend(fact.file));
    const contents = fileCache.get(fact.file);
    if (contents === null) {
      errors.push(`Cannot read frontend/src/${fact.file} to check "${fact.value}"`);
    } else if (!contents.includes(fact.value)) {
      errors.push(`"${fact.value}" no longer found in frontend/src/${fact.file} — an FAQ entry may describe something that changed or was removed`);
    }
  }

  console.log(`Checked ${faq.length} FAQ entries and ${SYNCED_FACTS.length} synced facts.`);

  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log('  - ' + w));
  }

  if (errors.length) {
    console.log(`\n${errors.length} error(s):`);
    errors.forEach((e) => console.log('  - ' + e));
    process.exit(1);
  }

  console.log('\nfaq.json is valid and in sync.');
}

main();
