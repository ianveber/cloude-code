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

## 2026-09-17 — cursor (Biomasa console UX)

- Worked on: Browser-verified the read-only Biomasa console. Fröling generate works without the Eko sklad checkbox; kurilna generate does not. Export stays blocked until approve. Queue CTA no longer concatenates onto hashtags. Mobile hamburger restores nav (sidebar used to vanish ≤820px).
- Files changed: `biomasa-social.html` (hamburger + queue CTA), this ledger, `clients/biomasa.md`, handoff
- For the other models: PR #13. Still do not post. Still do not email Maja. Original Claude zip/docx still not in `agents/energy-biomasa/source/`.

## 2026-09-17 — cursor (Biomasa social agent)

- Worked on: Continued Claude/iPROM Biomasa social-media agent. Gmail has `BIOMASA_digitalna_revizija.docx/.xlsx` (16 Sep, to Maja Gorjanc) and `session-export-1789638664349.zip` (17 Sep); MCP cannot download attachments.
- Files changed: `biomasa-social.html`, `agents/energy-biomasa/**`, `dashboard.html` nav, `_claude-memory/clients/biomasa.md`
- For the other models: Read-only operator console. Do not auto-post. Do not email iPROM. Drop the original audit files into `agents/energy-biomasa/source/` when available. Ambassador is iPROM+Retoba.

## 2026-09-17 — cursor (Mac path was wrong)

- Worked on: Ian's Terminal failed because `~/Desktop/Cloude CODE` does not exist. Setup now clones to `~/Desktop/cloude-code` if needed.
- Files changed: `connectors/YOU-DO-THIS.md`, `scripts/mac-bootstrap.sh`
- For the other models: Do not tell Ian to cd into Desktop/Cloude CODE.

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
