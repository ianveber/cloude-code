# PRENOS ZERO — Plan & Offer Structure
**Client:** Harvest Hub, zavarovalniško zastopanje d.o.o. (Dunajska cesta 190, 1000 Ljubljana)
**Their spec:** *Specifikacija zahtev — Robotizacija procesa PRENOS dokumentacije*, dated 23.7.2026
**Prepared:** 2026-07-26 · internal (English). Client-facing version → Slovene.
**Status:** PLANNING / OFFER DESIGN. No build work started.

---

## 0. What they actually asked for

Harvest Hub is an insurance intermediary (zastopanje) for **Merkur zavarovalnica**. Merkur emails them
completed offer packets. Today a human downloads them, files them on a server, and **retypes the
metadata by hand into two separate systems** — eDOKUMENTI and the Zavarovalniški program.

They issued a formal spec and want back, **for two alternative solutions**:
1. price, 2. timeline, 3. proposed technical solution, 4. **which AI tech reads the PDFs**, 5. anything else.

This is a competitive B2B procurement, not a warm lead. The bid has to read like it came from someone
who already understands their document set better than they do. Section 1 is how we win that.

---

## 1. Evidence — what I found in their 15 sample documents

I parsed every sample PDF they sent. This is the leverage: it is specific, verifiable, and no competitor
bidding on this will have done it.

### 1.1 ~80% of the documents are born-digital, ~20% are scans

| Document | Pages | Text chars | Verdict |
|---|---|---|---|
| 545. člen | 1 | 5,376 | born-digital |
| KLP (1 zastopnik) | 1 | 615 | born-digital |
| KLP (2 zastopnika) | 1 | 685 | born-digital |
| Privolitvena izjava | 1 | 2,806 | born-digital |
| 1 – Naložbeno | 3 | 12,034 | born-digital |
| 2 – Nezgoda | 2 | 3,437 | born-digital |
| 2 – Otroci (1 otrok) | 2 | 3,358 | born-digital |
| **2 – Merkur, dva otroka** | 1 | **78** | **SCAN** |
| **3 – Otroci, več produktov** | 1 | **164** (23 images) | **SCAN** |
| 4 – Premoženje | 4 | 7,203 | born-digital |
| 5 – Riziko | 3 | 3,210 | born-digital |
| 6 – Zdravstveno | 2 | 3,278 | born-digital |
| 7 – Popotnik | 1 | 2,324 | born-digital |
| 8 – Business box | 3 | 4,195 | born-digital |
| **9 – Kolektivno Zdravje** | 2 | **23** (17 images) | **SCAN + handwriting** |

**Why this matters commercially.** A naive bidder quotes "OCR everything" — slow, expensive, ~90% accurate.
The correct architecture is a **two-track extractor**: a fast, cheap, near-deterministic text-layer path for
the 80%, and a vision path only for the 20% that needs it. That is the single biggest cost and accuracy
decision in the project, and it is invisible unless you actually open the files.

Sample 9 (Kolektivno Zdravje, legal entities) is a printed-then-annotated-then-rescanned document with
**handwritten notes and highlighter** on it ("Premijo preveri obračun", a handwritten figure). Anyone who
promises 100% straight-through processing on that document is lying. Our answer is the confidence
engine + human review queue — see §3.

### 1.2 Naive text extraction scrambles label↔value pairing

Pulling the text layer out of `2 - Nezgoda.pdf` returns the **values first, then the labels**:

```
40.000,00 €  60.000,00 €  A  300.000,00 €  80.000,00 €  15,00 € …
… Nezgodna smrt:  Trajna nezg. invalidnost:  Trajna nezg. invalidnost varianta: …
```

A regex/template parser silently mis-pairs these — the worst failure mode in insurance, because it looks
like it worked. This is the concrete, demonstrable reason the solution needs **layout-aware extraction
with coordinates + an LLM structuring pass**, not a scraper. Great slide for the pitch.

### 1.3 The offer number encodes the product family — a free routing key

