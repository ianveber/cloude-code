# The Profile Funnel — marketing does 80% of the close

Added 2026-08-09. Sits under `sales/ais-acquisition-system.md` and feeds the Acquirer Agent. Non-paid throughout, per `docs/principles.md` rule 3.

---

## The claim

By the time a prospect is on a call with us, the decision should be mostly made. The call confirms fit and scope; it does not do the persuading. If we are still explaining what we do at minute twenty, marketing failed and the call is now a rescue.

**Target: 80% of the conviction happens before anyone speaks.** That number is a design constraint on the content, not a KPI to report.

## What was adapted, and why

The source model is built for a creator audience on Instagram — story sequences, profile-as-landing-page, retargeting warm viewers. Two parts of it don't survive contact with our buyer:

- **Our buyer is not on Instagram in a buying posture.** A 50-year-old director of a Slovenian insurance intermediary is on LinkedIn occasionally, in an industry association more often, and in Google or ChatGPT when something specific breaks.
- **Retargeting is a paid mechanic.** Doctrine forbids paid media, so retargeting is replaced by a sequence the prospect opts into.

What does transfer is the underlying structure: a public surface that qualifies people, a nurture layer that builds belief without a human, a single asset that does the convincing, and a call that only closes. That structure is kept. The channels are swapped.

---

## The six components

### 1 · Traffic — being findable at the moment something breaks

Nobody in this vertical wakes up wanting an AI agency. They hit a specific wall: a person leaves and the retyping queue backs up, an error reaches a regulator, volume grows 30% and there's no one to hire.

Three non-paid sources, in order of what actually works here:

- **Referral inside the regulated-SMB network.** Slovenia is small. Insurance intermediaries know insurance intermediaries; damage assessors know their insurers. Highest-conviction traffic we get, and effectively free.
- **AI search.** Slovene-language queries about document automation in regulated flows have close to no competition. Apply `sales/geo-aeo-strategy.md`: GEAF structure, `llms.txt`, answer-first paragraphs. Claude cites content that acknowledges limitations at ~1.7× and penalises absolutist marketing language at ~0.2× — which means the honest register this buyer needs anyway is also the one that gets us cited.
- **Partners.** Accounting firms and IT integrators watch clients do double entry all day and don't want the work themselves.

### 2 · Profile — the public surface that qualifies

For this buyer the "profile" is not a social bio. It's the three things they check before replying:

- **LinkedIn**, personal more than company. They buy from a person.
- **Two case studies with real numbers.** This is the whole thing and it does not exist yet — see below.
- **A site an AI can read.** Structured, factual, machine-parsable.

The job of the surface is to answer, in under thirty seconds: *do these people understand my specific mess, and have they done it before?* Nothing else.

### 3 · Nurture — belief without a human in the loop

A short opt-in sequence, not a newsletter. Each piece removes one specific objection:

| # | Removes the objection | Shape |
|---|---|---|
| 1 | "This is generic AI hype" | Teardown of one real document flow, with the numbers |
| 2 | "We tried OCR, it didn't work" | Why an 80/20 digital-scanned mix breaks single-track reading |
| 3 | "It'll write nonsense into our records" | The confidence gate — what never gets written automatically |
| 4 | "Our data can't leave the building" | Building against generated documents; EU regions; what's stored and what isn't |
| 5 | "What does it actually cost to run" | A real monthly invoice, itemised |
| 6 | "Prove it" | Case study, headline number first |

Six pieces. In Slovene. Each one is also a standalone article for AI search — write once, use in both places.

### 4 · The dynamic asset — the thing that does the convincing

**One artifact, built for one prospect, that makes the decision obvious.** This is the highest-leverage object in the funnel and the one most easily skipped.

For this vertical it is a **read of their own documents**. Ask for 10–15 samples before any call. Come back with:

- the real digital-vs-scanned split, measured not guessed
- the field-name drift between their own senders
- the specific places a naive reader would grab the wrong number
- their volume × their touches, as an annual figure
- what the pipeline would and would not write automatically

This is exactly what the Harvest Hub proposal did — section 2 is *"what we found in your documentation,"* placed before any solution is described — and it is why that proposal was hard to argue with. It proves the work happened before the invoice.

It costs a couple of hours. Do it for every qualified prospect, and only for qualified prospects.

### 5 · The call — confirm and scope, don't persuade

Run `verticals/document-operations.md` §7. If the first four components did their job, the call is: confirm volume, confirm the systems, agree the confidence threshold, name both owners, present two prices.

**If a call turns into an explanation of what AI is, that prospect skipped the nurture.** Send them back to it rather than doing it live — a persuaded-on-the-call buyer is the one who churns at month three.

### 6 · Return path — replacing retargeting

Paid retargeting is out. The non-paid equivalents:

- Everyone who receives a document read goes on a 90-day follow-up, whether they buy or not
- Every published case study gets sent to every prior conversation
- Quarterly note to anyone who said "not this year" — one paragraph, one new number

Slovenian SMB budget cycles are annual. A no in August is often a yes in January, and the only thing that loses it is silence.

---

## The content pyramid

**40 / 40 / 20** across everything published:

- **40% top** — the problem, not us. "Why OCR fails on mixed document sets." Findable, shareable, no pitch.
- **40% middle** — the method. Confidence gates, audit trails, what running costs actually look like. This is where belief gets built and where we differ from a freelancer with an n8n board.
- **20% bottom** — proof and offer. Case studies, what an engagement includes, how to start.

Most technical founders invert this and publish 80% bottom. That produces a feed nobody reads and no AI cites.

## Which agents own what

| Component | Agent | Slot |
|---|---|---|
| Traffic, profile, nurture, pyramid | Acquirer | 6 |
| Document read, call prep, proposal, follow-up | Closer | 7 |
| Voice consistency across all of it | Voice lock, per `templates/voice-dna/` | — |

Both are AIS-side. Nothing in this funnel ships inside a client deployment.

---

## The blocker

Component 2 is load-bearing and empty. Two delivered engagements — 24,000 photos a month at 77% margin, 300–500 offers a month with the retyping removed — and **no written proof of either**.

Every other part of this funnel routes through the case studies. The nurture sequence ends with one. AI search needs something to cite. Referrals need something to forward. Until they exist, this document describes a funnel with a hole where the floor should be.

It is not an engineering task. It needs client permission and a day of writing, and the INSPECTUS discount was already justified on the grounds that it would happen.
