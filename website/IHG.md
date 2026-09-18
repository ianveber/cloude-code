# IHG: the workspace behind ais-slovenia.si

The site stays static. IHG is the private app at `/admin/` and an API under
`/api/admin/` that writes content into the repository. Every publish is a
commit on the deployed branch, so Vercel rebuilds the site and the page is
live in about two minutes. Drafts are committed too; the build leaves them
out.

Nothing links to `/admin/`. It is `noindex`, `robots.txt` disallows it, and
every API route needs a signed session cookie that only the password gives.

## What IHG does

One screen. On the left the list of everything (Novice, Blog, Dogodki,
Strani, with search). In the middle the content form in cards: title,
summary, category and date; the text with a fixed toolbar above it; the
main picture. On the right the panel that says where the page goes and
what search engines see. Light green is the accent.

- **Text**: the toolbar over the text does headings, bold, italic,
  underline, strike, six colours, highlight, lists, quote, link, a picture
  in the text, alignment and clearing. Selecting words also raises a small
  bar with the same tools. Hover a block for the handle that moves it up or
  down, duplicates or removes it. Insert blocks from the buttons under the
  text or from the panel: paragraph, heading, quote, list, steps, picture,
  callout, button, two columns, table, divider, code. Paste text and it
  becomes paragraphs; paste from Word or a web page and it is cleaned to
  the allowed tags. The panel also takes raw text or HTML.
- **Pictures**: the main picture and pictures in the text go through the
  picture tool: crop with free or fixed ratios (16:10, 16:9, 4:3, 3:2, 1:1,
  4:5), rotate, largest width (800 to 2000 px), JPG quality. Every picture is
  saved as JPG and WebP in two sizes. A picture in the text can be resized
  by dragging its corner or with the 25/33/50/75/100 % buttons, floated
  left or right, given a description and a caption, edited again, replaced
  or removed. The library shows every upload; a click inserts it.
- **Where it goes**: the section of the site (Novice, Blog, Dogodki or a root
  page under Strani), the category shown on the list (pick or add one), a
  parent page for subpages (`/blog/serija/prvi-del/`), event details, the
  button under the title.
- **SEO**: an SEO score with a checklist (title, meta title and description
  lengths, summary, word count, headings, picture descriptions, internal
  link, keyword in title, URL and first paragraph), meta title and
  description with counters and a Google snippet, keywords, structured data
  type (Article, NewsArticle, BlogPosting, Event, WebPage), canonical URL,
  Open Graph title, description and image, noindex and nofollow switches,
  FAQ entries that render on the page and as FAQPage data.
- **Publishing**: save as draft, publish, unpublish, rename the URL, move to
  another section, delete; a full-page preview on a desktop or phone frame,
  rendered with the site's real templates. Unsaved work is kept in the
  browser and offered back after a crash.
- **Analytics**: the dashboard shows views today, over 7 and 30 days,
  visits, share on phones, views per day, the most read pages, referrers and
  countries. Each page's panel shows its own views. See below for what is
  collected.

## Cookies and analytics on the site

`site.analytics.mode` in `content/site.mjs` picks one of two behaviours:

- `cookieless` (the default): the site sets no cookies and shows no banner.
  Every page view sends one beacon to `/api/hit` with the path, the
  referrer host and the viewport width; country comes from Vercel's header.
  Visits are told apart by a code the server makes from the day, the
  address and the browser: it changes every day, is never stored on its own
  and cannot be turned back into an address. Nothing is stored in the
  visitor's browser, so nothing needs consent. `/piskotki/` says so.
- `consent`: every page carries a cookie banner. `ais_consent` remembers
  the choice for 180 days; only when analytics is allowed, `ais_sid` (a
  random id, 30 minutes) is added to the beacon. The footer button reopens
  the banner and `/piskotki/` lists both cookies.

A banner that is hidden while cookies are still set is not allowed in the
EU, which is why the cookieless mode exists: it counts everyone without
asking, because there is nothing to ask about. Switch to `consent` the day
the site adds a cookie of any kind (a chat widget, a third-party tool).

Storage for the counts:

