#!/usr/bin/env bash
# Run this on Ian's Mac from ANY folder. Finds or clones ianveber/cloude-code, then links Obsidian.
set -euo pipefail

DEST="${CLONE_DIR:-$HOME/Desktop/cloude-code}"

find_existing() {
  local d
  for d in \
    "$HOME/Desktop/cloude-code" \
    "$HOME/Desktop/Cloude CODE" \
    "$HOME/Desktop/Cloude-CODE" \
    "$HOME/Documents/cloude-code" \
    "$HOME/Documents/Cloude CODE" \
    "$HOME/Projects/cloude-code" \
    "$HOME/code/cloude-code" \
    "$HOME/src/cloude-code" \
    "$HOME/cloude-code"
  do
    if [[ -d "$d/.git" ]] && git -C "$d" remote get-url origin 2>/dev/null | grep -q 'ianveber/cloude-code'; then
      echo "$d"
      return 0
    fi
  done

  if command -v mdfind >/dev/null 2>&1; then
    local hit
    hit="$(mdfind -onlyin "$HOME" 'kMDItemFSName == "upgrade-obsidian.sh"' 2>/dev/null | head -n 1 || true)"
    if [[ -n "$hit" ]]; then
      d="$(cd "$(dirname "$hit")/.." && pwd)"
      if [[ -d "$d/.git" ]]; then
        echo "$d"
        return 0
      fi
    fi
  fi
  return 1
}

existing="$(find_existing || true)"
if [[ -n "${existing:-}" ]]; then
  DEST="$existing"
  echo "Found repo at $DEST"
else
  echo "No local clone found. Cloning to $DEST"
  mkdir -p "$(dirname "$DEST")"
  if command -v gh >/dev/null 2>&1; then
    gh repo clone ianveber/cloude-code "$DEST"
  else
    git clone https://github.com/ianveber/cloude-code.git "$DEST"
  fi
fi

cd "$DEST"
git fetch origin
git checkout main
git pull --ff-only origin main
chmod +x scripts/*.sh
./scripts/upgrade-obsidian.sh

echo
echo "Repo: $DEST"
echo "Later: cd \"$DEST\" && ./scripts/memory-sync.sh"
