# AIS Slovenia Website Solidification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the inaccurate hero artwork with the exact AIS brain mark and
refine the complete static site into a coherent, truthful, deliberately authored
product experience.

**Architecture:** Keep the existing static generator and its separation between
content, layout, reusable sections, home-specific sections, illustration, motion,
and CSS. Add one source-level/generated-output design audit so brand fidelity and
truthful empty states become testable rather than subjective. JavaScript remains
progressive enhancement; the complete site must work from generated HTML and CSS.

**Tech Stack:** Node.js ES modules, static HTML generation, CSS, browser-native
JavaScript, inline SVG for non-brand illustrations, PNG brand assets,
`puppeteer-core`, Chrome, ffmpeg.

## Global Constraints

- Use `website/public/brand/favicon.png` as the exact standalone brain mark.
- Use `website/public/brand/logo-light.png` as the light-background lockup.
- Use `website/public/brand/logo.png` only on a genuinely dark background.
- Only the brain receives the chosen option-3 dimensional treatment: 30° CSS
  perspective tilt, restrained edge cue, and directional shadow.
- Do not recreate, trace, simplify, or invent any logo geometry.
- Keep the AIS Slovenia wordmark flat.
- Buttons remain black or ghost/outlined.
- Keep all indexable copy in the generated HTML.
- Keep the site usable without JavaScript.
- Honour `prefers-reduced-motion`.
- Remove fabricated partner, product, metric, news, event, and blog claims.
- Use Antigravity only as inspiration for information rhythm and motion restraint;
  do not copy its assets, exact layouts, typography, or branded motion.
- Commit each task separately and push after each task.

## File Structure

### Create

- `website/design-audit.mjs` — asserts brand fidelity, honest content, home-page
  ordering, and forbidden template residue in generated HTML/source CSS.

### Modify

- `website/package.json` — includes the design audit in `npm run check`.
- `website/content/site.mjs` — authoritative brand dimensions and restrained
  footer copy.
- `website/content/content.mjs` — hero support copy, unified accents, process
  phases, and removal of unsupported metrics.
- `website/content/showcase.mjs` — honest empty data and concise home narratives.
- `website/build.mjs` — revised home order and truthful supporting pages.
- `website/src/art.mjs` — removes invented brand art and keeps only coherent
  non-brand capability illustrations.
- `website/src/showcase.mjs` — exact-image intro/hero, conditional proof/editorial
  output, honest empty states, team and CTA markup.
- `website/src/sections.mjs` — consolidated services, process phases, page heroes,
  FAQ affordance, and form markup.
- `website/src/layout.mjs` — refined header, mobile-menu icon, footer, and brand
  lockup usage.
- `website/src/styles.css` — reduced tokens, stable grid/rhythm, section-specific
  composition, controls, responsive behaviour, and reduced motion.
- `website/public/js/motion.js` — removes ornamental effects and constrains
  meaningful motion.
- `website/render-check.mjs` — covers every generated page plus interaction and
  reduced-motion invariants.
- `website/tools/shots.mjs` — captures the revised page sequence.
- `website/tools/walkthrough.mjs` — records the revised sequence and final CTA.
- `website/README.md` — documents brand sources, honest empty states, and checks.

---

### Task 1: Lock Brand Fidelity Into a Failing Test, Then Correct the Intro and Hero

**Files:**
- Create: `website/design-audit.mjs`
- Modify: `website/package.json`
- Modify: `website/content/site.mjs`
- Modify: `website/content/content.mjs`
- Modify: `website/src/showcase.mjs`
- Modify: `website/src/art.mjs`
- Modify: `website/src/styles.css`
- Modify: `website/public/js/motion.js`

**Interfaces:**
- Consumes: `site.brand.logo`, `site.brand.favicon`, `site.brand.logoWidth`,
  `site.brand.logoHeight`
- Produces: `site.brand.brain`, `site.brand.brainWidth`,
  `site.brand.brainHeight`; generated `[data-brand-brain]`; generated
  `[data-brand-lockup]`

- [ ] **Step 1: Add a brand-fidelity audit that fails on the invented SVG**

Create `website/design-audit.mjs`:

```js
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

if (failures.length) {
  failures.forEach((failure) => console.error(`DESIGN ERROR: ${failure}`));
  process.exit(1);
}

console.log('Design audit: brand source is exact.');
```

- [ ] **Step 2: Build and run the new audit to prove it fails**

