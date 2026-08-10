# Case Study Template

How AIS produces case studies from completed engagements. The case study is our highest-credibility sales asset and the primary proof we exist to ship working agent systems, not slide decks.

This file specifies the structure, the production process, the honest-about-failures discipline that distinguishes our case studies, and the distribution plan.

---

## Why case studies matter for AIS specifically

Most agency case studies are sanitized. They show outcomes, hide failures, exaggerate scale. Buyers know to discount them.

AIS case studies are different because:

1. **We document failures.** Every case study includes a "What didn't work" section that lists at least 2 things that didn't go as planned. Buyers trust this immediately.
2. **We name the function, not the company.** Specificity about the deployed system + the specific outcome metric. Not "transformed their operations" — "cut intake-to-scope time from 8.5 days to 1.2 days."
3. **We show the math.** Real numbers with real denominators. Build fee € amount, retainer € amount, payback timeline, partner time reclaimed in hours.
4. **We anonymize honestly.** When client doesn't want named, we anonymize the company but keep the specifics. We never anonymize numbers or function details (which is where buyers get value).

This format produces case studies that get cited by AI engines (per `sales/geo-aeo-strategy.md`) and shared in our ICP communities. The quality bar is the differentiator.

---

## When to write a case study

### Eligibility criteria

A completed engagement qualifies for case study production when ALL of:

- **Build phase completed cleanly** (passed validation per `delivery/validation-framework.md`)
- **Operate phase has run 90+ days** (we have real performance data, not just deployment outputs)
- **Outcomes are measurable** (the primary success metric per the SOW has data)
- **Client has agreed** (named or anonymized; sign-off in writing before publication)

### Timing

- **First draft:** at operate-phase day 90
- **Client review:** within 2 weeks of first draft
- **Iteration:** 1–2 rounds typically
- **Publication:** target within 4 months of operate-phase start

### Volume

At target steady state (4–6 simultaneous operate-phase engagements), 2–3 case studies per year is sustainable. More than that and quality drops; fewer than that and AIS's proof base thins.

---

## Story structure

Every case study follows this structure. Don't deviate.

### Section 1 — Client context

3–4 sentences. Establishes who the client is at the level the reader needs to understand the case.

If named:
> "[Firm name] is a [vertical] firm based in [location], serving [client base] with [N] [lawyers / employees / partners]. The firm handles [X intakes / Y customers / Z transactions] per year, with annual revenue in the [€XM] range."

If anonymized:
> "The client is a specialty IP firm based in EU, with 8 lawyers including 3 named partners, handling ~120 intake inquiries per year. Annual firm revenue in the €3M range. Boutique structure, owner-operator decision-making."

The level of detail is the same; only the name is removed. Anonymization that strips specifics damages credibility — readers can tell.

### Section 2 — The problem

A specific quote from the named buyer (with permission) or paraphrased from the buyer's words (if anonymized). The quote captures the buyer's actual frustration.

Then 2–3 paragraphs of context:

- What was broken or unscalable
- What had been tried before (other vendors, internal attempts)
- Why those didn't work
- What the cost of the problem was (quantified — time, money, lost revenue, partner frustration)

### Section 3 — The function being owned

The specific function AIS would own. Stated as in the engagement charter (one sentence). Then a breakdown:

- Sub-functions inside the bounded function
- Boundaries (what was in scope, what was explicitly out)
- Who would be the AIS-side and client-side named owners
- Why this function specifically — why was it the right one to start with

### Section 4 — The deployment

What AIS shipped. Per-agent breakdown:

- Each agent in the deployed stack (Acquirer / Closer / Operator / Knowledge / Retention)
- What each owned in the engagement
- What each was configured / tuned for the vertical
- What tools each was wired into
- Build phase timeline (weeks, by phase)

Include a diagram or table if it helps comprehension. Don't over-engineer the visuals.

### Section 5 — Onboarding ladder execution

Week-by-week with specific examples:

- Week 1 (read-only): what was ingested, what comprehension was tested
- Week 2 (draft mode): sample outputs with ratings (Strong/Acceptable/Weak distribution)
- Week 3 (internal autonomy): sample outputs going to internal surfaces; sampling rate
- Week 4 (external deployment): first external outputs, monitoring approach

