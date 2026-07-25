// ============================================================================
// Skill Up Academy Check-in portal — Page 4: Daily Check-In Screen
// Connected to Go + GORM MySQL backend with Center Selection (Raji Rasaki vs CBT Centre)
// ============================================================================
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  KeyRound,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  ShieldAlert,
  ArrowRight,
  Loader2,
  Building2
} from 'lucide-react'
import '../admin.css'
import { getChildren, checkInChild, BackendChild } from '../services/api'

export function CheckInPage() {
  const navigate = useNavigate()
  const [children, setChildren] = useState<BackendChild[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null)

  // Form Fields
  const [center, setCenter] = useState('Raji Rasaki Centre')
  const [adultName, setAdultName] = useState('')
  const [adultPhone, setAdultPhone] = useState('')
  const [relationship, setRelationship] = useState('Mother')
  const [notes, setNotes] = useState('')
  const [arrivalTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

  // Generated Result State
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getChildren('Not Checked In', search, center)
      setChildren(data)
    } catch (err) {
      console.warn('Backend error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [search, center])

  const selectedChild = children.find((c) => c.id === selectedChildId)

  const handleSelectChild = (child: BackendChild) => {
    setSelectedChildId(child.id)
    setAdultName(child.parent_name)
    setAdultPhone(child.parent_phone)
    setRelationship(child.parent_relationship || 'Mother')
    if (child.center) setCenter(child.center)
  }

  const handleGenerateAndCheckIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChild) return
    if (!adultName.trim() || !adultPhone.trim()) {
      alert('Please enter the drop-off adult name and contact phone number.')
      return
    }

    setSubmitting(true)
    try {
      const res = await checkInChild(selectedChild.id, adultName, adultPhone, relationship, notes, center)
      setGeneratedCode(res.pickup_pin || res.child?.active_code || '482910')
    } catch (err: any) {
      alert(err.message || 'Check-in failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Daily Child Check-In</div>
          <div className="admin-page-desc">
            Register child arrival, select center location, record drop-off details, and generate daily 6-digit pickup PIN
          </div>
        </div>

        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/children')}>
            <Search size={14} /> View Directory
          </button>
        </div>
      </div>

      {generatedCode && selectedChild ? (
        /* SUCCESS CONFIRMATION & 6-DIGIT CODE DISPLAY */
        <div className="admin-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', animation: 'adminSlideUp 0.2s ease' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--adm-success-subtle)',
              color: 'var(--adm-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}
          >
            <CheckCircle2 size={32} />
          </div>

          <span className="admin-badge admin-badge-green" style={{ fontSize: '12px', padding: '4px 12px' }}>
            CHECK-IN CONFIRMED AT {center.toUpperCase()}
          </span>

          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--adm-text-1)', marginTop: '0.75rem' }}>
            {selectedChild.full_name} is Checked In!
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--adm-text-3)', marginTop: '0.25rem' }}>
            Center: <strong>{center}</strong> • Student ID: <strong>{selectedChild.student_id}</strong> • Arrival Time: <strong>{arrivalTime}</strong>
          </p>

          {/* 6-DIGIT PIN DISPLAY CARD */}
          <div
            style={{
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              padding: '1.5rem',
              background: 'var(--adm-surface-2)',
              border: '2px dashed var(--adm-accent)',
              borderRadius: 'var(--adm-radius)',
              maxWidth: '380px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--adm-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              DAILY PICKUP VERIFICATION PIN
            </div>

            <div
              style={{
                fontSize: '36px',
                fontWeight: 900,
                fontFamily: 'monospace',
                color: 'var(--adm-accent)',
                letterSpacing: '0.15em',
                margin: '0.5rem 0'
              }}
            >
              #{generatedCode}
            </div>

            <div style={{ fontSize: '12px', color: 'var(--adm-text-2)' }}>
              Give this 6-digit code to {adultName} ({relationship}). Required for pickup at {center}.
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="admin-btn admin-btn-ghost" onClick={handleCopyCode}>
              {copied ? <Check size={14} color="var(--adm-success)" /> : <Copy size={14} />}
              {copied ? 'PIN Copied!' : 'Copy 6-Digit PIN'}
            </button>

            <button className="admin-btn admin-btn-ghost" onClick={() => window.print()}>
              <Printer size={14} /> Print Security Slip
            </button>

            <button className="admin-btn admin-btn-primary" onClick={() => { setGeneratedCode(null); setSelectedChildId(null); loadData(); }}>
              Next Check-In <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* CHECK-IN FORM */
        <form onSubmit={handleGenerateAndCheckIn} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Step 1: Select Training Center & Child */}
          <div>
            <label className="admin-label admin-label-req" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--adm-text-1)' }}>
              1. Training Center Location
            </label>

            <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setCenter('Raji Rasaki Centre')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--adm-radius-sm)',
                    border: center === 'Raji Rasaki Centre' ? '2px solid var(--adm-accent)' : '1px solid var(--adm-border)',
                    background: center === 'Raji Rasaki Centre' ? 'var(--adm-accent-subtle)' : 'var(--adm-surface-2)',
                    color: center === 'Raji Rasaki Centre' ? 'var(--adm-accent)' : 'var(--adm-text-1)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Building2 size={15} /> 1. Raji Rasaki Centre
                </button>

                <button
                  type="button"
                  onClick={() => setCenter('Festac Centre')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--adm-radius-sm)',
                    border: center === 'Festac Centre' ? '2px solid var(--adm-accent)' : '1px solid var(--adm-border)',
                    background: center === 'Festac Centre' ? 'var(--adm-accent-subtle)' : 'var(--adm-surface-2)',
                    color: center === 'Festac Centre' ? 'var(--adm-accent)' : 'var(--adm-text-1)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Building2 size={15} /> 2. Festac Centre
                </button>
              </div>
            </div>

            <label className="admin-label admin-label-req" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--adm-text-1)' }}>
              2. Select Child Student ({center})
            </label>

            {!selectedChild ? (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="admin-toolbar-search" style={{ width: '100%', height: '38px' }}>
                  <Search size={14} color="var(--adm-text-3)" />
                  <input
                    placeholder={`Search child name or Student ID at ${center}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div
                  style={{
                    maxHeight: '180px',
                    overflowY: 'auto',
                    border: '1px solid var(--adm-border)',
                    borderRadius: 'var(--adm-radius-sm)',
                    background: 'var(--adm-surface-2)'
                  }}
                >
                  {loading ? (
                    <div className="admin-table-empty" style={{ padding: '1.5rem' }}>
                      <Loader2 size={16} className="animate-spin" style={{ margin: '0 auto' }} /> Loading available children...
                    </div>
                  ) : children.length === 0 ? (
                    <div className="admin-table-empty" style={{ padding: '2rem' }}>
                      No un-checked-in children found at {center}
                    </div>
                  ) : (
                    children.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleSelectChild(c)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.625rem 0.875rem',
                          borderBottom: '1px solid var(--adm-border-subtle)',
                          cursor: 'pointer'
                        }}
                      >
                        <img
                          src={c.photo || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=250'}
                          alt={c.full_name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--adm-text-1)' }}>{c.full_name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--adm-text-3)' }}>
                            ID: <span style={{ fontFamily: 'monospace' }}>{c.student_id}</span> • {c.group}
                          </div>
                        </div>
                        <span className="admin-badge admin-badge-accent">Select</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* Selected Child Card */
              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '0.875rem 1rem',
                  background: 'var(--adm-surface-2)',
                  border: '1px solid var(--adm-accent)',
                  borderRadius: 'var(--adm-radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <img
                    src={selectedChild.photo || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=250'}
                    alt={selectedChild.full_name}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--adm-text-1)' }}>
                      {selectedChild.full_name}
                    </div>
                    <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--adm-accent)', fontWeight: 600 }}>
                      {center} • {selectedChild.student_id} • {selectedChild.group}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => setSelectedChildId(null)}
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Medical Alert Warning */}
          {selectedChild?.medical_notes && (
            <div className="admin-alert admin-alert-warning">
              <ShieldAlert size={16} />
              <div>
                <strong>Medical & Allergy Warning:</strong>
                <div>{selectedChild.medical_notes}</div>
              </div>
            </div>
          )}

          {/* Step 3: Drop-Off Adult Details */}
          <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--adm-text-1)' }}>
              3. Drop-Off Adult Information
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Adult Name</label>
                <input
                  className="admin-input"
                  type="text"
                  required
                  placeholder="e.g. Sarah Vance"
                  value={adultName}
                  onChange={(e) => setAdultName(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Relationship to Child</label>
                <select
                  className="admin-select"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Guardian">Legal Guardian</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Nanny">Nanny / Babysitter</option>
                  <option value="Driver">Authorized Driver</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Contact Phone Number</label>
                <input
                  className="admin-input"
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={adultPhone}
                  onChange={(e) => setAdultPhone(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Arrival Time</label>
                <input
                  className="admin-input"
                  type="text"
                  readOnly
                  value={arrivalTime}
                  style={{ background: 'var(--adm-surface-3)', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Special Notes (Optional)</label>
              <input
                className="admin-input"
                type="text"
                placeholder="e.g., Left sports bag at front desk, early pickup at 2 PM"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '1rem' }}>
            <button
              type="submit"
              disabled={!selectedChildId || !adultName.trim() || submitting}
              className="admin-btn admin-btn-primary"
              style={{ width: '100%', height: '42px', fontSize: '14px', justifyContent: 'center' }}
            >
              <KeyRound size={16} /> {submitting ? 'Generating PIN...' : `Generate 6-Digit PIN & Confirm Check-In (${center})`}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
