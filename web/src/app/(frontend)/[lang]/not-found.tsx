import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { getSettings } from '@/lib/data'
import { getDict, navT } from '@/i18n'

/** Bilingual 404 (kept free of request headers so the pages stay statically generated). */
export default async function NotFound() {
  const en = getDict('en'), bn = getDict('bn')
  const s = await getSettings('en')
  return (
    <>
      <Nav lang="en" t={navT(en)} path="/" hotline={s.hotline} />
      <main className="notfound">
        <h1>{en.notFound.title}</h1>
        <p>{en.notFound.text}</p>
        <p><a className="btn dark" href="/">{en.notFound.home}</a></p>
        <h2 style={{ marginTop: 28 }}>{bn.notFound.title}</h2>
        <p>{bn.notFound.text}</p>
        <p><a className="btn dark" href="/bn">{bn.notFound.home}</a></p>
      </main>
      <Footer hotline={s.hotline} t={en} />
    </>
  )
}
