# Shared agent memory

This folder is the **source of truth** for Claude Code and Cursor.

Both agents read and write these files. Obsidian on your Mac is the local editor — it should point at this same folder (see [`SYNC.md`](SYNC.md)).

## Provenance

Seeded 2026-09-01 from this repo (`docs/`, `skills/`, `CLAUDE.md`, dashboards) plus Notion (Business OS, VETA HQ, Multi-Business Hub). The local Obsidian vault at `/Users/ianveber/Documents/Obsidian Vault/_claude-memory/` was **not** reachable from Cursor Cloud. If that vault is richer, copy or merge it into this folder, then run `scripts/link-obsidian-memory.sh` so Obsidian and git stay one copy.

## Session rule

At the start of every session, read in this order:

1. `🗺️ Master MOC.md`
2. `context.md`
3. `decisions-log.md`

Then open client or knowledge files only if the task needs them. Confirm with: `Memory loaded — [one line].`

At session end, write decisions, status changes, and new files back here. Update `Last updated` on every file you change.
