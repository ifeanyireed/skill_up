// ============================================================================
// SkillUp Check-In Portal — Native Schools Dashboard Component Page
// Route: /admin/school & /school
// Connected 100% directly to Player Service API (https://player-service-bttg.onrender.com/api/v1/)
// Organization: org_4687 (SkillUp Academy)
// Includes Full Live CRUD + Bulk Select Actions + Pagination Controller
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

const PLAYER_SERVICE_URL = 'https://player-service-bttg.onrender.com/api/v1'

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
  { id: 3, name: 'Raji Rasaki Centre', location: 'Raji Rasaki Road, Amuwo Odofin, Lagos', code: 'raji-campus' },
]

const DEFAULT_GROUPS: SchoolGroup[] = [
  { id: 1, name: 'Grade 5 Coding Class', centreId: 2, centreName: 'Festac Centre', studentCount: 0 },
  { id: 2, name: 'Senior Camp (11+ years)', centreId: 3, centreName: 'Raji Rasaki Centre', studentCount: 0 },
  { id: 3, name: 'Junior Camp (5–10 years)', centreId: 3, centreName: 'Raji Rasaki Centre', studentCount: 0 },
]

export function SchoolPuzzleProPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'groups' | 'centres'>('students')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCentreFilter, setSelectedCentreFilter] = useState<string>('ALL')
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL')
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Bulk Selection State
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const [bulkWorldId, setBulkWorldId] = useState<number>(1)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // DB State for org_4687 (SkillUp Academy)
  const [activeOrgId] = useState<string>('org_4687')
  const [schoolName, setSchoolName] = useState<string>('SkillUp Academy')
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

  // Reset to Page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCentreFilter, selectedGroupFilter])

  // Load live data directly from https://player-service-bttg.onrender.com/api/v1/ for org_4687
  const loadDatabaseData = async () => {
    setLoading(true)
    try {
      // 1. Fetch Organisation Info
      const orgRes = await fetch(`${PLAYER_SERVICE_URL}/organisations`)
      const orgData = await orgRes.json()
      if (orgData && orgData.success && Array.isArray(orgData.organisations)) {
        const matchingOrg = orgData.organisations.find((o: any) => o.id === activeOrgId)
        if (matchingOrg) {
          setSchoolName(matchingOrg.name)
        }
      }

      // 2. Fetch Centres for org_4687
      const centresRes = await fetch(`${PLAYER_SERVICE_URL}/centres?orgId=${activeOrgId}`)
      const centresData = await centresRes.json()
      if (centresData && Array.isArray(centresData) && centresData.length > 0) {
        setCentres(centresData)
      } else if (centresData && Array.isArray(centresData.centres) && centresData.centres.length > 0) {
        setCentres(centresData.centres)
      }

      // 3. Fetch Groups for org_4687
      const groupsRes = await fetch(`${PLAYER_SERVICE_URL}/groups?orgId=${activeOrgId}`)
      const groupsData = await groupsRes.json()
      if (groupsData && Array.isArray(groupsData) && groupsData.length > 0) {
        setGroups(groupsData)
      } else if (groupsData && Array.isArray(groupsData.groups) && groupsData.groups.length > 0) {
        setGroups(groupsData.groups)
      }

      // 4. Fetch Users / Students for org_4687
      const usersRes = await fetch(`${PLAYER_SERVICE_URL}/users?orgId=${activeOrgId}`)
      const usersData = await usersRes.json()
      if (usersData && usersData.success && Array.isArray(usersData.users)) {
        const mappedStudents: SchoolStudent[] = usersData.users
          .filter((u: any) => u.role === 'student' || u.role === 'Student')
          .map((u: any, idx: number) => {
            const group = u.group_name || u.groupName || 'Junior Camp (5–10 years)'
            const isSenior = group.toLowerCase().includes('senior')
            const isFestac = group.toLowerCase().includes('festac') || (u.centre_name && u.centre_name.toLowerCase().includes('festac'))
            const worldId = isSenior ? 2 : 1

            const cId = isFestac ? 2 : 3
            const cName = isFestac ? 'Festac Centre' : 'Raji Rasaki Centre'

            return {
              id: String(u.id),
              name: u.username || u.name,
              avatar: u.avatar && u.avatar.startsWith('/') ? u.avatar : AVATARS[idx % AVATARS.length],
              studentCode: u.access_code || u.studentCode || u.accessCode || '88776655',
              groupName: group,
              centreId: cId,
              centreName: cName,
              assignedWorldId: u.assigned_world_id || u.assignedWorldId || worldId,
              totalXP: u.total_xp || u.totalXP || 100,
            }
          })

        setStudents(mappedStudents)
      }
    } catch (err) {
      console.warn('Error fetching live player service data from Render:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDatabaseData()
  }, [activeOrgId])

  // ── BULK SELECTION HANDLERS ───────────────────────────────────────────────
  const toggleSelectAllStudents = () => {
    if (selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedStudentIds([])
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id))
    }
  }

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleBulkAssignWorld = async () => {
    if (selectedStudentIds.length === 0) return
    setActionLoading(true)
    try {
      for (const id of selectedStudentIds) {
        await handleAssignWorld(id, bulkWorldId)
      }
      alert(`Successfully assigned ${selectedStudentIds.length} students to World ${bulkWorldId}!`)
    } catch (err) {
      console.error('Error in bulk world assignment:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleBulkDeleteStudents = async () => {
    if (selectedStudentIds.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedStudentIds.length} selected student records?`)) return
    setActionLoading(true)

    try {
      for (const id of selectedStudentIds) {
        await fetch(`${PLAYER_SERVICE_URL}/users?id=${id}`, { method: 'DELETE' })
      }
      setSelectedStudentIds([])
      await loadDatabaseData()
    } catch (err) {
      console.error('Error in bulk delete:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleBulkCopyCodes = () => {
    const selectedStudents = students.filter((s) => selectedStudentIds.includes(s.id))
    const codesText = selectedStudents.map((s) => `${s.name}: ${s.studentCode}`).join('\n')
    navigator.clipboard.writeText(codesText)
    alert(`Copied ${selectedStudents.length} access codes to clipboard!`)
  }

  // ── STUDENT CRUD HANDLERS ──────────────────────────────────────────────────
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentForm.name.trim()) return
    setActionLoading(true)

    const finalCode = studentForm.studentCode.trim() || generate8DigitCode()

    try {
      await fetch(`${PLAYER_SERVICE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingStudent ? editingStudent.id : undefined,
          username: studentForm.name.trim(),
          name: studentForm.name.trim(),
          avatar: editingStudent?.avatar || AVATARS[Math.floor(Math.random() * AVATARS.length)],
          accessCode: finalCode,
          studentCode: finalCode,
          role: 'student',
          organisationId: activeOrgId,
          organisation_id: activeOrgId,
          groupName: studentForm.groupName,
          group_name: studentForm.groupName,
          assignedWorldId: studentForm.assignedWorldId,
        }),
      })

      await loadDatabaseData()
    } catch (err) {
      console.error('Error saving student to player service:', err)
    } finally {
      setActionLoading(false)
      setIsStudentModalOpen(false)
      setEditingStudent(null)
      setStudentForm({ name: '', studentCode: '', groupName: groups[0]?.name || '', assignedWorldId: 1 })
    }
  }

  const handleDeleteStudent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student record from player-service database?')) return
    setActionLoading(true)

    try {
      await fetch(`${PLAYER_SERVICE_URL}/users?id=${id}`, { method: 'DELETE' })
      await loadDatabaseData()
    } catch (err) {
      console.error('Error deleting student from player service:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleAssignWorld = async (id: string, worldId: number) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, assignedWorldId: worldId } : s)))

    try {
      await fetch(`${PLAYER_SERVICE_URL}/users/assign-world`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, worldId }),
      })
    } catch (err) {
      console.error('Error assigning world in player service:', err)
    }
  }

  // ── GROUP CRUD HANDLERS ────────────────────────────────────────────────────
  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupForm.name.trim()) return
    setActionLoading(true)

    const targetCentre = centres.find((c) => c.id === groupForm.centreId)

    try {
      await fetch(`${PLAYER_SERVICE_URL}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingGroup ? editingGroup.id : 0,
          organisationId: activeOrgId,
          organisation_id: activeOrgId,
          centreId: groupForm.centreId,
          centre_id: groupForm.centreId,
          centreName: targetCentre?.name || 'Festac Centre',
          name: groupForm.name.trim(),
        }),
      })

      await loadDatabaseData()
    } catch (err) {
      console.error('Error saving group to player service:', err)
    } finally {
      setActionLoading(false)
      setIsGroupModalOpen(false)
      setEditingGroup(null)
      setGroupForm({ name: '', centreId: centres[0]?.id || 2 })
    }
  }

  const handleDeleteGroup = (id: number) => {
    if (!confirm('Are you sure you want to delete this class group?')) return
    setGroups((prev) => prev.filter((g) => g.id !== id))
  }

  // ── CENTRE CRUD HANDLERS ───────────────────────────────────────────────────
  const handleSaveCentre = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!centreForm.name.trim()) return
    setActionLoading(true)

    try {
      await fetch(`${PLAYER_SERVICE_URL}/centres`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCentre ? editingCentre.id : 0,
          organisationId: activeOrgId,
          organisation_id: activeOrgId,
          name: centreForm.name.trim(),
          location: centreForm.location.trim() || 'Lagos, Nigeria',
          code: centreForm.code.trim() || centreForm.name.toLowerCase().replace(/\s+/g, '-'),
        }),
      })

      await loadDatabaseData()
    } catch (err) {
      console.error('Error saving centre to player service:', err)
    } finally {
      setActionLoading(false)
      setIsCentreModalOpen(false)
      setEditingCentre(null)
      setCentreForm({ name: '', location: '', code: '' })
    }
  }

  const handleDeleteCentre = (id: number) => {
    if (!confirm('Are you sure you want to delete this campus location?')) return
    setCentres((prev) => prev.filter((c) => c.id !== id))
  }

  // Filtered Students according to Group and Centre
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentCode.includes(searchQuery) ||
      s.groupName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGroup = selectedGroupFilter === 'ALL' || s.groupName === selectedGroupFilter
    const matchesCentre =
      selectedCentreFilter === 'ALL' ||
      s.centreId.toString() === selectedCentreFilter ||
      s.centreName === selectedCentreFilter
    return matchesSearch && matchesGroup && matchesCentre
  })

  // Paginated calculations
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, filteredStudents.length)
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex)

  // ── PAGINATION CONTROLLER COMPONENT ─────────────────────────────────────────
  const renderPaginationBar = () => {
    if (filteredStudents.length === 0) return null

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          backgroundColor: 'var(--adm-surface)',
          borderTop: '1px solid var(--adm-border)',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8125rem',
          color: 'var(--adm-text-2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>
            Showing <strong>{startIndex + 1}</strong> – <strong>{endIndex}</strong> of <strong>{filteredStudents.length}</strong> students
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ fontSize: '0.75rem' }}>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10))
                setCurrentPage(1)
              }}
              style={{
                height: '28px',
                borderRadius: '0.375rem',
                border: '1px solid var(--adm-border)',
                padding: '0 0.5rem',
                fontSize: '0.75rem',
                backgroundColor: 'var(--adm-surface-2)',
                color: 'var(--adm-text-1)',
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            title="First Page"
          >
            « First
          </button>
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            title="Previous Page"
          >
            ‹ Prev
          </button>

          <span style={{ padding: '0 0.5rem', fontWeight: 600 }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            title="Next Page"
          >
            Next ›
          </button>
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            title="Last Page"
          >
            Last »
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── 1. Page Header ── */}
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="admin-badge admin-badge-accent">
              <School size={12} /> PUZZLEPRO PORTAL
            </span>
          </div>
          <div className="admin-page-title">{schoolName}</div>
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
          <div className="admin-stat-sub">Active school campuses</div>
        </div>

        <div className="admin-stat-card" style={{ borderColor: 'rgba(196, 0, 0, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label" style={{ color: 'var(--adm-accent)', fontWeight: 600 }}>Classes & Groups</span>
            <School size={16} color="var(--adm-accent)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-accent)' }}>{groups.length} Groups</div>
          <div className="admin-stat-sub">Active class rosters</div>
        </div>

        <div className="admin-stat-card" style={{ borderColor: 'rgba(22, 163, 74, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label" style={{ color: 'var(--adm-success)', fontWeight: 600 }}>Enrolled Students</span>
            <Users size={16} color="var(--adm-success)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-success)' }}>{students.length} Students</div>
          <div className="admin-stat-sub">Active database roster</div>
        </div>

        <div className="admin-stat-card" style={{ borderColor: 'rgba(217, 119, 6, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label" style={{ color: 'var(--adm-warning)', fontWeight: 600 }}>Learning Worlds</span>
            <Globe size={16} color="var(--adm-warning)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-warning)' }}>5 Worlds</div>
          <div className="admin-stat-sub">Assigned per student</div>
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
            <Users size={16} /> Student Roster ({students.length})
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
            <School size={16} /> Classes & Groups ({groups.length})
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
            <Building2 size={16} /> Campus Centres ({centres.length})
          </button>
        </div>

        <div className="admin-toolbar-search" style={{ height: '32px' }}>
          <Search size={14} color="var(--adm-text-3)" />
          <input
            type="text"
            placeholder="Search roster..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '180px' }}
          />
        </div>
      </div>

      {/* ── BULK ACTIONS TOOLBAR ── */}
      {activeTab === 'students' && selectedStudentIds.length > 0 && (
        <div
          className="admin-card"
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: 'rgba(196, 0, 0, 0.08)',
            border: '1px solid var(--adm-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="admin-badge admin-badge-accent" style={{ fontSize: '0.8125rem', padding: '0.35rem 0.65rem' }}>
              <Users size={14} /> {selectedStudentIds.length} Students Selected
            </span>
            <button
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => setSelectedStudentIds([])}
              style={{ fontSize: '0.75rem' }}
            >
              Clear Selection
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <select
                value={bulkWorldId}
                onChange={(e) => setBulkWorldId(parseInt(e.target.value, 10))}
                style={{
                  height: '32px',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--adm-border)',
                  padding: '0 0.5rem',
                  fontSize: '0.75rem',
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
              <button
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={handleBulkAssignWorld}
                disabled={actionLoading}
              >
                <Globe size={13} /> Assign World
              </button>
            </div>

            <button
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={handleBulkCopyCodes}
            >
              <Copy size={13} /> Copy Selected Codes
            </button>

            <button
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={handleBulkDeleteStudents}
              disabled={actionLoading}
              style={{ backgroundColor: 'var(--adm-accent)', borderColor: 'var(--adm-accent)' }}
            >
              <Trash2 size={13} /> Delete Selected ({selectedStudentIds.length})
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 1: STUDENT ROSTER (PLAYER SERVICE DB) ── */}
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
            <div />

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
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                      onChange={toggleSelectAllStudents}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      title="Select All Students"
                    />
                  </th>
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
                    <td colSpan={7} className="admin-table-empty">
                      <Loader2 size={16} className="animate-spin" style={{ margin: '0 auto' }} /> Fetching player-service roster...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-table-empty">
                      No student records found in player-service database
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((st) => (
                    <tr
                      key={st.id}
                      style={{
                        backgroundColor: selectedStudentIds.includes(st.id) ? 'rgba(196, 0, 0, 0.06)' : undefined,
                      }}
                    >
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(st.id)}
                          onChange={() => toggleSelectStudent(st.id)}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                      </td>
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

          {/* ── PAGINATION CONTROLLER FOOTER ── */}
          {renderPaginationBar()}
        </div>
      )}

      {/* ── TAB 2: SCHOOL CLASSES & GROUPS (PLAYER SERVICE DB) ── */}
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
                School Classes & Roster Groups ({groups.length})
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
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
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          style={{ color: 'var(--adm-accent)' }}
                          onClick={() => handleDeleteGroup(grp.id)}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: CAMPUS CENTRES & LOCATIONS (PLAYER SERVICE DB) ── */}
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
                School Campus Locations ({centres.length})
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
                  <th>Enrolled Students</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {centres.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700, color: 'var(--adm-text-1)' }}>{c.name}</td>
                    <td style={{ fontSize: 13, color: 'var(--adm-text-2)' }}>{c.location}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{c.code}</td>
                    <td style={{ fontWeight: 600 }}>
                      {students.filter((s) => s.centreName === c.name || s.centreId === c.id).length} Students
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
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
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          style={{ color: 'var(--adm-accent)' }}
                          onClick={() => handleDeleteCentre(c.id)}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
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
                <button type="submit" className="admin-btn admin-btn-primary" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save Student to Player Service'}
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
