# Retention Agent

Owns client lifecycle: health checks, expansion-trigger detection, churn-signal monitoring, renewal coordination, and off-ramp orchestration.

Deployed inside AIS to run our own client-success function (operate-phase retention of AIS engagements). Also configured-and-deployed inside clients whose bought function involves retention — typically subscription businesses, professional services with recurring relationships, and high-LTV customer-base operations.

---

## Function ownership

**Owns:**
- Scheduled health-check touchpoints with deployed client-side operators
- Expansion-trigger detection (signals that client is ready for another agent / function / scope addition)
- Churn-signal monitoring (declining engagement, missed reviews, payment lag, escalation frequency, sentiment shifts in communications)
- Renewal coordination (when retainers come up for renewal, when annual reviews are due)
- Off-ramp orchestration (when a client takes their stack in-house — coordinated knowledge transfer)
- Sentiment monitoring across client communications (with appropriate caveats)
- Lifecycle stage tracking (onboarding → ramping → steady-state → expansion / off-ramp / at-risk)

**Does not own:**
- The actual relationship (cofounders own this — Retention Agent surfaces signals, cofounders act)
- Pricing decisions (cofounder-level)
- Hiring or firing client-side personnel (obviously not)
- Decisions about whether to terminate an engagement (cofounder-level)

**Hard boundary:** never sends a "we're worried about your engagement" message to a client without cofounder approval. Always. Sensitive communications are cofounder territory.

---

## Inputs

- **Engagement charter** — defines health metrics, expansion criteria, renewal terms
- **Activity logs across the agent stack** — sampling-engagement levels, escalation frequency, output quality scores over time
- **Communication history** — emails, Slack messages, meeting notes between AIS and client (within agreed boundaries)
- **Billing data** — invoice payment timing, retainer continuity
- **Tools the client expanded into / churned out of** — pattern data
- **External signals** — client's revenue changes (public if visible), executive changes (LinkedIn), funding events (Crunchbase)
- **Calendar data** — QBR cadence, missed-meeting patterns

---

## Outputs

- **Weekly health digest** — per-client health score, change vs prior week, any signals worth attention. Delivered to cofounders.
- **Monthly retention dashboard** — full portfolio view, color-coded by health
- **Expansion alerts** — specific signals that a client is ready for an upsell conversation (e.g. they've maxed the deployed agent's volume, asked about an adjacent function, mentioned a new initiative the agent stack could support)
- **Churn alerts** — specific signals that a client is at risk (decline in sampling, payment lag, sentiment shift, missed meetings)
- **Renewal calendar** — 90/60/30/14-day reminders ahead of each renewal date
- **Off-ramp coordination plan** — for clients moving to internal ownership; structured handoff sequence

---

## Tools and integrations

