# G3a — Hardening gate on what already exists (the demo)

**Artifact:** `clients/harvest-hub/demo/` — local single-process app (node:http static host + one AI
endpoint), plus the client's real sample documents that feed it.
**Standard:** `ai-infrastructure-protocol/pillars/5-security/SKILL.md` (8 controls, evidence-or-RED).
**Run date:** 30. 7. 2026. **Mode:** read-only. Nothing under `demo/` was modified.
**Gate verdict: RED.**

Three reds, one of which is a **live contractual breach**, not a theoretical weakness:

| # | Finding | Control |
|---|---|---|
| **R-1** | The client's real personal data — including GDPR Art. 9 health documents — sits **inside the git work tree**, which the signed-ready DPA (5(a)) says it will not. | D / S1 |
| **R-2** | `DEMO_SAMPLES=1` is **hardcoded into the only registered launch path**, and the server is **serving those PDFs over HTTP right now**. The code comment says "never enable this"; the launcher enables it every time. | S2 / S8 |
| **R-3** | `/api/extract` has **no auth, no rate limit, no cost ceiling, no Origin check and no Host check**. Any local process — or any web page the operator visits while the demo is running — can drive the Anthropic key in a loop. | S5 |

None of the three requires a code change to mitigate before the meeting; R-1 and R-2 are fixed by
moving files and changing a launch string. R-3 is a real code fix and is listed as *after* the demo.

---

## D — Where the client's personal data physically sits (asked explicitly)

The DPA the client is being asked to sign says, verbatim:

> 5(a) … *hranijo izključno na šifrirani, z geslom zaščiteni lokalni napravi obdelovalca, ki ni
> vključena v nobeno oblačno sinhronizacijo (iCloud, Drive, Dropbox ipd.) in je **izven delovnega
> drevesa katerega koli repozitorija izvorne kode***.
> — `06-pogodba-obdelava-ocenjevanje.md`, §5(a)

Measured reality, `mdfind` across the whole machine (30. 7. 2026):

| Location | Contents | Inside git work tree? | Verdict |
|---|---|---|---|
| `clients/harvest-hub/materiali/` | 15 real ponudbe (incl. `6 - Zdravstveno zavarovanje.pdf`, `9 - Primer Kolektivno Zdravje…`), the client's spec PDF, the original mail zip | **YES** — `/Users/ianveber/Desktop/Cloude CODE` is the repo root | **RED — 5(a) is false today** |
| `demo/truth.json` (41 KB) | the same personal data, hand-keyed into structured JSON | **YES** | **RED** |
| `demo/register-zastopnikov.json` | 11 named agents (real names and internal numbers) | **YES** | **RED** |
| `demo/out/` | `klp.pdf`, `privolitvena.pdf`, `klp-fidelity.pdf` — filled with a real insured person's values | **YES** | **RED** |
| `~/Downloads/Fwd__Družba_Harvest_Hub.zip` **and** `… (1).zip` | two duplicate copies of the original client mail attachment, 2.5 MB each, since 26. 7. | No | **RED — uncontrolled second copy** |

Commands run: `mdfind -name '2 - Primer Merkur_dva otroka'`, `mdfind -name 'Družba Harvest Hub'`,
`git check-ignore -v <path>` for each, `ls -laR clients/harvest-hub/materiali`.

**iCloud — PASS, with one caveat.** The offer/README repeat that "this repo lives on iCloud". Against
the OS's own flags that is **not currently true**:

- `MobileMeAccounts.plist` → `com.apple.Dataclass.CloudDesktop … Enabled = None` (Desktop &
  Documents sync is **off**; `Ubiquity/MOBILE_DOCUMENTS` is on, which is iCloud Drive proper).
- `mdls -name kMDItemIsUbiquitous` on a sample PDF → `(null)`; the real path is
  `/System/Volumes/Data/Users/ianveber/Desktop/…`, not `~/Library/Mobile Documents/`.
- `~/Desktop` is a plain `Directory`, not a firmlink into the CloudDocs container.

**Caveat (UNKNOWN):** `~/Library/Mobile Documents/com~apple~CloudDocs/Desktop` is a **symlink to
`/Users/ianveber/Desktop`** (created 18. 9. 2025). iCloud Drive stores symlinks as symlinks and is not
documented to traverse them, so the PDFs are almost certainly not uploaded through that path — but I
could not prove it: `brctl status` timed out at 25 s and returned nothing. **What would settle it:**
run `brctl status` to completion, or open iCloud.com → Drive and confirm no `Desktop` tree is listed.
Until then, treat the symlink as a hazard and remove it — it costs nothing and closes the question.

