# Agent Spec — [AGENT NAME]

> Copy this template for every new agent. Fill out every section completely before build begins.
> Sections marked **[STUB]** are placeholders that must be resolved before the build starts.
> Delete this instruction block before sharing with a client.

---

## Header

| Field | Value |
|---|---|
| Agent name | `{role}-{vertical}-{action}` |
| Version | `0.1.0` (increment on breaking changes) |
| Spec author | |
| Spec date | YYYY-MM-DD |
| Client / engagement | |
| Project lead | |
| Status | `draft` / `in-review` / `approved` / `in-build` / `read-only-phase` / `write-phase` / `handed-off` |

---

## Purpose

**One sentence.** What does this agent do, for whom, and what outcome does it produce?

> Example: "Routes new patient inquiries from the website contact form into the practice's EHR as a staged patient record, flags insurance mismatches, and sends a confirmation SMS to the patient — without staff involvement."

---

## Functional cluster

Which cluster does this agent belong to? Name the cluster and describe its scope (what triggers it, what ends it).

**Cluster name:**
**Trigger:** (what event or condition starts this agent)
**Terminal output:** (what constitutes task completion)
**Vertical:** (specialty dental / specialty legal / aesthetic medicine / etc.)

---

## Inputs

List every input the agent requires. For each: source, format, and whether it's required or optional.

| Input | Source | Format | Required? | Notes |
|---|---|---|---|---|
| | | | | |
| | | | | |

**Data sensitivity:** Does any input contain PHI, PII, privileged communications, or regulated financial data?
- [ ] PHI (HIPAA applies)
- [ ] PII (basic privacy hygiene)
- [ ] Privileged (legal vertical — handle separately)
- [ ] Regulated financial data (FINRA/SEC scope)
- [ ] None of the above

If any box is checked, see the compliance flags section before proceeding.

---

## Outputs

List every output the agent produces. For each: destination, format, and trigger condition.

| Output | Destination | Format | Trigger condition | Notes |
|---|---|---|---|---|
| | | | | |
| | | | | |

**Output format note:** Outputs must be structured and parseable where they feed into another system. Do not specify "a summary" or "a message" without defining the schema or template.

---

## Agent logic

Step-by-step description of what the agent does. Be specific enough that a developer can implement it without asking clarifying questions. Use numbered steps. Branch with sub-bullets where the logic forks.

1. [Step 1]
2. [Step 2]
   - If [condition A]: [action]
   - If [condition B]: [action]
3. [Step 3]

**Decision thresholds:** If the agent makes confidence-based decisions (e.g., routing based on NLP classification), specify the threshold values and what happens below threshold.

| Decision | Threshold | Below-threshold behavior |
|---|---|---|
| | | |

---

## Tools and integrations

List every external system the agent touches. For each integration, a completed `tool-manifest-{tool-name}.md` must exist before build starts.

| Tool / system | Action type | Manifest file | Status |
|---|---|---|---|
| | read / write / read-write | | draft / complete |
| | | | |

---

## Exception handling

**This section is required. An empty or vague exception handling section means the spec is incomplete.**

For each exception type, specify: what triggers it, what the agent does, and how it surfaces to a human.

| Exception | Trigger | Agent behavior | Human notification |
|---|---|---|---|
| Missing required input | Input field is null or empty | Halt task, log error | Flag in exception dashboard with input name and record ID |
| Input below confidence threshold | Classification confidence < [N]% | Route to human review queue | Dashboard alert with input text and top-2 classifications |
| External API unavailable | Integration returns 5xx or timeout | Retry ×3 with exponential backoff, then halt | Dashboard alert with system name, timestamp, retry count |
| Output validation failure | Output doesn't match required schema | Halt, log schema diff | Dashboard alert with expected vs. actual |
| Duplicate detected | Record already exists in destination system | Skip write, log as duplicate | Dashboard count (not per-item alert unless rate exceeds [N]/day) |
| [Vertical-specific exception] | | | |

**Exception dashboard:** Where do human-review items go? Name the tool and view.

**Escalation threshold:** At what volume of exceptions does the agent pause itself and alert the project lead? (e.g., "more than 10 exceptions in 1 hour")

---

## Compliance flags

Complete this section for every agent, even if the answer is "not applicable."

**Vertical compliance context:**
- Specialty dental / aesthetic medicine: HIPAA applies to any patient data
- Specialty legal: attorney-client privilege applies to matter communications; do not log content
- Fintech: FINRA/SEC may apply; confirm with client's compliance officer before build

**Flags for this agent:**

| Compliance area | Applies? | Mitigation | Confirmed with client counsel? |
|---|---|---|---|
| HIPAA — PHI storage | yes / no / [STUB] | | yes / no / not required |
| HIPAA — PHI transmission | yes / no / [STUB] | | |
| Attorney-client privilege | yes / no / [STUB] | | |
| FINRA/SEC | yes / no / [STUB] | | |
| GDPR / state privacy (CCPA, etc.) | yes / no / [STUB] | | |

Any row marked **[STUB]** blocks build start.

---

## Read-only phase

Describe what the agent does during the read-only validation phase. It should produce all outputs in a staging environment or log them without committing them to production systems.

**Duration:** [recommended: 5–10 business days]
**Output review process:** How will the project lead and client review read-only outputs? (e.g., daily CSV of would-be actions, Notion review board, Slack digest)
**Sign-off criteria:** What specific conditions must be met before write access is granted?

| Criterion | Target | Measurement method |
|---|---|---|
| Output accuracy rate | ≥ [N]% | Manual review of random sample (n=[N]) |
| Exception rate | ≤ [N]% of inputs | Exception log review |
| False positive rate | ≤ [N]% | Manual verification |
| [Vertical-specific criterion] | | |

**Sign-off required from:** [Client name, role] + [Project lead name]

---

## Write-access phase

Describe what changes when the agent moves from read-only to write access.

**New write permissions enabled:**
- [ ] [System name] — [specific write action]
- [ ] [System name] — [specific write action]

**Monitoring during write-access phase:** How are writes reviewed in the first week?
**Rollback procedure:** If a write action produces incorrect results at scale, what is the rollback procedure?

---

## Agent dependencies

| Dependency | Type | Required for | Status |
|---|---|---|---|
| [Other agent name] | upstream agent | Provides [input] | |
| [External API] | integration | [Action] | |
| [Human step] | manual prerequisite | [Condition that requires human input] | |

---

## Known limitations and stubs

**This section should be honest.** Name everything the agent cannot do in its current scope, and every assumption that hasn't been validated yet.

| Limitation / stub | Impact | Resolution path |
|---|---|---|
| [e.g., "Does not handle Spanish-language inputs"] | [Missed cases go to exception queue] | [Phase 2 expansion or external translation layer] |
| | | |

---

## Operator documentation summary

This section is a stub until the agent reaches handoff milestone. At handoff, this expands into a standalone operator doc.

**What the client's ops team needs to know:**
- How to monitor the exception dashboard
- How to handle common exception types
- How to pause the agent if something goes wrong
- Who to contact if the agent behaves unexpectedly

**Draft operator doc location:** [link or file path — fill in at handoff]

---

## Change log

| Version | Date | Author | Summary of change |
|---|---|---|---|
| 0.1.0 | YYYY-MM-DD | | Initial draft |
