# Road to €1M — the operating ladder

Written 2026-08-09. **Supersedes `ops/escape-velocity-targets.md`** for all revenue, engagement-count, hiring and draw targets.

Target: **€1M annualized run rate — €83K/month — in December 2027.** 17 months.

---

## Why this replaces escape-velocity-targets.md

That document was written 2026-05-25, before AIS had revenue, and it has been overtaken by measurement rather than by disagreement:

| Quarter | escape-velocity-targets.md | Actual |
|---|---|---|
| Q3 2026 (now) | TTM €60K–€100K · 2–3 active engagements | **TTM ~€3.3K · 1 active engagement at €227/mo** |
| Q4 2026 | TTM €250K–€400K · 4–6 engagements | would need €250K in five months |
| Q4 2027 | TTM €1.3M–€1.7M · run rate >€1.5M | — |

A 20–30× miss at the first measured quarter. The old file is not wrong about *where* AIS is going; it is wrong about the starting line and every date downstream of it. Keeping two live revenue plans in one repo is how the pricing spread in §"The retainer decision" below happened in the first place.

`escape-velocity-targets.md` is retained for its escape-velocity *thesis* (revenue per cofounder ≈ €500K, retainer revenue exceeding operating cost, acquisition self-sustaining). Its quarterly numbers are dead.

---

## The measured starting line

| | Amount | Status |
|---|---|---|
| INSPECTUS Contract A | €1,900 one-off + €227/mo | **Signed, delivered, live** (4 Jun 2026) |
| INSPECTUS Contract B | €3,900 | Proposed, unsigned |
| INSPECTUS Contract C | €4,900 + €390/mo | Proposed, unsigned |
| INSPECTUS VIN smart filter | €14,900 + €590/mo | Proposed, unsigned |
| Harvest Hub (Solution 2) | €12,000 | Proposed, unsigned — trial expires **17 Aug 2026** |
| **Signed recurring** | **€227/mo = €2,724/yr** | |
| **Negotiated, unsigned** | **~€31,800 cash + €980/mo** | |

Source of truth: `engagements/*/client.json`. Nothing enters this table until it is signed.

---

## Verdict

**€1M *booked* in calendar 2027: not reachable.** It needs ~40 delivered engagements next year from a two-engagement base with part-time founders.

**€1M annualized *run rate* in December 2027: reachable, narrow, ~20–25%.** Likelier landing zone €400–600K — still 15–20× today.

The path is narrow for one reason, and it is not delivery capacity:

> **Every gate on the critical path is a commercial act — a signature, a price, a published case study. None of them require writing code.** Delivery capacity does not bind until ~€300K/yr. Solving it first is the trap, and it is the trap this team is most drawn to.

---

## The retainer decision

Three documents in this repo price the operate retainer, and they disagree by 20×:

| Source | Retainer |
|---|---|
| `docs/pricing.md` — Compact | €4,000–6,000/mo |
| `verticals/document-operations.md` §6 | €350–600/mo |
| INSPECTUS, actually paying | €227/mo |

This decides the shape of €1M:

| Retainer | Clients for €60K/mo recurring | Builds/yr still needed |
|---|---|---|
| €227/mo | 264 | impossible |
| €500/mo | 120 | ~50/yr, forever |
| **€1,200/mo** | **50** | **~15/yr** |
| €2,000/mo | 30 | ~10/yr |

At €350–600/mo, recurring can never carry the business and €1M becomes entirely build-fee-driven — a treadmill that resets to zero every January and binds hardest against the constraint we have least of. At €1,200/mo it becomes 45 clients and 1.5 builds a month.

**Decision: the document-ops operate band is €900–1,800/mo.** Justification is already in the playbook — the client is replacing ≥1 FTE of retyping, and a Slovenian FTE costs €2,500–3,500/mo fully loaded. €1,200/mo to remove €3,000/mo of labour is a 2.5× return for the buyer. **€227/mo charges 7% of the labour it replaces.**

INSPECTUS is grandfathered. Every new quote uses the new band. `docs/pricing.md` and `verticals/document-operations.md` §6 are updated to match.

---

## How the three of us organize around this

### Rung −1 — the entity

**Decided by Ian, 2026-08-10: the d.o.o. opens once INSPECTUS and Harvest Hub have paid.** The sequencing is sound — a Slovenian d.o.o. needs €7,500 of minimum share capital, and a company billing €227/month does not have it. Rung 0 is what funds the entity.

That makes Rung 0 and the entity the same move, and it puts one unresolved question directly on the critical path.

**⚠️ The check that has to happen before the invoices go out.** The s.p. that would issue them is recorded as **"V blokadi"** — a bank-level account block. In AJPES that normally means a creditor, FURS, or a court action rather than a voluntary wind-down. If it is still live, **money invoiced into that account can be intercepted before it reaches the founders** — meaning the €31,800 that is supposed to capitalize the d.o.o. may never arrive, and the plan stalls at the exact step it was designed to clear.

INSPECTUS has been paying €227/month since June, so money is reaching *somewhere*. That is evidence the mechanism works, or that payments are landing somewhere with its own tax consequences. Either way it is knowable, and nobody has written down which.

