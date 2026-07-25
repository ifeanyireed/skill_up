// ============================================================================
// Skill Up Academy Check-in portal — Central Zustand Store
// ============================================================================
import { create } from 'zustand'

export interface AdminUser {
  id: string
  fullName: string
  email: string
  role: string
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
  login: (email: string, password: string) => boolean
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

  login: (email, _password) => {
    const cleanEmail = (email || '').trim().toLowerCase()

    let fullName = 'Christiana Okokon'
    if (cleanEmail.includes('ifeanyi')) {
      fullName = 'Ifeanyi Reed'
    } else if (cleanEmail.includes('grace')) {
      fullName = 'Grace Solomon'
    } else if (cleanEmail.includes('michael')) {
      fullName = 'Coach Michael Davies'
    }

    const user: AdminUser = {
      id: 'usr-001',
      fullName: fullName,
      email: cleanEmail || 'Okokon.Christiana@kingshouselearning.com',
      role: cleanEmail.includes('michael') ? 'Instructor' : 'Lead Admin',
      status: 'active',
      lastLogin: new Date().toISOString()
    }

    const sessionObj = { isAuthenticated: true, user }
    try {
      localStorage.setItem('skillup_admin_session', JSON.stringify(sessionObj))
    } catch (err) {
      console.warn('Could not save admin session', err)
    }

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
