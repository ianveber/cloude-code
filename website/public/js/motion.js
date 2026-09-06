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

  function splitChars(el) {
    if (!el || el.dataset.split === '1') return el ? el.querySelectorAll('.char') : [];
    var text = el.textContent;
    el.dataset.original = text;
    el.innerHTML = Array.from(text)
      .map(function (ch) {
        if (ch === ' ') return ' ';
        if (ch === '\n') return '<br>';
        return '<span class="char">' + escapeHtml(ch) + '</span>';
      })
      .join('');
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
      ch.style.transitionDelay = (i * (each || 0.028)) + 's';
    });
    requestAnimationFrame(function () {
      el.classList.add('is-typed');
    });
    var total = chars.length * (each || 0.028) * 1000 + 180;
    if (then) window.setTimeout(then, total);
  }

  ready(function () {
    headerState();
    slider();
    if (reduce) {
      document.documentElement.classList.add('motion-off');
      return;
    }
    document.documentElement.classList.add('motion-on');
    heroEntrance();
    particles();
    explorer();
    reveals();
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

  function heroEntrance() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    hero.classList.add('is-live');

    var headline = hero.querySelector('[data-type-in]');
    var after = function () {
      hero.querySelectorAll('[data-enter]').forEach(function (el) {
        el.classList.add('is-in');
      });
    };

    if (headline) typeChars(headline, 0.026, after);
    else after();
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
          { rx: Math.min(width, height) * 0.22, ry: Math.min(width, height) * 0.16, n: 28, speed: 0.0032 },
          { rx: Math.min(width, height) * 0.38, ry: Math.min(width, height) * 0.28, n: 42, speed: -0.002 },
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
        ctx.clearRect(0, 0, width, height);

        var pullX = (mx - 0.5) * 36;
        var pullY = (my - 0.5) * 24;

        var positions = [];

        for (var i = 0; i < dots.length; i++) {
          var d = dots[i];
          var x;
          var y;
          if (d.kind === 'ring') {
            d.a += d.speed;
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
            if (dist < 100 * 100) {
              var fade = 1 - Math.sqrt(dist) / 100;
              ctx.strokeStyle = 'rgba(' + pa.c[0] + ',' + pa.c[1] + ',' + pa.c[2] + ',' + fade * 0.16 + ')';
              ctx.lineWidth = 1;
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
          ctx.fillStyle = 'rgba(' + p.c[0] + ',' + p.c[1] + ',' + p.c[2] + ',' + p.a + ')';
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
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
    var nodes = document.querySelectorAll('[data-reveal], .statement__more, .usecase, .svc, .card, .step, .stat');
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

    var statement = document.querySelector('.statement [data-type-in]');
    if (statement) {
      var seen = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            typeChars(statement, 0.02);
            seen.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      seen.observe(statement);
    }
  }

  function bouncers() {
    var row = document.querySelector('.bouncers');
    if (!row) return;
    var chips = row.querySelectorAll('.bouncer');
    var start = performance.now();

    function frame(now) {
      var t = (now - start) / 1000;
      chips.forEach(function (chip, i) {
        var y = Math.sin(t * 1.6 + i * 0.7) * 10;
        var r = Math.sin(t * 0.9 + i) * 6;
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
        btn.style.transform = 'translate(' + dx * 0.18 + 'px,' + dy * 0.22 + 'px)';
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
