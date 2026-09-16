# Admin: urejanje novic, bloga, dogodkov in strani

The site stays static. The admin is a small private app at `/admin/` and an
API under `/api/admin/` that writes content files into the repository. Every
publish is a commit on the deployed branch, so Vercel rebuilds the site and
the new page is live in about two minutes. Drafts are committed too, but the
build leaves them out.

Nothing links to `/admin/`. It is `noindex`, `robots.txt` disallows it, and
every API route needs a signed session cookie that only the password gives.

## What editors can do

- Novice, Blog, Dogodki, Strani: create, edit, save as draft, publish,
  unpublish, delete, rename the URL.
- Text in Markdown with a toolbar and a live preview; pictures in the text.
- One main picture per item, uploaded from the browser (resized to 1600 px,
  saved as JPG and WebP in two sizes), with a required description.
- SEO: meta title and description with counters and a Google snippet
  preview, keywords, Open Graph image, noindex switch.
- Subpages: any item can have a parent in the same collection; the child
  lives under the parent's URL (`/blog/serija/prvi-del/`) and the parent
  lists its children under "Podstrani". Pages (Strani) live at the root
  (`/moja-stran/`) and may nest the same way.
- Related links, picked from every page of the site or typed.
- Full-page preview of a draft, rendered with the real templates, on a
  desktop or phone frame.
- A media library with usage counts; a picture in use cannot be deleted.

## One-time setup

1. Make the password hash and a session secret:

   ```bash
   cd website && npm run admin:password
   ```

   It prints two lines, `ADMIN_PASSWORD_HASH=…` and `ADMIN_SESSION_SECRET=…`.
   The password itself is not stored anywhere.

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

   Redeploy once so the function sees the variables.

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
| Index the admin lists from | `content/cms/index.json` (rebuild with `npm run admin:reindex`) |
| Uploaded pictures | `public/uploads/<year>/<name>-{800,1600}.{jpg,webp}` |
| Data model, checks, page template | `src/cms.mjs` |
| Markdown renderer (build and browser) | `src/md.mjs` (copied to `dist/admin/md.js`) |
| API | `api/_lib/handler.mjs`, entry `api/admin/[...route].js` |
| Storage | `api/_lib/store-local.mjs`, `api/_lib/store-github.mjs` |
| Password and sessions | `api/_lib/auth.mjs` |
| Admin app | `public/admin/` |
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
  "body": "# Markdown …",
  "picture": { "src": "/uploads/2026/slika", "alt": "…", "width": 1600, "height": 1000, "upload": true, "webp": true },
  "seo": { "metaTitle": "…", "metaDescription": "…", "keywords": ["…"], "ogImage": "", "noindex": false },
  "links": [{ "label": "Kontakt", "href": "/kontakt/" }],
  "createdAt": "…", "updatedAt": "…", "publishedAt": "…"
}
```

Events also carry `"event": { "dateLabel", "time", "mode", "place" }`.

## What publishing does

A published item becomes a page with the site's hero, the main picture, the
body, event facts, subpages, related links and the closing band; it gets
`Article` / `NewsArticle` / `Event` structured data, Open Graph tags, a
sitemap entry, a Markdown twin and a place in `llms-full.txt`. News and
events appear on `/novice/` and `/dogodki/` above the hand-written items,
blog posts in the blog grid and the home teaser, newest first.

The audit (`node audit.mjs`) checks the published pages like any other:
meta lengths, headings, images with alt text. The admin refuses to publish
an item that would fail the obvious ones (empty text, missing meta
description, picture without a description).

## Security notes

- One shared password, scrypt-hashed. Eight wrong tries lock the address for
  15 minutes (per server instance).
- Session: HMAC-signed cookie, `HttpOnly`, `SameSite=Strict`, `Secure` on
  https, 12 hours, scoped to `/api/admin`.
- Every changing request must carry the `x-ais-admin: 1` header and come
  from the same origin.
- Uploads are checked for JPG/WebP signatures and size; Markdown is
  rendered with HTML escaped, so no script can be injected into the site.
- The GitHub token should be fine-grained and limited to this repository's
  contents. Rotate it if it ever leaks.
- To change the password: run `npm run admin:password` again and replace
  both variables (a new secret signs everyone out).
