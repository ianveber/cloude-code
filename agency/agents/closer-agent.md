# Closer Agent

Owns mid-to-bottom funnel: discovery scheduling, pre-call briefs, scoping memo drafting, proposal generation, response classification, and routing to human closers (AE, partner, or AIS cofounder).

---

## Function ownership

**Owns:**
- Intake form / first-contact capture (sometimes replacing existing intake form with a conversational interface)
- Initial qualifying questions (vertical-specific)
- Conflict / fit checks (specialty legal: COI database lookup; B2B SaaS: ICP fit against current customer base)
- Discovery call scheduling
- Pre-call brief generation (structured summary of prospect for the human closer)
- Scoping memo drafting (specialty legal — heavy lifter)
- Proposal generation (using engagement-specific templates)
- Response classification on inbound replies (interested / wrong-person / not-now / unsubscribe / wrong-company / question / complaint)
- Routing classified responses to right human (AE, partner, cofounder, or queue for re-engagement)
- CRM hygiene (updating records with structured touch data + classified outcomes)

**Does not own:**
- The actual sales conversation (handoff to human closer or partner)
- The buying decision (human closer carries that)
- Post-close onboarding (Onboarder Agent)
- Top-of-funnel demand generation (Acquirer Agent)

**Hard boundary:** never sends a proposal, signs an engagement letter, or commits to pricing without human approval. Always.

---

## Inputs

- **Inbound prospect data** — from web forms, Acquirer Agent's outbound replies, partner referrals, direct partner contacts
- **ICP definition** — from Knowledge Agent
- **Vertical playbooks** — qualifying questions and kill-criteria from `/verticals/[vertical].md`
- **Pricing tables** — from `/docs/pricing.md`, plus vertical-specific pricing bands
- **Historical scoping memos and engagement letters** — from Knowledge Agent (10–50 historical examples per client engagement, depending on volume)
- **Conflict database** — client-side database (specialty legal) or current-customer list (B2B SaaS) for fit checks
- **Calendar APIs** — partner / AE / cofounder calendars for scheduling

---

## Outputs

