// ============================================================================
// SkillUp Academy Check-in portal — Activity Log Page
// ============================================================================
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { getAttendanceLogs } from '../services/api'

export function ActivityLogPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [entityFilter, setEntityFilter] = useState('all')

  useEffect(() => {
    getAttendanceLogs().then((data: any[]) => setLogs(data)).catch(() => {})
  }, [])

  const fmtTime = (iso: string) => {
    if (!iso) return 'N/A'
    const d = new Date(iso)
    return d.toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const filtered = logs.filter((e: any) => {
    const desc = (e.child_name || '').toLowerCase()
    const user = (e.instructor_name || e.drop_off_adult || '').toLowerCase()
    const action = (e.status || '').toLowerCase()
    const matchSearch = !search || desc.includes(search.toLowerCase()) ||
      user.includes(search.toLowerCase()) || action.includes(search.toLowerCase())
    const matchEntity = entityFilter === 'all' || (e.center || 'CBT Centre') === entityFilter
    return matchSearch && matchEntity
  })

  const entities: string[] = ['all', ...Array.from(new Set(logs.map((e: any) => e.center || 'CBT Centre')))]

  return (
    <>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Activity Log</div>
          <div className="admin-page-desc">Complete audit trail of all platform actions. {logs.length} events recorded.</div>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search size={13} color="var(--adm-text-3)" />
          <input placeholder="Search actions, users, descriptions…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {entities.map((e: string) => (
          <button key={e} onClick={() => setEntityFilter(e)}
            className={`admin-btn admin-btn-sm ${entityFilter === e ? 'admin-btn-primary' : 'admin-btn-ghost'}`}>
            {e.charAt(0).toUpperCase() + e.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Timestamp</th><th>Student Name</th><th>Status</th><th>Center</th><th>Drop-off / Pickup Adult</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="admin-table-empty">No activity entries match your filters</td></tr>
            ) : filtered.map((entry: any, index: number) => (
              <tr key={entry.id || index}>
                <td style={{ fontSize: 12, color: 'var(--adm-text-2)', whiteSpace: 'nowrap' }}>{fmtTime(entry.check_in_time || entry.date)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="admin-avatar" style={{ width: 24, height: 24, fontSize: 9 }}>
                      {(entry.child_name || 'Student').split(' ').map((n: string) => n[0]).join('').slice(0,2)}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{entry.child_name || 'Student'}</span>
                  </div>
                </td>
                <td style={{ fontSize: 12, fontWeight: 500 }}>{entry.status || 'Checked In'}</td>
                <td><span className="admin-badge admin-badge-gray">{entry.center || 'Raji Rasaki Centre'}</span></td>
                <td style={{ fontSize: 12, color: 'var(--adm-text-2)', maxWidth: 300 }}>{entry.drop_off_adult || entry.pickup_adult || 'Guardian'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
