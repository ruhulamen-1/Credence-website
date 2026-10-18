import type { CollectionConfig } from 'payload'
import { requiredInEnglish } from '../validators'
import { canEditContent, readPublished } from '../access'
import { refreshSite } from '../lib/revalidate'

/** Blog articles, news items and events. */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Blog, News & Events' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'kind', 'publishedAt', '_status'], group: 'Content' },
  defaultSort: '-publishedAt',
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 25 },
  access: { read: readPublished, create: canEditContent, update: canEditContent, delete: canEditContent },
  hooks: { afterChange: [({ doc }) => { refreshSite(); return doc }], afterDelete: [() => { refreshSite() }] },
  fields: [
    { name: 'title', type: 'text', localized: true, validate: requiredInEnglish },
    {
      name: 'slug', type: 'text', required: true, unique: true, index: true,
      validate: (v: unknown) => (typeof v === 'string' && /^[a-z0-9-]+$/.test(v) ? true : 'Lowercase letters, numbers and dashes only'),
    },
    { type: 'row', fields: [
      { name: 'kind', type: 'select', required: true, defaultValue: 'blog', options: [{ label: 'Blog article', value: 'blog' }, { label: 'News', value: 'news' }, { label: 'Event', value: 'event' }] },
      { name: 'publishedAt', type: 'date', defaultValue: () => new Date().toISOString(), admin: { date: { pickerAppearance: 'dayAndTime' } } },
      { name: 'author', type: 'text' },
    ] },
    { name: 'eventDate', type: 'date', admin: { condition: (_, s) => s?.kind === 'event', date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'eventLocation', type: 'text', localized: true, admin: { condition: (_, s) => s?.kind === 'event' } },
    { name: 'excerpt', type: 'textarea', localized: true, maxLength: 300 },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', localized: true },
    { name: 'relatedProject', type: 'relationship', relationTo: 'projects' },
    { type: 'collapsible', label: 'SEO', fields: [
      { name: 'seoTitle', type: 'text', localized: true, maxLength: 70 },
      { name: 'seoDescription', type: 'textarea', localized: true, maxLength: 180 },
    ] },
  ],
}
