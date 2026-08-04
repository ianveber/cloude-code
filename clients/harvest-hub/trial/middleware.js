/* ══════════════════════════════════════════════════════════════════════════
   PASSCODE GATE + TRIAL CLOCK — hosted trial of "Prenos dokumentacije"
   ══════════════════════════════════════════════════════════════════════════

   What this protects
   ------------------
   The trial instance reads insurance offers that carry health data about real
   people, including children. Nothing on this deployment may be reachable by
   anyone who was not given the code, and nothing may ever be indexed. This runs
   on Vercel before any file is served and before the one function is invoked,
   so neither a page, nor a script, nor a document read leaves the server
   without the code. That is the difference between this and a JavaScript
   password prompt, which anyone can bypass with View Source.

   Adapted from heva/refresh/middleware.js — the hashing, the timing-safe
   compare, the safe-redirect check and the fail-closed behaviour are that
   file's, unchanged in substance.

   ⚠️  THE ORDERING BUG THAT MUST NOT COME BACK
   --------------------------------------------
   The Heva original handled `request.method === 'POST'` BEFORE it looked at the
   cookie. That was correct there: Heva is a static site whose only POST is the
   passcode form itself. This app is not static — the browser POSTs to
   /api/extract for every single document. With the Heva ordering, an already
   unlocked user's document read would be swallowed by the gate, its JSON body
   parsed as a form, and answered with "wrong code".

   So here the COOKIE IS CHECKED FIRST. An unlocked request passes straight
   through via next() whatever its method. Only an *unauthenticated* POST can be
   a form submission. Do not reorder these two blocks.

   Environment
   -----------
     TRIAL_PASSCODE   required. Missing → everyone is locked out (never opened).
                      SITE_PASSCODE is accepted as a fallback name.
     TRIAL_STARTS     optional ISO date/time. Before it, every request gets a
                      plain "the trial has not started yet" page (425) — the
                      code is right, the window is not open. Unset or
                      unparseable → no start restriction (logged). This exists
                      so "14 days from the 4th" is not merely an end date with
                      the door already open.

     TRIAL_ENDS       optional ISO date/time, e.g. 2026-08-17 or
                      2026-08-17T22:00:00Z. This is the first moment the trial
                      is OFF: a bare date means midnight UTC that morning, so
                      the last usable day is the day before. After it every
                      request — including one holding a valid cookie — gets a
                      plain "the trial has ended" page. Absent → no expiry.
                      Unparseable → treated as ENDED (fails closed, and says so
                      in the deployment log).

     vercel env add TRIAL_PASSCODE production
     vercel env add TRIAL_ENDS production
     vercel --prod

   To take the trial down for good, delete the deployment. This file only stops
   people getting in; it does not delete anything.
   ══════════════════════════════════════════════════════════════════════════ */

import { next } from '@vercel/functions';

const COOKIE = 'hh_preizkus';
const SALT = 'harvest-hub-trial-v1'; // domain-separates the hash; not a secret
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days — the length of the whole trial

/* The cookie stores SHA-256(salt + passcode), never the passcode itself.
   You cannot forge the cookie without already knowing the code, which is the
   only thing the gate is protecting anyway. */
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
   crafted link could bounce someone to another domain after they log in.

   Rejecting `//` alone is not enough. Browsers normalise a BACKSLASH after the
   leading slash to the same thing, so `/\evil.test` is fetched as `//evil.test`
   — an off-site redirect that starts with a single '/' and passes any check
   looking only for '//'. Found by test-gate.mjs, which asserts all three forms.

   So rather than enumerate the tricks, resolve the target the way a browser
   would and keep it only if it stayed on this origin. Anything else goes to '/'. */
