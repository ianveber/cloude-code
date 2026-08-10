# Content System

The content production system that powers AIS's GEO/AEO strategy. The Acquirer Agent runs production at volume; cofounder time is reserved for topic selection, practitioner insight injection, and final voice approval.

This file specifies the system: cadence, format, voice, topic flow, distribution, repurposing, and measurement.

---

## Cadence

### Standard cadence

| Frequency | Output | Owner |
|---|---|---|
| Weekly | 1 long-form article (4/month) | Acquirer Agent draft → cofounder review |
| Weekly | 3 LinkedIn posts per active cofounder | Acquirer Agent draft → cofounder edit |
| Bi-weekly | 1 short-form practitioner note (1,000–1,500 words) | Acquirer Agent draft → cofounder review |
| Monthly | 1 case study (when material is available) | Cofounder-led, Acquirer Agent assists |
| Quarterly | 1 keystone piece (5,000+ words, definitive) | Cofounder-led, Acquirer Agent assists |

### Total per month

- 4 long-form GEAF articles
- 2 short-form practitioner notes
- ~36 LinkedIn posts across cofounders
- 0–1 case study (depending on engagement timing)

### Total per quarter

- ~12 long-form articles
- ~6 short-form notes
- 1 keystone piece
- 2–3 case studies (target as more engagements complete)

### Total per year

- ~48 long-form articles
- ~24 short-form notes
- 4 keystone pieces
- 8–12 case studies

This is the volume that fills a credible content corpus inside 12 months. Below this volume, SoM growth lags. Above this volume, cofounder review becomes the bottleneck and quality suffers.

---

## Format — GEAF in detail

Specified in `sales/geo-aeo-strategy.md`. Repeated structure here for working reference:

| Section | Length | Purpose |
|---|---|---|
| 1. Definition | 1 paragraph | Name the concept being discussed; precise, AI-extractable |
| 2. Mechanism | 2–4 paragraphs | How it works; specific technical / procedural detail |
| 3. Evidence | 2–4 paragraphs | Cited sources; studies, case studies, observed outcomes |
| 4. Limitations | 1–2 paragraphs | What this approach doesn't address; edge cases |
| 5. Application | 2–3 paragraphs | Concrete steps for a practitioner |

Total article length: 1,800–3,200 words for long-form. 1,000–1,500 words for short-form practitioner notes (compresses sections 2 and 3).

### What every GEAF article must include

