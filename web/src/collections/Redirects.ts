import type { CollectionConfig } from 'payload'
import { canEditContent, isStaff } from '../access'
import { refreshSite } from '../lib/revalidate'

/** Old URL → new URL (301/302). Used by the catch-all route, so it also covers URLs from the previous website. */
export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: { useAsTitle: 'from', defaultColumns: ['from', 'to', 'type'], group: 'Marketing', description: 'Keep SEO value when a URL changes. Example: /project/arkology → /projects/arkology' },
  access: { read: isStaff, create: canEditContent, update: canEditContent, delete: canEditContent },
  hooks: { afterChange: [({ doc }) => { refreshSite(); return doc }] },
  fields: [
    { name: 'from', type: 'text', required: true, unique: true, index: true, admin: { description: 'Path only, starting with /' }, validate: (v: unknown) => (typeof v === 'string' && v.startsWith('/') && !v.includes(' ') ? true : 'Must start with / and contain no spaces') },
    { name: 'to', type: 'text', required: true, admin: { description: 'Path (/projects/x) or full URL (https://…)' } },
    { name: 'type', type: 'select', defaultValue: '301', options: [{ label: '301 Permanent', value: '301' }, { label: '302 Temporary', value: '302' }] },
  ],
}
