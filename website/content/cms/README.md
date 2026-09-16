# Vsebina iz urejevalnika

Vsaka novica, zapis, dogodek ali stran, ustvarjena v urejevalniku na `/admin/`,
je ena datoteka JSON v mapi svoje zbirke (`novice/`, `blog/`, `dogodki/`,
`strani/`). `index.json` je seznam, ki ga urejevalnik bere, in knjižnica slik;
ureja ga API, ročno ga ne spreminjajte (če se pokvari, ga obnovi
`node tools/admin/reindex.mjs`).

Osnutki (`"status": "draft"`) se v produkciji ne gradijo. Slike so v
`public/uploads/<leto>/`.
