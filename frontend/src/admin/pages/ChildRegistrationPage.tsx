// ============================================================================
// Skill Up Academy Check-in portal — Page 8: Child Registration
// Connected to Go + GORM MySQL backend with Center Selection & 20 Character Avatars
// ============================================================================
import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, ShieldCheck, Loader2, Building2, UserCheck, Upload } from 'lucide-react'
import '../admin.css'
import { createChild } from '../services/api'

const AVATAR_CHARACTERS = Array.from({ length: 20 }, (_, i) => `/avatars/character${i + 1}.jpg`)

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
  const [group, setGroup] = useState('Junior Champions (Ages 11-19)')
  
  // Photo & Avatar selection (Optional)
  const [photoMode, setPhotoMode] = useState<'avatar' | 'upload'>('avatar')
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_CHARACTERS[0])
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('')

  const [parentName, setParentName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [relationship, setRelationship] = useState('Mother')

  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [medicalNotes, setMedicalNotes] = useState('')

  const activePhoto = photoMode === 'upload' && customPhotoUrl ? customPhotoUrl : selectedAvatar

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setCustomPhotoUrl(reader.result as string)
        setPhotoMode('upload')
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
        photo: activePhoto,
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

      alert(`Success! Student "${firstName} ${lastName}" registered at ${center}.`)
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

          {/* AVATAR SELECTOR / OPTIONAL PHOTO UPLOAD */}
          <div
            style={{
              border: '1px solid var(--adm-border)',
              borderRadius: 'var(--adm-radius-sm)',
              padding: '1rem',
              background: 'var(--adm-surface-2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--adm-text-1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Student Photo / Avatar (Optional)
              </label>
              <div style={{ display: 'flex', gap: '4px', background: 'var(--adm-surface)', padding: '3px', borderRadius: '6px' }}>
                <button
                  type="button"
                  onClick={() => setPhotoMode('avatar')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    background: photoMode === 'avatar' ? 'var(--adm-accent)' : 'transparent',
                    color: photoMode === 'avatar' ? '#FFFFFF' : 'var(--adm-text-2)'
                  }}
                >
                  <UserCheck size={12} style={{ display: 'inline', marginRight: '4px' }} /> Pick Avatar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoMode('upload')
                    fileInputRef.current?.click()
                  }}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    background: photoMode === 'upload' ? 'var(--adm-accent)' : 'transparent',
                    color: photoMode === 'upload' ? '#FFFFFF' : 'var(--adm-text-2)'
                  }}
                >
                  <Upload size={12} style={{ display: 'inline', marginRight: '4px' }} /> Upload Photo
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              style={{ display: 'none' }}
            />

            {photoMode === 'avatar' ? (
              <div>
                <div style={{ fontSize: '11px', color: 'var(--adm-text-3)', marginBottom: '0.75rem' }}>
                  Select an official character avatar for student profile:
                </div>

                {/* 20 Character Avatars Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))',
                    gap: '0.5rem',
                    maxHeight: '180px',
                    overflowY: 'auto',
                    padding: '6px',
                    background: 'var(--adm-surface)',
                    borderRadius: '8px',
                    border: '1px solid var(--adm-border)'
                  }}
                >
                  {AVATAR_CHARACTERS.map((avatarPath, index) => {
                    const isSelected = selectedAvatar === avatarPath
                    return (
                      <button
                        key={avatarPath}
                        type="button"
                        onClick={() => {
                          setSelectedAvatar(avatarPath)
                          setPhotoMode('avatar')
                        }}
                        style={{
                          padding: 0,
                          border: isSelected ? '3px solid var(--adm-accent)' : '2px solid transparent',
                          borderRadius: '50%',
                          background: 'none',
                          cursor: 'pointer',
                          transition: 'transform 0.15s ease',
                          transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                          outline: 'none'
                        }}
                        title={`Character Avatar ${index + 1}`}
                      >
                        <img
                          src={avatarPath}
                          alt={`Avatar ${index + 1}`}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              /* Custom Photo Upload Box */
              <div
                style={{
                  border: '2px dashed var(--adm-border)',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center',
                  background: 'var(--adm-surface)',
                  cursor: 'pointer'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {customPhotoUrl ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <img
                      src={customPhotoUrl}
                      alt="Child preview"
                      style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--adm-accent)' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--adm-accent)' }}>✓ Custom Photo Uploaded — Click to Change</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'var(--adm-accent-subtle)',
                        color: 'var(--adm-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Camera size={20} />
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--adm-text-1)' }}>
                      Tap to Upload Custom Photo
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--adm-text-3)' }}>
                      Supports JPG, PNG from device camera or photo library
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Active Selected Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.875rem', paddingTop: '0.75rem', borderTop: '1px solid var(--adm-border)' }}>
              <img
                src={activePhoto}
                alt="Selected avatar preview"
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--adm-accent)' }}
              />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--adm-text-1)' }}>
                  Active Student Profile Picture
                </div>
                <div style={{ fontSize: '11px', color: 'var(--adm-text-3)' }}>
                  {photoMode === 'avatar' ? `Selected Preset Avatar (#${AVATAR_CHARACTERS.indexOf(selectedAvatar) + 1})` : 'Custom Uploaded Photo'}
                </div>
              </div>
            </div>
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
              <option value="Festac Centre">2. Festac Centre</option>
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
              <option value="Little Dragons (Ages 4-10)">Little Dragons (Ages 4-10)</option>
              <option value="Junior Champions (Ages 11-19)">Junior Champions (Ages 11-19)</option>
              <option value="Elite Athletes (Ages 20+)">Elite Athletes (Ages 20+)</option>
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
