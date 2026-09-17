#!/usr/bin/env bash
# Build a single markdown pack ChatGPT and Claude.ai can upload.
# Run from anywhere; writes connectors/chatgpt/knowledge-pack.md
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$REPO/_claude-memory"
OUT="$REPO/connectors/chatgpt/knowledge-pack.md"

if [[ ! -d "$SRC" ]]; then
  echo "Missing $SRC"
  exit 1
fi

{
  echo "# Veta Memory Cloud — knowledge pack"
  echo
  echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo
  echo "This is a snapshot of \`_claude-memory/\` for ChatGPT and Claude.ai uploads."
  echo "Live source of truth is the git folder. Re-run \`./scripts/export-memory-pack.sh\` after memory changes."
  echo
  echo "---"
  echo

  # Stable order: boot + core, then everything else alphabetically
  mapfile -t files < <(
    {
      printf '%s\n' "$SRC/BOOT.md"
      printf '%s\n' "$SRC/🗺️ Master MOC.md"
      printf '%s\n' "$SRC/context.md"
      printf '%s\n' "$SRC/decisions-log.md"
      printf '%s\n' "$SRC/ledger.md"
      printf '%s\n' "$SRC/SYNC.md"
      find "$SRC" -type f -name '*.md' | sort
    } | awk 'NF && !seen[$0]++'
  )

  for f in "${files[@]}"; do
    rel="${f#"$SRC"/}"
    echo
    echo "---"
    echo
    echo "## FILE: ${rel}"
    echo
    cat "$f"
    echo
  done
} > "$OUT"

echo "Wrote $OUT ($(wc -c < "$OUT") bytes)"
