# Handoff Protocol

Handoff is not when we declare we're done. Handoff is when the client's team can operate the system without us in the room. These are different things, and conflating them is how agencies create dependency disguised as service.

This document defines what "done" means, how to get there, what the handoff session covers, how the 30-day support window works, and how to transition to a retainer conversation.

---

## What "done" means

An engagement is complete when all of the following are true:

1. The agent system is deployed in production with write access
2. The client's operations team has run the system independently for 3 consecutive business days without escalating to the project lead
3. Operator documentation has been delivered and reviewed by the client's ops team
4. The handoff session has been recorded and the recording delivered to the client
5. All client credentials are owned by the client (not by Veta)
6. Veta's access to client systems has been scoped down to what's needed for the post-launch support window only
7. The evaluation rubric has been run against the deployed system and the results documented
8. The engagement retrospective and playbook update are complete

Milestones 1–6 are client-facing. Milestones 7–8 are internal. All 8 must be done before the final invoice is issued.

---

## Pre-handoff checklist

Complete this before scheduling the handoff session.

### System readiness [AGENCY]

- [ ] Agent system deployed in production (write access live)
- [ ] Write-access monitoring week complete — daily exception log reviewed, no outstanding issues
- [ ] Evaluation rubric completed (see `agents/_base/evaluation-rubric.md`) — all Sections 1–3 passed or conditional pass with documented plan
- [ ] All open exceptions from the write-access monitoring week are resolved or documented with a resolution plan
- [ ] Agent version tagged — the production deployment has a version number and the tagged version is in the engagement folder
- [ ] Exception dashboard is clean — no stale unreviewed items older than 24 hours

### Documentation [AGENCY]

- [ ] Operator documentation drafted and complete — covers all four required areas:
  - How to monitor the exception dashboard
  - How to handle the most common exception types (with specific steps, not just "contact us")
  - How to pause the agent if something goes wrong
  - Who to contact and how (Agency contact during support window, then after support window ends)
- [ ] Operator documentation reviewed by project lead — accurate, not just technically correct but readable by a non-technical ops team member
- [ ] Agent spec files finalized — reflect what was actually built, not the original draft
- [ ] Tool manifests finalized — reflect current credential storage, endpoints in use, and known issues discovered during build
- [ ] Architecture summary — a one-page plain-language description of what the system does, how it connects to the client's tools, and what data it reads and writes. Client can give this to a new practice manager or a future vendor without needing to call us.

### Credential and access transfer [BOTH]

- [ ] Every API credential used by the agent is owned by the client:
  - Client has access to the credential (can view, rotate, revoke)
  - Credential is not under Veta's name or billing in any third-party service
  - If any credential was created under Veta's account for build convenience, it has been migrated to client ownership before handoff
- [ ] Client has confirmed they can access and rotate all credentials without Veta's involvement
- [ ] Veta's access to client systems reviewed and scoped down:
  - Remove or revoke any access level that was granted for build convenience and isn't needed for post-launch support
  - Document remaining access: what Veta can still access, why, and when it expires (end of 30-day support window)
- [ ] Client has access to the exception dashboard with their own credentials (not shared with Veta)
- [ ] Client has access to the output log with their own credentials

---

## The handoff session

**Format:** 60–90 minute call, recorded. Recording delivered to client within 24 hours.

**Who should be on this call (client side):** The primary ops team member who will own day-to-day monitoring. If that's the practice manager, they must be on this call — not the physician or owner who signed the SOW. If the owner wants to attend, fine, but the ops person is mandatory.

**Do not do the handoff session if:** The pre-handoff checklist isn't complete, the ops team member can't attend, or there are unresolved issues in the exception queue.

### Session agenda

| Block | Time | Content |
|---|---|---|
| System overview | 10 min | Plain-language walk through what the system does, which agents run, what triggers them, and what they produce |
| Live system demonstration | 15 min | Walk through the actual running system — show the exception dashboard, show the output log, show where to look when something happens |
| Exception handling walkthrough | 20 min | Walk through each exception type in the operator documentation. For the two or three most common exception types, have the ops team member do it themselves while you watch. |
| "How to pause it" demonstration | 5 min | Show them exactly how to pause or disable the agent. This is important — they need to know they're in control. |
| Credential walkthrough | 10 min | Confirm they can access every integration credential. Have them log in to the credential storage themselves. |
| Questions | 10 min | Open floor |
| Support window and next steps | 5 min | Explain the 30-day support window, how to reach you during that period, and what happens at day 30 |

### What the ops team should be able to do independently by the end of this session

- [ ] Find the exception dashboard and identify an unreviewed item
- [ ] Determine what caused a specific exception (which input, which agent step)
- [ ] Mark an exception as resolved with a note
- [ ] Pause the agent if needed
- [ ] Find and read the output log for a given date range
- [ ] Access at least one integration credential (demonstrate by logging in)

If they can't do all of these at the end of the session, schedule a 30-minute follow-up before the independent operation test begins.

