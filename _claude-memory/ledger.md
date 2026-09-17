# Ledger

Last updated: 2026-09-17

Append-only. Newest first. Every ChatGPT, Claude, or Cursor session that changes shared knowledge adds one entry. This is how the three models combine work without sharing a chat.

## Format

```
## YYYY-MM-DD — {chatgpt | claude | cursor | ian}

- Worked on:
- Files changed:
- For the other models:
```

---

## 2026-09-17 — cursor (merged + remaining Mac/account steps)

- Worked on: Merged PR #8 to main. Cloud VM has no Mac, no ChatGPT login, no Claude.ai login.
- Files changed: `connectors/YOU-DO-THIS.md` updated to remaining steps only.
- For the other models: Memory cloud is on `main`. Ian still links Obsidian and creates the GPT/Project.

---

## 2026-09-17 — cursor (Obsidian upgrade)

- Worked on: How to upgrade Obsidian so the Mac vault uses the private memory cloud (app update + symlink + memory-sync).
- Files changed: `connectors/obsidian/`, `scripts/upgrade-obsidian.sh`, `scripts/memory-sync.sh`, `SYNC.md`.
- For the other models: After merge, Ian runs `./scripts/upgrade-obsidian.sh` on the Mac, then `./scripts/memory-sync.sh` when he edits notes. Do not turn on Obsidian Sync. Do not git-init the personal vault.

## 2026-09-17 — cursor

- Worked on: Private memory cloud so ChatGPT, Claude, and Cursor share one knowledge base.
- Files changed: `docs/memory-cloud.md`, `connectors/**`, `_claude-memory/BOOT.md`, `_claude-memory/ledger.md`, `_claude-memory/handoffs/`, protocol updates in `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/memory.mdc`, `SYNC.md`.
- For the other models: Ian's remaining clicks are in `connectors/YOU-DO-THIS.md`. Merge PR #8, then Mac symlink, PAT, ChatGPT GPT, Claude Project.
