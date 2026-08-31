import React, { useEffect, useState } from 'react'
import { Plus, Trash2, Award, FileImage, LayoutTemplate, ShieldCheck } from 'lucide-react'
import { API_BASE_URL } from '../services/api'
import { useAdminStore, isAdminUser } from '../store/useAdminStore'
import '../admin.css'

interface CertConfig {
  id: number
  category_type: string
  category_name: string
  template_url: string
}

export function AdminCertificatesPage() {
  const { session } = useAdminStore()
  const isAdmin = isAdminUser(session.user)
  const [configs, setConfigs] = useState<CertConfig[]>([])
  const [loading, setLoading] = useState(false)

  // Form State
  const [categoryType, setCategoryType] = useState('Group')
  const [categoryName, setCategoryName] = useState('Junior Camp (5–10 years)')
  const [templateUrl, setTemplateUrl] = useState('/cert-junior.png')

  const fetchConfigs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/certificates`)
      const data = await res.json()
      setConfigs(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchConfigs()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch(`${API_BASE_URL}/admin/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_type: categoryType,
          category_name: categoryName,
          template_url: templateUrl
        })
      })
      await fetchConfigs()
    } catch (err) {
      alert('Error saving configuration.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this mapping?')) return
    try {
      await fetch(`${API_BASE_URL}/admin/certificates/${id}`, {
        method: 'DELETE'
      })
      await fetchConfigs()
    } catch (err) {
      alert('Error deleting configuration.')
    }
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
        <ShieldCheck size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
        <h2>Super Admin Access Required</h2>
        <p>You do not have permission to modify certificate templates.</p>
      </div>
    )
  }

  return (
    <div className="admin-page" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ background: '#FEF2F2', padding: '0.75rem', borderRadius: '12px', color: '#C40000' }}>
          <Award size={28} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Certificate Templates</h1>
          <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>Assign dynamic graphics to specific Groups or Tracks.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Mapping Form */}
        <div style={{ background: '#FFF', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', height: 'fit-content' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LayoutTemplate size={18} color="#C40000" /> Map New Template
          </h2>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px', display: 'block' }}>Map By:</label>
              <select value={categoryType} onChange={(e) => { setCategoryType(e.target.value); setCategoryName(e.target.value === 'Group' ? 'Junior Camp (5–10 years)' : 'Graphics Design (Corel Draw) + Robotics') }} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}>
                <option value="Group">Age Group</option>
                <option value="Track">Senior Track</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px', display: 'block' }}>Target {categoryType}:</label>
              {categoryType === 'Group' ? (
                <select value={categoryName} onChange={(e) => setCategoryName(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}>
                  <option value="Junior Camp (5–10 years)">Junior Camp (5–10 years)</option>
                  <option value="Senior Camp (11+ years)">Senior Camp (11+ years)</option>
                </select>
              ) : (
                <select value={categoryName} onChange={(e) => setCategoryName(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}>
                  <option value="Graphics Design (Corel Draw) + Robotics">Graphics Design (Corel Draw) + Robotics</option>
                  <option value="Cybersecurity + Python Programming">Cybersecurity + Python Programming</option>
                </select>
              )}
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px', display: 'block' }}>Template Image URL:</label>
              <select value={templateUrl} onChange={(e) => setTemplateUrl(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', marginBottom: '0.5rem' }}>
                <option value="/cert-junior.png">Junior IT Template</option>
                <option value="/cert-ai.png">Senior AI & Robotics Template</option>
                <option value="/cert-cyber.png">Senior Cybersecurity Template</option>
                <option value="/certificate-template.png">General / Default Template</option>
                <option value="custom">Custom URL...</option>
              </select>
              {templateUrl === 'custom' && (
                <input
                  type="text"
                  placeholder="https://.../image.png"
                  onChange={(e) => setTemplateUrl(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              )}
            </div>

            <button type="submit" disabled={loading} style={{ background: '#C40000', color: '#FFF', border: 'none', padding: '0.65rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
              <Plus size={16} /> Save Mapping
            </button>
          </form>
        </div>

        {/* Existing Mappings List */}
        <div style={{ background: '#FFF', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            Active Certificate Rules
          </h2>
          {configs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8', fontSize: '13px' }}>
              No templates mapped yet. The default certificate will be used for all students.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {configs.map((c) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '55px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={c.template_url} alt="Template" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Target {c.category_type}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{c.category_name}</div>
                      <div style={{ fontSize: '11px', color: '#0284C7', marginTop: '2px', fontFamily: 'monospace' }}>{c.template_url}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(c.id)} style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
