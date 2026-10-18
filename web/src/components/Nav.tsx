'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { href, type Dict, type Lang } from '../i18n'

export function Nav({ lang, t, hotline, cta, ctaHref = '#contact' }: { lang: Lang; t: Pick<Dict, 'nav' | 'switchTo'>; hotline: string; cta?: string; ctaHref?: string }) {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const pathname = usePathname() || '/'
  useEffect(() => {
    const s = () => setSolid(scrollY > 60)
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    s(); addEventListener('scroll', s, { passive: true }); addEventListener('keydown', k)
    return () => { removeEventListener('scroll', s); removeEventListener('keydown', k) }
  }, [])
  // Same page in the other language
  const bare = pathname === '/bn' ? '/' : pathname.startsWith('/bn/') ? pathname.slice(3) : pathname
  const other: Lang = lang === 'bn' ? 'en' : 'bn'
  const h = (p: string) => href(lang, p)
  const anchor = ctaHref.startsWith('#') ? ctaHref : h(ctaHref)
  const contact = ctaHref.startsWith('#') ? ctaHref : h('/#contact')
  return (
    <>
      <header className={`nav${solid ? ' solid' : ''}`} id="nav">
        <button className="menu-btn" id="menuBtn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}><span />{t.nav.menu}</button>
        <a className="logo" href={h('/')} aria-label="Credence Housing Limited">CREDENCE<small>Housing Limited</small></a>
        <a className="nav-cta" href={anchor}>{cta || t.nav.enquire}</a>
      </header>
      <nav className={`menu${open ? ' show' : ''}`} id="menu" aria-label="Main" onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)}>
        <a href={h('/#projects')}>{t.nav.projects}</a>
        <a href={h('/about')}>{t.nav.about}</a>
        <a href={h('/blog')}>{t.nav.blog}</a>
        <a href={h('/careers')}>{t.nav.careers}</a>
        <a href={h('/landowner')}>{t.nav.landowner}</a>
        <a href={h('/buyer')}>{t.nav.buyer}</a>
        <a href={contact}>{t.nav.contact}</a>
        <a className="lang" href={href(other, bare)} hrefLang={other}>{t.switchTo}</a>
        <p>{t.nav.hotline} <strong>{hotline}</strong></p>
      </nav>
    </>
  )
}