Run:

```bash
cd /workspace/website
node build.mjs
node design-audit.mjs
```

Expected: non-zero exit with all four brand errors.

- [ ] **Step 3: Make the brand paths explicit in site configuration**

Change `site.brand` in `website/content/site.mjs` to:

```js
brand: {
  logo: '/brand/logo-light.png',
  logoWidth: 133,
  logoHeight: 52,
  logoDark: '/brand/logo.png',
  brain: '/brand/favicon.png',
  brainWidth: 302,
  brainHeight: 302,
  favicon: '/brand/favicon.png',
  ogImage: '/brand/og-default.png',
},
```

- [ ] **Step 4: Give the hero a complete static content contract**

Change `hero` in `website/content/content.mjs` to:

```js
export const hero = {
  headline: 'AI avtomatizacija. Hitrejši procesi.',
  seoHeadline: 'AI avtomatizacija za podjetja. Hitrejši procesi in manj ročnega dela.',
  lead: 'Načrtujemo in gradimo programske sisteme, ki prevzamejo ponavljajoče se delo.',
  primary: { label: 'Rezervirajte posvet', href: '/kontakt/' },
  secondary: { label: 'Poglejte izdelke', href: '/produkti/' },
  intro: 'AIS Slovenia',
};
```

- [ ] **Step 5: Replace the invented intro and hero markup with official images**

In `website/src/showcase.mjs`, remove `brainMark`, `brainSlice`, and
`BRAIN_DEPTH`. Keep only `capabilityArt` from `art.mjs`.

Implement these contracts:

```js
export function introOverlay() {
  return `
<div class="hero__intro" data-intro-stage aria-hidden="true">
  <span class="hero__intro-brain">
    <img data-brand-brain src="${esc(site.brand.brain)}" alt=""
      width="${site.brand.brainWidth}" height="${site.brand.brainHeight}">
  </span>
  <img class="hero__intro-lockup" data-brand-lockup
    src="${esc(site.brand.logo)}" alt=""
    width="${site.brand.logoWidth}" height="${site.brand.logoHeight}">
</div>`;
}

export function brainHero(data) {
  return `
<section class="hero hero--brain" data-intro>
  <div class="shell hero__grid">
    <div class="hero__copy">
      <h1 data-type-in>${esc(data.headline)}</h1>
      <p class="hero__lead" data-enter="1">${esc(data.lead)}</p>
      <div class="btn-row" data-enter="2">
        <a class="btn btn--primary" href="${esc(data.primary.href)}">${esc(data.primary.label)}</a>
        <a class="btn btn--secondary" href="${esc(data.secondary.href)}">${esc(data.secondary.label)}</a>
      </div>
    </div>
    <div class="hero__art" aria-hidden="true">
      <div class="brand-brain" data-brain>
        <div class="brand-brain__rig">
          <span class="brand-brain__edge"></span>
          <img data-brand-brain src="${esc(site.brand.brain)}" alt=""
            width="${site.brand.brainWidth}" height="${site.brand.brainHeight}">
          <span class="brand-brain__shadow"></span>
        </div>
      </div>
    </div>
  </div>
</section>`;
}
```

Call it with `brainHero(C.hero)` in `build.mjs`.

- [ ] **Step 6: Remove invented brand exports from `art.mjs`**

Delete `BRAIN_SILHOUETTE`, `BRAIN_SPINE`, `BRAIN_CIRCUIT`, `BRAIN_FOLDS`,
`brainMark`, and `brainSlice`. The file starts with the capability-art section.

- [ ] **Step 7: Implement the option-3 dimensional treatment**

Replace the `.brain3d*` and `.brain-mark*` CSS blocks with:

