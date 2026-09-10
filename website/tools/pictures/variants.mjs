#!/usr/bin/env node
/**
 * Right-sized variants for the rendered pictures and the client logos.
 *
 *   node tools/pictures/variants.mjs
 *
 * Pictures: every public/pictures/<id>.webp (3200×2000) gets <id>-800.webp and
 * <id>-1600.webp, so a tile or a phone never downloads the 3200px master.
 * Logos: every public/clients/<name>.png becomes <name>.webp inside a 110×110
 * box, twice the 55px pill it is shown in. SVG logos are left alone.
 * Prints the logo dimensions so content/showcase.mjs can carry them.
 * Needs ffmpeg and ffprobe.
 */

import { readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PICTURES = path.join(ROOT, 'public', 'pictures');
const CLIENTS = path.join(ROOT, 'public', 'clients');

async function main() {
  for (const file of await readdir(PICTURES)) {
    if (!file.endsWith('.webp') || /-\d+\.webp$/.test(file)) continue;
    const id = file.replace(/\.webp$/, '');
    if (existsSync(path.join(PICTURES, `${id}-1600.webp`))) continue;
    for (const width of [800, 1600]) {
      await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(PICTURES, file), '-vf', `scale=${width}:-1`, '-c:v', 'libwebp', '-quality', '82', path.join(PICTURES, `${id}-${width}.webp`)]);
    }
    process.stdout.write(`  ${id}: 800 + 1600\n`);
  }

  for (const file of await readdir(CLIENTS)) {
    if (!file.endsWith('.png')) continue;
    const name = file.replace(/\.png$/, '');
    const out = path.join(CLIENTS, `${name}.webp`);
    await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(CLIENTS, file), '-vf', 'scale=110:110:force_original_aspect_ratio=decrease', '-c:v', 'libwebp', '-lossless', '1', out]);
    /* ffprobe is not always installed next to ffmpeg; ffmpeg -i prints the size on stderr. */
    const probe = await run('ffmpeg', ['-i', out]).catch((e) => e);
    const size = String(probe.stderr ?? '').match(/(\d+)x(\d+)/);
    process.stdout.write(`  ${name}.webp ${size ? `${size[1]} ${size[2]}` : '?'}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
