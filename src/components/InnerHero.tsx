import type { ReactNode } from 'react'

/** Sky header used by the inner pages (blog, about, careers, …). Same look as the project hero, without the tower. */
export function InnerHero({ eyebrow, title, children, crumbs }: { eyebrow?: string; title: string; children?: ReactNode; crumbs?: ReactNode }) {
  return (
    <section className="inner-hero">
      <div className="hero-copy">
        {crumbs && <p className="crumbs">{crumbs}</p>}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="ph">{title}</h1>
        {children}
      </div>
      <div className="mist" />
    </section>
  )
}
