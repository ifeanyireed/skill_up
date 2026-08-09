// ============================================================================
// SkillUp Check-In Portal — PuzzlePro School Admin Dashboard Page
// Route: /admin/school & /school
// ============================================================================
import React from 'react'

export function SchoolPuzzleProPage() {
  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100vh - 110px)',
        backgroundColor: '#FFFFFF',
        borderRadius: '1rem',
        border: '1px solid var(--adm-border, #E2E8F0)',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <iframe
        src="https://learn2earnhq.com/schools"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        allowFullScreen
        title="PuzzlePro School Admin Dashboard"
      />
    </div>
  )
}
