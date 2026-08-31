import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, GraduationCap, Calendar, Download } from 'lucide-react'
import { getParentChildren, parentLogout } from './parentApi'
import { BackendChild } from '../../admin/services/api'
import { CertificateRenderer } from './CertificateRenderer'

export function ParentDashboard() {
  const navigate = useNavigate()
  const [children, setChildren] = useState<BackendChild[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getParentChildren()
      .then((data) => setChildren(data))
      .catch(() => {
        // If unauthorized, push to login
        parentLogout()
        navigate('/parents/login')
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const handleLogout = () => {
    parentLogout()
    navigate('/parents/login')
  }

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your dashboard...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, color: 'var(--adm-text-1)' }}>Parent Dashboard</h1>
          <button className="admin-btn admin-btn-secondary" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {children.length === 0 ? (
          <div className="admin-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h3 style={{ marginTop: 0 }}>No Children Linked</h3>
            <p style={{ color: 'var(--adm-text-2)' }}>
              We couldn't find any child records matching your registered email or phone number.
              Please contact the academy administrator to update your child's record.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {children.map((child) => (
              <div key={child.id} className="admin-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  
                  {/* Child Info */}
                  <div>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: 'var(--adm-text-1)' }}>
                      {child.full_name}
                    </h2>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--adm-text-2)', fontSize: '0.95rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <GraduationCap size={16} /> 
                        {child.senior_track || child.group}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={16} />
                        Center: {child.center || 'Main Center'}
                      </div>
                    </div>
                  </div>

                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--adm-border)' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Graduation Certificate</h3>
                  <p style={{ color: 'var(--adm-text-2)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Generate and download the official completion certificate for {child.full_name}.
                  </p>
                  
                  {/* Dynamic Certificate Renderer component will load the template and allow PDF export */}
                  <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
                    <CertificateRenderer 
                      studentName={child.full_name} 
                      track={child.senior_track || child.group} 
                      date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