```css
.brand-brain {
  display: grid;
  min-height: 24rem;
  place-items: center;
  perspective: 1100px;
}

.brand-brain__rig {
  --tilt-x: 58deg;
  --tilt-z: -30deg;
  --pointer-x: 0deg;
  --pointer-y: 0deg;
  position: relative;
  width: min(21rem, 72vw);
  aspect-ratio: 1;
  transform:
    rotateX(calc(var(--tilt-x) + var(--pointer-y)))
    rotateZ(calc(var(--tilt-z) + var(--pointer-x)));
  transform-style: preserve-3d;
  transition: transform 500ms cubic-bezier(.2,.8,.2,1);
}

.brand-brain__rig > img,
.brand-brain__edge {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.brand-brain__rig > img {
  z-index: 2;
  object-fit: contain;
  filter: drop-shadow(0 2px 1px rgba(7, 15, 31, .12));
}

.brand-brain__edge {
  z-index: 1;
  background: url('/brand/favicon.png') center / contain no-repeat;
  filter: saturate(1.1) drop-shadow(0 8px 0 rgba(29, 119, 254, .34));
  transform: translate3d(0, 8px, -1px);
}

.brand-brain__shadow {
  position: absolute;
  inset: 20% 9% 2%;
  z-index: 0;
  border-radius: 50%;
  background: rgba(10, 21, 43, .18);
  filter: blur(28px);
  transform: translate3d(26px, 42px, -20px) rotateX(-58deg);
}
```

Style the intro so the standalone official mark occupies the same optical
position as the brain in the lockup, then crossfade to `logo-light.png`.

- [ ] **Step 8: Constrain pointer movement instead of faking more geometry**

Update `brainTilt()` in `motion.js` to target `.brand-brain__rig` and set:

```js
rig.style.setProperty('--pointer-y', (-py * 3).toFixed(2) + 'deg');
rig.style.setProperty('--pointer-x', (px * 3).toFixed(2) + 'deg');
```

Reset both properties to `0deg` on pointer leave.

- [ ] **Step 9: Make the audit pass and wire it into the check command**

Run:

```bash
cd /workspace/website
node build.mjs
node design-audit.mjs
```

Expected: `Design audit: brand source is exact.`

Then change `package.json`:

```json
"check": "node build.mjs && node audit.mjs && node design-audit.mjs && node render-check.mjs"
```

- [ ] **Step 10: Commit and push**

```bash
git add website/package.json website/design-audit.mjs website/content/site.mjs \
  website/content/content.mjs website/src/showcase.mjs website/src/art.mjs \
  website/src/styles.css website/public/js/motion.js website/build.mjs
git commit -m "Use the exact AIS brain in the intro and hero"
git push -u origin cursor/ais-website-geo-seo-redesign-112a
```

---

### Task 2: Remove Fabricated Content and Rebuild the Home-Page Sequence

**Files:**
- Modify: `website/design-audit.mjs`
- Modify: `website/content/showcase.mjs`
- Modify: `website/content/content.mjs`
- Modify: `website/build.mjs`
- Modify: `website/src/showcase.mjs`
- Modify: `website/src/sections.mjs`

**Interfaces:**
- Consumes: empty `partners`, `products.items`, `news.items`, `events.items`,
  `blog.items`
- Produces: `emptyState({ id, eyebrow, title, body, action })`;
  `processOverview(meta, phases)`; conditional empty-string output from
  `caseStudiesBand()` and `blogTeaser()`

- [ ] **Step 1: Extend the audit with content-truth and sequence checks**

Add to `design-audit.mjs`:

```js
const pages = {
  home,
  products: await read('dist/produkti/index.html'),
  news: await read('dist/novice/index.html'),
  events: await read('dist/dogodki/index.html'),
  blog: await read('dist/blog/index.html'),
};
const allHtml = Object.values(pages).join('\n');

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

for (const [route, html] of Object.entries({
  products: pages.products,
  news: pages.news,
  events: pages.events,
  blog: pages.blog,
})) {
  expect(html.includes('class="empty-state"'), `${route} must render one honest empty state.`);
}

const order = ['data-intro', 'data-converge', 'data-capband', 'data-services', 'data-process-overview',
  'team-band', 'pogosta-vprasanja', 'povprasevanje'];
let cursor = -1;
for (const marker of order) {
  const next = home.indexOf(marker);
  expect(next > cursor, `Home marker is missing or out of order: ${marker}`);
  cursor = next;
}
```

- [ ] **Step 2: Prove the content audit fails on the current output**

Run:

```bash
cd /workspace/website
node build.mjs && node design-audit.mjs
```

Expected: failures for placeholders, fabricated entries, empty-state absence, and
home ordering.

- [ ] **Step 3: Replace unsupported showcase data with honest empty arrays**

In `content/showcase.mjs`:

```js
export const caseStudies = {
  eyebrow: 'Reference',
  title: 'Izbrana sodelovanja',
  lead: 'Reference objavimo, ko so potrjene za javno predstavitev.',
  partners: [],
};
```

