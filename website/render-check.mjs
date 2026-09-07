/**
 * Rendering check.
 *
 * `audit.mjs` reads the built HTML; this one renders it in a real browser and
 * asserts layout guarantees that the static audit cannot see:
 *
 *   1. Nothing overflows horizontally, which is the usual cause of an
 *      unexpected sideways scrollbar on mobile.
 *   2. Empty-state cards preserve the responsive shell gutters.
 *   3. Process cards keep copy together and links at the bottom.
 *   4. Keyboard focus remains visible on FAQ and form controls.
 *
 * Needs a Chrome/Chromium binary and `puppeteer-core`. When neither is present
 * it skips rather than fails, so `npm run check` stays usable without them.
 *
 *   node render-check.mjs [--base http://localhost:4321]
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('./dist/', import.meta.url));

const PATHS = [
  '/',
  '/produkti/',
  '/storitve/',
  '/storitve/avtomatizacija-administracije/',
  '/storitve/avtomatizacija-prodaje/',
  '/storitve/spremljanje-trga/',
  '/proces/',
  '/novice/',
  '/dogodki/',
  '/blog/',
  '/o-podjetju/',
  '/ekipa/',
  '/pogosta-vprasanja/',
  '/kontakt/',
];

/* Common desktop, laptop, tablet and phone widths, plus the exact widths
   immediately around the 960px global-chrome breakpoint. */
const WIDTHS = [
  1920, 1600, 1440, 1366, 1281, 1280, 1180, 1100, 1024, 1000, 961, 960, 959, 900, 768, 414, 390, 360,
];

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/local/bin/google-chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

function skip(reason) {
  console.log(`Preskočeno — ${reason}`);
  console.log('(Namestite puppeteer-core in Chrome, da se izvede tudi ta pregled.)');
  process.exit(0);
}

/** Minimal static server over dist/, so the check needs nothing else running. */
function serve() {
  const server = createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = join(DIST, p);
    if (!file.startsWith(DIST) || !existsSync(file)) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  });
  return new Promise((resolve) => server.listen(0, () => resolve(server)));
}

/** Runs in the page. Returns responsive layout and component-alignment defects. */
function findProblems(path, width) {
  const overflow = document.documentElement.scrollWidth > window.innerWidth + 1
    ? { scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }
    : null;

  const components = [];
  const emptyCard = document.querySelector('.empty-state__inner');
  if (emptyCard && [390, 768].includes(width)) {
    const rect = emptyCard.getBoundingClientRect();
    const expectedGutter = width === 390 ? 20 : 32;
    const left = rect.left;
    const right = window.innerWidth - rect.right;
    if (left < expectedGutter - 1 || right < expectedGutter - 1) {
      components.push(`empty-state gutters ${left.toFixed(1)}px/${right.toFixed(1)}px; expected ${expectedGutter}px`);
    }
  }

  if (path === '/' && width >= 1024) {
    document.querySelectorAll('.process-overview .card').forEach((card, index) => {
      const title = card.querySelector('h3');
      const body = card.querySelector('p');
      const link = card.querySelector('.link');
      if (!title || !body || !link) return;
      const titleGap = body.getBoundingClientRect().top - title.getBoundingClientRect().bottom;
      const bottomGap = card.getBoundingClientRect().bottom - link.getBoundingClientRect().bottom;
      if (titleGap > 32 || bottomGap < 12 || bottomGap > 36) {
        components.push(
          `process card ${index + 1} alignment title/body=${titleGap.toFixed(1)}px link/bottom=${bottomGap.toFixed(1)}px`
        );
      }
    });
  }

  if (path === '/' && [1000, 1024].includes(width)) {
    const footerNav = document.querySelector('.footer-nav');
    if (footerNav) {
      const columnCount = getComputedStyle(footerNav).gridTemplateColumns.split(' ').length;
      if (columnCount < 2) {
        components.push(`footer navigation collapsed to ${columnCount} column`);
      }
    }
  }

  return { overflow, components };
}

