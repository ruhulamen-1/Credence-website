import type { CollectionConfig } from 'payload'
import type { PayloadRequest, Where } from 'payload'
import { canReadLeads, canWorkLeads, isAdmin } from '../access'

/** Every enquiry from the website forms. Created only by the /api/leads route. */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: { components: { beforeListTable: ['/components/admin/ExportLeads#ExportLeads'] }, useAsTitle: 'name', defaultColumns: ['name', 'phone', 'kind', 'project', 'status', 'createdAt'], group: 'Marketing' },
  defaultSort: '-createdAt',
  access: { create: () => false, read: canReadLeads, update: canWorkLeads, delete: isAdmin },
  endpoints: [
    {
      // GET /api/leads/export?status=new&kind=enquiry&from=2026-01-01&to=2026-12-31  → CSV download
      path: '/export',
      method: 'get',
      handler: async (req: PayloadRequest) => {
        const role = (req.user as { role?: string } | null)?.role
        if (!role || !['admin', 'sales', 'marketing'].includes(role)) return Response.json({ error: 'Forbidden' }, { status: 403 })
        const q = new URL(req.url || 'http://x').searchParams
        const and: Where[] = []
        for (const k of ['status', 'kind']) if (q.get(k)) and.push({ [k]: { equals: q.get(k) } })
        if (q.get('from')) and.push({ createdAt: { greater_than_equal: q.get('from') } })
        if (q.get('to')) and.push({ createdAt: { less_than_equal: `${q.get('to')}T23:59:59.999Z` } })
        const res = await req.payload.find({ collection: 'leads', where: and.length ? { and } : {}, limit: 20000, depth: 1, sort: '-createdAt', pagination: false, overrideAccess: true })
        const cols = ['createdAt', 'name', 'phone', 'email', 'kind', 'status', 'project', 'job', 'campaign', 'variant', 'message', 'details', 'utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid', 'referrer', 'landing', 'page', 'notes']
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cell = (d: any, c: string) => {
          if (c === 'project') return d.project?.name ?? ''
          if (c === 'job') return d.job?.title ?? ''
          if (['utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid', 'referrer', 'landing'].includes(c)) return d.source?.[c] ?? ''
          return d[c] ?? ''
        }
        // Prefix =,+,-,@ so spreadsheets never run a visitor-typed value as a formula.
        const esc = (v: unknown) => { let s = String(v ?? '').replace(/\r?\n/g, ' '); if (/^[=+\-@]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"` }
        const csv = '\uFEFF' + [cols.join(','), ...res.docs.map((d) => cols.map((c) => esc(cell(d, c))).join(','))].join('\r\n')
        return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="credence-leads-${new Date().toISOString().slice(0, 10)}.csv"` } })
      },
    },
  ],
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'phone', type: 'text', required: true, index: true },
      { name: 'email', type: 'email' },
    ] },
    { name: 'message', type: 'textarea' },
    { type: 'row', fields: [
      { name: 'kind', type: 'select', defaultValue: 'enquiry', index: true, options: [
        { label: 'Project enquiry', value: 'enquiry' }, { label: 'Landowner', value: 'landowner' }, { label: 'Buyer', value: 'buyer' },
        { label: 'Career application', value: 'career' }, { label: 'Campaign page', value: 'campaign' },
      ] },
      { name: 'job', type: 'relationship', relationTo: 'careers' },
      { name: 'campaign', type: 'text', admin: { description: 'Landing page / campaign name' } },
      { name: 'variant', type: 'text', admin: { description: 'A/B variant shown (A or B)' } },
    ] },
    { name: 'details', type: 'textarea', admin: { description: 'Extra form answers (land size, budget, …)' } },
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
