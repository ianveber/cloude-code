# Investor-Readiness Criteria — Research Findings (2025–2026)

> Knowledge base for Pillar ④ (Investor-Readiness). This is the researched evidence
> behind the rubric in `../SKILL.md`. It becomes a knowledge PDF (via `make-pdf`) in
> the delivered protocol. Numbers are public benchmarks with a source and year on
> each — they are NOT Ian's own deal data (see the SKILL's `AWAITING IAN'S DOCS`).

## §0 — How to read this (and verification status)

Research dates: first pass 2026-07-17 (practitioner/blog tier); primary-source pass
2026-07-17 via the deep-research harness (VC-firm and benchmark-survey tier).

**Source tiers** are marked on each number:
- **[P]** Primary — a VC firm, benchmark survey, or institutional report (Bessemer,
  a16z, High Alpha/OpenView, SaaS Capital, Benchmarkit, Point Nine, Atomico, YC,
  CFA Institute). Trust these for the rubric bars.
- **[S]** Secondary — practitioner/CFO-firm analysis of primary data (CFO Advisors,
  CRV, Growth Unhinged, ICONIQ digests). Directionally reliable.
- **[B]** Blog/aggregator — a single non-authoritative source; treated as a lead, not
  a bar, and flagged where used.

**Verification note (honest):** the deep-research harness's automated 3-vote
adversarial verification pass did NOT complete — it hit a provider rate limit, so
every claim returned `0-0` (zero votes cast, not "refuted"). The numbers below are
therefore validated the older way: reputable primary sources, cross-referenced
against each other and against in-distribution knowledge. Where two primaries
disagree, both figures are shown. Do not treat any single **[B]** number as a bar.

**The through-line:** the market moved from "growth at all costs" to **efficient
growth**. Investors in 2025–2026 demand a company prove capital efficiency (burn
multiple, Rule of 40), not just growth — and for AI companies they additionally
scrutinize gross margin (inference cost) and defensibility (is the moat a data loop
or just model access?).

---

## §1 — The evaluation frame (2025–2026)

The lens is still **Team · Market · Product · Traction · Unit economics**, but the
bars moved and the order of scrutiny shifted:

- **Efficient growth is the mandate.** 94% of Bessemer's Cloud 100 were projected
  profitable by end-2025 [P — Bessemer Cloud 100 2025]. Efficiency is no longer a
  late-stage concern; 56% of *seed* investors and 83% of Series C+ investors call the
  **burn multiple** a critical evaluation metric [S — CFO Advisors 2025].
- **Efficiency is priced, not just praised.** Companies that are efficient (burn <1×,
  Rule of 40 ≥40) trade at **~2.3× the revenue multiple** of inefficient peers
  [P — Bessemer Cloud 100 2025].
- **"What's your moat?" is a defensibility test.** A strong answer is mechanical and
  compounding: *"every transaction trains our model; we have N cycles; a new entrant
  starts at zero."* Model access alone is not a moat (§6).
- **AI concentration raised the bar for everyone.** The overwhelming share of venture
  dollars now flows to AI, so non-AI and weak-AI companies face tighter scrutiny —
  and AI companies face *new* scrutiny (margin, defensibility, AI-washing; §5–6).

**Rubric implication:** Team (crit 1) and Moat (crit 5/7) must be concrete, and the
capital-efficiency criteria (crit 4) are now first-order, not a Series-B afterthought.

---

## §2 — Unit-economics benchmarks, US (2025)

Seeds the rubric's criterion 4. Primary source is **Benchmarkit 2025** (Ray Rike's
survey, ~1,000+ B2B SaaS companies), cross-checked against High Alpha and CFO firms.

