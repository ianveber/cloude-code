/**
 * app.js — the shell. Reads the PDFs in this browser, sends only the restored layout (or a page
 * image) to the server, renders the filled KLP.
 *
 * Imports the SAME lib/ modules the scoring harness imports. Nothing here re-implements
 * extraction, classification, the 545 gate, the counters or the payload — so the numbers the
 * client sees are the numbers the node tests score.
 *
 * PIPELINE (S9). A drop can be one file, many files, or a whole folder.
 *   1. LOOK    every PDF's text layer is read locally and classified. No API call, no reading of
 *              content — just "what kind of document is this". The packet list is rendered in
 *              full BEFORE anything is read, so nothing can be quietly skipped.
 *   2. READ    only the ponudbe (and the scans, whose class is still unknown) go to the model,
 *              one at a time, each line updating as it finishes.
 *   3. GATE    checkPacket() runs last, because the collective/legal-entity exception can only be
 *              known after a ponudba has been read.
 *
 * UI language rule: no technical words on screen. No model names, no "vision track", no
 * "pravilo"/"register"/"payload". No money — not a price, not a cost, not a euro. The user reads
 * plain Slovene.
 */

import * as pdfjs from "./vendor/pdf.mjs";
import { restoreLayout, itemsFromTextContent, serializeRows, pageCharCount, VISION_THRESHOLD } from "./lib/layout.js";
import { toKlp, holderCells, KLP_FIELDS } from "./lib/extract.js";
import { klpHtml, privolitevHtml, splitName, splitAddress } from "./lib/klp.js";
import { classify, DOC, DOC_LABEL } from "./lib/classify.js";
import { checkPacket } from "./lib/gate.js";
import { buildPayload, payloadFilename } from "./lib/edokumenti.js";
import { newRun, noteDoc, summary, ROI_KORAKI, roiSummary, PONUDB_NA_MESEC } from "./lib/runstats.js";

pdfjs.GlobalWorkerOptions.workerSrc = "./vendor/pdf.worker.mjs";

const $ = (s) => document.querySelector(s);
const drop = $("#drop"), fileInput = $("#file"), folderInput = $("#folder"), results = $("#results");
const statusCard = $("#statusCard"), statusEl = $("#status");
const packetCard = $("#packetCard"), packetList = $("#packetList"), packetNote = $("#packetNote");
const packetCount = $("#packetCount");
const gateCard = $("#gateCard"), gateBody = $("#gateBody");
const statsCard = $("#statsCard"), statsEl = $("#stats"), statsNote = $("#statsNote");
const exportCard = $("#exportCard");
const logCard = $("#logCard"), logEl = $("#log"), logCount = $("#logCount");

let register = null;

const LABELS = {
  "zavarovalec.ime_priimek": "Zavarovalec",
  "zavarovalec.naslov_posta_kraj": "Naslov",
  "zavarovalec.telefon": "Telefon",
  "zavarovalec.email": "E-pošta",
  "zavarovanec.ime_priimek": "Zavarovanec",
  "zavarovanec.naslov_posta_kraj": "Naslov zavarovanca",
  "zavarovanec.telefon": "Telefon zavarovanca",
  "zavarovanec.email": "E-pošta zavarovanca",
  "zavarovalnica": "Zavarovalnica",
  "st_ponudbe": "Št. ponudbe",
  "zastopnik_1.ime_priimek": "Zastopnik",
  "zastopnik_1.stevilka": "Številka zastopnika",
  "zastopnik_2.ime_priimek": "Pomožni zastopnik",
  "zastopnik_2.stevilka": "Številka pomožnega",
};

/**
 * Machine provenance -> plain Slovene. The user never sees the internal words.
 *
 * "Potrebujem register" is amber, not red: it is a lookup the client can resolve in one click,
 * not an error. Red would put it on the same visual level as a failure.
 *
 * `quiet` demotes the default case. Nine to twelve identical filled green pills per card turn
 * provenance into wallpaper and leave the amber flags nothing to stand out against, so the
 * everyday "Iz ponudbe" renders as a dot plus muted text and the exceptions keep the colour.
 */
function badge(cell) {
  if (cell.state === "UNMAPPED" || (cell.source === "register" && !cell.value))
    return { cls: "check", text: "Potrebujem register", attn: true };
  if (!cell.value) return { cls: "", text: "", attn: false };
  if (cell.source === "pravilo") return { cls: "check", text: "Za potrditev", attn: true };
  if (cell.source === "register") return { cls: "ok", text: "Iz registra", attn: false };
  return { cls: "ok", text: "Iz ponudbe", attn: false, quiet: true };
}

/**
 * Mask the person-name segments of a filename before it goes into the run log or the status
 * line. Rule (same as scripts/test-classify.mjs safeName): after an underscore, any segment that
 * is nothing but capitalised words is a name.
 *
 * The client's own filenames carry their customers' names — three of the fifteen samples do —
 * and the log is the one panel that stays on a shared screen for the whole meeting. The packet
 * list keeps the full filename, because that is the row the client has to identify.
 */
function safeName(f) {
  const s = String(f ?? "");
  const ext = /\.pdf$/i.test(s) ? s.slice(-4) : "";
  const base = ext ? s.slice(0, -4) : s;
  return base.split("_")
    .map((seg, i) => (i > 0 && /^\p{Lu}[\p{Ll}]*(\s+\p{Lu}[\p{Ll}]*)*$/u.test(seg) ? "•" : seg))
    .join("_") + ext;
}

function setStatus(text, kind = "work") {
  statusCard.classList.remove("hide");
  statusEl.innerHTML = kind === "work"
    ? `<span class="spin"></span><span>${esc(text)}</span>`
    : `<span class="dot ${kind}"></span><span>${esc(text)}</span>`;
}

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/**
 * Slovene has four number forms and every one of these strings is on screen. Getting it wrong
 * ("1 kontrolnih listov") is the fastest way to make a careful system look assembled.
 *   1 -> ednina · 2 -> dvojina · 3,4 -> množina · 5+ -> rodilnik
 *
 * The form follows the LAST digit, not the last two: 21 takes the singular ("21 dokument"),
 * 22 the dual, 23 the plural. The teens are the exception — 11 through 19 all take the
 * genitive, which is why they are caught before the unit is read.
 */
