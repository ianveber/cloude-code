# Demo build plan — Harvest Hub

**Internal. Ian only.** Derived from a 5-lens adversarial planning pass (50 proposals, 33 survived).
Full raw output: `/private/tmp/…/tasks/wb7g0omb8.output`.

---

## The one demo moment

> **Ian drags one Ponudba PDF that Harvest Hub emailed him into a browser page, and their own KLP and
> Privolitvena izjava fill in field by field in seconds — with exactly one field left amber, because
> that value is not in the PDF and the robot refuses to invent it.**

Everything else exists to make that 40 seconds land, and to survive the twenty minutes after it.

The INSPECTUS parallel is exact: a working thing on the client's **own real data** carried that deal
(`314 vozil obdelanih, 0 izpadov` — now the REFERENCA in the offer we just sent).

---

## ⚠️ Correction to what I told you earlier

I said: *"every field the KLP needs is already in the Ponudba, so we can fill it with zero API access."*
**That is wrong for exactly one field — and it is the field a broker checks hardest.**

| | Value | Where it lives |
|---|---|---|
| KLP wants `Številka zav. zastopnika` | `120-2089`, `000-0050` | Harvest's **internal agent register** |
| Ponudba carries | `30220-1022/06-4`, `40110-403/07-4`, `40110-54/2021-3` … | **AZN licence** — different registry, different format |

Searching all 11 ponudbe for the KLP's `NNN-NNNN` shape returns **nothing** (the one apparent hit,
`220-1022`, is a substring of the agent's AZN licence `30220-1022/06-4`).

**This makes the demo better, not worse.** A fully-green KLP is a magic trick nobody believes. One
amber field with an honest reason is the credibility beat — and it converts into a close when you then
click *"Naloži register zastopnikov"* and it turns green. Ask them for the register in the pre-meeting
email; if it arrives, the field goes green live.

**Second, smaller correction — the offer-number prefix table.** Verified across all 15 files:

| Holds | Doesn't |
|---|---|
| Naložbeno `550002145`, Nezgoda `330009276`, Riziko `220004272`, Zdravstveno `110004554`, Business box `440000040` | Premoženje `703179` and Popotnik `529404` — 6-digit `Številka pogodbe`, prefixes `70`/`52` not in the table. Three scans have no readable number at all. |

The offer's wording (*"Pri večini produktov… Premoženje in Popotnik tega polja nimata"*) survives this,
so **no reissue needed**. But demote the table to an internal cross-check — never put it on screen as a
validation row.

---

## Day 0 — before any code

**1. Git exposure — ✅ DONE this session.** The repo `ianveber/cloude-code` is **public**, and I had
copied their real documents into `clients/harvest-hub/materiali/` earlier today. Nothing had been
committed (0 tracked files), but one `git add -A` would have published tax numbers, birth dates,
Italian ID numbers and Art. 9 health data permanently. Now closed with two layers, both tested:
`.gitignore` rule `**/materiali/`, plus a `pre-commit` hook that blocks even `git add -f`.

**2. Move the source documents off iCloud** (10 min, not done — your call):
```
mkdir -p ~/ais-client-data/harvest-hub
mv "clients/harvest-hub/materiali" ~/ais-client-data/harvest-hub/
```
iCloud sync makes Apple an unnamed sub-processor, and it has already broken Bun/Vite dev servers on
three prior projects. **Do not symlink it back** — this repo materialises symlinks into real copies.

**3. One email today**, framed as discovery, not defects. Each ask is a buying signal:
1. **Register zastopnikov** (`ime → 120-2089`), ~20 rows. Justify with their own files.
2. **Second-agent rule** — when does a pomožni zastopnik go in row 2?
3. **Which number goes in the KLP's `Št. ponudbe` box** — their KLP shows 6-digit `703168`, the ponudbe carry 9-digit.
4. **Three real matched Ponudba → KLP pairs.** Critical: *no sample offer corresponds to either KLP sample* — neither KLP's named parties appear in any ponudba, and the two-agent KLP is **Allianz**, not Merkur. There is currently no ground truth.
5. **One-page evaluation DPA**, signed by AIS only, no counter-signature needed so it can't delay the meeting. Closes the gap between the offer's own Art. 28 promise and the fact that you already hold their health data.

---

## Build order

Each step is independently demoable — stop anywhere and you still have something to show.

