#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const read = (file) => readFile(path.join(ROOT, file), 'utf8');
const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const home = await read('dist/index.html');
const art = await read('src/art.mjs');

expect(
  /data-brand-brain[^>]+src="\/brand\/favicon\.png"/.test(home),
  'Hero must use the official /brand/favicon.png brain.'
);
expect(
  /data-brand-lockup[^>]+src="\/brand\/logo-light\.png"/.test(home),
  'Intro must reveal the official light-background lockup.'
);
expect(!/brain3d__slice|class="brain-mark/.test(home), 'Generated home still contains invented brain SVG.');
expect(!/BRAIN_SILHOUETTE|brainMark|brainSlice/.test(art), 'src/art.mjs still defines invented brand art.');

if (failures.length) {
  failures.forEach((failure) => console.error(`DESIGN ERROR: ${failure}`));
  process.exit(1);
}

console.log('Design audit: brand source is exact.');
