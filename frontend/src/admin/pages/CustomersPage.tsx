// ============================================================================
// NETS Admin — Customer Management
// ============================================================================
import { useState, useEffect } from 'react'
import { Search, X, Building, User } from 'lucide-react'
import { useAdminStore, type AdminCustomer } from '../store/useAdminStore'
import { adminService } from '../services/adminService'

const fmt = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

export function CustomersPage() {
  const { quotes, bookings, addCustomerNote } = useAdminStore()
  const [customers, setCustomers] = useState<AdminCustomer[]>([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all'|'corporate'|'individual'>('all')
  const [selected, setSelected] = useState<AdminCustomer | null>(null)
  const [noteInput, setNoteInput] = useState('')

  useEffect(() => {
    adminService.getCustomers().then(list => {
      setCustomers((list || []) as AdminCustomer[])
    })
  }, [])

  const filtered = customers.filter(c => {
    const matchSearch = !search || c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || c.type === typeFilter
    return matchSearch && matchType
  })

  const customerQuotes = selected ? quotes.filter(q => q.customerId === selected.id) : []
  const customerBookings = selected ? bookings.filter(b => b.customerId === selected.id) : []

  return (
    <>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Customer Management</div>
          <div className="admin-page-desc">{customers.length} registered customers</div>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search size={13} color="var(--adm-text-3)" />
          <input placeholder="Search name, email, company…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {(['all','corporate','individual'] as const).map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`admin-btn admin-btn-sm ${typeFilter === t ? 'admin-btn-primary' : 'admin-btn-ghost'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '1.25rem' }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Customer</th><th>Type</th><th>Company</th><th>Phone</th><th>Bookings</th><th>Total Spend</th><th>Since</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="admin-table-empty">No customers found</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} style={{ cursor: 'pointer', background: selected?.id === c.id ? 'var(--adm-surface-2)' : undefined }}
                  onClick={() => { setSelected(c); setNoteInput(c.notes) }}>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{c.fullName}</div>
                    <div style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>{c.email}</div>
                  </td>
                  <td>
                    <span className={`admin-badge ${c.type === 'corporate' ? 'admin-badge-accent' : 'admin-badge-gray'}`}>
                      {c.type === 'corporate' ? <Building size={9} /> : <User size={9} />}
                      {c.type}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>{c.company ?? '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>{c.phone}</td>
                  <td style={{ fontWeight: 500, textAlign: 'center' }}>{c.totalBookings}</td>
                  <td style={{ fontWeight: 600 }}>{fmt(c.totalSpend)}</td>
                  <td style={{ fontSize: 12, color: 'var(--adm-text-3)' }}>{fmtDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="admin-card" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Customer Profile</span>
              <button className="admin-btn admin-btn-icon admin-btn-ghost" onClick={() => setSelected(null)}><X size={14} /></button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{selected.fullName}</div>
              {selected.company && <div style={{ fontSize: 13, color: 'var(--adm-text-2)' }}>{selected.company}</div>}
              <span className={`admin-badge ${selected.type === 'corporate' ? 'admin-badge-accent' : 'admin-badge-gray'}`} style={{ marginTop: '0.5rem', display: 'inline-flex' }}>{selected.type}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="admin-stat-card" style={{ padding: '0.875rem' }}>
                <div className="admin-stat-label" style={{ fontSize: 11 }}>Total Bookings</div>
                <div className="admin-stat-value" style={{ fontSize: 22 }}>{selected.totalBookings}</div>
              </div>
              <div className="admin-stat-card" style={{ padding: '0.875rem' }}>
                <div className="admin-stat-label" style={{ fontSize: 11 }}>Total Spend</div>
                <div className="admin-stat-value" style={{ fontSize: 15 }}>{fmt(selected.totalSpend)}</div>
              </div>
            </div>

            {[['Email', selected.email], ['Phone', selected.phone], ['Member Since', fmtDate(selected.createdAt)]].map(([l,v]) => (
              <div key={l as string} className="admin-detail-row">
                <span className="admin-detail-label">{l}</span>
                <span className="admin-detail-value" style={{ fontSize: 13 }}>{v}</span>
              </div>
            ))}

            {customerQuotes.length > 0 && (
              <div style={{ marginTop: '1.25rem' }}>
                <div className="admin-label" style={{ marginBottom: '0.5rem' }}>Recent Quotes ({customerQuotes.length})</div>
                {customerQuotes.slice(0, 3).map(q => (
                  <div key={q.id} style={{ padding: '0.5rem', background: 'var(--adm-surface-2)', borderRadius: 'var(--adm-radius-sm)', marginBottom: '0.375rem', fontSize: 12 }}>
                    <span style={{ fontFamily: 'monospace', color: 'var(--adm-text-3)', marginRight: 8 }}>{q.reference.slice(-6)}</span>
                    <span>{fmt(q.estimatedInvestment)}</span>
                    <span className={`admin-badge admin-badge-gray`} style={{ marginLeft: 8 }}>{q.status}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '1.25rem' }}>
              <div className="admin-label" style={{ marginBottom: '0.375rem' }}>Internal Notes</div>
              <textarea className="admin-textarea" rows={2} value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder="Internal notes about this customer…" />
              <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ marginTop: '0.375rem' }}
                onClick={() => addCustomerNote(selected.id, noteInput)}>Save Notes</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
