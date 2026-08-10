// UI wiring: demo (3 examples), drag/drop an Obdelava export, render Constats.
(function () {
  const { buildConstats, renderConstat, DEMO_MODELS } = window.CONSTAT_ENGINE;
  const $ = (id) => document.getElementById(id);
  const out = $("out"), status = $("status"), drop = $("drop"), file = $("file");

  const setStatus = (msg, err) => { status.textContent = msg; status.className = "status" + (err ? " err" : ""); };
  const render = (models) => { out.innerHTML = models.map(renderConstat).join(""); };

  $("demo").onclick = () => { render(DEMO_MODELS); setStatus(`Prikazani 3 primeri iz e-pošte (zap. št. 1–3).`); };
  $("clear").onclick = () => { out.innerHTML = ""; setStatus(""); file.value = ""; };
  $("print").onclick = () => window.print();

  function handleFile(f) {
    if (!f) return;
    setStatus(`Berem ${f.name} …`);
    const reader = new FileReader();
    reader.onerror = () => setStatus("Datoteke ni bilo mogoče prebrati.", true);
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        // Prefer a sheet literally named "Obdelava"; else the first sheet.
        const name = wb.SheetNames.find((n) => /obdelava/i.test(n)) || wb.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, blankrows: false, defval: "" });
        const models = buildConstats(rows, {});
        if (!models.length) { setStatus("V izvozu ni bilo prepoznanih vozil (preveri stolpec VIN).", true); return; }
        render(models);
        setStatus(`Obdelano: ${models.length} vozil iz zavihka »${name}«.`);
      } catch (err) {
        setStatus("Napaka pri obdelavi: " + (err && err.message ? err.message : err), true);
      }
    };
    reader.readAsArrayBuffer(f);
  }

  drop.onclick = () => file.click();
  file.onchange = (e) => handleFile(e.target.files[0]);
  drop.ondragover = (e) => { e.preventDefault(); drop.classList.add("drag"); };
  drop.ondragleave = () => drop.classList.remove("drag");
  drop.ondrop = (e) => { e.preventDefault(); drop.classList.remove("drag"); handleFile(e.dataTransfer.files[0]); };
})();
