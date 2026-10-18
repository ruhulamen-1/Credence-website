/* Adds clearly-labelled DEMO content (projects, blog/news/event, team, jobs, campaign page, redirects, 30 leads)
   so every page and the admin dashboard have something to show.
   Run:     npm run seed:demo            (safe to run again — it replaces its own demo items)
   Remove:  npm run seed:demo -- --remove
   Works with whichever database DATABASE_URL points to (MySQL, PostgreSQL, SQLite). */
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

const remove = process.argv.includes('--remove')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any

const text = (t: string) => ({ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const para = (t: string) => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', children: [text(t)] })
const head = (t: string) => ({ type: 'heading', tag: 'h2', format: '', indent: 0, version: 1, direction: 'ltr', children: [text(t)] })
const rich = (...blocks: Any[]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: blocks } })
const daysAgo = (n: number, h = 10) => new Date(Date.now() - n * 864e5 + h * 36e5).toISOString()
const rnd = (() => { let s = 20261018; return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296) })()
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)]

async function wipe(payload: Payload) {
  const del = async (collection: Any, where: Any) => { const r = await payload.delete({ collection, where, overrideAccess: true }); return r.docs?.length ?? 0 }
  let n = 0
  n += await del('projects', { slug: { like: 'demo-' } })
  n += await del('posts', { slug: { like: 'demo-' } })
  n += await del('careers', { slug: { like: 'demo-' } })
  n += await del('landing-pages', { slug: { like: 'demo-' } })
  n += await del('team', { name: { like: '(Demo)' } })
  n += await del('redirects', { from: { like: '/demo-' } })
  n += await del('leads', { notes: { equals: 'DEMO' } })
  console.log(`Removed ${n} demo items.`)
}

