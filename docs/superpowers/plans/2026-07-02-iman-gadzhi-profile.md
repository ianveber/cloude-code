# Iman Gadzhi Context Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. NOTE: Tasks 3, 5, 7, 8 call the Workflow tool, which only works in the MAIN session — do not dispatch those tasks to subagents; the workflow itself IS the subagent fan-out.

**Goal:** Build a deep-researched, source-grounded Iman Gadzhi profile (dossier + playbook + advisor + NotebookLM-ready source pack) in the Obsidian vault.

**Architecture:** Multi-agent deep research (7 web lanes + transcript lane, loop-until-dry, adversarial claim verification, completeness critic) feeds a claims ledger; three core vault files are authored only from the verified ledger; `sources/` doubles as the manual NotebookLM upload pack.

**Tech Stack:** Claude Code Workflow orchestration (WebSearch/WebFetch subagents), yt-dlp for transcripts, Obsidian vault markdown. No app code.

**Spec:** `docs/superpowers/specs/2026-07-02-iman-gadzhi-profile-design.md`

**Vault target:** `/Users/ianveber/Documents/Obsidian Vault/_claude-memory/profiles/iman-gadzhi/`
**Working dir for intermediates:** `/tmp/iman-research/` (claims ledger, raw transcripts, round logs — NOT the vault; vault gets only finished files)

---

### Task 1: Scaffold vault folder + static files

**Files:**
- Create: `_claude-memory/profiles/iman-gadzhi/NOTEBOOKLM.md`
- Create: `_claude-memory/profiles/iman-gadzhi/sources/_INDEX.md`
- Create: `/tmp/iman-research/` (scratch)

- [ ] **Step 1: Create directories**

Run: `mkdir -p "/Users/ianveber/Documents/Obsidian Vault/_claude-memory/profiles/iman-gadzhi/sources" /tmp/iman-research`

- [ ] **Step 2: Write NOTEBOOKLM.md** (exact content)

```markdown
# NotebookLM setup (manual — NotebookLM has no API)
1. Go to notebooklm.google.com → New notebook → name it "Iman Gadzhi".
2. Drag in every file from `sources/` plus `dossier.md` and `playbook.md`.
3. Chat with the sources, or Studio → Audio Overview for a podcast version.
4. When the profile is re-researched, delete + re-drag the changed files.
5. `advisor.md` stays out — that one is for Claude sessions, not NotebookLM.
```

- [ ] **Step 3: Write sources/_INDEX.md header** (exact content)

```markdown
# Source Index — Iman Gadzhi profile
Last updated: 2026-07-02

| file | title | url | published | type | reliability | fetch status |
|---|---|---|---|---|---|---|
```

- [ ] **Step 4: Verify**

Run: `ls -R "/Users/ianveber/Documents/Obsidian Vault/_claude-memory/profiles/iman-gadzhi"`
Expected: `NOTEBOOKLM.md`, `sources/_INDEX.md`.

### Task 2: Transcript tooling check

**Files:** none (environment check)

- [ ] **Step 1: Check/install yt-dlp**

Run: `command -v yt-dlp || brew install yt-dlp`

- [ ] **Step 2: Smoke-test subtitle fetch on one known Iman video**

Run: `yt-dlp --skip-download --write-auto-subs --sub-langs "en.*" --sub-format vtt -o "/tmp/iman-research/probe.%(ext)s" "<first result URL from a WebSearch for: Iman Gadzhi how to start an agency youtube>" && ls /tmp/iman-research/probe*`
Expected: a `.vtt` file exists.

- [ ] **Step 3: If fetch fails** (403/region/bot-check): record `TRANSCRIPTS=manual` in `/tmp/iman-research/env.txt`; every transcript target in Task 4 then becomes `manual add candidate` in `_INDEX.md` and its content is covered via web sources instead. Build continues either way.

### Task 3: Deep research Phase 1 — 7-lane sweep (Workflow, main session)

**Files:**
- Create: `/tmp/iman-research/round1-<lane>.json` (one per lane, workflow output saved by orchestrator)

- [ ] **Step 1: Run the Workflow.** Script shape (schemas abbreviated here; use this structure verbatim):