**Three questions to Anej, before the Harvest Hub invoice is issued:**

1. Which account has been receiving the INSPECTUS payments since June?
2. Is the block still live, and what caused it — voluntary wind-down, or a creditor / FURS / court action?
3. If a €12,000 invoice is paid into that account tomorrow, does the money reach us?

This is a five-minute conversation that de-risks €31,800. It is not paperwork; it is the difference between Rung 0 funding the company and Rung 0 funding somebody else. An s.p. owner is **personally liable**, so if the cause is a creditor action it can also follow Anej into the new entity — which is why the answer is needed before the d.o.o. is formed, not after.

**Also unresolved, and cheap to fix while the lawyer is already engaged:** there is **no founders' agreement**. 33/33/33 with no tie-breaker is a deadlock waiting for the first real disagreement about price, and the two-originals-plus-one-invited structure is exactly the shape that needs vesting. Draft it in the same session as the d.o.o. paperwork.

**Owner: Nejc** (legal lead + external representative).

### Ownership is currently inverted, and that is the organizational failure

Rung 0 as originally written assigned **three of four items to Ian** — case-study permission, the INSPECTUS contracts, the VIN work. But Ian is **Head of Engineering, working part-time, with an outside job**, and three of those four are **sales acts**. Meanwhile Nejc — "primary external representative, most meetings, in-person marketing, sales" — was assigned nothing.

Corrected:

| Person | Role | Owns in Rung 0 |
|---|---|---|
| **Nejc Feigel Boh** | Legal + primary external rep, sales | **The entity, the founders' agreement, the V-blokadi answer.** INSPECTUS case-study permission. INSPECTUS Contract B/C close. All invoicing and collection. |
| **Anej Vučič** | Strategic, AI domain, relationships | **Harvest Hub end to end** — he signed the handover to Petra and holds the relationship. Pricing decisions under the new band. |
| **Ian Veber** | Engineering (Claude as technical brain), ~15–20 h/wk | **VIN cost-routing deploy. Delivery only. Nothing commercial.** |

The rule: **Ian's hours are the scarcest input in the company and they are the only ones that can build. Every hour he spends chasing a signature is an hour of delivery capacity destroyed.** If a task can be done by someone who is not the engineer, it is not Ian's.

### The cadence already exists — run it, don't rewrite it

`ops/runbook.md` has a full daily / weekly / monthly / quarterly rhythm, written May 2026, with these same three names on it. It has never been run. Do not write a second one.

It does need cutting to fit the real budget — it assumes something close to full-time founders, and the actual pool is ~20 combined hours a week. Until Ian leaves iPROM, run this reduced set and nothing else:

- **Monday, 30 min, all three, live.** What closed, what is blocked, who is stuck. Blockers get an owner and a date before the call ends.
- **Friday, 15 min, async.** Each person updates their engagements in `engagements/*/client.json`. No meeting.
- **First Monday of the month, 45 min.** The five-number scoreboard below. Nothing else on the agenda.

Everything else in `runbook.md` — the daily loops, the per-engagement QBRs, the partner reciprocity review — resumes when there is a team to run it. Scheduling it now guarantees it gets skipped, and a skipped cadence teaches everyone the cadence is optional.

---

## Constraint order

One bottleneck at a time.

1. **Price** — now, free, zero hours. Realized price is 13% of the playbook's own build floor.
2. **Collection** — now, free. €31,800 negotiated and unsigned.
3. **Proof** — Q4 2026, ~15 hours. Zero written case studies; every route in `sales/` depends on them.
4. **Pipeline** — Q4 2026 →. Two clients in 14 months, both warm-network.
5. **Delivery capacity** — Q1 2027 →. **Do not solve this first.**

---

## The ladder

Each rung funds the next. Dates are exit dates.

### Rung 0 — Close the book that's already written · by 31 Oct 2026

Nothing new built. Nothing new sold.

| Action | Value | Owner | Date |
|---|---|---|---|
| Harvest Hub Aneks 1 → full contract | €12,000 | Ian | **17 Aug 2026** |
| INSPECTUS case-study permission (draft written) | unlocks `sales/` | Ian | 31 Aug 2026 |
| Deploy VIN cost-routing branch, **then** sign | €14,900 + €590/mo | Ian | 30 Sep 2026 |
| INSPECTUS Contract B or C | €3,900–4,900 + ≤€390/mo | Ian | 31 Oct 2026 |

**Exit:** ~€30K collected · recurring €227 → ~€1,000/mo. More cash than the business has earned in its life, from zero new clients.

⚠️ The VIN cost-optimization branch is committed and undeployed. Signing first bills the subscription at €181/mo instead of €60/mo. Ship routing before signature — `verticals/document-operations.md` §5.

### Rung 1 — Price correctly, publish the proof · by 31 Dec 2026

- New quotes at **€15–22K build + €900–1,800/mo operate**. No exceptions.
- Both case studies published. `sales/case-studies/inspectus.md` is drafted; Harvest Hub's relationship is warm now and will not be in six months.
- Resolve the Harvest Hub build-only exception — both outcomes pre-registered in `verticals/document-operations.md` §6.
- 2 new engagements at corrected prices.