function sklon(n, [ena, dve, tri, pet]) {
  const r = Math.abs(Math.trunc(n)) % 100;
  if (r > 10 && r < 20) return pet;
  const u = r % 10;
  if (u === 1) return ena;
  if (u === 2) return dve;
  if (u === 3 || u === 4) return tri;
  return pet;
}
const DOKUMENT = ["dokument", "dokumenta", "dokumenti", "dokumentov"];
const DOKUMENT_MEST = ["dokumentu", "dokumentih", "dokumentih", "dokumentih"];  // "pri N …"
const PONUDBA_MEST = ["ponudbi", "ponudbah", "ponudbah", "ponudbah"];           // "pri N …"
const LIST = ["kontrolni list", "kontrolna lista", "kontrolni listi", "kontrolnih listov"];
const POLJE = ["polje", "polji", "polja", "polj"];
const PODATEK = ["podatek", "podatka", "podatki", "podatkov"];
const PREVZET = ["prevzet", "prevzeta", "prevzeti", "prevzetih"];
const STEVILKA_ZAST = ["številko zastopnika", "številki zastopnikov",
                       "številke zastopnikov", "številk zastopnikov"];
/**
 * The skipped-file note declines its VERB as well as its noun, so the whole clause travels
 * together: "sta bili še 2 datoteki, ki nista PDF" — not "je bilo … ki niso".
 */
const skipNote = (n) => sklon(n, [
  `V mapi je bila še ${n} datoteka, ki ni PDF — te ne odpiram in je ne štejem med dokumente.`,
  `V mapi sta bili še ${n} datoteki, ki nista PDF — teh ne odpiram in ju ne štejem med dokumente.`,
  `V mapi so bile še ${n} datoteke, ki niso PDF — teh ne odpiram in jih ne štejem med dokumente.`,
  `V mapi je bilo še ${n} datotek, ki niso PDF — teh ne odpiram in jih ne štejem med dokumente.`,
]);
// "razdeljen na N …" — the adjective has to agree with the noun, so they travel together
const PREBRANA_PONUDBA = ["prebrano ponudbo", "prebrani ponudbi", "prebrane ponudbe", "prebranih ponudb"];
/** Decimals take the genitive singular in Slovene: 2,1 ure — but 2 uri and 5 ur. */
const ure = (n) => (Number.isInteger(n) ? sklon(n, ["ura", "uri", "ure", "ur"]) : "ure");

/* ── run state ───────────────────────────────────────────────────────────────
 * One entry per PDF in the drop. `outputs` is whatever toKlp() produced for it (empty for
 * anything that is not a ponudba). The counter card and the eDOKUMENTI payload are both derived
 * from this array, so they can never disagree with the rows on screen.
 */

/** Signals we add ourselves, after a scan has been read. classify.js owns the text-only ones. */
const SIG_SLIKA = "prebrano s slike dokumenta";
const SIG_SLIKA_NIC = "s slike ne prepoznam vrste dokumenta";
const SIG_NEBERLJIVA = "datoteke ni bilo mogoče odpreti";

let entries = [];        // { file, name, klas, signal, scanned, layout, ms, outputs, faza, tipZavarovalca, kolektivno }
let outputsFlat = [];    // { cells, entry, i, n } — flattened for the print buttons
let packetResult = null;
let skippedCount = 0;    // non-PDF files in the drop: named, not hidden, but never counted as documents

/**
 * A drop supersedes whatever was still running. The live-demo script drops a whole folder and
 * then a single ponudba while the first run may still be reading, and without this the older
 * invocation kept iterating its own list and finalising ON TOP of the new one — repainting the
 * packet gate, the counters and "Končano" from a half-classified packet.
 *
 * Every render and every mutation after an `await` is therefore gated on the run's own token.
 * The in-flight request is aborted too, so a superseded read stops costing time immediately.
 */
let runToken = 0;
let inFlight = null;

function resetRun() {
  entries = []; outputsFlat = []; packetResult = null; skippedCount = 0;
  results.innerHTML = "";
  packetList.innerHTML = ""; packetCard.classList.add("hide"); packetCount.textContent = "";
  packetNote.classList.add("hide"); packetNote.textContent = "";
  gateCard.classList.add("hide"); gateBody.innerHTML = "";
  statsCard.classList.add("hide"); statsEl.innerHTML = "";
  exportCard.classList.add("hide");
  logEl.innerHTML = ""; logCard.classList.add("hide"); logCount.textContent = "";
  renderRoi();
}

/**
 * Rebuild the run from scratch on every render. runstats has no update call — a document's field
 * tally changes when it is read, and again when the register arrives — so we replay instead of
 * patching. Pure function of `entries`, which is what makes the card trustworthy.
 */
function currentRun() {
  const run = newRun();
  for (const e of entries)
    noteDoc(run, {
      klas: e.klas, scanned: e.scanned, ms: e.ms, outputs: e.outputs,
      napaka: e.faza === "napaka", neberljiv: e.neberljiv === true,
    });
  return run;
}

/* ── run log ─────────────────────────────────────────────────────────────────
 * Append-only, plain Slovene. Filenames and document classes only — never a value out of a
 * document. (Filenames are already on screen in the packet list; nothing new is exposed here.)
 */
function logLine(text) {
  const d = new Date(), p = (n) => String(n).padStart(2, "0");
  const li = document.createElement("li");
  li.innerHTML = `<span class="t">${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}</span><span>${esc(text)}</span>`;
  logEl.appendChild(li);
  logEl.scrollTop = logEl.scrollHeight;
  logCard.classList.remove("hide");
  logCount.textContent = `· ${logEl.children.length}`;
}

/* ── reading a PDF ───────────────────────────────────────────────────────── */

/** Step 1: the text layer only. Cheap, local, no API call — enough to classify. */
async function peek(file) {
  const buf = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const page = await doc.getPage(1);
  const tc = await page.getTextContent();
  const charCount = pageCharCount(tc);
  const text = tc.items.map((i) => i.str).join(" ");
  const layout = charCount >= VISION_THRESHOLD
    ? serializeRows(restoreLayout(itemsFromTextContent(tc))) : null;
  await doc.destroy();
  return { charCount, text, layout };
}

/**
 * Step 2, for a page with no usable text layer: render it. Annotations OFF — the sticky notes on
 * these scans are Harvest's internal remarks and must never be read as data.
 *
 * NOTE: browsers pause canvas rasterisation while a tab is in the background, and pdf.js
 * render() then never settles — verified, including with OffscreenCanvas. So we race it and
 * surface an honest message instead of hanging on "Berem…" forever.
 */
