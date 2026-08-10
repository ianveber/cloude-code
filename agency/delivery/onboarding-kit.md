# Onboarding Kit

Everything needed to drive Phase 3 (Onboarding) of an engagement: welcome sequence, access provisioning checklist, document collection checklist, voice sample collection plan, kickoff agenda.

Used by Anej + Onboarder Agent. 1–2 week duration, target completion before week 1 of build phase starts.

---

## Onboarding-phase timeline

| Day | Action | Owner |
|---|---|---|
| 0 | SOW signed, first invoice issued | Nejc + lead cofounder |
| 1 | Welcome email + onboarding plan delivered | Onboarder Agent |
| 2 | Access provisioning requests issued | Onboarder Agent |
| 3 | Document collection requests issued | Onboarder Agent |
| 5 | Voice sample collection requests issued | Onboarder Agent |
| 7 | Kickoff call scheduled (target: kickoff in week 2 of onboarding) | Anej |
| 10–14 | Iterate on missing items, escalate blockers | Anej + lead cofounder |
| 14 | Kickoff call held | Anej + lead cofounder |
| 14 | Onboarding-phase exit checklist completed; build phase Week 1 begins | Lead cofounder |

---

## Day 1 — Welcome email

Sent within 4 hours of SOW signature. Template:

```
Subject: Welcome to AIS — [Client name] onboarding starts now

Hi [Sponsor name],

The SOW is signed. We're glad to be working with you.

Here's what happens over the next two weeks:

WHAT YOU CAN EXPECT FROM US
- Tomorrow: we'll send you a structured access-provisioning request — what we need access to, why, and the security shape of how it's used.
- Day 3: document collection request — historical SOPs, prior outputs, voice samples (what counts is in the request).
- Day 5: voice sample collection plan — if you have 16+ samples ready, just send them. If not, we'll schedule extraction interviews.
- Day 7: we'll schedule the kickoff call for next week.

WHAT WE NEED FROM YOU
- Sponsor (you, [Sponsor name]): ~30 min/week for status check-ins
- Function owner ([Function owner name]): 4–6 hours/week through onboarding and into build phase
- Technical contact ([Tech contact name]): 2–4 hours/week through onboarding for access and integrations

If those time commitments aren't realistic given your current load, let us know now — we'd rather adjust the timeline than discover slippage in week 2.

KEY DATES
- Onboarding phase: [start date] to [end date]
- Build phase: [start date] to [target end date]
- Operate phase: target start [date]

QUESTIONS, ESCALATIONS, NORMAL COMMS
- Lead cofounder for your engagement: [name, email, mobile if applicable]
- Best channel for day-to-day: [Slack Connect / Email / Teams — set during scoping]
- Anything escalation-worthy: text or call the lead cofounder directly. Don't queue urgent things in async channels.

That's it. The next message comes tomorrow with the access request.

— [Lead cofounder]
AIS Slovenia
```

