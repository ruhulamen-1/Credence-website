import config from '@payload-config'
import { getPayload } from 'payload'
import type { Lang } from '../i18n'

export type Img = { url: string; alt: string }
export type Project = {
  slug: string; name: string; status: string; type: string; area: string; addr: string
  mapQuery?: string; tagline?: string; hue: number; floors: number
  image: Img | null; brochure: string | null; gallery: Img[]
  facts: { v: string; l: string }[]; storyTitle?: string; story: string[]; spec: { k: string; v: string }[]
  seoTitle?: string; seoDescription?: string; ogImage: Img | null
}
export type Settings = {
  name: string; address: string; email: string; hotline: string; phones: string[]; whatsapp: string
  siteUrl: string; homeTitle: string; homeDescription: string; ogImage: Img | null
  consentRequired: boolean; tracking: { gtm: string; ga4: string; metaPixel: string; tiktokPixel: string }
}
export type Post = {
  slug: string; title: string; kind: 'blog' | 'news' | 'event'; excerpt: string; cover: Img | null
  publishedAt: string | null; eventDate: string | null; eventLocation: string; author: string
  body: unknown; seoTitle?: string; seoDescription?: string; related: { slug: string; name: string } | null
}
export type Member = { name: string; role: string; group: 'management' | 'team'; photo: Img | null; bio: string }
export type Job = { slug: string; title: string; department: string; location: string; employmentType: string; open: boolean; deadline: string | null; description: unknown }
export type Landing = {
  slug: string; title: string; language: Lang; noindex: boolean; headline: string; subheading: string; bullets: string[]
  buttonText: string; phone: string; image: Img | null; project: string | null
  abTest: boolean; headlineB: string; buttonTextB: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const img = (m: any, fallbackAlt = ''): Img | null => (m && typeof m === 'object' && m.url ? { url: m.url, alt: m.alt || fallbackAlt } : null)
const published = { _status: { equals: 'published' } } as const
const api = () => getPayload({ config })
const loc = (lang: Lang) => ({ locale: lang, fallbackLocale: 'en' as const })

export async function getSettings(lang: Lang = 'en'): Promise<Settings> {
  const payload = await api()
  const g: any = await payload.findGlobal({ slug: 'site-settings', depth: 1, ...loc(lang) })
  const t = g.tracking || {}
  return {
    name: g.name || 'Credence Housing Limited',
    address: g.address || '',
    email: g.email || '',
    hotline: g.hotline || '',
    phones: (g.phones || []).map((p: any) => p.number).filter(Boolean),
    whatsapp: g.whatsapp || '',
    siteUrl: (g.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, ''),
    homeTitle: g.homeTitle || 'Credence Housing Limited',
    homeDescription: g.homeDescription || '',
    ogImage: img(g.ogImage),
    consentRequired: g.consentRequired !== false,
    tracking: { gtm: t.gtm || '', ga4: t.ga4 || '', metaPixel: t.metaPixel || '', tiktokPixel: t.tiktokPixel || '' },
  }
}

const mapProject = (d: any): Project => ({
  slug: d.slug, name: d.name, status: d.status, type: d.type, area: d.area, addr: d.addr,
  mapQuery: d.mapQuery || undefined, tagline: d.tagline || undefined,
  hue: d.hue ?? 208, floors: d.floors ?? 16,
  image: img(d.image, d.name),
  brochure: d.brochure && typeof d.brochure === 'object' ? d.brochure.url || null : null,
  gallery: (d.gallery || []).map((g: any) => img(g.image, d.name)).filter(Boolean) as Img[],
  facts: (d.facts || []).map((f: any) => ({ v: f.v, l: f.l })),
  storyTitle: d.storyTitle || undefined,
  story: (d.story || []).map((s: any) => s.paragraph).filter(Boolean),
  spec: (d.spec || []).map((r: any) => ({ k: r.k, v: r.v })),
  seoTitle: d.seoTitle || undefined, seoDescription: d.seoDescription || undefined, ogImage: img(d.ogImage),
})

export async function getProjects(lang: Lang = 'en'): Promise<Project[]> {
  const payload = await api()
  const r = await payload.find({ collection: 'projects', where: published, limit: 500, sort: 'order', depth: 1, pagination: false, ...loc(lang) })
  return r.docs.map(mapProject)
}

export async function getProject(slug: string, lang: Lang = 'en'): Promise<Project | null> {
  const payload = await api()
  const r = await payload.find({ collection: 'projects', where: { and: [{ slug: { equals: slug } }, published] }, limit: 1, depth: 1, ...loc(lang) })
  return r.docs[0] ? mapProject(r.docs[0]) : null
}

const mapPost = (d: any): Post => ({
  slug: d.slug, title: d.title, kind: d.kind, excerpt: d.excerpt || '', cover: img(d.cover, d.title),
  publishedAt: d.publishedAt || null, eventDate: d.eventDate || null, eventLocation: d.eventLocation || '', author: d.author || '',
  body: d.body, seoTitle: d.seoTitle || undefined, seoDescription: d.seoDescription || undefined,
  related: d.relatedProject && typeof d.relatedProject === 'object' ? { slug: d.relatedProject.slug, name: d.relatedProject.name } : null,
})

export async function getPosts(lang: Lang = 'en', kinds?: string[]): Promise<Post[]> {
  const payload = await api()
  const where: any = kinds?.length ? { and: [published, { kind: { in: kinds } }] } : published
  const r = await payload.find({ collection: 'posts', where, limit: 100, sort: '-publishedAt', depth: 2, pagination: false, ...loc(lang) })
  return r.docs.map(mapPost)
}
export async function getPost(slug: string, lang: Lang = 'en'): Promise<Post | null> {
  const payload = await api()
  const r = await payload.find({ collection: 'posts', where: { and: [{ slug: { equals: slug } }, published] }, limit: 1, depth: 2, ...loc(lang) })
  return r.docs[0] ? mapPost(r.docs[0]) : null
}

export async function getTeam(lang: Lang = 'en'): Promise<Member[]> {
  const payload = await api()
  const r = await payload.find({ collection: 'team', limit: 200, sort: 'order', depth: 1, pagination: false, ...loc(lang) })
  return r.docs.map((d: any) => ({ name: d.name, role: d.role, group: d.group, photo: img(d.photo, d.name), bio: d.bio || '' }))
}

const mapJob = (d: any): Job => ({ slug: d.slug, title: d.title, department: d.department || '', location: d.location || '', employmentType: d.employmentType || '', open: d.open !== false, deadline: d.deadline || null, description: d.description })
export async function getJobs(lang: Lang = 'en'): Promise<Job[]> {
  const payload = await api()
  const r = await payload.find({ collection: 'careers', where: published, limit: 100, sort: '-createdAt', depth: 0, pagination: false, ...loc(lang) })
  return r.docs.map(mapJob)
}
export async function getJob(slug: string, lang: Lang = 'en'): Promise<Job | null> {
  const payload = await api()
  const r = await payload.find({ collection: 'careers', where: { and: [{ slug: { equals: slug } }, published] }, limit: 1, depth: 0, ...loc(lang) })
  return r.docs[0] ? mapJob(r.docs[0]) : null
}

export async function getLanding(slug: string): Promise<Landing | null> {
  const payload = await api()
  const r = await payload.find({ collection: 'landing-pages', where: { and: [{ slug: { equals: slug } }, published] }, limit: 1, depth: 1 })
  const d: any = r.docs[0]
  if (!d) return null
  return {
    slug: d.slug, title: d.title, language: d.language === 'bn' ? 'bn' : 'en', noindex: d.noindex !== false, headline: d.headline, subheading: d.subheading || '',
    bullets: (d.bullets || []).map((b: any) => b.text), buttonText: d.buttonText || '', phone: d.phone || '', image: img(d.image, d.headline),
    project: d.project && typeof d.project === 'object' ? d.project.slug : null,
    abTest: Boolean(d.abTest), headlineB: d.headlineB || '', buttonTextB: d.buttonTextB || '',
  }
}

/** Look up an old URL → new URL redirect. */
export async function getRedirect(path: string): Promise<{ to: string; permanent: boolean } | null> {
  const payload = await api()
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path
  const r = await payload.find({ collection: 'redirects', where: { from: { in: [clean, clean + '/'] } }, limit: 1, depth: 0, overrideAccess: true })
  const d: any = r.docs[0]
  return d ? { to: d.to, permanent: d.type !== '302' } : null
}