| Prefix | Product | Sample |
|---|---|---|
| `11x` | Zdravstveno | 110004554 |
| `22x` | Riziko | 220004272 |
| `33x` | Nezgoda | 330009276, 330008010 |
| `44x` | Business box (pravne osebe) | 440000040 |
| `55x` | Naložbeno | 550002145 |

Their own server folders in the spec (`04.05. Pregelj Rok 220003171`, `01.05. Zorko Boris 330002997`)
confirm the pattern in production. **We get product classification and a validation cross-check for free** —
if the AI says "Nezgoda" but the number starts `55`, that's an automatic flag, not a silent error.

### 1.4 Field labels are NOT consistent across products

`Številka ponudbe` vs `Št. ponudbe`; Premoženje and Popotnik use different label variants again; the
two-agent KLP carries an 11-digit number (`44002683447`) where others carry 9. **One universal template
will not work.** The design must be a shared core schema + per-product extensions, driven by config.

### 1.5 Data protection is a first-class constraint, not a footnote

Every packet contains davčna številka, rojstni datum, full address, phone, email, beneficiaries — and for
Zdravstveno / Nezgodno products, **health-related data (GDPR Art. 9 special category)**. The Privolitvena
izjava is itself the GDPR consent artefact. This has to be designed in (EU-only processing, retention,
full audit trail), and saying so in the bid is a differentiator against a generic automation shop.

> ⚠️ **Whiteboard photo not readable.** The `.heic` you sent sits in the macOS Messages attachment store,
> which is locked behind Full Disk Access — I could not open it by any route. The plan below assumes the
> "four pillars" are the four systems the spec names: **Email → File server → eDOKUMENTI → Zavarovalniški
> program**. Drop the photo in `~/Downloads` and I'll confirm or correct in one pass.

---

## 2. The product name

### ★ Recommendation: **PRENOS ZERO**

**Lockup:** `PRENOS ZERO™ — robotizirana infrastruktura za prenos dokumentacije`
**Tagline:** *„Ponudba prispe. Vse ostalo se zgodi samo."*

Why it works:
- Uses **their own word for the process** (PRENOS) — instant recognition, zero explanation needed
- `ZERO` states the outcome, not the mechanism: **zero manual touches, zero retyping, zero lost documents**
- Reads as an enterprise product, not a freelance gig — which is what justifies a five-figure fee
- Works identically in Slovene and English, and survives being said out loud in a board meeting

**Deliberately NOT** a Hormozi-style infoproduct name ("The 90-Day Automation Accelerator"). Hormozi's own
framework flags regulated + committee-procurement B2B as outside its naming style — that name would cost
us credibility with an insurance brokerage. We use his *mechanics* (below) and their naming conventions.

Alternates if they push back: **ATLAS PRENOS** (heavier, more institutional) · **HARVEST FLOW** (softer,
house-branded to them).

---

## 3. Solution architecture

Seven layers. Layers marked ◆ are the ones that carry the price.

```
   Merkur e-mail ─┐
   Shared disk ───┼──▶ ① INGEST ──▶ ② CLASSIFY ──▶ ③ EXTRACT ◆ ──▶ ④ VALIDATE ◆
   (later) API ───┘                                                      │
                                                                         ▼
                          ⑦ AUDIT & ALERTING ◀── ⑥ REVIEW CONSOLE ◆ ◀── (confident?)
                                    │                                    │ yes
                                    ▼                                    ▼
                         weekly report / alerts              ⑤ INTEGRATE ◆
                                                          ├── eDOKUMENTI (docs + metadata + zaznamki)
                                                          ├── Zavarovalniški program (metadata)
                                                          └── File server (Datum-Priimek ime-Št. ponudbe)
```

### ① Ingest — pluggable source adapters
Mailbox connector on `ponudbe.merkur@harvest.si`. Idempotent on message-id (an email delivered twice never
creates two offers). Every inbound packet is written to an **immutable raw archive** before anything else
touches it — so any offer can be reprocessed later without asking Merkur to resend.

