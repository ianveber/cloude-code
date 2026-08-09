# Operator Agent

Owns the day-to-day execution of the bought function. Vertical-specific by definition — the Operator Agent is a meta-spec configured per engagement based on which function the client bought.

This file documents the meta-structure: how to scope, configure, and deploy an Operator Agent for a specific engagement. The agent itself takes a different shape in every deployment.

---

## Function ownership

**Owns (in general — specifics depend on engagement):**
- The day-to-day execution of one bounded function inside the client's business
- Routine decisions inside that function (with documented decision rules + escalation thresholds)
- Outputs delivered to internal stakeholders or external customers, as defined in engagement charter
- Hand-offs to client-side humans or other agents in the stack

**Does not own:**
- Strategic decisions about the function (those belong to the client-side function owner)
- Anything outside the scoped function (scope creep is the killer — guard against)
- Cross-functional coordination beyond the function's natural boundary
- Customer-facing escalations (handoff to client-side human is required)

**Hard boundary:** scope is defined in the engagement charter at build phase, and changes only via formal scope-change request with cofounder approval. The Operator Agent does NOT grow into adjacent functions because someone asks nicely.

---

## How to scope an Operator Agent for a new engagement

This is the meta-process. Apply during scoping phase (see `/delivery/scoping-questionnaire.md` once Phase 4 ships).

### Step 1 — Name the function

Specific. Bounded. State the function the agent owns in one sentence.

Examples:
- "Intake-to-scoped-memo for new client inquiries at [legal firm]"
- "Monthly client invoicing and follow-up for [Slovenian accounting firm]"
- "First-touch outbound and meeting-booking for [B2B SaaS company]'s SDR-led demand-gen function"

If the sentence requires "and" multiple times, the function isn't bounded. Re-scope.

### Step 2 — Map the inputs and outputs

What does the function consume? What does it produce? Who provides inputs, who receives outputs?

Example for "monthly client invoicing":
- Inputs: time entries from cofounders/staff, retainer agreements with billing terms, prior month's invoice history
- Outputs: drafted invoices delivered to billing system, follow-up reminders sent to clients past due
- Input providers: cofounders, staff, accounting system
- Output recipients: clients, accounting system, owner-operator (for review)

### Step 3 — Document the routine decisions

What decisions does the function involve that get made the same way most of the time? Those are agent-ownable.

Example for "monthly client invoicing":
- Standard hourly rate by service type → agent decides
- Prorated billing for mid-month engagement starts → agent decides per formula
- Late-payment reminder cadence (day 7, 14, 21 of unpaid) → agent decides
- Decision to escalate non-paying client to legal action → owner-operator decides (escalation, not agent-owned)

### Step 4 — Define escalation thresholds

When does the agent stop and hand off to a human?

Example for "monthly client invoicing":
- Unusual invoice amount (>2x median for this client) → escalate before sending
- Late-payment >30 days → escalate to owner-operator
- Client dispute on invoice → escalate immediately
- Tax / VAT calculation ambiguity → escalate to accountant

### Step 5 — Define tools and integrations

What systems does the agent need to read from / write to?

Example: client accounting system (Pantheon, e-računi.si), email for invoice send, calendar (knowing when to run monthly), prior invoices archive.

### Step 6 — Name the human owner

Always required. Per `docs/principles.md` rule 2 — no floating AI.

### Step 7 — Define success metrics

Quantitative: invoice timeliness, payment-on-time rate, error rate.
Qualitative: client satisfaction with invoicing experience, owner-operator satisfaction with the function being off their plate.

### Step 8 — Document failure modes

What can go wrong specific to this engagement? Anticipate, don't discover.

### Step 9 — Build the spec

Take the above and write a per-engagement Operator Agent spec in `/engagements/[client-name]/operator-agent-spec.md`. Follow the canonical template in `/agents/_template.md` adapted for this specific function.

---

## Common Operator Agent configurations (examples by vertical)

These are illustrative — actual configurations are per-engagement.

### Specialty legal — Intake triage and conflict screening

