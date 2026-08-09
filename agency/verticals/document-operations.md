# Vertical Playbook — Document & Data Operations

Added 2026-08-09. Status: **Live, two engagements delivered.** This is the only vertical in the roster that was validated before it was written down — the playbook is reverse-engineered from INSPECTUS and Harvest Hub, not projected forward.

---

## Section 1 — Vertical name + one-line tagline

**Document & Data Operations — Slovenian regulated SMBs.**

> The work arrives as a document. A person retypes it into two systems. We replace the person's hands, not their judgment.

**The front-door filter is "repetitive work."** That phrase is how prospects self-identify and how we qualify inbound — nobody describes their business as "document operations," but every owner can tell you which task their staff does two hundred times a month. The filter gets them in the room. This playbook is what we actually sell once they're there.

A word on why the filter is not the vertical. `docs/positioning.md` argues that horizontal AI positioning compresses to commodity inside 18 months, and `docs/principles.md` rule 4 says verticals are picked, not accepted. "We automate repetitive work" is a horizontal claim — it competes with every n8n consultant, every Make.com freelancer, and eventually with the client's own IT person and a Claude subscription. "We rebuild the document intake path for Slovenian insurance intermediaries, and here is a live one" is a vertical claim, and it is defensible because the second one costs us 40% of what the first one cost.

---

## Section 2 — Why we picked this vertical

We didn't pick it. We noticed we were already in it.

Two engagements were sold, built, and shipped before anyone wrote a playbook:

| | **INSPECTUS** | **Harvest Hub** |
|---|---|---|
| Business | Vehicle damage assessment | Insurance intermediary (Merkur) |
| The repetitive work | ~24,000 vehicle photos/month need sorting; ~800 VIN plates need reading | 300–500 offers/month × ~7 documents, each retyped into **two** systems by hand |
| What we built | Smart classification filter (Haiku 4.5) + VIN reading (Opus 5) + VLDR builder + dashboard | PRENOS ZERO — email intake, dual-track PDF reading, validation, write-through to eDOKUMENTE + Zavarovalniški program, audit trail |
| Build fee | €14,900 | €8,900 (Solution 1) / €12,000 (Solution 2) |
| Recurring | €590/mo (≤4 ships) + €227/mo existing = €817/mo | Client-owned runtime, ~€80–110/mo their cost |
| Our run cost | €134/mo yr 1 → €164/mo yr 2 | n/a (client pays own) |
| Gross contribution | **77% yr 1, 72% yr 2** | Build-only |
| Status | Live | 14-day hosted trial live, Aneks 1 unsigned |

Two independent businesses, two industries, one shape. That's the pattern signal `_selection-framework.md` step 1 asks for, arriving from delivery rather than from inbound.

### The four-axis test, run honestly

**Axis 1 — Function-bounded. PASS, strongly.** Harvest Hub's function fits on one page: email arrives → extract metadata from PDFs → run prescribed checks → write to system A → write to system B → log every step → route anything uncertain to a human. Named inputs and outputs at every step, no loops back to "depends on the client." This is the most bounded function in the entire roster — more bounded than specialty legal intake.

**Axis 2 — Buyer-authoritative. PASS.** Both buyers are owner-operators who decided inside the room. Slovenian SMBs in the €1M–€20M band have no procurement function; the person feeling the pain is the person signing.

**Axis 3 — Work-encoded. PASS, definitionally.** The input *is* a document. There is no embodied component. If the work can be done by a remote operator who never meets the client, it's encoded — and the work is currently being done by someone staring at a PDF.

**Axis 4 — Margin-viable. PASS at the retainer model, MARGINAL at build-only.** INSPECTUS clears 77% on the retainer. But the build fee tells a different story: €14,900 against 250–320 development hours is **€47–60/hour effective**, and the internal economics note says the analysis recommended €19,700. That's not a healthy build fee, it's a reference-customer discount that was never labelled as one. See Section 6.

### The kill-list check

Clean on five of six. Nobody in this vertical expects an ad agency, ICP sits above €1M, regulation is single-jurisdiction Slovenian, buyers want the operator involved, and the tooling is open enough to integrate.

The sixth needs watching: **vendor lock-in.** Harvest Hub writes into eDOKUMENTE and a Zavarovalniški program. Both are closed Slovenian systems. We got in, but we should assume the next one might not have an API, and price discovery accordingly.

---

## Section 3 — ICP signals

### Firmographic