async function checkKeyboardFocus(page, base, { path, selector, label, unclipped = false }) {
  await page.goto(base + path, { waitUntil: 'domcontentloaded' });

  let found = false;
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press('Tab');
    found = await page.evaluate((target) => document.activeElement?.matches(target), selector);
    if (found) break;
  }
  if (!found) return `${label} — keyboard Tab did not reach ${selector}`;

  const state = await page.$eval(
    selector,
    (element, mustBeUnclipped) => {
      const style = getComputedStyle(element);
      const container = element.closest('.faq-item');
      return {
        focusVisible: element.matches(':focus-visible'),
        outlineWidth: parseFloat(style.outlineWidth),
        outlineStyle: style.outlineStyle,
        outlineColor: style.outlineColor,
        containerOverflow: container ? getComputedStyle(container).overflow : 'visible',
        mustBeUnclipped,
      };
    },
    unclipped
  );

  const clearOutline =
    state.focusVisible &&
    state.outlineWidth >= 2 &&
    state.outlineStyle !== 'none' &&
    state.outlineColor === 'rgb(29, 119, 254)';
  if (!clearOutline) {
    return `${label} — focus indicator is not a clear 2px AIS-blue outline (${JSON.stringify(state)})`;
  }
  if (state.mustBeUnclipped && ['hidden', 'clip'].includes(state.containerOverflow)) {
    return `${label} — focus outline is clipped by overflow:${state.containerOverflow}`;
  }
  return null;
}

async function main() {
  let puppeteer;
  try {
    ({ default: puppeteer } = await import('puppeteer-core'));
  } catch {
    skip('puppeteer-core ni nameščen');
  }

  const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!executablePath) skip('Chrome ni najden');

  if (!existsSync(DIST)) {
    console.error('dist/ ne obstaja — najprej zaženite `npm run build`.');
    process.exit(1);
  }

  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;

  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const errors = [];
  let checked = 0;

  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      try {
        sessionStorage.setItem('ais-intro', '1');
      } catch {
        /* ignore */
      }
    });
    await page.setViewport({ width, height: 1000 });

    for (const path of PATHS) {
      await page.goto(base + path, { waitUntil: 'domcontentloaded' });
      const { overflow, components } = await page.evaluate(findProblems, path, width);
      checked++;

      if (overflow) {
        errors.push(
          `${width}px ${path} — vodoravno prelivanje (${overflow.scrollWidth}px > ${overflow.innerWidth}px)`
        );
      }
      for (const component of components) {
        errors.push(`${width}px ${path} — ${component}`);
      }
    }

    await page.close();
  }

  const focusPage = await browser.newPage();
  await focusPage.evaluateOnNewDocument(() => {
    try {
      sessionStorage.setItem('ais-intro', '1');
    } catch {
      /* ignore */
    }
  });
  await focusPage.setViewport({ width: 1024, height: 1000 });
  for (const check of [
    { path: '/', selector: '.faq-item > summary', label: 'FAQ summary', unclipped: true },
    { path: '/kontakt/', selector: '.field input', label: 'Light contact input' },
    { path: '/', selector: '.ctaform input', label: 'Dark CTA input' },
  ]) {
    const error = await checkKeyboardFocus(focusPage, base, check);
    if (error) errors.push(error);
  }
  await focusPage.close();

  await browser.close();
  server.close();

  console.log('\nPregled izrisa');
  console.log('─'.repeat(72));
  console.log(`${PATHS.length} strani × ${WIDTHS.length} širin = ${checked} kombinacij`);

  if (errors.length) {
    console.log('');
    for (const e of errors) console.log(`  NAPAKA  ${e}`);
    console.log(`\n${errors.length} napak.`);
    process.exit(1);
  }

  console.log('Brez prelivanja ali regresij globalnih komponent.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
