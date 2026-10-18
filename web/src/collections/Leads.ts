import type { CollectionConfig } from 'payload'
import { canWorkLeads, isAdmin } from '../access'

/** Every enquiry from the website forms. Created only by the /api/leads route. */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'phone', 'project', 'status', 'createdAt'], group: 'Marketing' },
  defaultSort: '-createdAt',
  access: { create: () => false, read: canWorkLeads, update: canWorkLeads, delete: isAdmin },
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'phone', type: 'text', required: true, index: true },
      { name: 'email', type: 'email' },
    ] },
    { name: 'message', type: 'textarea' },
    { type: 'row', fields: [
      { name: 'project', type: 'relationship', relationTo: 'projects' },
      { name: 'page', type: 'text' },
      { name: 'status', type: 'select', defaultValue: 'new', options: [
        { label: 'New', value: 'new' }, { label: 'Contacted', value: 'contacted' }, { label: 'Site visit', value: 'visit' },
        { label: 'Negotiation', value: 'negotiation' }, { label: 'Booked', value: 'booked' }, { label: 'Lost', value: 'lost' },
      ] },
    ] },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users' },
    { name: 'notes', type: 'textarea' },
    {
      name: 'source',
      type: 'group',
      admin: { description: 'Where this lead came from (captured automatically)' },
      fields: [
        { name: 'utm_source', type: 'text' }, { name: 'utm_medium', type: 'text' }, { name: 'utm_campaign', type: 'text' },
        { name: 'utm_term', type: 'text' }, { name: 'utm_content', type: 'text' },
        { name: 'gclid', type: 'text' }, { name: 'fbclid', type: 'text' }, { name: 'ttclid', type: 'text' },
        { name: 'referrer', type: 'text' }, { name: 'landing', type: 'text' },
      ],
    },
    { name: 'duplicateOf', type: 'relationship', relationTo: 'leads', admin: { readOnly: true, description: 'Set automatically when the same phone number enquired before' } },
  ],
}
