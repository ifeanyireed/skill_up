// ============================================================================
// NETS Admin — Activity Log
// ============================================================================
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAdminStore } from '../store/useAdminStore'

const entityColor: Record<string, string> = {
  Quote: 'admin-badge-accent', Booking: 'admin-badge-green',
  Vehicle: 'admin-badge-yellow', Pricing: 'admin-badge-yellow',
  User: 'admin-badge-gray', Promotion: 'admin-badge-gray',
}

export function ActivityLogPage() {
  const { activityLog } = useAdminStore()
  const [search, setSearch] = useState('')
  const [entityFilter, setEntityFilter] = useState('all')

  const fmtTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const filtered = activityLog.filter(e => {
    const matchSearch = !search || e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.userName.toLowerCase().includes(search.toLowerCase()) || e.action.toLowerCase().includes(search.toLowerCase())
    const matchEntity = entityFilter === 'all' || e.entity === entityFilter
    return matchSearch && matchEntity
  })

  const entities = ['all', ...Array.from(new Set(activityLog.map(e => e.entity)))]

  return (
    <>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Activity Log</div>
          <div className="admin-page-desc">Complete audit trail of all platform actions. {activityLog.length} events recorded.</div>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search size={13} color="var(--adm-text-3)" />
          <input placeholder="Search actions, users, descriptions…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {entities.map(e => (
          <button key={e} onClick={() => setEntityFilter(e)}
            className={`admin-btn admin-btn-sm ${entityFilter === e ? 'admin-btn-primary' : 'admin-btn-ghost'}`}>
            {e.charAt(0).toUpperCase() + e.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity</th><th>Description</th><th>Change</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="admin-table-empty">No activity entries match your filters</td></tr>
            ) : filtered.map(entry => (
              <tr key={entry.id}>
                <td style={{ fontSize: 12, color: 'var(--adm-text-2)', whiteSpace: 'nowrap' }}>{fmtTime(entry.timestamp)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="admin-avatar" style={{ width: 24, height: 24, fontSize: 9 }}>
                      {entry.userName.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{entry.userName}</span>
                  </div>
                </td>
                <td style={{ fontSize: 12, fontWeight: 500 }}>{entry.action}</td>
                <td><span className={`admin-badge ${entityColor[entry.entity] ?? 'admin-badge-gray'}`}>{entry.entity}</span></td>
                <td style={{ fontSize: 12, color: 'var(--adm-text-2)', maxWidth: 300 }}>{entry.description}</td>
                <td>
                  {(entry.previousValue || entry.newValue) && (
                    <div style={{ fontSize: 11, display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                      {entry.previousValue && <span style={{ color: 'var(--adm-danger)', background: 'var(--adm-danger-subtle)', padding: '1px 6px', borderRadius: 3 }}>{entry.previousValue}</span>}
                      {entry.previousValue && entry.newValue && <span style={{ color: 'var(--adm-text-3)' }}>→</span>}
                      {entry.newValue && <span style={{ color: 'var(--adm-success)', background: 'var(--adm-success-subtle)', padding: '1px 6px', borderRadius: 3 }}>{entry.newValue}</span>}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
