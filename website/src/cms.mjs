/**
 * The content layer behind the admin: what a news item, blog post, event or
 * page looks like as data, how it is checked, and how it becomes a page.
 *
 * Items live as one JSON file each in content/cms/<collection>/<slug>.json.
 * The admin API writes them (locally or as commits to the repository); the
 * build reads them next to the hand-written content and renders a page per
 * item with the same templates the rest of the site uses. Drafts are left
 * out of the build unless CMS_DRAFTS=1 (the local admin preview), and even
 * then they are noindex.
 */

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { site } from '../content/site.mjs';
import { esc, each, absolute } from './html.mjs';
import { pageHero } from './sections.mjs';
import { IDS } from './schema.mjs';
import { renderMarkdown, markdownToText } from './md.mjs';

const url = (p) => absolute(site.origin, p);

export const COLLECTIONS = {
  novice: {
    key: 'novice',
    base: '/novice/',
    label: 'Novice',
    singular: 'Novica',
    crumb: { label: 'Novice', href: '/novice/' },
    back: 'Vse novice',
    article: true,
  },
  blog: {
    key: 'blog',
    base: '/blog/',
    label: 'Blog',
    singular: 'Zapis',
    crumb: { label: 'Blog', href: '/blog/' },
    back: 'Vsi zapisi',
    article: true,
  },
  dogodki: {
    key: 'dogodki',
    base: '/dogodki/',
    label: 'Dogodki',
    singular: 'Dogodek',
    crumb: { label: 'Dogodki', href: '/dogodki/' },
    back: 'Vsi dogodki',
    event: true,
  },
  strani: {
    key: 'strani',
    base: '/',
    label: 'Strani',
    singular: 'Stran',
    crumb: null,
    back: null,
  },
};

export const COLLECTION_KEYS = Object.keys(COLLECTIONS);

/* First path segments the site already uses; a page slug may not take them. */
export const RESERVED_SLUGS = new Set([
  'admin', 'api', 'uploads', 'pictures', 'js', 'fonts', 'brand', 'clients', 'video', 'team',
  'produkti', 'studije-primerov', 'vodici', 'storitve', 'proces', 'novice', 'dogodki', 'blog',
  'o-nas', 'ekipa', 'pogosta-vprasanja', 'kontakt', 'sitemap.xml', 'robots.txt', 'llms.txt', 'styles.css', '404',
]);

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const LIMITS = { titleMax: 60, descMin: 70, descMax: 165, summaryMax: 220 };

/* ── Helpers ──────────────────────────────────────────────────────────── */

