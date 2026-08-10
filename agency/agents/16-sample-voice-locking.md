# 16-Sample Voice-Locking Protocol

The protocol that constrains agent outputs to a target voice (client's brand voice, named operator's writing style, firm's internal register). Below 16 samples, output reads as generic AI; at 16+ samples with this protocol, output reads as the target.

The threshold isn't arbitrary. Cross-vendor empirical work in 2024–2026 (referenced in the AI-native operating map and the founding-agency-of-cofounders' independent testing) converges on 16 as the lower bound for locking deterministic-ish voice on consumer-grade large language models. Below 16, prompts get too generic; above 16 with proper curation, the model's tendency toward neutral register gives way to the target voice.

This file documents the protocol AIS uses to collect, curate, store, apply, and refresh voice samples across all engagements.

---

## Why this matters

Voice is the difference between an agent that augments and an agent that embarrasses. A specialty legal firm's intake response that sounds chatbot-y damages the firm's reputation more than the time savings justify. A Slovenian aesthetic clinic's appointment reminder that uses the wrong register (vikanje vs tikanje) signals that the clinic doesn't care.

The 16-sample threshold is the difference between voice-aware deployment and voice theater. Voice theater is what most AI vendors ship — they call it "personalization" but the outputs all sound the same.

We treat the protocol as a hard gate. No external-facing deployment of voice-dependent outputs without 16+ curated samples in the index.

---

## What counts as a sample

Strict definition. Most "samples" submitted by clients in early conversations don't qualify.

### Pass

