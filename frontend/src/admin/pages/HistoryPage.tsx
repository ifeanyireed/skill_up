// ============================================================================
// Skill Up Academy Check-in portal — Page 7: Attendance History & CSV Export
// Dynamic calls connected to Go + GORM MySQL backend
// ============================================================================
import React, { useState, useEffect } from 'react'
import {
  Search,
  Calendar,
  FileSpreadsheet,
  Loader2
} from 'lucide-react'
import '../admin.css'
import { getAttendanceLogs, getAttendanceExportCSVURL, BackendAttendanceLog } from '../services/api'

const getTodayLocalString = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function HistoryPage() {
  const [logs, setLogs] = useState<BackendAttendanceLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedDate, setSelectedDate] = useState<string>(getTodayLocalString())

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getAttendanceLogs(selectedDate, search)
      setLogs(data)
    } catch (err) {
      console.warn('Backend error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedDate, search])

  const handleExportCSV = () => {
    const url = getAttendanceExportCSVURL(selectedDate)
    window.open(url, '_blank')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Attendance History & Audit Logs</div>
          <div className="admin-page-desc">
            Review previous session attendance, pickup verification records from MySQL DB, and export CSV reports
          </div>
        </div>

        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={handleExportCSV}>
            <FileSpreadsheet size={14} /> Export CSV Report
          </button>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search size={13} color="var(--adm-text-3)" />
          <input
            placeholder="Search by child, ID, PIN, or group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '260px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={14} color="var(--adm-text-3)" />
          <input
            type="date"
            className="admin-input"
            style={{ width: 'auto', height: '34px', fontSize: '13px' }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {selectedDate && (
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setSelectedDate('')}>
              Show All Dates
            </button>
          )}
        </div>
      </div>

      {/* History Log Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Child Student</th>
              <th>Group</th>
              <th>Check-In</th>
              <th>Drop-Off Adult</th>
              <th>Check-In Triggered By</th>
              <th>Check-Out</th>
              <th>Pickup Adult</th>
              <th>Check-Out Triggered By</th>
              <th>PIN Code</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="admin-table-empty">
                  <Loader2 size={16} className="animate-spin" style={{ margin: '0 auto' }} /> Loading audit logs from MySQL...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={11} className="admin-table-empty">
                  No historical logs found for date {selectedDate || 'selected filter'}
                </td>
              </tr>
            ) : (
              logs.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--adm-text-2)' }}>{l.date}</td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <img
                        src={l.photo || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=250'}
                        alt={l.child_name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--adm-text-1)' }}>{l.child_name}</div>
                        <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--adm-accent)' }}>
                          {l.student_id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>{l.group}</td>

                  <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--adm-accent)', fontWeight: 600 }}>
                    {l.check_in_time}
                  </td>

                  <td style={{ fontSize: 12 }}>{l.drop_off_adult}</td>

                  <td style={{ fontSize: 12, color: 'var(--adm-text-1)', fontWeight: 600 }}>
                    {l.instructor_name || 'Administrator'}
                  </td>

                  <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--adm-success)', fontWeight: 600 }}>
                    {l.check_out_time || '—'}
                  </td>

                  <td style={{ fontSize: 12 }}>{l.pickup_adult || '—'}</td>

                  <td style={{ fontSize: 12, color: 'var(--adm-text-1)', fontWeight: 600 }}>
                    {l.check_out_instructor || (l.check_out_time ? l.instructor_name || 'Administrator' : '—')}
                  </td>

                  <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--adm-accent)' }}>
                    #{l.pickup_pin}
                  </td>

                  <td>
                    <span className={`admin-badge ${l.status === 'Checked Out' ? 'admin-badge-green' : l.status === 'Waiting Pickup' ? 'admin-badge-yellow' : 'admin-badge-accent'}`}>
                      {l.status}
                    </span>
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
