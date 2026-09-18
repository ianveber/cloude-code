/* IH: the workspace behind ais-slovenia.si. One page: the list on the left,
   the article in the middle as you would read it, and on the right the
   panel that says where it goes, what search engines see and how it is
   doing. Talks to /api/admin. No dependencies. */

import { renderMarkdown } from './md.js';
import { cleanHtml, htmlToText } from './clean-html.js';
import { createEditor } from './editor.js';
import { openPictureTool, quickVariants } from './picture-tool.js';

const API = '/api/admin';
const SITE = 'https://ais-slovenia.si';
const LIMITS = { titleMax: 60, descMin: 70, descMax: 165, summaryMax: 220 };

const COLLECTIONS = {
  novice: { key: 'novice', label: 'Novice', singular: 'Novica', newLabel: 'Nova novica', base: '/novice/', words: 80 },
  blog: { key: 'blog', label: 'Blog', singular: 'Zapis', newLabel: 'Nov zapis', base: '/blog/', words: 300 },
  dogodki: { key: 'dogodki', label: 'Dogodki', singular: 'Dogodek', newLabel: 'Nov dogodek', base: '/dogodki/', event: true, words: 60 },
  strani: { key: 'strani', label: 'Strani', singular: 'Stran', newLabel: 'Nova stran', base: '/', page: true, words: 200 },
};
const SCHEMA_LABELS = { auto: 'Samodejno (glede na rubriko)', Article: 'Članek', NewsArticle: 'Novica', BlogPosting: 'Zapis na blogu', Event: 'Dogodek', WebPage: 'Navadna stran', none: 'Brez' };

const app = document.getElementById('app');
const state = {
  authed: false,
  setup: false,
  status: null,
  items: [],
  pages: [],
  categories: null,
  media: [],
  mediaUsage: {},
  analytics: null,
  analyticsAt: 0,
  analyticsDays: 30,
  drawer: { collection: 'novice', query: '', open: false },
  panelOpen: false,
  ed: null,
};

/* ── helpers ───────────────────────────────────────────────────────────── */

const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ENT[c]);
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const n = (v) => new Intl.NumberFormat('sl-SI').format(Math.round(v || 0));

function toast(message, kind = '') {
  const el = document.createElement('div');
  el.className = `toast${kind ? ` toast--${kind}` : ''}`;
  el.textContent = message;
  document.getElementById('toasts').append(el);
  setTimeout(() => el.remove(), kind === 'bad' ? 6000 : 3000);
}

async function api(path, { method = 'GET', body, raw = false } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: { 'content-type': 'application/json', 'x-ais-admin': '1' },
    credentials: 'same-origin',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (raw) {
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw Object.assign(new Error(err.error || 'Ni uspelo.'), { status: res.status, data: err });
    }
    return res.text();
  }
  const data = await res.json().catch(() => ({ ok: false, error: 'Strežnik ni odgovoril razumljivo.' }));
  if (res.status === 401) {
    state.authed = false;
    render();
    throw Object.assign(new Error('Prijavite se.'), { status: 401, data });
  }
  if (!res.ok || data.ok === false) throw Object.assign(new Error(data.error || 'Ni uspelo.'), { status: res.status, data });
  return data;
}

const slugify = (text) =>
  String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const today = () => new Date().toISOString().slice(0, 10);
const dateLabel = (iso) => (/^\d{4}-\d{2}-\d{2}$/.test(iso ?? '') ? iso.split('-').reverse().map(Number).join('. ') : '');
const ago = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'pravkar';
  if (diff < 3600) return `pred ${Math.round(diff / 60)} min`;
  if (diff < 86400) return `pred ${Math.round(diff / 3600)} h`;
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
};
const debounce = (fn, ms) => {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
};
const wordCount = (text) => (String(text ?? '').match(/[\p{L}\p{N}]+/gu) ?? []).length;

const ICON = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  list: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  image: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/></svg>',
  chart: '<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  out: '<svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5M15 12H3M21 3v18"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
};

/* ── routing ───────────────────────────────────────────────────────────── */

function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (!parts.length) return { view: 'home' };
  if (parts[0] === 'e' && COLLECTIONS[parts[1]]) return { view: 'editor', c: parts[1], slug: parts[2] === 'novo' || !parts[2] ? null : parts[2] };
  if (parts[0] === 'slike') return { view: 'media' };
  if (parts[0] === 'analitika') return { view: 'analytics' };
  if (parts[0] === 'nastavitve') return { view: 'settings' };
  return { view: 'home' };
}
const go = (hash) => {
  location.hash = hash;
};

/* ── shell ─────────────────────────────────────────────────────────────── */

function shell(content, { view, panel = '' } = {}) {
  const link = (href, icon, label, active) => `<a href="#/${href}" class="${active ? 'is-active' : ''}" title="${esc(label)}">${icon}<span>${esc(label)}</span></a>`;
  return `
  <div class="shell">
    <nav class="rail" aria-label="IH">
      <a class="rail__mark" href="#/" aria-label="IH, pregled"><span class="ihmark ihmark--accent">IH</span></a>
      ${link('', ICON.home, 'Pregled', view === 'home')}
      <button type="button" data-action="drawer" title="Vsebina">${ICON.list}<span>Vsebina</span></button>
      ${link('slike', ICON.image, 'Slike', view === 'media')}
      ${link('analitika', ICON.chart, 'Analitika', view === 'analytics')}
      ${link('nastavitve', ICON.gear, 'Nastavitve', view === 'settings')}
      <span class="rail__spacer"></span>
      <button type="button" data-action="logout" title="Odjava">${ICON.out}<span>Odjava</span></button>
    </nav>
    <div class="body${panel ? ' has-panel' : ''}">
      <aside class="drawer${state.drawer.open ? ' is-open' : ''}" data-drawer>${drawerView()}</aside>
      <main class="work">${content}</main>
      ${panel ? `<aside class="panel${state.panelOpen ? ' is-open' : ''}" data-panel>${panel}</aside>` : ''}
    </div>
  </div>`;
}

function drawerView() {
  const c = COLLECTIONS[state.drawer.collection];
  const q = state.drawer.query.trim().toLowerCase();
  const cur = state.ed ? `${state.ed.collection.key}/${state.ed.originalSlug}` : '';
  let items = state.items.filter((i) => i.collection === c.key);
  if (q) items = items.filter((i) => `${i.title} ${i.kicker} ${i.slug}`.toLowerCase().includes(q));
  items.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  return `
  <div class="drawer__inner">
    <div class="drawer__head">
      <h2>Vsebina</h2>
      <a class="btn btn--sm btn--primary" href="#/e/${c.key}/novo">${ICON.plus} ${esc(c.newLabel)}</a>
      <button class="btn btn--sm btn--ghost drawer__close" type="button" data-action="drawer" aria-label="Zapri">✕</button>
    </div>
    <div class="tabs" role="tablist">
      ${Object.values(COLLECTIONS)
        .map((x) => `<button type="button" class="tab${x.key === c.key ? ' is-active' : ''}" data-tab="${x.key}">${esc(x.label)} <span class="muted">${state.items.filter((i) => i.collection === x.key).length}</span></button>`)
        .join('')}
    </div>
    <input class="input input--sm search" type="search" placeholder="Išči po naslovu …" value="${esc(state.drawer.query)}" data-search>
    <div class="dlist">
      ${
        items.length
          ? items
              .map(
                (i) => `
        <a class="ditem${cur === `${i.collection}/${i.slug}` ? ' is-active' : ''}" href="#/e/${i.collection}/${encodeURIComponent(i.slug)}">
          ${i.picture ? `<img class="ditem__pic" src="${esc(i.picture)}-800.${i.picture.startsWith('/uploads/') ? 'jpg' : 'webp'}" alt="" loading="lazy">` : '<span class="ditem__pic ditem__pic--empty">brez slike</span>'}
          <span><span class="ditem__t">${esc(i.title || '(brez naslova)')}</span><span class="ditem__m"><i class="dot ${i.status === 'published' ? 'dot--live' : 'dot--draft'}"></i>${esc(i.kicker || c.singular)} · ${esc(dateLabel(i.date))}</span></span>
        </a>`
              )
              .join('')
          : `<p class="drawer__empty">${q ? 'Nič ne ustreza iskanju.' : 'Tu še ni vsebin.'}</p>`
      }
    </div>
  </div>`;
}

function refreshDrawer() {
  const d = $('[data-drawer]');
  if (d) d.innerHTML = drawerView();
}

/* ── login ─────────────────────────────────────────────────────────────── */

function loginView() {
  return `
  <div class="login">
    <form class="login__card" data-form="login">
      <div class="login__brand"><span class="ihmark ihmark--accent">IH</span><span><b>IH</b><br><span class="muted small">za ais-slovenia.si</span></span></div>
      <h1>Prijava</h1>
      ${state.setup ? `<p class="note note--bad">Geslo še ni nastavljeno. Zaženite <span class="mono">npm run admin:password</span> in vrstici vpišite v nastavitve strežnika (glejte IH.md).</p>` : ''}
      <div class="field">
        <label for="pw">Geslo</label>
        <input class="input" id="pw" name="password" type="password" autocomplete="current-password" required autofocus>
      </div>
      <button class="btn btn--primary" type="submit">Vstopi</button>
      <p class="login__hint">To ni javna stran. Kar tu shranite kot osnutek, na spletni strani ni vidno, dokler ne objavite.</p>
    </form>
  </div>`;
}

/* ── analytics pieces ──────────────────────────────────────────────────── */

async function loadAnalytics(days = state.analyticsDays, force = false) {
  if (!force && state.analytics && state.analytics.daysN === days && Date.now() - state.analyticsAt < 60000) return state.analytics;
  const r = await api(`/analytics?days=${days}`);
  state.analytics = { ...r, daysN: days };
  state.analyticsAt = Date.now();
  return state.analytics;
}

function sumRange(a, from, to, key = 'views') {
  return a.days.slice(from, to).reduce((s, d) => s + (d[key] ?? 0), 0);
}

function chartSvg(days, { height = 140 } = {}) {
  const max = Math.max(1, ...days.map((d) => d.views));
  const bars = days
    .map((d) => `<i style="height:${Math.max(1.5, (d.views / max) * 100).toFixed(1)}%" title="${esc(dateLabel(d.date))}: ${d.views} ogledov, ${d.sessions} obiskov"></i>`)
    .join('');
  const label = (d) => `${Number(d.date.slice(8))}. ${Number(d.date.slice(5, 7))}.`;
  const mid = days[Math.floor(days.length / 2)];
  return `<div class="bars${height > 150 ? ' bars--tall' : ''}">${bars}</div><div class="bars__labels"><span>${esc(label(days[0]))}</span>${days.length > 2 ? `<span>${esc(label(mid))}</span>` : ''}<span>${esc(label(days.at(-1)))}</span></div>`;
}

function sparkSvg(values) {
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => [(i / Math.max(1, values.length - 1)) * 100, 40 - (v / max) * 36]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 100 44" preserveAspectRatio="none"><path class="area" d="${d} L100 44 L0 44 Z"/><path d="${d}"/></svg>`;
}

