import type { Settings } from '../lib/data'

export function ContactInfo({ s, eyebrow, title }: { s: Settings; eyebrow: string; title: string }) {
  return (
    <div className="contact-info reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <dl>
        {s.address && (<><dt>Corporate Office</dt><dd>{s.address}</dd></>)}
        {s.phones.length > 0 && (<><dt>General enquiry</dt><dd>{s.phones.map((n, i) => <span key={n}>{i > 0 && ' · '}<a href={`tel:${n}`}>{n}</a></span>)}</dd></>)}
        {s.hotline && (<><dt>Hotline</dt><dd><a href={`tel:${s.hotline}`}>{s.hotline}</a></dd></>)}
        {s.email && (<><dt>Email</dt><dd><a href={`mailto:${s.email}`}>{s.email}</a></dd></>)}
      </dl>
    </div>
  )
}
