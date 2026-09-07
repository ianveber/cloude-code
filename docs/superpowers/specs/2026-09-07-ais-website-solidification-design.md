# AIS Slovenia Website Solidification — Design Specification

Date: 2026-09-07  
Status: Approved direction, ready for implementation planning

## Objective

Refine the existing static AIS Slovenia website into a precise, credible product
site that feels deliberately designed and hand-implemented.

The structure remains multi-page and all indexable content remains present in
the initial HTML response. The redesign corrects the inaccurate hero logo,
removes generic/template-like decoration, establishes one coherent visual
system, and improves the sequence and pacing of the home page.

## Confirmed Decisions

- Only the brain mark receives a dimensional treatment.
- The brain must use the exact official artwork in
  `website/public/brand/favicon.png`; it must not be redrawn or approximated.
- The chosen treatment is option 3: the flat official image is tilted in
  perspective with controlled shadow and a restrained edge/depth cue.
- “AIS Slovenia” remains flat in the intro, header, and footer.
- Buttons remain black or ghost/outlined. Accent-coloured buttons are excluded.
- The site remains a static generator with no client-side rendering dependency.
- The design may use Antigravity’s pacing and information-flow principles, but
  must not copy its assets, exact layouts, motion language, typography, or trade
  dress.

## Source of Truth for Branding

The following existing files are authoritative:

- Standalone brain mark: `website/public/brand/favicon.png`
- Light-background lockup: `website/public/brand/logo-light.png`
- Dark-background lockup: `website/public/brand/logo.png`

The hand-authored brain paths and slices in `website/src/art.mjs` are not brand
assets. They must be removed from the intro and hero. No new brain silhouette,
fold, circuit trace, or node may be invented.

The hero brain should render at or below the useful resolution of the 302×302
source. Its apparent depth comes from perspective, a small translated edge cue,
and a directional shadow—not from altering the artwork.

## Ethical Reference Principles

The official Antigravity pages were reviewed at:

- `https://antigravity.google/`
- `https://antigravity.google/product`
- `https://antigravity.google/download`
- `https://antigravity.google/blog`

AIS will borrow only general product-design principles:

1. Promise, then demonstration, then explanation, then proof, then action.
2. One dominant idea per viewport.
3. Stable gutters and a deliberate spacing scale.
4. Alternation between “show” sections and “tell” sections.
5. Motion concentrated in a few meaningful moments.
6. Dark surfaces reserved for evidence and the final conversion moment.
7. Supporting pages change density according to their task.

AIS will not copy Antigravity’s logo, point-cloud artwork, rainbow cursor,
particle field, exact media-expansion choreography, font ladder, giant wordmark,
space language, or exact section composition.

## Visual Foundation

### Colour

Reduce the palette to:

- paper white
- near-black ink
- two neutral greys for secondary text and borders
- the blue sampled from the official AIS logo

Violet, teal, amber, and rose cease to function as arbitrary section accents.
Verified product states use text labels and neutral styling; colour is not the
only status signal.

### Typography

Keep Plus Jakarta Sans and tune it rather than introducing another identity:

- display headings use tighter tracking and controlled line height
- body copy stays between roughly 52 and 68 characters per line
- eyebrows use one consistent size, weight, spacing, and AIS-blue rule
- metadata uses a single compact style
- Slovenian diacritics are checked at all shipped weights

The hierarchy should use ratios rather than one-off values: hero, manifesto,
section heading, card heading, body, metadata.

### Spacing and Grid

- One maximum content width and one gutter rule across all sections.
- A small documented spacing scale replaces one-off gaps.
- Major sections use one of three vertical rhythms: compact bridge, standard
  content, or cinematic.
- Desktop asymmetry must resolve onto the same underlying grid.
- Mobile sections are recomposed, not merely shrunk.

### Surfaces

- Remove the site-wide dot grid and fixed paper grain.
- Use plain paper surfaces, subtle one-pixel rules, and occasional contained
  dark media fields.
- Use one card radius and one control radius; avoid mixing many roundness levels.
- Shadows are reserved for elevation or interaction, not applied to every card.

## Home Page Flow

### 1. Intro

The official brain mark appears alone. It then aligns into the official
`logo-light.png` lockup, revealing that image’s wordmark rather than recreating
the letters as live text. The intro remains once-per-session and skippable.

No typed typo/backspace gag is used. The wordmark resolves cleanly and quickly.
Reduced-motion users receive the finished lockup without staged movement.

### 2. Hero

The hero contains:

- one concise promise
- one short supporting sentence
- one primary black action and one ghost link to the products overview
- the exact official brain mark as the only dimensional object

The brain is tilted 30 degrees using CSS perspective. It receives
a restrained directional shadow and subtle edge cue. It does not bob, spin, or
behave like a generic 3D tech object. Pointer response, if retained, is limited
to a few degrees and disabled on coarse pointers and reduced motion.

### 3. Demonstration

The three-screen sequence remains because it tells the AIS workflow:

1. map the process
2. build and test the system
3. operate the finished product

The section starts as three distinct, readable screens. During one scroll
interval they converge into one product view. Captions disappear before frames
overlap. The merged state remains visible long enough to register before the
next section.

The surrounding treatment becomes quieter: no unnecessary explanatory card
chrome, no excessive glow, and one clear section title.

### 4. Proof Bridge

The visible “PA” logo tiles are removed. Until real partner logos are supplied,
the proof bridge is omitted from the rendered home page.

The data structure remains ready for real logos. When populated, it renders one
restrained monochrome row rather than an endless marquee.

### 5. Capability Narrative

The scroll-reading statement remains as the manifesto moment. It is followed by
four focused chapters:

- SaaS products
- process automation
- cybersecurity
- custom applications

