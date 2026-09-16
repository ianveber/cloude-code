/* The admin app. One file, no dependencies. Talks to /api/admin, renders
   with template strings, keeps the words plain. */

import { renderMarkdown } from './md.js';

const API = '/api/admin';
const SITE = 'https://ais-slovenia.si';
const LIMITS = { titleMax: 60, descMin: 70, descMax: 165, summaryMax: 220 };

const COLLECTIONS = {
  novice: { key: 'novice', label: 'Novice', singular: 'Novica', newLabel: 'Nova novica', base: '/novice/', article: true },
  blog: { key: 'blog', label: 'Blog', singular: 'Zapis', newLabel: 'Nov zapis', base: '/blog/', article: true },
  dogodki: { key: 'dogodki', label: 'Dogodki', singular: 'Dogodek', newLabel: 'Nov dogodek', base: '/dogodki/', event: true },
  strani: { key: 'strani', label: 'Strani', singular: 'Stran', newLabel: 'Nova stran', base: '/', page: true },
};

const app = document.getElementById('app');
const state = { authed: false, setup: false, status: null, items: [], pages: [], media: [], editor: null };

/* ── tiny helpers ──────────────────────────────────────────────────────── */

const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ENT[c]);
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function toast(message, kind = '') {
  const el = document.createElement('div');
  el.className = `toast${kind ? ` toast--${kind}` : ''}`;
  el.textContent = message;
  document.getElementById('toasts').append(el);
  setTimeout(() => el.remove(), kind === 'bad' ? 6000 : 3200);
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

const route = () => {
  const hash = location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/').filter(Boolean).map(decodeURIComponent);
  return { parts, hash };
};

const go = (hash) => {
  location.hash = hash;
};

/* ── shell ─────────────────────────────────────────────────────────────── */

function navLink(href, label, active) {
  return `<a href="#/${href}" class="${active ? 'is-active' : ''}">${esc(label)}</a>`;
}

function shell(content, current) {
  const mode = state.status?.mode === 'github' ? 'Shranjuje v GitHub' : 'Shranjuje v lokalne datoteke';
  return `
  <div class="shell">
    <aside class="topbar">
      <div class="topbar__row">
        <a class="topbar__brand" href="#/"><img src="/brand/favicon.png" alt="" width="30" height="29"> Urejanje</a>
        <span class="topbar__spacer"></span>
        <button class="btn btn--quiet btn--small" data-action="logout">Odjava</button>
      </div>
      <nav class="nav" aria-label="Razdelki">
        ${navLink('', 'Pregled', current === '')}
        ${Object.values(COLLECTIONS)
          .map((c) => navLink(c.key, c.label, current === c.key))
          .join('')}
        ${navLink('slike', 'Slike', current === 'slike')}
        ${navLink('nastavitve', 'Nastavitve', current === 'nastavitve')}
      </nav>
      <div class="topbar__foot small muted">
        <span>${esc(mode)}</span>
        <a href="/" target="_blank" rel="noopener">Odpri spletno stran</a>
      </div>
    </aside>
    <main class="main">${content}</main>
  </div>`;
}

/* ── login ─────────────────────────────────────────────────────────────── */

function loginView() {
  return `
  <div class="login">
    <form class="login__card" data-form="login">
      <div class="login__brand"><img src="/brand/favicon.png" alt="" width="44" height="42"><span>AIS Slovenia · urejanje</span></div>
      <h1>Prijava</h1>
      ${state.setup ? `<p class="problems problems--bad">Geslo še ni nastavljeno. Zaženite <span class="mono">npm run admin:password</span> in vpišite vrstici v nastavitve strežnika (glejte ADMIN.md).</p>` : ''}
      <div class="field">
        <label for="pw">Geslo</label>
        <input class="input" id="pw" name="password" type="password" autocomplete="current-password" required autofocus>
      </div>
      <button class="btn btn--primary" type="submit">Prijavi se</button>
      <p class="login__hint">Ta stran ni javna. Vsebine, ki jih tu shranite kot osnutek, na spletni strani niso vidne, dokler jih ne objavite.</p>
    </form>
  </div>`;
}

/* ── dashboard ─────────────────────────────────────────────────────────── */

function dashboardView() {
  const st = state.status ?? { counts: {} };
  const recent = [...state.items].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0, 8);
  const stat = (c) => {
    const n = st.counts?.[c.key] ?? { published: 0, draft: 0 };
    return `<a class="card stat" href="#/${c.key}"><span class="stat__n">${n.published}</span><span class="stat__l">${esc(c.label)} na strani</span><span class="stat__d">${n.draft ? `${n.draft} v osnutku` : 'brez osnutkov'}</span></a>`;
  };
  return `
  <div class="page-head">
    <h1>Pregled</h1>
    ${Object.values(COLLECTIONS)
      .map((c) => `<a class="btn btn--small" href="#/${c.key}/novo">${esc(c.newLabel)}</a>`)
      .join('')}
  </div>
  <div class="grid grid--stats">${Object.values(COLLECTIONS).map(stat).join('')}</div>
  <div class="grid grid--2" style="margin-top:1rem">
    <section class="section">
      <div class="section__head"><h2>Nazadnje urejeno</h2></div>
      ${recent.length ? `<div class="list">${recent.map(itemRow).join('')}</div>` : `<div class="empty"><p>Še ni vsebin.</p><a class="btn btn--primary" href="#/novice/novo">Napišite prvo novico</a></div>`}
    </section>
    <section class="section">
      <div class="section__head"><h2>Stanje</h2></div>
      <div class="card" style="display:grid;gap:.6rem">
        <p><b>Kam se shranjuje.</b> ${st.mode === 'github' ? `V repozitorij <span class="mono">${esc(st.repo)}</span>, veja <span class="mono">${esc(st.branch)}</span>. Vsaka objava sproži novo gradnjo spletne strani; na spletu je v približno dveh minutah.` : 'V lokalne datoteke tega računalnika. Spletna stran v predogledu se po vsakem shranjevanju znova zgradi.'}</p>
        ${st.lastCommit ? `<p><b>Zadnja sprememba.</b> ${esc(st.lastCommit.message)} <span class="muted">(${esc(ago(st.lastCommit.date))})</span>${st.lastCommit.url ? ` · <a href="${esc(st.lastCommit.url)}" target="_blank" rel="noopener">odpri</a>` : ''}</p>` : ''}
        <p><b>Slike.</b> ${st.media ?? 0} v knjižnici. <a href="#/slike">Odpri knjižnico</a></p>
        <p class="muted small">Osnutek vidite le vi. Objavljeno vidijo vsi, iskalniki in AI asistenti.</p>
      </div>
    </section>
  </div>`;
}