| Metric | Benchmark | Source |
|---|---|---|
| **New CAC ratio** (S&M $ per $1 new ARR) | **$2.00** (up 14% in 2024) | [P] Benchmarkit 2025 |
| **Expansion CAC** ($ per $1 expansion ARR) | **$1.00** | [P] Benchmarkit 2025 |
| **Median LTV:CAC** | **3.6 : 1** (classic healthy bar ≥3:1; top quartile 5:1+) | [P] Benchmarkit 2025 |
| **CAC payback** | healthy **<15 months**; Series A **12–15 mo** (AI: 12–18 mo) | [S] SaaS Mag 2026; CFO Advisors 2026; CRV |
| **Gross margin (traditional SaaS)** | **>75%** (75–85% healthy) | [S] CFO Advisors 2026; SaaS Mag 2026 |
| **Gross margin (AI / LLM-native)** | **~45–65%** and climbing — see §5 | [P] Bessemer State of AI 2025; a16z |
| **NRR (net revenue retention)** | **~101%** median (compressed); >100% wanted, *improving* is the tell | [P] Benchmarkit 2025 |
| **Expansion as % of new ARR** | **~40%** | [P] Benchmarkit 2025 |

The single most investor-legible AI metric is **revenue per employee** — see §5.

---

## §3 — Growth expectations by stage (the CAGR question)

"CAGR by stage" for private startups = **ARR growth rate by ARR band.** Primary
sources: SaaS Capital (1,000+ co survey), High Alpha/OpenView, Bessemer, Point Nine.

- **Market median has compressed:** median private-B2B-SaaS ARR growth **25% in 2025**
  (down from 30% in 2023); bootstrapped **23%** vs equity-backed **25%** [P — SaaS
  Capital 2025]. "Efficient growth" replaced "growth at all costs."
