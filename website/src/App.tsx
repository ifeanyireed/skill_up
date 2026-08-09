// ============================================================================
// SkillUp Academy Website — Main Application & Router
// Recreates SkillUp Learning Academy site structure
// ============================================================================
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { CoursesPage } from './pages/CoursesPage'
import { InstructorsPage } from './pages/InstructorsPage'
import { AboutPage } from './pages/AboutPage'
import { PricingPage } from './pages/PricingPage'
import { ContactPage } from './pages/ContactPage'
import { PuzzleProPage } from './pages/PuzzleProPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function MainLayout() {
  const { pathname } = useLocation()
  const isEmbedPage = pathname === '/puzzlepro'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isEmbedPage && <Header />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/instructors" element={<InstructorsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/puzzlepro" element={<PuzzleProPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!isEmbedPage && <Footer />}
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainLayout />
    </BrowserRouter>
  )
}
