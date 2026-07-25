// ============================================================================
// NETS Admin — Booking Management
// ============================================================================
import { useState, useEffect } from 'react'
import { Search, Plus, X, Save } from 'lucide-react'
import { useAdminStore, type AdminBooking } from '../store/useAdminStore'
import { adminService } from '../services/adminService'

const fmt = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

const opsBadge: Record<string, string> = {
  pending: 'admin-badge-yellow', confirmed: 'admin-badge-green',
  dispatched: 'admin-badge-accent', completed: 'admin-badge-gray', cancelled: 'admin-badge-red',
}
const payBadge: Record<string, string> = {
  pending: 'admin-badge-yellow', partial: 'admin-badge-yellow',
  paid: 'admin-badge-green', invoiced: 'admin-badge-accent', overdue: 'admin-badge-red',
}

export function BookingsPage() {
  const { session, vehicles, customers, updateBookingStatus, updatePaymentStatus } = useAdminStore()
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [opsFilter, setOpsFilter] = useState('all')
  const [selected, setSelected] = useState<AdminBooking | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const loadBookings = () => {
    setLoading(true)
    adminService.getBookings().then((list) => {
      setBookings((list || []) as AdminBooking[])
      setLoading(false)
    })
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const userId = session.user?.id ?? 'usr-001'
  const userName = session.user?.fullName ?? 'Admin'

  const filtered = bookings.filter(b => {
    const matchSearch = !search || b.reference.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase())
    const matchFilter = opsFilter === 'all' || b.operationalStatus === opsFilter
    return matchSearch && matchFilter
  })

  return (
    <>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Booking Management</div>
          <div className="admin-page-desc">{bookings.length} total bookings · {bookings.filter(b => b.operationalStatus === 'confirmed').length} confirmed</div>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setShowCreate(true)}><Plus size={14} /> Create Booking</button>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search size={13} color="var(--adm-text-3)" />
          <input placeholder="Search by reference or customer…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['all','pending','confirmed','dispatched','completed','cancelled'].map(s => (
          <button key={s} onClick={() => setOpsFilter(s)}
            className={`admin-btn admin-btn-sm ${opsFilter === s ? 'admin-btn-primary' : 'admin-btn-ghost'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: '1.25rem' }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Reference</th><th>Customer</th><th>Vehicle</th><th>Route</th><th>Travel Date</th><th>Amount</th><th>Payment</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="admin-table-empty">No bookings match your filters</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id} style={{ cursor: 'pointer', background: selected?.id === b.id ? 'var(--adm-surface-2)' : undefined }}
                  onClick={() => setSelected(b)}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--adm-text-2)' }}>{b.reference}</span></td>
                  <td style={{ fontWeight: 500, fontSize: 13 }}>{b.customerName}</td>
                  <td style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>{b.vehicleName}</td>
                  <td style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>{b.pickup.split(',')[0]} → {b.destination.split(',')[0]}</td>
                  <td style={{ fontSize: 12 }}>{fmtDate(b.travelDate)}</td>
                  <td style={{ fontWeight: 600 }}>{fmt(b.totalAmount)}</td>
                  <td><span className={`admin-badge ${payBadge[b.paymentStatus]}`}>{b.paymentStatus}</span></td>
                  <td><span className={`admin-badge ${opsBadge[b.operationalStatus]}`}>{b.operationalStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="admin-card" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Booking Detail</span>
              <button className="admin-btn admin-btn-icon admin-btn-ghost" onClick={() => setSelected(null)}><X size={14} /></button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--adm-text-3)' }}>{selected.reference}</div>
              <div style={{ fontSize: 22, fontWeight: 600 }}>{fmt(selected.totalAmount)}</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span className={`admin-badge ${opsBadge[selected.operationalStatus]}`}>{selected.operationalStatus}</span>
                <span className={`admin-badge ${payBadge[selected.paymentStatus]}`}>{selected.paymentStatus}</span>
              </div>
            </div>

            {[
              ['Customer', selected.customerName],
              ['Vehicle', selected.vehicleName],
              ['Driver', selected.driverName ?? 'Unassigned'],
              ['Trip Type', selected.tripType],
              ['Passengers', selected.passengerCount],
              ['Distance', `${selected.distanceKm} km`],
              ['Pickup', selected.pickup],
              ['Destination', selected.destination],
              ['Travel Date', fmtDate(selected.travelDate)],
              ['Notes', selected.notes || '—'],
            ].map(([label, value]) => (
              <div key={label as string} className="admin-detail-row">
                <span className="admin-detail-label">{label}</span>
                <span className="admin-detail-value" style={{ fontSize: 13 }}>{value}</span>
              </div>
            ))}

            <div style={{ marginTop: '1.25rem' }}>
              <div className="admin-label" style={{ marginBottom: '0.5rem' }}>Update Operational Status</div>
              <select className="admin-select" value={selected.operationalStatus}
                onChange={e => { updateBookingStatus(selected.id, e.target.value as AdminBooking['operationalStatus'], userId, userName); setSelected(b => b ? { ...b, operationalStatus: e.target.value as any } : b) }}>
                {['pending','confirmed','dispatched','completed','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <div className="admin-label" style={{ marginBottom: '0.5rem' }}>Update Payment Status</div>
              <select className="admin-select" value={selected.paymentStatus}
                onChange={e => { updatePaymentStatus(selected.id, e.target.value as AdminBooking['paymentStatus']); setSelected(b => b ? { ...b, paymentStatus: e.target.value as any } : b) }}>
                {['pending','partial','paid','invoiced','overdue'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Create Booking Modal */}
      {showCreate && (
        <CreateBookingModal onClose={() => setShowCreate(false)} vehicles={vehicles} customers={customers} />
      )}
    </>
  )
}

function CreateBookingModal({ onClose, vehicles, customers }: any) {
  const { createBooking } = useAdminStore()
  const [form, setForm] = useState({
    customerId: '', customerName: '', vehicleId: '', vehicleName: '',
    pickup: '', destination: '', distanceKm: 0, durationMins: 0,
    tripType: 'One Way', passengerCount: 1, travelDate: '',
    totalAmount: 0, paymentStatus: 'pending', operationalStatus: 'pending',
    driverId: null, driverName: null, quoteReference: null, notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customerId || !form.vehicleId || !form.pickup || !form.travelDate) return
    createBooking(form as any)
    onClose()
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <span className="admin-modal-title">Create New Booking</span>
          <button className="admin-btn admin-btn-icon admin-btn-ghost" onClick={onClose}><X size={14} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Customer</label>
                <select className="admin-select" value={form.customerId}
                  onChange={e => { const c = customers.find((x: any) => x.id === e.target.value); setForm(f => ({ ...f, customerId: e.target.value, customerName: c?.fullName ?? '' })) }}>
                  <option value="">Select customer…</option>
                  {customers.map((c: any) => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Vehicle</label>
                <select className="admin-select" value={form.vehicleId}
                  onChange={e => { const v = vehicles.find((x: any) => x.id === e.target.value); setForm(f => ({ ...f, vehicleId: e.target.value, vehicleName: v?.name ?? '' })) }}>
                  <option value="">Select vehicle…</option>
                  {vehicles.filter((v: any) => v.available).map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label admin-label-req">Pickup Location</label>
              <input className="admin-input" value={form.pickup} onChange={e => setForm(f => ({ ...f, pickup: e.target.value }))} placeholder="Pickup address" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label admin-label-req">Destination</label>
              <input className="admin-input" value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} placeholder="Destination address" />
            </div>
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Travel Date</label>
                <input className="admin-input" type="datetime-local" value={form.travelDate} onChange={e => setForm(f => ({ ...f, travelDate: e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Trip Type</label>
                <select className="admin-select" value={form.tripType} onChange={e => setForm(f => ({ ...f, tripType: e.target.value }))}>
                  {['One Way','Return','Airport Transfer','Corporate Shuttle','Wedding','Multi-Day','Recurring'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Total Amount (₦)</label>
                <input className="admin-input" type="number" value={form.totalAmount} onChange={e => setForm(f => ({ ...f, totalAmount: +e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Passengers</label>
                <input className="admin-input" type="number" min={1} value={form.passengerCount} onChange={e => setForm(f => ({ ...f, passengerCount: +e.target.value }))} />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Notes</label>
              <textarea className="admin-textarea" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary"><Save size={13} /> Create Booking</button>
          </div>
        </form>
      </div>
    </div>
  )
}
