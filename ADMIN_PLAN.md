# Credence Website — Admin / CMS & Digital Marketing Plan

Goal: one back-office at `/admin` (or `/system`) from which the Credence team can change **everything** on the site — content, SEO, tracking, campaigns, leads — without touching code.

## 1. Where we are now
- Static site (HTML/CSS/JS), hosted free on GitHub Pages.
- All project content lives in `data/projects.json` + `data/site.json`. `node build.js` generates every project page, `data/projects.js`, `sitemap.xml`, `robots.txt` (with canonical, Open Graph and JSON‑LD schema per page).
- This data‑driven structure is the bridge: the admin only has to edit these data files/records.

## 2. Recommended path (two phases)

### Phase 1 — Git‑based admin (fast, ~1–2 weeks, near‑zero cost) — **BUILT, see ADMIN_GUIDE.md**
- **Decap CMS** (open source) served at `/admin`. Staff log in, edit forms, press *Publish*; the CMS commits JSON/Markdown to GitHub, and the host rebuilds (`node build.js`) and redeploys in ~1 minute.
- Host: **Cloudflare Pages** or **Netlify** (free tier; supports build command + GitHub login + form handling) instead of plain GitHub Pages.
- Forms → **Netlify Forms / Formspree** → email + Google Sheet; later replaced by the CRM in Phase 2.
- Pros: no server/database to maintain, version history for free, SEO‑friendly static pages. Cons: no real‑time lead CRM, limited roles.

### Phase 2 — Full system (when leads/marketing volume grows, ~6–8 weeks)
- **Next.js (or Astro) frontend** + **Postgres (Supabase)** + admin dashboard (Strapi / Payload CMS / custom).
- Pages remain server‑rendered/static for SEO; admin changes publish via on‑demand revalidation (instant).
- Adds: lead CRM, roles & permissions, audit log, scheduled publishing, A/B tests, API for mobile app.

## 3. Admin modules (what the team can control)

### 3.1 Content
| Module | Fields |
|---|---|
| **Projects** | name, slug, status (ongoing/completed/upcoming), type, area, address, map coordinates, tagline, facts strip, story, spec table, gallery, floor plans (PDF/image), brochure PDF, video/virtual tour URL, amenities, handover date, featured flag, sort order |
| **Home page** | hero headline/sub‑text, intro‑cloud text, stats (50+, 700+…), featured projects, "Why Credence" cards |
| **Pages** | About, Management, Team, Landowner query, Buyer query, Career, Privacy |
| **Blog / News & Events** | title, slug, body, cover, category, tags, author, publish date (schedule), related projects |
| **Team** | name, role, photo, order |
| **Careers** | job posts, open/closed, application form → CRM |
| **Menu / footer / contact info** | offices, phones, hotline, email, social links |
| **Media library** | upload, auto‑compress to WebP/AVIF, required alt‑text field, folders |

### 3.2 SEO (per page + sitewide)
- Meta title & description with live character counter and Google snippet preview; Open Graph/Twitter image per page.
- Slug editor, canonical URL, `noindex` toggle.
- Auto **JSON‑LD schema**: Organization, RealEstateAgent, ApartmentComplex/Residence, BreadcrumbList, FAQPage, Article.
- Auto **sitemap.xml** and **robots.txt** (editable), hreflang (English/বাংলা) when Bangla added.
- **301 redirect manager** (old URL → new URL, bulk CSV import), 404 log with "create redirect" button.
- Image alt‑text audit, missing‑meta / duplicate‑title report, heading‑structure check, internal‑link suggestions.
- Google Search Console + Bing verification tags; Search Console / GA4 numbers pulled into dashboard (top queries, pages, clicks, position).
- Local SEO: Google Business Profile details, NAP consistency, per‑area landing pages ("Apartments in Gulshan", "Flats in Dhanmondi", "Banani") generated from templates.
- Core Web Vitals targets: LCP < 2.5s, CLS < 0.1 (image sizing, lazy loading, font preload).