**Required:**
- Claude API for analysis + generation
- CRM API (or AIS's internal client-tracking system; even a Notion database works)
- Communication channels (read access to client-shared Slack channels, email threads — within agreed boundaries)
- Calendar API for meeting attendance + scheduling
- Billing system API for payment data

**Optional:**
- Sentiment analysis tooling (most agents we use have sufficient sentiment capability via Claude alone)
- External monitoring (Crunchbase, LinkedIn, news APIs for client executive / funding signals)
- Survey tooling (NPS or CSAT collection at milestone intervals)

---

## Human owners

**AIS-side (always — Retention Agent is primarily AIS-side infrastructure):** assigned cofounder per client. Default: the cofounder who led the engagement during build phase.
- Approves: all client-facing communications, escalation outreach, expansion conversation initiations, renewal terms changes
- Escalates: at-risk client requires cofounder consensus on response, client-facing relationship needs reset, decision to off-ramp or terminate

**Client-side owner (for Retention Agent deployed inside a client):**
- Varies by client's business. For subscription SaaS, typically Head of Customer Success. For specialty legal firm doing client retention, typically managing partner.

---

## Escalation rules

The agent stops and escalates when:

- **Health score drops by >2 points (on 10-point scale) week-over-week** → immediate cofounder escalation
- **Payment more than 7 days late** → escalate (could be admin oversight or could be early churn signal)
- **Client-side owner stops sampling outputs for 2+ weeks** → escalate (operator buy-in eroding)
- **Sentiment shift detected in communications** (escalation frequency rising, tone shifting) → escalate with examples
- **QBR or scheduled review missed without reschedule** → escalate
- **Client mentions another vendor in a context that suggests evaluation** → escalate
- **Expansion-trigger signal detected** → notify, don't auto-act; cofounder decides timing of upsell conversation
- **External signal (funding round, exec change, layoffs)** → notify; may be expansion opportunity or churn risk

---

## Success metrics

**Quantitative (tracked monthly):**

| Metric | Target | Failure threshold |
|---|---|---|
| Client retention rate (operate-phase clients still active 12 months in) | >85% | <70% triggers cofounder retrospective |
| Expansion revenue as % of base revenue (NRR proxy) | >115% annualized | <100% triggers expansion-motion review |
| Time from churn signal to cofounder action | <5 days | >14 days = signal-action loop broken |
| QBR attendance rate (both sides) | >95% | <80% indicates engagement decay |
| NPS / satisfaction (quarterly survey) | >50 | <30 triggers cofounder-led intervention |

**Qualitative:**

- Are we anticipating client needs or reacting to client complaints?
- Are cofounders surprised by churn (bad) or able to predict it (good)?
- Are expansion conversations happening at the right moment (when client is excited and successful, not when they're frustrated)?

---

## Failure modes

### Failure 1 — Churn signals missed until too late

Retention Agent's signal definitions were calibrated at build phase. Client's behavior pattern is non-standard. Standard signals don't fire. Client churns abruptly, cofounders are surprised.

*Early warning:* Retrospective on a churned client shows obvious signals the agent didn't track.
*Mitigation:* Add new signal types based on retrospective patterns. Quarterly review of signal definitions per client (some clients have unique patterns; the agent should adapt).

### Failure 2 — Health score becomes vanity metric

Score looks good, client churns anyway. Reason: the metrics being aggregated don't correlate with retention as well as expected, but no one noticed because the score looked healthy.

*Early warning:* Churned clients had above-average health scores in the month before churn.
*Mitigation:* Quarterly health-metric calibration — which inputs actually predict retention? Re-weight or replace inputs that don't.

### Failure 3 — Expansion conversations happen at the wrong time

Agent flags an expansion-ready signal. Cofounder reaches out. Client says "yes interested" but conversation fizzles because the timing was actually wrong (e.g. client is in their busy season, or had an internal issue not visible externally). Burns a future opportunity by pre-empting it.

*Early warning:* Expansion conversations consistently going dead despite "yes interested" initial response.
*Mitigation:* Tighten expansion-trigger definitions — require multiple signals, not single signals. Consider client's calendar / known busy periods before triggering. Cofounder judgment is final on timing.

### Failure 4 — Sentiment analysis misreads cultural register

Slovenian business communication has different sentiment conventions than English. Agent might flag a perfectly normal Slovenian-direct communication as "hostile" or miss a polite-but-real complaint that uses indirect language.

*Early warning:* Sentiment flags don't correlate with cofounder's read of the client relationship.
*Mitigation:* Train sentiment detection on locale-specific examples. Have a Slovenian-native cofounder calibrate periodically. Lower sensitivity on sentiment scoring for Slovenian engagements; rely more on behavioral signals (sampling lapses, missed meetings).

### Failure 5 — Communication boundary violation

Agent reads or surfaces communications it shouldn't (e.g. private messages between two cofounders that weren't meant to be in the retention loop; client-side communications shared with AIS in confidence). Privacy breach.

*Early warning:* Cofounder notices something in a retention digest that surfaced from an inappropriate source.
*Mitigation:* Audit access scopes immediately. Tighten which channels/inboxes Retention Agent reads from. Document boundaries explicitly in agent spec.

---

## Configuration patterns by vertical / context

### AIS internal use (retaining AIS's own clients)
- Default deployment. Always active.
- Health-score inputs: client-side sampling engagement, escalation frequency, payment timing, QBR attendance, sentiment in shared comms, expansion conversations
- Cofounder rotation: each cofounder owns a portfolio of clients; Retention Agent reports per-client to that cofounder
- Renewal coordination: 90/60/30/14-day reminders; cofounder schedules renewal conversation, agent prepares brief

### Deployed inside SaaS client (customer retention function)
- Health-score inputs: product usage data, support ticket frequency + sentiment, billing health, customer-success touchpoint engagement
- Often integrated with CS platform (Gainsight, Vitally, Catalyst) or built from scratch on simpler stack
- Expansion-trigger calibration specific to client's product (which usage patterns precede upsell?)
- Often coordinates with internal CSM team rather than replacing them — augmentation pattern

### Deployed inside professional services client (e.g. specialty legal firm)
- Health-score inputs: matter activity, payment timing, partner-touchpoint frequency, post-matter NPS responses
- Renewal-equivalent: post-matter retention touchpoints, anniversary outreach, referral-request timing
- Voice-locked to firm's relationship-management voice (typically less formal than firm's external comms)
- High sensitivity to confidentiality (legal client comms are privileged — agent's read access scoped narrowly)

### Deployed inside Slovenian SMB (customer/client retention)
- Health-score inputs: purchase frequency, communication response timing, social engagement, referral activity
- Slovenian-language outputs
- Cadence often includes anniversary / birthday touchpoints (high cultural fit in SI market)
- In-person follow-up offered for high-value relationships

---

## Voice and output requirements

For AIS-internal use:
- Voice samples sourced from cofounder communications with clients (each cofounder is their own voice; per-cofounder voice index)
- No external-facing communications without cofounder approval

For deployed-inside-client use:
- 16+ voice samples from the client's relationship-management voice (CSM lead, partner, owner-operator depending on context)
- Drift detection quarterly

---

## Memory and learning

**Persisted across runs:**
- Every signal fired + cofounder response + outcome (this signal led to expansion / churn / no-action / etc.)
- Health-score history per client
- Communication history (with appropriate access controls)
- Retrospective notes on churned clients (what should have been a signal but wasn't)

**Learning loops:**
- **Weekly:** signal accuracy review (did signals predict actual outcomes?)
- **Monthly:** health-score calibration (do scores correlate with retention?)
- **Quarterly:** signal definition refresh based on prior 90 days of outcomes
- **Per churned-client:** retrospective added to signal-improvement queue

---

## Cost model

**Typical monthly direct cost (AIS-internal):** €100–€300

| Component | Range | Driver |
|---|---|---|
| Claude API | €60–€180 | Communication analysis + digest generation |
| External monitoring (Crunchbase, news APIs) | €30–€80 | Optional; only for clients we want external-signal coverage on |
| CRM / tracking | €0–€50 | Usually existing tooling |

**Typical monthly direct cost (deployed inside client):** €300–€800 depending on customer base size and cadence

**Scales with:**
- Number of clients tracked
- Frequency of touchpoints
- External signal monitoring scope
- Voice-locking depth requirements
