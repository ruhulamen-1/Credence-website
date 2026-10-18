/* Smooth (inertial) scrolling for mouse wheels / trackpads — pure JS, no libraries.
   Touch devices and prefers-reduced-motion keep native scrolling. Keyboard, scrollbar drag and #anchor links keep working. */
(function () {
  if (matchMedia("(prefers-reduced-motion:reduce)").matches || matchMedia("(pointer:coarse)").matches) return;
  var root = document.documentElement, LAMBDA = 7, cur = scrollY, target = scrollY, raf = 0, last = 0, own = scrollY, dead = false, watch = 0;
  root.classList.add("smooth");                        /* turns off CSS scroll-behavior so our per-frame scrollTo isn't re-animated */

  var max = function () { return Math.max(0, root.scrollHeight - innerHeight); };
  var clamp = function (v) { return Math.min(max(), Math.max(0, v)); };

  function frame(t) {
    var dt = Math.min(64, t - (last || t)); last = t;
    cur += (target - cur) * (1 - Math.exp(-LAMBDA * dt / 1000));
    if (Math.abs(target - cur) < 0.4) cur = target;
    own = Math.round(cur * 100) / 100;
    scrollTo(0, own);
    raf = cur === target ? 0 : requestAnimationFrame(frame);
    if (!raf) last = 0;
  }
  function go() { if (!raf) raf = requestAnimationFrame(frame); }

  /* Is there an inner scroll area under the pointer that can still scroll in this direction? (inputs/selects don't count) */
  function nativeScrollable(el, dy) {
    for (; el && el !== document.body && el !== root; el = el.parentElement) {
      if (el.hasAttribute && el.hasAttribute("data-native-scroll")) return true;
      var cs = getComputedStyle(el);
      if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1) {
        if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
      }
    }
    return false;
  }

  addEventListener("wheel", function (e) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey) return;                 /* pinch-zoom / browser zoom */
    if (document.body.classList.contains("locked")) return;                   /* intro screen */
    if (nativeScrollable(e.target, e.deltaY)) return;                          /* e.g. a long textarea scrolls itself */
    var dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
    if (!dy || e.shiftKey) return;
    if (dead) return;
    e.preventDefault();
    var before = scrollY;
    target = clamp(target + dy);
    go();
    clearTimeout(watch);
    watch = setTimeout(function () {                    /* safety net: if nothing moved, fall back to native scroll */
      if (target !== before && Math.abs(scrollY - before) < 1 && Math.abs(target - scrollY) > 4) { dead = true; root.classList.remove("smooth"); stop(); scrollTo(0, target); }
    }, 400);
  }, { passive: false });

  /* Anything else that moves the page (keyboard, scrollbar drag, native anchor jump) is adopted when we're idle.
     While we animate, scroll events are our own — ignoring them is what keeps fractional-DPI screens (125 %, 150 %) working. */
  function adopt() { cur = target = scrollY; own = scrollY; }
  addEventListener("scroll", function () { if (!raf && Math.abs(scrollY - own) > 2) adopt(); }, { passive: true });
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; last = 0; } adopt(); }
  addEventListener("keydown", function (e) { if (!e.ctrlKey && !e.metaKey && !e.altKey) stop(); }, true);
  addEventListener("pointerdown", stop, true);          /* grabbing the scrollbar / clicking cancels the glide */
  addEventListener("resize", function () { target = clamp(target); });

  /* Smooth #anchor links on this page */
  window.smoothScrollTo = function (y) { target = clamp(y); go(); };
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var u; try { u = new URL(a.href, location.href); } catch (_) { return; }
    if (!u.hash || u.hash === "#" || u.pathname !== location.pathname || u.origin !== location.origin) return;
    var el = document.getElementById(decodeURIComponent(u.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    cur = scrollY; own = scrollY;
    window.smoothScrollTo(el.getBoundingClientRect().top + scrollY);
    history.pushState(null, "", u.hash);
  });
})();