- Slovenian, 10–150 employees, €1M–€20M revenue
- Operates in a regulated flow: insurance, vehicle assessment, property management, logistics customs, accounting, healthcare admin
- **At least one full-time-equivalent of staff time going into retyping**
- Owner-operator or a director with signing authority
- Already paying for the systems the data must land in — they are not shopping for new software, they are shopping for the pipe between the software they already bought

### Behavioural — the qualifying signals that actually predict a close

1. **They can state the volume.** "300 to 500 offers a month, about seven documents each." A prospect who can't quantify the repetition hasn't felt it enough to pay for it.
2. **The data is typed twice.** Double entry is the single highest-signal tell in this vertical. It means two systems exist, neither talks to the other, and a human is the integration layer. Harvest Hub is the archetype.
3. **There is an audit or compliance reason the work can't just be dropped.** This is what stops the buyer solving it by lowering their standards. Insurance, damage assessment, and property all have this. It's also why they'll pay for a logged, reviewable system rather than a script.
4. **Someone has already tried and failed with OCR.** They arrive believing the answer is OCR, discover their documents are 80% digitally generated and 20% scanned, and that a single-track approach fails on both. This is a gift — it pre-qualifies the buyer on why our approach costs more than a freelancer's.
5. **The pain has a name inside the company.** "The PRENOS process." Named processes are budgeted processes.

### Disqualifying signals

- Volume under ~100 documents/month — the arithmetic doesn't reach our price band, refer them to a template
- No system of record to write into (the output is "a folder," or worse, "an email to Janez")
- The documents are genuinely unstructured free text with no recurring schema
- Buyer wants the source code and no operate phase, with no reference or case-study consideration in exchange — see Section 9

---

## Section 4 — Pain map

**Surface complaint:** "My people waste their days retyping."

**What's underneath, in order of what they'll actually pay to fix:**

1. **Error exposure, not time.** Both clients led with time and closed on errors. Thousands of manual touches a year, each one able to carry a mistake into a regulated record. Time saved is a nice number in a proposal; a wrong premium figure written into an insurance system is a phone call from a regulator. **Sell the second one.**
2. **Key-person concentration.** One person knows the process. When they're sick, the queue stops. Owners feel this acutely and rarely say it out loud.
3. **The volume ceiling.** They can't take 30% more business without hiring, and the hire is expensive and hard to find for work this boring.
4. **No audit trail.** When something goes wrong today, reconstructing what happened means asking someone what they remember.

**What they do *not* have pain about, and where pitching wastes the meeting:** strategy, AI transformation, dashboards for their own sake, or anything described as an "AI roadmap." They have one broken pipe. Fix the pipe.

---

## Section 5 — Agent stack

The canonical roster in `agents/` is B2B-acquisition shaped. This vertical needs a different subset, and two of the slots are genuinely new. Deploy this configuration:

| Slot | Agent | Role in this vertical | Roster status |
|---|---|---|---|
| 1 | **Intake** | Watches the inbound channel (email, folder, API). Deduplicates, classifies document type, routes into the pipeline. Deterministic where possible — this is mostly Layer 3 automation with a classifier on top. | **New — spec needed** |
| 2 | **Extractor** | Reads the document. Dual-track by design: digital-native PDFs go down a text path, scanned pages go down a vision path. Emits structured fields with a per-field confidence score. | **New — spec needed** |
| 3 | **Validator** | Runs the client's prescribed business rules against the extracted fields. Owns the escalation threshold. **Anything below confidence never auto-writes** — it queues for human review. | **New — spec needed** |
| 4 | **Operator** | Writes into the client's systems of record. Handles retries, idempotency, and partial-failure recovery. | Exists — `agents/operator-agent.md`, needs a write-through variant |
| 5 | **Knowledge** | Holds the field mappings, the naming inconsistencies, the document-type schemas, the exceptions log. The unsexy spine. | Exists — `agents/knowledge-agent.md`, fits as-is |
| 6 | **Acquirer** | AIS-side. Non-paid: case studies, GEO/AEO, referrals inside the Slovenian regulated-SMB network. | Exists — `agents/acquirer-agent.md` |
| 7 | **Closer** | AIS-side. Discovery, sample-document analysis, proposal, follow-up. | Exists — `agents/closer-agent.md` |

**The two rejected slots.** The bootstrap prompt's roster included *Treatment Proposal* and *Compliance/Care*, which are aesthetic-medicine shapes with no meaning here, and *Referral Engine* and *Brand Voice*, which are client-facing marketing agents this vertical's buyers don't want. Dropped. Referral and brand-voice work stays on the AIS side of the line.