async function renderImage(file) {
  const buf = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const page = await doc.getPage(1);
  const vp = page.getViewport({ scale: 2.2 });
  const cv = document.createElement("canvas");
  cv.width = vp.width; cv.height = vp.height;
  const task = page.render({
    canvasContext: cv.getContext("2d"), viewport: vp,
    annotationMode: pdfjs.AnnotationMode.DISABLE,
  });
  const outcome = await Promise.race([
    task.promise.then(() => "ok"),
    new Promise((r) => setTimeout(() => r("stalled"), 20000)),
  ]);
  if (outcome === "stalled") {
    try { task.cancel(); } catch {}
    await doc.destroy();
    throw new Error(document.hidden ? "HIDDEN_TAB" : "RENDER_STALLED");
  }
  const imageBase64 = cv.toDataURL("image/png").split(",")[1];
  await doc.destroy();
  return imageBase64;
}

/* ── the KLP card (unchanged behaviour) ──────────────────────────────────── */

function fieldRows(cells) {
  return KLP_FIELDS.map((f) => {
    const c = cells[f] || { value: null, source: null };
    const b = badge(c);
    return `<div class="row${b.attn ? " attn" : ""}">
      <div class="k">${LABELS[f]}</div>
      <div class="v${c.value ? "" : " empty"}">${c.value ? esc(c.value) : "—"}</div>
      <div>${b.text ? `<span class="tag ${b.cls}${b.quiet ? " quiet" : ""}">${b.text}</span>` : ""}</div>
    </div>`;
  }).join("");
}

/** The one banner the client can act on in the room. */
function registerBanner() {
  return `<div class="banner"><span>⚠️</span><div>
      <div class="t">Številke zastopnika ni v ponudbi</div>
      <div class="muted">Ponudba nosi licenco AZN, kontrolni list pa vašo interno številko.
      Potrebujem vaš register zastopnikov.</div>
      <div style="margin-top:10px"><button class="btn" data-reg="1">Naloži register zastopnikov</button></div>
    </div></div>`;
}

function renderKlp(cells, idx, scanned, gi, docName) {
  const needsReg = cells["zastopnik_1.stevilka"]?.state === "UNMAPPED";

  /**
   * Only the ZAVAROVANEC fields are inherited from the zavarovalec. The offer-number fallback is
   * also a derived cell, but it has nothing to do with the policyholder — collecting it under
   * this banner said something untrue on every Premoženje and Popotnik offer, which is two of
   * the client's own products. It gets its own line, naming the label actually read.
   */
  const inherited = KLP_FIELDS.filter(
    (f) => f.startsWith("zavarovanec.") && cells[f]?.source === "pravilo");
  const n = inherited.length;
  const stPonudbe = cells["st_ponudbe"];
  const derivedNumber = stPonudbe?.source === "pravilo" && stPonudbe?.value;

  const banners =
    (needsReg ? registerBanner() : "") +
    (n ? `<div class="banner"><span>👤</span><div>
        <div class="t">${n} ${sklon(n, PODATEK)} ${sklon(n, PREVZET)} od zavarovalca</div>
        <div class="muted">Zavarovanec nima svojega naslova ali telefona — prevzeto od zavarovalca. Prosim potrdite.</div>
      </div></div>` : "") +
    // The label is QUOTED, never inflected: it is the client's own field name, and there is no
    // safe way to decline an arbitrary one ("nosi številka pogodbe" is what guessing produces).
    (derivedNumber ? `<div class="banner"><span>🔢</span><div>
        <div class="t">Ponudba nima polja Številka ponudbe</div>
        <div class="muted">Številko sem prebral iz polja
        &raquo;${esc(stPonudbe.oznaka || "Številka pogodbe")}&laquo;. Prosim potrdite, da je to
        prava številka za kontrolni list.</div>
      </div></div>` : "");

  const name = splitName(cells["zavarovalec.ime_priimek"]?.value);
  const addr = splitAddress(cells["zavarovalec.naslov_posta_kraj"]?.value);
  const privWarn = !name || !addr
    ? `<p class="muted">Privolitvene izjave ne izpolnim samodejno — imena ali naslova ni mogoče zanesljivo razdeliti.</p>` : "";

  return `<div class="card">
    <h3>Kontrolni list${idx ? " — " + esc(cells["zavarovanec.ime_priimek"]?.value ?? "") : ""}</h3>
    ${docName ? `<p class="muted" style="margin:-6px 0 12px">Iz dokumenta: ${esc(docName)}</p>` : ""}
    ${scanned ? `<p class="muted">Dokument nima besedila — prebran s slike. Ročne opombe na dokumentu so prezrte.</p>` : ""}
    ${banners}
    <div class="split">
      <div>${fieldRows(cells)}</div>
      <div>
        <iframe title="Kontrolni list" loading="lazy" srcdoc="${esc(klpHtml(cells, { screen: true }))}"></iframe>
        <div style="margin-top:10px;display:flex;gap:8px">
          <button class="btn ghost" data-pdf="klp:${gi}">Shrani kontrolni list</button>
          <button class="btn ghost" data-pdf="priv:${gi}">Shrani privolitveno izjavo</button>
        </div>
        ${privWarn}
      </div>
    </div>
  </div>`;
}

/**
 * A ponudba that was read successfully but names NOBODY as insured — the collective legal-entity
 * policy. It produces no kontrolni list, so there is nothing to preview and nothing to save; the
 * card exists to show what WAS read and to say plainly why the form stops here.
 */
function renderNepoimenovan(e, docName) {
  const cells = e.nepoimenovan || {};
  const needsReg = cells["zastopnik_1.stevilka"]?.state === "UNMAPPED";
  return `<div class="card">
    <h3>Kontrolnega lista ne izpolnim</h3>
    ${docName ? `<p class="muted" style="margin:-6px 0 12px">Iz dokumenta: ${esc(docName)}</p>` : ""}
    ${e.scanned ? `<p class="muted">Dokument nima besedila — prebran s slike. Ročne opombe na dokumentu so prezrte.</p>` : ""}
    <div class="banner"><span>🛑</span><div>
      <div class="t">Zavarovanci niso poimensko navedeni</div>
      <div class="muted">Kontrolni list potrebuje ime zavarovanca, tega pa v dokumentu ni.
      Tega ne ugibam — dokument gre v ročni pregled. Spodaj je vse, kar sem iz njega prebral.</div>
    </div>
    ${needsReg ? registerBanner() : ""}
    <div>${fieldRows(cells)}</div>
  </div>`;
}

