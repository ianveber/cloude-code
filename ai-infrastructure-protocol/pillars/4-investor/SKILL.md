---
name: ai-protocol-4-investor
description: >
  Pillar ④ of the AI Infrastructure Protocol — Investor-Readiness (Gate 4).
  Turns a company that pillars ②③ have made AI-run into an investment package an
  investor cannot ignore: the proprietary agents/automations become the moat, the
  cost-taken-out + throughput-added become the unit economics, the AI-run ops
  become the scalability and defensibility story. Use when a protocol run reaches
  G4, when packaging a company for a raise, or when asked "is this investable yet".
  SCAFFOLD — the scoring rubric is DRAFT pending Ian's own investor documentation.
---

# Pillar ④ — Investor-Readiness (Gate 4)

You are the operator who takes the company **as it now runs** — after the scan
(②), the build (①③), and the security hardening (⑤) — and packages it so an
investor says *"I need a stake."* You do not invent numbers. Every claim in the
package is backed by an artifact this build already produced: a registered agent,
a measured hour saved, a passed security gate, a live metric. The moat is not a
slide; it is the `.protocol/artifacts.json` you can point at.

The rule from the spine holds hardest here: **never claim, always prove.** An
investor-readiness score is worthless if any cell is an adjective. Gate 4 is green
only when every criterion resolves to a real number or a named artifact.

```
G3 SECURE ──▶ [ PILLAR ④ ] ──▶ G4 INVESTOR-READY ──▶ INFRASTRUCTURE-REPORT.md
  (every         translate         package answers        (investor package
   artifact       artifacts →       every rubric            = handover annex)
   hardened)      investment         criterion with
                  story              a number/artifact
```

> STATUS: **SCAFFOLD.** The methodology, the artifact→story translation, and the
> package structure below are final and executable. The **scoring rubric is DRAFT**
> — its thresholds, weights, and pass bars await Ian's own investor documentation
> (see `## AWAITING IAN'S DOCS`). Ship the package on the draft rubric only with an
> explicit `DRAFT-RUBRIC` banner; do not present a draft score as a final grade.

---

## The core move: AI-involvement becomes the investment story

Pillars ②③ installed maximum AI involvement and logged it. Pillar ④ reads that log
and re-tells it in the three languages an investor buys in: **moat, unit economics,
scalability/defensibility.** This is a translation, not a new build. If an artifact
is not in `.protocol/artifacts.json` or the pillar-② scan/blueprint, it does not
enter the package.

```
  BUILD ARTIFACT (what ②③ produced)          INVESTOR LANGUAGE (what ④ says)
  ─────────────────────────────────          ──────────────────────────────
  proprietary agent + its data loop     ─▶   MOAT: compounding data advantage,
    (feedback captured every run)              switching cost, time-to-replicate
  automation that removed N hours/week  ─▶   UNIT ECONOMICS: cost taken out →
    (scan baseline vs. post-build)             gross-margin lift, revenue/employee
  AI-run process at higher throughput   ─▶   SCALABILITY: volume grows without
    (blueprint disposition = automate)         proportional headcount
  security gate G3 green on every        ─▶  DEFENSIBILITY: governed, auditable,
    artifact + human-authority line            EU-AI-Act-ready → diligence discount
                                               avoided
  whole company mapped + re-run on AI    ─▶  EXECUTION: the operating system is
    (INFRASTRUCTURE-REPORT.md)                 the proof the team can build/run it
```

Three translations to get exactly right, because investors probe them hardest:

1. **Proprietary agents/automations are the moat — but only as a data loop, not a
   feature.** A static "we use AI" is not defensible; AI compresses build time so a
   copycat reaches feature parity fast. What compounds is the **loop**: every run of
   the company's agents captures proprietary feedback (corrections, exceptions,
   labeled outcomes) that improves the next run — a signal a new entrant starts at
   zero on. In the package, name the loop explicitly for each agent: *what signal is
   captured, where it is stored, how it feeds back, how many cycles have accrued.*
   (See research doc §2.)

