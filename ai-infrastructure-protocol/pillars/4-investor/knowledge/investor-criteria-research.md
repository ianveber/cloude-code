# Investor-Readiness Criteria — Research Findings (2026)

> Knowledge base for Pillar ④ (Investor-Readiness). This is the researched
> evidence behind the DRAFT rubric in `../SKILL.md`. It becomes a knowledge PDF
> (via `make-pdf`) in the delivered protocol. Findings are dated to 2026 sources;
> numbers are public benchmarks, NOT Ian's own deal data — see the SKILL's
> `AWAITING IAN'S DOCS` section.

Research date: 2026-07-17. All figures below carry a source; where a claim is a
range or a median, that is the source's framing, not a smoothed guess.

---

## §1 — How VCs evaluate startups in 2026 (the frame)

The foundational lens is unchanged — **Team, Product, Market, Traction** — but the
bars moved:

- **AI concentration raised the bar for everyone.** ~80% of venture capital is now
  flowing into AI, so non-AI (and weak-AI) founders face a tighter market and higher
  scrutiny on team quality and unit economics. [thevccorner, spectup]
- **Diligence got slower and deeper.** What used to be a one-week diligence is now
  one to two months: financial statements, market data, legal structure, technical
  audits, plus reference calls with customers, industry experts, and prior
  colleagues. A clean, complete data room is now a speed advantage. [thevccorner]
- **Team carries the most weight early.** At pre-seed/seed the team often outweighs
  the product — investors back founders they believe can navigate the unknown. For
  AI companies specifically, the wanted shape is **deep AI expertise + domain/
  commercial strength**: a lead engineer who has built end-to-end AI systems (or
  published), paired with a co-founder who owns the target domain. [thevccorner]
- **"What's your moat?" is a defensibility test, not a trivia question.** A strong
  answer is mechanical and compounding, e.g. *"every transaction we process trains
  our categorization model; we have 4M transactions; a new entrant starts at
  zero."* [thevccorner]

**Implication for the rubric:** Team (criterion 1) and Moat (5/7) are the two the
package must make concrete, and the Moat answer must be a loop with a number.

