# Agents

This directory contains all agent specifications, tool manifests, and supporting files for every agent system Veta builds — both internal (acquirer, ops) and client-facing.

---

## Directory structure

```
agents/
├── _base/                        # Templates and standards — apply to every agent
│   ├── agent-spec-template.md    # Fill this out for every new agent
│   ├── tool-manifest-template.md # Fill this out for every tool integration
│   └── evaluation-rubric.md      # How to measure whether an agent is working
│
├── acquirer/                     # Veta's own organic acquisition system
│   ├── agent-spec.md
│   ├── seo-geo-playbook.md
│   ├── content-strategy.md
│   └── partnership-outreach.md
│
└── {vertical}-{client}/          # Client-specific agent systems (created per engagement)
    ├── agent-spec-{agent-name}.md
    ├── tool-manifest-{tool-name}.md
    └── eval-log.md
```

Client agent directories are named `{vertical}-{client-slug}` — e.g., `dental-northshore`, `legal-meridian`. Never use client full names in directory names.

---

## How agents are organized

Each agent system maps to a **functional cluster** — a discrete set of repeatable tasks that share context and data. A cluster has a clear start and end: it begins when a specific trigger fires (a new patient record created, an email received, a form submitted) and ends when a defined output is produced (appointment confirmed, document filed, follow-up sent).

One agent system can contain multiple agents that coordinate. The spec file for the system names each agent, its role, and how they hand off to each other.

---

## Agent naming conventions

Format: `{role}-{vertical}-{action}`

Examples:
- `intake-dental-triage` — triages new patient inquiries for a dental practice
- `preauth-dental-submit` — submits insurance pre-authorization requests
- `recall-dental-schedule` — schedules recall appointments for overdue patients
- `intake-legal-intake` — processes new matter intake for a legal practice

When a single agent handles a cluster end-to-end (no handoff needed), name it by the cluster: `intake-dental` rather than inventing a sub-agent name.

---

## Build lifecycle for every agent

```
1. Spec draft          → agent-spec-template.md filled out, shared with client for review
2. Tool manifest(s)    → tool-manifest-template.md filled out for each integration
3. Read-only phase     → agent runs, produces outputs, no writes to client systems
4. Read-only sign-off  → client and project lead confirm outputs are correct
5. Write-access phase  → agent begins taking write actions (sending messages, updating records)
6. Write-access review → 1-week monitored run with daily exception review
7. Handoff milestone   → client ops team runs without project lead on call
8. Post-launch window  → 30 days of bug-fix support (no scope additions)
```

Steps 4 and 6 require explicit sign-off. The sign-off is recorded in the engagement's eval-log.md.

---

## Standards that apply to every agent

These come from `docs/principles.md`. They are repeated here as a checklist, not a reference — you should internalize them.

- [ ] Exception handling section is complete (not empty, not "TBD")
- [ ] Read-only phase defined before write-access phase
- [ ] Tool manifest exists for every external integration
- [ ] Compliance flags section reviewed for the relevant vertical
- [ ] Output format is specified (structured, parseable, not just "a summary")
- [ ] Known limitations are named explicitly — no silent stubs
- [ ] Operator documentation written before handoff milestone

If any of these boxes are empty when a spec is submitted for build, the spec is incomplete. Do not start building.

---

## Templates

Start here for every new agent or integration:

- New agent: copy `_base/agent-spec-template.md` → rename → fill out completely
- New tool integration: copy `_base/tool-manifest-template.md` → rename → fill out completely
- Evaluating an agent: use `_base/evaluation-rubric.md` as the checklist