**Disk encryption: PASS.** `fdesetup status` → `FileVault is On.` — this is the one part of 5(a) that
holds.

**Git exposure: PASS (by luck, not by design).**
- The repo is genuinely **public**: unauthenticated `curl https://api.github.com/repos/ianveber/cloude-code`
  → `200`, `"private": false`.
- **Nothing under `clients/harvest-hub/` is tracked or has ever been committed** —
  `git ls-files clients/harvest-hub` returns empty, `git log -- clients/harvest-hub` returns empty.
  So no personal data has reached GitHub.
- Every sensitive path is correctly ignored: `git check-ignore -v` resolves
  `materiali/` → `.gitignore:10`, `truth.json` → `:13`, `register-zastopnikov.json` → `:15`,
  `out/` → `:9`, `node_modules/` → `:16`.
- The `pre-commit` hook (`.git/hooks/pre-commit`, mode 755) blocks staged paths matching
  `materiali/|/demo/out/|\.heic$|truth\.json$|register-zastopnikov\.json$` — it survives `git add -f`,
  which `.gitignore` does not.

**What the .gitignore and hook do NOT cover** (verified with `git ls-files -o --exclude-standard`):
every other harvest-hub file is untracked-but-stageable, so a naive `git add .` would publish
`03-uradna-ponudba.md`, `06-pogodba-obdelava-ocenjevanje.md`, both offer PDFs and the whole demo
source to a public repo in one command. Those contain commercial terms and the client's process, not
Art. 9 data — a business exposure, not a GDPR one. Also uncovered: the hook is **local only** (in
`.git/hooks/`, not versioned), and the two zips in `~/Downloads` are outside every guard.

---

## S1 — Secrets · **PASS**

- **Key never reaches the browser.** `grep -rn -iE "ANTHROPIC|api[_-]?key|sk-ant|x-api-key" index.html app.js lib/*.js`
  → **zero hits**. The key is read server-side only: `lib/claude.mjs:16`
  `process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY`, and is attached as an `x-api-key`
  header inside `server.mjs`'s process. Architecture, not discipline — the browser has no path to it.
- **Key at rest:** `~/.anthropic_key`, mode `-rw-------` (0600), outside the repo. Not in shell
  history (`grep -c "sk-ant-" ~/.zsh_history` → no hits).
- **Secret scan:** `gitleaks` is **not installed** (`which gitleaks` → not found), so the protocol's
  regex fallback was used over `clients/harvest-hub/` excluding `node_modules`:
  `sk-ant-…|sk-[A-Za-z0-9]{32,}|AKIA…|ghp_|github_pat_|xox[baprs]-|BEGIN … PRIVATE KEY`
  → **findings: 0**. No `.env` file exists in the demo at all.
- **Residual:** the key is in the running process's environment, visible to any process running as
  this user (`ps eww -o command= -p 41880` returned `ANTHROPIC_API_KEY=sk-ant-api03-…`). That is
  normal for env-var secrets on a single-user workstation and is not a gate red — but it means R-3
  (below) is exploitable by any local process without ever reading the key file.

## S2 — Auth and least privilege · **RED**

Endpoint inventory, read from `server.mjs` and confirmed by probe against the running instance
(PID 41880, `lsof -nP -iTCP:8020 -sTCP:LISTEN` → `127.0.0.1:8020 (LISTEN)`):

| Route | Auth | Probe result |
|---|---|---|
| `POST /api/extract` | **none** | `curl -X POST -H 'Content-Type: text/plain' --data 'not-json'` → `400` — reached the handler with no credential |
| `GET /api/register` | **none** | `200`, returns the 11-agent register |
| `GET /samples/*` | **none**, gated only by `DEMO_SAMPLES` | `200`, `content-type: application/pdf`, 61 149 B for `2 - Nezgoda.pdf`; **`200`, 180 565 B for `6 - Zdravstveno zavarovanje.pdf`** |
| everything else | static | `/` → `200` |