function itemRow(it) {
  const c = COLLECTIONS[it.collection];
  const pic = it.picture ? `<img class="row__pic" src="${esc(it.picture)}-800.${it.picture.startsWith('/uploads/') ? 'jpg' : 'webp'}" alt="" loading="lazy">` : `<span class="row__pic row__pic--empty">brez slike</span>`;
  return `
    <a class="row" href="#/${c.key}/${encodeURIComponent(it.slug)}">
      ${pic}
      <span>
        <span class="row__title">${esc(it.title || '(brez naslova)')}</span>
        <span class="row__meta"><span>${esc(c.singular)}</span><span>${esc(dateLabel(it.date))}</span>${it.parent ? `<span class="row__sub">podstran: ${esc(it.parent)}</span>` : ''}<span class="row__sub">urejeno ${esc(ago(it.updatedAt))}</span></span>
      </span>
      <span class="pill ${it.status === 'published' ? 'pill--live' : 'pill--draft'}">${it.status === 'published' ? 'Objavljeno' : 'Osnutek'}</span>
    </a>`;
}

/* ── list ──────────────────────────────────────────────────────────────── */

function listView(c, filter = 'all') {
  let items = state.items.filter((i) => i.collection === c.key);
  if (filter !== 'all') items = items.filter((i) => i.status === filter);
  items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return `
  <div class="page-head">
    <h1>${esc(c.label)}</h1>
    <a class="btn btn--primary" href="#/${c.key}/novo">${esc(c.newLabel)}</a>
    <p class="page-head__sub">${c.page ? 'Samostojne strani s svojim naslovom URL. Stran je lahko podstran druge strani.' : `Objavljeno se prikaže na <a href="${esc(c.base)}" target="_blank" rel="noopener">${esc(c.base)}</a> in dobi svojo stran.`}</p>
  </div>
  <div class="filters">
    <button class="btn btn--small ${filter === 'all' ? 'is-on' : ''}" data-filter="all">Vse</button>
    <button class="btn btn--small ${filter === 'published' ? 'is-on' : ''}" data-filter="published">Objavljeno</button>
    <button class="btn btn--small ${filter === 'draft' ? 'is-on' : ''}" data-filter="draft">Osnutki</button>
  </div>
  ${items.length ? `<div class="list">${items.map(itemRow).join('')}</div>` : `<div class="empty"><p>Tu še ni ničesar.</p><a class="btn btn--primary" href="#/${c.key}/novo">${esc(c.newLabel)}</a></div>`}`;
}

/* ── editor ────────────────────────────────────────────────────────────── */

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
    body: '',
    picture: null,
    seo: { metaTitle: '', metaDescription: '', keywords: [], ogImage: '', noindex: false },
    links: [],
    ...(c.event ? { event: { dateLabel: '', time: '', mode: '', place: '' } } : {}),
  };
}

const backupKey = (c, slug) => `ais-admin:${c}:${slug || 'novo'}`;

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
  /* descendants of this item cannot become its parent */
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

