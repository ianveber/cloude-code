/**
 * An HTML cleaner for text written in IHG's editor. Runs in Node (build,
 * preview) and in the browser (before saving), with strings only.
 *
 * Only the tags and attributes an article needs survive: paragraphs,
 * headings, emphasis, links, lists, quotes, figures with pictures, tables,
 * code. Classes are kept only from a short list (alignment, colour,
 * highlight, figure size). Everything else, including every script, style,
 * event handler and unknown URL scheme, is dropped. Text is re-escaped.
 */

const ALLOWED = {
  p: [],
  h2: [],
  h3: [],
  h4: [],
  strong: [],
  em: [],
  u: [],
  s: [],
  mark: [],
  code: [],
  pre: [],
  br: [],
  hr: [],
  a: ['href', 'rel', 'target'],
  ul: [],
  ol: [],
  li: [],
  blockquote: [],
  figure: [],
  figcaption: [],
  img: ['src', 'alt', 'width', 'height', 'data-src'],
  table: [],
  thead: [],
  tbody: [],
  tr: [],
  th: [],
  td: [],
  span: [],
  div: [],
};

const ALIAS = { b: 'strong', i: 'em', strike: 's', del: 's', h1: 'h2', h5: 'h4', h6: 'h4' };
const VOID = new Set(['br', 'hr', 'img']);
const BLOCK = new Set(['p', 'h2', 'h3', 'h4', 'pre', 'ul', 'ol', 'li', 'blockquote', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'hr']);
const CLASS_RE = /^(?:cms-(?:figure|callout|cta|columns|column|table|note)(?:--[a-z0-9-]+)?|align-(?:left|center|right)|c-(?:ink|muted|blue|green|orange|red)|hl|lead|small)$/;

const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escText = (s) => s.replace(/&(?!(?:[a-z]+|#\d+|#x[0-9a-f]+);)/gi, '&amp;').replace(/[<>]/g, (c) => ENT[c]);
const escAttr = (s) => String(s).replace(/[&<>"']/g, (c) => ENT[c]);

function safeUrl(value, { image = false } = {}) {
  const v = String(value ?? '')
    .trim()
    .replace(/[\u0000-\u001f]/g, '');
  if (!v) return null;
  if (/^(?:\/(?!\/)|#)/.test(v)) return v;
  if (/^https?:\/\//i.test(v)) return v;
  if (!image && /^(?:mailto:|tel:)/i.test(v)) return v;
  return null;
}

function parseAttrs(raw) {
  const out = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = re.exec(raw))) {
    const name = m[1].toLowerCase();
    const value = m[2] ?? m[3] ?? m[4] ?? '';
    out[name] = value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  }
  return out;
}

function cleanClass(value) {
  return String(value ?? '')
    .split(/\s+/)
    .filter((c) => CLASS_RE.test(c))
    .join(' ');
}

/**
 * cleanHtml(html, { picture }) → safe HTML. `picture(src, alt)` may turn an
 * uploaded picture (an <img data-src="/uploads/…"> base path) into
 * responsive markup; without it a plain <img> stays.
 */
export function cleanHtml(input, { picture = null } = {}) {
  const src = String(input ?? '').replace(/\r\n?/g, '\n');
  const out = [];
  const stack = [];
  const re = /<!--[\s\S]*?-->|<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>|<[^>]*>/g;
  let last = 0;
  let m;
  let dropUntil = null; /* inside <script>, <style>, … everything is dropped */

  const close = (name) => {
    const i = stack.lastIndexOf(name);
    if (i < 0) return;
    while (stack.length > i) out.push(`</${stack.pop()}>`);
  };

  while ((m = re.exec(src))) {
    if (m.index > last && !dropUntil) out.push(escText(src.slice(last, m.index)));
    last = re.lastIndex;
    const tagRaw = m[1];
    if (!tagRaw) continue; /* a comment or a stray "<…>" */
    const closing = m[0][1] === '/';
    let name = tagRaw.toLowerCase();

    if (dropUntil) {
      if (closing && name === dropUntil) dropUntil = null;
      continue;
    }
    if (!closing && (name === 'script' || name === 'style' || name === 'iframe' || name === 'object' || name === 'embed' || name === 'svg' || name === 'math' || name === 'template')) {
      dropUntil = name;
      continue;
    }
    name = ALIAS[name] ?? name;
    if (!ALLOWED[name]) continue; /* unknown tag: keep its text, drop the tag */

    if (closing) {
      if (!VOID.has(name)) close(name);
      continue;
    }

    const attrs = parseAttrs(m[2] ?? '');
    const kept = [];
    for (const key of ALLOWED[name]) {
      if (!(key in attrs)) continue;
      let v = attrs[key];
      if (key === 'href') {
        v = safeUrl(v);
        if (!v) continue;
      } else if (key === 'src' || key === 'data-src') {
        v = safeUrl(v, { image: true });
        if (!v) continue;
      } else if (key === 'width' || key === 'height') {
        v = String(parseInt(v, 10) || '');
        if (!v) continue;
      } else if (key === 'target') {
        if (v !== '_blank') continue;
      } else if (key === 'rel') {
        v = 'noopener';
      }
      kept.push([key, v]);
    }
    const cls = cleanClass(attrs.class);
    if (cls) kept.push(['class', cls]);
    if (name === 'a' && kept.some(([k, v]) => k === 'href' && /^https?:/i.test(v)) && !kept.some(([k]) => k === 'rel')) kept.push(['rel', 'noopener']);

    if (name === 'img') {
      const base = kept.find(([k]) => k === 'data-src')?.[1];
      const alt = kept.find(([k]) => k === 'alt')?.[1] ?? '';
      if (picture && base && /^\/uploads\/[a-z0-9/_-]+$/i.test(base) && !/\.[a-z0-9]{2,5}$/i.test(base)) {
        out.push(picture(base, escAttr(alt)));
        continue;
      }
      if (!kept.some(([k]) => k === 'src')) continue;
      if (!kept.some(([k]) => k === 'alt')) kept.push(['alt', '']);
      kept.push(['loading', 'lazy'], ['decoding', 'async']);
    }

    const attrText = kept.map(([k, v]) => ` ${k}="${escAttr(v)}"`).join('');
    if (VOID.has(name)) {
      out.push(`<${name}${attrText}>`);
      continue;
    }
    /* a block opening inside <p> closes the paragraph, as browsers do;
       a new list item, cell or row closes the open one */
    if (BLOCK.has(name) && stack.at(-1) === 'p') close('p');
    if (name === 'li' && stack.lastIndexOf('li') > Math.max(stack.lastIndexOf('ul'), stack.lastIndexOf('ol'))) close('li');
    if ((name === 'td' || name === 'th') && Math.max(stack.lastIndexOf('td'), stack.lastIndexOf('th')) > stack.lastIndexOf('tr')) close(stack.lastIndexOf('td') > stack.lastIndexOf('th') ? 'td' : 'th');
    if (name === 'tr' && stack.lastIndexOf('tr') > Math.max(stack.lastIndexOf('tbody'), stack.lastIndexOf('thead'), stack.lastIndexOf('table'))) close('tr');
    stack.push(name);
    out.push(`<${name}${attrText}>`);
  }
  if (last < src.length && !dropUntil) out.push(escText(src.slice(last)));
  while (stack.length) out.push(`</${stack.pop()}>`);

  return out
    .join('')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<(p|h2|h3|h4|li|figcaption)>\s*<br>\s*<\/\1>/g, '')
    .trim();
}

/** Plain text of the HTML, for word counts and summaries. */
export function htmlToText(html) {
  return String(html ?? '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
