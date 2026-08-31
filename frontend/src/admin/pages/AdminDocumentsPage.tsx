import React, { useEffect, useState } from 'react'
import { FileText, Plus, Trash2, ShieldCheck, Download, Link as LinkIcon } from 'lucide-react'
import { API_BASE_URL } from '../services/api'
import { useAdminStore, isAdminUser } from '../store/useAdminStore'
import '../admin.css'

interface Document {
  id: number
  title: string
  description: string
  file_url: string
  target_audience: string
  uploaded_by: string
}

export function AdminDocumentsPage() {
  const { session } = useAdminStore()
  const isAdmin = isAdminUser(session.user)
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [audience, setAudience] = useState('Staff')

  const fetchDocs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/documents`)
      const data = await res.json()
      setDocs(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch(`${API_BASE_URL}/admin/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          file_url: fileUrl,
          target_audience: audience,
          uploaded_by: session.user?.fullName || 'Admin'
        })
      })
      setTitle('')
      setDescription('')
      setFileUrl('')
      await fetchDocs()
    } catch (err) {
      alert('Error uploading document.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    try {
      await fetch(`${API_BASE_URL}/admin/documents/${id}`, {
        method: 'DELETE'
      })
      await fetchDocs()
    } catch (err) {
      alert('Error deleting document.')
    }
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
        <ShieldCheck size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
        <h2>Super Admin Access Required</h2>
        <p>You do not have permission to manage the document library.</p>
      </div>
    )
  }

  return (
    <div className="admin-page" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ background: '#F0F9FF', padding: '0.75rem', borderRadius: '12px', color: '#0284C7' }}>
          <FileText size={28} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Document Library</h1>
          <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>Upload resources for Staff or Parents.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Upload Form */}
        <div style={{ background: '#FFF', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', height: 'fit-content' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} color="#0284C7" /> Add New Document
          </h2>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px', display: 'block' }}>Document Title *</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }} placeholder="e.g. Camp Code of Conduct" />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px', display: 'block' }}>Description (Optional)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', resize: 'vertical' }} placeholder="Brief description..." />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px', display: 'block' }}>File Link / URL *</label>
              <input type="url" required value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }} placeholder="https://docs.google.com/..." />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px', display: 'block' }}>Visible To *</label>
              <select value={audience} onChange={(e) => setAudience(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}>
                <option value="Staff">Staff Only</option>
                <option value="Parents">Parents Only</option>
              </select>
            </div>

            <button type="submit" disabled={loading} style={{ background: '#0284C7', color: '#FFF', border: 'none', padding: '0.65rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', marginTop: '0.5rem' }}>
              <Plus size={16} /> Publish Document
            </button>
          </form>
        </div>

        {/* Existing Documents List */}
        <div style={{ background: '#FFF', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            Stored Documents
          </h2>
          {docs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8', fontSize: '13px' }}>
              No documents have been uploaded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {docs.map((d) => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', background: d.target_audience === 'Staff' ? '#F3E8FF' : '#DCFCE7', color: d.target_audience === 'Staff' ? '#7E22CE' : '#16A34A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{d.title}</div>
                        <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: d.target_audience === 'Staff' ? '#F3E8FF' : '#DCFCE7', color: d.target_audience === 'Staff' ? '#7E22CE' : '#16A34A', textTransform: 'uppercase' }}>
                          {d.target_audience}
                        </span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '4px', maxWidth: '300px' }}>{d.description || 'No description provided.'}</div>
                      
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                        <a href={d.file_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#0284C7', textDecoration: 'none' }}>
                          <LinkIcon size={14} /> Open Link
                        </a>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(d.id)} style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}>
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
