import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { InnerHero } from '@/components/InnerHero'
import { Rich } from '@/components/Rich'
import { getPost, getPosts, getSettings } from '@/lib/data'
import { alternates } from '@/lib/meta'
import { dateLocale, fmt, getDict, href, isLang, locales, navT } from '@/i18n'

type Props = { params: Promise<{ lang: string; slug: string }> }

export async function generateStaticParams() {
  try {
    const out: { lang: string; slug: string }[] = []
    for (const lang of locales) for (const p of await getPosts(lang)) out.push({ lang, slug: p.slug })
    return out
  } catch { return [] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLang(lang)) return {}
  const post = await getPost(slug, lang)
  if (!post) return {}
  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt
  return { title, description, alternates: alternates(lang, `/blog/${slug}`), openGraph: { title, description, type: 'article', images: post.cover ? [post.cover.url] : undefined } }
}

export default async function PostPage({ params }: Props) {
  const { lang, slug } = await params
  if (!isLang(lang)) notFound()
  const t = getDict(lang)
  const [post, s] = await Promise.all([getPost(slug, lang), getSettings(lang)])
  if (!post) notFound()
  const fmtDate = (d: string) => new Date(d).toLocaleDateString(dateLocale(lang), { year: 'numeric', month: 'long', day: 'numeric' })
  const ld = {
    '@context': 'https://schema.org', '@type': post.kind === 'event' ? 'Event' : 'Article', headline: post.title, name: post.title, description: post.excerpt,
    datePublished: post.publishedAt || undefined, startDate: post.eventDate || undefined, image: post.cover?.url, author: post.author ? { '@type': 'Person', name: post.author } : undefined,
    publisher: { '@type': 'Organization', name: s.name }, location: post.eventLocation || undefined,
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <Nav lang={lang} t={navT(t)} path={`/blog/${slug}`} hotline={s.hotline} />
      <InnerHero eyebrow={t.blog[post.kind === 'event' ? 'events' : post.kind === 'news' ? 'news' : 'blog']} title={post.title}
        crumbs={<><a href={href(lang, '/')}>{t.project.home}</a> / <a href={href(lang, '/blog')}>{t.blog.title}</a></>}>
        {post.excerpt && <p>{post.excerpt}</p>}
      </InnerHero>
      <main>
        <section>
          <article className="article">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {post.cover && <img className="cover" src={post.cover.url} alt={post.cover.alt || post.title} />}
            <div className="facts-inline">
              {post.publishedAt && <span><b>{t.blog.news}</b>{fmtDate(post.publishedAt)}</span>}
              {post.author && <span><b>·</b>{fmt(t.blog.by, { name: post.author })}</span>}
              {post.kind === 'event' && post.eventDate && <span><b>{t.blog.when}</b>{fmtDate(post.eventDate)}</span>}
              {post.kind === 'event' && post.eventLocation && <span><b>{t.blog.where}</b>{post.eventLocation}</span>}
              {post.related && <span><b>{t.blog.related}</b><a href={href(lang, `/projects/${post.related.slug}`)}>{post.related.name}</a></span>}
            </div>
            <Rich data={post.body} />
            <p style={{ marginTop: 40 }}><a className="back" href={href(lang, '/blog')}>{t.blog.back}</a></p>
          </article>
        </section>
      </main>
      <Footer hotline={s.hotline} t={t} />
    </>
  )
}
