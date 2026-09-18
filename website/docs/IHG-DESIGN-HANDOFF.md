# IHG design handoff

For a designer taking over the look of IHG. What it is, every screen and
state, the tokens and components as they exist today, the rules that cannot
move, and the places where the design is weakest.

Screenshots of the current build are next to this file in `docs/ihg-design/`.

---

## 1. What IHG is

IHG is the private workspace behind `ais-slovenia.si`. Two people use it.
It adds and edits the news items, blog posts, events and standalone pages
on a site that is otherwise static, and it shows how those pages are doing.

- It lives at `/admin/` on the same domain as the site. Nothing links to it.
  It is `noindex`, `robots.txt` disallows it, and every request needs a
  password.
- Saving writes content files into the repository. On the live site each
  save is a commit on the deployed branch, so publishing is deploying and
  the page appears in about two minutes.
- The interface is Slovene. The audience is not technical. Words like
  "draft", "publish", "category" appear; words like "collection", "slug
  conflict", "schema type" are translated into plain language wherever the
  screen allows it.

The point of the product: a person writes a page the way they would read
it, and the machine-facing parts (URL, meta description, structured data,
where it appears on the site) sit beside it without taking over.

---

## 2. The one screen

IHG is one screen with four regions. There are no separate pages for
listing and editing.

```
≥1200px   [ rail 64 ][ drawer 280 ][      work      ][ panel 360 ]
900-1199  [ rail 64 ][ drawer 280 ][      work      ]   panel = overlay
<900      [            work            ]                drawer, panel = overlay
          [ rail as a bottom bar, 5 items + logout  ]
```

- **Rail** (`--rail-w: 64px`): Pregled, Vsebina (opens the drawer), Slike,
  Analitika, Nastavitve, Odjava. Dark (`--rail: #17181c`) against the warm
  paper of everything else. On phones it becomes the bottom bar.
- **Drawer** (`--drawer-w: 280px`): the list of everything, with a tab per
  collection and a search field. Each row is picture, title, status dot,
  category and date.
- **Work**: the view. On the editor route this is the content form.
- **Panel** (`--panel-w: 360px`): only on the editor route. Seven collapsible
  sections that say where the page goes and what search engines see.

Routes are hash based: `#/`, `#/e/<collection>/<slug|novo>`, `#/slike`,
`#/analitika`, `#/nastavitve`. Not signed in, the whole screen is the login
card.

---

## 3. Screens

| Route | What it is for | State today |
| --- | --- | --- |
| Login | One password field on a paper ground with a soft green glow. | Fine. Carries a setup warning when no password is configured. |
| `#/` Pregled | Four stat cards (views today, 7 days, 30 days, phone share), a bar chart of views per day, the most read pages, what was edited last, where content saves. | Works, says little. See the briefs in section 9. |
| `#/e/…` Editor | Three cards in the middle (title and summary, text, picture) plus the panel. The heart of the product. | Strongest screen. Weak at 900 to 1199 and on phones. |
| `#/slike` Slike | Grid of uploads: picture, name, size, usage count, buttons to copy the path, edit or delete. | Plain. No filtering, no sense of where a picture is used. |
| `#/analitika` Analitika | Range buttons (7, 30, 90 days), four totals, a taller bar chart, three tables: pages, sources, countries. | Readable. All bars, no comparison over time. |
| `#/nastavitve` Nastavitve | Category lists per collection with add, reorder and remove, then plain text about storage, analytics and the password. | Functional, unloved. |

---

## 4. Tokens

All in `:root` at the top of `public/admin/ihg.css`. IHG has **no dark
theme**; the whole app is the light palette below.

**Colour**

