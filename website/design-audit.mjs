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
const art = await read('src/art.mjs');
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
expect(!/body::after/.test(styles), 'Fixed paper-grain overlay remains.');
expect(!/radial-gradient\(rgba\(21, 23, 29/.test(styles), 'Site-wide dot grid remains.');
expect(!/border-radius:\s*999/.test(styles), 'Unbounded pill radius remains outside explicit controls.');
expect(
  /--blue:\s*#1d77fe;/.test(styles) &&
    /--control-radius:\s*10px;/.test(styles),
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
expect(/class="[^"]*\bprocess-overview\b/.test(home), 'Home process overview needs its visual-system class.');
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
  /\.link::after\s*\{[^}]*content:\s*'↗';/s.test(styles),
  'Inline links must retain the shared CSS arrow glyph.'
);
expect(
  siteConfig.includes(
    "blurb: 'Programska oprema in avtomatizacija za delo, ki ne bi smelo ostati ročno.'"
  ),
  'Footer must use the approved factual brand statement.'
);
expect(
  !/export function (?:useCaseSlider|statsSection)/.test(sections) &&
    !/export function caseStudiesBand/.test(showcase) &&
    !/export const caseStudies/.test(showcaseContent),
  'Dormant slider, stats, or case-study exports remain.'
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
    /--radius:\s*16px;/.test(styles) &&
    /--control-radius:\s*10px;/.test(styles),
  'Card and control radii must use two distinct, non-duplicated tokens.'
);
expect(
  /\.converge\s*\{[^}]*--settled:\s*1;/.test(styles) &&
    /html\.motion-on \.converge\s*\{[^}]*--settled:\s*0;/.test(styles),
  'Converge settled default must stay readable without JS and start at 0 for JS motion.'
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
  /at\(100,/.test(motion) && /at\(720,/.test(motion) && /at\(1900,/.test(motion) &&
    !/at\(120,/.test(motion) && !/at\(900,/.test(motion) && !/at\(2350,/.test(motion),
  'Intro must use the restrained 100 / 720 / 1900 ms stages.'
);
expect(
  /Math\.min\(window\.devicePixelRatio[^,]*, 1\.5\)/.test(motion) &&
    !/rgba\(139,\s*115,\s*255|rgba\(43,\s*212,\s*196/.test(motion),
  'CTA field must cap device pixel ratio at 1.5 and stay AIS-blue/neutral.'
);
expect(
  /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*animation-iteration-count:\s*1 !important;[\s\S]*\[data-enter\][\s\S]*\.readline__w[\s\S]*\.ctaband__field\s*\{\s*display:\s*none;/.test(styles),
  'Reduced-motion CSS must force visible copy and hide the CTA field.'
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
  /data-brand-brain[^>]+src="\/brand\/favicon\.png"/.test(home),
  'Hero must use the official /brand/favicon.png brain.'
);
expect(
  /data-brand-lockup[^>]+src="\/brand\/logo-light\.png"/.test(home),
  'Intro must reveal the official light-background lockup.'
);
expect(!/brain3d__slice|class="brain-mark/.test(home), 'Generated home still contains invented brain SVG.');
expect(!/BRAIN_SILHOUETTE|brainMark|brainSlice/.test(art), 'src/art.mjs still defines invented brand art.');
expect(
  /\.hero__intro-brain img\s*\{[^}]*width:\s*41\.7%;/s.test(styles),
  'Intro brain must match the official lockup glyph footprint (41.7%).'
);
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
  products: pages.products,
  news: pages.news,
  events: pages.events,
  blog: pages.blog,
})) {
  const emptyStates = html.match(/class="[^"]*\bempty-state\b[^"]*"/g) ?? [];
  expect(emptyStates.length === 1, `${route} must render exactly one honest empty state.`);
}

const order = [
  'data-intro',
  'data-converge',
  'data-capband',
  'data-services',
  'data-process-overview',
  'team-band',
  'pogosta-vprasanja',
  'povprasevanje',
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