function renderResults() {
  outputsFlat = [];
  for (const e of entries)
    e.outputs.forEach((cells, i) => outputsFlat.push({ cells, entry: e, i, n: e.outputs.length }));
  // name the source document only when more than one document produced a card — otherwise noise
  const cards = entries.filter((e) => e.outputs.length || e.nepoimenovan).length;
  const many = cards > 1;

  let gi = 0;
  const html = [];
  for (const e of entries) {
    const docName = many ? e.name : null;
    if (e.outputs.length) {
      e.outputs.forEach((cells, i) =>
        html.push(renderKlp(cells, e.outputs.length > 1 ? i + 1 : 0, e.scanned, gi++, docName)));
    } else if (e.nepoimenovan) {
      html.push(renderNepoimenovan(e, docName));
    }
  }
  results.innerHTML = html.join("");
}

/* ── packet list ─────────────────────────────────────────────────────────── */

const TAG_CLS = {
  [DOC.PONUDBA]: "blue",
  [DOC.CLEN545]: "neutral",
  [DOC.KLP]: "neutral",
  [DOC.PRIVOLITVENA]: "neutral",
  [DOC.NEZNANO]: "check",
  [DOC.NEBRANO]: "check",
};

/** Plain Slovene for where this document stands in this run. */
function docState(e) {
  if (e.faza === "berem") return { spin: true, text: e.scanned ? "Berem s slike…" : "Berem…" };
  if (e.faza === "napaka") return { text: "Branja ni bilo mogoče dokončati" };
  if (e.faza === "prebrano") {
    const n = e.outputs.length;
    const base = e.scanned ? "Prebrano s slike" : "Prebrano";
    if (!n) return { text: `${base} — kontrolnega lista ne izpolnim` };
    return { text: `${base} · ${n > 1 ? n + " " : ""}${sklon(n, LIST)}` };
  }
  if (e.klas === DOC.PONUDBA) return { text: "Čaka na branje" };
  if (e.klas === DOC.NEBRANO) return { text: "Čaka na branje s slike" };
  if (e.klas === DOC.NEZNANO) return { text: "Za ročni pregled" };
  return { text: "Del paketa" };
}

/**
 * The one line that stays visible when the packet list is folded away. Carries the split the
 * demo script calls out (how many carried text, how many had to be read from the page image,
 * how many go to a human) so that folding the list hides nothing that was being claimed.
 */
function packetSummary() {
  const s = summary(currentRun());
  const parts = [`${s.dokumentov} ${sklon(s.dokumentov, DOKUMENT)}`];
  if (s.besedilnih) parts.push(`${s.besedilnih} z besedilom`);
  if (s.skeniranih) parts.push(`${s.skeniranih} s slike`);
  const rocno = s.neprepoznanih + s.neuspelih + s.neberljivih;
  if (rocno) parts.push(`${rocno} za ročni pregled`);
  return parts.join(" · ");
}

function renderPacket() {
  if (!entries.length && !skippedCount) { packetCard.classList.add("hide"); return; }
  packetCard.classList.remove("hide");
  packetCount.textContent = entries.length ? `· ${packetSummary()}` : "";
  packetList.innerHTML = entries.map((e) => {
    const st = docState(e);
    return `<div class="doc">
      <div class="dn">${esc(e.name)}<span class="sig">${esc(e.signal)}</span></div>
      <div><span class="tag ${TAG_CLS[e.klas] || "neutral"}">${esc(DOC_LABEL[e.klas])}</span></div>
      <div class="ds">${st.spin ? '<span class="spin sm"></span>' : ""}<span>${esc(st.text)}</span></div>
    </div>`;
  }).join("");
  if (skippedCount) {
    packetNote.classList.remove("hide");
    packetNote.textContent = skipNote(skippedCount);
  } else packetNote.classList.add("hide");
}

/* ── the 545 gate ────────────────────────────────────────────────────────── */

function renderGate() {
  if (!packetResult || !packetResult.razlog) { gateCard.classList.add("hide"); return; }
  const { status, razlog, manjka } = packetResult;

  // A packet with documents we could not read is not a packet we can call complete. The gate's
  // own sentence stays true and stays on screen; the green tick does not.
  const unread = entries.filter((e) => e.faza === "napaka").length;

  const look = status === "zadrzano" ? { cls: "", icon: "⏸️", t: "Paket zadržan" }
             : status === "izjema"   ? { cls: " info", icon: "↪️", t: "Izjema — posebna obravnava" }
             : unread                ? { cls: "", icon: "⚠️", t: "Paketa ne morem potrditi kot popolnega" }
             :                         { cls: " ok", icon: "✅", t: "Paket je popoln" };
  const missing = manjka?.length
    ? `<div class="muted" style="margin-top:6px">Manjka: ${manjka.map(esc).join(", ")}</div>` : "";
  const exempt = status === "izjema"
    ? `<div class="muted" style="margin-top:6px">To ni pomanjkljivost paketa — pri tej obliki
       zavarovanja 545. člen sploh ne nastane. Paket gre naprej, z zaznamkom.</div>` : "";
  const unreadNote = unread
    ? `<div class="muted" style="margin-top:6px">Pri ${unread} ${sklon(unread, DOKUMENT_MEST)}
       branja ni bilo mogoče dokončati, zato popolnosti paketa ne morem potrditi.</div>` : "";
  gateBody.innerHTML = `<div class="banner${look.cls}"><span>${look.icon}</span><div>
      <div class="t">${look.t}</div>
      <div class="muted">${esc(razlog)}</div>${missing}${exempt}${unreadNote}
    </div></div>`;
  gateCard.classList.remove("hide");
}

/* ── counter card ────────────────────────────────────────────────────────── */

/**
 * The counter card, at a metre.
 *
 * Eight equal tiles — three of them restating the packet list one number at a time, half of them
 * zeros — read as a row of digits. So the card carries only figures that describe the OUTPUT of
 * the run, at one weight; the per-document text/image split moved to the packet card's summary
 * line, where it sits next to the rows it describes.
 *
 * Two tiles are conditional, and both mean work for a person: the amber "za potrditev" is always
 * shown because it is the honest counterweight to the filled count, and the orange "za ročni
 * pregled" appears only when something actually needs one. A failed read used to vanish here
 * entirely — the card said "0 za ročni pregled" above three rows that said branja ni bilo mogoče
 * dokončati.
 */
