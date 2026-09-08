# AIS Slovenia website — handoff

This file is for whoever takes the site next. Read it before changing copy,
layout, brand, or deploy settings. The longer product README is
[`README.md`](./README.md). The approved design direction is
[`docs/superpowers/specs/2026-09-07-ais-website-solidification-design.md`](../docs/superpowers/specs/2026-09-07-ais-website-solidification-design.md).

**Live origin:** `https://ais-slovenia.si`  
**Repo:** `ianveber/cloude-code`  
**Site root:** `website/`  
**Language:** Slovenian (`sl` / `sl_SI`)  
**Generator:** Node 18+ static HTML. No React, no bundler, no client-rendered content.

---

## What you are taking over

A static rebuild of ais-slovenia.si. Every indexable word is in the first HTML
response so search engines and AI answer engines can read it without JavaScript.

The home page is a product narrative, not a template landing page:

1. Typed intro: white screen, the brain mark, "AIS Slovenia" typed with a caret (home only)
2. Hero with the glossy 3D brain slab + CTAs (white)
3. Build stage: three clips in a fanned 3D stage (the only black band)
4. Clients line: named projects, one sentence each, no logos (white)
5. Three pillars with rendered product pictures: SaaS, automation, security + apps
6. Team (three real people)
7. Blog teaser (honest empty state while `blog.items` is empty)
8. FAQ (first five questions)
9. Dark CTA form
10. Footer with every contact, the team, and the large "AI Slovenia" wordmark

Supporting pages exist for products, news, events, blog, services, process,
about, team, FAQ, and contact. Products / news / events / blog currently
render **one honest empty state**. Do not invent catalogue entries to fill them.

---

## Hard rules (do not violate)

These are enforced by `design-audit.mjs` and/or by the approved spec.

1. **Exact brand only.** Standalone brain is `public/brand/favicon.png`. Light
   lockup is `public/brand/logo-light.png`. Dark lockup `public/brand/logo.png`
   is only for a genuinely dark surface. Do not redraw, trace, or SVG-invent
   the brain.
2. **Only the brain is 3D.** Option 3: CSS perspective tilt (~30°), restrained
   edge cue, directional shadow. The AIS Slovenia wordmark stays flat.
3. **Buttons are black or ghost.** No accent-coloured buttons.
4. **One decorative colour:** AIS blue `#1d77fe`. No violet / teal / amber / rose
   accent system.
5. **Copy lives in HTML.** JavaScript is progressive enhancement. The site
   must remain readable with JS off and with `prefers-reduced-motion`.
6. **No fabricated public claims.** No fake partners, metrics, news, events,
   blog posts, or “coming soon” tiles that imply unpublished work exists.
7. **Antigravity is rhythm only.** Do not copy its assets, type, motion, or
   layouts.
8. **Do not send mail, close GitHub issues, or change calendar events** from
   this repo’s agent workflow without an explicit user request.

---

## Day-one commands

From the **repository root** or from `website/`:

```bash
npm run serve    # build + preview on http://127.0.0.1:4321
npm run build    # write website/dist
npm run check    # build + SEO/GEO audit + design audit + render check
```

If `http://localhost:4321` refuses the connection, use `127.0.0.1`. The server
binds IPv4 `0.0.0.0` and IPv6 `::`.

Node 18+. The generator has no runtime dependencies. `puppeteer-core` is a
**dev** dependency for `render-check.mjs` only. CI installs it with `npm ci`
inside `website/`.

Browser-only extras (need the preview server):

```bash
cd website
node tools/head-check.mjs      # no mid-word breaks in split headlines
node tools/shots.mjs           # review screenshots
node tools/walkthrough.mjs     # home-page recording
```

CI: `.github/workflows/website.yml` — build, `audit`, `render-check` on every
push that touches `website/`.

---

## Where to edit

| Job | File |
|---|---|
| Company name, nav, contact, brand paths, footer blurb | `content/site.mjs` |
| Hero, services, process, team, FAQ, about | `content/content.mjs` |
| Intro text, build stage, clients, pillars, blog data | `content/showcase.mjs` |
| Page composition and routes | `build.mjs` |
| Header, footer, `<head>` | `src/layout.mjs` |
| Shared sections | `src/sections.mjs` |
| Home-only bands (intro, hero, stage, clients, pillars, CTA) | `src/showcase.mjs` |
| Product pictures for the pillars | `tools/pictures/scene.html` |
| Visual system | `src/styles.css` |
| Motion | `public/js/motion.js` |
| JSON-LD | `src/schema.mjs` |
| Official images | `public/brand/`, `public/team/` |
| Rendered pictures and clips | `public/pictures/`, `public/video/` |

