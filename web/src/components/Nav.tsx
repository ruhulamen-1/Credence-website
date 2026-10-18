'use client'
import { useEffect, useState } from 'react'

export function Nav({ cta = 'Enquire', ctaHref = '#contact' }: { cta?: string; ctaHref?: string }) {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const s = () => setSolid(scrollY > 60)
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    s(); addEventListener('scroll', s, { passive: true }); addEventListener('keydown', k)
    return () => { removeEventListener('scroll', s); removeEventListener('keydown', k) }
  }, [])
  return (
    <>
      <header className={`nav${solid ? ' solid' : ''}`} id="nav">
        <button className="menu-btn" id="menuBtn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}><span />Menu</button>
        <a className="logo" href="/" aria-label="Credence Housing Limited">CREDENCE<small>Housing Limited</small></a>
        <a className="nav-cta" href={ctaHref}>{cta}</a>
      </header>
      <nav className={`menu${open ? ' show' : ''}`} id="menu" aria-label="Main" onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)}>
        <a href="/#projects">Projects</a><a href="/#footprints">About</a><a href="/#why">Why Credence</a><a href={ctaHref.startsWith('#') ? ctaHref : '/#contact'}>Contact</a>
        <p>Hotline <strong>16769</strong></p>
      </nav>
    </>
  )
}