Set `products.items`, `news.items`, `events.items`, and `blog.items` to `[]`.
Delete reserve-slot counts and fake dates/statuses. Give each page one factual
empty-state object:

```js
empty: {
  title: 'Vsebina je v pripravi',
  body: 'Objavili jo bomo, ko bo pripravljena in potrjena za javno predstavitev.',
  action: { label: 'Kontaktirajte nas', href: '/kontakt/' },
},
```

Use page-specific body copy that names the page, without claiming an unpublished
product, announcement, event, or article exists.

- [ ] **Step 4: Remove unsupported metrics and group the process into phases**

Delete the `stats` export from `content/content.mjs`.

Add:

```js
export const processPhases = [
  {
    number: '01',
    title: 'Razumemo',
    body: 'Proces razstavimo na delo, odločitve, izjeme in podatke.',
    href: '/proces/#razumevanje',
  },
  {
    number: '02',
    title: 'Načrtujemo',
    body: 'Določimo arhitekturo, odgovornosti sistema in merila uspeha.',
    href: '/proces/#nacrtovanje',
  },
  {
    number: '03',
    title: 'Zgradimo',
    body: 'Izdelamo prototip, ga preizkusimo in pripravimo za realno delo.',
    href: '/proces/#izvedba',
  },
  {
    number: '04',
    title: 'Izboljšujemo',
    body: 'Po uvedbi spremljamo rezultate in sistem prilagajamo dejanski uporabi.',
    href: '/proces/#izboljsevanje',
  },
];
```

Keep the expanded eight-step process page, but remove unsupported durations and
absolute claims such as “podpora 24/7” unless they are part of verified business
terms.

- [ ] **Step 5: Add one honest empty-state renderer**

In `src/showcase.mjs`:

```js
function emptyState(data, id) {
  return `
<section class="section empty-state" aria-labelledby="${esc(id)}">
  <div class="shell empty-state__inner">
    <p class="eyebrow">${esc(data.eyebrow)}</p>
    <h2 id="${esc(id)}">${esc(data.empty.title)}</h2>
    <p>${esc(data.empty.body)}</p>
    <a class="btn btn--secondary" href="${esc(data.empty.action.href)}">${esc(data.empty.action.label)}</a>
  </div>
</section>`;
}
```

Make `productGrid`, `newsList`, `eventList`, and `blogGrid` return `emptyState`
when `items.length === 0`. Remove slot-generating helpers and markup.

Make `caseStudiesBand(data)` return `''` when no partner has a real `logo`.
Make `blogTeaser(data)` return `''` when no real post exists.

- [ ] **Step 6: Render only actual team members**

Simplify `teamBand()`:

```js
const tiles = members.map((person, i) => `
  <li class="teamtile" style="--i:${i}">
    <img class="teamtile__photo" src="${esc(person.photo)}" alt="${esc(person.name)}"
      width="360" height="360" loading="lazy">
    <span class="teamtile__name">${esc(person.name)}</span>
    <span class="teamtile__role">${esc(person.role)}</span>
  </li>`).join('\n');
```

Delete `slots` and `placeholderNote` from `teamShowcase`.

- [ ] **Step 7: Consolidate and reorder the home page**

Make `homePage()` render:

```js
const body = [
  brainHero(C.hero),
  convergeBand(S.converge),
  capabilityBand(S.capabilities),
  featureExplorer(C.services),
  processOverview(C.processMeta, C.processPhases),
  teamBand(S.teamShowcase, C.team.members),
  faqSection(C.faq, { items: C.faq.items.slice(0, 5) }),
  blogTeaser(S.blog),
  immersiveCta(S.ctaBlock),
].join('\n');
```

Do not render `caseStudiesBand`, `useCaseSlider`, or `statsSection` while their
proof is absent or duplicated.

Add `data-services` to the explorer and `data-process-overview` to the compact
four-phase process component.

- [ ] **Step 8: Run static checks**

```bash
cd /workspace/website
npm run check
```

Expected: 15 pages, zero SEO/GEO errors or warnings, design audit passes, render
check passes.

- [ ] **Step 9: Commit and push**

```bash
git add website/design-audit.mjs website/content/showcase.mjs \
  website/content/content.mjs website/build.mjs website/src/showcase.mjs \
  website/src/sections.mjs
git commit -m "Replace placeholder claims with honest site content"
git push -u origin cursor/ais-website-geo-seo-redesign-112a
```

