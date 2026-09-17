#!/usr/bin/env bash
# Upgrade the Mac Obsidian vault so it uses the private memory cloud.
# Run on Ian's Mac from anywhere.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
INSTALL_CONFIG=0

for arg in "$@"; do
  case "$arg" in
    --install-vault-config) INSTALL_CONFIG=1 ;;
    -h|--help)
      echo "Usage: $0 [--install-vault-config]"
      echo "  Links ~/Documents/Obsidian Vault/_claude-memory to this repo."
      echo "  --install-vault-config  also copies dedicated-vault .obsidian settings"
      echo "Full guide: connectors/obsidian/setup.md"
      exit 0
      ;;
  esac
done

echo "== 1. Link vault _claude-memory → repo =="
"$REPO/scripts/link-obsidian-memory.sh"

if [[ "$INSTALL_CONFIG" -eq 1 ]]; then
  echo
  echo "== 2. Dedicated-vault Obsidian config =="
  dest="$REPO/_claude-memory/.obsidian"
  src="$REPO/connectors/obsidian/vault-config"
  mkdir -p "$dest/plugins/obsidian-git"
  cp "$src/app.json" "$dest/app.json"
  cp "$src/community-plugins.json" "$dest/community-plugins.json"
  cp "$src/core-plugins.json" "$dest/core-plugins.json"
  cp "$src/obsidian-git.data.json" "$dest/plugins/obsidian-git/data.json"
  echo "Wrote $dest"
  echo "Open _claude-memory as its own vault, then enable Community plugin: Obsidian Git."
fi

echo
echo "== Next =="
echo "1. Obsidian → Check for updates (app upgrade)."
echo "2. Restart Obsidian. Confirm _claude-memory/ledger.md exists."
echo "3. After editing notes: $REPO/scripts/memory-sync.sh"
echo "4. To see ChatGPT/Cursor writes: $REPO/scripts/memory-sync.sh --pull"
echo "Guide: $REPO/connectors/obsidian/setup.md"
