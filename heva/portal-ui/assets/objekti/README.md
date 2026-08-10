# Object photos

Drop a photo here named after the object's slug and it replaces the generic
building-outline icon on that object's card — and appears next to the title on
its documents page. No code change needed: if the file isn't here, the `<img>`
removes itself and the SVG icon shows instead.

    assets/objekti/<slug>.jpg

Slugs are derived from the object name (Slovene characters folded):

| Object            | File                        |
|-------------------|-----------------------------|
| DIII              | `diii.jpg`                  |
| RAZGLEDNA 2       | `razgledna-2.jpg`           |
| MD II/A           | `md-ii-a.jpg`               |
| DRAPŠINOVA - 3D   | `drapsinova-3d.jpg`         |
| SPAR ČRNOMELJ     | `spar-crnomelj.jpg`         |
| VILA BLOK MEDLOG 1| `vila-blok-medlog-1.jpg`    |

Square-ish crops look best (the card icon is 44×44, the header 32×32, both
`object-fit: cover`). Anything from a phone camera is fine — but keep them
reasonably small, since every card on the grid loads one.
