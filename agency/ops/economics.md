# Economics — Unit Economics + the Compute-to-Talent Inversion

The economic model AIS operates on. Why the math works. Where it breaks.

This file is what makes the agency viable. Without these mechanics holding, AIS is just another agency.

---

## The compute-to-talent inversion (recap)

Traditional service agencies have linear-cost-to-revenue mechanics. Each additional client requires additional people (account managers, planners, executors). Margins are capped by headcount cost. Scaling means hiring.

AI-native agencies invert this. Compute (inference + tooling) scales linearly and instantly with revenue. Headcount stays flat or near-flat. A 30-person AI-native company can service what would have required 300 people in the SaaS-agency era.

The math:

| Model | 100 active clients | Cofounder/employee count | Revenue/person |
|---|---|---|---|
| Traditional agency | 100 clients × 4 hr/wk per client | ~40 people | ~€100K |
| SaaS vendor | 100 clients × 1 CSM each (at 1:30 ratio) | ~10 people | ~€500K |
| AI-native vertical agency (AIS model) | 100 clients × ongoing operate, agent-stack-handled | ~10 people | ~€1M+ |

The AI-native ratio assumes:
- Compute does 70%+ of execution work
- Humans handle judgment, escalation, relationship
- Per-client cofounder time in operate phase: 4–8 hours/month (vs ~16 hours/month for traditional)

We're not at 100 clients yet. We're at zero. But the math has to hold at our scale or we won't reach 100.

---

## Per-engagement P&L

Every engagement has its own P&L. Aggregate metrics hide which engagements are healthy.

### Per-engagement revenue (annual basis)

**Compact engagement (typical):**
- Build fee: €20K (one-time)
- Operate retainer: €5K/month × 12 = €60K/year
- Year-1 revenue: €80K
- Subsequent years: €60K each

**Standard engagement (typical):**
- Build fee: €45K
- Operate retainer: €7K/month × 12 = €84K/year
- Year-1 revenue: €129K
- Subsequent years: €84K each

**Comprehensive engagement (typical):**
- Build fee: €80K
- Operate retainer: €11K/month × 12 = €132K/year
- Year-1 revenue: €212K
- Subsequent years: €132K each

### Per-engagement direct costs

**Build phase (one-time):**

| Cost category | Compact | Standard | Comprehensive |
|---|---|---|---|
| Cofounder time on build (~at imputed rate) | €4K–€7K | €8K–€14K | €15K–€25K |
| Inference + tooling during build | €1K–€2K | €2K–€4K | €4K–€7K |
| External contractors (if any) | €0–€2K | €0–€4K | €0–€8K |
| **Build phase direct cost** | **€5K–€11K** | **€10K–€22K** | **€19K–€40K** |
| Build fee (revenue) | €20K | €45K | €80K |
| **Build phase contribution margin** | **45–75%** | **51–78%** | **50–76%** |

**Operate phase (monthly):**

| Cost category | Compact | Standard | Comprehensive |
|---|---|---|---|
| Cofounder time on operate (~at imputed rate) | €1K–€1.5K | €1.5K–€2K | €2K–€3K |
| Inference + tooling | €400–€800 | €600–€1.2K | €1K–€2K |
| External pass-through (Apollo seats, etc.) | €100–€300 | €200–€500 | €300–€800 |
| **Operate phase direct cost** | **€1.5K–€2.6K** | **€2.3K–€3.7K** | **€3.3K–€5.8K** |
| Operate retainer (revenue) | €5K | €7K | €11K |
| **Operate phase contribution margin** | **48–70%** | **47–67%** | **47–70%** |

### Combined annual per-engagement contribution margin

Weighted across year 1 (build + operate):

| Shape | Year 1 revenue | Year 1 direct cost | Year 1 contribution margin |
|---|---|---|---|
| Compact | €80K | €25K–€42K | 47–69% |
| Standard | €129K | €38K–€66K | 49–70% |
| Comprehensive | €212K | €58K–€110K | 48–73% |

Year 2 onwards (operate-only):

| Shape | Annual revenue | Annual direct cost | Contribution margin |
|---|---|---|---|
| Compact | €60K | €18K–€31K | 48–70% |
| Standard | €84K | €28K–€44K | 48–67% |
| Comprehensive | €132K | €40K–€70K | 47–70% |

### Target band

Per-engagement contribution margin >65% target. >55% refuse-below threshold.

A typical mature operate-phase engagement at year 2+ should clear 60–70% contribution margin if executed well. New engagements in build phase compress closer to 50% in year 1 due to build phase intensity, then expand in years 2+.

---

## Cofounder time as a cost — imputed rate

We don't pay cofounders salary in early days (cofounders draw from cash position; treated as owners, not employees). But for P&L purposes, cofounder time is the largest direct cost — needs to be imputed.

### Imputed rate

**€80/hour** as the working assumption (2026–2027).

