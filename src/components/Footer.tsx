import { getProjects, getSettings } from '../lib/data'
import { href, type Dict, type Lang } from '../i18n'

const SOCIAL: Record<string, string> = { facebook: 'f', x: '𝕏', instagram: 'ig', youtube: '▶', linkedin: 'in', tiktok: 'tk' }

export async function Footer({ lang, t }: { lang: Lang; t: Dict }) {
  const [s, projects] = await Promise.all([getSettings(lang), getProjects(lang)])
  const logo = s.footerLogo || s.logo
  const h = (p: string) => href(lang, p)
  const links: [string, string][] = [
    [t.nav.about, '/about'], [t.nav.blog, '/blog'], [t.nav.careers, '/careers'],
    [t.nav.landowner, '/landowner'], [t.nav.buyer, '/buyer'], [t.nav.contact, '/#contact'],
  ]
  return (
    <footer>
      <div className="foot-grid">
        <div className="foot-brand">
          {logo
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={logo.url} alt={logo.alt || s.name} className="foot-logo" />
            : <div className="wordmark-sm">CREDENCE</div>}
          {s.tagline && <p className="foot-tag">{s.tagline}</p>}
          <dl className="foot-offices">
            {s.offices.map((o) => (<div key={o.label + o.address}><dt>{o.label}</dt><dd>{o.address}</dd></div>))}
            {s.phones.length > 0 && <div><dt>{t.footer.enquiry}</dt><dd>{s.phones.map((n, i) => <span key={n}>{i > 0 && ', '}<a href={`tel:${n}`}>{n}</a></span>)}</dd></div>}
            {s.email && <div><dt>{t.footer.email}</dt><dd><a href={`mailto:${s.email}`}>{s.email}</a></dd></div>}
          </dl>
        </div>
        <div className="foot-col">
          <h4>{t.footer.navigation}</h4>
          {links.map(([l, p]) => <a key={p} href={h(p)}>{l}</a>)}
        </div>
        <div className="foot-col">
          <h4>{t.footer.projects}</h4>
          {projects.slice(0, 5).map((p) => <a key={p.slug} href={h(`/projects/${p.slug}`)}>{p.name}</a>)}
          <a href={h('/#projects')}>{t.footer.seeMore}</a>
        </div>
        <div className="foot-col">
          {s.hotline && (<><h4>{t.footer.hotline}</h4><a className="foot-hot" href={`tel:${s.hotline}`}>{s.hotline}</a></>)}
          {s.socials.length > 0 && (<>
            <h4>{t.footer.social}</h4>
            <div className="foot-social">{s.socials.map((x) => <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer" aria-label={x.platform}>{SOCIAL[x.platform] || x.platform}</a>)}</div>
          </>)}
        </div>
      </div>
      <div className="foot-row">
        <div>{s.copyright || `${s.name} © ${new Date().getFullYear()}`}</div>
        {s.credit && <div>{s.credit}</div>}
      </div>
    </footer>
  )
}
