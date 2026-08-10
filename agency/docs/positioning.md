# Positioning — AIS Slovenia

The thesis. Read first.

---

## The shift

The era of horizontal AI tools is ending. ChatGPT-for-everything, generic Claude wrappers, "AI for sales" point solutions — these compress to commodity inside 18 months. The model layer is open, the API price drops monthly, and a solo founder can rent reasoning that matches what cost $50M of cap-ex two years ago.

What replaces horizontal tools: **vertical agent systems that own a specific function inside a specific industry, end-to-end, with named human owners.**

The Y Combinator 2025–2026 batches make this thesis explicit. 88% of S25 is AI-native. The Request for Startups bet is on agents that *fully replace* a job function — not on tools that assist humans inside an existing workflow. Cursor replaces a junior dev. Andco replaces an admin assistant. Taiga replaces a chunk of an SDR team. The differentiation is no longer the model. It's three things:

1. **Depth of vertical-specific judgment** encoded in the agent stack — prompts, tools, data, escalation rules, edge-case handling built around one industry's quirks, regulatory shape, and buyer psychology.
2. **Engineering discipline of orchestration** — multi-agent handoffs, persistent memory, voice-locking, monitoring, retraining loops. Most "AI agencies" can't do this; they can write a prompt.
3. **Operator willingness to take responsibility for outputs** — named human owner per agent, contract terms that hold us to outcomes, escalation paths for when the agent fails.

AIS Slovenia exists in that gap. We don't sell generic AI productivity. We don't license a SaaS seat. We don't bill by the hour. We build the agent system that runs a function — acquisition, ops, retention, or a vertical-specific cluster — and we operate it until the client is ready to operate it themselves.

---

## The wedge

Three structural advantages we have that most consultancies and SaaS vendors don't:

### 1. Productized Agentic OS as the platform layer

Ian Veber has been building the Agentic OS — a multi-agent system managing his own digital and business operations — since early 2026. File Agent shipped, Telegram interface live, Email/Calendar/Project/Knowledge agents in build. The architecture is real, stress-tested against Ian's own workload, and now extracted into a deployable platform for client engagements.

This means every AIS engagement starts from a working spine, not a greenfield re-build. The base patterns — agent registration, memory access, tool routing, human-in-the-loop checkpoints, Telegram and web surfaces, Claude API cost routing — are already solved. Engagement effort goes into vertical-specific tuning, not infrastructure plumbing.

We're not selling Agentic OS as a SaaS. We're selling deployed engagements that *use* it as the substrate. The client owns the deployed instance.

### 2. Three-cofounder model with explicit responsibility allocation

- **Anej Vučič** runs strategic architecture and AI integration. He owns the technical thesis, the agent orchestration patterns, the integrator perspective. Original cofounder.
- **Nejc Feigel Boh** runs legal, external representation, sales, and development. He owns the entity, the contracts, the client-facing relationship, the dev work that lives outside Claude. Original cofounder.
- **Ian Veber** runs engineering with Claude as the technical brain. He owns the build process — translating client briefs into deployed agent systems via Claude Code. Invited third.

Every agent we deploy has one of us as the named human owner during build phase, and a named client-side owner during operate phase. No floating AI. No "the system did it." When an agent hallucinates, leaks data, or misses an escalation, there is a person on the hook.

This is unusual. Most AI vendors hide behind the model. We don't.

### 3. Vertical specialization over horizontal sprawl

We pick verticals where a function can be fully owned, not just assisted. Three criteria:

- **The function is well-bounded.** Acquisition for a specialty legal firm is a finite scope: ICP, content, intake, qualifying, scheduling. Acquisition for a generic "B2B SaaS" is unbounded — too many sub-functions, too many adjacent stakeholders.
- **The buyer has decision authority.** Owner-operator legal partner can sign a €25K build fee in one meeting. A B2B SaaS marketing manager has to route the same decision through procurement, IT, security, and the CFO. We avoid the second.
- **The work is encoded, not embodied.** If the function depends on physical presence, embodied judgment, or relationship-only trust, agents can't own it. We don't fight that.

We seed three verticals in Phase 2: Slovenian SMBs in defined sectors (local market depth, faster sales cycle, Slovenian-language moat), specialty legal (regulatory rigour forces clear scope), and B2B SaaS / fintech / maritime (varying degrees of well-bounded acquisition or ops functions — Phase 2 will pick which specific sub-slice to lead with). We add verticals deliberately, not opportunistically.

---

## Who we sell to

Buyer ICP across verticals share these signals:

- Owner-operator or executive sponsor who can make a six-figure decision without committee approval
- Function-shaped pain: acquisition, ops, retention, or service delivery is broken or unscalable, and the buyer can name it concretely
- Revenue band where a €25K–€100K agent system pays back inside 12 months — typically €1M+ annual revenue, ideal at €5M+
- Willingness to assign a named human owner internally for each deployed agent
- Operator buy-in: the people whose work the agent touches have to want it to work, or it dies on contact

