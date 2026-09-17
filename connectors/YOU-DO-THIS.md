# You do this (PR is already merged)

Cursor merged https://github.com/ianveber/cloude-code/pull/8 to `main` on 2026-09-17.

This cloud agent is **not your Mac**. It cannot open Obsidian, log into ChatGPT, or log into Claude.ai. Those four steps are yours. About 15 minutes.

---

## 1. Mac — link Obsidian (copy-paste)

```bash
cd "$HOME/Desktop/Cloude CODE" || cd "$HOME/Desktop/cloude-code"
git checkout main
git pull origin main
./scripts/upgrade-obsidian.sh
```

If the repo lives somewhere else, `cd` there first, then run the last three lines.

Then: **Obsidian → Check for updates** → restart.

Open `_claude-memory/ledger.md`. You should see Cursor entries from 2026-09-17.

**When you edit those notes:** `./scripts/memory-sync.sh`  
**When you sit down:** `./scripts/memory-sync.sh --pull`

Do not enable Obsidian Sync. Do not `git init` inside `Documents/Obsidian Vault`.

---

## 2. GitHub token (once)

1. https://github.com/settings/personal-access-tokens
2. Generate fine-grained token named `veta-memory-chatgpt`
3. Resource owner: **ianveber**
4. Only select repositories → **cloude-code**
5. Repository permissions → **Contents: Read and write** (nothing else)
6. Expiration: 90 days. Copy it once. Not a classic PAT.

---

## 3. ChatGPT Custom GPT

Need Plus/Team. https://chatgpt.com/gpts/editor

- Name: `Veta Memory`
- Description: `Private Veta knowledge cloud. Reads and writes _claude-memory in ianveber/cloude-code.`
- Instructions: paste `connectors/chatgpt/gpt-instructions.md`
- Knowledge: upload `connectors/chatgpt/knowledge-pack.md`
- Actions → import `connectors/chatgpt/openapi.yaml` → Auth: **Bearer** + the token from step 2
- Ask: `List the memory folder.` You should see `context.md` and `ledger.md`.

Use this GPT for Veta work, not a blank ChatGPT chat.

---

## 4. Claude.ai Project (browser)

Claude Code in this repo is already live. This is only for claude.ai.

https://claude.ai → Projects → New → `Veta Memory Cloud`  
Paste `connectors/claude/project-instructions.md`  
Upload `connectors/chatgpt/knowledge-pack.md`

---

## 5. Test

Ask Cursor, the ChatGPT GPT, and Claude: `Read ledger.md.` Same text.

If ChatGPT disagrees: `Use getMemoryFile, do not rely on uploaded knowledge.`
