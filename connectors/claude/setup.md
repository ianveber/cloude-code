# Claude → Veta Memory Cloud

Claude already has two doors into the same private cloud.

| Door | When to use |
|---|---|
| **Claude Code** (this repo) | Default. `CLAUDE.md` + `AGENTS.md` load `./_claude-memory/` every session. |
| **Claude.ai Project** | Browser chats that are not in the repo. Snapshot unless you also connect GitHub. |

## Claude Code (no extra setup after merge)

Open this repo. Session start already reads:

1. `_claude-memory/🗺️ Master MOC.md`
2. `_claude-memory/context.md`
3. `_claude-memory/decisions-log.md`

Then `ledger.md` and `handoffs/` when combining work with ChatGPT or Cursor.

Write back at session end. Commit and push so ChatGPT Actions and the next Cursor run see it.

## Claude.ai Project (browser)

1. claude.ai → Projects → New project → `Veta Memory Cloud`
2. Project custom instructions: paste `project-instructions.md`
3. Upload `../chatgpt/knowledge-pack.md` (and `_claude-memory/BOOT.md` if you want a shorter boot)
4. Optional: add a GitHub connector / MCP if your Claude plan supports it, pointed at `ianveber/cloude-code`. Then Claude.ai can read live files instead of the snapshot.

Re-upload the knowledge pack after `./scripts/export-memory-pack.sh` when you are not using a GitHub connector.

## Combining with Cursor and ChatGPT

- If Cursor left a file in `handoffs/` addressed to Claude, do that work first.
- Append to `ledger.md` when you change memory.
- Do not keep a private Claude Project wiki that duplicates `_claude-memory/`. Update the repo (or ask Cursor to) so all three stay aligned.