**Confidence-gated write-through is the architectural commitment of this vertical.** It is the sentence that closed Harvest Hub: *what is not read reliably is never written automatically.* It is also `docs/principles.md` rule 2 (no floating AI) expressed in code rather than in a policy document. Never soften it to win a deal on throughput.

### Model routing is a margin decision, not a technical one

INSPECTUS is the proof. Route all 24,000 monthly photos through Opus and AI cost is €181/month. Classify with Haiku first and send only the ~800 VIN plates to Opus, and it's €60/month. Same output, **€1,452/year difference on a single client.**

Standing rule for this vertical: **classify cheap, extract expensive, and only on what survived classification.** Model routing goes in the build checklist, not in a "future optimization" branch — the INSPECTUS optimization branch is still uncommitted while the subscription runs.

---

## Section 6 — Pricing band

Grounded in two real deals, then corrected for what those deals got wrong.

**Revised 2026-08-09.** The retainer column below was raised roughly 2.5× after the €1M arithmetic was run — see `ops/road-to-1m.md`. The original band (€350–600 / €600–1,200 / €800–1,500) was set from what INSPECTUS happened to be paying rather than from what the work is worth, and at that level recurring revenue can never carry the agency: €60K/mo of recurring would need 120–264 clients. Build fees moved only at the bottom end, where €12K was already identified below as underpriced.

| Engagement shape | Volume | Build fee | Operate retainer |
|---|---|---|---|
| Single document type, one target system | 100–500 docs/mo | €15K–€22K | €900–€1,400/mo |
| Multi-type, dual write-through (Harvest Hub shape) | 300–2,000 docs/mo | €18K–€28K | €1,400–€2,200/mo |
| High-volume media + extraction (INSPECTUS shape) | 10k+ items/mo | €20K–€32K | €1,800–€3,000/mo |

**The floor is anchored to the labour it replaces, not to what the last client paid.** These engagements remove ≥1 FTE of retyping; a Slovenian FTE costs €2,500–3,500/month fully loaded. €1,200/mo to remove €3,000/mo of labour returns 2.5× to the buyer and is still the cheapest line in their operations budget. INSPECTUS at €227/mo charges **7% of the labour it replaces** — that is the mispricing this table corrects. Existing contracts are grandfathered; every new quote uses this band.

### The two pricing corrections this vertical has already taught us

**1. Both reference deals were underpriced, and only one of them knew it.** INSPECTUS internal economics: recommended €19,700, sold at €14,900, effective €47–60/hour across 250–320 hours. The document names this a deliberate reference-customer decision, which is the right way to do it — `docs/pricing.md` allows up to 15% off for case-study rights, and this was more than 15%. **The discount is only defensible if the case study actually gets written.** It hasn't been. Until it is, that's €4,800 given away for nothing.

**2. Harvest Hub is sold build-only, which violates `docs/pricing.md`.** The client owns the source and pays their own ~€80–110/month runtime. `docs/pricing.md` is explicit: we never sell build without operate, because build-only produces a black box that decays in three months. Harvest Hub is now the live test of whether that doctrine is right. Two possible outcomes, and we should decide in advance which we'd accept:

- It decays, they come back, and the doctrine is confirmed — then re-sell with an operate phase.
- It runs fine unattended for a year, and the doctrine needs a documented exception for **narrow, single-path, client-owned deployments** where there's genuinely nothing to operate.

Do not quietly let the exception become the norm without writing it down. That's how an agent-systems company turns back into a dev shop.

**Decision date: 31 August 2027**, twelve months after the contract signs. Owner: Ian. Write the outcome into this section — one paragraph, either way. If the date passes with nothing written, the answer defaults to *doctrine holds, no exception*, because an unwritten exception is exactly the drift the paragraph above warns about.

**What the €1M plan adds to this.** Build-only revenue does not compound. A build-only engagement contributes its fee once and then contributes nothing, so the business restarts at zero every January and the delivery-hours constraint — the one AIS has least of — binds hardest. `ops/road-to-1m.md` shows the December 2027 target needs ~45 retained clients at ~€1,300/mo; each build-only sale is a client that never enters that count. **So even if the doctrine turns out to be wrong on quality grounds, build-only stays the exception on arithmetic grounds.** Price it as a premium when it happens (the client is buying the source and giving up the improvement loop), never as a discount.

