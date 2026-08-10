# SOW Template — AIS Engagement Charter

The legal-shape document that governs every AIS engagement. Combines a Statement of Work (scope, deliverables, timeline) with an Engagement Charter (owners, success metrics, operating rhythm). Signed by both parties before any work begins.

**Important:** Nejc reviews the legal language on every SOW before send. This template is the structural starting point — Nejc's legal review may modify language, add jurisdiction-specific clauses, or adjust to client's MSA template if one applies.

---

## How to use this template

1. Cofounder leading the engagement populates each section using scoping outputs from `/engagements/[client-name]/scoping/`.
2. Cross-cofounder review (at least one other cofounder reads the full SOW before send).
3. Nejc reviews legal language and signs off as cofounder-on-record for legal.
4. Send to client with a 5-business-day target turnaround on review.
5. Iteration via tracked changes in a shared document.
6. Final version signed by both parties (e-signature acceptable: DocuSign, PandaDoc, Adobe Sign, or Slovenian equivalent).

---

## Template starts here

(Below is the SOW template document, ready to populate)

---

# STATEMENT OF WORK & ENGAGEMENT CHARTER

**Between:**
- **AIS** [d.o.o. / s.p. — to be updated per current entity status]
  - Registered address: [address]
  - Registration: [registration number]
  - Represented by: Nejc Feigel Boh
- **Client:** [Client legal name]
  - Registered address: [address]
  - Represented by: [Name, Title]

**Effective Date:** [Date]
**SOW Version:** [Version number]
**SOW Reference:** [Internal reference, e.g. AIS-2026-001]

---

## 1. Engagement summary

### 1.1 Function being owned
[One sentence describing the function the agent stack will own. From scoping Section 1.]

### 1.2 Engagement shape
[Compact / Standard / Comprehensive]

### 1.3 Vertical
[Slovenian businesses / Specialty legal / B2B SaaS demand-gen / other]

### 1.4 Build-phase target start date
[Date]

### 1.5 Build-phase target completion date
[Date — typically 6–12 weeks from start, depending on shape]

### 1.6 Operate-phase target start date
[Date]

---

## 2. Scope

### 2.1 In scope — what AIS will deliver

**Build phase deliverables:**

1. Engagement Charter (this document, executed by both parties)
2. Vertical-tuned agent stack:
   - [List specific agents — e.g. Acquirer Agent, Closer Agent, Knowledge Agent]
3. Tool wiring to client's existing systems:
   - [List specific integrations — e.g. Salesforce, HubSpot, Apollo, BuiltWith]
4. Voice locking — 16+ archived samples (25+ for specialty legal)
5. Operating runbook for the deployed stack
6. 30-day onboarding ladder execution per agent (read-only → draft → internal autonomy → external deployment)
7. Handoff documentation package and training session

**Operate phase deliverables (monthly, recurring):**

1. Monthly performance report
2. Continuous improvement (typical: one improvement ship per week)
3. Voice sample maintenance (quarterly refresh)
4. Escalation handling per SLA (see Section 5)
5. Quarterly business review

### 2.2 Out of scope — explicit exclusions

The following are NOT included in this engagement and would require a separate SOW:

- Paid media management (Google Ads, Meta Ads, programmatic, paid LinkedIn, paid sponsorships, influencer marketing) — see Section 8.4
- One-off content production beyond what the Acquirer Agent produces in operate phase
- Custom software development outside the agent stack
- CRM implementation or replacement
- Brand identity / visual design / website redesign
- [Additional explicit exclusions per the specific engagement]

### 2.3 Scope change process

Scope additions or modifications require:
1. Written change request from Client
2. AIS scoping response (timeline, pricing, impact)
3. Both parties' written approval before the change is enacted
4. Updated SOW addendum signed by both parties

---

## 3. Commercial terms

### 3.1 Build fee
- **Total:** € [amount] (excluding applicable VAT)
- **Payment schedule:**
  - 50% (€ [amount]) invoiced upon SOW execution. Net 14.
  - 50% (€ [amount]) invoiced upon Build-phase completion (handoff to Operate phase). Net 14.

