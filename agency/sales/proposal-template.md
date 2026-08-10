# Proposal Template

The pre-SOW document that AIS uses to pitch a specific engagement scope, pricing, timeline, and anchor outcome. Distinct from the SOW (which is the contract); the proposal is the sales doc that the client signs off on conceptually before the SOW is drafted.

Most engagements close based on the proposal. The SOW formalizes what the proposal already established.

---

## When proposal vs SOW

| Document | Purpose | When |
|---|---|---|
| **Proposal** | Pitch the engagement: scope, pricing, timeline, expected outcomes | Drafted at end of scoping conversations; sent to client before SOW |
| **SOW** | The contract: legally-binding scope, deliverables, terms, payment schedule, signatures | Drafted after proposal is conceptually approved by client |

The proposal sells. The SOW commits.

Some clients want to skip directly to SOW. Don't. The proposal is shorter, easier to iterate, and forces clarity on the substantive scope before contract language enters the picture. SOW iteration after a clear proposal is faster and cleaner than SOW iteration from a blank page.

---

## Proposal structure

7 sections. Each section earns its place. Length target: 8–12 pages (3,000–4,500 words) plus 1-page summary.

### Section 1 — Summary

One page. The first thing the buyer reads. Captures the essence of the proposal so the buyer can decide whether to engage further or pass.

**Structure:**

```markdown
# [Client name] — Engagement Proposal

## In one sentence
We'll deploy [agent stack] to own [function being owned] over [X weeks of build] and operate it ongoing,
generating [anchor outcome] inside [Y months] of operate phase.

## Build fee
€ [amount] — paid 50% at engagement start, 50% at handoff to operate phase

## Operate retainer
€ [amount]/month — paid monthly in advance, beginning at operate phase start

## Timeline
- Discovery + scoping: completed
- Build phase: [X weeks], starting [date]
- Operate phase: indefinite, beginning [date]
- 12-month off-ramp option available

## Named owners
- AIS lead: [Name]
- Client lead: [Name from scoping]
- Client function owner: [Name from scoping]

## What you read next
- Section 2: your situation (what we heard during scoping)
- Section 3: the function we'll own
- Section 4: the agent stack we'll deploy
- Section 5: build phase week-by-week
- Section 6: outcomes you can expect
- Section 7: commercial terms summary
```

### Section 2 — Your situation

Reflect back what AIS heard during scoping. Demonstrates we understood. Sets up the engagement.

**Structure:**

```markdown
## Your situation

Based on our [N] scoping conversations and the questionnaire you completed:

[3–5 paragraphs reflecting:
 - The function currently being held together by [people / tools]
 - The specific bottlenecks
 - What you've tried before
 - The cost of the status quo (quantified)
 - The trigger for this engagement now]

The function we're going to own is bounded: [restate the one-sentence function definition].
This is where we focus. Adjacent functions stay with your team unless we expand scope in
the future.
```

### Section 3 — The function we'll own

Specific. Bounded. References scoping conversations.

**Structure:**

```markdown
## The function we'll own

[One-sentence function definition]

### Sub-functions in scope
- [Sub-function 1: brief description]
- [Sub-function 2]
- [Sub-function 3]
- ...

### What's out of scope
- [Out-of-scope item 1: brief description of why excluded]
- [Out-of-scope item 2]
- ...

### What stays with your team
- [Function-adjacent work that remains client-owned]
- ...

### How the function changes
**Today:** [current operation, with named operators, current cycle time, current quality]
**With deployed stack:** [post-deployment operation, with maintained operator role, target cycle time, target quality]
```

### Section 4 — The agent stack

Per-agent breakdown. Each agent gets ~150–250 words.

**Structure (per agent in stack):**

```markdown
### [Agent Name]
**Owns:** [specific sub-function]
**Integrations:** [tools wired in]
**AIS-side owner during build:** [cofounder name]
**Your-side owner during operate:** [from scoping]
**Voice locking:** [16+ samples / 25+ for specialty legal] — collected during onboarding
**Specific configuration:** [vertical-specific tuning, key decisions rules, escalation thresholds]
```

Plus a final paragraph naming the Builder workflow (internal AIS infrastructure that assembles the deployment — not something the client interacts with, but worth naming so they know the deployment is structured).

### Section 5 — Build phase week-by-week

The 30-day onboarding ladder (see `agents/work-chart.md`) plus stabilization weeks (per `delivery/build-checklist.md`). Specific to this engagement.

**Structure:**

