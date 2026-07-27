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
  Building2,
  Trash2
} from 'lucide-react'
import '../admin.css'
import { getChildren, deleteChild, updateChildCenter, BackendChild } from '../services/api'
import { useAdminStore } from '../store/useAdminStore'

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
  const { session } = useAdminStore()
  const isAdmin = session.user?.role === 'Lead Admin' || session.user?.role === 'Administrator'

  const [children, setChildren] = useState<BackendChild[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [centerFilter, setCenterFilter] = useState('all')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

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
    setCurrentPage(1)
  }, [search, statusFilter, centerFilter])

  const handleDeleteChild = async (id: number, name: string, studentId: string) => {
    if (!isAdmin) {
      alert('Unauthorized: Only system Administrators can delete child records.')
      return
    }
    if (window.confirm(`Are you sure you want to permanently delete student "${name}" (${studentId}) from the directory?`)) {
      try {
        await deleteChild(id)
        setSelectedChild(null)
        loadData()
      } catch (err: any) {
        alert(err.message || 'Failed to delete student record')
      }
    }
  }

  const handleCenterChange = async (childId: number, newCenter: string) => {
    try {
      const updated = await updateChildCenter(childId, newCenter)
      if (selectedChild && selectedChild.id === childId) {
        setSelectedChild(updated)
      }
      loadData()
    } catch (err: any) {
      alert(err.message || 'Failed to update center')
    }
  }

  // Pagination Calculations
  const totalItems = children.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedChildren = children.slice(startIndex, endIndex)

  // Render Pagination Bar Component
  const renderPaginationBar = (position: 'top' | 'bottom') => {
    if (loading || children.length === 0) return null
    return (
      <div
        style={{
          padding: '0.75rem 1.25rem',
          borderTop: position === 'bottom' ? '1px solid var(--adm-border)' : 'none',
          borderBottom: position === 'top' ? '1px solid var(--adm-border)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'var(--adm-surface)'
        }}
      >
        {/* Range summary & Page Size Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '13px', color: 'var(--adm-text-2)' }}>
          <span>
            Showing <strong>{startIndex + 1}</strong> to <strong>{endIndex}</strong> of <strong>{totalItems}</strong> students
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span>Show:</span>
            <select
              className="admin-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              style={{ height: '30px', padding: '0 0.5rem', fontSize: '12px', fontWeight: 600 }}
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        {/* Page Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            title="First Page"
          >
            « First
          </button>
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            title="Previous Page"
          >
            ‹ Prev
          </button>

          {/* Page Number Buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
            .map((p, idx, arr) => {
              const showEllipsis = idx > 0 && p - arr[idx - 1] > 1
              return (
                <React.Fragment key={p}>
                  {showEllipsis && <span style={{ padding: '0 0.25rem', color: 'var(--adm-text-3)' }}>...</span>}
                  <button
                    className={`admin-btn admin-btn-sm ${currentPage === p ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                    onClick={() => setCurrentPage(p)}
                    style={{ minWidth: '34px', justifyContent: 'center', fontWeight: currentPage === p ? 800 : 500 }}
                  >
                    {p}
                  </button>
                </React.Fragment>
              )
            })}

          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            title="Next Page"
          >
            Next ›
          </button>
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            title="Last Page"
          >
            Last »
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Child Students Directory</h1>
          <p className="admin-page-desc">
            View, search, and manage registered student profiles & pickup verification status
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="admin-btn admin-btn-accent" onClick={() => navigate('/register')}>
            <Plus size={16} /> Public Parent Register Form
          </button>
          {isAdmin && (
            <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/children/register')}>
              <Plus size={16} /> Admin Register Student
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
          <div className="admin-search-wrap" style={{ flex: 1 }}>
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              className="admin-input admin-search-input"
              placeholder="Search by student name, ID, PIN, or parent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Center Location Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={16} color="var(--adm-accent)" />
          <select
            className="admin-select"
            value={centerFilter}
            onChange={(e) => setCenterFilter(e.target.value)}
            style={{ width: '170px', height: '36px', fontWeight: 600 }}
          >
            <option value="all">All Centers (Raji & Festac)</option>
            <option value="Raji Rasaki Centre">Raji Rasaki Centre</option>
            <option value="Festac Centre">Festac Centre</option>
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
        {/* Top Pagination Controller */}
        {renderPaginationBar('top')}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student ID & Name</th>
                <th>Center & Training Track</th>
                <th>School & Grade</th>
                <th>Device & Payment</th>
                <th>Parent Contact & Address</th>
                <th>Status & PIN</th>
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
                paginatedChildren.map((child) => (
                  <tr
                    key={child.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedChild(child)}
                  >
                    {/* Student ID & Name */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={child.photo || '/avatars/character1.jpg'}
                          alt={child.full_name}
                          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--adm-accent)' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--adm-text-1)' }}>{child.full_name}</div>
                          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--adm-accent)', fontWeight: 700 }}>
                            {child.student_id}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--adm-text-3)' }}>
                            {child.age ? `${child.age} yrs` : ''}{child.gender ? ` • ${child.gender}` : ''}{child.dob ? ` • DOB: ${child.dob}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Center & Track */}
                    <td>
                      <select
                        className="admin-select"
                        value={child.center || 'Raji Rasaki Centre'}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleCenterChange(child.id, e.target.value)}
                        style={{ fontSize: '11.5px', padding: '0.2rem 0.4rem', height: '28px', minWidth: '140px', fontWeight: 600 }}
                      >
                        <option value="Raji Rasaki Centre">Raji Rasaki Centre</option>
                        <option value="Festac Centre">Festac Centre</option>
                      </select>
                      <div style={{ fontSize: '11px', color: 'var(--adm-text-2)', marginTop: '2px', fontWeight: 600 }}>{child.group}</div>
                      {child.senior_track && child.senior_track !== 'N/A - Junior Camp' && (
                        <div style={{ fontSize: '10.5px', color: 'var(--adm-accent)', fontWeight: 600, maxWidth: '170px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          Track: {child.senior_track}
                        </div>
                      )}
                    </td>

                    {/* School & Grade */}
                    <td>
                      <div style={{ fontSize: 12, color: 'var(--adm-text-1)', fontWeight: 600 }}>
                        {child.school_name || 'N/A'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>
                        Grade: {child.current_grade || 'N/A'}
                      </div>
                    </td>

                    {/* Device & Payment */}
                    <td>
                      <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 700 }}>
                        {child.payment_status || 'Full Payment'} (₦{child.amount_paid ? child.amount_paid.toLocaleString() : '50,000'})
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--adm-text-2)' }}>
                        Device: {child.owns_device || 'N/A'} {child.device_type ? `(${child.device_type})` : ''}
                      </div>
                    </td>

                    {/* Parent Contact & Address */}
                    <td>
                      <div style={{ fontSize: 12, color: 'var(--adm-text-1)', fontWeight: 600 }}>{child.parent_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>
                        {child.parent_relationship || 'Parent'} • {child.parent_phone}
                      </div>
                      {child.alt_phone && (
                        <div style={{ fontSize: 10.5, color: 'var(--adm-text-3)' }}>
                          Alt: {child.alt_phone}
                        </div>
                      )}
                      {child.home_address && (
                        <div style={{ fontSize: 10.5, color: 'var(--adm-text-3)', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {child.home_address}
                        </div>
                      )}
                    </td>

                    {/* Status & PIN */}
                    <td>
                      <span className={getStatusBadgeClass(child.status)}>{child.status}</span>
                      <div style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--adm-accent)', fontSize: '12px', marginTop: '2px' }}>
                        {child.active_code ? `#${child.active_code}` : '—'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedChild(child)
                          }}
                        >
                          Full Profile
                        </button>
                        {isAdmin && (
                          <button
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            style={{ color: 'var(--adm-danger)' }}
                            title="Delete Student Record (Admins Only)"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteChild(child.id, child.full_name, child.student_id)
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination Controller Bar */}
        {renderPaginationBar('bottom')}
      </div>

      {/* Child Details Slide-Over Drawer with ALL Registration Fields */}
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
              maxWidth: '520px',
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
            {/* Header Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="admin-badge admin-badge-accent">Complete Student Record</span>
              <button
                className="admin-btn admin-btn-icon admin-btn-ghost"
                onClick={() => setSelectedChild(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--adm-surface-2)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--adm-border)' }}>
              <img
                src={selectedChild.photo || '/avatars/character1.jpg'}
                alt={selectedChild.full_name}
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2.5px solid var(--adm-accent)' }}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--adm-text-1)', margin: 0 }}>
                  {selectedChild.full_name}
                </h2>
                <div style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 800, color: 'var(--adm-accent)' }}>
                  {selectedChild.student_id}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--adm-text-3)', marginTop: '2px' }}>
                  {selectedChild.gender} • {selectedChild.age} Years Old • DOB: {selectedChild.dob || 'N/A'}
                </div>
              </div>
            </div>

            {/* Status & Security Code */}
            <div style={{ padding: '0.875rem', background: 'var(--adm-surface-2)', borderRadius: '8px', border: '1px solid var(--adm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--adm-text-3)', textTransform: 'uppercase', fontWeight: 700 }}>Check-In Status</div>
                <span className={getStatusBadgeClass(selectedChild.status)}>{selectedChild.status}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--adm-text-3)', textTransform: 'uppercase', fontWeight: 700 }}>Active Verification PIN</div>
                <span style={{ fontWeight: 900, fontFamily: 'monospace', fontSize: 18, color: 'var(--adm-accent)' }}>
                  {selectedChild.active_code ? `#${selectedChild.active_code}` : 'None'}
                </span>
              </div>
            </div>

            {/* SECTION 1: CENTER & CAMP TRACK */}
            <div style={{ padding: '1rem', background: 'var(--adm-surface-2)', borderRadius: '8px', border: '1px solid var(--adm-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--adm-accent)', letterSpacing: '0.05em' }}>
                1. Center & Camp Program Track
              </div>
              <div style={{ fontSize: 13, color: 'var(--adm-text-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Assigned Center:</span>
                <select
                  className="admin-select"
                  value={selectedChild.center || 'Raji Rasaki Centre'}
                  onChange={(e) => handleCenterChange(selectedChild.id, e.target.value)}
                  style={{ fontSize: '12px', height: '28px', padding: '0 0.5rem', fontWeight: 700 }}
                >
                  <option value="Raji Rasaki Centre">Raji Rasaki Centre</option>
                  <option value="Festac Centre">Festac Centre</option>
                </select>
              </div>
              <div style={{ fontSize: 13, color: 'var(--adm-text-1)' }}>Camp Group: <strong>{selectedChild.group}</strong></div>
              <div style={{ fontSize: 12.5, color: 'var(--adm-accent)', fontWeight: 700 }}>
                Senior Track: {selectedChild.senior_track || 'N/A - Junior Camp'}
              </div>
            </div>

            {/* SECTION 2: ACADEMIC & SCHOOL DETAILS */}
            <div style={{ padding: '1rem', background: 'var(--adm-surface-2)', borderRadius: '8px', border: '1px solid var(--adm-border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--adm-accent)', letterSpacing: '0.05em' }}>
                2. Academic & School Information
              </div>
              <div style={{ fontSize: 13, color: 'var(--adm-text-1)' }}>School Name: <strong>{selectedChild.school_name || 'N/A'}</strong></div>
              <div style={{ fontSize: 13, color: 'var(--adm-text-1)' }}>Current Class / Grade: <strong>{selectedChild.current_grade || 'N/A'}</strong></div>
            </div>

            {/* SECTION 3: DEVICE INFORMATION */}
            <div style={{ padding: '1rem', background: 'var(--adm-surface-2)', borderRadius: '8px', border: '1px solid var(--adm-border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--adm-accent)', letterSpacing: '0.05em' }}>
                3. Device Ownership & Type
              </div>
              <div style={{ fontSize: 13, color: 'var(--adm-text-1)' }}>Owns Personal Device: <strong>{selectedChild.owns_device || 'No'}</strong></div>
              {selectedChild.owns_device === 'Yes' && (
                <div style={{ fontSize: 13, color: 'var(--adm-text-1)' }}>Device Type: <strong>{selectedChild.device_type || 'N/A'}</strong></div>
              )}
            </div>

            {/* SECTION 4: PAYMENT & FEES */}
            <div style={{ padding: '1rem', background: 'var(--adm-surface-2)', borderRadius: '8px', border: '1px solid var(--adm-border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--adm-accent)', letterSpacing: '0.05em' }}>
                4. Payment & Fee Details
              </div>
              <div style={{ fontSize: 13, color: '#16A34A', fontWeight: 800 }}>Payment Status: {selectedChild.payment_status || 'Full Payment'}</div>
              <div style={{ fontSize: 13, color: 'var(--adm-text-1)' }}>Amount Paid: <strong>₦{selectedChild.amount_paid ? selectedChild.amount_paid.toLocaleString() : '50,000'}</strong></div>
              <div style={{ fontSize: 12, color: 'var(--adm-text-3)' }}>Payment Date: {selectedChild.payment_date || 'N/A'}</div>
            </div>

            {/* SECTION 5: PARENT / GUARDIAN CONTACT */}
            <div style={{ padding: '1rem', background: 'var(--adm-surface-2)', borderRadius: '8px', border: '1px solid var(--adm-border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--adm-accent)', letterSpacing: '0.05em' }}>
                5. Parent / Guardian & Home Address
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--adm-text-1)' }}>{selectedChild.parent_name} ({selectedChild.parent_relationship || 'Parent'})</div>
              <div style={{ fontSize: 12.5, color: 'var(--adm-text-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={13} /> Primary Phone: <strong>{selectedChild.parent_phone}</strong>
              </div>
              {selectedChild.alt_phone && (
                <div style={{ fontSize: 12.5, color: 'var(--adm-text-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Phone size={13} /> Alternative Phone: {selectedChild.alt_phone}
                </div>
              )}
              {selectedChild.parent_email && (
                <div style={{ fontSize: 12.5, color: 'var(--adm-text-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={13} /> Email: {selectedChild.parent_email}
                </div>
              )}
              {selectedChild.home_address && (
                <div style={{ fontSize: 12.5, color: 'var(--adm-text-2)', marginTop: 2 }}>
                  Home Address: <strong>{selectedChild.home_address}</strong>
                </div>
              )}
            </div>

            {/* SECTION 6: MARKETING & REFERRAL SOURCE */}
            <div style={{ padding: '1rem', background: 'var(--adm-surface-2)', borderRadius: '8px', border: '1px solid var(--adm-border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--adm-accent)', letterSpacing: '0.05em' }}>
                6. Marketing & Referral Source
              </div>
              <div style={{ fontSize: 13, color: 'var(--adm-text-1)' }}>How they heard about us: <strong>{selectedChild.referral_source || 'Walk-In'}</strong></div>
            </div>

            {/* SECTION 7: MEDICAL CONDITIONS & EXTRA NOTES */}
            <div style={{ padding: '1rem', background: 'var(--adm-surface-2)', borderRadius: '8px', border: '1px solid var(--adm-border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--adm-accent)', letterSpacing: '0.05em' }}>
                7. Medical Conditions & Extra Notes
              </div>
              <div style={{ fontSize: 13, color: selectedChild.medical_notes && selectedChild.medical_notes !== 'None' && selectedChild.medical_notes !== 'No' ? 'var(--adm-danger)' : 'var(--adm-text-1)', fontWeight: selectedChild.medical_notes && selectedChild.medical_notes !== 'None' ? 700 : 400 }}>
                Medical / Allergies: {selectedChild.medical_notes || 'None'}
              </div>
              {selectedChild.additional_notes && (
                <div style={{ fontSize: 12.5, color: 'var(--adm-text-2)', marginTop: 2 }}>
                  Additional Notes: {selectedChild.additional_notes}
                </div>
              )}
            </div>

            {/* SECTION 8: SAFETY CONSENTS */}
            <div style={{ padding: '1rem', background: 'var(--adm-surface-2)', borderRadius: '8px', border: '1px solid var(--adm-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--adm-accent)', letterSpacing: '0.05em' }}>
                8. Safety & Media Consent
              </div>
              <span className="admin-badge admin-badge-green" style={{ fontWeight: 700 }}>
                ✓ Consents Granted ({selectedChild.consent_given ? 'Yes' : 'No'})
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="admin-btn admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => navigate('/admin/checkin')}
                >
                  <LogIn size={14} /> Check In Student
                </button>
                <button
                  className="admin-btn admin-btn-ghost"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => navigate('/admin/checkout')}
                >
                  <KeyRound size={14} /> Verify Pickup PIN
                </button>
              </div>

              {isAdmin && (
                <button
                  className="admin-btn admin-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', color: 'var(--adm-danger)', borderColor: 'var(--adm-danger)' }}
                  onClick={() => handleDeleteChild(selectedChild.id, selectedChild.full_name, selectedChild.student_id)}
                >
                  <Trash2 size={14} /> Delete Student Record
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
