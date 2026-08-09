// ============================================================================
// Child Training Check-In System — Page 2: Dashboard
// Separate Executive Admin & Instructor Operations Dashboards
// Connected to Go + GORM MySQL backend
// ============================================================================
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  LogIn,
  CheckCircle2,
  Clock,
  Search,
  TrendingUp,
  ShieldCheck,
  Loader2,
  KeyRound,
  AlertTriangle,
  Settings,
  UserCog
} from 'lucide-react'
import '../admin.css'
import { getChildren, getAttendanceLogs, BackendChild, BackendAttendanceLog } from '../services/api'
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

export function DashboardHome() {
  const navigate = useNavigate()
  const { session } = useAdminStore()

  const [children, setChildren] = useState<BackendChild[]>([])
  const [activities, setActivities] = useState<BackendAttendanceLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const isAdmin = session.user?.role === 'Lead Admin' || session.user?.role === 'Administrator'
  const isInstructor = session.user?.role === 'Instructor'

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const childrenData = await getChildren()
      setChildren(childrenData)

      const logsData = await getAttendanceLogs()
      setActivities(logsData)
    } catch (err) {
      console.warn('Backend connection warning', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Metrics
  const totalRegistered = children.length
  const checkedInToday = children.filter((c) => c.status === 'Checked In').length
  const checkedOutToday = children.filter((c) => c.status === 'Checked Out').length
  const waitingPickup = children.filter((c) => c.status === 'Waiting Pickup').length

  // Instructor Group Filtering
  const instructorAssignedGroup = 'Junior Champions (Ages 11-19)'
  const instructorChildren = children.filter((c) =>
    isInstructor ? c.group === instructorAssignedGroup || c.group.includes('Junior') : true
  )
  const instructorCheckedIn = instructorChildren.filter((c) => c.status === 'Checked In').length
  const instructorWaiting = instructorChildren.filter((c) => c.status === 'Waiting Pickup').length
  const instructorMedicalCount = instructorChildren.filter((c) => Boolean(c.medical_notes)).length

  const filteredChildren = (isInstructor ? instructorChildren : children).filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.student_id.toLowerCase().includes(search.toLowerCase()) ||
      c.group.toLowerCase().includes(search.toLowerCase()) ||
      (c.active_code && c.active_code.includes(search))
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── ROLE 1: INSTRUCTOR DASHBOARD ── */}
      {isInstructor ? (
        <>
          {/* Instructor Banner Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0B0E4E 0%, #0F172A 100%)',
              color: '#fff',
              padding: '1.5rem',
              borderRadius: 'var(--adm-radius)',
              border: '1px solid var(--adm-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--adm-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                INSTRUCTOR CLASSROOM DASHBOARD
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: 800, margin: '0.25rem 0 0.125rem', color: '#fff' }}>
                Welcome, {session.user?.fullName ?? 'Coach Michael Davies'}!
              </h1>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
                Assigned Group: <strong>{instructorAssignedGroup}</strong> • Active Session Roster
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.625rem' }}>
              <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/checkin')}>
                <LogIn size={14} /> Class Check-In
              </button>
              <button className="admin-btn admin-btn-ghost" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => navigate('/admin/checkout')}>
                <KeyRound size={14} /> Verify PIN
              </button>
            </div>
          </div>

          {/* Instructor KPI Cards */}
          <div className="admin-grid-4">
            <div className="admin-stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="admin-stat-label">Assigned Class Roster</span>
                <Users size={16} color="var(--adm-text-3)" />
              </div>
              <div className="admin-stat-value">{instructorChildren.length}</div>
              <div className="admin-stat-sub">Junior Champions students</div>
            </div>

            <div className="admin-stat-card" style={{ borderColor: 'rgba(196, 0, 0, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="admin-stat-label" style={{ color: 'var(--adm-accent)', fontWeight: 600 }}>Present in Class</span>
                <LogIn size={16} color="var(--adm-accent)" />
              </div>
              <div className="admin-stat-value" style={{ color: 'var(--adm-accent)' }}>{instructorCheckedIn}</div>
              <div className="admin-stat-sub">Currently checked in</div>
            </div>

            <div className="admin-stat-card" style={{ borderColor: 'rgba(217, 119, 6, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="admin-stat-label" style={{ color: 'var(--adm-warning)', fontWeight: 600 }}>Waiting Pickup</span>
                <Clock size={16} color="var(--adm-warning)" />
              </div>
              <div className="admin-stat-value" style={{ color: 'var(--adm-warning)' }}>{instructorWaiting}</div>
              <div className="admin-stat-sub">Awaiting collector at gate</div>
            </div>

            <div className="admin-stat-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="admin-stat-label" style={{ color: 'var(--adm-danger)', fontWeight: 600 }}>Medical Alerts</span>
                <AlertTriangle size={16} color="var(--adm-danger)" />
              </div>
              <div className="admin-stat-value" style={{ color: 'var(--adm-danger)' }}>{instructorMedicalCount}</div>
              <div className="admin-stat-sub">EpiPen / Asthma notes</div>
            </div>
          </div>
        </>
      ) : (
        /* ── ROLE 2: EXECUTIVE ADMIN DASHBOARD ── */
        <>
          {/* Executive Header */}
          <div className="admin-page-header">
            <div>
              <div className="admin-page-title">Executive Session Dashboard</div>
              <div className="admin-page-desc">
                Academy-wide attendance overview, instructor rosters, and PIN security audit controls
              </div>
            </div>

            <div className="admin-page-actions">
              <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/users')}>
                <UserCog size={14} /> Instructors & Staff
              </button>
              <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/settings')}>
                <Settings size={14} /> System Settings
              </button>
              <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/checkin')}>
                <LogIn size={14} /> New Check-In
              </button>
            </div>
          </div>

          {/* Admin Executive KPI Cards Grid */}
          <div className="admin-grid-4">
            <div className="admin-stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="admin-stat-label">Total Enrolled Children</span>
                <Users size={16} color="var(--adm-text-3)" />
              </div>
              <div className="admin-stat-value">{totalRegistered}</div>
              <div className="admin-stat-sub">Academy-wide directory</div>
            </div>

            <div className="admin-stat-card" style={{ borderColor: 'rgba(196, 0, 0, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="admin-stat-label" style={{ color: 'var(--adm-accent)', fontWeight: 600 }}>Active Session Check-Ins</span>
                <LogIn size={16} color="var(--adm-accent)" />
              </div>
              <div className="admin-stat-value" style={{ color: 'var(--adm-accent)' }}>{checkedInToday}</div>
              <div className="admin-stat-sub">In training sessions</div>
            </div>

            <div className="admin-stat-card" style={{ borderColor: 'rgba(22, 163, 74, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="admin-stat-label" style={{ color: 'var(--adm-success)', fontWeight: 600 }}>Released Students</span>
                <CheckCircle2 size={16} color="var(--adm-success)" />
              </div>
              <div className="admin-stat-value" style={{ color: 'var(--adm-success)' }}>{checkedOutToday}</div>
              <div className="admin-stat-sub">Verified PIN check-outs</div>
            </div>

            <div className="admin-stat-card" style={{ borderColor: 'rgba(217, 119, 6, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="admin-stat-label" style={{ color: 'var(--adm-warning)', fontWeight: 600 }}>Awaiting Pickup</span>
                <Clock size={16} color="var(--adm-warning)" />
              </div>
              <div className="admin-stat-value" style={{ color: 'var(--adm-warning)' }}>{waitingPickup}</div>
              <div className="admin-stat-sub">Pending adult collector</div>
            </div>
          </div>
        </>
      )}

      {/* Main Grid: Today's Attendance Roster & Recent Activity Log */}
      <div className="admin-grid-wider" style={{ gap: '1.5rem', alignItems: 'start' }}>
        {/* Attendance List */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            className="admin-card-title"
            style={{
              padding: '1rem 1.25rem',
              marginBottom: 0,
              borderBottom: '1px solid var(--adm-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
              <ShieldCheck size={16} color="var(--adm-accent)" />
              {isInstructor ? `${instructorAssignedGroup} Class Roster` : "Today's Session Attendance"}
            </span>

            {/* Search Input */}
            <div className="admin-toolbar-search" style={{ height: '30px' }}>
              <Search size={13} color="var(--adm-text-3)" />
              <input
                type="text"
                placeholder="Search child, ID, or PIN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '150px' }}
              />
            </div>
          </div>

          {/* SCROLLABLE TABLE CONTAINER */}
          <div
            className="admin-table-wrap"
            style={{
              border: 'none',
              borderRadius: 0,
              maxHeight: '440px',
              overflowY: 'auto',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <table className="admin-table">
              <thead style={{ position: 'sticky', top: 0, background: 'var(--adm-surface)', zIndex: 10 }}>
                <tr>
                  <th>Child Student</th>
                  <th>Group</th>
                  <th>Status</th>
                  <th>Check-In Time</th>
                  <th>Daily PIN</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="admin-table-empty">
                      <Loader2 size={16} className="animate-spin" style={{ margin: '0 auto' }} /> Loading session attendance...
                    </td>
                  </tr>
                ) : filteredChildren.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-table-empty">
                      No matching child record found
                    </td>
                  </tr>
                ) : (
                  filteredChildren.map((child) => (
                    <tr
                      key={child.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate('/admin/children')}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <img
                            src={child.photo || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=250'}
                            alt={child.full_name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--adm-text-1)' }}>{child.full_name}</div>
                            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--adm-text-3)' }}>
                              {child.student_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--adm-text-2)', fontSize: 12 }}>{child.group}</td>
                      <td>
                        <span className={getStatusBadgeClass(child.status)}>{child.status}</span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--adm-text-2)', fontFamily: 'monospace' }}>
                        {child.check_in_time || '—'}
                      </td>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--adm-accent)' }}>
                        {child.active_code ? `#${child.active_code}` : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            className="admin-card-title"
            style={{ padding: '1rem 1.25rem', marginBottom: 0, borderBottom: '1px solid var(--adm-border)' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={15} /> Recent Activity Feed
            </span>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate('/admin/history')}>
              Audit Log
            </button>
          </div>

          {/* SCROLLABLE ACTIVITY CONTAINER */}
          <div style={{ padding: '0 1.25rem', maxHeight: '440px', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {activities.length === 0 ? (
              <div className="admin-table-empty" style={{ padding: '2rem' }}>
                No recent activity logs available
              </div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="admin-activity-item">
                  <div
                    className="admin-activity-dot"
                    style={{
                      background: act.status === 'Checked Out' ? 'var(--adm-success, #16A34A)' : 'var(--adm-accent, #C40000)',
                      boxShadow: act.status === 'Checked Out' ? '0 0 8px rgba(22, 163, 74, 0.4)' : '0 0 8px rgba(196, 0, 0, 0.4)'
                    }}
                  />
                  <div>
                    <div className="admin-activity-title">
                      <strong>{act.child_name}</strong> ({act.student_id}) — <span style={{ fontWeight: 700, color: act.status === 'Checked Out' ? 'var(--adm-success, #16A34A)' : 'var(--adm-accent, #C40000)' }}>{act.status}</span>. PIN: #{act.pickup_pin || '—'}
                    </div>
                    <div className="admin-activity-meta">
                      Triggered By: <strong style={{ color: 'var(--adm-text-1)' }}>{act.instructor_name || 'Administrator'}</strong> · {act.status === 'Checked Out' ? act.check_out_time || act.date : act.check_in_time || act.date} {act.pickup_adult ? `(Released to ${act.pickup_adult})` : act.drop_off_adult ? `(Dropped off by ${act.drop_off_adult})` : ''}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