```markdown
## Build phase — [X weeks]

### Week 1 — Read-only
- Each agent ingests [specific content for this engagement]
- Internal comprehension testing
- Your time: ~[N] hours

### Week 2 — Draft mode
- Each agent generates outputs; all reviewed before any external action
- Voice samples integrated into output generation
- Your time: ~[N] hours (sampling reviewed outputs)

### Week 3 — Internal autonomy
- Outputs publish to internal surfaces only
- Sampling at 20%
- Your time: ~[N] hours

### Week 4 — External deployment
- First external outputs (with monitoring)
- Sampling at 10%
- Your time: ~[N] hours (begins operate-phase rhythm)

### Weeks 5+ — Stabilization (Standard / Comprehensive engagements)
- Volume ramp, edge-case handling, voice tuning, documentation finalization
- Your time: ~[N] hours/week (decreases through phase)

### Build phase end → Validation phase → Handoff
- Validation: 1 week of pre-handoff QC
- Handoff: documentation package + training session + operate phase begins
```

### Section 6 — Outcomes you can expect

Specific. Quantified. With the math.

**Structure:**

```markdown
## Outcomes you can expect

### Primary outcome — the anchor

[Specific anchor metric: e.g. "Cut intake-to-scope time from 8.5 days to under 48 hours within 12 weeks of build start"]

**Conservative case:** [calculated outcome assuming things go modestly well]
**Base case:** [calculated outcome assuming things go as designed]
**Stretch case:** [calculated outcome assuming everything compounds well]

**The math:**
- Current state baseline: [specific number from scoping]
- Estimated post-deployment state: [calculation based on similar engagement experience]
- Net delta: [specific number]
- Value to your business: [translated to € or to time freed]

### Secondary outcomes
- [Operator time reclaimed: X hours/week]
- [Conversion rate impact: Y%]
- [Specific quality outcome: Z]
- [Specific scale outcome: A]

### Payback timeline
- Build fee + 12 months operate retainer = € [total year-1 investment]
- Year-1 outcome value: € [calculation]
- Payback period: [months]
- Year-2 onwards: only operate retainer (€ [annual]), against ongoing outcome value
```

### Section 7 — Commercial terms summary

Brief — full terms live in the SOW. This section is just for proposal-stage decision-making.

**Structure:**

```markdown
## Commercial terms

### Build fee
**€ [amount]** — payment structure:
- 50% on SOW execution
- 50% on handoff to operate phase

### Operate retainer
**€ [amount]/month** — paid monthly in advance, beginning operate-phase start

### Timeline
- Build phase: [X weeks] from start date
- Operate phase: indefinite, with 12-month off-ramp option

### What's included
- All deliverables listed in Section 4 and 5 above
- 30-day onboarding ladder execution
- Voice locking (16+ samples; 25+ for specialty legal)
- Handoff documentation package + training
- Ongoing improvement + voice refresh + monthly digests + quarterly reviews
- Escalation SLA: P1 4-hour response 24/7; P2 same business day

### What's pass-through (itemized on invoice, at cost)
- Third-party tool licenses required for the deployed stack that you don't already hold
- Approved tool API costs above standard allowance

### What's not included
- Paid media management (we don't run ads)
- Custom software development outside the agent stack
- One-off content production beyond what Acquirer Agent produces in operate phase
- Brand identity / visual design / website redesign
- [Specific exclusions per this engagement]

### Off-ramp option
- After 12 months of operate phase, you can take the deployed stack in-house
- Includes refreshed documentation, training sessions, optional support retainer
- Specific terms in the SOW (Section 7.4)
```

---

## What the proposal also includes (appendix)

- **A specific case study** that's similar in shape (vertical / engagement shape / outcome)
- **AIS cofounder bios** (1 paragraph each — Anej, Nejc, Ian)
- **The principles AIS operates under** (link to or quote from `docs/principles.md`)
- **What happens after you approve this proposal** (SOW drafted within 3 business days, sent for review, revisions iterated, signed within 7–14 days; build phase scheduled to start within 2 weeks of SOW signing)

---

## Voice in the proposal

Same voice rules as `docs/voice.md`. No corporate filler, no banned phrases, no self-praise opener, no conclusion-as-summary.

Specific patterns for proposals:

### Lead with the buyer's situation, not AIS

Section 2 is "Your situation" — not "About AIS." If the buyer needs background on AIS, the cofounder bios in appendix handle it. The proposal isn't introducing AIS; the buyer already knows us from discovery and scoping.

### Specific numbers everywhere

Generic claims kill proposals. "Significantly faster intake" doesn't move buyers. "Cut intake-to-scope from 8.5 days to under 48 hours" moves buyers. Every claim has a number behind it.

### Honest expectation-setting

Three-case modelling (conservative / base / stretch) signals integrity. Buyers respect this more than aggressive single-number promises. Most proposals over-promise the base case and never mention the conservative case. AIS does both.

### No fake urgency

Don't add "this offer expires in 7 days" or "limited availability" pressure tactics. Buyers respect honest pricing more than artificial scarcity. The proposal's price is the price; the timeline is the timeline.

### Closing language

Don't end with "Schedule a free consultation to learn more!" Instead:

> "If this proposal aligns with what you're trying to accomplish, the next step is the SOW. We'll draft it within 3 business days of your verbal or written approval. From SOW signature to build-phase start is typically 2 weeks.
>
> If something here doesn't fit — pricing, scope, timeline — let us know what specifically. We can iterate on the proposal. We can also tell you honestly if what you're looking for isn't what we deliver."