Their spec says *"kasneje Shared disk, kasneje API"*. We build the source layer as **adapters against one
interface**, so adding those later is configuration, not a rewrite. Explicitly answering a "later"
requirement in the bid is cheap and reads as senior.

### ② Classify — what is each PDF?
Types to recognise: Ponudba · 545. člen · IDD · KID · SEPA · SID · Splošni pogoji · Informacije o obdelavi
osebnih podatkov · Informativni izračun · Spremni dopis. Signals used, in order of cost: filename pattern →
offer-number prefix (§1.3) → text-layer fingerprint → LLM only for genuine ambiguity. Most documents never
touch a model.

### ③ Extract ◆ — the AI core, two tracks
- **Track A (≈80%, born-digital):** layout-aware parse preserving coordinates → structured into a typed
  JSON schema by the model. Fast, cheap, high fidelity. Solves the label-scramble problem in §1.2.
- **Track B (≈20%, scans):** page render → **Claude vision** → same schema. Handles sample 9's
  handwriting-annotated scan.
- **Schema:** one shared core (zavarovalec, zavarovanec, št. ponudbe, zastopnik + licenca, začetek
  zavarovanja, premija, frekvenca, način plačila, upravičenci) + per-product extension blocks. Adding a
  product = adding a schema file, not editing the engine.

**AI technology, stated plainly for the bid:** Anthropic **Claude** — Opus-class for extraction and vision
where accuracy is load-bearing, a smaller Claude tier for high-volume classification. EU processing.
No customer data used for model training. No data leaves the EU. *(This section answers their explicit
question 4 and is worth writing carefully — most bidders will just write "AI".)*

### ④ Validate ◆ — why this never silently corrupts their systems
Per-field confidence score, plus hard cross-checks that need no AI at all:
- offer-number prefix must agree with the detected product (§1.3)
- **davčna številka mod-11 checksum** — a wrong tax number is caught arithmetically, not probabilistically
- `letna premija` vs `obrok × frekvenca` must reconcile
- name/address must agree across Ponudba ↔ SEPA ↔ IDD
- dates sane, začetek zavarovanja not in the past

Anything below threshold **does not post**. It goes to ⑥. This is the single most important design decision
in the whole system and the backbone of the guarantee in §7.

### ⑤ Integrate ◆ — the two target systems
- **eDOKUMENTI:** push PDFs + metadata; raise the missing-`545. člen` warning; write the *zaznamek* they
  asked us to advise on (see §4); receive the completion callback.
- **Zavarovalniški program:** push metadata on completion.
- **File server:** archive to their existing convention `Datum-Priimek in ime-Številka ponudbe`.

> 🔴 **This is the #1 project risk and it must be priced, not assumed.** Their spec says "preko API-ja" as
> though those APIs exist and are documented. Until we see them, we do not know if they exist, whether
> they support writes, or whether the vendors will cooperate. Handling in §6.

### ⑥ Review console ◆ — *Nadzorna plošča*
Not a dashboard — a work queue. Only the exceptions surface: low-confidence fields, missing documents,
unknown products, failed pushes. Side-by-side PDF vs extracted values, one-click correct-and-release.
**Every human correction is captured as labelled training data**, so accuracy compounds instead of decaying.
This is what turns "an AI script" into a system they can actually run their business on.

### ⑦ Audit & alerting
Immutable per-offer trail: every step, every actor (robot or named human), before/after, timestamped —
which is also the GDPR/ZZavar-1 accountability record. Severity-routed failure alerts (their spec asks for
this by name). Weekly summary: processed, straight-through, human-touched, error classes.

### Handling their two named edge cases
1. **Missing `545. člen`** → warning to eDOKUMENTI via API, offer parked, not silently dropped.
2. **Collective health/accident for legal entities** — Merkur's own account manager runs the whole
   sale, so the packet legitimately arrives *without* `545. člen`. Detected via the offer-number prefix
   (`44x`/`9x` family) + product type, routed to an **expected-exception** path rather than an error, with
   a standing zaznamek in eDOKUMENTI and automatic chase until the signed document arrives. They asked us
   to advise on the zaznamek mechanism — §4.

