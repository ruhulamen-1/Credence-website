import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Tower } from '../../../../components/TowerGraphic'
import { Nav } from '../../../../components/Nav'
import { ContactForm } from '../../../../components/ContactForm'
import { ContactInfo } from '../../../../components/ContactInfo'
import { Footer } from '../../../../components/Footer'
import { getProject, getProjects, getSettings } from '../../../../lib/data'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try { return (await getProjects()).map((p) => ({ slug: p.slug })) } catch { return [] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [p, s] = await Promise.all([getProject(slug), getSettings()])
  if (!p) return {}
  const title = p.seoTitle || `${p.name} — ${p.area}, Dhaka`
  const description = p.seoDescription || `${p.name} by ${s.name} — ${p.status.toLowerCase()} ${p.type.toLowerCase()} project in ${p.area}, Dhaka. ${p.addr}.`
  const og = p.ogImage || p.image || s.ogImage
  return { title: { absolute: p.seoTitle ? title : `${title} | ${s.name}` }, description, alternates: { canonical: `/projects/${p.slug}` }, openGraph: { title, description, images: og ? [og.url] : undefined } }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const [p, s] = await Promise.all([getProject(slug), getSettings()])
  if (!p) notFound()
  const tagline = p.tagline || `A Credence ${p.type.toLowerCase()} residence in ${p.area}, Dhaka.`
  const ld = {
    '@context': 'https://schema.org', '@type': 'ApartmentComplex', name: p.name, url: `${s.siteUrl}/projects/${p.slug}`,
    address: { '@type': 'PostalAddress', streetAddress: p.addr, addressLocality: 'Dhaka', addressCountry: 'BD' },
    brand: { '@type': 'Organization', name: s.name },
  }
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "document.body.classList.add('open')" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <Nav cta="I’m interested" ctaHref="#interest" />
      <main>
        <section className="hero phero">
          <div className="hero-copy">
            <p className="crumbs"><a href="/">Home</a> / <a href="/#projects">Projects</a> / {p.name}</p>
            <h1 className="ph">{p.name}</h1>
            <p>{tagline}</p>
            <span className="badge">{p.addr}</span>
            {p.brochure && <a className="btn dark dl" href={p.brochure} download>Download brochure</a>}
          </div>
          {p.image
            // eslint-disable-next-line @next/next/no-img-element
            ? <div className="photo-wrap"><img src={p.image.url} alt={p.image.alt || p.name} /></div>
            : <div className="tower-wrap"><Tower id="tower" hue={p.hue} floors={p.floors + 2} uid="p" /></div>}
          <div className="mist" />
          {p.facts.length > 0 && <div className="facts">{p.facts.map((f, i) => <div key={i}><b>{f.v}</b><span>{f.l}</span></div>)}</div>}
        </section>

        <section className="story">
          <div className="reveal"><p className="eyebrow">{p.story.length ? 'Behind the story' : 'About'}</p><h2 style={{ fontSize: 'clamp(32px,4.5vw,52px)' }}>{p.storyTitle || p.name}</h2></div>
          <div className="reveal">
            {p.story.length
              ? p.story.map((t, i) => <p key={i}>{t}</p>)
              : <p>Full project details, floor plans and specifications for {p.name} are being prepared. Talk to our counsellors for the latest availability and pricing.</p>}
          </div>
        </section>

        {p.spec.length > 0 && (
          <section className="spec-sec">
            <div className="sec-head reveal"><p className="eyebrow">Specification</p><h2>Project at a glance</h2></div>
            <table className="spec reveal"><tbody>{p.spec.map((r, i) => <tr key={i}><th scope="row">{r.k}</th><td>{r.v}</td></tr>)}</tbody></table>
          </section>
        )}

        {p.gallery.length > 0 && (
          <section>
            <div className="sec-head reveal"><p className="eyebrow">Gallery</p><h2>See {p.name}</h2></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="gallery reveal">{p.gallery.map((g, i) => <img key={i} src={g.url} alt={g.alt || p.name} loading="lazy" />)}</div>
          </section>
        )}

        <section>
          <div className="sec-head reveal"><p className="eyebrow">Location</p><h2>{p.area}, Dhaka</h2></div>
          <iframe className="map reveal" title={`Map of ${p.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(p.mapQuery || p.addr)}&z=16&output=embed`} />
          <a className="back" href="/#projects">← All projects</a>
        </section>

        <section className="contact" id="interest">
          <ContactInfo s={s} eyebrow="I am interested" title={`Own a home at ${p.name}`} />
          <ContactForm project={p.slug} button="Send enquiry" messageRequired={false} />
        </section>
      </main>
      <Footer hotline={s.hotline} />
    </>
  )
}
