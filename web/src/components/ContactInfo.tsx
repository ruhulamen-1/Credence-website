import type { Settings } from '../lib/data'
import type { Dict } from '../i18n'

export function ContactInfo({ s, t, eyebrow, title }: { s: Settings; t: Dict['contact']; eyebrow: string; title: string }) {
  return (
    <div className="contact-info reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <dl>
        {s.address && (<><dt>{t.office}</dt><dd>{s.address}</dd></>)}
        {s.phones.length > 0 && (<><dt>{t.phones}</dt><dd>{s.phones.map((n, i) => <span key={n}>{i > 0 && ' · '}<a href={`tel:${n}`}>{n}</a></span>)}</dd></>)}
        {s.hotline && (<><dt>{t.hotline}</dt><dd><a href={`tel:${s.hotline}`}>{s.hotline}</a></dd></>)}
        {s.email && (<><dt>{t.email}</dt><dd><a href={`mailto:${s.email}`}>{s.email}</a></dd></>)}
      </dl>
    </div>
  )
}
