'use client'
import { useEffect } from 'react'

/** Loads the scroll-effect scripts after React has hydrated (so they never fight hydration), in order, once per page load. */
export function ClientScripts() {
  useEffect(() => {
    const w = window as unknown as { __cs?: boolean }
    if (w.__cs) return
    w.__cs = true
    const load = (src: string) => new Promise<void>((res) => {
      const s = document.createElement('script'); s.src = src; s.onload = () => res(); s.onerror = () => res(); document.body.appendChild(s)
    })
    ;(async () => { for (const s of ['/tracking.js', '/effects.js', '/motion.js', '/smooth.js']) await load(s) })()
  }, [])
  return null
}
