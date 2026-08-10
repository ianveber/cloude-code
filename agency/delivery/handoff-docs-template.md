# Handoff Documentation Template

The documentation package delivered to the client at end of build phase. Hands operational responsibility for the deployed agent stack to the client-side function owner.

Lives at `/engagements/[client-name]/handoff/` and is also delivered to client as a single PDF + the source folder.

Used in Phase 6 (Handoff). The handoff training session walks through this package.

---

## Package structure

```
/engagements/[client-name]/handoff/
├── 00-summary.md                          ← One-page overview
├── 01-agent-specs/
│   ├── acquirer-agent-config.md           ← Per-agent deployed config
│   ├── closer-agent-config.md
│   ├── knowledge-agent-config.md
│   └── [other deployed agents]
├── 02-runbook.md                          ← Day-to-day operations guide
├── 03-escalation-paths.md                 ← Who to call when
├── 04-monitoring-access-guide.md          ← Where to see what
├── 05-quarterly-review-schedule.md        ← Cadence for ongoing reviews
├── 06-off-ramp-terms.md                   ← Per SOW Section 7.4
├── 07-training-materials/
│   ├── training-deck.pdf
│   ├── training-recording.mp4
│   └── quick-reference-card.pdf
└── 08-first-weekly-digest-example.md      ← What digests look like
```

---

## Document 00 — Summary

One page. The first thing the client function owner reads. Sets expectations for the rest of the package.

```markdown
# Engagement Handoff Summary — [Client Name]

**Engagement:** [Function being owned, one sentence]
**Build phase completed:** [date]
**Operate phase begins:** [date]

## What was deployed

[Bulleted list of deployed agents and the function each owns]

## Named owners

- AIS-side lead: [Name, email, mobile]
- AIS-side support: [Name, email]
- Client-side function owner: [Name]
- Client-side sponsor: [Name]

## What you need to do weekly

1. Read the weekly digest (delivered every [day])
2. Sample 10 outputs across the agent stack — rate Strong/Acceptable/Weak, log in [location]
3. Note any escalation-worthy issues
4. Approve any improvement requests queued for you

Estimated weekly time commitment: ~60–90 minutes.

## What you need to do monthly

- Attend the monthly review (60 min, scheduled for [day of month])
- Review the monthly performance report

Estimated monthly time commitment: ~2 hours total.

## What you need to do quarterly

- Attend the QBR (90 min)
- Participate in voice sample refresh (~30 min)
- Review and approve any scope adjustments

Estimated quarterly time commitment: ~3 hours total.

## When to call us immediately

- Any P1 incident (customer-facing failure, data exposure, agent producing harmful output) — call [Lead cofounder mobile], 24/7
- Any P2 incident (function disruption) — message [Slack channel] or email, same business day response
- Anything that feels wrong — call. We'd rather you call once too often than once too late.

## Where to find everything

This package: `/engagements/[client-name]/handoff/`
Also delivered as: [PDF link]
Live monitoring: [dashboard URL]
Audit trail: [audit log URL]
```

---

## Documents 01 — Per-agent configs

One document per deployed agent. Follows the agent template in `agents/_template.md` but populated with the engagement-specific configuration.

For each agent:

```markdown
# [Agent Name] — Deployed Configuration for [Client]

## Function this agent owns

[Specific sentence about what this agent does for this client]

## Inputs

[Specific data sources, signal sources, trigger conditions for this deployment]

## Outputs

[Specific outputs this agent produces, where they go, how they're delivered]

## Tools and integrations

[Specific tools wired into this agent for this deployment; API credentials location (encrypted reference); rate limits configured]

## Decision rules

[The decision rules this agent applies — written in plain language, not code]

## Escalation rules (this deployment)

[Specific thresholds for this engagement; who gets escalated to; SLA]

## Voice samples in use

[Where voice samples live; how many; refresh date]

## Success metrics for this deployment

[Specific KPIs being tracked; baseline; targets]

## Known limitations

[Edge cases this agent doesn't handle; workflows that escalate to human; topics outside scope]

## Audit trail

[Where the agent's actions are logged; retention period; how to query]

## Last updated

[Date of most recent configuration change]
```

---

## Document 02 — Runbook

How to operate the deployed stack day-to-day.

