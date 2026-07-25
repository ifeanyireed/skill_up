// ============================================================================
// SkillUp Academy Website — Deep Blue Header Navigation (Reference Style)
// Source UI Design System: ~/Downloads/nets-logistics/frontend
// ============================================================================
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, LogIn, ArrowRight } from 'lucide-react'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About Us' },
    { to: '/courses', label: 'Courses' },
    { to: '/instructors', label: 'Instructors' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header className="header-nets">
      <div className="container-nets">
        <div className="header-nets-inner">
          {/* Logo */}
          <NavLink to="/" className="logo-nets">
            <img src="/logo.avif" alt="SkillUp Academy logo" className="logo-nets-img" style={{ filter: 'brightness(0) invert(1)' }} />
          </NavLink>

          {/* Desktop Nav Links */}
          <nav>
            <ul className="nav-links-nets">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `nav-link-nets${isActive ? ' active' : ''}`}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <a
              href="https://checkin.skilluplearningacademy.com/login"
              target="_blank"
              rel="noreferrer"
              className="btn-nets btn-nets-outline-white"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              <LogIn size={15} /> Check-In Portal
            </a>
            <NavLink to="/contact" className="btn-nets btn-nets-red" style={{ padding: '0.5rem 1.125rem', fontSize: '0.875rem' }}>
              Enroll Now <ArrowRight size={15} />
            </NavLink>
          </div>

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle-nets"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-drawer-nets">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `nav-link-nets${isActive ? ' active' : ''}`}
              style={{ fontSize: '1.125rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.12)' }}
            >
              {item.label}
            </NavLink>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <a
              href="https://checkin.skilluplearningacademy.com/login"
              target="_blank"
              rel="noreferrer"
              className="btn-nets btn-nets-outline-white"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <LogIn size={16} /> Check-In Portal
            </a>
            <NavLink
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="btn-nets btn-nets-red"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Enroll Now <ArrowRight size={16} />
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