| Where | How |
| --- | --- |
| Live site | Upstash Redis over REST. Create a database (Vercel Marketplace → Upstash, or upstash.com) and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (Vercel's `KV_REST_API_URL` / `KV_REST_API_TOKEN` also work). Free tier is plenty. |
| Local | `data/analytics.json` (ignored by git). |
| Nothing set | Beacons are accepted and dropped; IHG says analytics is off. |

Counts are kept per day for 400 days: views, unique sessions, per page,
per referrer host, per device class, per country.

## One-time setup

1. Make the password hash and a session secret:

   ```bash
   cd website && npm run admin:password
   ```

   It prints `ADMIN_PASSWORD_HASH=…` and `ADMIN_SESSION_SECRET=…`. The password
   itself is not stored anywhere.

2. Local use: put the two lines into `website/.env.admin` (ignored by git).

3. Live site (Vercel project → Settings → Environment Variables, all
   environments):

   | Variable | Value |
   | --- | --- |
   | `ADMIN_PASSWORD_HASH` | from step 1 |
   | `ADMIN_SESSION_SECRET` | from step 1 |
   | `GITHUB_TOKEN` | a fine-grained token, repository `ianveber/cloude-code`, permission Contents: read and write, nothing else |
   | `GITHUB_REPO` | `ianveber/cloude-code` |
   | `GITHUB_BRANCH` | the branch Vercel deploys (today `cursor/ais-website-geo-seo-redesign-112a`) |
   | `CMS_ROOT` | `website` |
   | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | optional, for analytics |

   Redeploy once so the functions see the variables.

4. Open `https://ais-slovenia.si/admin/` and sign in.

## Local use

```bash
cd website && npm run admin
```

Builds the site with drafts included (as noindex pages), serves it, mounts
the API against the local files and rebuilds after every save. Open
`http://localhost:4321/admin/`. Commits are yours to make: `git add -A
content/cms public/uploads && git commit`.

From the Claude desktop app the preview entry is `ais-admin`.

## Where things are

| What | Where |
| --- | --- |
| Items | `content/cms/<novice|blog|dogodki|strani>/<slug>.json` |
| Categories | `content/cms/categories.json` |
| Index IHG lists from | `content/cms/index.json` (rebuild with `npm run admin:reindex`) |
| Uploaded pictures | `public/uploads/<year>/<name>-{800,1600}.{jpg,webp}` |
| Data model, checks, page template | `src/cms.mjs` |
| HTML cleaner (build, preview, editor) | `src/clean-html.mjs` |
| Markdown renderer (older items) | `src/md.mjs` |
| API | `api/_lib/handler.mjs`, entry `api/admin/[...route].js` |
| Beacon and counts | `api/_lib/analytics.mjs`, entry `api/hit.js` |
| Storage | `api/_lib/store-local.mjs`, `api/_lib/store-github.mjs` |
| Password and sessions | `api/_lib/auth.mjs` |
| The app | `public/admin/` (`ihg.js`, `editor.js`, `picture-tool.js`, `ihg.css`) |
| Cookie banner and beacon script | `src/layout.mjs` (markup), `public/js/consent.js`, `content/cookies.mjs` (both versions of the privacy page), mode in `content/site.mjs` |
| Smoke test | `npm run admin:check` (part of `npm run check`) |

An item file:

```json
{
  "collection": "blog",
  "slug": "prvi-zapis",
  "parent": "",
  "status": "published",
  "title": "…",
  "kicker": "Osnove",
  "summary": "…",
  "date": "2026-09-16",
  "format": "html",
  "body": "<h2>…</h2><p>…</p>",
  "picture": { "src": "/uploads/2026/slika", "alt": "…", "caption": "…", "width": 1600, "height": 1000, "upload": true, "webp": true },
  "cta": { "label": "Rezervirajte posvet", "href": "/kontakt/" },
  "seo": {
    "metaTitle": "…", "metaDescription": "…", "keywords": ["…"],
    "ogTitle": "", "ogDescription": "", "ogImage": "", "canonical": "",
    "noindex": false, "nofollow": false, "schemaType": "auto",
    "faq": [{ "q": "…", "a": "…" }]
  },
  "links": [{ "label": "Kontakt", "href": "/kontakt/" }],
  "createdAt": "…", "updatedAt": "…", "publishedAt": "…"
}
```

Events also carry `"event": { "dateLabel", "time", "mode", "place" }`.
`kicker` is the category. `format` is `html` for anything written in IHG;
`markdown` items from the first version still render.

The body HTML is limited to paragraphs, headings h2 to h4, strong, em, u, s,
mark, code, pre, links, lists, quotes, figures with pictures, tables, and
divs or spans with these classes: `align-left|center|right`,
`c-ink|muted|blue|green|orange|red`, `hl`, `lead`, `small`, `cms-callout`
(`--note|good|warn`), `cms-cta`, `cms-columns`, `cms-column`,
`cms-figure` (`--w25|33|50|75|100`, `--left|center|right`). Everything else
is stripped, on the way in and on the way out.

## What publishing does

A published item becomes a page with the site's hero, the main picture
with its caption, the body, event facts, subpages, related links, the FAQ
and the closing band; it gets Article, NewsArticle, BlogPosting or Event
structured data (plus FAQPage when there are questions), Open Graph tags, a
sitemap entry, a Markdown twin and a place in `llms-full.txt`. News and
events appear on `/novice/` and `/dogodki/` above the hand-written items,
blog posts in the blog grid and the home teaser, newest first.

The audit (`node audit.mjs`) checks the published pages like any other. IHG
refuses to publish an item that would fail the obvious ones (empty text,
missing meta description, a picture without a description).

## Security notes

- One shared password, scrypt-hashed. Eight wrong tries lock the address for
  15 minutes (per server instance).
- Session: HMAC-signed cookie, `HttpOnly`, `SameSite=Strict`, `Secure` on
  https, 12 hours, scoped to `/api/admin`.
- Every changing request must carry the `x-ais-admin: 1` header and come
  from the same origin.
- Uploads are checked for JPG/WebP signatures and size; body HTML is cleaned
  with an allow-list, so no script, style or handler reaches the site.
- The beacon accepts only site paths, drops bots and admin paths, and is
  rate-limited per address.
- The GitHub token should be fine-grained and limited to this repository's
  contents. Rotate it if it ever leaks.
- To change the password: run `npm run admin:password` again and replace
  both variables (a new secret signs everyone out).
