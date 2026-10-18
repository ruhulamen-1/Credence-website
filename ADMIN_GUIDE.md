# Credence Admin (Phase 1) — How to use

Admin lives at **`/admin/`** (Decap CMS). It edits two files — `data/projects.json` and `data/site.json` — and the site rebuilds itself from them.

## What you can manage
**Projects** (add / edit / delete / reorder): name, slug, status, type, area, address, map text, tagline, tower colour/floors, key facts, story, specification table, gallery (with alt text), brochure PDF, share image, SEO title & description.
**Site settings, SEO & tracking:** site URL, home‑page SEO title/description, default share image, offices/phones/hotline/email, WhatsApp button, lead‑form endpoint, cookie consent, and tracking IDs — Google Tag Manager, GA4, Meta Pixel, TikTok Pixel.

Automatic: per‑page title/description/canonical/Open Graph, JSON‑LD schema, `sitemap.xml`, `robots.txt`, UTM + click‑ID capture (stored with each lead), events `generate_lead`, `call_click`, `whatsapp_click`, `brochure_download`.

## A. Try it on your own computer (no hosting needed)
```
cd Credence-website
npx decap-server            # terminal 1 — lets the admin write to your local files
python3 -m http.server 8000 # terminal 2
```
Open `http://localhost:8000/admin/` → Login → **Website content** → edit → Save/Publish.
Then run `node build.js` to regenerate pages (the live setup below does this automatically), and `git add -A && git commit && git push`.

## B. Go live so staff can log in from anywhere
1. **Host on Netlify** (free): *Add new site → Import from GitHub → Credence-website*. `netlify.toml` already sets build command `node build.js`.
2. In GitHub: *Settings → Developer settings → OAuth Apps → New*. Homepage = your Netlify URL; callback = `https://api.netlify.com/auth/done`. Copy Client ID and Secret.
3. In Netlify: *Site configuration → Access & security → OAuth → Install provider → GitHub* → paste ID and Secret.
4. Update `site_url`/`display_url` in `admin/config.yml` and `siteUrl` in `data/site.json` to the real domain.
5. Open `https://YOUR-SITE/admin/` → *Login with GitHub*. Only GitHub users with write access to the repo can publish — add staff as collaborators.

(Cloudflare Pages works too but needs a small OAuth proxy such as `sveltia-cms-auth`.) If you stay on GitHub Pages, the `build-site` GitHub Action regenerates pages after each admin publish, but GitHub login for the admin still needs an OAuth proxy.

## Recommended first steps
1. Fill in real specs, photos, floor plans and brochures for the 6 projects with placeholder details; correct status for Paramount Residences, Platinum, Cynosure.
2. *Site settings → tracking*: paste GTM (or GA4) and Meta Pixel IDs.
3. Create a Formspree (or similar) form and paste its URL into **Lead form endpoint** so enquiries reach email.
4. Add the WhatsApp number to show the floating chat button.
5. Verify the site in Google Search Console and submit `sitemap.xml`.

## Not in Phase 1 (see ADMIN_PLAN.md, Phase 2)
Lead CRM and pipeline, user roles beyond GitHub access, blog/news/career modules, redirect manager, landing‑page builder, A/B tests, email/SMS automation.
