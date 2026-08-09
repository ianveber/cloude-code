# Memory System

How the agency compounds knowledge across engagements. What goes in shared memory vs per-engagement memory. The learning loops that turn lived experience into systematic improvement.

A vertical agent agency lives or dies by its ability to compound. The first engagement teaches us something; the second uses what the first taught us; the tenth uses what nine taught us. Without that compound, AIS is repeating itself instead of compounding.

---

## The three memory layers

### Layer 1 — Shared agency memory (this repo)

The `/agency/` repo itself. Documented framework, principles, playbooks, templates, agent specs, delivery workflows.

This is the slowest-changing layer. Changes here require cofounder consensus and update the way AIS operates going forward.

### Layer 2 — Per-engagement memory

Lives at `/engagements/[client-name]/`. Specific to one client's engagement. Documents the scoping, build, validation, handoff, and operate phase for that engagement.

This is engagement-specific working memory. Changes affect one engagement only.

### Layer 3 — Cross-engagement learnings

Patterns observed across multiple engagements. Failures repeated, surprises encountered, decisions that worked vs didn't. Promoted from per-engagement memory into shared memory when patterns stabilize.

This is the connective tissue. Cross-engagement learnings prevent the agency from re-learning the same lessons.

---

## What goes in shared agency memory

The `/agency/` repo. Anything that should govern future engagements.

### Updated routinely

- **Vertical playbooks** (`verticals/`): updated when a vertical's pricing band, ICP, or playbook structure evolves based on engagement experience
- **Agent specs** (`agents/`): updated when agent configurations evolve, failure modes are discovered, voice locking thresholds change
- **Delivery templates** (`delivery/`): updated when delivery workflow improves, checklists get tightened, validation gates evolve
- **Sales materials** (`sales/`): updated when ICP refines, content patterns shift, partner approaches change
- **KPI framework** (`ops/kpi-framework.md`): updated when measurement priorities evolve

### Updated rarely

- **Positioning** (`docs/positioning.md`): updated only when strategic thesis evolves (annually at most)
- **Services** (`docs/services.md`): updated when service catalog changes (rare)
- **Pricing** (`docs/pricing.md`): updated annually during pricing review
- **Principles** (`docs/principles.md`): updated only with explicit cofounder consensus; principle changes are significant
- **Voice** (`docs/voice.md`): updated annually; vocabulary blacklist evolves as language shifts

### Updated by event

- **Risk register** (`ops/risk-register.md`): updated when new risks emerge or existing risks materialize
- **Escape-velocity targets** (`ops/escape-velocity-targets.md`): updated when revenue/team trajectory diverges from projection
- **Partner tracker** (`sales/partner-tracker.md`): updated continuously

### Update protocol

Changes to shared memory follow a protocol:

1. Cofounder identifies a needed change (observed via engagement, retrospective, or strategic discussion)
2. Drafts the change locally (text edit, with reasoning)
3. Cross-cofounder review (at minimum one other cofounder reviews; for principle/positioning changes, all three)
4. Approved change committed; brief note in decisions log
5. Notification to all cofounders that shared memory changed

### What's not in shared memory

- Per-client confidential data (lives in per-engagement folders only)
- Cofounder personal notes (live in personal Obsidian vaults)
- Half-formed ideas (live in scratch notes until they earn promotion)
- One-off creative work (e.g. specific case study text — lives at `/case-studies/`, not in shared docs)

---

## What goes in per-engagement memory

`/engagements/[client-name]/` is the engagement's working folder.

### Standard structure

```
/engagements/[client-name]/
├── discovery-summary.md         (from discovery call, Phase 1)
├── scoping/
│   ├── session-1-notes.md
│   ├── async-questionnaire.md
│   ├── session-2-notes.md
│   ├── architecture-sketch.md
│   ├── risks.md
│   └── sow-draft-v[N].md
├── proposal/
│   ├── proposal-v[N].md
│   └── presentation.pdf
├── sow/
│   └── sow-signed-[YYYY-MM-DD].pdf
├── onboarding/
│   ├── plan.md
│   ├── access-log.md
│   ├── document-collection-log.md
│   ├── voice-samples/
│   └── kickoff-notes.md
├── build/
│   ├── checklist-progress.md
│   ├── weekly-notes-week-[N].md
│   ├── incidents.md
│   ├── scope-changes.md
│   └── decisions.md
├── validation/
│   ├── output-quality-report.md
│   ├── integration-health-report.md
│   ├── voice-locking-report.md
│   ├── stakeholder-readiness-report.md
│   ├── documentation-completeness-report.md
│   └── validation-report.md
├── handoff/
│   ├── 00-summary.md
│   ├── 01-agent-specs/
│   ├── 02-runbook.md
│   ├── 03-escalation-paths.md
│   ├── 04-monitoring-access-guide.md
│   ├── 05-quarterly-review-schedule.md
│   ├── 06-off-ramp-terms.md
│   ├── 07-training-materials/
│   └── 08-first-weekly-digest-example.md
├── operate/
│   ├── monthly-reviews/
│   ├── quarterly-reviews/
│   ├── escalations/
│   ├── improvement-requests/
│   └── voice-refresh-log.md
└── case-study/                  (when produced)
    └── (per case-study folder structure)
```

