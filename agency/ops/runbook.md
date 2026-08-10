# Run-Book

The operating rhythm AIS runs on. Daily / weekly / monthly / quarterly / annual rituals that keep the agency alive.

This is what gets done, when, by whom. The cadence is the system. Skipping the cadence makes the rest of the repo decorative.

---

## Daily — each cofounder, ~15–30 min

### Morning (15 min)

- [ ] Check engagement health dashboard — any P1/P2 escalations overnight? Any sampling lapses?
- [ ] Check Acquirer Agent's outbound queue — any approvals overdue?
- [ ] Check Closer Agent's reply queue — any inbound needing personal response?
- [ ] Check inbound calendar — any new discovery call requests?

If anything's red, address before doing anything else. Otherwise, proceed to today's deep-work block.

### Throughout the day

- Engagement-related work (the lead cofounder's primary focus is whatever build/operate work is on the schedule)
- Cofounder-Slack or async messages (replied within 4 business hours for engagement-affecting messages)
- Client-related comms (replied within agreed SLA)

### End of day (10 min)

- [ ] Log work to engagement folders (`/engagements/[client]/notes.md` for the day's notable progress)
- [ ] Update task status if using shared task system
- [ ] Flag anything escalation-worthy for cofounders before signing off

### What not to do daily

- Daily KPI dashboard checks (weekly is the right cadence)
- Daily strategy decisions (these belong in monthly/quarterly meetings)
- Daily content reviews (cadence is weekly)
- Slack pings between cofounders that could be batched into the weekly retro

---

## Weekly — full cycle

### Monday morning (each cofounder, ~30 min)

- [ ] Acquirer Agent delivers Week's signal digest + outbound queue
- [ ] Each cofounder reviews + approves outbound for their lead-vertical (30–60 min dedicated time slot)
- [ ] Each cofounder checks weekly digests from operate-phase engagements (5 min per engagement)

### Tuesday (each cofounder)

- Build-phase engagement work (cofounders' primary delivery time)
- Operate-phase check-ins with client function owners (30 min per active engagement, scheduled)

### Wednesday–Thursday

- Outbound sends throughout the week (Acquirer Agent autopilots within approved queue)
- Reply handling (Closer Agent classifies; cofounder responds personally to interested / question replies)
- Content drafting and review (Acquirer Agent drafts; cofounder reviews per content production checklist)

### Friday afternoon (cross-cofounder, ~15 min)

- [ ] Weekly internal retro — what shipped, what's blocked, what needs attention from other cofounder
- [ ] Weekly acquisition digest review (Acquirer Agent delivers; cofounders review)
- [ ] Capacity check for next week (any cofounder overloaded? rebalance)

### What's measured weekly

- Pipeline: discoveries scheduled, proposals sent, SOWs signed
- Engagement health: P1/P2 count, sampling completion, escalation response time
- Acquisition: outbound sent + reply rate, content pieces shipped
- Cofounder utilization (self-reported)

---

## Monthly — first Monday + dedicated session

### Cross-cofounder monthly review (first Monday, 60 min)

Agenda:

1. **Tier 1 KPI review (15 min)** — revenue, pipeline, retention, utilization, cash (per `ops/kpi-framework.md`)
2. **Tier 2 KPI spot-check (10 min)** — validation pass rate, contribution margin trends, escalation patterns
3. **Tier 3 KPI spot-check (10 min)** — anchor metric performance, NPS, expansion conversations
4. **Acquisition review (10 min)** — channel performance, pipeline health by vertical
5. **Content topic selection (10 min)** — pick 4 long-form topics for the month
6. **Action items (5 min)** — captured for next 30 days

Output: `ops/monthly-retros/YYYY-MM.md` with action items.

### Per-engagement monthly review (with each client, 60 min)

Per the engagement rhythm in `delivery/handoff-docs-template.md`:

- Performance metrics review
- Quality / sampling discussion
- Improvement requests review
- Upcoming changes (vertical-specific, regulatory, client business)
- Action items

### Monthly partner reciprocity review (last Friday, 20 min)

- Per-partner: referrals received vs sent (rolling 12 mo)
- Identify imbalances; allocate cofounder time to address
- Update partner tracker at `sales/partner-tracker.md`

### Monthly content review (last Friday, 30 min)

- Review prior month's content performance (citations, engagement, inbound attribution)
- Update topic backlog priorities
- Identify patterns (what worked, what didn't)

### Monthly engagement P&L review (Nejc, 60 min)

- Per-engagement P&L update
- Contribution margin trends
- Flag any engagement drifting below 55% margin

### What's measured monthly

- Full Tier 1 KPIs
- Validation pass rate (rolling 90-day)
- Contribution margin per engagement
- Voice locking drift (aggregate across engagements)
- Citation count per published content piece
- Partner reciprocity

---

## Quarterly — strategic offsite + deep reviews

### Quarterly business review (cross-cofounder, ~3 hours, first week of quarter)

Half-day session. Internal. Sometimes done in-person, sometimes remote with extra discipline.

Agenda:

1. **Quarterly retrospective (45 min)**
   - Performance vs targets (all three KPI tiers)
   - Channel performance retrospective
   - Vertical-by-vertical performance
   - Cofounder utilization trends
2. **ICP refresh (30 min)**
   - Have any signals proven more/less valuable than expected?
   - Have any sub-segments emerged as best-fit?
   - Any segments to drop?
   - Update Knowledge Agent's ICP definition
3. **Voice refresh (30 min)**
   - Each cofounder commits 3–5 new voice samples for next quarter
   - Discussion of any voice drift observed
   - Update voice index
4. **Partnership review (30 min)**
   - Existing partners: state of relationship, referrals delivered, reciprocity owed
   - New partner targets for the quarter
   - Wind-down decisions if any
5. **Risk register review (15 min)** — per `ops/risk-register.md`
6. **Forward look (30 min)**
   - Next quarter targets
   - Major themes / experiments
   - Resource allocation discussion
   - Hiring discussions (per `ops/escape-velocity-targets.md`)

Output: `ops/quarterly-retros/QXYYYY.md` with full review notes and forward-looking decisions.

### Per-engagement QBR (with each client, 90 min)

Per the engagement rhythm:

- Quarterly performance summary
- Voice refresh outcomes + drift review
- Expansion opportunities discussion
- Scope adjustments
- Next quarter priorities

### Quarterly economics review (Nejc, 60 min)

- Per-engagement P&L review (all active engagements)
- Aggregate contribution margin trends
- Operating margin trend
- Pricing band review
- Cash position + runway projection

### Quarterly content + acquisition system review (60 min)

- Per-article retrospective (90 days post-publish)
- Acquirer Agent prompt audit
- Channel performance deep-dive
- Topic backlog refresh

### Quarterly memory system audit (Ian, 60 min)

- Review what was added to memory (per `ops/memory-system.md`)
- Identify cross-engagement learnings worth promoting
- Identify stale memory worth archiving
- Update Knowledge Agent's index

### What's measured quarterly

- Full KPI framework (all three tiers, complete)
- Trend analysis (quarter-over-quarter)
- Strategic alignment with escape-velocity targets
- Cofounder satisfaction check

---

## Annual — strategic offsite

### Annual strategy offsite (cross-cofounder, 2 days, January or fiscal-year-equivalent)

Off-site location ideal. Full attention.

Day 1:

1. **Annual retrospective (3 hours)**
   - Year-in-review across all dimensions
   - What worked, what didn't
   - Specific surprises (positive and negative)
   - Pattern recognition across the year
2. **Annual financial review (2 hours)**
   - Full P&L for the year
   - Cofounder draws review
   - Imputed rate review
   - Cash position trajectory
3. **Annual KPI review (2 hours)**
   - Trend analysis year-over-year
   - KPI framework itself: is it serving us? add / remove metrics deliberately

Day 2:

4. **Three-year forward look (3 hours)**
   - Where AIS is heading (per `ops/escape-velocity-targets.md`)
   - Verticals to add, drop, deepen
   - Cofounder roles evolution
   - Hiring strategy
   - Acquisition motion evolution
5. **Annual goals + Q1 plan (2 hours)**
   - Specific annual goals
   - Q1 priorities
   - Action items for first 90 days
6. **Cofounder reset (2 hours)**
   - Honest cofounder check-in (energy, alignment, longer-term thinking)
   - Roles evolution
   - Equity / commercial structure review (rarely changes, but reviewed annually)

Output: annual plan document at `ops/annual-plans/YYYY.md`.

### Annual reviews with each long-tenured client

Per the engagement rhythm (annual review meeting at 12+ months operate phase):

- Full-year performance retrospective
- Off-ramp option discussion
- Renewal or scope evolution
- Multi-year planning if continuing

### Annual vertical roster review

- Per-vertical performance review
- Decision: continue, deepen, pause, retire any vertical
- Decision: add new vertical (rare)
- Update vertical playbooks

### Annual pricing review

- Per-vertical pricing band review
- Adjust bands based on prior year's actual margins
- Update `docs/pricing.md` and `verticals/[vertical].md` files

---

## What gets skipped (and when)

The rhythm assumes steady-state operation. Some rituals get adjusted in specific phases:

### During formation phase (pre-first engagement)

- Skip per-engagement reviews (no engagements)
- Skip operate-phase rituals
- Compress monthly review to 30 min (less to review)
- Emphasize acquisition rhythm + repo development

### During hyper-growth phase (>3 new engagements simultaneously)

- Strict monthly review discipline (don't skip)
- Daily cofounder coordination (15 min standup)
- Weekly capacity rebalancing (more frequent than monthly)

### During cofounder absence (vacation, illness)

- Single-cofounder coverage: keep daily P1 monitoring + critical operate-phase support; pause non-urgent rituals
- 2-cofounder coverage: maintain weekly rhythm; defer monthly to next cycle if needed
- All-cofounder coverage: cofounders rotate; never go more than 14 days without monthly cross-cofounder review

### During slow periods (Q1 holiday lag, August in EU)

- Maintain operate-phase obligations
- Compress acquisition cadence (less inbound expected)
- Use the slow period for strategic work (repo improvements, content backlog, partnership outreach)

---

## How rituals get protected

The temptation: skip a ritual when busy. The pattern: skipped rituals don't come back until something breaks.

Discipline mechanisms:

### Calendar protection

- Monthly review: standing meeting on first Monday, 8:30–9:30 AM, all cofounders' calendars blocked. Don't move except for true emergency.
- Quarterly review: 3-hour block on Friday of first week of quarter, all cofounders. Booked 6 months in advance.
- Annual offsite: 2 full days in January, booked 12 months in advance.

### Default-on attendance

- All cofounders attend cross-cofounder meetings unless explicitly excused (with cofounder consensus, not unilateral)
- Per-engagement client meetings: lead cofounder is required; supporting cofounder is target; not having lead cofounder triggers rescheduling

### Ritual ownership

Each ritual has a named owner who runs the meeting and captures the output. Default:

- Daily individual rituals: each cofounder owns own
- Weekly internal retro: rotating chair (Anej Q1, Nejc Q2, Ian Q3, Anej Q4)
- Monthly cross-cofounder review: rotating chair
- Per-engagement reviews: lead cofounder per engagement
- Quarterly business review: rotating chair, but supported by all
- Annual offsite: rotating chair, prep work distributed

### Output discipline

Every ritual produces an artifact:

- Monthly review → `ops/monthly-retros/YYYY-MM.md`
- Quarterly review → `ops/quarterly-retros/QXYYYY.md`
- Per-engagement monthly → `/engagements/[client]/monthly-reviews/YYYY-MM.md`
- Annual offsite → `ops/annual-plans/YYYY.md`

If a ritual happens but produces no artifact, it didn't really happen — no audit trail, no decision provenance.

---

## When rituals reveal a problem

The whole point of the rhythm: surface issues before they compound.

### Monthly review reveals trend concern

→ Action items captured. Owner assigned. Re-checked next month.

### Quarterly review reveals strategic gap

→ Strategic adjustment defined. Cofounder consensus required. Captured in quarterly retro doc.

### Annual offsite reveals model needs change

→ Plan changes for the upcoming year. Repo updates if needed (e.g. `docs/principles.md` evolution).

### Any review reveals cofounder-level concern

→ Doesn't wait for next scheduled meeting. Cofounder-to-cofounder direct conversation. Then brought to next meeting if needs collective decision.

---

## What this rhythm doesn't replace

Some things happen outside the rhythm:

- **Crisis response.** P1 escalations get handled immediately, not at next monthly review.
- **Client emergencies.** A client in genuine crisis gets cofounder time outside the normal cadence.
- **Strategic opportunities.** A partnership or vertical opportunity that requires fast action gets cofounder discussion same-day, not next-Monday.
- **Personal life.** Cofounder personal events (illness, family) override the rhythm. Other cofounders cover.

The rhythm serves the business. The business serves the cofounders' long-term goals. When the two conflict, the longer-horizon perspective wins.
