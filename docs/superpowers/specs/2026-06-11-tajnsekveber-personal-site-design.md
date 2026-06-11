# tajnsekveber.com — Personal Site Design

**Date:** 2026-06-11
**Status:** Approved by Ian (approach A — split hero)

## Purpose

One-page personal website for Ian Tajnšek Veber at **tajnsekveber.com**. Presents Ian as a founder/builder, gives a short intro, and drives one action: connect via socials. Minimalist, single section, no scroll content beyond the hero.

## Decisions (settled with Ian, 2026-06-11)

| Decision | Choice |
|---|---|
| Name on site | **Ian Tajnšek Veber** (matches domain) |
| Positioning | **Founder / builder portfolio** — multi-project (AIS Slovenia, ATHLOS, Grafy nanoSolutions) |
| Language | **Slovenian default + EN toggle** |
| CTA | **Socials row: LinkedIn, Instagram, email** (ian.veber@gmail.com) |
| Layout | **A — split hero** (text left, portrait card right) |

LinkedIn + Instagram URLs not yet provided — wired as two constants at the top of the file (`LINKS.linkedin`, `LINKS.instagram`); placeholders render the icons disabled-looking until filled. Email works immediately via `mailto:`.

## Layout (single full-viewport section)

- **Right ~40%:** `ian.jpg` portrait (1179×2096) in a large rounded-corner card, subtle shadow, royal-blue edge accent (thin offset border or corner bar).
- **Left ~60%:**
  1. Name — `Ian Tajnšek Veber` (large, near-black gray)
  2. One-line positioning (SL: builder/founder line; EN equivalent)
  3. 2–3 sentence bio in Ian's voice (drafted from `ian-voice.md`, Ian edits in review)
  4. Slim row of three project chips: **AIS Slovenia · ATHLOS · Grafy nanoSolutions** — static labels with a one-word descriptor each, no links off-page
  5. CTA row: LinkedIn, Instagram, email — icon + label pills, royal blue on hover/primary
- **Top-right:** SL/EN toggle pill.
- **Background:** AI-generated minimal workspace photo (desk, laptop, soft daylight, cool gray-blue grade), desaturated under ~85% white veil — reads as texture.
- **Mobile (<768px):** photo card stacks above text, centered; background simplifies (stronger veil).

## Visual system

- **Colors:** white `#ffffff` base; royal blue family (~`#2342ff`) for accents/CTA/hover only; grays (`#1a1d24` headings → `#5a6172` body) for text.
- **Type:** Inter (Google Fonts), single family, weight contrast (700 name / 400 body).
- **Blue is scarce:** one accent line, link hovers, CTA emphasis. Everything else white/gray.

## Tech

- Single static `tajnsekveber/index.html` — inline CSS + JS, zero dependencies (Ian's HTML-first pattern).
- Assets: `tajnsekveber/ian.jpg` (copied, web-optimized if needed), `tajnsekveber/workspace.jpg` (generated via Higgsfield).
- **SL/EN toggle:** all copy in `data-sl` / `data-en` attributes (or a small JS dict), default `sl`, choice persisted in `localStorage`, `<html lang>` updated.
- Meta: title/description in Slovenian, OG image (the portrait or a composed card), favicon (initials "IV" or reuse `icon.svg` style).

## Deploy

1. New Vercel project (account `ianveber-4538`) via `vercel --prod` from `tajnsekveber/`.
2. Attach `tajnsekveber.com` to the project; Ian points DNS (A `76.76.21.21` apex + CNAME `cname.vercel-dns.com` for www) — exact records handed off at deploy time.

## Testing / acceptance

- Renders correctly in Claude Preview: desktop split layout, mobile stack, no console errors.
- SL/EN toggle swaps every visible string and persists across reload.
- All three CTA links correct (`mailto:` live; LinkedIn/IG constants flagged if placeholder).
- Lighthouse-sane: images compressed, single font, no layout shift on load.

## Out of scope

- No blog, no project subpages, no contact form, no analytics, no CMS.
- ZaLife / client work (INSPECTUS) not named on the personal site.