```js
export const meta = { name: 'iman-sweep-r1', description: 'Round-1 7-lane research sweep on Iman Gadzhi', phases: [{ title: 'Sweep' }] }
const FINDINGS = { type:'object', required:['facts','sources','gaps'], properties:{
  facts:{type:'array',items:{type:'object',required:['claim','source_url','confidence'],properties:{claim:{type:'string'},source_url:{type:'string'},source_title:{type:'string'},date:{type:'string'},confidence:{enum:['high','medium','low']}}}},
  sources:{type:'array',items:{type:'object',required:['url','title','type','reliability'],properties:{url:{type:'string'},title:{type:'string'},type:{enum:['transcript','interview','article','analysis','own-page','video']},date:{type:'string'},reliability:{enum:['primary-own-words','reputable-third-party','forum-anecdote']}}}},
  frameworks:{type:'array',items:{type:'object',properties:{name:{type:'string'},summary:{type:'string'},source_url:{type:'string'}}}},
  video_candidates:{type:'array',items:{type:'object',properties:{title:{type:'string'},url:{type:'string'},why:{type:'string'}}}},
  gaps:{type:'array',items:{type:'string'}} } }
const LANES = [
  {key:'bio', prompt:'Research Iman Gadzhi biography & timeline: birth (1999/2000, Dagestan-born, raised London), school dropout at 17, IAG Media founding, year-by-year through 2026. Use WebSearch + WebFetch. Return structured facts w/ source URLs. Distinguish his own claims from third-party corroboration.'},
  {key:'empire', prompt:'Research Iman Gadzhi business entities: IAG Media (agency), Grow Your Agency → Educate.io (education), GADZHI (watches), AGX/agenC or other software/ventures, GetHighTicketClients, any funds/investments. For each: what it is, status, ownership, revenue CLAIMS vs verified figures. Sources required.'},
  {key:'frameworks', prompt:'Extract Iman Gadzhi TEACHING FRAMEWORKS in his own words: SMMA agency model, niche selection, outreach/sales system, offer construction, pricing, retainers, hiring, the agency-to-education flywheel. Cite specific videos/pages where each framework is taught.'},
  {key:'edu-mechanics', prompt:'Research the mechanics of Iman Gadzhi education business: Agency Navigator / Agency Incubator / Six Figure Sales Rep / Copy Paste Agency era, Educate.io launch, pricing history, funnel structure, community model, launch tactics, affiliate/ads strategy. Sources required.'},
  {key:'criticism', prompt:'Research criticism & controversies around Iman Gadzhi: course-selling criticism, income-claim skepticism, refund complaints, fake-guru debates, journalist/YouTuber takedowns, any legal/regulatory issues. Be specific, name critics, cite sources. This lane exists so the profile is not a fanboy document.'},
  {key:'recent', prompt:'Research Iman Gadzhi 2024–2026: current focus, pivots, new ventures, public statements, interviews, notable posts. What is he doing NOW (as of mid-2026)? Sources required.'},
  {key:'third-party', prompt:'Find third-party ANALYSES of Iman Gadzhi: journalists, business YouTubers, Reddit/forum deep-dives dissecting his business model, marketing analyses of his funnel. Prioritize substantive pieces over gossip. Sources required.'}
]
const results = await parallel(LANES.map(l => () => agent(l.prompt + ' Also list high-value BUSINESS video candidates (not lifestyle vlogs) for transcript fetching, and note gaps you could not resolve.', {label:`sweep:${l.key}`, phase:'Sweep', schema:FINDINGS})))
return { lanes: LANES.map((l,i)=>({lane:l.key, result:results[i]})) }
```

- [ ] **Step 2: Save each lane result** to `/tmp/iman-research/round1-<lane>.json` (Write tool, orchestrator).
- [ ] **Step 3: Verify:** every lane returned ≥5 facts + ≥3 sources, or its gaps explain why. Merge all `video_candidates` into `/tmp/iman-research/video-candidates.json`.

### Task 4: Transcript lane

**Files:**
- Create: `_claude-memory/profiles/iman-gadzhi/sources/yt-<slug>.md` (12–20 files, or fewer with logged failures)
- Modify: `sources/_INDEX.md` (append rows)

- [ ] **Step 1: Pick 12–20 targets** from `video-candidates.json` — business/framework videos ranked by relevance to playbook lanes; dedupe by topic.
- [ ] **Step 2: Fetch each**