function safeTarget(raw) {
  if (typeof raw !== 'string' || !raw.startsWith('/')) return '/';
  if (raw.startsWith('//') || raw.startsWith('/\\')) return '/';
  // Backslashes anywhere in the authority position are treated as slashes by
  // browsers; there is no legitimate use for one in a path we generate.
  if (raw.includes('\\')) return '/';
  let u;
  try {
    u = new URL(raw, 'https://placeholder.invalid');
  } catch {
    return '/';
  }
  if (u.origin !== 'https://placeholder.invalid') return '/';
  return u.pathname + u.search;
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

/* ── what is never served ────────────────────────────────────────────────────
 * An allowlist assembles the deployment (build.sh); this is the second lock on
 * the same door. Two things matter here:
 *   · lib/*.mjs are the SERVER-side modules (claude.mjs, mistral.mjs) that
 *     api/extract.js imports. lib/*.js are the browser's own modules and must
 *     keep working, as must vendor/pdf.mjs — so the rule is "mjs under lib/",
 *     not "mjs".
 *   · /api/extract is the only route that exists. Everything else under /api/
 *     — helpers, the README, a future file nobody thought about — is refused
 *     by default rather than allowed by default.
 */
const DENY = [
  /^\/middleware\.js$/,
  /^\/package(-lock)?\.json$/,
  /^\/vercel\.json$/,
  /^\/lib\/.*\.mjs$/i, // server-side modules; lib/*.js (browser) stay served
  /^\/api\/(?!extract$)/, // only /api/extract exists
  /^\/(\.|node_modules\/|scripts\/|out\/)/,
  /(truth\.json|register-zastopnikov\.json)$/i,
  /\.(md|sh|env|log|lock)$/i,
  // Every .mjs at the root is ours, not the browser's: the test suites and pdf-text.mjs. The
  // browser's own modules live under lib/ and vendor/ and are untouched by this.
  /^\/[^/]+\.mjs$/i,
  /**
   * PDFs are denied EVERYWHERE EXCEPT /vzorec/.
   *
   * The blanket `\.pdf$` rule that used to be here was right when nothing on the deployment was
   * a PDF. The page now offers a sample ponudba for download — which is the only document anyone
   * may put through the trial before the DPA amendment is signed — and the blanket rule 404'd it,
   * turning the one safe path into a dead link and leaving a real client offer as the easiest
   * thing to reach for instead.
   *
   * /vzorec/ is an allowlisted directory: build.sh copies exactly two named files into it and
   * refuses if either is missing, reads inside the PDF with pdf-text.mjs, and rejects it unless
   * it is free of client names AND marked as a sample on its face.
   */
  /^(?!\/vzorec\/)[^?]*\.pdf$/i,
];
const denied = (pathname) => DENY.some((re) => re.test(pathname));

/* ── the trial clock ─────────────────────────────────────────────────────────
 * Returns { started, ended, startsAt, endsAt }.
 *
 * THE END is the strict one. An unparseable TRIAL_ENDS is treated as ended: a trial that stops a
 * day early is a phone call, a trial that quietly runs on past its agreed end is processing
 * personal data without a basis for it.
 *
 * THE START exists because "fourteen days from tomorrow" was, for a while, only an end date.
 * The gate was open the day the code was handed over, so the client could have spent a day of
 * their fourteen before the window the amendment names had even opened — and nothing on the page
 * or in the contract would have shown the discrepancy. An agreed period has two ends.
 *
 * It is deliberately NOT symmetric with the end: an unparseable TRIAL_STARTS means "no start
 * restriction", not "locked". Failing closed is right when the risk is processing data too long;
 * here the risk is only that a client is let in early, and locking a paying prospect out of a
 * working trial because of a typo in a date is the worse outcome. Loudly logged either way.
 */
function trialClock() {
  const rawEnd = process.env.TRIAL_ENDS;
  let endsAt = null;
  let ended = false;
  if (rawEnd !== undefined && rawEnd !== null && String(rawEnd).trim() !== '') {
    endsAt = Date.parse(String(rawEnd).trim());
    if (!Number.isFinite(endsAt)) {
      console.error(`TRIAL_ENDS is not a date I can read (${String(rawEnd)}) — locking the trial.`);
      return { started: true, ended: true, startsAt: null, endsAt: null };
    }
    ended = Date.now() >= endsAt;
  }

  const rawStart = process.env.TRIAL_STARTS;
  let startsAt = null;
  if (rawStart !== undefined && rawStart !== null && String(rawStart).trim() !== '') {
    const t = Date.parse(String(rawStart).trim());
    if (Number.isFinite(t)) startsAt = t;
    else console.error(`TRIAL_STARTS is not a date I can read (${String(rawStart)}) — ignoring it.`);
  }

  return { started: startsAt === null || Date.now() >= startsAt, ended, startsAt, endsAt };
}

/* The cookie must never outlive the trial. */
function cookieMaxAge(endsAt) {
  if (!endsAt) return MAX_AGE;
  const left = Math.floor((endsAt - Date.now()) / 1000);
  return Math.max(60, Math.min(MAX_AGE, left));
}

const SECURITY_HEADERS = {
  'cache-control': 'no-store, must-revalidate',
  'x-robots-tag': 'noindex, nofollow, noarchive, nosnippet',
  'referrer-policy': 'no-referrer',
  'x-content-type-options': 'nosniff',
};

/* ── the two pages ───────────────────────────────────────────────────────────
 * Apple-light, matching the app behind the gate (the palette is index.html's).
 * Plain Slovene, one field, big tap targets — the person using this is not
 * technical and is quite possibly on a phone.
 */
const SHELL = (title, body) => `<!doctype html>
<html lang="sl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(title)}</title>
<link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">
<style>
  :root{
    --bg:#f5f5f7; --card:#fff; --ink:#1d1d1f; --dim:#6e6e73; --line:#e8e8ed;
    --blue:#0071e3; --red:#ff3b30;
    --font:-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",Helvetica,Arial,sans-serif;
  }
  *{box-sizing:border-box}
  html,body{height:100%}
  body{margin:0;display:flex;align-items:center;justify-content:center;padding:24px;
       background:var(--bg);color:var(--ink);font-family:var(--font);font-size:15px;
       line-height:1.5;-webkit-font-smoothing:antialiased}
  .card{width:100%;max-width:400px;background:var(--card);border:1px solid var(--line);
        border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,.04);padding:36px 28px;text-align:center}
  .mark{width:46px;height:46px;margin:0 auto 20px;border-radius:13px;background:var(--ink);
        color:#fff;display:flex;align-items:center;justify-content:center;
        font-weight:600;font-size:14px;letter-spacing:.06em}
  h1{font-size:21px;letter-spacing:-.022em;font-weight:600;margin:0 0 6px}
  p.sub{color:var(--dim);margin:0 0 24px;font-size:14px}
  label{display:block;text-align:left;font-size:13px;color:var(--dim);margin:0 0 7px}
  input{width:100%;padding:12px 14px;font:inherit;font-size:16px;color:var(--ink);
        border:1px solid #d2d2d7;border-radius:12px;background:#fff;
        transition:border-color .15s,box-shadow .15s}
  input:focus{outline:none;border-color:var(--blue);box-shadow:0 0 0 4px #0071e322}
  button{appearance:none;width:100%;margin-top:14px;border:0;border-radius:980px;
         background:var(--blue);color:#fff;font:inherit;font-weight:500;font-size:15px;
         padding:12px 20px;cursor:pointer}
  button:hover{filter:brightness(1.06)}
  button:focus-visible{outline:3px solid #0071e355;outline-offset:2px}
  .err{margin:0 0 18px;padding:11px 13px;border-radius:12px;text-align:left;
       background:#fff1f0;color:#b3261e;font-size:14px}
  .foot{margin:22px 0 0;font-size:13px;color:var(--dim)}
  .tih{color:#a1a1a8}
</style>
</head>
<body>
  <main class="card">
    <div class="mark">AIS</div>
${body}
  </main>
</body>
</html>`;

function htmlResponse(html, status) {
  return new Response(html, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', ...SECURITY_HEADERS },
  });
}

