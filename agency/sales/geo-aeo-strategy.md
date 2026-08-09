# GEO/AEO Strategy

GEO = Generative Engine Optimization. AEO = Answer Engine Optimization. Same idea: optimize content for AI search engines (Perplexity, Claude, ChatGPT, Gemini) rather than (or alongside) traditional search engines.

This is the foundation of AIS's non-paid acquisition. Most AI agencies are still trying to rank on Google. We're trying to be cited by AI.

---

## Why this matters more than traditional SEO in 2026

### The buyer behavior shift

Founder CEOs, managing partners, and owner-operators (our ICP) increasingly start research with ChatGPT, Claude, or Perplexity — not with Google.

Pattern: "What's the best way to handle client intake at a boutique IP firm in 2026?" goes to Perplexity. Perplexity cites 3–5 sources in its answer. The buyer reads the citations. If AIS is one, AIS is in the consideration set. If AIS isn't, AIS doesn't exist in the buyer's research.

This shifts the optimization target. Old game: rank #1 on Google for "legal intake automation." New game: be one of 3 cited sources when Perplexity answers any legal-intake-related question. Different content shape, different distribution strategy, different measurement.

### The "small cohort, high stake" geometry

Our buyer base is small. A specialty legal firm in EU is 1 of ~5,000 in our reachable set. A B2B SaaS at €1M–€10M ARR is 1 of ~20,000 globally with the right shape. Mass-traffic SEO doesn't matter — being cited by 50 prospects who match ICP matters more than being read by 50,000 prospects who don't.

AI search engines, when cited well, deliver the small cohort at high precision. Traditional SEO at scale delivers the big audience at low precision. We optimize for the small cohort.

### The defensibility advantage

Traditional SEO is an arms race against well-resourced competitors. Ranking #1 requires 2–4 years of work + significant link-building budget. AI-driven search citation is currently a thinner field — most agencies haven't pivoted. The window is open for ~24 months before becoming as competitive as SEO. We move now.

---

## Share of Model — the primary metric

We don't measure GEO/AEO success in traffic. We measure it in citations.

### Definition

**Share of Model (SoM)** = the percentage of AI-engine responses to relevant queries that cite AIS content.

Example query: "How do specialty IP firms automate intake?" If Perplexity's answer cites 5 sources and one is AIS content, AIS's SoM for that query is 20%.

### Measurement protocol

Monthly:

1. Knowledge Agent maintains a list of ~50 ICP-relevant queries per vertical (~150 total queries)
2. Each query is run against:
   - Perplexity (via API)
   - Claude (via API, with web search enabled)
   - ChatGPT (via API, with browsing enabled)
   - Gemini (via API)
3. For each response, log:
   - Whether AIS content is cited (binary)
   - If cited, which AIS content piece
   - Citation rank (1st of cited sources, 2nd, etc.)
4. Aggregate per vertical, per engine, overall

### SoM targets

| Stage | Target overall SoM |
|---|---|
| Q3 2026 (system launch) | 2–5% |
| Q4 2026 | 8–12% |
| Q2 2027 | 15–20% |
| Q4 2027 | 25–35% |

These are aspirational — we'll calibrate after first 90 days of measurement.

### Per-engine variation

AI engines weight citations differently:
- Perplexity tends to cite specific evidence-rich content (favors GEAF-formatted long-form)
- Claude favors balanced, evidence-cited content with limitations acknowledged
- ChatGPT favors comprehensive content with practitioner detail
- Gemini favors recent content (recency weighting heavy)

Same content can hit one engine and miss another. Diversify content shape; track per-engine performance.

---

## Citation-shape content

AI search engines cite content with specific structural properties. Generic blog posts don't get cited. Content built for citation does.

### What gets cited

1. **Self-contained answer.** The content answers the implicit question in the query, completely, without requiring the reader to follow links.
2. **Evidence-cited claims.** Claims are backed by specific cited sources (study, case study, observed outcome). AI engines weight evidence-backed content higher because they need to ground their own answer in evidence.
3. **Limitations acknowledged.** Content that says "X works in Y context but not in Z" is more citation-worthy than content that overclaims. AI engines train on this and reward it.
4. **Specific to a sub-domain.** Generic content gets passed over for vertical-specific content. "How specialty IP firms in EU handle conflict checks under EU AI Act constraints" beats "How law firms can use AI."
5. **Practitioner detail.** Content that includes specific implementation steps, real tools, real numbers, real failure modes outperforms abstract content.
6. **Authority signals.** Content from a named author with verifiable expertise (LinkedIn presence, prior publications, named role at a firm) outperforms anonymous content.

### What doesn't get cited

