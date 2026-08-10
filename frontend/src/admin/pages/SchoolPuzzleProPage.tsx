// ============================================================================
// SkillUp Check-In Portal — Native Schools Dashboard Component Page
// Route: /admin/school & /school
// Live database integration for info@skilluplearningacademy.com / SkillUp Academy
// ============================================================================
import React, { useState, useEffect } from 'react'
import {
  Users,
  School,
  Building2,
  Plus,
  Search,
  Copy,
  Check,
  Globe,
  Edit2,
  Trash2,
  Loader2,
  X,
  RefreshCw
} from 'lucide-react'
import '../admin.css'

const PLAYER_SERVICE_URL = 'https://player-service-bttg.onrender.com'

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

const DEFAULT_CENTRES: SchoolCentre[] = [
  { id: 2, name: 'Festac Centre', location: 'House 32, 2nd Avenue, Amuwo-Odofin, Festac, Lagos', code: 'festac-centre' },
  { id: 1, name: 'Raji Rasaki Campus', location: 'Raji Rasaki Road, Amuwo Odofin', code: 'raji-campus' },
]

const DEFAULT_GROUPS: SchoolGroup[] = [
  { id: 1, name: 'Grade 5 Coding Class', centreId: 2, centreName: 'Festac Centre', studentCount: 1 },
  { id: 2, name: 'Junior Champions Group A', centreId: 2, centreName: 'Festac Centre', studentCount: 1 },
]

