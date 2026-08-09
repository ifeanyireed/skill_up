// ============================================================================
// SkillUp Check-In Portal — PuzzlePro / School Tab Page
// Route: /admin/school & /school
// ============================================================================
import React, { useState } from 'react'
import { Puzzle, School, ExternalLink, Sparkles } from 'lucide-react'

export function SchoolPuzzleProPage() {
  const [activeSubTab, setActiveSubTab] = useState<'admin' | 'student'>('admin')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: '1rem' }}>
      {/* Header Bar with Sub-Tab Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'var(--adm-bg-surface, #FFFFFF)',
          border: '1px solid var(--adm-border, #E2E8F0)',
          borderRadius: '1rem',
          padding: '0.875rem 1.25rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '0.75rem',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Puzzle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--adm-text-1, #0F172A)' }}>
              PuzzlePro Management Portal
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--adm-text-3, #64748B)' }}>
              Future Programs For Kids — School Dashboard & Student Coding Engine
            </div>
          </div>
        </div>

        {/* Tab Switcher Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: '0.75rem' }}>
          <button
            onClick={() => setActiveSubTab('admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeSubTab === 'admin' ? '#FFFFFF' : 'transparent',
              color: activeSubTab === 'admin' ? '#0F172A' : '#64748B',
              boxShadow: activeSubTab === 'admin' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <School size={15} /> School Admin
          </button>
          <button
            onClick={() => setActiveSubTab('student')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeSubTab === 'student' ? '#FFFFFF' : 'transparent',
              color: activeSubTab === 'student' ? '#0F172A' : '#64748B',
              boxShadow: activeSubTab === 'student' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={15} color="#DC2626" /> Student Engine
          </button>

          <a
            href={activeSubTab === 'admin' ? 'https://learn2earnhq.com/schools' : 'https://learn2earnhq.com/embed?org_token=TOKEN_SKIL_9901'}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.5rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#3B82F6',
              textDecoration: 'none',
              borderRadius: '0.5rem',
            }}
            title="Open in new window"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Embedded iFrame Container */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          borderRadius: '1rem',
          border: '1px solid var(--adm-border, #E2E8F0)',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <iframe
          src={
            activeSubTab === 'admin'
              ? 'https://learn2earnhq.com/schools'
              : 'https://learn2earnhq.com/embed?org_token=TOKEN_SKIL_9901'
          }
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          allowFullScreen
          title="PuzzlePro School Portal"
        />
      </div>
    </div>
  )
}
