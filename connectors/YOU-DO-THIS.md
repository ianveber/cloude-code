# You do this (only these clicks)

Cursor already built the private memory cloud in git. ChatGPT, Claude, and Cursor share `_claude-memory/` in `ianveber/cloude-code`.

**PR to merge:** https://github.com/ianveber/cloude-code/pull/8

Do these six things, in order. Skip nothing. About 20 minutes.

---

## 1. Merge the PR

Open https://github.com/ianveber/cloude-code/pull/8 → **Merge pull request**.

Until this is on `main`, ChatGPT Actions looking at `main` will not see the memory folder.

---

## 2. Mac — link Obsidian + update the app

Terminal:

```bash
cd "$HOME/Desktop/Cloude CODE"
git checkout main
git pull origin main
./scripts/upgrade-obsidian.sh
```

If the repo is not on Desktop, `cd` to wherever `cloude-code` actually is, then run the last three lines.

Then in Obsidian: **Obsidian → Check for updates** → restart.

Confirm you can open `_claude-memory/ledger.md` and see a Cursor entry dated 2026-09-17.

**Later, every time you edit those notes:**

```bash
./scripts/memory-sync.sh
```

**When you sit down and want ChatGPT/Cursor writes:**

```bash
./scripts/memory-sync.sh --pull
```

Do not enable Obsidian Sync. Do not `git init` inside `Documents/Obsidian Vault`.

---

## 3. GitHub — fine-grained token (once)

1. https://github.com/settings/personal-access-tokens
2. **Generate new token** → Fine-grained
3. Name: `veta-memory-chatgpt`
4. Resource owner: **ianveber**
5. Repository access: **Only select repositories** → `cloude-code`
6. Permissions → Repository → **Contents**: Read and write. Nothing else.
7. Expiration: 90 days
8. Generate. **Copy it once.** It can commit to this private repo. Do not use a classic PAT.

---

## 4. ChatGPT — Custom GPT (live cloud)

Need ChatGPT Plus / Team / Enterprise (Custom GPTs).

1. https://chatgpt.com/gpts/editor
2. Name: `Veta Memory`
3. Description: `Private Veta knowledge cloud. Reads and writes _claude-memory in ianveber/cloude-code.`
4. Instructions: paste the entire file `connectors/chatgpt/gpt-instructions.md`
5. Knowledge: upload `connectors/chatgpt/knowledge-pack.md`
6. Conversation starters:
   - `Load shared memory and tell me what is active.`
   - `What did Cursor or Claude last write to the ledger?`
   - `Draft a handoff for Cursor from this chat.`
7. **Create** → **Add actions** → Import OpenAPI → paste `connectors/chatgpt/openapi.yaml`
8. Authentication: API Key → **Bearer** → paste the token from step 3
9. Save. Open the GPT (not a blank chat). Ask: `List the memory folder.`

You should see `context.md`, `decisions-log.md`, `ledger.md`.

Always use **this GPT** for Veta / Ethospheres / client work.

---

## 5. Claude.ai — Project (browser)

Claude Code in this repo is already wired. This step is only for claude.ai in the browser.

1. https://claude.ai → Projects → New → name `Veta Memory Cloud`
2. Custom instructions: paste `connectors/claude/project-instructions.md`
3. Upload `connectors/chatgpt/knowledge-pack.md`
4. Chat in that Project, not a blank Claude chat

Re-upload the pack after big memory changes, or run `./scripts/export-memory-pack.sh` first.

---

## 6. 30-second test

1. In Cursor (after merge, on `main`): ask it to read `ledger.md`.
2. In the ChatGPT GPT: `Read ledger.md from memory.` Same content.
3. In Claude Code or the Claude Project: same ask.

If ChatGPT disagrees, it is using the uploaded snapshot — tell it: `Use getMemoryFile, do not rely on uploaded knowledge.`

---

## You do not need to

- Rewrite the memory files (already seeded)
- Configure Cursor or Claude Code (already in `AGENTS.md` / `CLAUDE.md`)
- Buy Obsidian Sync
- Give ChatGPT access to any repo except `cloude-code`
