// ============================================================================
// Skill Up Academy Check-in portal — Page 10: System Settings
// Displays center locations: 1. Raji Rasaki Centre  2. CBT Centre
// ============================================================================
import React, { useState, useEffect } from 'react'
import { Settings, Save, ShieldCheck, CheckCircle2, Loader2, Building2, MapPin } from 'lucide-react'
import '../admin.css'
import { getSettings, updateSettings, BackendSetting } from '../services/api'

export function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [businessName, setBusinessName] = useState('Skill Up Academy')
  const [tagline, setTagline] = useState('Child Training Check-In & Safety System')
  const [email, setEmail] = useState('contact@skillup.org')
  const [phone, setPhone] = useState('+1 (555) 019-2831')

  const [codeLength, setCodeLength] = useState(6)
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [requirePhone, setRequirePhone] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getSettings()
      if (data) {
        setBusinessName(data.business_name || 'Skill Up Academy')
        setTagline(data.tagline || 'Child Training Check-In & Safety System')
        setEmail(data.business_email || 'contact@skillup.org')
        setPhone(data.business_phone || '+1 (555) 019-2831')
        setCodeLength(data.code_length || 6)
        setSmsEnabled(data.sms_enabled ?? true)
        setRequirePhone(data.require_phone ?? true)
      }
    } catch (err) {
      console.warn('Backend settings warning', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSettings({
        business_name: businessName,
        tagline: tagline,
        business_email: email,
        business_phone: phone,
        code_length: Number(codeLength),
        sms_enabled: smsEnabled,
        require_phone: requirePhone,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: any) {
      alert(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">System Settings</div>
          <div className="admin-page-desc">
            Global security parameters, center locations, and verification configurations
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Academy Centers Info Card */}
        <div className="admin-card">
          <div className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={16} color="var(--adm-accent)" /> Registered Academy Centers
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
            {/* Center 1 */}
            <div
              style={{
                padding: '1rem',
                background: 'var(--adm-surface-2)',
                border: '1.5px solid var(--adm-accent)',
                borderRadius: 'var(--adm-radius-sm)'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--adm-accent)', textTransform: 'uppercase' }}>
                CENTER 1 (MAIN ACADEMY)
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--adm-text-1)', marginTop: '0.25rem' }}>
                Raji Rasaki Centre
              </div>
              <div style={{ fontSize: '12px', color: 'var(--adm-text-3)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.375rem' }}>
                <MapPin size={12} /> Raji Rasaki Road, Active Training Wing
              </div>
              <span className="admin-badge admin-badge-green" style={{ marginTop: '0.5rem' }}>OPERATIONAL</span>
            </div>

            {/* Center 2 */}
            <div
              style={{
                padding: '1rem',
                background: 'var(--adm-surface-2)',
                border: '1.5px solid var(--adm-accent)',
                borderRadius: 'var(--adm-radius-sm)'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--adm-accent)', textTransform: 'uppercase' }}>
                CENTER 2 (FESTAC COMPLEX)
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--adm-text-1)', marginTop: '0.25rem' }}>
                Festac Centre
              </div>
              <div style={{ fontSize: '12px', color: 'var(--adm-text-3)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.375rem' }}>
                <MapPin size={12} /> CBT Training Complex, Main Gate
              </div>
              <span className="admin-badge admin-badge-green" style={{ marginTop: '0.5rem' }}>OPERATIONAL</span>
            </div>
          </div>
        </div>

        {/* Security Parameters */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="admin-card-title">Security & 6-Digit PIN Parameters</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Verification Code Length</label>
              <input
                className="admin-input"
                type="number"
                value={codeLength}
                readOnly
                style={{ fontFamily: 'monospace', background: 'var(--adm-surface-3)' }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Automatic Code Expiry</label>
              <input className="admin-input" type="text" readOnly value="End of Day (11:59 PM)" style={{ background: 'var(--adm-surface-3)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '13px', color: 'var(--adm-text-1)' }}>
              <input
                type="checkbox"
                checked={smsEnabled}
                onChange={(e) => setSmsEnabled(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--adm-accent)' }}
              />
              <span>Send 6-digit pickup PIN via SMS to parent phone number upon check-in</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '13px', color: 'var(--adm-text-1)' }}>
              <input
                type="checkbox"
                checked={requirePhone}
                onChange={(e) => setRequirePhone(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--adm-accent)' }}
              />
              <span>Require verified phone number for all drop-off adults</span>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="submit"
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', height: '42px', fontSize: '14px', justifyContent: 'center' }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} color="var(--adm-success)" /> : <Save size={16} />}
            {saving ? 'Saving Changes...' : saved ? 'Settings Saved to MySQL!' : 'Save System Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
