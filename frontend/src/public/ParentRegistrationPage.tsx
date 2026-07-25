// ============================================================================
// Skill Up Academy — Public Parent Child Registration Page
// Enables parents to register children, select from 20 Character Avatars or optional custom photo upload
// Features Center Selection: 1. Raji Rasaki Centre  2. CBT Centre
// ============================================================================
import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Camera,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Printer,
  ShieldCheck,
  Building2,
  UserCheck,
  Upload
} from 'lucide-react'
import { createChild } from '../admin/services/api'

const AVATAR_CHARACTERS = Array.from({ length: 20 }, (_, i) => `/avatars/character${i + 1}.jpg`)

export function ParentRegistrationPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Child Info
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState<number>(7)
  const [dob, setDob] = useState('2019-04-15')
  const [gender, setGender] = useState('Boy')
  const [center, setCenter] = useState('Raji Rasaki Centre')
  const [group, setGroup] = useState('Junior Champions (Ages 7-9)')
  
  // Photo & Avatar selection (Optional)
  const [photoMode, setPhotoMode] = useState<'avatar' | 'upload'>('avatar')
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_CHARACTERS[0])
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('')

  // Parent Info
  const [parentName, setParentName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [parentRel, setParentRel] = useState('Mother')

  // Emergency & Medical
  const [emergName, setEmergName] = useState('')
  const [emergPhone, setEmergPhone] = useState('')
  const [medicalNotes, setMedicalNotes] = useState('')

  // Submission State
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [registeredStudentId, setRegisteredStudentId] = useState('')

  const activePhoto = photoMode === 'upload' && customPhotoUrl ? customPhotoUrl : selectedAvatar

  // Handle Photo File Upload / Camera Capture
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
      const res = await createChild({
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
        parent_relationship: parentRel,
        emergency_name: emergName.trim(),
        emergency_phone: emergPhone.trim(),
        medical_notes: medicalNotes.trim(),
      })

      setRegisteredStudentId(res.student_id || 'KNT-8050')
      setSubmitted(true)
    } catch (err: any) {
      alert(err.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#0B0E4E',
        color: '#FFFFFF',
        fontFamily: "'Inter', sans-serif",
        padding: '1.5rem 1rem 3rem',
        overflowX: 'hidden'
      }}
    >
      {/* ── Background Image & Navy Gradient Overlay ── */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img
          src="/cbt-centre.jpeg"
          alt="CBT Centre Background"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          loading="eager"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(105deg, rgba(11, 14, 78, 0.94) 0%, rgba(13, 16, 96, 0.88) 50%, rgba(11, 14, 78, 0.75) 100%)',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            background: '#C40000',
            zIndex: 10,
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
        {/* Header Branding */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="/logo.avif"
              alt="Skill Up Academy"
              style={{ height: '40px', width: 'auto', filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}
            />
          </div>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff',
              padding: '0.4rem 0.875rem',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              backdropFilter: 'blur(8px)'
            }}
          >
            <ArrowLeft size={13} /> Staff Portal
          </button>
        </div>

        {submitted ? (
          /* SUCCESS CONFIRMATION PASS */
          <div
            style={{
              background: '#FFFFFF',
              color: '#0F172A',
              borderRadius: '12px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              animation: 'adminSlideUp 0.3s ease'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(22, 163, 74, 0.1)',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <span
              style={{
                background: 'rgba(22, 163, 74, 0.12)',
                color: '#16A34A',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              STUDENT REGISTRATION COMPLETE
            </span>

            <h2 style={{ fontSize: '22px', fontWeight: 800, marginTop: '0.75rem', color: '#0F172A' }}>
              Welcome, {firstName}!
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '0.25rem' }}>
              Registered at <strong>{center}</strong>
            </p>

            {/* Parent Digital Pass */}
            <div
              style={{
                margin: '1.5rem 0',
                padding: '1.25rem',
                background: '#F8FAFC',
                border: '2px dashed #C40000',
                borderRadius: '10px',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#C40000', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                DIGITAL STUDENT ID PASS — {center.toUpperCase()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                <img
                  src={activePhoto}
                  alt={firstName}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #C40000' }}
                />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{firstName} {lastName}</div>
                  <div style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, color: '#C40000' }}>
                    Student ID: {registeredStudentId}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{center} • {group}</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              💡 <strong>Morning Drop-Off Instructions:</strong> State your child's name or Student ID (<strong>{registeredStudentId}</strong>) at the reception desk at <strong>{center}</strong> to receive your daily 6-digit pickup PIN.
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => window.print()}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem'
                }}
              >
                <Printer size={15} /> Print Pass
              </button>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setCustomPhotoUrl('')
                  setFirstName('')
                  setLastName('')
                }}
                style={{
                  background: '#C40000',
                  color: '#fff',
                  border: 'none',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Register Another Child
              </button>
            </div>
          </div>
        ) : (
          /* PARENT REGISTRATION FORM CARD */
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#FFFFFF',
              color: '#0F172A',
              borderRadius: '12px',
              padding: '1.75rem 1.5rem',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Child Registration Portal
              </h1>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '0.25rem' }}>
                Select your training center, pick a character avatar or upload a custom photo.
              </p>
            </div>

            {/* AVATAR SELECTOR / OPTIONAL PHOTO UPLOAD */}
            <div
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1rem',
                background: '#F8FAFC'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Student Photo / Avatar (Optional)
                </label>
                <div style={{ display: 'flex', gap: '4px', background: '#E2E8F0', padding: '3px', borderRadius: '6px' }}>
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
                      background: photoMode === 'avatar' ? '#C40000' : 'transparent',
                      color: photoMode === 'avatar' ? '#FFFFFF' : '#475569'
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
                      background: photoMode === 'upload' ? '#C40000' : 'transparent',
                      color: photoMode === 'upload' ? '#FFFFFF' : '#475569'
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
                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '0.75rem' }}>
                    Select an official SkillUp character avatar for your child:
                  </div>

                  {/* 20 Character Avatars Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))',
                      gap: '0.5rem',
                      maxHeight: '180px',
                      overflowY: 'auto',
                      padding: '4px',
                      background: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1'
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
                            border: isSelected ? '3px solid #C40000' : '2px solid transparent',
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
                    border: '2px dashed #CBD5E1',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                    background: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {customPhotoUrl ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <img
                        src={customPhotoUrl}
                        alt="Child preview"
                        style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #C40000' }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#C40000' }}>✓ Custom Photo Uploaded — Tap to Change</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: 'rgba(196, 0, 0, 0.08)',
                          color: '#C40000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Camera size={20} />
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                        Tap to Upload Custom Photo
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        Supports JPG, PNG from device camera or photo library
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Active Selected Preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.875rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
                <img
                  src={activePhoto}
                  alt="Selected avatar preview"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #C40000' }}
                />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                    Active Student Pass Image
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    {photoMode === 'avatar' ? `Selected Preset Avatar (#${AVATAR_CHARACTERS.indexOf(selectedAvatar) + 1})` : 'Custom Uploaded Photo'}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 1: Child Basic Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#C40000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1. Child Information & Center Location
              </div>

              {/* CENTER LOCATION SELECTOR */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '4px' }}>
                  <Building2 size={14} color="#C40000" /> Select Training Center *
                </label>
                <select
                  value={center}
                  onChange={(e) => setCenter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    borderRadius: '6px',
                    border: '2px solid #C40000',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    outline: 'none',
                    background: '#FEF2F2',
                    color: '#0F172A'
                  }}
                >
                  <option value="Raji Rasaki Centre">1. Raji Rasaki Centre</option>
                  <option value="CBT Centre">2. CBT Centre</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Leo"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vance"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Age *
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={18}
                    required
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 6)}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none',
                      background: '#fff'
                    }}
                  >
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Training Class / Group *
                </label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                    background: '#fff'
                  }}
                >
                  <option value="Little Dragons (Ages 4-6)">Little Dragons (Ages 4-6)</option>
                  <option value="Junior Champions (Ages 7-9)">Junior Champions (Ages 7-9)</option>
                  <option value="Elite Athletes (Ages 10-14)">Elite Athletes (Ages 10-14)</option>
                </select>
              </div>
            </div>

            {/* Section 2: Parent Information */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#C40000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                2. Parent / Guardian Details
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Parent Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Vance"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Relationship *
                  </label>
                  <select
                    value={parentRel}
                    onChange={(e) => setParentRel(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none',
                      background: '#fff'
                    }}
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Guardian">Legal Guardian</option>
                    <option value="Grandparent">Grandparent</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 234-8901"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="parent@example.com"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Medical Notes */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                3. Medical & Emergency Info
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mark Vance"
                    value={emergName}
                    onChange={(e) => setEmergName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 234-8902"
                    value={emergPhone}
                    onChange={(e) => setEmergPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Medical & Allergy Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Mild asthma (inhaler in backpack), EpiPen for tree nuts..."
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                height: '46px',
                background: '#C40000',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem'
              }}
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              {submitting ? 'Registering Child...' : 'Submit Student Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