### Per-engagement memory governance

- **Lead cofounder owns the folder** for that engagement
- **Updated continuously through engagement lifecycle**
- **Confidentiality enforced** (engagement folders aren't shared with other clients; appropriate access controls if AIS uses cloud storage)
- **Retained after engagement ends** for the agreed retention period (default 24 months post-termination per `delivery/sow-template.md` Section 8.2)

---

## What goes in cross-engagement learnings

`/agency/learnings/` (created when first learnings are documented; doesn't exist yet at Phase 6 ship).

### Categories

- **Anti-pattern catalog:** failure modes observed across engagements. What went wrong, what we'd do differently.
- **Surprise log:** things we expected to be hard that were easy; things we expected to be easy that were hard. Pattern recognition material.
- **Decision provenance:** when a decision was made, why, and what happened as a result. Built up over engagement experience.
- **Tooling learnings:** which integrations are reliable, which are flaky; which tools punch above their cost; which are overrated.
- **Vertical-specific patterns:** patterns that hold across multiple engagements in the same vertical (informs playbook updates).
- **Voice-locking learnings:** which voice-owner profiles are easy to lock, which are hard; what extraction interview techniques work.
- **Acquisition learnings:** which signal types produce which conversion rates; which content topics actually generate inbound.

### Format

Each learning has:

```markdown
# [Learning name]

**Type:** [anti-pattern / surprise / decision provenance / tooling / vertical / voice / acquisition]
**Source engagements:** [list]
**First observed:** [date]
**Confidence:** [low / medium / high based on how many engagements confirm it]

## What we learned

[Description in 1–3 paragraphs]

## What we'd do differently

[Specific changes to playbooks / templates / processes]

## Evidence

[Specific engagement examples — anonymized where needed]

## Promoted to shared memory?

[Yes/No — and where if yes]
```

### Promotion to shared memory

A cross-engagement learning earns promotion to shared memory when:

- Observed in 3+ engagements (high confidence)
- Predictive (changing our approach based on this learning improves future outcomes)
- Generalizable (not unique to one vertical or one client situation)

Promotion mechanism: update the relevant shared-memory document. Document the source learning. Archive the learning in `learnings/` for provenance.

### Quarterly cross-engagement learning review

End of each quarter (per `ops/runbook.md`), ~60 min:

- Review learnings logged during the quarter
- Identify which deserve promotion to shared memory
- Update playbooks, templates, or principles accordingly
- Archive learnings that are too specific to be generalizable

---

## Learning loops

Five loops at different timescales:

### Loop 1 — Per-output (real-time, agent-level)

Inside each agent: every output the agent generates feeds back into its own decision rules via review and rating.

- Acquirer Agent: first-touch reply rates feed signal weighting
- Closer Agent: classification accuracy feeds classifier confidence
- Operator Agent: escalation patterns feed decision-rule refinement

Persisted in per-engagement audit trails. Acted on by the agents themselves continuously, by human owners weekly.

### Loop 2 — Per-engagement (weekly, cofounder-level)

The weekly check-in pattern (per `ops/runbook.md`) feeds learnings back to the cofounder lead.

- What's working in this engagement
- What's surprising
- What rules need to update

Captured in `/engagements/[client]/build/weekly-notes-week-[N].md`.

### Loop 3 — Engagement-end retrospective (per engagement)

At validation (per `delivery/validation-framework.md`) and at 90-day operate-phase mark:

- What we got right in scoping vs what surprised us
- Where the playbook held vs where it broke
- What we'd do differently if doing this engagement again

Captured in `/engagements/[client]/build/decisions.md` (build-phase retrospective) and `/engagements/[client]/operate/90-day-retro.md`.

Promoted to cross-engagement learnings if patterns emerge.

### Loop 4 — Quarterly cross-engagement review

End of each quarter, all cofounders review:

- Patterns across all active engagements
- Cross-vertical observations
- Promotion candidates for shared memory

Captured in `/agency/ops/quarterly-retros/QXYYYY.md`.

### Loop 5 — Annual strategic review

Annual offsite reviews everything:

- Has the shared memory base evolved appropriately?
- Are there meta-patterns the quarterly reviews missed?
- Does the agency's operating thesis still hold given observed reality?

Captured in `/agency/ops/annual-plans/YYYY.md`.

---

## What goes in personal cofounder memory (NOT in this repo)

Each cofounder maintains personal memory in their own Obsidian vault or equivalent.

### What lives there

- Personal observations and hunches not yet ready for shared memory
- Reflection notes that are personal rather than agency-level
- Personal goals and trajectories
- Per-relationship notes about partners, clients, prospects (their personal warmth and color, not the formal CRM data)
- Reading notes, study material, learnings from external sources

### Why separate

- Cofounders have different memory styles and tools
- Personal notes can be uncertain or speculative without polluting agency-level shared memory
- Privacy: personal observations about people (positive or negative) belong in personal memory, not agency memory
- Velocity: capturing personal thoughts shouldn't require cofounder consensus

### Ian's personal memory

For context (per the existing CLAUDE.md): Ian's personal memory is at `/Users/ianveber/Documents/Obsidian Vault/_claude-memory/`. Includes context.md, decisions-log.md, ethospheres.md, and other project-specific files. The AIS-specific personal notes for Ian live at `_claude-memory/ais-slovenia/`.

The AIS agency repo (`/agency/`) is separate from Ian's personal vault. Information flow between the two is deliberate: shared agency decisions get summarized into Ian's vault for personal context; personal observations from Ian's vault may surface into agency discussions but don't auto-sync.

---

## Memory hygiene

### What to write

- Things that future-AIS will need to know that aren't obvious from the current state
- Decisions and their reasoning (so future cofounders don't re-debate)
- Failure modes and their early warning signs
- Specific evidence behind general claims
- Pattern observations across engagements

### What not to write

- Things that are obvious from the current state (the repo's directory structure documents itself)
- Historical narrative that doesn't drive future decisions
- Personal observations about clients that could be problematic if leaked
- Speculation labeled as conclusion
- Duplicate information that lives elsewhere

### Update vs archive vs delete

| Situation | Action |
|---|---|
| Content is correct but expired | Update with current information |
| Content is incorrect but historically significant | Update with current; preserve old version in history (git for repo, version archive otherwise) |
| Content is unused but not harmful | Archive in `/archive/` rather than delete (provenance matters) |
| Content is incorrect and not historically significant | Delete |
| Content is sensitive and no longer needed | Delete with audit log entry confirming deletion |

### Cross-references

Link liberally between memory files. The repo's value compounds when documents reference each other and the reader can traverse.

Format: relative markdown links: `[plays per vertical](../verticals/specialty-legal.md)`.

Avoid:
- External links to documents outside the repo (those rot)
- Cross-references that aren't real (linking to files that don't exist)
- Excessive cross-referencing that makes content hard to read

---

## The memory system as competitive moat

A well-maintained memory system is itself a strategic advantage. After 2–3 years of consistent operation:

- Onboarding a new cofounder takes weeks instead of months (the operating model is documented)
- Spinning up a new vertical playbook is half-templated (the structure exists)
- Pricing decisions have provenance (cofounders don't re-debate the same questions)
- Acquisition learnings compound (signal weighting and topic selection sharpen over time)
- Cross-engagement patterns become predictive (we recognize trouble earlier)

Most agencies treat institutional knowledge as the cofounders' personal expertise. When a cofounder leaves, the knowledge leaves. AIS treats institutional knowledge as a documented system. Cofounders can leave; the system remains.

This is the kind of moat that takes years to build and can't be bought. It's also boring to build. The discipline to update memory consistently — even when it feels like overhead — is the moat creation process.

---

## Memory failure modes

### Failure 1 — Repo decays into being out of date

The repo was current in 2026 but nobody updated it through 2027. New cofounders read decisions that no longer apply. New engagements use outdated templates.

*Mitigation:* quarterly memory audit by Ian (per `ops/runbook.md`). Specific check: when was each shared-memory document last updated? If older than 12 months and the underlying reality has shifted, update or annotate as historical.

### Failure 2 — Cross-engagement learnings never get captured

Every engagement teaches us something, but nobody writes it down. Learnings stay in cofounder heads. When a cofounder is unavailable, the learning isn't accessible.

*Mitigation:* end-of-build retrospective is mandatory (part of validation phase). Specific question: "What did we learn here that future engagements should know?" Captured in `learnings/`.

### Failure 3 — Shared memory grows without pruning

Every learning gets promoted; nothing ever gets retired. Eventually the shared memory is too dense for new cofounders to onboard against.

*Mitigation:* annual memory pruning during offsite. Remove or archive content that's no longer load-bearing.

### Failure 4 — Per-engagement memory becomes data hoard

Every engagement's folder bloats with notes nobody reads. Real decisions buried in noise.

*Mitigation:* per-engagement folder structure is standardized (above). Don't create deeply-nested ad-hoc folders. Each subfolder has a defined purpose.

### Failure 5 — Memory updates without cofounder consensus

A cofounder updates a principle or pricing band without consulting others. Other cofounders are surprised when they next read the doc.

*Mitigation:* update protocol (above) requires cross-cofounder review for shared-memory changes. Decisions-log entry for any change to principles, pricing, positioning, or services.
