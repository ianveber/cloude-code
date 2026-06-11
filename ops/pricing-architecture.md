# Pricing Architecture

This document is the canonical reference for how Veta prices engagements — the philosophy, the calculation method, the floors, the discount rules, and how to handle the common edge cases. It goes deeper than the service catalog, which covers tiers and ranges. This covers how to arrive at a specific number and how to defend it.

---

## The philosophy

We price on value delivered, not time spent. This is not a positioning statement — it's a structural commitment that changes how every pricing conversation goes.

Time-based pricing creates the wrong incentives: slower builds cost the client more, efficiency penalizes us, and the client's mental model is always "how many hours is this worth?" Value-based pricing creates the right incentives: we're motivated to build well and fast, and the client's mental model is "how much is this problem costing me vs. what does solving it cost?"

The practical implication: we need to quantify the client's current workflow cost before we name a price. A proposal with no value anchor is a number pulled from thin air. A proposal that says "your pre-auth workflow costs approximately $6,300/year in coordinator time, and we're pricing at $28,000 — roughly 4.4x the annual operating cost, recovered in the first year" is a business case, not a quote.

---

## The value calculation framework

Run this for every engagement before writing the proposal. Four steps.

### Step 1 — Quantify the current cost

Identify all costs the target workflow imposes on the client today:

**Staff time cost:**
- Who does this work? (role, not name)
- How many hours per week or month?
- Loaded hourly cost: salary ÷ 2080 hours × 1.3 (benefits/overhead multiplier)
- Monthly cost = hours/month × loaded hourly rate

**Revenue leakage:**
- What percentage of opportunities are not being captured due to this workflow gap?
- Average value per opportunity × annual volume × leakage rate = annual revenue leakage
- Use the client's own numbers where possible; use vertical benchmarks (from playbook) where not

**Error/rework cost:**
- How often does the current manual process produce errors?
- What does each error cost to fix? (staff time + any direct cost — denied claims, rescheduled appointments, etc.)
- Monthly cost = error rate × volume × cost per error

**Total current cost (annual):** Staff time + revenue leakage + error cost

Be conservative. Understate the current cost, because you'll almost certainly understate the recovery too — and the client will trust conservative numbers more than optimistic ones.

### Step 2 — Estimate value recovered

What does the agent system realistically recover? Not the theoretical maximum — the realistic case based on vertical benchmarks.

**Staff time recovered:** What percentage of the workflow hours does the agent handle? Typically 60–85% — humans still handle exceptions, reviews, and edge cases. Calculate: hours/month × recovery rate × loaded rate = $/month recovered.

**Revenue recovered:** Use the conversion benchmarks from the vertical playbook. Treatment plan follow-up typically recovers 15–25% of unconverted consults; status automation reduces client churn by 10–20%. Apply the benchmark to the client's specific volume and case value.

**Error reduction:** If the agent eliminates a category of manual errors (wrong CDT codes, missed follow-up deadlines, data transfer mistakes), quantify that explicitly.

**Total annual value recovered:** Sum of the above. This is the value the system delivers in year one.

### Step 3 — Apply the pricing ratio

Target: **25–40% of first-year value recovered.**

- Use 25–30% for straightforward builds (well-documented integrations, clean scope, fast timeline)
- Use 35–40% for complex builds (legacy EHR integrations, multiple clusters, compliance-heavy)
- Never exceed 50% of first-year value — it's hard to justify and signals you don't believe your own numbers

**Floor check:** After applying the ratio, confirm the result is above the tier floor (see below). If the ratio produces a number below the floor, use the floor — and if the floor can't be justified by the value case, reconsider whether the client is the right fit.

### Step 4 — Sanity check

Before presenting the number:

- Is this price defensible if the client asks "how did you arrive at that number?" — you should be able to walk through Steps 1–3 out loud in 3 minutes
- Is this price above the floor?
- Does this price reflect the actual build complexity, or did the ratio compress it below what we need to make the engagement viable?
- If we deliver exactly what the spec says and the client operates it correctly, will the value recovered in year one be at least 2.5x the price? If not, the value case is too weak to sell.

---

## Pricing floors

These are minimums. Do not go below them under any circumstance, including to win a "strategic" first client.

