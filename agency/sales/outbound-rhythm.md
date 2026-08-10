# Outbound Rhythm

Qualified outbound only. Quality over volume. AIS does not run mass outbound. Every first-touch is hyper-personalized against a specific intent signal, drafted by Acquirer Agent, approved by cofounder.

The volume target reflects this discipline: 20–50 first-touches per month total across all three verticals. Most agencies running outbound do 500–5000 per month. The math is different at our volume — we win on reply rate (target 15–25%) not on volume.

---

## What qualifies as outbound (and what doesn't)

### Qualified outbound — what we do

- **Intent-triggered.** Each first-touch is triggered by a specific recent signal (job posting, tech-stack change, exec move, funding event, publication, vertical-specific signal). The first-touch references the signal explicitly.
- **Multi-source enriched.** Each prospect is enriched with data from 3+ sources (Apollo + LinkedIn + Crunchbase + signal source) before first-touch is drafted.
- **Hyper-personalized.** Each first-touch is unique. The opening line references something specific to this prospect (their company's recent change, their published content, their role's likely current state). No templates that swap [FirstName] tokens.
- **Cofounder-approved (in build phase).** Every first-touch is reviewed by a cofounder before send during build phase. As the system proves itself, low-risk message classes can automate in operate phase.

### What we don't do

- **Mass outbound.** No 500+ emails per week. No scraped lists of 10,000 prospects. No spray-and-pray.
- **Template-based personalization.** No "Hi {FirstName}, I noticed your company {CompanyName} is in {Industry}." Detectable as template-driven, low reply rates, brand damage.
- **Unverified-list outbound.** No purchased lists. No scraped emails without legitimate ICP filtering. No outbound to prospects we haven't enriched and qualified.
- **High-volume LinkedIn DMs.** LinkedIn rate limits + relationship cost too high to abuse.
- **Cold call dialing.** Not part of our motion. Don't have the infrastructure or cofounder time for it.

The discipline matters because mass outbound is a different business — different infrastructure, different talent profile, different metrics. Trying to do both means doing both badly.

---

## The cycle

For every outbound prospect, the cycle is:

### 1. Signal triggers

Acquirer Agent monitors signal sources 24/7. Per `sales/ais-acquisition-system.md`, the signal sources for AIS-internal outbound:

- **Specialty legal:** Lex Machina (IP firm activity), legal news APIs (M&A deal announcements), LinkedIn (partner publications, firm hiring patterns), bar association content engagement
- **B2B SaaS:** Greenhouse/Lever (SDR/BDR hiring signals), Crunchbase (funding events), BuiltWith (tech stack changes), LinkedIn (CRO/VP GTM moves), G2 review activity for adjacent categories
- **Slovenian businesses:** Bizi.si (registry changes — new locations, ownership changes), Mladi Podjetnik content engagement (owner-operators publishing or commenting), LinkedIn Slovenia (key role hires at SMB scale), local news APIs

Signals filtered against AIS's ICP definition. Only signals from ICP-fit prospects proceed.

### 2. Enrichment

For each ICP-fit signal, multi-source enrichment:

- **Company data:** Apollo for firmographic, Crunchbase for funding history, BuiltWith for tech stack, public site scrape for recent news
- **Person data:** LinkedIn (role, tenure, content patterns), recent publications or speaking, prior company history
- **Signal context:** what triggered, when, what it likely means about buying readiness

Enrichment quality is the input to personalization quality. Thin enrichment = generic first-touch = low reply rate.

### 3. First-touch drafting

Acquirer Agent drafts the first-touch. Three constraints:

- **Specific opener.** First sentence references something specific about this prospect — the signal, their published content, their company's recent move. Not "Hi [name], I noticed your company..."
- **Plausible reason for reaching out.** Why now. Why them. Why us.
- **Light ask.** Not "schedule a call." Either a yes/no question that's easy to answer, or a soft offer ("happy to share how three similar firms handled this — useful?").

Length: 80–150 words for email. 50–100 words for LinkedIn DM. Longer than this signals desperation; shorter than this signals laziness.

### 4. Cofounder approval (build phase)

Queued first-touches show up in cofounder approval queue. Cofounder reviews:

- Is the personalization specific and real (not hallucinated)?
- Does the message respect the brand?
- Is the ask appropriate to the signal?
- Would this prospect be a fit if they replied?

Approve, modify, or kill. Approved touches send via the configured outbound platform.

### 5. Multi-touch sequence

If no reply within 5 business days, sequence continues. Standard sequence:

