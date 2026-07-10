import re, sys, io
n = sys.argv[1]
base = "/Users/ianveber/Desktop/Cloude CODE/INSPEKTUS/inspectus-prezentacija/"
src = io.open(base+"index.html", encoding="utf-8").read()
frag = io.open(base+f"build/p{n}-fragment.html", encoding="utf-8").read()
src = re.sub(r'<section class="page" id="page-(?!%s")\d+">.*?</section>' % n, '', src, flags=re.S)
src = src.replace('<div class="pbody"></div>', '<div class="pbody">\n'+frag+'\n</div>')
src = src.replace('</head>', '<style>@media screen{.page{margin:0!important;box-shadow:none!important}.ui{display:none!important}}</style>\n</head>')
io.open(base+f"_test-p{n}.html","w",encoding="utf-8").write(src)
print("wrote _test-p%s.html" % n)