| Tier | Floor | Rationale |
|---|---|---|
| Tier 1 — Cluster Sprint | $18,000 | Below this, the engagement is not economically viable to deliver at the quality standard we've defined. A sub-floor engagement creates a bad reference client and sets precedent we'll spend months fighting. |
| Tier 2 — Vertical Stack | $55,000 | Two-to-four cluster builds have significant integration and coordination overhead. The floor reflects minimum viable economics, not a discount off a higher number. |
| Tier 3 — Embedded Partner | $4,000/month | Below this, the retainer can't cover meaningful improvement work. A retainer that only covers "keeping the lights on" is not the Tier 3 model. |

**Why floors matter:** Every time we break the floor, we train the market that our prices are negotiable, we attract clients who are price-sensitive rather than outcome-focused, and we compress our own margins to a point where we can't deliver quality work. The floors are not arbitrary — they're based on what it costs to do the engagement right.

---

## Tier-specific pricing guidance

### Tier 1 — Cluster Sprint ($18K–$45K)

The range reflects build complexity, not scope additions. One cluster at either end of the range looks very different:

**$18K–$22K:** Single agent (or two tightly coupled agents), well-documented API integration (Open Dental, Clio, Aesthetic Record), clean scope, no compliance complications, 6-week timeline.

**$28K–$38K:** Two to three agents with coordination logic, moderately complex integration (Dentrix Ascend + clearinghouse, PatientNow + e-signature), one compliance flag that requires extra design work, 8-week timeline.

**$38K–$45K:** Three agents, legacy EHR integration requiring export/import workaround, multiple compliance flags, multiple stakeholder touchpoints on the client side, 10-week timeline.

The correct Tier 1 price is determined by the value case first (Steps 1–3 above) and the complexity check second. If the value case supports $35K and the complexity is low, price at $30K and leave margin — don't price at $22K because the build is simple. Build simplicity is our efficiency, not the client's discount.

### Tier 2 — Vertical Stack ($55K–$120K)

Price the clusters individually using Tier 1 methodology, then apply a 10–15% coordination discount. The coordination discount is real — integrated clusters share integration work, and the build is more efficient than two separate Tier 1 engagements. But it's a discount on efficiency, not a discount on value.

Example:
- Cluster A (pre-auth): standalone Tier 1 value case = $32K
- Cluster B (intake): standalone Tier 1 value case = $24K
- Combined: $56K at full rate → $48K–$50K with 10–15% coordination discount
- Sanity check: $48K–$50K is above the Tier 2 floor ✓
- Sanity check: first-year value recovered should be ≥ $120K for this price to hold ✓

Don't combine two weak value cases to reach the Tier 2 floor. If neither cluster individually justifies $24K+, adding them together doesn't fix the problem.

### Tier 3 — Embedded Partner ($4K–$12K/month)

Priced on the scope of ongoing work, not the value of the underlying system (that was already priced in the build engagement). Three factors:

**Improvement velocity:** How much active development work is in scope each month? A retainer that includes 2 new agent improvements per quarter is worth more than one that's pure monitoring.

**System complexity:** More agents, more integrations = more monitoring surface. Higher base rate.

**Client dependency:** Some clients want the retainer because they want ongoing improvements; others want it because they're uncomfortable operating independently. The latter is a dependency we shouldn't be building — offer the retainer for improvement, not for reassurance.

| Monthly scope | Price range |
|---|---|
| Monitoring + bug fixes only | $4K–$5K |
| Monitoring + 1 significant improvement/quarter | $5K–$7K |
| Monitoring + active improvement backlog (2–4 items/month) | $7K–$10K |
| Monitoring + new cluster development included | $10K–$12K |

Note: a new cluster that's materially the same scope as a Tier 1 engagement shouldn't be bundled into a $10K/month retainer — scope it separately as a Tier 1 add-on.

---

## Payment structure

Standard structure (from SOW template):

| Milestone | Percentage |
|---|---|
| Signed SOW | 30% |
| Phase 1 complete (specs approved) | 20% |
| Phase 2 complete (read-only sign-off) | 25% |
| Phase 4 complete (handoff) | 25% |

**Why front-load at 30%?** The kickoff payment covers discovery sunk cost and establishes commitment. Clients who balk at 30% upfront are often clients who will delay access, delay spec reviews, and request scope changes. The 30% is a qualification filter as much as a cash flow tool.

**Alternative structures (use sparingly, require explicit justification):**