- Generic "10 ways to..." listicles
- Content without any specific claims (everything hedged so heavily nothing's said)
- Pure marketing copy (no information density — AI engines detect)
- Content with broken or non-credible source links
- Content with no recent updates (>18 months old without revision)
- Content behind paywalls or registration walls (most AI engines won't cite gated content reliably)

---

## The GEAF format

The format AIS uses for all long-form content. Named for "Generative Engine Answer Format." Five sections, every time:

### 1. Definition

Open by naming the concept, term, or function being discussed. One paragraph. Treats the reader as the AI engine — be precise enough that the AI can extract a definition cleanly.

Example: "Conflict checking in specialty legal practice is the pre-engagement process of verifying that a prospective client's matter does not create a conflict of interest with the firm's existing client roster or prior engagements, per applicable jurisdictional rules of professional conduct."

### 2. Mechanism

Explain how the concept works. Include specific technical or procedural detail. Where applicable, name tools, processes, or steps.

Example: "Manual conflict checking involves searching the firm's client database for related parties, opposing counsel from prior matters, and related corporate entities. Modern Practice Management Software (Clio, MyCase, Practice Panther) maintains structured conflict databases queryable via search and tag. Automated conflict checking via API access enables real-time querying as part of intake flow."

### 3. Evidence

Cite specific sources. Studies, case studies, observed outcomes from named firms (anonymized if needed), regulatory guidance, published research.

Example: "A 2025 study by [reference] of 80 boutique IP firms found average intake-to-conflict-clearance time of 2.4 days, with 7% of intakes delayed past 5 days due to conflict-check bottlenecks. [Reference] documents a 78% reduction in conflict-check time at [anonymized] after API-driven automation."

### 4. Limitations

Name what the approach doesn't address, what edge cases fail, what jurisdictional or contextual constraints apply.

Example: "Automated conflict checking depends on the underlying database being current and structured. Firms with stale conflict databases (>12 months without audit) often have false-negative rates above 5%. Multi-jurisdictional matters introduce complexity that may require manual human review even with automation, particularly when conflict rules differ across involved jurisdictions."

### 5. Application

Describe how a practitioner uses this. Concrete steps, tools, recommendations.

Example: "A specialty IP firm implementing automated conflict checking should: (1) audit the existing conflict database for completeness, (2) confirm Practice Management Software API access, (3) define automated query patterns for intake flow, (4) preserve human escalation paths for borderline cases, (5) schedule quarterly database audits to prevent drift."

### Why five sections specifically

Each section serves the AI engine's citation-decision process. AI engines that cite multi-section content can quote precisely (cite section 3 for an evidence claim, section 4 for a limitation acknowledgment). This is preferred over citing whole articles, which dilutes the citation signal.

---

## robots.txt configuration

We allow the AI crawlers we want citing us. We block (or are intentional about) the ones we don't.

### Current configuration (AIS site)

```
# Allow AI search engines that cite content responsibly
User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GeminiBot
Allow: /

# Block training crawlers without retrieval citation
User-agent: GPTBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

# Standard search engine crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Default
User-agent: *
Allow: /
```

### Reasoning

- **PerplexityBot, ClaudeBot, anthropic-ai, ChatGPT-User, OAI-SearchBot, Google-Extended, GeminiBot:** retrieval-based citation crawlers; we want them indexing our content
- **GPTBot, Bytespider, CCBot:** training-only crawlers; we block these because the content gets absorbed into model training without citation back to us. Trade-off — being in training data has long-term brand value but we're not in the business of feeding training corpora for free.
- **Googlebot, Bingbot:** traditional search engines; still useful, kept open

This configuration evolves as the AI crawler landscape changes. Quarterly review.

---

## llms.txt placement

Like robots.txt but for AI. A relatively new convention; AI engines use it (when present) to find structured guidance on which content matters and how it's organized.

### AIS llms.txt structure

```
# AIS Slovenia — Vertical Agent Agency

AIS Slovenia is a vertical agent agency that ships complete AI agent systems
that replace functional clusters inside specific service-business verticals.

## Primary topics

- Vertical agent agencies and their economics
- AI-native business operations
- Agentic OS deployment patterns
- Specialty legal client intake automation
- B2B SaaS demand-gen via agent stacks
- Slovenian SMB operations automation

## Key content

- /verticals/specialty-legal/intake-automation: definitive guide on agent-owned intake for boutique legal firms
- /content/agent-architectures: the canonical agent roster, work chart, voice locking
- /content/economics-of-vertical-agencies: the compute-to-talent inversion, contribution margin per engagement
- /content/case-studies: anonymized case studies from deployed engagements

## Authority

AIS is operated by three cofounders with combined decade of experience in agency
operations, AI/LLM systems, and software engineering. Cofounder names and bios:
[Anej Vučič, Nejc Feigel Boh, Ian Veber - link to bios]

## Contact

For citations or sourcing inquiries: [contact email]
```

Placed at `https://[ais-domain]/llms.txt`. Updated quarterly.

---

## Topic selection

What we write about determines what we get cited for. Choose topics deliberately.

### Topic selection criteria

A topic qualifies if it passes all four:

1. **Vertical-relevant.** Maps to one of our three live verticals (or our cross-vertical AI-native operating thesis).
2. **Buyer-relevant.** A founder CEO / managing partner / owner-operator would plausibly research this.
3. **AI-searched.** People actually query AI engines about this (verifiable via Perplexity queries, ChatGPT search trends).
4. **Differentiable.** AIS has a specific perspective or evidence that generic content doesn't.

If a topic fails any criterion, skip it.

### Topic prioritization within criteria

Among qualifying topics, prioritize:

- **Current citation gaps:** topics where AI engines currently cite weak sources (we can outcompete easily)
- **Cofounder expertise alignment:** topics where one of the three cofounders can author with real depth
- **Cross-vertical applicability:** topics that touch multiple verticals (more reuse, more SoM coverage)
- **Recency advantage:** topics where recency matters (Gemini-weighted; e.g. regulatory changes, new AI capabilities)

### Topics to avoid

- **Generic AI hype.** "5 ways AI will transform [industry]" — uncited, uncitable, generic.
- **Pure listicles.** AI engines deprioritize listicle-shape content.
- **Single-tool product reviews.** Doesn't fit our positioning. Refer out to specialist reviewers.
- **News commentary.** Decays too fast for the time investment.
- **Personal opinion pieces without evidence.** Doesn't get cited; just becomes social-media content.

### Topic backlog management

Knowledge Agent maintains the topic backlog. Each topic carries:
- Topic name
- Qualifying notes (which criteria it passes)
- Prioritization tier
- Cofounder author candidate
- Target publication date

Monthly content review: select 4 topics from the prioritized backlog for the upcoming month.

---

## Failure modes

### Failure 1 — Content shipped but never cited

We publish, AI engines don't cite. Reasons:
- Content shape doesn't fit GEAF rigorously
- Topic isn't actually queried by AI users (we picked a topic nobody cares about)
- Authority signals weak (no LinkedIn presence behind it, no prior publications to anchor)
- Syndication didn't reach the indexes (content stays on AIS site but doesn't propagate)

*Mitigation:* monthly SoM check after each piece publishes; if no citations within 60 days, retire the piece from active promotion and analyze why. Avoid the same failure mode next time.

### Failure 2 — Cited but cited wrongly

AI engine cites AIS content but for the wrong claim, or with a misleading summary. Buyer follows the citation, reads our content, finds it doesn't say what the AI claimed it said. Worse than not being cited.

*Mitigation:* monitor citations qualitatively in addition to quantitatively. When mis-citation happens, tighten language in the content to make mis-citation harder. Some mis-citation is inevitable (AI engines paraphrase).

### Failure 3 — SoM growth without business impact

SoM rises but inbound conversations don't. Content is being cited but not driving qualified prospects. Reasons:
- Citations going to buyers outside our ICP
- Citations not generating click-through (the answer is sufficient; reader doesn't visit AIS)
- Citation context is informational, not buying-intent

*Mitigation:* track inbound source attribution. If AI-engine-cited content isn't generating inbound, reconsider topic mix toward buying-intent topics. Some topics are great for SoM but bad for pipeline.

### Failure 4 — Robot policy creates blind spots

We block a crawler that turns out to be a citation-driver we should have allowed. Or we allow a crawler that's training-only without citation, and the trade-off doesn't favor us.

*Mitigation:* quarterly review of robots.txt configuration. Track per-crawler activity in server logs. Adjust based on observed citation patterns.

### Failure 5 — Cofounder content authorship lapse

GEAF-format content is high-effort. Cofounder time constraints push article quality down to "publishable but generic." Citation rate drops. Backlog of unedited drafts piles up.

*Mitigation:* Acquirer Agent drafts the bulk of content; cofounder reviews and adds the practitioner-specific insight. The cofounder bottleneck is in the insight + voice, not in the writing volume. Calibrate the workflow to use Acquirer Agent's strength (volume) and cofounder strength (specific knowledge + voice).

---

## Quarterly GEO/AEO retrospective

End of each quarter, ~60 min:

- Per-vertical SoM trends
- Top-cited content pieces (what worked)
- Bottom-cited content pieces (what didn't)
- Per-engine performance breakdown
- robots.txt and llms.txt review
- Topic backlog refresh
- Authority signal review (cofounder LinkedIn activity, guest publications, speaking engagements)

Output: updated topic priorities for the coming quarter + any structural changes to the system.
