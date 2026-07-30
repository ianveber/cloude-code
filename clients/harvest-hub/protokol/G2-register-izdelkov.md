# G2 — BUILD: register izdelkov (artifact registry)

**Protokol:** AI Infrastructure Protocol · Gate 2 (BUILD)
**Naročnik:** Harvest Hub, zavarovalniško zastopanje d.o.o.
**Izvajalec:** AIS Slovenija — Anej Vučič s.p.
**Datum:** 30. 7. 2026 · **Avtor:** interni pregled · **Jezik:** angleščina (interni dokument)

**Status: PARTIALLY GREEN.** Everything the demo claims to be, it is — re-measured today, not
taken on trust. What is missing is not the reading engine; it is everything on either side of it.
Of the eight components the binding offer sells, **two exist, two exist in part, four do not exist
at all**, and one sold *guarantee* (per-field confidence scoring, Jamstvo 2) has **no
implementation and no design** anywhere in the build.

---

## 0 · What this gate drops, and why

The protocol's standard G2 produces a component registry for a multi-service platform: service
catalogue, dependency graph, environment matrix (dev/stage/prod), CI/CD state, IaC inventory,
container/image registry, versioning and release policy, SLO/SLI definitions.

Almost none of that applies. This artifact is **one static page + one 121-line node:http server +
eight ES modules, no build step, no database, no deployment, no environments, one production
dependency**. A CI/CD section would be a paragraph saying "there is none", an environment matrix
would have one column, and a dependency graph would be a straight line. Dropped.

What is kept is what a build gate is actually for on a project like this: **what exists, what
proves it exists, what must not ship, and what is still missing between here and the thing the
client bought.**

Also deliberately dropped: every euro figure and every hour figure. G0 established the client has
no timing data (07-odgovori: *"Ne razpolagamo s podatkom"*), so nothing in this gate converts a gap
into a cost.

---

## 1 · ⚠️ State of the tree — it moved while this gate was being written

This must be recorded because the file inventory below is a snapshot, not a stable fact.

Between **10:45 and 10:51 today**, while this gate was reading the tree, a remediation pass acted
on the G3a findings. Measured, not inferred:

| Time | Change | Evidence |
|---|---|---|
| ~10:47 | `clients/harvest-hub/materiali/`, `demo/truth.json`, `demo/register-zastopnikov.json`, `demo/out/` **removed from the repo work tree** | `ls` returned them at 10:45, `test -e` returned MISSING at 10:49 |
| ~10:49 | Same files present at `~/ais-client-data/harvest-hub/` (mode `drwx------`), plus `mail/` holding the two client zips previously in `~/Downloads` | `find ~/ais-client-data -maxdepth 3` |
| 10:50 | `server.mjs` 5489 → 5702 B; `scripts/verify.mjs` 8195 → 8701 B — both now probe `~/ais-client-data/harvest-hub/` first, falling back to the in-repo path | `server.mjs:87-88`, `verify.mjs:73-82` |
| 10:51 | `scripts/render.mjs` 5966 → 6539 B — generated PDFs now write to `~/ais-client-data/harvest-hub/out`, not `demo/out` | `render.mjs:18-24` |
| (uncommitted) | `.claude/launch.json` — `DEMO_SAMPLES=1` **removed** from the `harvest-demo` launch command | `git diff .claude/launch.json`; HEAD still contains it |

**Consequence for this registry:** the artifact was verified in two states. Everything in §2–§4 was
re-run *after* the move and passes. Two things broke and were repaired inside those six minutes
(`verify.mjs` crashed with `ENOENT truth.json` at 10:49, `render.mjs` still wrote personal data
into the work tree at 10:50); both are fixed in the current source and I confirmed the current
lines by reading them.

**Nothing in this gate modified any file.** No file under `demo/` was written, and
`scripts/render.mjs` was deliberately NOT executed, because it writes PDFs.

---

## 2 · Registry A — the shipping modules (`demo/lib/`)

