# Vertical Playbook Template

Canonical structure for every vertical playbook. Read before drafting a new one. All vertical files in this directory follow this shape.

Skipping sections produces playbooks that don't qualify prospects, don't price correctly, and don't survive cofounder review. Every section earns its place.

---

## Section 1 — Vertical name + one-line tagline

Open with the vertical name and a single sentence that captures what we sell to it. Not a slogan. A specific statement of the function we own.

**Example:**
> **Specialty legal — boutique IP, M&A, immigration, and regulatory firms.**
> AIS owns the client intake function — from first inquiry through scoped engagement memo — for specialty legal firms running 50–500 intakes per year.

---

## Section 2 — Why we picked this vertical

One paragraph stating how the vertical clears each of the four axes (function-bounded, buyer-authoritative, work-encoded, margin-viable). Include specific evidence — not assertions.

**Example:**
> The intake function is bounded (~6 sub-steps, all encoded). The buyer is a senior partner with decision authority and a personal P&L stake in firm efficiency. The work is documents and structured decisions (no in-room negotiation required). Build fee €40K + operate retainer €7K/mo on a typical 75-intake-per-year firm clears 70% contribution margin after cofounder time and inference. All four axes pass.

---

## Section 3 — ICP signals

Three sub-sections: firmographic, role, function-shape.

**Firmographic** — revenue band, employee count, geographic concentration, sub-vertical. Use specific numbers.

**Role** — who is the buyer? Title, decision authority, what their week looks like, what they currently struggle with that's relevant.

**Function-shape** — what does the bought function look like inside the buyer's current operation? Volume, current tooling, current people involved, current pain.

**Example:**
> **Firmographic:** EU-based specialty legal firms with €1M–€10M annual revenue, 3–25 lawyers, focused on IP, M&A, immigration, or regulatory law. Boutique structure (not affiliated with a multi-jurisdiction megafirm).
>
> **Role:** Managing partner or named-equity partner. Owns billable hours target, firm strategy, hiring. Has been at the firm 8+ years, has personal book of business, can sign €50K+ without partnership vote in most boutique structures.
>
> **Function-shape:** Intake currently handled by a paralegal or junior associate. ~50–200 inquiries/year. Average time from inquiry to scoped engagement memo: 8–14 days. Bottleneck is conflict-of-interest check (manual database lookup) and scoping memo drafting (senior associate time).

---

## Section 4 — Pain map

Three to five named pain points the prospect actually feels. Specific. Quantified where possible. Not generic complaints.

**Example:**
> **Pain 1 — Conflict checks bottleneck intake.** Average 2–4 days for conflict check to clear. Junior staff time. Often delays first prospect contact past competitor responses.
>
> **Pain 2 — Scoping memos eat senior partner time.** Each scoping memo takes 1–3 hours of partner billable-rate time, much of it copy-paste from prior engagements with adjustments.
>
> **Pain 3 — Intake form abandonment.** Web intake forms have ~60% abandonment because they're long and unfriendly. Prospects who abandon are lost — no recovery sequence.
>
> **Pain 4 — Lost intake follow-up.** Inquiries that don't convert immediately don't get systematic follow-up. Lost revenue impossible to quantify because nobody tracks the abandoned inquiries.

---

## Section 5 — Agent stack

Which agents from the canonical roster (see `/agents/` in Phase 3) get deployed for this vertical. How each is configured. What tools each is wired into. What human owners (AIS-side and client-side) get assigned.

