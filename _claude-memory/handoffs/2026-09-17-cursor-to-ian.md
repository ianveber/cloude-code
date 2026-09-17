# Handoff — cursor → ian

Date: 2026-09-17
Status: waiting on Ian (all repo work is done)

## Goal

Turn on the private memory cloud. Cursor cannot click your Mac, ChatGPT, or Claude.ai.

## Do this

Follow **`connectors/YOU-DO-THIS.md`** — six steps, copy-paste.

Short version:

1. Merge https://github.com/ianveber/cloude-code/pull/8
2. Mac: `git pull` then `./scripts/upgrade-obsidian.sh` then Obsidian → Check for updates
3. Fine-grained GitHub PAT: this repo only, Contents read/write
4. ChatGPT Custom GPT: paste `connectors/chatgpt/gpt-instructions.md` + `openapi.yaml` + upload `knowledge-pack.md`
5. Claude.ai Project: paste `connectors/claude/project-instructions.md` + upload the same pack
6. Test: all three can read `ledger.md`

## Already done (do not redo)

- `_claude-memory/` vault, protocol, ledger, handoffs
- Cursor rules + `AGENTS.md` + `CLAUDE.md`
- ChatGPT / Claude / Obsidian connector files and scripts
- Knowledge pack export

## Do not

- Classic GitHub PAT
- Obsidian Sync on `_claude-memory`
- `git init` inside `Documents/Obsidian Vault`
- Second wiki inside a ChatGPT or Claude Project
