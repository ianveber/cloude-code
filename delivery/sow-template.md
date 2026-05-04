# Statement of Work — Template

> This template generates the binding engagement document. Fill it out completely based on discovery notes and the verbal proposal the client has accepted. Every [FILL IN] placeholder must be replaced before the SOW is sent. Every [ASSUMPTION] must be confirmed or converted to a hard commitment before signing.
>
> Do not abbreviate scope, exclusions, or the change order clause. These protect both parties.
>
> Delete this instruction block before sending to client.

---

# Statement of Work

**Between:** Veta ("Agency") and [CLIENT LEGAL ENTITY NAME] ("Client")
**Effective date:** [DATE]
**Project:** [ENGAGEMENT NAME — e.g., "Pre-Authorization Automation System — North Shore Implant Center"]
**Project lead (Agency):** [NAME]
**Project contact (Client):** [NAME, TITLE]

---

## 1. Engagement overview

[CLIENT NAME] operates a [SPECIALTY] practice in [LOCATION] and currently manages [TARGET CLUSTER] through a manual workflow that involves [BRIEF DESCRIPTION OF CURRENT STATE — e.g., "an insurance coordinator spending approximately 15 hours/week on pre-authorization submissions, follow-ups, and denial tracking across approximately 20 cases/month"].

Veta will design, build, integrate, and hand off an agent system that automates [TARGET CLUSTER], reducing staff time on this workflow by an estimated [N]% and [SECONDARY OUTCOME — e.g., "reducing average pre-authorization turnaround from 8 to 3 business days"].

This Statement of Work defines the scope, deliverables, timeline, pricing, and terms of that engagement.

---

## 2. Scope of work

### 2.1 Agents to be built

| Agent name | Role | Integration targets |
|---|---|---|
| [agent-name] | [one-line description] | [tool A, tool B] |
| [agent-name] | [one-line description] | [tool A] |

Full specifications for each agent will be drafted, reviewed by the Client, and approved in writing before build begins. Agent specs are deliverables of Phase 1 (see Section 4).

### 2.2 Integrations

The agent system will integrate with the following Client systems:

| System | Integration type | Access level | Notes |
|---|---|---|---|
| [EHR/PMS name] | [API / export-import / webhook] | Read / Write | [Any complexity flags] |
| [Communication tool] | [API] | Read / Write | |
| [Other tool] | [API / webhook] | Read | |

All integrations are subject to the systems' API availability and the Client's ability to provide required credentials and permissions. Any integration that proves infeasible after build begins will be surfaced immediately and handled per Section 7 (Change Orders).

### 2.3 Deliverables

| Deliverable | Description | Milestone |
|---|---|---|
| Agent specifications | Completed spec for each agent named in Section 2.1, reviewed and approved by Client | Phase 1 |
| Tool manifests | Completed integration documentation for each system in Section 2.2 | Phase 1 |
| Read-only deployment | Agent system deployed in read-only mode; outputs logged for review | Phase 2 |
| Read-only validation report | Summary of read-only phase results against sign-off criteria | Phase 2 |
| Write-access deployment | Agent system deployed with live write access after sign-off | Phase 3 |
| Operator documentation | Written guide covering: monitoring, exception handling, pausing the system, escalation contacts | Phase 4 |
| Handoff session | Recorded walkthrough with Client's operations team | Phase 4 |
| Post-launch support | Bug fixes (not scope additions) for 30 days after handoff | Post-launch |

### 2.4 Explicit exclusions

The following are **not included** in this engagement unless added via a signed change order:

- Building, migrating, or replacing the Client's core EHR, CRM, or practice management system
- Any automation of clinical decision-making or clinical advice generation
- Staff training beyond the handoff session described in Section 2.3
- Ongoing operation, monitoring, or improvement after the 30-day post-launch support window
- Any cluster or workflow not named in Section 2.1
- Compliance certification, legal review, or advice of any kind — the Client is responsible for confirming that the system meets their compliance obligations with their own counsel
- Paid advertising, SEO, content marketing, or any marketing service

