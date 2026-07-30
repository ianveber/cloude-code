# Getting the real archive out of Chamilo

The importer is built and tested — `import-chamilo.mjs`. It needs the files
on disk first, and that part has to be you.

**Why I can't fetch them.** `http://www.heva.si/arhiv-heva/` is a login form,
and I don't enter credentials into login forms. It's also plain **HTTP**, so
anything typed there crosses the network unencrypted — which is the whole
reason this portal is being replaced.

---

## Pick whichever access you have

### A. Hosting access (best — one archive, everything, real dates)

Chamilo 1.9 keeps every course's files on disk:

    <chamilo_root>/courses/<COURSE_CODE>/document/…

Over SSH:

```bash
cd /path/to/arhiv-heva && tar czf ~/heva-arhiv.tar.gz courses
```

Or pull `courses/` over FTP/SFTP. This preserves folder structure **and file
modification dates**, which become the document dates in the portal.

One wrinkle: directories are named by Chamilo course *code* (e.g. `RAZGL2`),
not by the object name. Either rename them, or hand me the code→name list and
I'll generate the mapping file.

### B. Admin backup (no shell needed)

Chamilo admin → **Administration → Courses → Backup**, per course. Produces a
zip each. 42 courses is tedious but it works, and the zips contain the same
`document/` tree.

### C. Per-course download (smallest access)

Inside each course → **Documents** → select all → **Download** (zip).
Same result, most clicking.

---

## Then the import

Extract everything so each object is one top-level directory:

    arhiv/
      RAZGLEDNA 2/
        GASILNIKI/            Servisni zapisnik 2026.pdf
        RAČUNI/               Račun 07-2026.pdf
      GOSPOSKA 2/
        ZAVAROVALNE POLICE/   Polica 2026.pdf

**Always dry-run first — it writes nothing and shows the mapping:**

```bash
node import-chamilo.mjs --source ~/Downloads/arhiv
```

Check every object mapped (`ok`) and nothing says `MISS`. Then:

```bash
node import-chamilo.mjs --source ~/Downloads/arhiv --commit --replace
```

`--replace` clears the seeded placeholder documents for each object it
touches, so you don't end up with real and fake side by side.

Trial a single object first if you'd rather ease in:

```bash
node import-chamilo.mjs --source ~/Downloads/arhiv --commit --replace --only razgledna-2
```

For anything unmatched, write a map file and pass `--map map.json`:

```json
{ "RAZGL2": "razgledna-2", "GOSP2": "gosposka-2" }
```

---

## Verified behaviour

Tested end-to-end against the live project with a fixture, then rolled back:

- Maps export folders to objects by name, then by slug; unmatched are listed
  and **skipped**, never guessed
- Skips Chamilo internals — `chat_files`, `shared_folder`, `Mape uporabnikov`,
  `Zgodovina konverzacije iz klepeta`, `.htaccess`
- Uploads to the private bucket, writes the `documents` row, uses each file's
  real modification time as its date
- Signs in as a **manager and writes through normal RLS** — it never uses the
  secret key, so the security model isn't bypassed to run the migration
- Round trip confirmed: uploaded a file, issued a signed URL, downloaded the
  exact bytes back; a resident of another building got `Object not found`

### One gotcha it already handles

Supabase Storage **rejects non-ASCII object keys** — `RAČUNI/Račun 07-2026.pdf`
fails outright with `InvalidKey`. Since this archive is full of č/š/ž, the
importer folds the storage *key* to ASCII (`rc/RACUNI/Racun-07-2026.pdf`) while
`documents.name` keeps the real Slovene text. Users always see the correct
name; only the internal path is folded. Collisions after folding get a numeric
suffix, because `storage_path` is UNIQUE.

---

## After the real import

- Delete the demo accounts `upravitelj@heva-demo.si` and `stanovalec@heva-demo.si`
- Turn **off** public signup (still on)
- Drop the "Predogled · vzorčni dokumenti" pill in `portal-ui/dokumenti.html` —
  once the documents are real, that label is wrong
- Storage: Pro includes 100 GB, so the several-GB archive has plenty of room
