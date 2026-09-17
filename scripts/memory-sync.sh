#!/usr/bin/env bash
# Pull remote memory, commit only _claude-memory/, push.
# Run from anywhere; operates on this repo. Safe for Obsidian edits.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO"

PULL_ONLY=0
MSG="memory(obsidian): $(date -u +%Y-%m-%d)"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pull|--pull-only)
      PULL_ONLY=1
      shift
      ;;
    -m|--message)
      MSG="${2:?commit message required}"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [--pull] [-m 'commit message']"
      echo "  default   git pull --rebase, commit _claude-memory if dirty, push"
      echo "  --pull    git pull --rebase only"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

git fetch origin
branch="$(git rev-parse --abbrev-ref HEAD)"
if git rev-parse --verify "origin/$branch" >/dev/null 2>&1; then
  git pull --rebase --autostash origin "$branch"
else
  echo "No remote branch origin/$branch yet — skip pull."
fi

if [[ "$PULL_ONLY" -eq 1 ]]; then
  echo "Pulled. Obsidian notes in _claude-memory/ are current with origin."
  exit 0
fi

git add _claude-memory
if git diff --cached --quiet; then
  echo "No _claude-memory changes to commit."
  exit 0
fi

git commit -m "$MSG"
git push -u origin "$branch"
echo "Pushed _claude-memory/ to origin/$branch"
