/**
 * Decorative line art.
 *
 * Abstract "corporate doodle" drawings — flow diagrams, node graphs, gears,
 * charts, stacked documents — used as very low-opacity background texture.
 *
 * Rules these follow, so the art never competes with the content:
 *   - Purely decorative: `aria-hidden`, `focusable="false"`, `pointer-events:none`.
 *   - They live in an absolutely-positioned layer *behind* the section's content
 *     (`.decor` is z-index 0, `.shell` is z-index 1), so they never overlap text
 *     in a way that affects legibility.
 *   - Opacity is set in CSS (roughly 0.05–0.09), never here.
 *   - Hidden below 900px, where there is no free margin to draw into.
 *
 * All drawings use a 200×200 viewBox, stroke-only, no fills, so they scale
 * cleanly and stay a single hairline weight at any size.
 */

const OPEN = (extra = '') =>
  `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"${extra}>`;

/* Shared stroke setup: hairline, rounded, non-scaling so it stays crisp. */
const S = 'stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"';
const SD = `${S} stroke-dasharray="4 5"`;

/* ── Drawings ─────────────────────────────────────────────────────────── */

/** Connected node graph — the "system" idea. */
export const drawNetwork = () => `${OPEN()}
  <path ${SD} d="M42 58 L96 34 M96 34 L152 62 M42 58 L74 118 M74 118 L96 34 M74 118 L140 132 M140 132 L152 62 M140 132 L108 172 M74 118 L108 172"/>
  <circle ${S} cx="42" cy="58" r="7"/>
  <circle ${S} cx="96" cy="34" r="10"/>
  <circle ${S} cx="152" cy="62" r="7"/>
  <circle ${S} cx="74" cy="118" r="12"/>
  <circle ${S} cx="140" cy="132" r="8"/>
  <circle ${S} cx="108" cy="172" r="6"/>
  <circle ${S} cx="74" cy="118" r="20" stroke-dasharray="3 6"/>
</svg>`;

/** Flow diagram: boxes, a decision diamond and arrows. */
export const drawFlow = () => `${OPEN()}
  <rect ${S} x="18" y="26" width="56" height="30" rx="6"/>
  <path ${SD} d="M74 41 H108"/>
  <path ${S} d="M102 36 L108 41 L102 46"/>
  <path ${S} d="M136 22 L158 41 L136 60 L114 41 Z"/>
  <path ${SD} d="M136 60 V96"/>
  <path ${S} d="M131 90 L136 96 L141 90"/>
  <rect ${S} x="100" y="96" width="72" height="30" rx="6"/>
  <path ${SD} d="M100 111 H58 V150"/>
  <path ${S} d="M53 144 L58 150 L63 144"/>
  <rect ${S} x="26" y="150" width="64" height="30" rx="6"/>
  <path ${S} d="M32 38 H50 M32 46 H62"/>
  <path ${S} d="M112 106 H150 M112 114 H136"/>
  <path ${S} d="M38 162 H72 M38 170 H58"/>
</svg>`;

/** Ascending bars with a trend line. */
export const drawChart = () => `${OPEN()}
  <path ${S} d="M26 172 H176"/>
  <path ${S} d="M26 172 V34"/>
  <rect ${S} x="44" y="128" width="20" height="44" rx="3"/>
  <rect ${S} x="76" y="104" width="20" height="68" rx="3"/>
  <rect ${S} x="108" y="122" width="20" height="50" rx="3"/>
  <rect ${S} x="140" y="66" width="20" height="106" rx="3"/>
  <path ${SD} d="M54 116 L86 88 L118 100 L150 52"/>
  <circle ${S} cx="54" cy="116" r="4"/>
  <circle ${S} cx="86" cy="88" r="4"/>
  <circle ${S} cx="118" cy="100" r="4"/>
  <circle ${S} cx="150" cy="52" r="5"/>
  <path ${S} d="M142 44 L150 52 M150 52 L158 46"/>
</svg>`;

