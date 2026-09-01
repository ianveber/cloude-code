# Claude ↔ Cursor ↔ Obsidian sync

Last updated: 2026-09-01

## What is connected

| Surface | Role | How it stays in sync |
|---|---|---|
| **This repo** `./_claude-memory/` | Source of truth | Git. Claude Code and Cursor both read/write these files. |
| **Obsidian** `~/Documents/Obsidian Vault/_claude-memory/` | Local reading + editing | Symlink to this folder. One copy, two apps. |
| **Notion** | Human hub + live ops | MCP on both Claude and Cursor. Hub page: https://app.notion.com/p/3cea5cb8d3d2814f8cb2ecd4e05ed0e9 (private draft — say where to move it). Do not treat Notion as a second memory dump. |
| **n8n / File Agent** | Runtime agents | Still write into the Obsidian vault tree (`Agentic-OS/`). After the symlink, vault memory notes and git memory are the same files. |

Cursor Cloud cannot see your Mac disk. Anything that must exist for a cloud agent has to live in this git repo.

## One-time setup on your Mac

From the repo root:

```bash
./scripts/link-obsidian-memory.sh
```

That script:

1. Copies any existing Obsidian `_claude-memory/` files into this repo if they are newer or missing here
2. Backs up the old vault folder to `_claude-memory.pre-sync-backup/`
3. Replaces the vault folder with a symlink to this repo

Open Obsidian after that. The `_claude-memory` notes should still appear; they now are these git files.

## Daily loop

```
Obsidian (you)  ←symlink→  repo/_claude-memory  ←git→  Claude Code + Cursor
                                    ↑
                         session start / session end writes
```

1. Agent starts → reads this folder → `Memory loaded — …`
2. Work happens (Claude or Cursor)
3. Agent ends → updates the relevant files here
4. Commit + push if you want the other agent / cloud runs to see it
5. You can also edit the same files in Obsidian; commit those too

## What not to do

- Do not keep a second unsynced copy of these notes only on the Mac
- Do not ask either agent to remember context that is not written here
- Do not send email, close GitHub issues, delete Notion items, or change Calendar events without explicit confirmation (see `CLAUDE.md`)
