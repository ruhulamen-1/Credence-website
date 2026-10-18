import type { Metadata } from 'next'
import { Tower } from '../../components/TowerGraphic'
import { Intro } from '../../components/Intro'
import { Nav } from '../../components/Nav'
import { Finder } from '../../components/Finder'
import { ProjectGrid } from '../../components/ProjectGrid'
import { ContactForm } from '../../components/ContactForm'
import { ContactInfo } from '../../components/ContactInfo'
import { Footer } from '../../components/Footer'
import { getProjects, getSettings } from '../../lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return { title: { absolute: s.homeTitle }, description: s.homeDescription, alternates: { canonical: '/' } }
}

export default async function Home() {
  const [projects, s] = await Promise.all([getProjects(), getSettings()])
  const areas = [...new Set(projects.map((p) => p.area))]
  const ld = {
    '@context': 'https://schema.org', '@type': 'RealEstateAgent', name: s.name, url: s.siteUrl, telephone: s.phones[0], email: s.email,
    address: { '@type': 'PostalAddress', streetAddress: s.address, addressLocality: 'Dhaka', addressCountry: 'BD' },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <Intro />
      <Nav />
      <main id="top">
        <section className="hero" id="hero">
          <div className="sky" />
          <div className="hero-copy">
            <h2>Live Above<br />The Ordinary</h2>
            <p>Discover exceptional residences where iconic architecture meets elevated living. Experience breathtaking views, timeless design, and a new standard of luxury.</p>
            <p className="from">Residences in Dhaka’s finest neighbourhoods<br /><strong>Banani · Gulshan · Dhanmondi</strong></p>
          </div>
          <div className="tower-wrap"><Tower id="tower" hue={208} floors={16} uid="hero" /></div>
          <div className="mist" />
          <Finder areas={areas} names={projects.map((p) => p.name)} />
        </section>

        <section className="lead reveal">
          <p className="eyebrow">Deluxe Abodes Redefining Sophistication</p>
          <p className="big">Dive into the classy world of architecture reflecting top‑notch design, quality and engineering. Credence’s exclusive apartments are fit to earn you a delightful life full of comfort, class and style.</p>
        </section>

        <section className="projects" id="projects">
          <div className="sec-head reveal"><p className="eyebrow">Featured Projects</p><h2>Homes with a view</h2></div>
          <ProjectGrid projects={projects} />
        </section>

        <section className="footprints" id="footprints">
          <div className="sec-head reveal"><p className="eyebrow">Footprints</p><h2>Built across Dhaka’s finest addresses</h2></div>
          <div className="stats reveal">
            <div><b data-n="50">50</b><sup>+</sup><span>Completed projects</span></div>
            <div><b data-n="700">700</b><sup>+</sup><span>Homes handed over</span></div>
            <div><b data-n="18">18</b><sup>+</sup><span>Neighbourhoods</span></div>
          </div>
          <p className="body reveal">Credence Housing Limited has an illustrious history of delivering exceptional property developments throughout Dhaka — from Banani, Gulshan, Dhanmondi and Lalmatia to Kalabagan, Khilgaon, Shyamoli, Uttara and Mohammadpur, including Adabor, Green Road, North Road, Humayun Road, Babar Road, Tejgaon, Badda, Siddheswari and Mirpur.</p>
          <p className="body reveal">We take immense pride in delivering projects with precision and on time, while upholding the highest standards of quality. Timely handovers, top‑notch quality and satisfied clients are at the heart of our success story.</p>
        </section>

        <section className="why" id="why">
          <div className="sec-head reveal"><p className="eyebrow">Why Credence</p><h2>The best real estate company in Dhaka, Bangladesh</h2></div>
          <div className="cards">
            <article className="reveal"><i>01</i><h3>Quality you can trust</h3><p>Strict standards from materials and structure to finishing and quality control — homes built safe, durable and comfortable for years.</p></article>
            <article className="reveal"><i>02</i><h3>On‑time delivery</h3><p>Careful planning, construction management and timely execution, so you can plan your future without uncertainty.</p></article>
            <article className="reveal"><i>03</i><h3>Thoughtful design</h3><p>Natural light, ventilation, space utilisation and everyday function — designed to look good and live better.</p></article>
            <article className="reveal"><i>04</i><h3>Built with responsibility</h3><p>Every project considers location, planning, standards and surroundings — from first plan to handover.</p></article>
          </div>
        </section>

        <section className="contact" id="contact">
          <ContactInfo s={s} eyebrow="Get in touch" title="Book a free session with our expert counsellors" />
          <ContactForm thanks="Thank you — our counsellor will call you shortly." />
        </section>
      </main>
      <Footer hotline={s.hotline} />
    </>
  )
}
