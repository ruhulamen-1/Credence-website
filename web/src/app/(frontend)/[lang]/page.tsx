import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Tower } from '../../../components/TowerGraphic'
import { Intro } from '../../../components/Intro'
import { Nav } from '../../../components/Nav'
import { Finder } from '../../../components/Finder'
import { ProjectGrid } from '../../../components/ProjectGrid'
import { ContactForm } from '../../../components/ContactForm'
import { ContactInfo } from '../../../components/ContactInfo'
import { Footer } from '../../../components/Footer'
import { getProjects, getSettings } from '../../../lib/data'
import { alternates } from '../../../lib/meta'
import { getDict, isLang, type Lang, navT } from '../../../i18n'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const s = await getSettings(lang)
  return { title: { absolute: s.homeTitle }, description: s.homeDescription, alternates: alternates(lang, '/') }
}

export default async function Home({ params }: Props) {
  const { lang: l } = await params
  if (!isLang(l)) notFound()
  const lang: Lang = l
  const t = getDict(lang)
  const [projects, s] = await Promise.all([getProjects(lang), getSettings(lang)])
  const areas = [...new Set(projects.map((p) => p.area))]
  const ld = {
    '@context': 'https://schema.org', '@type': 'RealEstateAgent', name: s.name, url: s.siteUrl, telephone: s.phones[0], email: s.email,
    address: { '@type': 'PostalAddress', streetAddress: s.address, addressLocality: 'Dhaka', addressCountry: 'BD' },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <Intro t={t.intro} />
      <Nav lang={lang} t={navT(t)} hotline={s.hotline} />
      <main id="top">
        <section className="hero" id="hero">
          <div className="sky" />
          <div className="hero-copy">
            <h2>{t.hero.l1}<br />{t.hero.l2}</h2>
            <p>{t.hero.text}</p>
            <p className="from">{t.hero.from}<br /><strong>{t.hero.areas}</strong></p>
          </div>
          <div className="tower-wrap"><Tower id="tower" hue={208} floors={16} uid="hero" /></div>
          <div className="mist" />
          <Finder t={t.finder} areas={areas} names={projects.map((p) => p.name)} />
        </section>

        <section className="lead reveal">
          <p className="eyebrow">{t.lead.eyebrow}</p>
          <p className="big">{t.lead.text}</p>
        </section>

        <section className="projects" id="projects">
          <div className="sec-head reveal"><p className="eyebrow">{t.featured.eyebrow}</p><h2>{t.featured.title}</h2></div>
          <ProjectGrid projects={projects} lang={lang} t={t.grid} />
        </section>

        <section className="footprints" id="footprints">
          <div className="sec-head reveal"><p className="eyebrow">{t.foot.eyebrow}</p><h2>{t.foot.title}</h2></div>
          <div className="stats reveal">
            <div><b data-n="50">50</b><sup>+</sup><span>{t.foot.s1}</span></div>
            <div><b data-n="700">700</b><sup>+</sup><span>{t.foot.s2}</span></div>
            <div><b data-n="18">18</b><sup>+</sup><span>{t.foot.s3}</span></div>
          </div>
          <p className="body reveal">{t.foot.p1}</p>
          <p className="body reveal">{t.foot.p2}</p>
        </section>

        <section className="why" id="why">
          <div className="sec-head reveal"><p className="eyebrow">{t.why.eyebrow}</p><h2>{t.why.title}</h2></div>
          <div className="cards">
            {t.why.items.map(([h, p], i) => <article className="reveal" key={i}><i>0{i + 1}</i><h3>{h}</h3><p>{p}</p></article>)}
          </div>
        </section>

        <section className="contact" id="contact">
          <ContactInfo s={s} t={t.contact} eyebrow={t.contact.eyebrow} title={t.contact.title} />
          <ContactForm t={t.form} />
        </section>
      </main>
      <Footer hotline={s.hotline} t={t} />
    </>
  )
}
