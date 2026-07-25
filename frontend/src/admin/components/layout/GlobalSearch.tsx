// ============================================================================
// SkillUp Academy Check-in portal — Global Search Overlay
// ============================================================================
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Users, UserCheck } from 'lucide-react'
import { useAdminStore } from '../../store/useAdminStore'
import { getChildren, getUsers } from '../../services/api'

export function GlobalSearch() {
  const { searchQuery, searchOpen, setSearchQuery, setSearchOpen } = useAdminStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const q = searchQuery.toLowerCase()

  const [childrenList, setChildrenList] = useState<any[]>([])
  const [usersList, setUsersList] = useState<any[]>([])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      getChildren().then((data: any[]) => setChildrenList(data)).catch(() => {})
      getUsers().then((data: any[]) => setUsersList(data)).catch(() => {})
    }
  }, [searchOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true) }
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery('') }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setSearchOpen, setSearchQuery])

  if (!searchOpen) return null

  const matchedChildren = q.length > 1 ? childrenList.filter((x: any) =>
    (x.full_name || '').toLowerCase().includes(q) || (x.parent_name || '').toLowerCase().includes(q) ||
    (x.parent_phone || '').includes(q) || (x.group || '').toLowerCase().includes(q)
  ).slice(0, 4) : []

  const matchedUsers = q.length > 1 ? usersList.filter((x: any) =>
    (x.full_name || '').toLowerCase().includes(q) || (x.email || '').toLowerCase().includes(q) ||
    (x.role || '').toLowerCase().includes(q)
  ).slice(0, 4) : []

  const hasResults = matchedChildren.length + matchedUsers.length > 0

  const go = (path: string) => {
    navigate(path); setSearchOpen(false); setSearchQuery('')
  }

  return (
    <div className="admin-search-overlay" onClick={() => { setSearchOpen(false); setSearchQuery('') }}>
      <div className="admin-search-box" onClick={e => e.stopPropagation()}>
        <div className="admin-search-input-wrap">
          <Search size={16} color="var(--adm-text-3)" />
          <input ref={inputRef} className="admin-search-input"
            placeholder="Search students, parents, PINs, staff..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <button className="admin-btn admin-btn-icon admin-btn-ghost" onClick={() => { setSearchOpen(false); setSearchQuery('') }}>
            <X size={14} />
          </button>
        </div>

        <div className="admin-search-results">
          {q.length <= 1 && (
            <div className="admin-search-empty">Start typing to search across student & staff records</div>
          )}
          {q.length > 1 && !hasResults && (
            <div className="admin-search-empty">No results found for "{searchQuery}"</div>
          )}

          {matchedChildren.length > 0 && (
            <div className="admin-search-group">
              <div className="admin-search-group-label">Students</div>
              {matchedChildren.map((c: any) => (
                <div key={c.id} className="admin-search-result" onClick={() => go('/admin/children')}>
                  <div className="admin-search-result-icon"><Users size={14} color="var(--adm-text-2)" /></div>
                  <div>
                    <div className="admin-search-result-title">{c.full_name}</div>
                    <div className="admin-search-result-sub">{c.group} · Parent: {c.parent_name} ({c.parent_phone})</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {matchedUsers.length > 0 && (
            <div className="admin-search-group">
              <div className="admin-search-group-label">Instructors & Staff</div>
              {matchedUsers.map((u: any) => (
                <div key={u.id} className="admin-search-result" onClick={() => go('/admin/users')}>
                  <div className="admin-search-result-icon"><UserCheck size={14} color="var(--adm-text-2)" /></div>
                  <div>
                    <div className="admin-search-result-title">{u.full_name}</div>
                    <div className="admin-search-result-sub">{u.role} · {u.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