function renderStats() {
  if (!entries.length) { statsCard.classList.add("hide"); return; }
  const s = summary(currentRun());
  const rocno = s.neprepoznanih + s.neuspelih + s.neberljivih;
  const tiles = [
    [s.dokumentov, `${sklon(s.dokumentov, DOKUMENT)} v paketu`, ""],
    [s.kontrolnihListov, sklon(s.kontrolnihListov, LIST), ""],
    [s.poljSkupaj ? `${s.poljIzpolnjenih}/${s.poljSkupaj}` : "—", "polj izpolnjenih", ""],
    [s.poljZaPotrditev, `${sklon(s.poljZaPotrditev, POLJE)} za potrditev`, " attn"],
    ...(rocno ? [[rocno, "za ročni pregled", " bad"]] : []),
    [`${s.sekund.toLocaleString("sl-SI")} s`, "porabljenega časa", ""],
  ];
  statsEl.innerHTML = tiles
    .map(([n, l, cls]) => `<div class="stat${cls}"><div class="n">${esc(n)}</div><div class="l">${esc(l)}</div></div>`)
    .join("");
  statsNote.textContent = s.skeniranih
    ? `Od tega ${s.besedilnih} ${sklon(s.besedilnih, DOKUMENT)} z besedilnim slojem in `
      + `${s.skeniranih} brez njega — prebrani s slike strani. `
      + "Vse številke so iz tega pregleda; nič ni shranjeno od prej."
    : "Vse številke so iz tega pregleda — nič ni shranjeno od prej.";
  statsCard.classList.remove("hide");
}

/* ── eDOKUMENTI hand-off ─────────────────────────────────────────────────── */

function payloadNow() {
  return buildPayload({
    outputs: entries.flatMap((e) => e.outputs),
    docs: packetDocs(),
    packet: packetResult,
    run: currentRun(),
  });
}

