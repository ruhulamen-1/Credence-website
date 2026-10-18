import type { Metadata } from 'next'
import './globals.css'
import { ClientScripts } from '../../components/ClientScripts'
import { getSettings } from '../../lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    metadataBase: new URL(s.siteUrl),
    title: { default: s.homeTitle, template: `%s | ${s.name}` },
    description: s.homeDescription,
    openGraph: { siteName: s.name, type: 'website', images: s.ogImage ? [s.ogImage.url] : undefined },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings()
  // Public, non-secret settings read by /tracking.js
  const site = { hotline: s.hotline, whatsapp: s.whatsapp, consentRequired: s.consentRequired, tracking: s.tracking, formEndpoint: '' }
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `window.SITE=${JSON.stringify(site).replace(/</g, '\\u003c')};` }} />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ClientScripts />
      </body>
    </html>
  )
}