---

## 4. Answering the question they explicitly asked us to advise on

> *"Do prejema dokumenta mora Robot v sistemu eDOKUMENTI evidentirati zaznamek… (svetujte kako naj ga robot doda v Edokumente)"*

Three options, ranked. **This is a free credibility win — they asked for advice, so give real advice.**

| # | Mechanism | Verdict |
|---|---|---|
| **1 ★** | Structured **status field on the offer record** (`545_CLEN: PENDING/RECEIVED`) + dated note, set via API | **Recommended.** Machine-readable → the robot can auto-chase, auto-clear on arrival, and report on it. A free-text note cannot be queried. |
| 2 | Placeholder document stub of type `545. člen` with status *awaiting* | Good fallback if eDOKUMENTI has no custom status fields. Keeps the packet visibly incomplete in their existing UI. |
| 3 | Free-text comment only | Only if the API allows nothing else. Human-visible but not automatable — the robot can never confirm resolution. |

Whichever their vendor supports, the robot owns the full lifecycle: raise → chase on a schedule →
auto-clear when the signed document lands → release the offer onward.

---

## 5. Rešitev 1 vs Rešitev 2 — and what to recommend

| | **REŠITEV 1** | **REŠITEV 2** |
|---|---|---|
| Ingest, classify, extract, validate | ✅ | ✅ |
| Push to eDOKUMENTI | ✅ | ✅ |
| Who builds KLP + Privolitvena izjava | eDOKUMENTI (unchanged) | **The robot** |
| Signature flow for Privolitvena izjava | eDOKUMENTI | **The robot** (image-based e-signature, per their spec — *not* qualified) |
| Needs a callback from eDOKUMENTI | **Yes — hard dependency** | No |
| Push to Zavarovalniški program | after callback | directly |
| Dependency on the eDOKUMENTI vendor | **High** | Low |
| Build scope | Smaller | ~+50% |

**Recommend REŠITEV 2 as the headline, REŠITEV 1 as the fallback tier.** Reasoning:

- Rešitev 1's critical path runs **through a third-party vendor we do not control**. If eDOKUMENTI cannot
  emit the completion callback, Rešitev 1 does not work — and we would carry the blame for a dependency
  that was never ours.
- Rešitev 2 gives Harvest Hub a system they own end-to-end, and — the part worth selling — it removes their
  strategic dependency on eDOKUMENTI for the core revenue process. That is a bigger outcome than
  "we saved some typing".
- Commercially it is simply a larger, better-defended scope.

Present both (they asked for both). Anchor on 2.

---

## 6. Risks, assumptions, dependencies — put these IN the offer

Naming risks in a bid does not weaken it; in enterprise procurement it is the single strongest
credibility signal, and it protects Ian from scope collapse later.

| # | Risk | Handling |
|---|---|---|
| **R1** | **eDOKUMENTI / Zavarovalniški program APIs may not exist, may be read-only, or may be undocumented** | **Phase 0 gate.** Nothing is committed until we've seen them. If no API: RPA/UI-automation fallback, **priced separately** — never absorbed silently. |
| R2 | Vendor cooperation / lead times outside our control | Named client-side owner + agreed response SLA written into the contract |
| R3 | Scanned + handwritten packets (~20%) will never be 100% straight-through | Confidence engine + review queue. We commit to accuracy **on the agreed field set**, with an explicit acceptance test — not to a fantasy |
| R4 | Merkur changes document layouts | Config-driven product registry; layout drift is caught by validation, not by a crash |
| R5 | New products appear (their spec says so) | Product registry + **2 new-product onboardings included** in the fee |
| R6 | GDPR Art. 9 health data | EU-only processing, encryption at rest and in transit, retention policy, full audit trail, DPIA input provided |
| R7 | Volume spikes (300→500/month) | Queue-based, horizontally scalable; the numbers here already model the 500 case |

