# Principles — AIS Slovenia

10 decision rules. The hard constraints that make the agency coherent.

When in doubt, return here. When a prospect or cofounder pushes back on a decision, the answer is usually in this file. Update with explicit consensus — don't drift.

---

## 1. We ship agent systems, not seats or hours

The product is a deployed, operating agent system that owns a function. Not a license. Not a tool. Not consulting time. Not a strategy document.

**Why this matters:** Every adjacent business model (SaaS, freelance dev, generic consulting) has a structural problem we don't share. SaaS sells generic tools and leaves operation to the client. Freelance sells hours and rewards slowness. Generic consulting sells documents and produces nothing that operates. We sell working functions with named owners. The model only stays coherent if we don't blur the edges.

**How to apply:** If a prospect asks "can we just license the platform?" — no. If they ask "can you bill us hourly while we figure out scope?" — no. If they ask "can you produce a strategy roadmap first and we'll decide on deployment later?" — no, but here's a freelancer who can.

---

## 2. Every agent has a named human owner

No floating AI. Every deployed agent has one of the three cofounders as its build-phase owner, and one named client-side person as its operate-phase owner. The owner is on the hook for hallucinations, escalations, retraining decisions, and policy updates.

**Why this matters:** "The AI did it" is the failure mode that destroys client trust and exposes us to legal risk. When an agent hallucinates a legal answer, leaks a customer record, or sends an off-brand email, somebody has to own the response. If no person owns the agent, no one will catch the failure until it's a fire.

**How to apply:** During scoping, the engagement charter names the owners on both sides. During build, the AIS-side owner is responsible for the onboarding ladder. During operate, the client-side owner is responsible for sampling outputs, flagging issues, and approving rule changes. If a prospect can't name a client-side owner, the engagement isn't ready — postpone.

---

## 3. Acquirer Agent is non-paid by default; no paid media without explicit opt-in

The Acquirer Agent does content (GEO/AEO/SEO), partnerships, referrals, and qualified outbound. It does not run paid media. AIS does not manage Google Ads, Meta Ads, or programmatic campaigns. This is structural, not preferential.

**Why this matters:** Paid-media management is a different business — different metrics, different feedback loops, different liability shape, different talent profile. Trying to do both means doing both badly. We've decided to be best-in-class at non-paid acquisition and refer out for paid. If the founders explicitly opt into paid media later, this principle gets updated by consensus — not by drift. Until then: no paid media, ever.

**How to apply:** If a prospect asks "can you also run our ad accounts?" — no, and here's our paid-media partner referral. If a vertical playbook proposes paid-media tactics — strike them out and replace with non-paid alternatives.

---

## 4. Verticals are picked, not accepted

We pick verticals where the function can be fully owned, the buyer has decision authority, and the work is encoded rather than embodied. We do not take on a vertical because a prospect from that vertical asked. New verticals get added through `verticals/_selection-framework.md`, with cofounder consensus.

**Why this matters:** Diffuse-function verticals destroy contribution margin. Committee-buyer verticals lengthen sales cycles past viability. Embodied-work verticals (e.g. anything requiring physical presence or pure-relationship trust) can't be owned by agents. Accepting a wrong-shape vertical means the engagement scope creeps, margins collapse, and the client churns at month four.

**How to apply:** When a prospect from a new vertical comes in, run them through the selection framework. If the vertical doesn't qualify, refer them out. If it qualifies, add it to the playbook backlog — but don't start the engagement until the playbook is at least drafted.

---

## 5. Pricing is build fee + operate retainer — never seats, never time-and-materials

The pricing model is two components, always both, sized by the rules in `pricing.md`. No seat licenses. No hourly billing. No mixed models. No off-ramping into a different pricing structure mid-engagement.

**Why this matters:** Pricing model leakage is how agencies become consultancies become staffing firms. Each blurred pricing decision moves us closer to a category we don't want to be in. The bands in `pricing.md` are calibrated to hit 65%+ contribution margin per engagement. Breaking the model breaks the math.

**How to apply:** If a prospect asks for "monthly fee with no build fee" — restructure as "operate-only after a paid 6-week build phase." If a prospect asks for "hourly while we figure it out" — refuse and offer a paid scoping engagement at flat fee. If a prospect asks for "seat license for the agent" — explain it's not a product they license, it's a deployment they own after we build it.

---

## 6. Voice locking requires 16+ samples before any voice-dependent deployment