**Change wording in `content/`, then `npm run build`.** Pages, nav, sitemap,
`llms.txt`, and schema regenerate from those files.

---

## Routes

| Path | State |
|---|---|
| `/` | Full home narrative + intro |
| `/produkti/` | Empty state until `products.items` has real entries |
| `/storitve/` | Live — three service areas |
| `/storitve/avtomatizacija-administracije/` | Live |
| `/storitve/avtomatizacija-prodaje/` | Live |
| `/storitve/spremljanje-trga/` | Live |
| `/proces/` | Live — eight-step process |
| `/novice/` | Empty state |
| `/dogodki/` | Empty state |
| `/blog/` | Empty state |
| `/o-podjetju/` | Live |
| `/ekipa/` | Live — Anej Vučič, Nejc Feigel Boh, Ian Veber |
| `/pogosta-vprasanja/` | Live — ten Q&As |
| `/kontakt/` | Live — `mailto:` fallback until `formEndpoint` is set |
| `/404.html` | Live, `noindex` |

Also generated: `/sitemap.xml`, `/robots.txt`, `/llms.txt`.

---

## How to publish real catalogue content

In `content/showcase.mjs`, push objects onto `products.items`, `news.items`,
`events.items`, or `blog.items`. When `items.length > 0`, the empty state is
replaced by the grid/list. When `blog.items` is empty, the home blog teaser
renders nothing (correct).

Do **not** add placeholder titles, fake dates, or “Rezervirano” tiles. The
design audit fails the build if those strings return.

Team photos: files in `public/team/` plus `photo` / `photoWidth` / `photoHeight`
on each member in `content/content.mjs`. Crop is CSS `4 / 5`.

Clients line: `clients.items` in `content/showcase.mjs` lists real projects
from our own repositories (INSPECTUS, ATHLOS, AIS Command, the coating model)
with one sentence each and no logos. **Before a production deploy, confirm
with each client that the project may be named publicly and replace the
working names with the ones they approve.** Never add a project that does not
exist.

---

## Brand treatment (option 3)

- Intro: the official brain tile (`favicon.png`, corners softened to an
  app-icon radius) with "AIS Slovenia" typed beside it in the site font. The
  text comes from `intro` in `content/showcase.mjs`. There is no lockup
  crossfade any more.
- Hero: `favicon.png` inside `.brand-brain__rig` with `--tilt-x` / `--tilt-z`,
  treated as a glossy slab: three edge layers for thickness, a pointer-driven
  highlight, a light sweep every 6.5 s and a slow float. Pointer tilt is
  capped at ±8° and follows the pointer anywhere over the hero. The image is
  never redrawn; only the tilt, the shadow and the light move.
- Header/footer: flat `logo-light.png`.

If you replace a brand file, keep the same filenames or update `site.brand`
and the design-audit selectors together.

---

## Motion that is allowed

`public/js/motion.js` may run:

`introSequence`, `heroEntrance`, `brainShine`, `buildStage`, `reveals`,
`clientsLine`, `tiltFrames`, `footerGlow`, `ctaField`, `lazyVideo`, plus
`headerState`, `explorer` (other pages) and `contactForms`.

Intro timing (home, first visit, motion allowed): **100 ms** mark, typing
starts once the webfont is ready (**380–520 ms**) at 78 ms per character for
"AIS" and 58 ms for "Slovenia", caret blinks, **2300 ms** site loads in.
Click / Escape / Enter / Space skip immediately. `sessionStorage.ais-intro`
prevents a repeat in the same tab.

Build stage: the front screen changes every **6 s** (the blue rule on the
active tab is the countdown), pauses under the pointer or on a focused tab,
and answers clicks, tab presses and Arrow keys. `buildStage` also runs under
reduced motion (without auto-rotation or the pointer lean) because the tabs
are real controls.

**Removed on purpose:** particles, bouncing chips, custom cursor, magnetic
buttons. Do not bring them back.

