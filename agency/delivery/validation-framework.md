# Validation Framework

Pre-handoff QC. Confirms the agent stack is ready for operate phase. Confirms the client-side function owner is ready to take operational responsibility.

Phase 5 of the delivery workflow. Duration: 1 week. Owner: lead cofounder. Output: validation report + formal client-side acceptance.

The validation phase exists because build phase's natural pressure (ship and move on) can hide late-stage defects. Validation is the last net.

---

## Validation activities by day

### Day 1 — Output quality validation (cofounder)

#### Activity
Sample 30+ outputs per deployed agent (60+ for high-volume agents). Score each on:

- **Correctness:** is the output correct per the agent's stated function?
- **Completeness:** does it include all required elements?
- **Voice match:** does it sound like the target voice?
- **Routing accuracy:** if the output involves classification or routing, is it correctly classified/routed?
- **Compliance:** does it meet any vertical-specific compliance rules?

#### Sampling distribution
- 50% random sampling from the last 14 days of outputs
- 30% targeted sampling on output types that historically had quality issues
- 20% adversarial sampling — outputs the cofounder believes might be problematic (selected via intuition + audit log scan)

#### Scoring
Each output rated Strong / Acceptable / Weak with a one-sentence reason.

#### Pass criteria
- >80% Strong + Acceptable
- <10% Weak
- Zero Critical Failure outputs (defined as: any output that would cause real-world harm — wrong legal advice, off-brand external comms, customer-facing error, compliance breach)

#### Output: `validation/output-quality-report.md`

Sample-by-sample log with ratings. Cofounder's narrative summary at the top: "Quality is at X level. Specific concerns: [list]. Recommended action: [proceed / extend build for affected agents / specific remediation]."

---

### Day 2 — Integration health validation (cofounder + Ian)

#### Activity
For every integration in the deployed stack:

- API endpoint health check (responses match expected schema)
- Authentication health (credentials valid, rotation tested if applicable)
- Rate limit awareness (current usage well below limits)
- Error handling (intentionally trigger failure modes; confirm graceful handling)
- Recovery (simulate integration outage; confirm system recovers cleanly)
- Audit trail (every integration call logged with timestamp + payload + result)

#### Specific tests
- Trigger a known error response from each integration → confirm agent escalates rather than silently retrying forever
- Trigger a rate-limit response → confirm agent backs off correctly
- Disable an integration credential temporarily → confirm agent surfaces the failure within the SLA window
- Re-enable credential → confirm agent resumes without manual intervention

#### Pass criteria
- All integrations pass health checks
- All failure scenarios handled gracefully (no silent failures)
- Audit trail complete (no integration calls missing from logs)
- Recovery from simulated outages within documented SLA

#### Output: `validation/integration-health-report.md`

Per-integration health table. List of tested failure scenarios with pass/fail. Cofounder narrative: "Integrations healthy / specific concerns / required fixes before handoff."

---

### Day 3 — Voice-locking validation (cofounder + client function owner + Anej/Nejc for Slovenian)

#### Activity
- Drift detection score: current outputs vs. baseline voice samples
- Qualitative review: client function owner reads 20 samples from the last 14 days and rates voice match
- Vertical-specific review: Slovenian engagements get a native-Slovenian cofounder review for register accuracy; specialty legal gets sponsoring partner review for legal register

#### Pass criteria
- Drift detection within ±10% of baseline (or within ±15% with documented reason and active monitoring plan)
- Client function owner rating: ≥4/5 on voice match across 20-sample review
- No outputs in the review that the function owner would NOT have signed off on themselves

#### Output: `validation/voice-locking-report.md`

Drift detection numbers. Function owner ratings with quotes. Vertical-specific reviewer notes. Cofounder recommendation.

---

### Day 4 — Stakeholder readiness validation (cofounder + client function owner + sponsor)

#### Activity
- **Operator independence test:** function owner operates the system for 4 hours without cofounder intervention. Cofounder observes (recording or in-room) but doesn't intervene unless safety requires.
- **Escalation path test:** function owner triggers a P2 escalation through the documented path. Cofounder responds per SLA. Timing measured. Path validated.
- **Sampling discipline check:** function owner demonstrates the sampling protocol (where to find outputs, how to rate, where to log).
- **Improvement-request test:** function owner submits an improvement request through the documented channel. Cofounder receives and responds.

#### Sponsor-level readiness
- Sponsor reviews the operate-phase rhythm (weekly digest cadence, monthly review schedule, QBR schedule)
- Sponsor confirms billing arrangements and operate retainer invoice timing
- Sponsor confirms named-owner continuity (function owner staying in role; named successor if function owner leaves)

#### Pass criteria
- Function owner operates the system independently for 4 hours without intervention
- Escalation paths working per SLA
- Sampling discipline understood and demonstrable
- Sponsor confirms operational readiness

#### Output: `validation/stakeholder-readiness-report.md`

Activity log. Observations from the operator independence test (what worked, what was rocky, what needs more training). Recommendation.

---

### Day 5 — Documentation completeness validation (cofounder + Onboarder Agent)

#### Activity
Audit the handoff documentation package against the template in `delivery/handoff-docs-template.md`. Every required document present, current, and accurate.

