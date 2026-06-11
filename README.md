# Veta — AI-Native Vertical Agent Agency

## What this is

Veta ships complete agent systems that replace functional clusters inside specific service-business verticals. We don't sell software seats. We don't sell consulting hours. We don't sell generic AI strategy decks. We sell operating infrastructure: a coherent set of agents, integrations, and workflows that take over a defined slice of how a business runs.

Our clients are specialty service businesses — dental groups, boutique legal practices, aesthetic medicine clinics, maritime operators, fintech back-offices, B2B SaaS ops teams. They have repeatable, high-stakes workflows and no engineering team to automate them. We become their engineering team, delivery team, and operator — packaged as a fixed-scope agent system.

## What this repo is

This is the agency's internal operating repo. It contains:

- **Agency OS** — positioning, principles, and service catalog (`docs/`)
- **Agent architecture** — base templates, tool manifests, evaluation rubrics (`agents/`)
- **Vertical playbooks** — specific breakdown of each target vertical (`verticals/`)
- **Client delivery system** — discovery, scoping, onboarding, handoff (`delivery/`)
- **Business ops** — pricing, KPIs, daily run-book (`ops/`)
- **Acquirer agent** — organic acquisition system (SEO, GEO, content, partnerships) (`agents/acquirer/`)

This repo is also the working environment for the Veta Business Manager agent, which runs daily briefings pulling from GitHub Issues, Notion, Calendar, and Gmail. See `CLAUDE.md` for that agent's configuration.

## Quick navigation

| What you need | Where to look |
|---|---|
| What we sell and how we price it | `docs/service-catalog.md` + `ops/pricing-architecture.md` |
| How to scope a new client | `delivery/discovery-framework.md` |
| SOW template | `delivery/sow-template.md` |
| How to specify a new agent | `agents/_base/agent-spec-template.md` |
| Vertical-specific playbook | `verticals/{vertical}/playbook.md` |
| Agency positioning (for pitches) | `docs/positioning.md` |
| Daily ops + run-book | `ops/run-book.md` |
| How we acquire clients (organic) | `agents/acquirer/` |

## Build status

| Phase | Status | Files |
|---|---|---|
| Phase 1 — Agency OS | Complete | `docs/`, `README.md` |
| Phase 2 — Agent architecture | Pending | `agents/_base/` |
| Phase 3 — Vertical playbooks | Pending | `verticals/` |
| Phase 4 — Client delivery | Pending | `delivery/` |
| Phase 5 — Business ops | Pending | `ops/` |
| Phase 6 — Acquirer agent | Pending | `agents/acquirer/` |

## Non-negotiables

1. We do not manage paid advertising as a service. The Acquirer Agent covers organic distribution only.
2. We do not sell hours. Every engagement is scoped to a deliverable agent system.
3. We do not build generic agents. Every system is purpose-built for a specific vertical and functional cluster.
4. We do not leave clients dependent on us to operate. Every delivery includes a handoff protocol and operator documentation.