- Specific numbers (build fee bands, time saved, conversion deltas, sample sizes)
- Named tools (Apollo, Clio, BuiltWith, etc.) where relevant
- Named regulatory frameworks (EU AI Act, GDPR, jurisdictional bar rules)
- Cited sources (with hyperlinks, not just author + year)
- Practitioner-tested specifics (this is the differentiator — generic AI-agency blogs don't have these)

### What every GEAF article must not include

- Banned phrases from `docs/voice.md` (leverage, supercharge, unlock, etc.)
- Pure listicle structure ("10 ways to...")
- Self-promotional opening ("AIS is a leading provider of...")
- Vague claims ("AI improves efficiency")
- Conclusion-as-summary ("In conclusion...")

---

## Topic flow

### Backlog maintenance

Knowledge Agent maintains the topic backlog. Sourced from:

- Cofounder observations (what we're seeing in client engagements, in inbound conversations, in industry discussion)
- Acquirer Agent's monitoring (what topics buyers are asking AI engines, what's getting cited weakly that we could displace)
- Discovery call patterns (questions prospects ask repeatedly suggest content gaps)
- Existing engagement learnings (anonymized takeaways become content)

### Topic selection — monthly

First Monday of each month. ~20 min during the monthly acquisition review.

- Review backlog (Acquirer Agent presents the top 12 prioritized topics)
- Cofounders pick 4 for the month
- Assign each topic to a cofounder author candidate
- Schedule publication dates (1 per week, target Tuesday or Wednesday for citation-fresh-content weighting)

### Topic prioritization framework

For each candidate topic:

| Factor | Weight | Notes |
|---|---|---|
| Buyer-relevance | High | Does our ICP actually research this? |
| Differentiation potential | High | Can we say something other agencies can't? |
| Cofounder expertise | Medium-high | Who can author this with real depth? |
| Current citation gap | Medium | Is AI currently citing weak sources for this query? |
| Cross-vertical applicability | Medium | Does this content serve multiple verticals? |
| Buying-intent | Medium | Are people researching this when about to buy? |
| Recency advantage | Low-medium | Topics where recency matters get refreshed value |

### Topic backlog rotation

If a topic sits unselected for 3 consecutive months, it gets retired or revisited. Either:
- The topic isn't as good as it seemed → archive
- The topic is good but always loses to something better → revisit positioning, perhaps angle differently

---

## Voice on content

Content is voice-locked to AIS's collective voice (the AIS-collective voice profile from Knowledge Agent) for unattributed pieces, and to specific cofounder voices for bylined pieces.

### Bylined pieces

When a cofounder is the named author:

- Voice samples drawn from that cofounder's prior writing (LinkedIn, prior articles, internal docs)
- Minimum 16 samples per cofounder voice; 25+ ideal
- Refresh quarterly (cofounder commits 3–5 new samples each quarter)
- Acquirer Agent drafts; cofounder edits to inject specifics and tone match
- Cofounder approves final before publish

### Unattributed AIS pieces

When the piece doesn't have a named author (most case studies, most practitioner notes):

- AIS-collective voice (synthesized from all three cofounders' writing patterns)
- Slightly more formal than individual cofounder voices
- Acquirer Agent drafts; one cofounder edits before publish

### Voice quality bar

- Sampled outputs rated Strong / Acceptable / Weak by reviewer cofounder
- Target: >70% Strong on content (higher bar than outbound)
- <10% Weak (anything Weak should not publish)
- Monthly drift detection check per `agents/16-sample-voice-locking.md`

---

## Distribution

### Owned channels (primary)

- AIS website (all content lives here permanently)
- AIS llms.txt updated quarterly to surface new keystone content
- Email newsletter (if audience grows large enough to justify; target: launch when audience reaches 500+)

### Syndication

#### LinkedIn (cofounder personal accounts)
- Each long-form article syndicated to the cofounder-author's LinkedIn
- 2–3 LinkedIn posts/week per cofounder extracting key insights
- Engagement on others' posts (cofounder time — adds authority signal)

#### Slovenian-market syndication
- Mladi Podjetnik (slovenian business community) — published or excerpted with backlink
- Finance.si — selective placements
- LinkedIn Slovenia groups

#### Vertical-specific syndication
- Specialty legal: legal-tech publications, bar-association content channels, specialty legal podcasts (cofounder guest appearances)
- B2B SaaS: SaaStr / Pavilion communities, founder-focused newsletters, B2B SaaS podcasts
- (Avoid generic "marketing" or "AI" publications — wrong audience, wrong positioning)

#### Guest publications
- Strategic quarterly placements: 1–2 guest articles per quarter in high-authority publications relevant to our verticals
- Cofounder time investment — these are pitched and authored cofounder-led

### What we don't do

- Pay for placement (no sponsored content, no paid distribution)
- Mass-email blasts (newsletter is opt-in, content-focused, not promotional)
- Spam-tier syndication (we don't post to 50 directories)
- Reciprocal-content schemes ("you publish mine, I'll publish yours" without genuine fit)

---

## Repurposing — 1 article → 10+ touches

Each long-form article generates downstream content. The repurposing rules:

### From 1 long-form article

- **1 LinkedIn long-form post** (the article condensed for LinkedIn's 1,500-character feed-friendly format) — cofounder authored
- **3 LinkedIn short posts** (each pulling one specific insight from the article)
- **1 Slovenian-version excerpt** for Mladi Podjetnik (if topic is Slovenian-relevant)
- **2 outbound talking points** (used by Acquirer Agent in personalized outbound to fitting prospects)
- **1 discovery-call reference** (cofounders cite the article in discovery calls when relevant)
- **1 case-study companion** (when published alongside a case study, the article provides the conceptual framing)
- **1 email-newsletter feature** (when newsletter launches)

### Production efficiency

The repurposing is mostly Acquirer Agent work (extracting LinkedIn posts, drafting outbound hooks). Cofounder time is concentrated in the long-form article itself; downstream content runs on auto-pilot with cofounder approval.

### Net leverage

1 hour of cofounder time on the long-form article → 5–8 hours of cofounder-equivalent output across downstream channels. That's the leverage that makes the content cadence sustainable.

---

## Measurement

### Primary metric — SoM

Per `sales/geo-aeo-strategy.md`. Tracked monthly via Knowledge Agent's automated query system.

### Secondary metrics

| Metric | Frequency | Target |
|---|---|---|
| Article publish cadence | Weekly | 1/week long-form |
| Citation count per article | Quarterly per article | Increasing over 90 days from publish |
| LinkedIn engagement per syndicated post | Per post | >1% engagement rate |
| Inbound conversation attribution to content | Monthly | Track which inbounds reference reading specific content |
| Discovery call references to content | Monthly | Track which content cofounders mention in calls (signal of usefulness) |

### Per-article retrospective

Per article, 90 days post-publish, Acquirer Agent generates a retrospective:

- Citation count (per AI engine)
- LinkedIn engagement
- Traffic from organic + AI-engine referrals
- Downstream conversations referencing
- Discovery call references

Articles with strong retrospective metrics inform next month's topic selection (pick adjacent topics).

Articles with weak retrospective metrics → analyze why before next similar topic. Sometimes topic was wrong; sometimes format was wrong; sometimes distribution failed.

---

## Failure modes

### Failure 1 — Content cadence slips

Target 4/month, ship 2/month. Reasons:
- Cofounder approval queue piles up
- Topics chosen are too cofounder-heavy (insight requires hours of cofounder time per article)
- Acquirer Agent drafts are too generic, requiring more rewrite than draft-from-scratch

*Mitigation:* topic selection discipline — pick topics where cofounder time investment is bounded. Streamline the cofounder review process (15-min review slot per article, not open-ended). Investigate Acquirer Agent draft quality if rewrite is consistently heavy.

### Failure 2 — Voice drifts to generic

Articles publish but lose AIS-specific voice over time. Becomes indistinguishable from generic AI-agency content. Citation rate plateaus.

*Mitigation:* monthly voice quality check (sampled outputs rated by cofounders). Quarterly voice refresh per `agents/16-sample-voice-locking.md`. If drift detected, immediate prompt-rule update to tighten voice constraints.

### Failure 3 — Topics drift from buying-intent

Content pivots toward "interesting topics cofounders want to write about" vs "topics buyers research when about to buy." Citations may continue but inbound attribution drops.

*Mitigation:* monthly inbound-attribution review. Topics that don't generate conversations within 6 months → flag for retirement. Topic selection framework reinforced.

### Failure 4 — Syndication fragmenting

Articles publish on AIS site but don't reach syndication channels. LinkedIn posts skipped. Mladi Podjetnik placement missed. Discovery surface shrinks.

*Mitigation:* syndication checklist per article (managed by Acquirer Agent). Per-channel publication confirmed before article is marked complete.

### Failure 5 — Acquirer Agent prompt drift

Acquirer's content drafting prompts evolve over time (incremental adjustments). Articles published 6 months apart no longer have consistent shape. Confused brand voice.

*Mitigation:* quarterly Acquirer Agent prompt audit — read what's currently in the prompt, confirm it matches the documented format and voice. Version-control the prompts.

---

## Content production checklist (per article)

### Day 0 — Topic confirmed
- [ ] Topic in approved monthly slate
- [ ] Cofounder author assigned
- [ ] Target publish date set

### Day 1–2 — Research and draft
- [ ] Acquirer Agent does primary research (signal sources, prior content scan, evidence sources identified)
- [ ] Acquirer Agent generates GEAF draft following format
- [ ] Draft queued for cofounder review

### Day 3–5 — Cofounder review
- [ ] Cofounder reads draft (15–30 min)
- [ ] Practitioner-specific edits added (the differentiator content)
- [ ] Voice match confirmed
- [ ] Citations verified (links work, sources real)
- [ ] Approved for publish

### Day 5 — Publish
- [ ] Published on AIS site
- [ ] llms.txt updated if keystone piece
- [ ] Acquirer Agent triggers syndication workflows

### Day 6–7 — Syndication
- [ ] LinkedIn long-form post drafted and queued
- [ ] LinkedIn short posts (3) drafted and queued
- [ ] Vertical-specific syndication submitted
- [ ] Mladi Podjetnik excerpt sent (if Slovenian-relevant)

### Day 14, 30, 60, 90 — Retrospective
- [ ] Citation tracking checked
- [ ] Engagement metrics checked
- [ ] Inbound attribution checked
- [ ] Learnings logged for next month's topic selection
