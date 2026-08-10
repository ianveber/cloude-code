# Services — AIS Slovenia

The product. Read after `positioning.md`.

---

## What we sell

**One thing:** a deployed, operating agent system that owns a specific function inside a client's business.

The product is not a deliverable list. It's not a set of "AI services." It's not consulting hours. It's a working system the client uses every day after we hand it off, with documented operating procedures, monitoring, and an improvement loop.

Each engagement has two phases:

- **Build phase** — we install the agent system, train it on client data and voice, wire it to the client's tools, and run it under our supervision for 30 days using the onboarding ladder (read-only → draft → internal autonomy → external deployment).
- **Operate phase** — we keep the agent system running, monitor outputs, ship improvements, handle edge cases, and report monthly. Lasts as long as the client wants it. Off-ramps to client-internal ownership at 12 months if the client is ready.

We do not sell either phase standalone. Build without operate produces a black box that decays inside three months. Operate without build is fictional — there's nothing to operate.

---

## The standard agent stack

Every engagement deploys some subset of the canonical agent roster. The specific subset depends on vertical and scope. Phase 3 of the repo will document each agent's full spec; this section is the roster overview.

### Acquirer Agent (non-paid)
Owns top-of-funnel demand generation. Content (long-form articles in GEAF format, optimized for AI-driven search), partnerships (outreach to referral partners and ecosystem players), qualified outbound (intent-monitoring + multi-source enrichment + personalized first touch). Does not run paid media. Ever.

### Closer Agent
Owns mid-to-bottom funnel — discovery scheduling, pre-call brief generation, proposal drafting, follow-up sequencing, contract handoff. Works alongside a human closer (cofounder during build, client-side closer during operate). Does not auto-send anything that touches an external prospect without human approval.

### Onboarder Agent
Owns new-client kickoff. Sends the welcome sequence, collects required data and access, schedules kickoff calls, generates the personalized onboarding plan, tracks completion. Reduces founder time on kickoff from ~8 hours per client to ~1.

### Builder Agent
The agent system used inside AIS to assemble client deployments. Lives inside our repo, not the client's. Reads vertical playbooks + client brief, generates engagement-specific configs, runs the deployment scaffolding. Internal infrastructure — not sold to clients.

### Operator Agent
Owns the day-to-day execution of the bought function. Vertical-specific. For specialty legal: client intake triage, conflict checks, initial qualifying questionnaires, scheduling. For B2B SaaS acquisition: list building, enrichment, first-touch sequencing, response routing. For Slovenian SMB ops: invoice categorization, monthly reporting, calendar coordination. The variant depends entirely on the vertical and the function.

### Retention Agent
Owns client-success workflows. Monthly health checks, expansion-trigger detection, churn-signal monitoring, renewal coordination. Used both for our own clients (operate-phase retention of AIS engagements) and inside client deployments where retention is the bought function.

### Knowledge Agent
Owns the client's institutional memory. Ingests SOPs, prior outputs, voice samples, decision logs. Serves them to other agents in the stack via retrieval. Often the unsexy spine that makes the rest of the stack work.

---

## What ships in a typical engagement

The exact deliverable list is vertical-specific (see `verticals/` once Phase 2 ships). The general shape:

### Build phase deliverables

1. **Engagement charter** — written scope. The function being owned. The named human owners on both sides. The success metrics. Signed by both parties before week 1.
2. **Vertical-tuned agent stack** — Acquirer, Operator, and any other roster agents needed for the function. Deployed into client-owned infrastructure (their cloud, their tools, their data).
3. **Tool wiring** — agents connected to the client's CRM, email, calendar, payment, comms, and vertical-specific systems via API or MCP.
4. **Voice lock** — 16+ archived samples of the client's brand voice or operator's writing style, used to constrain agent outputs.
5. **Operating runbook** — written procedures for what to do when X breaks, how to escalate, how to retrain, who owns what.
6. **30-day onboarding ladder execution** — supervised run-up from read-only mode to external deployment, with weekly review and tightening.
7. **Handoff session** — knowledge transfer to the client-side operate owner. Recorded.

