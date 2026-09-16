/* Pictures in IH: load, crop, rotate, resize, make the four variants the site
   serves (800 and 1600 px, JPG and WebP) and upload them. The tool is a full
   screen modal with a draggable crop box; it works with a mouse and a finger. */

const ASPECTS = [
  { key: 'free', label: 'Prosto', ratio: 0 },
  { key: '16:10', label: '16:10', ratio: 16 / 10 },
  { key: '16:9', label: '16:9', ratio: 16 / 9 },
  { key: '4:3', label: '4:3', ratio: 4 / 3 },
  { key: '3:2', label: '3:2', ratio: 3 / 2 },
  { key: '1:1', label: '1:1', ratio: 1 },
  { key: '4:5', label: '4:5', ratio: 4 / 5 },
];

const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ENT[c]);

/** File, Blob or URL → ImageBitmap (or an <img> when the browser cannot decode into a bitmap). */
export async function loadSource(source) {
  if (typeof source === 'string') {
    const res = await fetch(source, { credentials: 'same-origin' });
    if (!res.ok) throw new Error('Slike ni mogoče naložiti.');
    source = await res.blob();
  }
  if (!/^image\//.test(source.type) && !(source.name && /\.(jpe?g|png|webp|gif|heic|heif|avif)$/i.test(source.name))) {
    throw new Error('Izberite sliko (JPG, PNG ali WebP).');
  }
  try {
    return await createImageBitmap(source);
  } catch {
    return await new Promise((resolve, reject) => {
      const url = URL.createObjectURL(source);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Te slike ne znam odpreti. Uporabite JPG ali PNG.'));
      };
      img.src = url;
    });
  }
}

const sizeOf = (src) => ({ w: src.width ?? src.naturalWidth, h: src.height ?? src.naturalHeight });