/** Two meshing gears — process and machinery. */
export const drawGears = () => {
  const teeth = (cx, cy, r, n, len) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const x1 = cx + Math.cos(a) * r;
      const y1 = cy + Math.sin(a) * r;
      const x2 = cx + Math.cos(a) * (r + len);
      const y2 = cy + Math.sin(a) * (r + len);
      return `<path ${S} d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}"/>`;
    }).join('');

  return `${OPEN()}
  <circle ${S} cx="76" cy="80" r="34"/>
  <circle ${S} cx="76" cy="80" r="13"/>
  ${teeth(76, 80, 34, 12, 10)}
  <circle ${S} cx="142" cy="136" r="23"/>
  <circle ${S} cx="142" cy="136" r="9"/>
  ${teeth(142, 136, 23, 10, 8)}
  <circle ${S} cx="76" cy="80" r="50" stroke-dasharray="2 8"/>
</svg>`;
};

/** Stacked documents with a check — administration. */
export const drawDocs = () => `${OPEN()}
  <path ${S} d="M50 40 H108 L134 66 V158 H50 Z"/>
  <path ${S} d="M108 40 V66 H134"/>
  <path ${S} d="M64 86 H120 M64 100 H120 M64 114 H104"/>
  <path ${SD} d="M38 54 V172 H122"/>
  <path ${SD} d="M26 68 V186 H110"/>
  <circle ${S} cx="146" cy="140" r="22"/>
  <path ${S} d="M136 140 L143 148 L157 132"/>
</svg>`;

/** Concentric radar sweep — market monitoring. */
export const drawOrbit = () => `${OPEN()}
  <circle ${S} cx="100" cy="100" r="26"/>
  <circle ${S} cx="100" cy="100" r="50" stroke-dasharray="3 7"/>
  <circle ${S} cx="100" cy="100" r="74" stroke-dasharray="3 7"/>
  <path ${S} d="M100 100 L156 62"/>
  <path ${SD} d="M100 26 V100 H174"/>
  <circle ${S} cx="156" cy="62" r="5"/>
  <circle ${S} cx="58" cy="140" r="4"/>
  <circle ${S} cx="132" cy="152" r="6"/>
  <circle ${S} cx="44" cy="76" r="3.5"/>
  <path ${S} d="M100 90 L100 110 M90 100 L110 100"/>
</svg>`;

/** Isometric stacked layers — architecture. */
export const drawLayers = () => {
  const layer = (y) =>
    `<path ${S} d="M100 ${y} L164 ${y + 30} L100 ${y + 60} L36 ${y + 30} Z"/>`;
  return `${OPEN()}
  ${layer(26)}
  ${layer(66)}
  ${layer(106)}
  <path ${SD} d="M36 56 V96 M164 56 V96 M36 96 V136 M164 96 V136"/>
  <path ${SD} d="M100 86 V126 M100 126 V166"/>
</svg>`;
};

/** A route with waypoints — the delivery process. */
export const drawPath = () => `${OPEN()}
  <path ${SD} d="M24 158 C 60 158, 52 106, 84 106 S 118 138, 146 118 S 168 58, 182 44"/>
  <circle ${S} cx="24" cy="158" r="6"/>
  <circle ${S} cx="84" cy="106" r="8"/>
  <circle ${S} cx="146" cy="118" r="6"/>
  <circle ${S} cx="182" cy="44" r="9"/>
  <path ${S} d="M176 36 L182 44 L190 38"/>
  <path ${S} d="M84 98 V88 M84 124 V134"/>
  <rect ${S} x="60" y="30" width="48" height="30" rx="6"/>
  <path ${S} d="M70 42 H98 M70 50 H88"/>
  <path ${SD} d="M84 60 V88"/>
</svg>`;

/** Speech bubbles — customer conversation. */
export const drawTalk = () => `${OPEN()}
  <path ${S} d="M28 40 H120 A10 10 0 0 1 130 50 V96 A10 10 0 0 1 120 106 H62 L42 124 V106 H28 A10 10 0 0 1 18 96 V50 A10 10 0 0 1 28 40 Z"/>
  <path ${S} d="M36 60 H108 M36 74 H92 M36 88 H68"/>
  <path ${SD} d="M86 122 H164 A10 10 0 0 1 174 132 V166 A10 10 0 0 1 164 176 H120 L104 190 V176 H86 A10 10 0 0 1 76 166 V132 A10 10 0 0 1 86 122 Z"/>
  <path ${S} d="M94 142 H156 M94 156 H132"/>
</svg>`;