function editorView(c, item, { isNew, original }) {
  const ed = state.editor;
  const problems = ed.problems ?? [];
  const errors = ed.errors ?? [];
  const href = itemHref(item);
  const live = item.status === 'published';
  const parents = parentOptions(item);
  const pages = state.pages;

  return `
  <div class="page-head">
    <h1>${isNew ? esc(c.newLabel) : esc(item.title || c.singular)}</h1>
    <span class="pill ${live ? 'pill--live' : 'pill--draft'}">${live ? 'Objavljeno' : 'Osnutek'}</span>
    <p class="page-head__sub status-line">
      <span>Naslov strani: <a href="${esc(href)}" target="_blank" rel="noopener" data-href-preview>${esc(SITE + href)}</a></span>
      ${original?.updatedAt ? `<span>· urejeno ${esc(ago(original.updatedAt))}</span>` : ''}
      ${original?.publishedAt ? `<span>· prvič objavljeno ${esc(ago(original.publishedAt))}</span>` : ''}
    </p>
  </div>

  ${errors.length ? `<div class="problems problems--bad" style="margin-bottom:1rem"><b>Ni mogoče shraniti.</b><ul>${errors.map((e) => `<li>${esc(e)}</li>`).join('')}</ul></div>` : ''}
  ${problems.length ? `<div class="problems" style="margin-bottom:1rem"><b>Pred objavo uredite.</b><ul>${problems.map((e) => `<li>${esc(e)}</li>`).join('')}</ul></div>` : ''}

  <form class="editor" data-form="editor" novalidate>
    <div class="editor__main">
      <section class="card section">
        <div class="field">
          <label for="f-title">Naslov</label>
          <input class="input" id="f-title" data-field="title" value="${esc(item.title)}" placeholder="${esc(c.singular)}" required>
        </div>
        <div class="field">
          <label for="f-summary">Kratek povzetek <span class="counter" data-counter="summary"></span></label>
          <textarea class="input" id="f-summary" data-field="summary" rows="3" placeholder="Ena ali dve povedi. Prikaže se na seznamu in pod naslovom.">${esc(item.summary)}</textarea>
          <p class="field__help">Napišite tako, da razume vsak: kaj je in zakaj je pomembno.</p>
        </div>
        <div class="inline">
          <div class="field" style="flex:1 1 10rem">
            <label for="f-kicker">Oznaka</label>
            <input class="input" id="f-kicker" data-field="kicker" value="${esc(item.kicker)}" placeholder="${c.event ? 'Za koga' : 'npr. Stranke, Blog, Osnove'}" list="kickers">
            <datalist id="kickers"><option value="Stranke"><option value="Izdelki"><option value="Spletna stran"><option value="Osnove"><option value="Nasvet"><option value="Kako gradimo"><option value="Za vodstvo"><option value="Za ekipo"><option value="Za vse"></datalist>
          </div>
          <div class="field" style="flex:1 1 10rem">
            <label for="f-date">${c.event ? 'Datum dogodka' : 'Datum'}</label>
            <input class="input" id="f-date" type="date" data-field="date" value="${esc(item.date)}">
          </div>
        </div>
        ${
          c.event
            ? `
        <div class="inline">
          <div class="field" style="flex:1 1 10rem"><label for="f-ev-label">Termin (besedilo)</label><input class="input" id="f-ev-label" data-field="event.dateLabel" value="${esc(item.event?.dateLabel)}" placeholder="npr. Po dogovoru ali 12. 10. 2026 ob 10.00"></div>
          <div class="field" style="flex:1 1 8rem"><label for="f-ev-time">Trajanje</label><input class="input" id="f-ev-time" data-field="event.time" value="${esc(item.event?.time)}" placeholder="npr. 2 uri"></div>
        </div>
        <div class="inline">
          <div class="field" style="flex:1 1 10rem"><label for="f-ev-mode">Način</label><input class="input" id="f-ev-mode" data-field="event.mode" value="${esc(item.event?.mode)}" list="modes" placeholder="Na daljavo / Pri vas"><datalist id="modes"><option value="Na daljavo"><option value="Pri vas"><option value="Na daljavo ali pri vas"><option value="Videoklic"></datalist></div>
          <div class="field" style="flex:1 1 10rem"><label for="f-ev-place">Kje</label><input class="input" id="f-ev-place" data-field="event.place" value="${esc(item.event?.place)}" placeholder="npr. Ljubljana"></div>
        </div>`
            : ''
        }
      </section>

      <section class="card section">
        <div class="section__head"><h2>Besedilo</h2><span class="section__hint">Markdown: <kbd>#</kbd> naslov, <kbd>**krepko**</kbd>, <kbd>-</kbd> seznam</span></div>
        <div class="toolbar" role="toolbar" aria-label="Oblikovanje">
          <button type="button" class="btn" data-md="h2">Naslov</button>
          <button type="button" class="btn" data-md="h3">Podnaslov</button>
          <button type="button" class="btn" data-md="bold"><b>K</b></button>
          <button type="button" class="btn" data-md="italic"><i>L</i></button>
          <button type="button" class="btn" data-md="ul">• Seznam</button>
          <button type="button" class="btn" data-md="ol">1. Seznam</button>
          <button type="button" class="btn" data-md="quote">Citat</button>
          <button type="button" class="btn" data-md="link">Povezava</button>
          <button type="button" class="btn" data-md="image">Slika v besedilu</button>
          <button type="button" class="btn" data-md="hr">Ločilo</button>
        </div>
        <div class="mdwrap">
          <div class="field">
            <label class="visually-hidden" for="f-body">Besedilo</label>
            <textarea class="input input--body" id="f-body" data-field="body" placeholder="Začnite pisati …">${esc(item.body)}</textarea>
          </div>
          <div class="field">
            <span class="field__label">Predogled besedila</span>
            <div class="mdpreview" data-md-preview></div>
          </div>
        </div>
        <input type="file" accept="image/*" class="visually-hidden" data-file="inline">
      </section>

      <section class="card section">
        <div class="section__head"><h2>Povezano</h2><span class="section__hint">Povezave na druge strani, prikazane na koncu</span></div>
        <div class="links" data-links>${item.links.map(linkRow).join('')}</div>
        <div><button type="button" class="btn btn--small" data-action="add-link">Dodaj povezavo</button></div>
        <datalist id="site-pages">${pages.map((p) => `<option value="${esc(p.path)}">${esc(p.title)}${p.status === 'draft' ? ' (osnutek)' : ''}</option>`).join('')}</datalist>
      </section>
    </div>

    <div class="editor__side">
      <section class="card section">
        <div class="section__head"><h2>Slika</h2></div>
        <div class="pic">
          <div class="pic__frame" data-drop="main">${item.picture ? `<img src="${esc(item.picture.src)}-800.jpg" alt="">` : 'Povlecite sliko sem ali jo izberite'}</div>
          <div class="pic__actions">
            <button type="button" class="btn btn--small" data-action="pick-main">${item.picture ? 'Zamenjaj sliko' : 'Izberi sliko'}</button>
            ${item.picture ? `<button type="button" class="btn btn--small btn--danger" data-action="remove-main">Odstrani</button>` : ''}
            <input type="file" accept="image/*" class="visually-hidden" data-file="main">
          </div>
          ${
            item.picture
              ? `<div class="field"><label for="f-alt">Opis slike</label><input class="input" id="f-alt" data-field="picture.alt" value="${esc(item.picture.alt)}" placeholder="Kaj je na sliki, v eni povedi"><p class="field__help">Za bralnike zaslona in iskalnike. Obvezno pred objavo.</p></div>`
              : `<p class="field__help">JPG ali PNG. Slika se pomanjša in shrani v več velikostih.</p>`
          }
        </div>
      </section>

      <section class="card section">
        <div class="section__head"><h2>Naslov URL in mesto</h2></div>
        <div class="field">
          <label for="f-slug">Naslov URL</label>
          <input class="input mono" id="f-slug" data-field="slug" value="${esc(item.slug)}" placeholder="samodejno-iz-naslova" ${live ? 'data-locked="1"' : ''}>
          <p class="field__help">${live ? 'Stran je objavljena. Če spremenite naslov URL, stari naslov preneha delovati.' : 'Male črke, številke in vezaji. Nastane iz naslova, lahko ga popravite.'}</p>
        </div>
        <div class="field">
          <label for="f-parent">Nadrejena stran</label>
          <select class="input" id="f-parent" data-field="parent">
            <option value="">Brez (samostojna)</option>
            ${parents.map((p) => `<option value="${esc(p.slug)}" ${p.slug === item.parent ? 'selected' : ''}>${esc(p.title)}</option>`).join('')}
          </select>
          <p class="field__help">Podstran dobi naslov pod nadrejeno stranjo in se prikaže na njej pod Podstrani.</p>
        </div>
      </section>

      <section class="card section">
        <div class="section__head"><h2>Iskalniki</h2></div>
        <div class="field">
          <label for="f-mt">Meta naslov <span class="counter" data-counter="metaTitle"></span></label>
          <input class="input" id="f-mt" data-field="seo.metaTitle" value="${esc(item.seo.metaTitle)}" placeholder="${esc(item.title ? `${item.title} | AIS Slovenia` : 'Naslov | AIS Slovenia')}">
        </div>
        <div class="field">
          <label for="f-md">Meta opis <span class="counter" data-counter="metaDescription"></span></label>
          <textarea class="input" id="f-md" rows="3" data-field="seo.metaDescription" placeholder="Kaj bralec dobi na tej strani, v 70 do 165 znakih.">${esc(item.seo.metaDescription)}</textarea>
          <p class="field__help" data-help="metaDescription"></p>
        </div>
        <div class="field">
          <label for="f-kw">Ključne besede</label>
          <div class="chips" data-chips>${item.seo.keywords.map(chip).join('')}</div>
          <input class="input" id="f-kw" data-keyword-input placeholder="Vpišite in pritisnite Enter">
        </div>
        <div class="field">
          <label for="f-og">Slika za deljenje (Open Graph)</label>
          <input class="input mono" id="f-og" data-field="seo.ogImage" value="${esc(item.seo.ogImage)}" placeholder="${item.picture ? esc(item.picture.src + '-1600.jpg') : 'privzeto: glavna slika ali logotip'}">
          <p class="field__help">Prazno pomeni glavno sliko te strani.</p>
        </div>
        <label class="switch"><input type="checkbox" data-field="seo.noindex" ${item.seo.noindex ? 'checked' : ''}><span>Skrij pred iskalniki (noindex)</span></label>
        <div class="field">
          <span class="field__label">Tako je videti v Googlu</span>
          <div class="snippet" data-snippet></div>
        </div>
      </section>
    </div>
  </form>

  <div class="actionbar">
    <a class="btn btn--quiet" href="#/${c.key}">Nazaj</a>
    <span class="actionbar__spacer"></span>
    ${!isNew ? `<button class="btn btn--quiet btn--danger" data-action="delete">Izbriši</button>` : ''}
    <button class="btn" data-action="preview">Predogled</button>
    ${live ? `<button class="btn" data-action="unpublish">Umakni</button>` : ''}
    <button class="btn" data-action="save">${live ? 'Shrani spremembe' : 'Shrani osnutek'}</button>
    ${!live ? `<button class="btn btn--primary" data-action="publish">Objavi</button>` : ''}
  </div>`;
}

