import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { InnerHero } from '@/components/InnerHero'
import { getJobs, getSettings } from '@/lib/data'
import { alternates } from '@/lib/meta'
import { getDict, href, isLang, navT } from '@/i18n'

type Props = { params: Promise<{ lang: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return { title: getDict(lang).careers.title, alternates: alternates(lang, '/careers') }
}

export default async function Careers({ params }: Props) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const t = getDict(lang)
  const [s, jobs] = await Promise.all([getSettings(lang), getJobs(lang)])
  const open = jobs.filter((j) => j.open)
  return (
    <>
      <Nav lang={lang} t={navT(t)} hotline={s.hotline} />
      <InnerHero eyebrow={t.careers.eyebrow} title={t.careers.title}><p>{t.careers.text}</p></InnerHero>
      <main>
        <section>
          {open.length === 0 ? <p className="none">{t.careers.empty}</p> : (
            <div className="jobs">
              {open.map((j) => (
                <article className="job" key={j.slug}>
                  <div><h3><a className="stretch" href={href(lang, `/careers/${j.slug}`)}>{j.title}</a></h3><p>{[j.department, j.location, j.employmentType].filter(Boolean).join(' · ')}</p></div>
                  <span className="btn dark">{t.careers.apply}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer hotline={s.hotline} t={t} />
    </>
  )
}
