// ============================================================================
// Skill Up Academy Check-in portal — Master Shell (Layout + Auth Guard)
// ============================================================================
import { Navigate, Outlet } from 'react-router-dom'
import './admin.css'
import { AdminSidebar } from './components/layout/AdminSidebar'
import { AdminTopbar } from './components/layout/AdminTopbar'
import { AdminBottomNav } from './components/layout/AdminBottomNav'
import { GlobalSearch } from './components/layout/GlobalSearch'
import { useAdminStore } from './store/useAdminStore'

export function AdminShell() {
  const { session, sidebarCollapsed } = useAdminStore()

  if (!session.isAuthenticated) {
    return <Navigate to="/login" replace />
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
