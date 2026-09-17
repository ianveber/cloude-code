# Handoff — cursor → ian (then chatgpt + claude)

Date: 2026-09-17
Status: open

## Goal

Turn on the private memory cloud so ChatGPT, Claude, and Cursor share `_claude-memory/` in `ianveber/cloude-code`.

## Context already in memory

- `docs/memory-cloud.md`
- `connectors/README.md`
- `_claude-memory/BOOT.md`
- `_claude-memory/ledger.md`

## Done so far

- Repo vault `_claude-memory/` (Claude + Cursor + Obsidian) extended into a three-model cloud.
- ChatGPT Custom GPT instructions + GitHub OpenAPI Actions spec.
- Claude.ai Project instructions.
- Export script for a knowledge pack ChatGPT/Claude can upload.
- Session protocol: load MOC/context/decisions/ledger; write ledger + handoffs at end.

## Your next actions

1. Merge this PR to `main`.
2. On the Mac: `./scripts/link-obsidian-memory.sh`
3. Create a fine-grained GitHub PAT (this repo, Contents read/write) and the ChatGPT Custom GPT using `connectors/chatgpt/setup.md`.
4. Create a Claude.ai Project using `connectors/claude/setup.md`.
5. Run `./scripts/export-memory-pack.sh` and upload `connectors/chatgpt/knowledge-pack.md` to both web UIs.
6. Test: add a line to `ledger.md` in Cursor, push, ask ChatGPT "read ledger.md".

## Do not

- Do not paste a classic GitHub PAT with access to every repo.
- Do not treat a ChatGPT or Claude Project upload as a second source of truth.
- Do not ask any model to send email or edit Calendar as part of setup.
