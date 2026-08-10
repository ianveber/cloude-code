# Pillar ④ — Investor-Readiness · RUNBOOK

Operator-facing, do-this-exactly procedure for G4. This pillar is **operator-heavy
synthesis on top of client-provided numbers.** The engine translates the ②③⑤ build
log into an investor package; the three things it cannot manufacture are: the client's
**real financials/metrics**, the client's **story/positioning inputs**, and **Ian's
investor-rubric weighting**. Everything below turns those manual moments into numbered
steps.

Read first: `pillars/4-investor/SKILL.md` (the method, the rubric, the package shape)
and `PROTOCOL.md` (gate discipline). G4 refuses to open until **G3 is green on 100% of
registered artifacts** — confirm that before starting.

---

## 1. Hands-free vs not

| Fully automated (engine) | AIS operator (synthesis) | Client (numbers / decisions) |
|---|---|---|
| Read `.protocol/artifacts.json` + pillar-② scan/blueprint, extract per-agent loops & throughput deltas | Fill the DRAFT rubric — one number/artifact per cell, zero adjectives | Supply real financials: revenue/ARR, COGS, headcount, CAC, cash/burn |
| Read pillar-⑤ `gate-3.json` set → security-posture evidence | Model unit economics from client numbers + scan baseline `-> invoke enotna-ekonomika` | Supply operating metrics: throughput/volume, error rates, retention/churn |
| Pull baseline (hours/errors per process) from `company-scan.json` | Run the 7 advisor lenses adversarially over the filled rubric | Provide story inputs: ICP, category, competitors, "why now" |
| Assemble `investor-package/` skeleton (`00`–`05` + `evidence/`) | Write thesis + positioning + architecture narrative | Approve the DRAFT-RUBRIC framing before it goes in a deck |
| Copy every cited artifact into `evidence/` and check one-hop traceability | Render package to PDF/PPTX/XLSX `-> invoke make-pdf` | Sign off which stage/geography column applies (seed vs A, EU) |
| Write `gate-4.json` (green only if rubric has 0 RED + all lenses run) | Apply **Ian's** rubric weights/house bars (the only rubric input that is not researched) | Confirm data-room documents AIS may reference vs. must be supplied |

---

## 2. Operator runbook

Run in order. Each step names WHO and ends with the skill to invoke.

**2.1 — Gate pre-check (G3 dependency).** Read every `gate-3.json` under the run's
`.protocol/`. If any registered artifact in `artifacts.json` lacks a green gate-3,
STOP: G4 cannot open on an unhardened build. Log the missing artifact and return to
pillar ⑤. `-> invoke cso`

**2.2 — Send the client data request.** Before any synthesis, dispatch the "What we
need from you" checklist (§4) to the client. Do NOT estimate financials the client can
give you — a guessed CAC is a RED cell, not a shortcut. Generate/format the request
`-> invoke web-intake`

**2.3 — Extract the build log (automated read).** Parse `.protocol/artifacts.json`,
`company-scan.json`, `blueprint.json`, and the pillar-⑤ `gate-3.json` set. Produce a
working table: per artifact = {built-by, data-loop signal/store/feedback/cycles,
baseline hours-or-errors, post-build throughput, security status}. This is the raw
material for criteria 1, 5, 6, 7, 8. `-> invoke revops`

**2.4 — Model the unit economics (criterion 4).** Feed the client's numbers (§4) plus
the scan baseline into the money model: LTV:CAC, CAC payback, gross margin, and
**revenue-per-employee**. Show the **margin-expansion path** (caching, distilled
models, routing, human-in-loop volume control) — do NOT assert a SaaS-grade 75%+
margin; AI-native GM is 45–65%. Render baseline→post-build. `-> invoke enotna-ekonomika`

**2.5 — Price the value created.** Quantify the cost-taken-out + throughput-added as
value delivered, so the economics reads as margin lift, not just savings. Cross-model
with recurring/expansion mechanics. `-> invoke vrednostno-cenovanje` then `-> invoke revops`

**2.6 — Size the market (criterion 2).** Build TAM/SAM/SOM with a **bottoms-up**
derivation (not top-down %). Default EU column for AIS engagements. `-> invoke niche-research`
then `-> invoke competitor-profiling`

**2.7 — Fix the category + one-line positioning (thesis + criterion 2).** Draft the
thesis in the SKILL format: *"[Company] is the [category] that runs [core operation]
with AI at [proof metric], which no incumbent can match because [moat loop]."* Every
bracket must resolve to a GREEN rubric cell. `-> invoke pozicioniranje`

**2.8 — Fill the DRAFT rubric (all 8 criteria).** For each criterion, open the source
artifact, read the actual value, write the **number or artifact path** into the cell.
Missing/empty artifact → **RED** + log which build step must produce it. Never write an
adjective; never write `NO-SOURCE` as if it were green. Apply the stage/geography
column (§ SKILL). `-> invoke enotna-ekonomika`

