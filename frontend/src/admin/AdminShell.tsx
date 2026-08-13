// ============================================================================
// Skill Up Academy Check-in portal — Master Shell (Layout + Auth Guard & RBAC)
// ============================================================================
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import './admin.css'
import { AdminSidebar } from './components/layout/AdminSidebar'
import { AdminTopbar } from './components/layout/AdminTopbar'
import { AdminBottomNav } from './components/layout/AdminBottomNav'
import { GlobalSearch } from './components/layout/GlobalSearch'
import { useAdminStore, isLearnerUser } from './store/useAdminStore'

export function AdminShell() {
  const { session, sidebarCollapsed } = useAdminStore()
  const location = useLocation()

  if (!session.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const isLearner = isLearnerUser(session.user)
  const path = location.pathname.toLowerCase()

  // RBAC Guard: Learners are strictly confined to /learners and /admin/school
  if (isLearner && !path.startsWith('/admin/learners') && !path.startsWith('/learners') && !path.startsWith('/admin/school')) {
    return <Navigate to="/learners" replace />
  }

  return (
    <div className={`admin-shell${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <div className="admin-layout">
        <AdminSidebar />
        <AdminTopbar />
        <GlobalSearch />
        <main className="admin-main">
          <div className="admin-page">
            <Outlet />
          </div>
        </main>
        <AdminBottomNav />
      </div>
    </div>
  )
}
