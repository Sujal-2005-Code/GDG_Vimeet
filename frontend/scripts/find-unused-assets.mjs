#!/usr/bin/env node
// Lists files under public/ that no source file (or index.html) references
// by name. Run with `node scripts/find-unused-assets.mjs` from frontend/.
//
// A file is "referenced" if its basename appears anywhere in src/ or
// index.html as plain text — deliberately loose (not just import statements)
// because assets are also referenced as string literals like
// `/images/logo.webp` or built from a template string (`${slug}/${i}.webp`).
// That looseness means this can under-report unused files (never over-report
// a used one as unused) — treat its output as candidates to check by hand,
// not as a safe-to-delete list.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(here, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const SRC_DIR = path.join(ROOT, 'src');
const INDEX_HTML = path.join(ROOT, 'index.html');

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const publicFiles = walk(PUBLIC_DIR).filter((f) => !f.endsWith('manifest.json'));
const sourceFiles = [...walk(SRC_DIR), INDEX_HTML];
const haystack = sourceFiles.map((f) => readFileSync(f, 'utf8')).join('\n');

const unused = [];
let totalBytes = 0;
let unusedBytes = 0;

for (const file of publicFiles) {
  const size = statSync(file).size;
  totalBytes += size;
  const name = path.basename(file);
  if (!haystack.includes(name)) {
    unused.push({ file: path.relative(ROOT, file), size });
    unusedBytes += size;
  }
}

const mb = (bytes) => (bytes / 1_048_576).toFixed(2) + ' MB';

console.log(`Scanned ${publicFiles.length} files under public/ (${mb(totalBytes)} total).\n`);

if (unused.length === 0) {
  console.log('No unreferenced files found.');
} else {
  console.log(`${unused.length} file(s) not mentioned anywhere in src/ or index.html (${mb(unusedBytes)}):\n`);
  unused
    .sort((a, b) => b.size - a.size)
    .forEach(({ file, size }) => console.log(`  ${(size / 1024).toFixed(0).padStart(6)} KB  ${file}`));
  console.log('\nVerify each by hand before deleting — see the comment at the top of this script.');
}