const chip = (k) => `<span class="chip">${esc(k)}<button type="button" data-remove-keyword="${esc(k)}" aria-label="Odstrani ${esc(k)}">×</button></span>`;
const linkRow = (l, i) => `
  <div class="links__row" data-link-row>
    <input class="input" placeholder="Besedilo povezave" value="${esc(l.label)}" data-link="label">
    <input class="input mono" placeholder="/blog/… ali https://…" value="${esc(l.href)}" data-link="href" list="site-pages">
    <button type="button" class="btn btn--small btn--danger" data-action="remove-link">Odstrani</button>
  </div>`;

/* keeps the editor's live parts (counters, snippet, preview, href) current without re-rendering the form */
function refreshLive() {
  const ed = state.editor;
  if (!ed) return;
  const it = ed.item;
  const set = (sel, text, cls) => {
    const el = $(sel);
    if (!el) return;
    el.textContent = text;
    if (cls !== undefined) el.className = el.className.replace(/\s?is-(warn|bad|good)/g, '') + (cls ? ` ${cls}` : '');
  };
  set('[data-counter="summary"]', `${it.summary.length} / ${LIMITS.summaryMax}`, it.summary.length > LIMITS.summaryMax ? 'is-bad' : '');
  const mt = it.seo.metaTitle || (it.title ? `${it.title} | AIS Slovenia` : '');
  set('[data-counter="metaTitle"]', `${mt.length} / ${LIMITS.titleMax}`, mt.length > LIMITS.titleMax ? 'is-warn' : '');
  const md = it.seo.metaDescription || it.summary;
  const n = md.length;
  set('[data-counter="metaDescription"]', `${n} / ${LIMITS.descMax}`, n > LIMITS.descMax ? 'is-bad' : n && n < LIMITS.descMin ? 'is-warn' : n ? 'is-good' : '');
  set('[data-help="metaDescription"]', !n ? 'Prazno: uporabi se povzetek.' : n > LIMITS.descMax ? 'Predolgo, iskalnik ga bo odrezal.' : n < LIMITS.descMin ? 'Kratko. Dodajte, kaj bralec dobi.' : 'Dobra dolžina.', !n ? '' : n > LIMITS.descMax ? 'is-bad' : n < LIMITS.descMin ? 'is-warn' : 'is-good');

  const href = itemHref(it);
  const a = $('[data-href-preview]');
  if (a) {
    a.textContent = SITE + href;
    a.href = href;
  }
  const snip = $('[data-snippet]');
  if (snip) {
    const crumbs = href.split('/').filter(Boolean).join(' › ');
    snip.innerHTML = `<div class="snippet__url">ais-slovenia.si<span> › ${esc(crumbs || '')}</span></div><div class="snippet__title">${esc(mt.length > 62 ? mt.slice(0, 60) + '…' : mt || 'Naslov strani')}</div><div class="snippet__desc">${esc(md.length > 165 ? md.slice(0, 162) + '…' : md || 'Meta opis se prikaže tukaj.')}</div>`;
  }
  const prev = $('[data-md-preview]');
  if (prev) prev.innerHTML = renderMarkdown(it.body, { picture: (src, alt) => `<img src="${esc(src)}-800.jpg" alt="${alt}">` }) || '<p class="muted">Tu se sproti prikazuje besedilo.</p>';
}

