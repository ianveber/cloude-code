#!/usr/bin/env python3
"""Assemble index.html from build/skeleton.html + build/pN-fragment.html files.

Idempotent: always starts from the pristine skeleton, so it can be re-run
after any fragment edit. A missing fragment leaves that page's body empty
(with a loud warning) rather than failing the whole build.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
skeleton = (ROOT / "build" / "skeleton.html").read_text()

missing = []
for n in range(1, 11):
    frag_path = ROOT / "build" / f"p{n}-fragment.html"
    if not frag_path.exists():
        missing.append(n)
        continue
    frag = frag_path.read_text().strip()
    # locate this page's section, then its empty pbody
    sec_re = re.compile(
        rf'(<section class="page" id="page-{n}">.*?)<div class="pbody"></div>',
        re.S,
    )
    if not sec_re.search(skeleton):
        print(f"ERROR: empty pbody for page-{n} not found in skeleton", file=sys.stderr)
        sys.exit(1)
    skeleton = sec_re.sub(lambda m: m.group(1) + f'<div class="pbody">\n{frag}\n</div>', skeleton, count=1)

(ROOT / "index.html").write_text(skeleton)
print(f"assembled index.html ({len(skeleton)//1024} KB)")
if missing:
    print(f"WARNING: no fragment for pages: {missing}", file=sys.stderr)
