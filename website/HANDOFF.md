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

1. Typed intro: white screen, the bare brain, "AIS Slovenia" typed with a caret (home only)
2. Hero: headline left, two pill buttons, the 3D brain standing on the right (white,
   the code glow is masked out of this section)
3. Build stage: a rounded black panel where the three clips circle through
   front, back-left and back-right, three seconds each in front (the only dark block)
4. Clients: two marquee rows of small pills (logo + name), top row drifting left, bottom row right, no descriptions
5. Three pillars: a title, one sentence and a rendered product picture in a soft panel
6. Products and projects: four tiles from `products.items`, linking to `/produkti/`
7. Team (three real people, name and role)
8. Blog (one line while `blog.items` is empty)
9. FAQ (first five questions) in a rounded black panel
10. Closing CTA: a rounded black panel with the short form
11. Footer with every section, contact, the team, and the large "AI Slovenia" wordmark

Home sections carry a tag (eyebrow) and a title. No lead paragraphs.

Behind everything sits `.depth`: two very faint blue-grey lights (alpha ≤ 0.14,
the audit checks) that drift on their own and slide a little against the
scroll, plus a faint fall-off toward the bottom. It is the only "texture" on
the page and it must stay barely noticeable.

In front of the depth layer, still behind the page, sits Ian's **code-glow
canvas** (`src/code-glow.html`, dropped into `layout.mjs` right after
`<body>` on every page). It is his snippet, included byte for byte: faint
lines of code type themselves in under the pointer and fade once it moves on.
Do not edit the snippet; tune it only if Ian asks, in its own `CFG` block.
The canvas is `z-index: 0`, so `main`, `.breadcrumbs` and `.site-footer` are
lifted to `z-index: 1` in `styles.css` (the audit checks both halves).
The canvas is masked out above the hero's bottom edge (`--glow-cut`, moved
by `glowCut()` in `motion.js`), so the hero stays a clean white ground and
the effect starts exactly where the hero ends.

Supporting pages exist for products, news, events, blog, services, process,
about, team, FAQ, and contact. Products / news / events / blog currently
render **one honest empty state**. Do not invent catalogue entries to fill them.

---

## Hard rules (do not violate)

These are enforced by `design-audit.mjs` and/or by the approved spec.

1. **Exact brand only.** The bare brain is a vector traced automatically from
   the official lockup (`tools/…/trace` notes in this file): `brain-light.svg`
   (ink lines, for white surfaces), `brain.svg` (white lines, for dark
   surfaces), `brain-mask.svg` (the same shape in black) and `brain-solid.svg`
   (the filled outline, for depth, light and shadow masks). `favicon.png` is
   the browser icon only. Light lockup is `public/brand/logo-light.png`.
   Never hand-draw, edit or "improve" these paths; re-trace from the lockup
   if the mark changes.
2. **The brain is the only 3D object.** In the hero it faces straight on and
   is symmetric at rest (`--tilt-x: 0deg`, `--tilt-y: 0deg`; Ian asked for
   this on 2026-09-09 after a lying slab): the traced face on a white core,
   eight dark slices behind it that show as a thick edge when it turns, a
   highlight and a light sweep that follow the pointer, and two shadows in its
   own silhouette. No tile or frame around it. Pointer turn is capped at ±9°.
3. **Buttons are black or soft grey pills.** No accent-coloured buttons.
4. **One accent: AIS blue `#1d77fe`, the same blue as the mark.** Eyebrows,
   the hero's second line, glows and focus rings all use `--blue`. The only
   blue-grey left is the faint depth layer behind the page (`--steel`). No
   violet / teal / amber / rose accent system.
5. **No borders, no rules, no dashes.** Nothing on the site draws a line:
   no card borders, no hairlines between sections, no underlines, no `<hr>`,
   no em or en dashes in copy. Tiles are soft grey fills, dark blocks are
   rounded black panels inside the page margins. The design audit fails the
   build if a visible border or a dash returns.
6. **Copy lives in HTML.** JavaScript is progressive enhancement. The site
   must remain readable with JS off and with `prefers-reduced-motion`.
7. **No fabricated public claims.** No fake partners, metrics, news, events,
   blog posts, or “coming soon” tiles that imply unpublished work exists.
8. **Antigravity is a vibe reference, nothing more.** White ground, centred
   light-weight headline, pill buttons, soft tiles, rounded black media panels,
   generous space. Do not copy its assets, wording, motion, or layouts.
9. **Do not send mail, close GitHub issues, or change calendar events** from
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
| `/produkti/` | Live: our products and the projects built for clients |
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
replaced by the grid/list.

`products.items` is live: our own products (ATHLOS, AIS Command, AISOS) and
the projects built for clients (INSPECTUS VLDR and VIN filter, the coating
model, Pacom, ZaLife, Elementum, Tower Spa Celje, Dr. Asya Grafy Bio
Institute, SI-BIG, HEVA, Epolac). **The last six descriptions and screens
were drafted at Ian's request without source material**, to fit each
client's business and our three service areas; Ian confirms or corrects them
before a production deploy. Each has a demo screen rendered from
`tools/pictures/products.html` (`node tools/pictures/render.mjs`). The
screens are drawn after the real systems; the numbers on them are
illustrative. Add a project by adding a stage to `products.html`, listing its
id in `FILES` in `render.mjs`, rendering, and adding the item to
`products.items`. The design audit expects at least six projects with
rendered pictures on `/produkti/`.