We sell to verticals where the function is well-bounded and the buyer has real decision authority. We do not sell to verticals where the function is diffuse, the buyer is a committee, or the budget needs board approval.

---

## Who we don't sell to

The negative cases are as important as the positive ones. We turn down work that fits any of these patterns:

- **"AI strategy consulting" without deployment commitment.** If the client wants a roadmap document, slide deck, or pilot project that doesn't ship to production, we decline. We don't produce shelfware.
- **"Add a chatbot to our website."** Generative theater. Doesn't move a function. Refer them to a freelancer who'll do it in a weekend for €2K.
- **"License Agentic OS as software."** We're not a SaaS. The platform exists to enable our engagements, not to be sold standalone.
- **Paid-media management.** We don't manage Google Ads, Meta Ads, or programmatic. The Acquirer Agent does non-paid acquisition only. See `principles.md` rule 3.
- **Diffuse-function verticals.** Generic "marketing" for a CPG brand. Generic "ops" for a logistics company. Without a bounded function, the engagement scope creeps and contribution margin collapses.
- **"Make it look like AI did the work" engagements.** Buyer wants the AI label without the operator commitment. The agent has no internal owner, no escalation path, no improvement loop. Black box theater. We refuse.

---

## The competitive landscape

We sit between three categories. Each has a structural problem we don't.

### Traditional agencies (Slovenian or otherwise)

Sell hours, retainers, or project fees against human teams. AI-enabled at the tool level — ChatGPT for copy, Claude for ideation — but the org structure is unchanged: account managers, planners, creatives, analysts. Margins are headcount-bound.

**Structural problem:** Cost scales linearly with revenue. Adding clients requires adding people. They can't compete on margin as compute compounds and our headcount stays flat. They will undercut us in year one and lose to us in year two as the math catches up to them.

### Horizontal SaaS vendors (HubSpot, GHL, ClickFunnels, n8n templates)

Sell seats. The tool is generic; the configuration and operation is left to the client. The client buys a CRM, an email platform, an automation builder — and then has to figure out how to run the function.

**Structural problem:** The client still has to do the work. Setup costs balloon. Operator skill required to run the tool is rarely present. Tools rot from misuse. We sell the function as a working system; SaaS vendors sell components and hope the client assembles them.

### Generic AI consultancies

Sell roadmaps, slide decks, pilot projects, and "AI readiness assessments." Charge €10K–€50K per engagement. Produce documents, not deployed systems. Most of these are repackaged management consultancies discovering AI in 2024.

**Structural problem:** Nothing operates after the engagement ends. The client has a beautiful PDF and no working agents. Renewal rates are abysmal. The category collapses when buyers ask "what shipped" — which they're starting to.

---

## Where we sit

We are vertical agent operators. We sell a working function the client owns and runs after handoff. We are accountable for outputs in a way the other three categories structurally aren't. The deliverable is a deployed agent system with documented operating procedures, not a document or a license.

The price reflects this. A build engagement runs €25K–€100K depending on vertical complexity and agent count. An operate retainer runs €4K–€12K per month. We don't discount, because the math is grounded in contribution margin per engagement (see `pricing.md`), not "what the market will bear."

The competitive position is not "we have better models" — model differentiation is over. The position is "we ship working functions and own the outputs." Few will do that. Most won't be able to.

---

## What the next 12 months look like

The agency is in formation as of May 2026. d.o.o. registration in progress (replacing the s.p. that's currently in blockage). The structural priorities for the year:

**Q2 2026** — Lock the operating repo (this artifact). Phases 1–6 complete. Acquirer Agent shipping content + qualified outbound at AIS's own cadence — we sell to ourselves first. Two paying engagements signed in seed verticals.

**Q3 2026** — First engagements move from build phase to operate phase. Voice locking complete on AIS's own outward voice (16+ archived samples). First case study drafted (anonymized if needed).

**Q4 2026** — Third and fourth engagements signed. Case studies published. Contribution margin per engagement clear, tracked, optimized. End-of-year cofounder review of pricing and vertical mix.

**By Q2 2027** — Four to six active engagements. Build-phase team augmented with one orchestrator (cofounders stay at three; orchestrator is contracted or internal). Operate phase mostly automated, cofounder time reserved for build phase and judgment calls. €300K+ annual run rate with the same headcount.

The model is the compute-to-talent inversion: revenue per cofounder targets €100K+ within 18 months, with the agent stack — not human hours — being the unit that scales. If we hit it, the agency clears €1M run rate by 2028 with no more than five people total. If we don't hit it, we re-evaluate the wedge.
