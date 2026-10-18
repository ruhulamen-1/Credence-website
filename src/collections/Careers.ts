import type { CollectionConfig } from 'payload'
import { requiredInEnglish } from '../validators'
import { canEditContent, readPublished } from '../access'
import { refreshSite } from '../lib/revalidate'

export const Careers: CollectionConfig = {
  slug: 'careers',
  labels: { singular: 'Job', plural: 'Careers' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'department', 'location', 'open', '_status'], group: 'Content' },
  defaultSort: '-createdAt',
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 15 },
  access: { read: readPublished, create: canEditContent, update: canEditContent, delete: canEditContent },
  hooks: { afterChange: [({ doc }) => { refreshSite(); return doc }], afterDelete: [() => { refreshSite() }] },
  fields: [
    { name: 'title', type: 'text', localized: true, validate: requiredInEnglish },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, validate: (v: unknown) => (typeof v === 'string' && /^[a-z0-9-]+$/.test(v) ? true : 'Lowercase letters, numbers and dashes only') },
    { type: 'row', fields: [
      { name: 'department', type: 'text', localized: true },
      { name: 'location', type: 'text', localized: true, defaultValue: 'Dhaka' },
      { name: 'employmentType', type: 'select', defaultValue: 'full-time', options: ['full-time', 'part-time', 'contract', 'internship'] },
    ] },
    { type: 'row', fields: [
      { name: 'open', type: 'checkbox', defaultValue: true, label: 'Accepting applications' },
      { name: 'deadline', type: 'date' },
    ] },
    { name: 'description', type: 'richText', localized: true },
  ],
}
