/**
 * IHG's API. One handler serves every route under /api/admin, on Vercel
 * (api/admin/[...route].js) and on the local dev server (build.mjs --serve
 * --admin). Everything except login needs a valid session cookie; every
 * change goes through the store, which is either the local folder or a
 * commit on the deployed branch.
 *
 * Routes (all JSON unless noted):
 *   POST   /login                       { password }
 *   POST   /logout
 *   GET    /me
 *   GET    /status
 *   GET    /pages                       every page of the site, for link pickers
 *   GET    /categories                  { novice: [...], blog: [...], ... }
 *   PUT    /categories                  the same shape back
 *   GET    /items?collection=blog       index entries
 *   GET    /items/:c/:slug              the full item
 *   PUT    /items/:c/:slug[?from=old&fromCollection=c2]   save, rename or move
 *   POST   /items/:c/:slug/status       { status }
 *   DELETE /items/:c/:slug
 *   POST   /upload                      { name, alt, width, height, webp, files: [{ suffix, data }] }
 *   GET    /media
 *   DELETE /media                       { src }
 *   POST   /preview                     { item }  → text/html of the page as it would publish
 *   GET    /analytics?days=30           page views, sessions, pages, referrers, devices, countries
 */

import { randomBytes } from 'node:crypto';

import { renderPage } from '../../src/layout.mjs';
import { closingCta } from '../../src/closing-cta.mjs';
import {
  COLLECTIONS,
  COLLECTION_KEYS,
  DEFAULT_CATEGORIES,
  normalizeItem,
  normalizeCategories,
  organize,
  cmsItemPage,
  indexEntry,
  SLUG_RE,
  slugify,
  dateLabel,
} from '../../src/cms.mjs';
import { readBody, json, fail, parseCookies, cookie, isSecure, clientIp, sameOrigin } from './http.mjs';
import { verifyPassword, createSession, verifySession, loginAllowed, noteFailure, noteSuccess } from './auth.mjs';
import { createLocalStore } from './store-local.mjs';
import { createGithubStore } from './store-github.mjs';
import { createAnalytics } from './analytics.mjs';

const COOKIE = 'ais_admin';
const INDEX_PATH = 'content/cms/index.json';
const CATEGORIES_PATH = 'content/cms/categories.json';
const UPLOAD_SUFFIXES = new Set(['-800.webp', '-1600.webp', '-800.jpg', '-1600.jpg']);
const MAX_FILE = 3 * 1024 * 1024;