export function slugify(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/* 2026-09-16 → 16. 9. 2026 */
export function dateLabel(iso) {
  if (!DATE_RE.test(iso ?? '')) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}. ${m}. ${y}`;
}

const str = (v, max = 5000) => String(v ?? '').replace(/\r\n?/g, '\n').trim().slice(0, max);
const bool = (v) => v === true || v === 'true' || v === 1;

/* ── Normalisation and checks ─────────────────────────────────────────── */

/**
 * Turns whatever the editor sent into a clean item. Returns the item plus
 * `errors` (must be empty to save) and `problems` (must be empty to publish).
 */
export function normalizeItem(raw, collectionKey) {
  const collection = COLLECTIONS[collectionKey];
  const errors = [];
  const problems = [];
  if (!collection) return { item: null, errors: ['Neznana zbirka.'], problems };

  const src = raw && typeof raw === 'object' ? raw : {};
  const title = str(src.title, 200);
  const slug = str(src.slug || slugify(title), 80);
  const status = src.status === 'published' ? 'published' : 'draft';
  const date = str(src.date, 10) || new Date().toISOString().slice(0, 10);
  const picture = normalizePicture(src.picture);
  const seo = normalizeSeo(src.seo, title, str(src.summary, 400));
  const links = Array.isArray(src.links)
    ? src.links
        .map((l) => ({ label: str(l?.label, 120), href: str(l?.href, 500) }))
        .filter((l) => l.label && l.href && /^(https?:\/\/|\/|mailto:|tel:)/.test(l.href))
        .slice(0, 20)
    : [];

  const item = {
    collection: collectionKey,
    slug,
    parent: str(src.parent, 80),
    status,
    title,
    kicker: str(src.kicker, 60),
    summary: str(src.summary, 400),
    date,
    body: str(src.body, 200000),
    picture,
    seo,
    links,
    createdAt: str(src.createdAt, 40) || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: str(src.publishedAt, 40) || null,
  };

  if (collection.event) {
    const ev = src.event && typeof src.event === 'object' ? src.event : {};
    item.event = {
      dateLabel: str(ev.dateLabel, 80),
      time: str(ev.time, 80),
      mode: str(ev.mode, 80),
      place: str(ev.place, 120),
    };
  }

  /* hard errors: the file cannot be written */
  if (!title) errors.push('Naslov je obvezen.');
  if (!SLUG_RE.test(slug)) errors.push('Naslov URL sme imeti samo male črke, številke in vezaje.');
  if (collectionKey === 'strani' && RESERVED_SLUGS.has(slug)) errors.push(`Naslov URL "${slug}" je že zaseden na spletni strani.`);
  if (item.parent && !SLUG_RE.test(item.parent)) errors.push('Nadrejena stran ni veljavna.');
  if (item.parent === slug) errors.push('Stran ne more biti nadrejena sama sebi.');
  if (!DATE_RE.test(date)) errors.push('Datum mora biti v obliki LLLL-MM-DD.');

  /* soft problems: fine for a draft, not for publishing */
  if (!item.summary) problems.push('Dodajte kratek povzetek; prikaže se na seznamu in v iskalnikih.');
  if (!markdownToText(item.body)) problems.push('Besedilo je prazno.');
  if (item.picture && !item.picture.alt) problems.push('Slika potrebuje opis (za bralnike zaslona in iskalnike).');
  if (!seo.metaDescription) problems.push('Dodajte meta opis.');
  else if (seo.metaDescription.length > LIMITS.descMax) problems.push(`Meta opis je predolg (${seo.metaDescription.length} znakov, največ ${LIMITS.descMax}).`);
  else if (seo.metaDescription.length < LIMITS.descMin) problems.push(`Meta opis je kratek (${seo.metaDescription.length} znakov, priporočeno vsaj ${LIMITS.descMin}).`);
  if (seo.metaTitle.length > LIMITS.titleMax + 10) problems.push(`Meta naslov je predolg (${seo.metaTitle.length} znakov).`);
  if (collection.event && !item.event.dateLabel && !item.date) problems.push('Dogodek potrebuje datum ali oznako termina.');

  return { item, errors, problems };
}

function normalizePicture(p) {
  if (!p || typeof p !== 'object' || !p.src) return null;
  const src = str(p.src, 300);
  if (!/^\/uploads\/[a-z0-9/_-]+$/i.test(src) && !/^\/pictures\/[a-z0-9-]+$/i.test(src)) return null;
  return {
    src,
    alt: str(p.alt, 300),
    width: Number(p.width) > 0 ? Math.round(Number(p.width)) : 1600,
    height: Number(p.height) > 0 ? Math.round(Number(p.height)) : 1000,
    upload: src.startsWith('/uploads/'),
    webp: p.webp !== false,
  };
}

function normalizeSeo(s, title, summary) {
  const seo = s && typeof s === 'object' ? s : {};
  const keywords = Array.isArray(seo.keywords)
    ? seo.keywords.map((k) => str(k, 60)).filter(Boolean).slice(0, 12)
    : str(seo.keywords, 600)
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
        .slice(0, 12);
  return {
    metaTitle: str(seo.metaTitle, 120) || (title ? `${title} | ${site.name}` : ''),
    metaDescription: str(seo.metaDescription, 400) || summary.slice(0, LIMITS.descMax),
    keywords,
    ogImage: str(seo.ogImage, 300),
    noindex: bool(seo.noindex),
  };
}

/* ── Paths and relations ──────────────────────────────────────────────── */

/** Path of an item, walking up its parents: /blog/serija/del-1/ */
export function itemPath(item, all) {
  const collection = COLLECTIONS[item.collection];
  const chain = [];
  let cur = item;
  const seen = new Set();
  while (cur && !seen.has(cur.slug)) {
    seen.add(cur.slug);
    chain.unshift(cur.slug);
    cur = cur.parent ? all.find((x) => x.collection === item.collection && x.slug === cur.parent) : null;
  }
  return `${collection.base}${chain.join('/')}/`;
}

/** Decorates items with href, dateLabel, children and parent chain. */
export function relate(items) {
  const all = items.filter(Boolean);
  for (const item of all) {
    item.href = itemPath(item, all);
    item.dateLabel = dateLabel(item.date);
    item.children = [];
  }
  for (const item of all) {
    if (!item.parent) continue;
    const parent = all.find((x) => x.collection === item.collection && x.slug === item.parent);
    if (parent) parent.children.push(item);
  }
  for (const item of all) item.children.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
  return all;
}

export function parentChain(item, all) {
  const chain = [];
  let cur = item.parent ? all.find((x) => x.collection === item.collection && x.slug === item.parent) : null;
  const seen = new Set([item.slug]);
  while (cur && !seen.has(cur.slug)) {
    seen.add(cur.slug);
    chain.unshift(cur);
    cur = cur.parent ? all.find((x) => x.collection === item.collection && x.slug === cur.parent) : null;
  }
  return chain;
}

/* ── Loading from disk (the build and the local admin) ────────────────── */

export async function loadCmsFromDir(root, { drafts = false } = {}) {
  const dir = path.join(root, 'content', 'cms');
  const all = [];
  for (const key of COLLECTION_KEYS) {
    const folder = path.join(dir, key);
    if (!existsSync(folder)) continue;
    const files = (await readdir(folder)).filter((f) => f.endsWith('.json')).sort();
    for (const file of files) {
      let raw;
      try {
        raw = JSON.parse(await readFile(path.join(folder, file), 'utf8'));
      } catch (err) {
        throw new Error(`content/cms/${key}/${file}: ${err.message}`);
      }
      const { item, errors } = normalizeItem({ ...raw, slug: raw.slug ?? file.replace(/\.json$/, '') }, key);
      if (!item || errors.length) throw new Error(`content/cms/${key}/${file}: ${errors.join(' ')}`);
      /* keep the stored timestamps; normalizeItem stamps updatedAt for saves */
      item.updatedAt = raw.updatedAt ?? item.updatedAt;
      all.push(item);
    }
  }
  return organize(all, { drafts });
}

/** Same shape from an in-memory list (the API's preview and index). */
export function organize(items, { drafts = false } = {}) {
  const visible = relate(items.filter((it) => drafts || it.status === 'published'));
  const byDate = (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
  const out = { all: visible };
  for (const key of COLLECTION_KEYS) out[key] = visible.filter((it) => it.collection === key).sort(byDate);
  return out;
}

/* ── Rendering ────────────────────────────────────────────────────────── */

const SIZES = {
  full: '(min-width: 1100px) 1040px, (min-width: 768px) calc(100vw - 4rem), calc(100vw - 2rem)',
  third: '(min-width: 1100px) 320px, (min-width: 768px) 45vw, calc(100vw - 2rem)',
};

/** Responsive markup for a picture uploaded through the admin. */
export function uploadPicture(picture, sizes = SIZES.full, { eager = false } = {}) {
  const src = esc(picture.src);
  const webp = picture.webp !== false ? `<source srcset="${src}-800.webp 800w, ${src}-1600.webp 1600w" sizes="${sizes}" type="image/webp">` : '';
  return `
        <picture>
          ${webp}
          <img src="${src}-1600.jpg" srcset="${src}-800.jpg 800w, ${src}-1600.jpg 1600w" sizes="${sizes}" alt="${esc(picture.alt)}"
            width="${picture.width}" height="${picture.height}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">
        </picture>`;
}

export const pictureUrl = (picture) => (picture.upload ? `${picture.src}-1600.jpg` : `${picture.src}.jpg`);

/** The shape the list templates (news list, event list, blog cards) read. */
export function toListItem(item) {
  const base = {
    date: item.date,
    dateLabel: item.dateLabel ?? dateLabel(item.date),
    kicker: item.kicker || COLLECTIONS[item.collection].singular,
    title: item.title,
    body: item.summary,
    summary: item.summary,
    href: item.href,
    picture: item.picture,
    cms: true,
  };
  if (item.event) {
    base.dateLabel = item.event.dateLabel || base.dateLabel || 'Po dogovoru';
    base.time = item.event.time;
    base.mode = item.event.mode;
    base.place = item.event.place;
  }
  return base;
}

function articleNode(item, page) {
  return {
    '@type': item.collection === 'novice' ? 'NewsArticle' : 'Article',
    '@id': `${url(page.path)}#article`,
    headline: item.title,
    description: item.seo.metaDescription,
    inLanguage: site.lang,
    url: url(page.path),
    mainEntityOfPage: { '@id': `${url(page.path)}#webpage` },
    image: url(item.picture ? pictureUrl(item.picture) : site.brand.ogImage),
    ...(page.datePublished ? { datePublished: page.datePublished } : {}),
    ...(page.dateModified ? { dateModified: page.dateModified } : {}),
    author: { '@id': IDS.organization },
    publisher: { '@id': IDS.organization },
    keywords: item.seo.keywords.join(', '),
    isPartOf: { '@id': IDS.website },
  };
}