/** Circuit traces — infrastructure. */
export const drawCircuit = () => `${OPEN()}
  <path ${S} d="M14 52 H62 V96 H118 V44 H186"/>
  <path ${S} d="M14 148 H54 V112 H128 V166 H186"/>
  <path ${SD} d="M62 96 V148 M118 96 V112"/>
  <circle ${S} cx="62" cy="96" r="5"/>
  <circle ${S} cx="118" cy="96" r="5"/>
  <circle ${S} cx="54" cy="112" r="4"/>
  <circle ${S} cx="128" cy="112" r="4"/>
  <rect ${S} x="76" y="28" width="34" height="24" rx="4"/>
  <rect ${S} x="86" y="150" width="34" height="24" rx="4"/>
  <path ${S} d="M180 38 L186 44 L180 50 M180 160 L186 166 L180 172"/>
</svg>`;

/** Clock over a calendar grid — always-on operation. */
export const drawClock = () => `${OPEN()}
  <rect ${S} x="24" y="46" width="106" height="94" rx="8"/>
  <path ${S} d="M24 72 H130"/>
  <path ${S} d="M50 46 V32 M104 46 V32"/>
  <path ${SD} d="M44 90 H110 M44 106 H110 M44 122 H86"/>
  <circle ${S} cx="140" cy="130" r="34"/>
  <path ${S} d="M140 110 V130 L154 140"/>
  <path ${S} d="M140 96 V102 M174 130 H168 M140 164 V158 M106 130 H112"/>
</svg>`;

/**
 * The hero composition.
 *
 * Unlike the drawings above, this is authored as one balanced picture rather
 * than a motif that gets cropped — an abstract "system blueprint" reading left
 * to right: intake box, decision, processing cluster, result chart. Wider
 * viewBox (340×300) because it fills the hero's right half.
 */
export const drawBlueprint = () => `<svg viewBox="0 0 340 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <!-- intake -->
  <rect ${S} x="16" y="30" width="74" height="42" rx="8"/>
  <path ${S} d="M28 45h40M28 57h26"/>
  <path ${SD} d="M90 51h34"/>
  <path ${S} d="M118 46l6 5-6 5"/>

  <!-- decision -->
  <path ${S} d="M156 28l26 23-26 23-26-23z"/>
  <path ${S} d="M150 51h12"/>

  <!-- branches -->
  <path ${SD} d="M182 51h44v42"/>
  <path ${S} d="M221 87l5 6 5-6"/>
  <path ${SD} d="M156 74v46h-42v28"/>
  <path ${S} d="M109 142l5 6 5-6"/>

  <!-- processing cluster -->
  <circle ${S} cx="226" cy="118" r="25"/>
  <circle ${S} cx="226" cy="118" r="10"/>
  <circle ${S} cx="226" cy="118" r="40" stroke-dasharray="3 7"/>
  <path ${SD} d="M266 118h30M226 158v26"/>
  <circle ${S} cx="296" cy="118" r="7"/>
  <circle ${S} cx="186" cy="76" r="5"/>
  <path ${SD} d="M190 80l18 20"/>

  <!-- node graph -->
  <rect ${S} x="76" y="148" width="76" height="44" rx="8"/>
  <path ${S} d="M88 164h50M88 178h32"/>
  <path ${SD} d="M152 170h34"/>
  <circle ${S} cx="196" cy="170" r="9"/>
  <path ${SD} d="M196 179v26"/>

  <!-- result chart -->
  <path ${S} d="M186 268h130"/>
  <rect ${S} x="200" y="240" width="18" height="28" rx="3"/>
  <rect ${S} x="230" y="226" width="18" height="42" rx="3"/>
  <rect ${S} x="260" y="234" width="18" height="34" rx="3"/>
  <rect ${S} x="290" y="208" width="18" height="60" rx="3"/>
  <path ${SD} d="M209 232l30-14 30 8 30-24"/>
  <circle ${S} cx="299" cy="202" r="4"/>

  <!-- annotation marks -->
  <path ${S} d="M44 108h10M49 103v10" opacity="0.8"/>
  <path ${S} d="M312 62h10M317 57v10" opacity="0.8"/>
  <path ${S} d="M52 232h8M56 228v8" opacity="0.8"/>
  <path ${SD} d="M16 96h44M16 214h34"/>
</svg>`;

/* ── Registry + layer helper ──────────────────────────────────────────── */

export const DRAWINGS = {
  network: drawNetwork,
  flow: drawFlow,
  chart: drawChart,
  gears: drawGears,
  docs: drawDocs,
  orbit: drawOrbit,
  layers: drawLayers,
  path: drawPath,
  talk: drawTalk,
  circuit: drawCircuit,
  clock: drawClock,
  blueprint: drawBlueprint,
};

