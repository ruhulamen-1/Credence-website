import React from 'react'

/** "Download CSV" bar above the Leads list. Uses the filter-free export endpoint; add ?status=… / ?from=… by hand for slices. */
export function ExportLeads() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '0 0 16px' }}>
      <a href="/api/leads/export" download className="btn btn--style-primary btn--size-small" style={{ textDecoration: 'none' }}>Download all leads (CSV)</a>
      <span style={{ opacity: 0.65, fontSize: 13 }}>Tip: add <code>?status=new&amp;from=2026-01-01</code> to the link for a slice.</span>
    </div>
  )
}
