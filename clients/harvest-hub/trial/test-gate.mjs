/**
 * test-gate.mjs — the passcode gate and the trial clock, driven as the real module.
 *
 *   node test-gate.mjs
 *
 * This is the file that decides who reaches a client's documents and on which days, so it is
 * tested by CALLING it, not by reading it. It imports the actual middleware and hands it real
 * Request objects; nothing here is a stand-in for the deployed behaviour except the environment.
 *
 * The three failures worth naming, because none of them raises an error:
 *
 *   TRIAL_ENDS unset       → trialClock() reports "not ended" and the trial runs FOREVER. There is
 *                            no log line, no warning, and the page looks correct on every day of
 *                            its life. `vercel env ls` only proves a variable exists, and
 *                            `vercel env pull` writes an empty placeholder for every encrypted
 *                            value — so neither tells you what was stored. The gate page printing
 *                            its own end date is what makes the setting observable, and that is
 *                            asserted here.
 *   POST before cookie     → if the gate checks "is this a POST?" before "is this cookie valid?",
 *                            every document read is swallowed by the login form. The app breaks
 *                            completely while the gate still looks like it works.
 *   Off-by-one on the end  → TRIAL_ENDS is the first moment the trial is OFF, so the last usable
 *                            day is the day BEFORE it. Getting this backwards either cuts a day
 *                            off the client's trial or runs a day past the signed end date.
 *
 * No network and no API key: every path here is decided before the reading step.
 */

import assert from "node:assert";

/* ── report ────────────────────────────────────────────────────────────── */

let pass = 0, fail = 0;
const ok = (cond, label, detail = "") => {
  if (cond) { pass++; console.log(`  ✓ ${label}`); }
  else { fail++; console.log(`  ✗ ${label}${detail ? `\n      ${detail}` : ""}`); }
};

/* ── harness ───────────────────────────────────────────────────────────── */

const PASS = "TajnaKoda123";
const ORIGIN = "https://preizkus.test";

// The module reads process.env at call time, so each scenario just sets it and calls again.
const { default: middleware } = await import("./middleware.js");

function req(path = "/", { method = "GET", cookie = "", body = null } = {}) {
  const headers = { host: "preizkus.test" };
  if (cookie) headers.cookie = cookie;
  const init = { method, headers };
  if (body) {
    init.body = body;
    headers["content-type"] = "application/x-www-form-urlencoded";
  }
  return new Request(`${ORIGIN}${path}`, init);
}
const form = (koda, cilj = "/") =>
  new URLSearchParams({ koda, cilj }).toString();