Include redacted sample outputs where possible. Real outputs (with sensitive details removed) are far more credible than described outputs.

### Section 6 — Outcomes

The primary success metric, with before/after numbers.

Then secondary metrics:
- Partner time / operator time reclaimed (in hours/week, quantified)
- Conversion rates affected (intake-to-scope, meeting-to-opportunity, etc.)
- Cost per output / cost per outcome
- Customer / external-stakeholder satisfaction (qualitative or NPS if measured)

Then a quote from the client (with permission). Specific quotes about specific outcomes, not generic praise.

### Section 7 — What didn't work

The differentiator section. Two to four things that didn't go as planned:

- An assumption that turned out wrong
- A timing issue (took longer than planned in some area)
- An integration that didn't work as expected
- A voice-locking iteration that needed extra cycles
- A scope question that surfaced late

For each: what happened, what we did about it, what we'd do differently next time.

This section earns trust. Without it, the case study reads as marketing. With it, the case study reads as a practitioner sharing real work.

### Section 8 — What's next

The engagement is ongoing. What's evolving:

- Voice refresh planned
- Scope additions discussed
- Off-ramp consideration (if 12+ months in)
- Expansion to adjacent functions

### Section 9 — For prospects in similar situations

A short section directed at the reader who is considering hiring AIS for similar work:

- The signals that suggest this is a fit
- The signals that suggest it isn't
- Honest expectation-setting on timeline + cost
- Next step (link to AIS scoping process, contact information)

This is the conversion section. Doesn't push hard — just tells the reader what to do if interested.

---

## The anchor metric

Every case study has one anchor metric in the headline. The number that captures the engagement's value.

Examples:

- "Slovenian aesthetic clinic freed 14 hours/week of owner time and increased rebooking rate by 23% in 6 months"
- "Specialty IP firm cut intake-to-scope time from 8.5 days to 1.2 days in 14 weeks, reclaiming 156 hours/year of partner billable time"
- "€4M ARR B2B SaaS grew outbound-sourced meetings 3.1× in 90 days at €178 cost-per-meeting, down from €1,420"

Picking the anchor metric:
- Must be quantifiable
- Must be material (not vanity — actually moves the business)
- Must be defensible (we can show the math)
- Should be specific to the engagement (not a generic claim every case study could make)

---

## Anonymization rules

When the client doesn't allow naming:

### What gets anonymized
- Company name → generic ("a specialty IP firm" / "a mid-market SaaS company")
- Named individuals → role only ("the managing partner" / "the CRO")
- Specific case details that could identify the firm → generalized
- Proprietary product details → described functionally without brand

