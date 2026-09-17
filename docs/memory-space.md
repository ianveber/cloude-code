# Memory Space

Last updated: 2026-09-17

An Obsidian-style viewer for `_claude-memory/`, in this repo. You can see **which LLM wrote each note**.

| Writer | Color |
|---|---|
| Claude | orange `#F97316` |
| ChatGPT | blue `#3B82F6` |
| Cursor | purple `#A855F7` |
| Ian | teal `#2DD4BF` |

## Open it

```bash
./scripts/memory-space.sh
```

Browser: `http://127.0.0.1:8765/memory-space/`

Rebuild after memory edits:

```bash
python3 scripts/build-memory-space.py
```

This is private business memory. Serve it locally. Do not deploy `memory-space/` to a public host.

## How color is decided

1. YAML frontmatter on the note: `source:` (last writer) and `sources:` (everyone who touched it)
2. Inline blocks: `<!-- source:claude --> … <!-- /source -->`
3. Handoff filenames: `2026-09-17-claude-to-cursor.md` → Claude
4. `ledger.md` headings: `## 2026-09-17 — chatgpt` plus any `` Files changed: `path` ``

Agents must stamp `source` / `sources` when they write. Protocol: `AGENTS.md`, `.cursor/rules/memory.mdc`, `connectors/chatgpt/gpt-instructions.md`, `connectors/claude/project-instructions.md`.

## What it is not

Not a second copy of the vault. Not a replacement for Obsidian on the Mac. It reads the same git files.