- **Function:** First-pass intake triage. Capture inquiry, qualify against firm's scope (matter type, jurisdiction, urgency), conflict-screen against database, route qualified intakes to right partner with structured brief, schedule discovery call.
- **Inputs:** Web form submissions, email inquiries, partner-forwarded contacts
- **Outputs:** Routed intake briefs, conflict-check results, scheduled discovery calls, follow-up sequences for non-immediate-fit
- **Escalation:** Borderline conflicts → paralegal manual lookup. Edge-case matter types → partner review. Client expressing urgency → partner immediately.
- **Human owner:** Intake paralegal (operator), sponsoring partner (accountable)
- **Tools:** Practice Management Software API (Clio/MyCase/etc.), email, calendar
- **Success:** intake-to-scope time <48h, qualification accuracy >90%

### B2B SaaS — Pipeline reporting and forecast hygiene

- **Function:** Daily/weekly/monthly pipeline reporting + forecast accuracy retrospectives + anomaly detection
- **Inputs:** CRM data (deal-stage changes, activity logs, forecast categories), historical forecast vs. actual data
- **Outputs:** Daily pipeline movement summary, weekly forecast accuracy review, monthly retrospective with named anomalies and suggested investigations
- **Escalation:** Deals likely to slip (low activity + forecast date approaching) → AE notification. Sudden volume changes → VP Sales escalation. Forecast accuracy degrading systematically → CRO review.
- **Human owner:** RevOps lead or VP GTM
- **Tools:** CRM API, data warehouse (if any), Slack for delivery
- **Success:** forecast accuracy improvement quarter-over-quarter, anomalies surfaced within 24h of trigger

### Slovenian aesthetic clinic — Client intake + appointment scheduling + retention messaging

- **Function:** Capture new inquiry, qualify treatment fit, schedule consultation, send reminders, post-treatment care messages, re-booking prompts at appropriate intervals
- **Inputs:** Web form, Instagram DMs, phone notes (transcribed), appointment system
- **Outputs:** Confirmed appointments, follow-up messages, treatment-care content, re-booking prompts at clinically-appropriate intervals
- **Escalation:** Medical questions → clinician. Pricing pushback → clinic owner. Complaints → clinic owner immediately.
- **Human owner:** Front-desk staff or clinic owner (small clinic, both same person)
- **Tools:** Clinic management system, email + SMS, Instagram messaging
- **Success:** consultation show-up rate >80%, rebooking rate >50% within recommended interval

### Slovenian accounting firm — Monthly client reporting and follow-up

- **Function:** Generate monthly client reports (P&L, cash position, KPI dashboard against client-specific metrics), deliver to client with cover note, queue follow-up call invitations for clients whose numbers show concerning patterns
- **Inputs:** Accounting system data (Pantheon, e-računi.si), client-specific KPI definitions, prior months' reports
- **Outputs:** Drafted monthly reports per client, queued follow-up call invitations, anomaly alerts to partner-in-charge
- **Escalation:** Material accounting irregularities → partner. Client concerning patterns (cash burn, revenue drop) → partner. Client requesting tax/legal advice → partner.
- **Human owner:** Partner-in-charge of each client portfolio
- **Tools:** Accounting system API, document generation, email
- **Success:** reports delivered by 7th of each month, partner spends <30 min reviewing each before send

---

## Common configuration patterns across all Operator Agents

### Always include

- A "review window" before any output ships externally (5–60 minutes depending on volume; agent queues output, human can intercept)
- Per-day output volume limits (prevents runaway behavior)
- A "kill switch" that pauses all agent activity if invoked by human owner (sometimes you just need to stop and figure something out)
- Logging of every action to a retrievable audit trail
- A weekly digest of activity to the human owner

### Vertical-specific patterns

- **Slovenian businesses:** Slovenian-language default for all outputs; in-person meeting offer as option in scheduling
- **Specialty legal:** privilege-protection language defaults, audit-trail granularity higher than standard, all outputs reviewable by sponsoring partner before external send during build phase
- **B2B SaaS:** integration tightness with existing tooling (Salesforce, HubSpot) is the make-or-break factor; less voice-locking concern than other verticals because B2B SaaS communication is more standardized

---

## Human owners

**AIS-side owner during build:** cofounder leading the engagement (varies by engagement).
- Approves: scope, escalation rules, output formats, integration architecture
- Escalates: scope changes, integration blockers, security questions, client-side personnel changes affecting operator role

**Client-side owner during operate:** named in engagement charter. Specific to the function.

---

