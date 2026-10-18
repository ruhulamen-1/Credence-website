import type { GlobalConfig } from 'payload'
import { anyone, canEditContent } from '../access'
import { refreshSite } from '../lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings, SEO & tracking',
  admin: { group: 'Content' },
  access: { read: anyone, update: canEditContent },
  hooks: { afterChange: [({ doc }) => { refreshSite(); return doc }] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Company', fields: [
          { name: 'name', type: 'text', required: true, defaultValue: 'Credence Housing Limited' },
          { name: 'address', type: 'text', localized: true },
          { name: 'email', type: 'email' },
          { name: 'hotline', type: 'text' },
          { name: 'phones', type: 'array', fields: [{ name: 'number', type: 'text', required: true }] },
          { name: 'whatsapp', type: 'text', admin: { description: 'e.g. 8801711292443 — shows a floating WhatsApp button' } },
        ] },
        { label: 'SEO', fields: [
          { name: 'siteUrl', type: 'text', required: true, defaultValue: 'http://localhost:3000', admin: { description: 'Public URL, no trailing slash' } },
          { name: 'homeTitle', type: 'text', localized: true },
          { name: 'homeDescription', type: 'textarea', localized: true },
          { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Default social share image' },
        ] },
        { label: 'Tracking', fields: [
          { name: 'consentRequired', type: 'checkbox', defaultValue: true, label: 'Ask cookie consent before tracking' },
          { name: 'tracking', type: 'group', fields: [
            { name: 'gtm', type: 'text', label: 'Google Tag Manager (GTM-XXXXXXX)' },
            { name: 'ga4', type: 'text', label: 'Google Analytics 4 (G-XXXXXXXXXX) — used only if no GTM' },
            { name: 'metaPixel', type: 'text', label: 'Meta (Facebook) Pixel ID' },
            { name: 'tiktokPixel', type: 'text', label: 'TikTok Pixel ID' },
          ] },
        ] },
        { label: 'Leads', fields: [
          { name: 'notifyEmail', type: 'email', admin: { description: 'Reserved: address that should receive new-lead alerts (connect Resend/Brevo in /api/leads)' } },
        ] },
      ],
    },
  ],
}
