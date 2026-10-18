import config from '@payload-config'
import { getPayload } from 'payload'

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

/* eslint-disable @typescript-eslint/no-explicit-any */
const img = (m: any, fallbackAlt = ''): Img | null => (m && typeof m === 'object' && m.url ? { url: m.url, alt: m.alt || fallbackAlt } : null)

export async function getSettings(): Promise<Settings> {
  const payload = await getPayload({ config })
  const g: any = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
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

const map = (d: any): Project => ({
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

export async function getProjects(): Promise<Project[]> {
  const payload = await getPayload({ config })
  const r = await payload.find({ collection: 'projects', limit: 500, sort: 'order', depth: 1, pagination: false })
  return r.docs.map(map)
}

export async function getProject(slug: string): Promise<Project | null> {
  const payload = await getPayload({ config })
  const r = await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return r.docs[0] ? map(r.docs[0]) : null
}