---

### Task 3: Establish One Visual System and Refine Global Chrome

**Files:**
- Modify: `website/design-audit.mjs`
- Modify: `website/src/styles.css`
- Modify: `website/src/layout.mjs`
- Modify: `website/content/site.mjs`
- Modify: `website/src/sections.mjs`
- Modify: `website/build.mjs`

**Interfaces:**
- Consumes: existing semantic section classes and `site.nav`
- Produces: `.nav-toggle__icon`, `.empty-state`, `.process-overview`,
  `.faq-item__icon`; one AIS-blue token and one spacing/radius system

- [ ] **Step 1: Add source-level visual-system assertions**

Add:

```js
const css = await read('src/styles.css');
expect(!/--violet:|--teal:|--amber:|--rose:/.test(css), 'Arbitrary accent tokens remain.');
expect(!/body::after/.test(css), 'Fixed paper-grain overlay remains.');
expect(!/radial-gradient\\(rgba\\(21, 23, 29/.test(css), 'Site-wide dot grid remains.');
expect(!/border-radius:\\s*999/.test(css), 'Unbounded pill radius remains outside explicit controls.');
```

Run `node build.mjs && node design-audit.mjs`.

Expected: failures for colour tokens, paper grain, dot grid, and pill controls.

- [ ] **Step 2: Replace the token block with a restrained system**

Use:

```css
:root {
  --ink: #111318;
  --ink-soft: #353a44;
  --muted: #69707d;
  --faint: #9299a5;
  --line: #e5e7eb;
  --line-strong: #cfd3da;
  --paper: #fff;
  --canvas: #f8f9fb;
  --blue: #1d77fe;
  --blue-soft: rgba(29, 119, 254, .10);
  --font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: ui-monospace, 'SFMono-Regular', Consolas, monospace;
  --text-xs: .75rem;
  --text-sm: .875rem;
  --text-base: 1rem;
  --text-lead: clamp(1.05rem, .98rem + .25vw, 1.2rem);
  --h3: clamp(1.2rem, 1.1rem + .35vw, 1.45rem);
  --h2: clamp(2.2rem, 1.55rem + 2.2vw, 3.6rem);
  --h1: clamp(3rem, 1.8rem + 4.4vw, 5.8rem);
  --shell: 1240px;
  --gutter: clamp(1.25rem, 4.2vw, 4.5rem);
  --space-1: .5rem;
  --space-2: .75rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2rem;
  --space-6: 3rem;
  --space-7: 4.5rem;
  --space-8: 7rem;
  --section-y: clamp(5rem, 10vw, 8.5rem);
  --radius: 16px;
  --radius-sm: 10px;
  --control-radius: 10px;
  --shadow-raised: 0 18px 50px rgba(17, 19, 24, .09);
}
```

Set the body to `background: var(--paper)` and remove the fixed grain, page-wide
dot grid, colour washes, and decorative sprite layers from visual output.

- [ ] **Step 3: Collapse accent modifiers onto AIS blue**

Replace violet/teal/amber/rose CSS variants with the same `--blue` behaviour or
remove selectors no longer used. Change content accents to `blue`. Preserve
semantic status labels without decorative colour cycling.

- [ ] **Step 4: Refine header and dropdown markup**

In `layout.mjs`, replace the mobile summary text-only control with:

```html
<summary aria-label="Odpri meni">
  <span>Meni</span>
  <span class="nav-toggle__icon" aria-hidden="true"><i></i><i></i></span>
</summary>
```

Keep `<details>` for no-JS operation. Style desktop dropdown links with 12–16px
padding, clear grouping, one border, restrained shadow, focus-visible state, and
no decorative colour.

- [ ] **Step 5: Refine buttons and links**

Use a 10px control radius rather than full pills. Set 44px minimum height.
Primary remains black-on-white or white-on-black; secondary remains transparent
with a neutral border. Use one custom CSS arrow treatment for inline links:

```css
.link::after {
  content: '↗';
  margin-left: .45em;
  transition: transform 180ms ease;
}
.link:hover::after { transform: translate(.16em, -.1em); }
```

Remove literal arrow spans from component markup.

- [ ] **Step 6: Balance the footer and replace generic copy**

Use a three-zone footer: brand statement, navigation groups, contact/legal.
Change the blurb to:

```js
blurb: 'Programska oprema in avtomatizacija za delo, ki ne bi smelo ostati ročno.',
```

