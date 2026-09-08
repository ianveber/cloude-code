/**
 * Rendering check.
 *
 * `audit.mjs` reads the built HTML; this one renders it in a real browser and
 * asserts layout guarantees that the static audit cannot see:
 *
 *   1. Nothing overflows horizontally, which is the usual cause of an
 *      unexpected sideways scrollbar on mobile.
 *   2. Empty-state cards preserve the responsive shell gutters.
 *   3. The build stage, clients line and pillars keep their composition
 *      and stay operable from the keyboard.
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
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
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
    /* Build stage: three screens, the active one in front and widest. */
    const screens = [...document.querySelectorAll('.build__screen')];
    const active = document.querySelector('.build__screen.is-active');
    if (screens.length !== 3 || !active) {
      components.push(`build stage has ${screens.length} screens and ${active ? 'an' : 'no'} active screen`);
    } else {
      const widths = screens.map((screen) => screen.getBoundingClientRect().width);
      const activeWidth = active.getBoundingClientRect().width;
      if (activeWidth < Math.max(...widths) - 1) {
        components.push('build stage active screen is not the widest');
      }
    }
    const tabs = [...document.querySelectorAll('.build__tab')];
    if (tabs.length !== 3 || tabs.filter((tab) => tab.getAttribute('aria-pressed') === 'true').length !== 1) {
      components.push('build stage tabs must be three buttons with exactly one pressed');
    }

    /* Clients wall: a logo and a brand name per client, nothing else. */
    const clients = [...document.querySelectorAll('.client')];
    if (clients.length < 3) {
      components.push(`clients wall lists ${clients.length} clients; expected at least 3`);
    }
    clients.forEach((client, index) => {
      const logo = client.querySelector('.client__logo img');
      if (!client.querySelector('.client__name')?.textContent.trim() || !logo) {
        components.push(`client ${index + 1} is missing a name or a logo`);
      } else if (logo.getBoundingClientRect().height < 24) {
        components.push(`client ${index + 1} logo renders under 24px`);
      }
      if (client.querySelector('p')) {
        components.push(`client ${index + 1} carries a description`);
      }
    });

    /* Pillars: three, alternating copy and picture at desktop. */
    const pillars = [...document.querySelectorAll('.pillar')];
    if (pillars.length !== 3) {
      components.push(`pillar count ${pillars.length}; expected 3`);
    }
    pillars.forEach((pillar, index) => {
      const copy = pillar.querySelector('.pillar__copy').getBoundingClientRect();
      const visual = pillar.querySelector('.pillar__visual').getBoundingClientRect();
      const copyFirst = copy.left < visual.left;
      if (copyFirst !== (index % 2 === 0)) {
        components.push(`pillar ${index + 1} does not alternate at desktop`);
      }
      const picture = pillar.querySelector('.pillar__frame img');
      if (!picture || !picture.getAttribute('alt') || !picture.getAttribute('width')) {
        components.push(`pillar ${index + 1} picture is missing alt text or dimensions`);
      }
    });

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
    if (team.querySelector('.teamtile__photo--empty, .teamtile--empty') || members.some((member) => !member.querySelector('img'))) {
      components.push('team composition includes an empty placeholder');
    }
    members.forEach((member, index) => {
      const photo = member.querySelector('img')?.getBoundingClientRect();
      if (!photo) return;
      const ratio = photo.width / photo.height;
      if (Math.abs(ratio - 0.8) > 0.02) {
        components.push(`team photo ${index + 1} crop is ${ratio.toFixed(3)}; expected 4:5`);
      }
    });

    /* Footer: wordmark stays inside the shell, people and contact printed. */
    /* No visible borders anywhere on the page. */
    const bordered = [...document.querySelectorAll('main *, footer *, header *')]
      .filter((element) => {
        const style = getComputedStyle(element);
        return ['Top', 'Right', 'Bottom', 'Left'].some((side) => {
          const width = parseFloat(style[`border${side}Width`]);
          const color = style[`border${side}Color`];
          return width > 0 && style[`border${side}Style`] !== 'none' && !/rgba\(\d+, \d+, \d+, 0\)/.test(color) && color !== 'transparent';
        });
      })
      .map((element) => `${element.tagName.toLowerCase()}.${[...element.classList].join('.')}`);
    if (bordered.length) {
      components.push(`visible borders on ${bordered.slice(0, 5).join(', ')}`);
    }

    const mark = document.querySelector('.footer-wordmark');
    if (!mark || mark.getBoundingClientRect().right > window.innerWidth + 1) {
      components.push('footer wordmark is missing or overflows');
    }
    if (document.querySelectorAll('.footer-people li').length !== 3) {
      components.push('footer must list the three team members');
    }
  }

  if (path === '/' && [1024, 768, 390].includes(width)) {
    const process = document.querySelector('.process-overview ol');
    if (process) {
      const rail = getComputedStyle(process, '::before');
      const track = process.getBoundingClientRect();
      const railLeft = track.left + parseFloat(rail.left);
      const railRight = railLeft + Math.max(parseFloat(rail.width), 1);
      const railTop = rail.top === 'auto' ? track.top : track.top + parseFloat(rail.top);
      const railBottom = rail.bottom === 'auto' || rail.bottom === '0px' ? track.bottom : track.bottom - parseFloat(rail.bottom);
      [...process.querySelectorAll('h3, p')].forEach((text) => {
        const box = text.getBoundingClientRect();
        const overlaps =
          box.left < railRight - 0.5 &&
          box.right > railLeft + 0.5 &&
          box.top < railBottom - 0.5 &&
          box.bottom > railTop + 0.5;
        if (overlaps) {
          components.push(
            `process rail intersects "${text.textContent.trim().slice(0, 24)}" at ${width}px`
          );
        }
      });
    }
  }

  if (path === '/' && width === 390) {
    document.querySelectorAll('.pillar').forEach((pillar, index) => {
      const copy = pillar.querySelector('.pillar__copy').getBoundingClientRect();
      const visual = pillar.querySelector('.pillar__visual').getBoundingClientRect();
      if (copy.top >= visual.top) {
        components.push(`pillar ${index + 1} does not put copy before its picture on mobile`);
      }
    });
  }

  return { overflow, components, tooDim, smallTargets };
}