Run per video: `yt-dlp --skip-download --write-auto-subs --sub-langs "en.*" --sub-format vtt -o "/tmp/iman-research/yt/%(id)s.%(ext)s" "<url>"`

- [ ] **Step 3: Clean VTT → text** (strip timestamps/dupes):

```bash
python3 - <<'EOF'
import re, sys, pathlib
for p in pathlib.Path('/tmp/iman-research/yt').glob('*.vtt'):
    lines, seen, out = p.read_text().splitlines(), set(), []
    for l in lines:
        l = re.sub(r'<[^>]+>', '', l).strip()
        if not l or '-->' in l or l.startswith(('WEBVTT','Kind:','Language:')) or l.isdigit(): continue
        if l not in seen: seen.add(l); out.append(l)
    p.with_suffix('.txt').write_text('\n'.join(out))
print('done')
EOF
```

- [ ] **Step 4: Author `yt-<slug>.md`** per video with the source-file template (below) + full cleaned transcript.

Template (all source files, yt- and web-):
```markdown
# <Title>
Source: <URL>
Type: transcript
Published: <YYYY-MM-DD or unknown>
Fetched: 2026-07-02
Reliability: primary-own-words

---
<content>
```

- [ ] **Step 5: Log every video in `_INDEX.md`** — fetched ones as `fetched`, failures as `manual add candidate`.
- [ ] **Step 6: Verify:** `ls sources/yt-*.md | wc -l` + `_INDEX.md` rows account for ALL targets (fetched + failed).

### Task 5: Loop-until-dry research rounds (Workflow, main session)

**Files:**
- Create: `/tmp/iman-research/round<N>-<lane>.json`
- Create: `/tmp/iman-research/run-log.md` (rounds, new-fact counts per lane)

- [ ] **Step 1:** For each lane, run a follow-up agent: same lane prompt + "Here is what we already know: <facts summary + gaps from prior rounds>. Find ONLY new facts/sources not in this list. Chase the listed gaps first. Return empty facts array if genuinely nothing new."
- [ ] **Step 2:** Repeat rounds until **2 consecutive rounds across all lanes yield no new facts** (dedupe by claim text similarity + source URL). Log per-round new-fact counts in `run-log.md`.
- [ ] **Step 3: Verify:** run-log shows the dry condition was actually met, not just N rounds run.

### Task 6: Author web source files + finalize index

**Files:**
- Create: `sources/web-<slug>.md` (enough that total sources ≥20)
- Modify: `sources/_INDEX.md`

- [ ] **Step 1:** From all rounds' `sources`, select the best ≥12 web sources (dedupe; prefer primary + reputable-third-party; keep ≥3 critical/skeptical pieces).
- [ ] **Step 2:** WebFetch each; author `web-<slug>.md` with the template (Type: interview/article/analysis/own-page) + fetched content or a faithful detailed summary when full text is paywalled (note `summary-only` in the file).
- [ ] **Step 3:** Complete `_INDEX.md` — every file one row; update `Last updated`.
- [ ] **Step 4: Verify source floor:** `ls sources/ | grep -c -E '^(yt|web)-'` ≥ 20. If short, return to Task 5 for another round targeting new source types.

### Task 7: Claims ledger + adversarial verification (Workflow, main session)

**Files:**
- Create: `/tmp/iman-research/claims-ledger.json`

- [ ] **Step 1:** Merge all rounds' facts into a deduped ledger: `[{id, claim, source_urls[], confidence}]`.
- [ ] **Step 2:** Workflow: for each dossier-bound claim, one verifier agent prompted to REFUTE: "Try to refute or corroborate: '<claim>'. Search independently — do not trust the provided source. Verdict: verified (independent corroboration) / his-own-figure-only / contested / false. Cite what you found." Schema: `{verdict, evidence_urls[], note}`.
- [ ] **Step 3:** Write verdicts back into the ledger. Tag mapping: verified→`[verified]`, his-own-figure-only→`[claim — his own figure]`, contested→`[contested — see sources]`, false→exclude from dossier (log in run-log).
- [ ] **Step 4: Verify:** every revenue/scale/success claim in the ledger has a verdict; zero untagged.

### Task 8: Completeness critic (Workflow, main session)

**Files:**
- Modify: `/tmp/iman-research/run-log.md`

