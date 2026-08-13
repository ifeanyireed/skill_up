import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AdminRouter } from './admin/AdminRouter'
import { AdminShell } from './admin/AdminShell'
import { AdminLoginPage } from './admin/pages/AdminLoginPage'
import { LearnersPage } from './admin/pages/LearnersPage'
import { ParentRegistrationPage } from './public/ParentRegistrationPage'
import { useAdminStore, isLearnerUser } from './admin/store/useAdminStore'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function RootAuthRedirect() {
  const { session } = useAdminStore()
  if (session.isAuthenticated) {
    if (isLearnerUser(session.user)) {
      return <Navigate to="/learners" replace />
    }
    return <Navigate to="/admin" replace />
  }
  return <AdminLoginPage />
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Landing Page (Root /) & Login */}
        <Route path="/" element={<RootAuthRedirect />} />
        <Route path="/login" element={<RootAuthRedirect />} />

        {/* Dedicated Top-Level /learners Route */}
        <Route element={<AdminShell />}>
          <Route path="/learners" element={<LearnersPage />} />
        </Route>

        {/* Public Parent Child Registration Page */}
        <Route path="/register" element={<ParentRegistrationPage />} />
        <Route path="/parent-register" element={<ParentRegistrationPage />} />

        {/* PuzzlePro School Routes */}
        <Route path="/school" element={<Navigate to="/admin/school" replace />} />
        <Route path="/puzzlepro" element={<Navigate to="/admin/school" replace />} />

        {/* Admin Shell routes */}
        <Route path="/admin/*" element={<AdminRouter />} />

        {/* Fallback to Root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