- **50/50 (kickoff + handoff):** Appropriate for small Tier 1 engagements with very tight scope and a client with a strong track record. Simplifies billing but removes the milestone discipline that protects the timeline.
- **Monthly invoicing for Tier 2:** If a Tier 2 engagement spans 4+ months, monthly invoicing based on work completed is reasonable. Structure it so the total billed tracks closely with the milestone payment schedule.
- **Retainer pre-payment (Tier 3):** Quarterly pre-payment is acceptable if the client requests it and offers a 5% discount in exchange. Do not offer the discount proactively.

---

## Discount discipline

**What's negotiable:**
- Payment structure (monthly vs. milestone) — no price change
- Timeline (faster delivery may cost more, slower delivery doesn't create a discount)
- Scope reduction — if the client wants a smaller cluster, price the smaller cluster at its actual value, not a discount off the original

**What's not negotiable:**
- The floor
- Price reduction in exchange for a testimonial, referral, or case study ("we'll give you a discount if we can publish the results") — the results should stand on their own; a discount-for-endorsement trade creates a conflict of interest
- Price reduction for "we're a small practice" — the workflow cost scales with the practice; if their current cost of the target workflow doesn't justify the floor, the engagement isn't right for them yet

**The one legitimate discount:** A returning client starting a second engagement (Tier 1 expansion or Tier 2 after a Tier 1). We know their systems, their compliance structure, their ops team. The integration work is materially reduced. A 10–15% discount on the second engagement is fair and real — and it's a strong retention and expansion signal to offer proactively.

**When a prospect pushes back on price:**

Step 1: Don't move immediately. "Tell me more about what's driving that concern." Often it's sticker shock, not a real budget constraint.

Step 2: Re-anchor on value. "The way I think about it — if the system recovers $8,500/month in staff time and unconverted consultations, you're at breakeven in 3.5 months. Everything after that is margin. Does that math feel right to you?"

Step 3: If they have a real budget constraint, offer to reduce scope to fit, not to reduce price to fit. "We could scope this to the pre-auth cluster only and come in at $22K. The intake automation would be Phase 2."

Step 4: If none of this works, they're not ready for this engagement. Do not chase them down to the floor.

---

## Edge cases

**"Can we do a pilot first?"**
A pilot that's scoped and priced like a Tier 1 engagement is just a Tier 1 engagement with a different name. If they want a pilot, scope a single agent (one of the three in a standard Tier 1) as a standalone proof of concept at $8K–$12K with a clear path to the full engagement. This is below the Tier 1 floor — it's only acceptable as a deliberate lead-in to a committed full engagement, not as a standalone.

Don't do unpaid pilots or free proofs of concept. We bring vertical expertise to the table in the discovery call itself. If that's not enough to earn a paid engagement, no prototype will change it.

**"Can we do revenue share instead of a fee?"**
No. Revenue share requires us to trust the client's attribution reporting, creates a long tail of financial entanglement, and caps our upside in direct proportion to how well the system works. If the system works well, we should have been paid for it at build time. A revenue share is a discount in disguise with worse incentives.

The response: "We price on the value of what we build, not a share of what you earn from it. That keeps our incentives aligned — we're motivated to build it right and hand it off cleanly, not to stay involved indefinitely."

**"Can you invoice us monthly over 12 months?"**
Monthly invoicing for a Tier 1 engagement means we're financing the client. If they can't fund $18K–$45K without 12-month financing, they may not have the operational budget to support ongoing operations either. Explore whether the issue is cash flow (short-term, fixable) or budget reality (wrong client). If it's cash flow: quarterly payments are acceptable. Monthly over 12 months is not.

**"We're a single-provider practice, can you do something smaller?"**
Depends on the workflow volume. A single-provider implant practice doing 15 implant cases/month has a real pre-auth burden. A single-provider general dentist doing no specialty work probably doesn't hit the floor. Ask the volume questions before deciding. Don't assume small practice = wrong client.

**"We want to pay after we see results."**
Results-contingent payment transfers our risk to us without transferring ownership of the inputs. If the client delays access, delays sign-offs, or doesn't follow the handoff protocol, we're exposed. The answer: "We can tie the final payment to the handoff milestone, which is defined by the independent operation test passing. That means you're only paying the final 25% when the system is demonstrably working and your team can operate it. That's as close to results-based as we can go."
