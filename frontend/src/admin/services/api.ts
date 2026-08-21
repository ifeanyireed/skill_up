// ============================================================================
// Skill Up Academy Check-in portal — REST API Client for Go Backend
// Supports Center selection: Raji Rasaki Centre & CBT Centre
// ============================================================================

const getApiBaseUrl = () => {
  let url = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL
  if (url) {
    url = url.replace(/\/+$/, '')
    return url
  }
  return 'https://skill-up-sano.onrender.com/api'
}

export const API_BASE_URL = getApiBaseUrl()

const getPlayerServiceUrl = () => {
  let url = import.meta.env.VITE_PLAYER_SERVICE_URL || import.meta.env.NEXT_PUBLIC_PLAYER_SERVICE_URL
  if (url) return url.replace(/\/+$/, '')
  return 'https://player-service-y1ur.onrender.com/api/v1'
}

export const PLAYER_SERVICE_URL = getPlayerServiceUrl()

export function getChildAvatar(photo?: string, identifier?: string | number): string {
  if (photo && photo.startsWith('/avatars/character')) {
    return photo
  }
  const str = String(identifier || photo || '1')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  const avatarIndex = (Math.abs(hash) % 20) + 1
  return `/avatars/character${avatarIndex}.jpg`
}

export interface BackendChild {
  id: number
  student_id: string
  full_name: string
  photo: string
  age: number
  gender: string
  dob: string
  center: string // 'Raji Rasaki Centre' | 'Festac Centre'
  group: string
  parent_name: string
  parent_phone: string
  parent_email: string
  parent_relationship: string
  emergency_name: string
  emergency_phone: string
  medical_notes: string
  school_name?: string
  current_grade?: string
  alt_phone?: string
  home_address?: string
  senior_track?: string
  owns_device?: string
  device_type?: string
  amount_paid?: number
  payment_status?: string
  payment_date?: string
  referral_source?: string
  additional_notes?: string
  consent_given?: boolean
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
  check_out_instructor?: string
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
  const avatarPath = getChildAvatar(data.photo, data.full_name)
  const payload = { ...data, photo: avatarPath }

