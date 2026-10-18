import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { InnerHero } from '@/components/InnerHero'
import { getSettings, getTeam, type Member } from '@/lib/data'
import { alternates } from '@/lib/meta'
import { getDict, isLang, navT } from '@/i18n'

type Props = { params: Promise<{ lang: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return { title: getDict(lang).about.title, alternates: alternates(lang, '/about') }
}

const Grid = ({ list }: { list: Member[] }) => (
  <div className="team-grid">
    {list.map((m, i) => (
      <article className="member reveal" key={i}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {m.photo ? <img src={m.photo.url} alt={m.photo.alt || m.name} loading="lazy" /> : <div className="ph-empty" />}
        <h3>{m.name}</h3><span className="role">{m.role}</span>{m.bio && <p>{m.bio}</p>}
      </article>
    ))}
  </div>
)

export default async function About({ params }: Props) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const t = getDict(lang)
  const [s, team] = await Promise.all([getSettings(lang), getTeam(lang)])
  const mgmt = team.filter((m) => m.group === 'management'), rest = team.filter((m) => m.group !== 'management')
  return (
    <>
      <Nav lang={lang} t={navT(t)} path={'/about'} hotline={s.hotline} />
      <InnerHero eyebrow={t.about.eyebrow} title={t.about.title}><p>{t.about.text}</p></InnerHero>
      <main>
        <section>
          {team.length === 0 && <p className="none">{t.about.empty}</p>}
          {mgmt.length > 0 && (<><div className="sec-head reveal"><h2>{t.about.management}</h2></div><Grid list={mgmt} /></>)}
          {rest.length > 0 && (<><div className="sec-head reveal"><h2>{t.about.team}</h2></div><Grid list={rest} /></>)}
        </section>
      </main>
      <Footer hotline={s.hotline} t={t} />
    </>
  )
}
