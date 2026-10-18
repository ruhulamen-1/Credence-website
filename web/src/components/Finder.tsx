'use client'
import type { FormEvent } from 'react'
import { setFilters, resetFilters, useFilters } from '../lib/filterStore'

export function Finder({ areas, names }: { areas: string[]; names: string[] }) {
  const f = useFilters()
  const submit = (e: FormEvent) => {
    e.preventDefault()
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <form className="finder" id="finder" aria-label="Find your property" onSubmit={submit}>
      <h3>Find the best place</h3>
      <div className="fields">
        <label>Looking for
          <select value={f.type} onChange={(e) => setFilters({ type: e.target.value })}>
            <option value="">Any type</option><option>Apartment</option><option>Commercial</option>
          </select></label>
        <label>Status
          <select value={f.status} onChange={(e) => setFilters({ status: e.target.value })}>
            <option value="">Any status</option><option>Ongoing</option><option>Completed</option><option>Upcoming</option>
          </select></label>
        <label>Location
          <select value={f.loc} onChange={(e) => setFilters({ loc: e.target.value })}>
            <option value="">All locations</option>{areas.map((a) => <option key={a}>{a}</option>)}
          </select></label>
        <label>Project
          <select value={f.name} onChange={(e) => setFilters({ name: e.target.value })}>
            <option value="">All projects</option>{names.map((n) => <option key={n}>{n}</option>)}
          </select></label>
      </div>
      <div className="finder-foot">
        <div className="chips" role="group" aria-label="Quick filter">
          <span>Filter:</span>
          {['Dhanmondi', 'Banani', 'Gulshan'].map((c) => (
            <button type="button" key={c} className={f.loc === c ? 'on' : ''} onClick={() => setFilters({ loc: c })}>{c}</button>
          ))}
          <button type="button" onClick={resetFilters}>Reset</button>
        </div>
        <button className="btn dark" type="submit">Search Properties</button>
      </div>
    </form>
  )
}