function tableOf(rows, label, total) {
  if (!rows.length) return `<p class="muted small">Še nič.</p>`;
  const max = Math.max(1, ...rows.map((r) => r.views));
  return `<table class="table"><thead><tr><th>${esc(label)}</th><th class="num">Ogledi</th><th style="width:30%"></th></tr></thead><tbody>${rows
    .map((r) => `<tr><td>${esc(r.key || '(neposredno)')}</td><td class="num">${n(r.views)}${total ? ` <span class="muted">${Math.round((r.views / total) * 100)}%</span>` : ''}</td><td><div class="bar"><i style="width:${(r.views / max) * 100}%"></i></div></td></tr>`)
    .join('')}</tbody></table>`;
}

/* ── home ──────────────────────────────────────────────────────────────── */

function homeView() {
  const a = state.analytics;
  const st = state.status ?? {};
  const recent = [...state.items].sort((x, y) => (x.updatedAt < y.updatedAt ? 1 : -1)).slice(0, 6);
  const totalDays = a ? a.days.length : 0;
  const stats = a
    ? `
    <div class="grid grid--stats">
      <div class="card stat"><span class="stat__n">${n(a.days.at(-1)?.views)}</span><span class="stat__l">Ogledi danes</span><span class="stat__d">${n(a.days.at(-1)?.sessions)} obiskov</span></div>
      <div class="card stat"><span class="stat__n">${n(sumRange(a, totalDays - 7, totalDays))}</span><span class="stat__l">Ogledi, 7 dni</span><span class="stat__d">${n(sumRange(a, totalDays - 7, totalDays, 'sessions'))} obiskov</span></div>
      <div class="card stat"><span class="stat__n">${n(a.totals.views)}</span><span class="stat__l">Ogledi, 30 dni</span><span class="stat__d">${n(a.totals.sessions)} obiskov</span></div>
      <div class="card stat"><span class="stat__n">${n(Object.values(a.devices).reduce((s, v) => s + v, 0) ? Math.round(((a.devices.phone ?? 0) / Object.values(a.devices).reduce((s, v) => s + v, 0)) * 100) : 0)}%</span><span class="stat__l">Na telefonu</span><span class="stat__d">delež ogledov</span></div>
    </div>`
    : '';
  return `
  <div class="view">
    <div class="view__head">
      <h1>Pregled</h1>
      <div class="quick">${Object.values(COLLECTIONS)
        .map((c) => `<a class="btn btn--sm" href="#/e/${c.key}/novo">${ICON.plus} ${esc(c.newLabel)}</a>`)
        .join('')}</div>
    </div>
    ${a && !a.configured ? `<p class="note note--warn">Analitika še ne shranjuje. Vklopite jo z Upstash Redis (spremenljivki UPSTASH_REDIS_REST_URL in UPSTASH_REDIS_REST_TOKEN v Vercelu); navodila so v IH.md. Lokalno se šteje v datoteko data/analytics.json.</p>` : ''}
    ${stats}
    <div class="grid" style="grid-template-columns: 1fr">
      <div class="card">
        <div class="view__head"><h2>Ogledi po dnevih</h2><a class="small" href="#/analitika">Vsa analitika</a></div>
        ${a ? chartSvg(a.days) : '<p class="muted">Nalagam …</p>'}
      </div>
    </div>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr))">
      <div class="card">
        <h2 style="margin-bottom:.6rem">Najbolj brane strani, 30 dni</h2>
        ${a ? tableOf(a.pages.slice(0, 8), 'Stran', a.totals.views) : ''}
      </div>
      <div class="card">
        <h2 style="margin-bottom:.6rem">Nazadnje urejeno</h2>
        ${
          recent.length
            ? `<div class="dlist" style="padding:0">${recent
                .map(
                  (i) => `<a class="ditem" href="#/e/${i.collection}/${encodeURIComponent(i.slug)}">${
                    i.picture ? `<img class="ditem__pic" src="${esc(i.picture)}-800.${i.picture.startsWith('/uploads/') ? 'jpg' : 'webp'}" alt="">` : '<span class="ditem__pic ditem__pic--empty">brez slike</span>'
                  }<span><span class="ditem__t">${esc(i.title)}</span><span class="ditem__m"><i class="dot ${i.status === 'published' ? 'dot--live' : 'dot--draft'}"></i>${esc(COLLECTIONS[i.collection].singular)} · urejeno ${esc(ago(i.updatedAt))}</span></span></a>`
                )
                .join('')}</div>`
            : `<p class="muted">Še ni vsebin. Začnite z novico ali zapisom.</p>`
        }
      </div>
      <div class="card" style="display:grid;gap:.5rem">
        <h2>Kam se shranjuje</h2>
        <p class="small">${st.mode === 'github' ? `V repozitorij <span class="mono">${esc(st.repo)}</span>, veja <span class="mono">${esc(st.branch)}</span>. Objava sproži gradnjo; na spletu je v približno dveh minutah.` : 'V lokalne datoteke. Spletna stran v predogledu se po vsakem shranjevanju znova zgradi.'}</p>
        ${st.lastCommit ? `<p class="small muted">Zadnje: ${esc(st.lastCommit.message)} (${esc(ago(st.lastCommit.date))})</p>` : ''}
        <p class="small muted">Osnutek vidite samo vi. Objavljeno vidijo vsi, iskalniki in AI asistenti.</p>
      </div>
    </div>
  </div>`;
}

/* ── analytics view ────────────────────────────────────────────────────── */

function analyticsView() {
  const a = state.analytics;
  if (!a) return `<div class="view"><div class="boot">Nalagam …</div></div>`;
  const dev = a.devices;
  const devTotal = Object.values(dev).reduce((s, v) => s + v, 0) || 1;
  return `
  <div class="view">
    <div class="view__head">
      <h1>Analitika</h1>
      <div class="quick">${[7, 30, 90].map((d) => `<button type="button" class="btn btn--sm${state.analyticsDays === d ? ' btn--ink' : ''}" data-range="${d}">${d} dni</button>`).join('')}</div>
      <p class="view__sub">Ogledi strani obiskovalcev, ki so dovolili analitiko. Brez naslovov IP in brez imen; obisk je 30-minutna seja.${a.configured ? '' : ' Shranjevanje še ni vklopljeno.'}</p>
    </div>
    <div class="grid grid--stats">
      <div class="card stat"><span class="stat__n">${n(a.totals.views)}</span><span class="stat__l">Ogledi</span></div>
      <div class="card stat"><span class="stat__n">${n(a.totals.sessions)}</span><span class="stat__l">Obiski</span></div>
      <div class="card stat"><span class="stat__n">${n(a.totals.sessions ? a.totals.views / a.totals.sessions : 0)}</span><span class="stat__l">Strani na obisk</span></div>
      <div class="card stat"><span class="stat__n">${Math.round(((dev.phone ?? 0) / devTotal) * 100)}%</span><span class="stat__l">Na telefonu</span><span class="stat__d">${Math.round(((dev.desktop ?? 0) / devTotal) * 100)}% računalnik, ${Math.round(((dev.tablet ?? 0) / devTotal) * 100)}% tablica</span></div>
    </div>
    <div class="card"><h2 style="margin-bottom:.6rem">Ogledi po dnevih</h2>${chartSvg(a.days, { height: 180 })}</div>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr))">
      <div class="card"><h2 style="margin-bottom:.6rem">Strani</h2>${tableOf(a.pages, 'Stran', a.totals.views)}</div>
      <div class="card"><h2 style="margin-bottom:.6rem">Od kod prihajajo</h2>${tableOf(a.refs, 'Vir', a.totals.views)}</div>
      <div class="card"><h2 style="margin-bottom:.6rem">Države</h2>${tableOf(a.countries, 'Država', a.totals.views)}</div>
    </div>
  </div>`;
}

/* ── media view ────────────────────────────────────────────────────────── */

function mediaView() {
  const usage = state.mediaUsage ?? {};
  return `
  <div class="view">
    <div class="view__head">
      <h1>Slike</h1>
      <button class="btn btn--primary btn--sm" type="button" data-action="media-upload">${ICON.plus} Naloži</button>
      <input type="file" accept="image/*" multiple class="visually-hidden" data-file="media">
      <p class="view__sub">Vsaka slika je shranjena v štirih velikostih. Kliknite sliko za urejanje (izrez, velikost), s potjo jo vstavite kamor koli.</p>
    </div>
    ${
      state.media.length
        ? `<div class="media">${state.media
            .map(
              (m) => `
      <div class="mitem">
        <img src="${esc(m.src)}-800.jpg" alt="${esc(m.alt)}" loading="lazy" data-media-edit="${esc(m.src)}" title="Uredi">
        <span class="mitem__n" title="${esc(m.src)}">${esc(m.name || m.src)}</span>
        <span class="small muted">${m.width}×${m.height} · ${Math.round((m.bytes ?? 0) / 1024)} kB${usage[m.src]?.length ? ` · v uporabi (${usage[m.src].length})` : ''}</span>
        <div class="mitem__a">
          <button class="btn btn--xs" type="button" data-copy="${esc(m.src)}">Pot</button>
          <button class="btn btn--xs" type="button" data-media-edit="${esc(m.src)}">Uredi</button>
          <button class="btn btn--xs btn--danger" type="button" data-media-delete="${esc(m.src)}" ${usage[m.src]?.length ? 'disabled title="Slika je v uporabi"' : ''}>Izbriši</button>
        </div>
      </div>`
            )
            .join('')}</div>`
        : `<div class="empty"><p>Knjižnica je prazna.</p></div>`
    }
  </div>`;
}

/* ── settings view ─────────────────────────────────────────────────────── */