function toCanvas(src, rotation = 0) {
  const { w, h } = sizeOf(src);
  const c = document.createElement('canvas');
  const turned = rotation % 180 !== 0;
  c.width = turned ? h : w;
  c.height = turned ? w : h;
  const ctx = c.getContext('2d');
  ctx.translate(c.width / 2, c.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(src, -w / 2, -h / 2);
  return c;
}

const blobOf = (canvas, type, q) => new Promise((r) => canvas.toBlob(r, type, q));

async function b64(blob) {
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s = '';
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
  return btoa(s);
}

/** A source canvas (already cropped) → the variants the site needs. */
export async function makeVariants(canvas, { maxWidth = 1600, quality = 0.86 } = {}) {
  const scaled = (w) => {
    const s = Math.min(1, w / canvas.width);
    const cw = Math.max(1, Math.round(canvas.width * s));
    const ch = Math.max(1, Math.round(canvas.height * s));
    if (s === 1) return canvas;
    const c = document.createElement('canvas');
    c.width = cw;
    c.height = ch;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(canvas, 0, 0, cw, ch);
    return c;
  };
  const big = scaled(maxWidth);
  const small = scaled(Math.min(800, maxWidth));
  const j16 = await blobOf(big, 'image/jpeg', quality);
  const j8 = await blobOf(small, 'image/jpeg', Math.min(0.9, quality));
  const w16 = await blobOf(big, 'image/webp', Math.max(0.6, quality - 0.06));
  const w8 = await blobOf(small, 'image/webp', Math.max(0.6, quality - 0.08));
  const webp = Boolean(w16 && w16.type === 'image/webp' && w8 && w8.type === 'image/webp');
  const files = [
    { suffix: '-1600.jpg', data: await b64(j16) },
    { suffix: '-800.jpg', data: await b64(j8) },
  ];
  if (webp) files.push({ suffix: '-1600.webp', data: await b64(w16) }, { suffix: '-800.webp', data: await b64(w8) });
  return { width: big.width, height: big.height, webp, files, bytes: j16.size + j8.size + (webp ? w16.size + w8.size : 0) };
}

/** Straight upload without the tool: fit to 1600 px, no crop. */
export async function quickVariants(source, opts) {
  const src = await loadSource(source);
  const canvas = toCanvas(src, 0);
  return makeVariants(canvas, opts);
}

/**
 * Opens the picture tool. Resolves with { canvas, variants } after "Uporabi",
 * or null when closed. `source` is a File/Blob or a URL of an existing picture.
 */
export function openPictureTool({ source, title = 'Slika', maxWidth = 1600, aspect = 'free' }) {
  return new Promise(async (resolve) => {
    let src;
    try {
      src = await loadSource(source);
    } catch (err) {
      resolve({ error: err.message });
      return;
    }

    let rotation = 0;
    let base = toCanvas(src, rotation);
    let ratio = ASPECTS.find((a) => a.key === aspect)?.ratio ?? 0;
    let quality = 0.86;
    let maxW = maxWidth;
    const crop = { x: 0, y: 0, w: 0, h: 0 }; /* in displayed pixels */
    let scale = 1; /* source px per displayed px */

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal__box" role="dialog" aria-label="Urejanje slike">
        <div class="modal__bar">
          <h2>${esc(title)}</h2>
          <button class="btn btn--sm" type="button" data-cancel>Prekliči</button>
          <button class="btn btn--sm btn--primary" type="button" data-apply>Uporabi</button>
        </div>
        <div class="ptool">
          <div class="ptool__stage" data-stage>
            <canvas data-canvas></canvas>
            <div class="ptool__crop" data-crop><i data-h="nw"></i><i data-h="ne"></i><i data-h="sw"></i><i data-h="se"></i></div>
          </div>
          <div class="ptool__ctl">
            <div class="ptool__row">
              <label>Izrez</label>
              ${ASPECTS.map((a) => `<button class="btn btn--xs${a.ratio === ratio ? ' is-on' : ''}" type="button" data-aspect="${a.key}">${a.label}</button>`).join('')}
              <button class="btn btn--xs" type="button" data-rotate>Zavrti</button>
              <button class="btn btn--xs" type="button" data-reset>Cel</button>
            </div>
            <div class="ptool__row">
              <label>Največja širina</label>
              ${[800, 1200, 1600, 2000].map((w) => `<button class="btn btn--xs${w === maxW ? ' is-on' : ''}" type="button" data-max="${w}">${w} px</button>`).join('')}
              <label style="margin-left:.5rem">Kakovost</label>
              <input type="range" min="60" max="95" value="${Math.round(quality * 100)}" data-quality style="width:110px">
              <span class="ptool__out" data-out></span>
            </div>
          </div>
        </div>
      </div>`;
    document.body.append(modal);

    const stage = modal.querySelector('[data-stage]');
    const canvas = modal.querySelector('[data-canvas]');
    const box = modal.querySelector('[data-crop]');
    const out = modal.querySelector('[data-out]');

    function layout(keepCrop = false) {
      const sw = stage.clientWidth;
      const sh = stage.clientHeight;
      const fit = Math.min(sw / base.width, sh / base.height, 1);
      const cw = Math.max(1, Math.floor(base.width * fit));
      const ch = Math.max(1, Math.floor(base.height * fit));
      canvas.width = cw;
      canvas.height = ch;
      canvas.getContext('2d').drawImage(base, 0, 0, cw, ch);
      scale = base.width / cw;
      if (!keepCrop) resetCrop();
      else clampCrop();
      place();
    }

    function resetCrop() {
      const cw = canvas.width;
      const ch = canvas.height;
      if (!ratio) Object.assign(crop, { x: 0, y: 0, w: cw, h: ch });
      else {
        let w = cw;
        let h = w / ratio;
        if (h > ch) {
          h = ch;
          w = h * ratio;
        }
        Object.assign(crop, { x: (cw - w) / 2, y: (ch - h) / 2, w, h });
      }
    }

    function clampCrop() {
      crop.w = Math.min(crop.w, canvas.width);
      crop.h = Math.min(crop.h, canvas.height);
      crop.x = Math.min(Math.max(0, crop.x), canvas.width - crop.w);
      crop.y = Math.min(Math.max(0, crop.y), canvas.height - crop.h);
    }

    function place() {
      const r = canvas.getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      box.style.left = `${r.left - s.left + crop.x}px`;
      box.style.top = `${r.top - s.top + crop.y}px`;
      box.style.width = `${crop.w}px`;
      box.style.height = `${crop.h}px`;
      const ow = Math.min(Math.round(crop.w * scale), maxW);
      const oh = Math.round(ow * (crop.h / crop.w));
      out.textContent = `Rezultat ${ow} × ${oh} px`;
    }

    /* dragging */
    let drag = null;
    const onDown = (e) => {
      const handle = e.target.closest('[data-h]')?.dataset.h ?? 'move';
      drag = { handle, x: e.clientX, y: e.clientY, start: { ...crop } };
      box.setPointerCapture?.(e.pointerId);
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      const s = drag.start;
      const cw = canvas.width;
      const ch = canvas.height;
      if (drag.handle === 'move') {
        crop.x = Math.min(Math.max(0, s.x + dx), cw - s.w);
        crop.y = Math.min(Math.max(0, s.y + dy), ch - s.h);
      } else {
        const east = drag.handle.includes('e');
        const south = drag.handle.includes('s');
        let w = east ? s.w + dx : s.w - dx;
        let h = south ? s.h + dy : s.h - dy;
        w = Math.max(40, w);
        h = Math.max(40, h);
        if (ratio) {
          if (Math.abs(dx) > Math.abs(dy)) h = w / ratio;
          else w = h * ratio;
        }
        const x = east ? s.x : s.x + s.w - w;
        const y = south ? s.y : s.y + s.h - h;
        /* keep inside the picture, shrinking if a side hits the edge */
        let nx = Math.max(0, x);
        let ny = Math.max(0, y);
        w = Math.min(w, cw - nx);
        h = Math.min(h, ch - ny);
        if (ratio) {
          if (w / h > ratio) w = h * ratio;
          else h = w / ratio;
          if (!east) nx = s.x + s.w - w;
          if (!south) ny = s.y + s.h - h;
        }
        Object.assign(crop, { x: nx, y: ny, w, h });
      }
      place();
    };
    const onUp = () => {
      drag = null;
    };
    box.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    const onResize = () => layout(true);
    window.addEventListener('resize', onResize);

    modal.addEventListener('click', async (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.aspect) {
        ratio = ASPECTS.find((a) => a.key === b.dataset.aspect).ratio;
        modal.querySelectorAll('[data-aspect]').forEach((x) => x.classList.toggle('is-on', x === b));
        resetCrop();
        place();
      } else if (b.dataset.max) {
        maxW = Number(b.dataset.max);
        modal.querySelectorAll('[data-max]').forEach((x) => x.classList.toggle('is-on', x === b));
        place();
      } else if (b.hasAttribute('data-rotate')) {
        rotation = (rotation + 90) % 360;
        base = toCanvas(src, rotation);
        layout(false);
      } else if (b.hasAttribute('data-reset')) {
        ratio = 0;
        modal.querySelectorAll('[data-aspect]').forEach((x) => x.classList.toggle('is-on', x.dataset.aspect === 'free'));
        resetCrop();
        place();
      } else if (b.hasAttribute('data-cancel')) {
        close(null);
      } else if (b.hasAttribute('data-apply')) {
        b.disabled = true;
        b.textContent = 'Pripravljam …';
        try {
          const sx = Math.round(crop.x * scale);
          const sy = Math.round(crop.y * scale);
          const sw = Math.max(1, Math.round(crop.w * scale));
          const sh = Math.max(1, Math.round(crop.h * scale));
          const outW = Math.min(sw, maxW);
          const outH = Math.round(outW * (sh / sw));
          const c = document.createElement('canvas');
          c.width = outW;
          c.height = outH;
          const ctx = c.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, outW, outH);
          ctx.drawImage(base, sx, sy, sw, sh, 0, 0, outW, outH);
          const variants = await makeVariants(c, { maxWidth: maxW, quality });
          close({ canvas: c, variants });
        } catch (err) {
          close({ error: err.message });
        }
      }
    });
    modal.querySelector('[data-quality]').addEventListener('input', (e) => {
      quality = Number(e.target.value) / 100;
    });
    const onKey = (e) => {
      if (e.key === 'Escape') close(null);
    };
    document.addEventListener('keydown', onKey);

    function close(result) {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKey);
      modal.remove();
      resolve(result);
    }

    requestAnimationFrame(() => layout(false));
  });
}
