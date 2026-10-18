import React from 'react'
import type { AdminViewServerProps } from 'payload'

/* eslint-disable @typescript-eslint/no-explicit-any */
const STATUS = ['new', 'contacted', 'visit', 'negotiation', 'booked', 'lost'] as const
const LABEL: Record<string, string> = { new: 'New', contacted: 'Contacted', visit: 'Site visit', negotiation: 'Negotiation', booked: 'Booked', lost: 'Lost' }

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ border: '1px solid var(--theme-elevation-100)', borderRadius: 8, padding: '14px 16px', background: 'var(--theme-elevation-50)' }}>
    <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em', opacity: 0.65, marginBottom: 8 }}>{title}</div>
    {children}
  </div>
)
const Big = ({ n, label }: { n: number; label: string }) => (
  <div><div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1 }}>{n}</div><div style={{ fontSize: 12, opacity: 0.65 }}>{label}</div></div>
)
const Bars = ({ rows }: { rows: [string, number][] }) => {
  const max = Math.max(1, ...rows.map((r) => r[1]))
  if (!rows.length) return <div style={{ opacity: 0.6, fontSize: 13 }}>No data yet</div>
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 28px', gap: 8, alignItems: 'center', fontSize: 13 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k}</span>
          <span style={{ background: 'var(--theme-elevation-150)', borderRadius: 4, height: 8 }}><span style={{ display: 'block', height: 8, width: `${(v / max) * 100}%`, background: 'var(--theme-success-500, #2f8f5b)', borderRadius: 4 }} /></span>
          <span style={{ textAlign: 'right' }}>{v}</span>
        </div>
      ))}
    </div>
  )
}
const tally = (docs: any[], f: (d: any) => string | undefined) => {
  const m = new Map<string, number>()
  docs.forEach((d) => { const k = f(d); if (k) m.set(k, (m.get(k) || 0) + 1) })
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
}

/** Lead overview at the top of the admin dashboard. Visible to admin, sales and marketing. */
export async function LeadStats({ payload, user }: Pick<AdminViewServerProps, 'payload'> & { user?: any }) {
  const role = user?.role
  if (!['admin', 'sales', 'marketing'].includes(role)) return null
  const since = new Date(Date.now() - 30 * 864e5).toISOString()
  const all = await payload.find({ collection: 'leads', limit: 5000, depth: 1, pagination: false, overrideAccess: true, select: { status: true, kind: true, project: true, source: true, createdAt: true, duplicateOf: true } as any })
  const docs: any[] = all.docs
  const recent = docs.filter((d) => d.createdAt >= since)
  const week = docs.filter((d) => d.createdAt >= new Date(Date.now() - 7 * 864e5).toISOString())
  const byStatus = STATUS.map((s) => [LABEL[s], docs.filter((d) => d.status === s).length] as [string, number])
  const booked = docs.filter((d) => d.status === 'booked').length
  return (
    <div style={{ margin: '0 0 28px' }}>
      <h2 style={{ margin: '0 0 12px' }}>Leads overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
        <Card title="Volume">
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            <Big n={week.length} label="last 7 days" /><Big n={recent.length} label="last 30 days" /><Big n={docs.length} label="all time" />
            <Big n={docs.length ? Math.round((booked / docs.length) * 100) : 0} label="% booked" />
          </div>
        </Card>
        <Card title="Pipeline"><Bars rows={byStatus} /></Card>
        <Card title="By type (30 days)"><Bars rows={tally(recent, (d) => d.kind)} /></Card>
        <Card title="Top projects (30 days)"><Bars rows={tally(recent, (d) => d.project?.name)} /></Card>
        <Card title="Top sources (30 days)"><Bars rows={tally(recent, (d) => d.source?.utm_source || (d.source?.gclid ? 'google ads' : d.source?.fbclid ? 'facebook' : d.source?.referrer ? 'referral' : 'direct'))} /></Card>
        <Card title="Duplicates"><Big n={docs.filter((d) => d.duplicateOf).length} label="repeat enquiries (same phone)" /></Card>
      </div>
    </div>
  )
}
