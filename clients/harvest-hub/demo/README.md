# Harvest Hub demo — extractor (S3)

Ponudba PDF → the 14 KLP fields, with provenance. No eDOKUMENTI, no Zavarovalniški program.

```bash
export ANTHROPIC_API_KEY=$(tr -d '[:space:]' < ~/.anthropic_key)
node scripts/verify.mjs            # text track only
node scripts/verify.mjs --vision   # all 11 documents
node scripts/verify.mjs --vision --register
node scripts/verify.mjs --only "Zdrav"
```

## Measured — 2026-07-27

| | |
|---|---|
| **Accuracy** | **157/157 = 100.0%** field level, all 11 documents |
| Tracks | 8 text · 3 vision · 0 routing mismatches |
| KLP outputs | **11** (dva otroka fans to 2, Kolektivno correctly to **0** — nobody is named) |
| Cost | **$0.2118** for 11 documents ≈ **$0.019/document** |
| Time | 66.6 s |
| UNMAPPED | 11 cells — all the same field, the agent's register number |

The number comes from `scripts/verify.mjs`, which imports the same `lib/extract.js` the UI will
import. It is not a separate test harness with its own copy of the logic.

**Why 11 outputs and not 12.** `toKlp()` returns an EMPTY array for a ponudba that names nobody as
insured — the collective legal-entity policy. It used to emit one half-filled list, which made the
counter card and the packet list claim a produced kontrolni list while the card beside them showed
the red "ni mogoče izpolniti" banner, and disagreed with `truth.json` (`klp_count: 0`). The
document's holder-side cells are still read, still shown on screen, and still scored — via
`holderCells()`, which is explicitly not a kontrolni list — so the 157-cell denominator is
unchanged and the accuracy figure above still stands. `verify.mjs` now also asserts `klp_count`
per document and exits non-zero on a mismatch.

## S5 — KLP generator (2026-07-27)

```bash
node scripts/render.mjs --fidelity                  # trace vs their form, numeric diff
node scripts/render.mjs --from "2 - Nezgoda.pdf"    # ponudba -> filled KLP + privolitvena
```

**Fidelity: 34/34 text elements within 2.5pt of the client's own KLP.** Measured, not eyeballed —
`--fidelity` fills the trace with the client's own values from the golden KLP, prints it, and diffs every text span's
position against the original PDF.

Technique is the client's own: their KLP is mPDF 6.0 (PHP HTML→PDF), so an HTML/CSS trace printed
by the browser is the same approach and stays vector. **No html2canvas** — that path cost two
INSPECTUS sessions to a 0×0 offscreen bug.

Two things the diff caught that eyeballing would have missed:
- the `zast2` row places its labels **8.2pt** below its rule, not 3.7pt like every other row
- the header row carries a **grey `#DDD` fill** on both cells

The signature block and `Datum podpisa` are left empty by design — generation stops at the document
and hands off to their existing `epodpis@harvest.si` flow.

