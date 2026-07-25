// ============================================================================
// SkillUp Academy Website — Pricing Page (NETS Swiss Enterprise Design System)
// Source UI Design System: ~/Downloads/nets-logistics/frontend
// ============================================================================
import React from 'react'
import { NavLink } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export function PricingPage() {
  return (
    <div>
      <section className="section-py" style={{ background: 'var(--color-nets-navy-dark)', color: '#FFFFFF' }}>
        <div className="container-nets" style={{ textAlign: 'center', maxWidth: '720px' }}>
          <div className="overline-dark" style={{ justifyContent: 'center' }}>FLEXIBLE LEARNING PLANS</div>
          <h1 className="text-d2" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>SkillUp Academy Pricing</h1>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255, 255, 255, 0.85)' }}>
            Affordable pricing for tech, design, and digital skills courses designed to boost your career growth across Raji Rasaki Centre and CBT Centre.
          </p>
        </div>
      </section>

      <section className="section-py" style={{ background: 'var(--color-nets-light)' }}>
        <div className="container-nets">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Plan 1 */}
            <div className="card-nets" style={{ textAlign: 'center', padding: '2.5rem 1.75rem', borderTop: '3px solid var(--color-nets-border)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-nets-text-2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                STARTER TRACK
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 600, marginTop: '0.5rem', color: 'var(--color-nets-text)' }}>Single Course Pass</h3>
              <div style={{ fontSize: '2.75rem', fontWeight: 700, color: 'var(--color-nets-navy)', margin: '1rem 0 0.25rem' }}>$189</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)', marginBottom: '1.5rem' }}>
                Ideal for learning a specific skill like Figma or Digital Marketing.
              </p>

              <ul style={{ listStyle: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--color-nets-text-2)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-nets-navy)" /> Access to 1 Full Course
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-nets-navy)" /> Lab access at Raji Rasaki & CBT
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-nets-navy)" /> 2 Portfolio Projects
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-nets-navy)" /> Completion Certificate
                </li>
              </ul>

              <NavLink to="/contact" className="btn-nets btn-nets-outline" style={{ width: '100%' }}>
                Select Starter Plan
              </NavLink>
            </div>

            {/* Plan 2 Featured */}
            <div className="card-nets" style={{ textAlign: 'center', padding: '2.5rem 1.75rem', border: '2px solid var(--color-nets-red)', position: 'relative', boxShadow: 'var(--shadow-card-lg)' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-nets-red)', color: '#fff', fontSize: '0.6875rem', fontWeight: 800, padding: '3px 12px', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                MOST POPULAR
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-nets-red)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                CAREER BOOTCAMP
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 600, marginTop: '0.5rem', color: 'var(--color-nets-text)' }}>Full Career Track</h3>
              <div style={{ fontSize: '2.75rem', fontWeight: 700, color: 'var(--color-nets-navy)', margin: '1rem 0 0.25rem' }}>$299</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)', marginBottom: '1.5rem' }}>
                Fullstack Web Development or Python Data Analytics career bundle.
              </p>

              <ul style={{ listStyle: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--color-nets-text-2)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-nets-red)" /> Full 12-Week Intensive Bootcamp
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-nets-red)" /> Unlimited CBT Workstation Access
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-nets-red)" /> 1-on-1 Instructor Mentorship
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-nets-red)" /> 5 Production Portfolio Apps
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-nets-red)" /> Career Placement Assistance
                </li>
              </ul>

              <NavLink to="/contact" className="btn-nets btn-nets-red" style={{ width: '100%' }}>
                Enroll in Bootcamp <ArrowRight size={16} />
              </NavLink>
            </div>

            {/* Plan 3 */}
            <div className="card-nets" style={{ textAlign: 'center', padding: '2.5rem 1.75rem', borderTop: '3px solid var(--color-nets-border)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-nets-text-2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                YOUTH / TEEN PASS
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 600, marginTop: '0.5rem', color: 'var(--color-nets-text)' }}>Junior Tech Academy</h3>
              <div style={{ fontSize: '2.75rem', fontWeight: 700, color: 'var(--color-nets-navy)', margin: '1rem 0 0.25rem' }}>$149</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)', marginBottom: '1.5rem' }}>
                Designed for kids and teens (ages 4-19) in Little Dragons & Junior Champions.
              </p>

              <ul style={{ listStyle: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--color-nets-text-2)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-nets-navy)" /> Scratch, Python & Robotics
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-nets-navy)" /> 6-Digit Daily Safety PIN Portal
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-nets-navy)" /> Parent Progress Reports
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-nets-navy)" /> Weekend & After-School Classes
                </li>
              </ul>

              <NavLink to="/contact" className="btn-nets btn-nets-outline" style={{ width: '100%' }}>
                Enroll Junior Student
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
