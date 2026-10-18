# Credence Housing Limited — Website

Dhaka-r real estate company Credence Housing Limited-er website. Theme: **"Above the Clouds"** (megh → tower → "Live Above The Ordinary" → property finder).

Pure HTML/CSS/JS, kono framework ba database lage na. Content `data/` folder-er JSON file theke ashe, `/admin` theke edit kora jay.

---

## 1. Folder-e ki ache

| File / Folder | Kaj |
|---|---|
| `index.html` | Home page (cloud intro, hero, finder, projects, stats, contact) |
| `project-*.html` | Prottek project-er page — **nijer hate edit korbe na**, `build.js` banay |
| `style.css` | Sob design |
| `script.js` | Home page-er interaction (intro, filter, project card) |
| `common.js` | Sob page-er common kaj (menu, animation, contact form) |
| `tower.js` | Tower-er SVG drawing |
| `tracking.js` | GA4 / GTM / Meta Pixel / TikTok, cookie consent, WhatsApp button |
| `data/projects.json` | Sob project-er tothyo |
| `data/site.json` | Company info, SEO, tracking ID |
| `build.js` | Data theke page, sitemap, robots.txt baniye dey |
| `admin/` | Admin panel (`/admin/`) |
| `images/` | Upload kora chobi ekhane jay |
| `THEME.md` | Design guide (rong, font, style) |
| `ADMIN_PLAN.md` / `ADMIN_GUIDE.md` | Admin-er plan ar ba byabohar guide |

---

## 2. Computer-e chalano (local)