**Split guards.** The Privolitvena izjava needs `Ime`/`Priimek` and `Ulica`/`Pošta` split, which the
KLP does not. Both refuse rather than guess: a 3-part name, an s.p./company Naziv, and a non-Slovene
postcode (one sample's Italian `34170 GORIZIA`) all return `null` and flag for a human. Writing a
wrong address onto a signed GDPR consent form is not a recoverable error.

## S1 — the shell (2026-07-27)

```bash
ANTHROPIC_API_KEY=$(tr -d '[:space:]' < ~/.anthropic_key) node server.mjs   # http://localhost:8020
```

Plain `node:http`, no bundler, no build step — the browser imports `lib/*.js` directly as ES
modules, so **the UI runs the same code the harness scores**. Registered in `.claude/launch.json`
as `harvest-demo`.

Apple-light per Ian's design standard, and **no technical word reaches the screen**: no model names,
no "vision track", no `pravilo` / `register`. Provenance renders as plain Slovene —
*Iz ponudbe* (a quiet green dot) · *Za potrditev* (amber) · *Potrebujem register* (amber) ·
*Iz registra* (green pill). The everyday case is deliberately the quietest mark on the card: nine
identical filled pills per list left the amber flags nothing to stand out against.

**Filenames are masked in the run log** (`safeName()`, the same rule as `scripts/test-classify.mjs`):
three of the fifteen real samples carry a customer's name in the filename, and the log is the panel
that stays on a shared screen for the whole meeting. The packet list keeps the full name — that is
the row the client has to identify.

**What actually leaves the machine.** The PDF file itself never does. The restored page text — and
for a scan, a rendered image of the page — is posted to `server.mjs`, which forwards it to the
reading API. The printed scope sheet says exactly that; it previously said "nikamor se ne naložijo",
which was false for a packet containing health data.

Verified in-browser, end to end, on `2 - Otroci_eden otrok.pdf`:
- all 14 fields correct, 4 rows flagged for attention
- both banners fire: agent number missing, and 3 values inherited from the zavarovalec
- **register button works** — number fills, badge flips to *Iz registra*, row unflags, and the
  inherited-data banner correctly REMAINS (those still need a human)
- KLP preview renders inline; save buttons print via the browser

`DEMO_SAMPLES=1` exposes `/samples/*` for driving the flow without a file picker. **Dev only** —
never enable on a deployed instance, it would publish real personal data over HTTP.

### The scan path — CLOSED 2026-07-30

Previously the open risk on this build. **Now verified end to end in a real browser**: all three
scanned documents dropped together, read from the page image, **22.6 s, no stall, no timeout, zero
console errors**.

- `2 - Primer Merkur_dva otroka` → **2 kontrolna lista** (children fan out on a scan too)
- `3 - Primer Otroci - več produktov` → 1 kontrolni list
- `9 - Primer Kolektivno Zdravje` → *kontrolnega lista ne izpolnim* (correct refusal, nobody named)

36/42 fields filled, 9 flagged. The `/api/extract` vision calls returned 200.

**The condition that matters is `document.hidden === false`** — not which browser. Browsers pause
canvas rasterisation in a background tab and `pdf.js` `render()` then never settles (verified: stalls
at scale 1.0 and with `OffscreenCanvas`). The earlier note assumed the automation pane was always
hidden; it is not — `document.visibilityState` reads `visible`, the render settles, and the path
works. Keep the tab in front during the meeting and the scans read.

The 20-second race and the plain-Slovene message
("Za skenirane dokumente naj bo to okno v ospredju") remain as the guard for a genuinely
backgrounded tab.

## Files

```
lib/layout.js    geometry restoration — rows by y (±2pt), cells by x, wrapped-line merge
lib/extract.js   schema + Slovene prompt + deterministic normalisation + toKlp()
lib/claude.mjs   one call, one schema; text and vision differ only in content blocks
lib/klp.js       KLP + Privolitvena izjava HTML trace, measured geometry, split guards
scripts/verify.mjs  scores extraction against truth.json
scripts/render.mjs  fidelity diff + full pipeline to PDF
truth.json       ground truth, hand-keyed by eye  (GITIGNORED — real personal data)
register-zastopnikov.json  demo stand-in for Harvest's agent register  (GITIGNORED)
out/             generated PDFs  (GITIGNORED — real personal data)
```

## Design

**Model pairs, code normalises.** The model does the judgment call (which value belongs to which
label — the grid shifts per product and one product inverts label/value stacking, so no fixed rule
works). Every deterministic transform is code, and therefore unit-tested:

- strip country from the address
- title-case a person, pass a legal-entity `Naziv` through verbatim
- **invert the agent's name order** — ponudba writes `Ime Priimek`, the KLP writes `Priimek Ime`
- lowercase the e-mail
- reject AZN licences as agent numbers (`40110-403/07-4` is not `NNN-NNNN`)

**Provenance drives colour.** Every cell carries `source`: `ponudba` (green), `pravilo` (derived —
amber), `register` (external — amber). Nothing is hard-coded, so a file the client drags in live
behaves the same as a sample.

## Verified behaviours

- Wrapped address merges: `NA PRISTAVI 10, 5290 ŠEMPETER PRI` + `GORICI` → one correct value
- Premoženje / Popotnik fall back to `Številka pogodbe`, flagged `pravilo`
- Popotnik returns `null` for the agent rather than inventing one (it has no agent block)
- Business box classifies as a legal entity by fields, not by the `Naziv` label
- Kolektivno returns no insured **and therefore no kontrolni list** — the packet row, the counter
  card, the payload and the card on screen all say the same thing
- A drop supersedes a run still in flight (run token + aborted request), so a stale run can never
  finalise over a live one
- A register that fails to load says so and leaves the rows amber; the success line counts the
  cells that actually flipped
- Register toggle turns the amber agent number green (`null` → `220-1044`)
- **Mutation-tested**: injecting a truncated address into truth.json drops the score to 92.3% and
  prints the diff, so the harness is proven able to fail

## Not yet covered

- **The annotation defence is not exercised by this score.** Rendering uses `annots=False`, and the
  red note *"Doba napišeš 1 leto"* sits beside the printed *"15 let"* — but `zavarovalna doba` is not
  one of the 14 KLP fields, so no assertion currently catches a regression there. Add a
  non-KLP probe field before relying on it in front of the client.
- Only page 1 is read. Enough for the KLP; a full packet needs the rest.
- The phone-format question is unresolved (see `_normalization_rules.telefon` in truth.json).
