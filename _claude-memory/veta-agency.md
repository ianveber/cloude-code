# Veta Agency

Last updated: 2026-09-01

## What it is

AI-native vertical agent agency. Ships production agent systems that take over one functional cluster inside a specialty service business. Practitioner-level vertical knowledge before the discovery call.

Not: AI consulting, SaaS seats, digital marketing retainers, staff augmentation, "AI for any business."

## Offer

| Tier | What | Typical |
|---|---|---|
| 1 Cluster Sprint | One cluster, 6–8 weeks, read-only then write, handoff + 30-day support | $18K–$45K |
| 2 Vertical Stack | 2–4 clusters, 10–16 weeks, unified exception dashboard | $55K–$120K |
| 3 Embedded Partner | Monthly improvement retainer after handoff | MRR |

Full catalog: `docs/service-catalog.md`. Pricing logic: `ops/pricing-architecture.md`.

## Active verticals

1. Specialty dental (implant, ortho, OMS)
2. Specialty legal (immigration, estate, IP)
3. Aesthetic medicine (MedSpa, plastics, cosmetic derm) — first-run baseline, 0 engagements in playbook as of 2026-05-04

## How we operate

- Daily sweep before 09:30 local (`ops/run-book.md`) — blockers, exception queues, AR, inbox. 15 minutes.
- Weekly Friday review 60–90 min — engagement status, pipeline, acquirer, cash, decisions
- Business manager agent: `CLAUDE.md`, 07:00 Europe/Ljubljana, `./reports/`
- Acquirer agent: organic SEO/GEO/content/partnerships only (`agents/acquirer/`)
- One named project lead per engagement (currently Ian)

## Principles (do not violate)

Vertical depth over horizontal breadth. Ship systems, not decks. Name stubs. Read-only before write. Clients own the build. Price on value. No silent failures. Slow down at compliance. Compound playbooks.

Canonical text: `docs/principles.md` and [[veta-internal/veta-principles]].

## Notion vs this repo

- This repo is the current agency OS (positioning, playbooks, delivery, skills)
- Notion VETA HQ (2026-04) is still structured as Freelance HQ: AI Video, Marketing, Finance, Weekly Planner + Client Tracker
- Keep both. Do not delete Notion. Write agency strategy changes here and in `docs/`

## Files created in this memory seed

See [[🗺️ Master MOC]]. New sync files: `_claude-memory/*`, `AGENTS.md`, `.cursor/rules/memory.mdc`, `scripts/link-obsidian-memory.sh`.
