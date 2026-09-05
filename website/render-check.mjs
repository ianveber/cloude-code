/**
 * Rendering check.
 *
 * `audit.mjs` reads the built HTML; this one renders it in a real browser and
 * asserts two layout guarantees that the static audit cannot see:
 *
 *   1. No decorative drawing sits behind text at any width. The brief for this
 *      site was explicitly "no overlaying" — the art belongs in the page
 *      margins, and a careless placement change would put it under copy on some
 *      viewport nobody thought to open.
 *   2. Nothing overflows horizontally, which is the usual cause of an
 *      unexpected sideways scrollbar on mobile.
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
  '/storitve/',
  '/storitve/avtomatizacija-administracije/',
  '/storitve/avtomatizacija-prodaje/',
  '/storitve/spremljanje-trga/',
  '/proces/',
  '/o-podjetju/',
  '/ekipa/',
  '/pogosta-vprasanja/',
  '/kontakt/',
];

/* Common desktop, laptop, tablet and phone widths, plus the exact breakpoints
   where the decorative layer changes state. */
const WIDTHS = [1920, 1600, 1440, 1366, 1281, 1280, 1180, 1024, 900, 768, 414, 390, 360];

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

/** Runs in the page. Returns every decorative item whose box hits a text box. */
function findProblems() {
  const visible = (el) => {
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0;
  };

  const art = [...document.querySelectorAll('.decor__item')].filter(visible);
  const text = [...document.querySelectorAll(
    'h1,h2,h3,h4,h5,p,li,dt,dd,a,button,label,input,textarea,summary,blockquote,figcaption,span.chip'
  )].filter((el) => el.textContent.trim() || ['INPUT', 'TEXTAREA'].includes(el.tagName));

  const overlaps = [];
  for (const a of art) {
    const ar = a.getBoundingClientRect();
    if (!ar.width || !ar.height) continue;
    for (const t of text) {
      const tr = t.getBoundingClientRect();
      if (!tr.width || !tr.height) continue;
      const hits = !(ar.right <= tr.left || ar.left >= tr.right || ar.bottom <= tr.top || ar.top >= tr.bottom);
      if (hits) {
        overlaps.push({
          art: a.className.replace(/decor__item ?/g, '').trim(),
          tag: t.tagName.toLowerCase(),
          text: t.textContent.trim().slice(0, 48),
        });
        break; // one report per drawing is enough to locate it
      }
    }
  }

  const overflow = document.documentElement.scrollWidth > window.innerWidth + 1
    ? { scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }
    : null;

  return { overlaps, overflow };
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
    await page.setViewport({ width, height: 1000 });

    for (const path of PATHS) {
      await page.goto(base + path, { waitUntil: 'domcontentloaded' });
      const { overlaps, overflow } = await page.evaluate(findProblems);
      checked++;

      for (const o of overlaps) {
        errors.push(`${width}px ${path} — okras "${o.art}" leži pod <${o.tag}> "${o.text}"`);
      }
      if (overflow) {
        errors.push(
          `${width}px ${path} — vodoravno prelivanje (${overflow.scrollWidth}px > ${overflow.innerWidth}px)`
        );
      }
    }

    await page.close();
  }

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

  console.log('Brez prekrivanja okrasa in brez vodoravnega prelivanja.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
