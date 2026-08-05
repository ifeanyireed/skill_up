// ============================================================================
// Skill Up Academy Check-in portal — Page 1: Login & Parent Registration Link
// ============================================================================
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, UserCheck, KeyRound, ShieldCheck, UserPlus } from 'lucide-react'
import '../admin.css'
import { useAdminStore } from '../store/useAdminStore'

export function AdminLoginPage() {
  const { login } = useAdminStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise((r) => setTimeout(r, 300))

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      setLoading(false)
      return
    }

    const success = await login(email, password)
    if (success) {
      navigate('/admin', { replace: true })
    } else {
      setError('Invalid credentials or account disabled.')
      setLoading(false)
    }
  }

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('skillup2026')
    setLoading(true)
    const success = await login(demoEmail, 'skillup2026')
    if (success) {
      navigate('/admin', { replace: true })
    } else {
      setError('Invalid credentials or account disabled.')
      setLoading(false)
    }
  }

  return (
    <div className="admin-shell" style={{ overflowX: 'hidden' }}>
      <section
        id="hero"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#0B0E4E',
        }}
      >
        {/* ── Full-bleed background photo ── */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="/cbt-centre.jpeg"
            alt="Skill Up Academy CBT Centre"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
            loading="eager"
          />
          {/* Multi-layer cinematic overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(105deg, rgba(11, 14, 78, 0.96) 0%, rgba(13, 16, 96, 0.82) 50%, rgba(11, 14, 78, 0.5) 100%)',
            }}
          />
          {/* Bottom vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(11, 14, 78, 0.9) 0%, transparent 50%)',
            }}
          />
          {/* Red accent — thin left rule */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              background: 'var(--adm-accent, #C40000)',
              zIndex: 10,
            }}
          />
        </div>

        {/* ── Full-Width Flex Container — Form pushed to Extreme Right with little padding ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            paddingTop: '2.5rem',
            paddingBottom: '2.5rem',
            paddingLeft: 'max(1.5rem, 3.5vw)',
            paddingRight: '1.25rem',
            width: '100%',
            boxSizing: 'border-box',
            flexWrap: 'wrap'
          }}
        >
          {/* ── Left — Hero Title & Brand Info ── */}
          <div
            style={{
              flex: '1 1 480px',
              maxWidth: '560px',
              color: '#FFFFFF'
            }}
          >
            {/* Logo Display */}
            <div style={{ marginBottom: '1.25rem' }}>
              <img
                src="/logo.avif"
                alt="Skill Up Academy Logo"
                style={{
                  height: '56px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1) drop-shadow(0 4px 12px rgba(0,0,0,0.5))'
                }}
              />
            </div>

            {/* Headline — Clean Editorial Title */}
            <h1
              style={{
                color: '#fff',
                marginBottom: '1.125rem',
                fontSize: 'clamp(2.5rem, 4.2vw, 3.8rem)',
                lineHeight: '1.1',
                letterSpacing: '-0.02em',
                fontWeight: 300
              }}
            >
              <strong style={{ fontWeight: 800, color: '#fff' }}>Check-In Portal</strong>
              <br />
              <span style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 300, fontSize: '0.82em' }}>for Every Student.</span>
            </h1>

            {/* Subhead Body */}
            <p
              style={{
                maxWidth: '480px',
                marginBottom: '1.75rem',
                fontSize: '1.0625rem',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: '1.55'
              }}
            >
              Digital child safety & attendance management system. Capture guardian drop-off details and issue 6-digit daily verification PINs for authorized pick-up.
            </p>

            {/* Parent Call-to-Action Card */}
            <div
              style={{
                marginBottom: '1.75rem',
                padding: '1rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                maxWidth: '480px'
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                  Are you a parent registering a child?
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                  Upload child photo & guardian emergency contact details from your phone.
                </div>
              </div>
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: 'var(--adm-accent, #C40000)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem 0.875rem',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <UserPlus size={14} /> Register Child
              </button>
            </div>

            {/* Feature Pills */}
            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.875rem',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '4px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#fff'
                }}
              >
                <KeyRound size={15} color="#C40000" />
                <span>6-Digit Verification PINs</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.875rem',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '4px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#fff'
                }}
              >
                <ShieldCheck size={15} color="#16A34A" />
                <span>Real-Time Child Safety</span>
              </div>
            </div>

            {/* Trust rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ color: 'var(--adm-accent, #C40000)', fontSize: '1rem', letterSpacing: '0.1em' }}>★★★★★</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#fff' }}>Secure & Certified</div>
              <div style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', maxWidth: '300px', lineHeight: 1.4 }}>
                Trusted by instructors, parents, and administrators for safe daily student check-in.
              </div>
            </div>
          </div>

          {/* ── Extreme Right — Staff Login Form Card ── */}
          <div
            style={{
              flex: '0 0 auto',
              width: '100%',
              maxWidth: '420px',
              marginLeft: 'auto'
            }}
          >
            <div
              style={{
                width: '100%',
                background: 'rgba(13, 16, 96, 0.88)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '4px',
                padding: '1.75rem 1.5rem',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
                color: '#fff',
                boxSizing: 'border-box'
              }}
            >
              {/* Card Header */}
              <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '1rem' }}>
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--adm-accent, #C40000)',
                    marginBottom: '0.375rem'
                  }}
                >
                  STAFF PORTAL
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', margin: 0 }}>
                  Sign in to your account
                </h2>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem' }}>
                  Enter your staff credentials to access the check-in portal.
                </div>
              </div>

              {error && (
                <div style={{ padding: '0.625rem', background: 'rgba(220, 38, 38, 0.25)', border: '1px solid #DC2626', borderRadius: '4px', color: '#FECACA', fontSize: '12px', marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)', marginBottom: '0.375rem' }}>
                    Email Address <span style={{ color: 'var(--adm-accent)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="instructor@skillup.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1.5px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '3px',
                      padding: '0.625rem 0.875rem',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)' }}>
                      Password <span style={{ color: 'var(--adm-accent)' }}>*</span>
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault()
                        alert('Password reset link sent to demo email address.')
                      }}
                      style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
                    >
                      Forgot?
                    </a>
                  </div>
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1.5px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '3px',
                      padding: '0.625rem 0.875rem',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: 'var(--adm-accent, #C40000)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '0.75rem 1.25rem',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                    transition: 'opacity 0.15s'
                  }}
                >
                  {loading ? 'Authenticating…' : 'Sign In to Portal'}
                  <ArrowRight size={15} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
