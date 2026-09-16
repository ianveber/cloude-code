/* The page-view beacon, and the cookie choice when the site asks for one.
   data-analytics on <html> says which: "cookieless" sets no cookies and
   sends one beacon per page view with the path, the referrer host and the
   viewport width; "consent" shows the banner, remembers the choice in
   ais_consent (180 days) and, only when analytics is allowed, adds a short
   session id (ais_sid, 30 minutes) to the beacon. */
(function () {
  var CONSENT = 'ais_consent';
  var SID = 'ais_sid';
  var mode = document.documentElement.getAttribute('data-analytics') || 'consent';

  function read(name) {
    var parts = document.cookie.split('; ');
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].indexOf(name + '=') === 0) return decodeURIComponent(parts[i].slice(name.length + 1));
    }
    return '';
  }
  function write(name, value, maxAge) {
    var secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = name + '=' + encodeURIComponent(value) + '; Max-Age=' + maxAge + '; Path=/; SameSite=Lax' + secure;
  }
  function parse(raw) {
    var m = /^1\.([01])$/.exec(raw);
    return m ? { analytics: m[1] === '1' } : null;
  }

  var banner = document.querySelector('[data-consent]');
  var options = banner && banner.querySelector('[data-consent-options]');
  var toggle = banner && banner.querySelector('[data-consent-analytics]');
  var saveBtn = banner && banner.querySelector('[data-consent-save]');
  var settingsBtn = banner && banner.querySelector('[data-consent-settings]');
  var choice = parse(read(CONSENT));

  function show(withOptions) {
    if (!banner) return;
    banner.hidden = false;
    document.documentElement.classList.add('consent-open');
    if (toggle) toggle.checked = choice ? choice.analytics : true;
    setOptions(Boolean(withOptions));
    var first = banner.querySelector('button');
    if (first && withOptions) first.focus();
  }
  function hide() {
    if (!banner) return;
    banner.hidden = true;
    document.documentElement.classList.remove('consent-open');
  }
  function setOptions(open) {
    if (!options) return;
    options.hidden = !open;
    if (saveBtn) saveBtn.hidden = !open;
    if (settingsBtn) settingsBtn.hidden = open;
  }
  function apply(analytics) {
    choice = { analytics: analytics };
    write(CONSENT, '1.' + (analytics ? '1' : '0'), 180 * 86400);
    hide();
    if (analytics) track(true);
    else write(SID, '', 0);
  }

  function sessionId() {
    var sid = read(SID);
    if (!/^[a-z0-9]{8,32}$/i.test(sid)) {
      var bytes = new Uint8Array(8);
      if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(bytes);
      else for (var i = 0; i < 8; i++) bytes[i] = Math.floor(Math.random() * 256);
      sid = '';
      for (var j = 0; j < bytes.length; j++) sid += ('0' + bytes[j].toString(16)).slice(-2);
    }
    write(SID, sid, 1800);
    return sid;
  }

  var sent = false;
  function track(withSession) {
    if (sent) return;
    sent = true;
    var ref = '';
    try {
      if (document.referrer) {
        var host = new URL(document.referrer).host;
        if (host && host !== location.host) ref = host;
      }
    } catch (e) {}
    var hit = { p: location.pathname, r: ref, w: window.innerWidth };
    if (withSession) hit.s = sessionId();
    var body = JSON.stringify(hit);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon('/api/hit', new Blob([body], { type: 'application/json' }))) return;
    } catch (e) {}
    try {
      fetch('/api/hit', { method: 'POST', body: body, headers: { 'content-type': 'application/json' }, keepalive: true, credentials: 'omit' });
    } catch (e) {}
  }

  if (banner) {
    banner.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t) return;
      if (t.hasAttribute('data-consent-accept')) apply(true);
      else if (t.hasAttribute('data-consent-necessary')) apply(false);
      else if (t.hasAttribute('data-consent-settings')) setOptions(true);
      else if (t.hasAttribute('data-consent-save')) apply(Boolean(toggle && toggle.checked));
    });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-consent-open]');
    if (!t) return;
    e.preventDefault();
    show(true);
  });

  if (mode === 'cookieless') {
    /* nothing is stored in the browser; cookies from an earlier version go */
    if (read(CONSENT)) write(CONSENT, '', 0);
    if (read(SID)) write(SID, '', 0);
    track(false);
    return;
  }
  if (!choice) show(false);
  else if (choice.analytics) track(true);
})();