**3. Price the runtime separately and visibly.** Both deals show run cost as a distinct, honest line — INSPECTUS €134/mo against a €590/mo subscription. Keep doing that. It survives scrutiny, it justifies the retainer arithmetically, and it makes the model-routing saving legible to the client as *our* engineering rather than *their* overpayment.

---

## Section 7 — Discovery script

Runs 45 minutes. **Ask for sample documents before the call, not after** — the Harvest Hub proposal opens by citing findings from all 15 sample PDFs, and that analysis is what made it unlosable.

**Open — quantify the repetition (10 min)**
1. Walk me through what happens from the moment [the document] arrives until the moment it's finished.
2. How many of those come in per month? How many documents in each one?
3. Who does this? Is it all of their job or part of it?
4. What happens when they're on holiday?

**Middle — find the double entry and the schema (15 min)**
5. Where does the data end up? Name every system.
6. Does anyone type the same value into more than one place?
7. Are these generated by a computer or scanned? Roughly what split? *(Expect them to guess wrong. Verify from the samples.)*
8. Do the field names change between senders? Do the same values ever move around the page?
9. What checks does the person do before they save it? Which of those are written down anywhere?

**Middle — find the compliance floor (10 min)**
10. What happens if a value goes in wrong? Who finds out, and when?
11. Do you need to be able to prove what happened to a specific document six months later?
12. Is there personal data in these? Where is it allowed to be stored?

**Close — authority and the decision (10 min)**
13. If we align on scope and price, who else needs to be in the room?
14. Have you tried to solve this before? What happened?
15. If this were running in eight weeks, what would you do with the time it frees up?

**Question 15 is the qualifier for the operate phase.** "Take on more work" means they'll renew. "Reduce headcount" is a one-time saving with no expansion path and a change-management problem the agent can't solve.

---

## Section 8 — Proposal anchor

The Harvest Hub proposal is the template. Its structure works and should be copied:

1. **Summary that states their current cost in their own numbers** — "several thousand manual touches a year, each one able to carry an error."
2. **"What we found in your documentation"** — the technical analysis of *their* actual samples, before any solution is described. This section does the selling. It proves we did work before being paid and it pre-empts the OCR objection with evidence from their own files.
3. **The one-line promise.** Harvest Hub's is *"Ponudba prispe. Vse ostalo se zgodi samo."* — the offer arrives, everything else happens by itself. Write one of these for every proposal.
4. **Architecture, in layers, in plain language.**
5. **Two solutions, priced.** Never one. Solution 2 at ~35% more is where the buyer lands and it makes Solution 1 feel like a decision rather than a quote.
6. **Explicit "what is not included."**
7. **Run cost stated honestly as a separate line.**
8. **Guarantees, assumptions, risks** — in writing, scoped narrowly. Note that the no-storage claim on Harvest Hub had to be scoped down after review; over-claiming in this section is the easiest way to lose a regulated buyer's trust.

Anchor sequence in the room: their volume → their error exposure → the confidence gate → the two prices.

---

## Section 9 — Failure modes

**Hosting exposes defects that cannot occur locally.** Harvest Hub's hosted trial surfaced four: a CSP violation cropping content, the wrong deployment region for EU data, model output leaking into logs, and a build script publishing the very thing it was supposed to guard. Every one of them is invisible on localhost. **Deploy to the real target environment during the build phase, not at handoff.**

**Green checks that did nothing.** The App Factory build found five of six bugs were false successes — code reporting success while doing no work. In a document pipeline this is the worst possible failure, because a validator that silently passes everything looks exactly like a validator that works. Every check needs a distinct "could not check" outcome separate from "checked and passed." (See `feedback_verify_dont_reconcile` — when two checks disagree, the one that found something is usually right.)

**The alias trap.** INSPECTUS cost a full day because the client was using `inspectus-filter-demo.vercel.app` while we were updating `inspectus-os.vercel.app` — the same Vercel project holding multiple aliases on different deployments. Run `vercel alias ls` and confirm the client's actual URL before every deploy.

**Model-routing optimization deferred past signature.** Already happened. The INSPECTUS cost-optimization branch is committed and undeployed while the subscription bills at the unoptimized rate. Finish routing before the contract starts, not after.

**Built and not launched.** The dominant pattern across this repo. INSPECTUS OS Phase 2 is built and stranded on an uncreated Supabase project; Harvest Hub's trial expires 17 August with Aneks 1 unsigned. Neither is blocked on engineering. **Every engagement plan in this vertical must put the commercial act — the signature, the price, the deploy — first in the sequence, with an owner and a date.**