function jsonResponse(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...SECURITY_HEADERS },
  });
}

/**
 * The trial's last day, in Slovene, for the reader — and for whoever deployed it.
 *
 * TRIAL_ENDS is the single setting that decides whether this thing ever closes, and an unset one
 * fails OPEN: trialClock() returns { ended: false } and the trial runs forever. That is the one
 * failure in this file that produces no error, no log line and no visible difference on the day
 * it matters. `vercel env ls` shows only that a variable exists, and `vercel env pull` writes an
 * empty placeholder for every encrypted value — so neither can tell you what was actually stored.
 *
 * Printing it on the gate page turns an invisible setting into one anybody can read from outside
 * with a single request, before handing the code to a client. It is also simply what the reader
 * wants to know, and what Aneks 1 (A1) promises them in writing.
 *
 * TRIAL_ENDS is the first moment the trial is OFF, so the last usable day is the day before it.
 */
/* Genitive, because the phrase is "do … 17. avgusta", not "do … 17. avgust". Intl gives the
   nominative ('avgust') and there is no option that fixes it, so the twelve words are written
   out. Cheaper than being wrong on a page a client reads. */
const MESECI_RODILNIK = ['januarja', 'februarja', 'marca', 'aprila', 'maja', 'junija',
  'julija', 'avgusta', 'septembra', 'oktobra', 'novembra', 'decembra'];

