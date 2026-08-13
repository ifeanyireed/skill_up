// ============================================================================
// Skill Up Academy Check-in portal — Master Shell (Layout + Auth Guard & RBAC)
// Completely removes sidebar menu when viewing /learners page
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
  const isLearnersPage = path === '/learners' || path.startsWith('/learners/')

  // RBAC Guard: Learners are strictly confined to /learners
  if (isLearner && !isLearnersPage) {
    return <Navigate to="/learners" replace />
  }

  return (
    <div className={`admin-shell${sidebarCollapsed && !isLearnersPage ? ' sidebar-collapsed' : ''}`}>
      <div className="admin-layout">
        {!isLearnersPage && <AdminSidebar />}
        <AdminTopbar />
        {!isLearnersPage && <GlobalSearch />}
        <main className="admin-main" style={{ marginLeft: isLearnersPage ? 0 : undefined }}>
          <div className="admin-page" style={{ maxWidth: isLearnersPage ? '1400px' : undefined, margin: isLearnersPage ? '0 auto' : undefined }}>
            <Outlet />
          </div>
        </main>
        {!isLearnersPage && <AdminBottomNav />}
      </div>
    </div>
  )
}
