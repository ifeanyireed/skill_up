// ============================================================================
// Skill Up Academy — Learners Portal (/learners)
// Assignments, Notice Board & Events Calendar with RBAC
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
  UserCheck,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  Layers,
  GraduationCap
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
    <div className="admin-page-container" style={{ paddingBottom: '3rem' }}>
      {/* ── Top Hero Welcome Banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311b92 100%)',
          borderRadius: '16px',
          padding: '2rem 2.25rem',
          color: '#fff',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Glow Accent Circle */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(196, 0, 0, 0.35) 0%, rgba(99, 102, 241, 0) 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  background: isLearner ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: isLearner ? '#4ade80' : '#f87171',
                  border: `1px solid ${isLearner ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isLearner ? <GraduationCap size={14} /> : <Sparkles size={14} />}
                {isLearner ? 'Learner Student Portal' : `Staff View: ${user?.role || 'Instructor'}`}
              </span>
              <span style={{ fontSize: '13px', opacity: 0.8 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.25rem 0', letterSpacing: '-0.02em', color: '#fff' }}>
              Welcome back, {user?.fullName || 'Learner'}! 👋
            </h1>
            <p style={{ opacity: 0.85, fontSize: '0.95rem', margin: 0, maxWidth: '600px' }}>
              Access your weekly assignments, view official announcements, and stay updated with upcoming tech events and workshops.
            </p>
          </div>

          {/* Quick Action Button for Instructors / Admins */}
          {canManage && (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowCreateAssignmentModal(true)}
                className="admin-btn admin-btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.1rem', fontSize: '13px' }}
              >
                <Plus size={16} /> Create Assignment
              </button>
              <button
                onClick={() => setShowCreateNoticeModal(true)}
                className="admin-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.6rem 1.1rem', fontSize: '13px' }}
              >
                <Plus size={16} /> Post Notice
              </button>
              <button
                onClick={() => setShowCreateEventModal(true)}
                className="admin-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.6rem 1.1rem', fontSize: '13px' }}
              >
                <Plus size={16} /> Add Event
              </button>
            </div>
          )}
        </div>

        {/* ── Summary Stats Row ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginTop: '1.75rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <div style={{ background: 'rgba(255, 255, 255, 0.07)', borderRadius: '10px', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.3)', color: '#a5b4fc', padding: '10px', borderRadius: '8px' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{assignments.length}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Total Assignments ({pendingAssignmentsCount} Pending)</div>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.07)', borderRadius: '10px', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.3)', color: '#fde047', padding: '10px', borderRadius: '8px' }}>
              <Bell size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{notices.length}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Notices ({pinnedNoticesCount} Pinned)</div>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.07)', borderRadius: '10px', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.3)', color: '#f472b6', padding: '10px', borderRadius: '8px' }}>
              <Calendar size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{events.length}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Upcoming Events</div>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.07)', borderRadius: '10px', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.3)', color: '#86efac', padding: '10px', borderRadius: '8px' }}>
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{submittedAssignmentsCount * 100} pts</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Learning Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Tab Navigation Bar ── */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--adm-border, #e2e8f0)', marginBottom: '1.5rem', gap: '0.5rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            fontWeight: activeTab === 'overview' ? 700 : 500,
            color: activeTab === 'overview' ? 'var(--adm-accent, #C40000)' : 'var(--adm-text-muted, #64748b)',
            borderBottom: activeTab === 'overview' ? '3px solid var(--adm-accent, #C40000)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}
        >
          <Layers size={18} /> Overview
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            fontWeight: activeTab === 'assignments' ? 700 : 500,
            color: activeTab === 'assignments' ? 'var(--adm-accent, #C40000)' : 'var(--adm-text-muted, #64748b)',
            borderBottom: activeTab === 'assignments' ? '3px solid var(--adm-accent, #C40000)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}
        >
          <BookOpen size={18} /> Assignments
          {pendingAssignmentsCount > 0 && (
            <span style={{ background: 'var(--adm-accent, #C40000)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 7px', borderRadius: '10px' }}>
              {pendingAssignmentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            fontWeight: activeTab === 'notices' ? 700 : 500,
            color: activeTab === 'notices' ? 'var(--adm-accent, #C40000)' : 'var(--adm-text-muted, #64748b)',
            borderBottom: activeTab === 'notices' ? '3px solid var(--adm-accent, #C40000)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}
        >
          <Bell size={18} /> Notice Board
        </button>

        <button
          onClick={() => setActiveTab('events')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            fontWeight: activeTab === 'events' ? 700 : 500,
            color: activeTab === 'events' ? 'var(--adm-accent, #C40000)' : 'var(--adm-text-muted, #64748b)',
            borderBottom: activeTab === 'events' ? '3px solid var(--adm-accent, #C40000)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}
        >
          <Calendar size={18} /> Events Calendar
        </button>
      </div>

      {/* ── TAB 1: OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Top Notice Highlights */}
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Bell size={18} color="var(--adm-accent, #C40000)" /> Featured Announcements
              </h3>
              <button
                onClick={() => setActiveTab('notices')}
                style={{ border: 'none', background: 'none', color: 'var(--adm-accent, #C40000)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                View All
              </button>
            </div>

            {notices.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '14px' }}>No notices at this time.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {notices.slice(0, 3).map((notice) => (
                  <div
                    key={notice.id}
                    onClick={() => setSelectedNotice(notice)}
                    style={{
                      padding: '0.875rem 1rem',
                      borderRadius: '10px',
                      background: notice.is_pinned ? 'rgba(196, 0, 0, 0.04)' : '#f8fafc',
                      border: notice.is_pinned ? '1px solid rgba(196, 0, 0, 0.2)' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'transform 0.15s, boxShadow 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#e0e7ff', color: '#3730a3' }}>
                        {notice.category}
                      </span>
                      {notice.is_pinned && <span style={{ fontSize: '11px', color: '#c40000', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}><Pin size={12} /> Pinned</span>}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>{notice.title}</div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {notice.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Assignments */}
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <BookOpen size={18} color="#2563eb" /> Active Assignments
              </h3>
              <button
                onClick={() => setActiveTab('assignments')}
                style={{ border: 'none', background: 'none', color: '#2563eb', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                View All
              </button>
            </div>

            {assignments.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '14px' }}>No active assignments.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {assignments.slice(0, 3).map((ass) => (
                  <div
                    key={ass.id}
                    onClick={() => setSelectedAssignment(ass)}
                    style={{
                      padding: '0.875rem 1rem',
                      borderRadius: '10px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', background: '#dbeafe', padding: '2px 8px', borderRadius: '4px' }}>
                        {ass.subject}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> Due: {ass.due_date}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>{ass.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Instructor: {ass.instructor}</span>
                      {ass.user_submission ? (
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle2 size={12} /> Submitted
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '2px 8px', borderRadius: '12px' }}>
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events Teaser */}
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Calendar size={18} color="#db2777" /> Next Events
              </h3>
              <button
                onClick={() => setActiveTab('events')}
                style={{ border: 'none', background: 'none', color: '#db2777', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Open Calendar
              </button>
            </div>

            {events.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '14px' }}>No upcoming events scheduled.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {events.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    style={{
                      padding: '0.875rem 1rem',
                      borderRadius: '10px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      style={{
                        background: '#fce7f3',
                        color: '#be185d',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        textAlign: 'center',
                        minWidth: '50px',
                        flexShrink: 0
                      }}
                    >
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                        {new Date(evt.event_date).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                        {new Date(evt.event_date).getDate() || evt.event_date.split('-')[2]}
                      </div>
                    </div>
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {evt.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span><Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />{evt.start_time}</span>
                        <span><MapPin size={12} style={{ display: 'inline', marginRight: '3px' }} />{evt.location}</span>
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
          {/* Filter & Search Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(['all', 'pending', 'submitted', 'graded'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAssignmentFilter(filter)}
                  style={{
                    padding: '0.45rem 0.875rem',
                    borderRadius: '20px',
                    border: assignmentFilter === filter ? '1px solid var(--adm-accent, #C40000)' : '1px solid #cbd5e1',
                    background: assignmentFilter === filter ? 'var(--adm-accent, #C40000)' : '#fff',
                    color: assignmentFilter === filter ? '#fff' : '#475569',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={assignmentSearch}
                  onChange={(e) => setAssignmentSearch(e.target.value)}
                  className="admin-input"
                  style={{ paddingLeft: '32px', width: '220px', fontSize: '13px' }}
                />
              </div>

              {canManage && (
                <button
                  onClick={() => setShowCreateAssignmentModal(true)}
                  className="admin-btn admin-btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                >
                  <Plus size={16} /> New Assignment
                </button>
              )}
            </div>
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
                  justifyContent: 'space-between',
                  position: 'relative',
                  border: ass.user_submission ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                  background: ass.user_submission ? '#f0fdf4' : '#fff'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: '#dbeafe', color: '#1e40af' }}>
                      {ass.subject}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {ass.user_submission ? (
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle2 size={12} /> {ass.user_submission.status}
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '2px 8px', borderRadius: '12px' }}>
                          Pending
                        </span>
                      )}

                      {canManage && (
                        <button
                          onClick={() => handleDeleteAssignmentItem(ass.id)}
                          style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                          title="Delete assignment"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                    {ass.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ass.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '0.75rem' }}>
                    <span><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} /> Due: {ass.due_date}</span>
                    <span>Points: {ass.total_points}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAssignment(ass)
                      setSubmissionText(ass.user_submission?.submission_text || '')
                    }}
                    className="admin-btn"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      background: ass.user_submission ? '#16a34a' : 'var(--adm-accent, #C40000)',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  >
                    {ass.user_submission ? 'View Submission & Grade' : 'Open & Submit Task'}
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
          {/* Notice Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['all', 'General', 'Academic', 'Urgent', 'Event', 'Exam'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNoticeFilter(cat)}
                  style={{
                    padding: '0.45rem 0.875rem',
                    borderRadius: '20px',
                    border: noticeFilter === cat ? '1px solid var(--adm-accent, #C40000)' : '1px solid #cbd5e1',
                    background: noticeFilter === cat ? 'var(--adm-accent, #C40000)' : '#fff',
                    color: noticeFilter === cat ? '#fff' : '#475569',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {cat === 'all' ? 'All Notices' : cat}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={noticeSearch}
                  onChange={(e) => setNoticeSearch(e.target.value)}
                  className="admin-input"
                  style={{ paddingLeft: '32px', width: '220px', fontSize: '13px' }}
                />
              </div>

              {canManage && (
                <button
                  onClick={() => setShowCreateNoticeModal(true)}
                  className="admin-btn admin-btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                >
                  <Plus size={16} /> Post Notice
                </button>
              )}
            </div>
          </div>

          {/* Notice List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="admin-card"
                onClick={() => setSelectedNotice(notice)}
                style={{
                  borderLeft: notice.is_pinned ? '4px solid var(--adm-accent, #C40000)' : '1px solid #e2e8f0',
                  background: notice.is_pinned ? 'rgba(196, 0, 0, 0.02)' : '#fff',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '12px', background: '#e0e7ff', color: '#3730a3' }}>
                      {notice.category}
                    </span>

                    {notice.urgency === 'High' || notice.urgency === 'Urgent' ? (
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '12px', background: '#fee2e2', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <AlertTriangle size={12} /> {notice.urgency}
                      </span>
                    ) : null}

                    {notice.is_pinned && (
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--adm-accent, #C40000)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Pin size={12} /> Pinned Announcement
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '12px', color: '#64748b' }}>
                    <span>By: <strong>{notice.author}</strong></span>
                    <span>{new Date(notice.created_at).toLocaleDateString()}</span>
                    {canManage && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteNoticeItem(notice.id)
                        }}
                        style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                        title="Delete notice"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.5rem 0' }}>
                  {notice.title}
                </h3>

                <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
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
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  📅 {monthName}
                </h2>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
                    className="admin-btn admin-btn-ghost"
                    style={{ padding: '6px' }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
                    className="admin-btn admin-btn-ghost"
                    style={{ padding: '6px' }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {canManage && (
                <button
                  onClick={() => setShowCreateEventModal(true)}
                  className="admin-btn admin-btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                >
                  <Plus size={16} /> Add Event
                </button>
              )}
            </div>

            {/* 7-Column Calendar Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '8px',
                marginTop: '1.25rem',
                textAlign: 'center'
              }}
            >
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', padding: '6px 0' }}>
                  {d}
                </div>
              ))}

              {/* Empty leading padding days */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} style={{ background: '#f8fafc', borderRadius: '8px', minHeight: '80px', opacity: 0.4 }} />
              ))}

              {/* Days of Month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1
                const dayEvents = getEventsForDay(dayNum)
                const isToday = dayNum === 13 && month === 7 && year === 2026 // Today is Aug 13, 2026

                return (
                  <div
                    key={dayNum}
                    style={{
                      background: isToday ? '#eff6ff' : '#fff',
                      border: isToday ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      minHeight: '85px',
                      padding: '6px',
                      textAlign: 'left',
                      position: 'relative'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: isToday ? 800 : 600, color: isToday ? '#2563eb' : '#475569', marginBottom: '4px' }}>
                      {dayNum} {isToday && <span style={{ fontSize: '10px', background: '#2563eb', color: '#fff', padding: '1px 4px', borderRadius: '4px' }}>Today</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {dayEvents.map((evt) => (
                        <div
                          key={evt.id}
                          onClick={() => setSelectedEvent(evt)}
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: evt.event_type === 'Workshop' ? '#dbeafe' : evt.event_type === 'Deadline' ? '#fee2e2' : '#fce7f3',
                            color: evt.event_type === 'Workshop' ? '#1e40af' : evt.event_type === 'Deadline' ? '#991b1b' : '#be185d',
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
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#0f172a' }}>
              📋 Scheduled Events & Deadlines List
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        background: evt.event_type === 'Workshop' ? '#dbeafe' : evt.event_type === 'Deadline' ? '#fee2e2' : '#fce7f3',
                        color: evt.event_type === 'Workshop' ? '#1e40af' : evt.event_type === 'Deadline' ? '#991b1b' : '#be185d',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        textAlign: 'center',
                        minWidth: '55px'
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                        {new Date(evt.event_date).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                        {evt.event_date.split('-')[2]}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        {evt.event_type} • {evt.target_group}
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        {evt.title}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span><Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />{evt.start_time} - {evt.end_time}</span>
                        <span><MapPin size={12} style={{ display: 'inline', marginRight: '3px' }} />{evt.location}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedEvent(evt)
                      }}
                      className="admin-btn"
                      style={{ fontSize: '12.5px', padding: '0.4rem 0.875rem' }}
                    >
                      Details
                    </button>
                    {canManage && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteEventItem(evt.id)
                        }}
                        style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                        title="Delete event"
                      >
                        <Trash2 size={16} />
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
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', background: '#dbeafe', color: '#1e40af' }}>
                {selectedAssignment.subject}
              </span>
              <button onClick={() => setSelectedAssignment(null)} className="admin-btn admin-btn-ghost" style={{ padding: '4px' }}>✕</button>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#0f172a' }}>
              {selectedAssignment.title}
            </h2>

            <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
              <span>Due: <strong>{selectedAssignment.due_date}</strong></span>
              <span>Points: <strong>{selectedAssignment.total_points}</strong></span>
              <span>Instructor: <strong>{selectedAssignment.instructor}</strong></span>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              <strong>Instructions:</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#334155' }}>{selectedAssignment.description}</p>
            </div>

            {/* Submission Status or Form */}
            {selectedAssignment.user_submission ? (
              <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={18} /> Submission Received ({selectedAssignment.user_submission.status})
                </div>
                <div style={{ fontSize: '13px', color: '#374151', whiteSpace: 'pre-wrap', background: '#fff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                  {selectedAssignment.user_submission.submission_text}
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
                  Submitted on: {new Date(selectedAssignment.user_submission.submitted_at).toLocaleString()}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitAssignment}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Your Submission:</h4>
                
                <textarea
                  required
                  rows={4}
                  placeholder="Type your solution code, answer, or notes here..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="admin-input"
                  style={{ width: '100%', fontSize: '13.5px', marginBottom: '0.75rem', fontFamily: 'monospace' }}
                />

                <input
                  type="url"
                  placeholder="Optional GitHub or Project URL (https://...)"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  className="admin-input"
                  style={{ width: '100%', fontSize: '13px', marginBottom: '1.25rem' }}
                />

                <button
                  type="submit"
                  disabled={submitting || submissionSuccess}
                  className="admin-btn admin-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Send size={16} /> {submitting ? 'Submitting Work...' : submissionSuccess ? 'Submitted Successfully! ✓' : 'Submit Assignment'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL 2: VIEW NOTICE ── */}
      {selectedNotice && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedNotice(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', background: '#e0e7ff', color: '#3730a3' }}>
                {selectedNotice.category}
              </span>
              <button onClick={() => setSelectedNotice(null)} className="admin-btn admin-btn-ghost" style={{ padding: '4px' }}>✕</button>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: '#0f172a' }}>
              {selectedNotice.title}
            </h2>

            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '1.25rem', display: 'flex', gap: '1rem' }}>
              <span>Author: <strong>{selectedNotice.author}</strong></span>
              <span>Date: <strong>{new Date(selectedNotice.created_at).toLocaleDateString()}</strong></span>
            </div>

            <div style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-line', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {selectedNotice.content}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: VIEW EVENT DETAILS ── */}
      {selectedEvent && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', background: '#fce7f3', color: '#be185d' }}>
                {selectedEvent.event_type}
              </span>
              <button onClick={() => setSelectedEvent(null)} className="admin-btn admin-btn-ghost" style={{ padding: '4px' }}>✕</button>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: '#0f172a' }}>
              {selectedEvent.title}
            </h2>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '13.5px', marginBottom: '1.25rem' }}>
              <div>📅 Date: <strong>{selectedEvent.event_date}</strong></div>
              <div>⏰ Time: <strong>{selectedEvent.start_time} - {selectedEvent.end_time}</strong></div>
              <div>📍 Location: <strong>{selectedEvent.location}</strong></div>
              <div>👤 Organizer: <strong>{selectedEvent.organizer}</strong></div>
            </div>

            <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
              {selectedEvent.description}
            </p>

            <button
              onClick={() => alert(`Event "${selectedEvent.title}" added to your calendar!`)}
              className="admin-btn admin-btn-primary"
              style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Calendar size={16} /> Add to My Calendar
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 4: INSTRUCTOR/ADMIN CREATE ASSIGNMENT ── */}
      {showCreateAssignmentModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowCreateAssignmentModal(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 1rem 0' }}>➕ Create New Assignment</h2>

            <form onSubmit={handleCreateAssignmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="admin-label">Assignment Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Python Calculator Project"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="admin-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Subject</label>
                  <select
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    className="admin-input"
                    style={{ width: '100%' }}
                  >
                    <option value="Python Programming">Python Programming</option>
                    <option value="Scratch & Logic">Scratch & Logic</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Robotics & Hardware">Robotics & Hardware</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="admin-label">Due Date</label>
                  <input
                    required
                    type="date"
                    value={newAssignment.due_date}
                    onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                    className="admin-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Description & Instructions</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed instructions for students..."
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="admin-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
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
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 1rem 0' }}>📢 Post Notice Announcement</h2>

            <form onSubmit={handleCreateNoticeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="admin-label">Announcement Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Hackathon Registration Open!"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="admin-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Category</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as any })}
                    className="admin-input"
                    style={{ width: '100%' }}
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Event">Event</option>
                    <option value="Exam">Exam</option>
                  </select>
                </div>

                <div>
                  <label className="admin-label">Urgency</label>
                  <select
                    value={newNotice.urgency}
                    onChange={(e) => setNewNotice({ ...newNotice, urgency: e.target.value as any })}
                    className="admin-input"
                    style={{ width: '100%' }}
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-label">Announcement Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write notice details..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="admin-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={newNotice.is_pinned}
                  onChange={(e) => setNewNotice({ ...newNotice, is_pinned: e.target.checked })}
                />
                <label htmlFor="pinCheck" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Pin this notice to top of board</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
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
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 1rem 0' }}>📅 Add Calendar Event</h2>

            <form onSubmit={handleCreateEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="admin-label">Event Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. AI Robotics Workshop"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="admin-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Event Type</label>
                  <select
                    value={newEvent.event_type}
                    onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value as any })}
                    className="admin-input"
                    style={{ width: '100%' }}
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Deadline">Deadline</option>
                    <option value="Competition">Competition</option>
                    <option value="Exam">Exam</option>
                  </select>
                </div>

                <div>
                  <label className="admin-label">Date (YYYY-MM-DD)</label>
                  <input
                    required
                    type="date"
                    value={newEvent.event_date}
                    onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                    className="admin-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Start Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={newEvent.start_time}
                    onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                    className="admin-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label className="admin-label">End Time</label>
                  <input
                    type="text"
                    placeholder="12:00 PM"
                    value={newEvent.end_time}
                    onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                    className="admin-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Location</label>
                <input
                  type="text"
                  placeholder="CBT Centre Lab A / Online Stream"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="admin-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="admin-label">Description</label>
                <textarea
                  rows={3}
                  placeholder="Event details..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="admin-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
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
