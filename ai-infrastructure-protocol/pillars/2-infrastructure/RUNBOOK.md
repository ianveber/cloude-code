# Pillar ② Infrastructure — RUNBOOK (G0 SCAN → G1 BLUEPRINT)

Operating companion to `SKILL.md`. The skill defines *what* the scan and blueprint
must contain and *what turns each gate green*. This runbook defines *who does each
step, in what order, with which exact command or click* — so the operator never
guesses and the client always knows precisely what to do.

The heart of the protocol has three inherently-manual moments this runbook makes
solid:

- **ACCESS** — someone at the client connects their tools so the scan can SEE them.
- **DISCOVERY** — interviews + async answers that capture the company in its own words.
- **TRUST / SIGN-OFF** — the client approves the blueprint dispositions + backlog
  before a single artifact is built.

Everything else in this pillar (synthesis, quantification math, disposition logic,
ranking, schema validation, gate writing) is automated.

---

## 1. Hands-free vs not

| Fully automated (protocol) | AIS operator (in Claude Code) | Client (human, at their company) |
|---|---|---|
| Generate the bilingual discovery questionnaire | Kick off engagement, run the questionnaire generator, run interviews | Name their departments + process owners |
| Live tool inventory once access is granted (agent-browser / scrape / composio) | Drive the inventory passes against granted tools | **Grant read-only access** to each named tool |
| Reconcile interview vs inventory → gaps | Merge per-department scans, declare gaps | Answer async follow-ups on any gap |
| Quantify volume/hours/pain → `company-scan.json` | Validate scan vs schema, run Gate 0 check | Confirm the numbers look right (sanity pass) |
| Disposition logic (default fully-automate), artifact naming | Draft blueprint, apply advisor lenses | — |
| Backlog ranking math (impact×effort), AI-involvement rollup | Write `blueprint-ranking.txt`, run Gate 1 check | **Sign off** dispositions + ranked backlog |
| Write `gate-0.json` / `gate-1.json`, validate schemas | Render the blueprint to PDF, present it | Approve, or send items back to G1 |

Two things a machine can never do here: a human at the client must *connect the
systems*, and a human at the client must *approve the future they're buying*. This
runbook is built around those two facts.

---

## 2. Operator runbook

All paths are relative to the engagement root (`.protocol/` lives there). Every step
ends with the exact skill to invoke.

### G0 · SCAN

**O1 — Kickoff capture.** Open the engagement, record `company.name`, `industry`,
`headcount`, and — critically — `company.namedDepartments[]` and each department's
process owner (name + email). This list is the coverage contract Gate 0 checks
against, so capture it verbatim in the client's words.
-> invoke `client-onboarding-dashboard`

**O2 — Generate the discovery questionnaire.** Produce the bilingual (EN + SL)
discovery pack, one section per named department, driving each process toward the
eight required fields (steps, tools, data, volume, hours, pains, handoffs, trigger).
Send it to each process owner as the async pre-read before their interview.
-> invoke `web-intake`

**O3 — Book the discovery sessions.** One 45–60 min session per department owner,
plus a 30 min exec-level kickoff. Use the agenda in §3 (client-facing script).
-> invoke `schedule`