async function checkBuildStage(page, base) {
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () =>
      document.documentElement.classList.contains('motion-on') ||
      document.documentElement.classList.contains('motion-off')
  );

  /* A tab click brings its screen to the front. */
  await page.click('.build__tab[data-build-tab="2"]');
  await new Promise((resolve) => setTimeout(resolve, 60));
  const clicked = await page.evaluate(() => ({
    screen: document.querySelector('.build__screen[data-build-screen="2"]')?.classList.contains('is-active'),
    tab: document.querySelector('.build__tab[data-build-tab="2"]')?.getAttribute('aria-pressed'),
    pressed: document.querySelectorAll('.build__tab[aria-pressed="true"]').length,
  }));
  if (!clicked.screen || clicked.tab !== 'true' || clicked.pressed !== 1) {
    return `Build stage — tab click did not bring its screen forward (${JSON.stringify(clicked)})`;
  }

  /* Arrow keys move through the screens. */
  await page.$eval('.build__tab[data-build-tab="2"]', (tab) => tab.focus());
  await page.keyboard.press('ArrowRight');
  await new Promise((resolve) => setTimeout(resolve, 60));
  const keyed = await page.evaluate(() =>
    document.querySelector('.build__screen[data-build-screen="0"]')?.classList.contains('is-active')
  );
  if (!keyed) return 'Build stage — ArrowRight did not advance to the next screen';

  /* A side screen click brings it forward too. */
  await page.$eval('.build__screen[data-build-screen="1"]', (screen) => screen.click());
  await new Promise((resolve) => setTimeout(resolve, 60));
  const sided = await page.evaluate(() =>
    document.querySelector('.build__screen[data-build-screen="1"]')?.classList.contains('is-active')
  );
  if (!sided) return 'Build stage — clicking a side screen did not bring it forward';
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