/* Drawings that are not square and need their own aspect ratio. */
const VIEWBOX = { blueprint: '0 0 340 300' };

/**
 * Build the decorative layer for a section.
 *
 * @param {Array<{art: string, place: string, size?: string, accent?: string}>} items
 *   `place` is a positional modifier (see `.decor__item--*` in styles.css).
 */
export function decor(items = []) {
  if (!items.length) return '';

  const pieces = items
    .map(({ art, place = 'right', size = 'md', accent = 'ink' }) => {
      if (!DRAWINGS[art]) throw new Error(`Unknown decor drawing: ${art}`);
      /* Reference the sprite rather than inlining the drawing. Several sections
         reuse the same art, and repeating the paths would roughly double the
         page weight. */
      const vb = VIEWBOX[art] ?? '0 0 200 200';
      return (
        `    <span class="decor__item decor__item--${place} decor__item--${size} decor__item--${accent}">` +
        `<svg viewBox="${vb}" aria-hidden="true" focusable="false"><use href="#decor-${art}"/></svg></span>`
      );
    })
    .join('\n');

  return `  <div class="decor" aria-hidden="true">\n${pieces}\n  </div>`;
}

/**
 * Build the sprite for one page, containing only the drawings that page uses.
 * Derived from the rendered markup, so there is no build-order state to keep
 * in sync.
 */
export function decorSprite(bodyHtml) {
  const used = [...new Set([...bodyHtml.matchAll(/href="#decor-([a-z]+)"/g)].map((m) => m[1]))];
  if (!used.length) return '';

  const symbols = used
    .map((art) => {
      const inner = DRAWINGS[art]().replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '').trim();
      return `<symbol id="decor-${art}" viewBox="${VIEWBOX[art] ?? '0 0 200 200'}" fill="none">${inner}</symbol>`;
    })
    .join('\n');

  return `<svg class="decor-sprite" aria-hidden="true" focusable="false" width="0" height="0">\n${symbols}\n</svg>`;
}

/* ── Small inline glyphs for service cards ────────────────────────────── */

const G = 'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

/**
 * A 28×28 line glyph per service, keyed by slug.
 * Keyed by service slug, with a neutral fallback.
 */
export const SERVICE_GLYPHS = {
  'avtomatizacija-administracije': `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path ${G} d="M7 4h8l5 5v15H7z"/>
    <path ${G} d="M15 4v5h5"/>
    <path ${G} d="M10 14h8M10 18h5"/>
  </svg>`,

  'avtomatizacija-prodaje': `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path ${G} d="M5 7h18v12h-9l-5 4v-4H5z"/>
    <path ${G} d="M9 12h10M9 16h6"/>
  </svg>`,

  'spremljanje-trga': `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <circle ${G} cx="12" cy="12" r="7"/>
    <path ${G} d="M17.5 17.5 23 23"/>
    <path ${G} d="M9 13l2.5-3 2 2L16 9"/>
  </svg>`,

  fallback: `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <circle ${G} cx="14" cy="14" r="9"/>
    <path ${G} d="M14 9v10M9 14h10"/>
  </svg>`,
};

export const serviceGlyph = (slug) => SERVICE_GLYPHS[slug] ?? SERVICE_GLYPHS.fallback;

/**
 * Product-stage drawings for the feature explorer.
 * Each is a framed "window" — not a screenshot of anyone else's product —
 * showing the idea of that service as abstract UI.
 */
const FRAME = 'stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"';

export const STAGE_SCENES = {
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
    <path ${FRAME} d="M456 324l16 16 28-36" />
  </svg>`,

  'avtomatizacija-prodaje': `<svg viewBox="0 0 560 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <rect ${FRAME} x="24" y="24" width="512" height="372" rx="28"/>
    <rect ${FRAME} x="56" y="64" width="280" height="292" rx="18"/>
    <rect ${FRAME} x="360" y="64" width="160" height="120" rx="16"/>
    <rect ${FRAME} x="360" y="204" width="160" height="152" rx="16"/>
    <path ${FRAME} d="M80 96h140M80 122h200"/>
    <path ${FRAME} d="M80 168h168v56H80z" rx="10"/>
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

export const stageScene = (slug) => STAGE_SCENES[slug] ?? STAGE_SCENES['avtomatizacija-administracije'];
