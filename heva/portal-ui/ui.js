/* Shared chrome for the Arhiv Heva UI — formatting, font scale, toast, modal.
   Used by both the offline prototype (data.js) and the live build (live.js). */

const fmtSize = mb => mb >= 1
  ? `${mb.toFixed(2).replace('.', ',')} MB`
  : `${Math.round(mb * 1024)} KB`;

function initFontScale(base) {
  let step = 0;
  window.setFont = dir => {
    step = dir === 0 ? 0 : Math.max(-1, Math.min(2, step + dir));
    document.documentElement.style.fontSize = (base + step * 1.5) + 'px';
  };
}

/* Toast — used wherever an action would hit the backend in the real app. */
function toast(msg, sub) {
  let host = document.querySelector('.toast-host');
  if (!host) {
    host = document.createElement('div');
    host.className = 'toast-host';
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<div class="t-msg"></div>${sub ? '<div class="t-sub"></div>' : ''}`;
  el.querySelector('.t-msg').textContent = msg;
  if (sub) el.querySelector('.t-sub').textContent = sub;
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 260); }, 2600);
}

/* Modal */
function modal(title, bodyHtml, actions) {
  const back = document.createElement('div');
  back.className = 'modal-back';
  back.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="m-head">
        <h3></h3>
        <button class="m-x" aria-label="Zapri">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="m-body"></div>
      <div class="m-foot"></div>
    </div>`;
  back.querySelector('h3').textContent = title;
  back.querySelector('.m-body').innerHTML = bodyHtml;
  const foot = back.querySelector('.m-foot');
  (actions || [{ label: 'Zapri' }]).forEach(a => {
    const b = document.createElement('button');
    b.className = 'm-btn' + (a.primary ? ' primary' : '');
    b.textContent = a.label;
    b.onclick = () => { close(); a.onClick && a.onClick(); };
    foot.appendChild(b);
  });
  function close() { back.classList.remove('in'); setTimeout(() => back.remove(), 200); document.removeEventListener('keydown', esc); }
  function esc(e) { if (e.key === 'Escape') close(); }
  back.querySelector('.m-x').onclick = close;
  back.onclick = e => { if (e.target === back) close(); };
  document.addEventListener('keydown', esc);
  document.body.appendChild(back);
  requestAnimationFrame(() => back.classList.add('in'));
  return close;
}