Keep the actual current year from `site.copyrightYear`. Make email and telephone
visibly interactive.

- [ ] **Step 7: Add obvious FAQ affordance and robust form states**

Put `<span class="faq-item__icon" aria-hidden="true"></span>` in every FAQ
summary. Draw the plus/chevron in CSS and rotate it when open.

Standardize all labels, inputs, textarea, focus-visible rings, required
indicators, optional labels, status messages, and button heights.

- [ ] **Step 8: Run checks and inspect computed colours**

```bash
cd /workspace/website
npm run check
```

Expected: design audit passes; 15 pages pass SEO/GEO and render checks.

Use a browser evaluation to collect all non-neutral computed text/border colours.
Expected: AIS blue is the only decorative chromatic accent.

- [ ] **Step 9: Commit and push**

```bash
git add website/design-audit.mjs website/src/styles.css website/src/layout.mjs \
  website/content/site.mjs website/src/sections.mjs website/build.mjs
git commit -m "Unify the AIS visual system and global chrome"
git push -u origin cursor/ais-website-geo-seo-redesign-112a
```

---

### Task 4: Refine the Home Sections and Non-Brand Illustrations

**Files:**
- Modify: `website/src/art.mjs`
- Modify: `website/src/showcase.mjs`
- Modify: `website/src/sections.mjs`
- Modify: `website/src/styles.css`
- Modify: `website/content/showcase.mjs`
- Modify: `website/content/content.mjs`

**Interfaces:**
- Consumes: `capabilityArt(key)`, converge screen data, services, process phases
- Produces: one consistent line-art grammar and one dominant item per service
  viewport

- [ ] **Step 1: Add structural browser assertions to `render-check.mjs`**

Extend `findProblems()` to return:

```js
const tooDim = [...document.querySelectorAll('main h1, main h2, main h3, main p')]
  .filter((el) => visible(el) && parseFloat(getComputedStyle(el).opacity) < 0.45)
  .map((el) => el.textContent.trim().slice(0, 48));

const smallTargets = [...document.querySelectorAll('a,button,summary,input,textarea')]
  .filter(visible)
  .map((el) => ({ el, rect: el.getBoundingClientRect() }))
  .filter(({ rect }) => rect.width < 44 || rect.height < 44)
  .map(({ el, rect }) => `${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 24)}" ${Math.round(rect.width)}×${Math.round(rect.height)}`);

return { overlaps, overflow, tooDim, smallTargets };
```

Report failures for persistent dim text and undersized actionable controls.
Exempt inline body links whose surrounding line box supplies adequate target
context.

- [ ] **Step 2: Make converge pacing intentional**

Keep three readable frames at the start, finish caption fade before any frame
collision, hold the merged state for at least 35% of the section’s active scroll
range, and reduce the empty tail after the outro to one standard spacing unit.

Update `converge()` so `--converge` uses a clamped active range and writes a
separate `--settled` value for the outro:

```js
var raw = (vh * 0.58 - rect.top) / (vh * 0.72);
var progress = Math.max(0, Math.min(1, raw));
root.style.setProperty('--converge', progress.toFixed(4));
root.style.setProperty('--settled', Math.max(0, (progress - 0.72) / 0.28).toFixed(4));
```

- [ ] **Step 3: Rebuild capability art as one coherent family**

Keep the four semantic illustrations but enforce:

- one `viewBox="0 0 320 200"`
- `stroke-width="1.5"`
- `stroke-linecap="round"`
- `stroke-linejoin="round"`
- no filled gradients
- neutral panel stroke plus AIS-blue active path
- no random amber/violet/teal variants

Each drawing must have a distinct composition rather than reusing the same
rounded-card template:

- SaaS: browser shell and one outcome graph
- automation: left-to-right event/decision/result graph
- security: access ledger and verification boundary, not a generic shield icon
- custom app: task-specific desktop/mobile pair

- [ ] **Step 4: Refine capability chapters**

Use a consistent two-column grid, 56–68ch copy limit, and one visual container.
Alternate order only on desktop. On mobile, always render copy before art.
Remove oversized dead space and keep the next chapter’s index visible near the
fold to preserve progression.

- [ ] **Step 5: Make the service explorer readable without low-opacity tricks**

Inactive services stay at full text opacity with hierarchy expressed through
weight, border, and spacing. The active item receives a blue rule and its media
becomes visible. Keyboard focus activates the matching media just like
intersection-based activation.

Change the section title/lead to:

```js
eyebrow: 'Storitve',
title: 'Tri področja. En odgovoren sistem.',
lead: 'Vsaka rešitev začne pri konkretnem delu, ki ga ekipa danes opravlja ročno.',
```

- [ ] **Step 6: Refine process and team composition**

Render the four process phases as an ordered sequence with one blue baseline,
not four coloured cards. Show the three real team members in a three-column
editorial composition with consistent image crop and no vacant boxes.

- [ ] **Step 7: Run render and text checks**

```bash
cd /workspace/website
npm run check
node tools/head-check.mjs
```

Expected: all pages/widths pass, no dim persistent copy, no undersized controls,
and no split words.

- [ ] **Step 8: Commit and push**

```bash
git add website/render-check.mjs website/src/art.mjs website/src/showcase.mjs \
  website/src/sections.mjs website/src/styles.css website/content/showcase.mjs \
  website/content/content.mjs