Sent by Onboarder Agent (drafted by agent, sent under lead cofounder's name and email).

---

## Day 2 — Access provisioning request

Per-engagement-specific. The standard checklist by vertical:

### Standard access categories

For most engagements:

- [ ] CRM (read + write for agent integrations)
- [ ] Email sending platform (API access)
- [ ] Calendar (read + write for scheduling)
- [ ] Document storage (read + scoped write)
- [ ] Communication channels — Slack Connect, Teams external, or email lists
- [ ] Vertical-specific tools (per scoping Section 7)
- [ ] Cloud platform (if AIS hosts deployed stack on Client's infrastructure)
- [ ] Identity provider integration (if Client uses Okta, Google Workspace SSO, etc.)
- [ ] Monitoring / observability platform (Datadog, Grafana, etc., if applicable)

### Specialty legal additions

- [ ] Practice Management Software (Clio, MyCase, etc.) — admin access for conflict-check API integration
- [ ] Document portal (firm's secure client document exchange)
- [ ] Engagement letter template repository
- [ ] Conflict database (read access; structured query capability)

### B2B SaaS additions

- [ ] Sales engagement platform (Outreach, Salesloft, Apollo)
- [ ] Enrichment tools (Apollo, Clay, Common Room)
- [ ] Intent monitoring tools (BuiltWith, others per ICP)
- [ ] Marketing automation platform (HubSpot, Marketo, etc.) if applicable

### Slovenian businesses additions

- [ ] Accounting system (Pantheon, e-računi.si, etc.) for engagements involving financial reporting / invoicing
- [ ] Local CRM (often custom or sector-specific tools)
- [ ] Local communication platforms (Viber, Telegram if client uses these for customer comms)

### Access request template (sent on Day 2)

```
Subject: [AIS Onboarding] Access provisioning request — please action by [date]

Hi [Tech contact name] (cc: [Sponsor]),

For your engagement to start on schedule, we need the following access provisioned by [date — typically 5 business days from today]:

[Numbered list of required access from above checklist, with:
 - What we're accessing
 - Why (one sentence)
 - Access level needed (read-only / read-write / admin)
 - How we'll authenticate (API key / OAuth / SSO / service account)]

Security shape:
- All AIS-side access is logged in our audit system; available for your review
- Secrets shared via [1Password Family Sharing / Bitwarden Send / your preferred method]
- All agent-side actions logged with timestamp + agent identifier + payload
- API calls subject to rate limits we'll configure per integration

If your organization requires additional security review or specific access protocols, name the person we should coordinate with.

Blockers? Let us know today, not later. Access blockers are the #1 reason build phases slip.

— [Lead cofounder]
```

---

## Day 3 — Document collection request

Per-engagement-specific. The standard checklist by vertical:

### Standard document categories

- [ ] Current SOPs for the function being owned
- [ ] Prior outputs (10–50 examples depending on engagement volume)
- [ ] Decision logs (how the team currently handles edge cases)
- [ ] Brand guidelines (logo, color, tone — if relevant)
- [ ] Regulatory references (if compliance-relevant)
- [ ] Stakeholder map (who's involved, who decides what)

### Specialty legal additions

- [ ] Redacted historical scoping memos (10–30)
- [ ] Standard engagement letter templates (all variants)
- [ ] Conflict-check criteria and resolution patterns
- [ ] Jurisdictional rule references used regularly
- [ ] Bar advertising rules summary (per jurisdiction)
- [ ] Privacy policy and DPA terms in current use

### B2B SaaS additions

- [ ] Documented ICP (current version)
- [ ] Best-customer retrospective data
- [ ] Won/lost analysis (last 12 months)
- [ ] Current outbound copy (best-performing SDR examples)
- [ ] Sales playbook (if exists)
- [ ] Customer testimonials and case studies (for voice samples)
- [ ] Pricing pages, comparison decks, competitive positioning materials

### Slovenian businesses additions

- [ ] Customer database export (if intake/CRM in scope)
- [ ] Service / product catalog (if catalog-driven)
- [ ] Past invoicing patterns (if invoicing in scope)
- [ ] Common customer communication patterns (transcripts of customer calls, examples of common emails)

### Document collection request template (sent on Day 3)

```
Subject: [AIS Onboarding] Document collection — please share by [date]

Hi [Function owner name] (cc: [Sponsor]),

For us to deploy agents that match your function, we need the following documents by [date]:

[Numbered list of documents needed, with:
 - What we need
 - Why (one sentence)
 - Acceptable format (PDF / Word / Markdown / structured data export)
 - How to share (shared folder / email attachment / our document portal)]

What if you don't have something?
- "We don't have written SOPs" → we'll do a 2-hour SOP extraction interview during onboarding (counts as part of documented institutional knowledge for the Knowledge Agent)
- "We have it but it's outdated" → send what you have; we'll mark version + freshness
- "We have it but it's confidential" → tell us; we'll set up appropriate access scope or work with redacted versions

For large document collections (>50 files), let us know and we'll set up a structured intake process.

— [Lead cofounder]
```

---

## Day 5 — Voice sample collection plan

Driven by the protocol in `agents/16-sample-voice-locking.md`. Standard request:

### Voice sample request template (sent on Day 5)

```
Subject: [AIS Onboarding] Voice samples — the most important deliverable

Hi [Function owner / Voice owner name],

We need voice samples to lock the agent stack's outputs to your voice. Below 16 samples, outputs read as generic AI. With 16+ curated samples, outputs read as you.

WHAT COUNTS AS A SAMPLE
- A complete, real, in-context output by you. Not a fragment.
- Authentically written by you (not ghostwritten, not template-generated, not AI-assisted)
- Written in the register the deployment will use (customer email, intake response, scoping memo — depends on engagement)
- Recent (last 12–24 months)
- Substantive (100+ words minimum)

WHAT DOESN'T COUNT
- CRM-generated templates
- Marketing copy written by external agencies
- Press releases (committee-edited)
- Auto-generated content
- Old content (>24 months)
- Single-paragraph fragments without context

HOW TO SUBMIT
[Link to shared folder] — upload as PDF, Word, plain text, or paste into the document we created at [link]. Aim for [16 / 25] samples by [date — typically end of week 2 of onboarding].

IF YOU DON'T HAVE 16+ AVAILABLE
That's normal. We'll do voice extraction interviews — 2–3 hours of recorded conversation where you talk through how you'd respond to representative scenarios. We transcribe, edit into samples, you sign off on each as "yes, this is how I'd write it." That's how we close the gap. Reply if you'd like to schedule.

The voice samples are the single highest-leverage onboarding deliverable. The build phase quality hinges on this.

— [Lead cofounder]
```

---

## Day 7 — Kickoff scheduling

Kickoff call scheduled for week 2 of onboarding (typically days 10–14). 60 minutes. In person preferred for Slovenian engagements; video for others.

### Kickoff call agenda

| Min | Topic | Lead |
|---|---|---|
| 0–10 | Re-confirm scope + success metrics | Lead cofounder |
| 10–20 | Walk through onboarding-phase status — what's collected, what's outstanding, blockers | Anej |
| 20–35 | Introduce the build-phase rhythm — weekly cadence, ladder steps, what client should expect each week | Lead cofounder |
| 35–55 | Voice locking interview if needed (or function-walkthrough deep dive if voice samples are already collected) | Lead cofounder + voice owner |
| 55–60 | Q&A + confirm Week 1 start date + name the named-owner pair | Lead cofounder |

### Pre-kickoff brief (drafted by Onboarder Agent, reviewed by lead cofounder day before)

```
# Kickoff Brief — [Client name]

**Date:** [date]
**Attendees:**
- AIS: [Lead cofounder, supporting cofounder]
- Client: [Sponsor, Function owner, Technical contact if needed]

## Onboarding status
- Access provisioning: [X% complete] — outstanding: [list]
- Documents collected: [X% complete] — outstanding: [list]
- Voice samples: [N collected, target M] — gap: [N - target gap]

## Risks / blockers
- [Risk 1 with mitigation plan]
- [Risk 2 with mitigation plan]

## Week 1 readiness
- [Ready: yes / no]
- [If no: what's required to be ready, by when]

## Decisions needed at kickoff
- [Decision 1]
- [Decision 2]

## Things to surface but not press
- [Sensitive topic 1]
- [Sensitive topic 2]
```

---

## Daily / weekly onboarding-phase rhythm

### Daily (Anej, autopilot via Onboarder Agent)

- Check onboarding-status dashboard (all action items, completion %, who's blocked on what)
- Send reminders for items past mid-deadline
- Escalate critical-path items past deadline

### Weekly (Lead cofounder)

- 30-min internal review with Anej on onboarding health
- Status check-in with Sponsor (15 min, optional in onboarding phase since cadence is daily anyway)
- Update onboarding plan if scope or timeline shifts

---

## Common onboarding-phase escalations

### "Access provisioning is taking longer than expected"

- Day 3: send a follow-up to tech contact
- Day 5: escalate to sponsor with specific named blockers
- Day 7: lead cofounder calls sponsor directly to unstick
- Day 10: if still blocked, formal pause notification — onboarding-phase exit will slip

### "We can't get voice samples"

- Day 7: offer voice extraction interview workflow
- Day 10: if voice owner can't allocate the interview time, escalate to sponsor
- Day 14: if still no path, formal re-scoping conversation — engagement may need to drop voice-locked outputs or extend timeline

### "Sponsor / function owner went MIA"

- Day 5 of unresponsiveness: lead cofounder calls (not emails, not Slacks — calls)
- Day 7: formal escalation note about engagement pause risk
- Day 10: engagement formally paused with cost impact noted

### "Client wants to skip a step"

E.g. "do we really need 16 voice samples? Can we start with 8?"

- Response: walk through what skipping does to output quality. Offer voice extraction interview as alternative path to 16. Don't compromise on the 16 threshold — it's documented in the SOW (Section 6.2).

---

## Onboarding-phase exit checklist

Lead cofounder confirms before declaring onboarding complete:

- [ ] All access provisioned (or critical-path access provisioned with documented workaround for non-critical)
- [ ] Required documents collected (or substitute plan in place for missing items)
- [ ] 16+ voice samples collected and validated (25+ for specialty legal)
- [ ] Kickoff call held; both sides aligned
- [ ] Named owners confirmed on both sides
- [ ] Week 1 plan documented and shared
- [ ] First weekly digest scheduled
- [ ] Engagement folder structure created at `/engagements/[client-name]/`

If any checklist item is incomplete and can't be remediated in 3 days, formal decision: extend onboarding (default) or proceed-with-risk (cofounder-level decision, requires risk note in engagement folder).
