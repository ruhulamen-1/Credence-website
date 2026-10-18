import type { CollectionConfig } from 'payload'
import { requiredInEnglish } from '../validators'
import { canEditContent, readPublished } from '../access'
import { refreshSite } from '../lib/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'status', 'area', 'order'], group: 'Content' },
  defaultSort: 'order',
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 25 },
  hooks: { afterChange: [({ doc }) => { refreshSite(); return doc }], afterDelete: [() => { refreshSite() }] },
  access: { read: readPublished, create: canEditContent, update: canEditContent, delete: canEditContent },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basics',
          fields: [
            { name: 'name', type: 'text', required: true },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              admin: { description: "URL part, e.g. bella-vista. Don't change after launch." },
              validate: (v: unknown) => (typeof v === 'string' && /^[a-z0-9-]+$/.test(v) ? true : 'Lowercase letters, numbers and dashes only'),
            },
            {
              type: 'row',
              fields: [
                { name: 'status', type: 'select', required: true, defaultValue: 'Ongoing', options: ['Ongoing', 'Completed', 'Upcoming'], enumName: 'enum_projects_stage' },
                { name: 'type', type: 'select', required: true, defaultValue: 'Apartment', options: ['Apartment', 'Commercial'] },
                { name: 'order', type: 'number', defaultValue: 100, admin: { description: 'Lower numbers show first' } },
              ],
            },
            { name: 'area', type: 'text', required: true, admin: { description: 'Neighbourhood — used by the Location filter, e.g. Gulshan' } },
            { name: 'addr', type: 'text', localized: true, validate: requiredInEnglish, label: 'Full address' },
            { name: 'mapQuery', type: 'text', admin: { description: "What Google Maps should search, e.g. 'Road 13, Gulshan 1, Dhaka'" } },
            { name: 'tagline', type: 'textarea', localized: true, admin: { description: 'Hero text on the project page' } },
          ],
        },
        {
          label: 'Look',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Cover photo (replaces the illustrated tower)' },
            { name: 'hue', type: 'number', min: 0, max: 360, defaultValue: 208, admin: { description: 'Tower colour (0–360) when there is no photo' } },
            { name: 'floors', type: 'number', min: 4, max: 40, defaultValue: 16 },
            { name: 'brochure', type: 'upload', relationTo: 'media', admin: { description: 'PDF — shows a Download button' } },
            { name: 'gallery', type: 'array', labels: { singular: 'Photo', plural: 'Gallery' }, fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }] },
          ],
        },
        {
          label: 'Details',
          fields: [
            { name: 'facts', type: 'array', localized: true, labels: { singular: 'Fact', plural: 'Key facts' }, admin: { description: 'Strip under the hero' }, fields: [
              { type: 'row', fields: [{ name: 'v', type: 'text', required: true, label: 'Value (e.g. 3,366)' }, { name: 'l', type: 'text', required: true, label: 'Label (e.g. sq. ft. each)' }] },
            ] },
            { name: 'storyTitle', type: 'text', localized: true },
            { name: 'story', type: 'array', localized: true, labels: { singular: 'Paragraph', plural: 'Story' }, fields: [{ name: 'paragraph', type: 'textarea', required: true }] },
            { name: 'spec', type: 'array', localized: true, labels: { singular: 'Row', plural: 'Specification table' }, fields: [
              { type: 'row', fields: [{ name: 'k', type: 'text', required: true, label: 'Label' }, { name: 'v', type: 'text', required: true, label: 'Value' }] },
            ] },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', type: 'text', localized: true, maxLength: 70, admin: { description: 'Up to ~60 characters' } },
            { name: 'seoDescription', type: 'textarea', localized: true, maxLength: 180, admin: { description: 'Up to ~160 characters' } },
            { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Social share image' },
          ],
        },
      ],
    },
  ],
}
