# Vertical Selection Framework — AIS Slovenia

How we decide whether a vertical belongs in the playbook. Read before adding any new vertical.

A vertical is a multi-year commitment. Once we add one, we build a playbook, learn the buyer psychology, ship the content, develop the partner network, and refuse adjacent work that doesn't fit. Adding a wrong vertical costs ~6 months of focus. The four-axis test exists to make this decision deliberately.

---

## The four axes

A candidate vertical must clear all four. Failing any one is disqualifying. We do not run engagements in verticals that fail the test, even if a prospect is willing to pay.

### Axis 1 — Function-bounded

**Question:** Can an agent stack own a complete function in this vertical, end-to-end? Or does the function fragment across too many stakeholders, tools, or dependencies?

**Pass:** Specialty legal client intake is bounded — define ICP, content, lead capture, conflict check, intake form, scheduling, scoping memo. ~6 sub-steps, all encoded. An agent stack can own it.

**Fail:** Generic "B2B marketing" for a CPG brand. Touches brand, performance media, retail co-op, distributor relations, in-store activation, PR, social, influencer. ~20 sub-functions, half embodied, dependency on physical retail. Not bounded.

**Test it:** Write the function as a flowchart. If it fits on one page with named inputs and outputs at each step, it's bounded. If it has loops back to "depends on the client" or "depends on the partner," it isn't.

### Axis 2 — Buyer-authoritative

**Question:** Does the buyer have decision authority to sign €25K–€100K without committee or board approval? Can they make the call in 1–3 conversations?

**Pass:** Owner-operator legal partner. Founder CEO of mid-market SaaS. Owner of Slovenian specialty clinic. All can decide solo, sign within a month.

**Fail:** Marketing manager at an enterprise. Procurement-gated buying processes. Anything that needs IT security review + legal review + CFO sign-off + board approval. Sales cycle blows past 60 days, prospect goes cold, engagement either doesn't close or closes degraded.

**Test it:** Ask in discovery — "If we align on scope and price, who else needs to be in the room?" Pass: zero, or one person already aligned. Fail: any answer involving committee, RFP, procurement, or "I'll need to bring this up next quarter."

### Axis 3 — Work-encoded

**Question:** Is the work primarily encoded (documents, data, structured decisions) or embodied (physical presence, pure-relationship trust, in-room judgment)?

**Pass:** Document review. Intake forms. Outbound copy. Scheduling. Reporting. Categorization. Conflict checking. Memo drafting. All encoded — agents can do them, with appropriate human review.

**Fail:** Bedside manner. In-person negotiation where physical presence is the leverage. Embodied therapy. Hands-on medical examination. Physical inspection. Anything where the buyer is paying for human presence as the core value.

**Test it:** Could the function be done by a remote operator who never meets the client face-to-face? If yes, it's encoded. If the client would refuse a remote operator, it's embodied.

### Axis 4 — Margin-viable

**Question:** At the price band this vertical can bear, does contribution margin clear 55%? Ideally 65%+?

**Pass:** Specialty legal — average build fee €40K, operate retainer €7K/mo. Cofounder time + inference costs run ~28% of revenue. Contribution margin clears 70%.

**Fail:** Restaurant operations — typical owner can pay €5K build fee max, €500/mo operate. Cofounder time to deploy and operate eats 60%+ of revenue. Contribution margin negative.

**Test it:** Build a model — typical engagement revenue × estimated cofounder hours × loaded hourly rate × inference costs. If margin is below 55%, the vertical can't pay our actual cost of service.

---

## The kill list

Even if a vertical passes the four axes, certain patterns disqualify it. Watch for:

- **Paid-media-as-default expectation.** If the buyer base assumes "AI agency = ad management," every conversation starts with us saying no. Drains acquirer-side time. Refer the entire vertical out.
- **Sub-€1M revenue ICP.** Even if the function is bounded and the buyer is authoritative, sub-€1M businesses can't afford the price band. Pushing them into our model damages both sides.
- **Multi-jurisdictional regulatory complexity without coordination.** If the work requires navigating 5+ regulatory regimes and the client doesn't have internal compliance ownership, we can't safely deploy. (Specialty legal *passes* this — they own compliance internally. Multi-country fintech without GC *fails* it.)
- **AI-as-magic-bullet buyer expectation.** Buyers who want "AI to just handle it" without operator commitment. We've already decided not to deploy floating AI; if the entire vertical's buyer base expects this, the vertical is a bad fit.
- **Vendor-lock-in tooling.** Verticals dominated by closed-system vendors (proprietary CRMs, walled-garden platforms) where we can't get the API access to deploy. We can't build what we can't integrate.
- **Compliance regimes that prohibit cloud AI.** Some regulatory regimes (US federal contracting, certain EU public-sector) require on-prem AI deployment. We don't do on-prem — the pricing model breaks. Refer out.

---

## Process for adding a new vertical

We add verticals deliberately, not reactively. Five steps from candidate to fully-supported vertical:

### Step 1 — Candidate identification (~1 week)

Source: a prospect from the vertical reaches out, a cofounder spots a pattern across multiple inbounds, or an existing client refers into a new vertical. Don't add a vertical because a single inbound asked — wait for at least three signals.

### Step 2 — Four-axis test + research (~2 weeks)

Run the candidate through the four axes. Research: read 3–5 published case studies from any agency or vendor in this vertical, talk to 2 operators in this vertical (not buyers — operators), pull a representative ICP firmographic profile. Document findings.

### Step 3 — Draft playbook (~1–2 weeks)

Write the vertical playbook following `_template.md`. Don't ship engagements before the playbook is at least drafted (even rough). The drafting process forces the four-axis test to be honest — abstract "this seems like a good fit" turns concrete fast when you have to write the discovery script and pricing band.

### Step 4 — Pilot engagement (one engagement, 6–12 weeks build phase)

Take one engagement in the vertical. Discounted up to 15% in exchange for case-study collaboration rights (per `pricing.md`). Run the playbook. Document what the playbook got wrong, what the four-axis test missed, what the pricing band should actually be.

### Step 5 — Promote or kill (~1 month after pilot completes build phase)

Cofounder review. Did the pilot pencil to 55%+ margin? Did the discovery script qualify accurately? Did the agent stack work as specified? Did the buyer behave as the playbook predicted?

- If yes: promote to full vertical. Update the playbook with pilot learnings. Allocate Acquirer Agent time to the vertical's content/outbound.
- If mixed: revise the playbook. Run a second pilot.
- If no: kill the vertical. Document why in `verticals/_archive.md`. Refund or off-ramp the pilot client gracefully.

We have killed verticals before reaching this step. Killing early is cheaper than committing to a long-tail wrong vertical.

---

## The current vertical roster

As of Phase 2 (May 2026):

| Vertical | Status | Notes |
|---|---|---|
| Slovenian businesses (geography moat) | Live | First seed vertical. Plays to language and local trust networks. |
| Specialty legal | Live | High-margin, regulatory-rigour vertical. Boutique IP / M&A / immigration / regulatory firms. |
| B2B SaaS demand-gen | Live | Closest adjacency to AIS's lead-gen / Claude automation strengths. |

Candidate verticals (not yet drafted):

- Aesthetic medicine (Ian has Veta-side playbook material in vault; conflict if Veta and AIS both target — needs cofounder discussion before promoting)
- Specialty dental (similar conflict; Veta material exists)
- Fintech (compliance-heavy, similar shape to specialty legal but smaller buyer pool)
- Maritime (niche, low competition, requires deeper vertical research)

---

## When a prospect doesn't fit any current vertical

This happens. The response sequence:

1. **Diagnose the prospect against the four-axis test.** Do they pass even without a playbook? If they fail one axis, refuse directly. If they pass all four but the vertical isn't in our roster, continue to step 2.
2. **Decide whether to pilot.** Does this prospect look like a sign of a broader vertical? Are they similar enough to other inbounds to be the start of a pattern? If yes, scope a pilot engagement (with playbook to be drafted in parallel).
3. **If it's a one-off:** refer out. We have a referral network for adjacent work (see `sales/partnerships.md` once Phase 5 ships). One-off engagements outside our verticals are a margin and focus killer.

The discipline: a great prospect outside our verticals is not a reason to add a vertical. A pattern of great prospects outside our verticals is.