const backup = debounce(() => {
  const ed = state.editor;
  if (!ed) return;
  try {
    localStorage.setItem(backupKey(ed.collection.key, ed.originalSlug), JSON.stringify({ at: Date.now(), item: ed.item }));
  } catch {}
}, 400);

function readForm() {
  const ed = state.editor;
  const it = ed.item;
  for (const el of $$('[data-field]')) {
    const path = el.dataset.field.split('.');
    const value = el.type === 'checkbox' ? el.checked : el.value;
    let target = it;
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === 'picture' && !it.picture) return;
      target = target[path[i]];
    }
    target[path.at(-1)] = value;
  }
  it.links = $$('[data-link-row]').map((row) => ({ label: $('[data-link="label"]', row).value.trim(), href: $('[data-link="href"]', row).value.trim() })).filter((l) => l.label || l.href);
  if (!ed.slugTouched && !ed.isLive) {
    it.slug = slugify(it.title);
    const s = $('#f-slug');
    if (s && document.activeElement !== s) s.value = it.slug;
  }
}

async function openEditor(c, slug) {
  const isNew = !slug;
  state.editor = { collection: c, isNew, originalSlug: slug ?? '', slugTouched: false, problems: [], errors: [], item: blankItem(c), original: null };
  app.innerHTML = shell('<div class="boot">Nalagam …</div>', c.key);
  try {
    await loadLists();
    if (!isNew) {
      const r = await api(`/items/${c.key}/${encodeURIComponent(slug)}`);
      state.editor.item = { ...blankItem(c), ...r.item, seo: { ...blankItem(c).seo, ...r.item.seo } };
      state.editor.original = r.item;
      state.editor.problems = r.problems ?? [];
      state.editor.slugTouched = true;
      state.editor.isLive = r.item.status === 'published';
    }
  } catch (err) {
    if (err.status === 401) return;
    app.innerHTML = shell(`<div class="empty"><p>${esc(err.message)}</p><a class="btn" href="#/${c.key}">Nazaj</a></div>`, c.key);
    return;
  }
  /* an unsaved backup newer than the saved item? offer it */
  try {
    const raw = localStorage.getItem(backupKey(c.key, state.editor.originalSlug));
    if (raw) {
      const b = JSON.parse(raw);
      const savedAt = state.editor.original?.updatedAt ? new Date(state.editor.original.updatedAt).getTime() : 0;
      if (b.at > savedAt + 2000 && JSON.stringify(b.item) !== JSON.stringify(state.editor.item)) {
        if (confirm('Našel sem neshranjene spremembe iz prejšnjega urejanja. Jih obnovim?')) {
          state.editor.item = { ...state.editor.item, ...b.item };
          state.editor.slugTouched = true;
        } else localStorage.removeItem(backupKey(c.key, state.editor.originalSlug));
      }
    }
  } catch {}
  renderEditor();
}

function renderEditor() {
  const ed = state.editor;
  const c = ed.collection;
  app.innerHTML = shell(editorView(c, ed.item, { isNew: ed.isNew, original: ed.original }), c.key);
  refreshLive();
  const form = $('[data-form="editor"]');
  form.addEventListener('input', (e) => {
    if (e.target.matches('#f-slug')) ed.slugTouched = true;
    readForm();
    refreshLive();
    backup();
  });
  form.addEventListener('submit', (e) => e.preventDefault());
  $('#f-slug')?.addEventListener('blur', (e) => {
    e.target.value = slugify(e.target.value);
    readForm();
    refreshLive();
  });
  $('[data-keyword-input]')?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const v = e.target.value.trim().replace(/,$/, '');
    if (v && !ed.item.seo.keywords.includes(v) && ed.item.seo.keywords.length < 12) ed.item.seo.keywords.push(v);
    e.target.value = '';
    $('[data-chips]').innerHTML = ed.item.seo.keywords.map(chip).join('');
    backup();
  });
  const drop = $('[data-drop="main"]');
  if (drop) {
    drop.addEventListener('dragover', (e) => {
      e.preventDefault();
      drop.classList.add('is-drop');
    });
    drop.addEventListener('dragleave', () => drop.classList.remove('is-drop'));
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      drop.classList.remove('is-drop');
      const f = e.dataTransfer.files?.[0];
      if (f) uploadMain(f);
    });
  }
  $('[data-file="main"]').addEventListener('change', (e) => e.target.files[0] && uploadMain(e.target.files[0]));
  $('[data-file="inline"]').addEventListener('change', (e) => e.target.files[0] && uploadInline(e.target.files[0]));
  document.addEventListener('keydown', editorKeys);
}

function editorKeys(e) {
  if (!state.editor) return document.removeEventListener('keydown', editorKeys);
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    saveItem({ publish: false });
  }
}

/* ── markdown toolbar ─────────────────────────────────────────────────── */

