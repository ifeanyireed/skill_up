import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AdminRouter } from './admin/AdminRouter'
import { AdminLoginPage } from './admin/pages/AdminLoginPage'
import { ParentRegistrationPage } from './public/ParentRegistrationPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Landing Page (Root /) renders the Hero Login Page */}
        <Route path="/" element={<AdminLoginPage />} />
        <Route path="/login" element={<AdminLoginPage />} />

        {/* Public Parent Child Registration Page */}
        <Route path="/register" element={<ParentRegistrationPage />} />
        <Route path="/parent-register" element={<ParentRegistrationPage />} />

        {/* PuzzlePro School Routes */}
        <Route path="/school" element={<Navigate to="/admin/school" replace />} />
        <Route path="/puzzlepro" element={<Navigate to="/admin/school" replace />} />

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRouter />} />

        {/* Fallback to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
