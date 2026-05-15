# Skill: Vault Sync
**Category:** Agentic OS · Operations · Knowledge
**Status:** READY

## Prompt
Sync and audit the Obsidian vault for Agentic OS.

Vault location: /Users/ianveber/Documents/Obsidian Vault/

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

3. **Memory files** — confirm all _claude-memory/ files are up to date (check Last updated dates)

4. **Log files** — summarise recent agent runs from 04-Agent-Logs/

5. **Knowledge gaps** — any topics that appear in recent work but aren't in the knowledge base yet?

Output: brief audit report, flag anything needing attention
