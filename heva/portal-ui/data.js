/* =====================================================================
   Arhiv Heva — prototype data
   THE ONLY DATA FILE. Everything the prototype shows comes from here.

   ┌── REAL ─────────────────────────────────────────────────────────┐
   │ • All 42 object names + their "Posodobljeno" dates              │
   │ • RAZGLEDNA 2's folder names, sizes and dates                   │
   │ • The storage quota (163,74 MiB of 5243 MiB)                    │
   │   — all captured from the live Chamilo portal.                  │
   └─────────────────────────────────────────────────────────────────┘

   ┌── PLACEHOLDER — replace before this is shown as real ───────────┐
   │ • The FILES inside every folder. Nobody ever captured that      │
   │   level, so these are generated. Names follow each folder's     │
   │   real category, and sizes add up to the real folder totals,    │
   │   but no individual document here exists.                       │
   │ • Folder sets for the other 41 objects (RAZGLEDNA 2's four      │
   │   real categories are reused as the taxonomy — those categories │
   │   are genuine, the per-object contents are not).                │
   │ • Users and the access log.                                     │
   │                                                                 │
   │ To make it real: export the archive from Chamilo and replace    │
   │ OBJEKTI[].folders. Nothing else needs to change.                │
   └─────────────────────────────────────────────────────────────────┘
   ===================================================================== */

/* ── REAL: the 42 objects, exactly as the live portal lists them ──── */
const REAL_OBJEKTI = [
  { n: 'TPC ZAGORJE' }, { n: 'SPAR BROD' }, { n: 'SPAR ČRNOMELJ' }, { n: 'TPC LENART' },
  { n: 'TPC LITIJA' }, { n: 'TPC LJUTOMER' }, { n: 'SPAR MIKLAVŽ' },
  { n: 'TPC SLO. BISTRICA', u: '9. 7. 2026' }, { n: 'TPC TRŽIČ' },
  { n: 'SPAR VOJNIK', u: '13. 3. 2026' }, { n: 'NC VELENJE' }, { n: 'PC DRAVA PTUJ' },
  { n: 'AJDOVŠČINA', u: '14. 7. 2026' }, { n: 'BEZENA 79', u: '14. 7. 2026' },
  { n: 'LJUBLJANSKA 3A', u: '14. 7. 2026' }, { n: 'CAKARJEVA 6', u: '7. 7. 2026' },
  { n: 'VOJNIŠKE TERASE', u: '10. 7. 2026' }, { n: 'MD II/A', u: '14. 7. 2026' },
  { n: 'ŠLANDROV TRG 34A', u: '14. 7. 2026' }, { n: 'CANKARJEVA 8', u: '7. 7. 2026' },
  { n: 'DIII' }, { n: 'DRAPŠINOVA - 3D' }, { n: 'VILA BLOK MEDLOG 2', u: '17. 4. 2024' },
  { n: 'VILA BLOK MEDLOG 1', u: '13. 7. 2026' },
  { n: 'RAZGLEDNA 2', u: '16. 7. 2026' }, { n: 'SAVINJSKO NABREŽJE' },
  { n: 'LENART 2' }, { n: 'GOSPOSKA 2', u: '9. 7. 2026' }, { n: 'SPAR ŠTEPANSKO NASELJE' },
  { n: 'TPC VRHNIKA' }, { n: 'TPC RIBNICA' }, { n: 'TPC POSTOJNA' }, { n: 'TPC PIVKA' },
  { n: 'SPAR TRZIN' }, { n: 'SPAR ZALOŠKA' }, { n: 'TPC RADOVLJICA' }, { n: 'SPAR VRHOVCI' },
  { n: 'SPAR SLOVENČEVA' }, { n: 'SPAR PLANINA' }, { n: 'SPAR PEČNIK' }, { n: 'SPAR BABNIK' },
  { n: 'RC' }
];

