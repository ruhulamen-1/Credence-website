/* Builds the whole website as plain static files for ordinary shared hosting (cPanel).
   Run:  npm run export:shared -- --site-url=https://yourdomain.com
   Output: web/dist-shared/  → upload its CONTENT into public_html.
   Content comes from the local CMS database; forms post to enquiry.php (PHP + MySQL on the host). */
import config from '@payload-config'
import { spawn, spawnSync, type ChildProcess } from 'child_process'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

const root = process.cwd()
const out = path.join(root, 'dist-shared')
const PORT = 3199
const BASE = `http://localhost:${PORT}`
const arg = (n: string) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split('=').slice(1).join('=')
const siteUrlArg = arg('site-url')?.replace(/\/+$/, '')
const env = { ...process.env, NEXT_DIST_DIR: '.next-static', NEXT_PUBLIC_ENQUIRY_URL: '/enquiry.php', PORT: String(PORT) }
const win = process.platform === 'win32'

const log = (m: string) => console.log(`\n▶ ${m}`)
const write = (rel: string, data: string | Buffer) => { const f = path.join(out, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data) }
const copyDir = (from: string, to: string) => { if (fs.existsSync(from)) fs.cpSync(from, path.join(out, to), { recursive: true }) }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const kill = (p: ChildProcess) => { try { if (win && p.pid) spawnSync('taskkill', ['/pid', String(p.pid), '/f', '/t']); else p.kill('SIGTERM') } catch { /* already gone */ } }