git commit -m "Refine the AIS home narrative and section details"
git push -u origin cursor/ais-website-geo-seo-redesign-112a
```

---

### Task 5: Remove Ornamental Motion and Complete Responsive Accessibility

**Files:**
- Modify: `website/public/js/motion.js`
- Modify: `website/src/styles.css`
- Modify: `website/src/layout.mjs`
- Modify: `website/src/sections.mjs`
- Modify: `website/render-check.mjs`

**Interfaces:**
- Keeps: `introSequence`, `heroEntrance`, `brainTilt`, `explorer`, `reveals`,
  `converge`, `readline`, `ctaField`, `lazyVideo`, `contactForms`
- Removes: `particles`, `bouncers`, custom cursor, magnetic controls, and their
  selectors/canvas hooks

- [ ] **Step 1: Add reduced-motion and keyboard checks**

In `render-check.mjs`, open an additional page with:

```js
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
```

Assert:

```js
const reduced = await page.evaluate(() => ({
  introBlocked: document.documentElement.classList.contains('is-intro'),
  hiddenText: [...document.querySelectorAll('main h1,main h2,main h3,main p')]
    .filter((el) => getComputedStyle(el).visibility === 'hidden' ||
      parseFloat(getComputedStyle(el).opacity) < 0.9)
    .map((el) => el.textContent.trim().slice(0, 40)),
  autoplaying: [...document.querySelectorAll('video')].filter((video) => !video.paused).length,
}));
```

Fail if the intro blocks, text remains hidden/dim, or decorative video autoplays.

Use Puppeteer keyboard navigation to open both desktop `<details>` dropdowns,
the mobile menu, and the first FAQ item. Fail if focus is invisible or the
control does not toggle.

- [ ] **Step 2: Remove ornamental motion calls and implementations**

The motion bootstrap becomes:

```js
document.documentElement.classList.add('motion-on');
introSequence();
heroEntrance();
brainTilt();
explorer();
reveals();
converge();
readline();
ctaField();
if (!reduce) lazyVideo();
```

Delete `particles()`, `bouncers()`, `cursor()`, `magnetic()`, their listeners,
their generated nodes, and related CSS. Remove `data-particles` canvas from page
heroes.

- [ ] **Step 3: Make intro motion restrained and deterministic**

Use three stages only:

```js
at(100, () => stage.classList.add('is-logo'));
at(720, () => stage.classList.add('is-word'));
at(1900, open);
```

No character-by-character typo, backspace, or bounce. Click, Escape, Enter, and
Space still finish immediately.

- [ ] **Step 4: Make CTA motion subordinate**

Use only AIS-blue/neutral grid lines. Cap device pixel ratio at 1.5, pause via
IntersectionObserver, and stop all animation under reduced motion. The static
fallback remains the dark section with one subtle CSS rule.

- [ ] **Step 5: Recompose responsive layouts**

At 768px and below:

- hero copy precedes brain
- hero brain width is at most `min(17rem, 72vw)`
- converge panels stack and do not merge
- all capability copy precedes art
- process phases form one vertical ordered list
- team uses one or two columns according to available width
- CTA form is full width beneath its copy
- footer groups stack without uneven blank columns

At 390px, no control sits closer than 20px to the viewport edge.

- [ ] **Step 6: Provide a complete reduced-motion CSS branch**

Use:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
  }
  [data-enter],
  [data-reveal],
  [data-type-in] .char,
  [data-type-chars] .char,
  .readline__w {
    opacity: 1 !important;
    transform: none !important;
    color: inherit !important;
  }
  .ctaband__field { display: none; }
}
```

