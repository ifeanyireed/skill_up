// ============================================================================
// Skill Up Academy Check-in portal — Page 9: Instructor Management (Admin)
// Dynamic calls connected to Go + GORM MySQL backend
// ============================================================================
import React, { useState, useEffect } from 'react'
import {
  UserPlus,
  Search,
  X,
  Mail,
  Phone,
  Loader2
} from 'lucide-react'
import '../admin.css'
import { getUsers, createUser, toggleUserStatus, BackendUser } from '../services/api'

export function InstructorsPage() {
  const [staffList, setStaffList] = useState<BackendUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  // Add Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'Administrator' | 'Instructor'>('Instructor')
  const [assignedGroup, setAssignedGroup] = useState('Junior Champions (Ages 7-9)')
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setStaffList(data)
    } catch (err) {
      console.warn('Backend connection error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredStaff = staffList.filter((s) =>
    !search ||
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleUserStatus(id)
      loadData()
    } catch (err: any) {
      alert(err.message || 'Failed to update account status')
    }
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setSubmitting(true)
    try {
      await createUser({
        full_name: name.trim(),
        email: email.trim(),
        phone: phone || '+1 (555) 100-2000',
        role: role,
        assigned_group: assignedGroup,
        status: 'Active',
      })
      setShowAddModal(false)
      setName('')
      setEmail('')
      setPhone('')
      loadData()
    } catch (err: any) {
      alert(err.message || 'Failed to create instructor account')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Instructor & Staff Management</div>
          <div className="admin-page-desc">
            Manage system access roles, instructor group assignments, and staff account statuses in MySQL
          </div>
        </div>

        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={14} /> Add Instructor / Admin
          </button>
        </div>
      </div>

      {/* Toolbar Search */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search size={13} color="var(--adm-text-3)" />
          <input
            placeholder="Search staff name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '260px' }}
          />
        </div>
      </div>

      {/* Staff List Grid / Cards */}
      {loading ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Loader2 size={20} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
          <div>Loading staff directory from MySQL...</div>
        </div>
      ) : (
        <div className="admin-grid-3">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="admin-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: staff.status === 'Disabled' ? 0.6 : 1
              }}
            >
              <div>
                <div style={{ display: 'flex', items: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <img
                    src={staff.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'}
                    alt={staff.full_name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--adm-text-1)' }}>
                      {staff.full_name}
                    </div>
                    <span
                      className={`admin-badge ${staff.role === 'Administrator' ? 'admin-badge-accent' : 'admin-badge-gray'}`}
                      style={{ marginTop: '0.25rem', display: 'inline-flex' }}
                    >
                      {staff.role}
                    </span>
                  </div>
                </div>

                {/* Contact Details */}
                <div style={{ fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '0.375rem', borderTop: '1px solid var(--adm-border)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--adm-text-2)' }}>
                    <Mail size={13} color="var(--adm-text-3)" />
                    <span>{staff.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--adm-text-2)' }}>
                    <Phone size={13} color="var(--adm-text-3)" />
                    <span style={{ fontFamily: 'monospace' }}>{staff.phone}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--adm-text-3)', marginTop: '0.25rem' }}>
                    Assignment: <strong style={{ color: 'var(--adm-text-1)' }}>{staff.assigned_group}</strong>
                  </div>
                </div>
              </div>

              {/* Footer Status & Toggle Button */}
              <div
                style={{
                  marginTop: '1.25rem',
                  borderTop: '1px solid var(--adm-border)',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span className={`admin-badge ${staff.status === 'Active' ? 'admin-badge-green' : 'admin-badge-red'}`}>
                  {staff.status}
                </span>

                <button
                  className={`admin-btn admin-btn-sm ${staff.status === 'Active' ? 'admin-btn-ghost' : 'admin-btn-primary'}`}
                  onClick={() => handleToggleStatus(staff.id)}
                >
                  {staff.status === 'Active' ? 'Disable Account' : 'Enable Account'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Staff Modal Popup */}
      {showAddModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: '460px' }}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">Add Instructor / Admin</div>
              <button className="admin-btn admin-btn-icon admin-btn-ghost" onClick={() => setShowAddModal(false)}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-label admin-label-req">Full Name</label>
                  <input
                    className="admin-input"
                    type="text"
                    required
                    placeholder="e.g. Coach David Miller"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label admin-label-req">Email Address</label>
                  <input
                    className="admin-input"
                    type="email"
                    required
                    placeholder="instructor@skillup.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Phone Number</label>
                  <input
                    className="admin-input"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">System Role</label>
                    <select
                      className="admin-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                    >
                      <option value="Instructor">Instructor</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Assigned Class Group</label>
                    <select
                      className="admin-select"
                      value={assignedGroup}
                      onChange={(e) => setAssignedGroup(e.target.value)}
                    >
                      <option value="Little Dragons (Ages 4-6)">Little Dragons (Ages 4-6)</option>
                      <option value="Junior Champions (Ages 7-9)">Junior Champions (Ages 7-9)</option>
                      <option value="Elite Athletes (Ages 10-14)">Elite Athletes (Ages 10-14)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="admin-btn admin-btn-primary">
                  {submitting ? 'Saving...' : 'Create Staff Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
