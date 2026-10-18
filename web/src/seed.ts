/* Imports the original static-site content (../data/*.json) into the CMS and creates the first admin.
   Run once:  npm run seed      (safe to re-run: existing projects are updated, not duplicated) */
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

const root = path.resolve(process.cwd(), '..', 'data')
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'))

async function main() {
  console.log('seed: starting')
  const payload = await getPayload({ config })
  console.log('seed: payload ready')

  const site = read('site.json')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      name: site.name, address: site.address, email: site.email, hotline: site.hotline,
      phones: site.phone.map((number: string) => ({ number })), whatsapp: site.whatsapp || '',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || site.siteUrl,
      homeTitle: site.homeTitle, homeDescription: site.homeDesc, consentRequired: site.consentRequired !== false,
      tracking: site.tracking,
    } as never,
  })

  const { projects } = read('projects.json')
  let order = 10
  for (const p of projects) {
    const data = {
      name: p.name, slug: p.slug, status: p.status, type: p.type, area: p.area, addr: p.addr, mapQuery: p.mapQuery,
      tagline: p.tagline, hue: p.hue, floors: p.floors, storyTitle: p.storyTitle, order: (order += 10),
      facts: p.facts || [], story: (p.story || []).map((paragraph: string) => ({ paragraph })), spec: p.spec || [],
      seoTitle: p.seoTitle, seoDescription: p.seoDesc,
    } as never
    const found = await payload.find({ collection: 'projects', where: { slug: { equals: p.slug } }, limit: 1, depth: 0 })
    if (found.docs[0]) await payload.update({ collection: 'projects', id: found.docs[0].id, data })
    else await payload.create({ collection: 'projects', data })
    console.log('✔ project', p.name)
  }

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@credence.local'
  const has = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (!has.docs[0]) {
    await payload.create({ collection: 'users', data: { email, password: process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!', name: 'Admin', role: 'admin' } as never })
    console.log('✔ admin user', email)
  }
  console.log('Seed complete.')
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
