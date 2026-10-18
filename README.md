# Credence Housing Limited — Website (Next.js + Payload CMS)

Website **ও** `/admin` (Payload CMS) একই প্রজেক্টে। Lead, project, SEO, tracking সব admin থেকে।

> **প্রজেক্ট এখন একটাই ফোল্ডারে** — এই ফোল্ডারেই `npm install`, `npm run seed`, `npm run dev` চালাও। পুরনো (শুধু HTML/CSS) সংস্করণ `static-site/` ফোল্ডারে আলাদা রাখা আছে, ওটা লাগলে তবেই দেখো।

## ১. প্রথমবার চালানো (নিজের কম্পিউটারে)

**লাগবে:** Node.js 20+ (nodejs.org)

```bash
cp .env.example .env        # Windows CMD: copy .env.example .env
npm install
npm run seed                # ৭টা প্রজেক্ট + site settings ঢোকায়, প্রথম admin বানায়
npm run dev
```

- Website: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>
  - Email: `admin@credence.local`
  - Password: `ChangeMe123!` (`.env`-এর `SEED_ADMIN_*` থেকে; **নিজের পাসওয়ার্ড দিয়ে বদলে নাও**)

ডাটাবেস লোকালে একটা ফাইল (`credence.db`, SQLite) — আলাদা কিছু install লাগে না। **MySQL/phpMyAdmin চাইলে** `.env`-এ `DATABASE_URL=mysql://root:@127.0.0.1:3306/credence` দাও — গাইড: [`MYSQL_SETUP.md`](MYSQL_SETUP.md) (কমিউনিটি অ্যাডাপ্টার, আসল MySQL-এ আমি পরীক্ষা করিনি)।

## ২. Admin দিয়ে কী করা যায়
| মেনু | কাজ |
|---|---|
| **Projects** | নতুন প্রজেক্ট, ছবি (cover/gallery), brochure PDF, facts, story, specification, SEO title/description |
| **Leads** | ফর্মের সব enquiry। স্ট্যাটাস (New → Contacted → Site visit → Negotiation → Booked/Lost), assignee, notes, UTM source, duplicate ফোন চিহ্নিত |
| **Site settings, SEO & tracking** | ফোন/ইমেইল/ঠিকানা, WhatsApp বাটন, home SEO, GTM / GA4 / Meta Pixel / TikTok ID, cookie consent |
| **Media** | ছবি/PDF আপলোড (alt text সহ) |
| **Users** | Admin / Marketing / Sales — কে কী দেখবে |

**Roles:** Admin = সব · Marketing = কনটেন্ট + SEO + tracking · Sales = শুধু Leads।

Save করলেই সাইটে সাথে সাথে বদলে যায় (আলাদা build লাগে না)।

## ২ক. নতুন মডিউল (সব `/admin` থেকে)
| মেনু | কাজ |
|---|---|
| **Blog, News & Events** | লেখা/সংবাদ/ইভেন্ট। Draft রাখা যায়, **Schedule publish** দিয়ে পরে প্রকাশ। পেজ: `/blog` |
| **Management & Team** | টিম সদস্য → `/about` |
| **Careers** | চাকরির বিজ্ঞপ্তি → `/careers` (আবেদন Leads-এ আসে, type = career) |
| **Campaign pages** | বিজ্ঞাপনের জন্য `/lp/<slug>` পেজ, ফোন নম্বর, **A/B test** (headline/button) |
| **Redirects** | পুরনো URL → নতুন URL (301/302) |
| **Leads** | ধরন: project / landowner / buyer / career / campaign। উপরে **Download CSV** বাটন |
| **Dashboard** | Admin-এর হোমে লিডের হিসাব (৭/৩০ দিন, pipeline, সোর্স, প্রজেক্ট) |

**বাংলা ভার্সন:** ইংরেজি `/…`, বাংলা `/bn/…`। Admin-এর উপরে ডানে **Locale** বদলে বাংলা লেখা বসাও (ফাঁকা থাকলে সাইটে ইংরেজিই দেখায়)। UI-র বাংলা লেখা `src/i18n/bn.ts`-এ — প্রকাশের আগে একজন বাংলাভাষীকে দিয়ে দেখিয়ে নাও।

