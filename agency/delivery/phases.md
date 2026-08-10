# The 6-Phase Delivery Workflow

Every engagement runs through these six phases. They are not optional. They are not reorderable. Skipping a phase produces engagements that fail in operate phase, miss the contribution-margin target, or burn cofounder time fixing what should have been caught upstream.

Read this file before any new engagement starts. Every other file in `/delivery/` is a tool used inside one of these phases.

---

## Phase summary

| # | Phase | Duration | Lead | Deliverable |
|---|---|---|---|---|
| 1 | Discovery | 1 call, 30–45 min | Cofounder leading | Discovery summary + go/no-go decision |
| 2 | Scoping | 1–2 weeks | Cofounder leading | Completed scoping questionnaire + signed SOW |
| 3 | Onboarding | 1–2 weeks | Anej + Onboarder Agent | 100% access + 16+ voice samples + kickoff complete |
| 4 | Build | 6–12 weeks (engagement shape dependent) | Ian + Builder workflow | Deployed agent stack, voice-locked, integrated, ladder-graduated |
| 5 | Validation | 1 week | Cofounder leading | Validation report + formal client-side acceptance |
| 6 | Handoff | 1 week + ongoing | Cofounder leading | Handoff documentation package + operate phase begins |

Total elapsed: ~10–16 weeks from first discovery call to operate-phase day 1. Build phase is the longest single phase and varies most with engagement shape.

---

## Phase 1 — Discovery

### Goal

Qualify or disqualify the prospect against the four-axis test (see `verticals/_selection-framework.md`). Size the engagement to one of the three shapes (Compact / Standard / Comprehensive). Decide whether to advance to scoping or refuse / refer.

### Trigger

