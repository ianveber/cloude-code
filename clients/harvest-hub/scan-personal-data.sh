#!/usr/bin/env bash
# Look for client personal data anywhere under clients/harvest-hub, before it is pushed.
#
#   ./scan-personal-data.sh            # working tree
#   ./scan-personal-data.sh --staged   # only what is staged for the next commit
#
# WHY THIS IS A SCRIPT AND NOT A GREP I TYPE EACH TIME.
#
# This repository is public. Every pre-commit check on this client's work so far has been an
# ad-hoc `grep -rl "Name"` typed fresh, and each time the flags drifted:
#
#   · A case-SENSITIVE pass reported "clean" while a real agent's address sat in a committed file
#     in ALL CAPS — which is how their own forms print it. The pattern was in the deny-list; the
#     flag was not.
#   · A `pdftotext | grep` pass reported a PDF clean on a machine with no poppler installed. It
#     had read nothing at all.
#
# Both times the check printed a tick. A guard that is retyped is a guard whose flags are
# rediscovered by accident, so the flags live here and the failure modes are asserted, not
# remembered. The deny-list itself is personal data and stays outside the repository.
#
# Exit 0 clean, 1 found something, 2 could not run the check properly. 2 is NOT 0.

set -uo pipefail
cd "$(dirname "$0")"

DENY="$HOME/ais-client-data/harvest-hub/deny-names.txt"
STAGED=0
[ "${1:-}" = "--staged" ] && STAGED=1

if [ ! -f "$DENY" ]; then
  echo "  ✗ deny-list not found at $DENY — cannot check names. REFUSING to report clean." >&2
  exit 2
fi
PAT=$(grep -vE '^\s*(#|$)' "$DENY" | paste -sd'|' -)
[ -z "$PAT" ] && { echo "  ✗ deny-list is empty — REFUSING" >&2; exit 2; }

# Which files to look at. Written for bash 3.2, which is what macOS ships — `mapfile` does not
# exist there, and a scanner that only runs on the maintainer's newer shell is one that silently
# stops running.
if [ "$STAGED" = "1" ]; then
  LIST=$(git -C ../.. diff --cached --name-only --diff-filter=ACMR -- clients/harvest-hub)
else
  LIST=$(git -C ../.. ls-files -com --exclude-standard -- clients/harvest-hub)
fi

# node_modules is vendor code and enormous; it never contains client data.
FILTERED=()
while IFS= read -r f; do
  [ -z "$f" ] && continue
  f=${f#clients/harvest-hub/}
  case "$f" in node_modules/*|*/node_modules/*) continue;; esac
  [ -f "$f" ] && FILTERED+=("$f")
done <<< "$LIST"

if [ "${#FILTERED[@]}" -eq 0 ]; then
  echo "  nothing to scan"; exit 0
fi

FOUND=0
report () { echo "  ✗ $1"; FOUND=1; }

# ── 1 · names, CASE-INSENSITIVELY ────────────────────────────────────────────
# -i is the whole point. See the header.
for f in "${FILTERED[@]}"; do
  case "$f" in *.pdf) continue;; esac          # PDFs handled below
  if grep -qEil "$PAT" "$f" 2>/dev/null; then
    report "client name in $f"
    grep -nEio "$PAT" "$f" 2>/dev/null | head -3 | sed 's/^/      /'
  fi
done

# ── 2 · inside PDFs ──────────────────────────────────────────────────────────
# A PDF keeps its text in compressed streams where grep sees nothing, so it must be extracted.
# pdf-text.mjs uses the pdfjs this project already depends on; if it cannot read a PDF that is
# an ERROR, not a pass.
for f in "${FILTERED[@]}"; do
  case "$f" in *.pdf) ;; *) continue;; esac
  if ! TXT=$(node trial/pdf-text.mjs "$f" 2>&1); then
    report "could not read inside $f — cannot certify it: $TXT"
    continue
  fi
  printf '%s' "$TXT" | grep -qEi "$PAT" && report "client name INSIDE $f"
done

# ── 3 · personal e-mail addresses ────────────────────────────────────────────
# Role mailboxes at the client's own domains are business contacts and are allowed; a named
# individual at a consumer provider is not. This is the shape that actually leaked.
CONSUMER='(gmail|googlemail|yahoo|hotmail|outlook|icloud|siol|t-2|telemach|amis|volja)\.'
for f in "${FILTERED[@]}"; do
  case "$f" in *.pdf|*.png|*.jpg) continue;; esac
  HITS=$(grep -Eio "[a-z0-9._%+-]+ ?@ ?[a-z0-9.-]*$CONSUMER[a-z]{2,}" "$f" 2>/dev/null \
         | grep -vEi "primer|example|invalid|vzorec|^ime[._]|priimek|test|noreply" | sort -u)
  [ -n "$HITS" ] && { report "personal e-mail address in $f"; echo "$HITS" | sed 's/^/      /'; }
done

# ── 4 · the trial passcode ───────────────────────────────────────────────────
# It is the only thing protecting the deployment and it must never be in the repository.
CODEFILE="$HOME/ais-client-data/harvest-hub/preizkus-dostop.txt"
if [ -f "$CODEFILE" ]; then
  CODE=$(grep -i '^Koda' "$CODEFILE" | sed 's/.*: *//' | tr -d '[:space:]')
  if [ -n "$CODE" ] && [ "${#CODE}" -ge 6 ]; then
    for f in "${FILTERED[@]}"; do
      grep -qF "$CODE" "$f" 2>/dev/null && report "the trial passcode appears in $f"
    done
  fi
fi

# ── 5 · API keys ─────────────────────────────────────────────────────────────
for f in "${FILTERED[@]}"; do
  grep -qE "sk-ant-api03-[A-Za-z0-9_-]{20}" "$f" 2>/dev/null && report "an API key appears in $f"
done

echo
if [ "$FOUND" = "1" ]; then
  echo "  Do not commit. Fix the above first."
  exit 1
fi
echo "  ✓ ${#FILTERED[@]} files scanned — no client name, no personal address, no passcode, no key"