```markdown
# Runbook — [Client] Agent Stack Operations

## Daily operations

### What the system does automatically
[Description of the autonomous flows]

### What requires human action (your action)
[Specific decision points requiring function owner input]

### Where to find the daily activity feed
[Slack channel, email digest, dashboard — wherever the function owner sees what happened today]

## Weekly operations

### Sampling protocol
1. Open [sampling dashboard URL]
2. Random-sample 10 outputs across the past week's activity
3. For each output, rate Strong / Acceptable / Weak with a one-line reason
4. Log ratings in [sampling log location]
5. Flag any "would not have sent this" outputs to AIS lead immediately

### Weekly digest review
[Walk-through of what's in the weekly digest, what to look for, what's an anomaly]

### Improvement request submission
[How to submit a "can the agent also do X" request; where it goes; expected response time]

## Monthly operations

### Monthly review preparation
[What to bring to the monthly review meeting]

### Monthly performance report review
[Where to find the report; what each section means; what to question]

## Quarterly operations

### Quarterly Business Review (QBR)
[Agenda template; preparation needed; what to expect from AIS]

### Voice sample refresh
[Process for refreshing voice samples each quarter]

### Scope adjustment opportunity
[Window to discuss adding/changing scope; how it works commercially]

## Troubleshooting common situations

### "An output looks wrong"
1. Don't send it (if you're in approval flow). Flag it via [escalation channel].
2. Tag the output with which agent produced it and why you think it's wrong.
3. AIS will respond per SLA.

### "The system stopped doing something it usually does"
1. Check the monitoring dashboard for integration health issues.
2. If integrations green, escalate via [P2 channel].
3. If P2 isn't getting timely response, escalate to lead cofounder directly.

### "A customer / external party complained about something the agent did"
1. Stop the relevant agent immediately via [kill switch URL].
2. Call the lead cofounder. Don't wait.
3. We treat this as P1 regardless of severity.

### "We want to expand what the agent does"
1. Document what you want it to do in plain language.
2. Submit via the improvement-request channel.
3. AIS will respond with scope/timeline/cost (small additions handled in operate retainer; larger require formal SOW addendum).

## Pause / kill controls

- [URL] — pauses [specific agent] (read-only mode resumed)
- [URL] — pauses all external-facing agent operations
- [URL] — full stack pause (use only for emergencies — alerts both AIS cofounders immediately)
```

---

## Document 03 — Escalation paths

Single-page reference of who to call when.

```markdown
# Escalation Paths — [Client]

## P1 — Urgent (4-hour response, 24/7)

**Examples:** customer-facing failure, data exposure, agent producing harmful output, integration failure breaking the function entirely

**Contact:** [Lead cofounder name]
- Mobile: [number]
- WhatsApp: [number]
- Email: [email]

**Backup:** [Supporting cofounder name]
- Mobile: [number]

## P2 — High (same business day response)

**Examples:** function disruption affecting daily operation, agent quality degradation, integration partially failing

**Contact:** [Lead cofounder]
- Slack channel: [channel link]
- Email: [email]

## P3 — Standard (2 business days response)

**Examples:** quality issue, improvement request, configuration question

**Contact:**
- Slack channel: [channel link]
- Email: [email]
- Issue queue: [URL]

## P4 — Low (next monthly review)

**Examples:** suggestion, nice-to-have, future enhancement

**Contact:**
- Add to monthly review agenda: [URL]
- Or mention in weekly check-in

## Off-hours / weekend handling

- P1 only is handled 24/7
- P2/P3/P4 next business day

## When the lead cofounder is unreachable

- Try the backup cofounder
- Then try Nejc (cofounder, legal/external rep) at [number]
- If all three unreachable for >4 hours on a P1, the issue is system-wide on our side — proceed with documented kill-switch actions
```

---

## Document 04 — Monitoring access guide

```markdown
# Monitoring Access — [Client]

## Dashboards

### Live activity dashboard
- URL: [dashboard URL]
- Login: [SSO / shared account / individual account]
- What you see: real-time view of what each agent is doing

### Weekly metrics dashboard
- URL: [dashboard URL]
- Login: [same as above]
- What you see: rolling 7-day metrics for each agent

### Monthly performance dashboard
- URL: [dashboard URL]
- Login: [same as above]
- What you see: month-over-month trends, KPIs, anomalies

## Audit logs

### How to query
- Audit log lives at [URL]
- Query interface: [tool / dashboard]
- Retention: 24 months from log creation

### Common queries
- "What did [agent] do on [date]?" → [query template]
- "Why did [output] go out?" → [query template — traces the decision chain]
- "Where did [data] come from?" → [query template — traces the input source]

## Alerts

### Active alerts
- [List of configured alerts with triggers]

### How to subscribe
- [Mechanism for adding more email addresses / Slack channels to alerts]

### How to mute
- [Process — usually requires cofounder approval to avoid blind spots]

## Voice sample access

- Voice index lives at [URL]
- To add new samples: [process]
- To review existing samples: [URL]
- Quarterly refresh schedule: [date]
```

---

## Document 05 — Quarterly review schedule