**2.9 — Run the advisor review board (adversarial).** Run each lens as a critique pass
over the *filled* rubric; record each verdict in the rubric evidence file. A criterion
survives only if it survives its lens.
- Unit economics (CAC/LTV honesty) `-> invoke advisor-skok`
- Value metric + expansion revenue `-> invoke advisor-campbell`
- Traction / offer / real demand `-> invoke advisor-hormozi`
- Moat: job-to-be-done + compelled switch `-> invoke advisor-christensen`
- Market: can the company win this category `-> invoke advisor-dunford`
- Uncontested-axis vs head-on competition `-> invoke advisor-kim-mauborgne`
- Second-level: what does the market already price in `-> invoke advisor-marks`

**2.10 — Write the moat + defensibility file.** For each proprietary agent: (a) data
loop — signal captured, store, feedback path, cycles accrued; (b) switching cost —
embed depth in the workflow; (c) replicate-time — argued from loop age + integration
depth. Add model-provider redundancy + margin sensitivity under a provider price
shock + the human-authority line from ⑤. `-> invoke advisor-christensen`

**2.11 — Write the architecture narrative.** Re-narrate the pillar-② blueprint as an
investor moat story with an ASCII operating-map diagram (reuse the INFRASTRUCTURE-
REPORT map). Message: *a built system, not a plan.* `-> invoke pozicioniranje`

**2.12 — Build the data-room index (criterion bridge to a real raise).** Map the
8-category diligence checklist (corporate, financial, legal, IP, team, product/tech,
cap table, tax) to what this build fills vs. what the founder must supply. `-> invoke revops`

**2.13 — Assemble `evidence/`.** Copy or symlink every artifact a number points to
into `.protocol/investor-package/evidence/`. Verify one-hop traceability: pick any
figure in `01`/`03` and confirm it links to a source file. `-> invoke verification-before-completion`

**2.14 — Render the package.** Produce the client-facing deliverables from the six
markdown files: the metrics dashboard + moat narrative as PDF, the economics as a real
sheet, the thesis/architecture as a deck. Keep the `DRAFT-RUBRIC` banner until Ian's
docs land.
- PDF of thesis/dashboard/moat/data-room `-> invoke make-pdf`
- Economics sheet `-> invoke xlsx`
- Investor deck `-> invoke pptx`

**2.15 — Write gate-4.json.** Green ONLY when: package has all six files + populated
`evidence/`; rubric has zero RED and zero `NO-SOURCE`; every number traces to
`evidence/` in one hop; all 7 lenses run + recorded; thesis is one sentence with every
bracket GREEN; G3 green on 100% of artifacts. Carry `rubricStatus: "DRAFT"` until Ian's
docs finalize the bars. `-> invoke verification-before-completion`

---

## 3. Client actions

Plain-language. A non-technical owner can do each of these. Nothing here touches live
systems — this pillar reads numbers, it does not act on money.

