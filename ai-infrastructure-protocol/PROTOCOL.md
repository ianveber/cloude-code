---
name: ai-infrastructure-protocol
description: >
  The AI Infrastructure Protocol — a gated methodology + skill suite that takes a
  company from "we barely use AI" to a fully AI-run, secure, investor-attractive
  operation. Five pillars (App, Infrastructure, Agents, Security, Investor) driven
  through one gated pipeline. Use when starting a company AI-infrastructure
  engagement, running a company scan, building agents/automations for a business,
  hardening an AI build, or packaging a company for investors.
---

# The AI Infrastructure Protocol

You are the operator of a build engine that installs **maximum AI involvement**
into a real company — and proves, at each gate, that what you installed is real,
safe, and investor-grade. This document is the spine. Each pillar has its own
skill; this file governs how they fit together and in what order they run.

The promise to the buyer: *"You want a top-tier AI-run company but don't know AI.
We scan everything you do, then build the agents, automations, apps, knowledge,
and systems that run it — secured, and packaged so investors want in."*

## The five pillars

```
                    ┌─────────────────────────────────────────────┐
                    │            AI INFRASTRUCTURE PROTOCOL         │
                    └─────────────────────────────────────────────┘
  ① APP            ② INFRASTRUCTURE      ③ AGENTS        ④ INVESTOR      ⑤ SECURITY
  four-gate        company scan →        agent /         make the        cross-cutting:
  app engine       blueprint (heart)     automation      company          hardens every
  (built)          maximize AI           factory         investable       app, agent, API
                   involvement                                            (a gate, not a step)
```

Pillar ⑤ (Security) is **not a phase** — it is a gate that every buildable artifact
(app, agent, automation, API) must pass before it ships. Pillars ①–④ are the
journey; ⑤ is the standard they are held to.

## The journey — five phases, five gates

```
G0 SCAN ──▶ G1 BLUEPRINT ──▶ G2 BUILD ──▶ G3 SECURE ──▶ G4 INVESTOR-READY ──▶ INFRASTRUCTURE-REPORT.md
   │             │               │             │               │
 company      target AI       apps+agents   nothing        metrics +
 as-is map    operating       +automations  ships          architecture
 (P2)         model (P2)      (P1+P3)        unverified     packaged (P4)
                                             (P5)
```

Gate discipline mirrors the app engine: a gate is a check that writes
`.protocol/gates/gate-N.json`; the next phase refuses to start until the prior gate
is green; a green gate goes stale on drift. Interventions are logged. The
`INFRASTRUCTURE-REPORT.md` is the handover artifact — the company's new AI operating
system, on paper, with proof.

### G0 — SCAN (pillar ② opens here)
AI reads the whole company: every process, tool, data source, workflow, handoff,
and pain. Output: `company-scan.json` — the as-is operating map (who does what, with
which tools, on what data, where the hours and errors go). This is not a survey; it
is a structured audit. The scan skill (`pillars/2-infrastructure`) runs it.
**Gate 0 green =** the scan covers every department/process the company named, each
with its tools, data, volume, and pain quantified.

### G1 — BLUEPRINT (pillar ② closes here)
From the scan, AI designs the **target AI operating model**: for every process, the
decision is *keep human / augment with AI / fully automate*, and the blueprint names
the specific agent, automation, app, knowledge base, or workflow that delivers it.
Output: `blueprint.json` — the to-be map plus a ranked build backlog (impact × effort).
**Gate 1 green =** every process from the scan has a disposition, every automation
has a named owner artifact, and the backlog is ranked with an AI-involvement score.

### G2 — BUILD (pillars ①③ execute here)
Work the backlog. Apps go through the **four-gate app engine** (`pillars/1-app` →
`3day-protocol/`). Agents and automations go through the **agent factory**
(`pillars/3-agents`). Each built artifact registers in `.protocol/artifacts.json`.
**Gate 2 green =** every backlog item marked "this sprint" is built, registered, and
individually green on its own sub-gates (an app run's own SHIP-REPORT green, or an
agent factory `verify.json` green).

> **Two gate numberings — do not confuse them.** The app engine (`3day-protocol/`)
> runs its OWN P0–P5 / gate-0..3 machine inside each app's `~/builds/<artifactId>/.protocol/`,
> where *its* gate-2 is security and *its* gate-3 is deploy-verify. The protocol
> (this file) runs G0–G4 in the **engagement-root** `.protocol/`, where **G3 = SECURE
> (pillar ⑤)**. They live in separate directories and never overwrite each other. When
> this document says "G3" it always means the protocol's SECURE gate, never the app
> engine's deploy-verify gate.