export function createAdminHandler({ root, store: storeMode, onChange, env = process.env, collectPages = null, analytics = null } = {}) {
  const local = storeMode === 'local' || (!env.GITHUB_TOKEN && !env.VERCEL);
  const store = local
    ? createLocalStore({ root, onChange })
    : createGithubStore({ token: env.GITHUB_TOKEN, repo: env.GITHUB_REPO, branch: env.GITHUB_BRANCH, subdir: env.CMS_ROOT ?? 'website' });
  const stats = analytics ?? createAnalytics({ root: local ? root : null, env });

  const passwordHash = env.ADMIN_PASSWORD_HASH ?? '';
  const secret = env.ADMIN_SESSION_SECRET || (local ? randomBytes(32).toString('base64url') : '');

  /* ── index and categories ──────────────────────────────────────────── */

  async function loadIndex() {
    const text = await store.read(INDEX_PATH);
    if (!text) return { items: [], media: [] };
    try {
      const idx = JSON.parse(text);
      return { items: Array.isArray(idx.items) ? idx.items : [], media: Array.isArray(idx.media) ? idx.media : [] };
    } catch {
      return { items: [], media: [] };
    }
  }

  const indexFile = (idx) => ({
    path: INDEX_PATH,
    content:
      JSON.stringify(
        {
          items: [...idx.items].sort((a, b) => a.collection.localeCompare(b.collection) || (a.date < b.date ? 1 : a.date > b.date ? -1 : 0) || a.slug.localeCompare(b.slug)),
          media: [...idx.media].sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1)),
        },
        null,
        2
      ) + '\n',
  });

  async function loadCategories() {
    const text = await store.read(CATEGORIES_PATH);
    let raw = null;
    try {
      raw = text ? JSON.parse(text) : null;
    } catch {
      raw = null;
    }
    return normalizeCategories(raw ?? DEFAULT_CATEGORIES);
  }

  const categoriesFile = (cats) => ({ path: CATEGORIES_PATH, content: JSON.stringify(cats, null, 2) + '\n' });

  const itemPath = (c, slug) => `content/cms/${c}/${slug}.json`;

  async function readItem(c, slug) {
    const text = await store.read(itemPath(c, slug));
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  const itemFile = (item) => ({ path: itemPath(item.collection, item.slug), content: JSON.stringify(item, null, 2) + '\n' });

  /* ── auth ──────────────────────────────────────────────────────────── */

  const authed = (req) => verifySession(parseCookies(req)[COOKIE], secret);

  async function login(req, res) {
    if (!passwordHash) return fail(res, 503, 'Geslo za IHG še ni nastavljeno. Glejte IHG.md.', { setup: true });
    const ip = clientIp(req);
    if (!loginAllowed(ip)) return fail(res, 429, 'Preveč poskusov. Poskusite čez 15 minut.');
    const body = await readBody(req);
    const ok = verifyPassword(body.password, passwordHash);
    if (!ok) {
      noteFailure(ip);
      await new Promise((r) => setTimeout(r, 400));
      return fail(res, 401, 'Geslo ni pravilno.');
    }
    noteSuccess(ip);
    const session = createSession(secret);
    return json(res, { ok: true }, 200, { 'set-cookie': cookie(COOKIE, session.value, { maxAge: session.maxAge, secure: isSecure(req) }) });
  }

  const logout = (req, res) => json(res, { ok: true }, 200, { 'set-cookie': cookie(COOKIE, '', { maxAge: 0, secure: isSecure(req) }) });

  /* ── items ─────────────────────────────────────────────────────────── */

  const parseCollection = (c) => (COLLECTIONS[c] ? c : null);

  async function listItems(req, res, query) {
    const idx = await loadIndex();
    const c = query.get('collection');
    const items = c ? idx.items.filter((i) => i.collection === c) : idx.items;
    return json(res, {
      ok: true,
      items,
      collections: COLLECTION_KEYS.map((k) => ({ key: k, label: COLLECTIONS[k].label, singular: COLLECTIONS[k].singular, base: COLLECTIONS[k].base })),
    });
  }

  async function getItem(res, c, slug) {
    if (!parseCollection(c) || !SLUG_RE.test(slug)) return fail(res, 404, 'Ni najdeno.');
    const item = await readItem(c, slug);
    if (!item) return fail(res, 404, 'Ni najdeno.');
    const { item: clean, problems } = normalizeItem(item, c);
    clean.updatedAt = item.updatedAt ?? clean.updatedAt;
    return json(res, { ok: true, item: clean, problems });
  }

  async function saveItem(req, res, c, slug, query) {
    if (!parseCollection(c)) return fail(res, 404, 'Neznana zbirka.');
    const body = await readBody(req);
    const raw = { ...(body.item ?? body), collection: c, slug };
    const from = query.get('from');
    const fromCollection = parseCollection(query.get('fromCollection')) ?? c;
    const moving = Boolean(from && SLUG_RE.test(from) && (from !== slug || fromCollection !== c));
    const existing = await readItem(c, slug);
    const previous = existing ?? (moving ? await readItem(fromCollection, from) : null);

    if (previous) {
      raw.createdAt = previous.createdAt ?? raw.createdAt;
      raw.publishedAt = raw.publishedAt ?? previous.publishedAt ?? null;
    }
    const { item, errors, problems } = normalizeItem(raw, c);
    if (!item || errors.length) return fail(res, 400, errors.join(' '), { errors });
    if (item.status === 'published' && problems.length) return fail(res, 400, 'Pred objavo je treba urediti: ' + problems.join(' '), { problems });
    if (item.status === 'published' && !item.publishedAt) item.publishedAt = new Date().toISOString();

    const idx = await loadIndex();
    if (!existing && idx.items.some((i) => i.collection === c && i.slug === slug)) return fail(res, 409, 'Ta naslov URL že obstaja.');
    if (item.parent) {
      const parent = idx.items.find((i) => i.collection === c && i.slug === item.parent);
      if (!parent) return fail(res, 400, 'Nadrejena stran ne obstaja.');
      if (descends(idx.items, c, item.parent, slug)) return fail(res, 400, 'Nadrejena stran ne more biti ena od podstrani.');
    }

    const files = [itemFile(item)];
    let idxItems = idx.items.filter((i) => !(i.collection === c && i.slug === slug));

    /* rename or move: drop the old file, move the children along (a move to
       another collection leaves the children where they were, without parent) */
    if (moving && previous) {
      files.push({ path: itemPath(fromCollection, from), delete: true });
      idxItems = idxItems.filter((i) => !(i.collection === fromCollection && i.slug === from));
      for (const child of idx.items.filter((i) => i.collection === fromCollection && i.parent === from)) {
        const full = await readItem(fromCollection, child.slug);
        if (!full) continue;
        full.parent = fromCollection === c ? slug : '';
        files.push(itemFile(full));
        idxItems = idxItems.map((i) => (i.collection === fromCollection && i.slug === child.slug ? { ...i, parent: full.parent } : i));
      }
    }

    /* a new category is remembered for next time */
    let catFiles = [];
    if (item.kicker) {
      const cats = await loadCategories();
      if (!cats[c].some((k) => k.toLowerCase() === item.kicker.toLowerCase())) {
        cats[c].push(item.kicker);
        catFiles = [categoriesFile(normalizeCategories(cats))];
      }
    }

    idxItems.push(indexEntry(item));
    files.push(indexFile({ ...idx, items: idxItems }), ...catFiles);
    const verb = item.status === 'published' ? 'objavi' : 'shrani osnutek';
    const note = moving ? ` (prej ${fromCollection}/${from})` : '';
    const result = await store.write(files, `ihg: ${verb} ${c}/${slug}${note}`);
    return json(res, { ok: true, item, problems, commit: result.commit, commitUrl: result.url ?? null, href: pathOf(item, idxItems) });
  }

  async function setStatus(req, res, c, slug) {
    if (!parseCollection(c) || !SLUG_RE.test(slug)) return fail(res, 404, 'Ni najdeno.');
    const body = await readBody(req);
    const existing = await readItem(c, slug);
    if (!existing) return fail(res, 404, 'Ni najdeno.');
    const status = body.status === 'published' ? 'published' : 'draft';
    const { item, errors, problems } = normalizeItem({ ...existing, status }, c);
    if (!item || errors.length) return fail(res, 400, errors.join(' '));
    if (status === 'published' && problems.length) return fail(res, 400, 'Pred objavo je treba urediti: ' + problems.join(' '), { problems });
    if (status === 'published' && !item.publishedAt) item.publishedAt = new Date().toISOString();
    const idx = await loadIndex();
    const idxItems = idx.items.filter((i) => !(i.collection === c && i.slug === slug));
    idxItems.push(indexEntry(item));
    const result = await store.write([itemFile(item), indexFile({ ...idx, items: idxItems })], `ihg: ${status === 'published' ? 'objavi' : 'umakni'} ${c}/${slug}`);
    return json(res, { ok: true, item, commit: result.commit, commitUrl: result.url ?? null, href: pathOf(item, idxItems) });
  }

  async function deleteItem(res, c, slug) {
    if (!parseCollection(c) || !SLUG_RE.test(slug)) return fail(res, 404, 'Ni najdeno.');
    const existing = await readItem(c, slug);
    if (!existing) return fail(res, 404, 'Ni najdeno.');
    const idx = await loadIndex();
    const files = [{ path: itemPath(c, slug), delete: true }];
    let idxItems = idx.items.filter((i) => !(i.collection === c && i.slug === slug));
    for (const child of idx.items.filter((i) => i.collection === c && i.parent === slug)) {
      const full = await readItem(c, child.slug);
      if (!full) continue;
      full.parent = '';
      files.push(itemFile(full));
      idxItems = idxItems.map((i) => (i.collection === c && i.slug === child.slug ? { ...i, parent: '' } : i));
    }
    files.push(indexFile({ ...idx, items: idxItems }));
    const result = await store.write(files, `ihg: izbriši ${c}/${slug}`);
    return json(res, { ok: true, commit: result.commit });
  }

  /* ── categories ────────────────────────────────────────────────────── */

  async function getCategories(res) {
    return json(res, { ok: true, categories: await loadCategories() });
  }

  async function putCategories(req, res) {
    const body = await readBody(req);
    const cats = normalizeCategories(body.categories ?? body);
    await store.write([categoriesFile(cats)], 'ihg: kategorije');
    return json(res, { ok: true, categories: cats });
  }

  /* ── media ─────────────────────────────────────────────────────────── */

  async function upload(req, res) {
    const body = await readBody(req);
    const files = Array.isArray(body.files) ? body.files : [];
    if (!files.length) return fail(res, 400, 'Ni datotek.');
    const year = new Date().getFullYear();
    const base = slugify(String(body.name ?? 'slika').replace(/\.[a-z0-9]+$/i, '')) || 'slika';
    const idx = await loadIndex();
    const taken = new Set(idx.media.map((m) => m.src));
    let src = `/uploads/${year}/${base}`;
    while (taken.has(src)) src = `/uploads/${year}/${base}-${randomBytes(2).toString('hex')}`;

    const out = [];
    let bytes = 0;
    for (const f of files) {
      if (!UPLOAD_SUFFIXES.has(f.suffix)) return fail(res, 400, `Neznana različica slike: ${f.suffix}`);
      const buf = Buffer.from(String(f.data ?? ''), 'base64');
      if (!buf.length || buf.length > MAX_FILE) return fail(res, 400, 'Slika je prazna ali prevelika (največ 3 MB na različico).');
      if (!looksLikeImage(buf, f.suffix)) return fail(res, 400, 'Datoteka ni slika v pričakovani obliki.');
      bytes += buf.length;
      out.push({ path: `public${src}${f.suffix}`, content: buf });
    }
    const has = (s) => files.some((f) => f.suffix === s);
    if (!has('-800.jpg') || !has('-1600.jpg')) return fail(res, 400, 'Manjkata različici JPG.');
    const webp = has('-800.webp') && has('-1600.webp');

    const entry = {
      src,
      alt: String(body.alt ?? '').slice(0, 300),
      width: Number(body.width) > 0 ? Math.round(Number(body.width)) : 1600,
      height: Number(body.height) > 0 ? Math.round(Number(body.height)) : 1000,
      webp,
      bytes,
      name: String(body.name ?? '').slice(0, 120),
      uploadedAt: new Date().toISOString(),
    };
    out.push(indexFile({ ...idx, media: [...idx.media, entry] }));
    const result = await store.write(out, `ihg: naloži sliko ${src}`);
    return json(res, { ok: true, picture: { src, alt: entry.alt, width: entry.width, height: entry.height, upload: true, webp }, media: entry, commit: result.commit });
  }

  async function listMedia(res) {
    const idx = await loadIndex();
    return json(res, { ok: true, media: idx.media, usage: mediaUsage(idx) });
  }

  async function deleteMedia(req, res) {
    const body = await readBody(req);
    const src = String(body.src ?? '');
    const idx = await loadIndex();
    const entry = idx.media.find((m) => m.src === src);
    if (!entry) return fail(res, 404, 'Slika ni v knjižnici.');
    const used = mediaUsage(idx)[src] ?? [];
    for (const it of idx.items) {
      if (used.length) break;
      const full = await readItem(it.collection, it.slug);
      if (full && String(full.body ?? '').includes(src)) used.push(`${it.collection}/${it.slug}`);
    }
    if (used.length) return fail(res, 409, `Slika je v uporabi: ${used.join(', ')}. Najprej jo odstranite tam.`);
    const files = [...UPLOAD_SUFFIXES].map((s) => ({ path: `public${src}${s}`, delete: true }));
    files.push(indexFile({ ...idx, media: idx.media.filter((m) => m.src !== src) }));
    const result = await store.write(files, `ihg: izbriši sliko ${src}`);
    return json(res, { ok: true, commit: result.commit });
  }

  const mediaUsage = (idx) => {
    const usage = {};
    for (const it of idx.items) {
      if (!it.picture) continue;
      (usage[it.picture] ??= []).push(`${it.collection}/${it.slug}`);
    }
    return usage;
  };

  /* ── preview, pages, status, analytics ─────────────────────────────── */

  async function preview(req, res) {
    const body = await readBody(req);
    const raw = body.item ?? body;
    const c = parseCollection(raw.collection);
    if (!c) return fail(res, 400, 'Neznana zbirka.');
    const { item, errors } = normalizeItem(raw, c);
    if (!item) return fail(res, 400, errors.join(' '));
    if (!item.slug) item.slug = 'predogled';
    const idx = await loadIndex();
    const others = idx.items.filter((i) => !(i.collection === c && i.slug === item.slug)).map(indexToItem);
    const organized = organize([...others, item], { drafts: true });
    const live = organized.all.find((i) => i.collection === c && i.slug === item.slug) ?? item;
    const page = cmsItemPage(live, { closingCta, all: organized.all, preview: true });
    page.noindex = true;
    page.datePublished ??= item.date;
    page.dateModified ??= new Date().toISOString().slice(0, 10);
    page.body = page.body.replaceAll('{{dateModifiedIso}}', page.dateModified).replaceAll('{{dateModified}}', dateLabel(page.dateModified));
    return json(res, renderPage(page), 200, { 'content-type': 'text/html; charset=utf-8' });
  }

  async function pages(res) {
    const idx = await loadIndex();
    const list = [];
    if (collectPages) {
      for (const p of collectPages()) {
        if (p.noindex || p.cms || p.path.endsWith('.html')) continue;
        list.push({ path: p.path, title: p.breadcrumbs?.at(-1)?.label ?? p.title, group: 'Spletna stran' });
      }
    }
    const organized = organize(idx.items.map(indexToItem), { drafts: true });
    for (const it of organized.all) list.push({ path: it.href, title: it.title, group: COLLECTIONS[it.collection].label, status: it.status });
    return json(res, { ok: true, pages: list });
  }

  async function status(res) {
    const idx = await loadIndex();
    const last = await store.lastCommit().catch(() => null);
    const counts = {};
    for (const k of COLLECTION_KEYS) counts[k] = { published: 0, draft: 0 };
    for (const it of idx.items) counts[it.collection] && (counts[it.collection][it.status === 'published' ? 'published' : 'draft'] += 1);
    return json(res, {
      ok: true,
      ...store.info(),
      lastCommit: last,
      counts,
      media: idx.media.length,
      siteOrigin: 'https://ais-slovenia.si',
      analytics: { configured: stats.configured, mode: stats.mode },
    });
  }

  async function analyticsView(res, query) {
    const days = Math.min(365, Math.max(1, Number(query.get('days')) || 30));
    const data = await stats.query(days);
    return json(res, { ok: true, ...data });
  }

  /* ── router ────────────────────────────────────────────────────────── */

  return async function handle(req, res) {
    try {
      const u = new URL(req.url, 'http://x');
      const rel = u.pathname.replace(/^\/api\/admin/, '').replace(/\/+$/, '') || '/';
      const parts = rel.split('/').filter(Boolean);
      const method = req.method.toUpperCase();

      if (method !== 'GET' && method !== 'HEAD') {
        if (!sameOrigin(req)) return fail(res, 403, 'Zahteva ne prihaja s te strani.');
        if (req.headers['x-ais-admin'] !== '1') return fail(res, 403, 'Manjka oznaka zahteve.');
      }

      if (parts[0] === 'login' && method === 'POST') return login(req, res);
      if (parts[0] === 'logout' && method === 'POST') return logout(req, res);

      if (!passwordHash) return fail(res, 503, 'Geslo za IHG še ni nastavljeno. Glejte IHG.md.', { setup: true });
      if (!authed(req)) return fail(res, 401, 'Prijavite se.', { authenticated: false });

      if (parts[0] === 'me') return json(res, { ok: true, authenticated: true, mode: store.mode });
      if (parts[0] === 'status' && method === 'GET') return status(res);
      if (parts[0] === 'pages' && method === 'GET') return pages(res);
      if (parts[0] === 'categories' && method === 'GET') return getCategories(res);
      if (parts[0] === 'categories' && method === 'PUT') return putCategories(req, res);
      if (parts[0] === 'analytics' && method === 'GET') return analyticsView(res, u.searchParams);
      if (parts[0] === 'items') {
        if (parts.length === 1 && method === 'GET') return listItems(req, res, u.searchParams);
        if (parts.length === 3 && method === 'GET') return getItem(res, parts[1], parts[2]);
        if (parts.length === 3 && method === 'PUT') return saveItem(req, res, parts[1], parts[2], u.searchParams);
        if (parts.length === 3 && method === 'DELETE') return deleteItem(res, parts[1], parts[2]);
        if (parts.length === 4 && parts[3] === 'status' && method === 'POST') return setStatus(req, res, parts[1], parts[2]);
      }
      if (parts[0] === 'upload' && method === 'POST') return upload(req, res);
      if (parts[0] === 'media' && method === 'GET') return listMedia(res);
      if (parts[0] === 'media' && method === 'DELETE') return deleteMedia(req, res);
      if (parts[0] === 'preview' && method === 'POST') return preview(req, res);

      return fail(res, 404, 'Ni take poti.');
    } catch (err) {
      const status = err.status ?? (err instanceof SyntaxError ? 400 : 500);
      if (status >= 500) console.error('[ih]', err);
      return fail(res, status, status >= 500 ? `Ni uspelo: ${err.message}` : err.message);
    }
  };
}

