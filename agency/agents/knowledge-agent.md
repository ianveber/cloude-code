# Knowledge Agent

Owns the client's institutional memory. Ingests SOPs, prior outputs, voice samples, decision logs. Serves them to other agents in the stack via retrieval. The unsexy spine that makes the rest of the stack work.

Often the agent clients notice least. Always the agent whose absence breaks everything.

---

## Function ownership

**Owns:**
- Ingestion pipeline for client-side institutional knowledge (SOPs, historical outputs, decision logs, voice samples, customer / case databases)
- Document parsing and structured extraction
- Vector embedding generation and storage
- Retrieval layer serving the rest of the agent stack
- Voice sample management (the 16-sample protocol's persistent layer)
- ICP definition document maintenance
- Update protocol — what gets added, when, by whom
- Versioning — historical view of how knowledge evolved

**Does not own:**
- The original creation of the documented knowledge (the client's humans create SOPs; we ingest them)
- Decisions made using the knowledge (other agents make decisions; Knowledge Agent serves the inputs)
- Real-time signal monitoring (Acquirer Agent owns that)
- External outputs (Knowledge Agent is internal-facing infrastructure — never speaks to customers)

**Hard boundary:** Knowledge Agent never generates external-facing content. It retrieves and serves; it does not produce. This is structural — the agent that owns the knowledge is separate from the agents that act on it.

---

## Inputs

- **Client-provided documents** — SOPs, prior outputs, decision logs, historical scoping memos, brand guidelines, regulatory references, etc.
- **Voice samples** — 16+ curated samples per voice-owner; refreshed quarterly
- **ICP refinement signals** — from Acquirer + Closer (which prospects converted, which didn't, what patterns hold)
- **Updates from cofounders / client-side humans** — manual additions or corrections to the index
- **Decisions from other agents** — when other agents make notable decisions (e.g. Closer rejects a prospect for unusual reasons), those decisions get logged into Knowledge for future reference

---

## Outputs

- **Retrieval responses** to other agents' queries (semantic + keyword + hybrid retrieval depending on query type)
- **ICP profile** served to Acquirer Agent for signal filtering
- **Voice sample bundle** served to any agent generating client-facing outputs
- **SOP excerpts** served to Operator Agent when handling new edge cases
- **Historical examples** served to Closer Agent for scoping memo and proposal drafting
- **Drift reports** — automated similarity check between recent outputs and voice samples; flagged when drift exceeds threshold
- **Coverage gaps** — what topics queries hit that the index doesn't cover; signals what to ingest next

---

## Tools and integrations

**Required:**
- Vector database (Pinecone, Weaviate, Qdrant, pgvector, or similar)
- Embedding model (Claude embeddings, OpenAI ada-3, or open-source alternatives like BGE)
- Document parsing tooling (Unstructured, LlamaParse, or vendor-specific for proprietary formats)
- Storage for raw documents (S3-compatible, or in-place with client's existing systems if compliance requires)
- Retrieval API serving other agents in the stack
- Audit-trail logging for every retrieval (who queried what, when, what was returned)

**Optional but common:**
- Re-ranking model for retrieval quality
- Knowledge graph layer for explicit relationship tracking (rare — used only when client has complex entity relationships, e.g. specialty legal firm with extensive matter/party/conflict structure)
- Manual annotation tooling for human-curated retrieval improvements

**Forbidden:**
- Sending any retrieved content to systems outside the engagement's defined boundary (e.g. logging to a third-party analytics tool that wasn't disclosed and approved)
- Training general-purpose models on client knowledge (the index is engagement-specific, never aggregated across clients)

---

## Human owners

**AIS-side owner during build:** Ian Veber (Knowledge Agent is engineering-heavy; falls naturally to Ian's brief).
- Approves: ingestion architecture, retrieval-layer architecture, security model, audit-trail granularity
- Escalates: data-sensitivity questions (especially for specialty legal — privilege protection), integration with client's existing knowledge systems

**Client-side owner during operate:**
- Specialty legal: sponsoring partner (the firm's knowledge is the firm's, full stop)
- B2B SaaS: VP GTM or Head of Sales Enablement (or RevOps lead)
- Slovenian businesses: owner-operator

Approves: what gets added to the index (new SOPs, voice samples, ICP refinements), what gets retired (outdated SOPs, etc.).
Escalates: requests from other agents that surface sensitive material, requests from client-side users to retrieve material they shouldn't see (access control questions).

---

## Escalation rules

- **Query returning sensitive material the requester shouldn't have access to** → block, log, escalate
- **Index drift detected (similarity between recent outputs and samples below threshold)** → notify human owner, suggest voice-sample refresh
- **Coverage gap detected (recurring queries with no good match in index)** → notify human owner, suggest ingestion of new material
- **Re-ranking confidence consistently low for a query type** → notify, may indicate index quality issue
- **Storage approaching limits** → notify, plan capacity expansion
- **Ingestion failure on a critical document** → escalate immediately, function continuity at risk

---

## Success metrics

**Quantitative (tracked weekly):**

| Metric | Target | Failure threshold |
|---|---|---|
| Retrieval latency | <500ms p95 | >1500ms triggers infrastructure review |
| Retrieval relevance score (other agents' usage) | >0.75 average | <0.6 triggers retrieval-quality review |
| Index coverage (queries with no good match) | <5% of queries | >15% triggers ingestion review |
| Voice-sample drift score | within ±10% of baseline | >20% triggers voice refresh |
| Update frequency (new content added) | per agreed cadence (typically weekly during build, monthly in operate) | falling behind triggers operator engagement check |

**Qualitative:**

- Are other agents' outputs noticeably better because of retrieved context?
- Is the human owner confident the index reflects current institutional knowledge?
- Are there blind spots — areas where the index is silent because nobody's been documenting?

---

## Failure modes

### Failure 1 — Index becomes stale

Engagement starts strong. Client documents the institutional knowledge during onboarding. Then nobody updates it. Six months in, the index reflects June 2026, but the firm has evolved — new matter types, new client patterns, new partnership relationships. Other agents' outputs degrade.

*Early warning:* Update frequency drops to zero. Other agents' retrieval-relevance scores trending down.
*Mitigation:* Quarterly update sprint with the client-side owner — 1–2 hour session to surface and ingest what's changed. Build update prompts into the operate-phase rhythm.

### Failure 2 — Voice samples become unrepresentative

The voice samples were collected at build phase from one set of authors. Over time, those authors' writing styles evolve (or new authors take over the voice-owning role). Index still serves old samples; outputs sound like the past, not the present.

*Early warning:* Sampled outputs from operating agents scored Weak by client-side owner; specific feedback like "this sounds like our 2025 voice, we've evolved."
*Mitigation:* Quarterly voice refresh protocol (collect 5–10 new samples, retire oldest, re-prompt downstream agents).

### Failure 3 — Sensitive content retrieved by wrong requester

Access control rules incomplete. Another agent in the stack (or worse, a human user querying via a client-facing interface) retrieves content they shouldn't see. Privacy breach. Potential legal exposure (specialty legal especially).

*Early warning:* Retrieval audit log shows queries returning content tagged sensitive to requesters not authorized.
*Mitigation:* Pause Knowledge Agent serving immediately. Audit access control rules. Tighten. Resume only after re-validation with sample queries.

### Failure 4 — Ingestion misses key documents

During onboarding, important documents weren't surfaced (client didn't remember them, or didn't think they mattered). Knowledge gaps surface months later as agents struggle with edge cases that the missing documents would have covered.

*Early warning:* High coverage-gap rate; queries hitting topics that "everyone in the firm knows" but the index doesn't.
*Mitigation:* Targeted ingestion sprint — interview the human who "knows it all" and ingest their tacit knowledge.

### Failure 5 — Vector index quality degrades after re-embedding

Periodic re-embedding (e.g. when migrating embedding models) produces lower retrieval quality than the prior version. Other agents' outputs noticeably worse for a period.

*Early warning:* Retrieval relevance scores drop sharply after a migration. Other agents' quality metrics dip.
*Mitigation:* Roll back to prior embedding model. Test new model in shadow mode (running parallel queries, comparing outputs) before swapping. Only swap when shadow-mode shows equivalent or better quality.

---

## Configuration patterns by vertical

### Slovenian businesses
- Slovenian-language documents (need Slovenian-capable embedding model or multilingual model)
- Smaller initial index (most Slovenian SMBs have less documented institutional knowledge)
- Heavy reliance on voice-extraction interviews during onboarding to populate baseline
- Quarterly update cadence often becomes 6-month cadence in practice (smaller documentation footprint)

### Specialty legal
- Highest security requirements (privilege protection)
- Often requires firm-side hosting or specific compliance-validated cloud (some firms can't use general-purpose vector DB providers)
- Granular access control (which paralegals can query what, which matters are restricted)
- Audit trail is critical — every retrieval logged with timestamp, requester, query, returned content
- Voice samples sourced from named partner(s); separate voice indexes per voice-owner
- Conflict database lives separately from Knowledge Agent index (it's a transactional data source, not a knowledge corpus)

### B2B SaaS demand-gen
- Most dynamic index — ICP refines monthly, signal-outcome correlations update weekly
- Lighter on document-style content, heavier on structured data (won-deal patterns, customer profiles)
- Tight integration with Closer Agent's classification system (feedback loop for ICP refinement)
- Voice samples sourced from top SDRs + customer-facing CEO + customer testimonials

---

## Voice and output requirements

Knowledge Agent doesn't produce external-facing outputs. No voice-locking required for Knowledge Agent itself.

Knowledge Agent maintains voice samples for other agents — that's its primary voice-related function.

---

## Memory and learning

**Persisted (forever, with versioning):**
- All ingested documents
- Embedding vectors
- ICP definitions over time (versioned)
- Voice samples over time (versioned)
- Decision logs (which queries, which retrievals, who from)

**Learning loops:**
- **Per query:** retrieval quality scored by downstream agent (was the retrieval useful?); low scores feed into re-ranking improvements
- **Weekly:** coverage-gap report (queries hitting nothing); surfaces ingestion priorities
- **Monthly:** retrieval-relevance trends; surfaces quality regressions
- **Quarterly:** full index audit (sample queries, manual review of returned content); voice-sample refresh

---

## Cost model

**Typical monthly direct cost per engagement:** €150–€400

| Component | Range | Driver |
|---|---|---|
| Vector database hosting | €50–€150 | Index size + query volume |
| Embedding model API costs | €30–€100 | New content volume (re-embedding existing is amortized) |
| Storage (raw documents) | €20–€60 | Volume of raw documents |
| Document parsing | €20–€60 | New document volume per month |
| Retrieval API hosting | €30–€80 | Query volume from other agents |

**Scales with:**
- Index size (storage cost grows linearly)
- Query volume (retrieval cost grows linearly with calls)
- Update frequency (re-embedding cost spikes during quarterly refreshes)

**Often the lowest-cost agent in the stack**, but the one whose absence makes the others useless. The math justifies the engagement only when there's an Acquirer, Closer, or Operator paying the bigger bills — Knowledge Agent alone isn't a viable engagement.