```markdown
# Ongoing Reviews — [Client]

## Weekly digest

- Delivered every [day of week] by [time]
- To: [Function owner email] (cc: [Sponsor])
- Channel: [Slack channel] (mirrored)

## Monthly review

- Recurring meeting: [day of month] at [time]
- Duration: 60 min
- Attendees: AIS lead cofounder + client function owner + client sponsor
- Agenda template:
  - 10 min: performance metrics review
  - 20 min: quality / sampling discussion
  - 15 min: improvement requests review
  - 10 min: upcoming changes (vertical-specific, regulatory, client business)
  - 5 min: action items

## Quarterly Business Review (QBR)

- Recurring meeting: [date — first day of each new quarter]
- Duration: 90 min
- Attendees: AIS lead + AIS support cofounder + client function owner + client sponsor + others by invitation
- Agenda template:
  - 15 min: quarter performance summary
  - 20 min: voice refresh outcomes + drift review
  - 20 min: expansion opportunities discussion
  - 15 min: scope adjustments (if needed)
  - 15 min: forward look — next quarter priorities
  - 5 min: action items

## Annual review

- First annual review: [date — 12 months post-operate-start]
- Duration: 2 hours
- Attendees: both parties' leadership
- Topics:
  - Full-year performance retrospective
  - Off-ramp option discussion (per SOW Section 7.4)
  - Renewal or scope evolution
  - Multi-year planning if continuing
```

---

## Document 06 — Off-ramp option terms

Per SOW Section 7.4. Quoted directly into the handoff package so client can see the terms without flipping back to the SOW.

```markdown
# Off-Ramp Option — [Client]

After 12 months of operate phase (target date: [12 months post-operate-start]), Client may elect to take in-house ownership of the deployed stack.

## What off-ramp includes

- **Comprehensive handoff documentation refresh:** ~2 weeks of AIS work, included at no additional cost
- **Training sessions for Client's internal operators:** up to 10 hours, included
- **Optional ongoing "support retainer":** € [amount]/month for backstop coverage (Client's option, terminable on 30 days' notice)

## Off-ramp timeline

- Client provides 30 days' written notice of intent to off-ramp
- AIS prepares refreshed handoff package (2 weeks)
- Joint training sessions (1–2 weeks)
- Operational handoff complete
- Operate retainer ends; support retainer (if elected) begins

## What you take ownership of

- All deployed agent configurations (engagement-specific)
- All voice samples (client-side IP)
- All tool integrations (under client's accounts)
- All historical audit trails
- All documentation

## What stays with AIS

- The Agentic OS platform layer (we license its use to you perpetually for this deployment, but don't transfer ownership)
- Generic agent architecture patterns
- AIS methodology and IP

## After off-ramp

- Client operates the stack independently
- AIS available for support retainer (if elected) or for project-based engagements (e.g. adding a new agent, expanding scope)
- Client retains the deployed stack indefinitely; no termination terms apply

## When off-ramp doesn't fit

Some clients reach 12 months and prefer to continue full operate phase indefinitely. That's also fine — operate phase continues until either party terminates per SOW Section 7.3.
```

---

## Document 07 — Training materials

The handoff training session is recorded. Materials include:

- Training deck (slides used in the session)
- Recording of the training session (90 min)
- Quick-reference card (one-page PDF — escalation paths, weekly checklist, common situations)

---

## Document 08 — First weekly digest example

A real example of what the function owner will receive weekly. So they know what to expect.

```markdown
# Weekly Digest — [Client] — Week of [Date]

## Performance

| Metric | This week | Last week | 4-week avg |
|---|---|---|---|
| [Primary metric] | | | |
| [Secondary metric] | | | |

## What the stack did this week

[Summary of activity per agent — outputs sent, classifications made, escalations handled]

## Sampling results

You sampled [N] outputs this week:
- [%] Strong
- [%] Acceptable
- [%] Weak

[Specific feedback worth noting — patterns in Weak ratings, suggestions for improvement]

## Escalations

[Any P1/P2/P3 events handled this week, with status]

## Improvements shipped

[Any changes deployed this week]

## Improvements pending your approval

- [Improvement 1 — what it does, why, what we need from you to approve]

## Look ahead

[Notable upcoming items: voice refresh due, scope discussion scheduled, integration update planned]

## Questions for you

[Anything we need clarification on]
```

---

## Notes for cofounders preparing the handoff

### Customization

Every section above is a template. Per-engagement customization is required for:
- Tool names, URLs, channels, contact info
- Vertical-specific compliance language (specialty legal: privilege/confidentiality protocols)
- Vertical-specific operational rhythms (Slovenian businesses: in-person QBR option)
- Function-specific run-book content

### What not to include

- Don't include sensitive cofounder-only notes (e.g. "client may try to expand scope without paying — watch for this")
- Don't include other clients' data, examples, or templates
- Don't include AIS-internal pricing rationale (the SOW has commercial terms; handoff is operational)

### Quality bar

The handoff package should answer 95% of operational questions the function owner has in the first 90 days. The other 5% legitimately requires AIS contact. If the function owner is calling for things the package should have covered, the package is incomplete — update the template.

### Living document

The handoff package becomes the operating documentation. It should be updated through operate phase as:
- Configurations change
- Scope evolves
- Integrations swap
- Voice samples refresh

A handoff package that ends up stale 6 months in is a Retention Agent failure (see `agents/retention-agent.md`). The function owner's most-frequently-asked questions should be the package's most up-to-date sections.