- [ ] **Step 7: Run all automated checks**

```bash
cd /workspace/website
npm run check
node tools/head-check.mjs
```

Expected: all static, design, render, reduced-motion, interaction, and text checks
pass.

- [ ] **Step 8: Commit and push**

```bash
git add website/public/js/motion.js website/src/styles.css website/src/layout.mjs \
  website/src/sections.mjs website/render-check.mjs
git commit -m "Concentrate motion and complete responsive accessibility"
git push -u origin cursor/ais-website-geo-seo-redesign-112a
```

---

### Task 6: Verify Every Page, Fix the Remaining Details, and Produce Evidence

**Files:**
- Modify: `website/tools/shots.mjs`
- Modify: `website/tools/walkthrough.mjs`
- Modify: `website/README.md`
- Modify as defects require: files from Tasks 1–5

**Interfaces:**
- Consumes: completed site and live server on port 4321
- Produces: final screenshots, screen recording, updated documentation

- [ ] **Step 1: Check environment setup and start/reuse the preview**

Inspect `/tmp/cursor/async-install/install-user.status` when present. Reuse the
existing tmux preview session or start one bound on port 4321.

Verify:

```bash
curl -I http://127.0.0.1:4321/
curl -I http://localhost:4321/
curl -I http://[::1]:4321/
```

Expected: HTTP 200 for all three.

- [ ] **Step 2: Run the complete automated suite**

```bash
cd /workspace
npm run check
cd website
node tools/head-check.mjs
```

Expected: zero errors/warnings, all generated pages checked, all 13 widths pass,
brand/content/design audit passes, split-text check reports zero problems.

- [ ] **Step 3: Manually inspect every route on desktop**

Use Chrome at 1440×900 and inspect:

```text
/
/produkti/
/storitve/
/storitve/avtomatizacija-administracije/
/storitve/avtomatizacija-prodaje/
/storitve/spremljanje-trga/
/proces/
/novice/
/dogodki/
/blog/
/o-podjetju/
/ekipa/
/pogosta-vprasanja/
/kontakt/
/404.html
```

Check hierarchy, line length, spacing, section transitions, controls, truthful
empty states, header/dropdowns, footer, and copy. Fix every concrete defect and
repeat the affected checks.

- [ ] **Step 4: Manually inspect mobile and interaction states**

At 390×844 inspect the home page, every page type, mobile menu open/closed,
dropdown alternatives, FAQ, form fields, keyboard focus, and section stacking.
Confirm no horizontal scroll and no hero/text collision.

- [ ] **Step 5: Capture the minimal screenshot set**

Update `tools/shots.mjs` to capture:

```text
intro-logo
intro-lockup
home-hero
home-converge-apart
home-converge-merged
home-capabilities
home-services
home-process
home-team
home-cta
products-empty
news-empty
events-empty
blog-empty
mobile-home
mobile-menu
```

Capture only successful final states.

- [ ] **Step 6: Record and review the final walkthrough**

Update `tools/walkthrough.mjs` to record:

1. official brain alone
2. official lockup reveal
3. corrected hero
4. three-screen demonstration and convergence
5. capability narrative
6. products/services
7. process
8. team
9. FAQ handoff
10. final CTA

Save a new immutable artifact name. Review it with the video-review agent and fix
any defect before referencing it.

- [ ] **Step 7: Update documentation**

Document:

- official brand source paths
- option-3 dimensional treatment
- honest empty-state behaviour
- revised home flow
- removed ornamental effects
- design audit and browser checks
- video generation and walkthrough commands

- [ ] **Step 8: Run verification after documentation changes**

```bash
cd /workspace
git diff --check
npm run check
cd website
node tools/head-check.mjs
git status --short
```

Expected: all checks pass; only intended files are modified.

- [ ] **Step 9: Commit, push, and update the pull request**

```bash
git add website docs/superpowers/plans/2026-09-07-ais-website-solidification.md
git commit -m "Finish and verify the AIS website solidification"
git push -u origin cursor/ais-website-geo-seo-redesign-112a
```

Update the pull request description with the final implementation summary,
verification output, and final screenshots/video. Do not mark it ready unless
the user explicitly requests that status change.

