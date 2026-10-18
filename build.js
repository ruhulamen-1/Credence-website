#!/usr/bin/env node
// Static site generator: data/projects.json + data/site.json -> project-<slug>.html, data/projects.js, sitemap.xml, robots.txt
// Usage: node build.js
const fs = require("fs");
const read = f => JSON.parse(fs.readFileSync(f, "utf8"));
const site = read("data/site.json"), projects = read("data/projects.json");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function page(p) {
  const tagline = p.tagline || `A Credence ${p.type.toLowerCase()} residence in ${p.area}, Dhaka.`;
  const title = p.seoTitle || `${p.name} — ${p.area}, Dhaka | Credence Housing`;
  const desc = p.seoDesc || `${p.name} by Credence Housing Limited — ${p.status.toLowerCase()} ${p.type.toLowerCase()} project in ${p.area}, Dhaka. ${p.addr}.`;
  const url = `${site.siteUrl}/project-${p.slug}.html`;
  const ld = {
    "@context": "https://schema.org", "@type": "ApartmentComplex", name: p.name, description: desc, url,
    address: { "@type": "PostalAddress", streetAddress: p.addr, addressLocality: "Dhaka", addressCountry: "BD" },
    brand: { "@type": "Organization", name: site.name }
  };
  const facts = (p.facts || []).length ? `<div class="facts">${p.facts.map(f => `<div><b>${esc(f.v)}</b><span>${esc(f.l)}</span></div>`).join("")}</div>` : "";
  const story = (p.story || []).length ? `
  <section class="story">
    <div class="reveal"><p class="eyebrow">Behind the story</p><h2 style="font-size:clamp(32px,4.5vw,52px)">${esc(p.storyTitle || p.name)}</h2></div>
    <div class="reveal">${p.story.map(t => `<p>${esc(t)}</p>`).join("")}</div>
  </section>` : `
  <section class="story">
    <div class="reveal"><p class="eyebrow">About</p><h2 style="font-size:clamp(32px,4.5vw,52px)">${esc(p.name)}</h2></div>
    <div class="reveal"><p>Full project details, floor plans and specifications for ${esc(p.name)} are being prepared. Talk to our counsellors for the latest availability and pricing.</p></div>
  </section>`;
  const spec = (p.spec || []).length ? `
  <section class="spec-sec">
    <div class="sec-head reveal"><p class="eyebrow">Specification</p><h2>Project at a glance</h2></div>
    <table class="spec reveal">${p.spec.map(r => `<tr><th scope="row">${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}</table>
  </section>` : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body class="open">
<header class="nav" id="nav">
  <button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="menu"><span></span>Menu</button>
  <a class="logo" href="index.html" aria-label="Credence Housing Limited">CREDENCE<small>Housing Limited</small></a>
  <a class="nav-cta" href="#interest">I’m interested</a>
</header>
<nav class="menu" id="menu" aria-label="Main">
  <a href="index.html#projects">Projects</a><a href="index.html#footprints">About</a><a href="index.html#why">Why Credence</a><a href="#interest">Contact</a>
  <p>Hotline <strong>${esc(site.hotline)}</strong></p>
</nav>
<main>
  <section class="hero phero">
    <div class="hero-copy">
      <p class="crumbs"><a href="index.html">Home</a> / <a href="index.html#projects">Projects</a> / ${esc(p.name)}</p>
      <h1 class="ph">${esc(p.name)}</h1>
      <p>${esc(tagline)}</p>
      <span class="badge">${esc(p.addr)}</span>
    </div>
    <div class="tower-wrap"><svg id="tower" viewBox="0 0 300 640" aria-hidden="true"></svg></div>
    <div class="mist"></div>
    ${facts}
  </section>
${story}
${spec}
  <section>
    <div class="sec-head reveal"><p class="eyebrow">Location</p><h2>${esc(p.area)}, Dhaka</h2></div>
    <iframe class="map reveal" title="Map of ${esc(p.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      src="https://maps.google.com/maps?q=${encodeURIComponent(p.mapQuery || p.addr)}&z=16&output=embed"></iframe>
    <a class="back" href="index.html#projects">← All projects</a>
  </section>
  <section class="contact" id="interest">
    <div class="contact-info reveal">
      <p class="eyebrow">I am interested</p>
      <h2>Own a home at ${esc(p.name)}</h2>
      <dl>
        <dt>Corporate Office</dt><dd>${esc(site.address)}</dd>
        <dt>General enquiry</dt><dd>${site.phone.map(n => `<a href="tel:${n}">${n}</a>`).join(" · ")}</dd>
        <dt>Hotline</dt><dd><a href="tel:${site.hotline}">${site.hotline}</a></dd>
        <dt>Email</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd>
      </dl>
    </div>
    <form class="form reveal" id="contactForm" novalidate>
      <label>Name<input name="name" required autocomplete="name"><em></em></label>
      <label>Contact number<input name="phone" type="tel" required autocomplete="tel" inputmode="tel"><em></em></label>
      <label>Email (optional)<input name="email" type="email" autocomplete="email"><em></em></label>
      <label>Message<textarea name="msg" rows="4"></textarea><em></em></label>
      <button class="btn dark" type="submit">Send enquiry</button>
      <p class="ok" id="ok" role="status" hidden>Thank you — our team will contact you shortly.</p>
    </form>
  </section>
</main>
<footer><div><strong>CREDENCE</strong> Housing Limited</div><div>© ${new Date().getFullYear()} Credence Housing Ltd. · Hotline ${esc(site.hotline)}</div></footer>
<script src="tower.js"></script>
<script src="common.js"></script>
<script>tower(document.querySelector("#tower"),${p.hue ?? 208},${p.floors || 18})</script>
</body>
</html>
`;
}

projects.forEach(p => fs.writeFileSync(`project-${p.slug}.html`, page(p)));
fs.writeFileSync("data/projects.js", "window.PROJECTS=" + JSON.stringify(projects.map(({ slug, name, area, addr, type, status, hue }) => ({ slug, name, area, addr, type, status, hue }))) + ";\n");
const urls = ["", ...projects.map(p => `project-${p.slug}.html`)];
fs.writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${site.siteUrl}/${u}</loc></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync("robots.txt", `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${site.siteUrl}/sitemap.xml\n`);
console.log(`Built ${projects.length} project pages, sitemap.xml, robots.txt, data/projects.js`);
