import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import '../globals.css'
import { ClientScripts } from '../../../components/ClientScripts'
import { getSettings } from '../../../lib/data'
import { isLang, locales } from '../../../i18n'

export function generateStaticParams() { return locales.map((lang) => ({ lang })) }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const s = await getSettings(lang)
  return {
    metadataBase: new URL(s.siteUrl),
    title: { default: s.homeTitle, template: `%s | ${s.name}` },
    description: s.homeDescription,
    openGraph: { siteName: s.name, type: 'website', locale: lang === 'bn' ? 'bn_BD' : 'en_GB', images: s.ogImage ? [s.ogImage.url] : undefined },
  }
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const s = await getSettings(lang)
  // Public, non-secret settings read by /tracking.js
  const site = { hotline: s.hotline, whatsapp: s.whatsapp, consentRequired: s.consentRequired, tracking: s.tracking, formEndpoint: '' }
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
        {lang === 'bn' && <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600&family=Noto+Serif+Bengali:wght@400;500;600&display=swap" rel="stylesheet" />}
        <script dangerouslySetInnerHTML={{ __html: `window.SITE=${JSON.stringify(site).replace(/</g, '\\u003c')};` }} />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ClientScripts />
      </body>
    </html>
  )
}