2. **Cost-taken-out + throughput-added are the unit economics.** Pillar ② recorded a
   baseline: hours and error rates per process, before AI. Pillar ③ automated or
   augmented those processes. The delta is the unit-economics story — reframed as
   gross-margin lift, CAC-payback improvement, and **revenue-per-employee**, the
   headline metric of the AI-native category (2–10× traditional SaaS; §4). Use the
   `enotna-ekonomika` skill to model it, `vrednostno-cenovanje` to price the value
   created, `revops` for the recurring-revenue mechanics.

3. **AI-run ops are the scalability and defensibility.** A company where processes
   are dispositioned "automate" in the blueprint scales volume without scaling
   headcount — the flatter-org, higher-valuation-per-employee thesis (§4). But
   scalability without governance is a discount, not a premium: unaddressed AI
   risk draws a 15–30% diligence haircut (§5). Pillar ⑤'s G3 evidence — least-
   privilege, RLS proofs, human-authority line, model-provider redundancy — is what
   turns "AI-run" from a risk flag into a moat.

---

## DRAFT investor-readiness rubric

> **DRAFT — pending Ian's docs.** Thresholds and weights below are seeded from 2026
> benchmark research (see `knowledge/investor-criteria-research.md`), not from Ian's
> own deal experience. Treat them as placeholders. The **structure** — one number/
> artifact per criterion, no adjectives — is final; the **numbers** are provisional.

Every criterion scores **RED / AMBER / GREEN**, and the score cell MUST contain the
resolving number or the artifact path — never a word like "strong". A criterion with
no backing artifact is RED by definition, never a skip.

```
CRITERION            WHAT IT MUST ANSWER WITH          SOURCE ARTIFACT            DRAFT GREEN BAR
─────────────────    ──────────────────────────────   ────────────────────────   ─────────────────────────
1 Team               who built/runs the AI ops, and    scan §team, artifacts.json  named operator(s) + the
                     the proof they can                 (built-by fields)           built system as evidence
2 Market / TAM       serviceable market size + a        pozicioniranje output,      TAM/SAM/SOM with a
                     bottoms-up path to it              niche-research, blueprint   bottoms-up derivation
3 Traction           real usage/revenue/retention       live metrics dashboard,     ≥1 hard metric trending
                     — a number, not a demo             artifacts.json usage logs   (revenue, active use, NRR)
4 Unit economics     LTV:CAC, gross margin, payback,    enotna-ekonomika model      LTV:CAC ≥3:1, GM ≥70%,
                     revenue/employee                   on scan baseline+build      payback ≤12mo (§3, §4)
5 Moat               the data loop(s): signal, store,   artifacts.json per-agent    ≥1 agent with a described,
                     feedback, cycles accrued           loop description            measurable compounding loop
6 Scalability        volume headroom without            blueprint dispositions,     ≥1 process proven to scale
                     proportional headcount             throughput deltas           volume with flat headcount
7 AI-defensibility   what makes it hard to replicate    moat + switching-cost +     replicate-time argued from
                     beyond the model itself            integration-depth evidence  loop age + integration depth
8 Security posture   the governance/authority proof     G3 gate evidence, CSO       G3 green on 100% of
                     that avoids the diligence haircut  checklist, authority line   registered artifacts (§5)
```

Scoring procedure:

1. For each criterion, open the source artifact and read the actual value. If the
   artifact is missing or empty → **RED**, and log which build step must produce it.
2. Write the number/path into the cell. If you cannot, you may not score it GREEN.
3. Roll up: **any RED → Gate 4 is not green.** No weighted average hides a RED — a
   package with a hollow moat criterion is not investor-ready, however good the rest.
4. Run the advisor lenses (below) as adversarial reviewers of the filled rubric,
   before you call it done.

### Advisor lenses (adversarial review of the rubric)

Invoke each as a critique pass over the filled rubric — they exist to break a score
you were too kind to. Reuse the copied advisor skills:

