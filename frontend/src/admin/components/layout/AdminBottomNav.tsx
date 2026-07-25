// ============================================================================
// Skill Up Academy Check-in portal — Mobile Horizontally Scrollable Bottom Nav
// Role-aware navigation separating Lead Admin from Instructor items
// ============================================================================
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  LogIn,
  KeyRound,
  CalendarCheck,
  History,
  UserPlus,
  UserCog,
  Settings
} from 'lucide-react'
import { useAdminStore } from '../../store/useAdminStore'

export function AdminBottomNav() {
  const { session } = useAdminStore()
  const isAdmin = session.user?.role === 'Lead Admin' || session.user?.role === 'Administrator'

  const mobileNavItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/children', label: 'Children', icon: Users },
    { to: '/admin/checkin', label: 'Check-In', icon: LogIn },
    { to: '/admin/checkout', label: 'Pickup PIN', icon: KeyRound },
    { to: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/admin/history', label: 'History', icon: History },
    { to: '/admin/register', label: 'Register', icon: UserPlus },
    ...(isAdmin
      ? [
          { to: '/admin/users', label: 'Staff', icon: UserCog },
          { to: '/admin/settings', label: 'Settings', icon: Settings },
        ]
      : []),
  ]

  return (
    <nav className="admin-bottom-nav">
      <div className="admin-bottom-nav-scroll">
        {mobileNavItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={!!end}
            className={({ isActive }) => `admin-bottom-nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
