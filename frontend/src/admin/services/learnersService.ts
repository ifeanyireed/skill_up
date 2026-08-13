// ============================================================================
// Skill Up Academy — Learners Portal Service (Assignments, Notices, Events)
// ============================================================================
import { API_BASE_URL } from './api'

export interface LearnerAssignment {
  id: number
  title: string
  description: string
  subject: string // Python Programming, Scratch & Logic, Web Development, Robotics, AI & Data, Mathematics
  due_date: string // YYYY-MM-DD
  total_points: number
  status: 'Active' | 'Closed' | 'Archived'
  group: string
  instructor: string
  submissions: number
  user_submission?: LearnerSubmission | null
  created_at?: string
}

export interface LearnerSubmission {
  id?: number
  assignment_id: number
  student_id: string
  student_name: string
  submission_text: string
  file_url?: string
  status: 'Submitted' | 'Graded' | 'Late'
  grade?: number
  feedback?: string
  submitted_at: string
}

export interface LearnerNotice {
  id: number
  title: string
  content: string
  category: 'General' | 'Academic' | 'Urgent' | 'Event' | 'Exam'
  urgency: 'Low' | 'Normal' | 'High' | 'Urgent'
  author: string
  is_pinned: boolean
  target_group: string
  created_at: string
}

export interface LearnerEvent {
  id: number
  title: string
  description: string
  event_type: 'Workshop' | 'Webinar' | 'Deadline' | 'Competition' | 'Exam' | 'Holiday'
  location: string
  event_date: string // YYYY-MM-DD
  start_time: string
  end_time: string
  organizer: string
  target_group: string
  created_at?: string
}

// ── Initial Mock Fallback Data ────────────────────────────────────────────────
const INITIAL_ASSIGNMENTS: LearnerAssignment[] = [
  {
    id: 1,
    title: 'Python Basics: Build a Calculator',
    description: 'Create a simple Python command-line calculator that performs addition, subtraction, multiplication, and division. Submit your script or GitHub repository link.',
    subject: 'Python Programming',
    due_date: '2026-08-20',
    total_points: 100,
    status: 'Active',
    group: 'Junior Champions (Ages 11-19)',
    instructor: 'Bridget Blover',
    submissions: 14,
    created_at: '2026-08-10T09:00:00Z',
  },
  {
    id: 2,
    title: 'Scratch Game: Space Dodge Challenge',
    description: 'Design an interactive game on Scratch where your sprite dodges falling asteroids. Use variables for scores and lives.',
    subject: 'Scratch & Logic',
    due_date: '2026-08-22',
    total_points: 100,
    status: 'Active',
    group: 'Little Dragons (Ages 4-10)',
    instructor: 'Grace Solomon',
    submissions: 18,
    created_at: '2026-08-11T10:30:00Z',
  },
  {
    id: 3,
    title: 'Web Development: Personal Portfolio HTML/CSS',
    description: 'Build a responsive single-page portfolio featuring your bio, skills, and favorite projects using semantic HTML5 and custom CSS styles.',
    subject: 'Web Development',
    due_date: '2026-08-25',
    total_points: 100,
    status: 'Active',
    group: 'Junior Champions (Ages 11-19)',
    instructor: 'Ifeanyi Reed',
    submissions: 9,
    created_at: '2026-08-12T14:00:00Z',
  },
]