**Scope creep from "while you're in there."** The client watching a document pipeline work will immediately ask for the next process. That's expansion revenue, not free scope. Route it to a change order.

---

## Section 10 — Kill criteria

Kill this vertical if, by **Q2 2027**, any of the following holds:

- Fewer than 4 engagements delivered. Two in a year is a pattern; two in two years is a coincidence.
- Blended contribution margin below 55% across delivered engagements.
- Build fees still landing under €60/hour effective after the third engagement — meaning we never learned to price it, and the compounding-reuse thesis is false.
- Client #3 takes as long to build as client #1. The whole economic argument is that shared extraction, validation, and mapping components make each engagement cheaper. If build time is flat, we're a dev shop with a good story.
- The confidence gate gets negotiated away in a deal to win on throughput. That's the point where the product stops being ours.

**The single metric that decides it: build hours for engagement N versus engagement 1.** Target ≤60% by engagement 4. Nothing else in this playbook matters if that number doesn't fall.

---

## Section 11 — Acquirer Agent specifics

Non-paid, per `docs/principles.md` rule 3.

**The case study is the whole acquisition strategy for this vertical, and it does not exist yet.** Two delivered engagements with hard numbers — 24,000 photos/month, 77% margin, 300–500 offers/month, thousands of manual touches removed — and zero written proof. `sales/case-study-template.md` has been sitting unused since May. This is the highest-leverage unbuilt asset in the repo, it was already assigned as an August task in the AIS Community plan, and it is not an engineering job.

**Channel priority:**

1. **Two written case studies** (INSPECTUS, Harvest Hub) — with client permission, in Slovene, numbers in.
2. **Referral inside the regulated-SMB network.** Insurance intermediaries know insurance intermediaries. Damage assessors know the insurers who commission them. This is a small country and the network is the channel.
3. **GEO/AEO in Slovene.** Near-zero competition for Slovene-language queries about document automation in regulated flows. Apply the `optimizing-for-ai-driven-search` findings: GEAF structure, `llms.txt`, and Claude's citation multipliers — 1.7× for acknowledging limitations, **0.2× for absolutist marketing language.** The honest, hedged, numbers-first register this vertical requires anyway is also the register that gets cited.
4. **Accounting firms and IT integrators as partners.** They see the double-entry problem constantly and don't want the work.

**Content angles that fit the buyer:** why OCR fails on an 80/20 digital-scanned mix · what a confidence gate is and why you want one · what an audit trail has to contain to survive a Slovenian regulator · the real monthly cost of running an AI document pipeline, with the invoice.

---

## Section 12 — Case study angle

**INSPECTUS** — "24,000 photos a month, and a person was sorting them." Headline number: model routing cut AI cost from €181 to €60/month without changing a single output. This one sells the engineering.

**Harvest Hub** — "The same numbers, typed twice, five hundred times a month." Headline: nothing uncertain is ever written automatically. This one sells the trust.

Both need client sign-off before publication. Ask for it while the relationship is warm and the result is fresh — Harvest Hub's is warm right now.

---

## Section 13 — Vertical-specific knowledge requirements

Things we must know that don't transfer from the other verticals:

- **Slovenian document conventions** — comma decimals, DDV handling, AJPES registry data, the shape of a Slovenian insurance policy
- **The closed systems** — eDOKUMENTE, Zavarovalniški programi, and whatever the next client already runs. Assume no API until proven otherwise; price discovery for it.
- **GDPR posture for document pipelines** — what may be stored, for how long, in which region, and how to make a no-storage claim that survives review rather than one that has to be walked back
- **Dual-track extraction** — when a page is digital text and when it's an image, and why one pipeline can't do both well
- **Per-field confidence scoring and threshold-setting** — the client sets the threshold; we make the cost of each setting legible
- **Idempotent write-through** — what happens when the write half-succeeds and the job is retried

---

## How this vertical relates to the others

It sits **beside** `slovenian-businesses.md`, not inside it. That playbook is a geography-and-language moat covering many functions. This one is a single function with proof, that happens to sell into the same geography. When they conflict, this one wins — it has revenue behind it.

It does **not** overlap `specialty-legal.md` or `b2b-saas-demand-gen.md`, both of which are acquisition-function playbooks. Those sell the front of the business. This one sells the back.
