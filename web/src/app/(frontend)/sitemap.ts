import type { MetadataRoute } from 'next'
import { getProjects, getSettings } from '../../lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [s, projects] = await Promise.all([getSettings(), getProjects()])
  return [{ url: s.siteUrl, changeFrequency: 'weekly', priority: 1 }, ...projects.map((p) => ({ url: `${s.siteUrl}/projects/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.8 }))]
}
