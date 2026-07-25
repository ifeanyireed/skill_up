// ============================================================================
// Skill Up Academy Check-in portal — Page 6: Today's Attendance Monitor
// Dynamic calls connected to Go + GORM MySQL backend
// ============================================================================
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  LogIn,
  KeyRound,
  CheckCircle2,
  Clock,
  UserCheck,
  Loader2
} from 'lucide-react'
import '../admin.css'
import { getChildren, updateChildStatus, BackendChild } from '../services/api'

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Checked Out':
      return <span className="admin-badge admin-badge-green"><CheckCircle2 size={10} /> Checked Out</span>
    case 'Waiting Pickup':
      return <span className="admin-badge admin-badge-yellow"><Clock size={10} /> Waiting Pickup</span>
    case 'Checked In':
      return <span className="admin-badge admin-badge-blue"><UserCheck size={10} /> Checked In</span>
    default:
      return <span className="admin-badge admin-badge-gray">Not Checked In</span>
  }
}

export function AttendancePage() {
  const navigate = useNavigate()
  const [children, setChildren] = useState<BackendChild[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Checked In' | 'Waiting Pickup' | 'Checked Out' | 'Not Checked In'>('all')

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getChildren(statusFilter, search)
      setChildren(data)
    } catch (err) {
      console.warn('Backend connection error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [search, statusFilter])

  const handleMarkWaitingPickup = async (id: number) => {
    try {
      await updateChildStatus(id, 'Waiting Pickup')
      loadData()
    } catch (err: any) {
      alert(err.message || 'Failed to update student status to Waiting Pickup')
    }
  }

  const checkedInCount = children.filter((c) => c.status === 'Checked In').length
  const waitingCount = children.filter((c) => c.status === 'Waiting Pickup').length
  const checkedOutCount = children.filter((c) => c.status === 'Checked Out').length
  const notCheckedInCount = children.filter((c) => c.status === 'Not Checked In').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Today's Attendance Monitor</div>
          <div className="admin-page-desc">
            Real-time session attendance, active pickup PIN status, and guardian arrival tracking
          </div>
        </div>

        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin/checkout')}>
            <KeyRound size={14} /> Pickup Verification PIN
          </button>
          <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/checkin')}>
            <LogIn size={14} /> Daily Child Check-In
          </button>
        </div>
      </div>

      {/* Real-time Summary Cards */}
      <div className="admin-grid-4">
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
            <span className="admin-stat-label">Currently Checked In</span>
            <UserCheck size={16} color="var(--adm-info)" />
          </div>
          <div className="admin-stat-value">{checkedInCount}</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
            <span className="admin-stat-label" style={{ color: 'var(--adm-warning)', fontWeight: 600 }}>Awaiting Guardian Pickup</span>
            <Clock size={16} color="var(--adm-warning)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-warning)' }}>{waitingCount}</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
            <span className="admin-stat-label">Safely Checked Out</span>
            <CheckCircle2 size={16} color="var(--adm-success)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-success)' }}>{checkedOutCount}</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
            <span className="admin-stat-label">Not Arrived Yet</span>
            <LogIn size={16} color="var(--adm-text-3)" />
          </div>
          <div className="admin-stat-value">{notCheckedInCount}</div>
        </div>
      </div>

      {/* Toolbar Search & Status Tabs */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search size={13} color="var(--adm-text-3)" />
          <input
            placeholder="Search student name, ID, or PIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {(['all', 'Checked In', 'Waiting Pickup', 'Checked Out', 'Not Checked In'] as const).map((st) => (
            <button
              key={st}
              className={`admin-btn admin-btn-sm ${statusFilter === st ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              onClick={() => setStatusFilter(st)}
            >
              {st === 'all' ? 'All Attendance' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Child Student</th>
                <th>Student ID</th>
                <th>Training Group</th>
                <th>Check-In Time</th>
                <th>Drop-Off Adult</th>
                <th>Status</th>
                <th>Daily PIN</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="admin-table-empty">
                    <Loader2 size={16} className="animate-spin" style={{ margin: '0 auto' }} /> Loading real-time attendance...
                  </td>
                </tr>
              ) : children.length === 0 ? (
                <tr>
                  <td colSpan={8} className="admin-table-empty">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                children.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <img
                          src={c.photo || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=250'}
                          alt={c.full_name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--adm-text-1)' }}>{c.full_name}</div>
                      </div>
                    </td>

                    <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: 'var(--adm-accent)' }}>
                      {c.student_id}
                    </td>

                    <td style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>{c.group}</td>

                    <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--adm-text-2)' }}>
                      {c.check_in_time || '—'}
                    </td>

                    <td style={{ fontSize: 12 }}>
                      <div>{c.parent_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>{c.parent_relationship || 'Parent'}</div>
                    </td>

                    <td>{getStatusBadge(c.status)}</td>

                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--adm-accent)' }}>
                      {c.active_code ? `#${c.active_code}` : '—'}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {c.status === 'Not Checked In' ? (
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => navigate('/admin/checkin')}
                        >
                          <LogIn size={12} /> Check In
                        </button>
                      ) : c.status === 'Checked In' ? (
                        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                          <button
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            style={{ fontSize: '11px', padding: '3px 8px' }}
                            onClick={() => handleMarkWaitingPickup(c.id)}
                            title="Mark student ready for guardian pickup"
                          >
                            <Clock size={11} /> Mark Waiting Pickup
                          </button>
                          <button
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            onClick={() => navigate('/admin/checkout')}
                          >
                            <KeyRound size={12} /> Verify PIN
                          </button>
                        </div>
                      ) : (
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => navigate('/admin/checkout')}
                        >
                          <KeyRound size={12} /> Verify PIN
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
