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
2. Hero: headline left, two pill buttons, the 3D brain slab on the right (white,
   the code glow is masked out of this section)
3. Build stage: a rounded black panel where the three clips orbit without
   stopping, all visible at once, one big in front and two smaller behind,
   trading size and place as they go (the only dark block); no tabs under it
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
about, team, FAQ, contact, case studies and guides. News, events and blog
carry real entries since 2026-09-10 (Ian asked for more copy, "simple enough
for a five-year-old"): news items are dated milestones from delivered work,
events are three formats without dates, blog posts live in
`content/blog.mjs`. Do not add news that did not happen or events with
invented dates; the empty state returns on its own if a list is emptied.

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
2. **The brain is the only 3D object.** In the hero it lies at the approved
   tilt (`--tilt-x: 58deg`, `--tilt-z: -30deg`) as a slab: the traced face on
   a white core, eight dark slices behind it for thickness, a highlight and a
   light sweep that follow the pointer, and two shadows in its own silhouette.
   No tile or frame around it. Pointer tilt is capped at ±8°. (A straight-on
   pose was tried on 2026-09-09 and reverted the next day at Ian's request.)
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
| `/studije-primerov/` | Live: index of the 12 case studies |
| `/studije-primerov/<id>/` | Live: one case study per project (same ids as the products) |
| `/vodici/` | Live: index of three guides |
| `/vodici/<slug>/` | Live: chatbot or voice, cost structure, n8n/Make or custom |
| `/storitve/` | Live — three service areas |
| `/storitve/avtomatizacija-administracije/` | Live |
| `/storitve/avtomatizacija-prodaje/` | Live |
| `/storitve/spremljanje-trga/` | Live |
| `/proces/` | Live — eight-step process |
| `/novice/` | Live: three dated news items from delivered work |
| `/dogodki/` | Live: three event formats, dates by agreement |
| `/blog/` | Live: index of the posts |
| `/blog/<slug>/` | Live: four plain-language posts (content/blog.mjs) |
| `/o-podjetju/` | Live |
| `/ekipa/` | Live — Anej Vučič, Nejc Feigel Boh (Ian Veber removed at his request, 2026-09-10) |
| `/pogosta-vprasanja/` | Live — ten Q&As |
| `/kontakt/` | Live — `mailto:` fallback until `formEndpoint` is set |
| `/404.html` | Live, `noindex` |

Also generated: `/sitemap.xml`, `/robots.txt`, `/llms.txt`.

---

## How to publish real catalogue content

In `content/showcase.mjs`, push objects onto `products.items`, `news.items`
or `events.items`; blog posts go to `content/blog.mjs` (each becomes a page
at `/blog/<slug>/`). When a list is empty the honest empty state returns.
Every product also carries `simple` (one plain sentence or two) and
`forWhom`, rendered under its description.

`products.items` is live: our own products (ATHLOS, AIS Command, AISOS) and
nine projects built for clients, named after what they do, never after the
client (Ian, 2026-09-16: "remove all names of companies on case studies...
just keep the names of the projects"). Ids and names: `vldr-kartice` (VLDR
kartice), `pametni-filter-vin` (Pametni filter VIN), `model-premazi` (Model
za premaze), `svetovalec-plemenite-kovine`, `asistent-rezervacije`,
`svetovalec-nega-koze`, `spremljanje-razpisov`, `delovni-nalogi`,
`tehnicni-asistent`. The client is described only by its trade (a port
inspection company, a precious-metals dealer, a wellness in a tower, a
cosmetics institute, a consultancy, a building manager, a coatings maker).
Company names live in one place only, the clients marquee. Products carry
no `client` field and the studies have no "Stranka" row; the design audit
greps the built product and study pages for every client name and fails
if one returns. **The last six projects were drafted at Ian's request
without source material** (`draft: true`); Ian confirms or corrects them
before a production deploy. Each has a demo screen rendered from
`tools/pictures/products.html` (`node tools/pictures/render.mjs`). The
screens are drawn after the real systems; the numbers on them are
illustrative. Add a project by adding a stage to `products.html`, listing its
id in `FILES` in `render.mjs`, rendering, and adding the item to
`products.items`. The design audit expects the twelve ids above with
rendered pictures on `/produkti/`.

Do **not** add placeholder titles, fake dates, or “Rezervirano” tiles. The
design audit fails the build if those strings return.

Team photos: files in `public/team/` plus `photo` / `photoWidth` / `photoHeight`
on each member in `content/content.mjs`. Crop is CSS `4 / 5`.

Clients: `clients.items` in `content/showcase.mjs` lists the clients
(INSPECTUS, Elementum, Tower Spa Celje, Dr. Asya Grafy Bio
Institute, SI-BIG, HEVA, Epolac) and our own brands (AISOS, VETA, ATHLOS),
each with a logo in `public/clients/` taken from the client's own website or
our repositories. VETA is the real whale mark from `~/builds/veta-site`
(`public/brand/whale.svg`), ATHLOS the real favicon from the Athloss repo;
both replaced drawn stand-ins on 2026-09-16. `tone: 'dark'` puts a dark disc
behind a logo drawn for dark surfaces (Epolac). This marquee is the only
place on the site where a client company is named. Items alternate between the two marquee rows; each
row repeats its pills four times so the loop is seamless on wide screens.
**Before a production deploy, confirm with each client that their logo may
appear here.** Never add a client that does not exist; the render check
requires a real logo image and a name per pill and rejects descriptions.

---

## Brand treatment (option 3)

- Intro: the bare brain (`brain-light.svg`) with "AIS Slovenia" typed beside
  it in the site font. The text comes from `intro` in `content/showcase.mjs`.
- Hero: the brain as a lying 3D slab. `src/showcase.mjs` reads the two paths
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

Build stage (rewritten 2026-09-16, "resemble Antigravity more... changing
size, not shape, and changing positions... all three together, some smaller
and some bigger"): the three clips are always on screen and never stop.
One CSS animation, `stageOrbit` (21 s, in `src/styles.css`), carries a screen
through the three poses, front, back-left, back-right, with drift between
them; the three figures share it with `animation-delay: calc(var(--i) * -7s)`,
so at every moment one is big in front and two are smaller behind, and they
keep trading size and place. Poses are variables on `.build__rig` (`--bx`,
`--by`, `--bz`, `--bs` for back-left, `--cx`... for back-right) so the phone
breakpoint can retune them (closer, in a taller 1 / 1.05 frame at 72 %
width). `preserve-3d` and a 1400 px perspective give the depth. JS is only
an IntersectionObserver that sets `.is-on` on the section; the animation
runs only while the stage is on screen and pauses under the pointer. There
are **no tabs** under the stage any more (Ian: "remove the buttons
Automatizacija and Estetic"); the design audit fails if `build__tab`
returns, and the render check requires three `.build__screen` figures with
at least two distinct widths, opacity above 0.5 and movement after 2.6 s.
Under reduced motion the three screens hold their three poses.

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

## SEO and GEO (2026-09-10)

Read `SEO-GEO.md` first: it lists what the research found, what the site now
does and what only a person can do (Business Profile, Search Console, Bing,
IndexNow after deploy, entity data, profiles for `site.sameAs`).

Mechanics an agent must keep intact:

- `content/lastmod.json` is generated by the build and committed. It holds a
  hash per page and the dates that feed sitemap `lastmod`, `dateModified`,
  the visible "Posodobljeno" line and the Markdown front matter. Do not edit
  it by hand and do not delete it: deleting resets every date to today.
- Every page has a Markdown twin (`index.md`), llms.txt links those, and
  llms-full.txt concatenates them. `src/markdown.mjs` converts the built HTML;
  new markup patterns may need a rule there.
- The CSP is a `<meta>` built in `src/layout.mjs` from the inline scripts and
  handlers of each page. Any new inline script or `on*=` attribute is hashed
  automatically; a new external origin (an analytics script, a form endpoint)
  must be added to the policy or it is blocked silently. `formEndpoint` in
  `content/site.mjs` is added to `connect-src` automatically.
- Google Sans Flex is self-hosted from `public/fonts/`; do not reintroduce
  the Google Fonts stylesheet for it. The code-glow snippet's JetBrains Mono
  link stays as supplied.
- Pictures need the 800 and 1600 px variants: `npm run pictures` renders and
  resizes; client logos are 110 px webp.
- robots.txt allows training crawlers on purpose (Ian's site, Ian's call);
  `Content-Signal` states the same. Flip `ai-train` and the training group to
  `Disallow` only on Ian's request.

## Case studies (2026-09-10)

Every project on `/produkti/` has a page under `/studije-primerov/<id>/`, plus
an index at `/studije-primerov/`. Copy lives in `content/case-studies.mjs`
(one entry per product id; the name, kind and picture come from the
product record, so they cannot drift). Four fixed parts on every page: Izziv,
Kaj smo naredili (with the parts of the system), Kaj se je spremenilo, Orodja.
The audit fails if any of the 12 is missing, unlinked from `/produkti/`, or
missing a part. No client company is named on any study, product, blog post
or guide (the marquee is the only place); the design audit greps the built
pages for the names.

Each study has two layers. The base entry (facts, challenge, build, parts,
outcome, tools) is in `content/case-studies.mjs`; the deeper layer in
`content/case-studies-deep.mjs`, keyed by id, adds "Kako je bilo prej" (one
day before the system), "Kako je videti v praksi" (the same day with it),
three "Pogosta vprašanja o projektu" (also emitted as FAQPage) and a second
rendered screen with a caption (`tools/pictures/details.html`, ids
`<id>-detail`). Blog posts carry an illustration each from
`tools/pictures/blog.html` (ids `blog-<slug>`). Render new scenes with
`node tools/pictures/render.mjs [id]`, then `node tools/pictures/variants.mjs`
for the 800 and 1600 px sizes.

Product pictures are the real products, not drawings (Ian, 2026-09-14: "the
exact version as it is"). Where the product runs, the picture is a real
screenshot composed into a 1600×1000 frame by `tools/pictures/captures.html`
from PNGs in `tools/pictures/real/` (ATHLOS from its built bundle in demo
mode, AIS Command from the local dev server with client names sanitised,
INSPECTUS VLDR from the tool with its sample report, the VIN filter from
its demo, with "INSPECTUS" removed from the captured DOM). Where the
product is not an app, the picture is its real surface:
`tools/pictures/terminal.html` is a verbatim CLI session of the coatings
model including its own refusals. The six drafted projects keep their drawn
scenes in `products.html` because no product exists. Picture files are
named after the product ids above (`public/pictures/<id>.webp|jpg`,
`<id>-800.webp`, `<id>-1600.webp`, and `<id>-detail...`). Laptop and phone mockups were tried and removed the same
day; the connected image account has no credits, so no AI images anywhere.

What each study rests on:

- ATHLOS, AIS Command, AISOS, VLDR kartice, Pametni filter VIN and the
  coatings model: written from their repositories. Their "Stanje" rows are
  honest: AIS Command is pre-launch, the VIN filter is a prototype tested on
  synthetic images, the coatings model has only seen synthetic formulations.
  Do not "upgrade" those rows without new evidence.
- The six drafted projects (precious-metals adviser, reservation
  assistant, skin-care adviser, tender monitoring, work orders, technical
  assistant): **drafted without source material** (`draft: true`), like
  their product entries, at Ian's request. Ian confirms or rewrites them before deploy; until then they
  must not be quoted anywhere else.

No client quotes, no invented metrics. The only numbers on these pages come
from the repositories (314 vehicles, 29 of 30 reads, 49 tests, R² on synthetic
families) and are labelled as such in the copy.

## Build-stage videos and pillar pictures

Both are generated, not filmed or photographed.

- Clips: source `tools/video/scene.html`, renderer `node tools/video/render.mjs`,
  outputs in `public/video/` (webm, mp4, poster).
- Pictures: sources `tools/pictures/scene.html` (three pillars) and
  `tools/pictures/products.html` (AISOS and the six drafted projects), renderer
  `node tools/pictures/render.mjs`, outputs in `public/pictures/` (webp + jpg
  at 3200×2000). The `<picture>` markup in `src/showcase.mjs` expects both.

Re-render only when a scene file changes. Both need Chrome (the macOS path is
detected, otherwise set `CHROME_PATH`) and ffmpeg.

---

## Visual system (short)

Phones come first (Ian, 2026-09-16: "optimized for phone use more than
computer use"). Every band is checked at 320 to 1920 px by the render check;
the 768 px breakpoint in `src/styles.css` is where the stage, tiles, blog
grid, footer link groups and breadcrumbs take their phone shapes. The blog
index is a four-column grid on desktop (`.postgrid`, eight posts make two
even rows), two columns on tablets and one on phones, so no row is left
with a hole. Breadcrumb items are 44 px tall and vertically centred so the
current page's crumb lines up with the links. Footer link groups sit three
across on phones.

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


Pacom and ZaLife were removed from the whole site on 2026-09-15 at Ian's
request: products, case studies, client logos, news, pictures and scenes.
Do not add them back without him.
