import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, GraduationCap, Calendar, Download, FileText, User, Award } from 'lucide-react'
import { getParentChildren, parentLogout } from './parentApi'
import { BackendChild, API_BASE_URL } from '../../admin/services/api'
import { CertificateRenderer } from './CertificateRenderer'

interface Document {
  id: number
  title: string
  description: string
  file_url: string
  target_audience: string
  uploaded_by: string
}

export function ParentDashboard() {
  const navigate = useNavigate()
  const [children, setChildren] = useState<BackendChild[]>([])
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'documents'>('overview')

  useEffect(() => {
    Promise.all([
      getParentChildren(),
      fetch(`${API_BASE_URL}/documents?audience=Parents`).then(res => res.json())
    ])
      .then(([childrenData, docsData]) => {
        setChildren(childrenData)
        setDocs(docsData || [])
      })
      .catch(() => {
        parentLogout()
        navigate('/parents/login')
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const handleLogout = () => {
    parentLogout()
    navigate('/parents/login')
  }

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Loading parent dashboard...</div>

  return (
    <div className="admin-shell" style={{ minHeight: '100vh', background: 'var(--adm-bg)', overflow: 'auto' }}>
      
      {/* ── HEADER ── */}
      <header className="admin-header" style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--adm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', background: 'var(--adm-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
            <User size={20} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--adm-text-1)' }}>Parent Portal</h1>
            <div style={{ fontSize: '13px', color: 'var(--adm-text-2)' }}>Skill Up Academy</div>
          </div>
        </div>
        <button className="admin-btn admin-btn-ghost" onClick={handleLogout} style={{ color: 'var(--adm-text-2)' }}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* ── TABS ── */}
        <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--adm-border)', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '2px solid var(--adm-accent)' : '2px solid transparent',
              padding: '0 0.5rem 0.75rem 0.5rem',
              color: activeTab === 'overview' ? 'var(--adm-accent)' : 'var(--adm-text-2)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <GraduationCap size={16} /> My Children
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'documents' ? '2px solid var(--adm-accent)' : '2px solid transparent',
              padding: '0 0.5rem 0.75rem 0.5rem',
              color: activeTab === 'documents' ? 'var(--adm-accent)' : 'var(--adm-text-2)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FileText size={16} /> Documents & Handbooks
          </button>
        </div>

        {/* ── TAB CONTENT ── */}
        {activeTab === 'overview' && (
          <div>
            {children.length === 0 ? (
              <div className="admin-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--adm-text-2)' }}>
                No children linked to your account yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {children.map((child) => (
                  <div key={child.id} className="admin-card" style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--adm-border)', background: 'var(--adm-surface-2)' }}>
                      <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '18px', color: 'var(--adm-text-1)', fontWeight: 800 }}>
                        {child.full_name}
                      </h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--adm-text-2)', fontSize: '13px', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <GraduationCap size={14} color="var(--adm-accent)" /> 
                          {child.senior_track || child.group}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} color="var(--adm-accent)" />
                          {child.center || 'Main Center'}
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '14px', fontWeight: 700, color: 'var(--adm-text-1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Award size={16} color="var(--adm-accent)" /> Certificate of Completion
                      </h3>
                      <p style={{ color: 'var(--adm-text-2)', fontSize: '13px', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                        Download the official graduation certificate. The design will automatically match their registered group and track.
                      </p>
                      
                      <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                        <CertificateRenderer 
                          studentName={child.full_name} 
                          track={child.senior_track || ''} 
                          group={child.group}
                          date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="admin-card" style={{ padding: '0' }}>
            <div className="admin-card-title" style={{ padding: '1.5rem', borderBottom: '1px solid var(--adm-border)' }}>
              Available Documents
            </div>
            {docs.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--adm-text-2)', fontSize: '14px' }}>
                No documents have been uploaded for parents yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {docs.map((d, index) => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '1.5rem', borderBottom: index !== docs.length - 1 ? '1px solid var(--adm-border)' : 'none' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '48px', height: '48px', background: '#FEF2F2', color: '#C40000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--adm-text-1)', marginBottom: '4px' }}>{d.title}</div>
                        <div style={{ fontSize: '13px', color: 'var(--adm-text-2)', marginBottom: '0.75rem', maxWidth: '600px', lineHeight: '1.5' }}>
                          {d.description || 'No additional description.'}
                        </div>
                        <a 
                          href={d.file_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="admin-btn admin-btn-secondary"
                          style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.5rem 0.75rem', fontSize: '12px' }}
                        >
                          <Download size={14} /> Download File
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