- A complete, real, in-context output by the target voice-owner. Not a fragment.
- Authentically written by the voice-owner (not ghostwritten by a generic copywriter, not template-generated, not AI-generated)
- Written in the register the deployment will use (e.g. customer-facing email if the deployment will write customer-facing emails — internal Slack messages don't count)
- Recent enough to reflect current voice (within 12 months for actively-evolving voices, within 24 months for stable voices)
- Substantive — long enough to capture sentence patterns, vocabulary choices, tonal range (typically 100+ words minimum; sub-50-word fragments are diagnostic but don't count)

### Fail (common false positives)

- Template emails the voice-owner sends but didn't write (CRM-generated, marketing-automation-generated)
- Brand marketing copy that was written by an outside copywriter or agency
- Press releases (committee-edited; doesn't reflect any individual's voice)
- Auto-generated content (newsletters built from automated content systems)
- Translated content (translation introduces register shifts)
- Old content (>24 months) that pre-dates the voice-owner's current style
- Single-paragraph fragments without surrounding context

### Edge cases

- **Ghostwritten content the voice-owner authentically signs off on:** counts as half-credit. Use sparingly, only when better samples aren't available.
- **Co-authored content (voice-owner + another author):** doesn't count — too noisy.
- **Content from before the voice-owner was in their current role:** counts if the voice is recognizably theirs and hasn't materially evolved.
- **Content in a language the deployment won't use:** doesn't count for that deployment. (Slovenian samples don't lock an English-language deployment, and vice versa.)

---

## Collection protocol

Collected during onboarding (build-phase weeks 1–2). If samples are thin, the protocol pivots to extraction interviews (see below).

### Standard collection

1. Onboarder Agent sends the voice-sample request as part of onboarding sequence. The request explains what counts (see above), what doesn't, and provides a structured upload mechanism.
2. Client-side voice-owner sources 16+ samples from their existing archive (sent emails, published articles, prior client communications, etc.). Submits via the upload mechanism.
3. AIS-side reviewer (Ian or Anej, depending on engagement) validates each sample against the pass/fail criteria.
4. Valid samples go into the Knowledge Agent's voice index. Invalid samples are returned with reasoning.
5. If valid count < 16: extension protocol fires (see below).

### Extension protocol — when samples are thin

Most engagements have at least 16 valid samples available. When they don't, the cause is usually one of:

- Voice-owner doesn't have a large archive (e.g. early-career partner, brand new clinic)
- Voice-owner's existing communications are mostly templated (e.g. clinic using SaaS templates for appointment reminders)
- Voice-owner's existing communications are mostly verbal (e.g. consultant who sells via meetings, hardly writes)

In any of these cases: pivot to voice-extraction interviews.

#### Voice-extraction interviews

- Schedule 2–3 hours of recorded conversation with the voice-owner
- Topics chosen to mimic the contexts the deployed agent will operate in (e.g. "tell me how you'd respond to a new client asking X" or "describe what you'd want to say to a client whose treatment didn't go as expected")
- Transcribe the conversation
- Edit transcriptions into samples that read as if written (preserve voice, remove filler, structure into paragraphs)
- Get voice-owner sign-off on each edited sample as "yes, this captures how I'd write it"
- Each edited sample counts as one full sample (because the voice-owner explicitly endorsed it)

Voice-extraction adds 6–10 hours of cofounder time per engagement but consistently produces better voice-locking than thin-sample baseline.

---

## Storage format

Samples live in Knowledge Agent's voice index. Per voice-owner.

### Per-sample metadata

- Sample ID
- Voice-owner (named person)
- Date of original authorship
- Context (customer email, blog post, internal message — whichever applies)
- Word count
- Provenance (collected from archive / collected via extraction interview / endorsed by voice-owner)
- Validity status (passed review / under review / failed review)
- Embedding vector
- Tagged register (formal / informal / hybrid)
- Tagged audience (existing client / new client / peer / internal / vendor)

### Per-voice-owner metadata

- Total sample count
- Most-recent sample date
- Next refresh due date (typically 90 days from last refresh)
- Voice fingerprint (aggregate statistical features of the voice — average sentence length, vocabulary distribution, etc.)
- Drift score (computed monthly — current outputs' similarity to sample distribution)

### Access control

- AIS-side owner: read/write
- Client-side voice-owner: read access to their own samples
- Other agents in the stack: read access scoped to voice-application use (they retrieve samples for prompt construction; they don't modify the index)

---

## Application — how samples constrain outputs

The mechanic isn't "feed all 16 samples into every prompt." That would be expensive and slow. The mechanic is:

### 1. At prompt-construction time, retrieve relevant samples

For each output the agent generates, retrieve the 3–5 most relevant samples from the voice index. Relevance = similarity to the context of the current generation task.

Example: generating a follow-up email to a "not-now" reply → retrieve samples of prior follow-up emails (if any), plus general voice samples to cover register.

### 2. Construct the prompt with retrieved samples as exemplars

The prompt structure:

```
You are writing as [voice-owner], whose voice is exemplified by these samples:

[Sample 1]
[Sample 2]
[Sample 3]

Now write [target output] addressing [target situation].

Match the voice in the samples. Specifically:
- [Voice-fingerprint highlights — sentence length, vocabulary, tonal markers]
- [Register notes — formal / informal, audience-aware]
```

### 3. Validate the output before send

A reviewer prompt (separate Claude call) checks the generated output against the samples. Scores voice similarity. If similarity below threshold, regenerate with stricter sample constraint. Loop up to 3 times before escalating to human review.

### 4. Track applied samples per output

The audit trail records which samples were used for each generation. Enables retrospective analysis ("which samples produced the best-rated outputs?") for ongoing voice-curation improvement.

---

## Drift detection

Voice changes over time. Even with 16+ samples, outputs can drift if:

- The underlying model behavior changes (Claude version updates, behavior shifts)
- The voice-owner's actual voice evolves (and the index doesn't refresh)
- Prompt evolution introduces register changes
- Sample selection algorithm drifts (e.g. recency weighting changes)

### Monthly drift check

Automated. Knowledge Agent computes the similarity distribution between recent outputs (last 30 days, sampled across the agent stack) and the voice samples.

- Within ±10% of baseline similarity: healthy
- 10–20% drift: warning — note in monthly digest
- 20–30% drift: action required — trigger voice refresh
- >30% drift: stop and escalate — outputs may be visibly off-voice

Quantitative drift is one signal; qualitative drift (human-rated "this doesn't sound like us" feedback) is the other. When qualitative signals appear before quantitative, the threshold needs lowering.

### Quarterly voice refresh

Even without detected drift, refresh samples every 90 days:

- Collect 5–10 new samples (recent authentic outputs by voice-owner)
- Validate and add to index
- Optionally retire oldest samples (keeping total at ~16–25 range to prevent dilution)
- Run a batch of test outputs and have voice-owner review

Refresh frequency higher for:
- New deployments (first 6 months at monthly cadence rather than quarterly)
- Voice-owners actively evolving their voice (early-stage founders, partners in growing firms)
- Specialty legal (legal register is high-stakes; quarterly minimum, sometimes monthly)

---

## Vertical-specific notes

### Slovenian businesses

- Slovenian-specific challenges: vikanje (formal "you") vs tikanje (informal "you") choice carries social weight; regional vocabulary variations (Štajerska vs Primorska); domain-specific terms (računovodstvo vocabulary differs from kozmetika vocabulary)
- Sample threshold: 16 minimum, often want 20+ to cover register variations
- Native-Slovenian cofounder (Anej or Nejc) should validate samples before they enter the index — non-native review misses subtle register issues
- Quarterly refresh often slips to 6-month cadence in practice; aim for quarterly but accept 6-month as floor

### Specialty legal

- Legal register is the most specific in our verticals — formal, jurisdictional, doctrinally precise
- Sample threshold: 25–30 minimum. Below 25, outputs read as generically lawyerly rather than as this specific firm's voice
- Separate voice indexes per voice-owner (most engagements have a sponsoring partner whose voice the system mimics; multi-partner engagements may have 2–3 separate voice profiles)
- Quarterly refresh with deliberate sampling of recent published work (memos, articles, etc.)

### B2B SaaS demand-gen

- Lighter voice-locking requirement for SDR outbound (a slightly machine-like SDR voice is often acceptable; the optimization is on signal-action and personalization depth, not on voice subtlety)
- Heavier voice-locking for CEO / founder-led outreach (founder's voice is the company's voice; mismatch is a brand-damage risk)
- Two voice profiles per engagement common: SDR voice (volume-tolerant) + founder voice (high-care)
- Refresh quarterly; founder voice often refreshed when founder publishes new content (e.g. after a notable post or talk)

### Internal AIS use (Acquirer Agent's own outputs published under AIS brand)

- Voice samples from cofounder writings (this repo, blog content, founder communications)
- Three voice profiles (one per cofounder) plus an "AIS-collective" voice for content that doesn't have a single author
- Refresh quarterly based on each cofounder's recent published output

---

## When voice-locking fails

Sometimes the protocol doesn't reach acceptable voice-match even after 25+ samples and refresh. Causes and responses:

**Cause: voice-owner doesn't have a consistent voice.** Some authors write in widely-varying registers depending on context, audience, mood. Index can't lock onto a moving target.

*Response:* Either narrow scope (lock to a specific context — "this agent writes only in your customer-facing email voice") or relax voice-locking expectations and rely on per-output human approval.

**Cause: samples are too narrow in domain.** All samples are about Topic A; deployed agent has to write about Topic B occasionally. Voice doesn't generalize.

*Response:* Collect samples from broader domains the voice-owner has written in, or scope deployment to narrow domain.

**Cause: model architecture limitation.** Some voices are genuinely harder to lock than others — unusual register combinations, very distinctive idiolects that the base model resists.

*Response:* Tighter validator-loop (more regeneration cycles before accepting), or pivot to higher-touch human approval, or in extreme cases, deployment limited to internal-facing outputs only.

The protocol is honest: voice-locking has limits. When it can't reach acceptable quality, the response is to constrain the deployment scope, not to ship voice-mismatched outputs externally.

---

## Maintenance rhythm

- **Weekly:** new outputs sampled for voice-quality review by client-side owner
- **Monthly:** drift detection automated check + voice-quality dashboard in monthly digest
- **Quarterly:** voice refresh (collect new samples, validate, update index)
- **Annually:** full voice retrospective — has voice meaningfully evolved? do we need new voice profiles? are there voice-owners who should be added or retired?

The maintenance is part of the operate retainer scope, not a separate cost. Building the rhythm into the engagement's monthly cadence (it appears in the monthly digest, gets reviewed at QBR, gets refreshed at quarterly review) keeps it from being deferred or forgotten.
