'use client'
import type { FormEvent } from 'react'
import { setFilters, resetFilters, useFilters } from '../lib/filterStore'
import type { Dict } from '../i18n'

export function Finder({ t, areas, names }: { t: Dict['finder']; areas: string[]; names: string[] }) {
  const f = useFilters()
  const submit = (e: FormEvent) => {
    e.preventDefault()
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <form className="finder" id="finder" aria-label={t.title} onSubmit={submit}>
      <h3>{t.title}</h3>
      <div className="fields">
        <label>{t.lookingFor}
          <select value={f.type} onChange={(e) => setFilters({ type: e.target.value })}>
            <option value="">{t.anyType}</option><option value="Apartment">{t.apartment}</option><option value="Commercial">{t.commercial}</option>
          </select></label>
        <label>{t.status}
          <select value={f.status} onChange={(e) => setFilters({ status: e.target.value })}>
            <option value="">{t.anyStatus}</option><option value="Ongoing">{t.ongoing}</option><option value="Completed">{t.completed}</option><option value="Upcoming">{t.upcoming}</option>
          </select></label>
        <label>{t.location}
          <select value={f.loc} onChange={(e) => setFilters({ loc: e.target.value })}>
            <option value="">{t.allLocations}</option>{areas.map((a) => <option key={a}>{a}</option>)}
          </select></label>
        <label>{t.project}
          <select value={f.name} onChange={(e) => setFilters({ name: e.target.value })}>
            <option value="">{t.allProjects}</option>{names.map((n) => <option key={n}>{n}</option>)}
          </select></label>
      </div>
      <div className="finder-foot">
        <div className="chips" role="group" aria-label={t.filter}>
          <span>{t.filter}</span>
          {areas.slice(0, 3).map((c) => (
            <button type="button" key={c} className={f.loc === c ? 'on' : ''} onClick={() => setFilters({ loc: c })}>{c}</button>
          ))}
          <button type="button" onClick={resetFilters}>{t.reset}</button>
        </div>
        <button className="btn dark" type="submit">{t.search}</button>
      </div>
    </form>
  )
}
