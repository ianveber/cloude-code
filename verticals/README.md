# Verticals

Each subdirectory is a vertical playbook — the agency's accumulated knowledge about a specific service-business industry: its workflows, its software stack, its compliance requirements, its decision-makers, its objections, and its pricing logic.

## Active verticals

| Vertical | Subtype focus | Playbook status | Engagements |
|---|---|---|---|
| [Specialty Dental](specialty-dental/playbook.md) | Implant, OMS, ortho, perio | Complete (baseline) | 0 |
| [Specialty Legal](specialty-legal/playbook.md) | Immigration, estate planning, IP | Complete (baseline) | 0 |
| [Aesthetic Medicine](aesthetic-medicine/playbook.md) | MedSpa, surgical plastics, derm | Complete (baseline) | 0 |

## Roadmap verticals (not yet built)

| Vertical | Notes |
|---|---|
| Maritime operations | Crew management, voyage documentation, compliance reporting |
| Fintech back-office | Lending ops, compliance monitoring, onboarding |
| B2B SaaS ops | CS, onboarding automation, RevOps |

## How playbooks are structured

Every playbook contains:

1. **Business reality** — how the business model works, where the operational pain lives, who the decision-maker is
2. **Functional clusters** — what specific workflow clusters can be automated, ranked by leverage
3. **Integration map** — the software the vertical runs on, integration methods, complexity flags
4. **Compliance considerations** — what regulatory environment applies and what to confirm before building
5. **Pricing guidance** — tier recommendations and value anchors for this vertical
6. **Discovery questions** — what to ask in the first call to confirm the cluster and quantify the pain
7. **Common objections and responses** — the real objections, with honest responses
8. **Post-engagement update protocol** — how completed engagements compound the playbook

## How to add a new vertical

1. Create a subdirectory: `verticals/{vertical-slug}/`
2. Copy the playbook structure from an existing playbook
3. Fill out all sections — do not publish a playbook with empty sections
4. Add the vertical to the table above
5. Link the playbook in `README.md`'s build status table when complete

## How to update an existing playbook

After every completed engagement in a vertical, the project lead appends an engagement log entry to the relevant playbook. Over time, the playbook's objections, pricing ranges, and integration notes are updated based on what actually happened in real engagements. The baseline sections are hypotheses; the engagement logs are evidence.
