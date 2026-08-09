// ============================================================================
// SkillUp Academy Website — PuzzlePro Gamified Coding Fullscreen Embed Page
// Route: /puzzlepro
// ============================================================================
import React from 'react'
import { Link } from 'react-router-dom'

export function PuzzleProPage() {
  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 999999, backgroundColor: '#020617', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src="https://learn2earnhq.com/embed?org_token=TOKEN_SKIL_9901"
        style={{ width: '100vw', height: '100vh', border: 0, margin: 0, padding: 0, display: 'block' }}
        allowFullScreen
        title="PuzzlePro Fullscreen Embed"
      />

      {/* SkillUp Academy Logo Overlay on Bottom Left */}
      <Link
        to="/"
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          left: '1.25rem',
          zIndex: 9999999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '1rem',
          padding: '0.5rem 0.875rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          textDecoration: 'none',
        }}
        title="Return to SkillUp Academy Home"
      >
        <img
          src="/logo.avif"
          alt="SkillUp Academy Logo"
          style={{ height: '28px', width: 'auto', filter: 'brightness(0) invert(1)' }}
        />
      </Link>
    </div>
  )
}
