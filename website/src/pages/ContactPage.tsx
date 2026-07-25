// ============================================================================
// SkillUp Academy Website — Contact Page (NETS Swiss Enterprise Design System)
// Source UI Design System: ~/Downloads/nets-logistics/frontend
// ============================================================================
import React, { useState } from 'react'
import { Phone, Mail, MapPin, Send, CheckCircle2, Building2 } from 'lucide-react'

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [center, setCenter] = useState('Raji Rasaki Centre')
  const [program, setProgram] = useState('Fullstack Web Development')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) {
      alert('Please fill out your name and email.')
      return
    }
    setSubmitted(true)
  }

  return (
    <div>
      <section className="section-py" style={{ background: 'var(--color-nets-navy-dark)', color: '#FFFFFF' }}>
        <div className="container-nets" style={{ textAlign: 'center', maxWidth: '720px' }}>
          <div className="overline-dark" style={{ justifyContent: 'center' }}>GET IN TOUCH</div>
          <h1 className="text-d2" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>Contact SkillUp Academy</h1>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255, 255, 255, 0.85)' }}>
            Get in touch with SkillUp Academy to ask about courses, enrollment, or career advice. We're here to help you upgrade your skills and future.
          </p>
        </div>
      </section>

      <section className="section-py" style={{ background: 'var(--color-nets-white)' }}>
        <div className="container-nets">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'start' }}>
            {/* Left: Contact Info & Centers */}
            <div>
              <h2 className="text-d4" style={{ color: 'var(--color-nets-text)', marginBottom: '1.25rem' }}>Our Learning Locations</h2>

              {/* Center 1 Card */}
              <div className="card-nets" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--color-nets-navy)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--color-nets-text)' }}>
                  <Building2 size={18} color="var(--color-nets-navy)" /> 1. Raji Rasaki Centre
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} /> Raji Rasaki Road Training Hub
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-nets-text-2)', marginTop: '0.375rem' }}>
                  Open Monday – Saturday: 8:00 AM – 6:00 PM
                </div>
              </div>

              {/* Center 2 Card */}
              <div className="card-nets" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--color-nets-red)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--color-nets-text)' }}>
                  <Building2 size={18} color="var(--color-nets-red)" /> 2. Festac Centre
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} /> CBT Training Complex, Main Gate
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-nets-text-2)', marginTop: '0.375rem' }}>
                  Open Monday – Saturday: 8:00 AM – 8:00 PM
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem', color: 'var(--color-nets-text)' }}>
                  <Phone size={18} color="var(--color-nets-red)" />
                  <span>+1 (555) 019-2831 / +1 (555) 234-8901</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem', color: 'var(--color-nets-text)' }}>
                  <Mail size={18} color="var(--color-nets-red)" />
                  <span>hello@skilluplearningacademy.com</span>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="card-nets">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <CheckCircle2 size={48} color="#16A34A" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.375rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-nets-text)' }}>Message Received!</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)', marginBottom: '1.5rem' }}>
                    Thank you, {fullName}. Our admissions team at <strong>{center}</strong> will reach out to you within 24 hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-nets btn-nets-outline">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-nets-text)' }}>Enrollment & General Inquiry</h3>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-nets-text-2)', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Vance"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-nets-border)',
                        background: '#FFFFFF',
                        color: 'var(--color-nets-text)',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-nets-text-2)', marginBottom: '4px' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-nets-border)',
                          background: '#FFFFFF',
                          color: 'var(--color-nets-text)',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-nets-text-2)', marginBottom: '4px' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-nets-border)',
                          background: '#FFFFFF',
                          color: 'var(--color-nets-text)',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-nets-text-2)', marginBottom: '4px' }}>
                        Preferred Center
                      </label>
                      <select
                        value={center}
                        onChange={(e) => setCenter(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-nets-border)',
                          background: '#FFFFFF',
                          color: 'var(--color-nets-text)',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      >
                        <option value="Raji Rasaki Centre">1. Raji Rasaki Centre</option>
                        <option value="Festac Centre">2. Festac Centre</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-nets-text-2)', marginBottom: '4px' }}>
                        Program of Interest
                      </label>
                      <select
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-nets-border)',
                          background: '#FFFFFF',
                          color: 'var(--color-nets-text)',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      >
                        <option value="Fullstack Web Development">Fullstack Web Development</option>
                        <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                        <option value="Python & Data Analytics">Python & Data Analytics</option>
                        <option value="Cyber Security">Cyber Security</option>
                        <option value="Junior Tech Academy">Junior Tech Academy (Kids/Teens)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-nets-text-2)', marginBottom: '4px' }}>
                      Message or Questions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ask us anything about course schedules, fees, or facility tours..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-nets-border)',
                        background: '#FFFFFF',
                        color: 'var(--color-nets-text)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-nets btn-nets-red"
                    style={{ padding: '0.75rem', justifyContent: 'center' }}
                  >
                    Submit Inquiry <Send size={16} />
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
