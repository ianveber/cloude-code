/* The document editor: one contenteditable area that holds the article as
   real blocks. A floating bar formats the selection (bold, italic, colour,
   highlight, link, block type, alignment, lists), a handle on the left of a
   block moves, copies or removes it, pictures sit in figures that can be
   resized by dragging their corner, and everything is cleaned before it
   leaves the editor. */

import { cleanHtml } from './clean-html.js';

const COLORS = [
  { key: 'ink', label: 'Črna', hex: '#17181c' },
  { key: 'muted', label: 'Siva', hex: '#6f7178' },
  { key: 'blue', label: 'Modra', hex: '#1d77fe' },
  { key: 'green', label: 'Zelena', hex: '#166534' },
  { key: 'orange', label: 'Oranžna', hex: '#9a5b00' },
  { key: 'red', label: 'Rdeča', hex: '#991b1b' },
];

const SIZES = [25, 33, 50, 75, 100];
const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ENT[c]);

const BLOCK_TAGS = new Set(['P', 'H2', 'H3', 'H4', 'UL', 'OL', 'BLOCKQUOTE', 'FIGURE', 'HR', 'PRE', 'TABLE', 'DIV']);

/** Markup for a picture inside the document. */
export function figureHtml(picture, { size = 100, align = 'center', caption = '' } = {}) {
  const src = esc(picture.src);
  return `<figure class="cms-figure cms-figure--w${size} cms-figure--${align}" contenteditable="false"><img src="${src}-1600.jpg" data-src="${src}" alt="${esc(
    picture.alt ?? ''
  )}" width="${picture.width ?? 1600}" height="${picture.height ?? 1000}"><figcaption contenteditable="true">${esc(caption)}</figcaption><span class="fig-grip" data-grip></span></figure>`;
}