function mdAction(kind) {
  const ta = $('#f-body');
  if (!ta) return;
  const { selectionStart: s, selectionEnd: e, value } = ta;
  const sel = value.slice(s, e);
  const lineStart = value.lastIndexOf('\n', s - 1) + 1;
  let before = '', after = '', replace = null;
  switch (kind) {
    case 'bold': before = '**'; after = '**'; break;
    case 'italic': before = '*'; after = '*'; break;
    case 'h2': replace = prefixLines(value, lineStart, e, '## '); break;
    case 'h3': replace = prefixLines(value, lineStart, e, '### '); break;
    case 'ul': replace = prefixLines(value, lineStart, e, '- '); break;
    case 'ol': replace = prefixLines(value, lineStart, e, '1. '); break;
    case 'quote': replace = prefixLines(value, lineStart, e, '> '); break;
    case 'hr': replace = { text: value.slice(0, e) + '\n\n---\n\n' + value.slice(e), pos: e + 7 }; break;
    case 'link': {
      const href = prompt('Naslov povezave (npr. /kontakt/ ali https://…):', '/');
      if (!href) return;
      before = '['; after = `](${href})`;
      if (!sel) { replace = { text: value.slice(0, s) + `[besedilo](${href})` + value.slice(e), pos: s + 1 }; }
      break;
    }
    case 'image': $('[data-file="inline"]').click(); return;
  }
  if (replace) {
    ta.value = replace.text;
    ta.setSelectionRange(replace.pos, replace.pos);
  } else {
    ta.value = value.slice(0, s) + before + (sel || 'besedilo') + after + value.slice(e);
    ta.setSelectionRange(s + before.length, s + before.length + (sel || 'besedilo').length);
  }
  ta.focus();
  ta.dispatchEvent(new Event('input', { bubbles: true }));
}

function prefixLines(value, from, to, prefix) {
  const end = value.indexOf('\n', to) === -1 ? value.length : Math.max(to, value.indexOf('\n', to));
  const block = value.slice(from, end);
  const lines = block.split('\n').map((l) => (l.startsWith(prefix) ? l.slice(prefix.length) : prefix + l));
  const text = value.slice(0, from) + lines.join('\n') + value.slice(end);
  return { text, pos: from + lines.join('\n').length };
}

/* ── pictures ──────────────────────────────────────────────────────────── */

async function processImage(file) {
  if (!/^image\//.test(file.type)) throw new Error('Izberite sliko (JPG ali PNG).');
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error('Te slike ne znam odpreti. Uporabite JPG ali PNG.');
  }
  const make = async (w, type, q) => {
    const scale = Math.min(1, w / bitmap.width);
    const cw = Math.max(1, Math.round(bitmap.width * scale));
    const ch = Math.max(1, Math.round(bitmap.height * scale));
    const c = document.createElement('canvas');
    c.width = cw;
    c.height = ch;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(bitmap, 0, 0, cw, ch);
    const blob = await new Promise((r) => c.toBlob(r, type, q));
    return { blob, w: cw, h: ch };
  };
  const j16 = await make(1600, 'image/jpeg', 0.86);
  const j8 = await make(800, 'image/jpeg', 0.84);
  const w16 = await make(1600, 'image/webp', 0.82);
  const w8 = await make(800, 'image/webp', 0.8);
  const webp = Boolean(w16.blob && w16.blob.type === 'image/webp' && w8.blob && w8.blob.type === 'image/webp');
  const b64 = async (blob) => {
    const buf = new Uint8Array(await blob.arrayBuffer());
    let s = '';
    for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
    return btoa(s);
  };
  const files = [
    { suffix: '-1600.jpg', data: await b64(j16.blob) },
    { suffix: '-800.jpg', data: await b64(j8.blob) },
  ];
  if (webp) files.push({ suffix: '-1600.webp', data: await b64(w16.blob) }, { suffix: '-800.webp', data: await b64(w8.blob) });
  return { name: file.name, width: j16.w, height: j16.h, webp, files };
}

async function uploadPicture(file, alt = '') {
  toast('Pripravljam sliko …');
  const prepared = await processImage(file);
  const r = await api('/upload', { method: 'POST', body: { ...prepared, alt } });
  return r.picture;
}

async function uploadMain(file) {
  try {
    const pic = await uploadPicture(file, state.editor.item.picture?.alt ?? '');
    state.editor.item.picture = { ...pic, alt: state.editor.item.picture?.alt ?? '' };
    toast('Slika naložena. Dodajte še opis slike.', 'good');
    renderEditor();
    $('#f-alt')?.focus();
  } catch (err) {
    toast(err.message, 'bad');
  }
}

async function uploadInline(file) {
  try {
    const pic = await uploadPicture(file);
    const ta = $('#f-body');
    const s = ta.selectionStart;
    const snippet = `\n\n![Opis slike](${pic.src} "Podnapis")\n\n`;
    ta.value = ta.value.slice(0, s) + snippet + ta.value.slice(s);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    toast('Slika vstavljena. Popravite opis in podnapis.', 'good');
  } catch (err) {
    toast(err.message, 'bad');
  }
}

/* ── save, publish, preview, delete ───────────────────────────────────── */

