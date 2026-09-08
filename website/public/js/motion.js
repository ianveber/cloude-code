/**
 * Motion — progressive enhancement.
 *
 * Meaningful motion only: the typed intro, hero entrance, the glossy brain,
 * the build stage, reveals, the clients line, picture tilt, and a quiet CTA
 * field. The HTML already contains every word; this file is skipped when the
 * user prefers reduced motion.
 */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }

  /* Each character needs its own box to be animated, but adjacent inline-blocks
     are break opportunities, so a bare run of them lets the browser split a word
     down the middle. Grouping the characters into words leaves the spaces as the
     only places a line can break. */
  function splitChars(el) {
    if (!el || el.dataset.split === '1') return el ? el.querySelectorAll('.char') : [];
    var text = el.textContent;
    el.dataset.original = text;

    var html = '';
    var word = '';

    function flush() {
      if (!word) return;
      html += '<span class="word">' + word + '</span>';
      word = '';
    }

    Array.from(text).forEach(function (ch) {
      if (ch === ' ') {
        flush();
        html += '<span class="char char--space"> </span>';
      } else if (ch === '\n') {
        flush();
        html += '<br>';
      } else {
        word += '<span class="char">' + escapeHtml(ch) + '</span>';
      }
    });
    flush();

    el.innerHTML = html;
    el.dataset.split = '1';
    return el.querySelectorAll('.char');
  }

  function typeChars(el, each, then) {
    var chars = splitChars(el);
    if (!chars.length) {
      if (then) then();
      return;
    }
    chars.forEach(function (ch, i) {
      ch.style.transitionDelay = (i * (each || 0.018)) + 's';
    });
    requestAnimationFrame(function () {
      el.classList.add('is-typed');
    });
    var total = chars.length * (each || 0.018) * 1000 + 180;
    if (then) window.setTimeout(then, total);
  }

  /* Split the headline on its first full stop so the two halves stack, with the
     second half carrying the gradient. Each half is a block so it can be
     animated on its own. */
  function paintHeadline(el, text) {
    var dot = text.indexOf('.');
    var parts = dot === -1 || dot === text.length - 1
      ? [text]
      : [text.slice(0, dot + 1), text.slice(dot + 1).trim()];

    if (parts.length < 2) {
      el.innerHTML = '<span class="hero__line">' + escapeHtml(text) + '</span>';
      return;
    }

    el.innerHTML =
      '<span class="hero__line">' + escapeHtml(parts[0]) + '</span>' +
      '<span class="hero__line text-blue">' + escapeHtml(parts.slice(1).join(' ')) + '</span>';
  }

  ready(function () {
    headerState();
    slider();
    contactForms();
    explorer();
    buildStage();

    if (reduce) {
      document.documentElement.classList.add('motion-off');
      document.documentElement.classList.remove('is-intro');
      heroEntrance();
      return;
    }

    document.documentElement.classList.add('motion-on');
    introSequence();
    heroEntrance();
    brainShine();
    clientsLine();
    reveals();
    tiltFrames();
    footerGlow();
    ctaField();
    lazyVideo();
  });

  function headerState() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var sync = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    sync();
    window.addEventListener('scroll', sync, { passive: true });
  }

  function revealHeroRest(hero) {
    hero.querySelectorAll('[data-enter]').forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  /* ── Opening sequence ────────────────────────────────────────────────────
     White screen, the brain mark, and the brand name typed out next to it
     one character at a time with a blinking caret. Once the last character
     is in, the caret keeps blinking for a beat and the site loads in behind.
     Runs once per session; a click, Escape, Enter or Space jumps straight to
     the end. */
  function introSequence() {
    var root = document.documentElement;
    var stage = document.querySelector('[data-intro-stage]');
    if (!stage || !root.classList.contains('is-intro')) return;

    var brand = stage.querySelector('[data-intro-brand]');
    var tail = stage.querySelector('[data-intro-tail]');
    var timers = [];
    var opened = false;
    var typing = null;

    function at(ms, fn) {
      timers.push(window.setTimeout(fn, ms));
    }

    /* Types into `el` from data-text, one character per `step` ms. */
    function typeInto(el, step, done) {
      var text = el ? el.getAttribute('data-text') || '' : '';
      var i = 0;
      function tick() {
        if (opened) return;
        i += 1;
        el.textContent = text.slice(0, i);
        if (i < text.length) typing = window.setTimeout(tick, step);
        else done();
      }
      if (!text) {
        done();
        return;
      }
      tick();
    }

    function finishText() {
      if (brand) brand.textContent = brand.getAttribute('data-text') || '';
      if (tail) tail.textContent = tail.getAttribute('data-text') || '';
      stage.classList.remove('is-typing');
      stage.classList.add('is-typed');
    }

    function open() {
      if (opened) return;
      opened = true;
      timers.forEach(window.clearTimeout);
      window.clearTimeout(typing);
      window.removeEventListener('keydown', onKey);
      stage.removeEventListener('click', open);

      /* Make sure the finished state is on screen even when skipped early. */
      stage.classList.add('is-logo');
      finishText();

      root.classList.add('is-intro-out');
      window.setTimeout(function () {
        root.classList.remove('is-intro');
        try {
          sessionStorage.setItem('ais-intro', '1');
        } catch (e) {}
      }, 60);
      window.setTimeout(function () {
        root.classList.remove('is-intro-out');
        stage.remove();
      }, 1000);
    }

    function onKey(event) {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    }

    window.addEventListener('keydown', onKey);
    stage.addEventListener('click', open);

    /* The mark appears first. Typing waits for the webfont so the letters do
       not change shape halfway through, but never longer than a short beat. */
    at(100, function () { stage.classList.add('is-logo'); });

    var fontsReady = document.fonts && document.fonts.ready
      ? document.fonts.ready
      : Promise.resolve();
    var started = false;
    function startTyping() {
      if (started || opened) return;
      started = true;
      stage.classList.add('is-typing');
      typeInto(brand, 78, function () {
        window.setTimeout(function () {
          typeInto(tail, 58, finishText);
        }, 140);
      });
    }
    at(380, function () { fontsReady.then(startTyping); });
    at(520, startTyping);

    /* Site loads in once the caret has blinked a couple of times after the
       last character: roughly 520 + 3×78 + 140 + 8×58 ≈ 1.4 s of typing. */
    at(2300, open);
  }

  function heroEntrance() {
    var hero = document.querySelector('[data-intro]') || document.querySelector('.hero');
    if (!hero) return;
    hero.classList.add('is-live');

    var headline = hero.querySelector('[data-type-in]');
    if (!headline) {
      revealHeroRest(hero);
      return;
    }

    /* On the home page the headline is already final — the opening sequence
       carries the motion, so the headline only needs its entrance. */
    if (hero.classList.contains('hero--brain')) {
      paintHeadline(headline, headline.textContent.trim());
      headline.classList.add('is-typed');
      requestAnimationFrame(function () {
        headline.classList.add('is-entered');
      });
      revealHeroRest(hero);
      return;
    }

    if (reduce) {
      revealHeroRest(hero);
      return;
    }

    typeChars(headline, 0.016, function () {
      revealHeroRest(hero);
    });
  }

  /* ── Brain shine ─────────────────────────────────────────────────────────
     The official mark leans toward the pointer anywhere over the hero, and
     its highlight slides across the surface as it does. Movement is slow on
     purpose: the transition in CSS does the easing, this only sets targets. */
  function brainShine() {
    var brain = document.querySelector('[data-brain]');
    if (!brain || !finePointer) return;
    var rig = brain.querySelector('.brand-brain__rig');
    var hero = brain.closest('.hero') || brain;
    if (!rig) return;

    var ticking = false;
    var last = null;

    function apply() {
      ticking = false;
      if (!last) return;
      var rect = brain.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      /* Normalised offset from the mark's centre, capped a little beyond it. */
      var px = clamp((last.x - cx) / Math.max(rect.width, 1), -0.9, 0.9);
      var py = clamp((last.y - cy) / Math.max(rect.height, 1), -0.9, 0.9);

      rig.style.setProperty('--pointer-y', (-py * 8).toFixed(2) + 'deg');
      rig.style.setProperty('--pointer-x', (px * 8).toFixed(2) + 'deg');
      rig.style.setProperty('--gx', (50 + px * 42).toFixed(1) + '%');
      rig.style.setProperty('--gy', (42 + py * 42).toFixed(1) + '%');
      rig.style.setProperty('--sx', (26 - px * 22).toFixed(1) + 'px');
      rig.style.setProperty('--sy', (42 - py * 14).toFixed(1) + 'px');
    }

    hero.addEventListener(
      'pointermove',
      function (event) {
        last = { x: event.clientX, y: event.clientY };
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(apply);
      },
      { passive: true }
    );

    hero.addEventListener('pointerleave', function () {
      last = null;
      rig.style.setProperty('--pointer-y', '0deg');
      rig.style.setProperty('--pointer-x', '0deg');
      rig.style.setProperty('--gx', '50%');
      rig.style.setProperty('--gy', '42%');
      rig.style.setProperty('--sx', '26px');
      rig.style.setProperty('--sy', '42px');
    });
  }

  function explorer() {
    var items = document.querySelectorAll('[data-explorer-item]');
    var scenes = document.querySelectorAll('[data-explorer-scene]');
    if (!items.length) return;

    function activate(slug) {
      items.forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-explorer-item') === slug);
      });
      scenes.forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-explorer-scene') === slug);
      });
    }

    items.forEach(function (item) {
      var link = item.querySelector('a');
      if (!link) return;
      link.addEventListener('focus', function () {
        activate(item.getAttribute('data-explorer-item'));
      });
    });

    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) activate(entry.target.getAttribute('data-explorer-item'));
        });
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: 0.1 }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  function reveals() {
    var nodes = document.querySelectorAll(
      '[data-reveal], .usecase, .svc, .card, .step, .stat, .product, .postcard, .newsitem, .eventitem, .teamtile, .client'
    );
    if (!nodes.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    nodes.forEach(function (el, i) {
      el.style.setProperty('--reveal-delay', (i % 6) * 0.06 + 's');
      el.classList.add('will-reveal');
      observer.observe(el);
    });
  }

  /* ── Build stage ─────────────────────────────────────────────────────────
     Three screens, one in front. The active index moves on its own every few
     seconds, on a click or focus on a screen or tab, and the whole stage
     leans a few degrees toward the pointer. Runs with reduced motion too —
     without the auto-rotation and the lean — because the tabs are real
     controls and must keep working. */
  function buildStage() {
    var section = document.querySelector('[data-build]');
    if (!section) return;

    var rig = section.querySelector('[data-build-rig]');
    var stage = section.querySelector('[data-build-stage]');
    var screens = Array.prototype.slice.call(section.querySelectorAll('[data-build-screen]'));
    var tabs = Array.prototype.slice.call(section.querySelectorAll('[data-build-tab]'));
    if (!rig || screens.length < 3) return;

    var position = ['is-left', 'is-active', 'is-right'];
    var active = 1;
    var timer = null;
    var paused = false;
    var visible = false;
    var HOLD = 6000;

    function setActive(index, source) {
      active = (index + screens.length) % screens.length;
      screens.forEach(function (screen, i) {
        var rel = (i - active + screens.length) % screens.length;
        /* rel: 0 = active, 1 = next (right), 2 = previous (left) */
        var cls = rel === 0 ? position[1] : rel === 1 ? position[2] : position[0];
        position.forEach(function (p) { screen.classList.remove(p); });
        screen.classList.add(cls);
        screen.setAttribute('aria-hidden', rel === 0 ? 'false' : 'true');
      });
      tabs.forEach(function (tab, i) {
        var on = i === active;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-pressed', on ? 'true' : 'false');
        /* Restart the progress rule on the active tab. */
        if (on && !reduce) {
          tab.classList.remove('is-counting');
          void tab.offsetWidth;
          tab.classList.add('is-counting');
        }
      });
      section.style.setProperty('--active', String(active));
      schedule();
    }

    function schedule() {
      window.clearTimeout(timer);
      if (reduce || paused || !visible) return;
      timer = window.setTimeout(function () {
        setActive(active + 1, 'auto');
      }, HOLD);
    }

    screens.forEach(function (screen, i) {
      screen.addEventListener('click', function () {
        if (i !== active) setActive(i, 'click');
      });
    });

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { setActive(i, 'click'); });
      tab.addEventListener('focus', function () { paused = true; schedule(); });
      tab.addEventListener('blur', function () { paused = false; schedule(); });
    });

    section.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') { event.preventDefault(); setActive(active + 1, 'key'); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setActive(active - 1, 'key'); }
    });

    if (stage) {
      stage.addEventListener('pointerenter', function () { paused = true; schedule(); });
      stage.addEventListener('pointerleave', function () {
        paused = false;
        rig.style.setProperty('--px', '0deg');
        rig.style.setProperty('--py', '0deg');
        schedule();
      });

      if (!reduce && finePointer) {
        var ticking = false;
        var last = null;
        stage.addEventListener(
          'pointermove',
          function (event) {
            last = event;
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
              ticking = false;
              if (!last) return;
              var rect = stage.getBoundingClientRect();
              var px = (last.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
              var py = (last.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
              rig.style.setProperty('--px', (px * 7).toFixed(2) + 'deg');
              rig.style.setProperty('--py', (-py * 4).toFixed(2) + 'deg');
            });
          },
          { passive: true }
        );
      }
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          visible = entries[0].isIntersecting;
          if (visible) {
            section.classList.add('is-on');
            /* Start counting when the band first comes into view. */
            tabs.forEach(function (tab) {
              if (tab.classList.contains('is-active') && !reduce) {
                tab.classList.remove('is-counting');
                void tab.offsetWidth;
                tab.classList.add('is-counting');
              }
            });
          }
          schedule();
        },
        { threshold: 0.25 }
      );
      observer.observe(section);
    } else {
      visible = true;
      schedule();
    }

    setActive(1, 'init');
  }

  /* ── Clients line ────────────────────────────────────────────────────────
     The row drifts to the left on its own. The items are cloned once so the
     loop has no visible seam; clones are hidden from assistive tech. Under
     the pointer the drift slows to a crawl so a card can be read. */
  function clientsLine() {
    var line = document.querySelector('[data-clients-line]');
    var track = document.querySelector('[data-clients-track]');
    if (!line || !track) return;

    var items = Array.prototype.slice.call(track.children);
    if (!items.length) return;

    items.forEach(function (item) {
      var copy = item.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.classList.add('is-clone');
      track.appendChild(copy);
    });

    var x = 0;
    var speed = 0.42;
    var target = speed;
    var half = 0;
    var running = false;
    var lastTime = 0;

    function measure() {
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      half = 0;
      items.forEach(function (item) {
        half += item.getBoundingClientRect().width + gap;
      });
    }

    function step(now) {
      if (!running) return;
      var dt = lastTime ? Math.min(now - lastTime, 48) : 16;
      lastTime = now;
      speed += (target - speed) * 0.05;
      x -= speed * (dt / 16.7);
      if (half > 0 && -x >= half) x += half;
      track.style.transform = 'translate3d(' + x.toFixed(2) + 'px, 0, 0)';
      requestAnimationFrame(step);
    }

    line.addEventListener('pointerenter', function () { target = 0.08; });
    line.addEventListener('pointerleave', function () { target = 0.42; });
    track.addEventListener('focusin', function () { target = 0; });
    track.addEventListener('focusout', function () { target = 0.42; });

    measure();
    window.addEventListener('resize', measure, { passive: true });

    if (!('IntersectionObserver' in window)) {
      running = true;
      requestAnimationFrame(step);
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        var on = entries[0].isIntersecting;
        if (on && !running) {
          running = true;
          lastTime = 0;
          requestAnimationFrame(step);
        } else if (!on) {
          running = false;
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(line);
  }

  /* ── Picture tilt ────────────────────────────────────────────────────────
     Each product picture leans a few degrees toward the pointer and its glare
     slides across. Targets only; CSS eases them. */
  function tiltFrames() {
    var frames = document.querySelectorAll('[data-tilt]');
    if (!frames.length || !finePointer) return;

    frames.forEach(function (frame) {
      var ticking = false;
      var last = null;

      frame.addEventListener(
        'pointermove',
        function (event) {
          last = event;
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(function () {
            ticking = false;
            if (!last) return;
            var rect = frame.getBoundingClientRect();
            var px = (last.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
            var py = (last.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
            frame.style.setProperty('--ry', (px * 6).toFixed(2) + 'deg');
            frame.style.setProperty('--rx', (-py * 5).toFixed(2) + 'deg');
            frame.style.setProperty('--glare', (px * 90).toFixed(1) + '%');
          });
        },
        { passive: true }
      );

      frame.addEventListener('pointerleave', function () {
        last = null;
        frame.style.setProperty('--ry', '0deg');
        frame.style.setProperty('--rx', '0deg');
        frame.style.setProperty('--glare', '-80%');
      });
    });
  }

  /* ── Footer wordmark ─────────────────────────────────────────────────────
     A spot of AIS blue follows the pointer across the large wordmark. */
  function footerGlow() {
    var mark = document.querySelector('[data-footer-mark]');
    if (!mark || !finePointer) return;
    var footer = mark.closest('.site-footer') || mark;

    footer.addEventListener(
      'pointermove',
      function (event) {
        var rect = mark.getBoundingClientRect();
        var px = clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
        mark.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      },
      { passive: true }
    );
  }

  /* ── CTA field ───────────────────────────────────────────────────────────
     A slow wireframe grid tilted in perspective, drifting behind the panel.
     Deliberately low contrast: it is background, not decoration to look at. */
  function ctaField() {
    var canvas = document.querySelector('[data-cta-field]');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var parent = canvas.parentElement;
    var w = 0;
    var h = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var running = false;
    var t = 0;

    function resize() {
      var rect = parent.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* Project a point on a ground plane into screen space. */
    function project(x, z) {
      var d = 1 / (z * 0.0016 + 0.42);
      return {
        x: w / 2 + x * d * 0.5,
        y: h * 0.62 + (170 - z * 0.09) * d * 0.5,
        d: d,
      };
    }

    function step() {
      if (!running) return;
      t += 1;
      ctx.clearRect(0, 0, w, h);

      var drift = (t * 0.55) % 90;

      ctx.lineWidth = 1;
      for (var z = 0; z < 1500; z += 90) {
        var zz = z - drift;
        var a = project(-1500, zz);
        var b = project(1500, zz);
        var fade = Math.max(0, 1 - zz / 1500);
        ctx.strokeStyle = 'rgba(29, 119, 254,' + fade * 0.22 + ')';
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (var x = -1500; x <= 1500; x += 150) {
        var near = project(x, 0);
        var far = project(x, 1450);
        ctx.strokeStyle = 'rgba(161, 161, 170, 0.16)';
        ctx.beginPath();
        ctx.moveTo(near.x, near.y);
        ctx.lineTo(far.x, far.y);
        ctx.stroke();
      }

      for (var i = 0; i < 3; i++) {
        var ang = t * 0.004 + i * 2.1;
        var p = project(Math.cos(ang) * 520, 420 + Math.sin(ang * 0.7) * 320);
        var r = 2.6 * p.d;
        ctx.fillStyle = i === 1 ? 'rgba(250, 250, 250, 0.28)' : 'rgba(29, 119, 254, 0.42)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, r), 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(step);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(
      function (entries) {
        running = entries[0].isIntersecting;
        if (running) requestAnimationFrame(step);
      },
      { threshold: 0.05 }
    );
    observer.observe(parent);
  }

  /* Clips are decorative: nothing downloads until the band is on screen, and
     playback stops again once it leaves. */
  function lazyVideo() {
    var videos = document.querySelectorAll('[data-lazy-video]');
    if (!videos.length) return;

    if (reduce || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var video = entry.target;
          if (entry.isIntersecting) {
            if (!video.dataset.started) {
              video.dataset.started = '1';
              video.load();
            }
            var played = video.play();
            if (played && played.catch) played.catch(function () {});
          } else if (!video.paused) {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    videos.forEach(function (video) {
      observer.observe(video);
    });
  }

  /* Background submit for any form that has an endpoint configured. Without
     one the form keeps its mailto action and this does nothing. */
  function contactForms() {
    document.querySelectorAll('[data-contact-form][data-endpoint]').forEach(function (form) {
      var status = form.querySelector('[data-form-status]');
      var button = form.querySelector('button[type="submit"]');
      var label = button ? button.textContent : '';

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (button) {
          button.disabled = true;
          button.textContent = 'Pošiljam…';
        }

        fetch(form.dataset.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        })
          .then(function (res) {
            if (!res.ok) throw new Error(res.status);
            form.reset();
            if (status) status.textContent = 'Poslano. Odgovorimo v enem delovnem dnevu.';
          })
          .catch(function () {
            if (status) status.textContent = 'Pošiljanje ni uspelo. Pišite nam neposredno na e-pošto.';
          })
          .finally(function () {
            if (button) {
              button.disabled = false;
              button.textContent = label;
            }
          });
      });
    });
  }

  function slider() {
    var track = document.querySelector('[data-slider]');
    if (!track) return;

    var nav = document.querySelector('.usecases__nav');
    if (nav) nav.hidden = false;

    var step = function () {
      var card = track.querySelector('.usecase');
      return card ? card.getBoundingClientRect().width + 16 : 320;
    };

    document.querySelectorAll('[data-slide]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = Number(btn.getAttribute('data-slide')) || 1;
        track.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }
})();
