# Pricing — AIS Slovenia

The pricing logic. Read after `services.md`.

---

## The model

Two components. Always both. Never one without the other.

1. **Build fee** — one-time, paid at engagement start. Covers the build phase: scoping, deployment, voice locking, 30-day onboarding ladder, handoff to operate phase. Sized to vertical complexity and agent count.
2. **Operate retainer** — monthly, paid in advance. Covers continuous improvement, voice maintenance, escalation handling, monthly reporting, and quarterly review. Lasts as long as the engagement runs.

We do not sell build phase without an operate phase. We do not sell operate phase without first running a build phase. The two are bound — selling either standalone breaks the model.

---

## Why not seats

SaaS seat pricing assumes the buyer brings the workflow and the operator skill. The vendor provides a generic tool; the buyer figures out how to use it. As more buyers join, the tool's value per seat declines (because the tool can't get smarter from generic use), but the price stays constant. The math favours the vendor for a few years until churn catches up.

AIS doesn't sell a tool. We sell a deployed function with documented operating procedures and continuous improvement. There are no seats — the agent system isn't a per-user license. There's a deployed instance owned by the client, and we operate it. Pricing seats would force-fit a model that doesn't describe what's actually being delivered.

If a buyer asks for seat pricing, they're shopping for the wrong category. Refer them to GHL, HubSpot, or n8n templates.

---

## Why not hours

Hourly billing rewards slowness and punishes speed. The faster we deploy, the worse the math gets. The model also forces us to track time as the primary unit of value, which has nothing to do with the outcome we're being paid for.

Worse: hourly billing makes the buyer the project manager. They have to scope, monitor, and validate hour-by-hour. The relationship turns adversarial. We've all seen agencies bill 40 hours for what was 8 hours of actual work plus 32 hours of internal coordination overhead.

AIS sells a function. The function is either working or it isn't. The buyer doesn't care how many hours we spent deploying it — they care whether it's deployed, whether it's stable, and whether it's improving. That's what the build fee + operate retainer pays for.

If a buyer asks for time-and-materials billing, they're hiring the wrong vendor. Refer them to a freelance dev shop.

---

## Why not "AI consulting"

AI consulting prices a deliverable made of words (slide decks, roadmaps, assessments). The deliverable is judged by sophistication, not by what shipped. Engagements end with a beautiful document and nothing operating. Client renewal is rare because the next engagement requires fresh "strategy" to justify the spend.

AIS sells deployed agent systems. The deliverable is a working instance with monitoring, runbooks, and a 30-day execution history. Renewal is mechanical: the operate retainer continues until the client off-ramps. No re-sell required.

If a buyer asks for an "AI readiness assessment" or "AI strategy roadmap," they're shopping for the wrong category. Refer them to McKinsey, Deloitte, or any of the dozen rebrand-consultancies competing for that business.

---

## Build fee sizing

Build fee scales with three factors:

1. **Vertical complexity** — regulatory rigour, data sensitivity, integration count. Specialty legal sits at the high end (compliance review, conflict-of-interest checks, multi-jurisdictional handling). Slovenian SMB ops sits at the low end (single-jurisdiction, common tools, standard data shapes).
2. **Agent count** — single agent owning a single function (compact) is cheaper to deploy than a four-agent stack owning a functional cluster (comprehensive).
3. **Voice / data depth** — engagements requiring deep voice locking (lots of brand-voice training) and large data corpus (years of historical SOPs, prior outputs) take longer to build than greenfield deployments.

### Default ranges

| Engagement shape | Vertical complexity | Build fee range |
|---|---|---|
| Compact (1 agent, 1 function) | Low (Slovenian SMB ops) | €15K–€25K |
| Compact (1 agent, 1 function) | Medium (B2B SaaS demand-gen) | €20K–€32K |
| Compact (1 agent, 1 function) | High (specialty legal intake) | €25K–€40K |
| Standard (2–3 agents, function with sub-functions) | Low | €30K–€45K |
| Standard (2–3 agents, function with sub-functions) | Medium | €40K–€60K |
| Standard (2–3 agents, function with sub-functions) | High | €50K–€80K |
| Comprehensive (4+ agents, full functional cluster) | Low | €55K–€75K |
| Comprehensive (4+ agents, full functional cluster) | Medium | €70K–€95K |
| Comprehensive (4+ agents, full functional cluster) | High | €85K–€120K |

Numbers are EUR. These are the bands. The actual quote within a band is set during the scoping phase based on tool integration count, data ingestion volume, and voice-locking depth.

We do not quote below the range. If a buyer pushes for a sub-range price, the response is: "The scope you've described prices at €X. Below that, we'd be cutting deliverables that make the engagement work. We can scope a smaller engagement that fits a smaller fee — that's a different conversation."

---

## Operate retainer sizing

Operate retainer scales with two factors:

1. **Agents in operation** — each agent has ongoing improvement, monitoring, voice maintenance, and escalation handling cost.
2. **Volume / criticality** — high-volume customer-facing agents (intake triage handling 200+ inquiries/month, content production at 4+ articles/week) cost more to operate than low-volume internal agents (monthly reporting, calendar coordination).

### Default ranges

| Engagement shape | Operate retainer / month |
|---|---|
| Compact | €4K–€6K |
| Standard | €7K–€9K |
| Comprehensive | €10K–€12K |

