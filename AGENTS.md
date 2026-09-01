# Agent instructions — Claude + Cursor

This repo is Veta's operating system. **Claude Code and Cursor share one memory.**

## Session start (mandatory)

Before other work, read these files from `./_claude-memory/` (repo root):

1. `_claude-memory/🗺️ Master MOC.md`
2. `_claude-memory/context.md`
3. `_claude-memory/decisions-log.md`

Then, if the task needs them: `_claude-memory/ethospheres.md`, `_claude-memory/veta-agency.md`, `_claude-memory/agentic-os.md`, `_claude-memory/clients/*`.

Confirm with one line: `Memory loaded — [what's active].` Do not ask Ian to re-explain what is already in those files.

If you are on Ian's Mac and `./_claude-memory` is missing but `/Users/ianveber/Documents/Obsidian Vault/_claude-memory/` exists, read that path instead and say so. Then run `scripts/link-obsidian-memory.sh` so the two locations become one.

## Session end

Write back to `./_claude-memory/` only:

- New decisions → `decisions-log.md`
- Phase / task / file changes → the relevant client or `ethospheres.md` / `veta-agency.md`
- New personal or business context → `context.md`
- Update `Last updated` on every file you change

Confirm with `Memory updated.` and one line per file.

## Hard rules (both agents)

See `CLAUDE.md`. Short form:

- No email send/draft/schedule without explicit approval this session
- GitHub issues are read-only unless Ian confirms a write
- Do not delete Notion/GitHub items; do not change Calendar events
- If unsure whether an action is destructive, ask

## Daily briefing

When asked to run the morning brief, follow `CLAUDE.md` and write `./reports/YYYY-MM-DD-daily-briefing.md`.
