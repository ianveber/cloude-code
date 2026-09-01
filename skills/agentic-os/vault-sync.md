# Skill: Vault Sync
**Category:** Agentic OS · Operations · Knowledge
**Status:** READY

## Prompt
Sync and audit the Obsidian vault for Agentic OS.

Shared memory (Claude + Cursor): ./_claude-memory/ in this repo. That is the source of truth.

Obsidian vault (Mac): /Users/ianveber/Documents/Obsidian Vault/
After `./scripts/link-obsidian-memory.sh`, vault `_claude-memory/` is a symlink to the repo folder. See `_claude-memory/SYNC.md`.

Check the following:
1. **Agentic-OS folder** — are all 6 subfolders present and accessible?
   - 00-Inbox/ (agent outputs needing review)
   - 01-Daily/ (Calendar Agent briefs)
   - 02-Projects/ (Project Agent reports)
   - 03-Contacts/ (auto-built contact notes)
   - 04-Agent-Logs/ (all agent run logs)
   - 05-Knowledge/ (Knowledge Agent extractions)
   - _System/ (config, prompts, templates)

2. **Recent agent outputs** — list any new files in 00-Inbox/ that need Ian's attention

3. **Memory files** — confirm all ./_claude-memory/ files are up to date (check Last updated dates). If the Mac vault folder is a real directory instead of a symlink, flag it and run scripts/link-obsidian-memory.sh.

4. **Log files** — summarise recent agent runs from 04-Agent-Logs/

5. **Knowledge gaps** — any topics that appear in recent work but aren't in the knowledge base yet?

Output: brief audit report, flag anything needing attention