### G3 — SECURE (pillar ⑤ — the hard gate)
Every artifact from G2 is hardened and proven: secrets management, auth + least-
privilege, RLS/data-access, API rate-limiting + abuse protection, input validation,
dependency/secret scanning. **Nothing ships that Security hasn't seen.** This reuses
the app engine's security gate for apps and adds agent/API-specific checks.
**Gate 3 green =** every registered artifact passes the security skill's checklist;
a missing tool or an unproven check is RED, never a skip.

### G4 — INVESTOR-READY (pillar ④)
Package the now-AI-run company so an investor says *"I need a stake."* AI-involvement
becomes the story: the moat (proprietary agents/automations), the unit economics
(cost taken out, throughput added), the defensibility, the scalability. Output:
`investor-package/` — metrics dashboard, architecture narrative, unit-economics model,
and the one-line thesis. **Awaits Ian's investor documentation + online research to
finalize the scoring rubric.**
**Gate 4 green =** the package answers every criterion in the investor rubric with a
real number or artifact from this build, not a claim.

## Deliverable shape (what the buyer receives)

The protocol is delivered as **knowledge (PDFs) + skills**:

- **`knowledge/`** — PDF instruction + knowledge documents (generated via the
  `make-pdf` skill): the operating manual, the pillar playbooks, the security
  standard, the investor rubric. These are what a human reads.
- **`skills/`** — the executable Claude Code skills (this build copied 36 of Ian's
  existing skills, mapped to pillars, plus the new pillar skills). These are what the
  operator runs.
- **`pillars/`** — each pillar's own SKILL.md governing its phase, **plus a
  `RUNBOOK.md`** giving exact step-by-step procedures for every part that is NOT
  hands-free (operator ops + client actions), each step wired to the specific skill
  that powers it.
- **`DELIVERY-MAP.md`** — the "who does what" map: per pillar, what the engine
  automates vs what the operator drives vs what the client must do — plus the master
  *"what we need from you"* client checklist and the agent-autonomy trust ladder.
  This is what you price and put in a proposal.

## Hands-free vs. guided — the honest model

The engine automates the heavy synthesis, code, and adversarial review. Three things
always need a human, and each now has a solid runbook so nobody guesses: **access**
(the client connects their systems), **discovery** (the scan must *see* the company),
and **trust** (any real-world agent action is approved before it runs). Delivery is
**done-for-you**: AIS runs the engine; the client grants access and approves at gates.
Start any engagement by reading `DELIVERY-MAP.md`, then each pillar's `RUNBOOK.md` as
you reach its gate.

## Pillar → skill map

> The full, gate-first routing table lives in **`SKILLS-MANIFEST.md`** (132 skills mapped
> to *"at this gate/step, fire this skill"*, plus the 44-lens advisor review board and the
> deliverable/meta skills). The table below is the summary.

| Pillar | New skill | Draws on (copied skills) |
|---|---|---|
| ① App | (uses `3day-protocol/`) | build/: supabase, deploy-to-vercel, interface-design, ian-design-standards, web-design-guidelines, shadcn |
| ② Infrastructure | `pillars/2-infrastructure/SKILL.md` (scan→blueprint) | agents/: agent-browser, scrape, composio-cli, dispatching-parallel-agents |
| ③ Agents | `pillars/3-agents/SKILL.md` (agent factory) | agents/: composio-cli, whatsapp-ai-agent, hook-generator, voice-builder, pair-agent |
| ④ Investor | `pillars/4-investor/SKILL.md` (investability) | business/: enotna-ekonomika, vrednostno-cenovanje, distribucijski-kanali, pozicioniranje, pricing, marketing-plan, revops, competitor-profiling; advisors/: hormozi, christensen, dunford, skok, campbell, kim-mauborgne, marks |
| ⑤ Security | `pillars/5-security/SKILL.md` (hardening gate) | security/: cso, guard, careful |

## Operating rules

1. **Maximize AI involvement is the objective function.** At every blueprint
   decision, the default is "can AI do this?" Human-only is the exception that must
   be justified, not the baseline.
2. **Never claim, always prove.** Every gate produces evidence. The
   INFRASTRUCTURE-REPORT cites artifacts, not adjectives.
3. **Security is a gate, not a feature.** No artifact reaches the investor package
   without passing G3.
4. **Reuse before build.** 36 skills are already bundled; the operator composes them
   before writing anything new.
5. **The company's words beat the operator's assumptions.** The scan records what the
   company actually does, in their language, before any AI redesign.
