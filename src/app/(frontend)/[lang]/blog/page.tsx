import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { InnerHero } from '@/components/InnerHero'
import { PostCards } from '@/components/PostCards'
import { getPosts, getSettings } from '@/lib/data'
import { alternates } from '@/lib/meta'
import { getDict, href, isLang, navT } from '@/i18n'

type Props = { params: Promise<{ lang: string }>; searchParams?: Promise<{ kind?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return { title: getDict(lang).blog.title, alternates: alternates(lang, '/blog') }
}

export default async function BlogIndex({ params }: Props) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const t = getDict(lang)
  const [s, posts] = await Promise.all([getSettings(lang), getPosts(lang)])
  return (
    <>
      <Nav lang={lang} t={navT(t)} path={'/blog'} hotline={s.hotline} logo={s.logo?.url} />
      <InnerHero eyebrow={t.blog.eyebrow} title={t.blog.title} />
      <main>
        <section>
          <PostCards posts={posts} lang={lang} t={t.blog} grid={t.grid} backHref={href(lang, '/blog')} />
        </section>
      </main>
      <Footer lang={lang} t={t} />
    </>
  )
}