Reduced motion: no intro lock, no hidden copy, no decorative video autoplay,
CTA canvas hidden. CSS branch is in `src/styles.css`.

---

## Contact form

`site.contact.formEndpoint` is empty. Forms use `mailto:`.

To submit in the background, set `formEndpoint` to an n8n / webhook URL. The
page script posts JSON and shows inline success/error. Keep the printed email
under the form either way.

---

## Build-stage videos and pillar pictures

Both are generated, not filmed or photographed.

- Clips: source `tools/video/scene.html`, renderer `node tools/video/render.mjs`,
  outputs in `public/video/` (webm, mp4, poster).
- Pictures: source `tools/pictures/scene.html`, renderer
  `node tools/pictures/render.mjs`, outputs in `public/pictures/` (webp + jpg
  at 3200×2000). The `<picture>` markup in `src/showcase.mjs` expects both.

Re-render only when a scene file changes. Both need Chrome (the macOS path is
detected, otherwise set `CHROME_PATH`) and ffmpeg.

---

## Visual system (short)

- Paper `#fff`, canvas `#f8f9fb`, ink `#111318`, AIS blue `#1d77fe`
- Control radius 10px, card radius 16px, 44px minimum targets
- Dark bands only for the build stage and the final CTA
- Shared CSS link arrow `↗` — do not put literal arrows in markup
- Spacing tokens `--space-1` … `--space-7` — prefer tokens over magic numbers

---

## Checks that will fail your PR

`npm run check` = `build` + `audit` + `design-audit` + `render-check`.

Typical failures:

- Invented brain SVG or leftover `brain-mark` / `BRAIN_SILHOUETTE`
- Fabricated strings (`Partner 01`, `1,2 mio+`, `Mesto rezervirano`, …)
- Missing empty state on an empty listing page
- Home section order changed
- Extra accent colours, grain overlay, pill `border-radius: 999`
- Horizontal overflow at one of 18 widths
- Controls under 44×44 (inline body links are exempt)
- Dim persistent copy, clipped FAQ focus, reduced-motion intro lock
- Mid-word headline breaks (`head-check.mjs`)

---

## Deploy

Vercel project **root directory = `website/`**.

`vercel.json`: `npm run build` → `dist/`, trailing slashes, static headers.
No environment variables required today.

After a production deploy:

1. Confirm `/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`
2. Submit the sitemap in Search Console / Bing
3. Rich Results Test on FAQ / HowTo
4. The old LUCY chat widget is **not** included (third-party parser + large
   image on every page). Re-add only as a deferred, explicit decision.

---

## Still open (not bugs — waiting on the business)

- Product, news, event, and blog entries
- Client approval for the names in the clients line (see above)
- Contact webhook (`formEndpoint`)
- Kariera has no page; the footer link goes to `/kontakt/`
- English locale is not built (hreflang is `sl-SI` + `x-default` only)

Known implementation notes:

- Home FAQ disclosures start closed. Answers stay in the HTML; the dedicated
  FAQ page keeps every answer visible as headings and paragraphs.
- `npm run check` in the root README used to say “audit only”; it now also
  runs design-audit and render-check. Keep that sentence true if you edit
  `package.json`.

---

## Adding a page

1. Add copy in `content/`.
2. Add a page function in `build.mjs` (`path`, `title`, `description`,
   `breadcrumbs`, `schema`, `body`).
3. Register it in `collectPages()`.
4. Add it to `site.nav` if it belongs in the header.
5. Run `npm run check`.

---

## Contacts on the site

| Person | Role | Email |
|---|---|---|
| Anej Vučič | CEO | anej@ais-slovenia.si |
| Nejc Feigel Boh | CEO | nejc@ais-slovenia.si |
| Ian Veber | CTO | ian@ais-slovenia.si |

Public inbox: `info@ais-slovenia.si`  
Phone: `+386 70 717 087`

---

## If you are an agent continuing this work

- Stay on the existing feature branch unless asked otherwise.
- Do not invent brand geometry or placeholder content to “look finished”.
- Run `npm run check` before claiming the site is green.
- Prefer editing `content/` over hard-coding strings in `src/`.
- After UI changes, verify in a browser or `render-check` — a single
  screenshot is not verification.
