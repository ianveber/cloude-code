# NAVODILA — Pametni filter (produkcija)

Poveljniški center: **`/avtomatizacije/pametni-filter`** (prijavljeni uporabniki Centra).
Zajem na terenu: **`/avtomatizacije/zajem`** (bližnjica `/teren`).

## Promocija iz demota

V tem branžu **ni ločenega gesla** (`INSPECTUS2026` / `demo-gate`). Dostop je isti kot za
VLDR in VIN sortirnik: prijava v Center (`proxy.ts` + Supabase auth). Če Supabase ni
nastavljen (seed način), sta obe orodji odprti lokalno — enako kot ostale strani.

Razlog: prijavljeni inšpektorji ne potrebujejo drugega gesla; geslo je imelo smisel samo
dokler je bil filter javni iframe. `demo-gate.ts` in `actions.ts` v tem drevesu nista
obstajala, zato ju ni bilo treba brisati.

Status v `src/lib/automations.ts`: **Aktivno** (pravi ovoj, ne samo iframe).

Samostojni demo (ista pravila motorja) ostane na `/pametni-filter/index.html` za
pregled v iframe, če ga kdo še kliče.

## Kako preizkusiti

```bash
cd INSPEKTUS/inspectus-os
bun install          # ali npm install
bun test src/lib/pametni-filter/filter-engine.test.ts
bun run dev          # http://localhost:3020
```

### Zajem na terenu (telefon)

1. Odpri `/avtomatizacije/zajem` (na telefonu ali DevTools → mobile).
2. Vpiši ime inšpektorja, ustvari ladjo (npr. `TEST LAGOS`).
3. **Novo vozilo — fotografiraj VIN** (kamera / datoteka).
4. **Fotografiraj poškodbo** — fotografije gredo k *odprtemu* vozilu (meja je gumb, ne EXIF).
5. Drugi inšpektor: zamenjaj ime → ista ladja ali nova seja. Zapisi nosijo `inspector_id`.
6. **Pregled** / **Zaključi serijo**.

Brez Supabase seje živijo v `localStorage`. Z migracijo se shranjujejo v tabele `ships`,
`field_vehicles`, `field_photos`.

### Pametni filter (pisarna)

1. `/avtomatizacije/pametni-filter`
2. Prilepi VIN-e seznama razkladanja (ali CSV/XLSX).
3. Naloži mapo fotografij (EXIF `DateTimeOriginal`).
4. **Zaženi filter** — Tesseract v brskalniku; obkljukaj oblak za `/api/claude/vin`, če lokalni OCR ne prebere.
5. Vozila + predal **Nerazvrščeno**; povleci fotografijo na pravo vozilo.
6. Opozorila v obe smeri: VIN, ki ga ni na seznamu / vozilo na seznamu brez fotografij.

VLDR (`/obdelava`) in VIN sortirnik (`/avtomatizacije/vin`) nista spremenjena.

## Pravila motorja (ne ugibaj)

- VIN = točno 17 znakov, brez I/O/Q.
- Uspešno branje odpre vozilo; poškodbe, ki sledijo, spadajo tja.
- Neberljiv poskus VIN **zapre** prejšnje vozilo; sporne fotografije → Nerazvrščeno.
- Popravek samo če obstaja **edinstven** VIN na seznamu na Hamming razdalji 1.
- Dva inšpektorja = dva toka (ne mešata se).
- Na terenu je meja vozila **gumb**, ne EXIF.

## Migracija in okolje

Nova migracija: `supabase/migrations/20260824140000_vin_field_and_filter.sql`

```bash
cd INSPEKTUS/inspectus-os
bunx supabase db push
```

Ali v SQL Editor prilepi to datoteko (za `schema.sql` init, nato to).

Obstoječi env (ne commitaj `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=          # opcijsko, oblak za VIN
```

Ni novih skrivnosti. Če Supabase ni nastavljen, filter shrani zadnjih 20 rezultatov v
`localStorage`; zajem prav tako.

## Arhitektura

| Pot | Vloga |
|---|---|
| `src/lib/pametni-filter/` | TS port motorja (kanonično) |
| `public/pametni-filter/` | samostojni JS demo (ista pravila) |
| `src/components/pametni-filter/PametniFilter.tsx` | Center ovoj |
| `src/components/zajem/FieldCapture.tsx` | mobilni zajem |
| `src/app/api/claude/vin` | obstoječi oblak OCR (nespremenjen) |
