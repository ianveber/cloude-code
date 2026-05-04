# Agent Evaluation Rubric

This rubric applies to every agent system Veta builds. Use it at three points:

1. **Pre-launch** — before write access is granted (validates read-only phase outputs)
2. **Post-launch review** — at the end of the write-access monitoring week
3. **Ongoing** — monthly during any active retainer engagement

The rubric does not replace vertical-specific metrics. Each vertical playbook defines the specific KPIs that matter for its clusters (e.g., insurance pre-auth approval rate for dental, document processing time for legal). This rubric covers the universal baseline.

---

## Section 1 — Correctness

*Is the agent doing the right thing?*

### 1.1 Output accuracy

**Definition:** Percentage of outputs that are correct — meaning they match what a competent human would have produced, given the same input.

**Measurement method:** Random sample review. Minimum sample size: 30 outputs (or 100% if volume is below 30).

| Grade | Accuracy rate | Meaning |
|---|---|---|
| Pass | ≥ 95% | Acceptable for write-access phase |
| Warning | 90–94% | Proceed with increased monitoring; root-cause the error pattern |
| Fail | < 90% | Do not grant write access; diagnose before retrying read-only phase |

**How to sample:** Pull a random sample from the output log. For each output: compare to the source input, independently determine the correct output, and score the agent's output as correct / incorrect / ambiguous. Ambiguous outputs count as incorrect for grading purposes.