const ljubljana = (t, opts) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Ljubljana', ...opts }).format(t);

/**
 * The last usable DAY, plus the exact moment it shuts. Both, deliberately.
 *
 * The day alone is ambiguous in the one way that matters. TRIAL_ENDS=`2026-08-17` (a bare date,
 * midnight UTC) and TRIAL_ENDS=`2026-08-17T22:00:00Z` (midnight Ljubljana) render the SAME last
 * day — "17. avgusta 2026" — while the first shuts the trial at 02:00 that morning and the second
 * at the end of it. Nearly a full day of a fourteen-day trial, invisible on the page, and no way
 * to tell which one is deployed since neither `vercel env ls` nor `vercel env pull` will show you
 * the value.
 *
 * Printing the closing instant removes the ambiguity for the reader and for whoever deployed it.
 */
function lastDayText(endsAt) {
  if (!endsAt) return null;
  const last = new Date(endsAt - 1000);
  try {
    const [d, m, y] = ljubljana(last, { day: 'numeric', month: 'numeric', year: 'numeric' })
      .split('/').map(Number);
    const clock = ljubljana(new Date(endsAt), { hour: '2-digit', minute: '2-digit', hour12: false });
    const [cd, cm] = ljubljana(new Date(endsAt), { day: 'numeric', month: 'numeric' })
      .split('/').map(Number);
    return { day: `${d}. ${MESECI_RODILNIK[m - 1]} ${y}`, shuts: `${cd}. ${cm}. ob ${clock}` };
  } catch {
    return { day: last.toISOString().slice(0, 10), shuts: new Date(endsAt).toISOString() };
  }
}

/** The first usable day, for the window line on the gate page and the not-yet page. */
function firstDayText(startsAt) {
  if (!startsAt) return null;
  try {
    const [d, m, y] = ljubljana(new Date(startsAt),
      { day: 'numeric', month: 'numeric', year: 'numeric' }).split('/').map(Number);
    return `${d}. ${MESECI_RODILNIK[m - 1]} ${y}`;
  } catch {
    return new Date(startsAt).toISOString().slice(0, 10);
  }
}

function gatePage({ target = '/', error = '', status = 401, endsAt = null, startsAt = null } = {}) {
  const last = lastDayText(endsAt);
  const first = firstDayText(startsAt);
  return htmlResponse(
    SHELL(
      'Prenos dokumentacije — AIS',
      `    <h1>Prenos dokumentacije</h1>
    <p class="sub">Stran je zaklenjena. Za vstop vnesite kodo, ki ste jo prejeli.</p>
    ${error ? `<p class="err">${escapeHtml(error)}</p>` : ''}
    <form method="POST" action="/">
      <input type="hidden" name="cilj" value="${escapeHtml(target)}">
      <label for="koda">Koda za vstop</label>
      <input id="koda" name="koda" type="password" autocomplete="current-password"
             autocapitalize="off" autocorrect="off" spellcheck="false" autofocus required>
      <button type="submit">Odpri</button>
    </form>
    <p class="foot">Kodo vnesete samo enkrat — brskalnik si jo zapomni do konca preizkusa.${
      last ? `<br>Preizkus je odprt ${first ? `od <strong>${escapeHtml(first)}</strong> ` : ''}` +
             `do vključno <strong>${escapeHtml(last.day)}</strong>` +
             ` <span class="tih">(zapre se ${escapeHtml(last.shuts)})</span>.` : ''
    }</p>`
    ),
    status
  );
}

