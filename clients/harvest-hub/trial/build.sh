#!/usr/bin/env bash
# Assemble the deployable trial from the verified local demo.
#
#   ./build.sh
#
# The demo at ../demo is the single source of truth for everything that reads documents. This
# script copies from it; it never edits it. What ships is an ALLOWLIST, not an exclude list —
# the client's personal data must never reach a hosted instance, and an allowlist fails safe when
# somebody adds a new file to demo/ that nobody thought about.
#
# Deliberately NOT shipped:
#   register-zastopnikov.json   11 real people; the trial user uploads their own, in the browser
#   truth.json                  hand-keyed personal data from 11 real ponudbe
#   out/                        generated documents carrying real values
#   scripts/                    the dev harness — needs samples and a key, no business being public
#   server.mjs                  replaced by api/extract.js
#   node_modules/               only pdf.js ships, and only the two files the browser imports

set -euo pipefail
cd "$(dirname "$0")"
DEMO="../demo"

[ -d "$DEMO" ] || { echo "  ✗ $DEMO not found" >&2; exit 1; }

echo "  · clearing previously assembled files"
rm -rf lib vendor vzorec index.html app.js

echo "  · copying the client"
cp "$DEMO/index.html" "$DEMO/app.js" .

echo "  · copying browser modules"
mkdir -p lib
for m in layout extract klp classify gate edokumenti runstats confidence dnevnik; do
  cp "$DEMO/lib/$m.js" lib/
done

echo "  · copying server-side modules (used by api/extract.js)"
cp "$DEMO/lib/claude.mjs" "$DEMO/lib/mistral.mjs" lib/

# The synthetic documents the page offers for download. These are the ONLY documents anyone may
# put through the hosted trial before the DPA amendment is signed, so a build that quietly ships
# without them leaves a dead link exactly where somebody is deciding whether to reach for a real
# client offer instead. Missing → refuse.
echo "  · copying the sample documents offered in the page"
mkdir -p vzorec
for f in Vzorcna-ponudba.pdf Vzorcni-register.csv; do
  if [ ! -f "$DEMO/vzorec/$f" ]; then
    echo "    ✗ $DEMO/vzorec/$f is missing — index.html offers it for download. REFUSING." >&2
    exit 1
  fi
  cp "$DEMO/vzorec/$f" vzorec/
done

# /vendor/ is not a directory in the demo — server.mjs rewrites it onto
# node_modules/pdfjs-dist/build. Static hosting has no such rewrite, so the two files the browser
# actually imports are copied in physically.
echo "  · copying pdf.js (the two files the browser imports)"
mkdir -p vendor
cp "$DEMO/node_modules/pdfjs-dist/build/pdf.mjs" vendor/
cp "$DEMO/node_modules/pdfjs-dist/build/pdf.worker.mjs" vendor/

echo
echo "  · verifying nothing personal came along"
BAD=0
for pattern in register-zastopnikov truth.json fidelity-fixture; do
  if find . -name "*$pattern*" -not -path "./node_modules/*" | grep -q .; then
    echo "    ✗ $pattern present — REFUSING" >&2; BAD=1
  fi
done
# Names from the client's own documents must not appear in anything we ship.
#
# The list itself is personal data, so it does NOT live in this script. This repository is public,
# and a guard that hardcodes the six surnames it is guarding publishes them on every push — the
# check leaking the exact thing it exists to contain. It lives with the rest of the client's data,
# outside the repository, and is read at run time.
#
# One line per surname, '#' comments and blank lines ignored. If the file is missing the build
# REFUSES: a name check that quietly skips itself when it cannot find its list is worse than no
# check at all, because the "✓ no personal data" line still prints.
DENY="$HOME/ais-client-data/harvest-hub/deny-names.txt"
if [ ! -f "$DENY" ]; then
  echo "    ✗ name deny-list not found at:" >&2
  echo "      $DENY" >&2
  echo "      Create it — one surname per line, taken from the client's sample documents." >&2
  echo "      REFUSING to assemble without it." >&2
  BAD=1
else
  PAT=$(grep -vE '^\s*(#|$)' "$DENY" | paste -sd'|' -)
  if [ -z "$PAT" ]; then
    echo "    ✗ the deny-list is empty — REFUSING" >&2; BAD=1
  # -i, and not optional. A real client's email sat in a committed file for hours in ALL CAPS —
  # which is how it appeared on their own form — and every case-SENSITIVE check walked straight
  # past it, including this one. Documents carry names in whatever case the person typed, so a
  # deny-list that matches only one case is a deny-list that mostly does not match.
  elif grep -rlEi "$PAT" --include="*.js" --include="*.mjs" \
         --include="*.html" --include="*.json" --include="*.csv" --include="*.txt" \
         --include="*.md" \
         . 2>/dev/null | grep -v node_modules | grep -q .; then
    echo "    ✗ a real client name appears in the assembled output — REFUSING" >&2; BAD=1
  fi

  # The line above reads text. The page also offers a PDF, and a PDF hides its text inside
  # compressed streams where grep cannot see it — so a real client offer dropped into vzorec/ by
  # mistake would sail through every check above and be served, by us, for download.
  #
  # pdf-text.mjs sees through that, using the same pdfjs the app reads documents with. NOT
  # pdftotext: an earlier version of this check piped `pdftotext … | grep` on a machine without
  # poppler, discarded stderr, and pronounced the file clean having read nothing at all. A guard
  # with an optional dependency reports success when the dependency is absent.
  #
  # An unreadable document is not a clean one, so any failure here REFUSES. This is the single
  # file on the deployment that we actively invite people to click.
  for pdf in vzorec/*.pdf; do
    [ -e "$pdf" ] || continue
    if ! TXT=$(node pdf-text.mjs "$pdf" 2>&1); then
      echo "    ✗ could not read inside $pdf — REFUSING" >&2
      echo "      $TXT" >&2
      BAD=1
      continue
    fi
    if printf '%s' "$TXT" | grep -qEi "$PAT"; then
      echo "    ✗ a real client name appears INSIDE $pdf — REFUSING" >&2; BAD=1
    elif ! printf '%s' "$TXT" | grep -qi "VZOR"; then
      # Every sample we ship says so on its face. A PDF that does not is not one of ours.
      echo "    ✗ $pdf is not marked as a sample (no 'VZOR...' on the page) — REFUSING" >&2; BAD=1
    fi
  done
fi
if grep -rlE "sk-ant-api03-[A-Za-z0-9_-]{20}" . 2>/dev/null | grep -v node_modules | grep -q .; then
  echo "    ✗ an API key appears in the assembled output — REFUSING" >&2; BAD=1
fi
[ "$BAD" = "1" ] && exit 1

echo "    ✓ no personal data, no key"
echo
echo "  · assembled:"
find . -type f -not -path "./node_modules/*" -not -name "build.sh" \
  | sort | sed 's/^/      /'
echo
echo "  Ready. Deploy with:  vercel --prod"