#### Documents to verify
- [ ] Per-agent specs (one per deployed agent)
- [ ] Run-book (covers daily / weekly / monthly operations)
- [ ] Escalation paths document (with current phone numbers, Slack channels)
- [ ] Monitoring access guide
- [ ] Quarterly review schedule
- [ ] Off-ramp option terms (per SOW Section 7.4)
- [ ] Training session materials
- [ ] First weekly digest example (so function owner knows what to expect)

#### Pass criteria
- Every document present
- Every document current (dates within last 14 days)
- Every document accurate (cross-checked against actual deployed configuration)
- Function owner has read at least: per-agent specs + run-book + escalation paths

#### Output: `validation/documentation-completeness-report.md`

Document-by-document checklist. Any gaps identified. Cofounder narrative.

---

## Validation report

End of Day 5, lead cofounder compiles the validation report:

```markdown
# Validation Report — [Client name]

**Date:** YYYY-MM-DD
**Lead cofounder:** [Name]
**Build phase end date:** [Date]
**Operate phase target start:** [Date]

## Overall recommendation

[ ] Proceed to handoff
[ ] Extend validation by [N days] (specific remediations required: [list])
[ ] Return to build phase (specific issues requiring re-build: [list])

## Per-category results

| Category | Pass/Fail | Notes |
|---|---|---|
| Output quality | ✅/⚠️/❌ | [one sentence] |
| Integration health | ✅/⚠️/❌ | [one sentence] |
| Voice locking | ✅/⚠️/❌ | [one sentence] |
| Stakeholder readiness | ✅/⚠️/❌ | [one sentence] |
| Documentation completeness | ✅/⚠️/❌ | [one sentence] |

## Outstanding items (if any)

- [ ] [Item with owner and target date]
- [ ] [Item with owner and target date]

## Risks identified during validation

- [Risk with mitigation plan]

## Recommended next steps

[Specific actions to move to handoff]

## Client-side acceptance

- Function owner acceptance: [signed acceptance email link]
- Sponsor acceptance: [signed acceptance email link]
```

---

## Client-side acceptance protocol

Formal sign-off from both client-side roles before declaring validation complete:

### Function owner acceptance
Function owner sends an email (or signs a brief acceptance document) confirming:
- They have operated the system independently for the required test period
- They understand their operate-phase responsibilities (sampling, escalation, monthly review attendance)
- They have read the handoff documentation
- They accept the system as ready for operate phase

### Sponsor acceptance
Sponsor sends an email (or signs a brief acceptance document) confirming:
- They have reviewed the validation report
- They confirm the named owners are in place
- They accept the operate-phase rhythm and commercial terms
- They authorize the handoff

If either acceptance is delayed, validation is incomplete. Don't proceed to handoff until both acceptances are documented.

---

## What to do if validation fails

### Output quality below threshold

- Identify which agent(s) are failing
- Determine if it's a voice issue (extend voice sampling), decision-rule issue (tighten rules), or scope issue (re-scope)
- Roll affected agent back to Week 3 conditions
- Re-run Day 1 validation for the affected agent after remediation
- If output quality can't be brought to threshold within 2 weeks, cofounder-level discussion: re-scope, accept partial deployment, or terminate

### Integration health failing

- Diagnose root cause
- Fix integration code or escalate to tool vendor
- Re-run Day 2 validation for the affected integration
- If integration cannot be made healthy, decision: workaround (e.g. paralegal manual conflict-check fallback) or scope reduction

### Voice locking failing

- Refer to `agents/16-sample-voice-locking.md` failure-mode guidance
- Possible paths: expand samples, run extraction interviews, narrow deployment scope, accept lower-stakes deployment only

### Stakeholder readiness failing

- Most common cause: wrong function owner named, or named owner under-prepared
- Cofounder-level conversation with sponsor: do we have the right operator? Can we train them up? Or do we need to replace the named owner?
- May extend onboarding-style preparation by 2 weeks

### Documentation incomplete

- Easiest validation failure to remediate (usually a few days of writing)
- Lead cofounder allocates the time
- Re-run Day 5 validation when documents are complete

---

## When validation passes with concerns

Sometimes validation passes the gates but the cofounder has reservations. Common patterns:

- "Output quality is at 81% Strong+Acceptable but the Weak outputs are concentrated in one workflow"
- "Voice locking is acceptable but the function owner's enthusiasm seems lukewarm"
- "Documentation is complete but feels thin in the escalation section"

In these cases: document the concern in the validation report. Recommend either (a) extend validation by 3–5 days to address, or (b) proceed with explicit monitoring of the concern area in the first 30 days of operate phase.

Don't paper over concerns to hit a target operate-start date. Concerns become incidents in operate phase.

---

## Validation as a feedback loop

Each validation produces signal about how to improve the build phase. After validation completes:

- What did validation catch that build phase missed?
- Would changing the build checklist have caught it earlier?
- Update `delivery/build-checklist.md` with the learning

Validation should catch fewer issues over time as build phase incorporates the learnings. If validation keeps catching the same kind of issue across engagements, the build checklist is broken.

The same applies to validation passing too easily. If validation never catches issues, either the engagements are running cleanly (good) or the validation gates are too loose (bad). Cofounder retrospective quarterly: are validation gates calibrated correctly?