Retainers are paid monthly in advance, on the 1st. Net 7 from invoice date. No discount for annual prepay (the math doesn't justify it — we'd rather have monthly cash than 11% discount on a year's worth).

### ⚠️ Reconciliation with measured reality (2026-08-09)

The bands above were set 2026-05-25, before AIS had delivered anything. The first delivered engagement operates at **€227/mo** — 5% of the Compact floor. That is not a band, it's a mispricing, and it went unnoticed because three documents priced the same thing differently:

| Source | Compact / single-function retainer |
|---|---|
| This file | €4,000–6,000/mo |
| `verticals/document-operations.md` §6 (written from delivery) | €350–600/mo |
| INSPECTUS, actually paying | €227/mo |

**Decision:** the bands above stand as the target for full multi-agent engagements. **Single-function document-pipeline engagements — the only shape with delivered revenue — price at €900–1,800/mo**, recorded in `verticals/document-operations.md` §6. Vertical playbook bands override this file where they exist and are grounded in delivery.

The floor is not arbitrary. A single document pipeline replaces ≥1 FTE of retyping, and a Slovenian FTE costs €2,500–3,500/mo fully loaded. €1,200/mo to remove €3,000/mo of labour returns 2.5× to the buyer. Below ~€900/mo the engagement cannot carry its own operate cost, and recurring revenue stops being able to carry the business at all — see `ops/road-to-1m.md` for the arithmetic that makes this the highest-leverage number in the company.

Existing contracts are grandfathered. Every new quote uses the corrected band.

Retainers can be downgraded or upgraded on 60-day notice. If a client wants to add an agent mid-operate, that's a mini-build-fee (€5K–€15K) plus an increase in the operate retainer.

---

## Contribution margin model

We track contribution margin per engagement, not aggregate. The target is 65%+ on each engagement after direct costs:

| Cost category | Typical % of engagement revenue |
|---|---|
| Inference / cloud / tool API costs | 8–15% |
| Cofounder time on this engagement | 15–22% |
| External contractor time (if any) | 0–8% |
| **Direct cost total** | 23–45% |
| **Contribution margin** | **55–77%** |

We refuse engagements that pencil below 55% contribution margin. The math doesn't justify the operator load, and the engagement steals capacity from better-margin work.

This is also why we don't discount. A 20% discount on a €60K build fee that runs at 60% margin destroys the margin entirely (60% → 50%, losing 10 points). The discount feels small to the buyer and catastrophic to us.

The compute-to-talent inversion matters here: AI-native businesses run at 50–60% gross margins (because inference is heavy compute and R&D is permanent), but operating margin can hit 30–40% if revenue per cofounder is high. We're aiming for €100K+ revenue per cofounder per quarter by Q4 2026.

---

## Payment terms

- **Build fee:** 50% on engagement start, 50% on handoff to operate phase. Net 14 from each invoice date.
- **Operate retainer:** monthly, paid in advance on the 1st. Net 7 from invoice date.
- **Late payment:** 2% per month on unpaid balance. Operate work paused on day 14 of unpaid retainer (with 7 days' written notice on day 7).
- **Currency:** EUR by default. USD acceptable for non-EU clients at the spot rate at invoice date.
- **VAT:** Slovenian VAT applies to EU clients per reverse-charge rules. Non-EU clients are VAT-free. (Confirm with Nejc on each engagement — VAT shape can change with the d.o.o. formation.)

---

## When we say no to an engagement

Some engagements look profitable but kill the model. We say no to:

- **Engagements below 55% contribution margin.** Doesn't matter how strategic the client is. The math doesn't work.
- **Engagements where the buyer can't commit to a 30-day onboarding ladder.** Skipping the ladder produces black-box agents that fail in operate phase. We've decided not to run that risk.
- **Engagements where the buyer wants to license the agent system without ongoing operate phase.** Selling the deployment without the operation produces a system that decays. The client is unhappy in 3 months, and the brand damage isn't worth the build fee.
- **Engagements where the buyer wants paid-media as part of scope.** Refer out (see `services.md` for the referral list once Phase 5 ships).
- **Engagements where the buyer has no named human owner for the deployed agents.** Floating AI fails. We've decided not to deploy floating AI.
- **Engagements with a 60+ day decision cycle.** Owner-operator buyers decide in 1–2 weeks. Longer cycles signal misaligned authority, which signals a black-box engagement waiting to happen.

Saying no preserves the model. Saying yes to every engagement that hits the bank account dilutes the offering and trains the market to expect us to bend. Don't bend.

---

## Discounting rules

The default rule: **we don't discount.** The prices in the build-fee and operate-retainer tables are the prices.

Exceptions (and only these):

- **Founding-client pricing for the first 2 engagements per vertical.** Up to 15% off the build fee, in exchange for case-study collaboration rights (anonymized OK, but we get to write and publish the case study). Operate retainer is full price.
- **Multi-engagement clients.** If a client signs a second build engagement within 12 months of the first, the second build fee gets a 10% volume discount. Operate retainers stack at full price.
- **Cofounder personal network.** Soft rule — handled case-by-case with cofounder consensus. Never below 55% contribution margin.

Outside these, we don't discount. Every other "discount conversation" is actually a "scope conversation in disguise" — narrow the scope, drop the price, but never compress the margin.