Reasoning:
- Below cofounders' actual market opportunity cost (Slovenian senior tech / consulting rates are €60–€150/hr)
- Above what's economically sustainable for cofounders long-term (need to clear ~€60/hr to make the agency viable as a career)
- Round, simple, easy to use in monthly P&L

**Annual imputed rate per cofounder at full-time:** €80/hr × 40hr/wk × 50wk = €160K

If we draw less than that from the agency, we're effectively investing the difference back. If we draw more (which we shouldn't in early stage), we're decompiling the future to pay the present.

### When the imputed rate changes

- Annual review (Q1)
- Cofounder consensus required to change
- Update applies prospectively, not retroactively
- Should rise as the agency matures (towards €120–€150/hr by 2028 if revenue supports)

### Imputed rate vs draw rate

Cofounder **draw rate** (actual cash to cofounder) is set by Nejc's quarterly cash review. Always less than or equal to (engagement revenue × contribution margin × cofounder share). Specific draw policy:

- Maintain >6 months runway at current burn before any draw increase
- Draws split equally across cofounders (per the 33% structure)
- Quarterly draws (not monthly) — smooths out lumpy build fee timing

Year 1 (2026) target draw: €30K per cofounder
Year 2 (2027) target draw: €60K per cofounder
Year 3 (2028) target draw: €90K+ per cofounder

These trail revenue growth deliberately — invest first, draw later.

---

## Revenue per cofounder

The leverage metric. Tracks how much revenue each cofounder is supporting.

**Targets:**

| Quarter | Active engagements | TTM revenue | Revenue per cofounder (annualized) |
|---|---|---|---|
| Q3 2026 | 2–3 | €100K | €33K |
| Q4 2026 | 4–6 | €300K | €100K |
| Q2 2027 | 6–10 | €800K | €267K |
| Q4 2027 | 10–15 | €1.5M | €500K |
| Q4 2028 | 15–25 | €2.5M | €833K |

The compute-to-talent inversion thesis tested by Q4 2028: at €833K/cofounder annualized, the math has worked. Below €500K/cofounder at Q4 2027 = thesis needs re-examination.

---

## Cash conversion cycle

How long from work done to cash in account. Critical for cash management.

### Build fee timing

- 50% invoiced at SOW signature, Net 14 → cash typically arrives within 21 days of SOW
- 50% invoiced at handoff to operate, Net 14 → cash typically arrives within 21 days of operate-phase start

Build phase length: 6–12 weeks.

**Cash gap on build:** worst case, cofounder time spent in weeks 1–8 of build is unpaid until week 14ish (second invoice + 14 days payment). Best case, first installment covers build phase costs through week 4ish, and second installment covers the rest.

**Implication:** the agency needs ~2 months of operating cash to cover the build-phase cash gap on each new engagement. Multiple parallel engagements amplify this.

### Operate retainer timing

- Invoiced on 1st of month, in advance, Net 7 → cash typically arrives within 14 days of month start

**Cash conversion on operate:** ~14 days from period start. Modestly negative working capital (we collect for the month before fully delivering it), which helps cash position.

### Aggregate cash position needs

At target steady state (8–12 active engagements, mix of build + operate):

- Operating cash needs: ~€80K (covers 2-month build-phase cash gap × 2 simultaneous build engagements + 1 month operating expenses)
- Reserve: ~€60K (3 months operating expenses)
- **Total target cash position:** €140K

We don't have that yet. We're building toward it. In early days, cofounders' personal financial reserves bridge any gaps; this is part of why early draws are conservative.

---

## Cost categories in detail

### Direct costs (per-engagement, attribution-clear)

| Category | Notes |
|---|---|
| Cofounder time on the engagement | Imputed at €80/hr; tracked per engagement; largest single direct cost |
| Inference costs | Claude API calls attributable to the engagement; tracked via API usage logs by engagement tag |
| Tooling costs (engagement-specific) | New seats on Apollo/Clay/Outreach acquired for the engagement; Knowledge Agent's vector DB storage attributable |
| Pass-through tooling | Tools we purchase on behalf of client; charged at cost; not contribution-margin-relevant |
| External contractor time | When we bring in a specialist (rare); tracked per engagement |

### Indirect costs (operating overhead, allocated)

| Category | Annual estimate (2026) |
|---|---|
| Cofounder time on non-engagement work (acquisition, repo, strategy, admin) | Imputed value, not separately accounted |
| Shared tooling (Claude API base seats, AIS website, internal Slack, etc.) | €3K–€6K |
| Legal + accounting | €5K–€10K |
| Insurance (E&O, general liability) | €2K–€4K |
| Travel + offsite | €4K–€8K |
| Office / co-working (if applicable) | €0–€6K |
| Brand / website / collateral | €2K–€5K |
| **Total annual indirect** | **€16K–€40K** |

Indirect costs are real. They reduce operating margin (vs contribution margin per engagement). Operating margin target Q4 2026: 25–35%. Q4 2027: 30–40%.

---

## Pricing band justification (the math behind `docs/pricing.md`)

The pricing bands in `docs/pricing.md` aren't arbitrary. They reflect:

