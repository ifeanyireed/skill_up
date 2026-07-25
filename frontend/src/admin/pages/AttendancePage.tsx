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
import { getChildren, BackendChild } from '../services/api'

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Checked Out':
      return <span className="admin-badge admin-badge-green"><CheckCircle2 size={10} /> Checked Out</span>
    case 'Waiting Pickup':
      return <span className="admin-badge admin-badge-yellow"><Clock size={10} /> Waiting Pickup</span>
    case 'Checked In':
      return <span className="admin-badge admin-badge-accent"><LogIn size={10} /> Checked In</span>
    case 'Not Checked In':
    default:
      return <span className="admin-badge admin-badge-gray">Not Arrived</span>
  }
}

export function AttendancePage() {
  const navigate = useNavigate()
  const [children, setChildren] = useState<BackendChild[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getChildren(statusFilter, search)
      setChildren(data)
    } catch (err) {
      console.warn('Backend error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [statusFilter, search])

  // Quick Stats
  const checkedInCount = children.filter((c) => c.status === 'Checked In').length
  const waitingCount = children.filter((c) => c.status === 'Waiting Pickup').length
  const checkedOutCount = children.filter((c) => c.status === 'Checked Out').length
  const notArrivedCount = children.filter((c) => c.status === 'Not Checked In').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Today's Attendance Monitor</div>
          <div className="admin-page-desc">
            Real-time status tracking for all children from MySQL database
          </div>
        </div>

        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/checkout')}>
            <KeyRound size={14} /> Pickup PIN Check
          </button>
          <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/checkin')}>
            <LogIn size={14} /> New Check-In
          </button>
        </div>
      </div>

      {/* KPI Status Counters */}
      <div className="admin-grid-4">
        <div className="admin-stat-card" style={{ borderColor: 'rgba(196, 0, 0, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
            <span className="admin-stat-label" style={{ color: 'var(--adm-accent)', fontWeight: 600 }}>Checked In</span>
            <LogIn size={15} color="var(--adm-accent)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-accent)', fontSize: '24px' }}>{checkedInCount}</div>
          <div className="admin-stat-sub">Present in session</div>
        </div>

        <div className="admin-stat-card" style={{ borderColor: 'rgba(217, 119, 6, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
            <span className="admin-stat-label" style={{ color: 'var(--adm-warning)', fontWeight: 600 }}>Waiting Pickup</span>
            <Clock size={15} color="var(--adm-warning)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-warning)', fontSize: '24px' }}>{waitingCount}</div>
          <div className="admin-stat-sub">Awaiting collector</div>
        </div>

        <div className="admin-stat-card" style={{ borderColor: 'rgba(22, 163, 74, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
            <span className="admin-stat-label" style={{ color: 'var(--adm-success)', fontWeight: 600 }}>Checked Out</span>
            <CheckCircle2 size={15} color="var(--adm-success)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-success)', fontSize: '24px' }}>{checkedOutCount}</div>
          <div className="admin-stat-sub">Released to adults</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
            <span className="admin-stat-label">Not Arrived</span>
            <UserCheck size={15} color="var(--adm-text-3)" />
          </div>
          <div className="admin-stat-value" style={{ fontSize: '24px' }}>{notArrivedCount}</div>
          <div className="admin-stat-sub">Not yet checked in</div>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search size={13} color="var(--adm-text-3)" />
          <input
            placeholder="Search child name, ID, or PIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '240px' }}
          />
        </div>

        {/* Status Filter Buttons */}
        {(['all', 'Checked In', 'Waiting Pickup', 'Checked Out', 'Not Checked In'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`admin-btn admin-btn-sm ${statusFilter === st ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
          >
            {st === 'all' ? 'All Children' : st}
          </button>
        ))}
      </div>

      {/* Attendance Roster Table */}
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
  )
}
