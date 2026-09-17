# Upgrade Obsidian for the private memory cloud

Two different upgrades. Do both.

| Upgrade | What it does |
|---|---|
| **A. The app** | Newer Obsidian build (bugfixes, installer). |
| **B. The vault** | `_claude-memory` becomes the same git cloud ChatGPT, Claude, and Cursor use. This is the one that matters. |

Do **not** turn on Obsidian Sync (the paid product) for `_claude-memory`. That would be a second copy. Git is the cloud.

---

## A. Upgrade the Obsidian app (2 minutes)

On the Mac:

1. Open Obsidian
2. **Obsidian → Check for updates…** (or `Help → Check for updates`)
3. Install, restart

If you installed with Homebrew:

```bash
brew upgrade --cask obsidian
```

Installer downloads: [obsidian.md/download](https://obsidian.md/download)

That does **not** move your notes into the private cloud. Continue with B.

---

## B. Upgrade the vault (the real upgrade)

Today the vault is `/Users/ianveber/Documents/Obsidian Vault`. Agents cannot see it. After this, `_claude-memory` inside that vault is a symlink into `cloude-code`, so every model sees the same files.

### 1. Clone / pull this repo on the Mac

The repo must exist locally (Desktop path from your File Agent notes):

```bash
cd "$HOME/Desktop/Cloude CODE"   # or wherever you cloned ianveber/cloude-code
git checkout main
git pull origin main
```

If this PR is not merged yet, use branch `cursor/private-memory-cloud-a57f` instead of `main`.

### 2. Link the vault to git

```bash
./scripts/link-obsidian-memory.sh
```

That merges any richer local `_claude-memory` notes into the repo, backs up the old folder, and replaces it with a symlink.

Open Obsidian. You should still see `_claude-memory` in the sidebar. Those notes are now git files.

### 3. Sync notes with the other models

Edits in Obsidian are local until git push. ChatGPT writes are on GitHub until git pull.

From the **repo root** (not the vault root):

```bash
./scripts/memory-sync.sh          # pull, commit _claude-memory only, push
./scripts/memory-sync.sh --pull   # pull only (see ChatGPT / Cursor writes)
```

Run `--pull` when you sit down. Run the full command when you finish editing notes.

Do **not** enable Obsidian Git auto-commit on the whole personal vault. That vault is not this git repo; auto-commit would either fail or create a second `.git` inside `Documents/Obsidian Vault`.

### 4. Optional: a dedicated “Veta Cloud” vault (cleaner Git plugin)

If you want pull/push buttons inside Obsidian:

1. Obsidian → **Open folder as vault**
2. Choose the repo’s `_claude-memory/` folder (the real folder, not the old copy)
3. Community plugins → browse → **Obsidian Git** → install → enable
4. Copy settings from `connectors/obsidian/vault-config/` (see that folder’s README)

Recommended Obsidian Git values for that dedicated vault:

- Auto pull on boot: **on**
- Auto pull interval: **5 minutes**
- Auto commit: **off** (use `./scripts/memory-sync.sh` so you never commit `docs/` or HTML by accident)
- Custom base path: `../` only if the plugin cannot find `.git` (parent is `cloude-code`)

Keep your personal vault for Agentic-OS inbox, contacts, and logs. Use **Veta Cloud** for shared memory.

### 5. Plugins worth turning on

On the dedicated memory vault only:

| Plugin | Why |
|---|---|
| **Obsidian Git** | Pull ChatGPT/Cursor commits; status bar dirty state |
| **Unique note creator** | Optional. Handoffs already have a naming scheme |

Skip: Obsidian Sync, Random note, any AI-chat plugin that stores a *second* memory. ChatGPT/Claude/Cursor are the operators; Obsidian is the notebook.

---

## Check it worked

1. In Obsidian, open `_claude-memory/ledger.md`. You should see the Cursor entry from 2026-09-17.
2. Add a test line under a heading `## test — ian`, save.
3. `./scripts/memory-sync.sh`
4. In Cursor or ChatGPT: “Read ledger.md.” The test line should be there.
5. Delete the test line, sync again.

If step 1 shows old notes and no `ledger.md`, the symlink did not run — the vault is still the Mac-only copy.

---

## What not to do

- Do not `git init` inside `Documents/Obsidian Vault`
- Do not enable Obsidian Sync on `_claude-memory`
- Do not duplicate these notes into a Claude or ChatGPT Project wiki
- Do not auto-commit the entire `cloude-code` repo from Obsidian
