# MySQL / MariaDB (phpMyAdmin) দিয়ে ওয়েবসাইট চালানো

`.env`-এ `DATABASE_URL` বদলালেই ডাটাবেস বদলে যায়। `mysql://…` দিলে MySQL/MariaDB ব্যবহার হয়, সব টেবিল phpMyAdmin-এ দেখা যায়।

> ⚠ **জেনে রাখো:** Payload CMS-এর নিজস্ব (অফিশিয়াল) MySQL অ্যাডাপ্টার নেই। এখানে কমিউনিটি অ্যাডাপ্টার [`payload-db-mysql`](https://github.com/Mrseams/payload-db-mysql) ব্যবহার করা হয়েছে (একজন মেইনটেইনার, নতুন প্রকাশ `0.1.0`; তারা MySQL 8.4 ও MariaDB 11.4-এ নিজেদের টেস্ট চালায়)।
> **আমি এটা আসল MySQL সার্ভারে চালিয়ে দেখতে পারিনি** (আমার পরিবেশে MySQL নেই) — শুধু যাচাই করেছি যে কোড বিল্ড হয় এবং `mysql://` দিলে অ্যাডাপ্টারটি লোড হয়ে সার্ভারে সংযোগের চেষ্টা করে। তোমার কম্পিউটারে প্রথম চালানোয় কোনো এরর এলে লেখাটা পাঠিও।
> গুরুত্বপূর্ণ ব্যবসায়িক সাইটের জন্য অফিশিয়াল সমর্থিত PostgreSQL-ই বেশি নিরাপদ বাছাই।

## ⚠ সংস্করণ (Version) — খুব গুরুত্বপূর্ণ
এই সাইটের জন্য লাগবে **MySQL 8.0.19+** অথবা **MariaDB 10.6+**। **XAMPP-এর সাধারণত MariaDB 10.4** থাকে — সেটায় এই এরর আসে:
`FUNCTION credence_website.json_arrayagg does not exist`
নিজের সংস্করণ দেখতে phpMyAdmin → **SQL** ট্যাব → `SELECT VERSION();` → Go। (`npm run db:check`-ও সংস্করণ দেখিয়ে দেয়।)

পুরনো হলে তিনটি উপায়:
1. **নতুন MariaDB/MySQL ইনস্টল** করে সেটা ব্যবহার (নিচে ধাপ)।
2. **Laragon** ব্যবহার (এতে নতুন MySQL ও phpMyAdmin-সহ সব একসাথে আসে)।
3. আপাতত **SQLite** (`DATABASE_URL=file:./credence.db`) বা **PostgreSQL** — এদের এই সীমাবদ্ধতা নেই।

**নতুন MariaDB বসানো (XAMPP-এর পাশে):**
1. XAMPP Control Panel-এ **MySQL → Stop**।
2. <https://mariadb.org/download/> থেকে **MariaDB 11.4 (বা 10.11) LTS** Windows MSI নামিয়ে ইনস্টল করো। ইনস্টলারে `root` পাসওয়ার্ড দাও, **UTF8 ডিফল্ট** টিক রাখো, পোর্ট **3306**।
3. ইনস্টলের সাথে আসা **HeidiSQL** (বা `MySQL Client` শর্টকাট) দিয়ে ডাটাবেস বানাও:
   `CREATE DATABASE credence_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
4. `.env`-এ পাসওয়ার্ডসহ URL: `DATABASE_URL=mysql://root:তোমার-পাসওয়ার্ড@127.0.0.1:3306/credence_website`
5. phpMyAdmin চাইলে `C:\xampp\phpMyAdmin\config.inc.php`-এ `$cfg['Servers'][$i]['password'] = 'তোমার-পাসওয়ার্ড';` দাও (আর XAMPP-এর MySQL চালিও না, পোর্ট ৩৩০৬ ভাগাভাগি হবে)। অথবা পোর্ট বদলাতে চাইলে ইনস্টলারে `3307` দাও আর URL-এও `:3307`।
6. পুরনো (ভুল) টেবিল থাকলে সেই ডাটাবেস মুছে নতুন করে বানাও, তারপর `npm run db:check` → `npm run seed`।

## ধাপ ১ — MySQL চালু করা (Windows: XAMPP)
1. [XAMPP](https://www.apachefriends.org) ইনস্টল করো → Control Panel-এ **MySQL** (ও **Apache**) **Start**।
2. ব্রাউজারে <http://localhost/phpmyadmin> খোলো।

## ধাপ ২ — ডাটাবেস বানানো
phpMyAdmin → বাঁ পাশে **New** →
- নাম: `credence`
- Collation: **`utf8mb4_unicode_ci`** (জরুরি — বাংলা লেখা ও সার্চের জন্য) → **Create**।

(চাইলে আলাদা ইউজার: **User accounts → Add user account** → ডাটাবেসে সব অনুমতি। XAMPP-এ শুধু শেখার জন্য `root` (পাসওয়ার্ড ছাড়া) চলে — লাইভে কখনো নয়।)

## ধাপ ৩ — `.env` ঠিক করা
```bash
cp .env.example .env        # Windows: copy .env.example .env
```
`.env` খুলে `DATABASE_URL` লাইনটা বদলাও:
```
DATABASE_URL=mysql://root:@127.0.0.1:3306/credence
```
- ইউজার/পাসওয়ার্ড থাকলে: `mysql://ইউজার:পাসওয়ার্ড@127.0.0.1:3306/credence`
- পাসওয়ার্ডে `@ : / # ?` থাকলে URL-encode করো (`@` → `%40`)।
- `PAYLOAD_SECRET`-এ যেকোনো লম্বা এলোমেলো লেখা দাও।

## ধাপ ৪ — চালানো
```bash
npm install
npm run seed      # টেবিল তৈরি + ৭টা প্রজেক্ট + প্রথম admin
npm run dev
```
- সাইট: <http://localhost:3000> · অ্যাডমিন: <http://localhost:3000/admin> (`admin@credence.local` / `ChangeMe123!` — বদলে নাও)
- phpMyAdmin-এ `credence` ডাটাবেসে টেবিল দেখা যাবে: `projects`, `leads`, `posts`, `team`, `careers`, `users`, `media`, `redirects`, …

**যাচাই:** সাইটে একটা ফর্ম জমা দাও → phpMyAdmin → `leads` → **Browse**-এ লিড দেখা গেলে সব ঠিক।

## ধাপ ৫ — প্রোডাকশনে (লাইভ ডাটাবেস)
ডেভেলপমেন্টে (`npm run dev`) টেবিল নিজে তৈরি/বদলায়। লাইভে নিজে নিয়ম মেনে migration দিয়ে:
```bash
# DATABASE_URL লাইভ MySQL-এর দিকে রেখে, একবার:
npm run migrate:create -- initial       # src/migrations/mysql/ এ ফাইল তৈরি
git add -A && git commit -m "MySQL migrations"
# ডিপ্লয়ের সময়: npm run ci  (আগে `payload migrate`, তারপর build)
```
> লাইভ ডাটাবেস যদি cPanel-এর হয়, সাধারণত তা শুধু ওই সার্ভারের ভেতর থেকে (`localhost`) খোলা — তোমার কম্পিউটার থেকে সংযোগ করতে cPanel → **Remote MySQL**-এ তোমার আইপি যোগ করতে হয়। আর সাইট (Node.js) ওই হোস্টেই চালাতে হলে হোস্টে Node.js সমর্থন লাগবে।

## সমস্যা হলে
**আগে এটা চালাও:** `npm run db:check` — কোন ডাটাবেসে সংযোগ হচ্ছে (MySQL নাকি SQLite), টেবিল তৈরি হয়েছে কিনা, না হলে কারণ কী, সব বলে দেয়।

**সাইট বা `/admin` ফাঁকা/আটকে থাকলে:** ঠিকানা `http://localhost:3000` (বা তোমার পোর্ট) দিয়ে খোলো — `192.168.x.x` দিয়ে নয়। (নতুন কোডে নিজের নেটওয়ার্ক ঠিকানাও অনুমোদিত, তবে `git pull` করে `npm run dev` আবার চালাতে হবে।)

| এরর | কারণ/সমাধান |
|---|---|
| `cannot connect to MySQL … ECONNREFUSED` | MySQL চালু নেই (XAMPP-তে Start চাপো) বা পোর্ট/ইউআরএল ভুল |
| `Access denied for user` | ইউজার/পাসওয়ার্ড ভুল, বা ইউজারের ওই ডাটাবেসে অনুমতি নেই |
| `Unknown database 'credence'` | ধাপ ২-এ ডাটাবেস বানানো হয়নি |
| বাংলা লেখা `???` দেখায় | ডাটাবেসের collation `utf8mb4_unicode_ci` নয় — ডাটাবেস মুছে ঠিক collation-এ আবার বানাও |
| `npm run seed` আটকে যায়/এরর | এরর লেখাটা পাঠাও; দ্রুত ফেরত যেতে `DATABASE_URL=file:./credence.db` করলে SQLite-এ চলবে |

## আবার অন্য ডাটাবেসে ফেরা
`.env`-এ শুধু `DATABASE_URL` বদলাও (`file:./credence.db` বা `postgres://…`)। প্রতিটি ডাটাবেসের migration আলাদা ফোল্ডারে (`src/migrations/postgres`, `src/migrations/mysql`)।
