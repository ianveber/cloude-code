---
source: cursor
sources:
  - cursor
---
# ChatGPT ↔ Claude ↔ Cursor ↔ Obsidian sync

Last updated: 2026-09-17

Upgrade path for the Mac vault: `connectors/obsidian/setup.md`.

## What is connected

| Surface | Role | How it stays in sync |
|---|---|---|
| **This repo** `./_claude-memory/` | Private cloud / source of truth | Git on `main`. All three models read/write these files. |
| **Cursor** | Code + ops agent | Native repo access. Rule: `.cursor/rules/memory.mdc`. |
| **Claude Code** | Code + ops agent | `CLAUDE.md` + `AGENTS.md`. |
| **ChatGPT** | Web operator | Custom GPT Actions → GitHub Contents API. Snapshot fallback: uploaded knowledge pack. |
| **Claude.ai** | Web operator | Project instructions + knowledge pack (or GitHub connector). |
| **Obsidian** | Local notebook | Symlink + `./scripts/memory-sync.sh`. Upgrade: `connectors/obsidian/setup.md`. |
| **Notion** | Human hub + live ops | MCP. Not a second memory dump. Hub: https://app.notion.com/p/3cea5cb8d3d2814f8cb2ecd4e05ed0e9 |

Full architecture: `docs/memory-cloud.md`. Connectors: `connectors/README.md`.

Cursor Cloud cannot see your Mac disk. Anything a cloud agent must know lives in this git repo.

## Upgrade Obsidian (Mac)

Two steps. Details: `connectors/obsidian/setup.md`.

1. **App:** Obsidian → Check for updates.
2. **Vault:** from the repo root:

```bash
./scripts/upgrade-obsidian.sh
```

That runs `link-obsidian-memory.sh`:

1. Copies any existing Obsidian `_claude-memory/` files into this repo if they are newer or missing here
2. Backs up the old vault folder to `_claude-memory.pre-sync-backup/`
3. Replaces the vault folder with a symlink to this repo

Open Obsidian after that. The `_claude-memory` notes should still appear; they now are these git files.

Then wire ChatGPT and Claude.ai using `connectors/README.md`.

Colored vault (same notes, LLM colors): `./scripts/memory-space.sh` — Claude orange, ChatGPT blue, Cursor purple. Docs: `docs/memory-space.md`.

## Daily loop

```
Obsidian (you)
    ↑ symlink
repo/_claude-memory  ←git→  Cursor + Claude Code
         ↑
         └── GitHub API (Actions) ← ChatGPT Custom GPT
         └── upload pack / GitHub connector ← Claude.ai
```

1. Agent starts → reads this folder (and `ledger.md` + `handoffs/`) → `Memory loaded — …`
2. Work happens
3. Agent ends → updates files here, appends `ledger.md`, writes a handoff if another model should continue
4. Commit + push (Cursor/Claude) or PUT via Actions (ChatGPT) so the other two see it

## Combining work across models

Do not paste chat transcripts. Write state:

- Durable facts → `context.md` / client files / `decisions-log.md`
- "I just did X" → `ledger.md`
- "You do Y next" → `handoffs/YYYY-MM-DD-from-to-to.md`

## What not to do

- Do not keep a second unsynced copy only on the Mac, only in a ChatGPT Project, or only in a Claude Project
- Do not ask any agent to remember context that is not written here
- Do not send email, close GitHub issues, delete Notion items, or change Calendar events without explicit confirmation (see `CLAUDE.md`)