Any request that falls outside this scope list is a scope change. See Section 7.

---

## 3. Assumptions and open items

The scope and timeline in this SOW are based on the following assumptions. If any assumption proves incorrect, it may require a timeline adjustment or change order.

| # | Assumption | Confirmed? | Risk if incorrect |
|---|---|---|---|
| 1 | Client's [EHR name] instance has API access enabled and the required endpoints are available | [ASSUMPTION — confirm before Phase 1 complete] | Could require export/import workaround; adds 1–2 weeks |
| 2 | Client can provide API credentials or service account access within [N] business days of kickoff | [ASSUMPTION] | Delays Phase 1 start |
| 3 | [SPECIFIC COMPLIANCE ASSUMPTION — e.g., "Client has a current BAA in place with their EHR vendor"] | [ASSUMPTION — confirm at kickoff] | May block build start |
| 4 | Client's [communication tool] supports [specific integration method] | [ASSUMPTION — confirm in Phase 1] | May require alternative integration approach |
| 5 | [ANY OTHER ASSUMPTION FROM DISCOVERY] | | |

Any assumption marked as unconfirmed must be resolved before the relevant phase begins. Agency will flag unresolved assumptions; Client is responsible for resolving them.

---

## 4. Timeline and milestones

**Total engagement duration:** [N] weeks from kickoff date

| Phase | Description | Duration | Sign-off required |
|---|---|---|---|
| Kickoff | Access provisioning, tools setup, kickoff call, compliance pre-checks | Week 1 | — |
| Phase 1 — Spec and design | Agent specs drafted, reviewed, and approved; tool manifests completed; staging environment configured | Weeks 1–[N] | Client approves agent specs in writing |
| Phase 2 — Build and read-only | Agents built and deployed in read-only mode; outputs reviewed against sign-off criteria | Weeks [N]–[N] | Client and Agency sign off on read-only validation report |
| Phase 3 — Write-access deployment | Write access enabled; monitored live run; daily exception review | Weeks [N]–[N] | Client confirms write-access monitoring period complete |
| Phase 4 — Handoff | Operator documentation delivered; handoff session recorded; independent operation test | Weeks [N]–[N] | Client operations team completes 3-day independent operation test |
| Post-launch support | 30-day bug-fix window | Weeks [N]–[N] | — |

**Start date dependency:** The engagement begins on the later of the Effective Date or the date Agency receives written confirmation that all kickoff prerequisites in the Onboarding Checklist are complete.

**Timeline extensions:** If Client delays in providing access, completing sign-offs, or resolving open assumptions, the timeline extends by the corresponding number of business days. Agency will notify Client in writing when delays occur.

---

## 5. Pricing and payment

**Total engagement fee:** $[AMOUNT]

| Milestone | Amount | Due |
|---|---|---|
| Signed SOW / kickoff | $[AMOUNT] ([N]%) | Upon signature |
| Phase 1 complete — specs approved | $[AMOUNT] ([N]%) | Within 5 business days of milestone |
| Phase 2 complete — read-only sign-off | $[AMOUNT] ([N]%) | Within 5 business days of milestone |
| Phase 4 complete — handoff | $[AMOUNT] ([N]%) | Within 5 business days of milestone |

**Payment terms:** Net 15 from invoice date.
**Late payment:** Invoices unpaid after 30 days accrue interest at 1.5%/month. Agency may pause work on overdue accounts after written notice.
**Expenses:** Out-of-pocket costs (e.g., third-party API fees, infrastructure costs) are billed at cost with prior written approval for any single expense over $[THRESHOLD, e.g., $200].

---

## 6. Roles and responsibilities

### Agency responsibilities
- Deliver all work products described in Section 2.3 on the agreed timeline
- Communicate proactively when blockers arise — within 24 hours of identifying a blocker
- Maintain confidentiality of all Client data and systems per Section 9
- Operate within the compliance constraints described in Section 2.4 and the vertical playbook