- [ ] **Step 1:** One critic agent gets the ledger + lane summaries + source index: "What is missing from this Iman Gadzhi research? Lanes not exhausted, known events uncovered, framework taught but not sourced, criticism unaddressed, 2025–2026 gaps? Return a punch list."
- [ ] **Step 2:** If the punch list is non-empty: run one targeted research round on those items (same mechanics as Task 5), fold results into ledger + sources.
- [ ] **Step 3: Verify:** punch list items resolved or explicitly logged as unresolvable in run-log.

### Task 9: Author dossier.md

**Files:**
- Create: `_claude-memory/profiles/iman-gadzhi/dossier.md`

- [ ] **Step 1:** Write from the verified ledger ONLY. Structure (exact):

```markdown
---
name: iman-gadzhi-dossier
description: Verified factual profile of Iman Gadzhi — bio, timeline, companies, controversies
type: reference
---
# Iman Gadzhi — Dossier
Last researched: 2026-07-02

## Identity
## Timeline (year by year)
## Companies & ventures
| Entity | What | Role | Status | Revenue [tag] | Sources |
## Revenue & scale claims
## Controversies & criticism
## Open questions
```

Every figure carries its tag inline. Every section cites `[[sources/...]]` files or URLs.
- [ ] **Step 2: Verify:** grep for digits+currency in the file; each hit has a `[verified]`/`[claim`/`[contested` tag on the line. Zero misses.

### Task 10: Author playbook.md

**Files:**
- Create: `_claude-memory/profiles/iman-gadzhi/playbook.md`

- [ ] **Step 1:** One section per framework found in research (expected: offer construction; agency→education flywheel; pricing psychology; personal-brand-as-distribution; outreach/sales system; hiring/ops; self-improvement × business positioning — final list from ledger). Each section:

```markdown
## <Framework>
**The framework:** <mechanics, in substance his own teaching>
**Evidence:** [[sources/yt-...]], <urls>
**Map to Ian:** <concrete application to AIS / ATHLOS / client work — omit this line entirely if the mapping is forced>
```

- [ ] **Step 2: Verify:** every section has ≥1 evidence link; "Map to Ian" present only where genuinely applicable.

### Task 11: Author advisor.md

**Files:**
- Create: `_claude-memory/profiles/iman-gadzhi/advisor.md`

- [ ] **Step 1:** Structure (exact):

```markdown
---
name: iman-gadzhi-advisor
description: "What would Iman do" persona — decision heuristics, biases, consult protocol
type: reference
---
# Iman Gadzhi — Advisor Persona

## Decision heuristics (documented)
## What he optimizes for
## Known biases & blind spots
## How to run a consult (instructions for Claude)
- Answer ONLY from documented positions in [[dossier]] / [[playbook]] / sources — cite which.
- If no documented position exists: say "no documented position" and reason from his heuristics, explicitly labeled as extrapolation.
- Always include the blind-spot check: would this advice survive his known biases?
```

- [ ] **Step 2: Test consult:** run "Should AIS niche down harder?" through the persona. PASS = every recommendation cites a documented position or is labeled extrapolation.

### Task 12: MOC wiring + memory + wrap-up

**Files:**
- Modify: `_claude-memory/🗺️ Master MOC.md` (Knowledge Base section — add Profiles subsection)
- Modify: `_claude-memory/decisions-log.md` (session entry)
- Create: `~/.claude/projects/-Users-ianveber-Desktop-Cloude-CODE/memory/project_iman_gadzhi_profile.md` + MEMORY.md pointer

- [ ] **Step 1:** Add to Master MOC under Knowledge Base:

```markdown
### Profiles
- [[profiles/iman-gadzhi/dossier]] — verified facts, timeline, companies, controversies
- [[profiles/iman-gadzhi/playbook]] — his frameworks + Map-to-Ian notes
- [[profiles/iman-gadzhi/advisor]] — "What would Iman do" consult persona
```

- [ ] **Step 2:** Decisions-log entry + auto-memory file (what was built, where, how to refresh).
- [ ] **Step 3: Final acceptance check** against spec success criteria 1–6; write the run summary (rounds, source counts, verdict stats, transcript failures) at the bottom of `_INDEX.md`.
- [ ] **Step 4: Commit** (repo files only — the vault is outside git): `git add docs/superpowers/plans/2026-07-02-iman-gadzhi-profile.md && git commit -m "plan(profiles): iman gadzhi profile implementation plan"`