**Draft ও schedule:** Save Draft করলে শুধু স্টাফ দেখে; Publish করলে সাইটে যায়। Publish বাটনের পাশে Schedule দিয়ে সময় ঠিক করা যায় (লোকালে `npm run dev` চললেই চলে; Vercel-এ `CRON_SECRET` লাগে)।

## ২খ. Shared hosting (cPanel + MySQL/phpMyAdmin) এ লাইভ
হোস্টিংয়ে Node.js না থাকলে: লোকালে কাজ করে `npm run export:shared -- --site-url=https://ডোমেইন.com` চালাও, `dist-shared/` আপলোড করো; ফর্মের লিড হোস্টিংয়ের MySQL-এ জমে, phpMyAdmin-এ দেখা যায়। সম্পূর্ণ গাইড: [`SHARED_HOSTING.md`](SHARED_HOSTING.md)।

## ৩. ছবি বদলানো
Admin → **Projects** → প্রজেক্ট → **Look** ট্যাব → **Cover photo** আপলোড → Save। তখন card ও project page-এ আঁকা টাওয়ারের বদলে ছবি আসে। Alt text লিখো। ছবি 1600px-এর নিচে, ~300KB রাখা ভালো।

## ৪. Deploy (সবার জন্য live)
পুরো ধাপ: [`NEXTJS_MIGRATION_PLAN.md`](NEXTJS_MIGRATION_PLAN.md) → "Steps to go live"। সংক্ষেপে:
1. Neon-এ Postgres বানাও → `DATABASE_URL`
2. Vercel-এ repo import → Root Directory = (খালি/রুট), **Build Command = `npm run ci`**
3. Environment variables বসাও (`.env.example` দেখো): `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, uploads-এর জন্য `S3_*` (Cloudflare R2)
4. একবার `npm run migrate:create -- initial` চালিয়ে migration commit করো, তারপর production DB-তে `npm run seed`
5. ডোমেইন যোগ করো

## ৫. ফোল্ডার
| Path | কাজ |
|---|---|
| `src/payload.config.ts` | CMS কনফিগ (DB, storage, collections) |
| `src/collections/` | Projects, Posts, Team, Careers, LandingPages, Leads, Redirects, Media, Users |
| `src/globals/SiteSettings.ts` | সাইট সেটিংস |
| `src/app/(frontend)/[lang]/` | পেজ (home, projects, blog, about, careers, landowner, buyer, lp, catch-all redirect) — `[lang]` = en/bn |
| `src/i18n/` | ইংরেজি ও বাংলা UI টেক্সট (`en.ts`, `bn.ts`) |
| `src/proxy.ts` | `/` → ইংরেজি, `/bn` → বাংলা |
| `src/components/admin/` | Admin ড্যাশবোর্ড ও CSV বাটন |
| `src/components/` | Intro, Nav, Finder, ProjectGrid, ContactForm, Tower… |
| `src/app/(frontend)/globals.css` | ডিজাইন (পুরনো `style.css` একই) |
| `static-site/` | পুরনো স্ট্যাটিক সংস্করণ (HTML/CSS/JS + Decap) — নতুন সাইটের জন্য লাগে না, শুধু `seed` এর ডেটা এখান থেকে আসে |
| `public/` | `motion.js`, `smooth.js`, `tracking.js`, `effects.js`, ছবি |
| `src/export-shared.ts` | সাইটকে স্ট্যাটিক ফাইলে export করে (shared hosting) |
| `shared-host/` | `enquiry.php` (ফর্ম → MySQL), `schema.sql`, `config.sample.php` |
| `src/seed.ts` | `static-site/data/*.json` থেকে কনটেন্ট ঢোকায় |

## ৬. সমস্যা হলে
| সমস্যা | সমাধান |
|---|---|
| `PAYLOAD_SECRET is not set` | `.env`-এ `PAYLOAD_SECRET=` বসাও |
| Admin-এ লগইন হয় না | `npm run seed` আবার চালাও (admin না থাকলে বানায়) |
| `npm run seed` আটকে যায় | `credence.db` মুছে আবার seed করো |
| Port 3000 busy | `PORT=3100 npm run dev` |
