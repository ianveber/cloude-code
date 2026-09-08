/**
 * Motion — progressive enhancement.
 *
 * Meaningful motion only: intro, hero entrance, brain tilt, explorer,
 * reveals, converge, reading line, and a quiet CTA field. The HTML already
 * contains every word; this file is skipped when the user prefers reduced
 * motion.
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
      '<span class="hero__line text-blue">' + escapeHtml(parts.slice(1).join(' ')) + '</span>';
  }

  ready(function () {
    headerState();
    slider();
    contactForms();
    explorer();

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
    reveals();
    converge();
    readline();
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
     Brain mark alone on white, then a crossfade to the official lockup, then
     the site loads in behind. Runs once per session; a click, Escape, Enter or
     Space jumps straight to the end. */
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

    at(100, function () { stage.classList.add('is-logo'); });
    at(720, function () { stage.classList.add('is-word'); });
    at(1900, open);
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

  /* The official mark leans toward the pointer, within a few degrees. */
  function brainTilt() {
    var brain = document.querySelector('[data-brain]');
    if (!brain || !finePointer) return;
    var rig = brain.querySelector('.brand-brain__rig');
    if (!rig) return;

    brain.addEventListener(
      'pointermove',
      function (event) {
        var rect = brain.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width - 0.5;
        var py = (event.clientY - rect.top) / rect.height - 0.5;
        rig.style.setProperty('--pointer-y', (-py * 3).toFixed(2) + 'deg');
        rig.style.setProperty('--pointer-x', (px * 3).toFixed(2) + 'deg');
      },
      { passive: true }
    );

    brain.addEventListener('pointerleave', function () {
      rig.style.setProperty('--pointer-y', '0deg');
      rig.style.setProperty('--pointer-x', '0deg');
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

      var raw = (vh * 0.58 - rect.top) / (vh * 0.72);
      var progress = Math.max(0, Math.min(1, raw));
      section.style.setProperty('--converge', progress.toFixed(4));
      section.style.setProperty('--settled', Math.max(0, (progress - 0.72) / 0.28).toFixed(4));
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