| Token | Value | Used for |
| --- | --- | --- |
| `--bg` | `#f6f5f2` | The page. Warm paper, not white. |
| `--bg-deep` | `#efede8` | Drawer, inset rows, toolbar buttons, chips. |
| `--card` | `#ffffff` | Cards, inputs, the editable text area. |
| `--ink` | `#17181c` | Text, the rail, toasts, the dark button. |
| `--ink-2` | `#3d3f45` | Field labels. |
| `--muted` | `#6f7178` | Secondary text. |
| `--faint` | `#a4a6ad` | Placeholders, counters at rest. |
| `--line` | `#e6e4df` | Hairlines between sections. |
| `--line-2` | `#d8d5cf` | Control rings (inset box-shadow, not border). |
| `--accent` | `#4ade80` | Light green. Primary buttons, chart bars, score ring. |
| `--accent-ink` | `#15803d` | Green text and focus rings, where `--accent` is too light. |
| `--accent-soft` | `rgba(74,222,128,.2)` | Active rail item, soft fills. |
| `--good` / `--warn` / `--bad` | `#178a4e` / `#b45309` / `#c2410c` | Published, draft, error. Each has a `-soft` background. |
| `--rail` / `--rail-ink` | `#17181c` / `#c9cbd2` | The rail and its idle icons. |

The accent was indigo until 2026-09-18 and is now light green by Ian's
decision. Do not go back to purple. Primary buttons use `#052e16` text on
the green, not white.

**Shape**

`--r: 14px` (small surfaces), `--r-lg: 20px` (cards, modals), buttons
`11px`, inputs `10px`, toolbar buttons `9px`, pills `8px`.

**Elevation**

`--shadow: 0 1px 2px rgba(23,24,28,.04), 0 10px 30px rgba(23,24,28,.06)` for
cards. `--shadow-pop: 0 12px 40px rgba(23,24,28,.18)` for toolbars, modals
and toasts. Controls use an inset ring instead of a border, so a focused
input thickens its ring rather than shifting layout.

**Type**

Body is the platform stack (`-apple-system, BlinkMacSystemFont, "SF Pro
Text", "Segoe UI", Inter, Helvetica, Arial`) at `14.5px/1.5`. Mono is
`ui-monospace, SFMono-Regular, Menlo` for paths, counters and URL fields.
There is no webfont; the app loads no external resource at all.

Sizes in use: page title `1.5rem`, card heading `1.05rem`, field label
`0.8rem` at 600, help text `0.76rem`, button `0.88rem` at 600, stat number
`1.9rem` at 700 with `-0.03em` tracking, the editor's title field `1.3rem`
at 650, the editable text area `1rem/1.65`.

---

## 5. Components

Every one of these exists in `ihg.css` today.

- **Button** `.btn`: 40px tall, 11px radius, inset ring, 600 weight.
  Variants `--primary` (green), `--ink` (black), `--danger` (red text),
  `--ghost` (no ring), `--sm` 34px, `--xs` 30px, `--icon` square.
- **Input, textarea, select** `.input`: 40px, 10px radius, inset ring,
  focus ring `--accent-ink`. `.input--sm` 34px. `.input--title` 52px at
  1.3rem for the editor's title.
- **Switch** `.switch`: 40x24 pill, green when on, used for noindex and
  nofollow.
- **Pill** `.pill`: status. `--live` green on soft green, `--draft` amber on
  soft amber. Its 7px dot sibling `.dot` marks rows in the drawer.
- **Card** `.card`: white, 20px radius, soft shadow, 1.1rem padding.
- **Stat** `.stat`: big number, label, quiet third line.
- **Toolbar** `.tools`: the row above the text. 34px buttons on `--bg-deep`
  with hairline separators. Colour buttons carry an 18px round swatch.
- **Panel section** `.sec`: a `<details>` with a chevron that rotates; the
  sections between them are separated by an inset hairline.
- **Checklist** `.check__row`: a 16px round badge (✓ green, ! amber, ×
  red), bold label, one sentence.
- **Score ring** `.score__ring`: 44px conic gradient in the accent, white
  centre, the number inside.
