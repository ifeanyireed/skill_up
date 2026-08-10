// ============================================================================
// Kiddies Academy — Check-in & Learning Portal (kids.skilluplearningacademy.com)
// ============================================================================
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, KeyRound, ShieldCheck, UserPlus, Smile, GraduationCap, Puzzle } from 'lucide-react'
import '../admin.css'
import { useAdminStore } from '../store/useAdminStore'

export function AdminLoginPage() {
  const { login, kidLogin } = useAdminStore()
  const navigate = useNavigate()

  // Mode: 'kid' (8-digit code) vs 'staff' (email + password)
  const [loginMode, setLoginMode] = useState<'kid' | 'staff'>('kid')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [kidCode, setKidCode] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleStaffSubmit = async (e: React.FormEvent) => {
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

  const handleKidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise((r) => setTimeout(r, 300))

    const cleanCode = kidCode.replace(/\D/g, '')
    if (cleanCode.length !== 8) {
      setError('Please enter a valid 8-digit student code.')
      setLoading(false)
      return
    }

    const success = await kidLogin(cleanCode)
    if (success) {
      navigate('/admin', { replace: true })
    } else {
      setError('Invalid 8-digit student code.')
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
            alt="Future Programs For Kids CBT Centre"
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

        {/* ── Extreme Top Right Corner PuzzlePro Button ── */}
        <a
          href="https://www.skilluplearningacademy.com/puzzlepro"
          target="_blank"
          rel="noreferrer"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 100,
            background: 'var(--adm-accent, #C40000)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 0.875rem',
            fontSize: '12.5px',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          <Puzzle size={14} /> PuzzlePro
        </a>

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
                alt="Future Programs For Kids Logo"
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
              <strong style={{ fontWeight: 800, color: '#fff' }}>Future Programs</strong>
              <br />
              <span style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 300, fontSize: '0.82em' }}>For Kids.</span>
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
              Get access to On-Demand Future Skills and Programs for kids, join exclusive workshops, interactive learning tools, and safe daily child check-ins.
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
                <span>8-Digit Kids Student Code</span>
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

          {/* ── Extreme Right — Login Form Card with Mode Toggle ── */}
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
              {/* Login Mode Toggle Tabs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '3px',
                  padding: '3px',
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <button
                  type="button"
                  onClick={() => { setLoginMode('kid'); setError('') }}
                  style={{
                    background: loginMode === 'kid' ? 'var(--adm-accent, #C40000)' : 'transparent',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '0.5rem',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem'
                  }}
                >
                  <Smile size={14} /> Kids (8-Digit Code)
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMode('staff'); setError('') }}
                  style={{
                    background: loginMode === 'staff' ? 'var(--adm-accent, #C40000)' : 'transparent',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '0.5rem',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem'
                  }}
                >
                  <GraduationCap size={14} /> Staff Login
                </button>
              </div>

              {error && (
                <div style={{ padding: '0.625rem', background: 'rgba(220, 38, 38, 0.25)', border: '1px solid #DC2626', borderRadius: '4px', color: '#FECACA', fontSize: '12px', marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              {loginMode === 'kid' ? (
                <form onSubmit={handleKidSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--adm-accent, #C40000)', marginBottom: '0.25rem' }}>
                      STUDENT PORTAL
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)' }}>
                      Enter your 8-digit student code to sign in.
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)', marginBottom: '0.375rem' }}>
                      8-Digit Code <span style={{ color: 'var(--adm-accent)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      required
                      placeholder="e.g. 88776655"
                      value={kidCode}
                      onChange={(e) => setKidCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1.5px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '3px',
                        padding: '0.625rem 0.875rem',
                        color: '#fff',
                        fontSize: '18px',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        letterSpacing: '0.2em',
                        textAlign: 'center',
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
                    {loading ? 'Authenticating…' : 'Enter Portal'}
                    <ArrowRight size={15} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleStaffSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--adm-accent, #C40000)', marginBottom: '0.25rem' }}>
                      STAFF PORTAL
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)' }}>
                      Enter staff email and password.
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)', marginBottom: '0.375rem' }}>
                      Email Address <span style={{ color: 'var(--adm-accent)' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="instructor@kids.skilluplearningacademy.com"
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
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