// The cookie value is SHA-256(salt + passcode); recomputed here rather than copied, so a change
// to the salt in middleware.js fails these tests instead of silently diverging.
async function cookieFor(passcode) {
  const bytes = new TextEncoder().encode(`harvest-hub-trial-v1:${passcode}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hex = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `hh_preizkus=${hex}`;
}
const GOOD = await cookieFor(PASS);

const withEnv = async (env, fn) => {
  const saved = {};
  for (const [k, v] of Object.entries(env)) {
    saved[k] = process.env[k];
    if (v === undefined) delete process.env[k]; else process.env[k] = v;
  }
  try { return await fn(); }
  finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k]; else process.env[k] = v;
    }
  }
};

const OPEN = { TRIAL_PASSCODE: PASS, TRIAL_ENDS: "2099-01-01T00:00:00Z" };

console.log("\n  the gate and the clock\n");

/* ── 1 · locked by default ─────────────────────────────────────────────── */
await withEnv(OPEN, async () => {
  const r = await middleware(req("/"));
  const html = await r.clone().text();
  ok(r.status === 401, "GET / without a cookie is 401", `got ${r.status}`);
  ok(/type="password"/.test(html), "…and shows the passcode form");
  ok(!/Povlecite ponudbo/.test(html), "…and leaks none of the app behind it");

  const api = await middleware(req("/api/extract", { method: "POST" }));
  ok(api.status === 401, "POST /api/extract without a cookie is 401", `got ${api.status}`);
  ok((await api.text()).includes("zaklenjeno"), "…and answers in JSON the app understands");

  const robots = await middleware(req("/robots.txt"));
  ok((await robots.text()).includes("Disallow: /"), "robots.txt disallows everything");

  for (const p of ["/middleware.js", "/api/README.md", "/lib/claude.mjs", "/lib/mistral.mjs",
                   "/package.json", "/vercel.json", "/build.sh", "/.vercel/project.json",
                   "/test-gate.mjs", "/test-logs.mjs", "/test-deploy.mjs", "/pdf-text.mjs"]) {
    const d = await middleware(req(p));
    ok(d.status === 404, `${p} is not served`, `got ${d.status}`);
  }

  // The browser's own modules must keep working — the deny rules are narrow on purpose.
  for (const p of ["/lib/klp.js", "/lib/confidence.js", "/vendor/pdf.mjs", "/app.js"]) {
    const d = await middleware(req(p));
    ok(d.status !== 404, `${p} IS still reachable (it is the app)`, `got 404 — the app is broken`);
  }
});

/* ── 1b · the sample documents the page offers must actually be reachable ─
 * A dead link here is not cosmetic: this is the only document anyone may run through the trial
 * before the DPA amendment is signed, so if it 404s the nearest alternative is a real client
 * offer. The blanket `\.pdf$` deny rule did exactly that until this test caught it. */
await withEnv(OPEN, async () => {
  for (const p of ["/vzorec/Vzorcna-ponudba.pdf", "/vzorec/Vzorcni-register.csv"]) {
    const d = await middleware(req(p, { cookie: GOOD }));
    ok(d.status !== 404, `${p} is served to an unlocked visitor`,
      `got 404 — the download link on the page is dead`);
  }
  // …but still only behind the gate, and no other PDF gets out.
  const locked = await middleware(req("/vzorec/Vzorcna-ponudba.pdf"));
  ok(locked.status === 401, "…and not to a locked one", `got ${locked.status}`);
  const other = await middleware(req("/out/Kontrolni-list.pdf", { cookie: GOOD }));
  ok(other.status === 404, "a PDF outside /vzorec/ is still refused", `got ${other.status}`);
});

/* ── 2 · the code opens it, the wrong code does not ────────────────────── */
await withEnv(OPEN, async () => {
  const bad = await middleware(req("/", { method: "POST", body: form("napacna") }));
  ok(bad.status === 401, "the wrong code is refused", `got ${bad.status}`);
  ok(!(bad.headers.get("set-cookie") || "").includes("hh_preizkus="),
    "…and sets no cookie", bad.headers.get("set-cookie") || "(none)");

  const good = await middleware(req("/", { method: "POST", body: form(PASS) }));
  const setC = good.headers.get("set-cookie") || "";
  ok(good.status === 303, "the right code redirects with 303", `got ${good.status}`);
  ok(/HttpOnly/i.test(setC) && /Secure/i.test(setC) && /SameSite=Lax/i.test(setC),
    "…and the cookie is HttpOnly + Secure + SameSite=Lax", setC);
  ok(!setC.includes(PASS), "…and the cookie does NOT contain the passcode itself", setC);
});

/* ── 3 · COOKIE BEFORE METHOD — the bug that breaks every document read ── */
await withEnv(OPEN, async () => {
  const r = await middleware(req("/api/extract", { method: "POST", cookie: GOOD }));
  ok(r.status !== 401 && r.status !== 303,
    "an authenticated POST to /api/extract passes through the gate",
    `got ${r.status} — the gate is treating it as a login form, which breaks every read`);

  const page = await middleware(req("/", { cookie: GOOD }));
  ok(page.status !== 401, "an authenticated GET passes through", `got ${page.status}`);
});

/* ── 4 · the clock outranks the cookie ─────────────────────────────────── */
await withEnv({ TRIAL_PASSCODE: PASS, TRIAL_ENDS: "2020-01-01T00:00:00Z" }, async () => {
  const page = await middleware(req("/", { cookie: GOOD }));
  ok(page.status === 410, "after the end, a VALID cookie still gets 410", `got ${page.status}`);
  ok((await page.text()).includes("zaključen"), "…and says so in Slovene");

  const api = await middleware(req("/api/extract", { method: "POST", cookie: GOOD }));
  ok(api.status === 410, "…and the API is closed too", `got ${api.status}`);
});

/* ── 5 · the end date is OBSERVABLE from outside ───────────────────────── */
await withEnv({ TRIAL_PASSCODE: PASS, TRIAL_ENDS: "2026-08-17T22:00:00Z" }, async () => {
  const html = await (await middleware(req("/"))).text();
  ok(/Preizkus je odprt do vklju/.test(html), "the gate page states its own end date", html.slice(-300));
  const shown = (html.match(/Preizkus je odprt do vključno <strong>([^<]*)<\/strong>/) || [])[1];
  ok(shown === "17. avgusta 2026",
    "…and names the LAST USABLE day, in the genitive Slovene the sentence needs",
    `shows "${shown}" — want "17. avgusta 2026" (18 Aug would be the cut-off, "avgust" the wrong case)`);
  ok(/zapre se 18\. 8\. ob 00:00/.test(html),
    "…and the exact closing moment, so the deployed value is unambiguous",
    (html.match(/\(zapre se [^)]*\)/) || ["(not shown)"])[0]);
});

/* ── 5b · the ambiguity the closing moment exists to remove ──────────────
 * A bare date and a midnight-Ljubljana timestamp print the SAME last day while shutting nearly a
 * day apart. If the page showed only the day, these two would be indistinguishable from outside —
 * which is exactly the state this trial was in until it was measured. */
await withEnv({ TRIAL_PASSCODE: PASS, TRIAL_ENDS: "2026-08-17" }, async () => {
  const html = await (await middleware(req("/"))).text();
  const day = (html.match(/<strong>([^<]*)<\/strong>/) || [])[1];
  const shuts = (html.match(/\(zapre se ([^)]*)\)/) || [])[1];
  ok(day === "17. avgusta 2026",
    "a BARE date shows the same last day as the timestamped one…", `shows "${day}"`);
  ok(shuts === "17. 8. ob 02:00",
    "…but a different closing moment — 02:00 that morning, not the end of the day",
    `shows "${shuts}" — if this ever reads the same as the timestamped case, the page has stopped ` +
    `distinguishing them and a whole day of the trial can vanish unnoticed`);

  // 22:00Z is already the next day in Ljubljana. Formatting in UTC would print 18 Aug here, so
  // this pins the timezone rather than the arithmetic.
  await withEnv({ TRIAL_PASSCODE: PASS, TRIAL_ENDS: "2026-08-17T23:30:00Z" }, async () => {
    const h2 = await (await middleware(req("/"))).text();
    const s2 = (h2.match(/<strong>([^<]*)<\/strong>/) || [])[1];
    ok(s2 === "18. avgusta 2026",
      "an end at 23:30Z is 01:30 Ljubljana, so the last day is the 18th",
      `shows "${s2}"`);
  });
});

/* ── 5c · the trial has a START, not only an end ─────────────────────────
 *
 * "Fourteen days from tomorrow" was, for a while, only an end date, and the gate was open the day
 * the code was handed over. A client clicking on the day they received the email would have spent
 * one of their fourteen days before the window the amendment names had opened, and nothing on the
 * page or in the contract would have shown it. An agreed period has two ends.
 */
await withEnv({ TRIAL_PASSCODE: PASS, TRIAL_STARTS: "2099-01-01T00:00:00Z",
                TRIAL_ENDS: "2099-02-01T00:00:00Z" }, async () => {
  const r = await middleware(req("/"));
  const html = await r.text();
  ok(r.status === 425, "before the start day the page answers 425 Too Early", `got ${r.status}`);
  ok(/se še ni začel/.test(html), "…and says the trial has not started");
  ok(!/zaključen/.test(html), "…and does NOT say it has ended — the opposite of the truth");
  ok(!/type=\"password\"/.test(html), "…and offers no passcode box, which would just be confusing");

  // A valid cookie must not sneak past the start either.
  const withCookie = await middleware(req("/", { cookie: GOOD }));
  ok(withCookie.status === 425, "…and a valid cookie does not get in early", `got ${withCookie.status}`);

  const api = await middleware(req("/api/extract", { method: "POST", cookie: GOOD }));
  ok(api.status === 425, "…nor does the API", `got ${api.status}`);
  ok((await api.text()).includes("preizkus_se_ni_zacel"), "…with its own code, not the ended one");
});

await withEnv({ TRIAL_PASSCODE: PASS, TRIAL_STARTS: "2020-01-01T00:00:00Z",
                TRIAL_ENDS: "2026-08-17T22:00:00Z" }, async () => {
  const r = await middleware(req("/"));
  const html = await r.text();
  ok(r.status === 401, "once started, the ordinary gate is back", `got ${r.status}`);
  ok(/Preizkus je odprt od <strong>1\. januarja 2020<\/strong> do vključno/.test(html),
    "…and the gate page states the whole window, not just the end",
    (html.match(/Preizkus je odprt[^.]*\./) || ["(not found)"])[0]);
});

// Ended beats not-started: a deployment misconfigured into both states must close, not reopen.
await withEnv({ TRIAL_PASSCODE: PASS, TRIAL_STARTS: "2099-01-01T00:00:00Z",
                TRIAL_ENDS: "2020-01-01T00:00:00Z" }, async () => {
  const r = await middleware(req("/", { cookie: GOOD }));
  ok(r.status === 410, "with both dates wrong, ENDED wins — it closes rather than reopens",
    `got ${r.status}`);
});

/* ── 6 · the two fail-open shapes ──────────────────────────────────────── */
await withEnv({ TRIAL_PASSCODE: PASS, TRIAL_ENDS: undefined }, async () => {
  const r = await middleware(req("/"));
  const html = await r.text();
  // Documented, not endorsed: with no end date the trial never closes. The page must at least
  // not claim an end it does not have.
  ok(r.status === 401, "with TRIAL_ENDS unset the gate still locks", `got ${r.status}`);
  ok(!/Preizkus je odprt do/.test(html),
    "…and promises no end date it cannot keep — this is the FAIL-OPEN case, set TRIAL_ENDS");
});

await withEnv({ TRIAL_PASSCODE: PASS, TRIAL_ENDS: "kdaj-pa-ze" }, async () => {
  const r = await middleware(req("/", { cookie: GOOD }));
  ok(r.status === 410, "an unreadable TRIAL_ENDS locks the trial rather than opening it",
    `got ${r.status} — fail-closed is the whole point`);
});

/* The two ends fail in OPPOSITE directions, on purpose. Overrunning the agreed end means
 * processing personal data without a basis, so a bad end date locks. A bad START date only risks
 * letting someone in early, and locking a paying prospect out of a working trial over a typo is
 * the worse outcome — so it is ignored and logged. This asserts the asymmetry is deliberate. */
await withEnv({ TRIAL_PASSCODE: PASS, TRIAL_STARTS: "kdaj-pa-ze",
                TRIAL_ENDS: "2099-01-01T00:00:00Z" }, async () => {
  const r = await middleware(req("/"));
  ok(r.status === 401,
    "an unreadable TRIAL_STARTS is ignored, not treated as 'never starts'",
    `got ${r.status} — a typo in the start date must not lock the client out of a live trial`);
});

await withEnv({ TRIAL_PASSCODE: undefined, SITE_PASSCODE: undefined, TRIAL_ENDS: "2099-01-01" },
  async () => {
    const r = await middleware(req("/"));
    ok(r.status === 503, "no passcode configured locks everybody out", `got ${r.status}`);
    const api = await middleware(req("/api/extract", { method: "POST" }));
    ok(api.status === 503, "…including the API", `got ${api.status}`);
  });

/* ── 7 · the cookie may not outlive the trial ──────────────────────────── */
{
  const soon = new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString();
  await withEnv({ TRIAL_PASSCODE: PASS, TRIAL_ENDS: soon }, async () => {
    const r = await middleware(req("/", { method: "POST", body: form(PASS) }));
    const m = (r.headers.get("set-cookie") || "").match(/Max-Age=(\d+)/);
    const days = m ? Number(m[1]) / 86400 : -1;
    ok(days > 1.9 && days < 2.1,
      "with 2 days left, the cookie lasts ~2 days — not the full 14",
      `Max-Age is ${days.toFixed(2)} days`);
  });
}

/* ── 8 · the redirect target cannot be pointed off-site ────────────────── */
await withEnv(OPEN, async () => {
  // `/\evil` is the one that got through the first version of safeTarget: it starts with a single
  // slash, so a check for "//" waves it past, and the browser then normalises the backslash and
  // goes off-site anyway. The rest are the ordinary forms.
  const evils = [
    "https://zlonamerno.test/",
    "//zlonamerno.test/",
    "/\\zlonamerno.test",
    "/\\/zlonamerno.test",
    "\\\\zlonamerno.test",
    // Raw tab / newline / carriage return. Browsers and the URL parser STRIP these before
    // resolving, so "/<TAB>/host" becomes "//host" and leaves the origin. Percent-encoded %09
    // does not — it stays a literal path segment and is genuinely same-origin, which is why it
    // is not in this list: asserting on it would be asserting a false positive.
    "/\t/zlonamerno.test",
    "/\n/zlonamerno.test",
    "/\r/zlonamerno.test",
  ];
  for (const evil of evils) {
    const r = await middleware(req("/", { method: "POST", body: form(PASS, evil) }));
    const loc = r.headers.get("location") || "";
    ok(!loc.includes("zlonamerno"), `an off-site redirect target is refused (${evil})`, `location: ${loc}`);
  }
});

console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
