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

async function waitFor(page, fn, timeout = 4000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await page.evaluate(fn)) return true;
    await wait(40);
  }
  return false;
}

async function shoot(page, name, { full = false } = {}) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: full });
  process.stdout.write(`  ${name}\n`);
}

async function scrollTo(page, y) {
  await page.evaluate((target) => {
    window.scrollTo({ top: target, behavior: 'instant' });
  }, y);
  await wait(500);
}

async function sectionTop(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    return window.scrollY + el.getBoundingClientRect().top;
  }, selector);
}

async function scrollConverge(page, progress) {
  await page.evaluate((value) => {
    const section = document.querySelector('[data-converge]');
    if (!section) return;
    const origin = section.querySelector('.converge__stage') || section;
    const top = window.scrollY + origin.getBoundingClientRect().top;
    const target = top - window.innerHeight * 0.58 + value * window.innerHeight * 0.72;
    window.scrollTo({ top: Math.max(0, target), behavior: 'instant' });
  }, progress);
  await wait(450);
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
  });

  const intro = await browser.newPage();
  await intro.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await intro.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await waitFor(
    intro,
    () => {
      const stage = document.querySelector('[data-intro-stage]');
      return Boolean(stage?.classList.contains('is-logo') && !stage.classList.contains('is-word'));
    }
  );
  await wait(80);
  await shoot(intro, 'intro-logo');
  await waitFor(intro, () =>
    Boolean(document.querySelector('[data-intro-stage]')?.classList.contains('is-word'))
  );
  await wait(220);
  await shoot(intro, 'intro-lockup');
  await waitFor(intro, () => !document.documentElement.classList.contains('is-intro'));
  await wait(500);
  await shoot(intro, 'home-hero');
  await intro.close();

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => {
    try {
      sessionStorage.setItem('ais-intro', '1');
    } catch {
      /* ignore */
    }
  });

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await wait(600);
  await shoot(page, 'home-hero-resting');

  await scrollConverge(page, 0.12);
  await shoot(page, 'home-converge-apart');
  await scrollConverge(page, 0.7);
  await shoot(page, 'home-converge-merged');

  const home = [
    ['home-capabilities', '[data-capband]', 80],
    ['home-services', '[data-services]', -40],
    ['home-process', '[data-process-overview]', -40],
    ['home-team', '.team-band', -40],
    ['home-cta', '[data-cta], .ctaband', -40],
  ];

  for (const [name, selector, offset] of home) {
    const top = await sectionTop(page, selector);
    if (top === null) {
      process.stdout.write(`  skip ${name} (missing ${selector})\n`);
      continue;
    }
    await scrollTo(page, Math.max(0, top + offset));
    await shoot(page, name);
  }

  for (const [name, url] of [
    ['products-empty', '/produkti/'],
    ['news-empty', '/novice/'],
    ['events-empty', '/dogodki/'],
    ['blog-empty', '/blog/'],
  ]) {
    await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle0' });
    await wait(300);
    const top = await sectionTop(page, '.empty-state');
    if (top !== null) await scrollTo(page, Math.max(0, top - 80));
    await shoot(page, name);
  }

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await wait(500);
  await shoot(page, 'mobile-home');
  await page.$eval('.nav-toggle > summary', (el) => el.click());
  await wait(250);
  await shoot(page, 'mobile-menu');

  await browser.close();
  process.stdout.write('Done.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
