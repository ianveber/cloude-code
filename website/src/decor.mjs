/**
 * Live inline illustrations used by service cards and the feature explorer.
 * Background decoration was removed with the unified visual system.
 */

const GLYPH_STROKE =
  'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

const SERVICE_GLYPHS = {
  'avtomatizacija-administracije': `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path ${GLYPH_STROKE} d="M7 4h8l5 5v15H7z"/>
    <path ${GLYPH_STROKE} d="M15 4v5h5"/>
    <path ${GLYPH_STROKE} d="M10 14h8M10 18h5"/>
  </svg>`,

  'avtomatizacija-prodaje': `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path ${GLYPH_STROKE} d="M5 7h18v12h-9l-5 4v-4H5z"/>
    <path ${GLYPH_STROKE} d="M9 12h10M9 16h6"/>
  </svg>`,

  'spremljanje-trga': `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <circle ${GLYPH_STROKE} cx="12" cy="12" r="7"/>
    <path ${GLYPH_STROKE} d="M17.5 17.5 23 23"/>
    <path ${GLYPH_STROKE} d="M9 13l2.5-3 2 2L16 9"/>
  </svg>`,

  fallback: `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <circle ${GLYPH_STROKE} cx="14" cy="14" r="9"/>
    <path ${GLYPH_STROKE} d="M14 9v10M9 14h10"/>
  </svg>`,
};

export const serviceGlyph = (slug) => SERVICE_GLYPHS[slug] ?? SERVICE_GLYPHS.fallback;

const FRAME =
  'stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"';

const STAGE_SCENES = {
  'avtomatizacija-administracije': `<svg viewBox="0 0 560 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <rect ${FRAME} x="24" y="24" width="512" height="372" rx="28"/>
    <rect ${FRAME} x="48" y="56" width="200" height="308" rx="16"/>
    <rect ${FRAME} x="272" y="56" width="240" height="140" rx="16"/>
    <rect ${FRAME} x="272" y="216" width="240" height="148" rx="16"/>
    <path ${FRAME} d="M72 92h140M72 118h108M72 144h152"/>
    <path ${FRAME} d="M72 188h120M72 214h88"/>
    <circle ${FRAME} cx="80" cy="268" r="10"/>
    <path ${FRAME} d="M100 268h80"/>
    <circle ${FRAME} cx="80" cy="304" r="10"/>
    <path ${FRAME} d="M100 304h64"/>
    <path ${FRAME} d="M296 92h140M296 118h96M296 144h120"/>
    <path ${FRAME} d="M296 252h80M296 278h160M296 304h120"/>
    <path ${FRAME} d="M456 324l16 16 28-36"/>
  </svg>`,

  'avtomatizacija-prodaje': `<svg viewBox="0 0 560 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <rect ${FRAME} x="24" y="24" width="512" height="372" rx="28"/>
    <rect ${FRAME} x="56" y="64" width="280" height="292" rx="18"/>
    <rect ${FRAME} x="360" y="64" width="160" height="120" rx="16"/>
    <rect ${FRAME} x="360" y="204" width="160" height="152" rx="16"/>
    <path ${FRAME} d="M80 96h140M80 122h200"/>
    <path ${FRAME} d="M80 168h168v56H80z"/>
    <path ${FRAME} d="M168 248h136v56H168z"/>
    <path ${FRAME} d="M80 328h96"/>
    <circle ${FRAME} cx="400" cy="104" r="18"/>
    <path ${FRAME} d="M428 104h64M384 148h112"/>
    <path ${FRAME} d="M384 236h112M384 264h80M384 292h96"/>
  </svg>`,

  'spremljanje-trga': `<svg viewBox="0 0 560 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <rect ${FRAME} x="24" y="24" width="512" height="372" rx="28"/>
    <path ${FRAME} d="M64 320h432"/>
    <path ${FRAME} d="M64 320V80"/>
    <rect ${FRAME} x="96" y="220" width="48" height="100" rx="6"/>
    <rect ${FRAME} x="168" y="176" width="48" height="144" rx="6"/>
    <rect ${FRAME} x="240" y="204" width="48" height="116" rx="6"/>
    <rect ${FRAME} x="312" y="132" width="48" height="188" rx="6"/>
    <rect ${FRAME} x="384" y="96" width="48" height="224" rx="6"/>
    <path ${FRAME} d="M88 248c48-36 96-20 144-56s96-72 192-96"/>
    <circle ${FRAME} cx="424" cy="96" r="8"/>
    <circle ${FRAME} cx="88" cy="248" r="5"/>
    <circle ${FRAME} cx="232" cy="192" r="5"/>
  </svg>`,
};

export const stageScene = (slug) =>
  STAGE_SCENES[slug] ?? STAGE_SCENES['avtomatizacija-administracije'];