**Example:**
> **Acquirer Agent (non-paid):**
> - GEO/AEO content on the firm's specialty area (e.g. EU patent strategy for biotech founders, US M&A diligence for cross-border deals)
> - Partnership outreach to referring sources (e.g. accelerators, IP brokers, immigration consultancies)
> - Qualified outbound to in-house counsel at companies showing relevant signals (new patent applications, recent acquisitions, etc.)
> - AIS-side owner: Anej Vučič. Client-side owner: marketing lead or managing partner.
>
> **Closer Agent:**
> - Intake form (replaces existing form with a friendlier conversational interface)
> - Initial qualifying questions (jurisdiction, urgency, scope range)
> - Conflict-check API wiring (to firm's existing database)
> - Scheduling for partner intake call
> - AIS-side owner: Ian Veber. Client-side owner: intake paralegal or office manager.
>
> [... continue for each deployed agent]

---

## Section 6 — Pricing band

Build fee range and operate retainer range for this vertical, sized using the rules in `/docs/pricing.md`. Include rationale — why this vertical sits at the band it does (which complexity tier, which engagement shape).

**Example:**
> **Build fee:** €30K–€60K depending on intake volume, firm size, and existing tooling integration count.
> - €30K–€40K: 1–3 lawyer firms, <100 intakes/year, common tools (Clio, MyCase, etc.)
> - €40K–€50K: 4–10 lawyer firms, 100–300 intakes/year, possibly custom CRM
> - €50K–€60K: 10–25 lawyer firms, 300+ intakes/year, complex compliance review process
>
> **Operate retainer:** €6K–€9K/month
> - Base retainer covers monthly performance review, voice maintenance, incremental improvement
> - Higher end reflects higher intake volume requiring more sampling and tighter monitoring
>
> **Rationale:** Specialty legal sits at the high-complexity tier (compliance review, conflict-checking, multi-jurisdictional handling possible) and the standard engagement shape (2–3 agents typical). Margins target 65–70% given the senior-partner buyer's willingness to pay for the function they currently bottleneck on.

---

## Section 7 — Discovery script

Ordered list of qualifying questions for a discovery call. Each question should produce a binary qualifier (pass / fail / probe further) — not open-ended exploration.

Include the "must-pass" questions clearly labelled.

**Example:**
> **Must-pass questions (any "no" = decline the engagement):**
>
> 1. "Who at the firm signs off on engagements in the €30K–€60K range?" → must be the person on the call, or someone they can pull in inside one week.
> 2. "Who would be the named internal owner of the intake system after deployment?" → must be a specific named person, not a "we'll figure it out."
> 3. "Are you OK with us running a 30-day onboarding ladder before external deployment?" → must be yes.
> 4. "Is your conflict-check database API-accessible, or could it be?" → must be yes (or yes-with-some-work).
> 5. "What's the firm's policy on cloud-deployed AI handling client matters?" → must be cloud-OK.
>
> **Sizing questions:**
> 6. "Roughly how many intake inquiries per year does the firm currently process?"
> 7. "What's the current bottleneck — getting more inquiries, qualifying them faster, or scoping them faster?"
> 8. "What CRM and intake tooling is in place today?"
>
> **Risk-detection questions:**
> 9. "Who on staff would feel threatened by an agent-driven intake system?"
> 10. "Has the firm tried AI for intake or scoping before? What happened?"

---

## Section 8 — Proposal anchor

The specific outcome we pitch in the proposal. One concrete before/after, supported by the agent stack. Not "improve your intake" — a specific quantifiable claim with the math behind it.

**Example:**
> **Anchor:** "Cut average intake-to-scoped-memo time from 8–14 days to 24–48 hours, while reducing partner involvement on routine scoping from 1–3 hours per intake to 15 minutes for review-and-approve."
>
> **Math behind the claim:**
> - Current state: partner draws ~2 hours/week on scoping at €400/hr opportunity cost = €41,600/year of partner billable time spent on scoping
> - Post-deployment: partner draws ~30 min/week reviewing agent-drafted scoping = €10,400/year, freeing 78% of that time
> - Net partner billable capacity reclaimed: ~€31,200/year at average rate
> - Build fee + 12 months operate retainer ~€114,000 → payback in year 3 from partner time alone, before factoring incremental intake conversion lift

---

## Section 9 — Failure modes

Three to five things that have killed (or could kill) engagements in this vertical. Be specific. Include the failure pattern AND the early-warning sign.

**Example:**
> **Failure 1 — Partner sponsorship evaporates after build phase.** Partner signed the engagement but didn't stay engaged after build phase started. Junior staff handled onboarding, didn't have authority to make ladder decisions, agents drifted.
> *Early warning:* Partner cancels week-2 check-in. Pause and escalate to partner-level conversation immediately.
>
> **Failure 2 — Compliance review owner missing.** Agent outputs need lawyer review before external deployment. If no one owns that review, week-4 ladder step gets stuck or skipped.
> *Early warning:* "Who reviews agent outputs before they go to clients?" answered with vague hand-waving in week 2. Escalate.

---

## Section 10 — Kill criteria

When to walk away from a prospect in this vertical, even if they want to pay. Distinct from the discovery-script qualifiers — these are deeper structural issues that come up later in the sales conversation.

**Example:**
> - Prospect insists on on-premises deployment (we don't do on-prem)
> - Prospect requires response to RFP committee (committee-buyer = decline)
> - Prospect can't get sponsoring partner to first scoping call (signals soft sponsorship)
> - Prospect treats AI as research tool, not function owner (wrong category — refer to CoCounsel or Harvey)
> - Prospect's existing intake staff is openly hostile to AI deployment (operator buy-in missing)

---

## Section 11 — Acquirer Agent specifics

Where the vertical's buyers hang out, what kinds of content get cited by AI search in the vertical, which partnerships are worth building. Vertical-specific Acquirer Agent configuration.

**Example:**
> **Where buyers hang out:** LinkedIn (especially groups around boutique IP practice management), legal-tech podcasts, ALA (Association of Legal Administrators) regional events, specialty bar association mailing lists.
>
> **Cited content shapes:** Long-form practice management articles (e.g. "How boutique IP firms automate conflict checking in 2026"), case studies on intake efficiency, comparison articles between manual and agent-driven intake.
>
> **Partnerships worth building:**
> - Legal-tech consultants (refer back-and-forth for non-overlapping work)
> - Practice management software vendors (Clio, MyCase) — integration partnerships
> - Specialty CLE providers (continuing legal education programs) — speaker placement for cofounders
>
> **Avoid:** General legal-marketing agencies (they push paid search and SEO, which is our anti-pattern; awkward partnership shape).

---

## Section 12 — Case study angle

When we publish a case study from this vertical, what's the headline metric? What's the structure of the story?

**Example:**
> **Headline metric:** "Boutique IP firm cut intake-to-scope time by 82% in 14 weeks."
>
> **Story structure:**
> 1. Firm context (size, specialty, intake volume baseline)
> 2. Pain (partner time bottleneck, intake form abandonment)
> 3. Deployment (Closer + Knowledge agents, 10-week build)
> 4. Onboarding ladder execution (week-by-week with samples)
> 5. Outcomes (intake-to-scope time, partner time reclaimed, incremental intake conversion)
> 6. What didn't work (be honest — boring case studies are uncited; honest ones get shared)

---

## Section 13 — Vertical-specific knowledge requirements

What does the AIS team need to learn to play in this vertical credibly? What expertise must we acquire (or partner for)?

**Example:**
> **Must-know:**
> - Conflict-of-interest rules in EU and US jurisdictions (high-level — for deployment scoping, not for legal advice)
> - Common practice-management software (Clio, MyCase, PracticePanther) — at least demo familiarity
> - Specialty bar association structures (which partners we're selling to)
> - Engagement letter structures and how they vary by specialty
>
> **Nice-to-have:**
> - Familiarity with major case databases (Westlaw, LexisNexis) for understanding the firm's broader tech stack
> - Awareness of CoCounsel, Harvey, and other legal-AI competitors so we can articulate where we differ
>
> **Partnership for:**
> - Detailed jurisdictional regulatory advice (we don't give legal advice; partner with a legal-tech consultancy if a client question goes deep)
> - Privilege and confidentiality assessment for cloud deployment (have a legal-tech security consultant on call)

---

## How to use this template

When drafting a new vertical playbook:

1. Copy this template into a new file at `verticals/[vertical-name].md`.
2. Fill in each section completely. Don't skip. Don't fill placeholder copy.
3. Have at least one cofounder review the draft. The four-axis test should be re-applied at draft-review.
4. Don't run engagements against the playbook until the draft has been reviewed and the cofounder has signed off.

A playbook that skips sections produces engagements that fail. The discipline is to do the work upfront.
