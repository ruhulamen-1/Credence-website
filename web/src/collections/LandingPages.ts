import type { CollectionConfig } from 'payload'
import { canEditContent, readPublished } from '../access'
import { refreshSite } from '../lib/revalidate'

/** Campaign pages for ads (Facebook / Google). Public at /lp/<slug>. Supports a simple A/B test on headline and button. */
export const LandingPages: CollectionConfig = {
  slug: 'landing-pages',
  labels: { singular: 'Campaign page', plural: 'Campaign pages' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'abTest', '_status'], group: 'Marketing' },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 15 },
  access: { read: readPublished, create: canEditContent, update: canEditContent, delete: canEditContent },
  hooks: { afterChange: [({ doc }) => { refreshSite(); return doc }], afterDelete: [() => { refreshSite() }] },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'Internal name — also used as the campaign name on leads' } },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, validate: (v: unknown) => (typeof v === 'string' && /^[a-z0-9-]+$/.test(v) ? true : 'Lowercase letters, numbers and dashes only') },
    { name: 'language', type: 'select', defaultValue: 'en', options: [{ label: 'English', value: 'en' }, { label: 'বাংলা', value: 'bn' }] },
    { name: 'noindex', type: 'checkbox', defaultValue: true, label: 'Hide from Google (recommended for ad-only pages)' },
    { name: 'project', type: 'relationship', relationTo: 'projects' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'headline', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    { name: 'bullets', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'buttonText', type: 'text', defaultValue: 'Request a call back' },
    { name: 'phone', type: 'text', admin: { description: 'Campaign phone number (optional) — shown as a call button' } },
    { type: 'collapsible', label: 'A/B test (optional)', fields: [
      { name: 'abTest', type: 'checkbox', label: 'Run A/B test (50% of visitors see version B)' },
      { name: 'headlineB', type: 'text', admin: { condition: (_, s) => Boolean(s?.abTest) } },
      { name: 'buttonTextB', type: 'text', admin: { condition: (_, s) => Boolean(s?.abTest) } },
    ] },
  ],
}
