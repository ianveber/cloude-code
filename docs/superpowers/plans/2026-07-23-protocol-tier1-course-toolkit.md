# Protocol Tier 1 — Course + Toolkit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Package the built AI Infrastructure Protocol into a versioned, installable, sellable self-serve bundle (course PDFs + Claude Code skill-pack + install/quickstart/license + a self-serve sales page), assembled by a one-command build script.

**Architecture:** A new `ai-infrastructure-protocol/product/tier1/` tree holds authored bundle source + a build script that copies the *redistribution-cleared* protocol assets into a staging dir and zips a versioned artifact into `product/tier1/dist/`. Nothing new is invented — this is packaging + authoring + a licensing gate. Content/packaging task, so "tests" are structural verifications (file presence, zip integrity, no broken references), not unit tests.

**Tech Stack:** Markdown, bash (zip), the existing `make-pdf` binary for the sales page, the protocol's existing PDFs + skills.

**Blocks on Ian (go-live only, NOT the build):** storefront account (Lemonsqueezy rec.), tier-1 price, product name/brand, whether Pillar 4 ships as honest draft.

---

### Task 1: Toolkit redistribution audit (licensing gate)

**Files:**
- Create: `ai-infrastructure-protocol/product/tier1/INCLUDE-MANIFEST.md`

- [ ] **Step 1: Enumerate every skill currently in the toolkit**

Run:
```bash
cd "/Users/ianveber/Desktop/Cloude CODE/ai-infrastructure-protocol"
find skills -maxdepth 2 -name SKILL.md | sort
```
Expected: the list of bundled skills across the 6 categories (advisors, agents, build, business, knowledge-tools, security).

- [ ] **Step 2: Classify each skill's origin + redistribution right**

For each skill, determine origin from its content/provenance: **(a) Ian-original** (written for the protocol / his own), **(b) third-party** (gstack, `anthropic-skills:*`, ai-universa pack, other vendors). Third-party skills are **not resellable** without their license permitting redistribution.

- [ ] **Step 3: Write `INCLUDE-MANIFEST.md`**

A table with columns: `skill | category | origin | redistributable? (yes/no/ask-Ian) | reason`. Default any uncertain third-party skill to **`ask-Ian`** and exclude it from the bundle until cleared. Advisor lenses (from ai-universa) and any `gstack`/`anthropic-skills` derivatives → `no` unless Ian confirms he authored/owns them.

- [ ] **Step 4: Verify the manifest is complete**

Run:
```bash
grep -c "|" ai-infrastructure-protocol/product/tier1/INCLUDE-MANIFEST.md
```
Expected: one row per skill found in Step 1 (plus header). Every skill classified; no blanks in the `redistributable?` column.

- [ ] **Step 5: Commit**

```bash
git add ai-infrastructure-protocol/product/tier1/INCLUDE-MANIFEST.md
git commit -m "docs(protocol-tier1): redistribution audit of toolkit skills"
```

---

### Task 2: Bundle scaffold + front-door README

**Files:**
- Create: `ai-infrastructure-protocol/product/tier1/bundle-src/README.md`

- [ ] **Step 1: Create the bundle source dir + README**

`README.md` content = the bundle front door: what this is (the AI Infrastructure Protocol as a self-serve course + toolkit), what's inside (`/course` = 6 PDFs, `/toolkit` = Claude Code skills, INSTALL/QUICKSTART/LICENSE), the honest model (guided DIY — access/discovery/trust need you, the runbooks make them frictionless), and "start with `00-operating-manual.pdf`, then INSTALL.md."

- [ ] **Step 2: Verify**

Run: `test -f ai-infrastructure-protocol/product/tier1/bundle-src/README.md && echo OK`
Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add ai-infrastructure-protocol/product/tier1/bundle-src/README.md
git commit -m "feat(protocol-tier1): bundle front-door README"
```

---

### Task 3: COURSE.md (sequence the 6 PDFs as lessons)

**Files:**
- Create: `ai-infrastructure-protocol/product/tier1/bundle-src/COURSE.md`

- [ ] **Step 1: Write COURSE.md**

A numbered learning path mapping each PDF to a lesson with a 1-2 line "what you'll get" + "do this after": `00-operating-manual` (orientation) → `01` infra scan+blueprint (run G0/G1) → `02` agent factory (G3 build) → `03` security standard (the security gate) → `05` investor-criteria research → `04-investor-readiness-DRAFT` (labeled: research real, house weights land in a free update). Each lesson names the matching toolkit skill/RUNBOOK to invoke.

- [ ] **Step 2: Verify no lesson references a missing PDF**

Run:
```bash
for f in 00-operating-manual 01-pillar-infrastructure-scan-blueprint 02-pillar-agent-factory 03-security-standard 04-investor-readiness-DRAFT 05-investor-criteria-research; do
  grep -q "$f" ai-infrastructure-protocol/product/tier1/bundle-src/COURSE.md || echo "MISSING REF: $f";
