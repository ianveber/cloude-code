#!/usr/bin/env bash
# Sanity-check that the private memory cloud files exist.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
missing=0

need=(
  "_claude-memory/BOOT.md"
  "_claude-memory/context.md"
  "_claude-memory/decisions-log.md"
  "_claude-memory/ledger.md"
  "_claude-memory/SYNC.md"
  "connectors/chatgpt/gpt-instructions.md"
  "connectors/chatgpt/openapi.yaml"
  "connectors/chatgpt/setup.md"
  "connectors/claude/project-instructions.md"
  "docs/memory-cloud.md"
  "connectors/obsidian/setup.md"
  "scripts/memory-sync.sh"
  "scripts/upgrade-obsidian.sh"
  "scripts/build-memory-space.py"
  "scripts/memory-space.sh"
  "memory-space/index.html"
  "docs/memory-space.md"
  "AGENTS.md"
  ".cursor/rules/memory.mdc"
)

for rel in "${need[@]}"; do
  if [[ ! -e "$REPO/$rel" ]]; then
    echo "MISSING $rel"
    missing=1
  fi
done

if [[ ! -f "$REPO/_claude-memory/🗺️ Master MOC.md" ]]; then
  echo "MISSING _claude-memory/🗺️ Master MOC.md"
  missing=1
fi

if [[ "$missing" -ne 0 ]]; then
  exit 1
fi

echo "Memory cloud files OK"