async function checkReducedMotion(page, base) {
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () =>
      document.documentElement.classList.contains('motion-off') ||
      document.documentElement.classList.contains('motion-on')
  );
  const reduced = await page.evaluate(() => ({
    introBlocked: document.documentElement.classList.contains('is-intro'),
    hiddenText: [...document.querySelectorAll('main h1,main h2,main h3,main p')]
      .filter((el) => {
        const style = getComputedStyle(el);
        return style.visibility === 'hidden' || parseFloat(style.opacity) < 0.9;
      })
      .map((el) => el.textContent.trim().slice(0, 40)),
    autoplaying: [...document.querySelectorAll('video')].filter((video) => !video.paused).length,
  }));
  const errors = [];
  if (reduced.introBlocked) errors.push('Reduced motion — intro still blocks the page');
  if (reduced.hiddenText.length) {
    errors.push(`Reduced motion — hidden/dim text remains (${reduced.hiddenText.join('; ')})`);
  }
  if (reduced.autoplaying) {
    errors.push(`Reduced motion — ${reduced.autoplaying} decorative videos are autoplaying`);
  }
  return errors;
}

async function checkDisclosureToggle(page, selector, label) {
  const exists = await page.$(selector);
  if (!exists) return `${label} — missing ${selector}`;
  const before = await page.$eval(selector, (el) => el.open);
  await page.$eval(`${selector} > summary`, (el) => el.focus());
  const focus = await page.$eval(`${selector} > summary`, (el) => {
    const style = getComputedStyle(el);
    return {
      focused: document.activeElement === el,
      focusVisible: el.matches(':focus-visible'),
      outlineWidth: parseFloat(style.outlineWidth),
      outlineStyle: style.outlineStyle,
      outlineColor: style.outlineColor,
    };
  });
  if (
    !focus.focused ||
    !focus.focusVisible ||
    focus.outlineWidth < 2 ||
    focus.outlineStyle === 'none' ||
    focus.outlineColor !== 'rgb(29, 119, 254)'
  ) {
    return `${label} — focus is invisible (${JSON.stringify(focus)})`;
  }
  await page.keyboard.press('Enter');
  const after = await page.$eval(selector, (el) => el.open);
  if (before === after) return `${label} — Enter did not toggle the disclosure`;
  return null;
}

async function checkKeyboardChrome(page, base) {
  const errors = [];
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  const dropdowns = await page.$$eval('.nav .nav-dd', (els) => els.length);
  if (dropdowns !== 2) errors.push(`Desktop navigation — expected 2 dropdowns, found ${dropdowns}`);
  for (const [index, selector] of [
    [1, '.nav details.nav-dd:nth-of-type(1)'],
    [2, '.nav details.nav-dd:nth-of-type(2)'],
  ]) {
    const error = await checkDisclosureToggle(page, selector, `Desktop dropdown ${index}`);
    if (error) errors.push(error);
  }
  const faqError = await checkDisclosureToggle(page, '.faq-item', 'FAQ item');
  if (faqError) errors.push(faqError);

  await page.setViewport({ width: 390, height: 844 });
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  const menuError = await checkDisclosureToggle(page, '.nav-toggle', 'Mobile menu');
  if (menuError) errors.push(menuError);
  return errors;
}

