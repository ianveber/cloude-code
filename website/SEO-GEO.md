# SEO and GEO: what the research said and what the site does

Written 2026-09-10 after a research pass by three agents (generative engine
optimisation, technical SEO, and an audit of this site) and one afternoon of
implementation. Everything below is either in the code, checked by
`npm run check`, or listed under "what only a person can do".

## What answer engines reward in 2026 (short version)

- Google's AI Overviews and AI Mode pick pages through normal ranking plus
  query fan-out; a page must be indexed and snippet-eligible. AI Mode is live
  in Slovene. Google says no special markup is needed and ignores llms.txt.
- Cited passages name the entity at first mention, carry a 2025/26 date and a
  hard number far more often than uncited ones. Pages updated within a year
  are cited far more often than older ones.
- Brand *mentions* across the web correlate with AI visibility much more than
  backlinks. Comparison, how-to and pricing pages get the brand *named* in
  the answer two to three times as often as informational pages.
- Copilot cites only Bing-indexed pages; Bing reads schema and IndexNow.
- Structured data has no measurable effect on citations at Google; keep it
  minimal and true. FAQ rich results are gone; FAQ *content* still answers.
- llms.txt, Markdown twins and Content-Signal are harmless and cheap; no
  engine has publicly committed to reading them. They are in place anyway.

## What changed on the site

Content and pages
- Every sub page opens with an answer paragraph that names AIS Slovenia and
  shows a visible "Posodobljeno" date; case studies got a "Na kratko" answer
  with the client and a number where the code gives one.
- Three guides at `/vodici/`: chatbot or voice agent, what AI automation
  costs (structure, not invented prices), n8n or Make or custom. Each with a
  comparison table and three questions.
- Service pages now link the case studies built for that service and carry
  three questions each; case studies link back to their service or product.

Structured data
- `WebPage` carries `datePublished` and `dateModified` from a committed
  manifest (`content/lastmod.json`) that moves only when a page's title,
  description or body changes. Sitemap `lastmod` uses the same dates;
  `changefreq` and `priority` are gone.
- Case studies and guides are `Article` nodes with dates, author and
  publisher; case studies are `about` the client. The contact page carries
  `LocalBusiness` with coordinates. `Organization.sameAs` is wired to
  `site.sameAs` and empty until profiles are confirmed.

Crawling and files
- robots.txt allows every search, answer and training crawler by name and
  states `Content-Signal: search=yes, ai-input=yes, ai-train=yes`. Training
  is allowed on purpose: a small brand gains from being known to the models.
- Every page has a Markdown twin at `<url>index.md`, linked with
  `rel="alternate" type="text/markdown"`; llms.txt links those; llms-full.txt
  holds the whole site in one file.
- IndexNow key at `/<key>.txt`; `npm run indexnow` submits the sitemap to
  Bing, Yandex, Naver, Seznam and Yep after a deploy.
- hreflang removed (one language, one URL).

Performance and safety
- Google Sans Flex is self-hosted (variable font, latin and latin-ext, two
  preloads). The only third-party font left is the JetBrains Mono sheet the
  code-glow snippet loads itself.
- Pictures ship 800, 1600 and 3200 px webp with `srcset`/`sizes`; client
  logos are 110 px webp instead of 400 to 600 px PNG.
- CSS is minified at build; Chrome prerenders the hovered link (speculation
  rules) and crossfades documents (view transitions).
- A per-page Content Security Policy is built from hashes of the inline
  scripts and handlers the page really has; no `unsafe-inline` for scripts.
- Footer headings are no longer `<h4>` and the faint text colour passes
  contrast.

Checks
- `npm run audit` now fails on a missing date, Markdown twin, CSP, self-hosted
  font, Article on a study or guide, FAQ or case-study link on a service
  page, srcset on a picture, PNG logo, hreflang, or a sitemap with
  `changefreq`/`priority`. `npm run lighthouse` prints scores for three pages.

## What only a person can do

1. Google Business Profile for AIS Slovenia with the same name, phone and
   e-mail as the site; local AI Mode citations lean on it.
2. Google Search Console (submit the sitemap, read the "Search Generative AI
   performance" report) and Bing Webmaster Tools (AI Performance report).
   Add the verification tokens to the head when you have them.
3. After each deploy: `npm run indexnow`.
4. Confirm the entity data. The business register lists the company as
   "AIS, razvoj umetne inteligence, Anej Vučič s.p.", matična številka
   7391331000, registered 2 December 2025 in Škofljica, not a VAT payer. The
   site says "Artificial Intelligence Slovenia, Ljubljana". Decide what the
   legal name, city and address on the site should be; nothing private was
   added.
5. `site.sameAs`: no LinkedIn, Facebook, Instagram or other profile could be
   confirmed for the company or the founders. Create a LinkedIn company page
   and add the URLs (LinkedIn is among the most cited domains).
6. Brand mentions: ask INSPECTUS, Pacom and ZaLife to publish a short news
   item naming AIS Slovenia; pitch one Slovene outlet; consider one original
   data piece (a small survey of Slovenian SMEs on AI use).
7. Confirm the six drafted case studies and, if you want prices on the cost
   guide, add real ranges.
8. Measure: run 30 Slovene prompts monthly across AI Mode, ChatGPT, Gemini,
   Perplexity, Claude and Copilot and log which sources they cite.