Each chapter has one claim, one concise explanation, and one AIS-owned visual.
The current generic UI drawings are redrawn into a consistent line system with
the same stroke, radius, label style, and density. The chapters alternate
composition without arbitrary colour changes.

### 6. Products and Services

The current feature explorer and use-case material are consolidated into a
single clearer product/service narrative. Each entry answers:

- what it is
- which work it replaces
- what outcome it creates
- where to learn more

Only one item is visually dominant at a time. Supporting items remain readable
without relying on opacity so low that the section looks unfinished.

### 7. Process and Evidence

The eight process steps remain, but random per-step colours are removed. Steps
are grouped into meaningful phases:

- understand
- design
- build
- operate

Claims and statistics are shown only when they can be substantiated. Unverified
numbers are removed rather than used as decorative proof.

### 8. Team

Show only actual members. Empty “Mesto rezervirano” cards are removed from the
public page while the content model remains ready for future people.

Profiles use consistent image treatment, role hierarchy, and spacing. The team
section acts as trust evidence rather than a generic portrait grid.

### 9. Editorial Content

Blog, news, and events remain in navigation because they are part of the
approved information architecture, but fabricated entries are removed.

Until real material exists:

- the listing page uses one composed, honest empty state
- the home page omits the relevant preview section
- no false dates, releases, events, locations, or product claims enter HTML,
  metadata, sitemap descriptions, or structured data

### 10. Final CTA

The final CTA becomes the page’s terminal action and therefore moves after any
real editorial preview.

It retains a dark field and contact form. The perspective grid is simplified
and remains visibly subordinate to the copy and form. Labels, required states,
focus states, validation, and contrast are consistent with the contact page.

### 11. Footer

The footer uses the flat official lockup, balanced columns, a restrained legal
row, current year, and clearly interactive contact links. It closes the page
without introducing another decorative motif.

## Supporting Pages

All page heroes, breadcrumbs, lists, cards, forms, and closing CTAs inherit the
same tokens and component rules.

- Products: product-led, with concrete outcomes and status only when verified.
- Services: comparison and capability content without duplicated sections.
- Service details: answer-first structure, then capabilities, process, and CTA.
- Process: the authoritative expanded version of the four-phase system.
- Company and team: evidence-led, with no vacant template slots.
- FAQ: clear disclosure affordance with visible chevron and robust focus state.
- Contact: simple form hierarchy, direct email/phone links, and no competing art.
- News, events, blog: honest empty states until real entries are supplied.
- 404: same header/footer and a single direct route back home.

## Component and Code Boundaries

The generator remains split by responsibility:

- `content/*.mjs`: verified copy and data only
- `src/layout.mjs`: document shell, navigation, footer, metadata
- `src/sections.mjs`: shared light-page sections
- `src/showcase.mjs`: home-specific narrative sections
- `src/art.mjs`: non-brand illustrative artwork only
- `public/js/motion.js`: progressive enhancement and motion
- `src/styles.css`: tokens, primitives, components, responsive and motion rules

The brand brain is emitted as an `<img>` sourced from `site.brand.favicon`.
This makes the brand source explicit and prevents a second hand-built version
from diverging later.

Content remains readable without JavaScript. Motion may add classes and CSS
variables but may not create essential copy or navigation.

## Interaction and Accessibility

- Every control has a visible hover, focus-visible, active, and disabled state.
- Touch targets are at least 44×44 CSS pixels.
- Dropdowns and mobile navigation work with keyboard and without JavaScript.
- FAQ disclosures expose an obvious visual affordance.
- Forms use real labels, correct autocomplete attributes, required indicators,
  useful validation messages, and sufficient contrast.
- `prefers-reduced-motion` disables the intro staging, pointer tilt, scroll
  interpolation, autoplay movement, and animated canvas.
- Decorative video has a still poster fallback.
- No animation leaves text permanently dim or hidden.

## Failure and Fallback Behaviour

- Missing partner, post, event, or news data renders no fake card.
- Missing optional images collapse their media container rather than showing a
  broken slot.
- Video failure keeps a meaningful poster and adjacent text.
- Canvas failure leaves a plain dark CTA background.
- JavaScript failure leaves complete static HTML, usable navigation, visible
  content, and a static official brain image.
- The intro never blocks crawler or keyboard access.

## Verification

Implementation is complete only when all of the following pass:

1. The official brain PNG and flat wordmark are used everywhere; no invented
   brain SVG appears in generated HTML.
2. Desktop visual review at 1440×900 covers every home-page section.
3. Mobile visual review at 390×844 covers every page type and navigation state.
4. No horizontal overflow at the existing 13 test widths.
5. No mid-word breaks in character-split text.
6. No visible caption collision during slow or fast converge scrolling.
7. Reduced-motion rendering is complete, static, and readable.
8. Keyboard traversal covers header dropdowns, mobile navigation, FAQ, forms,
   and footer links.
9. Colour contrast meets WCAG AA for body text, controls, breadcrumbs, metadata,
   and dark sections.
10. Every indexable page has truthful HTML content, metadata, canonical URL,
    Open Graph data, JSON-LD, and sitemap inclusion.
11. Fabricated partner, news, event, blog, metric, or product claims are absent.
12. `npm run check` passes with zero errors and warnings.
13. Browser-based text and render checks pass.
14. A fresh-session screen recording proves the intro, dimensional brain,
    converge sequence, narrative flow, CTA, and responsive composition.

## Acceptance Standard

The result should look calm, exact, and authored. Repeated templates, arbitrary
accent colours, empty public-facing slots, generic tech decoration, accidental
spacing, and ornamental motion are failures even if the page is technically
valid.

The site should make the company’s promise understandable first, demonstrate
the work second, explain the offer third, prove credibility fourth, and end
with one clear action.
