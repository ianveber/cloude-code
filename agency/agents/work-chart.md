# Work Chart — The 4-Layer Architecture

The organizational substrate AIS deploys for itself and for every client engagement. Replaces the traditional org chart with a workflow-first structure where humans handle judgment, agents own execution, automation handles routing, and surfaces are where the work meets reality.

This is the most-referenced architectural concept in the agency. Internalize it.

---

## The four layers

Read top-down. Each layer feeds into the one below.

### Layer 1 — Human

**Owns:** judgment, taste, ethics, strategic risk, escalation handling, edge cases.

**Who's here:** the named human owners — at AIS, the three cofounders. At a client, the named function owner(s) and the escalation chain.

**What humans do that agents can't:**
- Make decisions where the right answer depends on context that hasn't been encoded yet
- Take responsibility for outputs that affect external stakeholders (clients, customers, regulators)
- Set the policies that agents follow
- Override agent decisions when judgment requires it
- Handle escalations from below
- Carry institutional trust (clients trust people; agents are operated by people on the client's behalf)

**What humans shouldn't be doing:**
- Anything repeatable that an agent can own
- Routine status reporting
- Routine routing decisions
- Routine quality checks (the agent's sampling should catch most issues; humans review samples, not every output)

If humans are doing repeatable work, the Work Chart is broken — push it down to Layer 2.

### Layer 2 — Agent

**Owns:** execution of repeatable work. The agent has documented tools, persistent memory, decision rules, escalation thresholds, and a named human owner.

**Who's here:** the deployed agents — Acquirer, Closer, Onboarder, Operator, Knowledge, Retention. Per engagement, a subset of these from the canonical roster.

**What agents do well:**
- Execute the same function 10,000 times with consistent quality
- Hold institutional knowledge in working memory (via Knowledge Agent)
- Operate 24/7 at consistent throughput
- Handle defined edge cases via documented decision rules
- Escalate undefined edge cases to Layer 1

**What agents shouldn't do:**
- Make decisions outside their documented scope
- Operate without a named human owner (this is the floating-AI failure mode — prohibited by `docs/principles.md` rule 2)
- Skip the 30-day onboarding ladder before external deployment
- Self-modify their own decision rules without human review

If an agent is operating outside scope or without an owner, the Work Chart is broken — pull it back, add an owner, re-scope.

### Layer 3 — Automation

**Owns:** routing, triggers, scheduled handoffs, deterministic glue between agents and tools.

**Who's here:** the deterministic infrastructure — Zapier, n8n, Make, custom orchestration code, scheduled scripts, webhook handlers. Most importantly: the inter-agent handoff protocol (see below).

**What automation does that agents shouldn't:**
- Route deterministic events (when X happens, do Y) without using LLM tokens
- Schedule recurring agent runs
- Handle high-volume data movement between systems
- Glue together API calls in fixed patterns

**The rule:** if a task is deterministic, automation should handle it. Burning LLM tokens on deterministic tasks is wasteful (cost + latency) and introduces non-determinism where determinism is required.

If agents are doing deterministic routing, push it down to Layer 3.

### Layer 4 — Surface

**Owns:** where humans (internal or external) interact with the system. The visible output.

**Who's here:** dashboards, Slack notifications, email inboxes, chat interfaces, web pages, voice interfaces, Telegram bots, anywhere a human encounters the system's work.

**What surfaces do:**
- Present outputs to humans in formats they can act on
- Capture human inputs (approvals, overrides, escalation responses)
- Provide visibility into the agent stack's state (what's happening, what's queued, what's blocked)
- Provide control (kill switches, manual triggers, override controls)

**What surfaces shouldn't do:**
- Hold business logic (that's Layer 2 or Layer 3)
- Hide what the agents are doing (transparency is a core requirement — humans need to see)

A surface that obscures the agent's work is a black box. Black boxes are a `docs/principles.md` rule 10 violation.

---

## How the layers connect

A typical workflow flowing through the layers:

```
[Trigger: signal source fires]
        ↓
[Layer 3: Automation]
   Captures signal, routes to right agent
        ↓
[Layer 2: Agent]
   Acquirer Agent processes signal, enriches, drafts first-touch
        ↓
[Layer 3: Automation]
   Routes drafted output to approval queue
        ↓
[Layer 4: Surface]
   Drafted output appears in client's outbound tool dashboard for approval
        ↓
[Layer 1: Human]
   Client-side operator reviews, approves or modifies
        ↓
[Layer 3: Automation]
   On approval, routes to send
        ↓
[Layer 2: Agent]
   Closer Agent monitors for reply
        ↓
[Reply arrives]
        ↓
[Layer 2: Agent]
   Closer Agent classifies reply
        ↓
   If "complaint" or "legal threat":
        ↓
   [Layer 1: Human]
   Immediate escalation to client-side owner
        ↓
   Else if "interested":
        ↓
   [Layer 3: Automation]
   Routes to AE calendar
        ↓
   [Layer 4: Surface]
   Meeting appears in AE's calendar
```

This pattern repeats — agents do the repeatable work, automation handles the deterministic routing, humans appear at the decision points and escalations, surfaces are where everything becomes visible and controllable.

---

## Inter-agent handoff protocol

When one agent hands off to another, the handoff follows this protocol:

### 1. Handoff has a structured payload

Not "tell the other agent about this." A specific structured object with named fields the receiving agent can rely on.

Example: Acquirer → Closer handoff payload includes: prospect ID, signal type that triggered, enrichment data, first-touch content sent, current sequence stage, response status, classification (if any), recommended next action.

### 2. Handoff has an audit trail

Logged in the engagement's audit system. Time, source agent, destination agent, payload, human approvals along the way.

### 3. Handoff has a fallback

If the destination agent fails to receive (down, error, capacity), the handoff falls back to a defined human (named in escalation rules) so work doesn't get lost.

### 4. Handoff has acknowledgment

Destination agent acknowledges receipt. Source agent only marks complete on acknowledgment. No fire-and-forget.

### 5. Handoff has a deadline

Each handoff carries a deadline by which the destination agent must take action. If deadline passes without action, escalation fires to the human owner.

---

## The 30-day agent onboarding ladder

Every externally-facing agent runs through this ladder before deployment. Non-negotiable per `docs/principles.md` rule 7.

### Week 1 — Read-only mode

- Agent ingests: SOPs, prior outputs, voice samples, knowledge base, ICP definition
- Agent answers internal queries from cofounders and named human owner to demonstrate context comprehension
- Agent has zero write access
- Pass criteria: agent demonstrates accurate understanding of the function it will own; can articulate edge cases it would escalate

If pass: proceed to Week 2. If fail: extend Week 1 by 3–7 days while expanding ingestion or refining prompts.

### Week 2 — Draft mode

- Agent generates outputs (first-touch drafts, scoping memo drafts, intake responses, etc.)
- Every output is intercepted by a human (AIS-side owner during build) before any external action
- Each output graded Strong / Acceptable / Weak by reviewer
- Negative reinforcement tightens decision rules immediately
- Pass criteria: <20% Weak outputs across a sample of 50+

If pass: proceed to Week 3. If fail: extend Week 2 by 1–2 weeks while iterating on prompts and decision rules.

### Week 3 — Internal autonomy

- Agent publishes to low-risk, internal-facing surfaces: internal dashboards, internal Slack channels, draft queues
- Mistakes are recoverable (no external customer exposure)
- Sampling rate by human reviewer reduces from 100% to 20%
- Pass criteria: sampling shows >80% Strong outputs, no escalation-worthy issues missed

If pass: proceed to Week 4. If fail: extend Week 3 by 1 week, investigate misses.

### Week 4 — External deployment

- Agent operates externally — customer-facing outputs, vendor-facing comms, etc.
- Sampling rate by human reviewer: 10% (with full audit trail available)
- Monthly review by client-side owner
- Voice-locking refresh quarterly

If pass: engagement transitions from build phase to operate phase. If fail: pull back to Week 3 until issues resolved.

### The ladder is bidirectional

If an agent in operate phase starts failing quality checks, the response is to pull back up the ladder — restore Week 3 conditions until issues resolve. Don't try to fix problems while deployed externally.

---

## The "named human owner" rule, operationalized

For every agent in the stack, at every moment, two questions must have answers:

1. **Who is the AIS-side owner of this agent right now?**
2. **Who is the client-side owner of this agent right now?**

If either question doesn't have a clear answer, the agent stops. No exceptions.

Owner transitions (e.g. cofounder vacation, client personnel change) have an explicit handoff: the outgoing owner briefs the incoming owner, both sign off on the handoff, the agent's spec is updated with the new owner.

If a client tries to terminate an internal owner without a successor, the agent halts external-facing operations until a successor is named. We will pause operations rather than allow floating AI to persist.

---

## Coordination tax: what the Work Chart absorbs

Traditional orgs spend significant time on:
- Weekly 1:1 meetings (status sync)
- Slack status updates ("hey just an FYI...")
- Async handoff context loss ("wait, what was the context on this?")
- Meeting prep + follow-up coordination
- "I sent it to X but I'm not sure if they saw it"

The Work Chart absorbs all of this into:
- **Layer 2:** agents hold persistent memory — no context loss on handoff
- **Layer 3:** automation routes deterministically — no "I sent it to X but..."
- **Layer 4:** surfaces show state — no "what's the status of...?"
- **Layer 1:** human attention reserved for actual judgment calls

The compute cost is what replaces the headcount cost. This is the compute-to-talent inversion in mechanical terms — the org chart that needed 10 humans to handle coordination now needs 3 humans plus an agent stack.

---

## When the Work Chart doesn't fit

The architecture is opinionated. Some functions don't fit and that's fine.

**Functions that don't fit:**
- Pure-embodied work (in-person service, physical inspection)
- Pure-relationship work (high-status business development built entirely on personal trust)
- Highly-improvisational creative work where the "right answer" is unknown until tried
- Single-instance work that doesn't repeat (one-off custom projects)

For these, the Work Chart wraps around them — the embodied / relationship / creative work happens at Layer 1 with full human attention, and the Work Chart handles the surrounding scaffolding (scheduling, follow-up, knowledge capture, etc.).

We don't try to push pure-Layer-1 work into Layer 2. That's how AI vendors over-promise and under-deliver. Match the layer to the work.

---

## Diagnostic: is your Work Chart healthy?

Periodic check. If any answer is "no," the Work Chart needs attention.

- Are humans spending their time on judgment, or on repeatable execution?
- Does every agent have a named human owner right now?
- Is automation handling deterministic routing, or are agents burning tokens on it?
- Are surfaces transparent — can a human see what each agent is doing, queued, blocked on?
- Are escalations flowing up the layers cleanly, with documented thresholds?
- Are handoffs between agents structured, audited, with deadlines and fallbacks?
- Is the 30-day onboarding ladder being followed for every new agent, or being skipped under pressure?

This list lives in the run-book (Phase 6) for monthly self-check.
