#!/usr/bin/env node
/**
 * Automated SEO / GEO audit.
 *
 * Runs against the built ./dist output and fails the build when a page would
 * regress. This is the "automated" half of the brief: nobody has to remember
 * to check meta descriptions or structured data by hand — adding a page that
 * misses something turns the check red.
 *
 *   node audit.mjs           audit ./dist
 *   node audit.mjs --json    machine-readable output
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');

const LIMITS = {
  titleMin: 20,
  titleMax: 65,
  descMin: 70,
  descMax: 165,
  minWords: 120,
  maxHtmlBytes: 120_000,
};

const results = [];
const record = (level, page, message) => results.push({ level, page, message });
const fail = (page, message) => record('error', page, message);
const warn = (page, message) => record('warn', page, message);

/* ── Tiny HTML probes ─────────────────────────────────────────────────── */

const firstMatch = (html, re) => (html.match(re) ?? [])[1] ?? null;

const metaContent = (html, name) =>
  firstMatch(html, new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`, 'i'));

const propContent = (html, prop) =>
  firstMatch(html, new RegExp(`<meta\\s+property=["']${prop}["']\\s+content=["']([^"']*)["']`, 'i'));

const countTags = (html, tag) => (html.match(new RegExp(`<${tag}[\\s>]`, 'gi')) ?? []).length;

const textOf = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/* ── Per-page checks ──────────────────────────────────────────────────── */

function auditPage(route, html) {
  const noindex = /content=["']noindex/i.test(html);

  /* Title */
  const title = firstMatch(html, /<title>([\s\S]*?)<\/title>/i);
  if (!title) fail(route, 'Manjka <title>.');
  else if (title.length < LIMITS.titleMin) warn(route, `Naslov je kratek (${title.length} znakov).`);
  else if (title.length > LIMITS.titleMax) warn(route, `Naslov je dolg (${title.length} znakov, priporočeno ≤ ${LIMITS.titleMax}).`);

  /* Meta description */
  const desc = metaContent(html, 'description');
  if (!desc) fail(route, 'Manjka meta description.');
  else if (desc.length < LIMITS.descMin) warn(route, `Meta description je kratek (${desc.length} znakov).`);
  else if (desc.length > LIMITS.descMax) warn(route, `Meta description je dolg (${desc.length} znakov, priporočeno ≤ ${LIMITS.descMax}).`);

  /* Canonical */
  const canonical = firstMatch(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (!noindex && !canonical) fail(route, 'Manjka canonical URL.');

  /* Headings */
  const h1s = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (h1s === 0) fail(route, 'Stran nima <h1>.');
  if (h1s > 1) fail(route, `Stran ima ${h1s} elementov <h1>; dovoljen je natanko eden.`);
  if (!noindex && countTags(html, 'h2') === 0) warn(route, 'Stran nima nobenega <h2>.');

  /* Language */
  if (!/<html[^>]+lang=["']sl["']/i.test(html)) fail(route, 'Manjka lang="sl" na <html>.');

  /* Open Graph + Twitter */
  for (const prop of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) {
    if (!propContent(html, prop)) fail(route, `Manjka ${prop}.`);
  }
  if (!metaContent(html, 'twitter:card')) warn(route, 'Manjka twitter:card.');

  /* Structured data */
  const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if (!ldBlocks.length) fail(route, 'Manjka JSON-LD structured data.');
  for (const [, raw] of ldBlocks) {
    try {
      const parsed = JSON.parse(raw.replace(/\\u003c/g, '<'));
      const graph = parsed['@graph'] ?? [parsed];
      const types = graph.flatMap((n) => (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]));
      if (!types.includes('Organization')) warn(route, 'JSON-LD brez vozlišča Organization.');
      if (!types.includes('WebPage')) warn(route, 'JSON-LD brez vozlišča WebPage.');
    } catch (e) {
      fail(route, `JSON-LD ni veljaven JSON: ${e.message}`);
    }
  }

  /* Content volume — the original site rendered zero text without JavaScript. */
  const words = textOf(html).split(' ').filter(Boolean).length;
  if (!noindex && words < LIMITS.minWords) {
    fail(route, `Premalo besedila v HTML (${words} besed, minimum ${LIMITS.minWords}).`);
  }

  /* Images need alt text */
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const missingAlt = imgs.filter((t) => !/\balt=/.test(t));
  if (missingAlt.length) fail(route, `${missingAlt.length} slik brez atributa alt.`);

  /* Accessibility regressions the original site had */
  if (/user-scalable=no|maximum-scale=1/i.test(html)) {
    fail(route, 'Viewport onemogoča povečavo (user-scalable=no / maximum-scale).');
  }

  /* No dead placeholder links */
  const deadLinks = [...html.matchAll(/href=["'](#|)["']/gi)];
  if (deadLinks.length) fail(route, `${deadLinks.length} praznih povezav (href="#").`);

  /* Payload size — the original shipped a 1.76 MB JS bundle */
  const bytes = Buffer.byteLength(html);
  if (bytes > LIMITS.maxHtmlBytes) warn(route, `HTML je velik (${(bytes / 1024).toFixed(0)} kB).`);

  /* Render-blocking client-side rendering must not creep back in */
  if (/<div id="root">\s*<\/div>/i.test(html)) {
    fail(route, 'Prazen #root — vsebina se izrisuje na odjemalcu.');
  }

  return { route, title, desc, words, bytes, h1s, ld: ldBlocks.length };
}

/* ── Site-level checks ────────────────────────────────────────────────── */

async function auditSite(pages) {
  const need = ['sitemap.xml', 'robots.txt', 'llms.txt'];
  for (const f of need) {
    try {
      await stat(path.join(DIST, f));
    } catch {
      fail('(site)', `Manjka ${f}.`);
    }
  }

  try {
    const sitemap = await readFile(path.join(DIST, 'sitemap.xml'), 'utf8');
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (!locs.length) fail('(site)', 'sitemap.xml nima nobenega <loc>.');

    const indexable = pages.filter((p) => p.route !== '/404.html');
    for (const p of indexable) {
      if (!locs.some((l) => l.endsWith(p.route) || (p.route === '/' && l.endsWith('/')))) {
        fail('(site)', `Stran ${p.route} manjka v sitemap.xml.`);
      }
    }
    if (locs.some((l) => l.includes('404'))) fail('(site)', '404 stran ne sme biti v sitemap.xml.');
  } catch (e) {
    if (!/ENOENT/.test(e.message)) fail('(site)', `sitemap.xml: ${e.message}`);
  }

  try {
    const robots = await readFile(path.join(DIST, 'robots.txt'), 'utf8');
    if (!/Sitemap:/i.test(robots)) fail('(site)', 'robots.txt ne navaja sitemapa.');
    for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
      if (!robots.includes(bot)) warn('(site)', `robots.txt ne omenja ${bot}.`);
    }
  } catch {
    /* already reported as missing above */
  }

  /* Duplicate titles and descriptions dilute rankings */
  const seenTitles = new Map();
  const seenDescs = new Map();
  for (const p of pages) {
    if (p.title) {
      if (seenTitles.has(p.title)) fail('(site)', `Podvojen naslov: "${p.title}" (${seenTitles.get(p.title)}, ${p.route}).`);
      else seenTitles.set(p.title, p.route);
    }
    if (p.desc) {
      if (seenDescs.has(p.desc)) fail('(site)', `Podvojen meta description na ${seenDescs.get(p.desc)} in ${p.route}.`);
      else seenDescs.set(p.desc, p.route);
    }
  }
}

/* ── Internal link integrity ──────────────────────────────────────────── */

async function auditLinks(files) {
  const routes = new Set(
    files.map((f) => {
      const rel = '/' + path.relative(DIST, f).split(path.sep).join('/');
      return rel.endsWith('/index.html') ? rel.replace(/index\.html$/, '') : rel;
    })
  );

  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const rel = '/' + path.relative(DIST, file).split(path.sep).join('/');
    const route = rel.endsWith('/index.html') ? rel.replace(/index\.html$/, '') : rel;

    const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((m) => m[1]);
    for (const href of hrefs) {
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      const target = href.split('#')[0].split('?')[0];
      if (!target) continue;
      if (/\.(css|png|jpe?g|svg|xml|txt|webmanifest|ico)$/i.test(target)) continue;
      if (!routes.has(target)) fail(route, `Notranja povezava kaže v nič: ${href}`);
    }
  }
}

/* ── Runner ───────────────────────────────────────────────────────────── */

async function main() {
  let files;
  try {
    files = await walk(DIST);
  } catch {
    console.error('dist/ ne obstaja — najprej zaženite `npm run build`.');
    process.exit(1);
  }

  const pages = [];
  for (const file of files) {
    const rel = '/' + path.relative(DIST, file).split(path.sep).join('/');
    const route = rel.endsWith('/index.html') ? rel.replace(/index\.html$/, '') : rel;
    pages.push(auditPage(route, await readFile(file, 'utf8')));
  }

  await auditSite(pages);
  await auditLinks(files);

  const errors = results.filter((r) => r.level === 'error');
  const warns = results.filter((r) => r.level === 'warn');

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ pages, errors, warns }, null, 2));
  } else {
    console.log('\nSEO / GEO pregled\n' + '─'.repeat(72));
    for (const p of pages.sort((a, b) => a.route.localeCompare(b.route))) {
      console.log(
        `${p.route.padEnd(24)} ${String(p.words).padStart(5)} besed  ` +
          `${String((p.bytes / 1024).toFixed(0)).padStart(4)} kB  ` +
          `${p.ld} JSON-LD  ${p.h1s} h1`
      );
    }
    console.log('─'.repeat(72));

    for (const r of warns) console.log(`  OPOZORILO  ${r.page}: ${r.message}`);
    for (const r of errors) console.log(`  NAPAKA     ${r.page}: ${r.message}`);

    console.log(
      `\n${pages.length} strani pregledanih — ${errors.length} napak, ${warns.length} opozoril.`
    );
  }

  process.exit(errors.length ? 1 : 0);
}

await main();