const INITIAL_NOTICES: LearnerNotice[] = [
  {
    id: 1,
    title: 'Summer Tech Showcase & Hackathon 2026',
    content: 'We are thrilled to announce our upcoming Tech Showcase! All learners are invited to present their final projects in Python, Scratch, and Web Dev to parents and guest judges. Prizes and certificates will be awarded.',
    category: 'Event',
    urgency: 'High',
    author: 'Christiana Okokon',
    is_pinned: true,
    target_group: 'All',
    created_at: '2026-08-13T08:00:00Z',
  },
  {
    id: 2,
    title: 'CBT Centre Laptop Setup & Guidelines',
    content: 'Learners attending the CBT Centre lab sessions must ensure their assigned laptops are fully charged before morning classes. Chargers should be labeled with student IDs.',
    category: 'Academic',
    urgency: 'Normal',
    author: 'Grace Solomon',
    is_pinned: false,
    target_group: 'All',
    created_at: '2026-08-12T11:20:00Z',
  },
  {
    id: 3,
    title: 'PuzzlePro Championship Leaderboard Update',
    content: 'Congratulations to all students who completed Level 5 in PuzzlePro this week! Check out the updated leaderboard in your learner dashboard.',
    category: 'General',
    urgency: 'Normal',
    author: 'Bridget Blover',
    is_pinned: false,
    target_group: 'All',
    created_at: '2026-08-11T16:45:00Z',
  },
]

const INITIAL_EVENTS: LearnerEvent[] = [
  {
    id: 1,
    title: 'Robotics & AI Hands-On Workshop',
    description: 'Live demo and hands-on workshop on building sensor-based robots and beginner AI models.',
    event_type: 'Workshop',
    location: 'CBT Centre Lab A',
    event_date: '2026-08-18',
    start_time: '10:00 AM',
    end_time: '12:30 PM',
    organizer: 'Ifeanyi Reed',
    target_group: 'All',
  },
  {
    id: 2,
    title: 'Python Project Submission Deadline',
    description: 'Final deadline to submit your Python Calculator project on the Learners portal.',
    event_type: 'Deadline',
    location: 'Online Submission',
    event_date: '2026-08-20',
    start_time: '11:59 PM',
    end_time: '11:59 PM',
    organizer: 'Bridget Blover',
    target_group: 'All',
  },
  {
    id: 3,
    title: 'Web Design & UI/UX Live Masterclass',
    description: 'Interactive session covering color theory, grid layouts, and modern CSS techniques.',
    event_type: 'Webinar',
    location: 'Raji Rasaki Centre / Online Stream',
    event_date: '2026-08-21',
    start_time: '02:00 PM',
    end_time: '04:00 PM',
    organizer: 'Christiana Okokon',
    target_group: 'Junior Champions (Ages 11-19)',
  },
  {
    id: 4,
    title: 'Summer Tech Camp Graduation & Awards Ceremony',
    description: 'Celebration ceremony for all graduating students with project presentations and award distributions.',
    event_type: 'Competition',
    location: 'Main Auditorium & Virtual Live',
    event_date: '2026-08-28',
    start_time: '11:00 AM',
    end_time: '03:00 PM',
    organizer: 'Skill Up Academy Team',
    target_group: 'All',
  },
]

// LocalStorage helpers for offline persistence fallback
function getStoredLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`skillup_learners_${key}`)
    if (item) return JSON.parse(item)
  } catch (e) {}
  return fallback
}

function setStoredLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`skillup_learners_${key}`, JSON.stringify(val))
  } catch (e) {}
}

// ── ASSIGNMENTS API ─────────────────────────────────────────────────────────

export async function fetchAssignments(): Promise<LearnerAssignment[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/assignments`)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setStoredLocal('assignments', data)
        return data
      }
    }
  } catch (err) {
    console.warn('Backend fetchAssignments offline, using local store:', err)
  }
  return getStoredLocal('assignments', INITIAL_ASSIGNMENTS)
}

export async function createAssignment(assignment: Omit<LearnerAssignment, 'id' | 'submissions'>): Promise<LearnerAssignment> {
  const payload = { ...assignment, submissions: 0 }
  try {
    const res = await fetch(`${API_BASE_URL}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      return res.json()
    }
  } catch (err) {
    console.warn('Backend createAssignment offline, saving locally:', err)
  }

  const current = getStoredLocal('assignments', INITIAL_ASSIGNMENTS)
  const newAssignment: LearnerAssignment = {
    ...payload,
    id: Date.now(),
    created_at: new Date().toISOString(),
  }
  const updated = [newAssignment, ...current]
  setStoredLocal('assignments', updated)
  return newAssignment
}