Sources: [The VC Corner — What Top VCs Look For 2026](https://www.thevccorner.com/p/what-top-vcs-look-for-2026-founder-playbook),
[spectup — What Do VCs Look For](https://www.spectup.com/resource-hub/vc-expectations),
[SignalX — VC Due Diligence Framework](https://signalx.ai/venture-capital-due-diligence/),
[4Degrees — 2026 VC Due Diligence Checklist](https://www.4degrees.ai/blog/2025-venture-capital-due-diligence-checklist),
[TechCon Global — 2026 VC Playbook, AI-First](https://techconglobal.com/the-2026-vc-playbook-how-investment-criteria-are-evolving-in-ai-first-startups/).

---

## §2 — What makes an AI company defensible (the moat, correctly stated)

The consensus in 2026 is a sharp correction of the naïve "we have AI / we have data"
claim:

- **Model access is NOT a moat.** AI compresses time-to-build, so a flashy feature
  or access to a frontier model is quickly matched. VCs are actively *rethinking*
  what a moat is because AI collapses build time. [Forbes/Majic, Valtorian]
- **Proprietary *static* data is NOT a moat either.** "The data advantage myth":
  owning a pile of data alone won't save you. [Value Add VC]
- **The real moat is a proprietary DATA LOOP.** Defensibility comes from a feedback
  loop where *every user action generates a better training signal → improves the
  model → drives more usage.* Dynamic, compounding data from real workflows is the
  actual moat. [Valtorian, percolator]
- **Time is the meta-moat.** What unites durable moats is that they took *years of
  real elapsed time to accumulate* — time that cannot be parallelized. A copycat with
  the same model still can't buy the accrued cycles. [Forgent/Medium]
- **Workflow depth + switching cost.** The more the product becomes part of how a
  team operates — with human review, exceptions, and structured states — the harder
  it is to rip out. Deep integration into mission-critical (especially regulated)
  workflows creates real switching costs. [Valtorian, Codurance, Stanford Law]
- **Domain specialization beats general-purpose.** AI built for a defined use case
  (grid operators, architects, lawyers) embeds in ways that feel necessary and are
  hard to copy. [Latitude Media]
- **The 2026 shortlist of what still defends:** *workflow depth, proprietary data
  loops, distribution, switching costs, and execution quality* — not model access.
  [Valtorian]

**Implication for the rubric:** Criterion 5/7 must, per agent, name the loop
(signal → store → feedback → cycles), the switching cost (integration depth), and
argue replicate-time from loop age. This is exactly what pillars ②③ instrument.

Sources: [Valtorian — AI Moats in 2026](https://www.valtorian.com/blog/ai-moats-2026),
[Forbes/Majic — VCs Rethink Startup Moats](https://www.forbes.com/sites/josipamajic/2026/03/31/vcs-rethink-startup-moats-as-ai-compresses-time-to-build/),
[Value Add VC — The Data Advantage Myth](https://valueaddvc.com/blog/the-data-advantage-myth-why-proprietary-data-alone-wont-save-you),
[percolator — Building Defensible Start-ups](https://percolator.substack.com/p/ai-moats-building-defensible-start),
[Forgent — Defensibility in the Age of AI (2026)](https://forgent.medium.com/defensibility-in-the-age-of-ai-2026-81dc59566dc8),
[Stanford Law — Defensible Moats for Vertical AI (PDF, 2026)](https://law.stanford.edu/wp-content/uploads/2026/06/Defensible-Moats-for-Vertical-AI-Application-Companies-in-a-New-Competitive-Landscape.pdf),
[Latitude Media — Can startups still build a moat](https://www.latitudemedia.com/news/in-the-age-of-ai-can-startups-still-build-a-moat/),
[Codurance — Durable Moats in the AI Era](https://www.codurance.com/publications/beyond-functionality-building-durable-moats-in-the-ai-era).

---

## §3 — Unit-economics benchmarks (2026)

The numbers that seed the DRAFT rubric's criterion 4. **These are the placeholders
pending Ian's docs.**

| Metric | Healthy / benchmark (2026) | Notes |
|---|---|---|
| **LTV:CAC** | ≥3:1 healthy; 3:1–5:1 typical; top quartile 5:1+ | B2B SaaS median **3.2:1**. By ACV: Enterprise (>$100K) 4.5:1, Mid-market ($15K–100K) 3.2:1, SMB (<$15K) 2.5:1. |
| **CAC payback** | ≤12 months healthy | Median stretched to **18 months** (up from 14 in 2023, +29% in a year); 4th quartile past 24 months. |
| **Cost to acquire $1 ARR** | — | Median SaaS now spends **~$2.00 to acquire $1 of new ARR** (up 14% since 2023). |
| **Gross margin** | 70–85% healthy | Traditional SaaS clears **77–81%**. WARNING: LLM-native companies drop to **~52%** because inference cost drags margin — a live risk for AI companies. |
| **NRR (net revenue retention)** | >100% | Above 100% with evidence it is *improving* is what Series B wants. |
| **Rule of 40** | growth% + profit% > 40 | Rule-of-40 companies command a **129% valuation premium** in 2026 (vs 23% in 2022). |
| **Burn multiple** | <1.5 | Series B expectation. |
| **Churn** | <1.5%/mo SMB; <0.75%/mo mid-market/enterprise | Series B expectation. |

**Implication:** the ~52% LLM-native gross-margin drag is a trap for the exact
companies this protocol builds. Criterion 4 and the moat doc (§5, provider price
shock) must show the company's margin math survives inference cost — or explain the
architecture that keeps it high (caching, smaller models, on-prem, human-in-loop
volume control).

Sources: [Foundry CRO — LTV:CAC Benchmarks 2026](https://foundrycro.com/blog/ltv-cac-ratio-benchmarks-2026/),
[Beancount.io — 2026 SaaS Metrics Stack](https://beancount.io/blog/2026/05/10/saas-metrics-founders-must-track-2026-ltv-cac-nrr-churn-cac-payback-benchmarks-guide),
[RaiseReady — SaaS Unit Economics Bible 2026](https://www.raisereadybook.com/blog/the-saas-unit-economics-bible-the-complete-guide-for-founders.html),
[Eagle Rock CFO — SaaS Benchmarks by Stage 2026](https://www.eaglerockcfo.com/blog/research/saas-finance-metrics-benchmarks),
[Digital Applied — SaaS Unit Economics 2026](https://www.digitalapplied.com/blog/saas-unit-economics-2026-cac-ltv-payback-reference).

---

## §4 — The AI-native operating-leverage story (revenue per employee)

The single most investor-legible metric for a company this protocol builds:

- **AI-native firms lead on revenue per employee** — the defining 2026 metric.
  [Forbes/Baier]
- **Magnitude: $2–4M ARR per employee** for AI-native companies, roughly **4×** the
  traditional-SaaS benchmark; some outliers far higher (Midjourney: ~$200M revenue /
  ~11 people ≈ **$18M/employee**). Other sources frame it as **2–10×** traditional
  SaaS. [nicktalwar, RiffOn]
- **Why it happens — structural, not per-head heroics.** AI-native orgs run with
  ~25% fewer people, flatter hierarchies, and higher valuation per employee. ~45% of
  their headcount is engineering/science (vs ~36% at non-AI startups) — *not* because
  they hire differently per role, but because the work that used to sit in sales,
  ops, finance, and admin now happens *in the product*. [Forbes/Sviokla]
- **The new thesis category:** sub-150 headcount + $100M+ ARR is "a genuinely new
  category of investment thesis," and the moat is explicitly *"the product loop
  itself"* — not patents, not static data, not exclusive distribution. [Charaka]

**Implication:** this is the headline of `01-metrics-dashboard.md` and `00-thesis.md`.
Pillar ②'s baseline (hours/errors per process, pre-AI) → pillar ③'s automation → the
revenue-per-employee and cost-out delta IS the operating-leverage proof. It is the
protocol's strongest natural claim because the build literally produces it.

Sources: [Forbes/Baier — AI-Native Firms Lead in Revenue Per Employee](https://www.forbes.com/sites/paulbaier/2026/03/31/ai-native-firms-lead-in-revenue-per-employee/),
[nicktalwar — $4M Revenue Per Employee](https://nicktalwar.substack.com/p/4m-revenue-per-employee-is-the-new),
[RiffOn — 2–10× Higher Revenue Per Employee](https://riffon.com/insight/ins_bko640vxb1j3),
[Charaka Notes — The $5M Employee / AI-Native Revenue Density](https://getmanthan.com/charaka-notes/ai-native-revenue-density/),
[Forbes/Sviokla — AI-Native Firms Are Flatter, Leaner, More Valuable](https://www.forbes.com/sites/johnsviokla/2026/06/28/ai-native-firms-are-flatter-leaner-and-more-valuable-threat-or-opportunity/),
[Valere — AI-Native Companies & Operating Leverage](https://www.valere.io/ai-native-companies-mid-market-operating-leverage/).

---

## §5 — AI-specific technical due diligence (2026): the discount to avoid

For a company whose *whole pitch* is AI-run ops, this is where the package either
earns a premium or takes a haircut. Buyers now test **four AI-vulnerability axes:**
*model dependency, data moat, agentic substitution, talent concentration.*
[Valutico]

- **Governance is the overlooked gap, not the model.** "The AI risk in a portfolio
  company is not in the model. It is in the human governance architecture that
  standard technical diligence never examines." Buyers ask for a documented **Human
  Authority Line** for every high-risk AI system, and which decisions are explicitly
  **non-delegable to AI.** [Falkovia]
- **Model dependency must be defended with artifacts, not assurances.** Sellers who
  survive this show three things: (1) a documented **model-provider redundancy
  plan**, (2) **gross-margin sensitivity tables under provider price shocks**, and
  (3) evidence the features work. [Falkovia, Valutico]
- **The haircut is real and non-negotiable.** Unaddressed regulatory, privacy, and
  technical AI risk draws a **15–30% valuation discount**, applied *before* other
  discounts stack. "Buyers do not negotiate vulnerability findings; they document
  them and reduce the price." [Valutico]
- **Regulatory clock — EU AI Act.** High-risk provisions begin applying in 2026,
  with major requirements activating around **August 2026** — directly relevant to a
  Slovenia/EU company (AIS's market). [Security Boulevard, governance-intelligence]
- **Operational risk sources:** data quality, model behavior, prompts, and
  third-party dependencies; limited visibility into training/decisions → compliance
  exposure, vendor lock-in, instability. [Security Boulevard, accuknox]

**Implication:** Pillar ⑤ (G3) is not just internal hygiene — its evidence (least-
privilege, RLS proofs, secret scanning, plus a Human Authority Line and a model-
provider redundancy plan) is a *valuation lever*. Criterion 8 (Security posture) and
the moat doc's AI-defenses section exist to convert §5 from a −15–30% haircut into a
diligence-fast-track. The package must include the authority line and the margin-
sensitivity-under-price-shock table by name.

Sources: [Security Boulevard — AI Due Diligence Checklist 2026](https://securityboulevard.com/2026/04/ai-due-diligence-checklist-2026-how-to-avoid-ai-implementation-failures-security-risks-and-cost-overruns/),
[Falkovia — The AI Risk Your Due Diligence Isn't Catching](https://falkovia.com/insights/ai-risk-due-diligence/),
[Valutico — AI Vulnerability in M&A Due Diligence: 2026 Buyer's Framework](https://valutico.com/ai-vulnerability-in-ma-due-diligence-a-2026-buyers-framework/),
[OneTrust — Responsible AI in 2026](https://www.onetrust.com/blog/responsible-ai-in-2026-a-3-step-guide-for-governance-that-scales/),
[AccuKnox — AI Security & Governance Guide 2026](https://accuknox.com/blog/ai-security-and-governance-guide),
[Governance Intelligence — AI & Compliance 2026](https://www.governance-intelligence.com/regulatory-compliance/how-ai-will-redefine-compliance-risk-and-governance-2026).

---

## §6 — What an investor-ready data room contains (2026)

Criterion structure and the `05-data-room-index.md` checklist come from here.

- **Volume:** a well-prepared room is **50–70 documents** across **8 categories**:
  corporate, financial, legal, IP, team, product/tech, cap table, tax. **Seed skews
  40–50 docs; Series A needs 60–70.** [Peony, Papermark]
- **By category (essentials):**
  - *Corporate/Legal:* Certificate of Incorporation, bylaws, amendments,
    Certificate of Good Standing, board minutes & consents, stockholder/voting
    agreements.
  - *Financials:* seed → pitch deck + basic financials + cap table + incorporation.
    Series A adds GAAP statements, customer contracts, **12–24 months** of income
    statement / balance sheet / cash-flow, revenue-stream and cost breakdown (so
    investors see margins and burn), and a **12–18 month** forecast with clear
    assumptions. *Not* a five-year fantasy model — Series A cares about near-term use
    of funds. [Papermark, ascentcfo]
  - *Cap table:* founders, option pool, investors, ownership %; clean Carta export
    if used.
  - *Team:* org chart, key-leader bios, roles this round funds, employment/contractor
    agreements, and **IP assignments (PIIAs)** signed by every employee & contractor
    (confirming the company owns the work).
  - *Product/Tech:* product summary & roadmap, current stage (MVP/beta/launched),
    what this round funds.
  - *Pitch:* the core narrative — problem, solution, market, business model,
    competition, team — crisp and data-backed.
- **Hygiene that signals competence:** update monthly; version files with dates
  (`2026-03_Financial_Model_v4.xlsx`, never `Financial Model FINAL.xlsx`); include a
  master doc explaining the structure. [Papermark, Visible]

**Implication:** `05-data-room-index.md` maps these 8 categories to *what this build
already produces* (product/tech summary, architecture narrative, metrics, security
evidence) vs. *what the founder/Ian must supply* (corporate, legal, cap table, tax).
That split is the honest boundary of what the protocol can and cannot generate.

Sources: [Peony — Startup Data Room Checklist (60-doc standard)](https://www.peony.ink/blog/startup-data-room-checklist),
[Papermark — Ultimate Startup Data Room Checklist 2026](https://www.papermark.com/blog/startup-data-room-checklist),
[Haven — Series A Data Room Checklist](https://www.usehaven.com/blog-posts/series-a-data-room-checklist),
[Visible.vc — Startup Data Room](https://visible.vc/blog/startup-data-room/),
[AscentCFO — Fundraising Data Room Checklist](https://ascentcfo.com/resources/what-should-be-in-our-fundraising-data-room-the-complete-startup-checklist/).

---

## §7 — How this maps to the DRAFT rubric

| Research § | Feeds rubric criterion | Key DRAFT bar it sets |
|---|---|---|
| §1 (frame) | 1 Team, whole rubric | team = named operator + built system as proof |
| §2 (moat) | 5 Moat, 7 AI-defensibility | ≥1 agent with described compounding loop |
| §3 (economics) | 4 Unit economics | LTV:CAC ≥3:1, GM ≥70%, payback ≤12mo |
| §4 (leverage) | 3 Traction, 4, 6 Scalability | revenue/employee headline; volume w/ flat headcount |
| §5 (AI diligence) | 8 Security posture, 7 | G3 green on 100% artifacts + authority line + provider redundancy |
| §6 (data room) | 05-data-room-index.md | 8 categories mapped: built vs. founder-supplied |

**Reminder of the boundary:** every number in §3, §4 is a *2026 public benchmark*, a
starting placeholder. Ian's own investor documentation replaces these with his deal-
tested bars, weights, stage calibration, and any AIS-specific criteria — at which
point the `DRAFT-RUBRIC` banner comes off and this doc is re-issued as a knowledge
PDF via `make-pdf`.