## Escalation rules (meta — applies across Operator deployments)

The Operator Agent escalates when:

- Decision falls outside its documented decision rules
- Confidence on a routine decision is below 0.8
- Output would violate a vertical-specific compliance rule (legal, financial, medical, etc.)
- An external stakeholder expresses dissatisfaction or complaint
- Anomalous data appears (signal counts, volume patterns, expected-vs-actual gaps)
- Any integration error that can't be auto-retried
- Any output that the agent's reviewer-prompt flags as potentially problematic

---

## Success metrics (meta)

**Quantitative:** vary by function. Always defined in the engagement charter.

**Qualitative (always tracked):**

- Did the function actually get owned? (Did the client-side human stop being the bottleneck?)
- Is the human owner satisfied with the relationship (frequency of escalations, quality of escalation handling)?
- Are external stakeholders (customers, clients, partners) satisfied or unaware that an agent is involved?

---

## Failure modes (meta — patterns common across Operator deployments)

### Failure 1 — Scope creep

The function expands because client-side users find the agent useful and ask for adjacent work. Agent quietly absorbs. Margin collapses, agent quality degrades because it's now doing 3 functions imperfectly instead of 1 function well.

*Early warning:* Operator's monthly cost trending up without corresponding scope-change approval. Function description in monthly report no longer matches engagement charter.
*Mitigation:* Strict scope enforcement at engagement-charter level. Cofounder catches and re-scopes formally (with appropriate pricing changes) or refuses the addition.

### Failure 2 — Decision-rule decay

The documented decision rules made sense at build phase, but the function's reality drifts (client business changes, market changes, new edge cases appear). Agent keeps applying old rules. Output quality degrades.

*Early warning:* Escalations increasing month-over-month. Human owner overriding agent decisions more often.
*Mitigation:* Quarterly decision-rule review with human owner. Update rules based on observed escalation patterns.

### Failure 3 — Integration breakage

Client-side tool changes its API. Agent breaks. Until fixed, the function stalls.

*Early warning:* Integration error rate spikes. Outputs missing or malformed.
*Mitigation:* Monitoring alerts on integration health. Cofounder on-call for build-phase debugs. Documented manual fallback procedure so human can keep function running during fix.

### Failure 4 — Human owner stops sampling outputs

Client-side human owner is supposed to sample outputs weekly to catch quality drift. They stop because "it's working fine." Then a quality issue compounds for 6 weeks before someone notices.

*Early warning:* Human owner's sampling logs show zero engagement for 2+ weeks.
*Mitigation:* Sampling is part of the operate retainer terms. Cofounder check-in (monthly QBR or quarterly review): "are you sampling? show me." Real consequence: if sampling lapses, AIS pauses external-output deployment until sampling resumes.

### Failure 5 — Voice or judgment drift on customer-facing outputs

If the function involves customer-facing outputs (intake replies, appointment reminders, follow-up messages), voice or judgment can drift over time. Customer experience degrades. Often invisible until a customer complains.

*Early warning:* Sampled outputs scored Weak increasing. Customer-side complaint received that traces to an agent-generated output.
*Mitigation:* Pause external-facing outputs. Re-tune voice locking. Re-review decision rules. Resume with tighter human-approval loop until quality stabilizes.

---

## Voice and output requirements

- **Voice-locking threshold:** vertical-dependent. Standard 16+ for customer-facing outputs; not required for internal-only operational outputs (e.g. pipeline reports for internal team).
- **Output review cadence:** depends on output type. Customer-facing outputs require weekly sampling; internal-facing outputs can be sampled less frequently.

---

## Memory and learning

**Persisted across runs:**
- Every output + escalation logged
- Decision-rule overrides (when human overrides agent, the override + reasoning is logged for future rule update)
- Performance metrics over time

**Learning loops:**
- **Per output:** if reviewed and flagged, the flag becomes a training signal for next iteration
- **Weekly:** sampling review with client-side owner
- **Monthly:** performance retrospective
- **Quarterly:** decision-rule review and update

---

## Cost model

Highly variable per engagement. Range €400–€1500/month per Operator deployment in operate phase.

Drivers:
- Function volume (high-volume functions cost more in inference + integration)
- Integration count
- Output review intensity (high-touch review reduces inference cost per output but increases human-time cost)
- Voice-locking complexity
