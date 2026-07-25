// ============================================================================
// NETS Admin — Quote Management
// ============================================================================
import { useState, useEffect } from 'react'
import { Search, Filter, Eye, Check, X, RefreshCw } from 'lucide-react'
import { useAdminStore, type AdminQuote } from '../store/useAdminStore'
import { adminService, AdminLead } from '../services/adminService'
import { pdfService } from '../../services/pdfService'
import { emailService } from '../../services/emailService'

const fmt = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

const statusColors: Record<string, string> = {
  new: 'admin-badge-accent', pending: 'admin-badge-yellow', reviewed: 'admin-badge-yellow',
  approved: 'admin-badge-green', rejected: 'admin-badge-red', converted: 'admin-badge-gray',
}

export function QuotesPage() {
  const { quotes, updateQuoteStatus, addQuoteNote, session } = useAdminStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [selected, setSelected] = useState<AdminQuote | null>(null)
  const [noteInput, setNoteInput] = useState('')
  const [liveLeads, setLiveLeads] = useState<AdminLead[]>([])

  const loadLeads = () => {
    adminService.getLeads().then(setLiveLeads)
  }

  useEffect(() => {
    loadLeads()
  }, [])

  const userId = session.user?.id ?? 'usr-001'
  const userName = session.user?.fullName ?? 'Admin'

  // Combine store quotes with MySQL live leads
  const allQuotes: AdminQuote[] = [
    ...liveLeads.map((l) => ({
      id: String(l.id),
      reference: l.leadReference,
      customerName: l.customerName,
      customerEmail: l.customerEmail,
      customerPhone: l.customerPhone || 'N/A',
      customerId: 'cust-gen',
      vehicleId: 'veh-gen',
      vehicleName: l.journeyType || 'Standard Vehicle',
      tripType: (l.journeyType || 'One-Way') as any,
      pickup: l.origin || 'N/A',
      destination: l.destination || 'N/A',
      distanceKm: 0,
      durationMins: 0,
      travelDate: l.createdAt,
      passengerCount: 1,
      estimatedInvestment: l.estimatedInvestmentMax || l.estimatedInvestmentMin || 0,
      status: (l.status === 'pending' ? 'new' : l.status) as any,
      createdAt: l.createdAt,
      updatedAt: l.createdAt,
      notes: '',
    })),
  ]

  const filtered = allQuotes.filter(q => {
    const matchSearch = !search || q.reference.toLowerCase().includes(search.toLowerCase()) ||
      q.customerName.toLowerCase().includes(search.toLowerCase()) ||
      q.pickup.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || q.status === filter
    return matchSearch && matchFilter
  })

  const handleAction = async (id: string, status: AdminQuote['status']) => {
    updateQuoteStatus(id, status, userId, userName)
    await adminService.updateLeadStatus(id, status)
    loadLeads()
    if (selected?.id === id) setSelected(q => q ? { ...q, status } : q)
  }

  const handleExportPDF = (q: AdminQuote) => {
    pdfService.generateQuotationPDF({
      leadMetadata: { quoteReferenceNumber: q.reference },
      customerInformation: { name: q.customerName, email: q.customerEmail },
      journeyInformation: { journeyType: q.tripType, distanceKm: q.distanceKm, passengerCount: q.passengerCount },
      estimatedInvestment: { vehicleName: q.vehicleName, minimumEstimate: q.estimatedInvestment, maximumEstimate: q.estimatedInvestment },
    })
  }

  const handleEmailCustomer = async (q: AdminQuote) => {
    await emailService.sendConfirmationEmail({
      leadMetadata: { quoteReferenceNumber: q.reference },
      customerInformation: { name: q.customerName, email: q.customerEmail },
    })
    alert(`Confirmation email sent to ${q.customerEmail}`)
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Quote Management</div>
          <div className="admin-page-desc">{quotes.length} total quotes · {quotes.filter(q => q.status === 'new').length} awaiting review</div>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search size={13} color="var(--adm-text-3)" />
          <input placeholder="Search by reference, customer, route…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Filter size={14} color="var(--adm-text-3)" />
        {['all','new','reviewed','approved','rejected','converted'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`admin-btn admin-btn-sm ${filter === s ? 'admin-btn-primary' : 'admin-btn-ghost'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '1.25rem' }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Reference</th><th>Customer</th><th>Vehicle</th><th>Route</th><th>Estimate</th><th>Travel Date</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="admin-table-empty">No quotes match your filters</td></tr>
              ) : filtered.map(q => (
                <tr key={q.id} style={{ cursor: 'pointer', background: selected?.id === q.id ? 'var(--adm-surface-2)' : undefined }}
                  onClick={() => { setSelected(q); setNoteInput(q.notes) }}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--adm-text-2)' }}>{q.reference}</span></td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{q.customerName}</div>
                    <div style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>{q.customerEmail}</div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>{q.vehicleName}</td>
                  <td style={{ fontSize: 12, color: 'var(--adm-text-3)', maxWidth: 160 }}>
                    <div>{q.pickup.split(',')[0]}</div>
                    <div>→ {q.destination.split(',')[0]}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{fmt(q.estimatedInvestment)}</td>
                  <td style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>{fmtDate(q.travelDate)}</td>
                  <td><span className={`admin-badge ${statusColors[q.status]}`}>{q.status}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    {q.status === 'new' && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="admin-btn admin-btn-sm admin-btn-ghost" title="Approve" onClick={() => handleAction(q.id, 'approved')}><Check size={12} /></button>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" title="Reject" onClick={() => handleAction(q.id, 'rejected')}><X size={12} /></button>
                      </div>
                    )}
                    {q.status === 'approved' && (
                      <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={() => handleAction(q.id, 'converted')}>
                        <RefreshCw size={12} /> Convert
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="admin-card" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Quote Details</span>
              <button className="admin-btn admin-btn-icon admin-btn-ghost" onClick={() => setSelected(null)}><X size={14} /></button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <span className={`admin-badge ${statusColors[selected.status]}`} style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>{selected.status}</span>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--adm-text-3)', marginBottom: '0.375rem' }}>{selected.reference}</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--adm-text-1)' }}>{fmt(selected.estimatedInvestment)}</div>
            </div>

            {[
              ['Customer', selected.customerName],
              ['Email', selected.customerEmail],
              ['Vehicle', selected.vehicleName],
              ['Trip Type', selected.tripType],
              ['Passengers', selected.passengerCount],
              ['Distance', `${selected.distanceKm} km`],
              ['Duration', `${selected.durationMins} mins`],
              ['Pickup', selected.pickup],
              ['Destination', selected.destination],
              ['Travel Date', fmtDate(selected.travelDate)],
            ].map(([label, value]) => (
              <div key={label as string} className="admin-detail-row">
                <span className="admin-detail-label">{label}</span>
                <span className="admin-detail-value" style={{ fontSize: 13 }}>{value}</span>
              </div>
            ))}

            <div style={{ marginTop: '1.25rem' }}>
              <div className="admin-label" style={{ marginBottom: '0.375rem' }}>Internal Notes</div>
              <textarea className="admin-textarea" rows={2} value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder="Add internal notes…" />
              <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ marginTop: '0.375rem' }}
                onClick={() => { addQuoteNote(selected.id, noteInput) }}>Save Note</button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              {selected.status === 'new' && <>
                <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => handleAction(selected.id, 'approved')}><Check size={12} /> Approve</button>
                <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleAction(selected.id, 'rejected')}><X size={12} /> Reject</button>
              </>}
              {selected.status === 'approved' && (
                <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => handleAction(selected.id, 'converted')}>
                  <RefreshCw size={12} /> Convert to Booking
                </button>
              )}
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleExportPDF(selected)}><Eye size={12} /> Export PDF</button>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleEmailCustomer(selected)}>Email Customer</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
