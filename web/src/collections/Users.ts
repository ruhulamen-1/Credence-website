import type { CollectionConfig } from 'payload'
import { adminOnlyField, isAdmin } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', group: 'System' },
  auth: { tokenExpiration: 60 * 60 * 12, maxLoginAttempts: 5, lockTime: 10 * 60 * 1000 },
  access: {
    create: isAdmin,
    read: ({ req }) => Boolean(req.user),
    update: ({ req, id }) => {
      const u = req.user as { id?: string | number; role?: string } | null
      return u?.role === 'admin' || String(u?.id) === String(id)
    },
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'marketing',
      saveToJWT: true,
      options: [
        { label: 'Admin — everything', value: 'admin' },
        { label: 'Marketing — content, SEO, tracking, leads (read)', value: 'marketing' },
        { label: 'Sales — leads only', value: 'sales' },
      ],
      access: { create: adminOnlyField, update: adminOnlyField },
    },
  ],
}