Eight modules. All are browser-importable ES modules with no build step; `claude.mjs` is the one
node-only module (it holds the API key path). **The browser and the test harness import the same
files** — this is the single most important architectural property of the build, because it is what
makes the accuracy number a measurement of shipping code rather than of a parallel test rig
(`verify.mjs:15-17` imports `../lib/layout.js`, `../lib/extract.js`, `../lib/claude.mjs`).

| # | File | Lines | sha256 (12) | What it is | What proves it |
|---|---|---|---|---|---|
| A1 | `lib/layout.js` | 116 | `bd6bfa431df0` | PDF geometry restoration: cluster glyphs into rows by y (±2pt), cells by x (12pt gap), merge wrapped continuation lines. Also owns the router signal `pageCharCount` + `VISION_THRESHOLD = 500`. | Exercised by every extraction; the wrapped-address merge is pinned in `truth.json` (`NA PRISTAVI 10, 5290 ŠEMPETER PRI` + `GORICI`). No standalone unit suite — see D-9. |
| A2 | `lib/classify.js` | 216 | `011476a7da91` | Document classifier, 4 real classes + 2 honest non-answers (`nebrano` = no text layer, `neznano` = recognised nothing). Weighted regex fingerprints read off the client's own 15 samples; filename may only *raise* a score, never decide (`base[k] > 0` guard, line 200). | `scripts/test-classify.mjs` — **50 PASS / 0 FAIL, re-run today**, over all 15 real sample PDFs. Output: `1 clen545 · 2 klp · 3 nebrano · 8 ponudba · 1 privolitvena`. |
| A3 | `lib/extract.js` | 202 | `9b9b6126d6ac` | The core. 14 KLP field names, the Slovene system prompt, the JSON schema hint, and **every deterministic normalisation as code** — `stripCountry`, `titleCasePerson`, `invertAgentName` (ponudba writes *Ime Priimek*, KLP writes *Priimek Ime*), `lowerEmail`, `digitsOnly`, `agentNumberFrom` (rejects AZN licences). Then `toKlp()` → cells with provenance, and `holderCells()`. | `scripts/verify.mjs` scores it (see §4). Division of labour is explicit in the header: **model pairs, code normalises**, so every rule is testable. |
| A4 | `lib/gate.js` | 123 | `816d9bbaee7a` | The 545. člen packet check. Pure — no I/O, no imports. Encodes the offer's rule *and* the offer's documented exception (collective insurance for a legal entity carries no 545. člen). Both signals must be asserted explicitly; a missing flag never earns the exception. Includes correct Slovene 4-form pluralisation for on-screen counts. | `scripts/test-gate.mjs` — **69 / 69 checks PASS, re-run today**, incl. malformed input, frozen objects, input-immutability, and printing every client-facing sentence for review. |
| A5 | `lib/klp.js` | 207 | `b2f9aec6e369` | Renders a filled KLP and a Privolitvena izjava as an HTML/CSS trace of the client's own form, in points. Geometry measured off their PDF. Also the two split guards (`splitName`, `splitAddress`) which **return `null` rather than guess**. | **34/34 text elements within 2.5pt — re-measured today** (§4). |
| A6 | `lib/edokumenti.js` | 281 | `2a17ec49342a` | The hand-off payload. **Explicitly not an integration** — its own header says so, and the payload carries an `opomba` field telling the reader the field names are ours, not theirs. Every field carries provenance + a `potrebuje_potrditev` boolean; nothing is silently dropped. | `scripts/test-edokumenti.mjs` — **77 PASS / 0 FAIL, re-run today**, incl. cross-checks that the payload's counts agree with the counter card and that a gate hold blocks transfer. |
| A7 | `lib/runstats.js` | 239 | `2129d03f9c35` | Counter card (`newRun`/`noteDoc`/`summary`) + the ROI capture (`ROI_KORAKI`/`roiSummary`). Pure, no clock, no I/O. **Time only — the module computes no money and a test asserts it never will.** All six ROI defaults are 0 minutes. | `scripts/test-runstats.mjs` — **89 PASS / 0 FAIL, re-run today**, incl. "no node dependency", "nothing monetary in the module", "same input → same output". |
| A8 | `lib/claude.mjs` | 87 | `cd7f860aba92` | The entire provider surface: one `POST https://api.anthropic.com/v1/messages` with four fields. Text and vision differ only in content blocks. Plus `costUsd()`. | G3b grepped the whole tree and confirmed nothing else touches a provider. Two defects in this file — D-1, D-2. |

