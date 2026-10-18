import type { MetadataRoute } from 'next'
import { getJobs, getPosts, getProjects, getSettings } from '../../lib/data'
import { href, locales } from '../../i18n'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const s = await getSettings()
  const [projects, posts, jobs] = await Promise.all([getProjects(), getPosts(), getJobs()])
  const paths: [string, MetadataRoute.Sitemap[number]['changeFrequency'], number][] = [
    ['/', 'weekly', 1], ['/about', 'monthly', 0.6], ['/blog', 'weekly', 0.7], ['/careers', 'weekly', 0.5], ['/landowner', 'monthly', 0.6], ['/buyer', 'monthly', 0.6],
    ...projects.map((p) => [`/projects/${p.slug}`, 'monthly', 0.8] as [string, 'monthly', number]),
    ...posts.map((p) => [`/blog/${p.slug}`, 'monthly', 0.6] as [string, 'monthly', number]),
    ...jobs.filter((j) => j.open).map((j) => [`/careers/${j.slug}`, 'weekly', 0.4] as [string, 'weekly', number]),
  ]
  return paths.map(([path, changeFrequency, priority]) => ({
    url: `${s.siteUrl}${href('en', path)}`, changeFrequency, priority,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${s.siteUrl}${href(l, path)}`])) },
  }))
}