---

## Delivery

### Format

- **Primary:** PDF, professionally formatted, branded
- **Secondary:** sharable link (DocSend, Notion page, PandaDoc interactive proposal)
- **Source:** Markdown in the engagement folder, version-controlled (`/engagements/[client-name]/proposal/`)

### Walkthrough

Schedule a 30-min walkthrough call with the client sponsor + function owner. Cofounder walks through the proposal page by page, answers questions.

Most proposals close in this call or in the following week. If the call goes well, end with: "Anything that needs to change before we move to SOW?"

### Iteration

Most proposals iterate 1–2 times before approval. Common iterations:

- Scope adjustments (in/out of scope sub-functions)
- Pricing discussions (rare — we don't discount per `docs/pricing.md`; common is scope-down to fit budget)
- Timeline adjustments (rare; usually accommodated)
- Specific outcomes language (often the buyer wants more or less aggressive language)

Track iterations in the engagement folder.

### Conversion to SOW

Once proposal is verbally or in-writing approved:

- Cofounder lead drafts SOW within 3 business days using `delivery/sow-template.md`
- SOW reflects the proposal — no surprises
- SOW adds: legal language, payment terms, named-owner formalities, schedules
- Send SOW for review
- 7–14 day signing window

---

## When the proposal doesn't close

Sometimes the proposal doesn't convert. Common reasons + responses:

### "Budget doesn't fit"

- Scope down to a Compact engagement if Standard was proposed
- If even Compact doesn't fit, the prospect isn't in our ICP (revenue band too small or budget not committed)
- Don't discount the price; restructure the scope

### "Timing isn't right"

- Often signals soft sponsorship or competing priorities
- Probe: "When would be right? What changes between now and then?"
- If genuine timing issue, queue for re-engagement at named future date
- If signals soft sponsorship, accept the answer and move on

### "We need to think about it"

- Almost always means concerns not surfaced in the proposal walkthrough
- Follow up after 7 days with: "What questions came up that I can address?"
- Don't chase past 14 days without new signal

### "We're going to try doing this internally first"

- Acceptable response
- Offer: "If your internal attempt stalls within 90 days, we'd be happy to pick up the conversation"
- Sometimes signals operator-buy-in problem they don't want to discuss

### "We chose another vendor"

- Ask which vendor and why (often informative)
- Note in `/engagements/[prospect-name]/lost-reasons.md` for pattern recognition over time
- Stay professional; the buyer may circle back if the chosen vendor underdelivers

---

## Failure modes

### Failure 1 — Proposal too generic

Proposal reads like it could be addressed to anyone. Lacks specific references to the buyer's situation, function, math.

*Mitigation:* draft from the scoping notes, not from the template. Every section should have at least one detail that came from scoping conversations. If a section reads as generic, rewrite with scoping context.

### Failure 2 — Anchor outcome too aggressive

Buyer reads the base case as exaggerated. Trust damaged.

*Mitigation:* anchor outcome should be defensible from prior engagement experience or from explicit assumptions. If it's a stretch case dressed as base case, the buyer detects. Use the 3-case modelling honestly.

### Failure 3 — Cofounder walkthrough goes off-script

Cofounder pitches in walkthrough rather than walking through the document. Buyer feels sold-to rather than served.

*Mitigation:* walkthrough is reading + answering questions, not re-pitching. Cofounder discipline: stick to the document, let it speak, answer what's asked.

### Failure 4 — Pricing negotiated below band

Cofounder accepts a discount under pressure that drops margin below 55%.

*Mitigation:* `docs/pricing.md` discount rules are clear. Cofounder refers to them: "Below this band the engagement doesn't pay our actual cost of service. The right path is scope-down, not price-down."

### Failure 5 — Proposal sat too long without follow-up

Cofounder sends proposal, then goes silent. Buyer cools.

*Mitigation:* explicit follow-up cadence: walkthrough call within 5 days of send; written check-in at day 10 if no response; written check-in at day 21; close out (qualify out) at day 30 if still no engagement.

---

## Proposal performance tracking

Per proposal sent, track:

- **Source:** outbound / content / partnership / direct referral
- **Vertical:** which vertical
- **Engagement shape proposed:** Compact / Standard / Comprehensive
- **Days from proposal send to decision:** (closed / lost / no-decision)
- **Outcome:** signed / lost to competitor / lost to internal / no decision / withdrawn
- **Loss reason if lost:** captured in qualitative note

Quarterly review of proposal performance:
- Win rate by vertical
- Win rate by engagement shape
- Median days-to-decision
- Common loss reasons → improvements to proposal template or pricing

Healthy state: win rate >40% on proposals sent. Below 30% suggests we're proposing to under-qualified prospects (improve discovery/scoping quality before proposal).
