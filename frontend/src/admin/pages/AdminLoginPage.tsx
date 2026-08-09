// ============================================================================
// Kiddies Academy — Check-in & Learning Portal (kids.skilluplearningacademy.com)
// Landing Page with Kids 8-Digit Code Login Toggle & PuzzlePro Header Link
// ============================================================================
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Sparkles,
  KeyRound,
  ShieldCheck,
  UserPlus,
  Puzzle,
  Globe,
  Smile,
  GraduationCap
} from 'lucide-react'
import '../admin.css'
import { useAdminStore } from '../store/useAdminStore'

export function AdminLoginPage() {
  const { login, kidLogin } = useAdminStore()
  const navigate = useNavigate()

  // Toggle between 'kid' and 'staff' login mode
  const [loginMode, setLoginMode] = useState<'kid' | 'staff'>('kid')

  // Staff credentials
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Kids 8-digit student code
  const [kidCode, setKidCode] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle Staff Submission
  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise((r) => setTimeout(r, 250))

    if (!email.trim() || !password.trim()) {
      setError('Please enter your staff email and password.')
      setLoading(false)
      return
    }

    const success = await login(email, password)
    if (success) {
      navigate('/admin', { replace: true })
    } else {
      setError('Invalid staff credentials or account disabled.')
      setLoading(false)
    }
  }

  // Handle Kids 8-Digit Code Submission
  const handleKidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise((r) => setTimeout(r, 250))

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

  const handleQuickKidLogin = async (demoCode: string) => {
    setKidCode(demoCode)
    setLoading(true)
    setError('')
    const success = await kidLogin(demoCode)
    if (success) {
      navigate('/admin', { replace: true })
    } else {
      setError('Invalid code.')
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
            alt="Kiddies Academy CBT Learning Centre"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
            loading="eager"
          />
          {/* Multi-layer cinematic overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(105deg, rgba(11, 14, 78, 0.96) 0%, rgba(13, 16, 96, 0.85) 50%, rgba(11, 14, 78, 0.55) 100%)',
            }}
          />
          {/* Bottom vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(11, 14, 78, 0.92) 0%, transparent 50%)',
            }}
          />
          {/* Accent border */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              background: 'linear-gradient(180deg, #FACC15 0%, #C40000 100%)',
              zIndex: 10,
            }}
          />
        </div>

        {/* ── Top Header Navigation Bar ── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            padding: '1.25rem max(1.5rem, 3.5vw)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="/logo.avif"
              alt="Kiddies Academy"
              style={{
                height: '42px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
              }}
            />
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '0.35rem 0.75rem',
                borderRadius: '20px',
                color: '#FFF',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <Globe size={13} color="#FACC15" /> kids.skilluplearningacademy.com
            </div>
          </div>

          {/* PuzzlePro Quick Header Button */}
          <a
            href="https://www.skilliplearningacademy.com/puzzlepro"
            target="_blank"
            rel="noreferrer"
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              color: '#FFF',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '20px',
              padding: '0.5rem 1rem',
              fontSize: '13px',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
            }}
          >
            <Puzzle size={16} color="#FACC15" /> PuzzlePro
          </a>
        </div>

        {/* ── Main Flex Container ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2.5rem',
            paddingTop: '6rem',
            paddingBottom: '2.5rem',
            paddingLeft: 'max(1.5rem, 3.5vw)',
            paddingRight: '1.25rem',
            width: '100%',
            boxSizing: 'border-box',
            flexWrap: 'wrap',
          }}
        >
          {/* ── Left — Hero Title & Kiddies Academy Info ── */}
          <div
            style={{
              flex: '1 1 480px',
              maxWidth: '580px',
              color: '#FFFFFF',
            }}
          >
            {/* Domain Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(250, 204, 21, 0.15)',
                border: '1px solid rgba(250, 204, 21, 0.4)',
                borderRadius: '30px',
                padding: '0.4rem 0.875rem',
                marginBottom: '1.25rem',
                fontSize: '13px',
                fontWeight: 800,
                color: '#FACC15',
              }}
            >
              <Sparkles size={15} /> Welcome to Kiddies Academy Portal
            </div>

            {/* Headline Title */}
            <h1
              style={{
                color: '#fff',
                marginBottom: '1.125rem',
                fontSize: 'clamp(2.5rem, 4.2vw, 3.8rem)',
                lineHeight: '1.1',
                letterSpacing: '-0.02em',
                fontWeight: 300,
              }}
            >
              <strong style={{ fontWeight: 900, color: '#fff' }}>Kiddies Academy</strong>
              <br />
              <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 300, fontSize: '0.82em' }}>
                kids.skilluplearningacademy.com
              </span>
            </h1>

            {/* Subhead Body */}
            <p
              style={{
                maxWidth: '500px',
                marginBottom: '1.75rem',
                fontSize: '1.0625rem',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: '1.55',
              }}
            >
              Digital child safety, attendance tracking & learning management hub. Kids log in with their 8-digit student code for instant access to lessons and daily check-ins!
            </p>

            {/* Parent Registration Card */}
            <div
              style={{
                padding: '1rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                maxWidth: '500px',
                marginBottom: '2rem',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                  Registering a new student?
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                  Upload child photo & guardian contact details online.
                </div>
              </div>
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: 'var(--adm-accent, #C40000)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 0.875rem',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
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
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#fff',
                }}
              >
                <KeyRound size={15} color="#FACC15" />
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
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#fff',
                }}
              >
                <ShieldCheck size={15} color="#16A34A" />
                <span>Safe Check-In Verification</span>
              </div>
            </div>
          </div>

          {/* ── Right — Login Form Card with KIDS / STAFF Mode Toggle ── */}
          <div
            style={{
              flex: '0 0 auto',
              width: '100%',
              maxWidth: '430px',
              marginLeft: 'auto',
            }}
          >
            <div
              style={{
                width: '100%',
                background: 'rgba(13, 16, 96, 0.92)',
                border: '1.5px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '12px',
                padding: '1.75rem 1.5rem',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
                color: '#fff',
                boxSizing: 'border-box',
              }}
            >
              {/* Mode Selector Toggle Tabs (Kids vs Staff) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '4px',
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('kid')
                    setError('')
                  }}
                  style={{
                    background: loginMode === 'kid' ? '#FACC15' : 'transparent',
                    color: loginMode === 'kid' ? '#0F172A' : 'rgba(255,255,255,0.7)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.625rem 0.5rem',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Smile size={16} /> Kids Login (8-Digit)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('staff')
                    setError('')
                  }}
                  style={{
                    background: loginMode === 'staff' ? '#C40000' : 'transparent',
                    color: loginMode === 'staff' ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.625rem 0.5rem',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <GraduationCap size={16} /> Staff Login
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div
                  style={{
                    padding: '0.625rem',
                    background: 'rgba(220, 38, 38, 0.25)',
                    border: '1px solid #DC2626',
                    borderRadius: '6px',
                    color: '#FECACA',
                    fontSize: '12.5px',
                    marginBottom: '1rem',
                  }}
                >
                  {error}
                </div>
              )}

              {/* ── MODE A: KIDS LOGIN (ONLY 8-DIGIT CODE) ── */}
              {loginMode === 'kid' ? (
                <form onSubmit={handleKidSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#FACC15', marginBottom: '0.25rem' }}>
                      🎒 Student Portal Sign-In
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>
                      Enter your unique <strong>8-digit student code</strong> to enter Kiddies Academy.
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'rgba(255,255,255,0.85)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      8-Digit Student Code <span style={{ color: '#FACC15' }}>*</span>
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
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid #FACC15',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        color: '#FACC15',
                        fontSize: '22px',
                        fontWeight: 900,
                        fontFamily: 'monospace',
                        letterSpacing: '0.25em',
                        textAlign: 'center',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Demo Kid Code Button */}
                  <button
                    type="button"
                    onClick={() => handleQuickKidLogin('88776655')}
                    style={{
                      background: 'rgba(250, 204, 21, 0.12)',
                      border: '1px dashed rgba(250, 204, 21, 0.4)',
                      borderRadius: '6px',
                      color: '#FACC15',
                      padding: '0.5rem',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ✨ Try Demo Student Code: 88776655
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      background: '#FACC15',
                      color: '#0F172A',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.85rem 1.25rem',
                      fontSize: '14.5px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginTop: '0.25rem',
                      boxShadow: '0 4px 14px rgba(250, 204, 21, 0.3)',
                    }}
                  >
                    {loading ? 'Verifying Code…' : 'Enter Kiddies Portal 🚀'}
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                /* ── MODE B: STAFF LOGIN (EMAIL + PASSWORD) ── */
                <form onSubmit={handleStaffSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div style={{ marginBottom: '0.25rem' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                      🎓 Instructor & Admin Portal
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                      Enter staff credentials to manage child check-ins and security rules.
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'rgba(255,255,255,0.8)',
                        marginBottom: '0.375rem',
                      }}
                    >
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
                        borderRadius: '6px',
                        padding: '0.625rem 0.875rem',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.375rem',
                      }}
                    >
                      <label
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'rgba(255,255,255,0.8)',
                        }}
                      >
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
                        borderRadius: '6px',
                        padding: '0.625rem 0.875rem',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box',
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
                      borderRadius: '6px',
                      padding: '0.75rem 1.25rem',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginTop: '0.5rem',
                    }}
                  >
                    {loading ? 'Authenticating…' : 'Sign In as Staff'}
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