| # | Step | h | Demoable at |
|---|---|---|---|
| S1 | Skeleton — clone `inspectus-vldr`, **`rm -rf .vercel` immediately**, strip to shell + key guard, add pdf.js | 1.5 | drop zone renders a page |
| S2 | **Schema freeze + `truth.json`** — 11 offers × 15 KLP fields, hand-keyed, states VALUE / ABSENT / UNMAPPED | 2.5 | nothing — and it's still the highest-value block |
| S3 | Text track — layout restoration then Claude pairing | 4 | fields appear from a real PDF |
| S4 | Vision track + router (page-0 char count, threshold 500) | 2 | the scan with no text in it |
| S5 | **KLP + Privolitvena izjava generation** | 4 | ← **the moment** |
| S6 | Provenance, derived amber, register toggle | 2 | the refusal, then the close |
| S7 | Edge cases: multi-insured fan-out, pravna oseba, document class | 3 | depth |
| S8 | Counter card — every number driven by the run | 2 | the close |
| S9 | Batch folder, 545 gate, run log, **eDOKUMENTI payload JSON** | 3 | "a system, not a trick" |
| S10 | ROI capture (**time only, no euros on screen**) + "Natisni obseg" | 1.5 | scope lock |
| S11 | Rehearsal ×3 | 2 | — |

**≈27 focused hours.** INSPECTUS's VLDR core was 55–58 h, so this is roughly half — consistent, because
there are no integrations.

### Why S2 before any extractor code
INSPECTUS's `314 vozil, 0 izpadov` came from a verification harness (`scripts/real-primer1-verify.mjs`),
not from the UI. Without `truth.json` you have a demo; with it you have a **measured** demo, and the
counter card writes itself. It also pre-pays the offer's ≥98% acceptance clause in the same unit.

### The two hard technical problems

**Label/value scrambling.** Don't build a deterministic parser — it needs per-product config you don't
have and breaks on product seven. Restore layout as *preprocessing*, then let Claude pair: pdf.js
`textContent` → x-band segmentation (anchor on the label string, **never a literal coordinate**) →
row-cluster at ±2pt → continuation-merge wrapped addresses (without this, `6 - Zdravstveno` silently
returns `NA PRISTAVI 10, 5290 ŠEMPETER PRI` and drops `GORICI, SLOVENIJA`) → serialise → one Claude call.

**Annotations on the scans.** Render with `annotationMode: AnnotationMode.DISABLE`. On
`2 - Primer Merkur_dva otroka` a red FreeText note says *"Doba napišeš 1 leto"* inches from the printed
`15 let` / `16 let`. A vision model reads both perfectly and can resolve it the wrong way. Every value
carries `vir: "tiskano" | "opomba"`; anything tagged `opomba` never reaches the KLP — it renders in a
separate panel as image chips. **Never claim the robot transcribes handwriting.**

---

## NOT building — and say so on the closing slide

Auth · database · upload · **eDOKUMENTI and Zavarovalniški program** (they're R1, the unpriced Phase-0
gate — you ship the payload JSON instead) · mailbox ingest · file-server writes · any signature flow ·
a review queue with assignment · the full 10-type taxonomy · browser OCR · a second insurer · a second
KLP template · **any staged failure or doctored file**.

Real failure modes are free and more convincing: two products have no offer number, three files have no
text layer, one field exists in no PDF.

---

## Live-demo script

1. **Drop the whole client folder.** Kills "you picked the easy file" — the objection most likely to end
   the meeting. Four-way routing; unknowns land honestly in *"Ne prepoznam — za ročni pregled"*.
2. **Drop one Ponudba.** KLP + Privolitvena izjava fill field by field. ← the moment
3. **The amber field.** *"Te številke ni v ponudbi. Ponudba nosi licenco AZN, KLP pa vašo interno
   številko. Potrebujem vaš register zastopnikov."*
4. **Click "Naloži register zastopnikov."** Green. Document complete.
5. **Drop the Canon scan.** Two-track split visible; handwriting shown as chips, never as data.
6. **Drop the folder with 545. člen removed.** Held, with a visible reason.
7. **Counter card** — accuracy over born-digital, the 8/3 split, measured seconds.
8. **"Prenesi podatke za eDOKUMENTE (JSON)"** — hand it to their vendor *before* Phase 0.
9. **"Koliko časa to vzame danes?"** — six sub-steps, minutes only. Screenshot it.
10. **Closing slide: what's deliberately out, and why that's in their favour.**

**Two things to keep off the screen.** No euros in the ROI card (a €/h box lets the director negotiate
you down inside your own demo — put the payback in the follow-up email where you control framing). And
run the **API cost measurement privately first**: the demo reads 1 PDF per offer, production reads ~7,
so a naive on-stage figure reads as *your quote is padded 10×* against the €40–50/mo in offer §7.2.

---

## Data posture — say this out loud, it sells

Documents are read **in your browser**. They are never uploaded and never stored. Only the extracted
text (or a page image) goes to the model, processed in the **EU (Frankfurt)**, never used for training.
The run log contains no personal data. That is the same architecture as INSPECTUS, where VINs never
left the client's machine.

---

## First thing tomorrow

`truth.json` (S2). Two and a half hours, no code, and it decides whether this is a demo or a measured
demo. Send the 5-question email before you start it, so the register has a chance to arrive by the
meeting.
