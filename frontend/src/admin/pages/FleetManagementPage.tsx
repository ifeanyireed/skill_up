// ============================================================================
// NETS Admin — Fleet Management
// ============================================================================
import { useState, useEffect } from 'react'
import { Plus, Edit2, Archive, AlertTriangle, CheckCircle, Clock, X, Save } from 'lucide-react'
import { useAdminStore, type AdminVehicle } from '../store/useAdminStore'
import { vehicleService } from '../../services/vehicleService'
import { adminService } from '../services/adminService'
import { Vehicle } from '../../types'

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
const daysUntil = (iso: string) => Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)

const maintenanceBadge = (s: string) => ({
  ok: 'admin-badge-green', 'service-due': 'admin-badge-yellow',
  'in-service': 'admin-badge-accent', retired: 'admin-badge-gray',
}[s] ?? 'admin-badge-gray')

export function FleetManagementPage() {
  const { vehicles, updateVehicle, archiveVehicle, addVehicle, session } = useAdminStore()
  const [liveVehicles, setLiveVehicles] = useState<Vehicle[]>([])
  const [selected, setSelected] = useState<AdminVehicle | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<AdminVehicle>>({})

  const loadFleet = () => {
    vehicleService.getVehicles().then(setLiveVehicles)
  }

  useEffect(() => {
    loadFleet()
  }, [])

  const userId = session.user?.id ?? 'usr-001'
  const userName = session.user?.fullName ?? 'Admin'

  const startEdit = (v: AdminVehicle) => { setEditForm({ ...v }); setEditing(true) }
  const saveEdit = async () => {
    if (!selected) return
    updateVehicle(selected.id, editForm)
    await adminService.saveVehicle({
      id: selected.id,
      name: editForm.name || selected.name,
      slug: editForm.name ? editForm.name.toLowerCase().replace(/\s+/g, '-') : selected.id,
      category: editForm.category || selected.category,
      capacity: editForm.capacity || selected.capacity,
      bestFor: 'Corporate & VIP Travel',
      imageUrl: editForm.imageUrl || selected.imageUrl || '/images/vehicles/sedan.jpg',
      features: selected.features || [],
      available: editForm.available ?? selected.available,
      comfortRating: '5 Stars',
      luggageSpace: '2 Suitcases',
      airConditioning: 'Automatic AC',
    }, true)
    loadFleet()
    setSelected(v => v ? { ...v, ...editForm } : v)
    setEditing(false)
  }

  const fleetList: AdminVehicle[] = liveVehicles.map(v => ({
    id: v.id,
    slug: v.slug || v.id,
    registrationNumber: v.id.toUpperCase(),
    make: 'Toyota',
    model: v.name,
    year: 2024,
    category: v.category as any,
    pricingCategory: 'Executive',
    capacity: v.capacity,
    assignedDriverId: 'drv-001',
    assignedDriverName: 'Emmanuel Okafor',
    status: (v.available ? 'active' : 'maintenance') as any,
    maintenanceStatus: 'ok',
    lastServiceDate: '2026-01-10',
    nextServiceDueDate: '2026-08-10',
    currentMileageKm: 14500,
    insuranceExpiry: '2027-01-01',
    roadworthinessExpiry: '2027-01-01',
    location: 'Lagos Hub',
    imageUrl: v.imageUrl,
    available: v.available,
    visible: v.available,
    name: v.name,
    features: v.features || [],
  }))

  return (
    <>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Fleet Management</div>
          <div className="admin-page-desc">{fleetList.length} vehicles in fleet · {fleetList.filter(v => v.available).length} available</div>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Vehicle</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {fleetList.map(v => {
              const insExpiry = daysUntil(v.insuranceExpiry)
              return (
                <div key={v.id} className="admin-card"
                  style={{ cursor: 'pointer', border: `1px solid ${selected?.id === v.id ? 'var(--adm-accent)' : 'var(--adm-border)'}`, padding: 0, overflow: 'hidden' }}
                  onClick={() => { setSelected(v); setEditing(false) }}>
                  <div style={{ height: 160, overflow: 'hidden', position: 'relative', background: 'var(--adm-surface-2)' }}>
                    <img src={v.imageUrl} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.375rem' }}>
                      <span className={`admin-badge ${maintenanceBadge(v.maintenanceStatus)}`}>{v.maintenanceStatus}</span>
                    </div>
                    {!v.available && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="admin-badge admin-badge-red" style={{ fontSize: 12 }}>Unavailable</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: '0.25rem' }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--adm-text-3)', marginBottom: '0.625rem' }}>{v.registrationNumber} · {v.capacity} seats</div>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.625rem' }}>
                      <span className={`admin-badge ${v.available ? 'admin-badge-green' : 'admin-badge-red'}`}>{v.available ? 'Available' : 'Unavailable'}</span>
                      <span className={`admin-badge ${v.visible ? 'admin-badge-green' : 'admin-badge-gray'}`}>{v.visible ? 'Visible' : 'Hidden'}</span>
                    </div>
                    <div style={{ fontSize: 11, color: insExpiry < 60 ? 'var(--adm-warning)' : 'var(--adm-text-3)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {insExpiry < 60 ? <AlertTriangle size={11} /> : <Clock size={11} />}
                      Insurance: {fmtDate(v.insuranceExpiry)} ({insExpiry}d)
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {selected && (
          <div className="admin-card" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{editing ? 'Edit Vehicle' : 'Vehicle Details'}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {!editing && <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => startEdit(selected)}><Edit2 size={12} /> Edit</button>}
                <button className="admin-btn admin-btn-icon admin-btn-ghost" onClick={() => { setSelected(null); setEditing(false) }}><X size={14} /></button>
              </div>
            </div>

            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {[
                  { label: 'Vehicle Name', key: 'name' }, { label: 'Registration', key: 'registrationNumber' },
                  { label: 'Category', key: 'category' }, { label: 'Insurance Expiry', key: 'insuranceExpiry' },
                ].map(({ label, key }) => (
                  <div key={key} className="admin-form-group">
                    <label className="admin-label">{label}</label>
                    <input className="admin-input" value={(editForm as any)[key] ?? ''} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))} />
                  </div>
                ))}
                <div className="admin-form-group">
                  <label className="admin-label">Capacity</label>
                  <input className="admin-input" type="number" value={editForm.capacity ?? ''} onChange={e => setEditForm(f => ({ ...f, capacity: +e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Maintenance Status</label>
                  <select className="admin-select" value={editForm.maintenanceStatus ?? 'ok'} onChange={e => setEditForm(f => ({ ...f, maintenanceStatus: e.target.value as any }))}>
                    {['ok','service-due','in-service','retired'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" checked={editForm.available ?? true} onChange={e => setEditForm(f => ({ ...f, available: e.target.checked }))} /> Available
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" checked={editForm.visible ?? true} onChange={e => setEditForm(f => ({ ...f, visible: e.target.checked }))} /> Visible on website
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button className="admin-btn admin-btn-primary" onClick={saveEdit}><Save size={13} /> Save</button>
                  <button className="admin-btn admin-btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <img src={selected.imageUrl} alt={selected.name} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--adm-radius-sm)', marginBottom: '1rem' }} />
                {[
                  ['Name', selected.name], ['Registration', selected.registrationNumber],
                  ['Category', selected.category], ['Capacity', `${selected.capacity} seats`],
                  ['Pricing Model', selected.pricingCategory], ['Maintenance', selected.maintenanceStatus],
                  ['Insurance Expiry', fmtDate(selected.insuranceExpiry)],
                  ['Available', selected.available ? '✓ Yes' : '✗ No'],
                  ['Visible on site', selected.visible ? '✓ Yes' : '✗ No'],
                ].map(([l,v]) => (
                  <div key={l as string} className="admin-detail-row">
                    <span className="admin-detail-label">{l}</span>
                    <span className="admin-detail-value" style={{ fontSize: 13 }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                  <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => startEdit(selected)}><Edit2 size={12} /> Edit</button>
                  <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => { archiveVehicle(selected.id, userId, userName); setSelected(null) }}>
                    <Archive size={12} /> Archive
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showAdd && <AddVehicleModal onClose={() => setShowAdd(false)} addVehicle={addVehicle} />}
    </>
  )
}

function AddVehicleModal({ onClose, addVehicle }: any) {
  const [form, setForm] = useState({ name: '', registrationNumber: '', category: 'Standard', capacity: 14, pricingCategory: 'hiace', imageUrl: '/vehicles/hiace.jpg', maintenanceStatus: 'ok', available: true, visible: true, insuranceExpiry: '', features: [] as string[], slug: '' })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addVehicle({ ...form, slug: form.name.toLowerCase().replace(/\s+/g, '-'), insuranceExpiry: form.insuranceExpiry || new Date(Date.now() + 365*86400000).toISOString() })
    onClose()
  }
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <span className="admin-modal-title">Add New Vehicle</span>
          <button className="admin-btn admin-btn-icon admin-btn-ghost" onClick={onClose}><X size={14} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Vehicle Name</label>
                <input className="admin-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Registration Number</label>
                <input className="admin-input" required value={form.registrationNumber} onChange={e => setForm(f => ({ ...f, registrationNumber: e.target.value }))} />
              </div>
            </div>
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Category</label>
                <select className="admin-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {['Standard','Executive','Luxury'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Capacity</label>
                <input className="admin-input" type="number" min={1} value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: +e.target.value }))} />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Pricing Model</label>
              <select className="admin-select" value={form.pricingCategory} onChange={e => setForm(f => ({ ...f, pricingCategory: e.target.value }))}>
                <option value="hiace">Standard (Hiace)</option>
                <option value="coaster">Coaster Engine</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Insurance Expiry</label>
              <input className="admin-input" type="date" value={form.insuranceExpiry.slice(0,10)} onChange={e => setForm(f => ({ ...f, insuranceExpiry: new Date(e.target.value).toISOString() }))} />
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary"><Plus size={13} /> Add Vehicle</button>
          </div>
        </form>
      </div>
    </div>
  )
}
