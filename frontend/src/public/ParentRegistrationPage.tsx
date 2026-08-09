// ============================================================================
// Skill Up Academy — Summer Tech Camp 2026 Registration Portal
// Aligned with Google Form: SKILLUP ACADEMY SUMMER TECH CAMP 2026
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
  Upload,
  Sparkles,
  HelpCircle,
  FileCheck,
  Globe,
  ExternalLink
} from 'lucide-react'
import { createChild } from '../admin/services/api'

const AVATAR_CHARACTERS = Array.from({ length: 20 }, (_, i) => `/avatars/character${i + 1}.jpg`)

export function ParentRegistrationPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Student Information
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState<number>(7)
  const [dob, setDob] = useState('2019-04-15')
  const [gender, setGender] = useState('Male')
  const [schoolName, setSchoolName] = useState('')
  const [currentGrade, setCurrentGrade] = useState('')
  const [center, setCenter] = useState('Raji Rasaki Centre')
  
  // 2. Camp & Track Selection
  const [group, setGroup] = useState('Junior Camp (5–10 years)')
  const [seniorTrack, setSeniorTrack] = useState('Graphics Design (Corel Draw) + Robotics')

  // 3. Parent / Guardian Details
  const [parentName, setParentName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [altPhone, setAltPhone] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [parentRel, setParentRel] = useState('Mother')
  const [homeAddress, setHomeAddress] = useState('')

  // 4. Device Information
  const [ownsDevice, setOwnsDevice] = useState('Yes')
  const [deviceType, setDeviceType] = useState('Laptop')

  // 5. Payment & Health Info
  const [amountPaid, setAmountPaid] = useState<string>('50000')
  const [paymentStatus, setPaymentStatus] = useState('Full Payment')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [hasMedicalCondition, setHasMedicalCondition] = useState('No')
  const [emergName, setEmergName] = useState('')
  const [emergPhone, setEmergPhone] = useState('')
  const [medicalNotes, setMedicalNotes] = useState('')
  const [referralSource, setReferralSource] = useState('WhatsApp')
  const [additionalNotes, setAdditionalNotes] = useState('')

  // Photo & Avatar selection
  const [photoMode, setPhotoMode] = useState<'avatar' | 'upload'>('avatar')
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_CHARACTERS[0])
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('')

  // 6. Mandatory Consents
  const [consents, setConsents] = useState({
    c1: false,
    c2: false,
    c3: false,
    c4: false,
    c5: false,
  })

  // Auto-calculate Age and Training Group from Date of Birth
  const handleDobChange = (newDob: string) => {
    setDob(newDob)
    if (!newDob) return
    const birthDate = new Date(newDob)
    if (isNaN(birthDate.getTime())) return

    const today = new Date()
    let computedAge = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      computedAge--
    }

    if (computedAge >= 0 && computedAge <= 100) {
      setAge(computedAge)
      if (computedAge >= 11) {
        setGroup('Senior Camp (11+ years)')
        if (seniorTrack === 'N/A - Junior Camp') {
          setSeniorTrack('Graphics Design (Corel Draw) + Robotics')
        }
      } else {
        setGroup('Junior Camp (5–10 years)')
        setSeniorTrack('N/A - Junior Camp')
      }
    }
  }

  const handleAgeChange = (newAge: number) => {
    setAge(newAge)
    if (newAge >= 11) {
      setGroup('Senior Camp (11+ years)')
      if (seniorTrack === 'N/A - Junior Camp') {
        setSeniorTrack('Graphics Design (Corel Draw) + Robotics')
      }
    } else {
      setGroup('Junior Camp (5–10 years)')
      setSeniorTrack('N/A - Junior Camp')
    }
  }

  // Submission State
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [registeredStudentId, setRegisteredStudentId] = useState('')

  const activePhoto = photoMode === 'upload' && customPhotoUrl ? customPhotoUrl : selectedAvatar

  // Handle Photo File Upload
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

  const allConsentsChecked = Object.values(consents).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !parentName.trim() || !parentPhone.trim()) {
      alert('Please fill out all required fields marked with *')
      return
    }

    if (!allConsentsChecked) {
      alert('Please tick all mandatory consent checkboxes before submitting.')
      return
    }

    setSubmitting(true)
    try {
      const res = await createChild({
        full_name: lastName.trim() ? `${firstName.trim()} ${lastName.trim()}` : firstName.trim(),
        photo: activePhoto,
        age: Number(age),
        gender: gender,
        dob: dob,
        school_name: schoolName.trim(),
        current_grade: currentGrade.trim(),
        center: center,
        group: group,
        senior_track: group.includes('Senior') ? seniorTrack : 'N/A - Junior Camp',
        parent_name: parentName.trim(),
        parent_phone: parentPhone.trim(),
        alt_phone: altPhone.trim(),
        parent_email: parentEmail.trim(),
        parent_relationship: parentRel,
        home_address: homeAddress.trim(),
        owns_device: ownsDevice,
        device_type: ownsDevice === 'Yes' ? deviceType : 'N/A',
        amount_paid: parseFloat(amountPaid) || 0,
        payment_status: paymentStatus,
        payment_date: paymentDate,
        emergency_name: emergName.trim(),
        emergency_phone: emergPhone.trim(),
        medical_notes: hasMedicalCondition === 'Yes' ? medicalNotes.trim() : 'None',
        referral_source: referralSource,
        additional_notes: additionalNotes.trim(),
        consent_given: true,
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
    <div className="parent-reg-page" style={{ background: '#F8FAFC', minHeight: '100vh', padding: '1.5rem 1rem' }}>
      {/* Top Bar */}
      <div style={{ maxWidth: '680px', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: 'none', color: '#64748B', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} /> Back to Portal Home
        </button>
        <span style={{ fontSize: '12px', fontWeight: 800, background: '#FEF2F2', color: '#C40000', padding: '0.35rem 0.75rem', borderRadius: '16px', border: '1px solid #FCA5A5' }}>
          Summer Tech Camp 2026
        </span>
      </div>

      {/* Main Registration Card */}
      <div style={{ maxWidth: '680px', margin: '0 auto', background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', padding: '1.75rem' }}>
        
        {/* Banner Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #FEF2F2', paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#C40000', margin: '0 0 0.35rem 0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            FUTURE PROGRAMS FOR KIDS REGISTRATION PORTAL
          </h1>
          <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: '1.5', maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
            Official registration portal for Future Programs For Kids students (ages 5–17+). Register student details and receive your official 8-digit student code.
          </p>
        </div>

        {submitted ? (
          /* SUCCESS SCREEN */
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ width: '64px', height: '64px', background: '#DCFCE7', color: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <CheckCircle2 size={38} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              Registration Successfully Submitted!
            </h2>
            <p style={{ fontSize: '14px', color: '#475569', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
              Your child has been enrolled in the SkillUp Academy Summer Tech Camp 2026.
            </p>

            {/* Generated Student Card */}
            <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFF', borderRadius: '14px', padding: '1.5rem', margin: '0 auto 1.5rem auto', maxWidth: '400px', textAlign: 'left', boxShadow: '0 12px 28px rgba(15,23,42,0.18)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <img src={activePhoto} alt="Student avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #C40000' }} />
                <div>
                  <div style={{ fontSize: '17px', fontWeight: 800 }}>{firstName} {lastName}</div>
                  <div style={{ fontSize: '12.5px', color: '#94A3B8' }}>{group} · {center}</div>
                  {group.includes('Senior') && (
                    <div style={{ fontSize: '11.5px', color: '#38BDF8', marginTop: '3px', fontWeight: 600 }}>Track: {seniorTrack}</div>
                  )}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                  <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.05em' }}>Official Student ID</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '0.05em', color: '#FACC15' }}>{registeredStudentId}</div>
                </div>
                <UserCheck size={32} color="#FACC15" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '13.5px', fontWeight: 700, color: '#334155', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
              >
                <Printer size={16} /> Print Registration Slip
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setFirstName('')
                  setLastName('')
                }}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', background: '#C40000', fontSize: '13.5px', fontWeight: 700, color: '#FFF', cursor: 'pointer' }}
              >
                Register Another Child
              </button>
              <a
                href="https://skilluplearningacademy.com"
                style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1.5px solid #C40000', background: '#FEF2F2', fontSize: '13.5px', fontWeight: 700, color: '#C40000', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
              >
                <Globe size={16} /> Return to Main Website <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            
            {/* AVATAR / PHOTO SELECTOR */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Camera size={16} color="#C40000" /> Student Profile Photo / Avatar (Optional)
                </label>

                {/* Photo mode toggle */}
                <div style={{ display: 'flex', gap: '0.25rem', background: '#E2E8F0', padding: '2px', borderRadius: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setPhotoMode('avatar')}
                    style={{ border: 'none', background: photoMode === 'avatar' ? '#FFF' : 'transparent', color: photoMode === 'avatar' ? '#C40000' : '#64748B', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Preset Character
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoMode('upload')
                      fileInputRef.current?.click()
                    }}
                    style={{ border: 'none', background: photoMode === 'upload' ? '#FFF' : 'transparent', color: photoMode === 'upload' ? '#C40000' : '#64748B', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Upload Photo
                  </button>
                </div>
              </div>

              {photoMode === 'avatar' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '6px', maxHeight: '110px', overflowY: 'auto', paddingRight: '4px' }}>
                  {AVATAR_CHARACTERS.map((avatar, idx) => (
                    <img
                      key={idx}
                      src={avatar}
                      alt={`Character ${idx + 1}`}
                      onClick={() => setSelectedAvatar(avatar)}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: selectedAvatar === avatar ? '3px solid #C40000' : '1.5px solid #CBD5E1',
                        opacity: selectedAvatar === avatar ? 1 : 0.75,
                        transform: selectedAvatar === avatar ? 'scale(1.08)' : 'scale(1)',
                        transition: 'all 0.15s ease'
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '0.75rem', border: '1.5px dashed #CBD5E1', borderRadius: '6px', background: '#FFF' }}>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} style={{ display: 'none' }} />
                  {customPhotoUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                      <img src={customPhotoUrl} alt="Uploaded preview" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #C40000' }} />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Change Photo
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ border: 'none', background: 'transparent', color: '#64748B', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                    >
                      <Upload size={16} /> Click to select or capture student photo
                    </button>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                <img src={activePhoto} alt="Selected avatar preview" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #C40000' }} />
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A' }}>Active Student Image</div>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                    {photoMode === 'avatar' ? `Selected Preset Avatar (#${AVATAR_CHARACTERS.indexOf(selectedAvatar) + 1})` : 'Custom Uploaded Photo'}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 1: STUDENT INFORMATION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#C40000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1. Student Information
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '4px' }}>
                  <Building2 size={14} color="#C40000" /> Preferred Centre *
                </label>
                <select
                  value={center}
                  onChange={(e) => setCenter(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '2px solid #C40000', fontSize: '13.5px', fontWeight: 700, outline: 'none', background: '#FEF2F2', color: '#0F172A' }}
                >
                  <option value="Raji Rasaki Centre">Raji Rasaki Centre</option>
                  <option value="Festac Centre">Festac Centre</option>
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
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vance"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => handleDobChange(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={18}
                    required
                    value={age}
                    onChange={(e) => handleAgeChange(parseInt(e.target.value) || 5)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', background: '#fff' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    School Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Corona School"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Current Class / Grade
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Primary 4 / Basic 5"
                    value={currentGrade}
                    onChange={(e) => setCurrentGrade(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: PARENT / GUARDIAN INFORMATION */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#C40000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                2. Parent / Guardian Information
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Parent Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Parent / Guardian Name"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Relationship *
                  </label>
                  <select
                    value={parentRel}
                    onChange={(e) => setParentRel(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', background: '#fff' }}
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
                    placeholder="e.g. 08012345678"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Alternative Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 08098765432"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="parent@example.com"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Home Address
                  </label>
                  <input
                    type="text"
                    placeholder="Street Name & Estate / Area"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: CAMP SELECTION & SENIOR TRACK */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#C40000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                3. Camp Selection & Senior Track
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Select Age Category *
                </label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', background: '#fff' }}
                >
                  <option value="Junior Camp (5–10 years)">Junior Camp (5–10 years)</option>
                  <option value="Senior Camp (11+ years)">Senior Camp (11+ years)</option>
                </select>
              </div>

              {group.includes('Senior') && (
                <div style={{ background: '#F0F9FF', border: '1.5px solid #0284C7', borderRadius: '8px', padding: '0.875rem' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0369A1', display: 'block', marginBottom: '4px' }}>
                    SENIOR TRACK SELECTION (11+ ONLY) *
                  </label>
                  <select
                    value={seniorTrack}
                    onChange={(e) => setSeniorTrack(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #7DD3FC', fontSize: '13.5px', fontWeight: 700, outline: 'none', background: '#fff', color: '#0369A1' }}
                  >
                    <option value="Graphics Design (Corel Draw) + Robotics">Graphics Design (Corel Draw) + Robotics</option>
                    <option value="Cybersecurity + Python Programming">Cybersecurity + Python Programming</option>
                  </select>
                </div>
              )}
            </div>

            {/* SECTION 4: DEVICE INFORMATION */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#C40000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                4. Device Information
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Does the student own a device? *
                  </label>
                  <select
                    value={ownsDevice}
                    onChange={(e) => setOwnsDevice(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', background: '#fff' }}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {ownsDevice === 'Yes' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Select Device Type
                    </label>
                    <select
                      value={deviceType}
                      onChange={(e) => setDeviceType(e.target.value)}
                      style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', background: '#fff' }}
                    >
                      <option value="Laptop">Laptop</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Both (Laptop & Tablet)">Both (Laptop & Tablet)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 5: PAYMENT, HEALTH & MARKETING */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                5. Payment, Health & Marketing
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', background: '#fff' }}
                  >
                    <option value="Full Payment">Full Payment</option>
                    <option value="Part Payment (Installment)">Part Payment (Installment)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Amount Paid (₦)
                  </label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Does child have medical condition?
                  </label>
                  <select
                    value={hasMedicalCondition}
                    onChange={(e) => setHasMedicalCondition(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', background: '#fff' }}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    How did you hear about us?
                  </label>
                  <select
                    value={referralSource}
                    onChange={(e) => setReferralSource(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', background: '#fff' }}
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Referral">Referral</option>
                    <option value="School">School</option>
                    <option value="Church">Church</option>
                    <option value="Walk-In">Walk-In</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {hasMedicalCondition === 'Yes' && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Medical Condition & Allergy Details
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Specify allergies, asthma, inhaler needs..."
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', resize: 'vertical' }}
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Any extra information you would like us to know:
                </label>
                <textarea
                  rows={2}
                  placeholder="Special instructions or notes for camp instructors..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', resize: 'vertical' }}
                />
              </div>
            </div>

            {/* SECTION 6: MANDATORY CONSENT CHECKBOXES */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <ShieldCheck size={16} /> CONSENT & TERMS (Please tick all mandatory items) *
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <label style={{ fontSize: '12.5px', color: '#1E293B', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                  <input type="checkbox" checked={consents.c1} onChange={(e) => setConsents({ ...consents, c1: e.target.checked })} style={{ marginTop: '2px', accentColor: '#C40000' }} />
                  <span>I consent for my child to participate in all camp activities</span>
                </label>

                <label style={{ fontSize: '12.5px', color: '#1E293B', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                  <input type="checkbox" checked={consents.c2} onChange={(e) => setConsents({ ...consents, c2: e.target.checked })} style={{ marginTop: '2px', accentColor: '#C40000' }} />
                  <span>I understand the camp involves computer-based and creative learning</span>
                </label>

                <label style={{ fontSize: '12.5px', color: '#1E293B', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                  <input type="checkbox" checked={consents.c3} onChange={(e) => setConsents({ ...consents, c3: e.target.checked })} style={{ marginTop: '2px', accentColor: '#C40000' }} />
                  <span>I agree my child will be supervised at all times</span>
                </label>

                <label style={{ fontSize: '12.5px', color: '#1E293B', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                  <input type="checkbox" checked={consents.c4} onChange={(e) => setConsents({ ...consents, c4: e.target.checked })} style={{ marginTop: '2px', accentColor: '#C40000' }} />
                  <span>I understand fees are non-refundable (if applicable)</span>
                </label>

                <label style={{ fontSize: '12.5px', color: '#1E293B', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                  <input type="checkbox" checked={consents.c5} onChange={(e) => setConsents({ ...consents, c5: e.target.checked })} style={{ marginTop: '2px', accentColor: '#C40000' }} />
                  <span>I consent to use of student work/photos for learning or promotional purposes</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !allConsentsChecked}
              style={{
                width: '100%',
                height: '48px',
                background: allConsentsChecked ? '#C40000' : '#94A3B8',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: allConsentsChecked ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                boxShadow: allConsentsChecked ? '0 4px 12px rgba(196, 0, 0, 0.25)' : 'none'
              }}
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <FileCheck size={18} />}
              {submitting ? 'Submitting Registration...' : 'Submit Summer Camp Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