async function checkHomeResponsive(page, base, width) {
  await page.setViewport({ width, height: 1000 });
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  return page.evaluate((w) => {
    const problems = [];
    const copy = document.querySelector('.hero--brain .hero__copy');
    const art = document.querySelector('.hero--brain .hero__art');
    if (copy && art && copy.getBoundingClientRect().top > art.getBoundingClientRect().top + 1) {
      problems.push('hero art precedes copy');
    }
    const rig = document.querySelector('.brand-brain__rig');
    if (rig) {
      const max = Math.min(17 * 16, 0.72 * w);
      const used = parseFloat(getComputedStyle(rig).width);
      if (used > max + 1) problems.push(`brain width ${used.toFixed(1)}px exceeds ${max.toFixed(1)}px`);
    }
    const screens = [...document.querySelectorAll('.build__screen')].map((screen) =>
      screen.getBoundingClientRect()
    );
    if (screens.length >= 2 && Math.abs(screens[0].top - screens[1].top) < 8) {
      problems.push('build screens do not stack');
    }
    if (screens.some((box) => box.left < -1 || box.right > w + 1)) {
      problems.push('a build screen leaves the viewport');
    }
    document.querySelectorAll('.pillar').forEach((pillar, index) => {
      const copy = pillar.querySelector('.pillar__copy').getBoundingClientRect();
      const visual = pillar.querySelector('.pillar__visual').getBoundingClientRect();
      if (copy.top >= visual.top) {
        problems.push(`pillar ${index + 1} does not put copy before its picture`);
      }
    });
    const process = document.querySelector('.process-overview__track');
    if (process && getComputedStyle(process).gridTemplateColumns.split(' ').length !== 1) {
      problems.push('process phases are not a single vertical list');
    }
    const team = document.querySelector('.teamgrid');
    if (team) {
      const columns = getComputedStyle(team).gridTemplateColumns.split(' ').length;
      const allowed = w <= 520 ? 1 : 2;
      if (columns > allowed) problems.push(`team uses ${columns} columns; expected at most ${allowed}`);
    }
    const ctaCopy = document.querySelector('.ctaband__copy');
    const ctaForm = document.querySelector('.ctaform');
    if (
      ctaCopy &&
      ctaForm &&
      ctaForm.getBoundingClientRect().top + 1 < ctaCopy.getBoundingClientRect().bottom
    ) {
      problems.push('CTA form is not full width beneath its copy');
    }
    const footer = document.querySelector('.footer-grid');
    if (footer && getComputedStyle(footer).gridTemplateColumns.split(' ').length > 1) {
      problems.push('footer groups do not stack');
    }
    if (w === 390) {
      [...document.querySelectorAll('a,button,summary,input,textarea')].forEach((el) => {
        const box = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        const closed = el.closest('details:not([open])');
        if (box.width < 2 || box.height < 2 || el.classList.contains('skip-link')) return;
        if (style.visibility === 'hidden' || style.display === 'none') return;
        if (closed && !el.closest('summary')) return;
        /* A marquee ribbon scrolls past both edges on purpose. */
        if (el.closest('.marquee')) return;
        if (box.left < 19.5 || box.right > w - 19.5) {
          problems.push(
            `control "${el.textContent.trim().slice(0, 22)}" sits ${Math.round(Math.min(box.left, w - box.right))}px from the edge`
          );
        }
      });
    }
    return problems;
  }, width);
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
        sessionStorage.setItem('ais-intro', 'skip');
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
      sessionStorage.setItem('ais-intro', 'skip');
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

  const stagePage = await browser.newPage();
  await stagePage.evaluateOnNewDocument(() => {
    try {
      sessionStorage.setItem('ais-intro', 'skip');
    } catch {
      /* ignore */
    }
  });
  await stagePage.setViewport({ width: 1440, height: 1000 });
  const stageError = await checkBuildStage(stagePage, base);
  if (stageError) errors.push(stageError);
  await stagePage.close();

  const reducedPage = await browser.newPage();
  const reducedErrors = await checkReducedMotion(reducedPage, base);
  errors.push(...reducedErrors);
  await reducedPage.close();

  const chromePage = await browser.newPage();
  await chromePage.evaluateOnNewDocument(() => {
    try {
      sessionStorage.setItem('ais-intro', 'skip');
    } catch {
      /* ignore */
    }
  });
  const chromeErrors = await checkKeyboardChrome(chromePage, base);
  errors.push(...chromeErrors);
  await chromePage.close();

  const responsivePage = await browser.newPage();
  await responsivePage.evaluateOnNewDocument(() => {
    try {
      sessionStorage.setItem('ais-intro', 'skip');
    } catch {
      /* ignore */
    }
  });
  for (const width of [768, 390]) {
    const problems = await checkHomeResponsive(responsivePage, base, width);
    for (const problem of problems) {
      errors.push(`${width}px / — ${problem}`);
    }
  }
  await responsivePage.close();

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
