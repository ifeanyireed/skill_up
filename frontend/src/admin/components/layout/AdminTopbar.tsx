// ============================================================================
// Skill Up Academy Check-in portal — Top Bar Navigation with Collapse Toggle
// ============================================================================
import { Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useAdminStore } from '../../store/useAdminStore'
import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard Overview',
  '/admin/children': 'Children Directory',
  '/admin/checkin': 'Daily Child Check-In',
  '/admin/checkout': 'Pickup Verification PIN',
  '/admin/attendance': "Today's Attendance Monitor",
  '/admin/history': 'Attendance History & Audit Log',
  '/admin/register': 'Child Registration',
  '/admin/users': 'Instructor & Staff Management',
  '/admin/settings': 'System Settings & PIN Rules',
}

export function AdminTopbar() {
  const { session, setSearchOpen, sidebarCollapsed, toggleSidebar } = useAdminStore()
  const { pathname } = useLocation()
  const title = pageTitles[pathname] ?? 'Check-in portal'
  const initials = session.user?.fullName
    ? session.user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
    : 'SJ'

  return (
    <header className="admin-topbar">
      <button
        onClick={toggleSidebar}
        className="admin-btn admin-btn-icon admin-btn-ghost"
        title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        style={{ height: '34px', width: '34px', padding: 0, justifyContent: 'center' }}
      >
        {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--adm-text-1)' }}>{title}</span>

      <button className="admin-topbar-search" onClick={() => setSearchOpen(true)}>
        <Search size={13} color="var(--adm-text-3)" />
        <span className="admin-topbar-search-text">Search child, PIN code, or parent…</span>
        <span className="admin-topbar-search-kbd">⌘K</span>
      </button>

      <div className="admin-topbar-right">
        <div className="admin-avatar" title={session.user?.fullName || 'User'}>
          {initials}
        </div>
      </div>
    </header>
  )
}