### 3.3 Digital marketing
- **Tracking manager** (no developer needed): GTM container ID, GA4, Meta Pixel **+ Conversions API (server‑side)**, TikTok Pixel, Google Ads conversion + remarketing, LinkedIn Insight, Hotjar/Clarity. Each toggle on/off, with cookie‑consent banner (Bangladesh + GDPR‑style).
- **Events** auto‑fired: form submit (lead), call click, WhatsApp click, brochure download, project view, search used.
- **UTM & click‑ID capture** (utm_*, gclid, fbclid) stored with every lead → true source attribution.
- **Campaign landing pages**: duplicate a template (hero + facts + form), unique URL, own tracking and phone number, `noindex` option.
- **Lead forms**: builder with fields, validation, thank‑you page/redirect, spam protection (honeypot + reCAPTCHA/Turnstile), instant notification email + WhatsApp/SMS to sales.
- **Floating CTAs**: WhatsApp, call, "Book a free session"; popups/banners with schedule, device and page targeting.
- **Email/SMS/WhatsApp**: newsletter signup list, send via Mailchimp/Brevo/SSL Wireless; auto follow‑up sequence after lead.
- **Social**: auto share new blog/news to Facebook page; Open Graph previews; YouTube/Facebook video embeds on project pages.
- **Ads feeds**: optional product feed for Meta dynamic ads from project data.
- **A/B testing** for hero text/CTA (Phase 2).

### 3.4 Leads / mini‑CRM
- Every form submission saved: name, phone, email, message, project, page, UTM source/medium/campaign, device, time.
- Pipeline: New → Contacted → Site visit → Negotiation → Booked / Lost; assign to salesperson; notes; follow‑up reminders.
- Duplicate detection by phone; export CSV/Excel; filters by project, source, date.
- Dashboard: leads per day, per project, per channel, cost‑per‑lead (manual ad‑spend entry or API).

### 3.5 System
- **Users & roles:** Super Admin, Marketing (content + SEO + tracking), Sales (leads only), Editor (blog/news), Viewer. 2‑factor login, strong passwords, login rate‑limit.
- **Audit log** (who changed what, when) and one‑click **rollback** to previous version.
- Draft → Review → Publish workflow, scheduled publishing, preview URL.
- Automatic daily **backups**; staging site for testing.
- Settings: site name, logo, favicon, colours (from `THEME.md` tokens), fonts, default OG image, maintenance mode.

## 4. Data model (core tables / collections)
`projects`, `project_media`, `pages`, `posts`, `team_members`, `jobs`, `menus`, `settings` (contact, tracking IDs, social), `seo_meta` (per URL), `redirects`, `leads`, `lead_events`, `forms`, `campaign_pages`, `popups`, `media`, `users`, `roles`, `audit_log`.
Current JSON files map 1:1 to `projects` and `settings`.

## 5. Security checklist
HTTPS only; admin on separate path with login + 2FA + IP allow‑list option; CSRF and input sanitisation; file‑upload type/size limits; reCAPTCHA/Turnstile on public forms; secrets in environment variables (never in repo); rate limiting; dependency updates; backups tested monthly; privacy policy + consent for lead data.

## 6. Roadmap
| Step | Deliverable | Time |
|---|---|---|
| 0 | Done: data‑driven project pages, SEO tags, sitemap | ✔ |
| 1 | Move to Cloudflare Pages/Netlify, domain + SSL, Decap CMS at `/admin` for projects, home, blog, team | 1–2 wks |
| 2 | Real project content (specs, galleries, floor plans, brochures), Bangla version, blog/news/career pages | 2–3 wks |
| 3 | GTM + GA4 + Meta Pixel/CAPI, cookie banner, UTM capture, forms → email/Sheet, WhatsApp/call buttons | 1 wk |
| 4 | SEO pass: titles/descriptions, schema, redirects from old credencehousingltd.com URLs, Search Console, speed budget | 1–2 wks |
| 5 | Phase 2 build: Next.js + Supabase/Strapi, lead CRM, roles, dashboard | 6–8 wks |
| 6 | Landing‑page builder, A/B tests, email/SMS automation, ad‑cost reporting | 3–4 wks |

## 7. Costs (approx., monthly)
Domain ~$1; Cloudflare Pages/Netlify free; Supabase free→$25; email (Brevo) free→$25; SMS per message; reCAPTCHA/Turnstile free; backups/monitoring free–$10. Phase 1 is effectively free.

## 8. Decisions needed from Credence
1. Final domain (existing `credencehousingltd.com` or new) and who owns DNS.
2. Who are the admin users and their roles?
3. Real data: specs, photos, floor plans, brochures for the 6 projects still using placeholder details; correct status (ongoing/completed) for Paramount Residences, Platinum, Cynosure.
4. Ad accounts: Google Ads, Meta Business, GA4, Search Console access.
5. Where should leads go — email, WhatsApp, Google Sheet, or full CRM?
6. Bangla language needed at launch?

## 9. Using what exists today
Edit `data/projects.json` → run `node build.js` → commit/push. Adding a project = add one JSON entry; the page, card, filter, sitemap are generated automatically.
