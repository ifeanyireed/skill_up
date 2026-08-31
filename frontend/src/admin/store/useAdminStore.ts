// ============================================================================
// Skill Up Academy Check-in portal — Central Zustand Store
// ============================================================================
import { create } from 'zustand'
import { API_BASE_URL, getChildren, getChildAvatar } from '../services/api'

export interface AdminUser {
  id: string
  fullName: string
  email: string
  role: string
  avatar?: string
  status: 'active' | 'inactive'
  lastLogin: string
}

export interface AdminSession {
  isAuthenticated: boolean
  user: AdminUser | null
  token?: string
}

export function isLearnerUser(user: AdminUser | null): boolean {
  if (!user) return false
  const role = (user.role || '').toLowerCase()
  return role === 'student' || role === 'learner' || role === 'child'
}

export function isAdminUser(user: AdminUser | null): boolean {
  if (!user) return false
  const role = (user.role || '').toLowerCase()
  return role === 'super admin' || role === 'program supervisor' || role === 'administrator' || role === 'admin' || role === 'lead admin'
}

export function isSuperAdmin(user: AdminUser | null): boolean {
  if (!user) return false
  const role = (user.role || '').toLowerCase()
  return role === 'super admin'
}

export function isInstructorUser(user: AdminUser | null): boolean {
  if (!user) return false
  const role = (user.role || '').toLowerCase()
  return role === 'instructor' || role === 'teacher'
}

export function canManageLearners(user: AdminUser | null): boolean {
  return isAdminUser(user) || isInstructorUser(user)
}

interface AdminStore {
  // Auth
  session: AdminSession
  login: (email: string, password: string) => Promise<boolean>
  kidLogin: (code: string) => Promise<boolean>
  logout: () => void

  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  // Search
  searchQuery: string
  searchOpen: boolean
  setSearchQuery: (q: string) => void
  setSearchOpen: (open: boolean) => void
}

const DEFAULT_USER: AdminUser = {
  id: 'usr-001',
  fullName: 'Christiana Okokon',
  email: 'Okokon.Christiana@kingshouselearning.com',
  role: 'Lead Admin',
  avatar: '/avatars/character1.jpg',
  status: 'active',
  lastLogin: new Date().toISOString()
}

const loadInitialSession = (): AdminSession => {
  try {
    const stored = localStorage.getItem('skillup_admin_session')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && parsed.isAuthenticated && parsed.user) return parsed
    }
  } catch (err) {
    console.warn('Could not load stored admin session', err)
  }
  return { isAuthenticated: false, user: null }
}

const loadInitialSidebarState = (): boolean => {
  try {
    const stored = localStorage.getItem('skillup_sidebar_collapsed')
    if (stored !== null) return JSON.parse(stored)
  } catch (err) {}
  return false
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  // ── Auth ──
  session: loadInitialSession(),

  login: async (email, password) => {
    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = password.trim()

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      })

      if (!res.ok) {
        return false
      }

      const data = await res.json()
      const user: AdminUser = {
        id: String(data.user.id),
        fullName: data.user.full_name,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar || '/avatars/character1.jpg',
        status: data.user.status === 'Active' ? 'active' : 'inactive',
        lastLogin: new Date().toISOString()
      }

      const sessionObj = { isAuthenticated: true, user, token: data.token }
      localStorage.setItem('skillup_admin_session', JSON.stringify(sessionObj))
      set({ session: sessionObj })
      return true
    } catch (err) {
      console.error('Authentication error:', err)
      return false
    }
  },

  kidLogin: async (code: string) => {
    // Validate 8-digit numeric code
    const cleanCode = code.trim().replace(/\D/g, '')
    if (cleanCode.length !== 8) {
      return false
    }

    let firstName = 'Learner'
    let studentAvatar = '/avatars/character1.jpg'
    let studentId = `kid-${cleanCode}`

    try {
      const children = await getChildren()
      const match = children.find(
        (c) =>
          c.active_code === cleanCode ||
          c.student_id === cleanCode ||
          c.student_id.replace(/\D/g, '') === cleanCode ||
          cleanCode.endsWith(c.student_id.replace(/\D/g, ''))
      )

      if (match && match.full_name) {
        const parts = match.full_name.trim().split(/\s+/)
        firstName = parts[0] || match.full_name
        studentAvatar = getChildAvatar(match.photo, match.full_name)
        studentId = String(match.id || match.student_id)
      }
    } catch (err) {
      console.warn('Child lookup during kidLogin warning:', err)
    }

    const kidUser: AdminUser = {
      id: studentId,
      fullName: firstName,
      email: `student@kids.skilluplearningacademy.com`,
      role: 'Student',
      avatar: studentAvatar,
      status: 'active',
      lastLogin: new Date().toISOString()
    }

    const sessionObj = { isAuthenticated: true, user: kidUser }
    try {
      localStorage.setItem('skillup_admin_session', JSON.stringify(sessionObj))
    } catch (e) {}
    set({ session: sessionObj })
    return true
  },

  logout: () => {
    try {
      localStorage.removeItem('skillup_admin_session')
    } catch (err) {}
    set({ session: { isAuthenticated: false, user: null } })
  },

  // ── Sidebar ──
  sidebarCollapsed: loadInitialSidebarState(),
  toggleSidebar: () => {
    const nextState = !get().sidebarCollapsed
    try {
      localStorage.setItem('skillup_sidebar_collapsed', JSON.stringify(nextState))
    } catch (err) {}
    set({ sidebarCollapsed: nextState })
  },

  // ── Search ──
  searchQuery: '',
  searchOpen: false,
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSearchOpen: (open: boolean) => set({ searchOpen: open }),
}))
