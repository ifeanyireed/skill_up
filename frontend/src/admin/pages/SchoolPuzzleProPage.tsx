// ============================================================================
// SkillUp Check-In Portal — Native Schools Dashboard Component Page
// Route: /admin/school & /school
// Exact native React components matching the /schools Educator & School Portal
// ============================================================================
import React, { useState } from 'react'
import {
  Users,
  School,
  Building2,
  Settings,
  Plus,
  Search,
  Copy,
  Check,
  Globe,
  Award,
  Edit2,
  Trash2,
  Sparkles,
  KeyRound,
  ShieldCheck,
  Mail,
  Phone,
  Lock,
  ChevronRight,
  X
} from 'lucide-react'
import '../admin.css'

export interface SchoolStudent {
  id: string
  name: string
  avatar: string
  studentCode: string
  groupName: string
  centreId: number
  centreName: string
  assignedWorldId: number
  totalXP: number
}

export interface SchoolGroup {
  id: number
  name: string
  centreId: number
  centreName: string
  studentCount: number
}

export interface SchoolCentre {
  id: number
  name: string
  location: string
  code: string
}

const AVATARS = [
  '/avatars/character1.jpg',
  '/avatars/character2.jpg',
  '/avatars/character3.jpg',
  '/avatars/character4.jpg',
  '/avatars/character5.jpg',
]

const INITIAL_CENTRES: SchoolCentre[] = [
  { id: 1, name: 'Raji Rasaki Campus', location: 'Raji Rasaki Road, Amuwo Odofin', code: 'RAJI-CAMPUS' },
  { id: 2, name: 'CBT Training Complex', location: 'CBT Training Complex Hub', code: 'CBT-HUB' },
]

const INITIAL_GROUPS: SchoolGroup[] = [
  { id: 1, name: 'Grade 5 Coding Class', centreId: 1, centreName: 'Raji Rasaki Campus', studentCount: 32 },
  { id: 2, name: 'Senior Coders Club', centreId: 1, centreName: 'Raji Rasaki Campus', studentCount: 28 },
  { id: 3, name: 'STEM Lab 1', centreId: 2, centreName: 'CBT Training Complex', studentCount: 35 },
]

const INITIAL_STUDENTS: SchoolStudent[] = [
  {
    id: 'std-1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=250',
    studentCode: '83920193',
    groupName: 'Grade 5 Coding Class',
    centreId: 1,
    centreName: 'Raji Rasaki Campus',
    assignedWorldId: 2,
    totalXP: 1450,
  },
  {
    id: 'std-2',
    name: 'Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    studentCode: '47201948',
    groupName: 'Senior Coders Club',
    centreId: 1,
    centreName: 'Raji Rasaki Campus',
    assignedWorldId: 3,
    totalXP: 2820,
  },
  {
    id: 'std-3',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    studentCode: '91823746',
    groupName: 'STEM Lab 1',
    centreId: 2,
    centreName: 'CBT Training Complex',
    assignedWorldId: 5,
    totalXP: 4200,
  },
  {
    id: 'std-4',
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    studentCode: '58291034',
    groupName: 'Grade 5 Coding Class',
    centreId: 1,
    centreName: 'Raji Rasaki Campus',
    assignedWorldId: 1,
    totalXP: 980,
  },
]

