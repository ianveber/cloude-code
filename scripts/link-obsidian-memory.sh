#!/usr/bin/env bash
# Point the local Obsidian vault at the git _claude-memory folder.
# Safe to re-run. Run on Ian's Mac from the repo root (or anywhere — paths are resolved).
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$REPO/_claude-memory"
VAULT="${OBSIDIAN_VAULT:-$HOME/Documents/Obsidian Vault}"
DEST="$VAULT/_claude-memory"
BACKUP="$VAULT/_claude-memory.pre-sync-backup"

if [[ ! -d "$SRC" ]]; then
  echo "Missing $SRC — clone ianveber/cloude-code first."
  exit 1
fi

if [[ ! -d "$VAULT" ]]; then
  echo "Obsidian vault not found at: $VAULT"
  echo "Set OBSIDIAN_VAULT to your vault path and re-run."
  exit 1
fi

# Already linked to this repo
if [[ -L "$DEST" ]]; then
  current="$(readlink "$DEST")"
  if [[ "$current" == "$SRC" ]]; then
    echo "Already linked: $DEST -> $SRC"
    exit 0
  fi
  echo "Replacing existing symlink $DEST -> $current"
  rm "$DEST"
fi

# Merge any richer local notes into the repo, then back up the folder
if [[ -d "$DEST" && ! -L "$DEST" ]]; then
  echo "Merging existing Obsidian notes into $SRC (local file wins on conflict)"
  mkdir -p "$BACKUP"
  rsync -a "$DEST/" "$BACKUP/"
  rsync -a --ignore-times "$DEST/" "$SRC/"
  rm -rf "$DEST"
  echo "Backup of previous vault folder: $BACKUP"
fi

ln -s "$SRC" "$DEST"
echo "Linked $DEST -> $SRC"
echo "Open Obsidian. _claude-memory notes are now the git files."
echo "Commit any merged notes from the repo so Cursor Cloud can see them."
