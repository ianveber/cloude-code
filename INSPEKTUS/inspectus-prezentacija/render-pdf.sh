#!/bin/bash
# Render the presentation to PDF (izvoz/INSPECTUS-Pametni-filter-predstavitev.pdf)
cd "$(dirname "$0")"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu \
  --no-pdf-header-footer \
  --virtual-time-budget=8000 \
  --print-to-pdf="izvoz/INSPECTUS-Pametni-filter-predstavitev.pdf" \
  "file://$(pwd)/index.html" 2>/dev/null
python3 -c "
import re
data = open('izvoz/INSPECTUS-Pametni-filter-predstavitev.pdf','rb').read()
pages = len(re.findall(rb'/Type\s*/Page[^s]', data))
print(f'PDF rendered: {pages} pages, {len(data)//1024} KB')
assert pages == 10, f'EXPECTED 10 PAGES, GOT {pages}'
"