export function SchoolPuzzleProPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'groups' | 'centres' | 'profile'>('students')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCentreFilter, setSelectedCentreFilter] = useState<string>('ALL')
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL')
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)

  const [centres, setCentres] = useState<SchoolCentre[]>(INITIAL_CENTRES)
  const [groups, setGroups] = useState<SchoolGroup[]>(INITIAL_GROUPS)
  const [students, setStudents] = useState<SchoolStudent[]>(INITIAL_STUDENTS)

  // Student Modal
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<SchoolStudent | null>(null)
  const [studentForm, setStudentForm] = useState({
    name: '',
    studentCode: '',
    groupName: INITIAL_GROUPS[0]?.name || 'Grade 5 Coding Class',
    assignedWorldId: 1,
  })

  // Group Modal
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<SchoolGroup | null>(null)
  const [groupForm, setGroupForm] = useState({ name: '', centreId: 1 })

  // Centre Modal
  const [isCentreModalOpen, setIsCentreModalOpen] = useState(false)
  const [editingCentre, setEditingCentre] = useState<SchoolCentre | null>(null)
  const [centreForm, setCentreForm] = useState({ name: '', location: '', code: '' })

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    name: 'Future Programs For Kids Academy',
    domain: 'skilluplearningacademy.com',
    contactEmail: 'contact@skilluplearningacademy.com',
    contactPhone: '+1 (555) 019-2831',
    seats: 100,
    plan: 'School Enterprise',
  })
  const [profileSaved, setProfileSaved] = useState(false)

  const generate8DigitCode = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString()
  }

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCodeId(id)
    setTimeout(() => setCopiedCodeId(null), 2000)
  }

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentCode.includes(searchQuery) ||
      s.groupName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGroup = selectedGroupFilter === 'ALL' || s.groupName === selectedGroupFilter
    const matchesCentre = selectedCentreFilter === 'ALL' || s.centreId.toString() === selectedCentreFilter
    return matchesSearch && matchesGroup && matchesCentre
  })

  // Handlers
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentForm.name) return
    const finalCode = studentForm.studentCode || generate8DigitCode()
    const targetGroup = groups.find((g) => g.name === studentForm.groupName)

    if (editingStudent) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingStudent.id
            ? {
                ...s,
                name: studentForm.name,
                groupName: studentForm.groupName,
                assignedWorldId: studentForm.assignedWorldId,
                centreId: targetGroup?.centreId || 1,
                centreName: targetGroup?.centreName || 'Raji Rasaki Campus',
              }
            : s
        )
      )
    } else {
      const newStd: SchoolStudent = {
        id: `std-${Date.now()}`,
        name: studentForm.name,
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
        studentCode: finalCode,
        groupName: studentForm.groupName,
        centreId: targetGroup?.centreId || 1,
        centreName: targetGroup?.centreName || 'Raji Rasaki Campus',
        assignedWorldId: studentForm.assignedWorldId,
        totalXP: 100,
      }
      setStudents((prev) => [newStd, ...prev])
    }

    setIsStudentModalOpen(false)
    setEditingStudent(null)
    setStudentForm({ name: '', studentCode: '', groupName: groups[0]?.name || '', assignedWorldId: 1 })
  }

  const handleDeleteStudent = (id: string) => {
    if (confirm('Delete student account?')) {
      setStudents((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const handleAssignWorld = (id: string, worldId: number) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, assignedWorldId: worldId } : s)))
  }

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupForm.name) return
    const targetCentre = centres.find((c) => c.id === groupForm.centreId)

    if (editingGroup) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === editingGroup.id
            ? { ...g, name: groupForm.name, centreId: groupForm.centreId, centreName: targetCentre?.name || '' }
            : g
        )
      )
    } else {
      const newGrp: SchoolGroup = {
        id: Date.now(),
        name: groupForm.name,
        centreId: groupForm.centreId,
        centreName: targetCentre?.name || 'Raji Rasaki Campus',
        studentCount: 0,
      }
      setGroups((prev) => [...prev, newGrp])
    }

    setIsGroupModalOpen(false)
    setEditingGroup(null)
    setGroupForm({ name: '', centreId: 1 })
  }

  const handleSaveCentre = (e: React.FormEvent) => {
    e.preventDefault()
    if (!centreForm.name) return

    if (editingCentre) {
      setCentres((prev) =>
        prev.map((c) =>
          c.id === editingCentre.id
            ? { ...c, name: centreForm.name, location: centreForm.location, code: centreForm.code }
            : c
        )
      )
    } else {
      const newCentre: SchoolCentre = {
        id: Date.now(),
        name: centreForm.name,
        location: centreForm.location,
        code: centreForm.code || `CENTRE-${Date.now()}`,
      }
      setCentres((prev) => [...prev, newCentre])
    }

    setIsCentreModalOpen(false)
    setEditingCentre(null)
    setCentreForm({ name: '', location: '', code: '' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── 1. Page Header ── */}
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="admin-badge admin-badge-accent">
              <School size={12} /> SCHOOL EDUCATOR PORTAL
            </span>
          </div>
          <div className="admin-page-title">{profileForm.name}</div>
          <div className="admin-page-desc">
            Manage school campus locations, class groups, 8-digit student access codes, and assigned learning worlds
          </div>
        </div>

        <div className="admin-page-actions">
          <button
            className="admin-btn admin-btn-ghost"
            onClick={() => {
              setEditingStudent(null)
              setStudentForm({
                name: '',
                studentCode: generate8DigitCode(),
                groupName: groups[0]?.name || '',
                assignedWorldId: 1,
              })
              setIsStudentModalOpen(true)
            }}
          >
            <Plus size={14} /> Add New Student
          </button>
        </div>
      </div>

      {/* ── 2. Metric KPI Cards ── */}
      <div className="admin-grid-4">
        <div className="admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label">Campus Centres</span>
            <Building2 size={16} color="var(--adm-text-3)" />
          </div>
          <div className="admin-stat-value">{centres.length} Locations</div>
          <div className="admin-stat-sub">Active school campuses</div>
        </div>

        <div className="admin-stat-card" style={{ borderColor: 'rgba(196, 0, 0, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label" style={{ color: 'var(--adm-accent)', fontWeight: 600 }}>Classes & Groups</span>
            <School size={16} color="var(--adm-accent)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-accent)' }}>{groups.length} Groups</div>
          <div className="admin-stat-sub">Tied to campus centres</div>
        </div>

        <div className="admin-stat-card" style={{ borderColor: 'rgba(22, 163, 74, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label" style={{ color: 'var(--adm-success)', fontWeight: 600 }}>Enrolled Students</span>
            <Users size={16} color="var(--adm-success)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-success)' }}>{students.length} Students</div>
          <div className="admin-stat-sub">8-Digit access codes active</div>
        </div>

        <div className="admin-stat-card" style={{ borderColor: 'rgba(217, 119, 6, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label" style={{ color: 'var(--adm-warning)', fontWeight: 600 }}>Learning Worlds</span>
            <Globe size={16} color="var(--adm-warning)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-warning)' }}>5 Worlds</div>
          <div className="admin-stat-sub">Assigned per student roster</div>
        </div>
      </div>

      {/* ── 3. Navigation Tabs Bar ── */}
      <div className="admin-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('students')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '0.5rem 0',
              border: 'none',
              borderBottom: activeTab === 'students' ? '2px solid var(--adm-accent, #C40000)' : '2px solid transparent',
              color: activeTab === 'students' ? 'var(--adm-accent, #C40000)' : 'var(--adm-text-2)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            <Users size={16} /> Student Roster & Access Codes
          </button>

          <button
            onClick={() => setActiveTab('groups')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '0.5rem 0',
              border: 'none',
              borderBottom: activeTab === 'groups' ? '2px solid var(--adm-accent, #C40000)' : '2px solid transparent',
              color: activeTab === 'groups' ? 'var(--adm-accent, #C40000)' : 'var(--adm-text-2)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            <School size={16} /> School Classes & Groups
          </button>

          <button
            onClick={() => setActiveTab('centres')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '0.5rem 0',
              border: 'none',
              borderBottom: activeTab === 'centres' ? '2px solid var(--adm-accent, #C40000)' : '2px solid transparent',
              color: activeTab === 'centres' ? 'var(--adm-accent, #C40000)' : 'var(--adm-text-2)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            <Building2 size={16} /> Campus Centres & Locations
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '0.5rem 0',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '2px solid var(--adm-accent, #C40000)' : '2px solid transparent',
              color: activeTab === 'profile' ? 'var(--adm-accent, #C40000)' : 'var(--adm-text-2)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            <Settings size={16} /> Profile & Subscription
          </button>
        </div>

        <div className="admin-toolbar-search" style={{ height: '32px' }}>
          <Search size={14} color="var(--adm-text-3)" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '180px' }}
          />
        </div>
      </div>

      {/* ── TAB 1: STUDENT ROSTER ── */}
      {activeTab === 'students' && (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            className="admin-card-title"
            style={{
              padding: '1rem 1.25rem',
              marginBottom: 0,
              borderBottom: '1px solid var(--adm-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--adm-text-1)' }}>
                Student Roster Directory
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-3)', marginTop: '2px' }}>
                Manage 8-digit access codes, assign Learning Worlds, and track student XP
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <select
                value={selectedCentreFilter}
                onChange={(e) => setSelectedCentreFilter(e.target.value)}
                style={{
                  height: '32px',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--adm-border)',
                  padding: '0 0.5rem',
                  fontSize: '0.8125rem',
                  backgroundColor: 'var(--adm-surface)',
                  color: 'var(--adm-text-1)',
                }}
              >
                <option value="ALL">All Campuses ({centres.length})</option>
                {centres.map((c) => (
                  <option key={c.id} value={c.id.toString()}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedGroupFilter}
                onChange={(e) => setSelectedGroupFilter(e.target.value)}
                style={{
                  height: '32px',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--adm-border)',
                  padding: '0 0.5rem',
                  fontSize: '0.8125rem',
                  backgroundColor: 'var(--adm-surface)',
                  color: 'var(--adm-text-1)',
                }}
              >
                <option value="ALL">All Classes ({groups.length})</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>

              <button
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() => {
                  setEditingStudent(null)
                  setStudentForm({
                    name: '',
                    studentCode: generate8DigitCode(),
                    groupName: groups[0]?.name || '',
                    assignedWorldId: 1,
                  })
                  setIsStudentModalOpen(true)
                }}
              >
                <Plus size={14} /> Add Student
              </button>
            </div>
          </div>

          <div className="admin-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>8-Digit Access Code</th>
                  <th>Class & Location Centre</th>
                  <th>Assigned World</th>
                  <th>XP Score</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-table-empty">
                      No matching student records found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st) => (
                    <tr key={st.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <img
                            src={st.avatar}
                            alt={st.name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--adm-text-1)' }}>{st.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--adm-accent, #C40000)' }}>
                            {st.studentCode}
                          </span>
                          <button
                            onClick={() => copyCode(st.id, st.studentCode)}
                            className="admin-btn admin-btn-icon admin-btn-ghost"
                            title="Copy 8-Digit Code"
                            style={{ padding: '2px', border: 'none' }}
                          >
                            {copiedCodeId === st.id ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--adm-text-1)' }}>{st.groupName}</div>
                        <div style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>{st.centreName}</div>
                      </td>
                      <td>
                        <select
                          value={st.assignedWorldId}
                          onChange={(e) => handleAssignWorld(st.id, parseInt(e.target.value, 10))}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.375rem',
                            border: '1px solid var(--adm-border)',
                            backgroundColor: 'var(--adm-surface)',
                            color: 'var(--adm-text-1)',
                          }}
                        >
                          <option value={1}>World 1: Pipe Beginnings</option>
                          <option value={2}>World 2: Code Jungle</option>
                          <option value={3}>World 3: Web Kingdom</option>
                          <option value={4}>World 4: JS Galaxy</option>
                          <option value={5}>World 5: Python Temple</option>
                        </select>
                      </td>
                      <td style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--adm-accent)' }}>
                        {st.totalXP.toLocaleString()} XP
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                          <button
                            className="admin-btn admin-btn-icon admin-btn-ghost"
                            onClick={() => {
                              setEditingStudent(st)
                              setStudentForm({
                                name: st.name,
                                studentCode: st.studentCode,
                                groupName: st.groupName,
                                assignedWorldId: st.assignedWorldId,
                              })
                              setIsStudentModalOpen(true)
                            }}
                            title="Edit Student"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="admin-btn admin-btn-icon admin-btn-ghost"
                            onClick={() => handleDeleteStudent(st.id)}
                            title="Delete Student"
                            style={{ color: 'var(--adm-accent)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: SCHOOL CLASSES & GROUPS ── */}
      {activeTab === 'groups' && (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            className="admin-card-title"
            style={{
              padding: '1rem 1.25rem',
              marginBottom: 0,
              borderBottom: '1px solid var(--adm-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--adm-text-1)' }}>
                School Classes & Roster Groups
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-3)', marginTop: '2px' }}>
                Organize classroom rosters tied to campus locations
              </div>
            </div>

            <button
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={() => {
                setEditingGroup(null)
                setGroupForm({ name: '', centreId: centres[0]?.id || 1 })
                setIsGroupModalOpen(true)
              }}
            >
              <Plus size={14} /> Add Class Group
            </button>
          </div>

          <div className="admin-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Class / Group Name</th>
                  <th>Campus Location</th>
                  <th>Enrolled Students</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((grp) => (
                  <tr key={grp.id}>
                    <td style={{ fontWeight: 700, color: 'var(--adm-text-1)' }}>{grp.name}</td>
                    <td style={{ fontSize: 13, color: 'var(--adm-text-2)' }}>{grp.centreName}</td>
                    <td style={{ fontWeight: 600 }}>
                      {students.filter((s) => s.groupName === grp.name).length} Students
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => {
                          setEditingGroup(grp)
                          setGroupForm({ name: grp.name, centreId: grp.centreId })
                          setIsGroupModalOpen(true)
                        }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: CAMPUS CENTRES & LOCATIONS ── */}
      {activeTab === 'centres' && (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            className="admin-card-title"
            style={{
              padding: '1rem 1.25rem',
              marginBottom: 0,
              borderBottom: '1px solid var(--adm-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--adm-text-1)' }}>
                School Campus Locations
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-3)', marginTop: '2px' }}>
                Manage physical training hubs & campus centres
              </div>
            </div>

            <button
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={() => {
                setEditingCentre(null)
                setCentreForm({ name: '', location: '', code: '' })
                setIsCentreModalOpen(true)
              }}
            >
              <Plus size={14} /> Add Campus Centre
            </button>
          </div>

          <div className="admin-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Campus Name</th>
                  <th>Location Address</th>
                  <th>Centre Code</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {centres.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700, color: 'var(--adm-text-1)' }}>{c.name}</td>
                    <td style={{ fontSize: 13, color: 'var(--adm-text-2)' }}>{c.location}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{c.code}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => {
                          setEditingCentre(c)
                          setCentreForm({ name: c.name, location: c.location, code: c.code })
                          setIsCentreModalOpen(true)
                        }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: PROFILE & SUBSCRIPTION ── */}
      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="admin-card">
            <div className="admin-card-title">School Profile & Branding</div>
            {profileSaved && (
              <div className="admin-badge admin-badge-green" style={{ marginBottom: '1rem' }}>
                Profile settings updated!
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setProfileSaved(true)
                setTimeout(() => setProfileSaved(false), 3000)
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>School Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--adm-border)', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>Domain Origin</label>
                <input
                  type="text"
                  value={profileForm.domain}
                  onChange={(e) => setProfileForm({ ...profileForm, domain: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--adm-border)', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>Contact Email</label>
                <input
                  type="email"
                  value={profileForm.contactEmail}
                  onChange={(e) => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--adm-border)', marginTop: '4px' }}
                />
              </div>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: '0.5rem' }}>
                Save Profile Changes
              </button>
            </form>
          </div>

          <div className="admin-card">
            <div className="admin-card-title">School Subscription & Seats</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--adm-text-3)' }}>Current Subscription Plan</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--adm-accent, #C40000)' }}>
                  {profileForm.plan}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--adm-text-3)' }}>Allocated Student Seats</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--adm-text-1)' }}>
                  {students.length} / {profileForm.seats} Seats Used
                </div>
              </div>

              <div className="admin-badge admin-badge-green" style={{ width: 'fit-content' }}>
                <ShieldCheck size={14} /> Active School License
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STUDENT MODAL ── */}
      {isStudentModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '440px' }}>
            <div className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{editingStudent ? 'Edit Student Account' : 'Add New Student'}</span>
              <button onClick={() => setIsStudentModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--adm-border)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>8-Digit Access Code</label>
                <input
                  type="text"
                  placeholder="Auto-generated 8 digits"
                  value={studentForm.studentCode}
                  onChange={(e) => setStudentForm({ ...studentForm, studentCode: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--adm-border)', marginTop: '4px', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>Assigned Class Group</label>
                <select
                  value={studentForm.groupName}
                  onChange={(e) => setStudentForm({ ...studentForm, groupName: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--adm-border)', marginTop: '4px' }}
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name} ({g.centreName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>Assigned World</label>
                <select
                  value={studentForm.assignedWorldId}
                  onChange={(e) => setStudentForm({ ...studentForm, assignedWorldId: parseInt(e.target.value, 10) })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--adm-border)', marginTop: '4px' }}
                >
                  <option value={1}>World 1: Pipe Beginnings</option>
                  <option value={2}>World 2: Code Jungle</option>
                  <option value={3}>World 3: Web Kingdom</option>
                  <option value={4}>World 4: JS Galaxy</option>
                  <option value={5}>World 5: Python Temple</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsStudentModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── GROUP MODAL ── */}
      {isGroupModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '400px' }}>
            <div className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{editingGroup ? 'Edit Class Group' : 'Add Class Group'}</span>
              <button onClick={() => setIsGroupModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 5 Coding Class"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--adm-border)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>Campus Location</label>
                <select
                  value={groupForm.centreId}
                  onChange={(e) => setGroupForm({ ...groupForm, centreId: parseInt(e.target.value, 10) })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--adm-border)', marginTop: '4px' }}
                >
                  {centres.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsGroupModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CENTRE MODAL ── */}
      {isCentreModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '400px' }}>
            <div className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{editingCentre ? 'Edit Campus Location' : 'Add Campus Location'}</span>
              <button onClick={() => setIsCentreModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCentre} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>Campus Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raji Rasaki Campus"
                  value={centreForm.name}
                  onChange={(e) => setCentreForm({ ...centreForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--adm-border)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>Location Address</label>
                <input
                  type="text"
                  placeholder="e.g. Raji Rasaki Road"
                  value={centreForm.location}
                  onChange={(e) => setCentreForm({ ...centreForm, location: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--adm-border)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>Centre Code</label>
                <input
                  type="text"
                  placeholder="e.g. RAJI-CAMPUS"
                  value={centreForm.code}
                  onChange={(e) => setCentreForm({ ...centreForm, code: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--adm-border)', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setIsCentreModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Campus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