### Client responsibilities
- Provide API credentials and system access within [N] business days of kickoff
- Designate a primary point of contact (the person named in the header) with authority to approve specs, review outputs, and sign off on milestones
- Review and respond to Agent spec drafts within [N] business days of delivery
- Review and respond to read-only phase outputs within [N] business days of delivery
- Ensure their compliance obligations (HIPAA BAA, state bar requirements, etc.) are met before build begins
- Confirm that the system meets their regulatory requirements with their own counsel — Agency does not provide compliance certification

---

## 7. Change orders

Any work outside the scope defined in Section 2 requires a written change order signed by both parties before the work begins. Change orders name: the additional scope, the impact on timeline, and the additional cost (if any).

**What triggers a change order:**
- Any agent, integration, or workflow not named in Section 2.1 or 2.2
- A change to an already-approved agent spec that requires more than [N, e.g., 4] hours of rework
- A scope expansion requested by Client after Phase 1 sign-off
- An integration that proves infeasible and requires an alternative approach that changes the timeline or cost

**What does not trigger a change order:**
- Bug fixes within the 30-day post-launch support window
- Minor output format adjustments that don't change the agent's decision logic
- Clarifications to operator documentation

Agency will proactively flag any situation that may require a change order before work begins — not after.

---

## 8. Intellectual property

All custom code, agent logic, and documentation created under this SOW become the exclusive property of Client upon receipt of final payment. Client owns the system.

Agency retains the right to use anonymized, non-identifying learnings from this engagement to improve its playbooks and templates. Agency will not disclose Client-specific data, workflow details, or system architecture to any third party without written consent.

Agency's pre-existing tools, templates, and methodologies (including base agent templates, evaluation rubrics, and vertical playbooks) remain Agency's property. Client receives a license to use and modify the specific deliverables produced under this SOW — not the underlying templates.

---

## 9. Confidentiality and data handling

Agency will treat all Client data — including patient/client records, business data, and system credentials — as confidential. Agency will:
- Use Client data only for the purposes described in this SOW
- Not share Client data with any third party without written consent
- Store credentials in a secrets manager (not in code or documentation)
- Delete Client data from Agency systems within 30 days of engagement close, unless retained by written mutual agreement

**HIPAA (healthcare verticals):** If this engagement involves PHI, a Business Associate Agreement (BAA) must be signed between Client and Agency before the engagement begins. The BAA governs PHI handling and supersedes this section with respect to PHI.

**Legal verticals:** Agency acknowledges that Client's matter records may contain attorney-client privileged information. Agency will not log, store, or access the substantive content of privileged communications — only metadata required for the agent's function.

---

## 10. Limitation of liability

Agency's total liability under this SOW is limited to the fees paid by Client in the 90 days preceding the claim. Agency is not liable for: indirect, consequential, or incidental damages; lost revenue or profits; or outcomes attributable to Client's decisions made on the basis of agent outputs.

**Clinical and legal outputs:** The agent system produces outputs for human review — it does not make autonomous clinical or legal decisions. Client is responsible for reviewing agent outputs before acting on them. Agency is not liable for any clinical, legal, or compliance outcome.

---

## 11. Termination

Either party may terminate this engagement with 14 days written notice. Upon termination:
- Client pays for all work completed through the termination date at a pro-rated rate based on total engagement value ÷ total weeks × weeks completed
- Agency delivers all work products completed through the termination date
- Agency revokes access to Client systems within 5 business days
- Client retains all IP for work delivered through termination

If Client terminates after Phase 2 (read-only) is complete, the Phase 3 payment milestone is due.

---

## 12. Signatures

By signing below, both parties agree to the terms of this Statement of Work.

**Veta (Agency)**

Signature: _______________________________
Name: [NAME]
Title: [TITLE]
Date: _______________

**[CLIENT LEGAL ENTITY NAME] (Client)**

Signature: _______________________________
Name: [NAME]
Title: [TITLE]
Date: _______________

---

*This document, together with the Business Associate Agreement (if applicable), constitutes the entire agreement between the parties for this engagement. It supersedes all prior proposals, emails, and verbal agreements.*
