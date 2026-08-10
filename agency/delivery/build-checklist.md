# Build-Phase Checklist

Week-by-week execution plan for Phase 4 (Build). Mirrors the 30-day onboarding ladder (per `agents/work-chart.md`) plus voice-locking timeline plus integration milestones plus stakeholder communication cadence.

Used by Ian + the cofounder leading the engagement. Each week has named deliverables and an exit gate.

The checklist scales: Compact engagements compress to 6 weeks, Standard runs 10 weeks, Comprehensive runs 12 weeks. The structure below shows the Standard 10-week template; compression notes appear at each week.

---

## Pre-week-1 — Build-phase readiness

Before Week 1 begins, the lead cofounder verifies:

- [ ] Onboarding-phase exit checklist completed (per `delivery/onboarding-kit.md`)
- [ ] Builder workflow ready: vertical playbook pulled into engagement context, ICP / function definition loaded, voice samples indexed
- [ ] Agent stack configured (which agents will be deployed, in what sequence)
- [ ] Tool integrations stubbed (API credentials confirmed, sandbox connectivity verified)
- [ ] Engagement folder structure ready at `/engagements/[client-name]/build/`
- [ ] Internal weekly retrospective slot booked (lead + supporting cofounder, 15 min)
- [ ] Client-side weekly check-in scheduled (lead cofounder + client function owner, 30 min)

Build-phase Week 1 begins on the named date.

---

## Week 1 — Read-only mode (per agent)

### Goal
Agent ingests context. Demonstrates accurate comprehension. Zero write access.

### Per-agent activities

**For each agent in the deployment:**

- [ ] Load vertical-tuned configuration into agent runtime
- [ ] Load voice samples into Knowledge Agent index
- [ ] Run ingestion of agent-specific knowledge (SOPs for Operator, ICP for Acquirer, historical memos for Closer, etc.)
- [ ] Internal team query session: cofounder + client function owner ask the agent representative questions about the function it will own
- [ ] Document the agent's responses; grade comprehension
- [ ] Identify gaps in agent's context; expand ingestion if needed

### Stakeholder communication

- **Day 1:** Lead cofounder posts week-1 plan to client's working channel
- **Day 3:** Lead cofounder + function owner check-in (30 min) — review progress, surface blockers
- **Day 5:** Lead cofounder + function owner check-in (30 min) — comprehension review, confirm Week 2 readiness

### Week 1 exit gate

- [ ] Each agent in the deployment demonstrates accurate comprehension of its function
- [ ] Each agent can articulate the edge cases it would escalate
- [ ] Knowledge Agent retrieval quality verified (test queries return relevant results)
- [ ] No critical integration breakages

If exit gate fails: extend Week 1 by 3–7 days; investigate root cause (insufficient ingestion, prompt misalignment, knowledge gap).

### Compact engagement compression
Week 1 can compress to 5 days. Knowledge Agent ingestion runs in parallel with Acquirer/Closer/Operator ingestion. Comprehension review condensed to one session.

### Comprehensive engagement extension
Week 1 may extend to 10 days for large knowledge corpora (specialty legal firms with 5+ years of historical memos, B2B SaaS with multiple ICPs requiring separate ingestion tracks).

---

## Week 2 — Draft mode (per agent)

### Goal
Agent generates outputs. Every output intercepted by human reviewer (lead cofounder or designated AIS-side reviewer). <20% Weak rating.

### Per-agent activities

**For each agent:**