Below 16 high-quality curated samples of the target voice, agent outputs are generic AI slop — recognizably hollow, off-brand, or off-tone. The 16-sample threshold (per the AI-native operating map's research) is the lower bound for locking deterministic-ish voice.

**Why this matters:** A first-month deployment that sounds like ChatGPT damages the client's brand. We've watched it happen. The 16-sample threshold isn't arbitrary — below it, outputs read as machine-generated and erode trust with the audience.

**How to apply:** During build phase, voice sample collection starts week 1. The 16-sample bar must be cleared before week 3 (internal autonomy) of the onboarding ladder. If we can't get 16 samples from the client by week 3, we pause external deployment and run an extended voice-collection sprint with the client-side owner.

---

## 7. 30-day agent onboarding ladder is non-negotiable

Every externally-facing agent runs through: Week 1 read-only → Week 2 draft (human-intercepted) → Week 3 internal autonomy → Week 4 external deployment. Never skipped. Never compressed. Never reordered.

**Why this matters:** The ladder catches failures before they touch external audiences. Week 1 catches context comprehension errors. Week 2 catches output quality and tone failures. Week 3 catches workflow integration issues. Week 4 is the first time the agent's outputs reach the outside world. Skipping a week skips a failure-catching layer. Most agent failures we've watched at other vendors happen because they shipped to production on day one.

**How to apply:** The build-phase schedule has the ladder embedded. If a client asks "can we just go live now, we're under pressure?" — no, here's why. Offer to start the ladder a week earlier instead of skipping weeks.

---

## 8. Contribution margin tracked per engagement, not aggregate

Every engagement has a per-engagement P&L. Revenue minus direct costs (inference, cofounder time, contractor time) equals contribution margin. We target 65%+ per engagement, refuse below 55%.

**Why this matters:** Aggregate margin hides which engagements are subsidizing which. A 20% aggregate margin can disguise three engagements running at 50% and two running at -10%. The negative-margin engagements eat cofounder capacity and damage the overall business. Per-engagement margin makes the loss-leaders visible.

**How to apply:** Set up the per-engagement P&L during the scoping phase. Track monthly. Review quarterly. Any engagement that drifts below 55% gets a corrective plan within 30 days, or gets renegotiated, or gets terminated. (See `ops/economics.md` once Phase 6 ships.)

---

## 9. We eat our own dog food — AIS runs on AIS-built agents

The agency itself uses the same agent systems we sell. Acquirer Agent runs our own content, partnerships, outbound. Closer Agent assists our own scoping calls. Onboarder Agent runs our own new-engagement kickoffs. Knowledge Agent serves our own institutional memory.

**Why this matters:** If we don't trust our own stack to run our acquisition, why should clients trust it for theirs? Eating our dog food does three things: (1) forces us to find bugs the moment they appear, (2) generates the case study we sell from, (3) keeps cofounder time leveraged so we can run the agency at five-person headcount through €1M run rate.

**How to apply:** Every agent we build for clients gets a parallel internal deployment for AIS. Internal deployment runs first (it's a friendlier testing environment). External deployment happens after internal has clean weeks. New agents we don't run internally are a yellow flag — ask why.

---

## 10. Refuse engagements where the client wants a black box without operator buy-in

If the client-side decision maker wants AI to "just handle it" without internal operator commitment, the engagement is a black box waiting to fail. Refuse it, no matter the build fee.

**Why this matters:** Agent systems require operator buy-in to survive contact with the real world. The internal operator catches issues, validates outputs, requests improvements, escalates anomalies. Without the operator, edge cases pile up unaddressed, outputs drift, and the client lands at month four asking why "the AI stopped working." That conversation kills retention, kills the case study, and kills the brand.

**How to apply:** During scoping, talk to the client-side operator (not just the decision-maker who signs the check). Ask: "Are you going to spend 30 minutes a week sampling outputs and flagging issues?" If the answer is no, or if there is no operator, decline the engagement. If the decision-maker insists "the AI should just work" — they're describing a product we don't sell. Refer them to a SaaS vendor.

---

## How to use these principles

Read them before any scoping call. Reference them when a decision is unclear. Update them deliberately when the model needs to evolve — but only with cofounder consensus and an explicit decision-log entry. Never let them drift through accumulated small exceptions.

A principle is alive only if it actually rejects work. If a principle has never caused us to walk away from a prospect, it isn't load-bearing — it's decoration. Periodically audit which principles have rejected work in the last quarter. The ones that haven't either need teeth or need deletion.