Do **not** add placeholder titles, fake dates, or “Rezervirano” tiles. The
design audit fails the build if those strings return.

Team photos: files in `public/team/` plus `photo` / `photoWidth` / `photoHeight`
on each member in `content/content.mjs`. Crop is CSS `4 / 5`.

Clients: `clients.items` in `content/showcase.mjs` lists the clients
(INSPECTUS, Pacom, ZaLife, Elementum, Tower Spa Celje, Dr. Asya Grafy Bio
Institute, SI-BIG, HEVA, Epolac) and our own brands (AISOS, VETA, ATHLOS),
each with a logo in `public/clients/` taken from the client's own website or
our repositories. `tone: 'dark'` puts a dark disc behind a logo drawn for
dark surfaces (Epolac). Items alternate between the two marquee rows; each
row repeats its pills four times so the loop is seamless on wide screens.
**Before a production deploy, confirm with each client that their logo may
appear here.** Never add a client that does not exist; the render check
requires a real logo image and a name per pill and rejects descriptions.

---

## Brand treatment (option 3)

- Intro: the bare brain (`brain-light.svg`) with "AIS Slovenia" typed beside
  it in the site font. The text comes from `intro` in `content/showcase.mjs`.
- Hero: the brain standing straight on, in 3D. `src/showcase.mjs` reads the two paths
  from `brain-light.svg` at build time into an inline `<symbol>`; the face
  uses it, everything else (slices, core, gloss, sweep, shadow) is a masked
  box using `brain-solid.svg`. Slice colours come from `--k` and `color-mix`.
- Tracing: `potrace` (npm) over the lockup's alpha, ink and blue separately;
  the solid outline is the shape closed with a 21 px filter, flood-filled from
  the border and eroded back. Re-run only if the official mark changes.
- Font: Google Sans Flex (Google Fonts, the Antigravity typeface), headlines
  at weight 400 with tight tracking, body 400, controls and names 500.
- Header/footer: flat `logo-light.png`.

If you replace a brand file, keep the same filenames or update `site.brand`
and the design-audit selectors together.

---

## Motion that is allowed

`public/js/motion.js` may run:

`introSequence`, `heroEntrance`, `brainShine`, `buildStage`, `reveals`,
`clientsLine`, `tiltFrames`, `footerGlow`, `lazyVideo`, plus `headerState`,
`explorer` (other pages) and `contactForms`.

Intro timing (home, motion allowed): **100 ms** brain, typing starts once
the webfont is ready (**460 to 700 ms**) at 110 ms per character for "AIS"
and 75 ms for "Slovenia", caret blinks, **3100 ms** site loads in. Click /
Escape / Enter / Space skip immediately. The intro plays on every fresh
arrival at the home page; a hop from another page of the site after it has
played skips it. `?nointro` or `sessionStorage.ais-intro = 'skip'` turns it
off for tooling and previews.

Build stage: our clips, the choreography of the Antigravity hero film. The
three screens circle three spots. The front one holds **3 s** big in the
centre with a soft blue halo and breathes slowly; the other two wait small
and dim at the back left and back right and drift. Every beat each screen
moves one spot on (**1.6 s** of travel): the front one recedes up and left,
the back-left one crosses the space down to the right, the back-right one
grows into the centre. Nothing ever sits still. Pointer over the stage
pauses the beats. Clicks on a screen or tab, and the arrow keys, bring a
screen forward at once. `buildStage` also runs under reduced motion (without
the beats) because the tabs are real controls.

**Removed on purpose:** particles, bouncing chips, custom cursor, magnetic
buttons, the CTA wireframe canvas, the glossy brain slab, the tab countdown
rule. Do not bring them back.

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
- Pictures: sources `tools/pictures/scene.html` (three pillars) and
  `tools/pictures/products.html` (eight products and projects), renderer
  `node tools/pictures/render.mjs`, outputs in `public/pictures/` (webp + jpg
  at 3200×2000). The `<picture>` markup in `src/showcase.mjs` expects both.

Re-render only when a scene file changes. Both need Chrome (the macOS path is
detected, otherwise set `CHROME_PATH`) and ffmpeg.

---

## Visual system (short)

- Paper `#fff`, canvas `#f4f5f7` (tiles), ink `#111318`, AIS blue `#1d77fe`
- Controls are pills (`--control-radius: 100px`), tiles 24px, panels 28px,
  44px minimum targets
- Dark blocks only for the build stage and the closing CTA, both rounded
  panels inside `--edge` margins
- `.link` is a soft grey pill like `.btn--secondary`; no arrow glyph
- Spacing tokens `--space-1` to `--space-7`; prefer tokens over magic numbers
- Copy: short, plain, no dashes, no lead paragraphs on the home page

---

## Checks that will fail your PR

`npm run check` = `build` + `audit` + `design-audit` + `render-check`.

Typical failures:

- Invented brain SVG or leftover `brain-mark` / `BRAIN_SILHOUETTE`
- Fabricated strings (`Partner 01`, `1,2 mio+`, `Mesto rezervirano`, …)
- Missing empty state on an empty listing page
- Home section order changed
- Extra accent colours, grain overlay, a visible border or `<hr>`, a dash in copy
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

- News, event, and blog entries
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
