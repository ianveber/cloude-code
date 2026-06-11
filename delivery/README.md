# Delivery

This directory contains the operational documents for every client engagement — from first discovery call to final handoff. These are living templates: fill them out per engagement, file the completed versions in the client's engagement folder (`agents/{vertical}-{client-slug}/`), and update the templates when you learn something new.

---

## Engagement lifecycle

```
Inbound / outreach
       ↓
  Discovery call  ────────────────────────────── discovery-framework.md
       ↓
  Qualification
       ↓ (qualified)
  Proposal (verbal)
       ↓ (accepted)
  SOW drafted and signed  ─────────────────────── sow-template.md
       ↓
  Onboarding  ─────────────────────────────────── onboarding-checklist.md
       ↓
  Phase 1: Spec + design
       ↓
  Phase 2: Build + read-only
       ↓
  Phase 3: Write-access + monitoring
       ↓
  Phase 4: Handoff  ───────────────────────────── handoff-protocol.md
       ↓
  30-day support window
       ↓
  Retainer offer or close
```

---

## Documents in this directory

| Document | Used when | Owner |
|---|---|---|
| [discovery-framework.md](discovery-framework.md) | Before and during the first substantive call with a prospect | Project lead |
| [sow-template.md](sow-template.md) | After verbal proposal acceptance, before kickoff | Project lead |
| [onboarding-checklist.md](onboarding-checklist.md) | Between SOW signature and Phase 1 build start | Project lead + client |
| [handoff-protocol.md](handoff-protocol.md) | Phase 4 — preparing for and executing the client handoff | Project lead |

---

## Where completed engagement documents live

Filed per engagement in `agents/{vertical}-{client-slug}/`. Example:

```
agents/dental-northshore/
├── agent-spec-intake-dental.md         (from agents/_base/agent-spec-template.md)
├── agent-spec-preauth-dental.md
├── tool-manifest-dentrix.md            (from agents/_base/tool-manifest-template.md)
├── tool-manifest-weave.md
├── eval-log.md                         (from agents/_base/evaluation-rubric.md)
├── discovery-notes.md                  (informal — from delivery/discovery-framework.md)
├── sow-signed.pdf                      (completed sow-template.md)
└── operator-documentation.md          (created at handoff)
```

Never store signed SOWs or client credentials in the verticals directory or the docs directory. Those go in the client's engagement folder only.

---

## What "complete" looks like at each stage

**Discovery complete:** You have a filled-out discovery notes document with: cluster identified, cost quantified, tech stack confirmed, qualification status marked as proceed, and a proposal delivery date committed.

**SOW complete:** All [FILL IN] placeholders replaced. All [ASSUMPTION] items either resolved or explicitly flagged with an owner and deadline. Both parties have signed.

**Onboarding complete:** Every checkbox in onboarding-checklist.md is checked. Phase 1 start date logged.

**Handoff complete:** Every item in handoff-protocol.md pre-handoff checklist is done. Independent operation test passed. Final invoice issued.