  const res = await fetch(`${API_BASE_URL}/children`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  if (!res.ok) {
    let errorMsg = 'Failed to create child record'
    try {
      const err = JSON.parse(text)
      errorMsg = err.error || errorMsg
    } catch {
      if (text) errorMsg = text
    }
    throw new Error(errorMsg)
  }

  const created: BackendChild = JSON.parse(text)

  // Automatically create student account on player-service according to Group, Centre, and World mapping
  try {
    const studentName = created.full_name || data.full_name || 'Student'
    const groupName = created.group || data.group || 'Junior Camp (5–10 years)'
    const centerName = created.center || data.center || 'Raji Rasaki Centre'

    const isSenior = groupName.toLowerCase().includes('senior')
    const worldId = isSenior ? 2 : 1
    const centreId = centerName.toLowerCase().includes('festac') ? 2 : 3

    let code = (created.active_code || data.active_code || '').replace(/\D/g, '')
    if (code.length !== 8) {
      const digits = (created.student_id || data.student_id || String(created.id || Date.now())).replace(/\D/g, '')
      code = ('88000000' + digits).slice(-8)
    }

    await fetch(`${PLAYER_SERVICE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: studentName,
        name: studentName,
        avatar: getChildAvatar(created.photo || data.photo, studentName),
        access_code: code,
        accessCode: code,
        studentCode: code,
        role: 'student',
        organisation_id: 'org_4687',
        organisationId: 'org_4687',
        centre_id: centreId,
        centreId: centreId,
        centre_name: centerName,
        centreName: centerName,
        group_name: groupName,
        groupName: groupName,
        assigned_world_id: worldId,
        assignedWorldId: worldId,
      }),
    })
  } catch (err) {
    console.warn('Player service automatic registration sync warning:', err)
  }

  return created
}

export async function deleteChild(id: number | string): Promise<{ message: string }> {
  if (!id || id === 'undefined' || id === 'null') {
    throw new Error('Invalid student ID for deletion')
  }

  const endpoints = [
    { url: `${API_BASE_URL}/children/${id}`, method: 'DELETE' },
    { url: `${API_BASE_URL}/children/${id}/delete`, method: 'POST' },
    { url: `${API_BASE_URL}/children/delete/${id}`, method: 'POST' },
  ]

  let lastRes: Response | null = null
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' },
      })
      lastRes = res
      if (res.ok) {
        const text = await res.text()
        try {
          return JSON.parse(text)
        } catch {
          return { message: 'Child student record deleted successfully' }
        }
      }
      if (res.status !== 404 && res.status !== 405) {
        break
      }
    } catch (e) {
      console.warn(`Delete attempt via ${ep.method} ${ep.url} failed`, e)
    }
  }

  const text = lastRes ? await lastRes.text() : ''
  let errorMsg = 'Failed to delete student record'
  try {
    const err = JSON.parse(text)
    errorMsg = err.error || errorMsg
  } catch {
    if (text) errorMsg = text
  }
  throw new Error(errorMsg)
}

export async function updateChildCenter(id: number | string, center: string): Promise<BackendChild> {
  if (!id || id === 'undefined' || id === 'null') {
    throw new Error('Invalid student ID for update')
  }

  const endpoints = [
    { url: `${API_BASE_URL}/children/${id}`, method: 'PUT' },
    { url: `${API_BASE_URL}/children/${id}/update`, method: 'POST' },
    { url: `${API_BASE_URL}/children/update/${id}`, method: 'POST' },
  ]

  let lastRes: Response | null = null
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ center }),
      })
      lastRes = res
      if (res.ok) {
        return res.json()
      }
      if (res.status !== 404 && res.status !== 405) {
        break
      }
    } catch (e) {
      console.warn(`Update center via ${ep.method} ${ep.url} failed`, e)
    }
  }

  const text = lastRes ? await lastRes.text() : ''
  let errorMsg = 'Failed to update student center'
  try {
    const err = JSON.parse(text)
    errorMsg = err.error || errorMsg
  } catch {
    if (text) errorMsg = text
  }
  throw new Error(errorMsg)
}

export async function updateChildDetails(id: number | string, data: Partial<BackendChild>): Promise<BackendChild> {
  const res = await fetch(`${API_BASE_URL}/children/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    const text = await res.text()
    let errorMsg = 'Failed to update child details'
    try {
      const err = JSON.parse(text)
      errorMsg = err.error || errorMsg
    } catch {
      if (text) errorMsg = text
    }
    throw new Error(errorMsg)
  }
  return res.json()
}

export async function updateChildStatus(id: number | string, status: string, instructorName?: string): Promise<BackendChild> {
  const res = await fetch(`${API_BASE_URL}/children/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, instructor_name: instructorName }),
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
  center: string = 'Raji Rasaki Centre',
  instructorName?: string
) {
  const localTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const res = await fetch(`${API_BASE_URL}/children/${id}/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      adult_name: adultName,
      adult_phone: adultPhone,
      relationship: rel,
      notes: notes,
      center: center,
      check_in_time: localTime,
      instructor_name: instructorName,
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
  studentID: string = '',
  instructorName?: string
) {
  const localTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const res = await fetch(`${API_BASE_URL}/children/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pin: pin,
      collector_name: collectorName,
      collector_phone: collectorPhone,
      relationship: rel,
      student_id: studentID,
      pickup_time: localTime,
      instructor_name: instructorName,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Pickup PIN verification failed')
  }
  return res.json()
}

// ── Attendance Logs API ──────────────────────────────────────────────────────
export async function getAttendanceLogs(
  date?: string,
  search?: string,
  status?: string,
  group?: string,
  center?: string,
  page?: number,
  limit?: number
): Promise<BackendAttendanceLog[]> {
  const params = new URLSearchParams()
  if (date) params.append('date', date)
  if (search) params.append('search', search)
  if (status && status !== 'all') params.append('status', status)
  if (group && group !== 'all') params.append('group', group)
  if (center && center !== 'all') params.append('center', center)
  if (page) params.append('page', page.toString())
  if (limit) params.append('limit', limit.toString())

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