async function main() {
  fs.rmSync(out, { recursive: true, force: true })
  fs.mkdirSync(out, { recursive: true })

  log('1/5  Building the site for static hosting (separate .next-static folder)…')
  const b = spawnSync('npx next build', { cwd: root, env, stdio: 'inherit', shell: true })
  if (b.status !== 0) throw new Error('next build failed')

  log('2/5  Starting a temporary local server to read the pages…')
  const server = spawn(`npx next start -p ${PORT}`, { cwd: root, env, stdio: 'ignore', shell: true })
  try {
    for (let i = 0; i < 60; i++) { try { if ((await fetch(BASE + '/robots.txt')).ok) break } catch { /* not up yet */ } await sleep(1000) }

    log('3/5  Collecting every page…')
    const payload = await getPayload({ config })
    const sm = await (await fetch(BASE + '/sitemap.xml')).text()
    const origin = (sm.match(/<loc>(https?:\/\/[^/<]+)/) || [])[1] || 'http://localhost:3000'
    const toPath = (u: string) => u.replace(/^https?:\/\/[^/]+/, '') || '/'
    const seeds = new Set<string>(['/', '/bn', ...[...sm.matchAll(/(?:<loc>|href=")(https?:\/\/[^<"]+)/g)].map((m) => toPath(m[1]))])
    const lps = await payload.find({ collection: 'landing-pages', where: { _status: { equals: 'published' } }, limit: 200, depth: 0, pagination: false, overrideAccess: true })
    lps.docs.forEach((d) => seeds.add(`/lp/${(d as { slug: string }).slug}`))

    const done = new Map<string, string>()
    const queue = [...seeds]
    const skip = /^(\/(api|admin|_next)\b|\/en(\/|$))|\.[a-z0-9]{2,5}$/i
    while (queue.length) {
      const p = queue.shift()!
      if (done.has(p)) continue
      const r = await fetch(BASE + p, { redirect: 'manual' })
      if (r.status !== 200) { console.warn(`   ! ${p} → HTTP ${r.status} (skipped)`); done.set(p, ''); continue }
      const html = await r.text()
      done.set(p, html)
      // follow internal links we have not seen (pages that are not in the sitemap)
      for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
        const h = m[1].replace(/\/+$/, '') || '/'
        if (!skip.test(h) && !done.has(h) && !queue.includes(h)) queue.push(h)
      }
    }
    let pages = 0
    for (const [p, html] of done) {
      if (!html) continue
      write(p === '/' ? 'index.html' : `${p.replace(/\/+$/, '')}/index.html`, html)
      pages++
    }
    const nf = await fetch(BASE + '/__page-not-found')
    write('404.html', await nf.text())
    write('robots.txt', await (await fetch(BASE + '/robots.txt')).text())
    write('sitemap.xml', sm)

    log('4/5  Copying assets (scripts, images, uploads, PHP form handler)…')
    copyDir(path.join(root, '.next-static', 'static'), '_next/static')
    copyDir(path.join(root, 'public'), '.')
    copyDir(path.join(root, 'media'), 'api/media/file')
    for (const f of ['enquiry.php', 'config.sample.php', 'schema.sql']) fs.copyFileSync(path.join(root, 'shared-host', f), path.join(out, f))

    // .htaccess: error page, caching, security, and the redirects saved in the CMS
    const reds = await payload.find({ collection: 'redirects', limit: 2000, depth: 0, pagination: false, overrideAccess: true })
    const redLines = reds.docs.map((d) => {
      const r = d as { from: string; to: string; type?: string }
      return `Redirect ${r.type === '302' ? '302' : '301'} ${r.from} ${r.to}`
    })
    write('.htaccess', [
      '# If your host shows a "500 Internal Server Error", delete the lines you do not need here (hosts differ in what .htaccess may set).', 'ErrorDocument 404 /404.html', 'AddDefaultCharset UTF-8', '',
      '# Redirects from the CMS (Admin → Redirects)', ...redLines, '',
      '# Force HTTPS: remove the # from the next 3 lines once your SSL certificate is active', '#RewriteEngine On', '#RewriteCond %{HTTPS} off', '#RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]', '',
      '# Never expose the database password or SQL files',
      '<Files "config.php">', '  Require all denied', '</Files>', '<FilesMatch "\\.(sql)$">', '  Require all denied', '</FilesMatch>', '',
      '# Speed: compress text, cache hashed assets for a year',
      '<IfModule mod_deflate.c>', '  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml text/xml', '</IfModule>',
      '<IfModule mod_expires.c>', '  ExpiresActive On', '  ExpiresByType image/webp "access plus 1 month"', '  ExpiresByType image/jpeg "access plus 1 month"', '  ExpiresByType image/png "access plus 1 month"', '  ExpiresByType text/html "access plus 0 seconds"', '</IfModule>',
      '<IfModule mod_headers.c>', '  Header set X-Content-Type-Options "nosniff"', '  Header set Referrer-Policy "strict-origin-when-cross-origin"', '</IfModule>', '',
    ].join('\n'))

    // domain: replace the address saved in Site settings with the real domain
    if (siteUrlArg && siteUrlArg !== origin) {
      const esc = origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const re = new RegExp(esc, 'g')
      const walk = (d: string) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== '_next') walk(f) } else if (/\.(html|xml|txt)$/.test(e.name)) fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(re, siteUrlArg)) } }
      walk(out)
      console.log(`   site address: ${origin}  →  ${siteUrlArg}`)
    } else if (!siteUrlArg && /localhost/.test(origin)) {
      console.warn(`\n   ⚠ Site address is still ${origin}. Re-run with  -- --site-url=https://yourdomain.com  (or set it in Admin → Site settings → SEO) so sitemap/canonical links are correct.`)
    }

    log('5/5  Done')
    const size = (d: string): number => fs.readdirSync(d, { withFileTypes: true }).reduce((s, e) => s + (e.isDirectory() ? size(path.join(d, e.name)) : fs.statSync(path.join(d, e.name)).size), 0)
    console.log(`   ${pages} pages, ${(size(out) / 1048576).toFixed(1)} MB  →  ${out}`)
    console.log('   Upload the CONTENT of dist-shared into public_html. Steps: SHARED_HOSTING.md')
  } finally {
    kill(server)
  }
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
