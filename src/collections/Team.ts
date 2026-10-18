import type { CollectionConfig } from 'payload'
import { requiredInEnglish } from '../validators'
import { anyone, canEditContent } from '../access'
import { refreshSite } from '../lib/revalidate'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: { singular: 'Team member', plural: 'Management & Team' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role', 'group', 'order'], group: 'Content' },
  defaultSort: 'order',
  access: { read: anyone, create: canEditContent, update: canEditContent, delete: canEditContent },
  hooks: { afterChange: [({ doc }) => { refreshSite(); return doc }], afterDelete: [() => { refreshSite() }] },
  fields: [
    { name: 'name', type: 'text', localized: true, validate: requiredInEnglish },
    { name: 'role', type: 'text', localized: true, validate: requiredInEnglish },
    { type: 'row', fields: [
      { name: 'group', type: 'select', required: true, defaultValue: 'team', options: [{ label: 'Management', value: 'management' }, { label: 'Our team', value: 'team' }] },
      { name: 'order', type: 'number', defaultValue: 100 },
    ] },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea', localized: true },
  ],
}
