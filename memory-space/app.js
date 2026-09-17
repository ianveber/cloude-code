/* Memory Space — Obsidian-style vault with LLM source colors. */
(function () {
  const ALIASES = {
    claude: "claude",
    anthropic: "claude",
    sonnet: "claude",
    chatgpt: "chatgpt",
    chat: "chatgpt",
    gpt: "chatgpt",
    openai: "chatgpt",
    cursor: "cursor",
    ian: "ian",
    human: "ian",
  };

  const state = {
    vault: null,
    notesById: {},
    view: "note",
    noteId: null,
    enabled: { claude: true, chatgpt: true, cursor: true, ian: true },
    collapsed: {},
    paletteOpen: false,
    paletteQuery: "",
    paletteIndex: 0,
    graph: null,
  };

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalizeSource(raw) {
    if (!raw) return null;
    const token = String(raw).trim().toLowerCase().split(/\s+/)[0].replace(/[()[\],.]/g, "");
    return ALIASES[token] || (state.vault?.palette?.[token] ? token : null);
  }

  function sourceColor(source) {
    return state.vault?.palette?.[source]?.color || "#8a8680";
  }

  function sourceLabel(source) {
    return state.vault?.palette?.[source]?.label || source;
  }

  function visibleNotes() {
    return state.vault.notes.filter((note) =>
      note.sources.some((source) => state.enabled[source] !== false)
    );
  }

  function resolveTarget(target) {
    const cleaned = String(target).replace(/\\/g, "/").replace(/\.md$/, "").trim();
    if (state.notesById[cleaned]) return cleaned;
    const lowered = cleaned.toLowerCase();
    for (const id of Object.keys(state.notesById)) {
      if (id.toLowerCase() === lowered) return id;
    }
    const stem = cleaned.split("/").pop().toLowerCase();
    const matches = Object.keys(state.notesById).filter(
      (id) => id.split("/").pop().toLowerCase() === stem
    );
    return matches.length === 1 ? matches[0] : null;
  }

  function renderInline(text) {
    let html = escapeHtml(text);
    html = html.replace(
      /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g,
      (_, target, display) => {
        const resolved = resolveTarget(target);
        const label = escapeHtml(display || target);
        if (!resolved) {
          return `<a class="wiki missing" href="#note/${encodeURIComponent(target)}">${label}</a>`;
        }
        const note = state.notesById[resolved];
        const src = note?.source ? ` src-${note.source}` : "";
        return `<a class="wiki${src}" href="#note/${encodeURIComponent(resolved)}">${label}</a>`;
      }
    );
    html = html.replace(
      /\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
      '<a class="ext" href="$2" target="_blank" rel="noopener">$1</a>'
    );
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");
    html = html.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
    return html;
  }

  function isTableRow(line) {
    return line.trim().startsWith("|") && line.trim().endsWith("|");
  }

  function isFencePlaceholder(line) {
    return /^\u0000FENCE\d+\u0000$/.test(line.trim());
  }

  function renderTable(rows) {
    const parsed = rows
      .filter((row) => !/^\s*\|?\s*[-: ]+\|/.test(row))
      .map((row) =>
        row
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((cell) => renderInline(cell.trim()))
      );
    if (!parsed.length) return "";
    const head = parsed[0];
    const body = parsed.slice(1);
    const thead = `<thead><tr>${head.map((cell) => `<th>${cell}</th>`).join("")}</tr></thead>`;
    const tbody = `<tbody>${body
      .map((cells) => `<tr>${cells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
      .join("")}</tbody>`;
    return `<table>${thead}${tbody}</table>`;
  }

  function renderMarkdownBlocks(src) {
    const lines = src.replace(/\r\n/g, "\n").split("\n");
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) {
        i += 1;
        continue;
      }
      if (isFencePlaceholder(line.trim())) {
        out.push(line.trim());
        i += 1;
        continue;
      }
      if (/^\u0000BLOCK\d+\u0000$/.test(line.trim())) {
        out.push(line.trim());
        i += 1;
        continue;
      }
      const heading = /^(#{1,4})\s+(.+)$/.exec(line);
      if (heading) {
        const level = heading[1].length;
        out.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
        i += 1;
        continue;
      }
      if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
        out.push("<hr>");
        i += 1;
        continue;
      }
      if (isTableRow(line)) {
        const rows = [];
        while (i < lines.length && isTableRow(lines[i])) {
          rows.push(lines[i]);
          i += 1;
        }
        out.push(renderTable(rows));
        continue;
      }
      if (/^\s*> /.test(line)) {
        const quote = [];
        while (i < lines.length && /^\s*> /.test(lines[i])) {
          quote.push(lines[i].replace(/^\s*> /, ""));
          i += 1;
        }
        out.push(`<blockquote>${renderMarkdownBlocks(quote.join("\n"))}</blockquote>`);
        continue;
      }
      if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
        const ordered = /^\s*\d+\.\s+/.test(line);
        const items = [];
        while (i < lines.length && (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))) {
          items.push(lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, ""));
          i += 1;
        }
        const tag = ordered ? "ol" : "ul";
        out.push(
          `<${tag}>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</${tag}>`
        );
        continue;
      }
      const para = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !headingLike(lines[i]) &&
        !isTableRow(lines[i]) &&
        !/^\s*[-*]\s+/.test(lines[i]) &&
        !/^\s*> /.test(lines[i]) &&
        !isFencePlaceholder(lines[i].trim()) &&
        !/^\u0000BLOCK\d+\u0000$/.test(lines[i].trim())
      ) {
        para.push(lines[i]);
        i += 1;
      }
      out.push(`<p>${renderInline(para.join(" "))}</p>`);
    }
    return out.join("\n");
  }

  function headingLike(line) {
    return /^(#{1,4})\s+/.test(line) || /^---+$/.test(line.trim());
  }

  function renderMarkdown(raw) {
    if (!raw) return "";
    const fences = [];
    let text = raw.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const index = fences.length;
      fences.push(
        `<pre class="code"><code class="lang-${escapeHtml(lang)}">${escapeHtml(code)}</code></pre>`
      );
      return `\n\u0000FENCE${index}\u0000\n`;
    });
    const blocks = [];
    text = text.replace(
      /<!--\s*source:\s*([A-Za-z0-9_-]+)\s*-->([\s\S]*?)<!--\s*\/source\s*-->/gi,
      (_, src, inner) => {
        const source = normalizeSource(src) || String(src).toLowerCase();
        const index = blocks.length;
        blocks.push(
          `<section class="src-block src-${escapeHtml(source)}" data-source="${escapeHtml(source)}"><div class="src-block-label">${escapeHtml(
            sourceLabel(source)
          )}</div><div class="src-block-body">${renderMarkdownBlocks(inner)}</div></section>`
        );
        return `\n\u0000BLOCK${index}\u0000\n`;
      }
    );
    let html = renderMarkdownBlocks(text);
    html = html.replace(/\u0000BLOCK(\d+)\u0000/g, (_, index) => blocks[Number(index)]);
    html = html.replace(/\u0000FENCE(\d+)\u0000/g, (_, index) => fences[Number(index)]);
    return html;
  }

  function dotsHtml(sources) {
    return `<span class="dots">${sources
      .map((source) => `<i class="${escapeHtml(source)}" title="${escapeHtml(sourceLabel(source))}"></i>`)
      .join("")}</span>`;
  }

  function renderTree() {
    const root = $("tree");
    const tree = state.vault.tree[0];
    const visible = new Set(visibleNotes().map((note) => note.id));
    const parts = ['<div class="tree-label">Vault</div>'];

    function noteButton(item) {
      if (!visible.has(item.id)) return "";
      const active = item.id === state.noteId ? " is-active" : "";
      return `<button class="tree-item${active}" data-id="${escapeHtml(item.id)}" type="button">${dotsHtml(
        item.sources
      )}<span class="title">${escapeHtml(item.title)}</span></button>`;
    }

    function walkFolder(folder, depth) {
      const open = state.collapsed[folder.path] ? " is-collapsed" : "";
      const children = (folder.children || []).map(noteButton).join("");
      const nested = (folder.folders || []).map((child) => walkFolder(child, depth + 1)).join("");
      if (!children && !nested) return "";
      if (!folder.path) return children + nested;
      return `<div class="folder${open}" data-folder="${escapeHtml(folder.path)}"><div class="folder-name">${escapeHtml(
        folder.title
      )}</div><div class="folder-body">${children}${nested}</div></div>`;
    }

    parts.push(walkFolder(tree, 0));
    root.innerHTML = parts.join("");
    root.querySelectorAll(".tree-item").forEach((button) => {
      button.addEventListener("click", () => openNote(button.dataset.id));
    });
    root.querySelectorAll(".folder-name").forEach((label) => {
      label.addEventListener("click", () => {
        const folder = label.parentElement.dataset.folder;
        state.collapsed[folder] = !state.collapsed[folder];
        renderTree();
      });
    });
  }

  function renderFilters() {
    const counts = state.vault.counts || {};
    $("filters").innerHTML = Object.keys(state.vault.palette)
      .map((source) => {
        const on = state.enabled[source] !== false ? " is-on" : "";
        const count = counts[source] || 0;
        if (!count && source === "ian") return "";
        return `<button type="button" class="filter-btn${on}" data-source="${source}"><i class="dot"></i>${escapeHtml(
          sourceLabel(source)
        )} ${count}</button>`;
      })
      .join("");
    $("filters").querySelectorAll(".filter-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const source = button.dataset.source;
        state.enabled[source] = !state.enabled[source];
        renderAll();
      });
    });
  }

  function openNote(id, skipHash) {
    state.view = "note";
    state.noteId = id;
    try {
      localStorage.setItem("memory-space:last", id);
    } catch (_) {
      /* ignore */
    }
    if (!skipHash) location.hash = `note/${encodeURIComponent(id)}`;
    renderAll();
  }

  function renderNote() {
    const main = $("main");
    const meta = $("meta");
    const note = state.notesById[state.noteId];
    if (!note) {
      main.innerHTML = `<div class="crash"><h1>Note not found</h1><p>Pick a file from the vault.</p></div>`;
      meta.innerHTML = "";
      return;
    }
    const mixed = note.sources.length > 1;
    const frameClass = mixed ? "mixed" : note.source;
    const pills = note.sources
      .map((source) => `<span class="src-pill ${source}">${escapeHtml(sourceLabel(source))}</span>`)
      .join("");
    main.innerHTML = `<article class="note source-${frameClass}" data-note="${escapeHtml(note.id)}">
      <div class="note-kicker">${pills}<span class="note-path">${escapeHtml(note.path)}</span></div>
      <div class="note-frame"><div class="prose">${renderMarkdown(note.body)}</div></div>
    </article>`;
    const backlinks = (note.backlinks || [])
      .map((id) => state.notesById[id])
      .filter(Boolean);
    meta.innerHTML = `
      <div class="meta-label">Source</div>
      <p class="meta-title">${escapeHtml(note.title)}</p>
      <p class="meta-row">Last writer: ${escapeHtml(sourceLabel(note.source))}</p>
      <p class="meta-row">Updated: ${escapeHtml(note.last_updated || "—")}</p>
      <p class="meta-row">${note.word_count} words · ${note.resolved_links.length} links</p>
      <div class="meta-label">Backlinks</div>
      ${
        backlinks.length
          ? backlinks
              .map(
                (item) =>
                  `<button class="backlink" data-id="${escapeHtml(item.id)}" type="button">${dotsHtml(
                    item.sources
                  )} ${escapeHtml(item.title)}</button>`
              )
              .join("")
          : `<p class="empty">No other notes point here yet.</p>`
      }
    `;
    meta.querySelectorAll(".backlink").forEach((button) => {
      button.addEventListener("click", () => openNote(button.dataset.id));
    });
  }

  function renderLedger() {
    const main = $("main");
    const entries = (state.vault.ledger || []).filter((entry) =>
      (entry.sources || [entry.source]).some((source) => state.enabled[source] !== false)
    );
    if (!entries.length) {
      main.innerHTML = `<div class="crash"><h1>Ledger</h1><p>No entries match the source filters.</p></div>`;
      return;
    }
    main.innerHTML = `<div class="ledger">${entries
      .map((entry) => {
        const color = sourceColor(entry.source);
        return `<article class="ledger-item">
          <div class="ledger-spine" style="background:${color};color:${color}"></div>
          <div class="ledger-card" style="color:${color}">
            <div class="when">${escapeHtml(entry.date)} · ${escapeHtml(sourceLabel(entry.source))}</div>
            <h3>${escapeHtml(entry.heading)}</h3>
            <pre>${escapeHtml(entry.body)}</pre>
          </div>
        </article>`;
      })
      .join("")}</div>`;
  }

  function stopGraph() {
    if (!state.graph) return;
    if (state.graph.raf) cancelAnimationFrame(state.graph.raf);
    if (state.graph.onResize) window.removeEventListener("resize", state.graph.onResize);
    if (state.graph.onUp) window.removeEventListener("mouseup", state.graph.onUp);
    state.graph = null;
  }

  function renderGraph() {
    const main = $("main");
    main.innerHTML = `<div class="graph-wrap"><canvas id="graphCanvas"></canvas><div class="graph-hint">Drag nodes · click to open · filters hide writers</div></div>`;
    const canvas = $("graphCanvas");
    const ctx = canvas.getContext("2d");
    const notes = visibleNotes();
    const allowed = new Set(notes.map((note) => note.id));
    const nodes = notes.map((note, index) => ({
      id: note.id,
      title: note.title,
      sources: note.sources,
      source: note.source,
      x: 0.5 + Math.cos((index / notes.length) * Math.PI * 2) * 0.22,
      y: 0.5 + Math.sin((index / notes.length) * Math.PI * 2) * 0.22,
      vx: 0,
      vy: 0,
    }));
    const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
    const edges = state.vault.edges.filter(
      (edge) => allowed.has(edge.from) && allowed.has(edge.to)
    );
    const graph = {
      canvas,
      ctx,
      nodes,
      nodeMap,
      edges,
      drag: null,
      hover: null,
      raf: 0,
    };
    state.graph = graph;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      graph.w = rect.width;
      graph.h = rect.height;
      graph.dpr = dpr;
    }

    function toPx(node) {
      return { x: node.x * graph.w, y: node.y * graph.h };
    }

    function step() {
      const n = nodes.length;
      for (let i = 0; i < n; i += 1) {
        for (let j = i + 1; j < n; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          const force = 0.00045 / dist;
          dx /= dist;
          dy /= dist;
          a.vx += dx * force;
          a.vy += dy * force;
          b.vx -= dx * force;
          b.vy -= dy * force;
        }
      }
      edges.forEach((edge) => {
        const a = nodeMap[edge.from];
        const b = nodeMap[edge.to];
        if (!a || !b) return;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        a.vx += dx * 0.012;
        a.vy += dy * 0.012;
        b.vx -= dx * 0.012;
        b.vy -= dy * 0.012;
      });
      nodes.forEach((node) => {
        if (graph.drag === node) return;
        node.vx += (0.5 - node.x) * 0.01;
        node.vy += (0.5 - node.y) * 0.01;
        node.vx *= 0.82;
        node.vy *= 0.82;
        node.x = Math.min(0.94, Math.max(0.06, node.x + node.vx));
        node.y = Math.min(0.94, Math.max(0.06, node.y + node.vy));
      });
    }

    function draw() {
      const { ctx: c, w, h, dpr } = graph;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);
      c.strokeStyle = "rgba(236,232,225,0.08)";
      c.lineWidth = 1;
      edges.forEach((edge) => {
        const a = toPx(nodeMap[edge.from]);
        const b = toPx(nodeMap[edge.to]);
        c.beginPath();
        c.moveTo(a.x, a.y);
        c.lineTo(b.x, b.y);
        c.stroke();
      });
      nodes.forEach((node) => {
        const p = toPx(node);
        const radius = graph.hover === node ? 11 : 8;
        const sources = node.sources.length ? node.sources : [node.source];
        const slice = (Math.PI * 2) / sources.length;
        sources.forEach((source, index) => {
          c.beginPath();
          c.moveTo(p.x, p.y);
          c.arc(p.x, p.y, radius, index * slice - Math.PI / 2, (index + 1) * slice - Math.PI / 2);
          c.closePath();
          c.fillStyle = sourceColor(source);
          c.fill();
        });
        c.beginPath();
        c.arc(p.x, p.y, radius, 0, Math.PI * 2);
        c.strokeStyle = "rgba(8,8,12,0.7)";
        c.stroke();
        if (graph.hover === node || n < 18) {
          c.font = "12px Avenir Next, Segoe UI, sans-serif";
          c.fillStyle = "rgba(236,232,225,0.82)";
          c.fillText(node.title, p.x + 12, p.y + 4);
        }
      });
    }

    function hit(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let best = null;
      let bestDist = 16;
      nodes.forEach((node) => {
        const p = toPx(node);
        const dist = Math.hypot(p.x - x, p.y - y);
        if (dist < bestDist) {
          best = node;
          bestDist = dist;
        }
      });
      return best;
    }

    function loop() {
      step();
      draw();
      graph.raf = requestAnimationFrame(loop);
    }

    graph.onResize = resize;
    graph.onUp = () => {
      graph.drag = null;
    };
    resize();
    window.addEventListener("resize", graph.onResize);
    canvas.addEventListener("mousemove", (event) => {
      if (graph.drag) {
        const rect = canvas.getBoundingClientRect();
        graph.drag.x = (event.clientX - rect.left) / graph.w;
        graph.drag.y = (event.clientY - rect.top) / graph.h;
        graph.drag.vx = 0;
        graph.drag.vy = 0;
      }
      graph.hover = hit(event);
      canvas.style.cursor = graph.hover ? "pointer" : "default";
    });
    canvas.addEventListener("mousedown", (event) => {
      graph.drag = hit(event);
    });
    window.addEventListener("mouseup", graph.onUp);
    canvas.addEventListener("click", (event) => {
      const node = hit(event);
      if (node) openNote(node.id);
    });
    loop();
  }

  function paletteItems() {
    const query = state.paletteQuery.trim().toLowerCase();
    return visibleNotes()
      .filter((note) => {
        if (!query) return true;
        return (
          note.title.toLowerCase().includes(query) ||
          note.path.toLowerCase().includes(query) ||
          note.body.toLowerCase().includes(query)
        );
      })
      .slice(0, 20);
  }

  function renderPalette() {
    const items = paletteItems();
    if (state.paletteIndex >= items.length) state.paletteIndex = 0;
    $("paletteList").innerHTML = items
      .map((note, index) => {
        const active = index === state.paletteIndex ? " is-active" : "";
        return `<li><button type="button" class="${active}" data-id="${escapeHtml(note.id)}">${dotsHtml(
          note.sources
        )}<span>${escapeHtml(note.title)}</span><span class="path">${escapeHtml(note.path)}</span></button></li>`;
      })
      .join("");
    $("paletteList").querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        closePalette();
        openNote(button.dataset.id);
      });
    });
  }

  function openPalette() {
    state.paletteOpen = true;
    state.paletteQuery = "";
    state.paletteIndex = 0;
    $("palette").hidden = false;
    $("paletteInput").value = "";
    renderPalette();
    $("paletteInput").focus();
  }

  function closePalette() {
    state.paletteOpen = false;
    $("palette").hidden = true;
  }

  function setView(view) {
    state.view = view;
    if (view === "graph") location.hash = "graph";
    else if (view === "ledger") location.hash = "ledger";
    else if (state.noteId) location.hash = `note/${encodeURIComponent(state.noteId)}`;
    else location.hash = "note";
    renderAll();
  }

  function renderAll() {
    const shell = $("shell");
    shell.classList.toggle("is-wide", state.view !== "note");
    document.querySelectorAll(".view-btn").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === state.view);
    });
    renderFilters();
    renderTree();
    stopGraph();
    if (state.view === "graph") {
      $("meta").innerHTML = "";
      renderGraph();
    } else if (state.view === "ledger") {
      $("meta").innerHTML = "";
      renderLedger();
    } else {
      renderNote();
    }
  }

  function routeFromHash() {
    const hash = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (hash === "graph") {
      state.view = "graph";
    } else if (hash === "ledger") {
      state.view = "ledger";
    } else if (hash.startsWith("note/")) {
      state.view = "note";
      state.noteId = hash.slice(5);
    } else if (hash === "note" || !hash) {
      state.view = "note";
    }
    renderAll();
  }

  function defaultNoteId() {
    try {
      const last = localStorage.getItem("memory-space:last");
      if (last && state.notesById[last]) return last;
    } catch (_) {
      /* ignore */
    }
    const featured = state.notesById["memory-space"] ? "memory-space" : null;
    const moc = Object.keys(state.notesById).find((id) => /master moc/i.test(id));
    return featured || moc || state.vault.notes[0]?.id;
  }

  function bind() {
    document.querySelectorAll(".view-btn").forEach((button) => {
      button.addEventListener("click", () => setView(button.dataset.view));
    });
    $("searchBtn").addEventListener("click", openPalette);
    $("palette").addEventListener("click", (event) => {
      if (event.target === $("palette")) closePalette();
    });
    $("paletteInput").addEventListener("input", (event) => {
      state.paletteQuery = event.target.value;
      state.paletteIndex = 0;
      renderPalette();
    });
    $("treeToggle").addEventListener("click", () => {
      $("shell").classList.toggle("tree-open");
    });
    document.addEventListener("keydown", (event) => {
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !state.paletteOpen && event.target.tagName !== "INPUT")) {
        event.preventDefault();
        openPalette();
        return;
      }
      if (!state.paletteOpen) {
        if (event.key === "Escape") $("shell").classList.remove("tree-open");
        return;
      }
      const items = paletteItems();
      if (event.key === "Escape") {
        closePalette();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        state.paletteIndex = (state.paletteIndex + 1) % Math.max(items.length, 1);
        renderPalette();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        state.paletteIndex = (state.paletteIndex - 1 + items.length) % Math.max(items.length, 1);
        renderPalette();
      } else if (event.key === "Enter" && items[state.paletteIndex]) {
        event.preventDefault();
        closePalette();
        openNote(items[state.paletteIndex].id);
      }
    });
    window.addEventListener("hashchange", routeFromHash);
  }

  function boot() {
    const vault = window.MEMORY_VAULT;
    if (!vault || !vault.notes) {
      document.body.innerHTML = `<div class="crash"><h1>Memory Space needs an index</h1><p>From the repo root run:</p><p><code>python3 scripts/build-memory-space.py</code></p><p>Then open this page via <code>./scripts/memory-space.sh</code>.</p></div>`;
      return;
    }
    state.vault = vault;
    vault.notes.forEach((note) => {
      state.notesById[note.id] = note;
    });
    state.noteId = defaultNoteId();
    bind();
    if (!location.hash) {
      history.replaceState(null, "", `#note/${encodeURIComponent(state.noteId)}`);
    }
    routeFromHash();
  }

  boot();
})();
