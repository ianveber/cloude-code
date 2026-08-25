# Service Catalog

What Veta sells, how it's structured, and what each tier includes. This is the canonical reference for proposals, pricing conversations, and scope discussions.

---

## What we sell

We sell **agent systems** — coherent, production-ready sets of agents, integrations, and workflows that take over a specific functional cluster inside a service business. Not prototypes. Not "AI consulting." Not software licenses. Operating infrastructure.

Every engagement maps to one of three tiers:

---

## Tier 1 — Cluster Sprint

**One functional cluster. Fixed scope. 6–8 weeks.**

Replaces a single, well-defined operational cluster: new-patient intake, insurance pre-authorization, appointment recall, treatment plan follow-up, document processing, reporting, etc.

**What's included:**
- Pre-engagement discovery (1–2 calls + async intake) to confirm scope and map the existing workflow
- Agent system spec (named agents, tool integrations, data flows, exception handling)
- Build and integration — agents deployed into the client's existing tools (EHR, CRM, scheduling system, email, etc.)
- Read-only validation phase (typically 1 week) before write-access goes live
- Operator documentation (what the system does, how to monitor it, how to handle exceptions)
- Recorded handoff session with the client's ops team
- 30-day post-launch support window (bug fixes, not scope expansion)

**What's not included:**
- Building or migrating the client's core software (EHR, CRM, etc.)
- Ongoing operation, monitoring, or improvement after the 30-day window
- Staff training beyond the handoff session
- Compliance counsel (flagged during discovery, client arranges separately)

**Typical price range:** $18K–$45K depending on vertical, cluster complexity, and integration surface

**Ideal for:** First engagement with a new client. Proves the model. Seeds the retainer conversation.

---

## Tier 2 — Vertical Stack

**Two to four functional clusters. Coordinated build. 10–16 weeks.**

A connected set of agent systems that cover a larger operational surface — typically the full front-office or the full back-office of a practice. Clusters share context (patient/client records, scheduling state, communication history) so the system behaves coherently rather than as isolated automations.

**What's included:**
- Everything in Tier 1, across multiple clusters
- Cross-cluster integration design (agents share context and hand off between each other)
- Unified exception dashboard (one place for the ops team to see what needs human attention)
- Three months of post-launch improvement retainer (included in base price)

**What's not included:**
- Full-practice rebuild (we're not replacing your core software)
- Ongoing operation after the 3-month retainer
- HIPAA/legal compliance certification — we build compliant-by-design, client certifies

**Typical price range:** $55K–$120K

**Ideal for:** Second engagement with a Tier 1 client who wants to expand, or a larger practice that wants a coordinated build from the start.

---

## Tier 3 — Embedded Partner

**Ongoing engagement. Monthly retainer. Continuous improvement.**

We stay embedded as the client's ongoing agent operations partner. We run the monitoring, iterate on the agent systems, add new clusters as the business grows, and serve as the technical point of contact for anything AI-related.

**What's included:**
- Dedicated hours each month for system monitoring, debugging, and improvement
- Monthly performance review (agent metrics, exception rates, workflow impact)
- Priority scope additions — new clusters or integrations go to the front of the queue
- Access to new vertical tooling we build (updated playbooks, new agent templates)

**What's not included:**
- On-call SLA (we're not infrastructure support)
- Staff augmentation (we're not replacing your team with our team)
- Scope that equals a new Tier 1 or Tier 2 engagement (those are separately scoped)

**Typical price range:** $4K–$12K/month depending on scope

**Ideal for:** Clients who have completed a Tier 1 or Tier 2 engagement and want to compound the results. Not for clients who haven't gone through a build with us first.

---

## What we do not sell

| Offering | Why we don't sell it |
|---|---|
| Paid advertising management | Outside scope. See `docs/positioning.md`. |
| Generic AI consulting | No vertical depth, no leverage. |
| Software seats or licenses | We don't build platforms. |
| Staff augmentation | We build systems that reduce need for staff, not staff-shaped services. |
| "AI readiness assessment" | Consulting theater. We do real discovery as part of a scoped build only. |
| Robot hardware / motor controllers | We own the brain (Veta Cortex), not the chassis. |
| Social media management | Not our domain. |
| Training and education | Not a scalable business for us. Refer out. |

---

## Pricing logic

We price on the value of the cluster replaced, not on hours. The anchor is always: what does the current workflow cost the client (staff hours × loaded hourly rate + error costs + revenue leakage)?

**Framework:**
1. Quantify the current cost of the target workflow in discovery
2. Estimate the operational value recovered (conservative — understate, then overdeliver)
3. Price at 25–40% of first-year value recovered, with a floor based on build complexity
4. Never price below the floor to win a deal — we'll lose money and set a bad precedent

**Floors (2025 baseline):**
- Tier 1: $18K minimum
- Tier 2: $55K minimum
- Tier 3: $4K/month minimum

These are working numbers. Adjust after the first three completed engagements based on actual build costs.

---

## Scope discipline

The most common project failure mode is scope creep disguised as helpfulness. Rules:

1. If a client request is not in the SOW, it's not in the current engagement. It goes to a "future scope" list for the retainer or next engagement.
2. Any scope change above 10% of the original estimate requires a written scope amendment and a revised timeline.
3. "One more thing" is always a scope conversation, never a favor.

These rules protect the client as much as us. Scope creep creates technical debt in the agent system and erodes the clean handoff we're trying to deliver.