function settingsView() {
  const st = state.status ?? {};
  const cats = state.categories ?? {};
  return `
  <div class="view">
    <div class="view__head"><h1>Nastavitve</h1></div>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr))">
      <section class="card" style="display:grid;gap:.7rem">
        <h2>Kategorije</h2>
        <p class="small muted">Pod katero oznako se vsebina izpiše na seznamu. Nove nastanejo tudi kar v urejevalniku.</p>
        ${Object.values(COLLECTIONS)
          .map(
            (c) => `
        <div class="field">
          <span class="field__label">${esc(c.label)}</span>
          <div class="catlist" data-cats="${c.key}">
            ${(cats[c.key] ?? []).map((k, i) => `<div class="catrow"><span>${esc(k)}</span><button class="btn btn--xs" type="button" data-cat-up="${c.key}:${i}">↑</button><button class="btn btn--xs btn--danger" type="button" data-cat-del="${c.key}:${i}">✕</button></div>`).join('')}
          </div>
          <div class="inline"><input class="input input--sm" placeholder="Nova kategorija" data-cat-new="${c.key}" style="flex:1"><button class="btn btn--sm" type="button" data-cat-add="${c.key}">Dodaj</button></div>
        </div>`
          )
          .join('')}
        <div><button class="btn btn--primary btn--sm" type="button" data-action="save-categories">Shrani kategorije</button></div>
      </section>
      <section class="card" style="display:grid;gap:.6rem">
        <h2>Shramba in objava</h2>
        <p class="small">${st.mode === 'github' ? `Vsaka sprememba je zapis v <span class="mono">${esc(st.repo)}</span> na veji <span class="mono">${esc(st.branch)}</span>, mapa <span class="mono">${esc(st.root)}</span>. Vercel iz nje zgradi spletno stran.` : `Lokalni način: datoteke v <span class="mono">${esc(st.root ?? '')}</span>. Za splet jih je treba potrditi v git in potisniti.`}</p>
        ${st.url ? `<p class="small"><a href="${esc(st.url)}" target="_blank" rel="noopener">Odpri mapo z vsebino na GitHubu</a></p>` : ''}
        <h2>Analitika</h2>
        <p class="small">${st.analytics?.configured ? `Shranjuje se (${esc(st.analytics.mode === 'upstash' ? 'Upstash Redis' : 'lokalna datoteka')}).` : 'Ni vklopljena. V Vercelu dodajte UPSTASH_REDIS_REST_URL in UPSTASH_REDIS_REST_TOKEN (glejte IH.md).'} Obiskovalci jo dovolijo v pasici s piškotki; brez dovoljenja se ne šteje nič.</p>
        <h2>Geslo</h2>
        <p class="small">Eno geslo za vse, ki urejajo. Novo naredite z <span class="mono">npm run admin:password</span> in vrstici vpišite v Vercel (Settings → Environment Variables). Prijava velja 12 ur; po osmih napačnih poskusih je naslov 15 minut zaklenjen.</p>
        <div><button class="btn btn--sm" type="button" data-action="logout">Odjava</button></div>
      </section>
    </div>
  </div>`;
}

/* ── editor: state and document ────────────────────────────────────────── */

function blankItem(c) {
  return {
    collection: c.key,
    slug: '',
    parent: '',
    status: 'draft',
    title: '',
    kicker: '',
    summary: '',
    date: today(),
    format: 'html',
    body: '',
    picture: null,
    cta: null,
    seo: { metaTitle: '', metaDescription: '', keywords: [], ogTitle: '', ogDescription: '', ogImage: '', canonical: '', noindex: false, nofollow: false, schemaType: 'auto', faq: [] },
    links: [],
    ...(c.event ? { event: { dateLabel: '', time: '', mode: '', place: '' } } : {}),
  };
}

const backupKey = (c, slug) => `ih:${c}:${slug || 'novo'}`;

function itemHref(item) {
  const c = COLLECTIONS[item.collection];
  const chain = [];
  let cur = item;
  const seen = new Set();
  while (cur && !seen.has(cur.slug)) {
    seen.add(cur.slug);
    chain.unshift(cur.slug || '…');
    cur = cur.parent ? state.items.find((x) => x.collection === item.collection && x.slug === cur.parent) : null;
  }
  return `${c.base}${chain.join('/')}/`;
}

function parentOptions(item) {
  const c = item.collection;
  const blocked = new Set([item.slug]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const it of state.items) {
      if (it.collection === c && it.parent && blocked.has(it.parent) && !blocked.has(it.slug)) {
        blocked.add(it.slug);
        grew = true;
      }
    }
  }
  return state.items.filter((it) => it.collection === c && !blocked.has(it.slug)).sort((a, b) => a.title.localeCompare(b.title));
}

async function openEditor(c, slug) {
  const isNew = !slug;
  if (state.ed?.editor) state.ed.editor.destroy();
  state.ed = { collection: c, isNew, originalSlug: slug ?? '', originalCollection: c.key, slugTouched: !isNew, problems: [], errors: [], item: blankItem(c), original: null, editor: null, isLive: false };
  state.drawer.collection = c.key;
  app.innerHTML = shell('<div class="boot">Nalagam …</div>', { view: 'editor' });
  try {
    await Promise.all([loadLists(), loadCategories(), loadStatus()]);
    if (!isNew) {
      const r = await api(`/items/${c.key}/${encodeURIComponent(slug)}`);
      const blank = blankItem(c);
      state.ed.item = { ...blank, ...r.item, seo: { ...blank.seo, ...r.item.seo } };
      state.ed.original = r.item;
      state.ed.problems = r.problems ?? [];
      state.ed.isLive = r.item.status === 'published';
    }
    loadAnalytics(30).catch(() => {});
  } catch (err) {
    if (err.status === 401) return;
    app.innerHTML = shell(`<div class="view"><div class="empty"><p>${esc(err.message)}</p><a class="btn" href="#/">Nazaj</a></div></div>`, { view: 'editor' });
    return;
  }
  try {
    const raw = localStorage.getItem(backupKey(c.key, state.ed.originalSlug));
    if (raw) {
      const b = JSON.parse(raw);
      const savedAt = state.ed.original?.updatedAt ? new Date(state.ed.original.updatedAt).getTime() : 0;
      if (b.at > savedAt + 2000 && JSON.stringify(b.item) !== JSON.stringify(state.ed.item)) {
        if (confirm('Našel sem neshranjene spremembe iz prejšnjega urejanja. Jih obnovim?')) {
          state.ed.item = { ...state.ed.item, ...b.item };
          state.ed.slugTouched = true;
        } else localStorage.removeItem(backupKey(c.key, state.ed.originalSlug));
      }
    }
  } catch {}
  mountEditor();
}

function docView() {
  const ed = state.ed;
  const it = ed.item;
  const c = COLLECTIONS[it.collection];
  const live = it.status === 'published';
  const cats = state.categories?.[it.collection] ?? [];
  const colors = [
    ['ink', 'Črna', '#17181c'], ['muted', 'Siva', '#6f7178'], ['blue', 'Modra', '#1d77fe'],
    ['green', 'Zelena', '#166534'], ['orange', 'Oranžna', '#9a5b00'], ['red', 'Rdeča', '#991b1b'],
  ];
  return `
  <div class="top">
    <button class="btn btn--sm btn--ghost btn--icon" type="button" data-action="drawer" aria-label="Vsebina" title="Vsebina">${ICON.list}</button>
    <div class="top__crumbs"><span>${esc(c.label)}</span><span>›</span><b data-top-title>${esc(it.title || (ed.isNew ? c.newLabel : c.singular))}</b><span class="pill ${live ? 'pill--live' : 'pill--draft'}" data-top-pill>${live ? 'Objavljeno' : 'Osnutek'}</span></div>
    <div class="top__actions">
      <button class="btn btn--sm" type="button" data-action="preview">Predogled</button>
      <button class="btn btn--sm${live ? ' btn--primary' : ''}" type="button" data-action="save">${live ? 'Shrani' : 'Shrani osnutek'}</button>
      ${!live ? `<button class="btn btn--sm btn--primary" type="button" data-action="publish">Objavi</button>` : ''}
      <button class="btn btn--sm btn--ghost top__panel-toggle" type="button" data-action="panel">Stran ▸</button>
    </div>
  </div>
  <div class="form">
    ${ed.errors.length ? `<div class="note note--bad"><b>Ni mogoče shraniti.</b><ul>${ed.errors.map((e) => `<li>${esc(e)}</li>`).join('')}</ul></div>` : ''}
    ${ed.problems.length ? `<div class="note note--warn"><b>Pred objavo uredite.</b><ul>${ed.problems.map((e) => `<li>${esc(e)}</li>`).join('')}</ul></div>` : ''}

    <section class="card section">
      <div class="field">
        <label for="d-title">Naslov</label>
        <input class="input input--title" id="d-title" data-doc="title" value="${esc(it.title)}" placeholder="${esc(c.singular)}" autocomplete="off">
      </div>
      <div class="field">
        <label for="d-summary">Kratek povzetek <span class="counter" data-counter="summary"></span></label>
        <textarea class="input" id="d-summary" data-doc="summary" rows="3" placeholder="Ena ali dve povedi. Prikaže se na seznamu in pod naslovom.">${esc(it.summary)}</textarea>
        <p class="field__help">Napišite tako, da razume vsak: kaj je in zakaj je pomembno.</p>
      </div>
      <div class="row2">
        <div class="field">
          <label for="d-cat">Kategorija</label>
          <select class="input" id="d-cat" data-doc="kicker">
            <option value="">Brez (privzeto: ${esc(c.singular)})</option>
            ${cats.map((k) => `<option value="${esc(k)}" ${k === it.kicker ? 'selected' : ''}>${esc(k)}</option>`).join('')}
            ${it.kicker && !cats.includes(it.kicker) ? `<option value="${esc(it.kicker)}" selected>${esc(it.kicker)}</option>` : ''}
            <option value="__new">+ Nova kategorija …</option>
          </select>
        </div>
        <div class="field">
          <label for="d-date">${c.event ? 'Datum dogodka' : 'Datum'}</label>
          <input class="input" id="d-date" type="date" data-doc="date" value="${esc(it.date)}">
        </div>
      </div>
    </section>

    <section class="card section">
      <div class="section__head"><h2>Besedilo</h2><span class="section__hint">Označite besedilo in nad njim se pokaže še vrstica za barvo in poravnavo. Ob robu bloka so puščice za premik.</span></div>
      <div class="tools" role="toolbar" aria-label="Oblikovanje" data-tools>
        <button type="button" data-tool="block:h2">Naslov</button>
        <button type="button" data-tool="block:h3">Podnaslov</button>
        <button type="button" data-tool="block:p">Odstavek</button>
        <span class="tools__sep"></span>
        <button type="button" data-tool="cmd:bold" title="Krepko"><b>K</b></button>
        <button type="button" data-tool="cmd:italic" title="Ležeče"><i>L</i></button>
        <button type="button" data-tool="cmd:underline" title="Podčrtano"><u>P</u></button>
        <button type="button" data-tool="cmd:strikeThrough" title="Prečrtano"><s>S</s></button>
        <span class="tools__sep"></span>
        ${colors.map(([k, l, hex]) => `<button type="button" data-tool="color:${k}" title="${l}"><span class="sw" style="background:${hex}"></span></button>`).join('')}
        <button type="button" data-tool="color:none" title="Brez barve">∅</button>
        <button type="button" data-tool="hl">Poudari</button>
        <span class="tools__sep"></span>
        <button type="button" data-tool="cmd:insertUnorderedList">• Seznam</button>
        <button type="button" data-tool="cmd:insertOrderedList">1. Seznam</button>
        <button type="button" data-tool="block:blockquote">Citat</button>
        <button type="button" data-tool="link">Povezava</button>
        <button type="button" data-tool="image">Slika v besedilu</button>
        <span class="tools__sep"></span>
        <button type="button" data-tool="align:left" title="Levo">⇤</button>
        <button type="button" data-tool="align:center" title="Sredina">↔</button>
        <button type="button" data-tool="align:right" title="Desno">⇥</button>
        <button type="button" data-tool="clear" title="Počisti oblikovanje">Počisti</button>
      </div>
      <div class="doc__body rte" data-body></div>
      <div class="doc__add">
        ${[
          ['p', 'Odstavek'], ['h2', 'Naslov'], ['quote', 'Citat'], ['ul', 'Seznam'], ['ol', 'Koraki'], ['image', 'Slika'],
          ['callout', 'Poudarek'], ['cta', 'Gumb'], ['columns', 'Stolpca'], ['table', 'Tabela'], ['hr', 'Ločilo'], ['code', 'Koda'],
        ]
          .map(([k, l]) => `<button class="btn btn--sm btn--ghost" type="button" data-insert="${k}">+ ${l}</button>`)
          .join('')}
      </div>
    </section>

    <section class="card section">
      <div class="section__head"><h2>Slika</h2><span class="section__hint">Glavna slika strani. JPG ali PNG; pomanjša se in shrani v več velikostih.</span></div>
      <div class="doc__hero" data-hero>${heroView()}</div>
    </section>
    <input type="file" accept="image/*" class="visually-hidden" data-file="inline">
    <input type="file" accept="image/*" class="visually-hidden" data-file="main">
  </div>`;
}

