# Iman Gadzhi Context Profile — Design Spec
Date: 2026-07-02
Status: Approved by Ian (amendments: (1) research must be maximally deep; (2) PERSONAL BRAND is the primary advisor use case — see Amendment 2)
Owner: Ian Veber / Claude

## Amendment 2 (2026-07-02, mid-execution): personal brand is the center

Ian's clarification: the advisor's PRIMARY job is **personal-brand consulting for Ian's own brand**. Other uses (general business decisions, dossier reference) stay, but weighting changes:

- **Anchor source:** Iman's "How I Built a $100M Personal Brand (Full Breakdown)" (youtube.com/watch?v=R_D5DZvgBDw, 2024-11-25) + third-party analyses of it (Arnold Trinh's "Exposing Iman Gadzhi's $100M Personal brand playbook" VkuGEYurLs4; Trakyo Pod interview "Meet The Genius Behind Iman Gadzhi's $100M Personal Brand" JWd_92fkSXo, 2026-05-31).
- **playbook.md:** personal-brand-as-distribution becomes the LEAD section, expanded into sub-frameworks (content architecture, audience trust mechanics, brand→funnel wiring, values/identity layer).
- **advisor.md:** consult protocol tuned for personal-brand questions first (content strategy, positioning, audience building, monetizing attention); general business consults remain supported.
- **Research:** a dedicated personal-brand lane added to the loop-until-dry rounds.
- **Transcript targets:** personal-brand videos get priority in the 12–20 selection.

## Purpose

Build a persistent, source-grounded context profile of Iman Gadzhi serving three uses (Ian's selections):

1. **Playbook to apply** — his agency/education business frameworks extracted as an operating playbook mappable to AIS, ATHLOS, and client work.
2. **"What would Iman do" advisor** — a persona file Claude loads on demand to run grounded consults on Ian's business decisions.
3. **Research dossier** — verified facts: bio, timeline, companies, revenue claims (tagged), controversies.

Explicitly NOT in scope: content/voice modeling (writing in his style), and any automation pretending NotebookLM has an API (it doesn't — its role is a manual study layer).

## Architecture

### Vault structure (deliverable)

```
/Users/ianveber/Documents/Obsidian Vault/_claude-memory/profiles/iman-gadzhi/
├── dossier.md        ← verified facts (the spine)
├── playbook.md       ← frameworks, made applicable
├── advisor.md        ← persona + consult instructions
├── NOTEBOOKLM.md     ← 5-line manual upload cheat-sheet
└── sources/
    ├── _INDEX.md     ← every source: URL, date, type, reliability rating, fetch status
    ├── yt-<slug>.md  ← one per YouTube transcript
    └── web-<slug>.md ← one per article/interview/page
```

- Master MOC gains a `Profiles` entry under Knowledge Base linking the three core files.
- Files cross-link with `[[...]]` per vault convention.
- Every file self-contained with title + URL(s) + date at top → drag-and-drop ready for NotebookLM.

### Tool roles

| Tool | Role |
|---|---|
| Claude (Claude Code) | Research, synthesis, verification, file authoring, advisor runtime |
| Obsidian vault | Canonical storage; profile loads into any future session |
| NotebookLM | Manual study layer: Ian drags `sources/` + dossier + playbook into a notebook → chat-with-sources + Audio Overview. No automation. |

## Research pipeline (DEEP — Ian's amendment)

Research runs as a multi-agent deep-research harness (deep-research skill / Workflow orchestration), not a single pass.

### Phase 1 — parallel sweep, 7 lanes

1. Bio & timeline (childhood, dropping out, IAG Media origin, year-by-year)
2. Business empire: IAG Media, Grow Your Agency → Educate.io, GADZHI (watches/brand), AGX, other ventures — entities, status, ownership
3. Frameworks & teachings — his methods in his own words (agency model, offers, sales, pricing)
4. Education business mechanics — course launches, funnels, community model, pricing history
5. Criticism & controversies — course-selling criticism, income-claim skepticism, refund/complaint patterns (required so the advisor isn't a fanboy)
6. Recent moves 2024–2026 — current focus, pivots, public statements
7. Third-party analyses — journalists, YouTubers, forum deep-dives dissecting his business

### Transcripts lane

- Target 12–20 of his highest-value business videos (not lifestyle vlogs).
- Fetch via yt-dlp / transcript endpoints (Bash/WebFetch). Each failure logged in `_INDEX.md` as `manual add candidate` — never silently dropped; the lane falls back to secondary coverage (summaries, quotes) of that video's content.

### Depth mechanics (what "really deep" means, operationally)

- **Loop-until-dry:** after the first sweep, run further search rounds per lane until 2 consecutive rounds surface nothing new.
- **Source floor:** ≥20 distinct quality sources in `sources/` (transcripts count), each with reliability rating in `_INDEX.md`.
- **Adversarial verification:** every factual claim destined for the dossier is challenged by an independent verification pass. Unverifiable → tagged `[claim — his own figure]`; corroborated → `[verified]` with source. His marketing numbers never appear untagged.
- **Completeness critic:** before synthesis, a critic agent asks "what's missing — lane not exhausted, claim unverified, known event uncovered?" Findings become one more research round.
- **Conflict rule:** conflicting sources both recorded with dates; newer wins the headline, conflict noted inline.

## File content specs

### dossier.md
Identity block · year-by-year timeline · companies table (entity, role, status, revenue with claim/verified tags) · controversies section (each with sources) · "Last researched: YYYY-MM-DD" header.

### playbook.md
One section per framework — expected set (final list driven by research): offer construction; agency → education flywheel; pricing psychology; personal-brand-as-distribution; hiring/ops philosophy; "self-improvement × business" positioning. Each section: the framework → evidence (source links) → **"Map to Ian"** note (AIS / ATHLOS / client work) where the mapping is real; omitted where forced.

### advisor.md
Decision heuristics · what he optimizes for (leverage, brand equity, high-margin education) · known biases/blind spots (survivorship bias, sells-the-dream incentive, audience-size dependency) · **"How to run a consult"** block instructing Claude to: answer only from documented positions, cite which source, and say "no documented position" instead of inventing.

### sources/_INDEX.md
Table: file · title · URL · date · type (transcript/interview/article/analysis) · reliability (primary-own-words / reputable-third-party / forum-anecdote) · fetch status.

### NOTEBOOKLM.md
Create notebook → drag `sources/*` + `dossier.md` + `playbook.md` → chat / generate Audio Overview. Nothing more.

## Failure handling

- Transcript fetch fails → log in `_INDEX.md`, fall back to secondary coverage.
- A research lane finds nothing new → recorded as exhausted, not an error.
- Web sources conflict → both recorded, dated; newer headline.
- yt-dlp absent / blocked → attempt install via brew; if impossible, all transcript targets become `manual add candidate` and the build proceeds (source floor still enforceable via web sources).

## Success criteria (done means)

1. All 3 core files + NOTEBOOKLM.md exist and are MOC-linked.
2. ≥20 sources in `sources/` with a complete `_INDEX.md`.
3. Zero untagged revenue/scale claims in the dossier.
4. Loop-until-dry and completeness-critic rounds actually ran (logged in the run summary).
5. Advisor passes a test consult ("Should AIS niche down harder?") citing documented positions only.
6. Ian can drag the folder's files into NotebookLM with no cleanup.

## Out of scope / later

- Automated refresh ritual (Approach B) — deferred; Ian asks ad-hoc, formalize only if the profile gets weekly use.
- Voice/content modeling.
- Any further profiles (the folder convention `_claude-memory/profiles/<person>/` is intentionally reusable).