- [ ] Enable draft mode (agent generates, doesn't send)
- [ ] Lead cofounder reviews every output produced (samples increase from ~10/day to ~30/day as agent ramps)
- [ ] Each output graded Strong / Acceptable / Weak with one-sentence reasoning
- [ ] Weak ratings trigger immediate prompt-rule tightening
- [ ] Track cumulative output count + rating distribution
- [ ] Pattern detection: which output types underperform? Why?

### Voice locking activities (parallel to Week 2)

- [ ] Knowledge Agent's voice index serving samples to generation prompts
- [ ] Voice similarity checks run on each output (target: >0.75 similarity to sample distribution)
- [ ] Client function owner reviews 10 sampled outputs for voice quality
- [ ] If voice doesn't match, retune sample selection or expand sample collection

### Integration validation

- [ ] All agent → tool integrations validated with real (non-sandbox) data
- [ ] Edge cases tested (rate limits, error responses, malformed payloads)
- [ ] Audit trail confirmed (every agent action logged)

### Stakeholder communication

- **Daily through Week 2:** Onboarder Agent posts daily digest to client's working channel summarizing volume + ratings + any escalations
- **Day 7:** Lead cofounder + function owner check-in (60 min) — Week 2 retrospective + Week 3 readiness review

### Week 2 exit gate

- [ ] <20% Weak outputs across a sample of 50+ per agent
- [ ] All escalation rules tested with simulated edge cases
- [ ] Voice locking quality acceptable (function owner approval)
- [ ] No unresolved integration breakages

If exit gate fails: extend Week 2 by 5–10 days; iterate prompts and decision rules; consider expanding voice samples.

### Compact engagement compression
Compact Week 2 runs 5 days. Lower output volume, faster iteration cycle.

### Comprehensive engagement extension
Comprehensive Week 2 may extend to 10 days when multiple agents are in draft mode simultaneously (review capacity becomes the bottleneck).

---

## Week 3 — Internal autonomy (per agent)

### Goal
Agent publishes to low-risk, internal-facing surfaces. Sampling rate by human reviewer reduces from 100% to 20%.

### Per-agent activities

**For each agent:**

- [ ] Enable internal autonomy (agent publishes to internal channels, dashboards, draft queues — no external-facing send)
- [ ] Sampling protocol: 20% random sampling by lead cofounder + 20% random sampling by function owner
- [ ] Maintain rating discipline (Strong / Acceptable / Weak)
- [ ] Escalation handling tested in production (simulated escalations run through agent + reviewed for correct routing)

### Cross-agent integration

- [ ] Inter-agent handoff protocol tested (per `agents/work-chart.md`)
- [ ] Multi-agent workflows verified end-to-end (e.g. Acquirer → Closer handoff)
- [ ] Knowledge Agent serving multiple downstream agents simultaneously

### Documentation begins

- [ ] First draft of handoff documentation generated (using `delivery/handoff-docs-template.md`)
- [ ] Run-book first draft written
- [ ] Escalation paths documented

### Stakeholder communication

- **Weekly digest format begins:** Onboarder Agent delivers first weekly digest in the format that will continue through operate phase
- **Day 7:** Lead cofounder + function owner + sponsor check-in (60 min) — Week 3 retrospective + Week 4 plan

### Week 3 exit gate

- [ ] Sampling shows >80% Strong outputs per agent
- [ ] No escalation-worthy issues missed (audit trail verified for completeness)
- [ ] Inter-agent handoffs working without intervention
- [ ] Documentation drafts in progress

If exit gate fails: extend Week 3 by 5 days; investigate misses; tighten escalation rules.

### Compact engagement compression
Compact Week 3 runs 5 days. Fewer agents = simpler cross-agent integration testing.

### Comprehensive engagement extension
Comprehensive Week 3 may extend to 10 days for multi-agent stacks (4+ agents have more handoff combinations).

---

## Week 4 — External deployment (per agent)

### Goal
Agent operates externally. First time outputs reach external stakeholders (customers, clients, partners). Sampling rate at 10% with full audit trail.

### Per-agent activities

**For each agent:**

- [ ] Enable external deployment (agent's outputs ship externally)
- [ ] Sampling protocol: 10% random by lead cofounder + 10% random by function owner
- [ ] All escalations handled per documented paths
- [ ] Monthly performance metrics begin tracking
- [ ] Quality issues logged for retrospective

### Operations and monitoring

- [ ] Monitoring dashboards live (per `delivery/handoff-docs-template.md`)
- [ ] Alerting configured (deliverability, integration health, quality thresholds)
- [ ] On-call rotation for escalations established (lead cofounder primary, supporting cofounder backup)

### Stakeholder communication

- **First external output:** Lead cofounder notifies sponsor + function owner ("first external output went live at [time], here's the audit trail")
- **End of Week 4:** Lead cofounder + sponsor + function owner check-in (60 min) — Week 4 retrospective; readiness for Validation phase

### Week 4 exit gate

- [ ] All agents passing external-deployment quality bar
- [ ] First external outputs delivered without critical incidents
- [ ] Monitoring + alerting active
- [ ] No outstanding quality issues from sampling

If exit gate fails: roll back to Week 3 conditions for affected agent until issues resolve. Don't proceed to subsequent weeks until external deployment is stable.

### Compact engagement compression
Compact Week 4 runs 5 days. Then Validation begins.

### Comprehensive engagement extension
Comprehensive Week 4 may extend to 10 days; complex deployments often need longer to stabilize external output.

---

## Weeks 5+ — Stabilization (Standard 10-week and Comprehensive 12-week only)

The Compact 6-week template ends at Week 4 and proceeds to Validation. Standard and Comprehensive engagements use Weeks 5+ for stabilization.

### Week 5 — Volume ramp + voice tuning

- [ ] Increase external output volume to engagement-target volume (e.g. SDR outbound volume per the SOW)
- [ ] Voice locking refresh — review accumulated outputs against voice samples; tune as needed
- [ ] Cross-agent throughput tested at target volume

### Week 6 — Edge-case handling depth

- [ ] Document edge cases observed in first 2 weeks of external deployment
- [ ] Update agent decision rules to cover newly-observed edge cases
- [ ] Test escalation paths with the documented edge cases

### Week 7 — Performance optimization

- [ ] Performance metrics analysis (cost per output, latency per agent, throughput per agent)
- [ ] Cost optimization where reasonable (prompt compression, model selection per task, batching)
- [ ] Integration optimization (reduce redundant API calls, improve caching)

### Week 8 — Documentation finalization

- [ ] Handoff documentation package complete (per `delivery/handoff-docs-template.md`)
- [ ] Run-book complete and reviewed by function owner
- [ ] Training materials prepared (slides, recordings, written guides)

### Week 9 — Pre-validation readiness

- [ ] All agents stable for 14+ consecutive days
- [ ] Voice samples refreshed if drift detected
- [ ] Documentation reviewed by both cofounders
- [ ] Validation-phase calendar booked

### Week 10 — Validation prep + buffer

- [ ] Final integration checks
- [ ] Final voice-locking checks
- [ ] Final documentation reviews
- [ ] Buffer for any last-minute issues
- [ ] Validation phase begins on the next named date

### Weeks 11–12 (Comprehensive only)

- [ ] Additional stabilization for high-volume / high-complexity engagements
- [ ] Multi-agent coordination tuning
- [ ] Long-tail edge case capture

---

## Cofounder rhythm during build phase

### Daily (Lead cofounder)
- Check engagement health dashboard (agent quality, integration health, sampling completion)
- Respond to client function owner messages within 4 business hours
- Update Builder workflow with any decision-rule changes

### Weekly (Lead cofounder + supporting cofounder)
- 15-min internal retro on engagement health
- Cross-cofounder review of any escalations or scope-change discussions
- Update lead cofounder's engagement load forecast (capacity check)

### Weekly (Lead cofounder + client function owner)
- 30-min check-in
- Sampling review (cofounder shares what they saw; function owner shares what they saw)
- Surface blockers and unblock

### Bi-weekly (Lead cofounder + client sponsor)
- 30-min status update
- Cover: build-phase progress, any scope discussions, any risk to timeline

---

## Build-phase escalation patterns

### "Output quality not improving despite iteration"

After 2 weeks of iteration on a particular agent and quality stays below target:

- Hypothesis 1: voice samples are inadequate → expand voice sample collection
- Hypothesis 2: decision rules don't cover real edge cases → capture more edge-case examples from function owner
- Hypothesis 3: model is wrong for the task → consider model swap (rare; usually prompt issue)
- Hypothesis 4: function scope was misunderstood → re-scope with function owner

Action: cofounder deep-dive on the underperforming agent. Possible re-scoping conversation with client.

### "Integration broken in production"

- P1: customer-facing failure → immediate rollback + on-call response
- P2: function disruption → rollback if possible; hot-fix if not
- Document root cause in `/engagements/[client-name]/build/incidents.md`
- Update monitoring/alerting to catch the failure mode earlier next time

### "Client function owner stops sampling"

- 1 week missed: gentle reminder via weekly check-in
- 2 weeks missed: lead cofounder escalates to sponsor
- 3 weeks missed: formal pause notification; sampling discipline is a SOW commitment (Section 6.4)

### "Voice locking failing"

- After expanded sampling (>25 samples) still not locking → consider voice-extraction interview path
- After interview path still not locking → narrow deployment scope (e.g. agent generates internal drafts only, human writes external outputs)
- Document the limitation in handoff package; adjust operate-phase scope

### "Scope creep request from client"

- Document in `/engagements/[client-name]/build/scope-changes.md`
- Run scope-change process (per SOW Section 2.3)
- Don't quietly absorb

---

## Build-phase exit gate

Lead cofounder confirms before declaring build phase complete:

- [ ] All agents in stack passing external-deployment quality bar (Week 4 exit criteria sustained for 14+ days)
- [ ] Integration health green across all tools
- [ ] Voice-locking complete and drift detection active
- [ ] Build-phase audit trail complete
- [ ] Function owner can articulate the stack's operation
- [ ] Documentation package draft complete (Validation will finalize)
- [ ] No outstanding P1/P2 incidents

If exit gate passes: build phase complete; Validation phase begins.

If exit gate fails: cofounder-level discussion on path forward — extend build, re-scope, or in rare cases terminate with mutual agreement.

---

## Notes on the build-phase reality

The checklist above describes the structured path. Real engagements deviate. Common patterns:

- Compact engagements run cleanly through the 6-week template ~70% of the time. Most deviations are voice-related.
- Standard engagements run cleanly ~50% of the time. Most deviations are integration-related or scope-related.
- Comprehensive engagements deviate ~70% of the time. Multi-agent complexity creates unexpected interactions.

When deviation happens: name it, document it, adapt the timeline, communicate to client. Don't pretend the original plan is still on track when it isn't.

The cofounder's discipline is: lead with honesty about timeline reality. Clients respect honest re-planning more than aspirational reassurance.
