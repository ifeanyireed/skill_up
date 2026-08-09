// ============================================================================
// SkillUp Check-In Portal — Native School & PuzzlePro Management Dashboard
// Route: /admin/school & /school
// Native React UI — No external iframe embeds or login screens
// ============================================================================
import React, { useState } from 'react'
import {
  Puzzle,
  Users,
  Award,
  BookOpen,
  Sparkles,
  Search,
  Plus,
  KeyRound,
  ChevronRight,
  ShieldCheck,
  Download,
  Star,
  Zap,
  BarChart2
} from 'lucide-react'
import '../admin.css'

interface SchoolClass {
  id: string
  name: string
  track: string
  instructor: string
  enrolled: number
  progressPct: number
  avgStars: number
  totalXP: number
}

interface StudentRosterItem {
  id: string
  name: string
  studentId: string
  accessCode: string
  className: string
  xp: number
  stars: number
  world: string
  status: 'Active' | 'Completed' | 'Pending'
}

const INITIAL_CLASSES: SchoolClass[] = [
  {
    id: 'cls-1',
    name: 'Grade 5 Jungle Explorers',
    track: 'Block Coding & Logic',
    instructor: 'Coach Michael Davies',
    enrolled: 32,
    progressPct: 88,
    avgStars: 4.8,
    totalXP: 14200,
  },
  {
    id: 'cls-2',
    name: 'Grade 6 Web Craftsmen',
    track: 'HTML5 & CSS Styling',
    instructor: 'Coach Sarah Williams',
    enrolled: 28,
    progressPct: 75,
    avgStars: 4.6,
    totalXP: 11800,
  },
  {
    id: 'cls-3',
    name: 'Junior Developers Group A',
    track: 'JavaScript Game Logic',
    instructor: 'Coach Alex Johnson',
    enrolled: 35,
    progressPct: 62,
    avgStars: 4.9,
    totalXP: 18500,
  },
  {
    id: 'cls-4',
    name: 'Python Adventurers',
    track: 'Python Fundamentals',
    instructor: 'Coach David Chen',
    enrolled: 33,
    progressPct: 91,
    avgStars: 5.0,
    totalXP: 22400,
  },
]

const INITIAL_STUDENTS: StudentRosterItem[] = [
  {
    id: 'std-1',
    name: 'Alex Johnson',
    studentId: 'STD-2026-001',
    accessCode: '83920193',
    className: 'Grade 5 Jungle Explorers',
    xp: 1450,
    stars: 18,
    world: 'World 2: Code Jungle',
    status: 'Active',
  },
  {
    id: 'std-2',
    name: 'Sarah Williams',
    studentId: 'STD-2026-002',
    accessCode: '47201948',
    className: 'Grade 6 Web Craftsmen',
    xp: 2820,
    stars: 34,
    world: 'World 3: Web Kingdom',
    status: 'Active',
  },
  {
    id: 'std-3',
    name: 'David Chen',
    studentId: 'STD-2026-003',
    accessCode: '91823746',
    className: 'Python Adventurers',
    xp: 4200,
    stars: 45,
    world: 'World 5: Python Temple',
    status: 'Completed',
  },
  {
    id: 'std-4',
    name: 'Emma Thompson',
    studentId: 'STD-2026-004',
    accessCode: '58291034',
    className: 'Junior Developers Group A',
    xp: 1980,
    stars: 24,
    world: 'World 3: Web Kingdom',
    status: 'Active',
  },
  {
    id: 'std-5',
    name: 'Lucas Martinez',
    studentId: 'STD-2026-005',
    accessCode: '74019283',
    className: 'Grade 5 Jungle Explorers',
    xp: 950,
    stars: 12,
    world: 'World 1: Pipe Beginnings',
    status: 'Pending',
  },
]

