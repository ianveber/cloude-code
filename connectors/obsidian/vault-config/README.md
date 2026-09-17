# Vault config (copy into a dedicated Veta Cloud vault)

These files belong in `_claude-memory/.obsidian/` **only if** you open `_claude-memory` as its own Obsidian vault (see `setup.md` step 4).

They are **not** used when `_claude-memory` is just a folder inside your personal vault.

## Install

From the repo root, after the folder exists:

```bash
./scripts/upgrade-obsidian.sh --install-vault-config
```

Or copy by hand:

```bash
mkdir -p _claude-memory/.obsidian
cp connectors/obsidian/vault-config/app.json _claude-memory/.obsidian/
cp connectors/obsidian/vault-config/community-plugins.json _claude-memory/.obsidian/
cp connectors/obsidian/vault-config/core-plugins.json _claude-memory/.obsidian/
mkdir -p _claude-memory/.obsidian/plugins/obsidian-git
cp connectors/obsidian/vault-config/obsidian-git.data.json \
   _claude-memory/.obsidian/plugins/obsidian-git/data.json
```

Then in Obsidian: Community plugins → turn on → Obsidian Git → Enable. Obsidian downloads the plugin binary; we do not vendor it in git.

## Files

| File | Purpose |
|---|---|
| `app.json` | Attachment path, readable line width |
| `community-plugins.json` | Enable Obsidian Git |
| `core-plugins.json` | File explorer, backlinks, outgoing links, note composer |
| `obsidian-git.data.json` | Pull on boot + every 5 min; auto-commit **off** |