/**
 * Before the agreed first day.
 *
 * 425 Too Early is the honest status: the request is well-formed and the caller is welcome, just
 * not yet. It is NOT 401 (that would say the code is wrong) and NOT 410 (that would say the trial
 * is over, which is the opposite of the truth and the message a client would remember).
 */
function notYetPage(startsAt) {
  const first = firstDayText(startsAt);
  return htmlResponse(
    SHELL(
      'Prenos dokumentacije — AIS',
      `    <h1>Preizkus se še ni začel</h1>
    <p class="sub">Dogovorjeno obdobje preizkusa se začne${first ? ` <strong>${escapeHtml(first)}</strong>` : ' kmalu'}.
    Takrat bo ista koda za vstop delovala brez sprememb.</p>
    <p class="foot">Štirinajst dni teče od tega dne, zato vam z danes ne vzamemo dneva.</p>`
    ),
    425
  );
}

function endedPage() {
  return htmlResponse(
    SHELL(
      'Prenos dokumentacije — AIS',
      `    <h1>Preizkus je zaključen</h1>
    <p class="sub">Obdobje preizkusa se je izteklo, zato stran ni več dostopna.</p>
    <p class="foot">Za nadaljnje korake se obrnite na AIS.</p>`
    ),
    410
  );
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  // TRIAL_PASSCODE is the name for this deployment; SITE_PASSCODE is accepted so
  // a copy of the Heva runbook does not silently lock the trial out.
  const passcode = process.env.TRIAL_PASSCODE || process.env.SITE_PASSCODE;
  const isApi = path === '/api/extract';

  // Tell every crawler to stay out, whether or not they'd get past the gate.
  if (path === '/robots.txt') {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'content-type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS },
    });
  }

  // Never hand out the gate's own source, the server-side modules, or anything
  // under api/ other than the one route.
  if (denied(path)) return new Response('Not found', { status: 404 });

  // The clock outranks the cookie: when the trial is over it is over for
  // everybody, including someone still holding a valid one.
  // Read the clock ONCE per request. Two separate reads could straddle the expiry moment and
  // hand out a cookie for a trial that had just closed.
  const clock = trialClock();
  if (clock.ended) {
    return isApi ? jsonResponse({ error: 'preizkus_zakljucen' }, 410) : endedPage();
  }
  // Not yet. Checked AFTER `ended` so a misconfiguration that makes both true still closes the
  // trial rather than reopening it.
  if (!clock.started) {
    return isApi
      ? jsonResponse({ error: 'preizkus_se_ni_zacel' }, 425)
      : notYetPage(clock.startsAt);
  }

  // Fail closed: no passcode configured means nobody gets in.
  if (!passcode) {
    return isApi
      ? jsonResponse({ error: 'zaklenjeno' }, 503)
      : gatePage({ error: 'Stran trenutno ni na voljo. Obrnite se na AIS.', status: 503,
                   endsAt: clock.endsAt, startsAt: clock.startsAt });
  }

  const expected = await token(passcode);

  /* ── COOKIE FIRST. See the warning at the top of this file. ────────────────
   * An unlocked request goes straight through whatever its method — this is
   * what keeps POST /api/extract working for every document the client reads.
   * Only after this can a POST be assumed to be the passcode form. */
  if (safeEqual(readCookie(request, COOKIE) || '', expected)) {
    return next({ headers: { 'x-robots-tag': 'noindex, nofollow, noarchive, nosnippet' } });
  }

  // Locked, and it is the app calling rather than a person: answer in the shape
  // the page already knows how to handle instead of a login form it cannot read.
  if (isApi) return jsonResponse({ error: 'zaklenjeno' }, 401);

  // An unauthenticated POST is the gate's own form.
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
      const maxAge = cookieMaxAge(clock.endsAt);
      return new Response(null, {
        status: 303, // 303 so the browser follows with GET, not another POST
        headers: {
          location: target,
          'set-cookie': `${COOKIE}=${expected}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`,
          ...SECURITY_HEADERS,
        },
      });
    }

    return gatePage({ target, error: 'Koda ni pravilna. Poskusite znova.', status: 401,
                      endsAt: clock.endsAt, startsAt: clock.startsAt });
  }

  return gatePage({ target: path + url.search, endsAt: clock.endsAt, startsAt: clock.startsAt });
}
