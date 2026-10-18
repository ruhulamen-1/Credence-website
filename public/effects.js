/* Page basics: scroll-reveal (.reveal → .in) and count-up numbers ([data-n]). Menu/nav/form are React components. */
(function () {
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in"); io.unobserve(e.target);
      e.target.querySelectorAll("[data-n]").forEach(function (b) {
        var t = +b.dataset.n, t0 = performance.now();
        if (reduce) { b.textContent = t; return; }
        (function f(now) { var k = Math.min(1, (now - t0) / 1400); b.textContent = Math.round(t * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0);
      });
    });
  }, { threshold: 0.15 });
  function scan() { document.querySelectorAll(".reveal:not(.in)").forEach(function (e) { io.observe(e); }); }
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();