Build phase length: typically 6–12 weeks depending on vertical complexity. Specialty legal runs longer (regulatory data, compliance review). Slovenian SMB simpler functions ship in 6.

### Operate phase deliverables

1. **Monthly performance report** — pulled from the agent stack's monitoring layer. Quantitative outputs (volume, conversion, latency) and qualitative review (sampled outputs, escalation patterns).
2. **Continuous improvement** — prompt updates, tool additions, edge-case handling. Roughly one improvement ship per week.
3. **Voice maintenance** — voice samples refreshed quarterly. Drift detected and corrected.
4. **Escalation handling** — when the agent fails or hits an edge case it can't handle, AIS picks up within agreed SLA (typically 24 hours for non-urgent, 4 hours for urgent).
5. **Quarterly review** — meeting between cofounder and client-side owner. Performance review, scope adjustments, expansion discussions.

Operate phase length: ongoing until off-ramp. Off-ramp option at 12 months — client can choose to take internal ownership of the stack, with a knowledge-transfer package and a reduced "support retainer" for backstop coverage.

---

## What we explicitly don't sell

Listed in `positioning.md` and `principles.md` — repeated here for working visibility:

- **AI strategy consulting documents.** No PDFs. No roadmaps. No assessments.
- **Generative chatbots bolted onto websites.** Generative theater.
- **Agentic OS as standalone software / SaaS / license.** Not a product line.
- **Paid-media management.** No Google Ads, no Meta Ads, no programmatic. Not now, not as a side offer. Acquirer Agent is non-paid only.
- **One-off content production.** We don't take "write us 10 articles" gigs. Content is part of the Acquirer Agent's operate phase, not a standalone deliverable.
- **Generic "agency on retainer" engagements.** No function-of-the-month flex retainers. Every engagement owns a named function.
- **Engagements without a named client-side human owner.** No black box. No "just make it work."

---

## Engagement shapes

Not all engagements are the same size. Three shapes we offer:

### Compact engagement
Single agent owning a single function. Typical example: Acquirer Agent for a specialty legal firm doing GEO/AEO content + partnership outreach. Build phase ~6 weeks. Operate retainer ~€4K–€6K/month.

### Standard engagement
Two-to-three agent stack owning a function with sub-functions. Typical example: Acquirer + Closer + Knowledge agents for a B2B SaaS demand-gen function. Build phase ~10 weeks. Operate retainer ~€7K–€9K/month.

### Comprehensive engagement
Four-plus agent stack owning a full functional cluster (e.g. entire revenue motion or full ops cluster). Typical example: full acquisition + closing + onboarding + retention stack for a Slovenian SMB. Build phase ~12 weeks. Operate retainer ~€10K–€12K/month.

We default to scoping the smallest engagement that actually solves the named function. Mission creep is a margin killer. If the client wants the comprehensive engagement, they have to qualify for it (revenue band, operator buy-in, decision authority) — we don't upsell into it.

---

## How engagements end

Three off-ramps:

1. **Internal ownership.** At 12+ months, client takes the stack in-house. We hand off the runbooks, train the internal owner, and offer a low-cost support retainer (~€1K–€2K/month) for backstop coverage. This is the default off-ramp.
2. **Expansion.** Client adds a second function. New build phase scoped, new operate retainer added. Original engagement continues unchanged.
3. **Termination.** Client doesn't want to continue. We hand off documentation and stack. No claw-back, no breakage. Termination on 60-day notice during operate phase.

We do not lock clients in. Lock-in is a strategy used by vendors who can't compete on ongoing value.

---

## Adjacent things we don't do (referrals)

Sometimes a buyer needs something close to what we do but not quite. We refer rather than stretch:

- **One-off automation builds (n8n / Zapier workflows)** → freelance n8n builder
- **Standalone chatbot deployment** → freelance Voiceflow / Make builder
- **Paid-media management** → trusted performance-marketing agency partners
- **Custom software dev (non-agent)** → freelance Nejc-network developers or external dev shop
- **Brand identity / visual design** → freelance designer

We keep a referral list maintained inside `sales/partnerships.md` once Phase 5 ships. Referring out preserves our positioning and earns reciprocity.