| Lens | Attacks which criterion | Kills the score when… |
|---|---|---|
| `advisor-skok` (David Skok) | 4 Unit economics | LTV:CAC math is hand-wavy or CAC excludes true cost |
| `advisor-campbell` (Patrick Campbell) | 4 + value metric | pricing has no value metric; expansion revenue unproven |
| `advisor-hormozi` (Alex Hormozi) | 3 Traction / offer | the value equation is weak; demand is not real |
| `advisor-christensen` (Clayton Christensen) | 5 + 7 Moat/defensibility | no clear job-to-be-done; switch is not compelled |
| `advisor-dunford` (April Dunford) | 2 Market | positioned in a category where the company can't win |
| `advisor-kim-mauborgne` | 2 + 7 | competing head-on instead of on an uncontested axis |
| `advisor-marks` (Howard Marks) | whole rubric | second-level: what does the market already price in? |

A criterion survives only if it survives its lens. Record each lens's verdict in the
rubric evidence file.

---

## The output: `investor-package/`

Produce, under the run's `.protocol/`, an `investor-package/` directory. It is the
investor annex to `INFRASTRUCTURE-REPORT.md`. Every file cites an artifact.

```
.protocol/investor-package/
├── 00-thesis.md              one-line investment thesis + the 3-sentence "why now"
├── 01-metrics-dashboard.md   the filled rubric + the live numbers table
├── 02-architecture-narrative.md   how the AI operating system works, as a moat story
├── 03-unit-economics.xlsx|md      the cost-out/throughput-in model (baseline → post-build)
├── 04-moat-and-defensibility.md   per-agent data loops + switching-cost + replicate-time
├── 05-data-room-index.md     the diligence checklist mapped to what exists / is missing
└── evidence/                 copies/links of every artifact a number points to
```

What each file is, and which skill builds it:

- **`00-thesis.md`** — one sentence an investor repeats to their partners. Draft it,
  then run `pozicioniranje` (positioning) + `advisor-dunford` to sharpen the category
  and `advisor-hormozi` to sharpen the value. Format: *"[Company] is the [category]
  that runs [core operation] with AI at [proof metric], which no incumbent can match
  because [moat loop]."* Back every bracket with a rubric cell.

- **`01-metrics-dashboard.md`** — the filled DRAFT rubric table + a live-metrics
  snapshot (traction, revenue/employee, gross margin, payback). Pull numbers from the
  metrics dashboard the app engine / agent factory already emit; where a metric has
  no source yet, mark it `NO-SOURCE` (which is RED on that criterion), not a guess.

- **`02-architecture-narrative.md`** — the AI operating system as a story: which
  processes are AI-run, the agents/automations behind them, and the data loops. This
  is the pillar-② blueprint re-narrated for an investor. Use an ASCII operating-map
  diagram (reuse the one from the INFRASTRUCTURE-REPORT). The message: *this is a
  built system, not a plan.*

- **`03-unit-economics`** — the money model. Baseline (scan) vs. post-build:
  hours removed, error rate reduced, throughput added → gross-margin lift,
  revenue/employee, CAC-payback. Build with `enotna-ekonomika` (LTV/CAC/payback/
  margins), price the created value with `vrednostno-cenovanje`, model recurring/
  expansion mechanics with `revops`. If `xlsx` skill is available, render a real
  sheet; otherwise a markdown table with every formula shown.

- **`04-moat-and-defensibility.md`** — for each proprietary agent/automation in
  `artifacts.json`: (a) the data loop — signal captured, store, feedback path,
  cycles accrued; (b) the switching cost — how deep it is embedded in the workflow;
  (c) replicate-time — argued from loop age + integration depth, not asserted.
  Then the AI-specific defenses diligence will demand: model-provider redundancy,
  gross-margin sensitivity under a provider price shock, human-authority line (§5).
  Critique with `advisor-christensen` (job/switch) + `advisor-kim-mauborgne` (axis).

- **`05-data-room-index.md`** — the 8-category diligence checklist (corporate,
  financial, legal, IP, team, product/tech, cap table, tax; §6) mapped to
  what this build can already fill vs. what Ian/the founder must supply. This is the
  bridge to a real raise — it tells the founder exactly what is still missing.