**Note on ambiguity:** If more than 5% of sampled outputs are genuinely ambiguous (the correct answer depends on information the agent doesn't have), the spec has an input completeness problem. Fix the spec, not the sampling.

### 1.2 False positive rate

**Definition:** Percentage of outputs where the agent acted (classified, routed, triggered a write) when it should not have. False positives are often worse than false negatives in service contexts — an incorrectly confirmed appointment is harder to fix than a missed one.

| Grade | False positive rate | Meaning |
|---|---|---|
| Pass | ≤ 3% | Acceptable |
| Warning | 3–7% | Review routing logic and threshold calibration |
| Fail | > 7% | Halt write access; agent is incorrectly triggering too often |

### 1.3 False negative rate

**Definition:** Percentage of inputs the agent should have acted on but didn't (missed).

| Grade | False negative rate | Meaning |
|---|---|---|
| Pass | ≤ 5% | Acceptable |
| Warning | 5–10% | Review input coverage and classification thresholds |
| Fail | > 10% | Agent is missing too many cases; inputs may not be reaching the agent |

---

## Section 2 — Reliability

*Does the agent run without breaking?*

### 2.1 Exception rate

**Definition:** Percentage of inputs that result in a handled exception (routed to human review, not a crash).

A high exception rate is not necessarily a failure — it may mean the exception handling is working correctly and the input stream contains genuinely ambiguous cases. The key is whether exceptions are *handled* (visible, reviewable) vs. *silent* (lost).

| Grade | Exception rate | Meaning |
|---|---|---|
| Healthy | ≤ 10% | Normal operating range |
| Elevated | 10–25% | Review whether exceptions are genuine edge cases or systematic input problems |
| Problematic | > 25% | Agent is not handling the input stream adequately; may need spec revision |

### 2.2 Unhandled failure rate

**Definition:** Percentage of inputs that result in an unhandled failure — a crash, a silent skip, or an output that was produced without the agent recognizing it was wrong.

**Target:** 0%. Any unhandled failure is a bug.

**How to detect:** Review server logs and exception logs for inputs that entered the agent pipeline but produced no output and no exception entry. These are silent failures.

### 2.3 Uptime / availability

**Definition:** Percentage of time the agent is available to process inputs during its defined operating window.

| Grade | Availability | Meaning |
|---|---|---|
| Pass | ≥ 99% in any rolling 7-day window | Acceptable |
| Warning | 95–99% | Investigate recurring outage pattern |
| Fail | < 95% | Infrastructure or integration reliability problem |

**Operating window:** Define when the agent is expected to be running. Not all agents run 24/7. A dental intake agent may only need to run during business hours + 2 hours before open.

### 2.4 Latency

**Definition:** Time from input received to output produced (or exception raised). Measured at p50 and p95.

There is no universal target — latency requirements depend on the cluster. A patient confirmation SMS needs to go out within 5 minutes. A nightly billing report can take 30 minutes.

**Define targets in the agent spec.** If latency targets are not defined in the spec, this rubric section cannot be graded.

| Metric | Target (from spec) | Actual | Pass/Fail |
|---|---|---|---|
| p50 latency | | | |
| p95 latency | | | |
| Max observed latency | | | |

---

## Section 3 — Observability

*Can the ops team see what the agent is doing?*

### 3.1 Exception dashboard completeness

Every exception the agent raises must appear in the exception dashboard within 5 minutes of occurring. Check:

- [ ] All exception types defined in the spec appear in the dashboard when triggered
- [ ] Each exception entry includes: timestamp, input record ID, exception type, agent step where it occurred
- [ ] Dashboard is accessible to the client's ops team (not just the project lead)
- [ ] Dashboard has a clear "resolved / unresolved" state for each exception

### 3.2 Output log completeness

The agent must log every output it produces. Check:

- [ ] Every input has a corresponding log entry (even if the output was an exception)
- [ ] Log entries include: timestamp, input record ID, output type, output content or summary, agent version
- [ ] Logs are retained for at least 90 days (or per the client's retention policy if longer)
- [ ] Logs are accessible to the project lead for debugging

### 3.3 Agent health monitoring

- [ ] An external health check pings the agent on its defined schedule and alerts if it fails to respond
- [ ] The client's ops team has received and confirmed they can access the health dashboard
- [ ] Escalation path is documented: who gets alerted, at what threshold, and how

---

## Section 4 — Handoff readiness

*Can the client's team operate this without us?*

This section is evaluated at the handoff milestone only.

### 4.1 Operator documentation

- [ ] Operator doc exists and covers: how to monitor, how to handle common exceptions, how to pause the agent, who to contact
- [ ] Operator doc has been reviewed by the client's ops team (not just delivered)
- [ ] Client ops team can demonstrate: finding an exception, marking it resolved, and identifying the input that caused it

### 4.2 Credential and access transfer

- [ ] All API credentials used by the agent are owned by the client (not by Veta)
- [ ] Client has confirmed they can access and rotate all credentials
- [ ] Veta's access to client systems has been scoped to what's needed for the post-launch support window only

### 4.3 Independent operation test

**Criterion:** The client's ops team runs the agent's normal operating cycle for 3 consecutive business days without the project lead on call.

- [ ] Test completed
- [ ] Exceptions that occurred during the test were handled by the client's team without escalation to the project lead
- [ ] Any issues that required project lead involvement are documented and resolved before handoff is declared complete

---

## Section 5 — Post-launch monthly review (retainer engagements)

Run this section monthly for any Tier 3 engagement or active retainer.

### Trend analysis

| Metric | Last month | This month | Trend | Action needed? |
|---|---|---|---|---|
| Output accuracy rate | | | ↑ / ↓ / flat | |
| Exception rate | | | ↑ / ↓ / flat | |
| Unhandled failure rate | | | ↑ / ↓ / flat | |
| p95 latency | | | ↑ / ↓ / flat | |
| Input volume | | | ↑ / ↓ / flat | |

### Drift detection

Agents degrade when the real-world input distribution shifts away from what the agent was built for. Check monthly:

- [ ] Are there new input patterns appearing in the exception queue that weren't present at launch?
- [ ] Has the client's underlying tool changed its API, schema, or behavior?
- [ ] Has the input volume grown to a point where rate limits or latency targets are at risk?
- [ ] Are there exceptions that have been appearing in the queue for 3+ consecutive months without being resolved? (These are systemic issues, not edge cases.)

### Improvement backlog

Items that have been identified but not yet built. Review with the client monthly to prioritize.

| Item | Source | Priority | Status |
|---|---|---|---|
| | client request / exception pattern / drift observation | high / medium / low | backlog / in-scope for next sprint |

---

## Grading summary template

Use this at each evaluation point. Fill it out and attach it to the engagement's eval-log.md.

```
## Agent Evaluation — [AGENT NAME] — [DATE]
**Evaluation type:** pre-launch / post-launch / monthly

### Section 1 — Correctness
- Output accuracy: [N]% — PASS / WARNING / FAIL
- False positive rate: [N]% — PASS / WARNING / FAIL
- False negative rate: [N]% — PASS / WARNING / FAIL

### Section 2 — Reliability
- Exception rate: [N]% — HEALTHY / ELEVATED / PROBLEMATIC
- Unhandled failure rate: [N]% — PASS / FAIL
- Availability: [N]% — PASS / WARNING / FAIL
- p50 latency: [N]s vs. target [N]s — PASS / FAIL
- p95 latency: [N]s vs. target [N]s — PASS / FAIL

### Section 3 — Observability
- Exception dashboard: COMPLETE / INCOMPLETE
- Output log: COMPLETE / INCOMPLETE
- Health monitoring: CONFIGURED / NOT CONFIGURED

### Section 4 — Handoff readiness (handoff only)
- Operator documentation: COMPLETE / INCOMPLETE
- Credential transfer: COMPLETE / INCOMPLETE
- Independent operation test: PASSED / NOT YET RUN

### Overall: PASS / CONDITIONAL PASS (list conditions) / FAIL (list blockers)

### Next steps:
[List any action items, their owners, and target dates]

### Reviewer:
[Name, date]
```
