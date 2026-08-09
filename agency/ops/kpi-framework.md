# KPI Framework

Three tiers of KPIs. Each tier serves a different decision loop. Each metric has: a definition, a measurement cadence, a target, a failure threshold, and a named owner.

This is the metrics layer AIS operates on. If a metric isn't here, we don't measure it (yet) — and we should be deliberate about adding new ones, because metrics that aren't reviewed become decoration.

---

## Tier 1 — Agency health KPIs

The metrics that tell us whether AIS is operating as a viable business.

### Revenue (monthly + trailing-12-month)

**Definition:** total revenue recognized in the period (build fees + operate retainer + pass-through).

**Cadence:** tracked monthly, reviewed monthly in cross-cofounder review, reported quarterly.

**Targets (rolling 12-month, by quarter):**

| Quarter | TTM revenue target |
|---|---|
| Q3 2026 | €100K |
| Q4 2026 | €300K |
| Q2 2027 | €800K |
| Q4 2027 | €1.5M |
| Q4 2028 | €2.5M |

**Failure threshold:** TTM revenue >20% below target for 2 consecutive quarters triggers strategic review.

**Owner:** Nejc (legal / financial cofounder lead, owns the books)

---

### Pipeline health

**Definition:** count of qualified discoveries per month, proposals sent, engagements signed; conversion rates between stages.

**Cadence:** tracked weekly, reviewed monthly.

**Targets (at steady state, target Q4 2026 onwards):**

| Metric | Target/month |
|---|---|
| Qualified inbound conversations | 8–12 |
| Discovery calls held | 6–10 |
| Advanced to scoping | 3–5 |
| Proposals sent | 2–4 |
| SOWs signed | 1–2 |
| Discovery → SOW conversion rate | 15–25% |
| Proposal → SOW conversion rate | >40% |

**Failure thresholds:**
- Qualified inbound <4/month for 2 months = acquisition system not working; investigate
- Proposal → SOW conversion <30% = qualifying too loosely; tighten discovery

**Owner:** lead cofounder per vertical (cross-vertical aggregate by Anej)

---

### Active engagement count

**Definition:** count of engagements currently in build phase + operate phase, by vertical.

**Cadence:** updated weekly, reviewed monthly.

**Targets (active engagements):**

| Quarter | Target active engagements |
|---|---|
| Q3 2026 | 2–3 |
| Q4 2026 | 4–6 |
| Q2 2027 | 6–10 |
| Q4 2027 | 10–15 |
| Q4 2028 | 15–25 |

**Failure threshold:** active count declining over 2 consecutive quarters at any growth-target stage = signal of either churn or acquisition failure (or both).

**Owner:** Anej (delivery overview)

---

### Operate-phase retention rate

**Definition:** % of operate-phase engagements still active 12 months after operate-phase start.

**Cadence:** measured continuously, reported quarterly.

**Target:** >85%

**Failure threshold:** <70% = high-churn signal; strategic-level review required.

**Owner:** lead cofounder per engagement (aggregate by Anej)

---

### Cofounder utilization

**Definition:** % of each cofounder's working time spent in each category: build delivery / operate delivery / acquisition / admin / strategy.

**Cadence:** self-tracked weekly, reviewed monthly.

**Target distribution (steady state, per cofounder per week):**

| Category | Target % |
|---|---|
| Build phase delivery (active engagements) | 35–45% |
| Operate phase delivery (active engagements) | 15–20% |
| Acquisition (outbound + content + partnerships) | 10–15% |
| Admin (legal, finance, ops) | 5–10% |
| Strategy / repo work / IP development | 10–15% |
| Personal / off | 10–15% |

**Failure thresholds:**
- Build delivery >55% sustained = over-loaded; capacity issue; need to slow pipeline or hire
- Acquisition <5% sustained = pipeline will dry; over-focused on delivery
- Admin >15% sustained = systems not built yet; needs investment in automation

**Owner:** each cofounder self-reports; aggregate review in monthly cross-cofounder meeting

---

### Cofounder satisfaction

**Definition:** 1–10 self-rated score on energy + alignment with the agency direction.

**Cadence:** quarterly, in cross-cofounder meeting; private input then shared.

**Target:** each cofounder >7

**Failure threshold:** any cofounder <5 sustained for 2 quarters = strategic conversation required (this is people-level, not systems-level)

**Owner:** each cofounder self-reports; collective ownership of the discussion

---