Inbound inquiry (from Acquirer Agent's outbound, partnership referral, direct contact, content-driven inbound).

### Pre-discovery

Cofounder pulls together a brief:
- Prospect company background (10 min of research)
- Source of inquiry (which Acquirer signal, which referral source)
- Vertical match (which playbook applies — or candidate vertical if not yet drafted)
- Initial hypothesis on engagement shape

### Discovery call

30–45 minutes. Use the script in `delivery/discovery-script.md`. Cofounder leads. Notes captured during the call (or via meeting recorder with transcription).

### Discovery summary

Within 24 hours of the call, cofounder writes a one-page summary:

- Prospect company + buyer
- Function being discussed
- Four-axis assessment (pass / fail on each axis with one-sentence rationale)
- Sizing assessment (Compact / Standard / Comprehensive)
- Recommended next step (advance to scoping / refer out / disqualify)
- Cofounder-level questions raised (if any)

### Exit criteria

- **Advance to scoping:** prospect passes all four axes, sizing is clear, cofounder confidence is high. Scoping conversation scheduled within 7 days of discovery call.
- **Refer out:** prospect fails one or more axes but the inquiry is legitimate. Send the referral with a short note explaining why we aren't a fit but who is.
- **Disqualify:** prospect fails the must-pass questions on the discovery script (no authority, no operator, wants paid media, etc.). Polite decline; no referral.

### Failure modes

- **Cofounder over-qualifies in the call** (talks themselves into a prospect that fails one or more axes because the conversation went well). Mitigation: write the discovery summary before the next conversation; the four-axis assessment forces honesty.
- **Discovery summary not written.** Cofounder remembers the call vividly for 48 hours and then forgets details. Mitigation: 24-hour SLA on the summary; built into cofounder week's rhythm.
- **Scoping scheduled too far out.** Prospect cools, engagement slips. Mitigation: scoping conversation within 7 days, or note explicitly why a longer gap is being scheduled.

---

## Phase 2 — Scoping

### Goal

Deeply understand the function being bought. Document scope boundaries (in / out / future). Identify integrations, named owners, success metrics, risks. Draft and sign the SOW.

### Trigger

Discovery summary approving advancement.

### Scoping conversations

Typically 2 conversations of 60–90 minutes each (sometimes 1 longer session, sometimes 3 shorter sessions). Use the scoping questionnaire in `delivery/scoping-questionnaire.md` as the structured backbone.

Conversation 1: function deep-dive. Who currently does this work, how, with what tools, with what bottlenecks. What does success look like.

Conversation 2: technical-and-organizational scoping. Integration inventory. Stakeholder map. Named owners. Voice-sample plan. Timeline constraints. Risks.

Between sessions: async questionnaire completion by client (sent after Conversation 1 with sections we still need to fill in).

### SOW drafting

Cofounder leading drafts the SOW within 3 business days of completed scoping using `delivery/sow-template.md`. SOW is reviewed by at least one other cofounder before sending.

### SOW review and signing

Client reviews. Common iteration: 1–2 rounds of revision (typically around scope boundaries, payment terms, off-ramp specifics). Aim to close in 7–14 days from first SOW send.

### Exit criteria

- SOW signed by both parties
- Build fee first installment (50%) invoiced
- Engagement charter (extracted from SOW) added to `/engagements/[client-name]/` with all key terms
- Cofounder roles for the engagement formally assigned (lead cofounder, supporting cofounder, agent-deployment owner)

### Failure modes

- **Scope creep during scoping.** Client mentions adjacent functions; cofounder absorbs into scope without re-pricing. Mitigation: scope-change discipline; every additional function gets its own pricing band assessment.
- **Buyer asks for terms we don't offer** (hourly billing, seat licensing, paid-media inclusion). Mitigation: don't negotiate into anti-pattern terms; restructure to fit our model or refer out.
- **SOW round-trip takes >3 weeks.** Engagement loses momentum. Mitigation: cofounder explicit follow-up at day 7 and 14; if no signed SOW by day 21, the engagement is paused (the prospect's organization isn't ready).

---

## Phase 3 — Onboarding

### Goal

Collect everything we need to start build phase. Align stakeholders. Provision access. Initiate voice-sample collection. Schedule kickoff. Ready Week 1 of the build ladder.

### Trigger

Signed SOW + first invoice paid (or formal payment confirmation in flight).

### Onboarding sequence

Anej drives. Onboarder Agent automates the messaging cadence. Use `delivery/onboarding-kit.md` for the standard sequence.

Day 1: welcome email + scope reminder + onboarding plan delivered
Day 2: access provisioning requests issued
Day 3: document collection requests issued
Day 5: voice sample collection requests issued
Day 7: kickoff call scheduled (target: kickoff in week 2 of onboarding)
Days 7–14: gather, validate, iterate; address blockers

### Kickoff call

60 minutes. Attendees: AIS-side lead cofounder + supporting cofounder, client-side sponsor + client-side function owner(s).

Agenda:
- Re-confirm scope and success metrics (10 min)
- Walk through onboarding plan and confirm timeline (15 min)
- Introduce the build-phase rhythm (15 min) — weekly cadence, ladder steps, what client should expect to do each week
- Voice-locking interview if needed (20 min)

### Exit criteria

- 100% of critical access provisioned
- 16+ voice samples collected and validated (25+ for specialty legal)
- Required documents collected (per scoping questionnaire's specification)
- Kickoff call held; both sides aligned on Week 1 plan
- Build phase formally starts on a named date

### Failure modes

- **Client onboarding fatigue.** See `agents/onboarder-agent.md` failure mode 1.
- **Voice sample collection fails.** Pivot to extraction-interview workflow (see `agents/16-sample-voice-locking.md`).
- **Access provisioning blocked by client-side IT.** Cofounder escalates to client sponsor; consider scope sequencing around the blocked access.
- **Wrong client-side owner named** at SOW. Discover during onboarding when the named owner is absent or wrong fit. Cofounder-level conversation to update the engagement charter.

---

## Phase 4 — Build

### Goal

Deploy the agent stack. Each agent walks the 30-day onboarding ladder (see `agents/work-chart.md`). At the end of build phase, all agents in the stack pass external-deployment quality gates and are ready to transition to operate phase.

### Trigger

Onboarding phase exit. Week 1 begins on a named date.

### Build rhythm

Use `delivery/build-checklist.md` for the week-by-week execution plan.

**Per-agent ladder (each agent):**
- Week 1 — read-only
- Week 2 — draft mode
- Week 3 — internal autonomy
- Week 4 — external deployment

**Engagement-wide rhythm:**
- Weekly check-in (30 min) between AIS-side lead and client-side function owner
- Weekly cofounder retrospective (15 min, internal) on the engagement's health
- Weekly digest published to client-side sponsor

### Multi-agent engagements

Agents can be on different ladder steps simultaneously. Typical pattern:
- Week 1: Knowledge Agent ingests; Acquirer + Closer enter read-only mode
- Week 2: Knowledge serving retrieval; Acquirer + Closer enter draft mode; Operator (if applicable) ingests
- Week 3: Acquirer + Closer internal autonomy; Operator draft mode
- Week 4: Acquirer + Closer external; Operator internal autonomy
- Week 5: Operator external (with extra week of internal autonomy if function is high-stakes)
- Weeks 6+: stabilization, voice tuning, integration depth

Compact engagements compress this into 6 weeks. Comprehensive engagements stretch to 12 weeks (more agents, more integration, more voice depth).

### Build fee second installment

Triggered by exit from Build phase (transition to Validation). 50% of build fee invoiced.

### Exit criteria

- All agents in the stack passing external-deployment quality bar (per ladder success metrics)
- Integration health green across all tools
- Voice-locking complete (16+ samples, drift detection enabled)
- Build-phase audit trail complete
- Client-side function owner can articulate the agent stack's operation

### Failure modes

- **Ladder step skipped under client pressure.** A `docs/principles.md` rule 7 violation. Mitigation: lead cofounder refuses; if client insists, escalate to all-cofounder discussion; if still pushed, refuse and document.
- **Voice-locking quality below acceptable.** Reset to Week 2 draft mode for the affected agent; iterate samples until locking succeeds.
- **Integration breakage.** Detected via build-checklist's integration-health checks. Fix before advancing the affected agent.
- **Cofounder over-commitment.** Build phase requires consistent cofounder time. If cofounder pipeline overloads, advance only the engagements that are on schedule; pause others with formal client communication.

---

## Phase 5 — Validation

### Goal

Pre-handoff QC. Confirm the agent stack is ready to operate without intensive AIS supervision. Confirm the client-side owner is ready to take operational responsibility.

### Trigger

Build phase exit.

### Validation activities

One week of structured validation. Use `delivery/validation-framework.md` for the full checklist.

Day 1: output quality validation — sample 30+ outputs across the agent stack, score them, document deviations.
Day 2: integration health validation — every API connection tested with edge cases, recovery from simulated failures.
Day 3: voice-locking validation — drift check + qualitative client-side review.
Day 4: stakeholder-readiness validation — client-side function owner can independently operate the system; sampling discipline established; escalation paths tested.
Day 5: documentation completeness validation — every handoff doc is present and accurate.

### Validation report

Cofounder leading writes a 1–2 page validation report:
- Pass / fail per validation category
- Outstanding items (if any) with owner and target date
- Recommendation: proceed to handoff / extend validation / extend build

### Exit criteria

- All validation categories pass (or have explicit cofounder-approved exception with mitigation)
- Client-side function owner formally accepts handoff (signed acceptance email or document)
- Operate-phase first month invoice scheduled

### Failure modes

- **Output quality validation reveals systemic issue.** Don't ship. Re-enter build phase for the affected agent until quality stabilizes.
- **Client-side owner not ready.** Sometimes the named owner has changed during build phase; sometimes they were always under-prepared. Extend onboarding-style preparation; consider operator-substitution conversation with client sponsor.
- **Documentation gaps.** Often invisible until validation. Build-checklist should catch most documentation issues earlier; validation is the last net.

---

## Phase 6 — Handoff

### Goal

Transition the engagement from build phase to operate phase. Document handoff. Train client-side operator. Initiate operate-phase rhythm. Build fee second installment paid; operate retainer first month begins.

### Trigger

Validation report passed.

### Handoff activities

#### Day 1 — Handoff documentation package delivered

Per `delivery/handoff-docs-template.md`:

- Per-agent spec (configured for this engagement)
- Run-book (day-to-day operation guide)
- Escalation paths (who to call when, with phone numbers / Slack channels)
- Monitoring access guide (where to see what the agents are doing)
- Quarterly review schedule
- Off-ramp option terms

Delivered as a `/engagements/[client-name]/handoff/` folder containing all documents, plus a single summary PDF.

#### Day 2–3 — Training session

90-minute session with client-side function owner. Walk through:
- Monitoring (how to see what's happening)
- Sampling (what to look at weekly, how to score, where to log)
- Escalation (when to call us, how, what to expect)
- Improvement requests (how to ask for tweaks)
- Off-ramp option (what triggers it, what it looks like)

Recorded for future reference.

#### Day 4 — First weekly digest delivered

The operate-phase rhythm begins. Weekly digest from the agent stack to the client-side function owner + sponsor. Confirms the system is operating and gives the first checkpoint for any issues.

#### Day 7 — Operate phase formally begins

Build fee second installment invoiced. Operate retainer first month invoiced. Cofounder time on this engagement transitions from build-phase intensive to operate-phase rhythm.

### Operate phase rhythm

Continues until the client off-ramps (12+ months typical) or terminates.

Cofounder time allocation:
- Weekly: monitor health digest (~15 min), respond to escalations (variable)
- Monthly: monthly review with client-side sponsor + function owner (~60 min)
- Quarterly: QBR (~90 min) — review performance, discuss expansion, refresh voice samples

Total ongoing cofounder time per engagement in operate phase: 4–8 hours/month.

### Exit criteria for the build-to-operate transition

- Handoff documentation delivered
- Training session completed
- First weekly digest delivered
- Client-side function owner actively sampling outputs
- First month of operate retainer paid

### Failure modes

- **Client-side owner stops sampling immediately.** Operator buy-in evaporates. Mitigation: monthly cofounder check-in catches this; sampling lapse is a contractual concern (operate retainer terms require sampling).
- **Documentation handed off but never read.** Common pattern; client refers back only when something breaks, then asks questions that are answered in the docs. Mitigation: training session walks through the docs structure so the client knows where to look later.
- **Build-fee second installment not paid.** Cofounder follow-up; if unresolved at day 14 post-invoice, escalate to engagement-level conversation.

---

## What happens after operate phase begins

Operate phase is governed by the retainer terms in the SOW. Common patterns:

- **Quarterly review:** scope adjustment opportunities, voice refresh, performance retrospective
- **Expansion conversations:** when Retention Agent surfaces signals (see `agents/retention-agent.md`)
- **Off-ramp at 12+ months:** client takes the stack in-house with knowledge-transfer package + reduced support retainer (per `docs/services.md`)
- **Termination:** 60-day notice during operate phase per SOW terms; we hand off documentation and stack with no claw-back

The 6-phase delivery workflow ends at the start of operate phase. The agency's relationship with the client continues; the build engagement is complete.

---

## When to deviate from the workflow

Rarely. The workflow exists because every deviation we've considered has been more expensive than the workflow's structure. Common pressure points:

- **"We can skip discovery, this is a referral from [trusted person]."** No. Discovery's purpose is qualifying the function and the buyer, not validating the referral. Trusted referrals still fail axes.
- **"Can we compress scoping into one conversation?"** Rarely. The async questionnaire between sessions captures detail that wouldn't surface in a single conversation. Maybe for the smallest Compact engagements.
- **"We need to start build immediately, scope can catch up."** No. Build without scope is freelancing dressed as agency work. Refuse.
- **"Can we skip validation?"** No. Validation catches what build missed. Skipping it is how operate phase starts with hidden defects.

When pressure to deviate appears, document why. If pressure persists, all-cofounder discussion. Don't quietly compress the workflow under pressure — that's how the model erodes.