**Lagbe:** [Node.js](https://nodejs.org) ar [Git](https://git-scm.com).

```bash
git clone https://github.com/ruhulamen-1/Credence-website
cd Credence-website
npx serve -l 8000
```

Browser-e kholo: <http://localhost:8000>

Admin-o chalate chaile **arekta terminal** khule, ekoi folder-e:

```bash
npx decap-server
```

Tarpor <http://localhost:8000/admin/> → **Login** → **Website content**.

> Python thakle `python -m http.server 8000` diyeo site chalano jay. Baddho korte `Ctrl + C`.

---

## 3. Content bodlano (admin diye)

1. `/admin/` e jao → **Website content**.
2. **Projects** → project select → field bodlao → **Publish**.
3. Terminal-e:
   ```bash
   node build.js
   git add -A
   git commit -m "Update content"
   git push
   ```

Notun project: **Projects → Add project**. Slug lowercase ar dash diye likho (jemon `green-view`). Slug launch-er pore bodlio na, URL bhenge jabe.

**Site settings, SEO & tracking** e ache: home page SEO title/description, phone/email/address, WhatsApp number, form endpoint, GTM/GA4/Meta Pixel/TikTok ID.

---

## 4. Image (chobi) bodlano

Ekhon project-er jaygay amader banano **illustrated tower** dekhay. Real photo dile seta replace hoy.

### Project-er cover photo (card + project page)
1. Admin → Projects → project khulo.
2. **Cover photo** e chobi upload koro (ar **alt text** likho, jemon "Arkology front view").
3. Publish → `node build.js` → commit → push.

Cover photo dile home-page card-e ar project page-er hero-te tower-er bodole oi photo dekhabe.

### Gallery ar brochure
- **Gallery:** project-e jototuku chobi, protita-r alt text shoho.
- **Brochure (PDF):** upload korle project page-e "Download brochure" button ashe.
- **Social share image:** Facebook/WhatsApp-e link share korle ja dekhay.

### Chobir niyom
- Format: `.jpg` ba `.webp`. Width **1600px**-er beshi na, size **300 KB**-er niche (site druto thakbe).
- File-er nam English-e, space chhara (`arkology-front.jpg`).
- Chobi `images/` folder-e jay. Admin na use korleo ei folder-e chobi rekhe `data/projects.json`-e `"image": "images/arkology-front.jpg"` likhe dite paro.

### Home page-er hero (tower) ba logo bodlano
Eta admin-e nei, code-e korte hobe:
- **Home-er tower:** `index.html`-e `<svg id="tower">` ache. Eta-r jaygay `<img src="images/hero.jpg" alt="...">` boshate paro.
- **Logo:** `index.html`-er `<a class="logo">` er bhitor text ache. Logo image dite `<img src="images/logo.svg" alt="Credence">` boshao.

---

## 4a. Contact form theke lead pawa

Ekhon form-e submit korle kothao data jay na (shudhu "Thank you" dekhay). Lead email-e peyte:
1. [formspree.io](https://formspree.io)-te free account, ekta form banao.
2. Form-er URL (`https://formspree.io/f/xxxx`) copy koro.
3. Admin → **Site settings** → **Lead form endpoint** e paste → Publish.

Lead-er sathe UTM source, campaign, page ar referrer o jay.

---

## 5. Online-e deploy (sobar jonno live)

Duita upay. **Upay A sohoj**, **Upay B-te admin-o live cholbe.**

### Upay A: GitHub Pages (free, sohoj — shudhu website live, admin local-e)
1. GitHub-e repo → **Settings** → **Pages**.
2. **Source:** Deploy from a branch → Branch **main**, folder **/ (root)** → **Save**.
3. 1–2 minute pore live: `https://ruhulamen-1.github.io/Credence-website/`

Prottek `git push`-er pore site nijei update hoy.

### Upay B: Netlify (free — website + admin dutoi live)
1. [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project** → GitHub → `Credence-website` select.
   `netlify.toml` already ache (build command `node build.js`), kichu bodlate hobe na → **Deploy**.
2. **Admin login setup:**
   - GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
     - Homepage URL: tomar Netlify site URL
     - Authorization callback URL: `https://api.netlify.com/auth/done`
     - Client ID ar Client Secret copy koro.
   - Netlify → **Site configuration → Access & security → OAuth → Install provider → GitHub** → ID ar Secret paste.
3. `https://tomar-site.netlify.app/admin/` e giye **Login with GitHub**.
4. Je staff-ra admin use korbe tader GitHub-e repo-te **collaborator (write)** koro.
5. Admin-e **Publish** dile Netlify nijei rebuild kore site update kore dey.

### Nijer domain (jemon credencehousingltd.com)
- **Netlify:** Domain management → Add custom domain → DNS-e Netlify-r dewa record boshao. SSL (https) auto hoy.
- **GitHub Pages:** Settings → Pages → Custom domain → DNS-e `CNAME` record dao.
- Domain thik hole `data/site.json`-er `siteUrl` ar `admin/config.yml`-er `site_url` bodle daw, tahole SEO/sitemap thik URL pabe.

---

## 6. Live-er por checklist
- [ ] `siteUrl` thik domain
- [ ] Project-er real photo, spec, floor plan, brochure
- [ ] Paramount Residences, Platinum, Cynosure-er thik location ar status
- [ ] GTM ba GA4 ID, Meta Pixel ID
- [ ] Formspree endpoint, WhatsApp number
- [ ] Google Search Console-e site verify koro ar `sitemap.xml` submit koro
- [ ] Phone-e ar desktop-e site dekho

---

## 7. Shomoshya hole

| Shomoshya | Somadhan |
|---|---|
| `python` command nei | `npx serve -l 8000` use koro |
| Admin-e "Failed to load" | `npx decap-server` onno terminal-e chalu ache kina dekho |
| Admin-e change dekhachhe na | `node build.js` chalao, browser-e `Ctrl + F5` |
| `git push` password chay | GitHub **Personal Access Token** dao (Settings → Developer settings → Tokens) |
| `LF will be replaced by CRLF` warning | Windows-er normal warning, ignore koro |
| Notun project card-e chobi ashchhe na | `node build.js` chalao ar `data/projects.js` update holo kina dekho |

---

Design-er rong, font, style: `THEME.md`. Admin-er bistarito plan: `ADMIN_PLAN.md`.
