import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { InnerHero } from '@/components/InnerHero'
import { Rich } from '@/components/Rich'
import { ContactForm } from '@/components/ContactForm'
import { getJob, getJobs, getSettings } from '@/lib/data'
import { alternates } from '@/lib/meta'
import { dateLocale, fmt, getDict, href, isLang, locales, navT } from '@/i18n'

type Props = { params: Promise<{ lang: string; slug: string }> }
export async function generateStaticParams() {
  try {
    const out: { lang: string; slug: string }[] = []
    for (const lang of locales) for (const j of await getJobs(lang)) out.push({ lang, slug: j.slug })
    return out
  } catch { return [] }
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLang(lang)) return {}
  const j = await getJob(slug, lang)
  return j ? { title: j.title, alternates: alternates(lang, `/careers/${slug}`) } : {}
}

export default async function JobPage({ params }: Props) {
  const { lang, slug } = await params
  if (!isLang(lang)) notFound()
  const t = getDict(lang)
  const [j, s] = await Promise.all([getJob(slug, lang), getSettings(lang)])
  if (!j) notFound()
  const ld = { '@context': 'https://schema.org', '@type': 'JobPosting', title: j.title, datePosted: undefined, validThrough: j.deadline || undefined, employmentType: j.employmentType.toUpperCase().replace('-', '_'), hiringOrganization: { '@type': 'Organization', name: s.name, sameAs: s.siteUrl }, jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: j.location || 'Dhaka', addressCountry: 'BD' } } }
  const closed = !j.open || (j.deadline ? new Date(j.deadline) < new Date() : false)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <Nav lang={lang} t={navT(t)} hotline={s.hotline} />
      <InnerHero eyebrow={t.careers.eyebrow} title={j.title} crumbs={<><a href={href(lang, '/careers')}>{t.careers.back}</a></>}>
        <p>{[j.department, j.location, j.employmentType].filter(Boolean).join(' · ')}{j.deadline ? ` · ${fmt(t.careers.deadline, { date: new Date(j.deadline).toLocaleDateString(dateLocale(lang), { year: 'numeric', month: 'long', day: 'numeric' }) })}` : ''}</p>
      </InnerHero>
      <main>
        <section className="two-col">
          <div><Rich data={j.description} /></div>
          <div>
            <div className="sec-head"><h2>{t.careers.applyTitle}</h2></div>
            {closed ? <p className="none">{t.careers.closed}</p> : <ContactForm t={t.form} kind="career" job={j.slug} button={t.careers.send} thanks={t.careers.thanks} messageRequired={false} />}
          </div>
        </section>
      </main>
      <Footer hotline={s.hotline} t={t} />
    </>
  )
}
