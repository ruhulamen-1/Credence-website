'use client'
import type { Project } from '../lib/data'
import { resetFilters, useFilters } from '../lib/filterStore'
import { TowerGraphic } from './TowerGraphic'
import { href, fmt, type Dict, type Lang } from '../i18n'

function Card({ p, hidden, lang, t }: { p: Project; hidden: boolean; lang: Lang; t: Dict['grid'] }) {
  const uid = `c-${p.slug}`
  return (
    <article className="card reveal" hidden={hidden}>
      {p.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.image.url} alt={p.image.alt || p.name} loading="lazy" />
      ) : (
        <svg viewBox="0 0 300 375" role="img" aria-label={`${p.name} illustration`}>
          <defs>
            <linearGradient id={`${uid}s`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={`hsl(${p.hue} 70% 62%)`} /><stop offset="1" stopColor={`hsl(${p.hue} 60% 94%)`} />
            </linearGradient>
          </defs>
          <rect width="300" height="375" fill={`url(#${uid}s)`} />
          <svg x="60" y="28" width="158" height="337" viewBox="0 0 300 640"><TowerGraphic hue={p.hue} floors={12} uid={uid} /></svg>
          <rect y="300" width="300" height="75" fill="#fff" opacity=".55" />
        </svg>
      )}
      <div>
        <h3><a href={href(lang, `/projects/${p.slug}`)} className="stretch">{p.name}</a></h3>
        <p>{p.addr}</p>
        <span className="tag">{t.status[p.status as keyof Dict['grid']['status']] || p.status} · {t.type[p.type as keyof Dict['grid']['type']] || p.type}</span>
      </div>
    </article>
  )
}

export function ProjectGrid({ projects, lang, t }: { projects: Project[]; lang: Lang; t: Dict['grid'] }) {
  const f = useFilters()
  const ok = (p: Project) => (!f.type || p.type === f.type) && (!f.status || p.status === f.status) && (!f.loc || p.area === f.loc) && (!f.name || p.name === f.name)
  const n = projects.filter(ok).length
  return (
    <>
      <span id="count" className="count">{fmt(t.shown, { n }).replace('(s)', n === 1 ? '' : 's')}</span>
      <div className="grid" id="grid">
        {projects.map((p) => <Card key={p.slug} p={p} hidden={!ok(p)} lang={lang} t={t} />)}
      </div>
      <p className="none" id="none" hidden={n > 0}>{t.none} <button className="link" onClick={resetFilters}>{t.showAll}</button></p>
    </>
  )
}