- **Bars** `.bars`: flex row of green bars with hover titles, a hairline
  baseline and three date labels under it.
- **Table** `.table`: uppercase mono-ish headers, right aligned numbers with
  tabular figures, a soft green proportion bar in the last column.
- **Toast** `.toast`: bottom centre, ink background, green for success, red
  for failure, gone after 3 seconds (6 for failures).
- **Modal** `.modal`: full screen on phones, inset with a 20px radius on
  desktop. Used by the preview and the picture tool.
- **Note** `.note`: a soft block for problems before publishing (amber),
  errors (red) and hints (green).

---

## 6. The editor in detail

**Middle column, three cards**

1. Naslov, Kratek povzetek with a `0 / 220` counter, Kategorija (select with
   "+ Nova kategorija …" at the end), Datum.
2. Besedilo: a hint line, the fixed toolbar, the editable area, then a row
   of "+ block" buttons (Odstavek, Naslov, Citat, Seznam, Koraki, Slika,
   Poudarek, Gumb, Stolpca, Tabela, Ločilo, Koda).
3. Slika: the main picture, drag and drop or click, then its description and
   caption fields.

**Toolbar inventory**: Naslov, Podnaslov, Odstavek | bold, italic,
underline, strike | six colour swatches, clear colour, Poudari | bullet
list, numbered list, Citat, Povezava, Slika v besedilu | left, centre,
right, Počisti.

**Three editing surfaces exist at once** and this is the part to be careful
with:
- the fixed toolbar above the text,
- a floating bar that appears over a selection with the same tools,
- a block handle that appears on hover at the left of a block with move up,
  move down, duplicate, remove.

A picture inside the text has its own bar: 25/33/50/75/100 %, float left,
centre, float right, Opis, Uredi, Zamenjaj, Odstrani. It can also be
resized by dragging the dot at its corner.

