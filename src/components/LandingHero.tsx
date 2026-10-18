'use client'
import { useEffect, useState } from 'react'
import { ContactForm } from './ContactForm'
import type { Dict } from '../i18n'
import type { Landing } from '../lib/data'

/** Campaign page body with an optional 50/50 A/B test (remembered per visitor in localStorage). */
export function LandingHero({ p, t, tf }: { p: Landing; t: Dict['lp']; tf: Dict['form'] }) {
  const [v, setV] = useState<'A' | 'B'>('A')
  useEffect(() => {
    if (!p.abTest) return
    let pick: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B'
    try {
      const k = `ab_${p.slug}`
      const saved = localStorage.getItem(k)
      if (saved === 'A' || saved === 'B') pick = saved
      else localStorage.setItem(k, pick)
    } catch { /* storage blocked: keep random pick */ }
    setV(pick)
    ;(window as unknown as { track?: (n: string, o?: object) => void }).track?.('ab_view', { campaign: p.title, variant: pick })
  }, [p.abTest, p.slug, p.title])
  const headline = v === 'B' && p.headlineB ? p.headlineB : p.headline
  const button = v === 'B' && p.buttonTextB ? p.buttonTextB : p.buttonText || tf.send
  return (
    <div className="lp-grid">
      <div className="lp-copy">
        <h1 className="ph lp-h">{headline}</h1>
        {p.subheading && <p className="lp-sub">{p.subheading}</p>}
        {p.bullets.length > 0 && <ul className="lp-bullets">{p.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>}
        {p.phone && <a className="btn dark" href={`tel:${p.phone}`}>{t.call} {p.phone}</a>}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p.image && <img className="lp-img" src={p.image.url} alt={p.image.alt} />}
      </div>
      <ContactForm t={tf} button={button} kind="campaign" campaign={p.title} variant={p.abTest ? v : undefined} project={p.project || undefined} messageRequired={false} />
    </div>
  )
}
