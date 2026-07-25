// ============================================================================
// SkillUp Academy Website — About Page (NETS Swiss Enterprise Design System)
// Source UI Design System: ~/Downloads/nets-logistics/frontend
// ============================================================================
import React from 'react'
import { NavLink } from 'react-router-dom'
import { Building2, ShieldCheck, Target, ArrowRight } from 'lucide-react'

export function AboutPage() {
  return (
    <div>
      <section className="section-py" style={{ background: 'var(--color-nets-navy-dark)', color: '#FFFFFF' }}>
        <div className="container-nets" style={{ textAlign: 'center', maxWidth: '720px' }}>
          <div className="overline-dark" style={{ justifyContent: 'center' }}>ABOUT SKILLUP ACADEMY</div>
          <h1 className="text-d2" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>Empowering Careers Through Practical Tech Skills</h1>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255, 255, 255, 0.85)' }}>
            SkillUp Academy offers beginner to intermediate courses in tech, UI/UX design, and digital skills across our premier Raji Rasaki Centre and CBT Centre complex.
          </p>
        </div>
      </section>

      <section className="section-py" style={{ background: 'var(--color-nets-white)' }}>
        <div className="container-nets">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <div className="overline">OUR MISSION</div>
              <h2 className="text-d3" style={{ color: 'var(--color-nets-navy)', marginBottom: '1rem' }}>
                Bridging the Gap Between Learning & Employability
              </h2>
              <p style={{ color: 'var(--color-nets-text-2)', fontSize: '0.9375rem', marginBottom: '1rem', lineHeight: 1.7 }}>
                At SkillUp Academy, we believe that education should directly translate to career opportunities. We don't just teach theory; our hands-on curriculum ensures every student graduates with a professional portfolio of real projects.
              </p>
              <p style={{ color: 'var(--color-nets-text-2)', fontSize: '0.9375rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                From our dual training facilities at <strong>Raji Rasaki Centre</strong> and <strong>CBT Centre</strong>, we serve learners of all ages, including young tech enthusiasts and professionals seeking career transitions.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="card-nets" style={{ padding: '1.25rem', borderLeft: '3px solid var(--color-nets-navy)' }}>
                  <Target size={22} color="var(--color-nets-navy)" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-nets-text)' }}>Practical Curriculum</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-nets-text-2)' }}>100% project-based building</div>
                </div>
                <div className="card-nets" style={{ padding: '1.25rem', borderLeft: '3px solid var(--color-nets-red)' }}>
                  <ShieldCheck size={22} color="var(--color-nets-red)" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-nets-text)' }}>Guardian PIN Portal</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-nets-text-2)' }}>Digital safety check-in</div>
                </div>
              </div>
            </div>

            <div>
              <img
                src="/cbt-centre.jpeg"
                alt="CBT Centre"
                style={{ width: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-nets-border)', boxShadow: 'var(--shadow-card-lg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Comparison */}
      <section className="section-py" style={{ background: 'var(--color-nets-light)', borderTop: '1px solid var(--color-nets-border)' }}>
        <div className="container-nets">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <div className="overline" style={{ justifyContent: 'center' }}>OUR CENTERS</div>
            <h2 className="text-d3" style={{ color: 'var(--color-nets-text)' }}>Two Dedicated Training Hubs</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="card-nets" style={{ borderLeft: '4px solid var(--color-nets-navy)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Building2 size={24} color="var(--color-nets-navy)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-nets-text)' }}>1. Raji Rasaki Centre</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)', marginBottom: '1rem' }}>
                Located at Raji Rasaki Road. Features active training classrooms, junior tech bootcamps, and personalized instructor mentoring spaces.
              </p>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-nets-text)', fontWeight: 600 }}>Key Highlights:</div>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-nets-text-2)' }}>
                <li>Junior Dragons & Youth Tech Classrooms</li>
                <li>Parent drop-off reception with digital 6-digit PIN safety verification</li>
                <li>Hands-on group discussion tables</li>
              </ul>
            </div>

            <div className="card-nets" style={{ borderLeft: '4px solid var(--color-nets-red)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Building2 size={24} color="var(--color-nets-red)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-nets-text)' }}>2. CBT Centre Complex</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)', marginBottom: '1rem' }}>
                Located at the main CBT Complex. Designed for high-density testing, software development labs, and UI/UX design studios.
              </p>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-nets-text)', fontWeight: 600 }}>Key Highlights:</div>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-nets-text-2)' }}>
                <li>High-speed fiber connectivity & dual-monitor workstations</li>
                <li>Computer-Based Testing (CBT) examination hall</li>
                <li>Advanced software engineering bootcamp suites</li>
              </ul>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <NavLink to="/contact" className="btn-nets btn-nets-red">
              Visit Our Centers <ArrowRight size={16} />
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  )
}
