// ============================================================================
// Skill Up Academy — Learners Portal (/learners)
// Assignments, Notice Board & Events Calendar with RBAC
// Styled strictly with NETS Admin Dashboard Design Tokens
// ============================================================================
import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  Bell,
  Calendar,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Pin,
  Sparkles,
  Award,
  FileText,
  MapPin,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  Layers,
  GraduationCap,
  X,
  Check,
  Filter
} from 'lucide-react'
import { useAdminStore, isLearnerUser, canManageLearners } from '../store/useAdminStore'
import {
  fetchAssignments,
  createAssignment,
  submitAssignment,
  deleteAssignment,
  fetchNotices,
  createNotice,
  deleteNotice,
  fetchEvents,
  createEvent,
  deleteEvent,
  getLocalSubmission,
  LearnerAssignment,
  LearnerNotice,
  LearnerEvent,
  LearnerSubmission
} from '../services/learnersService'
import '../admin.css'

export function LearnersPage() {
  const { session } = useAdminStore()
  const user = session.user

  const isLearner = isLearnerUser(user)
  const canManage = canManageLearners(user)

  // Active Tab: 'overview' | 'assignments' | 'notices' | 'events'
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'notices' | 'events'>('overview')

  // Data states
  const [assignments, setAssignments] = useState<LearnerAssignment[]>([])
  const [notices, setNotices] = useState<LearnerNotice[]>([])
  const [events, setEvents] = useState<LearnerEvent[]>([])
  const [loading, setLoading] = useState(true)

  // Search & Filter states
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all')
  const [assignmentSearch, setAssignmentSearch] = useState('')
  
  const [noticeFilter, setNoticeFilter] = useState<string>('all')
  const [noticeSearch, setNoticeSearch] = useState('')

  const [eventFilter, setEventFilter] = useState<string>('all')
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(2026, 7, 1)) // August 2026

  // Modal States
  const [selectedAssignment, setSelectedAssignment] = useState<LearnerAssignment | null>(null)
  const [submissionText, setSubmissionText] = useState('')
  const [submissionUrl, setSubmissionUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  const [selectedNotice, setSelectedNotice] = useState<LearnerNotice | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<LearnerEvent | null>(null)

  // Instructor/Admin Create Modals
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false)
  const [showCreateNoticeModal, setShowCreateNoticeModal] = useState(false)
  const [showCreateEventModal, setShowCreateEventModal] = useState(false)

  // New Item Forms
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subject: 'Python Programming',
    due_date: '2026-08-28',
    total_points: 100,
    group: 'Junior Champions (Ages 11-19)'
  })

  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'General' as const,
    urgency: 'Normal' as const,
    is_pinned: false,
    target_group: 'All'
  })

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'Workshop' as const,
    location: 'CBT Centre Lab A',
    event_date: '2026-08-25',
    start_time: '10:00 AM',
    end_time: '12:00 PM',
    target_group: 'All'
  })

  // Load data on mount
  useEffect(() => {
    loadAllData()
  }, [user])

  const loadAllData = async () => {
    setLoading(true)
    const [assList, notList, evtList] = await Promise.all([
      fetchAssignments(),
      fetchNotices(),
      fetchEvents()
    ])

    // Attach local student submissions to assignments if logged in
    const studentId = user?.id || 'kid-guest'
    const enrichedAssignments = assList.map((a) => {
      const localSub = getLocalSubmission(a.id, studentId)
      return { ...a, user_submission: localSub || a.user_submission || null }
    })

    setAssignments(enrichedAssignments)
    setNotices(notList)
    setEvents(evtList)
    setLoading(false)
  }

  // Handle student assignment submission
  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAssignment || !submissionText.trim()) return

    setSubmitting(true)
    const studentId = user?.id || 'kid-0001'
    const studentName = user?.fullName || 'Learner Student'

    await submitAssignment({
      assignment_id: selectedAssignment.id,
      student_id: studentId,
      student_name: studentName,
      submission_text: submissionText + (submissionUrl ? `\n\nProject Link: ${submissionUrl}` : ''),
      status: 'Submitted'
    })

    setSubmitting(false)
    setSubmissionSuccess(true)
    setTimeout(() => {
      setSubmissionSuccess(false)
      setSelectedAssignment(null)
      setSubmissionText('')
      setSubmissionUrl('')
      loadAllData()
    }, 1200)
  }

  // Handle instructor creating assignment
  const handleCreateAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAssignment.title || !newAssignment.description) return
    await createAssignment({
      ...newAssignment,
      status: 'Active',
      instructor: user?.fullName || 'Staff Instructor'
    })
    setShowCreateAssignmentModal(false)
    setNewAssignment({
      title: '',
      description: '',
      subject: 'Python Programming',
      due_date: '2026-08-28',
      total_points: 100,
      group: 'Junior Champions (Ages 11-19)'
    })
    loadAllData()
  }

  // Handle instructor creating notice
  const handleCreateNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNotice.title || !newNotice.content) return
    await createNotice({
      ...newNotice,
      author: user?.fullName || 'Skill Up Team'
    })
    setShowCreateNoticeModal(false)
    setNewNotice({
      title: '',
      content: '',
      category: 'General',
      urgency: 'Normal',
      is_pinned: false,
      target_group: 'All'
    })
    loadAllData()
  }

  // Handle instructor creating event
  const handleCreateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.title || !newEvent.event_date) return
    await createEvent({
      ...newEvent,
      organizer: user?.fullName || 'Skill Up Academy'
    })
    setShowCreateEventModal(false)
    setNewEvent({
      title: '',
      description: '',
      event_type: 'Workshop',
      location: 'CBT Centre Lab A',
      event_date: '2026-08-25',
      start_time: '10:00 AM',
      end_time: '12:00 PM',
      target_group: 'All'
    })
    loadAllData()
  }

  const handleDeleteAssignmentItem = async (id: number) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      await deleteAssignment(id)
      loadAllData()
    }
  }

  const handleDeleteNoticeItem = async (id: number) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      await deleteNotice(id)
      loadAllData()
    }
  }

  const handleDeleteEventItem = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id)
      loadAllData()
    }
  }

  // Filtered lists
  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
                          a.subject.toLowerCase().includes(assignmentSearch.toLowerCase())
    if (!matchesSearch) return false

    if (assignmentFilter === 'pending') return !a.user_submission
    if (assignmentFilter === 'submitted') return a.user_submission && a.user_submission.status === 'Submitted'
    if (assignmentFilter === 'graded') return a.user_submission && a.user_submission.status === 'Graded'
    return true
  })

  const filteredNotices = notices.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(noticeSearch.toLowerCase()) ||
                          n.content.toLowerCase().includes(noticeSearch.toLowerCase())
    if (!matchesSearch) return false

    if (noticeFilter !== 'all') {
      return n.category.toLowerCase() === noticeFilter.toLowerCase()
    }
    return true
  })

  const filteredEvents = events.filter((e) => {
    if (eventFilter !== 'all') {
      return e.event_type.toLowerCase() === eventFilter.toLowerCase()
    }
    return true
  })

  // Calendar Helpers for August 2026 grid
  const year = calendarMonth.getFullYear()
  const month = calendarMonth.getMonth()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

  const getEventsForDay = (dayNum: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
    return events.filter((e) => e.event_date === dateStr)
  }

  // Stats calculation
  const pendingAssignmentsCount = assignments.filter((a) => !a.user_submission).length
  const submittedAssignmentsCount = assignments.filter((a) => a.user_submission).length
  const pinnedNoticesCount = notices.filter((n) => n.is_pinned).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── Page Header ── */}
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <span className={`admin-badge ${isLearner ? 'admin-badge-green' : 'admin-badge-accent'}`}>
              {isLearner ? <GraduationCap size={12} /> : <Sparkles size={12} />}
              {isLearner ? 'Learner Student Portal' : `Staff View: ${user?.role || 'Instructor'}`}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--adm-text-3)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="admin-page-title">
            Learners Portal
          </h1>
          <div className="admin-page-desc">
            Welcome back, {user?.fullName || 'Learner'}. Access weekly assignments, view official announcements, and stay updated with upcoming tech events.
          </div>
        </div>

        {/* Instructor / Admin Action Buttons */}
        {canManage && (
          <div className="admin-page-actions">
            <button
              onClick={() => setShowCreateAssignmentModal(true)}
              className="admin-btn admin-btn-primary"
            >
              <Plus size={14} /> Create Assignment
            </button>
            <button
              onClick={() => setShowCreateNoticeModal(true)}
              className="admin-btn admin-btn-ghost"
            >
              <Plus size={14} /> Post Notice
            </button>
            <button
              onClick={() => setShowCreateEventModal(true)}
              className="admin-btn admin-btn-ghost"
            >
              <Plus size={14} /> Add Event
            </button>
          </div>
        )}
      </div>

      {/* ── Stat Cards Grid ── */}
      <div className="admin-stat-grid" style={{ marginBottom: 0 }}>
        <div className="admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label">Active Assignments</span>
            <BookOpen size={16} color="var(--adm-text-3)" />
          </div>
          <div className="admin-stat-value">{assignments.length}</div>
          <div className="admin-stat-sub">{pendingAssignmentsCount} Pending Submissions</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label">Notice Board</span>
            <Bell size={16} color="var(--adm-text-3)" />
          </div>
          <div className="admin-stat-value">{notices.length}</div>
          <div className="admin-stat-sub">{pinnedNoticesCount} Pinned Announcements</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label">Upcoming Events</span>
            <Calendar size={16} color="var(--adm-text-3)" />
          </div>
          <div className="admin-stat-value">{events.length}</div>
          <div className="admin-stat-sub">Scheduled for August 2026</div>
        </div>

        <div className="admin-stat-card" style={{ borderColor: 'rgba(196, 0, 0, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="admin-stat-label" style={{ color: 'var(--adm-accent)', fontWeight: 600 }}>Learning Score</span>
            <Award size={16} color="var(--adm-accent)" />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--adm-accent)' }}>{submittedAssignmentsCount * 100} pts</div>
          <div className="admin-stat-sub">{submittedAssignmentsCount} Completed Tasks</div>
        </div>
      </div>

      {/* ── Main Tab Navigation ── */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--adm-border)', gap: '0.25rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.625rem 1rem',
            border: 'none',
            background: 'none',
            fontWeight: activeTab === 'overview' ? 600 : 500,
            color: activeTab === 'overview' ? 'var(--adm-accent)' : 'var(--adm-text-2)',
            borderBottom: activeTab === 'overview' ? '2px solid var(--adm-accent)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13.5px',
            whiteSpace: 'nowrap'
          }}
        >
          <Layers size={16} /> Overview
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          style={{
            padding: '0.625rem 1rem',
            border: 'none',
            background: 'none',
            fontWeight: activeTab === 'assignments' ? 600 : 500,
            color: activeTab === 'assignments' ? 'var(--adm-accent)' : 'var(--adm-text-2)',
            borderBottom: activeTab === 'assignments' ? '2px solid var(--adm-accent)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13.5px',
            whiteSpace: 'nowrap'
          }}
        >
          <BookOpen size={16} /> Assignments
          {pendingAssignmentsCount > 0 && (
            <span className="admin-nav-badge" style={{ marginLeft: '4px' }}>
              {pendingAssignmentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          style={{
            padding: '0.625rem 1rem',
            border: 'none',
            background: 'none',
            fontWeight: activeTab === 'notices' ? 600 : 500,
            color: activeTab === 'notices' ? 'var(--adm-accent)' : 'var(--adm-text-2)',
            borderBottom: activeTab === 'notices' ? '2px solid var(--adm-accent)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13.5px',
            whiteSpace: 'nowrap'
          }}
        >
          <Bell size={16} /> Notice Board
        </button>

        <button
          onClick={() => setActiveTab('events')}
          style={{
            padding: '0.625rem 1rem',
            border: 'none',
            background: 'none',
            fontWeight: activeTab === 'events' ? 600 : 500,
            color: activeTab === 'events' ? 'var(--adm-accent)' : 'var(--adm-text-2)',
            borderBottom: activeTab === 'events' ? '2px solid var(--adm-accent)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13.5px',
            whiteSpace: 'nowrap'
          }}
        >
          <Calendar size={16} /> Events Calendar
        </button>
      </div>

      {/* ── TAB 1: OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* Top Notice Highlights */}
          <div className="admin-card">
            <div className="admin-card-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bell size={16} color="var(--adm-accent)" /> Featured Announcements
              </span>
              <button
                onClick={() => setActiveTab('notices')}
                style={{ border: 'none', background: 'none', color: 'var(--adm-accent)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                View All
              </button>
            </div>

            {notices.length === 0 ? (
              <p style={{ color: 'var(--adm-text-3)', fontSize: '13px', margin: 0 }}>No announcements at this time.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {notices.slice(0, 3).map((notice) => (
                  <div
                    key={notice.id}
                    onClick={() => setSelectedNotice(notice)}
                    style={{
                      padding: '0.75rem 0.875rem',
                      borderRadius: 'var(--adm-radius-sm)',
                      background: notice.is_pinned ? 'var(--adm-accent-subtle)' : 'var(--adm-surface-2)',
                      border: notice.is_pinned ? '1px solid rgba(196, 0, 0, 0.2)' : '1px solid var(--adm-border)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className="admin-badge admin-badge-gray">
                        {notice.category}
                      </span>
                      {notice.is_pinned && (
                        <span style={{ fontSize: '11px', color: 'var(--adm-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Pin size={11} /> Pinned
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--adm-text-1)' }}>{notice.title}</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--adm-text-2)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {notice.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Assignments */}
          <div className="admin-card">
            <div className="admin-card-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={16} color="var(--adm-text-1)" /> Active Assignments
              </span>
              <button
                onClick={() => setActiveTab('assignments')}
                style={{ border: 'none', background: 'none', color: 'var(--adm-accent)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                View All
              </button>
            </div>

            {assignments.length === 0 ? (
              <p style={{ color: 'var(--adm-text-3)', fontSize: '13px', margin: 0 }}>No active assignments.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {assignments.slice(0, 3).map((ass) => (
                  <div
                    key={ass.id}
                    onClick={() => setSelectedAssignment(ass)}
                    style={{
                      padding: '0.75rem 0.875rem',
                      borderRadius: 'var(--adm-radius-sm)',
                      background: 'var(--adm-surface-2)',
                      border: '1px solid var(--adm-border)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="admin-badge admin-badge-gray">
                        {ass.subject}
                      </span>
                      <span style={{ fontSize: '11.5px', color: 'var(--adm-text-3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} /> Due: {ass.due_date}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--adm-text-1)' }}>{ass.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--adm-text-3)' }}>Instructor: {ass.instructor}</span>
                      {ass.user_submission ? (
                        <span className="admin-badge admin-badge-green">
                          <CheckCircle2 size={11} /> Submitted
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge-yellow">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="admin-card">
            <div className="admin-card-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} color="var(--adm-text-1)" /> Next Events
              </span>
              <button
                onClick={() => setActiveTab('events')}
                style={{ border: 'none', background: 'none', color: 'var(--adm-accent)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Open Calendar
              </button>
            </div>

            {events.length === 0 ? (
              <p style={{ color: 'var(--adm-text-3)', fontSize: '13px', margin: 0 }}>No upcoming events scheduled.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {events.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    style={{
                      padding: '0.75rem 0.875rem',
                      borderRadius: 'var(--adm-radius-sm)',
                      background: 'var(--adm-surface-2)',
                      border: '1px solid var(--adm-border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      style={{
                        background: 'var(--adm-surface-3)',
                        color: 'var(--adm-text-1)',
                        borderRadius: 'var(--adm-radius-sm)',
                        padding: '0.375rem 0.625rem',
                        textAlign: 'center',
                        minWidth: '45px',
                        flexShrink: 0
                      }}
                    >
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--adm-text-3)' }}>
                        {new Date(evt.event_date).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--adm-text-1)' }}>
                        {new Date(evt.event_date).getDate() || evt.event_date.split('-')[2]}
                      </div>
                    </div>
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--adm-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {evt.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--adm-text-3)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span><Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />{evt.start_time}</span>
                        <span><MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} />{evt.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: ASSIGNMENTS ── */}
      {activeTab === 'assignments' && (
        <div>
          {/* Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-toolbar-search" style={{ width: '260px' }}>
              <Search size={14} color="var(--adm-text-3)" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={assignmentSearch}
                onChange={(e) => setAssignmentSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {(['all', 'pending', 'submitted', 'graded'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAssignmentFilter(filter)}
                  className={`admin-btn ${assignmentFilter === filter ? 'admin-btn-primary' : 'admin-btn-ghost'} admin-btn-sm`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {filter}
                </button>
              ))}
            </div>

            {canManage && (
              <div style={{ marginLeft: 'auto' }}>
                <button
                  onClick={() => setShowCreateAssignmentModal(true)}
                  className="admin-btn admin-btn-primary admin-btn-sm"
                >
                  <Plus size={14} /> New Assignment
                </button>
              </div>
            )}
          </div>

          {/* Assignments Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filteredAssignments.map((ass) => (
              <div
                key={ass.id}
                className="admin-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="admin-badge admin-badge-gray">
                      {ass.subject}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {ass.user_submission ? (
                        <span className="admin-badge admin-badge-green">
                          <CheckCircle2 size={11} /> {ass.user_submission.status}
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge-yellow">
                          Pending
                        </span>
                      )}

                      {canManage && (
                        <button
                          onClick={() => handleDeleteAssignmentItem(ass.id)}
                          className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon"
                          style={{ color: 'var(--adm-danger)', borderColor: 'transparent' }}
                          title="Delete assignment"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--adm-text-1)', margin: '0 0 0.5rem 0' }}>
                    {ass.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: 'var(--adm-text-2)', lineHeight: 1.5, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ass.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--adm-text-3)', marginBottom: '0.75rem' }}>
                    <span><Clock size={11} style={{ display: 'inline', marginRight: '4px' }} /> Due: {ass.due_date}</span>
                    <span>Points: {ass.total_points}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAssignment(ass)
                      setSubmissionText(ass.user_submission?.submission_text || '')
                    }}
                    className={`admin-btn ${ass.user_submission ? 'admin-btn-ghost' : 'admin-btn-primary'}`}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {ass.user_submission ? 'View Submission' : 'Open & Submit Task'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: NOTICE BOARD ── */}
      {activeTab === 'notices' && (
        <div>
          {/* Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-toolbar-search" style={{ width: '260px' }}>
              <Search size={14} color="var(--adm-text-3)" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={noticeSearch}
                onChange={(e) => setNoticeSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              {['all', 'General', 'Academic', 'Urgent', 'Event', 'Exam'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNoticeFilter(cat)}
                  className={`admin-btn ${noticeFilter === cat ? 'admin-btn-primary' : 'admin-btn-ghost'} admin-btn-sm`}
                >
                  {cat === 'all' ? 'All Notices' : cat}
                </button>
              ))}
            </div>

            {canManage && (
              <div style={{ marginLeft: 'auto' }}>
                <button
                  onClick={() => setShowCreateNoticeModal(true)}
                  className="admin-btn admin-btn-primary admin-btn-sm"
                >
                  <Plus size={14} /> Post Notice
                </button>
              </div>
            )}
          </div>

          {/* Notice List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="admin-card"
                onClick={() => setSelectedNotice(notice)}
                style={{
                  borderLeft: notice.is_pinned ? '4px solid var(--adm-accent)' : '1px solid var(--adm-border)',
                  background: notice.is_pinned ? 'var(--adm-accent-subtle)' : 'var(--adm-surface)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="admin-badge admin-badge-gray">
                      {notice.category}
                    </span>

                    {notice.urgency === 'High' || notice.urgency === 'Urgent' ? (
                      <span className="admin-badge admin-badge-red">
                        <AlertTriangle size={11} /> {notice.urgency}
                      </span>
                    ) : null}

                    {notice.is_pinned && (
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--adm-accent)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Pin size={11} /> Pinned Announcement
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', fontSize: '12px', color: 'var(--adm-text-3)' }}>
                    <span>By: <strong>{notice.author}</strong></span>
                    <span>{new Date(notice.created_at).toLocaleDateString()}</span>
                    {canManage && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteNoticeItem(notice.id)
                        }}
                        className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon"
                        style={{ color: 'var(--adm-danger)', borderColor: 'transparent' }}
                        title="Delete notice"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--adm-text-1)', margin: '0.25rem 0 0.375rem 0' }}>
                  {notice.title}
                </h3>

                <p style={{ fontSize: '13.5px', color: 'var(--adm-text-2)', lineHeight: 1.5, margin: 0 }}>
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: EVENTS CALENDAR ── */}
      {activeTab === 'events' && (
        <div>
          {/* Calendar Header Navigator */}
          <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: 'var(--adm-text-1)' }}>
                  {monthName}
                </h2>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
                    className="admin-btn admin-btn-ghost admin-btn-icon"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
                    className="admin-btn admin-btn-ghost admin-btn-icon"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {canManage && (
                <button
                  onClick={() => setShowCreateEventModal(true)}
                  className="admin-btn admin-btn-primary admin-btn-sm"
                >
                  <Plus size={14} /> Add Event
                </button>
              )}
            </div>

            {/* 7-Column Calendar Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '6px',
                marginTop: '1rem',
                textAlign: 'center'
              }}
            >
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} style={{ fontSize: '11px', fontWeight: 600, color: 'var(--adm-text-3)', textTransform: 'uppercase', padding: '4px 0' }}>
                  {d}
                </div>
              ))}

              {/* Empty leading padding days */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} style={{ background: 'var(--adm-surface-2)', borderRadius: 'var(--adm-radius-sm)', minHeight: '75px', opacity: 0.5 }} />
              ))}

              {/* Days of Month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1
                const dayEvents = getEventsForDay(dayNum)
                const isToday = dayNum === 13 && month === 7 && year === 2026

                return (
                  <div
                    key={dayNum}
                    style={{
                      background: isToday ? 'var(--adm-accent-subtle)' : 'var(--adm-surface-2)',
                      border: isToday ? '1.5px solid var(--adm-accent)' : '1px solid var(--adm-border)',
                      borderRadius: 'var(--adm-radius-sm)',
                      minHeight: '80px',
                      padding: '6px',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--adm-accent)' : 'var(--adm-text-2)', marginBottom: '4px' }}>
                      {dayNum} {isToday && <span style={{ fontSize: '9px', background: 'var(--adm-accent)', color: '#fff', padding: '1px 4px', borderRadius: '3px', marginLeft: '2px' }}>Today</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {dayEvents.map((evt) => (
                        <div
                          key={evt.id}
                          onClick={() => setSelectedEvent(evt)}
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 600,
                            padding: '2px 5px',
                            borderRadius: '3px',
                            background: evt.event_type === 'Workshop' ? 'rgba(37, 99, 235, 0.1)' : evt.event_type === 'Deadline' ? 'var(--adm-danger-subtle)' : 'var(--adm-surface-3)',
                            color: evt.event_type === 'Workshop' ? '#2563eb' : evt.event_type === 'Deadline' ? 'var(--adm-danger)' : 'var(--adm-text-1)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                          }}
                          title={`${evt.title} (${evt.start_time})`}
                        >
                          {evt.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Agenda List View */}
          <div className="admin-card">
            <div className="admin-card-title">
              Scheduled Events & Deadlines List
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  style={{
                    padding: '0.875rem',
                    borderRadius: 'var(--adm-radius-sm)',
                    border: '1px solid var(--adm-border)',
                    background: 'var(--adm-surface-2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div
                      style={{
                        background: 'var(--adm-surface-3)',
                        color: 'var(--adm-text-1)',
                        borderRadius: 'var(--adm-radius-sm)',
                        padding: '6px 10px',
                        textAlign: 'center',
                        minWidth: '50px'
                      }}
                    >
                      <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--adm-text-3)' }}>
                        {new Date(evt.event_date).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                        {evt.event_date.split('-')[2]}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--adm-text-3)', textTransform: 'uppercase' }}>
                        {evt.event_type} • {evt.target_group}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--adm-text-1)' }}>
                        {evt.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--adm-text-3)', marginTop: '2px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <span><Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />{evt.start_time} - {evt.end_time}</span>
                        <span><MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} />{evt.location}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedEvent(evt)
                      }}
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                    >
                      Details
                    </button>
                    {canManage && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteEventItem(evt.id)
                        }}
                        className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon"
                        style={{ color: 'var(--adm-danger)', borderColor: 'transparent' }}
                        title="Delete event"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 1: VIEW & SUBMIT ASSIGNMENT ── */}
      {selectedAssignment && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedAssignment(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">{selectedAssignment.title}</span>
              <button onClick={() => setSelectedAssignment(null)} className="admin-btn admin-btn-ghost admin-btn-icon" style={{ border: 'none' }}>
                <X size={16} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="admin-badge admin-badge-gray">{selectedAssignment.subject}</span>
                <span style={{ fontSize: '12px', color: 'var(--adm-text-3)' }}>Due: {selectedAssignment.due_date} • Points: {selectedAssignment.total_points}</span>
              </div>

              <div style={{ background: 'var(--adm-surface-2)', padding: '0.875rem', borderRadius: 'var(--adm-radius-sm)', border: '1px solid var(--adm-border)', fontSize: '13px', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--adm-text-1)' }}>Instructions:</strong>
                <p style={{ margin: '0.375rem 0 0 0', color: 'var(--adm-text-2)' }}>{selectedAssignment.description}</p>
              </div>

              {selectedAssignment.user_submission ? (
                <div style={{ background: 'var(--adm-success-subtle)', padding: '0.875rem', borderRadius: 'var(--adm-radius-sm)', border: '1px solid rgba(22,163,74,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--adm-success)', fontWeight: 600, fontSize: '13px', marginBottom: '0.375rem' }}>
                    <CheckCircle2 size={16} /> Submission Received ({selectedAssignment.user_submission.status})
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--adm-text-1)', whiteSpace: 'pre-wrap', background: 'var(--adm-surface)', padding: '0.625rem', borderRadius: '4px', border: '1px solid var(--adm-border)' }}>
                    {selectedAssignment.user_submission.submission_text}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--adm-text-3)', marginTop: '6px' }}>
                    Submitted on: {new Date(selectedAssignment.user_submission.submitted_at).toLocaleString()}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitAssignment} className="admin-form-group">
                  <label className="admin-label admin-label-req">Your Submission</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Type your solution code, answer, or notes here..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    className="admin-textarea"
                    style={{ fontFamily: 'monospace', fontSize: '13px' }}
                  />

                  <label className="admin-label">Optional Project Link</label>
                  <input
                    type="url"
                    placeholder="https://github.com/your-username/project"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    className="admin-input"
                  />

                  <div className="admin-modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none' }}>
                    <button type="button" onClick={() => setSelectedAssignment(null)} className="admin-btn admin-btn-ghost">Cancel</button>
                    <button
                      type="submit"
                      disabled={submitting || submissionSuccess}
                      className="admin-btn admin-btn-primary"
                    >
                      <Send size={14} /> {submitting ? 'Submitting...' : submissionSuccess ? 'Submitted! ✓' : 'Submit Assignment'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: VIEW NOTICE ── */}
      {selectedNotice && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedNotice(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="admin-modal-header">
              <span className="admin-badge admin-badge-gray">{selectedNotice.category}</span>
              <button onClick={() => setSelectedNotice(null)} className="admin-btn admin-btn-ghost admin-btn-icon" style={{ border: 'none' }}>
                <X size={16} />
              </button>
            </div>

            <div className="admin-modal-body">
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: 'var(--adm-text-1)' }}>
                {selectedNotice.title}
              </h2>

              <div style={{ fontSize: '12px', color: 'var(--adm-text-3)', display: 'flex', gap: '1rem' }}>
                <span>Author: <strong>{selectedNotice.author}</strong></span>
                <span>Date: <strong>{new Date(selectedNotice.created_at).toLocaleDateString()}</strong></span>
              </div>

              <div style={{ fontSize: '13.5px', color: 'var(--adm-text-2)', lineHeight: 1.6, whiteSpace: 'pre-line', background: 'var(--adm-surface-2)', padding: '1rem', borderRadius: 'var(--adm-radius-sm)', border: '1px solid var(--adm-border)' }}>
                {selectedNotice.content}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: VIEW EVENT DETAILS ── */}
      {selectedEvent && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="admin-modal-header">
              <span className="admin-badge admin-badge-gray">{selectedEvent.event_type}</span>
              <button onClick={() => setSelectedEvent(null)} className="admin-btn admin-btn-ghost admin-btn-icon" style={{ border: 'none' }}>
                <X size={16} />
              </button>
            </div>

            <div className="admin-modal-body">
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: 'var(--adm-text-1)' }}>
                {selectedEvent.title}
              </h2>

              <div style={{ background: 'var(--adm-surface-2)', padding: '0.875rem', borderRadius: 'var(--adm-radius-sm)', border: '1px solid var(--adm-border)', display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '13px' }}>
                <div>Date: <strong>{selectedEvent.event_date}</strong></div>
                <div>Time: <strong>{selectedEvent.start_time} - {selectedEvent.end_time}</strong></div>
                <div>Location: <strong>{selectedEvent.location}</strong></div>
                <div>Organizer: <strong>{selectedEvent.organizer}</strong></div>
              </div>

              <p style={{ fontSize: '13.5px', color: 'var(--adm-text-2)', lineHeight: 1.5, margin: 0 }}>
                {selectedEvent.description}
              </p>

              <div className="admin-modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none' }}>
                <button
                  onClick={() => alert(`Event "${selectedEvent.title}" added to your calendar!`)}
                  className="admin-btn admin-btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Calendar size={14} /> Add to My Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: INSTRUCTOR/ADMIN CREATE ASSIGNMENT ── */}
      {showCreateAssignmentModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowCreateAssignmentModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">Create New Assignment</span>
              <button onClick={() => setShowCreateAssignmentModal(false)} className="admin-btn admin-btn-ghost admin-btn-icon" style={{ border: 'none' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAssignmentSubmit} className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Assignment Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Python Calculator Project"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Subject</label>
                  <select
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    className="admin-select"
                  >
                    <option value="Python Programming">Python Programming</option>
                    <option value="Scratch & Logic">Scratch & Logic</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Robotics & Hardware">Robotics & Hardware</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label admin-label-req">Due Date</label>
                  <input
                    required
                    type="date"
                    value={newAssignment.due_date}
                    onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Instructions</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed instructions for learners..."
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="admin-textarea"
                />
              </div>

              <div className="admin-modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none' }}>
                <button type="button" onClick={() => setShowCreateAssignmentModal(false)} className="admin-btn admin-btn-ghost">Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Publish Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 5: INSTRUCTOR/ADMIN POST NOTICE ── */}
      {showCreateNoticeModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowCreateNoticeModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">Post Announcement</span>
              <button onClick={() => setShowCreateNoticeModal(false)} className="admin-btn admin-btn-ghost admin-btn-icon" style={{ border: 'none' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateNoticeSubmit} className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Announcement Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Hackathon Registration Open"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as any })}
                    className="admin-select"
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Event">Event</option>
                    <option value="Exam">Exam</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Urgency</label>
                  <select
                    value={newNotice.urgency}
                    onChange={(e) => setNewNotice({ ...newNotice, urgency: e.target.value as any })}
                    className="admin-select"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write notice details..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="admin-textarea"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={newNotice.is_pinned}
                  onChange={(e) => setNewNotice({ ...newNotice, is_pinned: e.target.checked })}
                />
                <label htmlFor="pinCheck" style={{ fontSize: '13px', color: 'var(--adm-text-2)', cursor: 'pointer' }}>Pin this notice to top of board</label>
              </div>

              <div className="admin-modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none' }}>
                <button type="button" onClick={() => setShowCreateNoticeModal(false)} className="admin-btn admin-btn-ghost">Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Post Announcement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 6: INSTRUCTOR/ADMIN ADD EVENT ── */}
      {showCreateEventModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowCreateEventModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">Add Calendar Event</span>
              <button onClick={() => setShowCreateEventModal(false)} className="admin-btn admin-btn-ghost admin-btn-icon" style={{ border: 'none' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label admin-label-req">Event Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. AI Robotics Workshop"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Event Type</label>
                  <select
                    value={newEvent.event_type}
                    onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value as any })}
                    className="admin-select"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Deadline">Deadline</option>
                    <option value="Competition">Competition</option>
                    <option value="Exam">Exam</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label admin-label-req">Date</label>
                  <input
                    required
                    type="date"
                    value={newEvent.event_date}
                    onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Start Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={newEvent.start_time}
                    onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">End Time</label>
                  <input
                    type="text"
                    placeholder="12:00 PM"
                    value={newEvent.end_time}
                    onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Location</label>
                <input
                  type="text"
                  placeholder="CBT Centre Lab A / Online Stream"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description</label>
                <textarea
                  rows={3}
                  placeholder="Event details..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="admin-textarea"
                />
              </div>

              <div className="admin-modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none' }}>
                <button type="button" onClick={() => setShowCreateEventModal(false)} className="admin-btn admin-btn-ghost">Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Add Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