### 3.2 Operate retainer
- **Monthly:** € [amount] (excluding applicable VAT)
- **Payment:** Invoiced on the 1st of each month, in advance. Net 7.
- **First retainer invoice:** Issued on the first business day of the month following operate-phase start.
- **Late payment:** 2% per month interest on unpaid balances. Operate work paused on day 14 of unpaid retainer (with 7 days' written notice on day 7).

### 3.3 Pass-through costs
The following are passed through to Client at cost, itemized monthly:

- Third-party tool licenses required for the deployed stack that Client does not already hold (e.g. new Apollo seat, vector database hosting)
- Approved tool API costs above the standard monthly allowance specified in Schedule A (if exceeded)

The following are included in fees and not passed through:

- AIS-side tool licenses (Claude API, internal infrastructure)
- Cofounder time (covered by fees, not billed hourly)
- Reasonable cloud / infrastructure costs within the standard cost model

### 3.4 Currency and tax
- **Currency:** Euro (EUR)
- **VAT:** Applied per Slovenian and EU regulations (reverse-charge for EU B2B; standard rate for SI domestic; VAT-exempt for non-EU clients meeting requirements)
- **Withholding:** Client responsible for any withholding tax obligations in their jurisdiction; gross-up applies if AIS net receipt is reduced

---

## 4. Named owners

### 4.1 AIS-side

- **Lead cofounder for this engagement:** [Anej Vučič / Nejc Feigel Boh / Ian Veber]
- **Supporting cofounder:** [Name]
- **Build-phase agent-deployment owner:** [Name]
- **Escalation point of contact:** [Lead cofounder]

### 4.2 Client-side

- **Engagement sponsor:** [Name, Title] — owns the relationship and budget
- **Function owner during operate phase:** [Name, Title] — owns day-to-day operation of the deployed stack
- **Technical point of contact:** [Name, Title] — for integration questions during build phase
- **Escalation point of contact:** [Name, Title]

### 4.3 Owner changes

Either party may change their named owners with 7 business days' written notice to the other party. Successor owners must be named in writing before the change takes effect. No agent operations proceed without named owners on both sides (see Section 6.3).

---

## 5. Success metrics and operating rhythm

### 5.1 Primary success metric
[The one metric this engagement will move, per scoping Section 9]

- **Baseline:** [current value]
- **12-month target:** [target value]
- **Measurement method:** [how it's measured, what tool / source]

### 5.2 Secondary metrics
[Up to 5 supporting metrics with baseline + target]

### 5.3 Build-phase leading indicators
- Voice samples collected: target 16+ by week 2 (25+ for specialty legal)
- Critical access provisioned: 100% by end of week 1
- Onboarding-ladder progression: each agent advances on schedule per `agents/work-chart.md`

### 5.4 Operating rhythm

- **Weekly digest:** delivered every [day of week], to function owner and sponsor
- **Weekly check-in (operate phase, optional):** 30 min, between AIS lead and function owner — Client may opt out after first 90 days if not needed
- **Monthly review:** 60 min, AIS lead + function owner + sponsor
- **Quarterly business review (QBR):** 90 min, both parties' leadership + named owners

### 5.5 Escalation SLA

| Severity | Definition | AIS response time |
|---|---|---|
| P1 — Urgent | Customer-facing failure, data exposure, agent producing harmful output | 4 hours, 24/7 |
| P2 — High | Function disruption affecting daily operation | Same business day |
| P3 — Standard | Quality issue, improvement request | 2 business days |
| P4 — Low | Suggestion, nice-to-have | Next monthly review |

---

## 6. Operational requirements

### 6.1 Client-side time commitment
Client agrees to the following named-owner time commitments during build phase:

- Sponsor: 30 min/week for status check-ins
- Function owner: 4–6 hours/week for kickoff, voice-sample collection, onboarding-ladder review, integration validation
- Technical point of contact: 2–4 hours/week for integration scoping and access provisioning

If Client cannot meet these commitments, build-phase timeline may extend at AIS's discretion. Extensions beyond 4 weeks may trigger re-scoping.

### 6.2 Voice sample collection
Client agrees to provide 16+ valid voice samples (25+ for specialty legal) within build-phase week 2. If samples are unavailable from existing archive, Client agrees to participate in 2–3 hours of voice-extraction interviews to generate samples.

### 6.3 Named-human-owner requirement
Every deployed agent has a named human owner on both sides at all times. If either party loses a named owner without naming a successor within 7 business days, agent operations affecting external stakeholders pause until successor is named. This is structural and not waivable.

### 6.4 Sampling discipline
During operate phase, Client's function owner agrees to sample agent outputs weekly per the protocol delivered in handoff documentation. If sampling lapses for 2+ consecutive weeks, AIS may pause external-facing agent operations until sampling resumes.

### 6.5 Onboarding ladder
Every externally-facing agent runs through the 30-day onboarding ladder (read-only → draft → internal autonomy → external deployment). The ladder is not compressible or skippable.

---

## 7. Term, termination, and off-ramp

### 7.1 Build phase
Build phase begins on the date specified in Section 1.4. Build phase concludes upon Validation report passing (per `delivery/validation-framework.md`).

### 7.2 Operate phase
Operate phase begins on the date specified in Section 1.6 (subject to build-phase completion). Operate phase continues until terminated per Section 7.3 or off-ramped per Section 7.4.

### 7.3 Termination

**Either party may terminate operate phase with 60 days' written notice.**

- Client obligations on termination: pay all invoices through termination date; permit AIS to coordinate handoff of deployed stack documentation and access
- AIS obligations on termination: hand off documentation, stack ownership, and operational continuity to Client's designated successor (Client team or new vendor); no claw-back of deployed agent system

**Either party may terminate for cause (uncured material breach) with 14 days' written notice.**

### 7.4 Off-ramp option
After 12 months of operate phase, Client may elect to take in-house ownership of the deployed stack. Off-ramp includes:

- Comprehensive handoff documentation refresh (~2 weeks of AIS work, included)
- Training sessions for Client's internal operators (up to 10 hours, included)
- Optional ongoing "support retainer" at € [reduced amount]/month for backstop coverage (Client's option, terminable on 30 days' notice)

Off-ramp terms supersede the 60-day termination notice — off-ramp can be initiated with 30 days' notice once the 12-month threshold is reached.

---

## 8. Restrictions and constraints

### 8.1 Confidentiality
Each party shall hold the other party's Confidential Information in confidence and shall not disclose to third parties without written consent. "Confidential Information" includes business strategies, customer data, technical specifications, and any information marked confidential or reasonably understood to be confidential.

This obligation survives termination of the engagement.

### 8.2 Data processing
AIS will process Client data only as necessary to perform the engagement. AIS will not:
- Use Client data to train general-purpose AI models
- Share Client data with third parties except as necessary for tool integrations explicitly listed in Schedule A
- Retain Client data beyond engagement-end + reasonable archive period for audit purposes (max 24 months unless specified otherwise)

A separate Data Processing Agreement (DPA) is attached as Schedule B where applicable (mandatory for EU clients; optional for non-EU).

### 8.3 Intellectual property
- **Pre-existing IP:** Each party retains ownership of IP existing before this engagement
- **AIS-developed IP:** Agentic OS platform, agent architecture patterns, generic prompts, methodology remain AIS property
- **Client-specific deliverables:** Engagement-specific configurations (Client's voice samples, Client's data, Client-specific decision rules, Client-specific integration code) are licensed to Client perpetually for use of the deployed stack. Client takes ownership of these on off-ramp or termination.
- **Case study rights:** AIS may publish anonymized case studies based on this engagement. Named case studies require Client's written consent.

### 8.4 Paid media exclusion
AIS does not provide paid-media services as part of this engagement. The Acquirer Agent is non-paid by default (content, partnerships, qualified outbound). If Client requires paid media, AIS will refer to a trusted paid-media partner; paid media is not part of this SOW's scope.

### 8.5 Non-solicitation
Neither party shall solicit the other party's employees, contractors, or named owners for employment during the engagement and for 12 months following termination, without written consent.

### 8.6 Limitation of liability
AIS's aggregate liability under this engagement is capped at the total fees paid by Client to AIS over the prior 12 months. Excluded from this cap: liability for breach of confidentiality, willful misconduct, gross negligence.

Neither party is liable for consequential, indirect, special, or punitive damages.

### 8.7 Governing law and dispute resolution
This Agreement is governed by Slovenian law. Disputes shall first be subject to good-faith negotiation between named cofounder and Client sponsor; failing resolution within 30 days, disputes shall be resolved by binding arbitration in Ljubljana, Slovenia under the rules of the Permanent Court of Arbitration at the Chamber of Commerce of Slovenia.

(Variation: for non-EU clients, dispute resolution may be specified to a mutually-agreed venue. Nejc to advise per jurisdiction.)

---

## 9. Schedules

- **Schedule A — Tool inventory and pass-through cost allowances**
- **Schedule B — Data Processing Agreement (if applicable)**
- **Schedule C — Vertical-specific terms** (if applicable; e.g. specialty legal privilege/confidentiality protocols)

---

## 10. Signatures

**For AIS:**

Name: ___________________________
Title: ___________________________
Signature: ___________________________
Date: ___________________________

**For Client:**

Name: ___________________________
Title: ___________________________
Signature: ___________________________
Date: ___________________________

---

## Template ends

---

## Notes for cofounders using this template

### Things to double-check before sending

- All blanks filled in (no [bracketed] placeholders left)
- Build fee math correct (50% × 2 = total, not a rounding error)
- Named owners specified with full names
- Dates internally consistent (build-phase end < operate-phase start)
- Section 8.4 paid-media exclusion remains in every SOW even if obvious
- Section 8.2 data processing terms match Client's actual data sensitivity
- Schedule A itemizes pass-through tools accurately

### Variations by vertical

- **Specialty legal:** Schedule C should include privilege protection protocol, conflict-database handling, compliance review SLA, audit trail granularity
- **B2B SaaS:** Schedule C may include deliverability infrastructure terms, sender-domain warmup protocol
- **Slovenian businesses:** typically simpler SOW; non-EU client variations rarely apply; in-person kickoff sometimes specified

### Variations by client size

- Larger clients often have their own MSA. Push to use ours; negotiate to incorporate their MSA's specific clauses on top of ours rather than starting from theirs.
- If client requires DocuSign + insurance certificates + W-8 / W-9 forms, factor +1 week into timeline.

### When to escalate to all-cofounder review

- Build fee outside the band specified in `verticals/[vertical].md`
- Scope additions that drift toward anti-pattern (paid media, hourly billing, seat licensing)
- Termination terms client wants modified (especially: shorter notice, claw-back clauses, IP claims on AIS methodology)
- Liability caps client wants raised
- DPA terms that exceed standard scope (full SOC 2 audit obligations, etc.)
