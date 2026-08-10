# {{CLIENT_NAME}}

Engagement working file. Created from `templates/client-onboarding-template.md`.
Structured metadata lives in `client.json` — the dashboard reads that, not this file. Keep the two in step.

---

## 1 · The work we're taking over

**In one sentence:** _What a person does today, by hand, that stops being done by hand._

- Trigger — what arrives, and where
- Steps — what the person does, in order
- Output — which system of record it lands in
- Volume — per month, with a number the client gave us
- Who does it now, and what else that person is supposed to be doing

> If the volume is a guess rather than the client's own figure, the discovery isn't finished.

## 2 · Named owners

| Side | Name | Answers for |
|---|---|---|
| AIS | | Build, escalation, retraining |
| Client | | Reviewing the queue, setting the confidence threshold, signing off go-live |

**Nothing ships without both names filled in.** `docs/principles.md` rule 2.

## 3 · Discovery findings

Run `delivery/discovery-script.md`, and the vertical-specific version in
`verticals/document-operations.md` §7 if this is a document engagement.

- **Sample documents received:** _how many, which types_
- **Digital vs scanned split:** _measured from the samples, not asked_
- **Field-name drift:** _the same thing labelled differently by different senders_
- **Values that move around the page:**
- **The checks the person runs today:** _which are written down, which live in their head_
- **What happens when a value goes in wrong:** _who finds out, and when_
- **Personal data:** _what's in there, where it's allowed to live_
- **Prior attempts:** _what they already tried, and why it failed_

## 4 · The three pillars

**Bounded** — can an agent stack own this end to end? Write the flow on one page. If any step loops back to "depends on the client," it isn't bounded yet.

**Authoritative** — who else has to be in the room to sign? Anything beyond "nobody" extends the cycle past where this model works.

**Encoded** — could a remote operator who never meets them do this? If not, agents can't either.

## 5 · Agent stack

| Slot | Agent | What it owns here | Human owner |
|---|---|---|---|
| 1 | Intake | | |
| 2 | Extractor | | |
| 3 | Validator | | |
| 4 | Operator | | |
| 5 | Knowledge | | |

**Confidence gate:** anything below _[threshold]_ never writes automatically — it queues for review.
The client sets the threshold. Show them the false-accept and false-reject rate at each setting, measured on the practice corpus, and let them choose.

**Model routing:** classify cheap, extract expensive, and only on what survived classification.
Write the routing down here before the build starts. On INSPECTUS this was the difference between €60 and €181 a month.

## 6 · Practice run — before any real record

Per `delivery/synthetic-data.md`. Lives in `synthetic/`.

- [ ] 200–500 generated documents covering every type in scope
- [ ] Real digital/scanned ratio, then again at 50/50
- [ ] Slovenian formatting throughout — comma decimals, DDV, diacritics
- [ ] 50–100 hand-written awkward cases
- [ ] ≥95% correct **per field**, not averaged
- [ ] Every edge case gives a right answer or an explicit "couldn't read this"
- [ ] A blank field and a failed read are distinguishable downstream
- [ ] Threshold chosen, with its error rates written down and shown to the client

## 7 · Four weeks to live

| Week | Mode | Passed on |
|---|---|---|
| 1 | Watching only — reads everything, writes nothing | |
| 2 | Drafting — every output reviewed and graded Strong / OK / Weak | |
| 3 | Live inside the company — low-risk surfaces only | |
| 4 | Live with their customers | |

Never compress this. `docs/principles.md` rule 7.

## 8 · Money

| | Amount | Note |
|---|---|---|
| One-off fee | | |
| Monthly | | |
| Our cost to run | | Stated to the client as its own line |
| We keep | | Below 55% is a problem — see §6 of the vertical playbook |
| Build hours | | Fee ÷ hours. Under €60/hr means we mispriced. |

## 9 · Go-live checklist

- [ ] Deployed to the **real** target environment during build, not at handoff
- [ ] Confirmed which URL the client actually uses (`vercel alias ls`)
- [ ] Data region correct for EU personal data
- [ ] Model output not landing in logs
- [ ] Every check has a distinct "couldn't check" outcome — never a silent pass
- [ ] Audit trail records enough to reconstruct one document six months later
- [ ] Runbook written: what breaks, how to escalate, who owns what
- [ ] Handover session recorded

## 10 · The commercial act

_The one small non-engineering thing this engagement is actually blocked on._

| What | Owner | Date |
|---|---|---|
| | | |

Put this first in the sequence. Every stalled engagement in this repo is stalled on a signature, a price, or a deploy — not on code.

## 11 · Case study

- [ ] Permission asked while the result is still fresh
- [ ] Headline number agreed
- [ ] Written up against `sales/case-study-template.md`

A reference-customer discount that never produces a case study is just a discount.

---

## Log

| Date | What happened |
|---|---|
| | |
