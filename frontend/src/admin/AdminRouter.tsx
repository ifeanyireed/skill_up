// ============================================================================
// Skill Up Academy Check-in portal — Router (all /admin/* routes)
// Role-based route guards protecting Admin-only and Staff-only management endpoints
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
import { LearnersPage } from './pages/LearnersPage'
import { AdminFormsDashboard } from './pages/AdminFormsDashboard'
import { AdminFormBuilder } from './pages/AdminFormBuilder'
import { AdminFormSubmissions } from './pages/AdminFormSubmissions'
import { AdminCertificatesPage } from './pages/AdminCertificatesPage'
import { useAdminStore, isLearnerUser, isAdminUser } from './store/useAdminStore'

function AdminOnlyRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAdminStore()
  const isAdmin = isAdminUser(session.user)
  const isLearner = isLearnerUser(session.user)

  if (isLearner) {
    return <Navigate to="/learners" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}

function StaffOnlyRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAdminStore()
  const isLearner = isLearnerUser(session.user)

  if (isLearner) {
    return <Navigate to="/learners" replace />
  }

  return <>{children}</>
}

function DashboardIndexGuard() {
  const { session } = useAdminStore()
  if (isLearnerUser(session.user)) {
    return <Navigate to="/learners" replace />
  }
  return <DashboardHome />
}

export function AdminRouter() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<AdminShell />}>
        <Route index element={<DashboardIndexGuard />} />
        <Route path="learners" element={<Navigate to="/learners" replace />} />
        <Route
          path="school"
          element={
            <StaffOnlyRoute>
              <SchoolPuzzleProPage />
            </StaffOnlyRoute>
          }
        />
        <Route
          path="children"
          element={
            <StaffOnlyRoute>
              <ChildrenDirectoryPage />
            </StaffOnlyRoute>
          }
        />
        <Route
          path="checkin"
          element={
            <StaffOnlyRoute>
              <CheckInPage />
            </StaffOnlyRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <StaffOnlyRoute>
              <CheckOutPage />
            </StaffOnlyRoute>
          }
        />
        <Route
          path="attendance"
          element={
            <StaffOnlyRoute>
              <AttendancePage />
            </StaffOnlyRoute>
          }
        />
        <Route
          path="history"
          element={
            <StaffOnlyRoute>
              <HistoryPage />
            </StaffOnlyRoute>
          }
        />
        <Route
          path="register"
          element={
            <StaffOnlyRoute>
              <ChildRegistrationPage />
            </StaffOnlyRoute>
          }
        />
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
        <Route
          path="forms"
          element={
            <AdminOnlyRoute>
              <AdminFormsDashboard />
            </AdminOnlyRoute>
          }
        />
        <Route
          path="forms/:id/edit"
          element={
            <AdminOnlyRoute>
              <AdminFormBuilder />
            </AdminOnlyRoute>
          }
        />
        <Route
          path="forms/new"
          element={
            <AdminOnlyRoute>
              <AdminFormBuilder />
            </AdminOnlyRoute>
          }
        />
        <Route
          path="forms/:id/submissions"
          element={
            <AdminOnlyRoute>
              <AdminFormSubmissions />
            </AdminOnlyRoute>
          }
        />
        <Route
          path="certificates"
          element={
            <AdminOnlyRoute>
              <AdminCertificatesPage />
            </AdminOnlyRoute>
          }
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}
