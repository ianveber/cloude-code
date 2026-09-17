**Your setup checklist (six clicks):** [`connectors/YOU-DO-THIS.md`](YOU-DO-THIS.md)

# Connectors — ChatGPT, Claude, Cursor, Obsidian

Wire all three models — and the Obsidian vault — to the same private memory cloud. Architecture: `docs/memory-cloud.md`. Files: `_claude-memory/`.

## Do this in order

### 1. Memory is on `main`

PR #8 is merged. `_claude-memory/` is live. Ian's remaining clicks: [`YOU-DO-THIS.md`](YOU-DO-THIS.md).

### 2. Cursor (already done in this repo)

- `AGENTS.md` — session start / end
- `.cursor/rules/memory.mdc` — always-on
- Nothing else to click. Cloud and local Cursor both read the repo.

### 3. Claude Code (already done in this repo)

- `CLAUDE.md` points at `./_claude-memory/`
- Same session protocol as Cursor

### 4. Obsidian (Mac) — upgrade the vault, not just the app

App update is **Obsidian → Check for updates**. That does not share memory.

To put the vault on the same cloud as ChatGPT / Claude / Cursor:

```bash
./scripts/upgrade-obsidian.sh
```

Full guide: [`obsidian/setup.md`](obsidian/setup.md). After you edit notes: `./scripts/memory-sync.sh`.

### 5. ChatGPT (live cloud)

Follow [`chatgpt/setup.md`](chatgpt/setup.md).

You need:

- A ChatGPT plan that allows Custom GPTs (Plus / Team / Enterprise)
- A **fine-grained GitHub PAT** on `ianveber/cloude-code`, Contents: Read and write
- Files in `chatgpt/`: `gpt-instructions.md` + `openapi.yaml`

Until Actions are connected, you can still upload `chatgpt/knowledge-pack.md` into a ChatGPT **Project**. That copy goes stale; Actions do not.

### 6. Claude.ai (web)

Follow [`claude/setup.md`](claude/setup.md).

Project instructions: `claude/project-instructions.md`.  
Knowledge upload: `chatgpt/knowledge-pack.md` (same pack). Claude Code does not need this — it already has the repo.

### 7. Refresh the upload pack

After a week of memory writes, or before a long ChatGPT/Claude.ai session without Actions:

```bash
./scripts/export-memory-pack.sh
```

Commit the updated `connectors/chatgpt/knowledge-pack.md` and re-upload it in ChatGPT / Claude.ai.

## Quick test that all three share memory

1. In Cursor: add one line to `_claude-memory/ledger.md`, commit, push to `main`.
2. In ChatGPT Custom GPT: "Read ledger.md from memory." It should show that line.
3. In Claude Code or Claude.ai (if Actions/MCP/pack is current): same ask.

If ChatGPT cannot see it, the GPT is on a stale knowledge file, not live Actions.
