# Next.js + Payload CMS — Migration Plan & Status

Goal: move Credence from the static site (HTML/JSON + Decap) to **Next.js + Payload CMS** so marketing/sales can run everything from `/admin` — content, SEO, tracking, **leads CRM**, roles — with the same design and motion.

The new app lives in **`web/`**. The static site in the repo root stays untouched and live until cut-over, so nothing breaks while the new site is checked.

## Stack
| Part | Choice |
|---|---|
| Site | Next.js 16 (App Router, React 19, TypeScript) — pages pre-rendered (static) and refreshed instantly when content is saved |
| Admin / CMS | Payload CMS 3, embedded in the same app at `/admin` |
| Database | SQLite file for local work → **PostgreSQL** (Neon / Supabase) in production — switch by `DATABASE_URL` only |
| Uploads | `./media` locally → **Cloudflare R2 / S3** in production (set `S3_*` env) |
| Hosting | Vercel (or any Node host / VPS) |
| E-mail alerts | Resend (optional, set `RESEND_API_KEY`) |

## What was migrated (✔ = built and tested)
| Area | Status |
|---|---|
| Design, colours, fonts, `THEME.md` rules (same CSS) | ✔ |
| Cloud intro → tower rises → hero | ✔ |
| Property finder (type / status / location / project) filtering the cards | ✔ (React) |
| Project cards: illustrated tower or cover photo | ✔ |
| Project pages `/projects/[slug]`: hero, facts, story, spec table, gallery, brochure, map, enquiry form | ✔ (all 7 projects imported) |
| Scroll motion (word reveals, card fan, parallax, stacked sheets, mask reveals, wordmark) + smooth scroll | ✔ (same scripts, loaded after hydration) |
| SEO: per-page title/description/canonical/Open Graph, JSON-LD, `sitemap.xml`, `robots.txt` | ✔ |
| Tracking: GTM / GA4 / Meta Pixel / TikTok, cookie consent, UTM + click-ID capture, WhatsApp button, events | ✔ (IDs set in admin → Site settings) |
| **Leads**: form → database (with UTM source, project, page), duplicate-phone detection, status pipeline, assignee, notes | ✔ |
| **Roles**: Admin (all) · Marketing (content/SEO/tracking, leads read) · Sales (leads only) | ✔ tested |
| Admin edit → live site refreshes immediately | ✔ tested |
| Spam protection: honeypot + per-IP rate limit | ✔ (add Cloudflare Turnstile for stronger) |
| Optional new-lead e-mail alert (Resend) | ✔ code ready, needs API key |

## Phase 2 — also built and tested (✔)
| Area | What you get |
|---|---|
| **Blog, News & Events** | Collection *Blog, News & Events* (rich-text body, cover, excerpt, author, event date/place, related project, SEO). Pages `/blog` (tabs All / Articles / News / Events) and `/blog/[slug]` with Article/Event schema |
| **About & Team** | *Management & Team* collection → `/about` (grouped Management / Our team) |
| **Careers** | *Careers* collection → `/careers`, `/careers/[slug]` with JobPosting schema and an application form (saved as a lead of type *career*) |
| **Landowner / Buyer pages** | `/landowner`, `/buyer` with extra fields (land size & address; budget, area, size) saved as leads |
| **Redirect manager** | *Redirects* collection (old URL → new URL, 301/302). Applied by a catch-all route, so old `credencehousingltd.com` paths can be kept alive |
| **Bangla version** | English at `/…`, Bangla at `/bn/…`. All UI text translated (please have a native speaker review `src/i18n/bn.ts`); CMS content is translated per field with the **Locale** switch in /admin — anything not translated falls back to English. `hreflang` + sitemap alternates, Bangla fonts |
| **Lead dashboard** | /admin home shows volume (7/30 days), pipeline by status, by type, top projects, top sources (UTM / Google Ads / Facebook / referral / direct), repeat enquiries |
| **CSV export** | *Download all leads (CSV)* button on the Leads list; `/api/leads/export?status=&kind=&from=&to=` (admin / sales / marketing only; formula-injection safe) |
| **Campaign pages + A/B test** | *Campaign pages* collection → `/lp/[slug]` (own headline, bullets, phone, image, noindex by default). Optional 50/50 A/B on headline & button — variant is stored on each lead and sent as an analytics event |
| **Drafts & scheduled publish** | Projects, Blog/News, Careers and Campaign pages have Draft → Published, version history, and **schedule publish**. Visitors only ever see published content |

## Still open (smaller / optional)
1. Lead WhatsApp/SMS alert (e-mail alert via Resend is ready).
2. Cloudflare Turnstile on forms (honeypot + rate limit exist).
3. Bangla review of marketing copy; Bangla translations of the existing project texts (they currently fall back to English).
4. Real content: photos, floor plans, brochures, team, jobs, posts (nothing was invented — empty states show instead).
5. Per-lead activity log / follow-up reminders.

## Steps to go live
1. **Database** — create a Postgres DB (Neon free tier). Copy its connection string.
2. **Env vars** (Vercel → Project → Settings → Environment Variables):
   `DATABASE_URL`, `PAYLOAD_SECRET` (`openssl rand -hex 32`), `CRON_SECRET` (for scheduled publishing — `vercel.json` already calls `/api/payload-jobs/run` every minute; needs a Vercel plan that allows per-minute crons), `NEXT_PUBLIC_SITE_URL`, and for uploads `S3_BUCKET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` (Cloudflare R2). Optional: `RESEND_API_KEY`, `LEADS_FROM`, `LEADS_TO`.
3. **Create the production schema once** (from `web/`, with `DATABASE_URL` pointing at Postgres):
   ```
   npm run migrate:create -- initial     # writes web/src/migrations/*
   git add -A && git commit -m "Add DB migrations" && git push
   ```
   From then on every deploy runs `payload migrate` before building.
4. **Vercel project**: import the GitHub repo → Root Directory **`web`** → Build Command **`npm run ci`** → Deploy.
5. **Seed content & first admin** (one time, from your computer, against the production DB):
   ```
   DATABASE_URL=postgres://… SEED_ADMIN_EMAIL=you@company.com SEED_ADMIN_PASSWORD='a-strong-password' npm run seed
   ```
6. Open `https://YOUR-SITE/admin`, log in, **change the password**, create Marketing/Sales users, fill *Site settings* (site URL, GTM/GA4/Pixel IDs, WhatsApp, phones), upload real photos/brochures per project.
7. **Domain**: add `credencehousingltd.com` in Vercel, update DNS. Set *Site settings → Public site URL*.
8. **Search Console**: add the domain, submit `/sitemap.xml`. Keep old URLs alive with redirects (phase 2 item) before switching DNS.
9. **Cut-over**: when the new site is approved, point the domain to it and retire the static site (Netlify/GitHub Pages).

## Risks & notes
- Needs someone comfortable with Node/React for changes and upgrades.
- Vercel's free plan is for non-commercial use — budget ≈ $20/month (Pro) + DB (free → $25).
- Uploads must go to R2/S3 in production (Vercel's disk is read-only).
- Back up the Postgres database (Neon has point-in-time restore on paid plans).
