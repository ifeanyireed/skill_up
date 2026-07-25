// ============================================================================
// Skill Up Academy Check-in portal — Page 5: Pickup / Check-Out Screen
// Dynamic calls connected to Go + GORM MySQL backend
// ============================================================================
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Loader2
} from 'lucide-react'
import '../admin.css'
import { getChildren, checkOutChild, BackendChild } from '../services/api'

export function CheckOutPage() {
  const navigate = useNavigate()
  const [children, setChildren] = useState<BackendChild[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [inputPin, setInputPin] = useState('')
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null)

  // Collector Form Fields
  const [collectorName, setCollectorName] = useState('')
  const [collectorPhone, setCollectorPhone] = useState('')
  const [relationship, setRelationship] = useState('Father')
  const [pickupTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

  // Verification Result
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'success' | 'failed'
    message: string
  }>({ status: 'idle', message: '' })

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getChildren('all', searchQuery)
      setChildren(data.filter((c) => c.status === 'Checked In' || c.status === 'Waiting Pickup'))
    } catch (err) {
      console.warn('Backend error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [searchQuery])

  const selectedChild = children.find((c) => c.id === selectedChildId)

  const handleSelectChild = (child: BackendChild) => {
    setSelectedChildId(child.id)
    setCollectorName(child.parent_name)
    setCollectorPhone(child.parent_phone)
    setRelationship(child.parent_relationship || 'Father')
    if (child.active_code) setInputPin(child.active_code)
    setVerificationResult({ status: 'idle', message: '' })
  }

  const handleVerifyAndCheckOut = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputPin.trim()) {
      setVerificationResult({
        status: 'failed',
        message: 'Please enter the 6-digit pickup PIN.'
      })
      return
    }

    if (!collectorName.trim() || !collectorPhone.trim()) {
      setVerificationResult({
        status: 'failed',
        message: 'Please enter the name and contact phone of the person collecting the child.'
      })
      return
    }

    setSubmitting(true)
    try {
      const res = await checkOutChild(
        inputPin.trim(),
        collectorName,
        collectorPhone,
        relationship,
        selectedChild ? selectedChild.student_id : ''
      )

      setVerificationResult({
        status: 'success',
        message: res.message || `PIN Verified! Child safely released.`
      })
    } catch (err: any) {
      setVerificationResult({
        status: 'failed',
        message: err.message || `VERIFICATION FAILED: Invalid 6-digit PIN '#${inputPin}'. Release blocked!`
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Safe Child Daily Pick-up</div>
          <div className="admin-page-desc">
            Verify daily 6-digit PIN provided by collector and record authorized child release in MySQL
          </div>
        </div>

        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/children')}>
            <Search size={14} /> View Directory
          </button>
        </div>
      </div>

      {verificationResult.status === 'success' ? (
        /* SUCCESS RELEASE CONFIRMATION */
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
            PICKUP AUTHORIZED & RELEASED IN MYSQL
          </span>

          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--adm-text-1)', marginTop: '0.75rem' }}>
            Child Safely Released!
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--adm-text-2)', marginTop: '0.25rem' }}>
            {verificationResult.message}
          </p>

          <div
            style={{
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              padding: '1rem 1.25rem',
              background: 'var(--adm-surface-2)',
              border: '1px solid var(--adm-border)',
              borderRadius: 'var(--adm-radius-sm)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              maxWidth: '400px',
              margin: '1.5rem auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--adm-text-2)' }}>Student:</span>
              <strong style={{ color: 'var(--adm-text-1)' }}>{selectedChild ? selectedChild.full_name : 'Verified Student'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--adm-text-2)' }}>Collected By:</span>
              <strong style={{ color: 'var(--adm-text-1)' }}>{collectorName} ({relationship})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--adm-text-2)' }}>Verified PIN:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--adm-accent)' }}>#{inputPin}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--adm-text-2)' }}>Release Time:</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--adm-success)', fontWeight: 600 }}>{pickupTime}</span>
            </div>
          </div>

          <button
            className="admin-btn admin-btn-primary"
            onClick={() => {
              setVerificationResult({ status: 'idle', message: '' })
              setSelectedChildId(null)
              setInputPin('')
              loadData()
            }}
          >
            Done & Verify Next Pickup <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        /* PICKUP VERIFICATION FORM */
        <form onSubmit={handleVerifyAndCheckOut} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Step 1: Select Child */}
          <div>
            <label className="admin-label admin-label-req" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--adm-text-1)' }}>
              1. Select Child to Pickup
            </label>

            {!selectedChild ? (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="admin-toolbar-search" style={{ width: '100%', height: '38px' }}>
                  <Search size={14} color="var(--adm-text-3)" />
                  <input
                    placeholder="Search by child name, Student ID, or PIN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                      <Loader2 size={16} className="animate-spin" style={{ margin: '0 auto' }} /> Loading checked-in children...
                    </div>
                  ) : children.length === 0 ? (
                    <div className="admin-table-empty" style={{ padding: '2rem' }}>
                      No checked-in children found
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
                            ID: <span style={{ fontFamily: 'monospace' }}>{c.student_id}</span> • Checked in at {c.check_in_time || 'Morning'}
                          </div>
                        </div>
                        <span className="admin-badge admin-badge-yellow font-mono">PIN Required</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* Selected Child Info Badge */
              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '0.875rem 1rem',
                  background: 'var(--adm-surface-2)',
                  border: '1px solid var(--adm-border)',
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
                      {selectedChild.student_id} • {selectedChild.group}
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

          {/* Step 2: Input 6-Digit Pickup PIN */}
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'var(--adm-accent-subtle)',
              border: '1px solid var(--adm-accent)',
              borderRadius: 'var(--adm-radius-sm)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--adm-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ENTER 6-DIGIT PICKUP PIN *
            </div>

            <div style={{ maxWidth: '240px', margin: '0 auto', width: '100%' }}>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="e.g. 482910"
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em',
                  padding: '0.5rem',
                  borderRadius: 'var(--adm-radius-sm)',
                  border: '2px solid var(--adm-accent)',
                  background: 'var(--adm-surface)',
                  color: 'var(--adm-accent)',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--adm-text-2)' }}>
              Collector must state or provide the 6-digit PIN generated during morning check-in.
            </div>
          </div>

          {/* Failed Verification Alert */}
          {verificationResult.status === 'failed' && (
            <div className="admin-alert admin-alert-danger">
              <AlertOctagon size={18} />
              <div>
                <strong style={{ fontSize: 13, textTransform: 'uppercase' }}>Verification Failed — Release Blocked</strong>
                <div style={{ fontSize: 12 }}>{verificationResult.message}</div>
              </div>
            </div>
          )}

          {/* Step 3: Person Collecting Child */}
          <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--adm-text-1)' }}>
              2. Person Collecting Child Details
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Collector Name</label>
                <input
                  className="admin-input"
                  type="text"
                  required
                  placeholder="e.g. Rajesh Patel"
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Relationship to Child</label>
                <select
                  className="admin-select"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
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
                  value={collectorPhone}
                  onChange={(e) => setCollectorPhone(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Pickup Time</label>
                <input
                  className="admin-input"
                  type="text"
                  readOnly
                  value={pickupTime}
                  style={{ background: 'var(--adm-surface-3)', fontFamily: 'monospace' }}
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '1rem' }}>
            <button
              type="submit"
              disabled={inputPin.length < 6 || !collectorName.trim() || submitting}
              className="admin-btn admin-btn-primary"
              style={{ width: '100%', height: '42px', fontSize: '14px', justifyContent: 'center' }}
            >
              <ShieldCheck size={16} /> {submitting ? 'Verifying PIN...' : 'Verify PIN & Complete Child Release'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