**3.1 — Send us your financials.** Export the last 12 months (or since inception) into
one spreadsheet: monthly revenue, cost of goods/service (including any AI/cloud bills),
total operating costs, cash in the bank, and monthly burn. In your accounting tool
(e.g. QuickBooks, Xero, or your bookkeeper's report): **Reports → Profit & Loss →
export to Excel/CSV**, and **Balance Sheet → export** for the cash figure. Attach both.

**3.2 — Send us your operating metrics.** A short list is fine: how many
units/orders/tickets/clients you handle per month (throughput), your error/rework rate
if you track it, and your customer retention or churn (how many customers you keep vs.
lose per year). If it lives in a CRM or a sheet, just export or screenshot it.

**3.3 — Send us your customer-acquisition numbers.** Two figures: what you spend to get
one new customer (marketing/sales cost ÷ new customers), and what an average customer is
worth to you over their lifetime (or their monthly spend + how long they stay). Rough is
fine — mark it as an estimate and we will flag it as one.

**3.4 — Answer five story questions** (2–3 sentences each, voice note is fine):
1. Who exactly is your ideal customer, and what do they do today instead of you?
2. What category would you say you are in — in one phrase?
3. Who are your three closest competitors, and why do customers pick you over them?
4. Why is *now* the right time for this to exist?
5. What is the one thing about how you run that a competitor could not copy quickly?

**3.5 — Grant read-only access to numbers, if you'd rather we pull them ourselves.**
Choose ONE, your call:
- *Google Sheet:* open the sheet → **Share** (top-right) → paste the AIS operator email
  → set to **Viewer** → **Send**. Read-only OAuth scope used:
  `https://www.googleapis.com/auth/spreadsheets.readonly`.
- *Google Drive folder of exports:* right-click the folder → **Share** → add the AIS
  email as **Viewer**. Scope: `https://www.googleapis.com/auth/drive.readonly`.
- *Nothing shared:* just email the exported files. This is the default and totally fine.

**3.6 — Approve the "draft grade" framing.** The investor score you receive first is on
**draft benchmark thresholds** (industry primary-source numbers, not a specific
investor's terms). It carries a visible **DRAFT-RUBRIC** banner. Confirm you're OK
presenting it that way; the banner comes off only once final house thresholds are set.

**3.7 — Pick your stage.** Tell us whether you're raising **pre-seed/seed** or **Series
A** (or not raising yet). We score you against that column — a seed company is not held
to Series-A efficiency. If unsure, say so and we'll recommend one.

**3.8 — Confirm the data-room list.** We'll send an 8-part diligence checklist (§5).
Mark which documents already exist, which you can produce, and which you don't have yet.
No document leaves your side without your say-so.

---

## 4. What we need from you (checklist AIS sends the client)

```
INVESTOR-READINESS — data request  (Pillar ④)

FINANCIALS (export from your accounting tool → Excel/CSV)
  [ ] Profit & Loss, last 12 months (monthly): revenue, COGS incl. AI/cloud, opex
  [ ] Balance sheet snapshot: cash in bank
  [ ] Monthly burn (or we derive it from the P&L)
  [ ] ARR / MRR if subscription — and your net revenue retention if you track it

OPERATING METRICS
  [ ] Monthly throughput (units / orders / tickets / clients handled)
  [ ] Error or rework rate, if tracked
  [ ] Customer retention or churn (yearly)
  [ ] Headcount today (and roughly 12 months ago)

ACQUISITION
  [ ] Cost to acquire one customer (CAC) — estimate OK, mark it
  [ ] Customer lifetime value or (avg monthly spend × avg months retained)

STORY (2–3 sentences each — voice note fine)
  [ ] Ideal customer + what they do instead of you today
  [ ] Your category, in one phrase
  [ ] Top 3 competitors + why customers pick you
  [ ] Why now
  [ ] The one thing a competitor couldn't copy quickly

DECISIONS
  [ ] Stage you're raising at: pre-seed / seed / Series A / not yet
  [ ] OK to present the first score with a DRAFT-RUBRIC banner? (Y/N)
  [ ] Access preference: share a read-only Sheet/Drive folder, or email exports

ACCESS (only if you chose to share, not email)
  [ ] Google Sheet or Drive folder shared as Viewer with <AIS operator email>
```

---

## 5. Gate evidence

This pillar writes `.protocol/gates/gate-4.json` in the engagement root and populates
`.protocol/investor-package/`. The gate turns green only on the six conditions in the
SKILL. Evidence written:

- **`.protocol/investor-package/`** — `00-thesis.md`, `01-metrics-dashboard.md`,
  `02-architecture-narrative.md`, `03-unit-economics.(xlsx|md)`,
  `04-moat-and-defensibility.md`, `05-data-room-index.md`, and a populated `evidence/`.
- **`.protocol/investor-package/evidence/`** — a copy/symlink of every artifact a number
  points to, so any figure traces to source in one hop (empty `evidence/` = RED).
- **`.protocol/gates/gate-4.json`** — the gate record. Shape (mirrors the pillar-⑤
  gate-3.json convention):

```json
{
  "gate": 4,
  "pillar": "4-investor",
  "ranAt": "<ISO-8601>",
  "reviewer": "AIS operator + 7 advisor lenses (adversarial rubric review)",
  "rubricStatus": "DRAFT",
  "g3Dependency": "green on 100% of registered artifacts (checked)",
  "rubric": {
    "1-team": "green — <named operators> + built system (artifacts.json built-by)",
    "2-market": "green|amber|red — <TAM/SAM/SOM path> (pozicioniranje/niche-research)",
    "3-traction": "green|amber|red — <hard metric> (metrics dashboard)",
    "4-unit-economics": "green|amber|red — LTV:CAC <x.x>, payback <n>mo, GM <n>% (enotna-ekonomika)",
    "5-moat": "green|amber|red — <n> agent(s) with described loop (artifacts.json)",
    "6-scalability": "green|amber|red — <process> flat-headcount volume (blueprint)",
    "7-ai-defensibility": "green|amber|red — replicate-time from loop age + integration",
    "8-security-posture": "green|amber|red — G3 green on <n>/<n> artifacts (gate-3.json set)"
  },
  "advisorLenses": {
    "advisor-skok": "verdict + note",
    "advisor-campbell": "verdict + note",
    "advisor-hormozi": "verdict + note",
    "advisor-christensen": "verdict + note",
    "advisor-dunford": "verdict + note",
    "advisor-kim-mauborgne": "verdict + note",
    "advisor-marks": "verdict + note"
  },
  "thesis": "<one sentence, every bracket backed by a GREEN cell>",
  "traceability": "pass — every figure in 01/03 links to evidence/ in one hop",
  "result": "green|red",
  "residual": "<non-blocking notes, e.g. draft bars pending Ian's house weights>"
}
```

Green rule: **any RED criterion → `result` is red** (no weighted average hides a RED).
`rubricStatus` stays `"DRAFT"` and the package prints the `DRAFT-RUBRIC` banner until
Ian's investor docs finalize the house weights, target stage, and any AIS-specific
criteria — at which point regenerate the knowledge PDF `-> invoke make-pdf`.
