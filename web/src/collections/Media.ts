import type { CollectionConfig } from 'payload'
import { anyone, canEditContent } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: { read: anyone, create: canEditContent, update: canEditContent, delete: canEditContent },
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'card', width: 800, height: 1000, position: 'centre' },
      { name: 'hero', width: 1600, withoutEnlargement: true },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', label: 'Alt text (describe the image — good for SEO & accessibility)' },
  ],
}
