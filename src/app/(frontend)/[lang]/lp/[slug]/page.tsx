import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { LandingHero } from '@/components/LandingHero'
import { getLanding, getSettings } from '@/lib/data'
import { getDict, isLang, navT } from '@/i18n'

type Props = { params: Promise<{ lang: string; slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLang(lang)) return {}
  const p = await getLanding(slug)
  if (!p) return {}
  return { title: p.headline, description: p.subheading, robots: p.noindex ? { index: false, follow: false } : undefined, alternates: { canonical: `/lp/${slug}` } }
}

export default async function LandingPage({ params }: Props) {
  const { lang: l, slug } = await params
  if (!isLang(l)) notFound()
  const p = await getLanding(slug)
  if (!p) notFound()
  const lang = p.language
  const t = getDict(lang)
  const s = await getSettings(lang)
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "document.body.classList.add('open')" }} />
      <Nav lang={lang} t={navT(t)} path={`/lp/${slug}`} hotline={s.hotline} cta={t.nav.interested} ctaHref="#interest" />
      <main className="lp-page" id="interest"><LandingHero p={p} t={t.lp} tf={t.form} /></main>
      <Footer hotline={s.hotline} t={t} />
    </>
  )
}
