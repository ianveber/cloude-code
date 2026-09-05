/** Small HTML helpers shared by every template. */

const ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape text destined for HTML markup. */
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ENTITIES[c]);

/** Join template fragments, dropping null/undefined/false so conditionals read cleanly. */
export const join = (parts, separator = '\n') => parts.filter(Boolean).join(separator);

/** Map over a list and join the resulting markup. */
export const each = (items, fn) => items.map(fn).join('\n');

/** Build a `class` attribute, skipping falsy entries. */
export const cls = (...names) => names.filter(Boolean).join(' ');

/** Modifier suffix for accent colours, e.g. accentMod('card', 'violet') → 'card--violet'. */
export const accentMod = (base, accent) => (accent && accent !== 'blue' ? `${base}--${accent}` : '');

/**
 * Serialise a JSON-LD object for embedding in a <script> tag.
 * `<` is escaped so a stray value can never terminate the script element early.
 */
export const jsonLd = (data) =>
  JSON.stringify(data, null, 2).replace(/</g, '\\u003c').replace(/\u2028|\u2029/g, '');

/** Absolute URL for a site-root-relative path. */
export const absolute = (origin, path) => `${origin}${path.startsWith('/') ? path : `/${path}`}`;

/** Collapse whitespace — used for meta descriptions built from copy. */
export const oneline = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();

/** Strip tags, then collapse whitespace. For deriving plain text from markup. */
export const plain = (value) => oneline(String(value ?? '').replace(/<[^>]+>/g, ' '));