**Panel, seven sections**: Objava (save, publish, preview, delete, the live
URL, date, slug), Kje na spletni strani (collection, category, parent page,
event fields, the button under the title), Slike (main picture plus the
library), Besedilo (block inserts and a paste box), Iskalniki (the SEO
block), Povezano (related links), Ogledi te strani (this page's views).

**The SEO block**: score ring, a checklist of up to twelve rows, meta title
with a `/60` counter, meta description with a `/165` counter and a help
line that changes colour, a Google result preview, keyword chips, structured
data type, canonical URL, Open Graph title, description and image, noindex
and nofollow switches, FAQ pairs.

**The picture tool** is a full screen modal: the picture on a dark stage
with a draggable crop box and four round handles, then a control bar with
aspect ratios (Prosto, 16:10, 16:9, 4:3, 3:2, 1:1, 4:5), Zavrti, Cel,
largest width (800, 1200, 1600, 2000), a quality slider and the resulting
pixel size.

---

## 7. Flows

1. **Write and publish.** New item from the rail or the drawer, fill the
   three cards, watch the SEO score, Predogled opens the real page in a
   desktop or phone frame, Objavi. A toast says it will be on the web in
   about two minutes. The drawer row turns from amber to green.
2. **Fix a published page.** Open it from the drawer, edit, Shrani. Changing
   the URL of a published page asks for confirmation first, because the old
   address stops working.
3. **Add a picture.** Drop it on the picture card or the library, crop and
   size it in the tool, it uploads as four files (800 and 1600 px, JPG and
   WebP), then it needs a description before the item can be published.
4. **Move an item.** Change the collection in the panel. A published item
   warns that its address changes; children stay behind without a parent.

---

## 8. Rules that cannot move

1. **No build step and no framework.** One stylesheet and four ES modules,
   loaded directly by `public/admin/index.html`. No external request of any
   kind, including fonts. A redesign is CSS plus the template strings inside
   `ihg.js`.
2. **The text the editor produces is filtered.** `src/clean-html.mjs` keeps
   only a fixed set of tags and only these classes: `cms-figure`,
   `cms-callout`, `cms-cta`, `cms-columns`, `cms-column`, `cms-table`,
   `cms-note` (with `--modifier`), `align-left|center|right`,
   `c-ink|muted|blue|green|orange|red`, `hl`, `lead`, `small`. Anything else
   is stripped when the item is saved. A new editing affordance has to emit
   one of these or the class has to be added to the site's stylesheet and
   the allow-list together.
3. **What the editor shows must match the site.** The editable area renders
   the same classes the public page will, so the text looks the same in both
   places. If you restyle one, restyle the other (`src/styles.css`, the
   "Text written in IHG" block).
4. **Targets stay finger sized.** Rail items 48px, buttons 40 (34 and 30 for
   the dense toolbars on desktop), inputs 40.
5. **Slovene, plain words.** No English, no internal vocabulary on screen.
   "Kje na spletni strani", not "Collection". "Osnutek vidite samo vi",
   not "status: draft".
6. **Phone first.** The drawer and the panel are overlays below their
   breakpoints and everything has to work with one thumb.
7. **Reduced motion is respected** and there is very little animation to
   begin with. Keep it that way.
8. **IHG's CSS is its own.** The public site's design audit does not apply
   here, so borders, radii and shadows are free in a way they are not on the
   site itself.

---

## 9. Where the design is weakest

Briefs, in the order they would help most.

1. **The editor between 900 and 1199px.** The panel is an overlay, so the
   form sits alone in a wide column and the page looks empty. Either the
   panel docks earlier, or the form uses the width.
2. **Seven accordions is not a structure.** The panel holds publishing,
   placement, pictures, blocks, SEO, links and stats in one flat list.
   Something better: stages, tabs, or surfacing the two or three things that
   matter at this moment.
3. **The SEO block is long and flat.** Twelve checklist rows, a ring and
   eight fields. What should a person look at first, and what can hide until
   it fails?
4. **The toolbar wraps.** Even at 1440px the text toolbar runs to three
   rows inside the editor column, and on a phone it fills the screen before
   a word is written. The same tools need a compact form.
5. **The dashboard says little.** Four totals and a bar chart. It could say
   which page is rising, which is falling, what was published last and what
   it did.
6. **The media library has no states.** No filter, no sense of which
   pictures are in use where, and the same grid is reused as a picker inside
   the editor without looking like one.
7. **Empty states are one grey line.** "Tu še ni ničesar" in the drawer,
   "Knjižnica je prazna" in the library, "Še ni vsebin" on the dashboard.
8. **The picture tool is functional and plain.** A dark stage and a row of
   small buttons.
9. **No dark theme at all.** Worth deciding deliberately: either commit to
   the light paper look, or build the second palette properly.

---

## 10. Working on it

```bash
cd website && npm run admin       # builds, serves, mounts the API on local files
```

Then `http://localhost:4321/admin/`, password from `website/.env.admin`.
Saving rewrites real files under `content/cms/` and rebuilds the site, so
the preview shows exactly what the public page will be.

| File | What is in it |
| --- | --- |
| `public/admin/index.html` | The shell. Title, favicon, two links. |
| `public/admin/ihg.css` | Everything visual. ~35 kB, one file, no imports. |
| `public/admin/ihg.js` | Views as template strings, state, routing, data. |
| `public/admin/editor.js` | The editable document: toolbar behaviour, blocks, figures. |
| `public/admin/picture-tool.js` | Crop, rotate, resize, the four variants. |
| `src/cms.mjs` | The data model and how an item becomes a public page. |
| `src/clean-html.mjs` | The allow-list. |
| `IHG.md` | How IHG works end to end, including setup and security. |

Checks before anything ships: `npm run check` (build, SEO audit, design
audit, the IHG smoke test, the render check across 21 pages at 18 widths).
The smoke test covers the API, not the look.