function heroView() {
  const p = state.ed.item.picture;
  if (!p) return `<div class="hero-pic hero-pic--empty" data-drop="main" role="button" tabindex="0"><span>Povlecite sliko sem ali jo izberite</span><span class="btn btn--sm">Izberi sliko</span></div>`;
  return `
    <div class="hero-pic" data-drop="main">
      <img src="${esc(p.src)}${p.upload ? '-1600.jpg' : '.jpg'}" alt="">
      <div class="hero-pic__bar">
        <button class="btn btn--xs" type="button" data-action="main-edit">Uredi</button>
        <button class="btn btn--xs" type="button" data-action="main-replace">Zamenjaj</button>
        <button class="btn btn--xs" type="button" data-action="main-library">Iz knjižnice</button>
        <button class="btn btn--xs btn--danger" type="button" data-action="main-remove">Odstrani</button>
      </div>
    </div>
    <div class="hero-cap">
      <input data-pic="alt" value="${esc(p.alt)}" placeholder="Opis slike: kaj je na njej, v eni povedi (obvezno pred objavo)">
      <input data-pic="caption" value="${esc(p.caption ?? '')}" placeholder="Podnapis pod sliko (neobvezno)">
    </div>`;
}

/* ── editor: the panel ─────────────────────────────────────────────────── */