---

## Independent operation test

**Definition:** The client's ops team runs the system for 3 consecutive business days without the project lead on call or available to answer questions.

**Protocol:**
- Agency notifies client that the independent operation test has begun
- Client's ops team monitors the exception dashboard daily
- Any exception the team encounters, they handle using the operator documentation
- At the end of 3 days, client and Agency review together: what exceptions occurred, how the team handled them, any issues that needed escalation

**Passing the test:** The test passes if the team handled all exceptions without needing to escalate to the project lead. Escalations are allowed during the test (that's what the support window is for), but each one is reviewed in the debrief. More than 2 escalations in 3 days means the operator documentation needs improvement — not that the test fails.

**If the test reveals documentation gaps:** Fix the documentation immediately. The gaps are the document's problem, not the ops team's. Rerun the relevant portion of the handoff session and repeat the affected days of the test.

---

## 30-day post-launch support window

**Scope:** Bug fixes only. Not scope additions, not questions about new features, not general support for the client's tools.

**What qualifies as a bug:**
- The agent produces an incorrect output on an input type it was specced to handle
- An integration stops working due to a fault in Veta's implementation (not a third-party outage)
- An exception is not being surfaced in the dashboard correctly
- The agent's behavior deviates from the approved spec

**What does not qualify as a bug (and is not covered):**
- "Can we add [new feature]?" — this is a scope change
- Third-party API outages or changes (e.g., EHR vendor updates their API)
- User error in operating the exception dashboard
- Questions that are answered in the operator documentation

**Response time during support window:** Agency responds to bug reports within 1 business day. Critical bugs (agent producing incorrect outputs at scale) are addressed within 4 business hours.

**How to submit a bug report:**
> Send to [project lead email] with subject line: "[CLIENT NAME] — Bug: [brief description]"
> Include: the input that caused the issue, the output the agent produced, and the output you expected.

**Support window end date:** [Date = handoff date + 30 calendar days]. At day 28, Agency sends a reminder with: support window closing date, retainer offer (if applicable), and instructions for what to do after the window ends.

---

## At the end of the support window

Three options for the client:

1. **Nothing changes** — the system continues to run. Veta is no longer engaged. Client operates independently. If they hit a bug after day 30, it's out of scope. If they want a change, they start a new scoped engagement.

2. **Tier 3 retainer** — client signs on for ongoing improvement, monitoring, and expansion. Offer this at day 28. If they're happy with what the system has done in the first 30 days, this is the natural next step.

3. **New Tier 1 or Tier 2 engagement** — client wants to expand to a new cluster or a connected system. Scope it as a new engagement; don't bundle it into the support window.

**When to offer the retainer:** Only offer after the handoff is clean. Do not offer the retainer if the 30-day period has had repeated escalations or documentation gaps — fix the system first, then offer to stay engaged on it. A retainer offer when the system is shaky reads as "we need you to keep paying us to fix what we broke."

---

## Internal closeout [AGENCY]

These steps are for Veta's internal records. Do them within 5 business days of the handoff milestone payment being received.

### Evaluation rubric

- [ ] Run the full evaluation rubric (`agents/_base/evaluation-rubric.md`) on the deployed system at day 14 post-launch
- [ ] File the completed rubric in the engagement folder as `eval-log.md`
- [ ] Note any metrics that are in "Warning" range — these are candidates for the retainer improvement backlog

### Engagement retrospective

Run a 30-minute internal debrief with the project lead. Capture:

- What was the actual build time vs. estimated?
- Which integrations had surprises? What were they?
- What did we scope wrong? How would we scope it differently?
- What objections came up that we hadn't seen before?
- What was the client's reaction at handoff — were they confident, nervous, delighted?
- Any compliance issues we hadn't anticipated?
- Anything that should change in the agent spec template or evaluation rubric?

### Playbook update

- [ ] Update the relevant vertical playbook with:
  - Cluster built, actual timeline, build cost
  - Integration specifics and surprises
  - Any new objections and responses
  - Measured outcomes at 30 days post-launch (accuracy rate, exceptions rate, staff hours impact if quantifiable)
- [ ] Append the engagement log section to the playbook per the playbook's update protocol

### Credential cleanup

- [ ] Confirm all credentials are rotated or scoped to client ownership
- [ ] Confirm Veta's staging environment access to client systems is revoked
- [ ] Confirm no client data remains in Veta's development infrastructure (except what's covered by an active BAA for ongoing retainer)
- [ ] File a credential cleanup confirmation in the engagement folder: date, what was revoked, confirmed by whom

### Final invoice

Issue the final milestone invoice only after:
- [ ] Independent operation test passed
- [ ] Handoff session recorded and recording delivered
- [ ] Operator documentation delivered
- [ ] Pre-handoff checklist complete
- [ ] Credential transfer confirmed

Do not issue the final invoice before these are done. Issuing the final invoice implies completion. If the system isn't fully handed off, we haven't earned the final payment.
