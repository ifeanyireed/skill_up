// ============================================================================
// Skill Up Academy Check-in portal — Mobile Horizontally Scrollable Bottom Nav
// Role-aware navigation separating Lead Admin, Instructor, and Learner items
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
  Settings,
  GraduationCap,
  Puzzle
} from 'lucide-react'
import { useAdminStore, isLearnerUser, isAdminUser } from '../../store/useAdminStore'

export function AdminBottomNav() {
  const { session } = useAdminStore()
  const isLearner = isLearnerUser(session.user)
  const isAdmin = isAdminUser(session.user)

  if (isLearner) {
    return (
      <nav className="admin-bottom-nav">
        <div className="admin-bottom-nav-scroll" style={{ justifyContent: 'center' }}>
          <NavLink
            to="/admin/learners"
            className={({ isActive }) => `admin-bottom-nav-item${isActive ? ' active' : ''}`}
          >
            <GraduationCap size={18} />
            <span>Learners</span>
          </NavLink>
          <NavLink
            to="/admin/school"
            className={({ isActive }) => `admin-bottom-nav-item${isActive ? ' active' : ''}`}
          >
            <Puzzle size={18} />
            <span>PuzzlePro</span>
          </NavLink>
        </div>
      </nav>
    )
  }

  const mobileNavItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/learners', label: 'Learners', icon: GraduationCap },
    { to: '/admin/school', label: 'PuzzlePro', icon: Puzzle },
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
