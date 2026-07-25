// ============================================================================
// SkillUp Academy Website — NETS Swiss Enterprise Footer
// Source UI Design System: ~/Downloads/nets-logistics/frontend
// ============================================================================
import React from 'react'
import { NavLink } from 'react-router-dom'
import { Phone, Mail, MapPin, ShieldCheck, ArrowRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="footer-nets">
      <div className="container-nets">
        <div className="footer-nets-grid">
          {/* Col 1: Brand Info */}
          <div>
            <img src="/logo.avif" alt="SkillUp Academy" className="logo-nets-img" style={{ marginBottom: '1.25rem', filter: 'brightness(0) invert(1)' }} />
            <p style={{ fontSize: '0.9375rem', color: 'rgba(255, 255, 255, 0.75)', maxWidth: '320px', marginBottom: '1.25rem' }}>
              SkillUp Academy provides practical, beginner-to-advanced tech, design, and digital skills education across our Raji Rasaki Centre and CBT Centre.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16A34A', fontSize: '0.875rem', fontWeight: 600 }}>
              <ShieldCheck size={16} /> Accredited CBT Learning Hub
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="footer-title-nets">Navigation</h4>
            <ul className="footer-links-nets">
              <li><NavLink to="/" className="footer-link-nets">Home</NavLink></li>
              <li><NavLink to="/about" className="footer-link-nets">About Us</NavLink></li>
              <li><NavLink to="/courses" className="footer-link-nets">All Courses</NavLink></li>
              <li><NavLink to="/instructors" className="footer-link-nets">Instructors</NavLink></li>
              <li><NavLink to="/pricing" className="footer-link-nets">Pricing Plans</NavLink></li>
              <li><NavLink to="/contact" className="footer-link-nets">Contact Support</NavLink></li>
            </ul>
          </div>

          {/* Col 3: Training Hubs */}
          <div>
            <h4 className="footer-title-nets">Training Hubs</h4>
            <ul className="footer-links-nets">
              <li style={{ fontSize: '0.875rem' }}>
                <strong style={{ color: '#fff' }}>1. Raji Rasaki Centre</strong>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <MapPin size={13} /> Raji Rasaki Road
                </div>
              </li>
              <li style={{ fontSize: '0.875rem', marginTop: '0.75rem' }}>
                <strong style={{ color: '#fff' }}>2. CBT Centre Complex</strong>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <MapPin size={13} /> CBT Training Complex
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div>
            <h4 className="footer-title-nets">Contact & Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="var(--color-nets-red)" />
                <span>+1 (555) 019-2831</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} color="var(--color-nets-red)" />
                <span>hello@skilluplearningacademy.com</span>
              </div>
              <a
                href="http://localhost:5173/login"
                target="_blank"
                rel="noreferrer"
                className="btn-nets btn-nets-outline-white"
                style={{ fontSize: '0.8125rem', padding: '0.5rem', marginTop: '0.5rem' }}
              >
                Check-In Portal <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-nets">
          <div>© {new Date().getFullYear()} SkillUp Academy. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <NavLink to="/about" className="footer-link-nets">Privacy Policy</NavLink>
            <NavLink to="/about" className="footer-link-nets">Terms of Service</NavLink>
            <NavLink to="/contact" className="footer-link-nets">Contact</NavLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
