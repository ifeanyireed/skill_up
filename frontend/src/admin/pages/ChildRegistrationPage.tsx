// ============================================================================
// Skill Up Academy Check-in portal — Page 8: Child Registration
// Connected to Go + GORM MySQL backend with Center Selection & Upload Photo
// ============================================================================
import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, ShieldCheck, Loader2, Building2 } from 'lucide-react'
import '../admin.css'
import { createChild } from '../services/api'

export function ChildRegistrationPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [submitting, setSubmitting] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState<number>(7)
  const [dob, setDob] = useState('2019-04-15')
  const [gender, setGender] = useState('Boy')
  const [center, setCenter] = useState('Raji Rasaki Centre')
  const [group, setGroup] = useState('Junior Champions (Ages 7-9)')
  const [photo, setPhoto] = useState<string>('')

  const [parentName, setParentName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [relationship, setRelationship] = useState('Mother')

  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [medicalNotes, setMedicalNotes] = useState('')

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !parentName.trim() || !parentPhone.trim()) {
      alert('Please fill out all required fields marked with *')
      return
    }

    setSubmitting(true)
    try {
      await createChild({
        full_name: `${firstName.trim()} ${lastName.trim()}`,
        photo: photo || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=250',
        age: Number(age),
        gender: gender,
        dob: dob,
        center: center,
        group: group,
        parent_name: parentName.trim(),
        parent_phone: parentPhone.trim(),
        parent_email: parentEmail.trim(),
        parent_relationship: relationship,
        emergency_name: emergencyName.trim(),
        emergency_phone: emergencyPhone.trim(),
        medical_notes: medicalNotes.trim(),
      })

      alert(`Success! Child "${firstName} ${lastName}" registered at ${center}.`)
      navigate('/admin/children')
    } catch (err: any) {
      alert(err.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Register New Student</div>
          <div className="admin-page-desc">
            Add a child to the academy directory at Raji Rasaki Centre or CBT Centre
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Step 1: Center & Child Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="admin-card-title">1. Child Student Information</div>

          {/* Upload Photo Dropzone */}
          <div
            style={{
              border: '2px dashed var(--adm-border)',
              borderRadius: 'var(--adm-radius-sm)',
              padding: '1.25rem',
              textAlign: 'center',
              background: 'var(--adm-surface-2)',
              cursor: 'pointer'
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              style={{ display: 'none' }}
            />

            {photo ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <img
                  src={photo}
                  alt="Child preview"
                  style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--adm-accent)' }}
                />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--adm-accent)' }}>✓ Photo Uploaded — Click to Change</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--adm-accent-subtle)',
                    color: 'var(--adm-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Camera size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--adm-text-1)' }}>
                    Upload Photo *
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--adm-text-3)' }}>
                    Tap to upload student photo from device or take a picture
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Center Selector */}
          <div className="admin-form-group">
            <label className="admin-label admin-label-req" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Building2 size={14} color="var(--adm-accent)" /> Training Center Location
            </label>
            <select
              className="admin-select"
              value={center}
              onChange={(e) => setCenter(e.target.value)}
              style={{ fontWeight: 700, borderColor: 'var(--adm-accent)' }}
            >
              <option value="Raji Rasaki Centre">1. Raji Rasaki Centre</option>
              <option value="CBT Centre">2. CBT Centre</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label admin-label-req">First Name</label>
              <input
                className="admin-input"
                type="text"
                required
                placeholder="e.g. Leo"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label admin-label-req">Last Name</label>
              <input
                className="admin-input"
                type="text"
                required
                placeholder="e.g. Vance"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label admin-label-req">Age</label>
              <input
                className="admin-input"
                type="number"
                min={2}
                max={18}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 6)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Gender</label>
              <select className="admin-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="Boy">Boy</option>
                <option value="Girl">Girl</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Date of Birth</label>
              <input className="admin-input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label admin-label-req">Training Group / Class</label>
            <select className="admin-select" value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="Little Dragons (Ages 4-6)">Little Dragons (Ages 4-6)</option>
              <option value="Junior Champions (Ages 7-9)">Junior Champions (Ages 7-9)</option>
              <option value="Elite Athletes (Ages 10-14)">Elite Athletes (Ages 10-14)</option>
            </select>
          </div>
        </div>

        {/* Step 2: Primary Parent Details */}
        <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="admin-card-title">2. Primary Parent / Guardian Details</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label admin-label-req">Parent Full Name</label>
              <input
                className="admin-input"
                type="text"
                required
                placeholder="e.g. Sarah Vance"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label admin-label-req">Relationship</label>
              <select className="admin-select" value={relationship} onChange={(e) => setRelationship(e.target.value)}>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Guardian">Legal Guardian</option>
                <option value="Grandparent">Grandparent</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label admin-label-req">Phone Number</label>
              <input
                className="admin-input"
                type="tel"
                required
                placeholder="+1 (555) 234-8901"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Email Address</label>
              <input
                className="admin-input"
                type="email"
                placeholder="parent@example.com"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Step 3: Emergency & Medical Info */}
        <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="admin-card-title">3. Safety & Emergency Information</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Secondary Emergency Contact Name</label>
              <input
                className="admin-input"
                type="text"
                placeholder="e.g. Mark Vance (Uncle)"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Emergency Phone</label>
              <input
                className="admin-input"
                type="tel"
                placeholder="+1 (555) 234-8902"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Medical & Allergy Notes</label>
            <input
              className="admin-input"
              type="text"
              placeholder="e.g. Mild asthma (inhaler in backpack), EpiPen for tree nuts..."
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Action Button */}
        <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '1rem' }}>
          <button
            type="submit"
            disabled={submitting}
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', height: '42px', fontSize: '14px', justifyContent: 'center' }}
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            {submitting ? 'Registering Student...' : `Register Student at ${center}`}
          </button>
        </div>
      </form>
    </div>
  )
}
