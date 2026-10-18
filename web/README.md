# Credence — Next.js + Payload CMS (`web/`)

Website **ও** `/admin` (Payload CMS) একই প্রজেক্টে। Lead, project, SEO, tracking সব admin থেকে।

## ১. প্রথমবার চালানো (নিজের কম্পিউটারে)

**লাগবে:** Node.js 20+ (nodejs.org)

```bash
cd web
cp .env.example .env        # Windows CMD: copy .env.example .env
npm install
npm run seed                # ৭টা প্রজেক্ট + site settings ঢোকায়, প্রথম admin বানায়
npm run dev
```

- Website: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>
  - Email: `admin@credence.local`
  - Password: `ChangeMe123!` (`.env`-এর `SEED_ADMIN_*` থেকে; **নিজের পাসওয়ার্ড দিয়ে বদলে নাও**)

ডাটাবেস লোকালে একটা ফাইল (`credence.db`) — আলাদা কিছু install লাগে না।

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

## ৩. ছবি বদলানো
Admin → **Projects** → প্রজেক্ট → **Look** ট্যাব → **Cover photo** আপলোড → Save। তখন card ও project page-এ আঁকা টাওয়ারের বদলে ছবি আসে। Alt text লিখো। ছবি 1600px-এর নিচে, ~300KB রাখা ভালো।

## ৪. Deploy (সবার জন্য live)
পুরো ধাপ: [`../NEXTJS_MIGRATION_PLAN.md`](../NEXTJS_MIGRATION_PLAN.md) → "Steps to go live"। সংক্ষেপে:
1. Neon-এ Postgres বানাও → `DATABASE_URL`
2. Vercel-এ repo import → **Root Directory = `web`**, **Build Command = `npm run ci`**
3. Environment variables বসাও (`.env.example` দেখো): `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, uploads-এর জন্য `S3_*` (Cloudflare R2)
4. একবার `npm run migrate:create -- initial` চালিয়ে migration commit করো, তারপর production DB-তে `npm run seed`
5. ডোমেইন যোগ করো

## ৫. ফোল্ডার
| Path | কাজ |
|---|---|
| `src/payload.config.ts` | CMS কনফিগ (DB, storage, collections) |
| `src/collections/` | Projects, Leads, Media, Users |
| `src/globals/SiteSettings.ts` | সাইট সেটিংস |
| `src/app/(frontend)/` | পেজ (home, `projects/[slug]`, sitemap, robots, `api/enquiry`) |
| `src/components/` | Intro, Nav, Finder, ProjectGrid, ContactForm, Tower… |
| `src/app/(frontend)/globals.css` | ডিজাইন (পুরনো `style.css` একই) |
| `public/` | `motion.js`, `smooth.js`, `tracking.js`, `effects.js`, ছবি |
| `src/seed.ts` | `../data/*.json` থেকে কনটেন্ট ঢোকায় |

## ৬. সমস্যা হলে
| সমস্যা | সমাধান |
|---|---|
| `PAYLOAD_SECRET is not set` | `.env`-এ `PAYLOAD_SECRET=` বসাও |
| Admin-এ লগইন হয় না | `npm run seed` আবার চালাও (admin না থাকলে বানায়) |
| `npm run seed` আটকে যায় | `credence.db` মুছে আবার seed করো |
| Port 3000 busy | `PORT=3100 npm run dev` |
