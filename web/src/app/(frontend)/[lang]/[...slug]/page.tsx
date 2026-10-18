import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { getRedirect } from '@/lib/data'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ lang: string; slug: string[] }> }

/** Anything that is not a known page: apply a redirect from the CMS (old URL → new URL) or show the 404 page. */
export default async function CatchAll({ params }: Props) {
  const { lang, slug } = await params
  const path = '/' + slug.map(decodeURIComponent).join('/')
  const full = lang === 'bn' ? '/bn' + path : path
  const r = (await getRedirect(full)) || (lang === 'bn' ? await getRedirect(path) : null)
  if (r) (r.permanent ? permanentRedirect : redirect)(r.to)
  notFound()
}
