#!/usr/bin/env node
/**
 * Renders tools/video/scene.html to the clips used by the converge section.
 *
 * Each scene exposes `renderFrame(t)` as a pure function of time, so frames are
 * captured deterministically instead of racing a live animation. Output goes to
 * public/video as mp4 (h264) + webm (vp9), plus a poster frame for each clip.
 *
 *   node tools/video/render.mjs            all scenes
 *   node tools/video/render.mjs code       one scene
 *
 * Only needed when the scene source changes; the encoded clips are committed.
 */

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer-core';

const run = promisify(execFile);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const OUT = path.join(ROOT, 'public', 'video');
const TMP = path.join(HERE, '.frames');

const WIDTH = 1280;
const HEIGHT = 800;
const FPS = 30;

const SCENES = [
  { id: 'flow', seconds: 9 },
  { id: 'code', seconds: 10 },
  { id: 'saas', seconds: 9 },
];

const CHROME =
  process.env.CHROME_PATH ||
  ['/usr/local/bin/google-chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(Boolean);

async function encode(id) {
  const frames = path.join(TMP, id, 'f-%05d.png');

  await run('ffmpeg', [
    '-y', '-framerate', String(FPS), '-i', frames,
    '-c:v', 'libx264', '-preset', 'veryslow', '-crf', '30',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    /* even dimensions required by yuv420p */
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    path.join(OUT, `${id}.mp4`),
  ]);

  await run('ffmpeg', [
    '-y', '-framerate', String(FPS), '-i', frames,
    '-c:v', 'libvpx-vp9', '-crf', '38', '-b:v', '0',
    '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2',
    '-pix_fmt', 'yuv420p',
    path.join(OUT, `${id}.webm`),
  ]);
}

async function main() {
  const only = process.argv[2];
  const scenes = only ? SCENES.filter((s) => s.id === only) : SCENES;
  if (!scenes.length) throw new Error(`Unknown scene: ${only}`);

  await mkdir(OUT, { recursive: true });
  await rm(TMP, { recursive: true, force: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1', '--hide-scrollbars'],
  });

  try {
    for (const scene of scenes) {
      const dir = path.join(TMP, scene.id);
      await mkdir(dir, { recursive: true });

      const page = await browser.newPage();
      await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
      await page.goto(`file://${path.join(HERE, 'scene.html')}?scene=${scene.id}`, {
        waitUntil: 'load',
      });

      const total = Math.round(scene.seconds * FPS);
      for (let i = 0; i < total; i++) {
        await page.evaluate((t) => window.renderFrame(t), i / FPS);
        await page.screenshot({
          path: path.join(dir, `f-${String(i + 1).padStart(5, '0')}.png`),
          optimizeForSpeed: true,
        });
      }

      /* Poster: a frame late enough that the scene is fully built. */
      await page.evaluate((t) => window.renderFrame(t), scene.seconds * 0.85);
      await page.screenshot({ path: path.join(OUT, `${scene.id}-poster.jpg`), quality: 72, type: 'jpeg' });
      await page.close();

      await encode(scene.id);
      process.stdout.write(`  ${scene.id}: ${total} frames → ${scene.id}.mp4 / .webm\n`);
    }
  } finally {
    await browser.close();
  }

  await rm(TMP, { recursive: true, force: true });
  await writeFile(
    path.join(OUT, 'README.md'),
    '# Generated clips\n\nRendered from `tools/video/scene.html` by `node tools/video/render.mjs`.\nDo not edit by hand — re-run the renderer instead.\n'
  );
  process.stdout.write('Done.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