- **Growth scales down with size** (Bessemer's good/better/best ladder, $1M→$100M):
  the bar is very high at small ARR and eases as you scale [P — Bessemer, Scaling to
  $100M]. Early-stage venture-grade is roughly:
  - **Seed → Series A:** Point Nine's 2025 AI-first napkin puts Series A at **2–3×
    YoY** growth off **$0.5–2.5M ARR** [P — Point Nine 2025].
  - Later bands step down from triple-digit to the ~25% median as ARR grows.
- **Retention is a growth multiplier investors price:** moving NRR from the 90s into
  the 100s adds **~5 percentage points** of growth; the top-NRR cohort grows **83%
  above** the median [P — SaaS Capital 2025].
- **AI-native cohort grows faster:** AI-natives grow **~3× faster** than traditional
  SaaS at the same stage (with a margin trade-off, §5) [S — Growth Unhinged / High
  Alpha 2025].

---

## §4 — ROI / capital-efficiency metrics (what "prove efficiency" means)

The efficiency bars investors now demand, **stage-calibrated**. Primary framing:
Bessemer (Rule of X, Cloud 100); stage burn multiples: CFO Advisors on Sacks' metric.

**Burn multiple** (net burn ÷ net new ARR — lower is better):

| Stage | Benchmark burn multiple | Source |
|---|---|---|
| Pre-seed / Seed | **2.5–3.4×** (average) | [S] CFO Advisors 2025 |
| Series A | **≤1.2×** (median ~1.2×) | [S] CFO Advisors 2025/2026 |
| Growth | **~1.4×** | [S] CFO Advisors 2025 |
| >$100M ARR | **≤1.0×** | [S] CFO Advisors 2025 |

**Rule of 40 → Rule of X:** growth% + FCF-margin% > 40 is still the line, but Bessemer
now weights **growth ~2× vs FCF margin** in valuation (the "Rule of X"). The payoff is
large: a company **>40%** trades near **9.4× revenue** vs **3.5×** for one below 20%
[P — Bessemer, The Rule of X]. Efficient companies overall trade at **~2.3×** the
multiple of inefficient peers [P — Bessemer Cloud 100 2025].

**Payback / margin** roll up from §2: CAC payback <15mo, gross margin >75% (traditional)
or the AI margin path in §5.

---

## §5 — The AI-native economics reality (the margin trap + the leverage story)

This is the section that matters most for a company **this protocol builds**, because
it is AI-run by design.

**The gross-margin caveat (the trap):** AI/LLM-native companies do NOT hit the 80–90%
cloud-era gross-margin ceiling, because inference/compute is a real COGS.
- Bessemer pegs **LLM-native gross margins ~65%** vs the 80–90% cloud ceiling
  [P — Bessemer State of AI 2025].
- a16z's canonical framing: AI companies run **50–60% gross margins** vs 60–80%+ SaaS,
  due to inference COGS, weaker scale economies, and thinner tech moats
  [P — a16z, The New Business of AI].
- But it is **climbing:** ICONIQ tracks AI-native GM **41% (2024) → 45% (2025) → 52%
  projected (2026)**, with inference ~23% of revenue at the scaling stage
  [S — ICONIQ via Tanay Jaipuria].
- CRV notes AI-native companies get **extra burn-multiple scrutiny** because variable
  inference cost inflates apparent software revenue [P — CRV investment criteria].

**Rubric implication:** the rubric must NOT penalize an AI company for a 55–65% gross
margin (that is normal), but it MUST demand the **margin-expansion path** (caching,
smaller/distilled models, routing, on-prem, human-in-loop volume control) and a
**margin-sensitivity table under a provider price shock** (§7). A flat "GM ≥75%" bar
is wrong for this category.

**The leverage story (the premium):** the offsetting, investor-legible upside is
operating leverage — **revenue per employee.** AI-native firms lead on it; the build
this protocol produces (hours removed, throughput added) is literally the proof. Frame
the cost-taken-out delta as gross-margin lift + revenue/employee, the headline metric
of the AI-native category.

**The valuation premium is real and quantified (Europe):** AI companies carry a
**~20% valuation premium at Seed/Series A, ~50% at Series B, and ~2.6× at Series C**
[P — Atomico State of European Tech 2025, via Sifted].

---

## §6 — AI moat / defensibility, and AI-washing red flags

**What is (and isn't) a moat** — the 2025–2026 consensus, corrected:
- **Model access is NOT a moat.** AI compresses time-to-build, so a frontier-model
  feature is matched fast. Durable AI companies defend on **memory/context, workflow
  depth, and compounding data** [P — Bessemer State of AI 2025]; tech moats alone are
  thin [P — a16z].
- **Static proprietary data is NOT enough either.** The moat is a **data LOOP**: every
  run captures a proprietary signal (corrections, exceptions, labeled outcomes) that
  improves the next run; a new entrant starts at zero on the accrued cycles.
- **Workflow depth + switching cost** and **domain specialization** are what make the
  product hard to rip out.

**AI-washing red flags** (the "unattractiveness" checklist — what makes investors run):
- CFA Institute's 2025 report catalogues the diligence questions that expose AI-washing:
  *what algorithms exactly, what training data, how is performance measured, who leads
  AI* [P — CFA Institute 2025]. A company that can't answer crisply is a flag.
- The **Builder.ai collapse** is the cautionary post-mortem: the fix is
  **quantified automation-vs-human-input metrics, training-dataset traceability, and
  third-party verification** of the proprietary AI [S — Vaultinum]. For a protocol
  whose pitch is "AI-run," being able to *show* the automation ratio per process
  (which the pillar-② scan literally measures) is the anti-AI-washing proof.

**Rubric implication:** crit 5/7 must, per agent, name the loop (signal→store→feedback→
cycles), the switching cost (integration depth), and argue replicate-time from loop
age — and the package should pre-empt AI-washing with the measured automation ratio.

---

## §7 — AI technical due diligence: the discount to avoid

For a company whose whole pitch is AI-run ops, DD is where the package earns a premium
or takes a haircut. AI-specific DD items investors and acquirers now probe
[P — Promise Legal 2026; Fast Data Science]:
- **Training-data provenance & licensing** (litigation risk), **model ownership**,
  **AI regulatory exposure**, **vendor/model dependencies**, contract protections.
- Technical maturity: **model validation** (accuracy/precision/recall), **bias/ethics
  audits**, **MLOps maturity** (versioning, deployment, monitoring).
- **Governance, not the model, is the overlooked gap.** Sellers who survive show a
  documented **Human Authority Line** (which decisions are non-delegable to AI), a
  **model-provider redundancy plan**, and **gross-margin sensitivity under a provider
  price shock**.
- **EU AI Act** high-risk provisions phase in through 2026 — directly relevant to a
  Slovenia/EU company (AIS's market). Governed, auditable AI is a diligence
  fast-track, not overhead.

**Rubric implication:** Pillar ⑤ (G3) evidence is a **valuation lever** — least-
privilege, RLS proofs, secret scanning, plus the Human Authority Line and the
provider-redundancy + margin-sensitivity artifacts. Criterion 8 exists to convert
this section from a haircut into a premium.

---

## §8 — The investor-ready data room (due diligence contents)

Criterion structure and `05-data-room-index.md` come from here. Primary source: the
**YC Series A Diligence Checklist** (Jason Kwon, GC of YC Continuity, from hundreds of
financings) [P]; stage-graded by Kruze Consulting [S]; volume/format by Peony [B].

- **YC's canonical Series A contents:** corporate records, cap table, IP assignments,
  material contracts, financials. YC states assembling this *before* the term sheet
  cuts up to a week off closing [P — YC].
- **Stage-graded** (Kruze): pre-seed/seed diligence is light (basic model, use of
  funds, burn, legal basics); Series A adds GAAP statements, 12–24 months of P&L /
  balance sheet / cash-flow, cohort churn, and a 12–18 month forecast; Series B expects
  audit-readiness [S — Kruze].
- **8 standard categories:** corporate · financial · legal/contracts · IP · team/HR ·
  product/metrics · cap table · tax. **Missing IP assignments (PIIAs) is the #1 legal
  defect** that stalls DD [B — Peony; corroborated by YC's emphasis on IP assignments].
- **Volume** grows with stage (seed lighter, Series A fuller). *Caveat:* the specific
  "60-document / 68% of failed deals / VCs spend 2–3 hours" figures come from a single
  blog **[B]** and did not survive to verification — use the **structure**, not those
  statistics, as a bar.
- **Hygiene that signals competence:** update monthly; date-version files
  (`2026-03_Financial_Model_v4.xlsx`, never `…FINAL.xlsx`); include a master index.

**Rubric implication:** `05-data-room-index.md` maps the 8 categories to *what this
build already produces* (product/tech summary, architecture narrative, metrics,
security evidence, the AI automation-ratio) vs. *what the founder/Ian must supply*
(corporate, legal, cap table, tax). That split is the honest boundary of the protocol.

---

## §9 — US vs Europe (the geography delta a Slovenian company faces)

AIS builds EU companies, so the European bars matter more than the US ones.

- **European capital is smaller and rounds are fewer-but-larger:** ~$44bn raised in
  Europe in 2025; median seed/Series A round sizes climbed **23–25%**; US companies are
  **2× as likely** to raise $50M+; AI captured **$14B in Europe vs $146B in the US**
  [P — Atomico State of European Tech 2025].
- **European round bars (Point Nine 2025 AI-first napkin, a European fund):**
  - **Seed:** $0–1M ARR, **$5–15M pre-money**, **$1–4M** round.
  - **Series A:** $0.5–2.5M ARR with **2–3× YoY** growth, **$25–75M pre-money**,
    **$6–18M** round [P — Point Nine 2025].
- **European valuations trail the US** by roughly **25–30% at every stage**; median
  pre-seed/seed SaaS valuation ~**€5.1M**; ~**21% dilution** at seed
  [B/S — Development Corporate 2025 — cross-check against Atomico before quoting].
- **European KPI norms by ARR band:** Serena × HubSpot's 2025 survey (800+ European
  SaaS) buckets growth/CAC/retention/headcount by ARR band (<$2M, $2–5M, $5–10M, >$10M)
  [P — Serena × HubSpot 2025] — the European counterpart to High Alpha/Bessemer.

**Rubric implication:** stage bars must carry a US/EU column (or default to EU for AIS
engagements). The AI valuation premium (§5) is *European-sourced*, which is the good
news for AIS-built AI companies.

---

## §10 — Mapping to the rubric (stage-calibrated)

| Research § | Rubric criterion | The bar it sets |
|---|---|---|
| §1 frame | 1 Team, whole rubric | named operator + built system as proof; efficiency first-order |
| §2 economics | 4 Unit economics | CAC $2.00/$1 ARR, LTV:CAC ≥3.6:1, payback <15mo |
| §3 growth | 3 Traction | median 25%; Series A 2–3× YoY; NRR>100% adds ~5pp |
| §4 efficiency | 4 + capital efficiency | burn multiple by stage (2.5–3.4× seed → ≤1.2× A); Rule of 40 ≥40 |
| §5 AI economics | 4 + 6 Scalability | AI GM 45–65% (do not penalize) + margin-expansion path; revenue/employee headline; ~20% AI premium |
| §6 moat + AI-washing | 5 Moat, 7 AI-defensibility | ≥1 agent with a described compounding loop; measured automation ratio |
| §7 AI DD | 8 Security posture, 7 | G3 green 100% + Human Authority Line + provider redundancy + margin-sensitivity |
| §8 data room | `05-data-room-index.md` | YC 8-category contents; built vs founder-supplied split |
| §9 geography | all stage bars | EU bars (Point Nine/Atomico/Serena) as default for AIS |

**The boundary (unchanged):** every number here is a 2025–2026 public benchmark — a
calibrated placeholder. Ian's own investor documentation replaces these with his
deal-tested bars, weights, stage/geography targeting, and any AIS-specific criteria;
at that point the `DRAFT-RUBRIC` banner comes off and this doc re-issues as a PDF.

---

## Sources (primary tier first)

**Primary [P]:**
- Bessemer Venture Partners — Scaling to $100 Million; The Cloud 100 Benchmarks 2025;
  The Rule of X; The State of AI 2025. bvp.com/atlas
- a16z — The New Business of AI (gross-margin framework). a16z.com
- High Alpha (successor to OpenView) — 2025 SaaS Benchmarks Report. highalpha.com
- SaaS Capital — 2025 Private B2B SaaS Growth Rate Benchmarks. saas-capital.com
- Benchmarkit (Ray Rike) — 2025 SaaS Performance Metrics. benchmarkit.ai
- Point Nine — The AI-first SaaS Funding Napkin (2025). medium.com/point-nine-news
- Atomico — State of European Tech 2025 (Investment Trends). stateofeuropeantech.com
- Serena × HubSpot — European SaaS Benchmark 2025. offers.hubspot.com
- Y Combinator — Series A Diligence Checklist (Jason Kwon). ycombinator.com/library
- CFA Institute — AI Washing report (2025). rpc.cfainstitute.org
- CRV — B2B SaaS AI Startup Investment Criteria. crv.com
- Promise Legal — AI M&A Due Diligence Checklist (2026); Fast Data Science — AI DD.

**Secondary [S]:** CFO Advisors (2025/2026 burn-multiple & Series A KPI benchmarks);
Growth Unhinged / Kyle Poyar (2025 High Alpha analysis); ICONIQ via Tanay Jaipuria
(AI gross-margin trend); SaaS Mag (2026 capital-efficiency roundup); Sifted (Atomico
digest); Kruze Consulting (stage-graded DD checklist); Vaultinum (Builder.ai post-mortem).

**Blog/aggregator [B] (leads, not bars):** Peony (60-doc data-room stats);
Development Corporate (European valuation medians). Verify against a primary before quoting.
