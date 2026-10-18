'use client'
import { useEffect, useRef } from 'react'
import type { Dict } from '../i18n'

/** Full-screen cloud intro. Opens on button, wheel, swipe or key; adds body.open and unlocks scrolling. */
export function Intro({ t }: { t: Dict['intro'] }) {
  const opened = useRef(false)
  useEffect(() => {
    const b = document.body
    const open = () => {
      if (opened.current) return
      opened.current = true
      b.classList.add('open')
      setTimeout(() => b.classList.remove('locked'), 1800)
    }
    const key = (e: KeyboardEvent) => { if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) open() }
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) { b.classList.add('open'); opened.current = true; return }
    b.classList.add('locked')
    ;(window as unknown as { __openIntro?: () => void }).__openIntro = open
    addEventListener('wheel', open, { passive: true })
    addEventListener('touchmove', open, { passive: true })
    addEventListener('keydown', key)
    return () => { removeEventListener('wheel', open); removeEventListener('touchmove', open); removeEventListener('keydown', key) }
  }, [])
  const lines = [t.l1, t.l2, t.l3].filter(Boolean)
  return (
    <section className="intro" id="intro" aria-label="Introduction">
      <div className="cloud-layer c1" /><div className="cloud-layer c2" /><div className="cloud-layer c3" />
      <div className="intro-copy">
        <h1>{lines.map((l, i) => <span key={i}>{l}{i < lines.length - 1 && <br />}</span>)}</h1>
        <p>{t.text}</p>
        <button className="btn dark" id="enter" onClick={() => (window as unknown as { __openIntro?: () => void }).__openIntro?.()}>{t.enter}</button>
      </div>
      <span className="scroll-hint">{t.scroll}</span>
    </section>
  )
}