**O4 — Run each interview (Pass 1).** Walk the department process by process. Drive
every field to a *number* — anchor hours with a concrete recent instance ("walk me
through the last invoice you approved — what did you touch, how long?"), never an
average. Capture in the client's own language. For a multi-department company,
dispatch one capture agent per department and merge.
-> invoke `dispatching-parallel-agents`

**O5 — Inventory the live stack (Pass 2) — ONLY after access is granted.** For every
tool the client has connected and recorded under `scan.permissions.toolsInventoried[]`
(with `consentRecordedBy` set — see O11):
- Web apps (CRM, admin panels, spreadsheets, ticketing): log in headless, map what
  actually exists — pipelines, sheet tabs feeding reports, open-ticket counts, wired
  integrations. Capture to `.protocol/evidence/scan-inventory.txt`.
  -> invoke `agent-browser`
- Public surface (site, help center, docs, pricing) — the customer-facing operation:
  -> invoke `scrape`
- API/webhook probe — sets each `tools[].hasApi`, which directly gates
  full-automation feasibility at G1:
  -> invoke `composio-cli`

  **Hard rule:** never inventory a tool not listed under `toolsInventoried[]` with
  `consentRecordedBy` set. Inventorying without recorded consent is a Gate 0 RED —
  Security is a standard the scan is held to too.

**O6 — Reconcile (Pass 3).** Put interview against inventory. Every mismatch is
signal: a tool nobody mentioned = a shadow process to scan; a process with no tool =
manual drudgery (high automation value) or under-captured. Every unresolved mismatch
becomes a `pain` or a declared `gap`.
-> invoke `revops`

**O7 — Write `company-scan.json` + declare gaps.** Merge per-department `departments[]`,
fill `coverage.departmentsScanned[]`, `coverage.processesScanned`, and
`coverage.gaps[]` (every named-but-not-captured process, each with a reason — "unknown"
is never a value). Set `scan.method[]` from `{interview, agent-browser, scrape,
artifact, observation}` to reflect how each fact was sourced.
-> invoke `notion-business-os`

**O8 — Validate + run Gate 0.** Validate `company-scan.json` against
`templates/company-scan.schema.json`. Confirm all five Gate-0 criteria: coverage
complete (every named department present), every process fully quantified, consent
recorded for every `inspected:true` tool, gaps declared, schema valid. Write
`.protocol/gates/gate-0.json` (green/red + per-criterion evidence). Never hand-edit
the gate file.
-> invoke `verification-before-completion`

### G1 · BLUEPRINT (does not open until Gate 0 is green)

**O9 — Disposition every process.** For each scan process choose exactly one:
`fully-automate` (DEFAULT, ai_score ≥ 80), `augment-ai` (40–79, real judgement step
a human owns), or `keep-human` (ONLY with a `humanOnlyReason` from the enum:
regulatory-mandate, legal-liability, high-stakes-judgement, trust-relationship,
physical-world, not-yet-feasible). Preference/nervousness is never a valid reason.
Name ≥ 1 artifact per augment/automate item with a `kind` (app / agent / automation /
workflow / integration / knowledge-base) and its `buildsOnSkill[]` composition.
-> invoke `spec`

**O10 — Pressure-test the blueprint (optional but recommended).** Run the dispositions
past an expert lens board — challenge every `keep-human` and every timid `augment-ai`
against the fully-automate default.
-> invoke `advisor-christensen`

**O11 — Rank the backlog + roll up AI involvement.** Compute per item:
`impact.score = volume × hours × max(pain.severity)`, `effort.score = buildDays +
blockers`, `priorityScore = impact/effort`, dense `rank` desc. Roll up
`aiInvolvement.toBePercent` weighted by process hours. Write the reproducible math to
`.protocol/evidence/blueprint-ranking.txt`. Split into sprints `this / next / later`.
-> invoke `enotna-ekonomika`

**O12 — Write `blueprint.json` + run Gate 1.** Validate against
`templates/blueprint.schema.json`. Confirm all six Gate-1 criteria: one disposition
per process, every keep-human justified, every automate names an artifact that appears
in the backlog, backlog ranked+scored, AI-involvement rollup present with
`toBePercent > asIsPercent`, schema valid. Write `.protocol/gates/gate-1.json`.
-> invoke `verification-before-completion`

**O13 — Render the sign-off package.** Turn the blueprint into a client-readable PDF:
per-process disposition table, the ranked backlog, and the headline
`asIsPercent → toBePercent` jump. This is what the client signs.
-> invoke `make-pdf`

**O14 — Record the sign-off + hand to G2.** Log the client's approval (or their
send-backs) in `.protocol/journal.jsonl`. Gate 1 green + recorded sign-off is the
trigger: the `sprint:"this"` items, in `rank` order, become the G2 work order,
routed by `kind` (app → Pillar ①, everything else → Pillar ③).
-> invoke `notion-business-os`