async function saveItem({ publish, unpublish } = {}) {
  const ed = state.editor;
  readForm();
  const it = { ...ed.item };
  if (publish) it.status = 'published';
  if (unpublish) it.status = 'draft';
  if (!it.slug) it.slug = slugify(it.title);
  if (!it.title) return toast('Naslov je obvezen.', 'bad');
  const from = ed.originalSlug && ed.originalSlug !== it.slug ? `?from=${encodeURIComponent(ed.originalSlug)}` : '';
  if (from && ed.isLive && !confirm(`Stran je objavljena na ${itemHref({ ...it, slug: ed.originalSlug })}. Res spremenim naslov URL? Stari naslov bo nehal delovati.`)) return;
  $$('.actionbar .btn').forEach((b) => (b.disabled = true));
  try {
    const r = await api(`/items/${ed.collection.key}/${encodeURIComponent(it.slug)}${from}`, { method: 'PUT', body: { item: it } });
    try { localStorage.removeItem(backupKey(ed.collection.key, ed.originalSlug)); } catch {}
    const github = state.status?.mode === 'github';
    if (r.item.status === 'published') toast(github ? 'Objavljeno. Na spletu bo v približno dveh minutah.' : 'Objavljeno. Stran je v predogledu.', 'good');
    else toast(unpublish ? 'Umaknjeno. Stran ni več javna.' : 'Osnutek shranjen.', 'good');
    await loadStatus();
    if (ed.isNew || from) go(`${ed.collection.key}/${encodeURIComponent(r.item.slug)}`);
    else openEditor(ed.collection, r.item.slug);
  } catch (err) {
    ed.problems = err.data?.problems ?? [];
    ed.errors = err.data?.errors ?? (err.data?.problems ? [] : [err.message]);
    toast(err.data?.problems ? 'Pred objavo je treba nekaj urediti.' : err.message, 'bad');
    renderEditor();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

async function previewItem() {
  readForm();
  const ed = state.editor;
  const it = { ...ed.item, slug: ed.item.slug || slugify(ed.item.title) || 'predogled' };
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
        <button class="btn btn--small" data-view="desktop">Računalnik</button>
        <button class="btn btn--small" data-view="phone">Telefon</button>
        <button class="btn btn--small btn--primary" data-close>Zapri</button>
      </div>
      <div class="modal__frame"><iframe title="Predogled strani" sandbox="allow-same-origin allow-scripts"></iframe></div>
    </div>`;
  document.body.append(modal);
  const frame = $('iframe', modal);
  frame.srcdoc = html.replace('<head>', '<head><base href="/">');
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]') || e.target === modal) modal.remove();
    if (e.target.matches('[data-view="phone"]')) $('.modal__frame', modal).classList.add('is-phone');
    if (e.target.matches('[data-view="desktop"]')) $('.modal__frame', modal).classList.remove('is-phone');
  });
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', onKey);
    }
  });
}

async function deleteItem() {
  const ed = state.editor;
  if (!confirm(`Res izbrišem "${ed.item.title}"? Tega ni mogoče razveljaviti. Podstrani ostanejo, a brez nadrejene.`)) return;
  try {
    await api(`/items/${ed.collection.key}/${encodeURIComponent(ed.originalSlug)}`, { method: 'DELETE' });
    try { localStorage.removeItem(backupKey(ed.collection.key, ed.originalSlug)); } catch {}
    toast('Izbrisano.', 'good');
    state.editor = null;
    go(ed.collection.key);
  } catch (err) {
    toast(err.message, 'bad');
  }
}

/* ── media library ─────────────────────────────────────────────────────── */

function mediaView() {
  const usage = state.mediaUsage ?? {};
  return `
  <div class="page-head">
    <h1>Slike</h1>
    <button class="btn btn--primary" data-action="media-upload">Naloži sliko</button>
    <input type="file" accept="image/*" multiple class="visually-hidden" data-file="media">
    <p class="page-head__sub">Vsaka slika je shranjena v štirih velikostih. Pot kopirajte v besedilo kot <span class="mono">![opis](pot)</span>.</p>
  </div>
  ${
    state.media.length
      ? `<div class="media">${state.media
          .map(
            (m) => `
      <div class="media__item">
        <img src="${esc(m.src)}-800.jpg" alt="${esc(m.alt)}" loading="lazy">
        <span class="media__name" title="${esc(m.src)}">${esc(m.name || m.src)}</span>
        <span class="small muted">${m.width}×${m.height} · ${Math.round((m.bytes ?? 0) / 1024)} kB${usage[m.src]?.length ? ` · v uporabi (${usage[m.src].length})` : ''}</span>
        <div class="media__actions">
          <button class="btn btn--small" data-copy="${esc(m.src)}">Kopiraj pot</button>
          <button class="btn btn--small btn--danger" data-media-delete="${esc(m.src)}" ${usage[m.src]?.length ? 'disabled title="Slika je v uporabi"' : ''}>Izbriši</button>
        </div>
      </div>`
          )
          .join('')}</div>`
      : `<div class="empty"><p>Knjižnica je prazna.</p></div>`
  }`;
}

/* ── settings ──────────────────────────────────────────────────────────── */

function settingsView() {
  const st = state.status ?? {};
  return `
  <div class="page-head"><h1>Nastavitve</h1></div>
  <div class="grid grid--2">
    <section class="card section">
      <h2>Kam se shranjuje</h2>
      ${
        st.mode === 'github'
          ? `<p>Vsaka sprememba je zapis v repozitorij <span class="mono">${esc(st.repo)}</span> na veji <span class="mono">${esc(st.branch)}</span>, v mapi <span class="mono">${esc(st.root)}</span>. Vercel iz nje zgradi spletno stran.</p>
             ${st.url ? `<p><a href="${esc(st.url)}" target="_blank" rel="noopener">Odpri mapo z vsebino na GitHubu</a></p>` : ''}`
          : `<p>Lokalni način: datoteke v mapi <span class="mono">${esc(st.root ?? '')}</span>. Spremembe je treba potrditi v git in potisniti, da pridejo na splet.</p>`
      }
      ${st.lastCommit ? `<p class="small muted">Zadnja sprememba: ${esc(st.lastCommit.message)} (${esc(ago(st.lastCommit.date))})</p>` : ''}
    </section>
    <section class="card section">
      <h2>Geslo</h2>
      <p>Geslo je eno za vse, ki urejajo. Novo naredite z ukazom <span class="mono">npm run admin:password</span> v mapi spletne strani in vrstici vpišite v nastavitve strežnika (Vercel → Settings → Environment Variables), nato ponovno zaženite gradnjo. Navodila so v <span class="mono">ADMIN.md</span>.</p>
      <p class="small muted">Prijava velja 12 ur. Po osmih napačnih poskusih je naslov za 15 minut zaklenjen.</p>
    </section>
    <section class="card section">
      <h2>Kako deluje objava</h2>
      <p><b>Osnutek</b> vidite samo tukaj (in v predogledu). <b>Objavljeno</b> se zgradi v spletno stran: dobi svojo stran, mesto na seznamu, zapis v zemljevidu strani in podatke za iskalnike ter AI asistente.</p>
      <p><b>Podstrani.</b> Pri vsaki vsebini izberete nadrejeno stran; podstran dobi naslov pod njo (npr. <span class="mono">/blog/serija/prvi-del/</span>) in se izpiše na nadrejeni strani.</p>
      <p><b>Slike.</b> Naložene slike se pomanjšajo na največ 1600 px in shranijo kot JPG in WebP v dveh velikostih.</p>
    </section>
    <section class="card section">
      <h2>Seja</h2>
      <button class="btn" data-action="logout">Odjava</button>
    </section>
  </div>`;
}

/* ── data loading ──────────────────────────────────────────────────────── */

async function loadStatus() {
  state.status = await api('/status');
}

async function loadLists() {
  const [items, pages] = await Promise.all([api('/items'), api('/pages')]);
  state.items = items.items;
  state.pages = pages.pages;
}

async function loadMedia() {
  const r = await api('/media');
  state.media = r.media;
  state.mediaUsage = r.usage;
}

/* ── render ────────────────────────────────────────────────────────────── */

async function render() {
  const { parts } = route();
  if (!state.authed) {
    app.innerHTML = loginView();
    $('#pw')?.focus();
    return;
  }
  if (state.editor && !(parts.length === 2 && COLLECTIONS[parts[0]])) {
    state.editor = null;
    document.removeEventListener('keydown', editorKeys);
  }
  try {
    if (parts.length === 0) {
      await Promise.all([loadStatus(), loadLists()]);
      app.innerHTML = shell(dashboardView(), '');
    } else if (parts[0] === 'slike') {
      await loadMedia();
      app.innerHTML = shell(mediaView(), 'slike');
    } else if (parts[0] === 'nastavitve') {
      await loadStatus();
      app.innerHTML = shell(settingsView(), 'nastavitve');
    } else if (COLLECTIONS[parts[0]] && parts.length === 1) {
      await loadLists();
      state.listFilter = 'all';
      app.innerHTML = shell(listView(COLLECTIONS[parts[0]]), parts[0]);
    } else if (COLLECTIONS[parts[0]] && parts[1] === 'novo') {
      await openEditor(COLLECTIONS[parts[0]], null);
    } else if (COLLECTIONS[parts[0]] && parts[1]) {
      await openEditor(COLLECTIONS[parts[0]], parts[1]);
    } else {
      go('');
    }
  } catch (err) {
    if (err.status === 401) return;
    app.innerHTML = shell(`<div class="empty"><p>${esc(err.message)}</p><button class="btn" data-action="reload">Poskusi znova</button></div>`, '');
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

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-action], [data-md], [data-filter], [data-copy], [data-media-delete], [data-remove-keyword]');
  if (!btn) return;
  const ed = state.editor;

  if (btn.dataset.md) return mdAction(btn.dataset.md);
  if (btn.dataset.filter) {
    const c = COLLECTIONS[route().parts[0]];
    app.innerHTML = shell(listView(c, btn.dataset.filter), c.key);
    return;
  }
  if (btn.dataset.copy) {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      toast('Pot kopirana.', 'good');
    } catch {
      prompt('Kopirajte pot:', btn.dataset.copy);
    }
    return;
  }
  if (btn.dataset.mediaDelete) {
    if (!confirm('Res izbrišem to sliko? Vse štiri velikosti bodo odstranjene.')) return;
    try {
      await api('/media', { method: 'DELETE', body: { src: btn.dataset.mediaDelete } });
      toast('Slika izbrisana.', 'good');
      render();
    } catch (err) {
      toast(err.message, 'bad');
    }
    return;
  }
  if (btn.dataset.removeKeyword !== undefined && ed) {
    ed.item.seo.keywords = ed.item.seo.keywords.filter((k) => k !== btn.dataset.removeKeyword);
    $('[data-chips]').innerHTML = ed.item.seo.keywords.map(chip).join('');
    backup();
    return;
  }

  switch (btn.dataset.action) {
    case 'logout':
      await api('/logout', { method: 'POST' }).catch(() => {});
      state.authed = false;
      state.editor = null;
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
      if (confirm('Umaknem stran iz objave? Ne bo več javna, besedilo ostane shranjeno kot osnutek.')) saveItem({ unpublish: true });
      break;
    case 'preview':
      previewItem();
      break;
    case 'delete':
      deleteItem();
      break;
    case 'pick-main':
      $('[data-file="main"]').click();
      break;
    case 'remove-main':
      ed.item.picture = null;
      renderEditor();
      break;
    case 'add-link': {
      readForm();
      ed.item.links.push({ label: '', href: '' });
      $('[data-links]').innerHTML = ed.item.links.map(linkRow).join('');
      $$('[data-link-row]').at(-1)?.querySelector('input')?.focus();
      break;
    }
    case 'remove-link': {
      btn.closest('[data-link-row]').remove();
      readForm();
      backup();
      break;
    }
    case 'media-upload': {
      const input = $('[data-file="media"]');
      input.onchange = async () => {
        for (const f of input.files) {
          try {
            await uploadPicture(f);
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
  }
});

window.addEventListener('hashchange', render);
window.addEventListener('beforeunload', (e) => {
  if (!state.editor) return;
  try {
    const raw = localStorage.getItem(backupKey(state.editor.collection.key, state.editor.originalSlug));
    if (!raw) return;
  } catch {
    return;
  }
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