function eventNode(item, page) {
  const online = /daljav|videoklic|online|splet/i.test(item.event.mode ?? '');
  return {
    '@type': 'Event',
    '@id': `${url(page.path)}#event`,
    name: item.title,
    description: item.seo.metaDescription,
    url: url(page.path),
    inLanguage: site.lang,
    ...(DATE_RE.test(item.date) ? { startDate: item.date } : {}),
    eventAttendanceMode: online ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: online
      ? { '@type': 'VirtualLocation', url: url(page.path) }
      : { '@type': 'Place', name: item.event.place || site.contact.city, address: { '@type': 'PostalAddress', addressLocality: site.contact.city, addressCountry: site.contact.countryCode } },
    organizer: { '@id': IDS.organization },
    image: url(item.picture ? pictureUrl(item.picture) : site.brand.ogImage),
  };
}

const rows = (pairs) =>
  `<dl class="cms-facts">${pairs
    .filter(([, v]) => v)
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
    .join('')}</dl>`;

/**
 * The page for one item. `closingCta` comes from src/closing-cta.mjs; `all`
 * is the organised list so parents and children resolve.
 */
export function cmsItemPage(item, { closingCta, all, preview = false }) {
  const collection = COLLECTIONS[item.collection];
  const chain = parentChain(item, all);
  const href = item.href ?? itemPath(item, all);
  const label = item.dateLabel ?? dateLabel(item.date);
  const picture = (src, alt) => uploadPicture({ src, alt, width: 1600, height: 1000, upload: true }, SIZES.full);
  const bodyHtml = renderMarkdown(item.body, { picture });

  const facts = item.event
    ? rows([
        ['Kdaj', item.event.dateLabel || label],
        ['Trajanje', item.event.time],
        ['Način', item.event.mode],
        ['Kje', item.event.place],
      ])
    : '';

  const children = item.children?.length
    ? `
      <section class="study__section cms-children" data-reveal>
        <h2>Podstrani</h2>
        <ul class="cms-sublist">
          ${each(
            item.children,
            (c) => `<li><a href="${esc(c.href)}"><span class="cms-sublist__title">${esc(c.title)}</span>${c.summary ? `<span class="cms-sublist__lead">${esc(c.summary)}</span>` : ''}</a></li>`
          )}
        </ul>
      </section>`
    : '';

  const links = item.links.length
    ? `
      <section class="study__section cms-related" data-reveal>
        <h2>Povezano</h2>
        <ul class="cms-links">
          ${each(item.links, (l) => `<li><a class="link" href="${esc(l.href)}"${/^https?:/.test(l.href) ? ' rel="noopener"' : ''}>${esc(l.label)}</a></li>`)}
        </ul>
      </section>`
    : '';

  const backHref = chain.length ? chain[chain.length - 1].href : collection.base;
  const backLabel = chain.length ? chain[chain.length - 1].title : collection.back;

  const body = [
    preview ? '<div class="cms-preview-bar" role="status">Predogled. Tako bo stran videti, ko jo objavite.</div>' : '',
    pageHero({
      eyebrow: item.kicker || collection.singular,
      title: item.title,
      lead: item.summary,
      cta: { label: 'Rezervirajte posvet', href: '/kontakt/' },
    }),
    `<section class="section guide-body cms-page">
  <div class="shell">
    ${item.picture ? `<figure class="study__figure study__figure--lead" data-reveal>${item.picture.upload ? uploadPicture(item.picture, SIZES.full, { eager: true }) : legacyPicture(item.picture)}</figure>` : ''}
    <div class="study__text cms-body">
      ${item.collection !== 'strani' ? `<p class="cms-date">${item.event ? 'Termin' : 'Objavljeno'} <time datetime="${esc(item.date)}">${esc(label)}</time></p>` : ''}
      ${facts}
      ${bodyHtml}
      ${children}
      ${links}
      ${backLabel ? `<p class="study__back"><a class="link" href="${esc(backHref)}">${esc(backLabel)}</a></p>` : ''}
    </div>
  </div>
</section>`,
    closingCta,
  ].join('\n');

  const crumbs = [{ label: 'Domov', href: '/' }];
  if (collection.crumb) crumbs.push(collection.crumb);
  for (const p of chain) crumbs.push({ label: p.title, href: p.href });
  crumbs.push({ label: item.title, href });

  const page = {
    path: href,
    title: item.seo.metaTitle || `${item.title} | ${site.name}`,
    description: item.seo.metaDescription || item.summary,
    keywords: item.seo.keywords,
    breadcrumbs: crumbs,
    ogType: collection.article ? 'article' : 'website',
    noindex: item.seo.noindex || item.status !== 'published',
    changefreq: 'monthly',
    priority: '0.6',
    cms: true,
    body,
  };
  if (item.seo.ogImage) page.ogImage = item.seo.ogImage;
  else if (item.picture) {
    page.ogImage = pictureUrl(item.picture);
    page.ogImageWidth = item.picture.width;
    page.ogImageHeight = item.picture.height;
  }
  if (item.publishedAt) page.datePublished = item.publishedAt.slice(0, 10);
  else if (item.status === 'published') page.datePublished = item.date;
  if (item.updatedAt) page.dateModified = item.updatedAt.slice(0, 10);
  if (page.datePublished && page.dateModified && page.dateModified < page.datePublished) page.dateModified = page.datePublished;

  page.schema = collection.article ? [(p) => articleNode(item, p)] : collection.event ? [(p) => eventNode(item, p)] : [];
  return page;
}

function legacyPicture(picture) {
  const src = esc(picture.src);
  return `
        <picture>
          <source srcset="${src}-800.webp 800w, ${src}-1600.webp 1600w, ${src}.webp 3200w" sizes="${SIZES.full}" type="image/webp">
          <img src="${src}.jpg" alt="${esc(picture.alt)}" width="${picture.width}" height="${picture.height}" loading="eager" decoding="async">
        </picture>`;
}

/* ── The index the admin lists from ───────────────────────────────────── */

export function indexEntry(item) {
  return {
    collection: item.collection,
    slug: item.slug,
    parent: item.parent || '',
    status: item.status,
    title: item.title,
    kicker: item.kicker,
    summary: item.summary,
    date: item.date,
    updatedAt: item.updatedAt,
    publishedAt: item.publishedAt,
    picture: item.picture ? item.picture.src : null,
  };
}
