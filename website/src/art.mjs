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

/* ── Capability artwork ─────────────────────────────────────────────────── */

const SVG_OPEN = (name) =>
  `<svg viewBox="0 0 320 200" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="art art--${name}">`;

/** SaaS: one browser shell organised around a single measurable outcome. */
const artSaas = () => `${SVG_OPEN('saas')}
  <g class="art__line">
    <rect x="12" y="14" width="296" height="172" rx="8"/>
    <path d="M12 38H308M78 38V186"/>
    <circle cx="27" cy="26" r="2.5"/><circle cx="38" cy="26" r="2.5"/><circle cx="49" cy="26" r="2.5"/>
    <path d="M28 58H61M28 73H57M28 88H64M28 103H52"/>
    <path d="M98 62H186M98 78H154"/>
    <path d="M98 158H286M98 98V158"/>
    <path d="M122 158V146M158 158V133M194 158V140M230 158V112M266 158V91"/>
  </g>
  <g class="art__active">
    <path class="art__spark" d="M104 146L139 132L174 138L209 112L244 105L280 77"/>
    <circle class="art__pip" cx="280" cy="77" r="4"/>
  </g>
</svg>`;

/** Automation: an event enters, a decision routes it, and a result exits. */
const artFlow = () => `${SVG_OPEN('flow')}
  <g class="art__line">
    <circle cx="36" cy="100" r="22"/>
    <path d="M29 92V108L44 100Z"/>
    <path d="M58 100H111"/>
    <path d="M104 94L111 100L104 106"/>
    <path d="M160 55L205 100L160 145L115 100Z"/>
    <path d="M205 100H258"/>
    <path d="M251 94L258 100L251 106"/>
    <rect x="258" y="73" width="50" height="54" rx="7"/>
    <path d="M270 91H296M270 102H290M270 113H284"/>
    <path d="M160 145V174H258"/>
    <circle cx="160" cy="174" r="3"/><circle cx="258" cy="174" r="3"/>
  </g>
  <g class="art__active">
    <path class="art__spark" d="M58 100H111M115 100L160 55L205 100H258"/>
    <path d="M251 94L258 100L251 106"/>
    <circle class="art__pip" cx="160" cy="55" r="4"/>
  </g>
</svg>`;

/** Security: an access ledger is checked across a verification boundary. */
const artSecurity = () => `${SVG_OPEN('security')}
  <g class="art__line">
    <rect x="14" y="22" width="186" height="156" rx="8"/>
    <path d="M14 52H200M60 52V178M150 52V178"/>
    <path d="M28 38H102"/>
    <circle cx="37" cy="73" r="6"/><path d="M51 73H96M164 73H184"/>
    <circle cx="37" cy="101" r="6"/><path d="M51 101H111M164 101H184"/>
    <circle cx="37" cy="129" r="6"/><path d="M51 129H88M164 129H184"/>
    <circle cx="37" cy="157" r="6"/><path d="M51 157H104M164 157H184"/>
    <path d="M238 40V160"/>
    <path d="M238 40C276 40 300 64 300 100S276 160 238 160"/>
  </g>
  <g class="art__active">
    <path class="art__spark" d="M164 101H225"/>
    <path d="M218 95L225 101L218 107"/>
    <circle class="art__pip" cx="267" cy="101" r="21"/>
    <path d="M258 101L265 108L278 93"/>
  </g>
</svg>`;

/** Custom app: the same task moves between a desktop queue and mobile action. */
const artApp = () => `${SVG_OPEN('app')}
  <g class="art__line">
    <rect x="12" y="24" width="202" height="142" rx="8"/>
    <path d="M12 48H214M64 48V166"/>
    <path d="M27 67H50M27 83H45M27 99H52"/>
    <path d="M82 67H139M82 83H184"/>
    <rect x="82" y="101" width="104" height="42" rx="6"/>
    <path d="M95 114H153M95 130H138"/>
    <path d="M95 178H132M160 178H198"/>
    <rect x="232" y="12" width="76" height="176" rx="13"/>
    <path d="M257 27H283M246 58H294M246 74H282"/>
    <rect x="246" y="96" width="48" height="48" rx="6"/>
    <path d="M251 173H289"/>
  </g>
  <g class="art__active">
    <path class="art__spark" d="M186 122C221 122 218 120 246 120"/>
    <path d="M239 114L246 120L239 126"/>
    <circle class="art__pip" cx="270" cy="120" r="14"/>
    <path d="M263 120L268 125L278 114"/>
  </g>
</svg>`;

const ART = { saas: artSaas, flow: artFlow, security: artSecurity, app: artApp };

/** Look up a capability drawing by key. Unknown keys render nothing. */
export const capabilityArt = (key) => (ART[key] ? ART[key]() : '');
