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

expect(!/--violet:|--teal:|--amber:|--rose:/.test(styles), 'Arbitrary accent tokens remain.');
expect(!/body::after/.test(styles), 'Fixed paper-grain overlay remains.');
expect(!/radial-gradient\(rgba\(21, 23, 29/.test(styles), 'Site-wide dot grid remains.');
expect(!/border-radius:\s*999/.test(styles), 'Unbounded pill radius remains outside explicit controls.');
expect(
  /--blue:\s*#1d77fe;/.test(styles) &&
    /--space-8:\s*7rem;/.test(styles) &&
    /--control-radius:\s*10px;/.test(styles),
  'The shared colour, spacing, and control-radius tokens are incomplete.'
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
expect(/\.empty-state__inner\s*\{/.test(styles), 'Empty states need a deliberate composed treatment.');
expect(
  !/<span aria-hidden="true">&rarr;<\/span>/.test(`${sections}\n${showcase}`),
  'Inline links must use the shared CSS arrow instead of literal arrow spans.'
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
  expect(/class="[^"]*\bempty-state\b[^"]*"/.test(html), `${route} must render one honest empty state.`);
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