function panelView() {
  const ed = state.ed;
  const it = ed.item;
  const c = COLLECTIONS[it.collection];
  const live = it.status === 'published';
  const href = itemHref(it);
  const cats = state.categories?.[it.collection] ?? [];
  const parents = parentOptions(it);
  const a = state.analytics;
  let pageViews = null;
  if (a && a.configured && !ed.isNew) {
    const path = itemHref({ ...it, slug: ed.originalSlug });
    pageViews = { total: a.pages.find((p) => p.key === path)?.views ?? 0, series: a.days.map((d) => d.pages[path] ?? 0) };
  }
  const sec = (key, title, body, open = true) => `<details class="sec" ${open ? 'open' : ''} data-sec="${key}"><summary>${esc(title)}</summary><div class="sec__body">${body}</div></details>`;

  const publish = `
    <div class="actions">
      <button class="btn btn--sm${live ? ' btn--primary' : ''}" type="button" data-action="save">${live ? 'Shrani spremembe' : 'Shrani osnutek'}</button>
      ${live ? `<button class="btn btn--sm" type="button" data-action="unpublish">Umakni</button>` : `<button class="btn btn--sm btn--primary" type="button" data-action="publish">Objavi</button>`}
      <button class="btn btn--sm" type="button" data-action="preview">Predogled</button>
      ${!ed.isNew ? `<button class="btn btn--sm btn--ghost btn--danger" type="button" data-action="delete">Izbriši</button>` : ''}
    </div>
    <div class="status-line">
      <span>Naslov strani: <a href="${esc(href)}" target="_blank" rel="noopener" data-href-preview>${esc(SITE + href)}</a></span>
      ${ed.original?.updatedAt ? `<span>Urejeno ${esc(ago(ed.original.updatedAt))}${ed.original.publishedAt ? ` · prvič objavljeno ${esc(ago(ed.original.publishedAt))}` : ''}</span>` : ''}
    </div>
    <div class="row2">
      <div class="field"><label for="f-date">${c.event ? 'Datum dogodka' : 'Datum'}</label><input class="input input--sm" id="f-date" type="date" data-field="date" value="${esc(it.date)}"></div>
      <div class="field"><label for="f-slug">Naslov URL</label><input class="input input--sm mono" id="f-slug" data-field="slug" value="${esc(it.slug)}" placeholder="iz-naslova"></div>
    </div>
    ${live ? `<p class="sec__hint">Stran je objavljena. Če spremenite naslov URL, stari naslov preneha delovati.</p>` : ''}`;

  const where = `
    <div class="field">
      <label for="f-coll">Rubrika na spletni strani</label>
      <select class="input input--sm" id="f-coll" data-field="collection">
        ${Object.values(COLLECTIONS).map((x) => `<option value="${x.key}" ${x.key === it.collection ? 'selected' : ''}>${esc(x.label)} (${esc(x.base)})</option>`).join('')}
      </select>
      <p class="field__help">Kje na strani se vsebina prikaže in kakšen naslov dobi.</p>
    </div>
    <div class="field">
      <label for="f-cat">Kategorija na seznamu</label>
      <select class="input input--sm" id="f-cat" data-field="kicker">
        <option value="">Brez (privzeto: ${esc(c.singular)})</option>
        ${cats.map((k) => `<option value="${esc(k)}" ${k === it.kicker ? 'selected' : ''}>${esc(k)}</option>`).join('')}
        ${it.kicker && !cats.includes(it.kicker) ? `<option value="${esc(it.kicker)}" selected>${esc(it.kicker)}</option>` : ''}
        <option value="__new">+ Nova kategorija …</option>
      </select>
      <p class="field__help">Oznaka nad naslovom na seznamu in v podatkih za iskalnike.</p>
    </div>
    <div class="field">
      <label for="f-parent">Nadrejena stran</label>
      <select class="input input--sm" id="f-parent" data-field="parent">
        <option value="">Brez (samostojna)</option>
        ${parents.map((p) => `<option value="${esc(p.slug)}" ${p.slug === it.parent ? 'selected' : ''}>${esc(p.title)}</option>`).join('')}
      </select>
      <p class="field__help">Podstran dobi naslov pod nadrejeno in se izpiše na njej pod Podstrani.</p>
    </div>
    ${
      c.event
        ? `
    <div class="row2">
      <div class="field"><label for="f-ev-label">Termin (besedilo)</label><input class="input input--sm" id="f-ev-label" data-field="event.dateLabel" value="${esc(it.event?.dateLabel)}" placeholder="Po dogovoru"></div>
      <div class="field"><label for="f-ev-time">Trajanje</label><input class="input input--sm" id="f-ev-time" data-field="event.time" value="${esc(it.event?.time)}" placeholder="2 uri"></div>
    </div>
    <div class="row2">
      <div class="field"><label for="f-ev-mode">Način</label><input class="input input--sm" id="f-ev-mode" data-field="event.mode" value="${esc(it.event?.mode)}" list="modes" placeholder="Na daljavo"><datalist id="modes"><option value="Na daljavo"><option value="Pri vas"><option value="Na daljavo ali pri vas"><option value="Videoklic"></datalist></div>
      <div class="field"><label for="f-ev-place">Kje</label><input class="input input--sm" id="f-ev-place" data-field="event.place" value="${esc(it.event?.place)}" placeholder="Ljubljana"></div>
    </div>`
        : ''
    }
    <div class="row2">
      <div class="field"><label for="f-cta-l">Gumb pod naslovom</label><input class="input input--sm" id="f-cta-l" data-field="cta.label" value="${esc(it.cta?.label ?? '')}" placeholder="Rezervirajte posvet"></div>
      <div class="field"><label for="f-cta-h">Kam vodi</label><input class="input input--sm mono" id="f-cta-h" data-field="cta.href" value="${esc(it.cta?.href ?? '')}" placeholder="/kontakt/" list="site-pages"></div>
    </div>`;

  const pictures = `
    <div class="mainpic">
      ${it.picture ? `<img src="${esc(it.picture.src)}-800.jpg" alt="">` : '<span class="mainpic__empty">brez</span>'}
      <div style="display:grid;gap:.35rem">
        <span class="small"><b>Glavna slika</b></span>
        <div class="mainpic__a">
          <button class="btn btn--xs" type="button" data-action="main-replace">${it.picture ? 'Zamenjaj' : 'Naloži'}</button>
          ${it.picture ? `<button class="btn btn--xs" type="button" data-action="main-edit">Uredi</button><button class="btn btn--xs btn--danger" type="button" data-action="main-remove">Odstrani</button>` : ''}
        </div>
      </div>
    </div>
    <div class="drop" data-drop="lib">Povlecite slike sem ali kliknite: naložene gredo v knjižnico in v besedilo.</div>
    <input type="file" accept="image/*" multiple class="visually-hidden" data-file="lib">
    <div class="field">
      <span class="field__label">Knjižnica <span class="counter">${state.media.length}</span></span>
      <div class="lib" data-lib>
        ${state.media.slice(0, 9).map((m) => `<img src="${esc(m.src)}-800.jpg" alt="${esc(m.alt)}" title="Vstavi v besedilo" data-lib-insert="${esc(m.src)}" data-w="${m.width}" data-h="${m.height}" data-alt="${esc(m.alt)}" loading="lazy">`).join('')}
        ${state.media.length > 9 ? `<a class="btn btn--xs lib__more" href="#/slike">Vse slike (${state.media.length})</a>` : ''}
      </div>
      <p class="field__help">Klik vstavi sliko na mesto v besedilu. Klik na sliko v besedilu odpre velikost, poravnavo, opis in urejanje.</p>
    </div>`;

  const text = `
    <div class="insert">
      ${[
        ['p', '¶', 'Odstavek'], ['h2', 'H', 'Naslov'], ['h3', 'h', 'Podnaslov'], ['quote', '“', 'Citat'], ['ul', '•', 'Seznam'], ['ol', '1.', 'Koraki'],
        ['callout', '!', 'Poudarek'], ['cta', '▶', 'Gumb'], ['columns', '▥', 'Stolpca'], ['table', '▦', 'Tabela'], ['hr', '—', 'Ločilo'], ['code', '<>', 'Koda'],
      ]
        .map(([k, s, l]) => `<button class="btn" type="button" data-insert="${k}"><b>${esc(s)}</b>${esc(l)}</button>`)
        .join('')}
    </div>
    <p class="sec__hint">Označite besedilo in nad njim se pokaže vrstica: krepko, ležeče, barva, poudarek, povezava, poravnava. Ob robu bloka so puščice za premik.</p>
    <div class="field">
      <label for="f-paste">Ročno besedilo</label>
      <textarea class="input input--sm" id="f-paste" rows="3" data-paste placeholder="Prilepite ali napišite besedilo; vsak prazen presledek med vrsticami je nov odstavek."></textarea>
      <div class="inline"><button class="btn btn--xs" type="button" data-action="paste-text">Vstavi kot odstavke</button><button class="btn btn--xs" type="button" data-action="paste-html">Vstavi kot HTML</button></div>
    </div>`;

  const mt = it.seo.metaTitle || (it.title ? `${it.title} | AIS Slovenia` : '');
  const seo = `
    <div class="score"><div class="score__ring" style="--p:0" data-score><span>0</span></div><div class="small"><b>Ocena SEO</b><br><span class="muted" data-score-text>Preverjam …</span></div></div>
    <div class="check" data-check></div>
    <div class="field">
      <label for="f-mt">Meta naslov <span class="counter" data-counter="metaTitle"></span></label>
      <input class="input input--sm" id="f-mt" data-field="seo.metaTitle" value="${esc(it.seo.metaTitle)}" placeholder="${esc(mt || 'Naslov | AIS Slovenia')}">
    </div>
    <div class="field">
      <label for="f-md">Meta opis <span class="counter" data-counter="metaDescription"></span></label>
      <textarea class="input input--sm" id="f-md" rows="3" data-field="seo.metaDescription" placeholder="Kaj bralec dobi na tej strani, v 70 do 165 znakih.">${esc(it.seo.metaDescription)}</textarea>
      <p class="field__help" data-help="metaDescription"></p>
    </div>
    <div class="field">
      <span class="field__label">Tako je videti v Googlu</span>
      <div class="snippet" data-snippet></div>
    </div>
    <div class="field">
      <label for="f-kw">Ključne besede</label>
      <div class="chips" data-chips>${it.seo.keywords.map(chip).join('')}</div>
      <input class="input input--sm" id="f-kw" data-keyword-input placeholder="Vpišite in pritisnite Enter (prva je glavna)">
    </div>
    <div class="row2">
      <div class="field"><label for="f-schema">Vrsta podatkov</label><select class="input input--sm" id="f-schema" data-field="seo.schemaType">${Object.entries(SCHEMA_LABELS).map(([k, l]) => `<option value="${k}" ${it.seo.schemaType === k ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
      <div class="field"><label for="f-canon">Kanonični naslov</label><input class="input input--sm mono" id="f-canon" data-field="seo.canonical" value="${esc(it.seo.canonical)}" placeholder="samo če je original drugje"></div>
    </div>
    <div class="field"><label for="f-ogt">Naslov za deljenje (Open Graph)</label><input class="input input--sm" id="f-ogt" data-field="seo.ogTitle" value="${esc(it.seo.ogTitle)}" placeholder="privzeto meta naslov"></div>
    <div class="field"><label for="f-ogd">Opis za deljenje</label><input class="input input--sm" id="f-ogd" data-field="seo.ogDescription" value="${esc(it.seo.ogDescription)}" placeholder="privzeto meta opis"></div>
    <div class="field">
      <label for="f-og">Slika za deljenje</label>
      <div class="inline"><input class="input input--sm mono" id="f-og" data-field="seo.ogImage" value="${esc(it.seo.ogImage)}" placeholder="${it.picture ? esc(it.picture.src + '-1600.jpg') : 'privzeto glavna slika'}" style="flex:1"><button class="btn btn--xs" type="button" data-action="og-pick">Izberi</button></div>
    </div>
    <div class="inline">
      <label class="switch"><input type="checkbox" data-field="seo.noindex" ${it.seo.noindex ? 'checked' : ''}><span>Skrij pred iskalniki</span></label>
      <label class="switch"><input type="checkbox" data-field="seo.nofollow" ${it.seo.nofollow ? 'checked' : ''}><span>Ne sledi povezavam</span></label>
    </div>
    <div class="field">
      <span class="field__label">Pogosta vprašanja (na koncu strani, tudi za iskalnike)</span>
      <div class="faqrows" data-faq>${it.seo.faq.map(faqRow).join('')}</div>
      <div><button class="btn btn--xs" type="button" data-action="add-faq">Dodaj vprašanje</button></div>
    </div>`;

  const links = `
    <div class="linkrows" data-links>${it.links.map(linkRow).join('')}</div>
    <div><button class="btn btn--xs" type="button" data-action="add-link">Dodaj povezavo</button></div>
    <datalist id="site-pages">${state.pages.map((p) => `<option value="${esc(p.path)}">${esc(p.title)}${p.status === 'draft' ? ' (osnutek)' : ''}</option>`).join('')}</datalist>`;

  const analytics = pageViews
    ? `<div class="stat"><span class="stat__n">${n(pageViews.total)}</span><span class="stat__l">ogledov v 30 dneh</span></div>${sparkSvg(pageViews.series)}<a class="small" href="#/analitika">Vsa analitika</a>`
    : `<p class="sec__hint">${ed.isNew ? 'Ogledi se pokažejo, ko je stran objavljena.' : a && !a.configured ? 'Analitika še ne shranjuje (glejte Nastavitve).' : 'Nalagam …'}</p>`;

  return `
  <div class="panel__inner">
    <div class="panel__head"><h2>Stran</h2><button class="btn btn--sm btn--ghost drawer__close" type="button" data-action="panel" aria-label="Zapri">✕</button></div>
    ${sec('publish', 'Objava', publish)}
    ${sec('where', 'Kje na spletni strani', where)}
    ${sec('pictures', 'Slike', pictures)}
    ${sec('text', 'Besedilo', text, false)}
    ${sec('seo', 'Iskalniki (SEO)', seo)}
    ${sec('links', 'Povezano', links, it.links.length > 0)}
    ${sec('analytics', 'Ogledi te strani', analytics)}
  </div>`;
}

const chip = (k) => `<span class="chip">${esc(k)}<button type="button" data-remove-keyword="${esc(k)}" aria-label="Odstrani ${esc(k)}">×</button></span>`;
const faqRow = (f) => `<div class="faqrow" data-faq-row><input class="input input--sm" placeholder="Vprašanje" value="${esc(f.q)}" data-faq="q"><textarea class="input input--sm" rows="2" placeholder="Odgovor" data-faq="a">${esc(f.a)}</textarea><button type="button" class="btn btn--xs btn--danger" data-action="remove-faq">Odstrani</button></div>`;
const linkRow = (l) => `<div class="linkrow" data-link-row><input class="input input--sm" placeholder="Besedilo povezave" value="${esc(l.label)}" data-link="label"><input class="input input--sm mono" placeholder="/blog/… ali https://…" value="${esc(l.href)}" data-link="href" list="site-pages"><button type="button" class="btn btn--xs btn--danger" data-action="remove-link">Odstrani</button></div>`;

/* ── editor: mount, read, live ─────────────────────────────────────────── */

function mountEditor() {
  const ed = state.ed;
  const c = COLLECTIONS[ed.item.collection];
  state.drawer.collection = c.key;
  app.innerHTML = shell(docView(), { view: 'editor', panel: panelView() });

  const body = $('[data-body]');
  ed.editor = createEditor({
    body,
    onChange: () => {
      ed.dirty = true;
      liveSoon();
      backup();
    },
    onEditImage: (fig) => editFigure(fig),
    onReplaceImage: (fig) => replaceFigure(fig),
    onPickImage: (file) => uploadInline(file),
  });
  const it = ed.item;
  const picture = (src, alt) => `<figure class="cms-figure cms-figure--w100 cms-figure--center"><img src="${esc(src)}-1600.jpg" data-src="${esc(src)}" alt="${alt}"><figcaption></figcaption></figure>`;
  ed.editor.setHtml(it.format === 'html' ? it.body : renderMarkdown(it.body, { picture }));
  it.format = 'html';

  const work = $('.work');
  work.addEventListener('input', onDocInput);
  work.addEventListener('change', (e) => {
    if (e.target.matches('[data-doc]')) onDocInput(e);
  });
  const tools = $('[data-tools]');
  tools.addEventListener('mousedown', (e) => {
    if (e.target.closest('button')) e.preventDefault();
  });
  tools.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tool]');
    if (!b) return;
    const [kind, val] = b.dataset.tool.split(':');
    const E = ed.editor;
    if (kind === 'image') return $('[data-file="inline"]').click();
    if (!E.currentBlock()) E.focus();
    if (kind === 'cmd') E.exec(val);
    else if (kind === 'block') (E.currentBlock() ? E.setBlock(val) : E.insertBlock(val === 'blockquote' ? 'quote' : val));
    else if (kind === 'color') E.setColor(val);
    else if (kind === 'hl') E.toggleHighlight();
    else if (kind === 'link') E.makeLink();
    else if (kind === 'align') E.setAlign(val);
    else if (kind === 'clear') E.clearFormat();
  });
  $('[data-panel]')?.addEventListener('input', onPanelInput);
  $('[data-panel]')?.addEventListener('change', onPanelChange);
  bindPanelExtras();
  bindHero();
  refreshLive();
  if (ed.isNew) $('#d-title')?.focus();
  document.addEventListener('keydown', editorKeys);
}

function onDocInput(e) {
  const ed = state.ed;
  const t = e.target;
  if (t.matches('[data-doc]')) {
    const key = t.dataset.doc;
    if (key === 'kicker' && t.value === '__new') {
      const name = prompt('Ime nove kategorije:');
      t.value = ed.item.kicker;
      if (name && name.trim()) {
        const k = name.trim().slice(0, 40);
        (state.categories[ed.item.collection] ??= []).push(k);
        ed.item.kicker = k;
        syncDocFields();
        remountPanel();
      }
      return;
    }
    ed.item[key] = key === 'title' || key === 'summary' ? t.value.replace(/\s+/g, ' ').trim() : t.value;
    if (key === 'title' && !ed.slugTouched) {
      ed.item.slug = slugify(ed.item.title);
      const sl = $('#f-slug');
      if (sl) sl.value = ed.item.slug;
    }
    if (key === 'date' || key === 'kicker') {
      const twin = $(key === 'date' ? '#f-date' : '#f-cat');
      if (twin) twin.value = ed.item[key];
    }
    ed.dirty = true;
    liveSoon();
    backup();
  } else if (t.matches('[data-pic]') && ed.item.picture) {
    ed.item.picture[t.dataset.pic] = t.value.trim();
    ed.dirty = true;
    liveSoon();
    backup();
  }
}

/* the category and the date live in the form and in the panel: keep both current */
function syncDocFields() {
  const it = state.ed?.item;
  if (!it) return;
  for (const [sel, key] of [['#d-date', 'date'], ['#d-cat', 'kicker'], ['#f-date', 'date'], ['#f-cat', 'kicker']]) {
    const el = $(sel);
    if (el && document.activeElement !== el) {
      if (el.tagName === 'SELECT' && ![...el.options].some((o) => o.value === it[key])) {
        const o = document.createElement('option');
        o.value = it[key];
        o.textContent = it[key];
        el.insertBefore(o, el.lastElementChild);
      }
      el.value = it[key];
    }
  }
}

function onPanelInput(e) {
  const t = e.target;
  if (t.matches('#f-slug')) state.ed.slugTouched = true;
  if (t.matches('[data-field]') && t.tagName !== 'SELECT') readPanel();
  if (t.matches('[data-faq], [data-link]')) readPanel();
  liveSoon();
  backup();
}

function onPanelChange(e) {
  const t = e.target;
  const ed = state.ed;
  if (t.matches('#f-cat')) {
    if (t.value === '__new') {
      const name = prompt('Ime nove kategorije:');
      t.value = ed.item.kicker;
      if (name && name.trim()) {
        const k = name.trim().slice(0, 40);
        (state.categories[ed.item.collection] ??= []).push(k);
        ed.item.kicker = k;
        remountPanel();
      }
      return;
    }
  }
  if (t.matches('#f-coll')) {
    const key = t.value;
    if (key === ed.item.collection) return;
    if (ed.isLive && !confirm(`Stran je objavljena. Če jo premaknete v ${COLLECTIONS[key].label}, se njen naslov spremeni in stari neha delovati. Nadaljujem?`)) {
      t.value = ed.item.collection;
      return;
    }
    ed.item.collection = key;
    ed.item.parent = '';
    ed.item.event = COLLECTIONS[key].event ? ed.item.event ?? { dateLabel: '', time: '', mode: '', place: '' } : undefined;
    ed.collection = COLLECTIONS[key];
    state.drawer.collection = key;
    refreshDrawer();
    remountPanel();
    $('.top__crumbs > span:first-child').textContent = COLLECTIONS[key].label;
    return;
  }
  if (t.matches('[data-field]')) readPanel();
  syncDocFields();
  liveSoon();
  backup();
}

function remountPanel() {
  const panel = $('[data-panel]');
  if (!panel) return;
  const open = $$('.sec', panel).filter((s) => s.open).map((s) => s.dataset.sec);
  panel.innerHTML = panelView();
  for (const s of $$('.sec', panel)) s.open = open.includes(s.dataset.sec);
  bindPanelExtras();
  refreshLive();
}

function readPanel() {
  const ed = state.ed;
  const it = ed.item;
  for (const el of $$('[data-field]', $('[data-panel]') ?? document)) {
    const path = el.dataset.field.split('.');
    const value = el.type === 'checkbox' ? el.checked : el.value;
    if (path[0] === 'collection') continue;
    if (path[0] === 'cta') {
      it.cta ??= { label: '', href: '' };
      it.cta[path[1]] = value.trim();
      if (!it.cta.label && !it.cta.href) it.cta = null;
      continue;
    }
    if (path[0] === 'event') {
      it.event ??= { dateLabel: '', time: '', mode: '', place: '' };
      it.event[path[1]] = value;
      continue;
    }
    let target = it;
    for (let i = 0; i < path.length - 1; i++) target = target[path[i]];
    target[path.at(-1)] = typeof value === 'string' ? (path.at(-1) === 'slug' ? slugify(value) : value) : value;
  }
  it.links = $$('[data-link-row]').map((row) => ({ label: $('[data-link="label"]', row).value.trim(), href: $('[data-link="href"]', row).value.trim() })).filter((l) => l.label || l.href);
  it.seo.faq = $$('[data-faq-row]').map((row) => ({ q: $('[data-faq="q"]', row).value.trim(), a: $('[data-faq="a"]', row).value.trim() })).filter((f) => f.q || f.a);
}

function collectItem() {
  const ed = state.ed;
  readPanel();
  const it = { ...ed.item, seo: { ...ed.item.seo } };
  it.format = 'html';
  it.body = ed.editor ? ed.editor.getHtml() : it.body;
  if (!it.slug) it.slug = slugify(it.title);
  return it;
}

const liveSoon = debounce(refreshLive, 150);

function refreshLive() {
  const ed = state.ed;
  if (!ed) return;
  const it = ed.item;
  const c = COLLECTIONS[it.collection];
  const set = (sel, text, cls) => {
    const el = $(sel);
    if (!el) return;
    el.textContent = text;
    if (cls !== undefined) el.className = el.className.replace(/\s?is-(warn|bad|good)/g, '') + (cls ? ` ${cls}` : '');
  };
  set('[data-top-title]', it.title || (ed.isNew ? c.newLabel : c.singular));
  set('[data-counter="summary"]', `${it.summary.length} / ${LIMITS.summaryMax}`, it.summary.length > LIMITS.summaryMax ? 'is-bad' : '');
  const mt = it.seo.metaTitle || (it.title ? `${it.title} | AIS Slovenia` : '');
  set('[data-counter="metaTitle"]', `${mt.length} / ${LIMITS.titleMax}`, mt.length > LIMITS.titleMax ? 'is-warn' : '');
  const md = it.seo.metaDescription || it.summary;
  const L = md.length;
  set('[data-counter="metaDescription"]', `${L} / ${LIMITS.descMax}`, L > LIMITS.descMax ? 'is-bad' : L && L < LIMITS.descMin ? 'is-warn' : L ? 'is-good' : '');
  set('[data-help="metaDescription"]', !L ? 'Prazno: uporabi se povzetek.' : L > LIMITS.descMax ? 'Predolgo, iskalnik ga bo odrezal.' : L < LIMITS.descMin ? 'Kratko. Dodajte, kaj bralec dobi.' : 'Dobra dolžina.', !L ? '' : L > LIMITS.descMax ? 'is-bad' : L < LIMITS.descMin ? 'is-warn' : 'is-good');
  const href = itemHref(it);
  const a = $('[data-href-preview]');
  if (a) {
    a.textContent = SITE + href;
    a.href = href;
  }
  const snip = $('[data-snippet]');
  if (snip) {
    snip.innerHTML = `<div class="snippet__url">ais-slovenia.si<span> › ${esc(href.split('/').filter(Boolean).join(' › '))}</span></div><div class="snippet__title">${esc(mt.length > 62 ? mt.slice(0, 60) + '…' : mt || 'Naslov strani')}</div><div class="snippet__desc">${esc(md.length > 165 ? md.slice(0, 162) + '…' : md || 'Meta opis se prikaže tukaj.')}</div>`;
  }
  renderChecklist();
}

function renderChecklist() {
  const ed = state.ed;
  const it = ed.item;
  const c = COLLECTIONS[it.collection];
  const el = $('[data-check]');
  if (!el || !ed.editor) return;
  const html = ed.editor.getHtml();
  const text = htmlToText(html);
  const words = wordCount(text);
  const kw = (it.seo.keywords[0] ?? '').toLowerCase();
  const mt = (it.seo.metaTitle || `${it.title} | AIS Slovenia`).toLowerCase();
  const md = it.seo.metaDescription || it.summary;
  const firstPara = htmlToText(html.match(/<p[^>]*>[\s\S]*?<\/p>/)?.[0] ?? '').toLowerCase();
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const rows = [
    ['Naslov', it.title.length >= 10 ? 'ok' : 'bad', it.title.length >= 10 ? `${it.title.length} znakov` : 'Napišite naslov (vsaj 10 znakov).'],
    ['Meta naslov', mt.length && mt.length <= 60 ? 'ok' : 'warn', `${mt.length} znakov (do 60).`],
    ['Meta opis', md.length >= 70 && md.length <= 165 ? 'ok' : md.length ? 'warn' : 'bad', md.length ? `${md.length} znakov (70 do 165).` : 'Manjka.'],
    ['Povzetek', it.summary ? 'ok' : 'bad', it.summary ? 'Izpolnjen.' : 'Manjka; prikaže se na seznamu.'],
    ['Dolžina besedila', words >= c.words ? 'ok' : words ? 'warn' : 'bad', `${words} besed (priporočeno vsaj ${c.words}).`],
    ['Podnaslovi', /<h2/.test(html) ? 'ok' : words > 120 ? 'warn' : 'ok', /<h2/.test(html) ? 'Besedilo ima naslove.' : 'Daljše besedilo razdelite z naslovi.'],
    ['Glavna slika', it.picture ? (it.picture.alt ? 'ok' : 'bad') : 'warn', it.picture ? (it.picture.alt ? 'Z opisom.' : 'Manjka opis slike.') : 'Brez glavne slike.'],
    ['Slike v besedilu', imgs.every((i) => /\balt="[^"]+"/.test(i)) ? 'ok' : 'bad', imgs.length ? (imgs.every((i) => /\balt="[^"]+"/.test(i)) ? `${imgs.length} z opisom.` : 'Nekatere so brez opisa.') : 'Ni slik v besedilu.'],
    ['Notranja povezava', /href="\/(?!uploads)/.test(html) || it.links.some((l) => l.href.startsWith('/')) ? 'ok' : 'warn', 'Vsaj ena povezava na drugo stran spletišča.'],
  ];
  if (kw) {
    rows.push(
      ['Ključna beseda v naslovu', mt.includes(kw) ? 'ok' : 'warn', kw],
      ['Ključna beseda v URL', itemHref(it).includes(slugify(kw)) ? 'ok' : 'warn', slugify(kw)],
      ['Ključna beseda v prvem odstavku', firstPara.includes(kw) ? 'ok' : 'warn', 'Omenite jo zgodaj.']
    );
  } else rows.push(['Ključna beseda', 'warn', 'Dodajte vsaj eno ključno besedo.']);
  const ok = rows.filter((r) => r[1] === 'ok').length;
  const pct = Math.round((ok / rows.length) * 100);
  el.innerHTML = rows.map(([l, s, d]) => `<div class="check__row is-${s}"><i>${s === 'ok' ? '✓' : s === 'warn' ? '!' : '×'}</i><span><b>${esc(l)}.</b> ${esc(d)}</span></div>`).join('');
  const ring = $('[data-score]');
  if (ring) {
    ring.style.setProperty('--p', pct);
    ring.querySelector('span').textContent = pct;
  }
  const st = $('[data-score-text]');
  if (st) st.textContent = pct >= 85 ? 'Zelo dobro.' : pct >= 60 ? 'Dobro, nekaj stvari lahko izboljšate.' : 'Uredite označene točke.';
}

const backup = debounce(() => {
  const ed = state.ed;
  if (!ed) return;
  try {
    localStorage.setItem(backupKey(ed.originalCollection, ed.originalSlug), JSON.stringify({ at: Date.now(), item: collectItem() }));
  } catch {}
}, 600);

function editorKeys(e) {
  if (!state.ed) return document.removeEventListener('keydown', editorKeys);
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    saveItem({});
  }
}

/* ── editor: panel extras (keywords, faq, links, drops) ────────────────── */

function bindPanelExtras() {
  const panel = $('[data-panel]');
  if (!panel) return;
  $('[data-keyword-input]', panel)?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const v = e.target.value.trim().replace(/,$/, '');
    const kws = state.ed.item.seo.keywords;
    if (v && !kws.includes(v) && kws.length < 12) kws.push(v);
    e.target.value = '';
    $('[data-chips]', panel).innerHTML = kws.map(chip).join('');
    liveSoon();
    backup();
  });
  const drop = $('[data-drop="lib"]', panel);
  if (drop) {
    drop.addEventListener('click', () => $('[data-file="lib"]', panel).click());
    dropZone(drop, (files) => files.forEach((f) => uploadInline(f)));
    $('[data-file="lib"]', panel).addEventListener('change', (e) => [...e.target.files].forEach((f) => uploadInline(f)));
  }
  panel.addEventListener('click', (e) => {
    const img = e.target.closest('[data-lib-insert]');
    if (img) {
      state.ed.editor.insertPicture({ src: img.dataset.libInsert, alt: img.dataset.alt, width: Number(img.dataset.w), height: Number(img.dataset.h) });
      toast('Slika vstavljena. Kliknite jo za velikost in opis.', 'good');
    }
  });
}

function bindHero() {
  const hero = $('[data-drop="main"]');
  if (!hero) return;
  dropZone(hero, (files) => files[0] && setMainPicture(files[0]));
  hero.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    if (!state.ed.item.picture) $('[data-file="main"]').click();
  });
  hero.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !state.ed.item.picture) {
      e.preventDefault();
      $('[data-file="main"]').click();
    }
  });
  $('[data-file="main"]')?.addEventListener('change', (e) => e.target.files[0] && setMainPicture(e.target.files[0]));
  $('[data-file="inline"]')?.addEventListener('change', (e) => e.target.files[0] && uploadInline(e.target.files[0]));
}

function dropZone(el, onFiles) {
  el.addEventListener('dragover', (e) => {
    e.preventDefault();
    el.classList.add('is-drop');
  });
  el.addEventListener('dragleave', () => el.classList.remove('is-drop'));
  el.addEventListener('drop', (e) => {
    e.preventDefault();
    el.classList.remove('is-drop');
    const files = [...(e.dataTransfer?.files ?? [])].filter((f) => /^image\//.test(f.type));
    if (files.length) onFiles(files);
  });
}

/* ── pictures ──────────────────────────────────────────────────────────── */

async function uploadVariants(name, variants, alt = '') {
  const r = await api('/upload', { method: 'POST', body: { name, alt, width: variants.width, height: variants.height, webp: variants.webp, files: variants.files } });
  state.media.unshift(r.media);
  return r.picture;
}

async function setMainPicture(source, { tool = true, name } = {}) {
  const ed = state.ed;
  try {
    let variants;
    if (tool) {
      const res = await openPictureTool({ source, title: 'Glavna slika', aspect: '16:10' });
      if (!res) return;
      if (res.error) throw new Error(res.error);
      variants = res.variants;
    } else variants = await quickVariants(source);
    toast('Nalagam sliko …');
    const pic = await uploadVariants(name ?? source.name ?? 'slika', variants, ed.item.picture?.alt ?? '');
    ed.item.picture = { ...pic, alt: ed.item.picture?.alt ?? '', caption: ed.item.picture?.caption ?? '' };
    ed.dirty = true;
    rerenderHero();
    remountPanel();
    toast('Glavna slika nastavljena. Dodajte opis slike.', 'good');
    $('[data-pic="alt"]')?.focus();
    backup();
  } catch (err) {
    toast(err.message, 'bad');
  }
}

function rerenderHero() {
  const hero = $('[data-hero]');
  if (!hero) return;
  hero.innerHTML = heroView();
  bindHero();
}

async function uploadInline(file) {
  try {
    const res = await openPictureTool({ source: file, title: 'Slika v besedilu' });
    if (!res) return;
    if (res.error) throw new Error(res.error);
    toast('Nalagam sliko …');
    const pic = await uploadVariants(file.name, res.variants);
    const alt = prompt('Opis slike (kaj je na njej):', '') ?? '';
    state.ed.editor.insertPicture({ ...pic, alt: alt.trim() });
    remountPanel();
    toast('Slika vstavljena.', 'good');
  } catch (err) {
    toast(err.message, 'bad');
  }
}

async function editFigure(fig) {
  const img = fig.querySelector('img');
  const base = img.dataset.src;
  try {
    const res = await openPictureTool({ source: `${base}-1600.jpg`, title: 'Uredi sliko' });
    if (!res) return;
    if (res.error) throw new Error(res.error);
    toast('Nalagam sliko …');
    const pic = await uploadVariants(`${base.split('/').pop()}-izrez`, res.variants, img.alt);
    img.src = `${pic.src}-1600.jpg`;
    img.dataset.src = pic.src;
    img.width = pic.width;
    img.height = pic.height;
    state.ed.dirty = true;
    backup();
    toast('Slika posodobljena.', 'good');
  } catch (err) {
    toast(err.message, 'bad');
  }
}

function replaceFigure(fig) {
  const input = $('[data-file="inline"]');
  input.onchange = async () => {
    const f = input.files[0];
    input.onchange = null;
    input.value = '';
    if (!f) return;
    try {
      const res = await openPictureTool({ source: f, title: 'Zamenjaj sliko' });
      if (!res) return;
      if (res.error) throw new Error(res.error);
      const pic = await uploadVariants(f.name, res.variants);
      const img = fig.querySelector('img');
      img.src = `${pic.src}-1600.jpg`;
      img.dataset.src = pic.src;
      img.width = pic.width;
      img.height = pic.height;
      state.ed.dirty = true;
      backup();
      toast('Slika zamenjana.', 'good');
    } catch (err) {
      toast(err.message, 'bad');
    }
  };
  input.click();
}

async function editMainPicture() {
  const p = state.ed.item.picture;
  if (!p) return;
  await setMainPicture(`${p.src}${p.upload ? '-1600.jpg' : '.jpg'}`, { name: `${p.src.split('/').pop()}-izrez` });
}

function pickFromLibrary(onPick) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `<div class="modal__box"><div class="modal__bar"><h2>Izberite sliko</h2><button class="btn btn--sm" type="button" data-close>Zapri</button></div><div class="modal__frame" style="padding:1rem;place-items:start stretch"><div class="media">${state.media
    .map((m) => `<div class="mitem"><img src="${esc(m.src)}-800.jpg" alt="${esc(m.alt)}" data-pick="${esc(m.src)}" data-w="${m.width}" data-h="${m.height}" data-alt="${esc(m.alt)}"><span class="mitem__n">${esc(m.name || m.src)}</span></div>`)
    .join('') || '<p class="muted">Knjižnica je prazna.</p>'}</div></div></div>`;
  document.body.append(modal);
  modal.addEventListener('click', (e) => {
    const img = e.target.closest('[data-pick]');
    if (img) {
      onPick({ src: img.dataset.pick, alt: img.dataset.alt, width: Number(img.dataset.w), height: Number(img.dataset.h), upload: true, webp: true });
      modal.remove();
    } else if (e.target.closest('[data-close]') || e.target === modal) modal.remove();
  });
}

/* ── save, publish, preview, delete ────────────────────────────────────── */

async function saveItem({ publish, unpublish } = {}) {
  const ed = state.ed;
  if (!ed) return;
  const it = collectItem();
  if (publish) it.status = 'published';
  if (unpublish) it.status = 'draft';
  if (!it.title) return toast('Naslov je obvezen.', 'bad');
  const moved = ed.originalSlug && (ed.originalSlug !== it.slug || ed.originalCollection !== it.collection);
  const from = moved ? `?from=${encodeURIComponent(ed.originalSlug)}&fromCollection=${encodeURIComponent(ed.originalCollection)}` : '';
  if (moved && ed.isLive && ed.originalSlug !== it.slug && !confirm(`Stran je objavljena na ${itemHref({ ...it, collection: ed.originalCollection, slug: ed.originalSlug })}. Res spremenim naslov? Stari bo nehal delovati.`)) return;
  $$('[data-action="save"], [data-action="publish"], [data-action="unpublish"]').forEach((b) => (b.disabled = true));
  try {
    const r = await api(`/items/${it.collection}/${encodeURIComponent(it.slug)}${from}`, { method: 'PUT', body: { item: it } });
    try { localStorage.removeItem(backupKey(ed.originalCollection, ed.originalSlug)); } catch {}
    const github = state.status?.mode === 'github';
    if (r.item.status === 'published') toast(github ? 'Objavljeno. Na spletu bo v približno dveh minutah.' : 'Objavljeno. Stran je v predogledu.', 'good');
    else toast(unpublish ? 'Umaknjeno. Stran ni več javna.' : 'Osnutek shranjen.', 'good');
    await Promise.all([loadStatus(), loadCategories()]);
    const target = `e/${r.item.collection}/${encodeURIComponent(r.item.slug)}`;
    if (location.hash.replace(/^#\/?/, '') === target) openEditor(COLLECTIONS[r.item.collection], r.item.slug);
    else go(target);
  } catch (err) {
    ed.problems = err.data?.problems ?? [];
    ed.errors = err.data?.errors ?? (err.data?.problems ? [] : [err.message]);
    toast(err.data?.problems ? 'Pred objavo je treba nekaj urediti.' : err.message, 'bad');
    const html = ed.editor.getHtml();
    ed.item.body = html;
    mountEditor();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

async function previewItem() {
  const it = collectItem();
  if (!it.slug) it.slug = 'predogled';
  let html;
  try {
    html = await api('/preview', { method: 'POST', body: { item: it }, raw: true });
  } catch (err) {
    return toast(err.message, 'bad');
  }
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal__box" role="dialog" aria-label="Predogled">
      <div class="modal__bar">
        <h2>Predogled: ${esc(it.title || 'brez naslova')}</h2>
        <button class="btn btn--sm" type="button" data-view="desktop">Računalnik</button>
        <button class="btn btn--sm" type="button" data-view="phone">Telefon</button>
        <button class="btn btn--sm btn--primary" type="button" data-close>Zapri</button>
      </div>
      <div class="modal__frame"><iframe title="Predogled strani" sandbox="allow-same-origin allow-scripts"></iframe></div>
    </div>`;
  document.body.append(modal);
  $('iframe', modal).srcdoc = html.replace('<head>', '<head><base href="/">');
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]') || e.target === modal) modal.remove();
    if (e.target.matches('[data-view="phone"]')) $('.modal__frame', modal).classList.add('is-phone');
    if (e.target.matches('[data-view="desktop"]')) $('.modal__frame', modal).classList.remove('is-phone');
  });
}

