// ============================================================================
// Skill Up Academy Check-in portal — Collapsible Admin Sidebar Navigation
// Role-aware navigation separating Lead Admin, Instructor, and Learner views
// ============================================================================
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  History,
  UserCog,
  Settings,
  LogOut,
  LogIn,
  KeyRound,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Puzzle,
  GraduationCap
} from 'lucide-react'
import { useAdminStore, isLearnerUser, isAdminUser } from '../../store/useAdminStore'

export function AdminSidebar() {
  const { session, logout, sidebarCollapsed, toggleSidebar } = useAdminStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isLearner = isLearnerUser(session.user)
  const isAdmin = isAdminUser(session.user)

  const navItems = [
    ...(!isLearner ? [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }] : []),
    { to: '/admin/learners', label: 'Learners Portal', icon: GraduationCap },
    ...(!isLearner ? [{ to: '/admin/school', label: 'PuzzlePro', icon: Puzzle }] : []),
  ]

  const safetyItems = [
    { to: '/admin/children', label: 'Children Directory', icon: Users },
    { to: '/admin/checkin', label: 'Daily Check-In', icon: LogIn },
    { to: '/admin/checkout', label: 'Daily Pick-up', icon: KeyRound },
    { to: '/admin/attendance', label: "Today's Attendance", icon: CalendarCheck },
    { to: '/admin/history', label: 'Attendance History', icon: History },
    { to: '/admin/register', label: 'Register Child', icon: UserPlus },
  ]

  const adminItems = [
    { to: '/admin/users', label: 'Instructors & Staff', icon: UserCog },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const initials = session.user?.fullName
    ? session.user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
    : 'SJ'

  return (
    <nav className="admin-sidebar">
      {/* Brand Header & Caret Toggle */}
      <div className="admin-sidebar-logo">
        <img
          src="/logo.avif"
          alt="Future Programs For Kids"
          style={{
            height: sidebarCollapsed ? '28px' : '34px',
            width: 'auto',
            objectFit: 'contain',
            transition: 'height 0.2s'
          }}
        />

        <button
          onClick={toggleSidebar}
          className="admin-btn admin-btn-icon admin-btn-ghost"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          style={{ padding: '4px', border: 'none' }}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="admin-nav">
        <div className="admin-nav-section">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={!!end}
              title={sidebarCollapsed ? label : undefined}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Safety & Operations Section (Only visible for Staff / Instructors / Lead Admins) */}
        {!isLearner && (
          <div className="admin-nav-section">
            <div className="admin-nav-label">Safety & Operations</div>
            {safetyItems
              .filter(({ to }) => to !== '/admin/register' || isAdmin)
              .map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  title={sidebarCollapsed ? label : undefined}
                  className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </NavLink>
              ))}
          </div>
        )}

        {/* Administration Section (Only visible for Lead Admins) */}
        {isAdmin && !isLearner && (
          <div className="admin-nav-section">
            <div className="admin-nav-label">Administration</div>
            {adminItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                title={sidebarCollapsed ? label : undefined}
                className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* User Footer */}
      <div className="admin-sidebar-user">
        {session.user?.avatar ? (
          <img
            src={session.user.avatar}
            alt={session.user.fullName}
            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div className="admin-avatar" title={session.user?.fullName || 'User'} style={{ width: 30, height: 30, fontSize: 11, flexShrink: 0 }}>
            {initials}
          </div>
        )}
        <div className="admin-sidebar-user-info">
          <div className="admin-sidebar-user-name">{session.user?.fullName ?? 'Learner Student'}</div>
          <div className="admin-sidebar-user-role">{session.user?.role ?? 'Student'}</div>
        </div>
        <button
          onClick={handleLogout}
          className="admin-btn admin-btn-icon admin-btn-ghost"
          title="Sign out"
          style={{ flexShrink: 0 }}
        >
          <LogOut size={14} />
        </button>
      </div>
    </nav>
  )
}
