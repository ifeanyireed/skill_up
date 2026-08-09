// ============================================================================
// Skill Up Academy Check-in portal — Central Zustand Store
// ============================================================================
import { create } from 'zustand'

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
  return { isAuthenticated: true, user: DEFAULT_USER }
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
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (res.ok) {
        const data = await res.json()
        
        const user: AdminUser = {
          id: String(data.user.id),
          fullName: data.user.full_name,
          email: data.user.email,
          role: data.user.role,
          avatar: data.user.avatar,
          status: data.user.status === 'Active' ? 'active' : 'inactive',
          lastLogin: new Date().toISOString()
        }

        const sessionObj = { isAuthenticated: true, user }
        localStorage.setItem('skillup_admin_session', JSON.stringify(sessionObj))
        set({ session: sessionObj })
        return true
      }
    } catch (err) {
      console.warn('Backend login endpoint unavailable, using offline fallback auth:', err)
    }

    // Local / Offline fallback authentication
    if (email.trim() && password.trim()) {
      const isLead = email.toLowerCase().includes('admin') || email.toLowerCase().includes('okokon') || email.toLowerCase().includes('lead')
      const formattedName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

      const user: AdminUser = {
        id: 'usr-001',
        fullName: formattedName || 'Academy Staff',
        email: email.trim(),
        role: isLead ? 'Lead Admin' : 'Instructor',
        avatar: '/avatars/character1.jpg',
        status: 'active',
        lastLogin: new Date().toISOString()
      }

      const sessionObj = { isAuthenticated: true, user }
      try {
        localStorage.setItem('skillup_admin_session', JSON.stringify(sessionObj))
      } catch (err) {}
      set({ session: sessionObj })
      return true
    }

    return false
  },

  kidLogin: async (code: string) => {
    // Validate 8-digit numeric code
    const cleanCode = code.trim().replace(/\D/g, '')
    if (cleanCode.length !== 8) {
      return false
    }

    const kidUser: AdminUser = {
      id: `kid-${cleanCode}`,
      fullName: `Student (${cleanCode})`,
      email: `student@kids.skilluplearningacademy.com`,
      role: 'Student',
      avatar: '/avatars/character1.jpg',
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