/** The payload carries personal data. Download only — never logged, never rendered. */
function downloadPayload() {
  const run = currentRun();
  const blob = new Blob([JSON.stringify(payloadNow(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = payloadFilename(run);
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  logLine("Pripravljen predlog podatkov za eDOKUMENTE.");
}

/* ── ROI capture — time only, never money ────────────────────────────────── */

const roiMinutes = {};

function renderRoiInputs() {
  $("#roiSteps").innerHTML = ROI_KORAKI.map((k) => `
    <label for="roi-${k.id}">${esc(k.naslov)}</label>
    <input id="roi-${k.id}" data-roi="${k.id}" type="number" min="0" step="0.5"
           inputmode="decimal" placeholder="min" aria-label="${esc(k.naslov)} — minut">`).join("");
}

function renderRoi() {
  const s = summary(currentRun());
  const ponudb = entries.filter((e) => e.klas === DOC.PONUDBA && e.faza === "prebrano").length;
  const r = roiSummary({
    minutePoKoraku: roiMinutes,
    strojnoSekund: s.sekund,
    stDokumentov: ponudb,
    ponudbNaMesec: PONUDB_NA_MESEC,
  });
  const num = (n, d = 1) => n.toLocaleString("sl-SI", { maximumFractionDigits: d });

  const machine = ponudb
    ? `<div>Ta pregled: <strong>${num(r.strojnoSekundNaPonudbo)} s</strong> na ponudbo
         <span class="muted">(celoten čas tega pregleda, razdeljen na ${ponudb}
         ${sklon(ponudb, PREBRANA_PONUDBA)})</span></div>`
    : `<div class="muted">Strojni čas se pokaže, ko preberemo vsaj eno ponudbo.</div>`;

  if (!r.vneseno) {
    $("#roiOut").innerHTML = machine +
      `<div class="muted" style="margin-top:8px">Vpišite minute zgoraj in primerjava se izriše sama.</div>`;
    return;
  }

  $("#roiOut").innerHTML = `
    <div class="big">Ročno danes: ${num(r.rocnoMinutNaPonudbo, 2)} min na ponudbo</div>
    <div style="margin-top:6px">${machine}</div>
    <div style="margin-top:12px">
      Pri ${num(r.ponudbNaMesec, 0)} ponudbah na mesec (${num(r.ponudbLetno, 0)} na leto):
      <strong>${num(r.rocnoUrLetno)} ${ure(r.rocnoUrLetno)}</strong> ročnega dela letno${
        ponudb ? `, strojno <strong>${num(r.strojnoUrLetno)} ${ure(r.strojnoUrLetno)}</strong>` : ""}.
    </div>
    ${ponudb ? `<div style="margin-top:6px">Razlika:
       <strong>${num(r.prihranekUrLetno)} ${ure(r.prihranekUrLetno)}</strong> na leto
       ≈ ${num(r.prihranekDniLetno)} delovnih dni po ${num(r.delovnihUrNaDan, 0)} ur.</div>` : ""}
    <p class="muted" style="margin:12px 0 0">Izračun je v času. 400 ponudb na mesec je sredina vašega
    razpona 300–500.</p>`;
}

/* ── scope print ─────────────────────────────────────────────────────────── */

const SCOPE_DOES = [
  "Prepozna vrsto vsakega dokumenta v paketu. Kar ne prepozna, pove naravnost in usmeri v ročni pregled.",
  "Ponudbe z besedilnim slojem prebere iz besedila, tiste brez njega prebere s slike strani. Pot izbere sam.",
  "Iz podatkov ponudbe izpolni kontrolni list in privolitveno izjavo.",
  "Vsakemu podatku pripiše izvor: prebrano iz ponudbe, izpeljano in za potrditev, ali dopolnjeno iz vašega registra.",
  "Preveri prisotnost 545. člena in paket brez njega zadrži z vidnim razlogom.",
  "Kolektivna zavarovanja pravnih oseb prepozna kot izjemo in jih ne zadrži.",
  "Pripravi predlog strukture podatkov za prenos v eDOKUMENTE.",
  "Izmeri, koliko dokumentov je obdelal, koliko polj je izpolnil in koliko jih čaka na potrditev.",
  /**
   * PRIVACY — this line is printed and handed over, so it says what actually leaves the machine.
   *
   * The earlier wording ("Nikamor se ne naložijo") was false: the PDF file itself never leaves
   * the browser, but the restored page text — and for a scanned document a full image of the
   * page — is posted to the local server and forwarded to the reading service. On a packet that
   * contains health data, that difference is not a nuance.
   */
  "Datoteke same ostanejo na vašem računalniku — kot datoteke se nikamor ne naložijo. "
  + "Za branje se posreduje besedilo strani, pri skeniranih dokumentih pa slika strani. "
  + "Ta predstavitev ne shrani ničesar; kje in pod čigavim računom branje teče v produkciji, "
  + "pisno potrdimo v Fazi 0.",
];

const SCOPE_NOT = [
  ["Povezava z eDOKUMENTI in Zavarovalniškim programom",
   "Brez dokumentacije in testnega dostopa vaših dobaviteljev bi bila vsaka povezava ugibanje. Namesto tega predamo predlog strukture podatkov, ki ga skupaj potrdimo v Fazi 0."],
  ["Samodejni prevzem iz e-pošte in zapisovanje na strežnik",
   "V predstavitvi dokumente povlečete sami, da je vidno, kaj sistem prebere iz česa."],
  ["Postopek podpisa",
   "Predstavitev se ustavi pri pripravljenem dokumentu in ga preda vašemu obstoječemu postopku."],
  ["Prijava, baza in shranjevanje",
   "Nič se ne shrani. To je namenoma — vaši dokumenti vsebujejo tudi zdravstvene podatke."],
  ["Celoten nabor vrst dokumentov",
   "Prepoznamo štiri vrste, za katere imamo vaše vzorce. Vse ostalo pošljemo v ročni pregled, namesto da bi ga zaznali na pamet. Preostale vrste iz vaše specifikacije se dodajo ob potrditvi obsega."],
  ["Druga zavarovalnica in druga predloga kontrolnega lista",
   "Predstavitev dela na Merkurju in na vaši predlogi. Širitev je vodena uvedba, ne stranski učinek."],
  ["Pregledna vrsta z dodeljevanjem nalog",
   "Izjeme so v predstavitvi vidne na zaslonu; razporejanje dela med sodelavce je ločena tema."],
  ["Zaigrane napake in prirejene datoteke", null],   // filled in from the run — see scopeNapake()
];

/**
 * The "real failures" claim, counted off the run that is actually on screen.
 *
 * It used to be three hard-coded numbers taken from the eleven sample offers, printed
 * identically on an empty session and on a folder the client had brought themselves — a sentence
 * asserting things about documents it had never seen. Every figure below is now read out of
 * `entries`, and when nothing has been run the sentence simply makes no counted claim.
 */
function scopeNapake() {
  const base = "Vse, kar vidite, se zgodi v živo na vaših dokumentih. Nič ni zaigrano in nobena "
             + "datoteka ni prirejena.";
  if (!entries.length) return base;

  const brani = entries.filter((e) => e.faza === "prebrano");
  const cellsOf = (e) => (e.outputs.length ? e.outputs : e.nepoimenovan ? [e.nepoimenovan] : []);
  const pogodba = brani.filter((e) => cellsOf(e).some((c) => c["st_ponudbe"]?.source === "pravilo")).length;
  const brezRegistra = brani.filter((e) =>
    cellsOf(e).some((c) => c["zastopnik_1.stevilka"]?.state === "UNMAPPED")).length;
  const skenov = entries.filter((e) => e.scanned).length;
  const brezZav = brani.filter((e) => !e.outputs.length && e.nepoimenovan).length;
  const neuspeh = entries.filter((e) => e.faza === "napaka").length;

  const kosi = [];
  if (pogodba) kosi.push(`pri ${pogodba} ${sklon(pogodba, PONUDBA_MEST)} številke ponudbe ni — dokument nosi številko pogodbe`);
  if (skenov) kosi.push(`${skenov} ${sklon(skenov, DOKUMENT)} nima besedila in je prebran s slike strani`);
  if (brezRegistra) kosi.push(`pri ${brezRegistra} ${sklon(brezRegistra, PONUDBA_MEST)} številke zastopnika ni v nobenem dokumentu`);
  if (brezZav) kosi.push(`pri ${brezZav} ${sklon(brezZav, PONUDBA_MEST)} zavarovanci niso poimensko navedeni, zato kontrolnega lista ne izpolnim`);
  if (neuspeh) kosi.push(`pri ${neuspeh} ${sklon(neuspeh, DOKUMENT_MEST)} branja ni bilo mogoče dokončati`);

  return kosi.length
    ? `${base} Napake, ki jih vidite, so resnične — v tem pregledu: ${kosi.join("; ")}.`
    : `${base} V tem pregledu ni bilo nobene takšne napake.`;
}

function scopeHtml() {
  const d = new Date().toLocaleDateString("sl-SI", { day: "numeric", month: "long", year: "numeric" });
  return `<!doctype html><html lang="sl"><head><meta charset="utf-8">
<title>Obseg predstavitve</title>
<style>
  @page{margin:18mm}
  body{font:12pt/1.5 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;color:#1d1d1f;margin:0}
  h1{font-size:20pt;margin:0 0 2px;letter-spacing:-.02em}
  .sub{color:#6e6e73;margin:0 0 26px;font-size:10.5pt}
  h2{font-size:13pt;margin:26px 0 10px;padding-bottom:6px;border-bottom:1px solid #e8e8ed}
  ul{margin:0;padding-left:18px} li{margin:0 0 7px}
  .lead{background:#f5f5f7;border-radius:10px;padding:12px 14px;margin:0 0 14px;font-size:11pt}
  .n{font-weight:600} .w{color:#6e6e73}
  footer{margin-top:30px;padding-top:10px;border-top:1px solid #e8e8ed;color:#6e6e73;font-size:9.5pt}
</style></head><body>
<h1>Prenos dokumentacije — obseg predstavitve</h1>
<p class="sub">Harvest Hub &middot; ${d}</p>

<h2>Kaj ta predstavitev pokaže</h2>
<ul>${SCOPE_DOES.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>

<h2>Kaj je namenoma zunaj njenega obsega</h2>
<p class="lead">Vsaka od spodnjih točk je izpuščena zavestno. Obseg, ki ga potrdimo skupaj, je edini
obseg, za katerega jamčimo — zato ga tu ne širimo na pamet in ne kažemo ničesar, česar ne bi znali
tudi izpeljati.</p>
<ul>${SCOPE_NOT.map(([n, w]) => `<li><span class="n">${esc(n)}.</span> <span class="w">${esc(w ?? scopeNapake())}</span></li>`).join("")}</ul>

<footer>Kar je zunaj obsega te predstavitve, ni nujno zunaj obsega ponudbe — večina zgornjih točk je
del uvedbe in se pisno potrdi ob zaključku Faze 0.<br>AIS &middot; ais-slovenia.si</footer>
</body></html>`;
}

function printWindow(html) {
  const w = window.open("", "_blank");
  if (!w) { setStatus("Brskalnik je blokiral novo okno — dovolite pojavna okna.", "warn"); return; }
  w.document.write(html);
  w.document.close();
  w.onload = () => w.print();
}

/* ── the pipeline ────────────────────────────────────────────────────────── */

const isPdf = (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);
const isHidden = (f) => /(^|\/)\./.test(f.webkitRelativePath || f.name);

function packetDocs() {
  return entries.map((e) => ({
    klas: e.klas,
    ime: e.name,
    tipZavarovalca: e.tipZavarovalca ?? null,
    kolektivno: e.kolektivno === true,
  }));
}

async function handle(fileList) {
  // Claim this run. Everything below returns the moment a newer drop supersedes it.
  const myToken = ++runToken;
  const stale = () => myToken !== runToken;
  if (inFlight) { try { inFlight.abort(); } catch {} inFlight = null; }

  const all = [...fileList].filter((f) => f && !isHidden(f));
  const pdfs = all.filter(isPdf).sort((a, b) => a.name.localeCompare(b.name, "sl"));
  if (!pdfs.length) {
    resetRun();
    drop.classList.remove("busy", "done");
    setStatus(all.length ? "Med izbranimi datotekami ni nobenega PDF-ja." : "Nobene datoteke.", "bad");
    return;
  }

  resetRun();
  drop.classList.add("busy");
  drop.classList.remove("done");
  skippedCount = all.length - pdfs.length;
  logLine(`Prejeto: ${pdfs.length} ${sklon(pdfs.length, DOKUMENT)}.`);

  /* 1 — LOOK. Classify everything first, so the whole packet is on screen before anything is read. */
  setStatus("Pregledujem paket…");
  for (const file of pdfs) {
    const t0 = performance.now();
    let e;
    try {
      const look = await peek(file);
      if (stale()) return;
      const c = classify({ filename: file.name, text: look.text, charCount: look.charCount });
      e = { file, name: file.name, klas: c.klas, signal: c.signal, scanned: c.potrebujeBranje,
            layout: look.layout, ms: 0, outputs: [], nepoimenovan: null, neberljiv: false,
            faza: null, tipZavarovalca: null, kolektivno: false };
    } catch (err) {
      if (stale()) return;
      console.error(err);
      // could not be opened at all: no text layer AND no page image, so it counts as neither
      e = { file, name: file.name, klas: DOC.NEZNANO, signal: SIG_NEBERLJIVA, scanned: false,
            layout: null, ms: 0, outputs: [], nepoimenovan: null, neberljiv: true,
            faza: null, tipZavarovalca: null, kolektivno: false };
    }
    e.ms += performance.now() - t0;
    entries.push(e);
    renderPacket(); renderStats(); renderRoi();
    logLine(`${safeName(e.name)} — ${DOC_LABEL[e.klas]} (${e.signal})`);
  }

  /* 2 — READ. Only ponudbe, plus the scans, whose class the reading step still has to settle. */
  const toRead = entries.filter((e) => e.klas === DOC.PONUDBA || e.klas === DOC.NEBRANO);
  if (!toRead.length) setStatus("V paketu ni ponudbe za branje.", "warn");

  for (const e of toRead) {
    if (stale()) return;
    e.faza = "berem"; renderPacket();
    setStatus(`Berem ${safeName(e.name)}…`);
    const t0 = performance.now();
    try {
      const body = e.layout ? { layout: e.layout } : { imageBase64: await renderImage(e.file) };
      if (stale()) return;
      const ctrl = new AbortController();
      inFlight = ctrl;
      const r = await fetch("/api/extract", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify(body), signal: ctrl.signal,
      });
      const j = await r.json();
      if (inFlight === ctrl) inFlight = null;
      if (stale()) return;
      if (j.error) throw new Error("EXTRACT_FAILED");
      const raw = j.data;

      // A scan could not be fingerprinted by text. Now that it has been read, it can say what it
      // is — and if it does not read as an offer, it goes to a human rather than being forced.
      if (e.klas === DOC.NEBRANO) {
        const vrsta = raw?.vrsta_dokumenta;
        if (vrsta === "ponudba" || vrsta === "polica") { e.klas = DOC.PONUDBA; e.signal = SIG_SLIKA; }
        else {
          e.klas = DOC.NEZNANO; e.signal = SIG_SLIKA_NIC; e.faza = "prebrano";
          e.ms += performance.now() - t0;
          renderPacket(); renderStats(); renderRoi();
          logLine(`${safeName(e.name)} — ${DOC_LABEL[e.klas]} (${e.signal})`);
          continue;
        }
      }

      e.tipZavarovalca = raw?.tip_zavarovalca === "pravna" ? "pravna"
                       : raw?.tip_zavarovalca === "fizicna" ? "fizicna" : null;
      // "Collective" is not a field on these documents. The signal we have is that the offer names
      // nobody as insured — that, together with a legal-entity holder, is the documented exception.
      const kids = (raw?.zavarovani_otroci || []).filter((k) => k && k.ime);
      e.kolektivno = !raw?.zavarovanec?.ime && kids.length === 0;

      e.outputs = toKlp(raw, { register }).map(reResolve);
      // Nobody named as insured: no kontrolni list exists to produce. Keep what WAS read so the
      // card can show it, but it is never counted as a produced list.
      e.nepoimenovan = e.outputs.length ? null : reResolve(holderCells(raw, { register }));
      e.faza = "prebrano";
      logLine(e.outputs.length
        ? `${safeName(e.name)} — prebrano, ${e.outputs.length} ${sklon(e.outputs.length, LIST)}.`
        : `${safeName(e.name)} — prebrano, kontrolnega lista ne izpolnim.`);
    } catch (err) {
      if (stale()) return;
      console.error(err);
      e.faza = "napaka";
      logLine(`${safeName(e.name)} — branja ni bilo mogoče dokončati.`);
      if (err?.message === "HIDDEN_TAB")
        setStatus("Za skenirane dokumente naj bo to okno v ospredju. Pustite zavihek odprt in poskusite znova.", "warn");
    }
    e.ms += performance.now() - t0;
    renderPacket(); renderStats(); renderResults(); renderRoi();
  }

  if (stale()) return;

  /* 3 — GATE. Last, because the exception needs tipZavarovalca, which only exists after reading. */
  packetResult = checkPacket({ docs: packetDocs() });
  renderGate();
  if (packetResult.razlog) logLine(`Popolnost paketa: ${packetResult.razlog}`);

  renderStats(); renderResults(); renderRoi();
  if (entries.some((e) => e.outputs.length)) exportCard.classList.remove("hide");

  const listov = entries.reduce((n, e) => n + e.outputs.length, 0);
  const failed = entries.filter((e) => e.faza === "napaka").length;
  const konec = !toRead.length ? "Končano — v paketu ni ponudbe, iz katere bi izpolnil kontrolni list."
              : listov === 0 ? "Končano — kontrolnega lista ni bilo mogoče pripraviti."
              : listov === 1 ? "Končano." : `Končano — ${listov} ${sklon(listov, LIST)}.`;
  const opomba = failed
    ? ` Pri ${failed} ${sklon(failed, DOKUMENT_MEST)} branje ni uspelo.` : "";
  setStatus(konec + opomba, failed ? "warn" : "go");
  // the hero drop zone has done its job — shrink it so the result sits closer to the top
  drop.classList.remove("busy");
  drop.classList.add("done");
}

/* ── folder / multi-file input ───────────────────────────────────────────── */

/** One directory entry -> File objects. readEntries returns in batches, so it is called in a loop. */
async function walkEntry(entry, out, depth = 0) {
  if (!entry || depth > 6) return;
  if (entry.isFile) {
    const f = await new Promise((res) => entry.file(res, () => res(null)));
    if (f) out.push(f);
    return;
  }
  if (!entry.isDirectory) return;
  const reader = entry.createReader();
  for (;;) {
    const batch = await new Promise((res) => reader.readEntries(res, () => res([])));
    if (!batch.length) break;
    for (const child of batch) await walkEntry(child, out, depth + 1);
  }
}

/**
 * A dragged folder only exists as a DataTransferItem entry. Where that API is missing, the plain
 * file list is used instead — a multi-file drop still works, a folder simply arrives empty and we
 * say so rather than pretending it was read.
 */
async function filesFromDrop(dt) {
  const items = dt.items ? [...dt.items] : [];
  const entriesApi = items.map((i) => (i.webkitGetAsEntry ? i.webkitGetAsEntry() : null)).filter(Boolean);
  if (!entriesApi.length) return [...dt.files];
  const out = [];
  for (const en of entriesApi) await walkEntry(en, out);
  return out.length ? out : [...dt.files];
}

/* ── events ─────────────────────────────────────────────────────────────── */

drop.addEventListener("click", (e) => { if (!e.target.closest("#pickFolder")) fileInput.click(); });
$("#pickFolder").addEventListener("click", (e) => { e.stopPropagation(); folderInput.click(); });
fileInput.addEventListener("change", (e) => handle(e.target.files));
folderInput.addEventListener("change", (e) => handle(e.target.files));

["dragenter", "dragover"].forEach((ev) =>
  drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("hot"); }));
["dragleave", "drop"].forEach((ev) =>
  drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("hot"); }));