### Cash position

**Definition:** months of operating runway at current burn rate (cofounder draws + tooling + admin).

**Cadence:** updated monthly.

**Target:** >6 months runway at steady state.

**Failure threshold:** <3 months runway = strategic intervention required (accelerate cash collection, pause discretionary spend, in extreme cases reduce cofounder draws)

**Owner:** Nejc

---

## Tier 2 — Delivery quality KPIs

The metrics that tell us whether the engagements we ship are operating as designed.

### On-time engagement delivery rate

**Definition:** % of engagements where build phase completes within the SOW-stated build phase target date (no more than 2-week slip).

**Cadence:** measured per engagement at validation; aggregated quarterly.

**Target:** >75%

**Failure threshold:** <50% = systemic build-phase delivery issue; investigate root causes (scoping inaccurate, cofounder over-committed, integration patterns underestimating complexity)

**Owner:** lead cofounder per engagement; aggregate by Anej

---

### Validation pass rate

**Definition:** % of engagements that pass validation phase on first attempt (no re-validation required).

**Cadence:** measured per engagement; aggregated quarterly.

**Target:** >70% first-pass

**Failure threshold:** <50% first-pass = build phase is shipping incomplete work; tighten build checklist or extend build phase template

**Owner:** lead cofounder per engagement; aggregate by Anej

---

### Sampling completion rate (client-side)

**Definition:** % of operate-phase engagements where client-side function owner completes the weekly sampling protocol.

**Cadence:** measured weekly per engagement.

**Target:** >90%

**Failure threshold:** <70% = operator buy-in eroding; cofounder check-in with affected clients

**Owner:** lead cofounder per engagement

---

### Voice locking drift score (aggregate)

**Definition:** average drift score across all active engagements (per `agents/16-sample-voice-locking.md`).

**Cadence:** measured monthly.

**Target:** within ±10% of baseline across all engagements

**Failure threshold:** any single engagement drifting >25% = trigger voice refresh; multiple engagements drifting = systemic Acquirer/Closer prompt issue

**Owner:** Ian (technical brain owns the voice infrastructure)

---

### Escalation count + severity distribution

**Definition:** count of P1 / P2 / P3 / P4 escalations per engagement per month, by severity.

**Cadence:** measured weekly, reviewed monthly.

**Targets per engagement per month:**

| Severity | Healthy rate |
|---|---|
| P1 | 0–1 |
| P2 | 0–2 |
| P3 | 1–4 |
| P4 | 0–4 |

**Failure thresholds:**
- P1 >2 in a month = systemic issue requiring immediate retrospective
- P2 >5 in a month = quality issue, possibly need to roll back to internal autonomy mode

**Owner:** lead cofounder per engagement; pattern review across engagements by Anej

---

### Per-engagement contribution margin

**Definition:** revenue minus direct costs (cofounder time at imputed rate + inference + tooling + contractor) divided by revenue, per engagement.

**Cadence:** measured monthly per engagement; reviewed monthly with internal P&L review.

**Target:** >65% per engagement; refuse new engagements that project below 55%

**Failure threshold:** any engagement <55% triggers re-pricing conversation or scope reduction within 60 days; persistent <55% = terminate

**Owner:** Nejc (financial owner) + lead cofounder per engagement

---

### Handoff quality

**Definition:** post-handoff client satisfaction with documentation completeness and operability handoff, measured at 30 days post operate-phase start.

**Cadence:** measured per engagement.

**Target:** >4/5 average

**Failure threshold:** <3.5/5 = handoff template needs revision; specific gaps documented

**Owner:** lead cofounder per engagement

---

## Tier 3 — Client outcome KPIs

The metrics that tell us whether clients are getting what we promised.

### Per-engagement anchor metric performance

**Definition:** the primary success metric stated in the engagement's proposal (SOW Section 5), tracked against the conservative / base / stretch case projections.

**Cadence:** measured monthly per engagement; reviewed in monthly client review + quarterly QBR.

**Target:** >base case at 12 months operate phase

**Failure threshold:** <conservative case at 6 months = corrective plan required; <conservative case at 12 months = engagement renegotiation conversation

**Owner:** lead cofounder per engagement

---

### Client NPS

**Definition:** "On a scale of 0–10, how likely are you to recommend AIS to a peer running a similar function?" — measured at engagement milestones.

**Cadence:** quarterly per client.

**Target:** >50 (average across active clients)

