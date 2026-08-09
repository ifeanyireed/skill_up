// ============================================================================
// SkillUp Academy Website — PuzzlePro Gamified Coding Fullscreen Embed Page
// Route: /puzzlepro
// ============================================================================
import React from 'react'

export function PuzzleProPage() {
  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 999999, backgroundColor: '#020617', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src="https://learn2earnhq.com/embed?org_token=TOKEN_SKIL_9901"
        style={{ width: '100vw', height: '100vh', border: 0, margin: 0, padding: 0, display: 'block' }}
        allowFullScreen
        title="PuzzlePro Fullscreen Embed"
      />
    </div>
  )
}
