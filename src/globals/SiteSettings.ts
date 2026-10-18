import type { GlobalConfig } from 'payload'
import { anyone, canEditContent } from '../access'
import { requiredInEnglish } from '../validators'
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
        { label: 'Branding & footer', fields: [
          { name: 'logo', type: 'upload', relationTo: 'media', label: 'Company logo (header)', admin: { description: 'PNG/SVG/WebP, transparent background, about 400px wide. Leave empty to show the text logo.' } },
          { name: 'footerLogo', type: 'upload', relationTo: 'media', label: 'Footer logo (optional)', admin: { description: 'Used on the dark footer. If empty, the header logo is used.' } },
          { name: 'tagline', type: 'text', localized: true, admin: { description: 'e.g. for the inspired lifestyles' } },
          { name: 'offices', type: 'array', label: 'Offices shown in footer', fields: [
            { name: 'label', type: 'text', localized: true, required: true, validate: requiredInEnglish, admin: { description: 'e.g. Corporate Office' } },
            { name: 'address', type: 'text', localized: true, required: true, validate: requiredInEnglish },
          ] },
          { name: 'socials', type: 'array', label: 'Social links', fields: [
            { name: 'platform', type: 'select', required: true, options: ['facebook', 'x', 'instagram', 'youtube', 'linkedin', 'tiktok'] },
            { name: 'url', type: 'text', required: true },
          ] },
          { name: 'copyright', type: 'text', localized: true, admin: { description: 'e.g. Credence Housing Ltd. © copyright 2026. Empty = automatic.' } },
          { name: 'credit', type: 'text', localized: true, admin: { description: 'e.g. Designed & Developed by …' } },
        ] },
        { label: 'Home page', fields: [
          { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Home hero photo (replaces the illustrated tower)', admin: { description: 'Best: landscape or portrait building photo, at least 1200px wide, under ~400 KB. Leave empty to keep the illustrated tower. Remember to write the alt text in Media.' } },
          { name: 'heroCutout', type: 'checkbox', defaultValue: false, label: 'Transparent PNG (no card)', admin: { description: 'Tick this if the hero image is a background-removed PNG: it is shown directly on the hero, without the rounded card.' } },
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