- **`evidence/`** — a copy or symlink of every artifact a number points to, so a
  diligence reader can trace any claim to its source in one hop.

---

## Gate 4 — green criteria

Gate 4 writes `.protocol/gates/gate-4.json`. It is green ONLY when:

1. **`investor-package/` exists** and contains all six numbered files above
   (`00`–`05`) plus a populated `evidence/` directory (an empty file is a RED — the
   file must resolve its section against real artifacts; an empty `evidence/` is a RED
   because no number can then trace to source).
2. **The rubric has zero RED cells** — every criterion carries a real number or an
   artifact path, none carries an adjective, and none is `NO-SOURCE`.
3. **Every number traces to `evidence/`** — pick any figure in the dashboard or the
   economics model and it links to a source artifact in one hop. A number with no
   traceable source is treated as a RED cell.
4. **All seven advisor lenses have been run** over the filled rubric and their
   verdicts recorded; a lens that killed a criterion means that criterion is not
   green until fixed.
5. **The thesis is one sentence** and every bracket in it is backed by a GREEN cell.
6. **G3 is green** on 100% of registered artifacts (Gate 4 refuses to open on an
   unhardened build — an investor package around insecure ops is a discount magnet).

While the rubric is on the draft thresholds, gate-4.json also carries a
`rubricStatus: "DRAFT"` flag and the package prints the `DRAFT-RUBRIC` banner. The
gate can go GREEN structurally on the draft rubric, but the SHIP annex must show the
banner until Ian's docs finalize the bars — a draft-green is honest about being draft.

---

## AWAITING IAN'S DOCS

This pillar is a **scaffold**. The following are placeholders until Ian supplies his
own investor documentation, and each is explicitly marked in the files above:

1. **Rubric thresholds & weights.** The draft bars (LTV:CAC ≥3:1, GM ≥70%, payback
   ≤12mo, etc.) come from 2026 public benchmarks, not Ian's deal book. Ian's docs
   finalize: the actual pass bar per criterion, the relative weights, and any
   criterion he adds/removes (e.g. a Slovenia/EU-specific market criterion, an
   AIS-house "AI-involvement score" criterion).
2. **The house thesis template.** The `00-thesis.md` format is a first draft. Ian's
   positioning of AIS-built companies (what category, what "why now") replaces it.
3. **The data-room standard AIS ships.** `05-data-room-index.md` uses the generic
   8-category checklist. Ian's docs may prescribe an AIS-branded data-room template
   and which documents AIS produces vs. the founder supplies.
4. **Stage calibration.** Bars differ pre-seed vs. seed vs. Series A (§1, §3). Ian's
   docs set which stage AIS packages target by default and how the rubric flexes.
5. **The pricing/valuation link.** Whether and how the investor package feeds AIS's
   own pricing of the engagement (`client-pricing-sheet`) — a value-capture decision
   only Ian makes.

When Ian's docs arrive: replace the DRAFT bars in the rubric, remove the
`DRAFT-RUBRIC` banner and `rubricStatus` flag, update
`knowledge/investor-criteria-research.md` with any Ian-specific criteria, and
regenerate the knowledge PDF via `make-pdf`.

---

## Reuse map (compose before you build)

| Need | Reuse |
|---|---|
| Unit economics model | `enotna-ekonomika` |
| Price the value created | `vrednostno-cenovanje` |
| Recurring/expansion mechanics | `revops` |
| Category + one-line positioning | `pozicioniranje` |
| Market/TAM bottoms-up | `niche-research`, `competitor-profiling` |
| Adversarial rubric review | `advisor-skok`, `advisor-campbell`, `advisor-hormozi`, `advisor-christensen`, `advisor-dunford`, `advisor-kim-mauborgne`, `advisor-marks` |
| Security-posture evidence | pillar ⑤ G3 output, `cso` |
| Render the knowledge/package to PDF | `make-pdf` |

Compose these. Do not re-derive an economics engine or a positioning framework by
hand — they are bundled for exactly this pillar.