export function SchoolPuzzleProPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'groups' | 'centres'>('students')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCentreFilter, setSelectedCentreFilter] = useState<string>('ALL')
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL')
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // DB State
  const [activeOrgId, setActiveOrgId] = useState<string>('org_4687')
  const [schoolName, setSchoolName] = useState<string>('SkillUp Learning Academy')
  const [contactEmail, setContactEmail] = useState<string>('info@skilluplearningacademy.com')
  const [centres, setCentres] = useState<SchoolCentre[]>(DEFAULT_CENTRES)
  const [groups, setGroups] = useState<SchoolGroup[]>(DEFAULT_GROUPS)
  const [students, setStudents] = useState<SchoolStudent[]>([])

  // Student Modal
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<SchoolStudent | null>(null)
  const [studentForm, setStudentForm] = useState({
    name: '',
    studentCode: '',
    groupName: 'Grade 5 Coding Class',
    assignedWorldId: 1,
  })

  // Group Modal
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<SchoolGroup | null>(null)
  const [groupForm, setGroupForm] = useState({ name: '', centreId: 2 })

  // Centre Modal
  const [isCentreModalOpen, setIsCentreModalOpen] = useState(false)
  const [editingCentre, setEditingCentre] = useState<SchoolCentre | null>(null)
  const [centreForm, setCentreForm] = useState({ name: '', location: '', code: '' })

  const generate8DigitCode = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString()
  }

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCodeId(id)
    setTimeout(() => setCopiedCodeId(null), 2000)
  }

  // Load live data from Render Database
  const loadDatabaseData = async () => {
    setLoading(true)
    try {
      // 1. Fetch Organisations
      const orgRes = await fetch(`${PLAYER_SERVICE_URL}/api/v1/organisations`)
      const orgData = await orgRes.json()
      if (orgData && orgData.success && Array.isArray(orgData.organisations)) {
        const matchingOrg = orgData.organisations.find(
          (o: any) =>
            o.contact_email === 'info@skilluplearningacademy.com' ||
            o.contact_email === 'contact@skilluplearningacademy.com' ||
            o.domain === 'skilluplearningacademy.com' ||
            o.id === 'org_4687' ||
            o.id === 'org_skil_9901'
        ) || orgData.organisations[0]

        if (matchingOrg) {
          setActiveOrgId(matchingOrg.id)
          setSchoolName(matchingOrg.name)
          setContactEmail(matchingOrg.contact_email || 'info@skilluplearningacademy.com')
        }
      }

      // 2. Fetch Centres
      const centresRes = await fetch(`${PLAYER_SERVICE_URL}/api/v1/centres?orgId=${activeOrgId}`)
      const centresData = await centresRes.json()
      if (centresData && Array.isArray(centresData)) {
        setCentres(centresData)
      }

      // 3. Fetch Groups
      const groupsRes = await fetch(`${PLAYER_SERVICE_URL}/api/v1/groups?orgId=${activeOrgId}`)
      const groupsData = await groupsRes.json()
      if (groupsData && Array.isArray(groupsData)) {
        setGroups(groupsData)
      }

      // 4. Fetch Users / Students
      const usersRes = await fetch(`${PLAYER_SERVICE_URL}/api/v1/users?orgId=${activeOrgId}`)
      const usersData = await usersRes.json()
      if (usersData && usersData.success && Array.isArray(usersData.users)) {
        const mappedStudents: SchoolStudent[] = usersData.users
          .filter((u: any) => u.role === 'student')
          .map((u: any) => ({
            id: String(u.id),
            name: u.username || u.name,
            avatar: u.avatar || '/avatars/character1.jpg',
            studentCode: u.access_code || u.studentCode,
            groupName: u.group_name || u.groupName || 'Grade 5 Coding Class',
            centreId: u.centre_id || 2,
            centreName: u.centre_name || 'Festac Centre',
            assignedWorldId: u.assigned_world_id || u.assignedWorldId || 1,
            totalXP: u.total_xp || u.totalXP || 100,
          }))
        setStudents(mappedStudents)
      }
    } catch (err) {
      console.warn('Error fetching database data from Render:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDatabaseData()
  }, [activeOrgId])

  // Handlers
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentForm.name) return
    const finalCode = studentForm.studentCode || generate8DigitCode()

    try {
      await fetch(`${PLAYER_SERVICE_URL}/api/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingStudent ? editingStudent.id : undefined,
          name: studentForm.name,
          avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
          studentCode: finalCode,
          role: 'student',
          organisationId: activeOrgId,
          groupName: studentForm.groupName,
          assignedWorldId: studentForm.assignedWorldId,
        }),
      })
      await loadDatabaseData()
    } catch (err) {
      console.error('Error saving student:', err)
    }

    setIsStudentModalOpen(false)
    setEditingStudent(null)
    setStudentForm({ name: '', studentCode: '', groupName: groups[0]?.name || '', assignedWorldId: 1 })
  }

  const handleDeleteStudent = async (id: string) => {
    if (confirm('Delete student account?')) {
      try {
        await fetch(`${PLAYER_SERVICE_URL}/api/v1/users?id=${id}`, { method: 'DELETE' })
        await loadDatabaseData()
      } catch (err) {
        console.error('Error deleting student:', err)
      }
    }
  }

  const handleAssignWorld = async (id: string, worldId: number) => {
    try {
      await fetch(`${PLAYER_SERVICE_URL}/api/v1/users/assign-world`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, worldId }),
      })
      await loadDatabaseData()
    } catch (err) {
      console.error('Error assigning world:', err)
    }
  }

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupForm.name) return
    const targetCentre = centres.find((c) => c.id === groupForm.centreId)

    try {
      await fetch(`${PLAYER_SERVICE_URL}/api/v1/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingGroup ? editingGroup.id : 0,
          organisationId: activeOrgId,
          centreId: groupForm.centreId,
          centreName: targetCentre?.name || '',
          name: groupForm.name,
        }),
      })
      await loadDatabaseData()
    } catch (err) {
      console.error('Error saving group:', err)
    }

    setIsGroupModalOpen(false)
    setEditingGroup(null)
    setGroupForm({ name: '', centreId: centres[0]?.id || 2 })
  }

  const handleSaveCentre = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!centreForm.name) return

    try {
      await fetch(`${PLAYER_SERVICE_URL}/api/v1/centres`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCentre ? editingCentre.id : 0,
          organisationId: activeOrgId,
          name: centreForm.name,
          location: centreForm.location,
          code: centreForm.code,
        }),
      })
      await loadDatabaseData()
    } catch (err) {
      console.error('Error saving centre:', err)
    }

    setIsCentreModalOpen(false)
    setEditingCentre(null)
    setCentreForm({ name: '', location: '', code: '' })
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── 1. Page Header ── */}
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="admin-badge admin-badge-accent">
              <School size={12} /> PUZZLEPRO DATABASE PORTAL
            </span>
          </div>
          <div className="admin-page-title">{schoolName}</div>
          <div className="admin-page-desc">
            Live database sync for <strong>{contactEmail}</strong> — Campus locations, class groups, 8-digit access codes, and XP tracking
          </div>
        </div>

        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-ghost" onClick={loadDatabaseData} title="Refresh Database Data">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Database
          </button>
          <button
            className="admin-btn admin-btn-primary"
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
          <div className="admin-stat-sub">Active school campuses in DB</div>
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
          <div className="admin-stat-sub">8-Digit access codes active in DB</div>
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
            <Users size={16} /> Student Roster & Access Codes ({students.length})
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
            <School size={16} /> School Classes & Groups ({groups.length})
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
            <Building2 size={16} /> Campus Centres & Locations ({centres.length})
          </button>
        </div>

        <div className="admin-toolbar-search" style={{ height: '32px' }}>
          <Search size={14} color="var(--adm-text-3)" />
          <input
            type="text"
            placeholder="Search database..."
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
                Live Database Student Roster ({students.length})
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-3)', marginTop: '2px' }}>
                Synced directly with database for <strong>{contactEmail}</strong>
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
                  <th>Class Roster</th>
                  <th>Assigned World</th>
                  <th>XP Score</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="admin-table-empty">
                      <Loader2 size={16} className="animate-spin" style={{ margin: '0 auto' }} /> Fetching live database roster...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-table-empty">
                      No matching student records found in database
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
                setGroupForm({ name: '', centreId: centres[0]?.id || 2 })
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
                    <td style={{ fontSize: 13, color: 'var(--adm-text-2)' }}>{grp.centreName || 'Festac Centre'}</td>
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
                      {g.name} ({g.centreName || 'Festac Centre'})
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
                  Save Student to Database
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
                  Save Group to Database
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
                  placeholder="e.g. Festac Centre"
                  value={centreForm.name}
                  onChange={(e) => setCentreForm({ ...centreForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--adm-border)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>Location Address</label>
                <input
                  type="text"
                  placeholder="e.g. Festac, Lagos"
                  value={centreForm.location}
                  onChange={(e) => setCentreForm({ ...centreForm, location: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--adm-border)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-2)' }}>Centre Code</label>
                <input
                  type="text"
                  placeholder="e.g. festac-centre"
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
                  Save Campus to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