- **Touch 1 (Day 0):** the initial signal-triggered first-touch
- **Touch 2 (Day 5):** new angle — different value prop, different question, or new signal
- **Touch 3 (Day 14):** bump with a specific case-study reference or article link
- **Touch 4 (Day 28):** soft close — "if not now, when?"
- **Touch 5 (Day 60):** re-engagement trigger (only if a new signal fires for this prospect)

If no reply across touches 1–4, prospect goes into the re-engagement queue (touch 5 fires only on new signal trigger).

### 6. Reply classification (Closer Agent)

Per `agents/closer-agent.md`:

- **Interested:** route to lead cofounder for the engagement vertical, schedule discovery
- **Wrong-person:** acknowledge politely, ask who is the right person
- **Not-now:** acknowledge, queue for re-engagement
- **Unsubscribe:** remove from sequence, log explicitly
- **Wrong-company:** acknowledge, mark prospect's company as out-of-scope
- **Question:** route to cofounder for personal response (don't auto-respond)
- **Complaint:** immediate cofounder escalation, no auto-response

### 7. Discovery → Scoping → SOW

Interested replies enter the delivery workflow (Phase 1 of `delivery/phases.md`).

---

## Channel selection — email vs LinkedIn vs both

### Email first, LinkedIn second

- **Email:** most B2B buyers prefer email for first contact. Email also allows longer-form personalization. Default channel for first-touch.
- **LinkedIn:** good for follow-up if email doesn't land. Also good when prospect's email isn't easily verifiable. Secondary channel.
- **Multi-channel coordination:** if both used, sequence appropriately — don't email and LinkedIn the same day (signals desperation).

### Vertical preferences

- **Specialty legal:** email primary, LinkedIn rarely (legal bar rules in some jurisdictions restrict LinkedIn solicitation)
- **B2B SaaS:** email primary, LinkedIn frequent follow-up (SaaS founders/operators live on LinkedIn)
- **Slovenian businesses:** email primary, LinkedIn moderate use, in-person coffee meeting offer also viable for SI prospects

### Channel rules

- Never message a prospect on more than 2 channels per touch
- Always respect platform-specific etiquette (LinkedIn DMs shorter and more conversational than email)
- Never use phone unless explicitly invited

---

## Volume math

### Per-cofounder approval capacity

A cofounder reviewing first-touches at 1–2 minutes each: 30 first-touches/hour. Sustainable rate: ~1 hour/week of approval time per cofounder. So ~30 approvals per cofounder per week.

### Per-engagement vertical allocation

| Vertical | First-touches/month target | Cofounder approval time/month |
|---|---|---|
| Specialty legal | 10–20 | 1–2 hours |
| B2B SaaS | 15–25 | 1.5–2.5 hours |
| Slovenian businesses | 10–20 | 1–2 hours |
| **Total** | **35–65** | **3.5–6.5 hours** |

(Spread across cofounders by vertical specialization — though all cofounders touch all verticals as needed.)

### Reply rate math (at target quality)

- Target reply rate: 15–25%
- At 50 first-touches/month: 7–12 replies/month
- Of replies, 30–50% are interested-to-discover: 2–6 discovery calls/month from outbound alone
- Add inbound from content + partnerships: 6–10 total discovery calls/month target

At those numbers, AIS's pipeline is fueled at the right rate for cofounder bandwidth. More volume would overflow capacity downstream (cofounders can't handle 20 discovery calls/month while also building engagements).

The volume discipline isn't artistic — it's calibrated to cofounder downstream capacity.

---

## Re-engagement triggers

Not-now replies and unconverted touch-4 prospects sit in re-engagement queue. New touches fire only on new signal trigger.

### What triggers re-engagement

- **New job posting at same company** (e.g. they hired the SDR they were considering when we first reached out — implication: GTM tooling decisions now active)
- **Funding event** (capital available; tooling decisions more likely)
- **Exec change in the relevant role** (new exec evaluating GTM stack)
- **Significant content publication by the prospect** (signals visibility investment, often preceding tooling investment)
- **Industry event proximity** (e.g. month before SaaStr Annual; legal-tech conferences)
- **Anniversary of previous touch** (re-engagement is often timing-dependent; sometimes 6-month gap is the right interval)

Re-engagement touch is always referenced to the new signal ("I reached out 4 months ago about [topic]. Just saw [new signal] — different context now, here's why I'm following up again").

### Re-engagement quality bar

Same approval discipline as new outbound. Cofounder approves. No autopilot re-engagement until the system has been operating long enough to prove its judgment on what's a good re-engagement trigger.

---

## Failure modes

### Failure 1 — Personalization is fake-specific

Acquirer Agent's first-touch references a "specific" signal that's actually generic — e.g. "I saw your company is growing" when the only signal was a job posting. Prospect reads it as templated and discards.

