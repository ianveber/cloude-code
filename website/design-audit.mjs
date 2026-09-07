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
const styles = await read('src/styles.css');
const layout = await read('src/layout.mjs');
const build = await read('build.mjs');
const content = await read('content/content.mjs');
const siteConfig = await read('content/site.mjs');

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
expect(
  /\.hero__intro-brain img\s*\{[^}]*width:\s*41\.7%;/s.test(styles),
  'Intro brain must match the official lockup glyph footprint (41.7%).'
);
expect(
  /showIntro:\s*true/.test(build) &&
    /page\.showIntro\s*\?\s*introOverlay\(\)\s*:\s*''/.test(layout) &&
    !/\bintro:/.test(content),
  'Intro must use a boolean page flag and call introOverlay without a string payload.'
);
expect(!/\blogoDark:/.test(siteConfig), 'Unused site.brand.logoDark must not remain configured.');

if (failures.length) {
  failures.forEach((failure) => console.error(`DESIGN ERROR: ${failure}`));
  process.exit(1);
}

console.log('Design audit: brand source is exact.');