drop.addEventListener("drop", async (e) => {
  e.preventDefault();
  handle(await filesFromDrop(e.dataTransfer));
});

/** How many agent-number cells are still waiting for the register, across the whole run. */
function odprtihStevilk() {
  let n = 0;
  for (const en of entries)
    for (const c of [...en.outputs, ...(en.nepoimenovan ? [en.nepoimenovan] : [])])
      if (c["zastopnik_1.stevilka"]?.state === "UNMAPPED") n += 1;
  return n;
}

document.addEventListener("click", async (e) => {
  const regBtn = e.target.closest("[data-reg]");
  if (regBtn) {
    /**
     * The register file is gitignored, so on any machine but the one it was built on the server
     * answers 404 with a body of "{}" — which parses cleanly. The old code took that as success
     * and announced "številke zastopnikov izpolnjene" over rows that had not moved. So the
     * response is checked, and the sentence is built from how many cells actually flipped.
     */
    const pred = odprtihStevilk();
    let nalozen = null;
    try {
      const r = await fetch("/api/register");
      if (r.ok) {
        const j = await r.json();
        if (j && typeof j === "object" && !Array.isArray(j) && Object.keys(j).length) nalozen = j;
      }
    } catch (err) { console.error(err); }

    if (!nalozen) {
      setStatus("Registra zastopnikov ni bilo mogoče naložiti — številke ostajajo za dopolnitev.", "warn");
      logLine("Registra zastopnikov ni bilo mogoče naložiti — nič se ni spremenilo.");
      return;
    }

    register = nalozen;
    // resolve into the stored cells, so the rows, the counters and the payload all agree
    for (const en of entries) {
      en.outputs = en.outputs.map(reResolve);
      if (en.nepoimenovan) en.nepoimenovan = reResolve(en.nepoimenovan);
    }
    renderResults(); renderStats(); renderRoi();

    const dopolnjenih = pred - odprtihStevilk();
    if (dopolnjenih > 0) {
      const t = `Register naložen — dopolnil sem ${dopolnjenih} ${sklon(dopolnjenih, STEVILKA_ZAST)}.`;
      setStatus(t, "go");
      logLine(t);
    } else {
      setStatus("Register naložen, a za nobenega od teh zastopnikov v njem ni številke.", "warn");
      logLine("Register naložen — v njem ni številke za nobenega od teh zastopnikov.");
    }
    return;
  }
  const pdfBtn = e.target.closest("[data-pdf]");
  if (pdfBtn) {
    const [kind, gi] = pdfBtn.dataset.pdf.split(":");
    const cells = outputsFlat[+gi]?.cells;
    if (!cells) return;
    printWindow(kind === "klp" ? klpHtml(cells) : privolitevHtml(cells));
  }
});

$("#exportBtn").addEventListener("click", downloadPayload);
$("#scopeBtn").addEventListener("click", () => printWindow(scopeHtml()));

$("#roiSteps").addEventListener("input", (e) => {
  const id = e.target?.dataset?.roi;
  if (!id) return;
  roiMinutes[id] = e.target.value;
  renderRoi();
});

/** Re-run the agent-number lookup once the register is available. */
function reResolve(cells) {
  const c = { ...cells };
  const name = c["zastopnik_1.ime_priimek"]?.value;
  if (register && name && register[name]) {
    c["zastopnik_1.stevilka"] = { value: register[name], source: "register" };
  }
  return c;
}

renderRoiInputs();
renderRoi();