- **Initial-contact responses** — first reply to inbound (drafted, human-approved in build phase, automated in operate phase for low-risk classifications)
- **Pre-call briefs** — structured 1-page brief for human closer ahead of discovery call (prospect background, signal triggers if applicable, ICP fit assessment, suggested discovery questions)
- **Scoping memos** — first-draft scoping memo after discovery call, for partner / cofounder review
- **Proposals** — drafted proposal using vertical-specific template, for human approval before send
- **Response classifications** — structured tags on all inbound replies (used by Acquirer's learning loop)
- **Re-engagement queue** — not-now replies queued for triggered re-engagement (date-based or signal-based)
- **CRM updates** — every touch logged, every classification logged, deal-stage updates suggested for human approval

---

## Tools and integrations

**Required:**
- Claude API for generation
- CRM API (Salesforce, HubSpot, Pipedrive, Close, or vertical-specific like Clio/MyCase for specialty legal)
- Calendar API (Google Calendar, Outlook 365, Cal.com, Calendly)
- Email API (for response capture + send via client's primary email)
- Document generation tooling (PandaDoc, DocuSign, or DocSend for proposal delivery)

**Vertical-specific:**
- Specialty legal: Practice Management Software API (Clio, MyCase, PracticePanther) for conflict-check lookups and intake records
- B2B SaaS: Sales engagement platform (Outreach, Salesloft) for response routing back into sequences
- Slovenian businesses: occasional integration with vertical-specific Slovenian CRMs (e.g. ICDC for healthcare)

**Optional:**
- Lead scoring tooling (typically built into CRM)
- Form-builder integration (Typeform, Jotform — for intake replacement)
- Conversational interface platform (when replacing static forms with chat-style intake)

---

## Human owners

**AIS-side owner during build:** Ian Veber.
- Approves: scoping memo templates, proposal templates, classification taxonomy, escalation thresholds, conflict-check logic
- Escalates: pricing decisions outside the standard bands, scope changes requiring proposal re-draft, classification edge cases requiring human judgment

**Client-side owner during operate:**
- Specialty legal: intake paralegal or office manager (operator), with sponsoring partner accountable for final outputs
- B2B SaaS: Sales Ops lead, VP Sales, or RevOps lead
- Slovenian businesses: owner-operator or front-desk staff

Approves: weekly sampled outputs (drafted memos, scheduled briefs, classified responses), proposal templates, pricing-band updates.
Escalates: prospects in unusual situations (conflicts, scope mismatch, pricing pushback), client-side personnel changes affecting routing, requests to handle deals outside the playbook.

---

## Escalation rules

The agent stops and escalates when:

- **Inbound prospect fails ICP fit but might be edge-case interesting** (e.g. wrong-size company but signals high-intent) → flag for human review
- **Inbound prospect is a confirmed conflict** (specialty legal) → immediate decline-drafted-response, escalate to partner for confirmation before send
- **Pricing question outside the standard bands** → escalate, never quote outside the band autonomously
- **Reply classification confidence <0.8** → queue for human classification
- **"Complaint," "legal threat," or "unsubscribe with hostility"** classification → immediate cofounder escalation, no auto-response
- **Discovery call scheduling fails 3+ times** (prospect ghosts, reschedules repeatedly, cancels) → escalate for human follow-up, agent stops auto-scheduling
- **Scoping memo references novel matter type not in historical templates** → escalate for partner review before any draft
- **Proposal pricing or scope decision requires cofounder consensus** → escalate immediately, no autonomous draft

---

## Success metrics

**Quantitative (tracked weekly):**

| Metric | Target | Failure threshold |
|---|---|---|
| First-contact response time (inbound to initial reply) | <30 min (business hours) | >2 hours triggers review |
| Discovery call show rate | >65% | <40% triggers scheduling-flow review |
| Pre-call brief quality (human-rated Strong/Acceptable/Weak) | >70% Strong, <15% Weak | <50% Strong triggers prompt review |
| Scoping memo first-draft acceptance rate (specialty legal) | >60% (some partner edits expected) | <30% triggers template review |
| Response classification accuracy | >90% | <80% triggers classifier retraining |
| Proposal-to-close cycle time | <14 days from proposal to signed | >30 days triggers proposal-friction review |

**Qualitative (monthly):**

- Sampled scoping memo quality (legal): rated by sponsoring partner
- Sampled pre-call brief quality: rated by AE / partner / cofounder closer
- Re-engagement effectiveness (not-now → eventually-yes rate over rolling 6-month window)

---

## Failure modes

### Failure 1 — Discovery call no-show rate spikes

Booked calls increasingly don't happen. Reasons: scheduling confirmation flow broken, prospect being booked too far in advance (>2 weeks → high cancel rate), reminder cadence wrong, agent booking calls with under-qualified prospects.

*Early warning:* Show rate drops below 50% for two consecutive weeks.
*Mitigation:* Audit scheduling flow (confirmation email rendering, reminder timing). Tighten qualifying questions before scheduling. Shorten booking window (max 7 days out). Test reminder cadence (24h + 1h reminders are standard).

### Failure 2 — Scoping memo template breaks on edge cases

A new matter type (specialty legal) or new ICP sub-segment (B2B SaaS) appears that the template doesn't cover. First drafts come out wrong, partner has to rewrite from scratch, partner gets frustrated, engagement risks losing partner trust.

*Early warning:* Partner-side acceptance rate on scoping memos drops; partner asks "did the agent even read the discovery notes?"
*Mitigation:* Pause auto-drafting for that matter type. Capture 2–3 partner-drafted examples for the new type. Update Knowledge Agent's historical memo index. Test re-drafts before re-enabling auto-draft.

### Failure 3 — Conflict-check API integration fails (specialty legal)

Firm's Practice Management Software API changes behavior. Conflict-check returns false negatives (missing real conflicts) or false positives (flagging non-conflicts). Real risk: a conflicted matter advances past intake.

*Early warning:* Conflict-check API returns unexpected responses, latency spikes, or schema differences from prior week.
*Mitigation:* Pause auto-conflict-check. All checks fall back to paralegal manual lookup. Investigate API change with vendor. Update integration code. Resume only after thorough re-test with intentional edge-case lookups.

### Failure 4 — Proposal pricing drift

Agent drafts proposals at the low end of pricing bands consistently, even for engagements that warrant high end. Reason: vague language patterns in client briefs cause agent to default to "safe" lower numbers. Over time, AIS or client revenue drops below sustainable.

*Early warning:* Average proposal price drops over rolling 90-day window without corresponding ICP shift.
*Mitigation:* Audit recent proposals against vertical playbook pricing rationale. Update prompt rules to require explicit pricing-band justification in each proposal draft. Cofounder reviews next 5 proposals before send to recalibrate.

### Failure 5 — Response classifier mislabels at scale

Classifier confidence is high but accuracy is low for a particular reply class (e.g. mistaking polite "no" for "not now"). Reps engage prospects who actually rejected, damaging relationships and wasting cycles.

*Early warning:* Re-engagement reply rate from "not now" buckets unusually low; AE-side feedback that prospects in "interested" bucket are actually flat-no.
*Mitigation:* Pause auto-classification for that class. Manual classification by human owner for 1 week while gathering retraining data. Update classifier prompt with explicit edge-case examples.

---

## Configuration patterns by vertical

### Slovenian businesses
- Initial-contact replies in Slovenian by default
- Discovery scheduling offers in-person ("kava sestanek") as first option, Zoom as fallback
- Scoping memos shorter than international equivalents (3–5 pages vs 8–12 for specialty legal)
- Proposals delivered in Slovenian, with English summary if requested
- Pricing decisions defer to cofounder more often (smaller deals, but more pricing variance based on personal-network considerations)

### Specialty legal
- Initial-contact response within 30 minutes (sophisticated buyers expect fast acknowledgement)
- Conflict check runs before scheduling discovery (not after)
- Pre-call briefs include jurisdictional context, matter complexity indicators, potential conflict warnings
- Scoping memos use firm-specific templates (each firm has its own style)
- Engagement letters drafted from firm templates with scope-specific population
- Re-engagement is gentler — legal prospects are sensitive to "salesy" follow-up cadence

### B2B SaaS demand-gen
- Response classification is the dominant function (high reply volume from Acquirer's outbound)
- Routing to AE based on AE specialization (territory, vertical, deal size)
- Pre-call briefs include intent signals that triggered outreach, prospect's likely current state, suggested probing questions
- Proposals use modular pricing (build fee + monthly retainer per agent in stack)
- Re-engagement triggers based on signal events (e.g. funding round → reactivate "not now" replies from 6 months ago)

---

## Voice and output requirements

- **Voice-locking threshold:** 16+ samples for standard verticals; 25–30 for specialty legal
- **Output review cadence (operate phase):**
  - Weekly: 10 sampled outputs across categories (intake replies, pre-call briefs, scoping memos, proposals) reviewed by client-side owner
  - Monthly: classification accuracy spot-check on 20 random replies
  - Quarterly: voice refresh; template review (are templates still serving?)
- **Output quality bar:** target >70% rated Strong. <50% Strong triggers immediate prompt review.
- **Drift detection:** monthly automated check that drafted memos / proposals match the voice sample distribution; flag if drift exceeds threshold

---

## Memory and learning

**Persisted across runs:**
- All sent / drafted outputs + human approval state
- Classification labels + accuracy validation
- Re-engagement queue state (when does prospect get re-contacted, on what trigger)
- Scoping memo + proposal templates with version history
- Voice samples (Knowledge Agent)

**Learning loops:**
- **Daily:** classification confidence calibration (does confidence score match actual accuracy?)
- **Weekly:** template usage review (which templates produced highest-acceptance drafts?)
- **Monthly:** pricing review (are drafted prices distributed correctly across bands?)
- **Quarterly:** re-engagement effectiveness review (which triggers convert?)

---

## Cost model

**Typical monthly direct cost per engagement:** €400–€900

| Component | Range | Driver |
|---|---|---|
| Claude API | €200–€500 | Memo / proposal generation volume + response classification volume |
| Document generation (PandaDoc / DocuSign) | €30–€100 | Proposal volume |
| CRM API costs | €0–€100 | Usually included in CRM seat client owns; some APIs metered |
| Specialty integrations (conflict-check vendor API, scheduling tools) | €0–€200 | Vertical-specific |
| Calendar API costs | €0–€20 | Usually free with productivity suite |

**Scales with:**
- Reply volume (linearly with response classification count)
- Discovery call volume (drives pre-call brief generation)
- Scoping memo / proposal frequency (specialty legal highest)
