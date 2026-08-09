// ============================================================================
// Skill Up Academy Check-in portal — Router (all /admin/* routes)
// Role-based route guards protecting Admin-only management endpoints
// ============================================================================
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminShell } from './AdminShell'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { DashboardHome } from './pages/DashboardHome'
import { ChildrenDirectoryPage } from './pages/ChildrenDirectoryPage'
import { CheckInPage } from './pages/CheckInPage'
import { CheckOutPage } from './pages/CheckOutPage'
import { AttendancePage } from './pages/AttendancePage'
import { HistoryPage } from './pages/HistoryPage'
import { ChildRegistrationPage } from './pages/ChildRegistrationPage'
import { InstructorsPage } from './pages/InstructorsPage'
import { SettingsPage } from './pages/SettingsPage'
import { SchoolPuzzleProPage } from './pages/SchoolPuzzleProPage'
import { useAdminStore } from './store/useAdminStore'

function AdminOnlyRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAdminStore()
  const isAdmin = session.user?.role === 'Lead Admin' || session.user?.role === 'Administrator'

  if (!isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}

export function AdminRouter() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<AdminShell />}>
        <Route index element={<DashboardHome />} />
        <Route path="school" element={<SchoolPuzzleProPage />} />
        <Route path="children" element={<ChildrenDirectoryPage />} />
        <Route path="checkin" element={<CheckInPage />} />
        <Route path="checkout" element={<CheckOutPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="register" element={<ChildRegistrationPage />} />
        <Route
          path="users"
          element={
            <AdminOnlyRoute>
              <InstructorsPage />
            </AdminOnlyRoute>
          }
        />
        <Route
          path="settings"
          element={
            <AdminOnlyRoute>
              <SettingsPage />
            </AdminOnlyRoute>
          }
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}