### Build fee math

Per-engagement build phase: 4–10 weeks of significant cofounder time.

- Compact: ~80 cofounder hours × €80/hr = €6.4K imputed cost. At €20K build fee, that's 32% direct labor cost → leaves room for inference + tooling + contribution margin.
- Standard: ~160 cofounder hours × €80/hr = €12.8K. At €45K build fee, 28% direct labor → contribution margin 65%+ after inference/tooling.
- Comprehensive: ~280 cofounder hours × €80/hr = €22.4K. At €80K build fee, 28% direct labor → similar margin.

Lower pricing breaks the math. Higher pricing leaves more buffer.

### Operate retainer math

Per-engagement operate phase: ~16 cofounder hours/month (4 hours/week including monitoring, sampling support, escalation handling).

- Compact: 16 hours × €80/hr = €1.28K cofounder cost. At €5K retainer, leaves €3.7K for inference, tooling, contribution.
- Standard: 20 hours × €80/hr = €1.6K. At €7K retainer, leaves €5.4K.
- Comprehensive: 28 hours × €80/hr = €2.24K. At €11K retainer, leaves €8.76K.

Contribution margin clears 60–70% target after non-cofounder direct costs.

### Why the bands have ranges

Variance within each shape accounts for:
- Vertical complexity (legal high, Slovenian SMB low)
- Integration count (more integrations = more cost)
- Voice locking depth (legal 25+ samples vs standard 16)
- Client-side coordination complexity (mature client orgs need less hand-holding)

Cofounder lead picks point in band during scoping based on these variance factors.

---

## When the math doesn't work — common scenarios

### Scope creep without re-pricing

Engagement scope grows during build phase. Cofounder time goes up. If price stays the same, contribution margin collapses. Sometimes 70% margin engagements become 30% margin engagements via scope creep — silent margin destruction.

*Discipline:* scope changes always trigger pricing conversation per `delivery/sow-template.md` Section 2.3. No quiet absorption.

### Long sales cycles

Discovery + scoping takes cofounder time (3–8 hours per qualified prospect). If the prospect doesn't close, that time is "investment" in pipeline that didn't convert. If too many discoveries don't close, the math breaks.

*Discipline:* discovery-call qualification (per `delivery/discovery-script.md`) is gating. Don't advance unqualified prospects to scoping. Proposal → SOW conversion target >40% — below that, qualifying too loose.

### Bad debt

Clients who don't pay (or pay late). Even at 1–2% bad debt rate, contribution margin erodes meaningfully.

*Discipline:* payment terms enforced per `delivery/sow-template.md` Section 3.4. Late payment triggers pause at day 14. Don't extend credit to clients who don't pay on time.

### Cofounder underutilization

If cofounders aren't fully utilized, the agency is paying imputed rate without revenue offset. Slack in the system. Acceptable in early days; problematic at scale.

*Discipline:* cofounder utilization tracked in `ops/kpi-framework.md` Tier 1. If utilization persistently below 80% delivery, either pipeline needs to accelerate or capacity should scale back.

### Cofounder overutilization

Opposite problem. >55% delivery utilization isn't sustainable long-term — burns out cofounders, drops quality.

*Discipline:* utilization also tracked; corrective action is either slowing pipeline or hiring (probably an orchestrator role first per `ops/escape-velocity-targets.md`).

---

## When economics force a strategic pivot

If unit economics drift below targets persistently, structural changes are needed. Possible pivots:

### Raise prices

If contribution margin is consistently below target despite operational efficiency, raise the pricing bands. Counterintuitive — buyers often accept higher prices if the work is differentiated. Test with proposal-stage anchoring.

### Drop a vertical

If one vertical's economics consistently underperform (e.g. Slovenian businesses' lower price ceiling can't sustain the cofounder time we put into them), consider exiting that vertical or restructuring (e.g. lighter-touch engagement shape only).

### Productize tighter

If build phase consistently runs over time, the build process needs more automation. Invest cofounder time in Builder workflow improvements to compress future build phases.

### Hire (orchestrator first)

When cofounders are bottleneck at >55% utilization sustained, hire a first non-cofounder employee — typically an orchestrator who can manage operate-phase engagements and free cofounder time. Pricing-wise: orchestrator at €60K/year supports ~6 active operate-phase engagements at 4 hours/week each.

### Refuse marginal work

The discipline most cofounders fail at: saying no to engagements that are below the contribution margin target. Easier to say yes to revenue today; harder to say no for margin tomorrow. The decision is consistently made in the no direction even when it stings.

---

## Quarterly economics review

End of each quarter, ~60 min:

- Per-engagement P&L review (all active engagements)
- Aggregate contribution margin trends
- Operating margin trend
- Cofounder time utilization
- Imputed rate review (annual; less frequently)
- Pricing band review (are we hitting expected margins? recalibrate if not)
- Cash position + runway projection

Output: any pricing adjustments, scope discipline reinforcement, decision on whether to refuse certain engagement shapes.
