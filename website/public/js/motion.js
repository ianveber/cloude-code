/**
 * Motion — progressive enhancement.
 *
 * Inspired by the feel of a product-launch page (typed headline, letter
 * stagger, orbital field, follow-cursor, bouncing chips). Nothing here is
 * required to read the site: the HTML already contains every word.
 *
 * Skipped entirely when the user prefers reduced motion.
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
      '<span class="hero__line gradient-text">' + escapeHtml(parts.slice(1).join(' ')) + '</span>';
  }

  ready(function () {
    headerState();
    slider();
    contactForms();
    lazyVideo();

    if (reduce) {
      document.documentElement.classList.add('motion-off');
      document.documentElement.classList.remove('is-intro');
      heroEntrance();
      return;
    }

    document.documentElement.classList.add('motion-on');
    introSequence();
    heroEntrance();
    brainTilt();
    particles();
    explorer();
    reveals();
    converge();
    readline();
    ctaField();
    bouncers();
    if (finePointer) {
      cursor();
      magnetic();
    }
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
     Brain mark alone on white, then the wordmark writes itself in beside it,
     then the site loads in behind. Runs once per session; a click, Escape,
     Enter or Space jumps straight to the end. */
  function introSequence() {
    var root = document.documentElement;
    var stage = document.querySelector('[data-intro-stage]');
    if (!stage || !root.classList.contains('is-intro')) return;

    var timers = [];
    var opened = false;

    function at(ms, fn) {
      timers.push(window.setTimeout(fn, ms));
    }

    function open() {
      if (opened) return;
      opened = true;
      timers.forEach(window.clearTimeout);
      window.removeEventListener('keydown', onKey);
      stage.removeEventListener('click', open);

      /* Make sure the finished state is on screen even when skipped early. */
      stage.classList.add('is-logo', 'is-word');

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

    at(120, function () { stage.classList.add('is-logo'); });
    at(900, function () { stage.classList.add('is-word'); });
    at(2350, open);
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

  /* The block leans toward the pointer, within a few degrees. */
  function brainTilt() {
    var brain = document.querySelector('[data-brain]');
    if (!brain || !finePointer) return;
    var rig = brain.querySelector('.brain3d__rig');
    if (!rig) return;

    brain.addEventListener(
      'pointermove',
      function (event) {
        var rect = brain.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width - 0.5;
        var py = (event.clientY - rect.top) / rect.height - 0.5;
        rig.style.setProperty('--tilt', (-py * 10).toFixed(2) + 'deg');
        rig.style.setProperty('--turn', (px * 12).toFixed(2) + 'deg');
      },
      { passive: true }
    );

    brain.addEventListener('pointerleave', function () {
      rig.style.setProperty('--tilt', '0deg');
      rig.style.setProperty('--turn', '0deg');
    });
  }

  /* Orbital field: two slow rings plus free dots, nudged by the pointer. */
  function particles() {
    var canvases = document.querySelectorAll('[data-particles]');
    if (!canvases.length) return;

    var palette = [
      [29, 119, 254],
      [115, 88, 245],
      [14, 165, 160],
    ];

    canvases.forEach(function (canvas) {
      var ctx = canvas.getContext('2d');
      if (!ctx) return;

      var dots = [];
      var running = false;
      var width = 0;
      var height = 0;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var mx = 0.5;
      var my = 0.5;
      var t = 0;
      var burst = 1;

      function resize() {
        var rect = canvas.parentElement.getBoundingClientRect();
        width = Math.max(1, Math.floor(rect.width));
        height = Math.max(1, Math.floor(rect.height));
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seed();
      }

      function seed() {
        dots = [];
        var cx = width * 0.62;
        var cy = height * 0.48;
        var rings = [
          { rx: Math.min(width, height) * 0.22, ry: Math.min(width, height) * 0.16, n: 34, speed: 0.0044 },
          { rx: Math.min(width, height) * 0.38, ry: Math.min(width, height) * 0.28, n: 52, speed: -0.0028 },
        ];

        rings.forEach(function (ring, ri) {
          for (var i = 0; i < ring.n; i++) {
            dots.push({
              kind: 'ring',
              cx: cx,
              cy: cy,
              rx: ring.rx,
              ry: ring.ry,
              a: (i / ring.n) * Math.PI * 2,
              speed: ring.speed,
              r: 1.1 + (ri === 0 ? 0.8 : 0.3),
              c: palette[(i + ri) % palette.length],
              alpha: 0.38 + ri * 0.08,
            });
          }
        });

        var free = Math.round((width * height) / 16000);
        free = Math.max(22, Math.min(free, 70));
        for (var j = 0; j < free; j++) {
          dots.push({
            kind: 'free',
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.24,
            vy: (Math.random() - 0.5) * 0.24,
            r: 0.7 + Math.random() * 1.8,
            c: palette[j % palette.length],
            alpha: 0.22 + Math.random() * 0.28,
          });
        }
      }

      function onMove(event) {
        var rect = canvas.parentElement.getBoundingClientRect();
        mx = (event.clientX - rect.left) / rect.width;
        my = (event.clientY - rect.top) / rect.height;
      }

      function step() {
        if (!running) return;
        t += 1;
        var root = document.documentElement;
        if (root.classList.contains('is-intro-out')) burst += (1.35 - burst) * 0.08;
        else if (!root.classList.contains('is-intro')) burst += (1 - burst) * 0.035;
        ctx.clearRect(0, 0, width, height);

        var pullX = (mx - 0.5) * 48 * burst;
        var pullY = (my - 0.5) * 32 * burst;

        var positions = [];

        for (var i = 0; i < dots.length; i++) {
          var d = dots[i];
          var x;
          var y;
          if (d.kind === 'ring') {
            d.a += d.speed * (0.85 + burst * 0.35);
            x = d.cx + Math.cos(d.a) * d.rx + pullX;
            y = d.cy + Math.sin(d.a) * d.ry + pullY;
          } else {
            d.x += d.vx + (mx - 0.5) * 0.04;
            d.y += d.vy + (my - 0.5) * 0.04;
            if (d.x < -8) d.x = width + 8;
            if (d.x > width + 8) d.x = -8;
            if (d.y < -8) d.y = height + 8;
            if (d.y > height + 8) d.y = -8;
            x = d.x;
            y = d.y;
          }
          positions.push({ x: x, y: y, c: d.c, r: d.r, a: d.alpha });
        }

        for (var a = 0; a < positions.length; a++) {
          var pa = positions[a];
          for (var b = a + 1; b < positions.length; b++) {
            var pb = positions[b];
            var dx = pa.x - pb.x;
            var dy = pa.y - pb.y;
            var dist = dx * dx + dy * dy;
            if (dist < 118 * 118) {
              var fade = 1 - Math.sqrt(dist) / 118;
              ctx.strokeStyle = 'rgba(' + pa.c[0] + ',' + pa.c[1] + ',' + pa.c[2] + ',' + fade * 0.2 * burst + ')';
              ctx.lineWidth = burst > 1.2 ? 1.35 : 1;
              ctx.beginPath();
              ctx.moveTo(pa.x, pa.y);
              ctx.lineTo(pb.x, pb.y);
              ctx.stroke();
            }
          }
        }

        for (var k = 0; k < positions.length; k++) {
          var p = positions[k];
          ctx.beginPath();
          ctx.fillStyle = 'rgba(' + p.c[0] + ',' + p.c[1] + ',' + p.c[2] + ',' + Math.min(1, p.a * burst) + ')';
          ctx.arc(p.x, p.y, p.r * (0.9 + burst * 0.12), 0, Math.PI * 2);
          ctx.fill();
        }

        requestAnimationFrame(step);
      }

      var observer = new IntersectionObserver(
        function (entries) {
          running = entries[0].isIntersecting;
          if (running) requestAnimationFrame(step);
        },
        { threshold: 0.05 }
      );

      resize();
      observer.observe(canvas.parentElement);
      window.addEventListener('resize', resize, { passive: true });
      canvas.parentElement.addEventListener('pointermove', onMove, { passive: true });
    });
  }

  function explorer() {
    var items = document.querySelectorAll('[data-explorer-item]');
    var scenes = document.querySelectorAll('[data-explorer-scene]');
    if (!items.length) return;

    items.forEach(function (item) {
      var para = item.querySelector('[data-type-chars]');
      if (para) splitChars(para);
    });

    function activate(slug) {
      items.forEach(function (el) {
        var on = el.getAttribute('data-explorer-item') === slug;
        el.classList.toggle('is-active', on);
        var para = el.querySelector('[data-type-chars]');
        if (!para) return;
        if (on && !para.classList.contains('is-typed')) typeChars(para, 0.012);
      });
      scenes.forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-explorer-scene') === slug);
      });
    }

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

    var first = items[0];
    if (first) {
      var firstPara = first.querySelector('[data-type-chars]');
      if (firstPara) typeChars(firstPara, 0.012);
    }
  }

  function reveals() {
    var nodes = document.querySelectorAll(
      '[data-reveal], .usecase, .svc, .card, .step, .stat, .capitem, .product, .postcard, .newsitem, .eventitem'
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

  /* ── Converge band ───────────────────────────────────────────────────────
     Drives one custom property from 0 (three panels apart) to 1 (closed into
     one). All the movement itself lives in CSS. */
  function converge() {
    var section = document.querySelector('[data-converge]');
    if (!section) return;

    var ticking = false;

    function sync() {
      ticking = false;
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight || 1;

      /* 0 while the band is entering, 1 once its middle has passed the middle
         of the viewport. */
      var travel = rect.height + vh;
      var seen = vh - rect.top;
      var p = seen / travel;
      p = (p - 0.36) / 0.34;
      p = p < 0 ? 0 : p > 1 ? 1 : p;

      section.style.setProperty('--converge', p.toFixed(3));
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sync);
    }

    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ── Reading line ────────────────────────────────────────────────────────
     Words brighten one after another as the band scrolls, so the sentence
     reads as if it is still being written. Words start dim, never hidden. */
  function readline() {
    var line = document.querySelector('[data-readline]');
    if (!line) return;

    var words = line.querySelectorAll('.readline__w');
    if (!words.length) return;

    var ticking = false;

    function sync() {
      ticking = false;
      var rect = line.getBoundingClientRect();
      var vh = window.innerHeight || 1;

      var p = (vh * 0.82 - rect.top) / (vh * 0.5);
      p = p < 0 ? 0 : p > 1 ? 1 : p;

      var lit = Math.round(p * words.length);
      for (var i = 0; i < words.length; i++) {
        words[i].classList.toggle('is-read', i < lit);
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sync);
    }

    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
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
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
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
        ctx.strokeStyle = 'rgba(140, 170, 235,' + fade * 0.26 + ')';
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (var x = -1500; x <= 1500; x += 150) {
        var near = project(x, 0);
        var far = project(x, 1450);
        ctx.strokeStyle = 'rgba(140, 170, 235, 0.15)';
        ctx.beginPath();
        ctx.moveTo(near.x, near.y);
        ctx.lineTo(far.x, far.y);
        ctx.stroke();
      }

      /* Three slow nodes drifting above the plane. */
      for (var i = 0; i < 3; i++) {
        var ang = t * 0.004 + i * 2.1;
        var p = project(Math.cos(ang) * 520, 420 + Math.sin(ang * 0.7) * 320);
        var r = 2.6 * p.d;
        ctx.fillStyle = ['rgba(61,139,255,0.50)', 'rgba(139,115,255,0.44)', 'rgba(43,212,196,0.40)'][i];
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

  function bouncers() {
    var row = document.querySelector('.bouncers');
    if (!row) return;
    var chips = row.querySelectorAll('.bouncer');
    var start = performance.now();

    function frame(now) {
      var t = (now - start) / 1000;
      chips.forEach(function (chip, i) {
        var y = Math.sin(t * 2.15 + i * 0.7) * 16;
        var r = Math.sin(t * 1.15 + i) * 10;
        chip.style.transform = 'translateY(' + y + 'px) rotate(' + r + 'deg)';
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function cursor() {
    var dot = document.createElement('div');
    dot.className = 'cursor';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);

    var x = window.innerWidth / 2;
    var y = window.innerHeight / 2;
    var tx = x;
    var ty = y;

    window.addEventListener(
      'pointermove',
      function (event) {
        tx = event.clientX;
        ty = event.clientY;
        dot.classList.add('is-on');
      },
      { passive: true }
    );

    document.querySelectorAll('a, button, summary').forEach(function (el) {
      el.addEventListener('pointerenter', function () {
        dot.classList.add('is-hot');
      });
      el.addEventListener('pointerleave', function () {
        dot.classList.remove('is-hot');
      });
    });

    function loop() {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      dot.style.transform = 'translate(' + (x - 8) + 'px,' + (y - 8) + 'px)';
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function magnetic() {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('pointermove', function (event) {
        var r = btn.getBoundingClientRect();
        var dx = event.clientX - (r.left + r.width / 2);
        var dy = event.clientY - (r.top + r.height / 2);
        btn.style.transform = 'translate(' + dx * 0.26 + 'px,' + dy * 0.32 + 'px)';
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.transform = '';
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
