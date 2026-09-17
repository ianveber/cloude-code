# You do this (PR is already merged)

The folder `~/Desktop/Cloude CODE` **does not exist** on this Mac. Paste the block in step 1 from **any** Terminal window (including `~`). It finds a clone or creates `~/Desktop/cloude-code`.

---

## 1. Mac — paste this whole block

The old path `~/Desktop/Cloude CODE` is gone on this Mac. Open **Terminal.app** and paste **all of it**:

Open **Terminal.app** and paste **all of it**, then Return:

```bash
DEST="$HOME/Desktop/cloude-code"
if [[ ! -d "$DEST/.git" ]]; then
  mkdir -p "$HOME/Desktop"
  if command -v gh >/dev/null 2>&1; then
    gh repo clone ianveber/cloude-code "$DEST"
  else
    git clone https://github.com/ianveber/cloude-code.git "$DEST"
  fi
fi
cd "$DEST"
git fetch origin
git checkout main
git pull origin main
chmod +x scripts/*.sh
./scripts/upgrade-obsidian.sh
```

If GitHub asks you to log in, finish that, then paste the block again.

Then: **Obsidian → Check for updates** → restart. Open `_claude-memory/ledger.md`.

**When you edit notes:** `cd ~/Desktop/cloude-code && ./scripts/memory-sync.sh`  
**When you sit down:** `cd ~/Desktop/cloude-code && ./scripts/memory-sync.sh --pull`

Do not enable Obsidian Sync. Do not `git init` inside `Documents/Obsidian Vault`.

---

## 2. GitHub token (once)

1. https://github.com/settings/personal-access-tokens
2. Fine-grained token named `veta-memory-chatgpt`
3. Owner **ianveber** → only repo **cloude-code**
4. **Contents: Read and write**
5. 90 days. Copy once. Not a classic PAT.

---

## 3. ChatGPT Custom GPT

https://chatgpt.com/gpts/editor (you must be logged in)

- Name: `Veta Memory`
- Instructions: paste `connectors/chatgpt/gpt-instructions.md` (inside `~/Desktop/cloude-code`)
- Knowledge: upload `connectors/chatgpt/knowledge-pack.md`
- Actions: paste `connectors/chatgpt/openapi.yaml` → Bearer + the token

Ask: `List the memory folder.`

---

## 4. Claude.ai Project

https://claude.ai → Projects → `Veta Memory Cloud`  
Paste `connectors/claude/project-instructions.md`  
Upload the same `knowledge-pack.md`