export function createEditor({ body, onChange, onEditImage, onReplaceImage, onPickImage }) {
  let fbar = null;
  let ibar = null;
  let handle = null;
  let selectedFigure = null;
  let hoverBlock = null;
  let destroyed = false;

  body.setAttribute('contenteditable', 'true');
  body.setAttribute('spellcheck', 'true');
  body.dataset.placeholder = body.dataset.placeholder || 'Začnite pisati ali dodajte blok v stranskem meniju …';

  const emit = () => onChange && onChange();

  /* ── selection helpers ─────────────────────────────────────────────── */

  const sel = () => window.getSelection();
  const inBody = (node) => Boolean(node && body.contains(node));
  const rangeInBody = () => {
    const s = sel();
    if (!s || !s.rangeCount) return null;
    const r = s.getRangeAt(0);
    return inBody(r.commonAncestorContainer) ? r : null;
  };
  const topBlock = (node) => {
    let n = node;
    if (!n) return null;
    if (n.nodeType === 3) n = n.parentNode;
    while (n && n.parentNode !== body) n = n.parentNode;
    return n && n !== body ? n : null;
  };
  const currentBlock = () => {
    const r = rangeInBody();
    return r ? topBlock(r.startContainer) : null;
  };

  function placeCaret(el, atEnd = false) {
    const r = document.createRange();
    r.selectNodeContents(el);
    r.collapse(!atEnd);
    const s = sel();
    s.removeAllRanges();
    s.addRange(r);
  }

  /* ── normalisation: what browsers make → what the site accepts ─────── */

  function normalize() {
    /* colour and highlight markers made with fontName */
    for (const f of body.querySelectorAll('font[face^="ih-"], [style*="ih-"]')) {
      const marker = f.getAttribute('face') || (f.style.fontFamily || '').replace(/["']/g, '');
      const span = document.createElement(marker === 'ih-hl' ? 'mark' : 'span');
      if (marker.startsWith('ih-c-')) span.className = `c-${marker.slice(5)}`;
      while (f.firstChild) span.append(f.firstChild);
      f.replaceWith(span);
      if (marker === 'ih-c-none') span.replaceWith(...span.childNodes);
    }
    /* colour spans should not nest */
    for (const inner of body.querySelectorAll('span[class^="c-"] span[class^="c-"]')) inner.replaceWith(...inner.childNodes);
    /* alignment set as style → class */
    for (const el of body.querySelectorAll('[style]')) {
      const align = el.style.textAlign;
      el.removeAttribute('style');
      if (align && /^(left|center|right)$/.test(align) && el.parentNode === body) {
        el.classList.remove('align-left', 'align-center', 'align-right');
        if (align !== 'left') el.classList.add(`align-${align}`);
      }
    }
    for (const el of body.querySelectorAll('[align]')) el.removeAttribute('align');
    /* b/i → strong/em, plain divs → p, loose inline content at the top → p */
    for (const b of body.querySelectorAll('b')) rename(b, 'strong');
    for (const i of body.querySelectorAll('i')) rename(i, 'em');
    for (const div of [...body.querySelectorAll('div')]) {
      if (div.className && /cms-/.test(div.className)) continue;
      if (div.parentNode === body || div.closest('.cms-column, .cms-callout')) rename(div, 'p');
    }
    let run = null;
    for (const node of [...body.childNodes]) {
      const isBlock = node.nodeType === 1 && BLOCK_TAGS.has(node.tagName);
      if (isBlock) {
        run = null;
        continue;
      }
      if (node.nodeType === 3 && !node.textContent.trim()) {
        node.remove();
        continue;
      }
      if (!run) {
        run = document.createElement('p');
        body.insertBefore(run, node);
      }
      run.append(node);
    }
    /* empty editable paragraphs need a <br> to hold the caret */
    for (const p of body.querySelectorAll('p, h2, h3, h4, li, figcaption, .cms-column')) {
      if (!p.textContent && !p.querySelector('img, br')) p.append(document.createElement('br'));
    }
    for (const span of body.querySelectorAll('span:not([class])')) span.replaceWith(...span.childNodes);
    for (const fig of body.querySelectorAll('figure')) {
      fig.setAttribute('contenteditable', 'false');
      if (!fig.classList.contains('cms-figure')) fig.classList.add('cms-figure');
      if (![...fig.classList].some((c) => /^cms-figure--w\d+$/.test(c))) fig.classList.add('cms-figure--w100');
      if (![...fig.classList].some((c) => /^cms-figure--(left|center|right)$/.test(c))) fig.classList.add('cms-figure--center');
      let cap = fig.querySelector('figcaption');
      if (!cap) {
        cap = document.createElement('figcaption');
        fig.append(cap);
      }
      cap.setAttribute('contenteditable', 'true');
      if (!fig.querySelector('[data-grip]')) {
        const grip = document.createElement('span');
        grip.className = 'fig-grip';
        grip.dataset.grip = '';
        fig.append(grip);
      }
    }
    if (!body.firstChild) body.append(Object.assign(document.createElement('p'), { innerHTML: '<br>' }));
    body.classList.toggle('is-empty', !body.textContent.trim() && !body.querySelector('img'));
  }

  function rename(el, tag) {
    const n = document.createElement(tag);
    for (const a of el.attributes) n.setAttribute(a.name, a.value);
    while (el.firstChild) n.append(el.firstChild);
    el.replaceWith(n);
    return n;
  }

  /* ── commands ──────────────────────────────────────────────────────── */

  function exec(cmd, value = null) {
    body.focus();
    document.execCommand(cmd, false, value);
    normalize();
    emit();
    refreshBars();
  }

  function setColor(key) {
    exec('fontName', key === 'none' ? 'ih-c-none' : `ih-c-${key}`);
  }

  function toggleHighlight() {
    const r = rangeInBody();
    if (!r) return;
    const mark = r.commonAncestorContainer.nodeType === 1 ? r.commonAncestorContainer.closest('mark') : r.commonAncestorContainer.parentNode.closest('mark');
    if (mark && inBody(mark)) {
      mark.replaceWith(...mark.childNodes);
      emit();
      refreshBars();
      return;
    }
    exec('fontName', 'ih-hl');
  }

  function setBlock(tag) {
    const block = currentBlock();
    if (!block) return;
    if (tag === 'callout') {
      const div = document.createElement('div');
      div.className = 'cms-callout';
      if (block.classList.contains('cms-callout')) {
        block.replaceWith(...block.childNodes);
      } else {
        block.replaceWith(div);
        div.append(block.tagName === 'DIV' ? block : block);
      }
      normalize();
      emit();
      refreshBars();
      return;
    }
    if (tag === 'blockquote') {
      if (block.tagName === 'BLOCKQUOTE') {
        block.replaceWith(...block.childNodes);
      } else {
        const q = document.createElement('blockquote');
        block.replaceWith(q);
        q.append(block);
      }
      normalize();
      emit();
      refreshBars();
      return;
    }
    exec('formatBlock', `<${tag}>`);
  }

  function setAlign(where) {
    const block = currentBlock();
    if (!block) return;
    block.classList.remove('align-left', 'align-center', 'align-right');
    if (where !== 'left') block.classList.add(`align-${where}`);
    emit();
    refreshBars();
  }

  function makeLink() {
    const r = rangeInBody();
    if (!r) return;
    const existing = r.commonAncestorContainer.nodeType === 1 ? r.commonAncestorContainer.closest('a') : r.commonAncestorContainer.parentNode.closest('a');
    const current = existing && inBody(existing) ? existing.getAttribute('href') : '';
    const href = prompt('Naslov povezave (npr. /kontakt/ ali https://…). Prazno odstrani povezavo.', current || '/');
    if (href === null) return;
    if (!href.trim()) return exec('unlink');
    if (r.collapsed && !existing) {
      const a = document.createElement('a');
      a.href = href.trim();
      a.textContent = href.trim();
      r.insertNode(a);
      normalize();
      emit();
      return;
    }
    exec('createLink', href.trim());
    const a = rangeInBody()?.commonAncestorContainer;
    const link = a && (a.nodeType === 1 ? a.closest('a') : a.parentNode.closest('a'));
    if (link && /^https?:/.test(link.getAttribute('href') || '')) link.setAttribute('rel', 'noopener');
  }

  function clearFormat() {
    exec('removeFormat');
    const r = rangeInBody();
    if (!r) return;
    const walker = document.createTreeWalker(r.commonAncestorContainer.nodeType === 1 ? r.commonAncestorContainer : r.commonAncestorContainer.parentNode, NodeFilter.SHOW_ELEMENT);
    const doomed = [];
    let n;
    while ((n = walker.nextNode())) if (/^(SPAN|MARK|STRONG|EM|U|S)$/.test(n.tagName) && r.intersectsNode(n)) doomed.push(n);
    for (const d of doomed) d.replaceWith(...d.childNodes);
    normalize();
    emit();
  }

  /* insert a block after the current one (or at the end) and put the caret in it */
  function insertAfterCurrent(el, { selectText = false } = {}) {
    const block = currentBlock() || selectedFigure || body.lastElementChild;
    if (block && block.parentNode === body) block.after(el);
    else body.append(el);
    normalize();
    const target = el.matches('figure') ? el.querySelector('figcaption') : el.querySelector('.cms-column p, .cms-column, p, li, td') || el;
    if (target && target.tagName !== 'HR') {
      if (selectText && target.textContent.trim()) {
        /* the sample words are selected, so typing replaces them */
        const r = document.createRange();
        r.selectNodeContents(target);
        const s = sel();
        s.removeAllRanges();
        s.addRange(r);
      } else placeCaret(target);
    }
    el.scrollIntoView({ block: 'nearest' });
    emit();
    refreshBars();
  }

  function insertBlock(type, opts = {}) {
    body.focus();
    const make = (tag, html = '<br>', cls = '') => {
      const el = document.createElement(tag);
      if (cls) el.className = cls;
      el.innerHTML = html;
      return el;
    };
    const map = {
      p: () => make('p', opts.text ? esc(opts.text) : '<br>'),
      h2: () => make('h2', opts.text ? esc(opts.text) : 'Naslov'),
      h3: () => make('h3', opts.text ? esc(opts.text) : 'Podnaslov'),
      quote: () => make('blockquote', '<p>Citat</p>'),
      ul: () => make('ul', '<li>Prva točka</li><li>Druga točka</li>'),
      ol: () => make('ol', '<li>Prvi korak</li><li>Drugi korak</li>'),
      callout: () => make('div', '<p>Poudarek: nekaj, kar naj bralec ne spregleda.</p>', 'cms-callout'),
      cta: () => {
        const p = make('p', '', 'align-center');
        const a = document.createElement('a');
        a.className = 'cms-cta';
        a.href = opts.href || '/kontakt/';
        a.textContent = opts.text || 'Rezervirajte posvet';
        p.append(a);
        return p;
      },
      columns: () => make('div', '<div class="cms-column"><p>Levi stolpec</p></div><div class="cms-column"><p>Desni stolpec</p></div>', 'cms-columns'),
      table: () => make('table', '<thead><tr><th>Stolpec</th><th>Stolpec</th></tr></thead><tbody><tr><td>Vrstica</td><td>Vrstica</td></tr><tr><td>Vrstica</td><td>Vrstica</td></tr></tbody>'),
      hr: () => make('hr', ''),
      code: () => make('pre', '<code>koda</code>'),
    };
    const el = (map[type] ?? map.p)();
    insertAfterCurrent(el, { selectText: !opts.text && type !== 'p' && type !== 'cta' });
    if (type === 'cta') {
      const a = el.querySelector('a');
      const href = prompt('Kam vodi gumb? (npr. /kontakt/)', a.href.replace(location.origin, ''));
      if (href) a.setAttribute('href', href);
      const label = prompt('Napis na gumbu', a.textContent);
      if (label) a.textContent = label;
      emit();
    }
    return el;
  }

  function insertPicture(picture, opts = {}) {
    const wrap = document.createElement('div');
    wrap.innerHTML = figureHtml(picture, opts);
    const fig = wrap.firstElementChild;
    insertAfterCurrent(fig);
    selectFigure(fig);
    return fig;
  }

  function insertText(text) {
    const paras = String(text ?? '')
      .replace(/\r\n?/g, '\n')
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
    let last = null;
    for (const p of paras) {
      const el = document.createElement('p');
      el.innerHTML = esc(p).replace(/\n/g, '<br>');
      if (last) last.after(el);
      else {
        const block = currentBlock() || body.lastElementChild;
        if (block && block.parentNode === body) block.after(el);
        else body.append(el);
      }
      last = el;
    }
    normalize();
    if (last) placeCaret(last, true);
    emit();
  }

  function insertHtml(html) {
    const clean = cleanHtml(html);
    if (!clean) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = clean;
    let anchor = currentBlock() || body.lastElementChild;
    for (const node of [...wrap.childNodes]) {
      if (anchor && anchor.parentNode === body) {
        anchor.after(node);
        anchor = node;
      } else body.append(node);
    }
    normalize();
    emit();
  }

  /* ── figures ───────────────────────────────────────────────────────── */

  function selectFigure(fig) {
    if (selectedFigure && selectedFigure !== fig) selectedFigure.classList.remove('is-selected');
    selectedFigure = fig;
    if (fig) {
      fig.classList.add('is-selected');
      showImageBar(fig);
    } else hideImageBar();
  }

  function figureSize(fig, pct) {
    fig.classList.remove(...SIZES.map((s) => `cms-figure--w${s}`));
    fig.classList.add(`cms-figure--w${pct}`);
    emit();
    showImageBar(fig);
  }

  function figureAlign(fig, where) {
    fig.classList.remove('cms-figure--left', 'cms-figure--center', 'cms-figure--right');
    fig.classList.add(`cms-figure--${where}`);
    emit();
    showImageBar(fig);
  }

  function showImageBar(fig) {
    if (!ibar) {
      ibar = document.createElement('div');
      ibar.className = 'ibar';
      ibar.setAttribute('contenteditable', 'false');
      document.body.append(ibar);
      ibar.addEventListener('mousedown', (e) => e.preventDefault());
      ibar.addEventListener('click', async (e) => {
        const b = e.target.closest('button');
        if (!b || !selectedFigure) return;
        const fig = selectedFigure;
        if (b.dataset.size) figureSize(fig, Number(b.dataset.size));
        else if (b.dataset.align) figureAlign(fig, b.dataset.align);
        else if (b.dataset.act === 'alt') {
          const img = fig.querySelector('img');
          const alt = prompt('Opis slike (kaj je na njej, v eni povedi):', img.alt || '');
          if (alt !== null) {
            img.alt = alt.trim();
            emit();
          }
        } else if (b.dataset.act === 'edit') {
          if (onEditImage) await onEditImage(fig);
        } else if (b.dataset.act === 'replace') {
          if (onReplaceImage) await onReplaceImage(fig);
        } else if (b.dataset.act === 'remove') {
          const p = document.createElement('p');
          p.innerHTML = '<br>';
          fig.replaceWith(p);
          selectFigure(null);
          placeCaret(p);
          emit();
        }
      });
    }
    const size = SIZES.find((s) => fig.classList.contains(`cms-figure--w${s}`)) ?? 100;
    const align = ['left', 'center', 'right'].find((a) => fig.classList.contains(`cms-figure--${a}`)) ?? 'center';
    ibar.innerHTML = `
      ${SIZES.map((s) => `<button type="button" data-size="${s}" class="${s === size ? 'is-on' : ''}">${s}%</button>`).join('')}
      <span class="fbar__sep"></span>
      <button type="button" data-align="left" class="${align === 'left' ? 'is-on' : ''}" title="Levo, besedilo teče ob sliki">◧</button>
      <button type="button" data-align="center" class="${align === 'center' ? 'is-on' : ''}" title="Sredina">▣</button>
      <button type="button" data-align="right" class="${align === 'right' ? 'is-on' : ''}" title="Desno, besedilo teče ob sliki">◨</button>
      <span class="fbar__sep"></span>
      <button type="button" data-act="alt">Opis</button>
      <button type="button" data-act="edit">Uredi</button>
      <button type="button" data-act="replace">Zamenjaj</button>
      <button type="button" data-act="remove">Odstrani</button>`;
    const r = fig.getBoundingClientRect();
    ibar.hidden = false;
    const top = r.top + window.scrollY - ibar.offsetHeight - 8;
    ibar.style.top = `${Math.max(window.scrollY + 8, top)}px`;
    ibar.style.left = `${Math.max(8, Math.min(r.left + window.scrollX, window.scrollX + window.innerWidth - ibar.offsetWidth - 8))}px`;
  }

  function hideImageBar() {
    if (ibar) ibar.hidden = true;
  }

  /* grip drag: width in steps */
  let grip = null;
  body.addEventListener('pointerdown', (e) => {
    const g = e.target.closest('[data-grip]');
    if (!g) return;
    const fig = g.closest('figure');
    grip = { fig, left: fig.getBoundingClientRect().left, width: body.getBoundingClientRect().width };
    e.preventDefault();
  });
  window.addEventListener('pointermove', (e) => {
    if (!grip) return;
    const pct = ((e.clientX - grip.left) / grip.width) * 100;
    const snap = SIZES.reduce((a, b) => (Math.abs(b - pct) < Math.abs(a - pct) ? b : a));
    if (!grip.fig.classList.contains(`cms-figure--w${snap}`)) figureSize(grip.fig, snap);
  });
  window.addEventListener('pointerup', () => {
    grip = null;
  });

  /* ── the floating format bar ───────────────────────────────────────── */

  function ensureFbar() {
    if (fbar) return fbar;
    fbar = document.createElement('div');
    fbar.className = 'fbar';
    fbar.hidden = true;
    fbar.innerHTML = `
      <select data-block title="Vrsta bloka">
        <option value="p">Odstavek</option><option value="h2">Naslov</option><option value="h3">Podnaslov</option><option value="h4">Mali naslov</option>
        <option value="blockquote">Citat</option><option value="callout">Poudarek</option>
      </select>
      <span class="fbar__sep"></span>
      <button type="button" data-cmd="bold" title="Krepko"><b>B</b></button>
      <button type="button" data-cmd="italic" title="Ležeče"><i>I</i></button>
      <button type="button" data-cmd="underline" title="Podčrtano"><u>U</u></button>
      <button type="button" data-cmd="strikeThrough" title="Prečrtano"><s>S</s></button>
      <span class="fbar__sep"></span>
      ${COLORS.map((c) => `<button type="button" data-color="${c.key}" title="${c.label}"><span class="sw" style="background:${c.hex}"></span></button>`).join('')}
      <button type="button" data-color="none" title="Brez barve">∅</button>
      <button type="button" data-hl title="Poudari z ozadjem">Poudari</button>
      <span class="fbar__sep"></span>
      <button type="button" data-link title="Povezava">Povezava</button>
      <button type="button" data-align="left" title="Levo">⇤</button>
      <button type="button" data-align="center" title="Sredina">↔</button>
      <button type="button" data-align="right" title="Desno">⇥</button>
      <button type="button" data-cmd="insertUnorderedList" title="Seznam">•</button>
      <button type="button" data-cmd="insertOrderedList" title="Oštevilčen seznam">1.</button>
      <span class="fbar__sep"></span>
      <button type="button" data-clear title="Počisti oblikovanje">Počisti</button>`;
    document.body.append(fbar);
    fbar.addEventListener('mousedown', (e) => {
      if (e.target.tagName !== 'SELECT') e.preventDefault();
    });
    fbar.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.cmd) exec(b.dataset.cmd);
      else if (b.dataset.color) setColor(b.dataset.color);
      else if (b.hasAttribute('data-hl')) toggleHighlight();
      else if (b.hasAttribute('data-link')) makeLink();
      else if (b.dataset.align) setAlign(b.dataset.align);
      else if (b.hasAttribute('data-clear')) clearFormat();
    });
    fbar.querySelector('[data-block]').addEventListener('change', (e) => {
      setBlock(e.target.value);
      body.focus();
    });
    return fbar;
  }

  function refreshBars() {
    const r = rangeInBody();
    if (!r || r.collapsed || destroyed) {
      if (fbar) fbar.hidden = true;
      return;
    }
    const bar = ensureFbar();
    const rect = r.getBoundingClientRect();
    if (!rect.width && !rect.height) {
      bar.hidden = true;
      return;
    }
    bar.hidden = false;
    for (const b of bar.querySelectorAll('[data-cmd]')) b.classList.toggle('is-on', document.queryCommandState(b.dataset.cmd));
    const block = currentBlock();
    const select = bar.querySelector('[data-block]');
    if (block) {
      const tag = block.tagName.toLowerCase();
      select.value = block.classList.contains('cms-callout') ? 'callout' : ['p', 'h2', 'h3', 'h4', 'blockquote'].includes(tag) ? tag : 'p';
      for (const b of bar.querySelectorAll('[data-align]')) b.classList.toggle('is-on', block.classList.contains(`align-${b.dataset.align}`) || (b.dataset.align === 'left' && !/align-/.test(block.className)));
    }
    const top = rect.top + window.scrollY - bar.offsetHeight - 10;
    bar.style.top = `${Math.max(window.scrollY + 8, top)}px`;
    bar.style.left = `${Math.max(8, Math.min(rect.left + window.scrollX + rect.width / 2 - bar.offsetWidth / 2, window.scrollX + window.innerWidth - bar.offsetWidth - 8))}px`;
  }

  /* ── block handle ──────────────────────────────────────────────────── */

  function ensureHandle() {
    if (handle) return handle;
    handle = document.createElement('div');
    handle.className = 'bhandle';
    handle.hidden = true;
    handle.innerHTML = `
      <button type="button" data-h="up" title="Premakni gor">↑</button>
      <button type="button" data-h="down" title="Premakni dol">↓</button>
      <button type="button" data-h="dup" title="Podvoji">⧉</button>
      <button type="button" data-h="del" title="Odstrani">✕</button>`;
    document.body.append(handle);
    handle.addEventListener('mousedown', (e) => e.preventDefault());
    handle.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b || !hoverBlock || !inBody(hoverBlock)) return;
      const el = hoverBlock;
      if (b.dataset.h === 'up' && el.previousElementSibling) el.previousElementSibling.before(el);
      else if (b.dataset.h === 'down' && el.nextElementSibling) el.nextElementSibling.after(el);
      else if (b.dataset.h === 'dup') el.after(el.cloneNode(true));
      else if (b.dataset.h === 'del') {
        const next = el.nextElementSibling || el.previousElementSibling;
        el.remove();
        if (selectedFigure === el) selectFigure(null);
        if (!body.firstChild) normalize();
        if (next) placeCaret(next);
      }
      normalize();
      emit();
      positionHandle(el);
    });
    handle.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    handle.addEventListener('mouseleave', scheduleHide);
    return handle;
  }

  let hideTimer = null;
  const scheduleHide = () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (handle) handle.hidden = true;
    }, 400);
  };

  function positionHandle(block) {
    if (!block || !inBody(block)) return;
    hoverBlock = block;
    const h = ensureHandle();
    const r = block.getBoundingClientRect();
    h.hidden = false;
    const left = r.left + window.scrollX - h.offsetWidth - 8;
    h.style.left = `${Math.max(2, left)}px`;
    h.style.top = `${r.top + window.scrollY}px`;
  }

  body.addEventListener('mousemove', (e) => {
    const block = topBlock(e.target);
    if (!block) return;
    clearTimeout(hideTimer);
    if (block !== hoverBlock || handle?.hidden) positionHandle(block);
  });
  body.addEventListener('mouseleave', scheduleHide);

  /* ── events ────────────────────────────────────────────────────────── */

  body.addEventListener('click', (e) => {
    const fig = e.target.closest('figure');
    if (fig && inBody(fig) && !e.target.closest('figcaption')) {
      selectFigure(fig);
      return;
    }
    if (selectedFigure) selectFigure(null);
  });

  document.addEventListener('selectionchange', () => {
    if (destroyed) return;
    refreshBars();
    const block = currentBlock();
    if (block && !window.matchMedia('(hover: hover)').matches) positionHandle(block);
  });

  body.addEventListener('input', () => {
    normalize();
    emit();
  });

  body.addEventListener('keydown', (e) => {
    if (selectedFigure && (e.key === 'Backspace' || e.key === 'Delete') && !e.target.closest('figcaption')) {
      e.preventDefault();
      const p = document.createElement('p');
      p.innerHTML = '<br>';
      selectedFigure.replaceWith(p);
      selectFigure(null);
      placeCaret(p);
      emit();
      return;
    }
    if (e.key === 'Enter' && e.target.closest('figcaption')) {
      e.preventDefault();
      const fig = e.target.closest('figure');
      const p = document.createElement('p');
      p.innerHTML = '<br>';
      fig.after(p);
      placeCaret(p);
      emit();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
      const k = e.key.toLowerCase();
      if (k === 'b') { e.preventDefault(); exec('bold'); }
      else if (k === 'i') { e.preventDefault(); exec('italic'); }
      else if (k === 'u') { e.preventDefault(); exec('underline'); }
      else if (k === 'k') { e.preventDefault(); makeLink(); }
    }
  });

  body.addEventListener('paste', (e) => {
    const html = e.clipboardData?.getData('text/html');
    const text = e.clipboardData?.getData('text/plain');
    if (!html && !text) return;
    e.preventDefault();
    if (html) {
      const clean = cleanHtml(html.replace(/<meta[^>]*>/gi, ''));
      document.execCommand('insertHTML', false, clean);
    } else {
      const lines = text.split(/\n{2,}/).map((p) => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
      document.execCommand('insertHTML', false, lines);
    }
    normalize();
    emit();
  });

  body.addEventListener('drop', (e) => {
    const f = e.dataTransfer?.files?.[0];
    if (f && onPickImage) {
      e.preventDefault();
      onPickImage(f);
    }
  });

  window.addEventListener('scroll', () => {
    if (fbar && !fbar.hidden) refreshBars();
    if (selectedFigure && ibar && !ibar.hidden) showImageBar(selectedFigure);
  }, { passive: true });

  normalize();

  return {
    setHtml(html) {
      body.innerHTML = html || '<p><br></p>';
      normalize();
    },
    getHtml() {
      normalize();
      const clone = body.cloneNode(true);
      for (const g of clone.querySelectorAll('[data-grip]')) g.remove();
      for (const el of clone.querySelectorAll('[contenteditable]')) el.removeAttribute('contenteditable');
      for (const el of clone.querySelectorAll('.is-selected')) el.classList.remove('is-selected');
      for (const br of clone.querySelectorAll('p > br:only-child, li > br:only-child, figcaption > br:only-child')) br.remove();
      return cleanHtml(clone.innerHTML);
    },
    getText() {
      return body.innerText;
    },
    insertBlock,
    insertPicture,
    insertText,
    insertHtml,
    setColor,
    exec,
    focus: () => body.focus(),
    selectedFigure: () => selectedFigure,
    destroy() {
      destroyed = true;
      fbar?.remove();
      ibar?.remove();
      handle?.remove();
      fbar = ibar = handle = null;
    },
  };
}
