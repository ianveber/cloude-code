/* ══════════════════════════════════════════════════════════════════════════
   PASSCODE GATE — private preview of the Heva site
   ══════════════════════════════════════════════════════════════════════════

   Why this exists
   ---------------
   The site is finished but NOT approved (8 `.tbd` markers are still
   unverified business claims). It needs to be viewable in a browser by
   someone non-technical, without being findable by anyone else and without
   Google ever indexing it — an indexed preview copy would compete with the
   real www.heva.si for its own name.

   This runs on Vercel's Edge before any file is served, so nothing —
   not one image, not the privacy page — leaves the server without the code.
   That is the difference between this and a JavaScript password prompt,
   which anyone can bypass with View Source.

   ⚠️  BEFORE GOING LIVE ON www.heva.si
   ------------------------------------
   Delete three files: middleware.js, package.json, vercel.json.
   That is the whole removal. The site itself is untouched by all of this.

   If SITE_PASSCODE is missing the gate FAILS CLOSED (locks everyone out)
   rather than fails open (silently publishes the site). A locked site is a
   phone call; a leaked one is an SEO problem you find out about in a month.

   To change the passcode:
     vercel env rm SITE_PASSCODE production
     echo -n "newcode" | vercel env add SITE_PASSCODE production
     vercel --prod
   ══════════════════════════════════════════════════════════════════════════ */

import { next } from '@vercel/functions';

const COOKIE = 'heva_predogled';
const SALT = 'heva-preview-v1'; // domain-separates the hash; not a secret
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days — type the code once a month

/* The cookie stores SHA-256(salt + passcode), never the passcode itself.
   You cannot forge the cookie without already knowing the code, which is
   the only thing the gate is protecting anyway. */
async function token(passcode) {
  const bytes = new TextEncoder().encode(`${SALT}:${passcode}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Compare without leaking length/position through timing.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function readCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return null;
}

/* Only ever redirect back to a path on this same site. Without this check a
   crafted link could bounce someone to another domain after they log in. */
function safeTarget(raw) {
  if (typeof raw !== 'string') return '/';
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/';
  return raw;
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

/* The gate page. Deliberately plain Slovene, one field, big tap targets —
   the person using this is not technical and may be on a phone. */
function gatePage({ target = '/', error = '', status = 401 } = {}) {
  const html = `<!DOCTYPE html>
<html lang="sl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Predogled — Heva</title>
<link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">
<style>
  :root{
    --brand:#127CB4; --brand-dark:#0A6B9C; --brand-tint:#E6F5FC;
    --ink:#0E2A2B; --text-2:#4A616B; --line:#DEE7EC; --bad:#B3261E;
  }
  *{box-sizing:border-box}
  html,body{height:100%}
  body{
    margin:0; display:flex; align-items:center; justify-content:center;
    padding:24px; background:var(--brand-tint); color:var(--ink);
    font:400 16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .card{
    width:100%; max-width:420px; background:#fff; border-radius:20px;
    padding:40px 32px; box-shadow:0 1px 2px rgba(14,42,43,.06),0 12px 32px rgba(14,42,43,.10);
    text-align:center;
  }
  .mark{
    width:56px; height:56px; margin:0 auto 22px; border-radius:16px;
    background:var(--brand); display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:800; font-size:22px; letter-spacing:.5px;
  }
  h1{margin:0 0 8px; font-size:23px; line-height:1.3; font-weight:700; letter-spacing:-.02em}
  p.sub{margin:0 0 28px; color:var(--text-2); font-size:15px}
  label{display:block; text-align:left; font-size:14px; font-weight:600; margin:0 0 8px}
  input{
    width:100%; padding:15px 16px; font-size:17px; font-family:inherit; color:var(--ink);
    border:1.5px solid var(--line); border-radius:12px; background:#fff;
    transition:border-color .15s, box-shadow .15s;
  }
  input:focus{outline:none; border-color:var(--brand); box-shadow:0 0 0 4px rgba(18,124,180,.15)}
  button{
    width:100%; margin-top:16px; padding:15px 20px; font:600 17px/1 inherit; color:#fff;
    background:var(--brand); border:0; border-radius:12px; cursor:pointer;
    transition:background .15s;
  }
  button:hover{background:var(--brand-dark)}
  button:focus-visible{outline:3px solid rgba(18,124,180,.4); outline-offset:2px}
  .err{
    margin:0 0 20px; padding:12px 14px; border-radius:10px; text-align:left;
    background:#FDECEA; color:var(--bad); font-size:14.5px;
  }
  .foot{margin:26px 0 0; font-size:13.5px; color:var(--text-2)}
  @media (prefers-color-scheme: dark){
    body{background:#0E2A2B; color:#F2F7F9}
    .card{background:#153539; box-shadow:none}
    input{background:#0E2A2B; color:#F2F7F9; border-color:#2A4A4F}
    p.sub,.foot{color:#A8C0C7}
  }
</style>
</head>
<body>
  <main class="card">
    <div class="mark">H</div>
    <h1>Predogled nove spletne strani</h1>
    <p class="sub">Stran še ni javno objavljena. Za ogled vnesite kodo, ki ste jo prejeli.</p>
    ${error ? `<p class="err">${escapeHtml(error)}</p>` : ''}
    <form method="POST" action="/">
      <input type="hidden" name="cilj" value="${escapeHtml(target)}">
      <label for="koda">Koda za ogled</label>
      <input id="koda" name="koda" type="password" autocomplete="current-password"
             autocapitalize="off" autocorrect="off" spellcheck="false" autofocus required>
      <button type="submit">Odpri stran</button>
    </form>
    <p class="foot">Kodo vnesete samo enkrat — brskalnik si jo zapomni 30 dni.</p>
  </main>
</body>
</html>`;

  return new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store, must-revalidate',
      'x-robots-tag': 'noindex, nofollow, noarchive',
      'referrer-policy': 'no-referrer',
    },
  });
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const passcode = process.env.SITE_PASSCODE;

  // Tell every crawler to stay out, whether or not they'd get past the gate.
  if (url.pathname === '/robots.txt') {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'x-robots-tag': 'noindex, nofollow',
      },
    });
  }

  // Never hand out the gate's own source.
  if (url.pathname === '/middleware.js' || url.pathname === '/package.json') {
    return new Response('Not found', { status: 404 });
  }

  // Fail closed: no passcode configured means nobody gets in.
  if (!passcode) {
    return gatePage({
      error: 'Predogled trenutno ni na voljo. Obrnite se na skrbnika strani.',
      status: 503,
    });
  }

  const expected = await token(passcode);

  // Someone submitted the form.
  if (request.method === 'POST') {
    let given = '';
    let target = '/';
    try {
      const form = await request.formData();
      given = String(form.get('koda') ?? '');
      target = safeTarget(form.get('cilj'));
    } catch {
      /* malformed body — treat as a wrong code */
    }

    if (safeEqual(await token(given), expected)) {
      return new Response(null, {
        status: 303, // 303 so the browser follows with GET, not another POST
        headers: {
          location: target,
          'set-cookie': `${COOKIE}=${expected}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
          'cache-control': 'no-store',
          'x-robots-tag': 'noindex, nofollow',
        },
      });
    }

    return gatePage({
      target,
      error: 'Koda ni pravilna. Poskusite znova.',
      status: 401,
    });
  }

  // Already unlocked?
  if (safeEqual(readCookie(request, COOKIE) || '', expected)) {
    return next({
      headers: { 'x-robots-tag': 'noindex, nofollow, noarchive' },
    });
  }

  return gatePage({ target: url.pathname + url.search });
}
