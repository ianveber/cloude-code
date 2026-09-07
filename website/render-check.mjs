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
  const visible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  };
  const embeddedBodyLink = (element) => {
    if (element.tagName !== 'A' || getComputedStyle(element).display !== 'inline') return false;
    const line = element.closest('p,dd');
    return Boolean(line && line.textContent.trim() !== element.textContent.trim());
  };

  const overflow = document.documentElement.scrollWidth > window.innerWidth + 1
    ? { scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }
    : null;
  const tooDim = [...document.querySelectorAll('main h1, main h2, main h3, main p')]
    .filter((element) => visible(element) && parseFloat(getComputedStyle(element).opacity) < 0.45)
    .map((element) => element.textContent.trim().slice(0, 48));
  const smallTargets = [...document.querySelectorAll('a,button,summary,input,textarea')]
    .filter((element) => visible(element) && !embeddedBodyLink(element))
    .map((element) => ({ element, rect: element.getBoundingClientRect() }))
    .filter(({ rect }) => rect.width < 44 || rect.height < 44)
    .map(
      ({ element, rect }) =>
        `${element.tagName.toLowerCase()} "${element.textContent.trim().slice(0, 24)}" ${Math.round(rect.width)}×${Math.round(rect.height)}`
    );

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

  if (path === '/' && width === 1440) {
    const capabilitySvgs = [...document.querySelectorAll('.capitem__art svg')];
    if (capabilitySvgs.length !== 4) {
      components.push(`capability artwork count ${capabilitySvgs.length}; expected 4`);
    }
    capabilitySvgs.forEach((svg, index) => {
      const box = svg.viewBox.baseVal;
      if (box.x !== 0 || box.y !== 0 || box.width !== 320 || box.height !== 200) {
        components.push(`capability artwork ${index + 1} viewBox is not 0 0 320 200`);
      }
      if (svg.querySelector('linearGradient, radialGradient')) {
        components.push(`capability artwork ${index + 1} contains a filled gradient`);
      }
      const inconsistent = [...svg.querySelectorAll('path,rect,circle,line,polyline,polygon')]
        .filter((element) => getComputedStyle(element).stroke !== 'none')
        .find((element) => {
          const style = getComputedStyle(element);
          return (
            Math.abs(parseFloat(style.strokeWidth) - 1.5) > 0.01 ||
            style.strokeLinecap !== 'round' ||
            style.strokeLinejoin !== 'round'
          );
        });
      if (inconsistent) {
        components.push(`capability artwork ${index + 1} breaks the 1.5px round line grammar`);
      }
    });

    const capabilityItems = [...document.querySelectorAll('.capitem')];
    capabilityItems.forEach((item, index) => {
      const copy = item.querySelector('.capitem__copy').getBoundingClientRect();
      const art = item.querySelector('.capitem__art').getBoundingClientRect();
      const copyFirst = copy.left < art.left;
      if (copyFirst !== (index % 2 === 0)) {
        components.push(`capability chapter ${index + 1} does not alternate at desktop`);
      }
    });

    const process = document.querySelector('.process-overview ol');
    const phases = process ? [...process.children] : [];
    if (phases.length !== 4) {
      components.push(`process phase count ${phases.length}; expected 4`);
    } else {
      const baseline = getComputedStyle(process, '::before');
      const phaseTops = new Set(phases.map((phase) => Math.round(phase.getBoundingClientRect().top)));
      if (
        baseline.content === 'none' ||
        parseFloat(baseline.height) < 1 ||
        baseline.backgroundColor !== 'rgb(29, 119, 254)' ||
        phaseTops.size !== 1
      ) {
        components.push('process phases do not form one horizontal sequence with an AIS-blue baseline');
      }
    }

    const team = document.querySelector('.teamgrid');
    const members = team ? [...team.children] : [];
    const teamColumns = team ? getComputedStyle(team).gridTemplateColumns.split(' ').length : 0;
    const crops = new Set(
      members.map((member) => {
        const photo = member.querySelector('img').getBoundingClientRect();
        return (photo.width / photo.height).toFixed(3);
      })
    );
    if (members.length !== 3 || teamColumns !== 3 || crops.size !== 1) {
      components.push(
        `team composition has ${members.length} members, ${teamColumns} columns and ${crops.size} crop ratios`
      );
    }

    document.querySelectorAll('.explorer__item').forEach((item, index) => {
      if (parseFloat(getComputedStyle(item).opacity) < 0.95) {
        components.push(`explorer item ${index + 1} relies on low opacity`);
      }
    });
  }

  if (path === '/' && width === 390) {
    document.querySelectorAll('.capitem').forEach((item, index) => {
      const copy = item.querySelector('.capitem__copy').getBoundingClientRect();
      const art = item.querySelector('.capitem__art').getBoundingClientRect();
      if (copy.top >= art.top) {
        components.push(`capability chapter ${index + 1} does not put copy before art on mobile`);
      }
    });
  }

  return { overflow, components, tooDim, smallTargets };
}

