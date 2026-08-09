// ============================================================================
// Skill Up Academy Check-in portal — Page 7: Attendance History & CSV Export
// Dynamic calls connected to Go + GORM MySQL backend with pagination & filters
// ============================================================================
import React, { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Calendar,
  FileSpreadsheet,
  Loader2,
  Filter,
  X,
  RotateCcw
} from 'lucide-react'
import '../admin.css'
import { getAttendanceLogs, getAttendanceExportCSVURL, BackendAttendanceLog } from '../services/api'
import { PaginationController } from '../components/PaginationController'

const getTodayLocalString = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getYesterdayLocalString = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function HistoryPage() {
  const [logs, setLogs] = useState<BackendAttendanceLog[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [search, setSearch] = useState('')
  const [selectedDate, setSelectedDate] = useState<string>(getTodayLocalString())
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [groupFilter, setGroupFilter] = useState<string>('all')
  const [centerFilter, setCenterFilter] = useState<string>('all')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getAttendanceLogs(selectedDate, search, statusFilter, groupFilter, centerFilter)
      setLogs(data)
    } catch (err) {
      console.warn('Backend error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedDate, search, statusFilter, groupFilter, centerFilter])

  // Reset to page 1 whenever any filter or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedDate, statusFilter, groupFilter, centerFilter, pageSize])

  // Extract unique groups dynamically from logs for filter dropdown
  const uniqueGroups = useMemo(() => {
    const groupsSet = new Set<string>()
    logs.forEach((l) => {
      if (l.group) groupsSet.add(l.group)
    })
    return Array.from(groupsSet).sort()
  }, [logs])

  // Client-side refined filtering (ensures instant responsive UI filtering)
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      // Search term filter
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchesName = l.child_name?.toLowerCase().includes(q)
        const matchesID = l.student_id?.toLowerCase().includes(q)
        const matchesPIN = l.pickup_pin?.toLowerCase().includes(q)
        const matchesDropOff = l.drop_off_adult?.toLowerCase().includes(q)
        const matchesPickup = l.pickup_adult?.toLowerCase().includes(q)
        const matchesGroup = l.group?.toLowerCase().includes(q)
        if (!matchesName && !matchesID && !matchesPIN && !matchesDropOff && !matchesPickup && !matchesGroup) {
          return false
        }
      }

      // Date filter
      if (selectedDate && l.date !== selectedDate) {
        return false
      }

      // Status filter
      if (statusFilter !== 'all' && l.status !== statusFilter) {
        return false
      }

      // Group filter
      if (groupFilter !== 'all' && l.group !== groupFilter) {
        return false
      }

      // Center filter
      if (centerFilter !== 'all' && l.center && l.center !== centerFilter) {
        return false
      }

      return true
    })
  }, [logs, search, selectedDate, statusFilter, groupFilter, centerFilter])

  // Pagination calculation
  const totalItems = filteredLogs.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  
  const startIndex = (safeCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const currentLogs = filteredLogs.slice(startIndex, endIndex)

  const handleExportCSV = () => {
    const url = getAttendanceExportCSVURL(selectedDate)
    window.open(url, '_blank')
  }

  const handleResetFilters = () => {
    setSearch('')
    setSelectedDate('')
    setStatusFilter('all')
    setGroupFilter('all')
    setCenterFilter('all')
    setCurrentPage(1)
  }

  const isFiltered = Boolean(search || selectedDate || statusFilter !== 'all' || groupFilter !== 'all' || centerFilter !== 'all')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Attendance History & Audit Logs</div>
          <div className="admin-page-desc">
            Review previous session attendance, pickup verification records, filter by status or track, and export CSV reports
          </div>
        </div>

        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={handleExportCSV}>
            <FileSpreadsheet size={14} /> Export CSV Report
          </button>
        </div>
      </div>

      {/* Toolbar Filters & Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--adm-surface)', padding: '1rem', borderRadius: 'var(--adm-radius)', border: '1px solid var(--adm-border)' }}>
        <div className="admin-toolbar" style={{ marginBottom: 0, gap: '0.75rem' }}>
          {/* Search Input */}
          <div className="admin-toolbar-search" style={{ flex: '1 1 240px', minWidth: '220px' }}>
            <Search size={14} color="var(--adm-text-3)" />
            <input
              placeholder="Search child, ID, PIN, adult..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-text-3)', padding: 0 }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Date Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} color="var(--adm-text-3)" />
            <input
              type="date"
              className="admin-input"
              style={{ width: 'auto', height: '34px', fontSize: '13px', padding: '0 0.5rem' }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Quick Date Presets */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              className={`admin-btn admin-btn-sm ${selectedDate === getTodayLocalString() ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              onClick={() => setSelectedDate(getTodayLocalString())}
              style={{ fontSize: '12px', padding: '0.25rem 0.5rem' }}
            >
              Today
            </button>
            <button
              className={`admin-btn admin-btn-sm ${selectedDate === getYesterdayLocalString() ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              onClick={() => setSelectedDate(getYesterdayLocalString())}
              style={{ fontSize: '12px', padding: '0.25rem 0.5rem' }}
            >
              Yesterday
            </button>
            <button
              className={`admin-btn admin-btn-sm ${selectedDate === '' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              onClick={() => setSelectedDate('')}
              style={{ fontSize: '12px', padding: '0.25rem 0.5rem' }}
            >
              All Dates
            </button>
          </div>
        </div>

        {/* Dropdown Filters Line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--adm-border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '12px', fontWeight: 600, color: 'var(--adm-text-3)' }}>
            <Filter size={13} /> Filters:
          </div>

          {/* Status Filter */}
          <select
            className="admin-select"
            style={{ width: 'auto', height: '32px', fontSize: '12.5px', padding: '0 0.5rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Checked In">Checked In</option>
            <option value="Waiting Pickup">Waiting Pickup</option>
            <option value="Checked Out">Checked Out</option>
          </select>

          {/* Group Filter */}
          <select
            className="admin-select"
            style={{ width: 'auto', height: '32px', fontSize: '12.5px', padding: '0 0.5rem' }}
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
          >
            <option value="all">All Track Groups</option>
            {uniqueGroups.map((grp) => (
              <option key={grp} value={grp}>
                {grp}
              </option>
            ))}
          </select>

          {/* Center Filter */}
          <select
            className="admin-select"
            style={{ width: 'auto', height: '32px', fontSize: '12.5px', padding: '0 0.5rem' }}
            value={centerFilter}
            onChange={(e) => setCenterFilter(e.target.value)}
          >
            <option value="all">All Centers</option>
            <option value="Raji Rasaki Centre">Raji Rasaki Centre</option>
            <option value="Festac Centre">Festac Centre</option>
          </select>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={handleResetFilters}
              style={{ color: 'var(--adm-accent)', borderColor: 'var(--adm-accent-subtle)' }}
            >
              <RotateCcw size={12} /> Clear Filters
            </button>
          )}

          <div style={{ marginLeft: 'auto', fontSize: '12.5px', color: 'var(--adm-text-2)', fontWeight: 500 }}>
            Total: <span style={{ fontWeight: 700, color: 'var(--adm-text-1)' }}>{totalItems}</span> record{totalItems === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* History Log Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Child Student</th>
              <th>Center</th>
              <th>Group Track</th>
              <th>Check-In</th>
              <th>Drop-Off Adult</th>
              <th>Check-In Staff</th>
              <th>Check-Out</th>
              <th>Pickup Adult</th>
              <th>Check-Out Staff</th>
              <th>PIN Code</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} className="admin-table-empty">
                  <Loader2 size={16} className="animate-spin" style={{ margin: '0 auto 0.5rem auto' }} /> Loading audit logs from MySQL...
                </td>
              </tr>
            ) : currentLogs.length === 0 ? (
              <tr>
                <td colSpan={12} className="admin-table-empty">
                  <div style={{ padding: '1rem 0' }}>
                    <p style={{ margin: 0, fontWeight: 500 }}>No attendance logs found matching current filters.</p>
                    {isFiltered && (
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={handleResetFilters}
                        style={{ marginTop: '0.75rem' }}
                      >
                        <RotateCcw size={12} /> Reset All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              currentLogs.map((l) => (
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

                  <td style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>{l.center || 'Raji Rasaki Centre'}</td>

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

      {/* Pagination Controller */}
      <PaginationController
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        itemLabel="entries"
      />
    </div>
  )
}