async function main() {
  const payload = await getPayload({ config })
  await wipe(payload)
  if (remove) return

  const create = (collection: Any, data: Any) => payload.create({ collection, data: { ...data }, overrideAccess: true })

  /* ---- Projects (3 sample projects; the 7 real ones from `npm run seed` are left untouched) ---- */
  const projects: Any[] = []
  const P = [
    { slug: 'demo-skyline-residence', name: 'Demo Skyline Residence', area: 'Uttara', status: 'Upcoming', hue: 200, floors: 14, addr: 'Sector 7, Uttara, Dhaka (sample address)', order: 910,
      tagline: 'A sample 12-storey residence with lake-facing balconies and a rooftop garden.',
      facts: [{ v: '12', l: 'Storeys' }, { v: '2', l: 'Apartments per floor' }, { v: '1,850', l: 'sq. ft. (sample)' }, { v: '2028', l: 'Expected handover' }],
      story: ['This is sample text for a demo project. Replace it with the real description before launch.', 'Use this project to check how long text, the facts strip and the specification table look on desktop and mobile.'],
      spec: [{ k: 'Land area', v: '8 Katha (sample)' }, { k: 'Building type', v: 'Residential' }, { k: 'Facing', v: 'South' }, { k: 'Car parking', v: '20' }, { k: 'Handover', v: 'December 2028' }] },
    { slug: 'demo-green-court', name: 'Demo Green Court', area: 'Bashundhara', status: 'Ongoing', hue: 150, floors: 10, addr: 'Block D, Bashundhara R/A, Dhaka (sample address)', order: 920,
      tagline: 'Sample project with a courtyard, EV charging and a community hall.',
      facts: [{ v: '9', l: 'Storeys' }, { v: '36', l: 'Apartments' }, { v: '1,350', l: 'sq. ft. (sample)' }],
      story: ['Another sample project so the project grid, filters and location chips have more than one entry.'],
      spec: [{ k: 'Building type', v: 'Residential' }, { k: 'Facing', v: 'East' }] },
    { slug: 'demo-business-plaza', name: 'Demo Business Plaza', area: 'Gulshan', status: 'Completed', type: 'Commercial', hue: 270, floors: 16, addr: 'Gulshan Avenue, Dhaka (sample address)', order: 930,
      tagline: 'Sample commercial building (shows the Commercial filter).',
      facts: [{ v: '16', l: 'Floors' }, { v: '2019', l: 'Handed over' }],
      story: ['Sample commercial project.'], spec: [{ k: 'Building type', v: 'Commercial' }] },
  ]
  for (const p of P) projects.push(await create('projects', { type: 'Apartment', ...p, story: p.story.map((paragraph) => ({ paragraph })), mapQuery: p.addr, _status: 'published' }))
  await payload.update({ collection: 'projects', id: projects[0].id, locale: 'bn', overrideAccess: true, data: { tagline: 'হ্রদমুখী বারান্দা ও ছাদবাগানসহ একটি নমুনা ১২ তলা আবাসন (ডেমো)।' } })
  console.log('✔ 3 demo projects')

  /* ---- Blog / news / events ---- */
  const posts: Any[] = [
    { slug: 'demo-buying-guide', kind: 'blog', title: '[Demo] 7 things to check before buying an apartment', excerpt: 'A sample article with headings and paragraphs to test the blog layout.', publishedAt: daysAgo(9), author: 'Demo Editor',
      body: rich(head('1. Land documents'), para('Sample paragraph. Always verify the land title and mutation records with a lawyer.'), head('2. Approvals and layout'), para('Sample paragraph. Check the approved plan, number of storeys and parking.'), head('3. Handover date'), para('Sample paragraph. Ask for the handover schedule in writing.')) },
    { slug: 'demo-interior-trends', kind: 'blog', title: '[Demo] Light, space and ventilation: a modern home checklist', excerpt: 'Second sample article so the list shows more than one card.', publishedAt: daysAgo(20), author: 'Demo Editor',
      body: rich(para('Sample article body. Replace with real content.'), para('Second sample paragraph to check line length and spacing.')) },
    { slug: 'demo-handover-news', kind: 'news', title: '[Demo] Sample project handed over to owners', excerpt: 'A sample news item.', publishedAt: daysAgo(3), author: 'Demo Editor',
      body: rich(para('Sample news text. This is demo content and not a real announcement.')) },
    { slug: 'demo-open-house', kind: 'event', title: '[Demo] Open house weekend', excerpt: 'A sample event with a date and a place.', publishedAt: daysAgo(1), author: 'Demo Editor',
      eventDate: new Date(Date.now() + 12 * 864e5).toISOString(), eventLocation: 'Dhanmondi site office (sample)',
      body: rich(para('Sample event description. Visit, meet the counsellors and walk through a model flat.')) },
  ]
  const madePosts: Any[] = []
  for (const p of posts) madePosts.push(await create('posts', { ...p, relatedProject: p.kind === 'event' ? projects[0].id : undefined, _status: 'published' }))
  await payload.update({ collection: 'posts', id: madePosts[0].id, locale: 'bn', overrideAccess: true, data: { title: '[ডেমো] অ্যাপার্টমেন্ট কেনার আগে ৭টি বিষয় দেখুন', excerpt: 'ব্লগের নকশা পরীক্ষার জন্য একটি নমুনা লেখা।' } })
  console.log('✔ 4 demo posts (blog, news, event)')

  /* ---- Team ---- */
  const team = [
    ['Demo Director One (Demo)', 'Managing Director', 'management'], ['Demo Director Two (Demo)', 'Director, Projects', 'management'],
    ['Demo Architect (Demo)', 'Head of Design', 'team'], ['Demo Engineer (Demo)', 'Chief Engineer', 'team'],
    ['Demo Counsellor (Demo)', 'Sales Counsellor', 'team'], ['Demo Manager (Demo)', 'Customer Care Manager', 'team'],
  ]
  let i = 0
  for (const [name, role, group] of team) await create('team', { name, role, group, order: 900 + ++i, bio: i <= 2 ? 'Sample biography text for layout testing.' : undefined })
  console.log('✔ 6 demo team members')

  /* ---- Careers ---- */
  const jobs = [
    { slug: 'demo-site-engineer', title: '[Demo] Site Engineer', department: 'Engineering', location: 'Dhaka', employmentType: 'full-time' },
    { slug: 'demo-sales-executive', title: '[Demo] Sales Executive', department: 'Sales', location: 'Dhaka', employmentType: 'full-time' },
    { slug: 'demo-architect-intern', title: '[Demo] Architecture Intern', department: 'Design', location: 'Dhaka', employmentType: 'internship' },
  ]
  for (const j of jobs) await create('careers', { ...j, open: true, deadline: daysAgo(-30), description: rich(head('Responsibilities'), para('Sample responsibilities text.'), head('Requirements'), para('Sample requirements text.')), _status: 'published' })
  console.log('✔ 3 demo jobs')

  /* ---- Campaign page (A/B) + redirects ---- */
  await create('landing-pages', { title: 'Demo Eid Offer', slug: 'demo-eid-offer', language: 'en', noindex: true, headline: 'Book your dream home this Eid', headlineB: 'Eid special: easy instalments on selected flats',
    subheading: 'Sample campaign page for testing the form, tracking and A/B headline.', bullets: [{ text: 'Ready and ongoing flats' }, { text: 'Flexible payment plan (sample)' }, { text: 'Free site visit' }],
    buttonText: 'Request a call back', buttonTextB: 'Get the offer', abTest: true, project: projects[0].id, _status: 'published' })
  await create('redirects', { from: '/demo-old-project-page', to: '/projects/demo-skyline-residence', type: '301' })
  await create('redirects', { from: '/demo-old-blog', to: '/blog', type: '302' })
  console.log('✔ 1 campaign page (A/B) + 2 redirects')

  /* ---- 30 leads over the last 30 days ---- */
  const names = ['Demo Rahim', 'Demo Karim', 'Demo Nasrin', 'Demo Sumon', 'Demo Farhana', 'Demo Tanvir', 'Demo Mitu', 'Demo Imran', 'Demo Shirin', 'Demo Arif']
  const kinds = ['enquiry', 'enquiry', 'enquiry', 'buyer', 'landowner', 'campaign', 'career']
  const statuses = ['new', 'new', 'new', 'contacted', 'contacted', 'visit', 'negotiation', 'booked', 'lost']
  const sources = [{ utm_source: 'facebook', utm_medium: 'cpc', utm_campaign: 'eid-offer' }, { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'brand' }, { gclid: 'demo-gclid' }, { fbclid: 'demo-fbclid' }, { referrer: 'https://example.com/' }, {}]
  for (let n = 0; n < 30; n++) {
    const kind = pick(kinds)
    const project = pick(projects)
    await create('leads', {
      name: `${pick(names)} ${n + 1}`, phone: `0170000${String(1000 + n).slice(-4)}`, email: n % 3 === 0 ? `demo${n}@example.com` : undefined, message: 'Demo lead — sample message.',
      kind, status: pick(statuses), project: ['enquiry', 'buyer', 'campaign'].includes(kind) ? project.id : undefined, page: kind === 'enquiry' ? `/projects/${project.slug}` : `/${kind}`,
      campaign: kind === 'campaign' ? 'Demo Eid Offer' : undefined, variant: kind === 'campaign' ? pick(['A', 'B']) : undefined,
      source: { ...pick(sources), landing: '/' }, notes: 'DEMO', createdAt: daysAgo(Math.floor(rnd() * 30), 8 + Math.floor(rnd() * 10)),
    })
  }
  console.log('✔ 30 demo leads')
  console.log('\nDone. Open the site and /admin (Leads overview now has numbers). Remove everything later with:  npm run seed:demo -- --remove')
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