- **Network binding: PASS.** `server.listen(PORT, "127.0.0.1")` (`server.mjs:114`). Proven, not
  assumed: `curl -m 4 http://172.20.10.3:8020/` (the machine's own LAN address, `ipconfig getifaddr en0`)
  → **`exit=7`, connection refused**; the same request to `127.0.0.1` → `200`. DPA 5(e) holds.
- **RED — `DEMO_SAMPLES=1` is on by default.** `ps eww` on the running server shows `DEMO_SAMPLES=1`,
  because `.claude/launch.json` → configuration `harvest-demo` hardcodes it:
  `cd '…/demo' && DEMO_SAMPLES=1 ANTHROPIC_API_KEY=$(…) node server.mjs`.
  The server resolves the sample base to `clients/harvest-hub/materiali/vzorci/…` (`~/ais-client-data`
  does not exist) and is **exposing all 15 real client PDFs over HTTP right now**. The safety note in
  `server.mjs:91-93` and `README.md:96` says "never enable this on a deployed instance" — but the only
  documented way to start it enables it, so the warning protects nothing.
  Blast radius today is limited to processes and pages on this machine (loopback bind), which is why
  this is R-2 and not a catastrophe. It becomes catastrophic the moment the bind changes.
- **Path containment: PASS.** `/../materiali/vzorci/x.pdf` → `404`; `/truth.json` → `404` (blocked by
  the name filter at `server.mjs:51`); the `/samples/` handler uses `path.basename()`, so
  `/samples/../../x` cannot escape. Both were probed.
- **Least privilege:** one credential, one purpose (Anthropic messages API). No god-token, no second
  system. PASS on scope; RED stands on the missing auth.

## S3 — Data access / RLS · **N/A**

There is no database, no tenants, no auth store — `grep -n "localStorage|sessionStorage|indexedDB|writeFile|appendFile"`
across `server.mjs`, `app.js`, `lib/*.js` returns **nothing**. Everything lives in browser memory for
the length of one run. The RLS half of this control has nothing to apply to and manufacturing content
for it would be padding. The data-at-rest half is answered in section **D** above.

## S4 — Input validation · **PASS (with a noted weakness)**

- `/api/extract` reads the body with a hard **40 MB cap** (`server.mjs:62`, `req.destroy()`), then
  `JSON.parse`. There is no schema (no zod/valibot) — the handler destructures `{ layout, imageBase64 }`
  and passes them straight into the model call. For this artifact that is acceptable: both values are
  used **only** as opaque text/base64 inside a JSON body to a third-party HTTPS API. They never touch
  SQL, `exec`, `eval`, or the filesystem. `grep` for `exec(|eval(|child_process|Function(` across the
  demo → zero hits. No SQL exists.
- **Weakness, not a red:** a malformed `imageBase64` is forwarded to Anthropic and produces a paid
  round-trip that fails at the vendor. Combined with R-3 this is the cost-burn path.
- **No webhooks, no inbound callbacks** — that half of S4 does not apply.
- **PDF parsing is the real untrusted-input surface**, and it is handled well: `pdfjs-dist 4.10.38`
  (verified from `node_modules/pdfjs-dist/package.json`), which is past the `CVE-2024-4367`
  (<4.2.67) arbitrary-JS-in-font class, rendering runs with
  `annotationMode: pdfjs.AnnotationMode.DISABLE` (`app.js:253`), and the worker is served locally
  from `node_modules` — no CDN.

## S5 — API abuse protection · **RED (R-3)**

`/api/extract` invokes a paid model (`claude-sonnet-4-6` text / `claude-opus-4-8` vision,
`lib/claude.mjs:12-13`, `max_tokens: 3000`). Against the protocol's own words —
*"Rate-limiting the login but not the AI endpoint"* is a named anti-pattern — this endpoint has:

- **no rate limiter** of any kind (no counter, no store, no 429 path anywhere in `server.mjs`);
- **no per-identity cost ceiling** and no daily/monthly cap. `costUsd()` exists but is a *display*
  function returned to the caller, not a budget;
- **no `Origin` check** — probed with `-H 'Origin: https://evil.example'`, handler still ran;
- **no `Host` check** — probed with `-H 'Host: evil.example.com'`, `/` still returned `200`, so the
  process is a DNS-rebinding target;
- **no CORS preflight handling** — `OPTIONS /api/extract` falls through to the static handler and
  returns `404` with no CORS headers. This is what limits the damage: a cross-origin `fetch` with
  `content-type: application/json` is blocked at preflight. **But** the handler ignores content-type
  entirely (`JSON.parse(body)` regardless), so a **simple** cross-origin POST with
  `content-type: text/plain` needs no preflight, will be delivered, and will spend money. The attacker
  cannot read the response — they do not need to; the goal is the invoice.

Concretely: any web page open in the operator's browser during the meeting can loop
`fetch('http://127.0.0.1:8020/api/extract', {method:'POST', mode:'no-cors', headers:{'content-type':'text/plain'}, body:'{"layout":"…"}'})`
and drain the key. So can any process on the machine.

**Not shipped-facing today** (loopback, short-lived, one operator present), which is why this is
listed as a post-demo fix rather than a stop-ship. It is a **stop-ship for anything deployed**.

## S6 — Agent safety · **PASS on blast radius, weak on injection**

This is a single-shot extractor, not an autonomous agent: no tool use, no loop, no memory, no
outward action. The model's entire output is a JSON object that is normalised in code and rendered
as escaped text. Nothing it emits can act.

- **Egress allowlist: PASS, and unusually clean.**
  `grep -oE "https?://[^\"']+"` across `index.html`, `app.js`, `lib/*.js` returns **exactly zero**
  external URLs. The only outbound destination in the whole artifact is
  `https://api.anthropic.com/v1/messages` (`lib/claude.mjs:8`), reached from the server process.
  No CDN, no fonts, no analytics, no telemetry.
- **Untrusted input handling: partial.** The restored page text is concatenated into the *user*
  message (`extract.js:64`), never into the system prompt — correct quarantine position. The vision
  path adds an explicit instruction to treat handwriting, stickers and circled areas as
  *"INTERNE OPOMBE … NISO podatki iz ponudbe"* (`server.mjs:26-29`), which is a deliberate and
  well-aimed defence against the annotation case the client's own documents contain.
  **What is missing:** no delimiter or "the text below is data, never instructions" framing, and no
  validation that returned values actually appear in the source. A hostile PDF could steer the 14
  field values. Realistic impact: **wrong data on a kontrolni list**, caught by the operator reading
  the card. Not code execution, not exfiltration. Honest severity: low for a supervised demo,
  **must be closed before any unattended production run**, where nobody is reading the card.
- **Human gate: PASS by construction.** Nothing is written anywhere without a click —
  `downloadPayload()` and the PDF buttons are the only outputs, and both are user-initiated.

## S7 — Dependencies · **PASS**

- Lockfile present: `demo/package-lock.json` (8 490 B). It is **untracked** (nothing under
  harvest-hub is in git), so "tracked by git" is technically unmet — but the whole artifact is
  untracked, so this is not a lockfile-discipline failure. Note it and move on.
- `npm audit --omit=dev` → **`found 0 vulnerabilities`**.
- Exactly **one** direct production dependency (`pdfjs-dist ^4.10.38`) plus its
  `@napi-rs/canvas` transitive. A one-dependency supply chain is the strongest form of this control.
- No `postinstall` scripts in the two installed packages.

## S8 — Output hygiene · **PASS on the UI, RED on one error path and one header**

- **XSS: PASS.** `esc()` (`app.js:107`) escapes `& < > "`. Every sink that carries model-derived or
  document-derived text goes through it — verified by reading `fieldRows()` (`:277`),
  `renderPacket()` (`:437`), `renderKlp()` (`:328-345`), `renderGate()` (`:473`), `renderStats()` (`:508`),
  `logLine()` (`:213`), `setStatus()` (`:102`). The KLP preview is injected as
  `srcdoc="${esc(klpHtml(...))}"` — attribute-escaped, and `lib/klp.js:27` has its own `esc()`.
  No raw model output is ever rendered as HTML.
- **Run log leakage: PASS, and deliberately so.** `safeName()` (`app.js:91-98`) replaces any
  capitalised segment after an underscore with `•`, because three of the fifteen real filenames carry
  a customer's name and the log stays on a shared screen. Every `logLine()` call site was checked
  (`:741, 766, 802, 819, 826, 839, 936, 952, 955`): they carry counts, document labels and
  fixed Slovene sentences. `:839` prints `packetResult.razlog`, and `lib/gate.js:86-122` shows every
  `razlog` is a fixed string with at most a number interpolated — **no field values reach the log**.
  The packet list intentionally shows the full filename; that is the row the client must identify,
  and it is their own data on their own screen.
- **eDOKUMENTI payload: PASS.** `downloadPayload()` (`app.js:532-541`) is download-only, with the
  comment *"never logged, never rendered"* matching the code. Filename is a timestamp only
  (`edokumenti-predlog-YYYY-MM-DD-HHMMSS.json`, `lib/edokumenti.js:274-280`) — no name in the filename.
  It does drop a file containing personal data into `~/Downloads`, which is a **fourth** location for
  client PII; `~/Downloads` is a plain directory (not the separate CloudDocs `Downloads`) and FileVault
  covers it, but it belongs in the cleanup below.
- **RED (minor) — the 400 path echoes internals.** Probed:
  `{"error":"bad_request","detail":"SyntaxError: Unexpected token 'o', \"not-json\" is not valid JSON"}`
  (`server.mjs:76-79`, `String(e)`). `JSON.parse` SyntaxError messages embed a snippet of the input —
  so a truncated real payload would echo a fragment of document text back. It goes only to the caller
  who sent it, so it is not a disclosure to a third party, but it is a stack-adjacent internal leak
  and trivially fixed by dropping `detail`.
- **RED (minor) — no security headers.** `curl -D -` on `/` returns only `content-type`, `Date`,
  `Connection`, `Keep-Alive`, `Transfer-Encoding`. No CSP (none in `index.html` either — no
  `<meta http-equiv>`), no `X-Content-Type-Options`, no HSTS. For a loopback HTTP demo with zero
  external resources this is low-impact; a CSP of `default-src 'self'` would nonetheless be one line
  and would neutralise the whole XSS class rather than relying on `esc()` staying perfect.

---

## Verdict and fix order

**GATE: RED.** S2, S5 and section D fail. S1, S4, S6, S7 pass; S8 passes with two minor reds; S3 does
not apply.

**Before the client meeting — no code changes, ~10 minutes**

1. **Move the data out of the repo tree** (fixes R-1, makes DPA 5(a) true). The server already looks
   for `~/ais-client-data/harvest-hub/vzorci/…` **first** (`server.mjs:96`) and that directory does not
   exist — so `mkdir -p ~/ais-client-data/harvest-hub/vzorci` and moving `materiali/vzorci/…` there
   requires **zero code change** and the sample path keeps working. `truth.json`,
   `register-zastopnikov.json` and `out/` need the same treatment, and would need a path change, so
   for the meeting: move `materiali/` only, and note the rest.
2. **Delete the two duplicate zips** in `~/Downloads`.
3. **Remove the symlink** `~/Library/Mobile Documents/com~apple~CloudDocs/Desktop` — closes the one
   UNKNOWN in this report at no cost.
4. **Decide on `DEMO_SAMPLES` (R-2).** It is needed to drive the flow without a file picker. Keep it
   for the meeting if the demo depends on it, but know that it is on and say so honestly if asked;
   drop `DEMO_SAMPLES=1` from `.claude/launch.json` the moment the meeting ends. It must never travel
   with a deployed build.

**Before any deployed or unattended instance — code changes, out of scope for today**

5. R-3: per-IP + per-key rate limit and a hard daily spend ceiling on `/api/extract`, failing closed;
   reject requests whose `Origin` is present and not same-origin; reject unexpected `Host` values.
6. Drop `detail` from the 400 response.
7. `Content-Security-Policy: default-src 'self'` on every static response.
8. Frame the document text as data-not-instructions in `buildUserPrompt()`, and assert that returned
   values are substrings of the source before they are trusted unattended.

**Also true, and worth saying out loud:** `02-ponudba-prenos-zero.md` claims
*"Obdelava poteka izključno znotraj EU"* in three places (lines 124, 274, 413). The code proves the
opposite — `lib/claude.mjs:39-53` sends `model`, `max_tokens`, `system`, `messages` and **no region
parameter at all**, so the call runs on the vendor's default `global` routing. The DPA
(`06-…md`, §6) already states this correctly and in the client's favour
(*"Obdelava pri njem ne poteka v EU … privzeta usmeritev »global«"*). The binding offer
(`03-uradna-ponudba.md`) makes no EU claim — it defers provider and region to a later confirmation.
So the false claim survives only in the long technical annex. That annex must not be re-sent, and if
the client already has it, the correction belongs in the meeting, not in a footnote.

## Unknowns

- **Whether iCloud Drive ever uploaded anything through the CloudDocs→Desktop symlink.** `brctl status`
  timed out at 25 s with no output. Settled by: running `brctl status` to completion, or checking
  iCloud.com → Drive for a `Desktop` entry.
- **Whether the client's mail attachment exists in other places outside Spotlight's index** (external
  drive, Time Machine snapshot, the mail client's own attachment store). `mdfind` found three copies;
  a Mail.app attachment cache would not necessarily appear. Settled by: searching the Mail container,
  and `tmutil listlocalsnapshots /`.
- **Whether the operator's browser default download directory is `~/Downloads`** — it is on this
  machine by evidence of the two client zips landing there, but the `edokumenti-predlog-*.json`
  destination was not observed directly because no download was triggered during this read-only run.
