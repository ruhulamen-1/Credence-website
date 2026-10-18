/* Smooth (inertial) scrolling for mouse wheels / trackpads — pure JS, no libraries.
   Touch devices and prefers-reduced-motion keep native scrolling. Keyboard, scrollbar drag and #anchor links keep working. */
(function () {
  if (matchMedia("(prefers-reduced-motion:reduce)").matches || matchMedia("(pointer:coarse)").matches) return;
  var root = document.documentElement, LAMBDA = 7, cur = scrollY, target = scrollY, raf = 0, last = 0, own = scrollY;
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

  addEventListener("wheel", function (e) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey) return;                 /* pinch-zoom / browser zoom */
    if (document.body.classList.contains("locked")) return;                   /* intro screen */
    var t = e.target;
    if (t.closest && t.closest("textarea,select,input,[data-native-scroll]")) return;
    var dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
    if (!dy || e.shiftKey) return;
    e.preventDefault();
    target = clamp(target + dy);
    go();
  }, { passive: false });

  /* Anything else that moves the page (keyboard, scrollbar, native anchor jump): adopt the new position. */
  addEventListener("scroll", function () {
    if (Math.abs(scrollY - own) > 2) { cur = target = scrollY; own = scrollY; }
  }, { passive: true });
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