export async function submitAssignment(submission: Omit<LearnerSubmission, 'id' | 'submitted_at'>): Promise<LearnerSubmission> {
  const newSub: LearnerSubmission = {
    ...submission,
    id: Date.now(),
    submitted_at: new Date().toISOString(),
  }
  try {
    await fetch(`${API_BASE_URL}/assignments/${submission.assignment_id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSub),
    })
  } catch (err) {
    console.warn('Backend submitAssignment offline, saving locally:', err)
  }

  // Save submission locally for current student
  const submissionsKey = `submissions_${submission.assignment_id}_${submission.student_id}`
  setStoredLocal(submissionsKey, newSub)

  // Increment local assignment count
  const assignments = getStoredLocal('assignments', INITIAL_ASSIGNMENTS)
  const updated = assignments.map((a) => {
    if (a.id === submission.assignment_id) {
      return { ...a, submissions: (a.submissions || 0) + 1, user_submission: newSub }
    }
    return a
  })
  setStoredLocal('assignments', updated)

  return newSub
}

export function getLocalSubmission(assignmentId: number, studentId: string): LearnerSubmission | null {
  return getStoredLocal<LearnerSubmission | null>(`submissions_${assignmentId}_${studentId}`, null)
}

export async function deleteAssignment(id: number): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/assignments/${id}`, { method: 'DELETE' })
  } catch (err) {}
  const current = getStoredLocal('assignments', INITIAL_ASSIGNMENTS)
  setStoredLocal('assignments', current.filter((a) => a.id !== id))
}

// ── NOTICE BOARD API ────────────────────────────────────────────────────────

export async function fetchNotices(): Promise<LearnerNotice[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/notices`)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setStoredLocal('notices', data)
        return data
      }
    }
  } catch (err) {
    console.warn('Backend fetchNotices offline, using local store:', err)
  }
  return getStoredLocal('notices', INITIAL_NOTICES)
}

export async function createNotice(notice: Omit<LearnerNotice, 'id' | 'created_at'>): Promise<LearnerNotice> {
  try {
    const res = await fetch(`${API_BASE_URL}/notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notice),
    })
    if (res.ok) return res.json()
  } catch (err) {
    console.warn('Backend createNotice offline, saving locally:', err)
  }

  const current = getStoredLocal('notices', INITIAL_NOTICES)
  const newNotice: LearnerNotice = {
    ...notice,
    id: Date.now(),
    created_at: new Date().toISOString(),
  }
  const updated = [newNotice, ...current]
  setStoredLocal('notices', updated)
  return newNotice
}

export async function deleteNotice(id: number): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/notices/${id}`, { method: 'DELETE' })
  } catch (err) {}
  const current = getStoredLocal('notices', INITIAL_NOTICES)
  setStoredLocal('notices', current.filter((n) => n.id !== id))
}

// ── EVENTS CALENDAR API ─────────────────────────────────────────────────────

export async function fetchEvents(): Promise<LearnerEvent[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/events`)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setStoredLocal('events', data)
        return data
      }
    }
  } catch (err) {
    console.warn('Backend fetchEvents offline, using local store:', err)
  }
  return getStoredLocal('events', INITIAL_EVENTS)
}

export async function createEvent(event: Omit<LearnerEvent, 'id'>): Promise<LearnerEvent> {
  try {
    const res = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    })
    if (res.ok) return res.json()
  } catch (err) {
    console.warn('Backend createEvent offline, saving locally:', err)
  }

  const current = getStoredLocal('events', INITIAL_EVENTS)
  const newEvent: LearnerEvent = {
    ...event,
    id: Date.now(),
    created_at: new Date().toISOString(),
  }
  const updated = [...current, newEvent]
  setStoredLocal('events', updated)
  return newEvent
}

export async function deleteEvent(id: number): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/events/${id}`, { method: 'DELETE' })
  } catch (err) {}
  const current = getStoredLocal('events', INITIAL_EVENTS)
  setStoredLocal('events', current.filter((e) => e.id !== id))
}
