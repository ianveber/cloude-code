#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const read = (file) => readFile(path.join(ROOT, file), 'utf8');
const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const home = await read('dist/index.html');
const styles = await read('src/styles.css');
const layout = await read('src/layout.mjs');
const sections = await read('src/sections.mjs');
const showcase = await read('src/showcase.mjs');
const htmlHelpers = await read('src/html.mjs');
const decorSource = await read('src/decor.mjs');
const motion = await read('public/js/motion.js');
const build = await read('build.mjs');
const content = await read('content/content.mjs');
const showcaseContent = await read('content/showcase.mjs');
const siteConfig = await read('content/site.mjs');
const pages = {
  home,
  products: await read('dist/produkti/index.html'),
  news: await read('dist/novice/index.html'),
  events: await read('dist/dogodki/index.html'),
  blog: await read('dist/blog/index.html'),
};
const allHtml = Object.values(pages).join('\n');
const componentMarkup = `${layout}\n${sections}\n${showcase}`;

expect(!/--violet:|--teal:|--amber:|--rose:/.test(styles), 'Arbitrary accent tokens remain.');
const codeGlow = await read('src/code-glow.html');
expect(
  Object.values(pages).every((html) => html.includes(codeGlow) && /<body>\n<!--\n  Code Glow Background/.test(html)) &&
    /^main,\n\.breadcrumbs,\n\.site-footer \{\n  position: relative;\n  z-index: 1;\n\}/m.test(styles),
  'Code-glow background must be included verbatim right after <body> on every page, with the page content lifted above it.'
);
expect(!/body::after/.test(styles), 'Fixed paper-grain overlay remains.');
expect(
  /class="depth" aria-hidden="true"/.test(home) &&
    /\.depth\s*\{[^}]*z-index:\s*-1;/s.test(styles) &&
    ![...styles.matchAll(/rgba\(111, 127, 156, (0?\.\d+)\)/g)].some((m) => parseFloat(m[1]) > 0.14),
  'Depth layer must exist, sit behind the page and stay faint (alpha ≤ 0.14).'
);
expect(
  /--brain-blue:\s*#1d77fe;/.test(styles) && /\.text-blue\s*\{\s*color:\s*var\(--blue\);\s*\}/.test(styles),
  'Accents are AIS blue, the same blue as the mark.'
);
expect(
  /class="section faq faq--dark"/.test(home) && /class="faq__panel"/.test(home),
  'Home FAQ must sit in the dark panel.'
);
expect(!/radial-gradient\(rgba\(21, 23, 29/.test(styles), 'Site-wide dot grid remains.');
expect(!/border-radius:\s*999/.test(styles), 'Unbounded pill radius remains outside explicit controls.');
expect(
  /--blue:\s*#1d77fe;/.test(styles) &&
    /--control-radius:\s*100px;/.test(styles),
  'The shared colour, spacing, and control-radius tokens are incomplete.'
);
const spacingTokens = [...styles.matchAll(/--space-\d+:\s*[^;]+;/g)].map(
  ([declaration]) => declaration.match(/--space-\d+/)[0]
);
const spacingUses = spacingTokens.map(
  (token) => (styles.match(new RegExp(`var\\(${token}\\)`, 'g')) ?? []).length
);
expect(
  spacingTokens.length >= 5 &&
    spacingUses.every((count) => count > 0) &&
    spacingUses.reduce((sum, count) => sum + count, 0) >= 65,
  'Spacing tokens must be meaningfully adopted; declaration-only tokens remain.'
);
expect(/body\s*\{[^}]*background:\s*var\(--paper\);/s.test(styles), 'Body must use the paper token.');
expect(
  !/var\(--(?:violet|teal|amber|rose)(?:-wash)?\)/.test(styles),
  'Legacy accent references remain in the stylesheet.'
);
expect(
  !/accent:\s*'(?!blue)[^']+'/.test([content, showcaseContent, sections, build].join('\n')),
  'Content or section accents still diverge from AIS blue.'
);
expect(/class="nav-toggle__icon"/.test(layout), 'Mobile navigation needs the composed menu icon.');
expect(/class="faq-item__icon"/.test(sections), 'FAQ disclosures need an explicit affordance.');
expect(
  /class="shell empty-state__shell"[\s\S]*class="empty-state__inner"/.test(showcase),
  'Empty-state gutters and card composition must use separate elements.'
);
expect(
  /\/\* [^*]*gutter wrapper[^*]*independent card[^*]*\*\//i.test(showcase),
  'Empty-state shell needs a narrow source comment explaining its gutter role.'
);
expect(
  !/(?:&(?:rarr|nearr|uarr|#8599|#x2197);|[→↗])/u.test(componentMarkup),
  'Inline links must use the shared CSS arrow instead of literal arrow spans.'
);
expect(
  !/\.link::after/.test(styles) && !/border-bottom/.test(styles.match(/\.link \{[^}]*\}/)?.[0] ?? ''),
  'Inline links are pills: no arrow glyph, no underline rule.'
);
expect(
  !/border(?:-top|-bottom|-left|-right)?:\s*[\d.]+px\s+(?:solid|dashed)\s+(?!transparent)/.test(styles) &&
    !/<hr\b/.test(componentMarkup),
  'Visible borders or rules remain; the site uses soft fills and spacing instead.'
);
expect(
  !/[—–]/.test(allHtml.replace(/<script[\s\S]*?<\/script>/g, '')),
  'Dashes remain in rendered copy.'
);
expect(
  siteConfig.includes(
    "blurb: 'Programska oprema in avtomatizacija za delo, ki ne bi smelo ostati ročno.'"
  ) && siteConfig.includes("wordmark: 'AI Slovenia'"),
  'Footer must use the approved factual brand statement and the AI Slovenia wordmark.'
);
expect(
  /class="footer-people"/.test(home) &&
    /mailto:info@ais-slovenia\.si/.test(home) &&
    /tel:\+38670717087/.test(home),
  'Footer must print the team, the public inbox and the phone number.'
);
expect(
  !/export function (?:useCaseSlider|statsSection)/.test(sections) &&
    !/export function (?:caseStudiesBand|convergeBand|capabilityBand)/.test(showcase),
  'Dormant slider, stats, converge, or capability exports remain.'
);
expect(
  /export function clientsLine/.test(showcase) &&
    /export const clients = \{[\s\S]*items: \[[\s\S]*name:[\s\S]*logo: \{ src: '\/clients\//.test(showcaseContent) &&
    !/export const clients = \{[\s\S]*?body:/.test(showcaseContent.split('/* ── Three pillars')[0].split('export const clients')[1] ?? '') &&
    /class="marquee marquee--reverse"/.test(home) &&
    /class="client__logo"/.test(home) && !/class="client__body"/.test(home),
  'Clients must be two opposite marquee rows of logo + name pills, without descriptions.'
);
expect(
  /export function pillarsSection/.test(showcase) &&
    /\/pictures\/(?:saas|flow|security)/.test(showcaseContent) &&
    /<source srcset="[^"]+\.webp" type="image\/webp">/.test(showcase),
  'Pillars must render the three rendered product pictures with a webp source.'
);
expect(
  !/\baccentMod\b/.test(`${htmlHelpers}\n${sections}\n${showcase}`) &&
    !/--(?:cap|prod|news|ev)-accent/.test(styles),
  'Dead accent modifiers or custom accent properties remain.'
);
expect(
  !/\b(?:DRAWINGS|decorSprite|drawNetwork|drawBlueprint)\b/.test(decorSource) &&
    !/export function decor\b/.test(decorSource) &&
    !/\.decor(?:__|[\s,.{])/.test(styles),
  'Unreachable decorative drawing infrastructure remains.'
);
expect(
  /--success-ink:\s*#166534;/.test(styles) &&
    /--success-bg:\s*#f0fdf4;/.test(styles) &&
    /--error-ink:\s*#991b1b;/.test(styles) &&
    /--error-bg:\s*#fef2f2;/.test(styles) &&
    /\.form__status--ok\s*\{[^}]*var\(--success-ink\)[^}]*var\(--success-bg\)/s.test(styles) &&
    /\.form__status--error\s*\{[^}]*var\(--error-ink\)[^}]*var\(--error-bg\)/s.test(styles),
  'Form statuses need explicit semantic success and error tokens.'
);
expect(
  /--shadow-base:/.test(styles) &&
    /--shadow-card:/.test(styles) &&
    /--shadow-card-hover:/.test(styles) &&
    /--shadow-popover:/.test(styles) &&
    !/--shadow-raised/.test(styles),
  'Base, card, hover, and popover elevations must use distinct shadow tokens.'
);
expect(!/section--paper/.test(`${styles}\n${componentMarkup}\n${build}`), 'No-op section--paper remains.');
expect(
  /\.nav-dd__panel \.nav-dd__all:hover\s*\{[^}]*var\(--blue-soft\)/s.test(styles),
  'The dropdown overview link needs a distinct hover state.'
);
expect(
  !/\.gradient-text\b/.test(`${styles}\n${motion}`) &&
    /\.text-blue\b/.test(styles) &&
    /hero__line text-blue/.test(motion),
  'The flat-blue hero class must use an accurate name.'
);
expect(/\.btn:disabled\s*\{[^}]*cursor:\s*not-allowed;/s.test(styles), 'Disabled controls need a not-allowed cursor.');
expect(
  /\.footer-nav\s*\{[^}]*repeat\(auto-fit,/s.test(styles),
  'Footer navigation columns must adapt with auto-fit.'
);
expect(
  /\.nav a\s*\{[^}]*min-height:\s*44px;/s.test(styles) &&
    /\.nav-dd > summary\s*\{[^}]*min-height:\s*44px;/s.test(styles),
  'Desktop navigation targets must be at least 44px high.'
);
expect(
  /\.process-overview \.card\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;/s.test(styles) &&
    /\.process-overview \.card \.link\s*\{[^}]*margin-top:\s*auto;/s.test(styles) &&
    !/\.process-overview \.card \.link\s*\{[^}]*justify-self:/s.test(styles) &&
    !/\.process-overview \.card\s*\{[^}]*grid-template-rows:/s.test(styles),
  'Process overview cards must use an intentional vertical layout with bottom-aligned links.'
);
expect(
  !/--radius-sm:|var\(--radius-sm\)/.test(styles) &&
    /--radius:\s*24px;/.test(styles) &&
    /--panel-radius:\s*28px;/.test(styles) &&
    /--control-radius:\s*100px;/.test(styles),
  'Tile, panel and control radii must use three distinct tokens.'
);
expect(
  /\.build__screen\.is-left\s*\{/.test(styles) &&
    /\.build__screen\.is-right\s*\{/.test(styles) &&
    /\.build__screen\.is-active\s*\{/.test(styles) &&
    /class="build__screen is-active"/.test(home) &&
    /class="build__screen is-left"/.test(home) &&
    /class="build__screen is-right"/.test(home),
  'Build stage must ship its first pose in HTML so it reads without JS.'
);
expect(
  /@media \(max-width: 768px\)[\s\S]*\.build__screen\.is-right\s*\{[^}]*position:\s*static;/.test(styles),
  'Build stage must stack its screens on small screens.'
);
expect(
  !/function (?:particles|bouncers|cursor|magnetic)\(/.test(motion) &&
    !/\b(?:particles|bouncers|cursor|magnetic)\(\)/.test(motion) &&
    !/data-particles/.test(componentMarkup) &&
    !/\.cursor\s*\{/.test(styles) &&
    !/\.bouncers\s*\{/.test(styles),
  'Ornamental particles, bouncers, cursor, and magnetic motion must be removed.'
);
expect(
  /at\(100,/.test(motion) && /at\(700,/.test(motion) && /at\(3100,/.test(motion) &&
    /typeInto\(brand, 110,/.test(motion) && /typeInto\(tail, 75,/.test(motion),
  'Intro must show the brain at 100 ms, type by 700 ms at 110 / 75 ms per character, and open at 3100 ms.'
);
expect(
  !/ctaField|data-cta-field/.test(`${motion}\n${showcase}`),
  'The CTA canvas field was removed on purpose; the panel uses a static glow.'
);
expect(
  /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*animation-iteration-count:\s*1 !important;[\s\S]*\[data-enter\][\s\S]*opacity:\s*1 !important;/.test(styles),
  'Reduced-motion CSS must force visible copy.'
);

const twinButtons = [...pages.products.matchAll(
  /<article class="twin__card"[\s\S]*?<a class="btn (btn--(?:primary|secondary))"/g
)].map((match) => match[1]);
expect(
  twinButtons.length === 2 &&
    twinButtons[0] === 'btn--primary' &&
    twinButtons[1] === 'btn--secondary',
  'Twin CTA cards must render primary then secondary button hierarchy.'
);

expect(
  /<symbol id="brain-shape"/.test(home) &&
    /class="brand-brain__face"[^>]*><use href="#brain-shape"\/>/.test(home) &&
    /class="brand-brain__layer"/.test(home) &&
    /class="brand-brain__core"/.test(home) &&
    !/brain-light\.png|favicon\.png"[^>]*data-brand-brain/.test(home),
  'Hero must build the 3D brain from the traced vector mark with depth slices and a white core.'
);
expect(
  /--silhouette:\s*url\('\/brand\/brain-solid\.svg'\)/.test(styles) &&
    /\.brand-brain__rig\s*\{[^}]*--tilt-x:\s*58deg;[^}]*--tilt-z:\s*-30deg;/s.test(styles),
  'Hero brain must lie at the approved tilt and mask its slab with the solid silhouette.'
);
expect(
  /data-intro-brand[^>]+data-text="AIS"/.test(home) &&
    /data-intro-tail[^>]+data-text="Slovenia"/.test(home) &&
    /data-intro-caret/.test(home),
  'Intro must type the brand name next to the mark with a caret.'
);
expect(!/brain3d__slice|class="brain-mark/.test(home), 'Generated home still contains invented brain SVG.');
expect(
  /\.intro__mark img\s*\{/.test(styles) &&
    /\.intro__ghost\s*\{\s*visibility:\s*hidden;/.test(styles) &&
    !/\.intro__mark\s*\{[^}]*box-shadow/s.test(styles),
  'Intro must show the bare brain and the typed wordmark must reserve its width.'
);
expect(!/mix-blend-mode/.test(styles), 'No blend modes in the stylesheet.');
expect(
  /showIntro:\s*true/.test(build) &&
    /page\.showIntro\s*\?\s*introOverlay\(\)\s*:\s*''/.test(layout) &&
    !/\bintro:/.test(content),
  'Intro must use a boolean page flag and call introOverlay without a string payload.'
);
expect(!/\blogoDark:/.test(siteConfig), 'Unused site.brand.logoDark must not remain configured.');

for (const forbidden of [
  'Partner 01',
  'Mesto rezervirano',
  '1,2 mio+',
  '340 %',
  'Obdelava dokumentov zdaj usklajuje tudi dobavnice',
  'Zmapirajte svoj proces v treh urah',
  'Prostor za naslednji zapis',
]) {
  expect(!allHtml.includes(forbidden), `Fabricated or placeholder content remains: ${forbidden}`);
}
expect(
  !/"totalTime"\s*:\s*"P10W"/.test(allHtml),
  'Fabricated or placeholder content remains: HowTo totalTime P10W'
);

for (const [route, html] of Object.entries({
  news: pages.news,
  events: pages.events,
  blog: pages.blog,
})) {
  const emptyStates = html.match(/class="[^"]*\bempty-state\b[^"]*"/g) ?? [];
  expect(emptyStates.length === 1, `${route} must render exactly one honest empty state.`);
}
expect(
  !/\bempty-state\b/.test(pages.products) &&
    (pages.products.match(/class="project" id="/g) ?? []).length >= 6 &&
    /\/pictures\/(?:athlos|ais-command|aisos|inspectus-vldr|inspectus-vin|model-premazi|pacom|zalife)\.webp/.test(pages.products),
  'Products page must list the real products and projects with rendered demo screens.'
);

const order = [
  'data-intro-stage',
  'data-intro',
  'data-build',
  'data-clients',
  'data-pillars',
  'data-products',
  'team-band',
  'blog-band',
  'pogosta-vprasanja',
  'povprasevanje',
  'data-footer-mark',
];
let cursor = -1;
for (const marker of order) {
  const next = home.indexOf(marker, cursor + 1);
  expect(next > cursor, `Home marker is missing or out of order: ${marker}`);
  cursor = next;
}

if (failures.length) {
  failures.forEach((failure) => console.error(`DESIGN ERROR: ${failure}`));
  process.exit(1);
}

console.log('Design audit: brand source is exact.');
