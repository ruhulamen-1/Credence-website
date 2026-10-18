import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { InnerHero } from '@/components/InnerHero'
import { ContactForm } from '@/components/ContactForm'
import { getSettings } from '@/lib/data'
import { alternates } from '@/lib/meta'
import { getDict, isLang, navT } from '@/i18n'

type Props = { params: Promise<{ lang: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return { title: getDict(lang).buyer.title, alternates: alternates(lang, '/buyer') }
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const t = getDict(lang)
  const s = await getSettings(lang)
  const p = t.buyer
  return (
    <>
      <Nav lang={lang} t={navT(t)} path={'/buyer'} hotline={s.hotline} />
      <InnerHero eyebrow={p.eyebrow} title={p.title}><p>{p.text}</p></InnerHero>
      <main>
        <section className="narrow">
          <ContactForm t={t.form} kind="buyer" button={p.send} thanks={p.thanks} messageRequired={false} extra={[{ name: 'budget', label: p.budget }, { name: 'area', label: p.area }, { name: 'size', label: p.size }]} />
        </section>
      </main>
      <Footer hotline={s.hotline} t={t} />
    </>
  )
}
