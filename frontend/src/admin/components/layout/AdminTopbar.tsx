// ============================================================================
// Skill Up Academy Check-in portal — Top Bar Navigation
// Dynamic layout adapting for /learners full-width mode and admin routes
// ============================================================================
import { Search, LogOut } from 'lucide-react'
import { useAdminStore } from '../../store/useAdminStore'
import { useLocation, useNavigate } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard Overview',
  '/learners': 'Skill Up Learners Portal',
  '/admin/learners': 'Skill Up Learners Portal',
  '/admin/children': 'Children Directory',
  '/admin/checkin': 'Daily Child Check-In',
  '/admin/checkout': 'Daily Pick-up PIN',
  '/admin/attendance': "Today's Attendance Monitor",
  '/admin/history': 'Attendance History & Audit Log',
  '/admin/register': 'Child Registration',
  '/admin/users': 'Instructor & Staff Management',
  '/admin/settings': 'System Settings & PIN Rules',
}

export function AdminTopbar() {
  const { session, setSearchOpen, logout } = useAdminStore()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const title = pageTitles[pathname] ?? 'Future Programs For Kids Portal'
  const isLearnersPage = pathname === '/learners' || pathname.startsWith('/learners/')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = session.user?.fullName
    ? session.user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
    : 'SJ'

  return (
    <header className="admin-topbar" style={{ left: isLearnersPage ? 0 : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {isLearnersPage && (
          <img
            src="/logo.avif"
            alt="Skill Up Academy"
            style={{ height: 30, width: 'auto', objectFit: 'contain' }}
          />
        )}
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--adm-text-1)' }}>{title}</span>
      </div>

      {!isLearnersPage && (
        <button className="admin-topbar-search" onClick={() => setSearchOpen(true)}>
          <Search size={13} color="var(--adm-text-3)" />
          <span className="admin-topbar-search-text">Search child, PIN code, or parent…</span>
          <span className="admin-topbar-search-kbd">⌘K</span>
        </button>
      )}

      <div className="admin-topbar-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {session.user?.avatar ? (
            <img
              src={session.user.avatar}
              alt={session.user.fullName}
              style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--adm-border)' }}
            />
          ) : (
            <div className="admin-avatar" title={session.user?.fullName || 'User'}>
              {initials}
            </div>
          )}
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--adm-text-1)' }}>
            {session.user?.fullName}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="admin-btn admin-btn-ghost admin-btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '0.5rem' }}
          title="Sign out"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  )
}