async function deleteItem() {
  const ed = state.ed;
  if (!confirm(`Res izbrišem "${ed.item.title}"? Tega ni mogoče razveljaviti. Podstrani ostanejo, a brez nadrejene.`)) return;
  try {
    await api(`/items/${ed.originalCollection}/${encodeURIComponent(ed.originalSlug)}`, { method: 'DELETE' });
    try { localStorage.removeItem(backupKey(ed.originalCollection, ed.originalSlug)); } catch {}
    toast('Izbrisano.', 'good');
    const c = ed.originalCollection;
    ed.editor?.destroy();
    state.ed = null;
    await loadLists();
    go('');
    state.drawer.collection = c;
  } catch (err) {
    toast(err.message, 'bad');
  }
}

/* ── data ──────────────────────────────────────────────────────────────── */

async function loadStatus() {
  state.status = await api('/status');
}
async function loadLists() {
  const [items, pages, media] = await Promise.all([api('/items'), api('/pages'), api('/media')]);
  state.items = items.items;
  state.pages = pages.pages;
  state.media = media.media;
  state.mediaUsage = media.usage;
}
async function loadCategories() {
  state.categories = (await api('/categories')).categories;
}

/* ── render ────────────────────────────────────────────────────────────── */

async function render() {
  const r = route();
  if (!state.authed) {
    app.innerHTML = loginView();
    $('#pw')?.focus();
    return;
  }
  if (state.ed && r.view !== 'editor') {
    state.ed.editor?.destroy();
    state.ed = null;
    document.removeEventListener('keydown', editorKeys);
  }
  state.panelOpen = false;
  try {
    if (r.view === 'editor') {
      if (state.ed && state.ed.originalSlug === (r.slug ?? '') && state.ed.originalCollection === r.c && !state.ed.isNew === Boolean(r.slug)) return;
      await openEditor(COLLECTIONS[r.c], r.slug);
      return;
    }
    if (r.view === 'home') {
      await Promise.all([loadStatus(), loadLists()]);
      app.innerHTML = shell(homeView(), { view: 'home' });
      loadAnalytics(30).then(() => {
        if (route().view === 'home') app.innerHTML = shell(homeView(), { view: 'home' });
      }).catch((err) => toast(err.message, 'bad'));
    } else if (r.view === 'analytics') {
      await loadLists();
      app.innerHTML = shell(analyticsView(), { view: 'analytics' });
      await loadAnalytics(state.analyticsDays, true);
      app.innerHTML = shell(analyticsView(), { view: 'analytics' });
    } else if (r.view === 'media') {
      await loadLists();
      app.innerHTML = shell(mediaView(), { view: 'media' });
    } else if (r.view === 'settings') {
      await Promise.all([loadStatus(), loadLists(), loadCategories()]);
      app.innerHTML = shell(settingsView(), { view: 'settings' });
    }
  } catch (err) {
    if (err.status === 401) return;
    app.innerHTML = shell(`<div class="view"><div class="empty"><p>${esc(err.message)}</p><button class="btn" type="button" data-action="reload">Poskusi znova</button></div></div>`, { view: r.view });
  }
}

