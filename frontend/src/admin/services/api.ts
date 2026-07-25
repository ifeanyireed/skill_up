// ============================================================================
// Skill Up Academy Check-in portal — REST API Client for Go Backend
// Supports Center selection: Raji Rasaki Centre & CBT Centre
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export interface BackendChild {
  id: number
  student_id: string
  full_name: string
  photo: string
  age: number
  gender: string
  dob: string
  center: string // 'Raji Rasaki Centre' | 'CBT Centre'
  group: string
  parent_name: string
  parent_phone: string
  parent_email: string
  parent_relationship: string
  emergency_name: string
  emergency_phone: string
  medical_notes: string
  status: 'Not Checked In' | 'Checked In' | 'Waiting Pickup' | 'Checked Out'
  active_code: string
  check_in_time: string
  check_out_time: string
  created_at?: string
  updated_at?: string
}

export interface BackendAttendanceLog {
  id: number
  date: string
  student_id: string
  child_name: string
  photo: string
  center: string
  group: string
  check_in_time: string
  drop_off_adult: string
  check_out_time: string
  pickup_adult: string
  pickup_pin: string
  instructor_name: string
  status: string
}

export interface BackendUser {
  id: number
  full_name: string
  email: string
  phone: string
  role: 'Administrator' | 'Instructor'
  assigned_group: string
  status: 'Active' | 'Disabled'
  avatar: string
  last_login: string
}

export interface BackendSetting {
  id?: number
  business_name: string
  tagline: string
  business_email: string
  business_phone: string
  business_address: string
  code_length: number
  auto_expire_hour: string
  sms_enabled: boolean
  require_phone: boolean
}

// ── Children API ─────────────────────────────────────────────────────────────
export async function getChildren(status?: string, search?: string, center?: string): Promise<BackendChild[]> {
  const params = new URLSearchParams()
  if (status && status !== 'all') params.append('status', status)
  if (search) params.append('search', search)
  if (center && center !== 'all') params.append('center', center)

  const res = await fetch(`${API_BASE_URL}/children?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch children from backend')
  return res.json()
}

export async function createChild(data: Partial<BackendChild>): Promise<BackendChild> {
  const res = await fetch(`${API_BASE_URL}/children`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create child record')
  return res.json()
}

export async function updateChildStatus(id: number | string, status: string): Promise<BackendChild> {
  const res = await fetch(`${API_BASE_URL}/children/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update student status')
  return res.json()
}

export async function checkInChild(
  id: number | string,
  adultName: string,
  adultPhone: string,
  rel: string = 'Mother',
  notes: string = '',
  center: string = 'Raji Rasaki Centre'
) {
  const res = await fetch(`${API_BASE_URL}/children/${id}/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      adult_name: adultName,
      adult_phone: adultPhone,
      relationship: rel,
      notes: notes,
      center: center,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Check-in failed')
  }
  return res.json()
}

export async function checkOutChild(
  pin: string,
  collectorName: string,
  collectorPhone: string,
  rel: string = 'Father',
  studentID: string = ''
) {
  const res = await fetch(`${API_BASE_URL}/children/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pin: pin,
      collector_name: collectorName,
      collector_phone: collectorPhone,
      relationship: rel,
      student_id: studentID,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Pickup PIN verification failed')
  }
  return res.json()
}

// ── Attendance Logs API ──────────────────────────────────────────────────────
export async function getAttendanceLogs(date?: string, search?: string): Promise<BackendAttendanceLog[]> {
  const params = new URLSearchParams()
  if (date) params.append('date', date)
  if (search) params.append('search', search)

  const res = await fetch(`${API_BASE_URL}/attendance?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch attendance logs')
  return res.json()
}

export function getAttendanceExportCSVURL(date?: string): string {
  return `${API_BASE_URL}/attendance/export?date=${date || ''}`
}

// ── Staff & Users API ────────────────────────────────────────────────────────
export async function getUsers(): Promise<BackendUser[]> {
  const res = await fetch(`${API_BASE_URL}/users`)
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export async function createUser(user: Partial<BackendUser>): Promise<BackendUser> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
  if (!res.ok) throw new Error('Failed to create user')
  return res.json()
}

export async function toggleUserStatus(id: number | string): Promise<BackendUser> {
  const res = await fetch(`${API_BASE_URL}/users/${id}/toggle`, {
    method: 'PUT',
  })
  if (!res.ok) throw new Error('Failed to toggle user status')
  return res.json()
}

// ── Settings API ─────────────────────────────────────────────────────────────
export async function getSettings(): Promise<BackendSetting> {
  const res = await fetch(`${API_BASE_URL}/settings`)
  if (!res.ok) throw new Error('Failed to fetch settings')
  return res.json()
}

export async function updateSettings(settings: Partial<BackendSetting>): Promise<BackendSetting> {
  const res = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  })
  if (!res.ok) throw new Error('Failed to update settings')
  return res.json()
}

// ── Auth API ─────────────────────────────────────────────────────────────────
export async function loginStaff(email: string, pass: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pass }),
  })
  if (!res.ok) throw new Error('Authentication failed')
  return res.json()
}