/* ── helpers ──────────────────────────────────────────────────────────── */

const indexToItem = (e) => ({
  collection: e.collection,
  slug: e.slug,
  parent: e.parent || '',
  status: e.status,
  title: e.title,
  kicker: e.kicker,
  summary: e.summary,
  date: e.date,
  format: 'markdown',
  body: '',
  picture: e.picture ? { src: e.picture, alt: '', caption: '', width: 1600, height: 1000, upload: e.picture.startsWith('/uploads/'), webp: true } : null,
  cta: null,
  seo: { metaTitle: '', metaDescription: '', keywords: [], ogTitle: '', ogDescription: '', ogImage: '', canonical: '', noindex: false, nofollow: false, schemaType: 'auto', faq: [] },
  links: [],
  updatedAt: e.updatedAt,
  publishedAt: e.publishedAt,
});

function pathOf(item, idxItems) {
  const organized = organize([...idxItems.filter((i) => !(i.collection === item.collection && i.slug === item.slug)).map(indexToItem), item], { drafts: true });
  return organized.all.find((i) => i.collection === item.collection && i.slug === item.slug)?.href ?? null;
}

/* true when `candidate` is `slug` itself or one of its descendants */
function descends(items, c, candidate, slug) {
  let cur = candidate;
  const seen = new Set();
  while (cur && !seen.has(cur)) {
    if (cur === slug) return true;
    seen.add(cur);
    cur = items.find((i) => i.collection === c && i.slug === cur)?.parent || '';
  }
  return false;
}

function looksLikeImage(buf, suffix) {
  if (suffix.endsWith('.jpg')) return buf[0] === 0xff && buf[1] === 0xd8;
  if (suffix.endsWith('.webp')) return buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP';
  return false;
}
