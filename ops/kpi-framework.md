# KPI Framework

Three layers of metrics: agency health (are we a viable business?), delivery quality (are we building well?), and client outcomes (are the agent systems working?). Each layer has leading and lagging indicators. Lagging indicators tell you what happened; leading indicators tell you what's about to happen.

Review cadence: daily (nothing), weekly (delivery and pipeline), monthly (full review of all three layers), quarterly (trend analysis and strategic decisions).

---

## Layer 1 — Agency health

These metrics tell you whether the agency is financially viable and growing. Most of them are monthly.

### Revenue metrics

**Monthly Recurring Revenue (MRR)**
Definition: Tier 3 retainer revenue only. Build fees are one-time; they don't count as MRR.
Target: Grow by at least one new retainer per quarter once the first three Tier 1 engagements are complete.
Why it matters: MRR is the stability layer under build fee volatility. A month with no new build starts doesn't threaten the business if MRR covers operating costs.

**Monthly Build Revenue**
Definition: Milestone payments received in the month (not invoiced — received). Use cash basis.
Track: Trailing 3-month average to smooth the milestone payment lumps.
Target (Year 1): $25K–$40K/month average after the first two engagements are complete.

**Pipeline Value**
Definition: Total contract value of all proposals outstanding (not yet signed). Apply a probability weight: 70% for proposals with verbal acceptance pending paperwork, 40% for proposals sent but not yet discussed, 15% for discovery complete but proposal not yet sent.
Review: Weekly. This is the leading indicator for build revenue 6–8 weeks out.

**Revenue Concentration**
Definition: Percentage of total revenue from the largest single client.
Target: No single client should exceed 40% of total revenue once you have more than 2 active engagements. Above 40% is a fragility risk.
Why it matters: Losing one large client shouldn't threaten the business.

**Accounts Receivable Aging**
Definition: Total outstanding invoices by age: 0–15 days, 16–30 days, 31–60 days, 60+ days.
Target: Nothing in 60+ days. Anything in 31–60 days has a follow-up in progress.
Action trigger: Any invoice past 30 days without a response from the client gets a phone call, not just an email.

### Pipeline metrics

**Discovery-to-Proposal Rate**
Definition: % of discovery calls that result in a proposal being sent within 10 business days.
Target: ≥ 70%. Below 70% means either discovery is surfacing too many unqualified prospects or proposals are taking too long.

**Proposal-to-SOW Rate**
Definition: % of sent proposals that result in a signed SOW.
Target: ≥ 50% once the agency has 3+ completed engagements as reference points. In year one, 35–45% is realistic.
Low rate signals: pricing is out of range, proposal isn't specific enough, wrong ICP, qualification is too loose.

**Average Time to SOW**
Definition: Calendar days from proposal sent to SOW signed.
Target: ≤ 14 days. Deals that take more than 30 days to close after a proposal almost never close on the original terms.

**Pipeline Coverage Ratio**
Definition: Weighted pipeline value ÷ target monthly build revenue × 3 (months of runway needed).
Target: ≥ 2.5x. If target monthly build revenue is $30K and you need 3 months of coverage, you want $225K+ in weighted pipeline at all times.
Below 2.5x: insufficient outbound activity or too many stalled deals. Diagnose which.

### Capacity metrics

**Active Engagements**
Definition: Number of engagements currently in Phase 1–4 (not in post-launch support window, not retainer-only).
Target: Depends on team size. Solo project lead: max 2 simultaneous active builds. Each additional project lead adds 2 capacity.

**Utilization Rate**
Definition: Hours spent on billable engagement work ÷ available working hours. Include spec, build, integration, documentation, client calls. Exclude sales, internal operations, playbook work.
Target: 65–75%. Below 65% means underbooked; above 80% means the pipeline is creating a quality risk.

---

## Layer 2 — Delivery quality

These metrics tell you whether we're building and delivering well. They are leading indicators of client satisfaction and referral volume.

### Timeline adherence

**On-Time Milestone Rate**
Definition: % of milestones delivered on or before the committed date.
Target: ≥ 80%. Some slippage is normal; chronic slippage is a scoping problem.
Measure: Per engagement. Track which milestone type slips most — if it's always Phase 1 (specs), the discovery-to-spec process is broken. If it's always Phase 3 (write-access), the read-only phase is being rushed.

**Client-Caused Delay Rate**
Definition: % of milestone delays attributable to client delays (late access, late spec review, late sign-off) vs. Agency delays.
Track separately from on-time milestone rate. This is not about blame — it's about identifying where the onboarding checklist needs tightening.
Action trigger: If more than 40% of delays are client-caused, the onboarding checklist and SOW responsibility section need stronger language.

### Scope discipline

**Change Order Rate**
Definition: % of engagements that require a written change order.
Target: ≤ 30%. If more than 30% of engagements need a change order, scoping is systematically off.
Note: Change orders are not failures — sometimes client needs genuinely change. The metric flags when the original scope was unrealistic.

**Scope Creep Incidents**
Definition: Instances where work outside the SOW was done without a signed change order.
Target: 0. Every instance is a post-mortem. Why did we do out-of-scope work? Goodwill? Pressure? Ambiguous SOW language? Fix the root cause.

### Technical quality

