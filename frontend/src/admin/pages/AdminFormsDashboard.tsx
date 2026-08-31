import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, LayoutTemplate, Settings, Users, Link2, Trash2 } from 'lucide-react'
import { getAdminForms, deleteAdminForm, Form } from '../services/formService'
import { isSuperAdmin, useAdminStore } from '../store/useAdminStore'
import '../admin.css'

export function AdminFormsDashboard() {
  const navigate = useNavigate()
  const { session } = useAdminStore()
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  const isSuper = isSuperAdmin(session.user)

  const loadForms = async () => {
    setLoading(true)
    try {
      const data = await getAdminForms()
      setForms(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadForms()
  }, [])

  const handleDelete = async (id: number, title: string) => {
    if (!isSuper) {
      alert('Only Super Admin can delete forms.')
      return
    }
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also delete all submissions.`)) {
      try {
        await deleteAdminForm(id)
        loadForms()
      } catch (err) {
        alert('Failed to delete form.')
      }
    }
  }

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/f/${slug}`
    navigator.clipboard.writeText(url)
    alert('Public form link copied to clipboard!')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Custom Forms</h1>
          <p className="admin-page-desc">Create and manage dynamic registration and data collection forms.</p>
        </div>
        <div>
          <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/forms/new')}>
            <Plus size={16} /> Create New Form
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading forms...</p>
      ) : forms.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <LayoutTemplate size={48} color="var(--adm-text-3)" style={{ margin: '0 auto 1rem' }} />
          <h3>No forms created yet</h3>
          <p style={{ color: 'var(--adm-text-2)' }}>Click the button above to build your first dynamic form.</p>
        </div>
      ) : (
        <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {forms.map((f) => (
            <div key={f.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{f.title}</h3>
                  <span className={`admin-badge ${f.is_active ? 'admin-badge-green' : 'admin-badge-gray'}`}>
                    {f.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p style={{ color: 'var(--adm-text-2)', fontSize: '0.85rem', margin: 0 }}>
                  {f.description || 'No description provided.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => navigate(`/admin/forms/${f.id}/edit`)}
                  title="Edit Form Layout"
                >
                  <Settings size={14} /> Edit
                </button>
                <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => navigate(`/admin/forms/${f.id}/submissions`)}
                  title="View Submissions"
                >
                  <Users size={14} /> Submissions
                </button>
                <button
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => f.slug && copyLink(f.slug)}
                  title="Copy Public Link"
                >
                  <Link2 size={14} /> Link
                </button>
                {isSuper && (
                  <button
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    style={{ color: 'var(--adm-danger)', marginLeft: 'auto' }}
                    onClick={() => f.id && handleDelete(f.id, f.title)}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
