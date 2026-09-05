/**
 * Progressive enhancement for the cinematic homepage.
 *
 * Nothing here is required to read the page. The HTML already contains every
 * word, link and diagram. This file only adds:
 *   - a soft particle field behind the hero
 *   - which feature is "active" in the explorer as you scroll
 *   - slider buttons on the use-case row
 *   - a scrolled state on the header
 *
 * Honours prefers-reduced-motion: particles and auto-activation are skipped.
 */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(function () {
    headerState();
    if (!reduce) particles();
    explorer();
    slider();
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

  /* Soft drifting dots. 2D canvas, no WebGL, paused when the hero is offscreen. */
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
        var count = Math.round((width * height) / 11000);
        count = Math.max(36, Math.min(count, 110));
        dots = [];
        for (var i = 0; i < count; i++) {
          var tint = palette[i % palette.length];
          dots.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: 0.8 + Math.random() * 2.1,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            c: tint,
            a: 0.28 + Math.random() * 0.38,
          });
        }
      }

      function step() {
        if (!running) return;
        ctx.clearRect(0, 0, width, height);

        for (var i = 0; i < dots.length; i++) {
          var a = dots[i];
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < -8) a.x = width + 8;
          if (a.x > width + 8) a.x = -8;
          if (a.y < -8) a.y = height + 8;
          if (a.y > height + 8) a.y = -8;

          ctx.beginPath();
          ctx.fillStyle = 'rgba(' + a.c[0] + ',' + a.c[1] + ',' + a.c[2] + ',' + a.a + ')';
          ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
          ctx.fill();

          for (var j = i + 1; j < dots.length; j++) {
            var b = dots[j];
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            var dist = dx * dx + dy * dy;
            if (dist < 130 * 130) {
              var fade = 1 - Math.sqrt(dist) / 130;
              ctx.strokeStyle = 'rgba(' + a.c[0] + ',' + a.c[1] + ',' + a.c[2] + ',' + fade * 0.18 + ')';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
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
    });
  }

  /* Activate the explorer item closest to the vertical centre of the stage. */
  function explorer() {
    var items = document.querySelectorAll('[data-explorer-item]');
    var scenes = document.querySelectorAll('[data-explorer-scene]');
    if (!items.length || !scenes.length) return;

    function activate(slug) {
      items.forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-explorer-item') === slug);
      });
      scenes.forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-explorer-scene') === slug);
      });
    }

    if (reduce) return;

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
