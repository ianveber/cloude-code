/**
 * Illustrative artwork.
 *
 * Unlike decor.mjs — which draws faint texture in the page margins — everything
 * here is foreground illustration shown at full strength beside the copy.
 *
 * All of it is inline SVG: no image requests, crisp at any size, and it inherits
 * colour from CSS so a single drawing works on both the light and dark bands.
 * Every drawing is decorative; the meaning is always carried by adjacent text.
 */

const SVG_OPEN = (viewBox, extra = '') =>
  `<svg viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"${extra}>`;

/* ── Capability artwork ─────────────────────────────────────────────────── */

const UI = 'stroke="currentColor" stroke-width="1.6" fill="none"';

/** A SaaS product: window chrome, sidebar, KPI tiles and a chart. */
const artSaas = () => `${SVG_OPEN('0 0 320 200', ' class="art art--saas"')}
  <rect ${UI} x="8" y="10" width="304" height="180" rx="10" class="art__panel"/>
  <path ${UI} d="M8 34 H312"/>
  <circle cx="24" cy="22" r="3.5" fill="currentColor" opacity="0.45"/>
  <circle cx="36" cy="22" r="3.5" fill="currentColor" opacity="0.3"/>
  <circle cx="48" cy="22" r="3.5" fill="currentColor" opacity="0.3"/>
  <path ${UI} d="M84 34 V190"/>
  <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.55">
    <path d="M22 52 H68"/><path d="M22 68 H60"/><path d="M22 84 H66"/><path d="M22 100 H54"/>
  </g>
  <rect class="art__tile" x="100" y="50" width="62" height="42" rx="7"/>
  <rect class="art__tile" x="172" y="50" width="62" height="42" rx="7"/>
  <rect class="art__tile art__tile--hot" x="244" y="50" width="52" height="42" rx="7"/>
  <g stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity="0.75">
    <path d="M110 80 H132"/><path d="M182 80 H206"/><path d="M254 80 H272"/>
  </g>
  <rect ${UI} x="100" y="106" width="196" height="70" rx="8" class="art__panel"/>
  <path class="art__spark" d="M112 158 L138 142 L160 150 L184 124 L210 132 L236 112 L262 118 L284 96"
        stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle class="art__pip" cx="284" cy="96" r="4.5" fill="currentColor"/>
</svg>`;

/** Automation: nodes, a decision diamond and a branch. */
const artFlow = () => `${SVG_OPEN('0 0 320 200', ' class="art art--flow"')}
  <rect class="art__tile" x="10" y="26" width="86" height="42" rx="8"/>
  <rect class="art__tile" x="10" y="126" width="86" height="42" rx="8"/>
  <path class="art__edge" d="M96 47 C124 47 118 88 146 92" ${UI}/>
  <path class="art__edge" d="M96 147 C124 147 118 108 146 100" ${UI}/>
  <path class="art__tile art__tile--hot" d="M186 60 L228 96 L186 132 L144 96 Z"/>
  <path class="art__edge" d="M228 82 C252 74 250 54 274 52" ${UI}/>
  <path class="art__edge" d="M228 110 C252 118 250 142 274 144" ${UI}/>
  <rect class="art__tile" x="266" y="32" width="44" height="40" rx="8"/>
  <rect class="art__tile" x="266" y="124" width="44" height="40" rx="8"/>
  <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.5">
    <path d="M24 42 H60"/><path d="M24 54 H74"/>
    <path d="M24 142 H60"/><path d="M24 154 H74"/>
  </g>
  <circle class="art__pip" cx="186" cy="96" r="5" fill="currentColor"/>
</svg>`;

/** Cybersecurity: a shield over a key grid, with a scanning sweep. */
const artShield = () => `${SVG_OPEN('0 0 320 200', ' class="art art--shield"')}
  <g stroke="currentColor" stroke-width="1.4" opacity="0.32">
    <path d="M18 44 H302"/><path d="M18 78 H302"/><path d="M18 112 H302"/><path d="M18 146 H302"/>
    <path d="M60 20 V180"/><path d="M126 20 V180"/><path d="M194 20 V180"/><path d="M260 20 V180"/>
  </g>
  <path class="art__tile art__tile--hot"
        d="M160 22 L226 46 V104 C226 140 196 166 160 178 C124 166 94 140 94 104 V46 Z"/>
  <path ${UI} d="M133 100 L153 120 L189 80" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.6">
    <path d="M28 62 H48"/><path d="M272 62 H292"/>
    <path d="M28 130 H48"/><path d="M272 130 H292"/>
  </g>
  <circle class="art__pip" cx="38" cy="96" r="4" fill="currentColor"/>
  <circle class="art__pip" cx="282" cy="96" r="4" fill="currentColor"/>
</svg>`;

/** Custom application: a phone-shaped app frame beside a form panel. */
const artApp = () => `${SVG_OPEN('0 0 320 200', ' class="art art--app"')}
  <rect ${UI} x="14" y="16" width="104" height="168" rx="14" class="art__panel"/>
  <path ${UI} d="M48 30 H84" stroke-width="3.4" stroke-linecap="round"/>
  <rect class="art__tile art__tile--hot" x="28" y="48" width="76" height="34" rx="7"/>
  <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.55">
    <path d="M28 98 H104"/><path d="M28 112 H86"/><path d="M28 126 H98"/><path d="M28 140 H72"/>
  </g>
  <rect class="art__tile" x="28" y="154" width="76" height="18" rx="9"/>
  <rect ${UI} x="140" y="16" width="166" height="168" rx="12" class="art__panel"/>
  <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.5">
    <path d="M158 44 H232"/>
  </g>
  <rect class="art__tile" x="158" y="58" width="130" height="26" rx="7"/>
  <rect class="art__tile" x="158" y="94" width="130" height="26" rx="7"/>
  <rect class="art__tile art__tile--hot" x="158" y="134" width="86" height="30" rx="8"/>
  <circle class="art__pip" cx="272" cy="149" r="5" fill="currentColor"/>
</svg>`;

const ART = { saas: artSaas, flow: artFlow, shield: artShield, app: artApp };

/** Look up a capability drawing by key. Unknown keys render nothing. */
export const capabilityArt = (key) => (ART[key] ? ART[key]() : '');