---

## 3. Client actions

Plain-language. Written so a non-technical owner can follow each step. Slovene lines
are provided where a client will read them directly.

### C1 — Name your departments and owners
Reply to our kickoff with a simple list: each part of your business (e.g. Sales,
Operations, Finance, Support, Marketing) and one person per part who actually does
the day-to-day work. That person will do a short interview with us.
*SL: Naštejte oddelke podjetja in za vsakega eno kontaktno osebo, ki dela dnevne
opravke — z njo bomo opravili kratek pogovor.*

### C2 — Fill the discovery questionnaire (before your interview)
We send one form per department. For each recurring task, tell us: the steps, which
tools/apps you use, roughly how often it happens, and how long it takes. Rough
honest numbers beat perfect guesses. 20–30 minutes.
*SL: Za vsako opravilo: koraki, katera orodja, kako pogosto, koliko časa. Grobe
poštene številke so dovolj.*

### C3 — Do the discovery interview (45–60 min per department)
**Agenda we'll run:**
1. *Warm-up (5 min)* — what does a normal week in this department look like?
2. *Process walk (30 min)* — for each recurring task: show us the last real time you
   did it, click by click. We time it and note every tool.
3. *Pain hunt (10 min)* — where do errors, waiting, and rework happen? Show examples.
4. *Handoffs (10 min)* — who do you pass work to, how, and how long do they wait?

You don't prepare anything — just be at your computer with your normal tools open.

### C4 — Grant read-only access so we can SEE your tools
This is the step only you can do. For each tool below, follow the exact clicks. **All
access is READ-ONLY** — we look, we never change, send, pay, or delete anything.
After you grant each one, tell us the tool name so we log your consent
(`consentRecordedBy: <your name>`) — we will not touch any tool you haven't listed.

- **Google Workspace (Gmail / Drive / Calendar / Sheets)** — Add
  `operator@ais.si` as a **Viewer**: in Google Drive right-click the relevant
  folder → **Share** → paste the email → set role to **Viewer** → Send. For calendar:
  Google Calendar → your calendar's **⋯** → **Settings and sharing** → **Share with
  specific people** → add the email → **See all event details**. (No "Make changes"
  — Viewer only.)
- **HubSpot / Pipedrive / other CRM** — **Settings → Users & Teams → Invite user** →
  our email → assign a **read-only / view-only** role (HubSpot: a permission set with
  edit toggles OFF; Pipedrive: a "Read only" permission set). Invite, don't share your
  password.
- **Notion** — top-right **Share** on the top-level workspace/page → invite our email
  → set access to **Can view** → Invite.
- **Airtable / spreadsheets** — **Share** → add our email → **Read only** /
  **Commenter**.
- **Stripe / invoicing** — **Settings → Team → New member** → role **Analyst** or
  **View only** → send invite. (Never Admin.)
- **A tool with no user-sharing (custom app, internal panel)** — book a 20-min
  screen-share instead; we map it live while you drive. Nothing is connected.

If any grant feels wrong, stop and ask us — we'd rather scan one tool less than have
you over-share.

