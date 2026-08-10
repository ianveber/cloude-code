#!/usr/bin/env bash
# Start the demo and open everything you need to run through it.
#
#   ./zazeni.sh
#
# Opens the app at http://localhost:8020 and a Finder window on the client's documents, which
# live OUTSIDE this repository (DPA 5(a)). Drag from the Finder window into the page.
#
# Ctrl-C stops the server.

set -euo pipefail
cd "$(dirname "$0")"

KEY_FILE="$HOME/.anthropic_key"
DOCS="$HOME/ais-client-data/harvest-hub/vzorci/Vzorci dokumentacije - Ponudbe - vrste zavarovanj"

if [ ! -f "$KEY_FILE" ]; then
  echo "  ✗ $KEY_FILE not found — the reading step needs it." >&2
  exit 1
fi
if [ ! -d "$DOCS" ]; then
  echo "  ✗ Documents not found at:" >&2
  echo "    $DOCS" >&2
  exit 1
fi

# Free the port if a previous run is still holding it.
if lsof -ti:8020 >/dev/null 2>&1; then
  echo "  · stopping a previous instance on :8020"
  lsof -ti:8020 | xargs kill 2>/dev/null || true
  sleep 1
fi

echo "  · starting on http://localhost:8020 (loopback only)"
ANTHROPIC_API_KEY="$(tr -d '[:space:]' < "$KEY_FILE")" node server.mjs &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT INT TERM

sleep 2
if ! curl -sf -o /dev/null --max-time 3 http://127.0.0.1:8020/; then
  echo "  ✗ server did not come up" >&2
  exit 1
fi

open "http://localhost:8020"
open "$DOCS"

cat <<'TXT'

  Ready. Both windows are open — drag documents from Finder into the page.

  Walk-through with what to expect at each step:
    clients/harvest-hub/09-POSKUSNI-SCENARIJ.md

  Keep the browser window IN FRONT — scanned documents need it to render.
  Ctrl-C here stops the server.

TXT

wait $SERVER
