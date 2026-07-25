// ============================================================================
// NETS Admin — Promotions Management
// ============================================================================
import { useState } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save } from 'lucide-react'
import { useAdminStore, type Promotion } from '../store/useAdminStore'

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

const statusBadge: Record<string, string> = {
  active: 'admin-badge-green', scheduled: 'admin-badge-accent',
  expired: 'admin-badge-gray', draft: 'admin-badge-yellow',
}

export function PromotionsPage() {
  const { promotions, addPromotion, updatePromotion, deletePromotion } = useAdminStore()
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Promotion | null>(null)

  return (
    <>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Promotions Management</div>
          <div className="admin-page-desc">{promotions.filter(p => p.status === 'active').length} active · {promotions.length} total</div>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setShowCreate(true)}><Plus size={14} /> Create Promotion</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {promotions.map(p => (
          <div key={p.id} className="admin-card" style={{ padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</span>
                  <span className={`admin-badge ${statusBadge[p.status]}`}>{p.status}</span>
                  <span className="admin-badge admin-badge-gray">{p.type}</span>
                  {p.priority === 1 && <span className="admin-badge admin-badge-accent">Priority</span>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--adm-text-2)', marginBottom: '0.375rem' }}>{p.description}</div>
                <div style={{ fontSize: 12, color: 'var(--adm-text-3)' }}>
                  {fmtDate(p.startDate)} → {fmtDate(p.endDate)} · CTA: "{p.ctaText}" → {p.ctaUrl}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className={`admin-toggle ${p.visible ? 'on' : ''}`}
                  title={p.visible ? 'Visible' : 'Hidden'}
                  onClick={() => updatePromotion(p.id, { visible: !p.visible })} />
                <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setEditing(p)}><Edit2 size={12} /></button>
                <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => { if (confirm('Delete this promotion?')) deletePromotion(p.id) }}><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
        {promotions.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--adm-text-3)', padding: '4rem', fontSize: 14 }}>No promotions yet. Create your first promotion.</div>
        )}
      </div>

      {(showCreate || editing) && (
        <PromotionModal
          promo={editing}
          onClose={() => { setShowCreate(false); setEditing(null) }}
          onSave={(data) => {
            if (editing) updatePromotion(editing.id, data)
            else addPromotion({ ...data, status: 'draft' } as any)
            setShowCreate(false); setEditing(null)
          }}
        />
      )}
    </>
  )
}

function PromotionModal({ promo, onClose, onSave }: { promo: Promotion | null, onClose: () => void, onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    title: promo?.title ?? '',
    type: promo?.type ?? 'offer',
    description: promo?.description ?? '',
    startDate: promo?.startDate.slice(0, 10) ?? '',
    endDate: promo?.endDate.slice(0, 10) ?? '',
    visible: promo?.visible ?? true,
    ctaText: promo?.ctaText ?? 'Get a Quote',
    ctaUrl: promo?.ctaUrl ?? '/plan',
    priority: promo?.priority ?? 3,
  })

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <span className="admin-modal-title">{promo ? 'Edit Promotion' : 'Create Promotion'}</span>
          <button className="admin-btn admin-btn-icon admin-btn-ghost" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="admin-modal-body">
          <div className="admin-form-group">
            <label className="admin-label admin-label-req">Title</label>
            <input className="admin-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="admin-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">Type</label>
              <select className="admin-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}>
                {['banner','offer','campaign'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Priority</label>
              <select className="admin-select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: +e.target.value }))}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Description</label>
            <textarea className="admin-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="admin-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">Start Date</label>
              <input className="admin-input" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">End Date</label>
              <input className="admin-input" type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <div className="admin-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">CTA Button Text</label>
              <input className="admin-input" value={form.ctaText} onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">CTA URL</label>
              <input className="admin-input" value={form.ctaUrl} onChange={e => setForm(f => ({ ...f, ctaUrl: e.target.value }))} />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.visible} onChange={e => setForm(f => ({ ...f, visible: e.target.checked }))} /> Visible on website immediately
          </label>
        </div>
        <div className="admin-modal-footer">
          <button className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="admin-btn admin-btn-primary" onClick={() => onSave({ ...form, startDate: new Date(form.startDate).toISOString(), endDate: new Date(form.endDate).toISOString() })}>
            <Save size={13} /> {promo ? 'Save Changes' : 'Create Promotion'}
          </button>
        </div>
      </div>
    </div>
  )
}
