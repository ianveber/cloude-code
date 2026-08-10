#!/usr/bin/env bash
# Assemble the Tier 1 "AI-Native in 90 — Protocol Toolkit" sellable bundle.
# Ships ONLY redistribution-cleared content: the protocol core + Ian's own skills
# + the course PDFs + the authored docs. Third-party skills are NOT bundled
# (see INCLUDE-MANIFEST.md / COMPANION-SKILLS.md). Idempotent + portable
# (symlinks resolved to real files so the zip works off any machine).
set -euo pipefail
cd "$(dirname "$0")"                       # -> product/tier1/
PROTO="../.."                              # -> ai-infrastructure-protocol/
VERSION="$(cat VERSION)"
NAME="ai-native-protocol-toolkit-v${VERSION}"
STAGE="build/${NAME}"

# Ian's OWN skills — explicit whitelist (only what he owns; see INCLUDE-MANIFEST.md).
# Add a line here when Ian confirms/authors another skill (e.g. the Slovene business ones).
OWN_SKILLS=(
  "business/client-pricing-sheet"
  "build/ian-design-standards"
)

RSYNC="rsync -aL --exclude node_modules --exclude .git --exclude .DS_Store"

echo "Building ${NAME} ..."
rm -rf build dist
mkdir -p "${STAGE}/course" "${STAGE}/toolkit/skills" dist

# 1. Authored bundle docs at the bundle root
cp bundle-src/README.md bundle-src/COURSE.md bundle-src/INSTALL.md \
   bundle-src/QUICKSTART.md bundle-src/LICENSE.md bundle-src/COMPANION-SKILLS.md "${STAGE}/"

# 2. Course PDFs
cp "${PROTO}"/knowledge/*.pdf "${STAGE}/course/"

# 3. Protocol spine + manifests + all 5 pillars (all Ian-original)
cp "${PROTO}/PROTOCOL.md" "${PROTO}/SKILLS-MANIFEST.md" "${PROTO}/DELIVERY-MAP.md" "${STAGE}/toolkit/"
${RSYNC} "${PROTO}/pillars/" "${STAGE}/toolkit/pillars/"

# 4. Ian's own skills only (symlinks resolved to real files)
for s in "${OWN_SKILLS[@]}"; do
  ${RSYNC} "${PROTO}/skills/${s}/" "${STAGE}/toolkit/skills/$(basename "$s")/"
done

# 5. Zip (deterministic-ish: -X strips extra attrs)
( cd build && zip -rqX "../dist/${NAME}.zip" "${NAME}" )

echo "Built: dist/${NAME}.zip"
du -h "dist/${NAME}.zip" | awk '{print "Size: "$1}'
