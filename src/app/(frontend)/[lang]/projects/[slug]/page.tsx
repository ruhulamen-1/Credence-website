import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Tower } from '../../../../../components/TowerGraphic'
import { Nav } from '../../../../../components/Nav'
import { ContactForm } from '../../../../../components/ContactForm'
import { ContactInfo } from '../../../../../components/ContactInfo'
import { Footer } from '../../../../../components/Footer'
import { getProject, getProjects, getSettings } from '../../../../../lib/data'
import { alternates } from '../../../../../lib/meta'
import { fmt, getDict, href, isLang, locales, type Lang, navT } from '../../../../../i18n'

type Props = { params: Promise<{ lang: string; slug: string }> }

export async function generateStaticParams() {
  try {
    const out: { lang: string; slug: string }[] = []
    for (const lang of locales) for (const p of await getProjects(lang)) out.push({ lang, slug: p.slug })
    return out
  } catch { return [] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: l, slug } = await params
  if (!isLang(l)) return {}
  const [p, s] = await Promise.all([getProject(slug, l), getSettings(l)])
  if (!p) return {}
  const title = p.seoTitle || `${p.name} — ${p.area}, Dhaka`
  const description = p.seoDescription || `${p.name} — ${p.status} ${p.type}, ${p.area}, Dhaka. ${p.addr}.`
  const og = p.ogImage || p.image || s.ogImage
  return { title: { absolute: p.seoTitle ? title : `${title} | ${s.name}` }, description, alternates: alternates(l, `/projects/${p.slug}`), openGraph: { title, description, images: og ? [og.url] : undefined } }
}

export default async function ProjectPage({ params }: Props) {
  const { lang: l, slug } = await params
  if (!isLang(l)) notFound()
  const lang: Lang = l
  const t = getDict(lang)
  const [p, s] = await Promise.all([getProject(slug, lang), getSettings(lang)])
  if (!p) notFound()
  const tagline = p.tagline || fmt(t.project.taglineDefault, { type: t.grid.type[p.type as keyof typeof t.grid.type] || p.type, area: p.area })
  const ld = {
    '@context': 'https://schema.org', '@type': 'ApartmentComplex', name: p.name, url: `${s.siteUrl}${href(lang, `/projects/${p.slug}`)}`,
    address: { '@type': 'PostalAddress', streetAddress: p.addr, addressLocality: 'Dhaka', addressCountry: 'BD' },
    brand: { '@type': 'Organization', name: s.name },
  }
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "document.body.classList.add('open')" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <Nav lang={lang} t={navT(t)} path={`/projects/${slug}`} hotline={s.hotline} cta={t.nav.interested} ctaHref="#interest" />
      <main>
        <section className="hero phero">
          <div className="hero-copy">
            <p className="crumbs"><a href={href(lang, '/')}>{t.project.home}</a> / <a href={href(lang, '/#projects')}>{t.project.projects}</a> / {p.name}</p>
            <h1 className="ph">{p.name}</h1>
            <p>{tagline}</p>
            <span className="badge">{p.addr}</span>
            {p.brochure && <a className="btn dark dl" href={p.brochure} download>{t.project.brochure}</a>}
          </div>
          {p.image
            // eslint-disable-next-line @next/next/no-img-element
            ? <div className="photo-wrap"><img src={p.image.url} alt={p.image.alt || p.name} /></div>
            : <div className="tower-wrap"><Tower id="tower" hue={p.hue} floors={p.floors + 2} uid="p" /></div>}
          <div className="mist" />
          {p.facts.length > 0 && <div className="facts">{p.facts.map((f, i) => <div key={i}><b>{f.v}</b><span>{f.l}</span></div>)}</div>}
        </section>

        <section className="story">
          <div className="reveal"><p className="eyebrow">{p.story.length ? t.project.story : t.project.about}</p><h2 style={{ fontSize: 'clamp(32px,4.5vw,52px)' }}>{p.storyTitle || p.name}</h2></div>
          <div className="reveal">
            {p.story.length ? p.story.map((x, i) => <p key={i}>{x}</p>) : <p>{fmt(t.project.soon, { name: p.name })}</p>}
          </div>
        </section>

        {p.spec.length > 0 && (
          <section className="spec-sec">
            <div className="sec-head reveal"><p className="eyebrow">{t.project.spec}</p><h2>{t.project.glance}</h2></div>
            <table className="spec reveal"><tbody>{p.spec.map((r, i) => <tr key={i}><th scope="row">{r.k}</th><td>{r.v}</td></tr>)}</tbody></table>
          </section>
        )}

        {p.gallery.length > 0 && (
          <section>
            <div className="sec-head reveal"><p className="eyebrow">{t.project.gallery}</p><h2>{fmt(t.project.see, { name: p.name })}</h2></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="gallery reveal">{p.gallery.map((g, i) => <img key={i} src={g.url} alt={g.alt || p.name} loading="lazy" />)}</div>
          </section>
        )}

        <section>
          <div className="sec-head reveal"><p className="eyebrow">{t.project.location}</p><h2>{p.area}, Dhaka</h2></div>
          <iframe className="map reveal" title={`Map — ${p.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(p.mapQuery || p.addr)}&z=16&output=embed`} />
          <a className="back" href={href(lang, '/#projects')}>{t.project.all}</a>
        </section>

        <section className="contact" id="interest">
          <ContactInfo s={s} t={t.contact} eyebrow={t.project.interested} title={fmt(t.project.own, { name: p.name })} />
          <ContactForm t={t.form} project={p.slug} button={t.form.sendEnquiry} thanks={t.form.thanksTeam} messageRequired={false} />
        </section>
      </main>
      <Footer hotline={s.hotline} t={t} />
    </>
  )
}
