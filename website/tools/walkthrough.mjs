#!/usr/bin/env node
/**
 * Records a walkthrough of the home page for review. Not part of the build.
 *
 *   node tools/walkthrough.mjs [outFile.mp4]
 *
 * Starts on a genuinely fresh session so the opening sequence actually plays,
 * then scrolls in small steps so the scroll-linked effects render.
 * Expects the dev server on http://127.0.0.1:4321 (npm run serve).
 */

import { mkdir, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import puppeteer from 'puppeteer-core';

const run = promisify(execFile);
const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const CHROME = process.env.CHROME_PATH || '/usr/local/bin/google-chrome';
const OUT = process.argv[2] || '/opt/cursor/artifacts/ais_home_solidification_walkthrough.mp4';
const TMP = '/tmp/walkthrough.webm';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await mkdir(path.dirname(OUT), { recursive: true });
  await rm(TMP, { force: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--autoplay-policy=no-user-gesture-required',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });

  const top = (sel) =>
    page.evaluate((s) => {
      const el = document.querySelector(s);
      return el ? window.scrollY + el.getBoundingClientRect().top : null;
    }, sel);

  async function glide(target, steps = 40, pause = 26) {
    const from = await page.evaluate(() => window.scrollY);
    for (let i = 1; i <= steps; i++) {
      const eased = i / steps;
      const y =
        from +
        (target - from) * (eased < 0.5 ? 2 * eased * eased : 1 - Math.pow(-2 * eased + 2, 2) / 2);
      await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), Math.round(y));
      await wait(pause);
    }
  }

  const recorder = await page.screencast({ path: TMP, fps: 30 });

  await page.evaluate(() => {
    try {
      sessionStorage.removeItem('ais-intro');
    } catch {
      /* ignore */
    }
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await wait(2600);

  const conv = await top('[data-converge]');
  if (conv !== null) {
    await glide(conv - 70, 46, 26);
    await wait(900);
    for (const off of [140, 300, 460, 620]) {
      await glide(conv + off, 16, 34);
      await wait(360);
    }
  }

  const cap = await top('[data-capband]');
  if (cap !== null) {
    await glide(cap - 50, 40, 28);
    await wait(600);
    const items = await page.evaluate(() =>
      [...document.querySelectorAll('.capitem')].map(
        (el) => window.scrollY + el.getBoundingClientRect().top
      )
    );
    for (const iy of items) {
      await glide(iy - 120, 22, 32);
      await wait(500);
    }
  }

  for (const [sel, off, hold] of [
    ['[data-services]', -40, 900],
    ['[data-process-overview]', -40, 800],
    ['.team-band', -40, 800],
    ['#pogosta-vprasanja, .faq', -40, 700],
    ['[data-cta], .ctaband', -40, 1600],
  ]) {
    const y = await top(sel);
    if (y === null) continue;
    await glide(y + off, 36, 26);
    await wait(hold);
  }

  await recorder.stop();
  await browser.close();

  await run('ffmpeg', [
    '-y',
    '-i',
    TMP,
    '-c:v',
    'libx264',
    '-preset',
    'veryfast',
    '-crf',
    '25',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    '-vf',
    'scale=1440:-2',
    OUT,
  ]);
  await rm(TMP, { force: true });
  process.stdout.write(`Wrote ${OUT}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