/* ── REAL: RAZGLEDNA 2's folders, with the sizes the live portal shows */
const REAL_RAZGLEDNA = [
  { name: 'GASILNIKI',           mb: 1.39,   date: '16. 7. 2026' },
  { name: 'RAČUNI',              mb: 145.97, date: '10. 7. 2026' },
  { name: 'STRELOVODNE NAPRAVE', mb: 2.36,   date: '26. 6. 2023' },
  { name: 'ZAVAROVALNE POLICE',  mb: 6.43,   date: '23. 6. 2026' }
];

/* The four categories above are the real taxonomy this manager uses. */
const TAXONOMY = REAL_RAZGLEDNA.map(f => f.name);

/* ── PLACEHOLDER generation ───────────────────────────────────────── */

// Deterministic PRNG so the prototype looks identical on every reload.
function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const slugify = s => s.toLowerCase()
  .replace(/[čć]/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'd')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const MONTHS = ['januar','februar','marec','april','maj','junij','julij','avgust','september','oktober','november','december'];

// File names per real category. Placeholder documents, real-looking shape.
function filesFor(category, rnd, year) {
  switch (category) {
    case 'GASILNIKI': return [
      { n: `Servisni zapisnik gasilnikov ${year}.pdf` },
      { n: `Pregled gasilnih aparatov ${year - 1}.pdf` },
      { n: 'Popis gasilnikov po etažah.xlsx' }
    ];
    case 'RAČUNI': {
      const out = [];
      const upto = 7; // portal data runs to July 2026
      for (let m = upto; m >= 1; m--) {
        // An invoice is dated inside its own month, not at random.
        const day = 4 + Math.floor(rnd() * 20);
        out.push({ n: `Račun ${String(m).padStart(2,'0')}-${year} · ${MONTHS[m-1]}.pdf`,
                   d: `${day}. ${m}. ${year}` });
      }
      out.push({ n: `Letni obračun stroškov ${year - 1}.pdf`,
                 d: `${12 + Math.floor(rnd() * 10)}. 2. ${year}` });
      return out;
    }
    case 'STRELOVODNE NAPRAVE': return [
      { n: 'Meritve strelovodne napeljave.pdf' },
      { n: 'Poročilo o pregledu strelovodov.pdf' }
    ];
    case 'ZAVAROVALNE POLICE': return [
      { n: `Zavarovalna polica ${year}.pdf` },
      { n: 'Splošni pogoji zavarovanja.pdf' },
      { n: `Dodatek k polici ${year}.pdf` }
    ];
    default: return [{ n: 'Dokument.pdf' }];
  }
}

// Split a folder's total size across its files, so the real RAZGLEDNA 2
// folder totals still add up.
function distribute(totalMb, count, rnd) {
  const w = Array.from({ length: count }, () => 0.5 + rnd());
  const sum = w.reduce((a, b) => a + b, 0);
  return w.map(x => Math.max(0.01, (x / sum) * totalMb));
}

function dateBefore(dstr, rnd, i) {
  const [d, m, y] = dstr.split('.').map(s => parseInt(s.trim(), 10));
  const back = Math.floor(rnd() * 40) + i * 11 + 1;
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - back);
  return `${dt.getDate()}. ${dt.getMonth() + 1}. ${dt.getFullYear()}`;
}