**Exit:** recurring ~€2,500/mo · 2026 revenue €60–70K · two published case studies.

### Rung 2 — First hire, Ian leaves iPROM · by 31 Mar 2027

**Hire gate:** ≥€45K collected **and** ≥€2,000/mo recurring. A Slovenian builder costs ~€4,000/mo fully loaded; at 65% contribution margin that needs ~€6.2K/mo attributed revenue plus three months' buffer.

**Ian's iPROM exit trigger: €6,000/mo recurring, or €120K collected trailing six months — whichever lands first.** At 15–20 hrs/week Ian cannot be both the delivery engine and the seller. Every month this is deferred pushes December 2027 out by more than a month.

**The metric that decides whether any of this scales:** build hours engagement N ÷ engagement 1. Target **≤60% by engagement 4** (`verticals/document-operations.md` §10). INSPECTUS took 250–320 hours. If engagement 4 still takes 250, the reuse thesis is false, this is a dev shop, and the plan stops here.

**Exit:** ~4 delivery-capable people · recurring ~€5K/mo · Q1 revenue ~€60K.

### Rung 3 — Two builds a month · by 30 Sep 2027

Hires #2 and #3 funded by Q1–Q2 margin. Second market opens.

**Exit:** ~€45K/mo · recurring ~€12K/mo · 2027 H1 ~€200K.

### Rung 4 — €83K/month exit rate · December 2027

- **45 retained clients × €1,300/mo = €58K/mo**
- **1.5 builds/month × €18K = €27K/mo**
- **= €85K/mo ≈ €1.02M annualized**

At today's retainer price the same €83K needs 264 clients or 4.6 builds a month forever. The retainer decision is what makes December 2027 arithmetically possible.

---

## Three structural decisions before Q1 2027

**1. Slovenia cannot feed this alone.** The ICP — Slovenian regulated SMBs, 10–150 staff, €1M–20M revenue, ≥1 FTE of retyping — is perhaps 500–1,500 companies. 45 clients is 3–9% of the entire addressable market, sold part-time. **Austria** is the answer: same document-heavy regulated SMB shape, ~10× the market, higher prices, and the Slovenian-language moat converts to a German-language build on the same engine. Decide by **31 Mar 2027**.

**2. Build-only versus operate.** `docs/pricing.md` forbids build without operate; Harvest Hub sold build-only. If build-only becomes the norm the recurring line never builds and €1M is a treadmill. Resolve at the pre-registered point, in writing.

**3. Second vertical: not before engagement 4.** Adding one before the first compounds is how margin collapses.

---

## What does not get built

Named because the built-not-launched pattern is the dominant risk, and every item here is more enjoyable than selling:

- VETA Tier 1 — built, unpriced, unlaunched. Park until Rung 2.
- App Factory `new-app` — park.
- AIS Community / Founding Six — own plan, gated to Sept 2026. Do not co-mingle.
- INSPECTUS OS Phase 2 — stranded on an uncreated Supabase project. Unstrand only when a client is paying for it.
- Any new vertical playbook.

---

## Risks

| Risk | Consequence | Mitigation |
|---|---|---|
| iPROM job persists past Q2 2027 | €1M slips 6–12 months | Revenue trigger, Rung 2 |
| Anej / Nejc contribute far below 1/3 | Capacity model fails outright | Written weekly-hours commitments before Rung 1 closes |
| Case-study permission never asked | Every acquisition channel stays blocked | Ask while warm — Harvest Hub is warm now |
| Build hours flat at engagement 4 | Dev shop; €1M unreachable | Pre-registered kill criterion |
| Price correction loses deals | Slower pipeline, better margin | Acceptable — €227/mo cannot reach the goal at any volume |
| Slovenia saturates at ~25 clients | Ceiling ~€400K | Austria decision, Q1 2027 |

**Kill criteria — decided 30 Jun 2027.** If recurring is below €4,000/mo **or** fewer than 6 engagements have been delivered at corrected prices, December 2027 is dead. Re-plan for December 2028 rather than pretending.

---

## Monthly scoreboard

First Monday, 30 minutes. Definitions live in `ops/kpi-framework.md` — reuse them, don't invent new ones.

1. **Recurring revenue** — signed monthly retainers. Not proposals.
2. **Cash collected, trailing 30 days** — collected, not invoiced.
3. **Build hours, engagement N ÷ engagement 1** — the reuse metric.
4. **Engagements signed ÷ proposals sent.**
5. **Contribution margin per engagement** — refuse below 55%, per `docs/pricing.md`.

Tracked in `engagements/*/client.json` (`economics` and `pipeline` already carry the shape), surfaced on `dashboard/` (port 4733, launch.json entry `ais-agency`).

**The first check is behavioural, not numerical.** By 31 August 2026: is Harvest Hub signed, and has INSPECTUS been asked for case-study permission? Both are conversations. If neither happened, no later rung will happen either — and that, not the revenue number, is the signal to act on.