**Unhandled Failure Rate at Launch**
Definition: Percentage of production deployments that have at least one unhandled failure (silent skip, crash, output produced without error flag) in the first 14 days.
Target: 0%. Any unhandled failure means the exception handling section of the spec was incomplete or the build didn't implement it correctly.

**Read-Only Phase Pass Rate (first attempt)**
Definition: % of agents that pass the read-only sign-off criteria on the first evaluation attempt.
Target: ≥ 85%. Below 85% means agent specs are being approved before they're ready, or build quality is inconsistent.

**Post-Launch Bug Rate**
Definition: Number of bugs filed by clients during the 30-day support window, per engagement.
Target: ≤ 3 bugs per engagement. Above 3 means the write-access monitoring phase was insufficient.
Distinguish: bugs in scope (the agent does the wrong thing on an input it was specced to handle) vs. out-of-scope issues (third-party API changes, new input types).

### Handoff quality

**Independent Operation Test Pass Rate (first attempt)**
Definition: % of handoff sessions where the client's ops team passes the 3-day independent operation test without escalating to the project lead.
Target: ≥ 80%.
Below 80% signals: operator documentation is weak, handoff session didn't cover the right material, or the client's ops team didn't have the right person in the room.

**Retainer Conversion Rate**
Definition: % of completed Tier 1 or Tier 2 engagements that convert to a Tier 3 retainer within 90 days of handoff.
Target: ≥ 40% once 5+ engagements are complete.
This is a delivery quality signal as much as a sales signal. Clients who experienced a clean build and a confident handoff convert to retainers. Clients who had a rocky engagement don't.

---

## Layer 3 — Client outcomes

These are the metrics that measure whether the agent systems are actually working for clients. Measuring these requires that we instrument every deployed system and review outputs — either during the post-launch support window or in the context of a Tier 3 retainer.

For non-retainer clients (Tier 1/2 post-handoff), collect these at the 30-day and 90-day marks via a structured check-in.

### Per-engagement outcome metrics

Each vertical playbook defines the specific metrics for its clusters. The universal baseline:

**Workflow Time Recovered**
Definition: Staff hours per week on the target workflow before vs. after deployment.
Measurement: Client self-report at 30 and 90 days, ideally corroborated by output log volume.
Target: ≥ 60% reduction for fully automated clusters.

**Agent Accuracy Rate**
Definition: % of outputs that are correct (from evaluation rubric Section 1.1).
Target: ≥ 95% sustained.
Below 95% at 90 days: the agent has drifted or input patterns have shifted. Flag for retainer improvement work.

**Exception Rate**
Definition: % of inputs routed to human review.
Target: ≤ 15% at 90 days. Higher in the first 30 days is normal as edge cases surface.
Steadily rising exception rate at 90+ days: input distribution is shifting, agent needs retraining or rule updates.

**Cluster-specific outcome metric**
The dollar-value metric from the discovery value case. Examples:
- Dental pre-auth: average days to authorization before vs. after
- Dental treatment plan follow-up: % of unconverted consultations that scheduled within 30 days
- Legal document assembly: hours per matter before vs. after
- Legal status communications: inbound status call volume before vs. after
- Aesthetics consultation follow-up: consultation-to-booking rate before vs. after

Collect this at 90 days. If the agency doesn't collect these numbers, it can't compound the playbooks with real evidence, and it can't build case studies.

### Portfolio-level outcome tracking

**Average ROI (client-reported, 90 days)**
Definition: Client-estimated annual value recovered ÷ engagement fee.
Target: ≥ 3x. If the average is below 3x, either the value cases were over-stated in proposals, the systems aren't performing, or we're not collecting the data to demonstrate the value.

**Client Satisfaction (post-handoff NPS equivalent)**
A simple 1-question check-in at 30 days: "On a scale of 1–10, how confident are you that this system is delivering the value we discussed in the proposal?"
Target average: ≥ 8.
Below 7: the gap between expected and experienced value is too large. Investigate whether it's a delivery quality issue, an expectations management issue, or an outcome measurement issue.

**Reference Rate**
Definition: % of clients who agree to be a named reference (willing to take a call from a prospect).
Target: ≥ 60% of completed Tier 1+ clients.
This is the single best proxy for overall engagement quality. Clients who had a bad experience don't become references. Clients who are ambivalent don't become references. Only genuinely satisfied clients do.

---

## Review cadence

| Cadence | What to review | Time required |
|---|---|---|
| Daily | Active engagement blockers, exception queues for monitored systems, overdue invoices | 15 min |
| Weekly | Pipeline value and movement, milestone status across active engagements, any post-launch support tickets | 30 min |
| Monthly | Full KPI review across all three layers, retainer performance review, playbook update queue | 60–90 min |
| Quarterly | Trend analysis (3-month rolling on all metrics), vertical expansion decision, pricing floor review, team capacity planning | 2–3 hours |

---

## KPI dashboard (stub)

The dashboard should surface these without manual data collection. Until it's built, maintain a simple monthly tracking spreadsheet with these columns:

| Month | MRR | Build Revenue | Weighted Pipeline | Active Engagements | Discovery→Proposal % | Proposal→SOW % | On-Time Milestone % | Post-Launch Bug Rate | Retainer Conversion % |
|---|---|---|---|---|---|---|---|---|---|

Populate it monthly. Trend lines matter more than point values — you're looking for patterns, not hitting exact targets every month.