### What stays specific
- Revenue band (€1M–€10M ranges are fine to disclose)
- Employee count (specific numbers within ±30% accuracy)
- Geography (country-level is fine; city only if it doesn't identify)
- Vertical and sub-vertical (always disclosed)
- Build fee and retainer ranges (use ranges, not exact figures)
- Outcomes (specific metrics with denominators)
- Build phase timeline (weeks, not vague "several months")
- Voice locking specifics (exact sample counts)

### Anonymization that goes too far

If anonymization strips so much specificity that the case study reads as generic, the case study isn't worth publishing. Better to wait for an engagement willing to be named, or to publish the engagement framework without specific numbers.

---

## Client approval workflow

### Before drafting

Cofounder lead reaches out to client sponsor:
> "We're 90 days into your operate phase. The outcomes are strong and would make a useful case study for our practice. Are you open to that? We can publish named, anonymized, or somewhere in between (e.g. anonymized company, named vertical) — your call."

Get written acknowledgment of intent before any drafting.

### After draft

- Send full draft to client sponsor
- Highlight any quotes that need verbatim approval (sponsor must confirm exact wording)
- Highlight any specific numbers / details where we need confirmation
- Set 2-week review window

### Approval criteria

Client must explicitly approve:
- Their attribution (named vs. anonymized)
- All direct quotes
- All specific numbers and metrics
- The "what didn't work" section (some clients are surprised we want to publish this; explain why, confirm they're OK)
- Any reference to their tools, vendors, or competitors

### Iteration

- 1–2 rounds typical
- Major changes (e.g. removing a key outcome metric, removing the "what didn't work" section) get cofounder-level discussion before accepting

### Final sign-off

Written approval (email confirming "OK to publish as drafted"). Filed in `/engagements/[client-name]/case-study/approval.md`.

---

## Distribution plan

Per case study:

### Day 0 — Published on AIS site
- Permanent home at `/case-studies/[case-study-slug]`
- llms.txt updated to reference if keystone caliber
- robots.txt confirmed allowing relevant AI crawlers

### Day 1–3 — LinkedIn syndication
- Long-form LinkedIn post by the lead cofounder
- Short post by supporting cofounder
- All three cofounders engage with each other's posts (boosts reach)

### Day 7 — Vertical syndication
- Specialty legal case study → relevant legal-tech publications, bar association content channels, legal-design community
- B2B SaaS case study → SaaStr, Pavilion community, GTMfund channels, founder newsletters with editorial relationships
- Slovenian businesses case study → Mladi Podjetnik, Finance.si, local sub-sector groups

### Day 14 — Inbound enablement
- Added to standard discovery-call followup material ("here's a case study from a similar firm")
- Added to proposal-template appendix
- Added to partnership enablement materials

### Day 30 — Outbound enablement
- Used in Acquirer Agent's outbound personalization for similar-vertical prospects ("[similar firm] used us to [outcome] — happy to share details")

### Day 90 — Performance retrospective
- Citation count check (AI engines citing it?)
- LinkedIn engagement metrics
- Inbound attribution (any conversations starting with "I read your case study"?)
- Discovery call references (cofounders bringing it up?)

If high performance: pattern matched for next case study (similar shape, similar vertical, similar headline metric structure).

If low performance: investigate why. Was the anchor metric not compelling? Did distribution underperform?

---

## Failure modes

### Failure 1 — Client refuses to allow publication

After completion, client says no to case study (even anonymized). Common reasons: confidentiality preferences, competitive sensitivity, post-hoc nervousness.

*Mitigation:* set expectation at SOW signing (per `delivery/sow-template.md` Section 8.3 — case study rights with anonymization allowed by default). Even with that, some clients change their mind. Respect the refusal; don't damage the relationship for one case study.

### Failure 2 — "What didn't work" section makes client uncomfortable

Client reviews the draft and asks us to remove the section that names what went wrong.

*Mitigation:* explain the rationale (buyers trust honest case studies more than sanitized ones; we lose credibility by hiding what was real). Offer to soften specific language but not remove the section entirely. If client refuses, decide: publish without (loses our differentiator) or don't publish (preserves brand integrity but loses the asset).

Most clients, when the rationale is explained, allow the section to stand. The "what didn't work" honesty often becomes the section the client is proudest of in retrospect.

### Failure 3 — Outcomes too thin

90 days in, the engagement's outcomes aren't strong enough to anchor a case study. Maybe the deployment had issues; maybe the metric needs more time to mature.

*Mitigation:* wait. 180-day case studies are fine. 12-month case studies often have better data anyway. Don't publish thin case studies — they hurt credibility.

### Failure 4 — Headline anchor metric isn't real

We thought the engagement moved metric X. Closer inspection shows the math is shaky (attribution unclear, denominators questionable).

*Mitigation:* don't publish with shaky math. Re-investigate. Often a different metric is the real anchor. If no metric is defensible, the engagement may not be case-study-worthy yet — operate phase needs more data.

### Failure 5 — Citation rate low

Published case study doesn't get cited by AI engines. Doesn't drive inbound. The investment of cofounder time on the case study doesn't pay back.

*Mitigation:* analyze why. Was the anchor metric not search-relevant? Was the topic not what buyers query about? Was the title not specific enough? Update the next case study's format based on learnings. Some case studies will underperform; the average matters more than any one.

---

## Case study folder structure

Per case study:

```
/agency/case-studies/[case-study-slug]/
├── draft-v1.md         ← First draft for client review
├── draft-v2.md         ← After client feedback
├── final.md            ← Published version
├── approval.md         ← Client written approval
├── distribution-log.md ← When syndicated where
├── performance-log.md  ← Quarterly metrics retrospective
└── assets/             ← Diagrams, sample-output screenshots (redacted)
```

Each case study is treated as a long-lived asset. Performance tracked over years, not weeks.