/* ── events ────────────────────────────────────────────────────────────── */

document.addEventListener('submit', async (e) => {
  const form = e.target;
  if (form.dataset.form !== 'login') return;
  e.preventDefault();
  const btn = $('button[type="submit"]', form);
  btn.disabled = true;
  try {
    await api('/login', { method: 'POST', body: { password: form.password.value } });
    state.authed = true;
    state.setup = false;
    render();
  } catch (err) {
    state.setup = Boolean(err.data?.setup);
    toast(err.message, 'bad');
    btn.disabled = false;
    if (state.setup) render();
  }
});

document.addEventListener('input', (e) => {
  if (e.target.matches('[data-search]')) {
    state.drawer.query = e.target.value;
    const list = $('.dlist', $('[data-drawer]'));
    if (list) {
      const tmp = document.createElement('div');
      tmp.innerHTML = drawerView();
      list.innerHTML = tmp.querySelector('.dlist').innerHTML;
    }
  }
});

document.addEventListener('click', async (e) => {
  const t = e.target.closest('[data-action], [data-tab], [data-insert], [data-copy], [data-media-delete], [data-media-edit], [data-remove-keyword], [data-range], [data-cat-add], [data-cat-del], [data-cat-up]');
  if (!t) return;
  const ed = state.ed;

  if (t.dataset.tab) {
    state.drawer.collection = t.dataset.tab;
    refreshDrawer();
    return;
  }
  if (t.dataset.insert && ed?.editor) {
    if (t.dataset.insert === 'image') return $('[data-file="inline"]').click();
    ed.editor.insertBlock(t.dataset.insert);
    return;
  }
  if (t.dataset.range) {
    state.analyticsDays = Number(t.dataset.range);
    await loadAnalytics(state.analyticsDays, true);
    app.innerHTML = shell(analyticsView(), { view: 'analytics' });
    return;
  }
  if (t.dataset.copy !== undefined) {
    try {
      await navigator.clipboard.writeText(t.dataset.copy);
      toast('Pot kopirana.', 'good');
    } catch {
      prompt('Kopirajte pot:', t.dataset.copy);
    }
    return;
  }
  if (t.dataset.mediaEdit) {
    const src = t.dataset.mediaEdit;
    const m = state.media.find((x) => x.src === src);
    const res = await openPictureTool({ source: `${src}-1600.jpg`, title: 'Uredi sliko' });
    if (!res) return;
    if (res.error) return toast(res.error, 'bad');
    try {
      await uploadVariants(`${src.split('/').pop()}-izrez`, res.variants, m?.alt ?? '');
      toast('Nova različica slike je v knjižnici.', 'good');
      render();
    } catch (err) {
      toast(err.message, 'bad');
    }
    return;
  }
  if (t.dataset.mediaDelete) {
    if (!confirm('Res izbrišem to sliko? Vse štiri velikosti bodo odstranjene.')) return;
    try {
      await api('/media', { method: 'DELETE', body: { src: t.dataset.mediaDelete } });
      toast('Slika izbrisana.', 'good');
      render();
    } catch (err) {
      toast(err.message, 'bad');
    }
    return;
  }
  if (t.dataset.removeKeyword !== undefined && ed) {
    ed.item.seo.keywords = ed.item.seo.keywords.filter((k) => k !== t.dataset.removeKeyword);
    $('[data-chips]').innerHTML = ed.item.seo.keywords.map(chip).join('');
    liveSoon();
    backup();
    return;
  }
  if (t.dataset.catAdd) {
    const input = $(`[data-cat-new="${t.dataset.catAdd}"]`);
    const v = input.value.trim().slice(0, 40);
    if (!v) return;
    (state.categories[t.dataset.catAdd] ??= []).push(v);
    app.innerHTML = shell(settingsView(), { view: 'settings' });
    return;
  }
  if (t.dataset.catDel) {
    const [c, i] = t.dataset.catDel.split(':');
    state.categories[c].splice(Number(i), 1);
    app.innerHTML = shell(settingsView(), { view: 'settings' });
    return;
  }
  if (t.dataset.catUp) {
    const [c, i] = t.dataset.catUp.split(':');
    const idx = Number(i);
    if (idx > 0) [state.categories[c][idx - 1], state.categories[c][idx]] = [state.categories[c][idx], state.categories[c][idx - 1]];
    app.innerHTML = shell(settingsView(), { view: 'settings' });
    return;
  }

  switch (t.dataset.action) {
    case 'drawer':
      state.drawer.open = !state.drawer.open;
      $('[data-drawer]')?.classList.toggle('is-open', state.drawer.open);
      break;
    case 'panel':
      state.panelOpen = !state.panelOpen;
      $('[data-panel]')?.classList.toggle('is-open', state.panelOpen);
      break;
    case 'logout':
      await api('/logout', { method: 'POST' }).catch(() => {});
      state.authed = false;
      state.ed?.editor?.destroy();
      state.ed = null;
      render();
      break;
    case 'reload':
      render();
      break;
    case 'save':
      saveItem({});
      break;
    case 'publish':
      saveItem({ publish: true });
      break;
    case 'unpublish':
      if (confirm('Umaknem stran iz objave? Ne bo več javna, besedilo ostane kot osnutek.')) saveItem({ unpublish: true });
      break;
    case 'preview':
      previewItem();
      break;
    case 'delete':
      deleteItem();
      break;
    case 'main-replace':
      $('[data-file="main"]').click();
      break;
    case 'main-edit':
      editMainPicture();
      break;
    case 'main-library':
      pickFromLibrary((pic) => {
        ed.item.picture = { ...pic, alt: pic.alt || ed.item.picture?.alt || '', caption: ed.item.picture?.caption ?? '' };
        rerenderHero();
        remountPanel();
        backup();
      });
      break;
    case 'main-remove':
      ed.item.picture = null;
      rerenderHero();
      remountPanel();
      backup();
      break;
    case 'og-pick':
      pickFromLibrary((pic) => {
        ed.item.seo.ogImage = `${pic.src}-1600.jpg`;
        $('#f-og').value = ed.item.seo.ogImage;
        backup();
      });
      break;
    case 'paste-text': {
      const ta = $('[data-paste]');
      if (ta.value.trim()) ed.editor.insertText(ta.value);
      ta.value = '';
      break;
    }
    case 'paste-html': {
      const ta = $('[data-paste]');
      if (ta.value.trim()) ed.editor.insertHtml(ta.value);
      ta.value = '';
      break;
    }
    case 'add-faq': {
      readPanel();
      ed.item.seo.faq.push({ q: '', a: '' });
      $('[data-faq]').innerHTML = ed.item.seo.faq.map(faqRow).join('');
      $$('[data-faq-row]').at(-1)?.querySelector('input')?.focus();
      break;
    }
    case 'remove-faq':
      t.closest('[data-faq-row]').remove();
      readPanel();
      liveSoon();
      backup();
      break;
    case 'add-link': {
      readPanel();
      ed.item.links.push({ label: '', href: '' });
      $('[data-links]').innerHTML = ed.item.links.map(linkRow).join('');
      $$('[data-link-row]').at(-1)?.querySelector('input')?.focus();
      break;
    }
    case 'remove-link':
      t.closest('[data-link-row]').remove();
      readPanel();
      liveSoon();
      backup();
      break;
    case 'media-upload': {
      const input = $('[data-file="media"]');
      input.onchange = async () => {
        for (const f of input.files) {
          try {
            const v = await quickVariants(f);
            await uploadVariants(f.name, v);
            toast(`Naloženo: ${f.name}`, 'good');
          } catch (err) {
            toast(`${f.name}: ${err.message}`, 'bad');
          }
        }
        render();
      };
      input.click();
      break;
    }
    case 'save-categories':
      try {
        const r = await api('/categories', { method: 'PUT', body: { categories: state.categories } });
        state.categories = r.categories;
        toast('Kategorije shranjene.', 'good');
      } catch (err) {
        toast(err.message, 'bad');
      }
      break;
  }
});

window.addEventListener('hashchange', () => {
  state.drawer.open = false;
  render();
});
window.addEventListener('beforeunload', (e) => {
  if (!state.ed?.dirty) return;
  e.preventDefault();
  e.returnValue = '';
});

/* ── boot ──────────────────────────────────────────────────────────────── */

(async () => {
  try {
    const me = await fetch(API + '/me', { credentials: 'same-origin' }).then((r) => r.json().then((b) => ({ status: r.status, body: b })));
    state.authed = me.status === 200 && me.body.authenticated;
    state.setup = Boolean(me.body?.setup);
  } catch {
    state.authed = false;
  }
  render();
})();
