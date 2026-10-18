/* Scroll motion — word-by-word headings, scroll-linked card fan, parallax, mask reveals, wordmark, progress bar.
   Pure JS, no libraries. Skipped entirely for prefers-reduced-motion. Styles live under `html.m` in style.css. */
(function () {
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  var root = document.documentElement;
  root.classList.add("m");
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* 1. Split headings into words that slide up from a mask */
  function split(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"), s = document.createElement("i");
            w.className = "w"; s.textContent = part; s.style.setProperty("--i", Math.min(i++, 22));
            w.appendChild(s); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    })(el);
    el.classList.add("split");
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
  }
  var splitEls = $$(".hero h2,.hero .ph,.lead .big,.sec-head h2,.contact h2,.story h2");
  splitEls.forEach(split);

  /* 2. Reveal-on-view (words, image masks, wordmark) */
  var seen = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); seen.unobserve(e.target); } });
  }, { threshold: 0.2 });
  splitEls.filter(function (e) { return !e.closest(".hero"); }).forEach(function (e) { seen.observe(e); });
  /* project pages have no intro: play the hero headline right after first paint */
  splitEls.filter(function (e) { return e.closest(".phero"); }).forEach(function (e) {
    requestAnimationFrame(function () { requestAnimationFrame(function () { e.classList.add("in"); }); });
  });
  function maskImages() { $$(".gallery img,.card>img,.photo-wrap").forEach(function (e) { e.classList.add("mask"); seen.observe(e); }); }
  maskImages();

  /* 3. Scroll-linked pieces */
  var cards = [], hero = document.querySelector(".hero"), bar = document.createElement("div"), mark = document.querySelector(".wordmark");
  bar.className = "progress"; document.body.appendChild(bar);
  var heroFx = $$(".tower-wrap,.photo-wrap"), cascade = $$(".why article"), vh = innerHeight;

  function collect() {
    vh = innerHeight;
    cards = $$(".card").filter(function (c) { return !c.hidden; });
    cards.forEach(function (c) {
      c.classList.remove("reveal"); c.classList.add("fan");
      if (c._k === undefined) { c._k = 0; c._ty = 0; c._s = 1; }
      var g = c.parentElement.getBoundingClientRect(), r = c.getBoundingClientRect();
      var off = (r.left + r.width / 2 - (g.left + g.width / 2)) / Math.max(1, g.width);
      c.style.setProperty("--tilt", (off * 16).toFixed(2) + "deg");
    });
  }
  collect();
  addEventListener("resize", collect);
  new MutationObserver(function () { collect(); tick(); }).observe(document.getElementById("grid") || document.body, { attributes: true, subtree: true, attributeFilter: ["hidden"], childList: true });

  var raf = 0;
  function tick() { if (!raf) raf = requestAnimationFrame(frame); }
  function frame() {
    raf = 0;
    var y = scrollY, moving = false;
    bar.style.transform = "scaleX(" + clamp(y / Math.max(1, document.documentElement.scrollHeight - vh), 0, 1) + ")";

    if (hero) {                                  /* hero parallax: tower drifts slower than page, copy lifts */
      var hh = hero.offsetHeight, k = clamp(y / hh, 0, 1);
      heroFx.forEach(function (e) { e.style.translate = "0 " + (y * 0.16).toFixed(1) + "px"; e.style.scale = (1 + k * 0.08).toFixed(3); });
      var hc = hero.querySelector(".hero-copy"); if (hc) hc.style.translate = "0 " + (-y * 0.08).toFixed(1) + "px";
    }

    cards.forEach(function (c) {                 /* cards fan in: rise, un-tilt and scale up as they enter */
      var h = c.offsetHeight, top = c.getBoundingClientRect().top - c._ty - h * (1 - c._s) / 2;
      var target = clamp((vh * 0.98 - top) / (vh * 0.55), 0, 1);
      c._k += (target - c._k) * 0.14;
      if (Math.abs(target - c._k) > 0.002) moving = true; else c._k = target;
      c._ty = (1 - c._k) * 70; c._s = 0.88 + 0.12 * c._k;
      c.style.setProperty("--p", c._k.toFixed(4));
    });

    cascade.forEach(function (a, i) {            /* "why" cards drift at different speeds → diagonal cascade */
      var g = a.parentElement.getBoundingClientRect(), d = g.top + g.height / 2 - vh / 2;
      a.style.translate = "0 " + (d * (0.02 + i * 0.045)).toFixed(1) + "px";
    });

    if (mark) {                                  /* footer wordmark sharpens as it enters */
      var r = mark.getBoundingClientRect(), p = clamp((vh - r.top) / (vh * 0.25), 0, 1);
      mark.style.setProperty("--wp", p.toFixed(3));
    }
    if (moving) tick();
  }
  addEventListener("scroll", tick, { passive: true });
  addEventListener("resize", tick);
  tick();
})();