*Early warning:* low reply rate; sampled outputs feel hollow when cofounder reviews.
*Mitigation:* tighten Acquirer Agent's signal-to-personalization rules. If the signal is generic, decline the prospect or upgrade the enrichment depth.

### Failure 2 — Reply queue overflows

Cofounders can't keep up with replies (volume of conversations exceeds bandwidth). Some replies sit 5+ days; prospect cools.

*Early warning:* reply-to-response time trending up; specific replies aging in queue.
*Mitigation:* reduce outbound volume temporarily until reply queue clears. Investigate which cofounder is bottlenecked and rebalance.

### Failure 3 — Domain reputation degrades

Sender domain reputation drops because of deliverability issues. Open rates collapse. Reply rates collapse.

*Early warning:* open rate drops below 30%, spam complaint rate above 0.1%.
*Mitigation:* immediate volume pause. Audit sender reputation (Sender Score, Talos, postmaster.google.com tools). Re-warm domain over 4–6 weeks. Consider rotating to secondary sending domain.

### Failure 4 — LinkedIn account flagged

LinkedIn account triggers their bot-detection or solicitation-policy enforcement. Account restricted or warned.

*Early warning:* LinkedIn message send rate decreases; CAPTCHAs appear; account warnings received.
*Mitigation:* immediate pause on LinkedIn outbound from affected account. Investigate cause (volume too high, messages flagged as solicitation, profile activity pattern). Resume only when account is healthy. Always use cofounder personal accounts (not impersonated accounts).

### Failure 5 — Cofounder approval becomes rubber-stamp

Cofounder approves every queued touch without meaningful review. Quality degrades over time without anyone noticing.

*Early warning:* approval rate is 95%+; cofounder spending <10 min/week on approval despite queue volume justifying more.
*Mitigation:* cofounder discipline check — approval should reject 10–20% of queued touches in healthy state. If approval rate is too high, tighten Acquirer Agent's pre-queue quality filter (fewer, better drafts) and cofounder spends more meaningful time per approval.

### Failure 6 — Signal sources lose signal

Signal source that was previously reliable stops producing ICP-fit prospects. Maybe the source's data quality degraded; maybe ICP shifted.

*Early warning:* signal-to-reply rate drops on a specific source over 4+ weeks.
*Mitigation:* quarterly signal source review. Drop sources whose performance can't be restored. Test new signal sources continuously.

---

## What the cofounder reviews when approving a touch

For each queued first-touch, 30-second review:

- [ ] Is the personalization specific (not generic-feeling)?
- [ ] Does the signal context make sense?
- [ ] Is the ask appropriate?
- [ ] Would this prospect fit our ICP if they replied?
- [ ] Is the voice consistent with AIS standards?
- [ ] Are there any red flags (sensitive topic, off-tone, factual error)?

If all yes: approve.
If any concern: edit or kill.
If pattern of issues: tag for Acquirer Agent prompt update.

---

## Operate-phase automation graduation

After build phase, some message classes can move to operate-phase automation (Acquirer Agent sends without cofounder approval). The graduation criteria per message class:

### Always auto-eligible (after build phase)
- Follow-up touches within an existing approved sequence (touches 2, 3, 4 after touch 1 was approved)
- Sequence pauses when reply comes in
- Sequence resumes if not-now reply opts in to later contact

### Never auto-eligible (always cofounder-approved)
- First-touch new prospect outreach (the highest-stakes touch)
- Re-engagement touches (judgment on signal quality required)
- Any touch to a previously-replied-with-complaint prospect
- Any touch in a sensitive vertical context (specialty legal especially)

### Graduate after demonstrated quality
- Auto-classification of replies (Closer Agent's standard classes) — automatic in operate after 90 days of >95% accuracy in build
- Auto-scheduling of meetings when reply is "interested" — automatic in operate after 90 days
- Auto-CRM updates — automatic in operate after build phase

The graduation discipline: don't auto-pilot anything that's borderline. If a class of action might cause embarrassment when wrong, keep cofounder in the loop.

---

## Weekly outbound rhythm

| Day | Activity | Owner |
|---|---|---|
| Monday morning | Acquirer Agent delivers prior-week metrics + this-week's signal-triggered prospect list | Acquirer Agent → cofounders |
| Monday afternoon | Cofounder time: 30–60 min outbound approval queue review | Lead cofounder per vertical |
| Tuesday–Thursday | Outbound sends throughout the day, scheduled by Acquirer based on prospect timezone + best-time-to-reach data | Acquirer Agent autopilot |
| Throughout week | Reply handling — Closer Agent classifies, routes to cofounder for non-auto-respondable replies | Closer Agent + cofounders |
| Friday afternoon | Weekly outbound digest | Acquirer Agent → cofounders |