**Assumptions to confirm before the number is final** — do not send the offer with these unvalidated:
- Per-offer manual handling time today *(my model uses 10–16 min; **this must come from them, not from us**)*
- Loaded hourly cost of the staff doing it
- Whether both target systems have write APIs
- Who owns the runtime infrastructure after handover (see §7 — critical, because there is no retainer)

---

## 7. Commercial structure

### 7.1 The no-retainer problem — solve this explicitly

They refuse a monthly fee. That has a consequence Ian must decide on **before** quoting: *who runs this
after handover, and who pays for it?*

The clean answer, and the one to write into the offer:

> **Harvest Hub owns and operates the system.** It runs on their infrastructure, under their own Anthropic
> API key. AIS delivers, tests, trains, warrants, and hands over full source code and documentation.
> Ongoing running cost is theirs, is small, and is disclosed up front.

This is honest, it is what "no monthly fee" actually means, and it removes Ian's open-ended exposure.
**But it also means the 12-month warranty is unpaid risk carried in the one-time fee — which is exactly
why the fee should sit above €12k, not at it.**

### 7.2 Their running cost — disclose it, it's a selling point

Computed on **Claude Opus 4.8 list pricing ($5 / $25 per million tokens)** — i.e. quoted on the premium
tier even though production will route most volume cheaper. At 400–500 offers/month:

| Item | Monthly |
|---|---|
| Classification (mostly deterministic, LLM only on ambiguity) | ~€3 |
| Extraction — text track (~80% of offers) | ~€20 |
| Extraction — vision track (~20% of offers) | ~€8 |
| Validation / cross-check pass | ~€9 |
| **AI subtotal** | **≈ €40–50** |
| Hosting (VM + Postgres + object storage, EU) | €30–60 |
| **Total run cost** | **≈ €80–110 / month** |

**The line that sells the whole project:** *the AI costs less per month than one hour of the work it replaces.*

### 7.3 ROI model — **flag clearly as a model, not a claim**

| | Conservative | Realistic |
|---|---|---|
| Offers / month | 400 | 450 |
| Manual minutes / offer *(TO BE CONFIRMED BY CLIENT)* | 10 | 15 |
| Hours / month | 67 | 113 |
| Loaded cost @ €16/h | €1,070 | €1,800 |
| **Annual labour cost today** | **≈ €12,800** | **≈ €21,600** |

Against €19,900 (Rešitev 2): payback **≈ 11–19 months**, then ~€13–21k/year recovered, every year,
plus the error and rework cost that isn't in the table. Over 3 years: **€38k–65k of labour** against a
one-time €19,900.

> Do **not** send this table until the client confirms the minutes-per-offer. Have them state the number —
> a figure they gave us is unarguable; a figure we invented is a liability.

### 7.4 Pricing — **DECIDED 2026-07-26: €12,000 flat for Rešitev 2**

Ian's call. Recommendation below was €19,900; he chose to hold at his original number.

| Tier | Scope | Price (one-time, ex VAT) |
|---|---|---|
| **Rešitev 1** | Robot + two-track extraction + validation + both integrations + review console + audit trail. Depends on the eDOKUMENTI callback. | **€8,900** |
| **Rešitev 2 ★** | Everything above + robot generates KLP & Privolitvena izjava + runs the signature flow. No vendor callback dependency. | **€12,000** |

€8,900 / €12,000 is deliberate: only €3,100 separates them, which pushes the client toward Rešitev 2 —
the one we actually want them to buy, because it removes the third-party dependency.

All tiers include: Phase 0, review console, product registry with **2 new-product onboardings**,
training, full source-code ownership, **12-month warranty**.

**Payment:** 40% on signature · 30% on Phase 1 acceptance · 30% on handover.
**Optional, never required:** *Support & Evolution* block at €2,400/year, offered after handover — an
upsell, not a condition. Their "no monthly fee" stays honoured.

#### Because the price is fixed, the margin is protected structurally instead

At €12,000 there is no headroom to absorb surprises, so §8 of the offer ("Kaj ni vključeno") does the
work the price otherwise would. Four load-bearing exclusions:

