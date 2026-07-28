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

  login: (email, _password) => {
    const cleanEmail = (email || '').trim().toLowerCase()

    let fullName = 'Christiana Okokon'
    let avatar = '/avatars/character1.jpg'
    let role = 'Administrator'

    if (cleanEmail.includes('ifeanyi')) {
      fullName = 'Ifeanyi Reed'
      avatar = '/avatars/character2.jpg'
      role = 'Administrator'
    } else if (cleanEmail.includes('grace')) {
      fullName = 'Grace Solomon'
      avatar = '/avatars/character3.jpg'
      role = 'Administrator'
    } else if (cleanEmail.includes('bridget')) {
      fullName = 'Bridget Blover'
      avatar = '/avatars/character4.jpg'
      role = 'Instructor'
    } else if (cleanEmail) {
      const namePart = cleanEmail.split('@')[0]
      const formatted = namePart.split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      fullName = formatted || 'Staff User'
      role = 'Instructor'
    }

    const user: AdminUser = {
      id: 'usr-001',
      fullName,
      email: cleanEmail || 'Okokon.Christiana@kingshouselearning.com',
      role,
      avatar,
      status: 'active',
      lastLogin: new Date().toISOString()
    }

    // Fire & forget sync to ensure user exists in MySQL backend database
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        email: user.email,
        phone: '+234 800 000 7788',
        role: role,
        assigned_group: role === 'Administrator' ? 'Head Administrator / All Groups' : 'Junior Champions (Ages 11-19)',
        status: 'Active',
        avatar: avatar,
      })
    }).catch((err) => console.warn('User DB sync error', err))

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