### C5 — Answer async gap follow-ups
After we reconcile what you told us against what your tools actually show, we may ask
2–3 short clarifying questions (usually a number we couldn't pin down). Quick replies
keep your scan complete instead of marked as a gap.

### C6 — Sign off the blueprint (the decision that starts the build)
We send you a short PDF: every task in your company with our recommendation —
**keep human / AI-assisted / fully automated** — plus a ranked list of what we'd
build first and the headline "AI runs X% of your work today → Y% after." Your job:
1. Read the disposition table — flag anything where a task **must** stay human for a
   real reason (a law, a licensed sign-off, a relationship that would break).
2. Approve the ranked backlog, or tell us to re-order / defer items.
3. Reply **"Approved"** (or the changes you want). Nothing gets built until you do.
*SL: Podpišite načrt — potrdite priporočila in prednostni seznam. Brez vaše potrditve
ne zgradimo ničesar.*

---

## 4. What we need from you (client checklist — this pillar)

Send this to the client at kickoff.

- [ ] **Departments + owners list** — each part of the business + one hands-on
  contact each (name + email).
- [ ] **Completed discovery questionnaires** — one per department, before interviews.
- [ ] **Discovery interviews booked** — 45–60 min per department owner + a 30-min
  exec kickoff.
- [ ] **Read-only access granted** to each tool you want in scope (Google Workspace
  Viewer, CRM view-only role, Notion Can-view, Stripe Analyst, etc.) — and a one-line
  confirm per tool so we can record consent.
- [ ] **Screen-share slots** for any tool that can't be shared by invite.
- [ ] **Async follow-up answers** on any number we couldn't pin down (2–3 questions).
- [ ] **Blueprint sign-off** — read the PDF, flag genuine keep-human items, approve
  (or re-order) the ranked backlog, reply "Approved".

Nothing in this list gives us write access to anything. We look and design; you keep
the keys.

---

## 5. Gate evidence

What this pillar writes into `.protocol/` to turn each gate green. Gate files are
machine-written by the check step (O8, O12) — never hand-edited — and go **stale** the
moment their input file changes.

### `.protocol/gates/gate-0.json` (SCAN)
```json
{
  "gate": 0,
  "pillar": "2-infrastructure",
  "ranAt": "<ISO-8601>",
  "operator": "<AIS operator>",
  "input": "company-scan.json",
  "checks": {
    "coverageComplete": "pass — every company.namedDepartments[] present in coverage.departmentsScanned[] and departments[].name",
    "everyProcessQuantified": "pass — steps/tools/data non-empty, volume+hours fully numeric for all N processes",
    "consentRecorded": "pass — every tools[].inspected:true tool listed in scan.permissions.toolsInventoried[] with consentRecordedBy set",
    "gapsDeclared": "pass — coverage.gaps[] accounts for every named-but-uncaptured process, each with a reason",
    "schemaValid": "pass — validates against templates/company-scan.schema.json"
  },
  "result": "green",
  "residual": "<declared gaps + why, or null>"
}
```
Supporting evidence written alongside: `.protocol/evidence/scan-coverage.txt`
(departments captured + gaps), `.protocol/evidence/scan-inventory.txt` (agent-browser
/ scrape / composio inventory output).

### `.protocol/gates/gate-1.json` (BLUEPRINT)
```json
{
  "gate": 1,
  "pillar": "2-infrastructure",
  "ranAt": "<ISO-8601>",
  "operator": "<AIS operator>",
  "input": "blueprint.json (scanRef: company-scan.json)",
  "checks": {
    "oneDispositionPerProcess": "pass — coverage.dispositionsCount == scan process count; every processId matches a scan process; no orphans/dupes",
    "keepHumanJustified": "pass — every keep-human carries a humanOnlyReason from the enum",
    "everyAutomateNamesArtifact": "pass — every augment/automate names ≥1 artifact; every artifact id appears as a backlog[].artifactId",
    "backlogRankedScored": "pass — rank dense 1..N unique, priorityScore consistent, ai_involvement_score present; math in evidence",
    "aiInvolvementRollup": "pass — aiInvolvement present with method; toBePercent > asIsPercent",
    "schemaValid": "pass — validates against templates/blueprint.schema.json"
  },
  "clientSignOff": {
    "approvedBy": "<client name>",
    "approvedAt": "<ISO-8601>",
    "sendBacks": "<list or none>"
  },
  "result": "green",
  "residual": "<keep-human items + reasons, or null>"
}
```
Supporting evidence: `.protocol/evidence/blueprint-ranking.txt` (reproducible
impact×effort math) and the sign-off recorded in `.protocol/journal.jsonl`.

Gate 1 green **plus** a recorded client sign-off is the single trigger that releases
the `sprint:"this"` backlog to G2. Scan process → disposition → named artifact →
ranked backlog → client-approved: one unbroken, evidenced chain.