1. **RPA fallback is explicitly out of scope** and re-quoted after Phase 0 if the APIs don't exist. This
   is the single biggest financial risk in the project (R1) and it must never be absorbed silently.
2. **Phase 0 is a contractual gate** — integration scope is not fixed before it.
3. **Field set is frozen** at Phase 0 sign-off; changes after that are chargeable.
4. **Warranty covers defect repair, not new features.** Without this line a 12-month unpaid warranty
   becomes a 12-month unpaid development retainer.

> **Standing note for Ian:** my read remains that Rešitev 2 at €12,000 is roughly €8k under market for
> the scope — two enterprise API integrations against unseen systems, a two-track AI engine with
> confidence scoring, a review application, a document generator, an e-signature flow, GDPR Art. 9
> handling, plus a year of free warranty with no retainer funding it. If the Phase 0 findings widen the
> scope at all, that is the moment to re-price, and the offer is written to allow exactly that.

---

## 8. Delivery plan

| Phase | What ships | Duration | Gate |
|---|---|---|---|
| **0 — Discovery & API reality check** | API docs reviewed, mailbox access, 545. člen/zaznamek mechanism confirmed, field set signed off | 1–2 wks | **Go/no-go on R1.** Scope + price confirmed or re-quoted here |
| **1 — Extraction engine** | Both tracks running against their 15 real samples + a fresh live batch | 2–3 wks | **Pilot Gate:** accuracy demonstrated on *their* documents, in front of them |
| **2 — Ingest + rules** | Mailbox, archive, classification, 545. člen checks, collective-product exception path | 2 wks | Exception cases pass |
| **3 — Integrations** | eDOKUMENTI + Zavarovalniški program + file-server archival | 2–3 wks | Round-trip test |
| **4 — Console + observability** | Review queue, audit trail, alerting, weekly report | 2 wks | UAT |
| **5 — Parallel run** | Robot runs alongside the humans on live volume; nothing trusted blindly | 2–3 wks | **Acceptance test** (§9) |
| **6 — Handover** | Training, documentation, source-code transfer, warranty starts | 1 wk | Sign-off |

**Total: 12–16 weeks.** Rešitev 1 lands at the shorter end; Rešitev 2 adds ~3 weeks in Phase 3.

Phase 1 is deliberately early: **they see their own documents being read correctly in week 3**, long before
the money is mostly spent. That is the single strongest trust-builder in the whole plan.

---

## 9. The offer — Hormozi frameworks, calibrated for regulated B2B

Applied per the `hormozi-offer-engineer` skill. Note his own stated limitations: **enterprise B2B
committee procurement** and **regulated markets** both apply here — so we use the Value Equation, obstacle
stack, and guarantee architecture, and we **drop** fake scarcity, bonus-stacking theatrics, and
infoproduct naming. Those would actively lose this deal.

### 9.1 Value Equation