**Failure threshold:** <30 = systemic relationship issue; cofounder intervention

**Owner:** lead cofounder per engagement; aggregate Anej

---

### Expansion revenue rate

**Definition:** % of active clients who have added scope (additional agent, additional function) since their original engagement.

**Cadence:** measured continuously, reported quarterly.

**Target:** >20% of clients expand within 18 months

**Failure threshold:** <10% = either Retention Agent isn't surfacing expansion triggers, or client outcomes aren't strong enough to justify expansion conversations

**Owner:** Retention Agent (per `agents/retention-agent.md`) + lead cofounder per engagement

---

### Off-ramp election rate

**Definition:** % of clients reaching 12-month operate-phase mark who elect to off-ramp (vs continue operate or expand).

**Cadence:** measured continuously, reviewed quarterly.

**Target:** 15–35% — too high suggests we're disposable; too low suggests we're indispensable (which can be good but limits client autonomy)

**Failure threshold:** >60% off-ramping = clients reaching maturity quickly without needing ongoing AIS; consider whether operate retainer is justified for the value delivered after month 12

**Owner:** Anej (delivery / retention overview)

---

### Case study production rate

**Definition:** count of published case studies per quarter.

**Cadence:** measured quarterly.

**Target:** 2–3 case studies/year (steady state)

**Failure threshold:** zero case studies for 12 months = either no eligible engagements (engagement quality issue) or eligible engagements aren't being converted into case studies (production capacity issue)

**Owner:** lead cofounder per case study (rotated by engagement)

---

## How metrics get reviewed

### Weekly (each cofounder, ~10 min)
- Check tier 1: pipeline health, cofounder utilization
- Check tier 2: escalation count, sampling completion for own engagements
- Flag any threshold breaches

### Monthly (cross-cofounder, ~60 min, first Monday)
- Tier 1 full review: revenue, pipeline, active engagements, retention, utilization, cofounder satisfaction (informal check-in), cash
- Tier 2 spot-check: validation pass rate, contribution margin trends, escalation patterns
- Tier 3 spot-check: anchor metric performance against projection
- Action items captured

### Quarterly (cross-cofounder + strategy session, ~3 hours, first week of quarter)
- All three tiers full review
- Trends analysis (quarter-over-quarter, year-over-year where applicable)
- Strategic adjustments based on patterns
- KPI framework itself reviewed (are we measuring the right things? add / remove metrics deliberately)
- Targets recalibrated for the upcoming quarter if needed

### Annually (strategic offsite, 2 days)
- Full KPI retrospective
- Long-term trend review
- Strategic alignment with escape-velocity targets (per `ops/escape-velocity-targets.md`)
- KPI framework overhaul if needed (rare but appropriate sometimes)

---

## Anti-patterns to avoid

### Metric inflation

Adding metrics every quarter without removing any. Over time, metrics become decorative — too many to review, none actually driving decisions. Discipline: any new metric added means a current metric reviewed for removal.

### Vanity metrics

Metrics that look good but don't predict business outcomes. Examples to avoid:
- Total website visitors (we sell to a small cohort; volume doesn't matter)
- Total LinkedIn followers (engagement matters more than count)
- Total content pieces published (citation rate matters more than volume)
- Total prospects in pipeline (qualified count matters more than total)

### Aggregate-hiding-details

Aggregate metrics that hide per-engagement reality. Example: aggregate contribution margin of 65% can hide one engagement at 80% subsidizing another at 35%. Always check per-engagement before celebrating aggregate.

### Lagging-only metrics

Metrics that tell us what already happened but don't predict what's coming. Counter-balance with leading indicators (pipeline health, voice drift, sampling completion all predict future revenue / retention / quality).

### Surveys-without-action

Client NPS surveys that get reviewed but never drive specific corrective action. Each survey result should produce either: confirmation we're on track, or a specific intervention for the responding client.

---

## When metrics don't fit

Sometimes the right call is to violate a metric target. The KPI framework is a guide, not a contract.

Examples:
- Accepting an engagement at 60% contribution margin (below 65% target) because it's the first engagement in a new vertical that justifies the discount for case-study rights
- Allowing cofounder utilization at 50% delivery (above 45% target) for one quarter to ship a critical engagement
- Permitting voice drift >10% on one engagement temporarily while voice owner is unavailable for sample collection

Discipline: name the violation, document the reasoning, set a date to revert. Don't let exceptions become the new baseline.
