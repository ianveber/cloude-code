#!/usr/bin/env bash
# Build the Memory Space index and serve it locally (Obsidian-style vault viewer).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8765}"
HOST="${HOST:-127.0.0.1}"

python3 "$ROOT/scripts/build-memory-space.py"

URL="http://${HOST}:${PORT}/memory-space/"
echo ""
echo "Memory Space"
echo "  Claude  orange   ChatGPT  blue   Cursor  purple"
echo "  $URL"
echo "  Ctrl+C to stop"
echo ""

if command -v open >/dev/null 2>&1; then
  (sleep 0.5 && open "$URL") >/dev/null 2>&1 &
elif command -v xdg-open >/dev/null 2>&1; then
  (sleep 0.5 && xdg-open "$URL") >/dev/null 2>&1 &
fi

cd "$ROOT"
exec python3 -m http.server "$PORT" --bind "$HOST"