| Variable | Move |
|---|---|
| **Dream Outcome** ↑ | Not "we automate your PDFs". → *"Harvest Hub processes every Merkur offer without a single person retyping anything — and can double its volume without hiring."* Status ladder: **the intermediary Merkur considers its most operationally capable partner.** |
| **Perceived Likelihood** ↑ | The §1 document audit (proof we've already done the work), the Phase-1 Pilot Gate on *their* files, the confidence engine, the acceptance test, the named-risk register |
| **Time Delay** ↓ | Working extraction on their real documents **by week 3**, not at the end. Progress is visible, early, and on their own data |
| **Effort & Sacrifice** ↓ | Fully done-for-you. Their total input: mailbox access, API documentation, one named contact, one acceptance session |

### 9.2 Obstacle → named solution (the stack — 8 items, all mapped)

| Their objection | Named component |
|---|---|
| "The AI will get it wrong and we won't know" | **Confidence Engine** — per-field scoring, tax-number checksum, premium reconciliation, cross-document agreement |
| "Bad data will quietly pollute our systems" | **Nadzorna plošča** — nothing below threshold ever posts; it queues for a human |
| "Our systems might not have usable APIs" | **Integracijski most** — adapter layer + RPA fallback, resolved at the Phase 0 gate |
| "Merkur keeps launching new products" | **Register produktov** — new product is a config entry; 2 onboardings included |
| "Collective/legal-entity cases break every rule" | **Pravilnik izjem** — expected-exception path, zaznamek, automatic chase |
| "We won't find out when it breaks" | **Nadzor in obveščanje** — audit trail, severity-routed alerts, weekly report |
| "We're regulated — GDPR and ZZavar-1" | **Compliance paket** — EU-only processing, Art. 9 handling, retention, DPIA input, immutable audit log |
| "You'll build it and vanish" | **Predaja** — full source-code ownership, documentation, training, 12-month warranty |

### 9.3 Guarantee architecture — conditional, stacked, defensible

Two stacked conditional guarantees (Hormozi pattern B: small outcome + big outcome). Both are
operationally defensible — no refund theatre, which would read as amateurish here.

1. **Jamstvo natančnosti (Accuracy Guarantee).** On the agreed field set, ≥ **98% field-level accuracy**
   measured on a **100-offer acceptance test** drawn from their live traffic. If it isn't met, we keep
   working at no additional cost until it is — **the final 30% milestone is not invoiced until it passes.**
2. **Jamstvo brez tihih napak (Zero Silent Error Guarantee).** No record is ever written to eDOKUMENTI or
   the Zavarovalniški program below the confidence threshold. Uncertain data goes to human review, always.
   This is **structural** — it's how the system is built, not a promise about how it behaves.

*Activation points* (what they must do for the guarantee to hold) are exactly the Phase-0 deliverables:
API access, a named contact, and sign-off on the field set. Clean and enforceable.

### 9.4 Urgency — real only

No countdown timers, no "3 slots left". What is genuine and defensible:
- **Offer valid 30 days** (pricing and API assumptions are only good for so long)
- **Build slot reserved on signature** — Ian genuinely has finite delivery capacity
- Their own spec is dated 23.7.2026 and they are collecting bids now

### 9.5 Category-of-one positioning

The comparison set is generic automation shops quoting "RPA + OCR". The line that makes us incomparable:

> *"Every other bid will quote you OCR. We opened your fifteen documents. Twelve carry a clean text layer
> and three are scans — one of them annotated by hand. Those need two different technologies, and a
> system that knows which one it's looking at. That's the difference between 90% accuracy and a system
> you can actually stop checking."*

---

## 10. Open questions — resolve before the offer goes out

**For Ian:**
1. **The whiteboard photo** — re-send via `~/Downloads`; I couldn't read it out of the Messages store. I want to confirm the four pillars before locking the architecture diagram.
2. Price call: **€19,900 for Rešitev 2** (my recommendation) or hold at €12,000?
3. Does this ship under **AIS**, per the usual? (Assuming yes.)
4. 12-month warranty with zero retainer — comfortable, or shorten to 6 months?

**For Harvest Hub (send as a short pre-offer question list — asking sharp questions raises the price):**
1. Do eDOKUMENTI and the Zavarovalniški program have **documented write APIs**? Can we see the docs?
2. Who is the eDOKUMENTI vendor contact, and will they cooperate?
3. **How many minutes does one offer take today, end to end?** (Drives the ROI table — needs to be their number.)
4. How many people touch the process today?
5. Which fields must land in the Zavarovalniški program? (Exact list = exact scope.)
6. Does eDOKUMENTI support custom status fields, or only free-text notes? (§4)
7. Who owns hosting after handover, and do they have an Anthropic account?
8. Retention obligations for this documentation under ZZavar-1?

---

## 11. Next actions

1. Ian confirms price tier + re-sends the whiteboard
2. Send the 8 client questions (short email, positions us as the serious bidder before the offer even lands)
3. On answers → build the **Slovene client-facing offer** (`ponudba-prenos-zero.md` → PDF via `make-pdf`)
4. Hold Phase 0 as a genuine gate — do not commit to a fixed price on the integrations before seeing the APIs
