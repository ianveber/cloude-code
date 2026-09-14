#!/usr/bin/env node
/**
 * Renders tools/pictures/scene.html to the still images used by the three
 * capability pillars on the home page.
 *
 * Each scene is a static product screen drawn in HTML so the pictures stay
 * on-brand, crisp at any size and honest about being illustrative. Output goes
 * to public/pictures as webp (served) plus jpg (fallback).
 *
 *   node tools/pictures/render.mjs            all scenes (pillars + products)
 *   node tools/pictures/render.mjs saas       one scene (or several ids)
 *
 * Only needed when the scene source changes; the encoded images are committed.
 * Needs Chrome and ffmpeg.
 */

import { mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer-core';

const run = promisify(execFile);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const OUT = path.join(ROOT, 'public', 'pictures');
const TMP = path.join(HERE, '.frames');

/* CSS pixels. Captured at 2× so the image stays sharp on retina screens. */
const WIDTH = 1600;
const HEIGHT = 1000;
const SCALE = 2;

/* Scenes live in two files: the three pillar screens and the product demos. */
const FILES = {
  'scene.html': ['saas', 'flow', 'security'],
  'products.html': ['inspectus-vldr', 'inspectus-vin', 'athlos', 'aisos', 'ais-command', 'model-premazi', 'pacom', 'zalife', 'elementum', 'tower-spa', 'asya-grafy', 'si-big', 'heva', 'epolac'],
  'details.html': ['athlos-detail', 'ais-command-detail', 'aisos-detail', 'inspectus-vldr-detail', 'inspectus-vin-detail', 'model-premazi-detail', 'pacom-detail', 'zalife-detail', 'elementum-detail', 'tower-spa-detail', 'asya-grafy-detail', 'si-big-detail', 'heva-detail', 'epolac-detail'],
  'mockups.html': ['athlos-real', 'ais-command-real', 'aisos-real', 'inspectus-vldr-real', 'inspectus-vin-real', 'model-premazi-real', 'pacom-real', 'zalife-real', 'elementum-real', 'tower-spa-real', 'asya-grafy-real', 'si-big-real', 'heva-real', 'epolac-real'],
  'blog.html': ['blog-kaj-je-ai-avtomatizacija', 'blog-kaj-je-ai-agent', 'blog-prvi-proces-za-avtomatizacijo', 'blog-sistem-mora-znati-reci-ne-vem', 'blog-kako-ai-odgovarja-iz-dokumentov', 'blog-koliko-casa-vzame-uvedba', 'blog-kaj-se-zgodi-z-vasimi-podatki', 'blog-ai-chatbot-v-slovenscini'],
};
const SCENES = Object.values(FILES).flat();

const CHROME =
  process.env.CHROME_PATH ||
  [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/local/bin/google-chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find((p) => existsSync(p));

if (!CHROME) {
  console.error('Chrome not found. Set CHROME_PATH.');
  process.exit(1);
}

async function encode(id) {
  const png = path.join(TMP, `${id}.png`);

  await run('ffmpeg', [
    '-y', '-i', png,
    '-c:v', 'libwebp', '-quality', '84', '-compression_level', '6',
    path.join(OUT, `${id}.webp`),
  ]);

  await run('ffmpeg', [
    '-y', '-i', png,
    '-q:v', '3',
    path.join(OUT, `${id}.jpg`),
  ]);
}

async function main() {
  /* No argument renders everything; one or more ids render just those. */
  const only = process.argv.slice(2);
  const scenes = only.length ? SCENES.filter((s) => only.includes(s)) : SCENES;
  if (!scenes.length) {
    console.error(`Unknown scene: ${only.join(', ')}. Choose from ${SCENES.join(', ')}.`);
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });
  await rm(TMP, { recursive: true, force: true });
  await mkdir(TMP, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--font-render-hinting=none'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: SCALE });

    for (const [file, ids] of Object.entries(FILES)) {
      const wanted = ids.filter((id) => scenes.includes(id));
      if (!wanted.length) continue;
      await page.goto(`file://${path.join(HERE, file)}`, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);

      for (const id of wanted) {
        await page.evaluate((scene) => {
          document.querySelectorAll('.stage').forEach((el) => el.classList.toggle('on', el.id === scene));
        }, id);
        await new Promise((r) => setTimeout(r, 120));
        await page.screenshot({
          path: path.join(TMP, `${id}.png`),
          clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
        });
        await encode(id);
        process.stdout.write(`  ${id}: ${WIDTH * SCALE}×${HEIGHT * SCALE} → public/pictures/${id}.webp + .jpg\n`);
      }
    }
  } finally {
    await browser.close();
    await rm(TMP, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