done; echo done
```
Expected: `done` with no `MISSING REF` lines.

- [ ] **Step 3: Commit**

```bash
git add ai-infrastructure-protocol/product/tier1/bundle-src/COURSE.md
git commit -m "feat(protocol-tier1): COURSE.md learning path"
```

---

### Task 4: INSTALL.md + QUICKSTART.md

**Files:**
- Create: `ai-infrastructure-protocol/product/tier1/bundle-src/INSTALL.md`
- Create: `ai-infrastructure-protocol/product/tier1/bundle-src/QUICKSTART.md`

- [ ] **Step 1: Write INSTALL.md**

Prerequisites (Claude Code installed + basic terminal comfort — stated plainly as the buyer-fit gate). Steps: copy `toolkit/skills/*` into `~/.claude/skills/`, copy `toolkit/PROTOCOL.md` + pillars to a working dir, verify skills load (`/` shows them), where the PDFs live. Include the exact `cp -R` commands and a "verify install" check.

- [ ] **Step 2: Write QUICKSTART.md**

The 20-minute first run: open `00-operating-manual.pdf` → invoke the G0 SCAN skill on your own company → produce the first blueprint artifact → what the human-gates (access/discovery/trust) ask of you and how the RUNBOOKs walk them. Concrete first commands.

- [ ] **Step 3: Verify both exist + reference real toolkit paths**

Run:
```bash
ls ai-infrastructure-protocol/product/tier1/bundle-src/INSTALL.md ai-infrastructure-protocol/product/tier1/bundle-src/QUICKSTART.md
grep -q "~/.claude/skills" ai-infrastructure-protocol/product/tier1/bundle-src/INSTALL.md && echo OK
```
Expected: both listed, `OK` printed.

- [ ] **Step 4: Commit**

```bash
git add ai-infrastructure-protocol/product/tier1/bundle-src/INSTALL.md ai-infrastructure-protocol/product/tier1/bundle-src/QUICKSTART.md
git commit -m "feat(protocol-tier1): INSTALL + QUICKSTART guides"
```

---

### Task 5: LICENSE.md (single-company license)

**Files:**
- Create: `ai-infrastructure-protocol/product/tier1/bundle-src/LICENSE.md`

- [ ] **Step 1: Write LICENSE.md**

Plain-language license: single-company/single-buyer use, internal use permitted, **no resale / no redistribution / no sublicensing of the protocol or its skills**, updates policy, no-warranty, governing law placeholder = Slovenia. Leave `[BUYER]`/`[DATE]` as fill fields (these are legitimate license fields, not plan placeholders).

- [ ] **Step 2: Verify**

Run: `grep -qi "no resale\|redistribut" ai-infrastructure-protocol/product/tier1/bundle-src/LICENSE.md && echo OK`
Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add ai-infrastructure-protocol/product/tier1/bundle-src/LICENSE.md
git commit -m "feat(protocol-tier1): single-company LICENSE"
```

---

### Task 6: build-bundle.sh (assemble + version + zip)

**Files:**
- Create: `ai-infrastructure-protocol/product/tier1/build-bundle.sh`
- Create: `ai-infrastructure-protocol/product/tier1/VERSION` (contents: `1.0.0`)

- [ ] **Step 1: Write VERSION**

Run: `echo "1.0.0" > ai-infrastructure-protocol/product/tier1/VERSION`

- [ ] **Step 2: Write build-bundle.sh**

Script that: reads `VERSION`; makes a clean staging dir `build/ai-native-protocol-toolkit-v$VERSION/`; copies `bundle-src/*` (README, COURSE, INSTALL, QUICKSTART, LICENSE) to the staging root; copies `knowledge/*.pdf` → `staging/course/`; copies `PROTOCOL.md`, `pillars/*/SKILL.md`, `pillars/*/RUNBOOK.md`, `SKILLS-MANIFEST.md`, `DELIVERY-MAP.md` → `staging/toolkit/`; copies **only redistribution-cleared** `skills/<cat>` per `INCLUDE-MANIFEST.md` → `staging/toolkit/skills/` (for v1, copy the whole `skills/` tree but `set -e` fails loudly if `INCLUDE-MANIFEST.md` still contains any `ask-Ian` row — forces the audit to be resolved before a shippable zip exists); resolves symlinks to real files (`cp -RL`) so the bundle is portable; zips staging → `dist/ai-native-protocol-toolkit-v$VERSION.zip`. Make it idempotent (`rm -rf build/ dist/` first) and `chmod +x`.

- [ ] **Step 3: Verify the script is syntactically valid**

Run: `bash -n ai-infrastructure-protocol/product/tier1/build-bundle.sh && echo OK`
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add ai-infrastructure-protocol/product/tier1/build-bundle.sh ai-infrastructure-protocol/product/tier1/VERSION
git commit -m "feat(protocol-tier1): one-command bundle build script"
```

---

### Task 7: Run the build + verify the bundle (the integration "test")

**Files:** none (produces `dist/`)

- [ ] **Step 1: Run the build**

Run: `cd ai-infrastructure-protocol/product/tier1 && bash build-bundle.sh`
Expected: exits 0 (or fails loudly if an `ask-Ian` row is unresolved — that's correct behavior), prints the dist path.

- [ ] **Step 2: Verify zip contents**

Run:
```bash
unzip -l ai-infrastructure-protocol/product/tier1/dist/ai-native-protocol-toolkit-v1.0.0.zip | grep -E "course/.*\.pdf|toolkit/PROTOCOL.md|toolkit/skills/|README.md|COURSE.md|INSTALL.md|QUICKSTART.md|LICENSE.md" | head -30
```
Expected: 6 PDFs under `course/`, `PROTOCOL.md` + skills under `toolkit/`, and all 5 authored docs at root.

- [ ] **Step 3: Verify no dangling symlinks / broken skill refs in staging**

Run:
```bash
find ai-infrastructure-protocol/product/tier1/build -type l | head
```
Expected: empty (all symlinks resolved to real files by `cp -RL`).

- [ ] **Step 4: Commit the dist artifact + a build note**

```bash
git add ai-infrastructure-protocol/product/tier1/dist/ 2>/dev/null; git commit -m "chore(protocol-tier1): first bundle build v1.0.0" || echo "dist gitignored — ok"
```

---

### Task 8: Self-serve sales page

**Files:**
- Create: `ai-infrastructure-protocol/product/tier1/sales/index.html`

- [ ] **Step 1: Write the sales page**

Reuse the premium light-editorial style of `commercial/onepager.html` (print-clean A4, verified-render pipeline), but for the **self-serve** buyer: headline on "own the AI-Native build protocol," what's inside (course + toolkit), the honest guided-DIY framing, who it's for (has Claude Code / basic terminal), and a **"Buy / Download"** CTA (not "Apply for a Scan"). Leave `[PRICE]`, `[PRODUCT-NAME]`, `[BUY-URL]` as clearly-marked fill fields pending Ian's go-live decisions.

- [ ] **Step 2: Verify it renders**

Run: `"$HOME/.claude/skills/gstack/make-pdf/dist/pdf" generate ai-infrastructure-protocol/product/tier1/sales/index.html /tmp/tier1-sales.pdf 2>&1 | tail -2`
Expected: a PDF path printed (renders clean).

- [ ] **Step 3: Commit**

```bash
git add ai-infrastructure-protocol/product/tier1/sales/index.html
git commit -m "feat(protocol-tier1): self-serve sales page"
```

---

### Task 9: Go-live checklist (hand-off doc for Ian's 4 decisions)

**Files:**
- Create: `ai-infrastructure-protocol/product/tier1/GO-LIVE.md`

- [ ] **Step 1: Write GO-LIVE.md**

The exact remaining steps that need Ian: (1) pick tier-1 **price**; (2) pick **product name/brand**; (3) create **Lemonsqueezy** account + product listing + upload the zip + set license-key delivery; (4) decide **Pillar 4** ships-as-draft y/n; (5) fill `[PRICE]`/`[PRODUCT-NAME]`/`[BUY-URL]` in the sales page + re-render. Each with where to click.

- [ ] **Step 2: Commit**

```bash
git add ai-infrastructure-protocol/product/tier1/GO-LIVE.md
git commit -m "docs(protocol-tier1): go-live checklist for Ian"
```

---

## Self-Review

**Spec coverage:** §3.1 bundle contents → Tasks 2-6; §3.2 form/ZIP → Tasks 6-7; §3.3 distribution → Task 9 (Ian-gated); §3.4 sales page → Task 8; §3.5 Ian's calls → Task 9; the honest-framing constraint → Tasks 2/3/4 messaging; the redistribution risk → Task 1 (gate). §7 "tier-1 done" definition → all tasks + Task 9 covers the storefront-pending remainder.

**Placeholder scan:** The only `[BRACKET]` fields are legitimate fill-ins (license buyer/date, sales-page price/name/url) that are explicitly Ian-gated and documented in GO-LIVE.md — not plan placeholders. No "TBD/implement later."

**Consistency:** Paths use `ai-infrastructure-protocol/product/tier1/` throughout; bundle-src file names (README/COURSE/INSTALL/QUICKSTART/LICENSE) match across Tasks 2-8 and the build script (Task 6) copies exactly those.