export function SchoolPuzzleProPage() {
  const [classes] = useState<SchoolClass[]>(INITIAL_CLASSES)
  const [students] = useState<StudentRosterItem[]>(INITIAL_STUDENTS)
  const [search, setSearch] = useState('')
  const [selectedClassFilter, setSelectedClassFilter] = useState('All')
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [selectedStudentForCode, setSelectedStudentForCode] = useState<StudentRosterItem | null>(null)

  // Filtered Students Roster
  const filteredStudents = students.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(search.toLowerCase()) ||
      std.studentId.toLowerCase().includes(search.toLowerCase()) ||
      std.accessCode.includes(search)
    const matchesClass = selectedClassFilter === 'All' || std.className === selectedClassFilter
    return matchesSearch && matchesClass
  })

  // Totals
  const totalStudents = classes.reduce((sum, c) => sum + c.enrolled, 0)
  const totalXP = classes.reduce((sum, c) => sum + c.totalXP, 0)
  const avgProgress = Math.round(classes.reduce((sum, c) => sum + c.progressPct, 0) / classes.length)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── 1. Page Header ── */}
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="admin-badge admin-badge-accent">
              <Puzzle size={12} /> PUZZLEPRO SCHOOL DASHBOARD
            </span>
          </div>
          <div className="admin-page-title">Future Programs For Kids — Coding Roster</div>
          <div className="admin-page-desc">
            School classroom management, 8-digit student access codes, coding progress analytics, and class XP rosters
          </div>
        </div>

        <div className="admin-page-actions">
          <button
            className="admin-btn admin-btn-ghost"
            onClick={() => {
              const csvContent =
                'data:text/csv;charset=utf-8,Student Name,Student ID,Access Code,Class,XP,Stars,World\n' +
                students.map((s) => `"${s.name}","${s.studentId}","${s.accessCode}","${s.className}",${s.xp},${s.stars},"${s.world}"`).join('\n')
              const encodedUri = encodeURI(csvContent)
              const link = document.createElement('a')
              link.setAttribute('href', encodedUri)
              link.setAttribute('download', 'puzzlepro_student_roster.csv')
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            <Download size={14} /> Export Student Codes
          </button>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => {
              if (students.length > 0) {
                setSelectedStudentForCode(students[0])
                setShowCodeModal(true)
              }
            }}
          >
            <KeyRound size={14} /> View Student Code PINs
          </button>
        </div>
      </div>

      {/* ── 2. Summary KPI Cards ── */}
      <div className="admin-grid-4">
        <div className="admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label">Total Enrolled Students</span>
            <Users size={16} color="var(--adm-text-3)" />
          </div>
          <div className="admin-stat-value">{totalStudents}</div>
          <div className="admin-stat-sub">Across {classes.length} active coding tracks</div>
        </div>

        <div className="admin-stat-card" style={{ borderColor: 'rgba(196, 0, 0, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label" style={{ color: 'var(--adm-accent)', fontWeight: 600 }}>Total XP Accumulated</span>
            <Zap size={16} color="var(--adm-accent)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-accent)' }}>{totalXP.toLocaleString()} XP</div>
          <div className="admin-stat-sub">Gamified coding exercises solved</div>
        </div>

        <div className="admin-stat-card" style={{ borderColor: 'rgba(22, 163, 74, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label" style={{ color: 'var(--adm-success)', fontWeight: 600 }}>Avg Course Progress</span>
            <BarChart2 size={16} color="var(--adm-success)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-success)' }}>{avgProgress}%</div>
          <div className="admin-stat-sub">On-track for semester certification</div>
        </div>

        <div className="admin-stat-card" style={{ borderColor: 'rgba(217, 119, 6, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label" style={{ color: 'var(--adm-warning)', fontWeight: 600 }}>Certificates Awarded</span>
            <Award size={16} color="var(--adm-warning)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-warning)' }}>42</div>
          <div className="admin-stat-sub">Level 1 & 2 coding graduates</div>
        </div>
      </div>

      {/* ── 3. Active Coding Classes Roster ── */}
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
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
            <BookOpen size={16} color="var(--adm-accent)" />
            Active Coding Classes & Tracks
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--adm-text-3)' }}>
            {classes.length} Active Tracks
          </span>
        </div>

        <div className="admin-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Class Roster</th>
                <th>Curriculum Track</th>
                <th>Instructor</th>
                <th>Enrolled</th>
                <th>Curriculum Progress</th>
                <th>Rating</th>
                <th>Class XP</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--adm-text-1)' }}>{cls.name}</div>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-gray" style={{ gap: '4px' }}>
                      <Sparkles size={10} /> {cls.track}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--adm-text-2)' }}>{cls.instructor}</td>
                  <td style={{ fontWeight: 600 }}>{cls.enrolled} Students</td>
                  <td style={{ width: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, height: '6px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${cls.progressPct}%`,
                            backgroundColor: cls.progressPct > 80 ? '#16A34A' : '#DC2626',
                            borderRadius: '9999px',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace' }}>{cls.progressPct}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B', fontSize: 12, fontWeight: 700 }}>
                      <Star size={13} fill="#F59E0B" /> {cls.avgStars.toFixed(1)}
                    </div>
                  </td>
                  <td style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--adm-accent)' }}>
                    {cls.totalXP.toLocaleString()} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. Student Roster & 8-Digit Access Codes ── */}
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
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
            <ShieldCheck size={16} color="var(--adm-accent)" />
            Student 8-Digit Access Codes & Live Progress
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
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
              <option value="All">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="admin-toolbar-search" style={{ height: '32px' }}>
              <Search size={14} color="var(--adm-text-3)" />
              <input
                type="text"
                placeholder="Search student, code, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '180px' }}
              />
            </div>
          </div>
        </div>

        <div className="admin-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>8-Digit Access Code</th>
                <th>Class Roster</th>
                <th>Current Level World</th>
                <th>Total XP</th>
                <th>Stars</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="admin-table-empty">
                    No matching student records found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr key={std.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--adm-text-1)' }}>{std.name}</div>
                      <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--adm-text-3)' }}>
                        {std.studentId}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          backgroundColor: 'rgba(220, 38, 38, 0.08)',
                          border: '1px solid rgba(220, 38, 38, 0.25)',
                          color: '#DC2626',
                          padding: '0.25rem 0.625rem',
                          borderRadius: '0.375rem',
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          fontSize: '0.875rem',
                          letterSpacing: '0.05em',
                        }}
                      >
                        <KeyRound size={12} /> #{std.accessCode}
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--adm-text-2)' }}>{std.className}</td>
                    <td style={{ fontSize: 12, fontWeight: 600, color: 'var(--adm-text-1)' }}>{std.world}</td>
                    <td style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--adm-accent)' }}>
                      {std.xp.toLocaleString()} XP
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B', fontWeight: 700, fontSize: 13 }}>
                        <Star size={13} fill="#F59E0B" /> {std.stars}
                      </div>
                    </td>
                    <td>
                      <span
                        className={
                          std.status === 'Completed'
                            ? 'admin-badge admin-badge-green'
                            : std.status === 'Active'
                            ? 'admin-badge admin-badge-accent'
                            : 'admin-badge admin-badge-yellow'
                        }
                      >
                        {std.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => {
                          setSelectedStudentForCode(std)
                          setShowCodeModal(true)
                        }}
                      >
                        Details <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. Student Access Code Modal ── */}
      {showCodeModal && selectedStudentForCode && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '440px' }}>
            <div className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <KeyRound size={18} color="var(--adm-accent)" />
              Student Access Code Credentials
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--adm-text-2)', marginBottom: '1.25rem' }}>
              Individual student login details for <strong>{selectedStudentForCode.name}</strong>.
            </div>

            <div
              style={{
                backgroundColor: 'var(--adm-bg-surface, #F8FAFC)',
                border: '1px solid var(--adm-border)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                textAlign: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--adm-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                OFFICIAL 8-DIGIT STUDENT CODE
              </div>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  color: 'var(--adm-accent, #DC2626)',
                  letterSpacing: '0.15em',
                  margin: '0.5rem 0',
                }}
              >
                {selectedStudentForCode.accessCode}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--adm-text-2)' }}>
                Roster: <strong>{selectedStudentForCode.className}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--adm-text-2)', marginBottom: '1.25rem' }}>
              <div>Student ID: <strong>{selectedStudentForCode.studentId}</strong></div>
              <div>Current Level: <strong>{selectedStudentForCode.world}</strong></div>
              <div>Total XP: <strong>{selectedStudentForCode.xp} XP</strong></div>
              <div>Stars Collected: <strong>{selectedStudentForCode.stars} Stars</strong></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="admin-btn admin-btn-primary" onClick={() => setShowCodeModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
