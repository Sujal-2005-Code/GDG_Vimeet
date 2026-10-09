#!/usr/bin/env node
// Creates the smaller copies the site serves through `srcset` (see
// src/components/ui/Photo.jsx) for every event photo:
//
//   public/events/<event>/<n>.webp       the original (≤1600px wide)
//   public/events/<event>/<n>-960.webp   960px wide
//   public/events/<event>/<n>-480.webp   480px wide
//
// Run from frontend/ after adding photos:   node scripts/make-image-variants.mjs
// Only photos named `<number>.webp` are processed; existing variants that are
// newer than their original are skipped. Images are never upscaled and all
// metadata (EXIF, GPS) is dropped.
import { readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const EVENTS_DIR = path.join(here, '..', 'public', 'events');
const WIDTHS = [
  { width: 480, quality: 70 },
  { width: 960, quality: 74 },
];
const ORIGINAL = /^(\d+)\.webp$/;

let made = 0;
let skipped = 0;
let bytes = 0;

for (const event of readdirSync(EVENTS_DIR, { withFileTypes: true })) {
  if (!event.isDirectory()) continue;
  const dir = path.join(EVENTS_DIR, event.name);
  for (const file of readdirSync(dir)) {
    const match = file.match(ORIGINAL);
    if (!match) continue;
    const source = path.join(dir, file);
    const sourceTime = statSync(source).mtimeMs;
    const { width: sourceWidth } = await sharp(source).metadata();

    for (const { width, quality } of WIDTHS) {
      const target = path.join(dir, `${match[1]}-${width}.webp`);
      if (existsSync(target) && statSync(target).mtimeMs >= sourceTime) {
        skipped += 1;
        continue;
      }
      const info = await sharp(source)
        .resize({ width: Math.min(width, sourceWidth), withoutEnlargement: true })
        .webp({ quality, effort: 5 })
        .toFile(target);
      bytes += info.size;
      made += 1;
    }
  }
}

console.log(`variants written: ${made} (${(bytes / 1024).toFixed(0)} KB), up to date: ${skipped}`);
