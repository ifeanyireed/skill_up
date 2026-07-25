// ============================================================================
// SkillUp Academy Website — Home Page (NETS Swiss Enterprise Design System)
// Source UI Design System: ~/Downloads/nets-logistics/frontend
// Layout Reference: https://skilluplearningacademy.com/
// ============================================================================
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Building2 } from 'lucide-react'
import { ImageSlideshow } from '../components/ImageSlideshow'

export function HomePage() {
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

  return (
    <div>
      {/* ── 1. HERO SECTION (Editorial Enterprise Dark Navy) ── */}
      <section className="section-py-lg" style={{ background: 'linear-gradient(135deg, #0D1060 0%, #1A1FA8 100%)', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <div className="container-nets">
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <div className="overline-dark">SKILLUP LEARNING ACADEMY</div>
              <h1 className="text-d1" style={{ color: '#FFFFFF', marginBottom: '1.5rem' }}>
                Empower Your Future with <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Tech & Digital Skills.</span>
              </h1>
              <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '2.5rem', maxWidth: '560px' }}>
                SkillUp Academy helps you master modern software development, UI/UX design, and digital tools to boost your career across <strong>Raji Rasaki Centre</strong> and <strong>CBT Centre</strong>.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <NavLink to="/courses" className="btn-nets btn-nets-red">
                  Get Started <ArrowRight size={16} />
                </NavLink>
                <NavLink to="/about" className="btn-nets btn-nets-outline-white">
                  About Our CBT Centre
                </NavLink>
              </div>

              {/* Stats Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1.5rem',
                  marginTop: '3.5rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-sans)' }}>500+</div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Graduated Students</div>
                </div>
                <div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--color-nets-red)', fontFamily: 'var(--font-sans)' }}>2</div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Training Centers</div>
                </div>
                <div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-sans)' }}>95%</div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Career Placement</div>
                </div>
              </div>
            </div>

            <div>
              <ImageSlideshow />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. EMPOWERING YOUR GROWTH (Editorial Swiss White Section) ── */}
      <section className="section-py" style={{ background: 'var(--color-nets-white)' }}>
        <div className="container-nets">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="overline">PRACTICAL SKILLS</div>
              <h2 className="text-d2" style={{ color: 'var(--color-nets-navy)', marginBottom: '1.25rem' }}>
                Empowering Your Growth
              </h2>
              <p style={{ fontSize: '1.0625rem', color: 'var(--color-nets-text-2)', marginBottom: '1.25rem', lineHeight: 1.7 }}>
                At SkillUp Academy, we help you build practical tech and digital skills that open doors to new career opportunities across our Raji Rasaki Centre and CBT Centre.
              </p>
              <p style={{ fontSize: '1.0625rem', color: 'var(--color-nets-text-2)', marginBottom: '2rem', lineHeight: 1.7 }}>
                Our hands-on bootcamps combine expert mentorship with real portfolio projects, giving you the confidence to excel in tech, design, and software engineering.
              </p>
              <div>
                <NavLink to="/courses" className="btn-nets btn-nets-primary">
                  Join Now <ArrowRight size={16} />
                </NavLink>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="Empowering Your Growth"
                style={{ width: '100%', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-card-md)' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-24px',
                  right: '-16px',
                  background: 'var(--color-nets-navy-dark)',
                  color: '#FFFFFF',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-card-lg)',
                  width: '260px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1, color: '#fff' }}>500+</div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>Graduated Students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. OUR SERVICES & SKILL PATHWAYS (Swiss Light Background) ── */}
      <section className="section-py" style={{ background: 'var(--color-nets-light)', borderTop: '1px solid var(--color-nets-border)', borderBottom: '1px solid var(--color-nets-border)' }}>
        <div className="container-nets">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <div className="overline" style={{ justifyContent: 'center' }}>SKILL PATHWAYS</div>
            <h2 className="text-d3" style={{ color: 'var(--color-nets-text)', marginBottom: '0.75rem' }}>
              Our Services & Programs
            </h2>
            <p style={{ fontSize: '1.0625rem', color: 'var(--color-nets-text-2)' }}>
              Focused courses designed to boost your career growth quickly and effectively.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3rem', alignItems: 'start' }}>
            <div>
              <img
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800"
                alt="Workspace"
                style={{ width: '100%', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-card)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="card-nets" style={{ borderLeft: '3px solid var(--color-nets-navy)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-nets-text)', marginBottom: '0.5rem' }}>Digital Marketing</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)' }}>
                  Practical strategies in SEO, social media, and content marketing.
                </p>
              </div>

              <div className="card-nets" style={{ borderLeft: '3px solid var(--color-nets-navy)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-nets-text)', marginBottom: '0.5rem' }}>Tech Skills</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)' }}>
                  Hands-on lessons in coding, development, and IT essentials.
                </p>
              </div>

              <div className="card-nets" style={{ borderLeft: '3px solid var(--color-nets-navy)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-nets-text)', marginBottom: '0.5rem' }}>Design Courses</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)' }}>
                  Creative paths through UX, UI, and graphic design fundamentals.
                </p>
              </div>

              <div className="card-nets" style={{ borderLeft: '3px solid var(--color-nets-red)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-nets-text)', marginBottom: '0.5rem' }}>Safety Check-In</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)' }}>
                  Digital 6-digit PIN safety verification for daily student drop-off.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. OUR CBT CENTRE (Enterprise Dark Navy) ── */}
      <section className="section-py" style={{ background: 'var(--color-nets-navy-dark)', color: '#FFFFFF' }}>
        <div className="container-nets">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div className="overline-dark">FACILITY HIGHLIGHT</div>
              <h2 className="text-d3" style={{ color: '#FFFFFF', marginBottom: '0.75rem' }}>Our CBT Centre</h2>
              <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.85)', marginBottom: '1.75rem' }}>
                You didn’t come this far to stop.
              </p>
              <NavLink to="/about" className="btn-nets btn-nets-outline-white">
                Explore Facilities <ArrowRight size={16} />
              </NavLink>
            </div>

            <div>
              <img
                src="/cbt-centre.jpeg"
                alt="Modern CBT Centre Facility"
                style={{ width: '100%', borderRadius: 'var(--radius-sm)', height: '320px', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600"
                alt="Coding Lab"
                style={{ width: '100%', borderRadius: 'var(--radius-sm)', height: '150px', objectFit: 'cover' }}
              />
              <img
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600"
                alt="UI/UX Design Room"
                style={{ width: '100%', borderRadius: 'var(--radius-sm)', height: '150px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SUBSCRIBE CTA BANNER ── */}
      <section className="section-py" style={{ background: 'var(--color-nets-navy)', color: '#FFFFFF', textAlign: 'center' }}>
        <div className="container-nets" style={{ maxWidth: '640px' }}>
          <div className="overline-dark" style={{ justifyContent: 'center' }}>STAY CONNECTED</div>
          <h2 className="text-d3" style={{ color: '#FFFFFF', marginBottom: '0.75rem' }}>
            Join SkillUp Today
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '2rem' }}>
            Get updates on new courses, upcoming bootcamps, and exclusive career tips.
          </p>

          {subscribed ? (
            <div style={{ color: '#16A34A', fontSize: '1rem', fontWeight: 600, background: 'rgba(255,255,255,0.95)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              ✓ Thanks for subscribing to SkillUp updates!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', background: '#FFFFFF', padding: '6px', borderRadius: 'var(--radius-sm)' }}>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', padding: '0.5rem 1rem', fontSize: '0.9375rem', color: '#000' }}
              />
              <button type="submit" className="btn-nets btn-nets-red" style={{ padding: '0.625rem 1.5rem' }}>
                Subscribe Now
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