function buildFolders(objName, isReal) {
  const rnd = seeded(objName);
  const src = isReal
    ? REAL_RAZGLEDNA
    : TAXONOMY.map(name => ({
        name,
        mb: +( (name === 'RAČUNI' ? 40 + rnd() * 120 : 0.6 + rnd() * 6) ).toFixed(2),
        date: dateBefore('16. 7. 2026', rnd, 0)
      }));

  return src.map(f => {
    const year = 2026;
    const files = filesFor(f.name, rnd, year);
    const sizes = distribute(f.mb, files.length, rnd).map(v => +v.toFixed(2));
    // Rounding each file to 2dp drifts off the folder total; push the
    // difference onto the largest file so the columns still add up.
    const drift = +(f.mb - sizes.reduce((a, b) => a + b, 0)).toFixed(2);
    if (drift !== 0) {
      let big = 0;
      for (let i = 1; i < sizes.length; i++) if (sizes[i] > sizes[big]) big = i;
      sizes[big] = +(sizes[big] + drift).toFixed(2);
    }
    return {
      name: f.name,
      mb: f.mb,
      date: f.date,
      real: !!isReal,
      files: files.map((x, i) => ({
        name: x.n,
        mb: +sizes[i].toFixed(2),
        date: x.d || dateBefore(f.date, rnd, i),   // x.d = a date the document type implies
        type: x.n.split('.').pop().toLowerCase()
      }))
    };
  });
}

/* ── The object the whole prototype reads ─────────────────────────── */
const HEVA = {
  user: { name: 'Damijan Veber', initials: 'DV', email: 'info@heva.si', role: 'Upravitelj' },
  storage: { usedMiB: 163.74, totalMiB: 5243 },

  objekti: REAL_OBJEKTI.map(o => {
    const isRazgledna = o.n === 'RAZGLEDNA 2';
    const commercial = /^(TPC|SPAR|NC|PC|RC)\b/.test(o.n);
    return {
      slug: slugify(o.n),
      name: o.n,
      kind: commercial ? 'commercial' : 'residential',
      updated: o.u || null,
      folders: buildFolders(o.n, isRazgledna)
    };
  }),

  // PLACEHOLDER — a realistic access picture, not the real resident list.
  uporabniki: [
    { name: 'Damijan Veber', email: 'info@heva.si', role: 'manager', objekti: 'vsi (42)' },
    { name: 'Marko Novak',   email: 'm.novak@example.com',   role: 'resident', objekti: 'RAZGLEDNA 2' },
    { name: 'Ana Kovač',     email: 'a.kovac@example.com',   role: 'resident', objekti: 'RAZGLEDNA 2' },
    { name: 'Peter Zupan',   email: 'p.zupan@example.com',   role: 'resident', objekti: 'VILA BLOK MEDLOG 1' },
    { name: 'Mojca Horvat',  email: 'm.horvat@example.com',  role: 'resident', objekti: 'GOSPOSKA 2' },
    { name: 'Luka Krajnc',   email: 'l.krajnc@example.com',  role: 'resident', objekti: 'CANKARJEVA 8' }
  ],

  // PLACEHOLDER — shows what the audit trail looks like once it runs.
  dnevnik: [
    { who: 'Marko Novak',  what: 'Račun 07-2026 · julij.pdf',        obj: 'RAZGLEDNA 2',        act: 'prenos', when: '16. 7. 2026 08:42' },
    { who: 'Ana Kovač',    what: 'Zavarovalna polica 2026.pdf',      obj: 'RAZGLEDNA 2',        act: 'ogled',  when: '15. 7. 2026 19:10' },
    { who: 'Damijan Veber',what: 'Servisni zapisnik gasilnikov.pdf', obj: 'RAZGLEDNA 2',        act: 'prenos', when: '15. 7. 2026 11:05' },
    { who: 'Peter Zupan',  what: 'Letni obračun stroškov 2025.pdf',  obj: 'VILA BLOK MEDLOG 1', act: 'prenos', when: '14. 7. 2026 20:33' },
    { who: 'Mojca Horvat', what: 'Meritve strelovodne napeljave.pdf',obj: 'GOSPOSKA 2',         act: 'ogled',  when: '14. 7. 2026 16:58' },
    { who: 'Luka Krajnc',  what: 'Račun 06-2026 · junij.pdf',        obj: 'CANKARJEVA 8',       act: 'prenos', when: '12. 7. 2026 09:21' }
  ]
};

HEVA.bySlug = slug => HEVA.objekti.find(o => o.slug === slug);