async function checkExplorerFocus(page, base) {
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await page.$eval('.explorer__item:nth-child(2) .explorer__copy', (link) => link.focus());
  await new Promise((resolve) => setTimeout(resolve, 50));
  const state = await page.evaluate(() => ({
    item: document.querySelector('.explorer__item:nth-child(2)')?.classList.contains('is-active'),
    scene: document.querySelector('.explorer__scene:nth-child(2)')?.classList.contains('is-active'),
  }));
  return state.item && state.scene
    ? null
    : `Service explorer — keyboard focus did not activate matching item and media (${JSON.stringify(state)})`;
}

async function checkConvergePacing(page, base) {
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });

  async function stateAt(progress) {
    await page.evaluate((value) => {
      const section = document.querySelector('[data-converge]');
      const top = window.scrollY + section.getBoundingClientRect().top;
      const target = top - window.innerHeight * 0.58 + value * window.innerHeight * 0.72;
      window.scrollTo(0, target);
    }, progress);
    await new Promise((resolve) => setTimeout(resolve, 450));
    return page.evaluate(() => {
      const section = document.querySelector('[data-converge]');
      const panels = [...section.querySelectorAll('.converge__frame')].map((frame) => {
        const rect = frame.getBoundingClientRect();
        return { left: rect.left, right: rect.right };
      });
      return {
        progress: parseFloat(section.style.getPropertyValue('--converge')),
        settled: parseFloat(section.style.getPropertyValue('--settled')),
        captions: [...section.querySelectorAll('.converge__caption')].map((caption) =>
          parseFloat(getComputedStyle(caption).opacity)
        ),
        panels,
        tail: section.getBoundingClientRect().bottom -
          section.querySelector('.converge__outro').getBoundingClientRect().bottom,
      };
    });
  }

  const opening = await stateAt(0.18);
  const cleared = await stateAt(0.28);
  const merged = await stateAt(0.65);
  const held = await stateAt(1);
  const aligned = (state) =>
    Math.max(...state.panels.map((panel) => panel.left)) -
      Math.min(...state.panels.map((panel) => panel.left)) <=
    2;

  if (
    opening.captions.some((opacity) => opacity < 0.45) ||
    opening.panels[0].right > opening.panels[1].left + 1
  ) {
    return 'Converge — opening frames are not independently readable';
  }
  if (
    cleared.captions.some((opacity) => opacity > 0.05) ||
    cleared.panels[0].right > cleared.panels[1].left + 1
  ) {
    return 'Converge — captions do not clear before frame collision';
  }
  if (!aligned(merged) || !aligned(held)) {
    return 'Converge — merged frame is not held for the final 35% of active travel';
  }
  if (Math.abs(held.progress - 1) > 0.01 || Math.abs(held.settled - 1) > 0.01) {
    return `Converge — active range did not clamp with a separate settled value (${JSON.stringify(held)})`;
  }
  if (held.tail > 40) {
    return `Converge — outro leaves a ${held.tail.toFixed(1)}px empty tail`;
  }
  return null;
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
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
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
      const { overflow, components, tooDim, smallTargets } = await page.evaluate(findProblems, path, width);
      checked++;

      if (overflow) {
        errors.push(
          `${width}px ${path} — vodoravno prelivanje (${overflow.scrollWidth}px > ${overflow.innerWidth}px)`
        );
      }
      for (const component of components) {
        errors.push(`${width}px ${path} — ${component}`);
      }
      for (const sample of tooDim) {
        errors.push(`${width}px ${path} — persistently dim text "${sample}"`);
      }
      for (const target of smallTargets) {
        errors.push(`${width}px ${path} — undersized control ${target}`);
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
  const explorerFocusError = await checkExplorerFocus(focusPage, base);
  if (explorerFocusError) errors.push(explorerFocusError);
  await focusPage.close();

  const convergePage = await browser.newPage();
  await convergePage.evaluateOnNewDocument(() => {
    try {
      sessionStorage.setItem('ais-intro', '1');
    } catch {
      /* ignore */
    }
  });
  await convergePage.setViewport({ width: 1440, height: 1000 });
  const convergeError = await checkConvergePacing(convergePage, base);
  if (convergeError) errors.push(convergeError);
  await convergePage.close();

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
