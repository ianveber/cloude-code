#!/usr/bin/env node
/**
 * Preview screenshots for review. Not part of the build or the checks.
 *
 *   node tools/shots.mjs [outDir]
 *
 * Expects the dev server on http://127.0.0.1:4321 (npm run serve).
 */

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const OUT = process.argv[2] || '/opt/cursor/artifacts/screenshots';
const CHROME = process.env.CHROME_PATH || '/usr/local/bin/google-chrome';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function shoot(page, name, { full = false } = {}) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: full });
  process.stdout.write(`  ${name}\n`);
}

/** Scroll in steps so scroll-linked effects and lazy videos actually fire. */
async function scrollTo(page, y) {
  await page.evaluate((target) => {
    window.scrollTo({ top: target, behavior: 'instant' });
  }, y);
  await wait(600);
}

async function sectionTop(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    return window.scrollY + el.getBoundingClientRect().top;
  }, selector);
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  /* ── Opening sequence, caught at three moments ── */
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await wait(320);
  await shoot(page, 'intro-1-logo');
  await wait(750);
  await shoot(page, 'intro-2-wordmark');
  await wait(2200);
  await shoot(page, 'intro-3-hero');

  /* ── The rest of the home page, with the intro already seen ── */
  const seen = await browser.newPage();
  await seen.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await seen.evaluateOnNewDocument(() => {
    try {
      sessionStorage.setItem('ais-intro', '1');
    } catch (e) {}
  });

  await seen.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await wait(700);
  await shoot(seen, 'home-hero');

  for (const [name, selector, offset] of [
    ['home-converge-apart', '[data-converge]', -60],
    ['home-converge-merged', '[data-converge]', 620],
    ['home-cases', '.cases', -60],
    ['home-capband', '[data-capband]', -40],
    ['home-capitem', '.capitem', 260],
    ['home-team', '.team-band', -60],
    ['home-cta', '.ctaband', -60],
    ['home-blog', '.blog-band', -60],
  ]) {
    const top = await sectionTop(seen, selector);
    if (top === null) continue;
    await scrollTo(seen, Math.max(0, top + offset));
    await shoot(seen, name);
  }

  for (const [name, url] of [
    ['page-produkti', '/produkti/'],
    ['page-novice', '/novice/'],
    ['page-dogodki', '/dogodki/'],
    ['page-blog', '/blog/'],
  ]) {
    await seen.goto(`${BASE}${url}`, { waitUntil: 'networkidle0' });
    await wait(500);
    await shoot(seen, name);
  }

  /* ── Mobile ── */
  await seen.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await seen.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await wait(700);
  await shoot(seen, 'mobile-hero');
  const conv = await sectionTop(seen, '[data-converge]');
  if (conv !== null) {
    await scrollTo(seen, conv - 40);
    await shoot(seen, 'mobile-converge');
  }

  await browser.close();
  process.stdout.write('Done.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