**Total shipping logic: 1,285 lines across 8 modules.**

---

## 3 · Registry B — the shell and the host

| # | File | Lines | sha256 (12) | What it is |
|---|---|---|---|---|
| B1 | `index.html` | 243 | `81911af10569` | Single page: drop zone, packet list, per-document result cards, gate card, counter card, export card, ROI capture, run log. Apple-light per Ian's standard. |
| B2 | `app.js` | 989 | `79b33413bd2f` | The whole client-side pipeline. Imports the same eight `lib/` modules. Owns: run tokens (a new drop supersedes and aborts an in-flight one), the text/vision router, `esc()` at every model-fed sink, `safeName()` filename masking for the shared screen, Slovene 4-form pluralisation, the KLP preview iframe, payload download, print-scope sheet. |
| B3 | `server.mjs` | 121 | `e8245234c8d3` | Static host + `POST /api/extract` + `GET /api/register`. Binds `127.0.0.1` only (line 114). Serves pdf.js straight out of `node_modules` — no bundler. |
| B4 | `package.json` | 10 | `4391d3fad14b` | **One production dependency: `pdfjs-dist ^4.10.38`.** `@napi-rs/canvas` is present in `node_modules` as a pdfjs peer. |

**Live probe today** (scratch port 8021, so the meeting's port stays free):

```
GET /                → HTTP 200
GET /api/register    → HTTP 200, 628 bytes      (resolves to ~/ais-client-data after the 10:50 patch)
GET /samples/2 - Nezgoda.pdf → HTTP 404          (DEMO_SAMPLES not set — see §5)
```

---

## 4 · The measured numbers — provenance of every figure

This is the section the client's numbers rest on. Each row states **who measured it, when, and
whether this gate re-verified it today.**

| Figure | Claimed where | Verified today? | Evidence |
|---|---|---|---|
| **157 / 157 = 100.0 %** field-level accuracy, 11 documents | `demo/README.md:17`, dated 2026-07-27 | **Denominator: YES. Numerator: NO — not re-run.** | I recomputed the denominator independently out of `truth.json` in Python: **157 scored cells, 11 UNMAPPED excluded, 11 KLP outputs, 8 text / 3 VISION**. Every one of those four numbers matches the README exactly. The *scoring* run itself was not repeated — see below. |
| **34 / 34 KLP text elements within 2.5 pt** | `README.md:43` | **YES — re-measured today** | I re-ran the span diff in PyMuPDF against `out/klp-fidelity.pdf` and the client's own single-agent KLP sample, without invoking `render.mjs` (which writes files). Result: `FIDELITY 34/34 within 2.5pt · ours=34 theirs=34 · misses: []`. |
| **$0.2118 / 11 docs ≈ $0.019 per document** | `README.md:20` | **NO** | Derived from `costUsd()` in `claude.mjs:83-87`, whose `PRICES` table this gate did not verify against published pricing. G3b established the figure is *conservative* because prompt caching is dead code (D-1). |
| **66.6 s for 11 documents** | `README.md:21` | NO | Wall-clock of the 27.7 harness run. |
| **The scan path: 3 scanned documents, 22.6 s, 0 console errors, 36/42 fields, 9 flagged** | `README.md:99-115`, browser run of 2026-07-30 | NO — cannot be re-verified without a browser session and paid vision calls | This is the newest and most load-bearing claim in the README, and it is the only headline number recorded from a manual browser run rather than from a scriptable harness. |
| **69 / 89 / 77 / 50 unit assertions** (gate / runstats / edokumenti / classify) | not in README | **YES — all four suites re-run today, 285 assertions, 0 failures** | Commands and tail output captured; `test-classify.mjs` additionally re-reads all 15 real sample PDFs. |
| **Mutation test: injecting a truncated address drops the score to 92.3 %** | `README.md:164` | NO | This is the claim that the harness is *able to fail*. Worth one re-run before the meeting if the harness is demonstrated. |

### Why the accuracy run was not repeated

Re-running `verify.mjs --vision` costs ~$0.21 and ~67 s, and — the real reason — it re-sends **11
real client documents including Art. 9 health data** (`6 - Zdravstveno zavarovanje`,
`9 - Primer Kolektivno Zdravje`) to an endpoint that G3b proved today runs on region `global`, not
EU. Re-processing special-category personal data to re-confirm a four-day-old number this gate
could not improve on is not proportionate. What *was* verified is everything that makes the number
trustworthy without spending it:

1. the denominator (157) is real and independently recomputed;
2. the harness imports the shipping modules, not a copy (`verify.mjs:15-17`);
3. the harness is not silently broken — `verify.mjs --only ZZZNOMATCH` loads `truth.json` from its
   new home and prints a clean 0/0 summary, so the file-path move did not leave it dead;
4. the harness asserts `klp_count` per document and exits non-zero on any mismatch
   (`verify.mjs:129-134`, `:173`).

**Recommended before the meeting:** one `node scripts/verify.mjs` (text track only, 8 documents,
~$0.05) to confirm the number still reproduces after today's path changes. That is a decision for
Ian, not for this gate.

---

## 5 · Demo-only scaffolding — MUST NOT SHIP

Five things in this build exist to make a 40-minute meeting work. Each one is a liability the day
anything is deployed.

| # | Artifact | Why it must not ship | Current state |
|---|---|---|---|
| **S-1** | **`DEMO_SAMPLES` / the `/samples/*` route** — `server.mjs:95-108` | Serves the client's real personal-data PDFs over plain HTTP with no auth. The code comment says "never enable on a deployed instance". | **Currently OFF.** `DEMO_SAMPLES=1` was removed from `.claude/launch.json` today; live probe returns 404. **Useful finding: `grep` for `samples` across `app.js` and `index.html` returns ZERO hits** — the route was never wired to a UI control, so disabling it removes an exposure and costs no demo capability at all. Best case: delete the route outright. |
| **S-2** | **`truth.json`** (41 KB, hand-keyed ground truth over 11 real offers) | It is a *test fixture containing real personal data*, never a runtime input. Nothing in `server.mjs` or `app.js` reads it; only `verify.mjs` does. | Moved out of the repo today to `~/ais-client-data/harvest-hub/` (`drwx------`). Still `git check-ignore`d at the old path. |
| **S-3** | **`register-zastopnikov.json` + the `GET /api/register` route** | A **local stand-in** for Harvest Hub's real agent register (11 entries). In production the number must come from *their* register, by whatever channel Faza 0 agrees — never from a JSON file on the box. The route is the demo's closing beat and nothing more. | Moved out of the repo; `server.mjs:86-89` now resolves it from the data home. Route has **no method check** — see D-6. |
| **S-4** | **`out/` generated PDFs** — filled KLP and Privolitvena carrying a real insured person's values | Sample output, not deliverables. | Moved out of the repo; `render.mjs:18-24` now writes to the data home. |
| **S-5** | **The Chrome-headless print path** — `render.mjs:27`, hardcoded `/Applications/Google Chrome.app/...` | A developer's laptop path. Production KLP generation (Različica B) needs a headless browser inside the runtime, versioned and reproducible. | Unchanged; dev-only by design. |

**Two more, less obvious:**

- **S-6 — `server.mjs` itself is not a production host.** No auth, no rate limit, no cost ceiling,
  no `Origin`/`Host` check, no CSP (G3a finding R-3, probed). It is a loopback dev host and must be
  replaced, not hardened in place.
- **S-7 — the shell (`index.html` + `app.js`) is a presentation surface, not the nadzorna plošča.**
  No auth, no user identity, no persistence of any kind (G3a: grep for `localStorage|sessionStorage|indexedDB|writeFile|appendFile` returns nothing), no work queue, no assignment, no state that survives a page reload. It demonstrates the reading engine; it is not the exception dashboard the offer sells (gap G-6).

**Dead scaffolding, harmless but should go:** `demo/api/claude/` and `demo/vendor/` are both
**empty directories** left over from the `inspectus-vldr` clone. `/vendor/*` is served out of
`node_modules` by `server.mjs:46-47`, so the directory itself is inert.

---

## 6 · The gap list — what production needs that does not exist

Mapped one-to-one against the **OBSEG** table of `03-uradna-ponudba.md` (the binding document),
plus gaps discovered in G0 and in `07-odgovori-harvest.md`.

Legend — **Scope:** `A+B` = in both sold variants · `B only` = only the recommended variant ·
`Faza 0` = named in the offer but its content is fixed at the close of Faza 0 · `NOT SOLD` =
outside `03`, do not present as required.

### 6.1 Exists today

| Component (offer wording) | State | Note |
|---|---|---|
| **Branje dokumentov** — dvotirno, ~80 % text / ~20 % vision, router picks the path | ✅ **BUILT & MEASURED** | `layout.js` + `extract.js` + `claude.mjs`; router = `pageCharCount < 500`. 0 routing mismatches over 11 documents. The one honest limit: **page 1 only** (`README.md:173`) — enough for the KLP, not for a packet. |
| **Robot sam pripravi KLP in Privolitveno izjavo** (Različica B, the 3.100 € delta) | ✅ **BUILT & MEASURED** | `klp.js`, 34/34 within 2.5 pt. Signature block left empty by design, handing off to their `epodpis@harvest.si`. |

### 6.2 Exists in part

| Component | What exists | What is missing | Scope | Main technical risk |
|---|---|---|---|---|
| **Kontrole in preverjanje** | The 545. člen presence gate (`gate.js`, 69 assertions) incl. the documented collective/legal-entity exception. | Davčna checksum · premium-vs-instalment match · cross-document consistency · **and the write-back**: the offer says a missing 545 makes the robot *"prek API-ja v eDOKUMENTE vrne opozorilo in ponudbo zadrži"* — the demo holds nothing anywhere, it only renders a banner. | A+B | The gate checks **presence, not correspondence**, and says so honestly (`gate.js:22-27`): with several ponudbe and one 545. člen it cannot tell which belongs to which, because **G0 measured that the 545. člen document carries no offer number and no customer name at all**. Linking them requires either packet membership as the sole evidence, or a new rule the client must accept. |
| **Obravnava izjem** | The gate classifies the collective/legal-entity case and marks it `izjema`. | The *"samodejno opominjanje do prejema podpisanega dokumenta"* — a state machine, a clock, persistence, and an outbound channel. None exist. | A+B | Nothing in the build persists anything. This is not a feature bolted onto the demo; it needs the store that gaps G-7 and G-6 also need. |
| **Prenos v vaša sistema — eDOKUMENTI** | `edokumenti.js` produces a **proposal payload** with full provenance, 77 assertions. Its own header refuses to call itself an integration. | The actual writer: authentication, the real field names, find-existing-customer vs `Dodaj novo stranko`, the 4-way address split and the dial-code/leading-zero phone split that `07-odgovori` documented. | A+B | **R1 is resolved in our favour but only technically** — 07-odgovori confirms an API will be provided *if it isn't ready they will prepare one*, and the vendor is aware. That converts a technical risk into a **third-party schedule risk with no date**. Second risk: `splitAddress()` currently does a **two-way** split; eDOKUMENTI wants **four** fields. Third: **customer duplication** — the record carries an internal ID, so every run must resolve an existing customer or create one; the client's specification does not handle this and G0 measured that the server folder key is the *offer number*, so one person legitimately produces several folders in a week. |

### 6.3 Does not exist

| # | Gap | Scope | Main technical risk |
|---|---|---|---|
| **G-1** | **Mailbox connector + immutable archive of every delivery.** The offer sells pickup from `ponudbe.merkur@harvest.si` behind a swappable connector. The demo's only input is a browser drag-and-drop. | A+B | Protocol and identity (IMAP vs Graph vs a shared mailbox) are unknown. **G0 could not resolve whether the packet arrives straight from the `eponudbePOS@merkur-zav.si` machine account or is forwarded by a person at Merkur** — the difference is nested attachments, i.e. a whole extra unwrapping layer. One raw `.eml` with headers settles it. Second risk: idempotency — the same mail must never be processed twice, and there is no dedup key today. **Free win G0 found and the specification never mentions: the Merkur subject line already carries surname, first name, product and offer number** (`…: <PRIIMEK IME>, MERKUR <PRODUKT>, <št. ponudbe>`), so classification and folder naming are available with zero PDF parsing — n=1, confirm on ~20 subjects. |
| **G-2** | **Zavarovalniški program writer + the šifrant and the mapping between the two code lists.** | ⚠️ **SCOPE CONFLICT — resolve in Faza 0.** `03-uradna-ponudba` lists this transfer inside the base scope and never mentions building a šifrant. `07-odgovori` says the transfer is **deferred** and requires building the insurer's šifrant and mapping it to the program's. | Building a code-list mapping is not a coding task, it is a **data-agreement task with an unknown row count**, and neither party has sized it. Do not let it enter the fixed price un-sized. This is the single largest commercial exposure in the build. |
| **G-3** | **Per-field confidence score.** | A+B — and it is a **guarantee**, not a feature | **The biggest gap between the sold artifact and the built one.** `03-uradna-ponudba` OBSEG says *"Vsak podatek dobi oceno zanesljivosti"*, and Jamstvo 2 says *"Podatek pod dogovorjenim pragom zanesljivosti se v vaša sistema ne zapiše"* with the threshold confirmed in Faza 0. **The build produces no score.** What it produces is *provenance* — a three-valued label (`ponudba` / `pravilo` / `register`) meaning *where the value came from*, which is a different thing entirely: a value read straight from the ponudba is labelled green regardless of how legible it was. A threshold needs a number, and a number needs a mechanism that does not exist. Either build one (logprob-based, self-report-based, or dual-read agreement) or **re-word the guarantee in Faza 0 to what provenance actually delivers**. Do not present the current amber/green as if it were the guaranteed threshold. |
| **G-4** | **Immutable audit trail** — kdo, kdaj, kaj, per step. | A+B | The demo has an append-only *run log in browser memory* that dies with the tab. Production needs an append-only store, integrity (hash chain or WORM), and **an operator identity, which means auth, which does not exist**. Second risk: immutability collides with GDPR erasure — the trail must be designed so a rectification/erasure request does not require rewriting history. |
| **G-5** | **Error alerting + weekly report.** | A+B | Low technical risk; listed for completeness because it is in the OBSEG table and in nobody's plan. |
| **G-6** | **Nadzorna plošča** — an exception work queue, one-click correction, *"sistem se iz popravkov uči"*. | A+B | Two risks. (a) The queue needs everything G-4 needs plus multi-user state. (b) ***"sistem se iz popravkov uči" is the riskiest sentence in the offer.*** It has no mechanism, no design and no acceptance criterion anywhere in the build or the plans. It must be given a concrete, bounded meaning in Faza 0 — a correction store replayed as few-shot examples, or a normalisation-rule table a human edits — otherwise it is an open-ended promise inside a fixed price. |
| **G-7** | **Persistence at all.** | implicit in A+B | G3a proved it: no database, no auth store, no file writes, no `localStorage`. Every gap above (exception path, dashboard, audit trail, dedup, retention, chasing) needs the same missing thing. **This is the true critical path of the build**, and it is invisible in a demo that is genuinely impressive precisely because it holds everything in memory for one run. |
| **G-8** | **The full document taxonomy.** The demo detects **4 classes**; the base scope names **11 document types + Spremni dopis**. | A+B | `classify.js:23-27` states this refusal explicitly and correctly: the seven undetected classes land in `neznano`, which is the truthful answer today, and `test-classify.mjs` *asserts* that SEPA, KID and Spremni dopis all return `neznano` rather than the nearest match. Risk: **we hold no samples of those classes**, so the fingerprints cannot be tuned until Faza 0 supplies them. And G0 found a real packet containing an **IPID** — a class the client's own specification does not list. Expect the taxonomy to grow during Faza 0, not shrink. |
| **G-9** | **Multi-page and whole-packet reading.** Only page 1 of one document is read. | A+B | Cost and latency scale with it, and G3b flagged that **how many documents per offer go through AI extraction is the dominant cost variable**, swinging the monthly bill roughly 8×. This must be pinned by the field set both parties sign at the close of Faza 0. |
| **G-10** | **Retention handling.** | ⚠️ **Not named as a component in `03`.** The long annex `02` mentions *politika hrambe*; the binding offer does not list it in OBSEG. | Do **not** present it as sold. But it must be pinned in Faza 0 anyway, because the archive and the audit trail cannot be designed without a retention rule, and **the client's answer to the retention question was generic** (*"Spoštujejo se določila ZVOP-2, GDPR, ZZavar-1"*) with no concrete periods. |
| **G-11** | **Deployment, hosting, secrets management, operations.** | **EXPLICITLY EXCLUDED** by `03` (*"infrastruktura in gostovanje; obratovanje in podpora po prevzemu"*) | Listed so nobody mistakes its absence for a defect. It is a client responsibility by contract. |

---

## 7 · Code defects found — recorded, not fixed

The build is frozen. Nothing here was repaired.

| # | Where | Defect | Severity |
|---|---|---|---|
| **D-1** | `lib/claude.mjs:50` | **Prompt caching is dead code.** The system prompt is tagged `cache_control: {type:"ephemeral"}` and the comment claims it caches, but G3b measured the prompt at **632 tokens against a 1024-token minimum cacheable prefix**. Below the threshold it silently no-ops — no error, no warning. **Consequence in our favour: the $0.019/document figure is an uncached number, so the cost estimate is conservative.** | Low today, cosmetic-to-misleading in the code |
| **D-2** | `lib/claude.mjs:83-87` | `costUsd()` bills `cache_read_input_tokens` at **full** input price instead of 0.1×, and ignores `cache_creation_input_tokens` (1.25×) entirely. Inert only because D-1 keeps both at zero. Becomes a real mis-billing the moment caching starts working. | Fix before production |
| **D-3** | `lib/claude.mjs:79-82` | The `PRICES` table (`sonnet-4-6` 3/15, `opus-4-8` 5/25) was **not verified against published pricing by this gate**. Every cost figure shown to the client depends on it. | Verify before quoting |
| **D-4** | `demo/README.md:128-132` | **Stale after today's remediation.** The Files section still places `truth.json`, `register-zastopnikov.json` and `out/` inside `demo/`. They are now in `~/ais-client-data/harvest-hub/`. Anyone following the README will look in the wrong place. | Documentation |
| **D-5** | `demo/README.md:96-97` | Also stale: it documents `DEMO_SAMPLES=1` as the way to drive the flow without a file picker. The launcher no longer sets it, and the route was never wired to the UI. Harmless, but it is a rehearsal trap. | Documentation |
| **D-6** | `server.mjs:84` | `GET /api/register` — the handler matches on `req.url` only and **never checks `req.method`**, so POST/PUT/DELETE all return the register. Read-only, so low impact; noted because the sibling route above it does check its method. | Low |
| **D-7** | `demo/api/claude/`, `demo/vendor/` | Two **empty directories** left over from the `inspectus-vldr` clone. Inert. | Cosmetic |
| **D-8** | `server.mjs:51` | The static filter still blocks `truth.json|register-zastopnikov.json|/out/` by regex. Correct, but now largely vestigial since none of those live under `ROOT`. Keep it — it is cheap defence in depth if a file ever comes back. | None |
| **D-9** | `lib/layout.js` | The **only shipping module with no dedicated unit suite.** It is exercised indirectly through every extraction, and its behaviours are pinned in `truth.json`, but a geometry regression would surface as a field-accuracy drop rather than as a named failure. Given that it owns the router threshold (`VISION_THRESHOLD = 500`) — the single decision that sends a document down the expensive path — it deserves its own test before production. | Test coverage |

Carried forward from G3a and unchanged: **R-3** (`/api/extract` has no auth, no rate limit, no cost
ceiling, no Origin or Host check) is a build-level defect as much as a security one, and it belongs
on the production list. **R-1 and R-2 were remediated today** — see §1.

---

## 8 · Gate verdict

| G2 criterion | Verdict | Basis |
|---|---|---|
| Every artifact inventoried with a durable identifier | ✅ | 18 files, lines + bytes + sha256 + mtime, §2–§3 |
| Each artifact's claim backed by a runnable proof | ✅ **for 4 of 8 modules**, ⚠️ for the rest | 285 assertions re-run today across 4 suites, 0 failures. `layout.js` has no own suite (D-9); `extract.js` and `claude.mjs` are proven only through the paid harness; `klp.js` re-measured today at 34/34 |
| Headline measurements traceable to a command | ✅ | §4 — every figure carries its source, its date, and whether this gate re-verified it |
| Demo-only scaffolding identified and marked | ✅ | §5 — 7 items, incl. the finding that `/samples` was never wired to the UI |
| Gap list complete, each gap scoped and risk-named | ✅ | §11 gaps, §6 |
| Build is reproducible in a clean environment | ❌ **RED** | No lockfile discipline beyond `package-lock.json`, no documented node version, no CI, and the harness depends on **`python3` + PyMuPDF and a Chrome at a hardcoded macOS path**, neither of which is declared anywhere. Today the whole thing ran because it ran on the machine that built it. |
| Component boundaries stable | ⚠️ | Four files changed under this gate inside six minutes (§1). Not a defect — it was the correct remediation — but the tree is not frozen in fact, only in intent. |

**PARTIALLY GREEN.** The reading engine is real, measured, and honest about its own limits — that
part of G2 passes without qualification. It fails on reproducibility, and it carries one gap (G-3,
the confidence score) that is not a missing feature but **a guarantee in the signed-ready offer with
no implementation behind it**.

---

## 9 · Unknowns — and what would settle each

1. **Does the 157/157 still reproduce after today's path changes?** Settled by one
   `node scripts/verify.mjs` (text track, 8 documents, ~$0.05, ~40 s). Recommended before the
   meeting.
2. **Does the browser scan path still work after the file move?** The 2026-07-30 browser run
   (22.6 s, 3 scans, 0 console errors) predates it. The move should not affect it — the scan path
   reads from a drag-and-drop `File` object, not from disk — but that is reasoning, not a
   measurement. Settled by one rehearsal drop of the three scanned PDFs, **with the tab in the
   foreground** (`README.md:111` — browsers pause canvas rasterisation in a background tab and
   `pdf.js` `render()` then never settles).
3. **Are the `PRICES` constants current?** (D-3.) Settled by reading published pricing.
4. **What node version does this build require?** Never declared; it ran on v22.22.3 today.
   Settled by an `engines` field, or by a one-line note in the README.
5. **Does anything outside `demo/` depend on `demo/lib/`?** Not checked. Settled by one grep before
   any refactor.
6. **How many documents per offer will actually be read?** The dominant cost and latency variable
   (G-9, G3b). Settled only by the field set both parties sign at the close of Faza 0.
7. **What does *"sistem se iz popravkov uči"* mean contractually?** (G-6.) Settled by a written
   definition with an acceptance criterion, in Faza 0, before the phrase is tested against it.
8. **Whether the Zavarovalniški program transfer is inside the fixed price.** (G-2.) The two
   documents disagree. Only Ian and the client can settle it, and it must be settled in writing
   before Faza 0 closes.

---

## 10 · Kasneje, ne zdaj

Outside the purchased scope. Recorded so it is not lost; **not to be presented as required**, and
not to be raised at the meeting unless the client raises it first.

- **Subject-line ingest.** The Merkur subject line already carries surname, name, product and offer
  number (G0). Classification and folder naming for free, before a single PDF is opened. Cheap, and
  it would reduce the AI call volume — but it is an optimisation of a robot that does not exist yet.
- **A dual-read agreement check** as a route to the confidence score G-3 needs: read the same field
  down both tracks and treat disagreement as low confidence. Doubles the cost of the fields it
  covers, which at €1–6/month of regional premium is not the objection it sounds like — but it is a
  design decision for Faza 0, not a feature to promise now.
- **Retiring the demo shell entirely.** The instinct will be to grow `app.js` into the nadzorna
  plošča. It should not be: it has no auth, no persistence and no multi-user story, and the 989
  lines that make it a good *demo* are exactly the lines a work queue does not want.
