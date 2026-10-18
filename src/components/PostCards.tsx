'use client'
import { useState } from 'react'
import type { Post } from '../lib/data'
import { dateLocale, href, type Dict, type Lang } from '../i18n'

/** Blog / news / events list with kind tabs (client-side filter, no reload). */
export function PostCards({ posts, lang, t }: { posts: Post[]; lang: Lang; t: Dict['blog']; grid?: Dict['grid']; backHref?: string }) {
  const [kind, setKind] = useState<'all' | 'blog' | 'news' | 'event'>('all')
  const shown = posts.filter((p) => kind === 'all' || p.kind === kind)
  const tabs: ['all' | 'blog' | 'news' | 'event', string][] = [['all', t.all], ['blog', t.blog], ['news', t.news], ['event', t.events]]
  return (
    <>
      <div className="tabs" role="tablist">
        {tabs.map(([k, label]) => <a key={k} href="#" role="tab" aria-selected={kind === k} className={kind === k ? 'on' : ''} onClick={(e) => { e.preventDefault(); setKind(k) }}>{label}</a>)}
      </div>
      {shown.length === 0 ? <p className="none">{t.empty}</p> : (
        <div className="posts">
          {shown.map((p) => (
            <article className="post" key={p.slug}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.cover ? <img src={p.cover.url} alt={p.cover.alt || p.title} loading="lazy" /> : <div className="ph-empty" />}
              <div className="b">
                <span className="meta">{p.kind === 'event' ? t.events : p.kind === 'news' ? t.news : t.blog}{p.publishedAt ? ` · ${new Date(p.publishedAt).toLocaleDateString(dateLocale(lang), { year: 'numeric', month: 'short', day: 'numeric' })}` : ''}</span>
                <h3><a className="stretch" href={href(lang, `/blog/${p.slug}`)}>{p.title}</a></h3>
                {p.excerpt && <p>{p.excerpt}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
