// ============================================================================
// Skill Up Academy Check-in portal — Page 3: Children Directory
// Connected to Go + GORM MySQL backend with Center Filter (Raji Rasaki vs CBT Centre)
// ============================================================================
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  ShieldAlert,
  X,
  LogIn,
  KeyRound,
  Loader2,
  Building2
} from 'lucide-react'
import '../admin.css'
import { getChildren, BackendChild } from '../services/api'

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Checked Out':
      return 'admin-badge admin-badge-green'
    case 'Waiting Pickup':
      return 'admin-badge admin-badge-yellow'
    case 'Checked In':
      return 'admin-badge admin-badge-accent'
    case 'Not Checked In':
    default:
      return 'admin-badge admin-badge-gray'
  }
}

export function ChildrenDirectoryPage() {
  const navigate = useNavigate()
  const [children, setChildren] = useState<BackendChild[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [centerFilter, setCenterFilter] = useState('all')

  // Selected Child Drawer
  const [selectedChild, setSelectedChild] = useState<BackendChild | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getChildren(statusFilter, search, centerFilter)
      setChildren(data)
    } catch (err) {
      console.warn('Backend connection error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [search, statusFilter, centerFilter])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Children Directory</div>
          <div className="admin-page-desc">
            Enrolled student records across Raji Rasaki Centre & CBT Centre
          </div>
        </div>

        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/register')}>
            <Plus size={14} /> Register New Child
          </button>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="admin-toolbar" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Search */}
        <div className="admin-toolbar-search">
          <Search size={14} color="var(--adm-text-3)" />
          <input
            type="text"
            placeholder="Search by student name, ID, parent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Center Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Building2 size={14} color="var(--adm-text-3)" />
          <select
            className="admin-select"
            value={centerFilter}
            onChange={(e) => setCenterFilter(e.target.value)}
            style={{ width: '160px', height: '36px' }}
          >
            <option value="all">All Centers</option>
            <option value="Raji Rasaki Centre">Raji Rasaki Centre</option>
            <option value="CBT Centre">CBT Centre</option>
          </select>
        </div>

        {/* Status Filter */}
        <select
          className="admin-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: '150px', height: '36px' }}
        >
          <option value="all">All Statuses</option>
          <option value="Checked In">Checked In</option>
          <option value="Waiting Pickup">Waiting Pickup</option>
          <option value="Checked Out">Checked Out</option>
          <option value="Not Checked In">Not Checked In</option>
        </select>
      </div>

      {/* Table & Cards View */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student ID & Name</th>
                <th>Center</th>
                <th>Training Group</th>
                <th>Parent / Guardian</th>
                <th>Status</th>
                <th>Active PIN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="admin-table-empty">
                    <Loader2 size={18} className="animate-spin" style={{ margin: '0 auto' }} /> Loading children from MySQL...
                  </td>
                </tr>
              ) : children.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-table-empty">
                    No matching child records found
                  </td>
                </tr>
              ) : (
                children.map((child) => (
                  <tr
                    key={child.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedChild(child)}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={child.photo || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=250'}
                          alt={child.full_name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--adm-text-1)' }}>{child.full_name}</div>
                          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--adm-accent)', fontWeight: 600 }}>
                            {child.student_id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="admin-badge admin-badge-gray" style={{ fontSize: '11px' }}>
                        {child.center || 'CBT Centre'}
                      </span>
                    </td>

                    <td style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>{child.group}</td>

                    <td>
                      <div style={{ fontSize: 12, color: 'var(--adm-text-1)', fontWeight: 500 }}>{child.parent_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>
                        {child.parent_relationship} • {child.parent_phone}
                      </div>
                    </td>

                    <td>
                      <span className={getStatusBadgeClass(child.status)}>{child.status}</span>
                    </td>

                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--adm-accent)' }}>
                      {child.active_code ? `#${child.active_code}` : '—'}
                    </td>

                    <td>
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedChild(child)
                        }}
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Child Details Slide-Over Drawer */}
      {selectedChild && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 300,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setSelectedChild(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              height: '100%',
              background: 'var(--adm-surface)',
              borderLeft: '1px solid var(--adm-border)',
              padding: '1.5rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: 'var(--adm-shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="admin-badge admin-badge-accent">Student Profile</span>
              <button
                className="admin-btn admin-btn-icon admin-btn-ghost"
                onClick={() => setSelectedChild(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={selectedChild.photo || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=250'}
                alt={selectedChild.full_name}
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--adm-accent)' }}
              />
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--adm-text-1)', margin: 0 }}>
                  {selectedChild.full_name}
                </h2>
                <div style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--adm-accent)' }}>
                  {selectedChild.student_id}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--adm-text-3)' }}>
                  Center: <strong>{selectedChild.center || 'CBT Centre'}</strong>
                </div>
              </div>
            </div>

            {/* Status & PIN Card */}
            <div style={{ padding: '1rem', background: 'var(--adm-surface-2)', borderRadius: 'var(--adm-radius-sm)', border: '1px solid var(--adm-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: 12, color: 'var(--adm-text-3)' }}>Current Status:</span>
                <span className={getStatusBadgeClass(selectedChild.status)}>{selectedChild.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--adm-text-3)' }}>Active 6-Digit PIN:</span>
                <span style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: 16, color: 'var(--adm-accent)' }}>
                  {selectedChild.active_code ? `#${selectedChild.active_code}` : 'None'}
                </span>
              </div>
            </div>

            {/* Medical Notes */}
            {selectedChild.medical_notes && (
              <div className="admin-alert admin-alert-warning">
                <ShieldAlert size={16} />
                <div>
                  <strong>Medical & Allergy Warning:</strong>
                  <div>{selectedChild.medical_notes}</div>
                </div>
              </div>
            )}

            {/* Guardian Info */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--adm-text-3)', marginBottom: '0.5rem' }}>
                Primary Parent Contact
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--adm-text-1)' }}>{selectedChild.parent_name}</div>
              <div style={{ fontSize: 12, color: 'var(--adm-text-2)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <Phone size={12} /> {selectedChild.parent_phone} ({selectedChild.parent_relationship})
              </div>
              {selectedChild.parent_email && (
                <div style={{ fontSize: 12, color: 'var(--adm-text-2)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Mail size={12} /> {selectedChild.parent_email}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
              <button
                className="admin-btn admin-btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => navigate('/admin/checkin')}
              >
                <LogIn size={14} /> Check In
              </button>
              <button
                className="admin-btn admin-btn-ghost"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => navigate('/admin/checkout')}
              >
                <KeyRound size={14} /> Verify PIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
