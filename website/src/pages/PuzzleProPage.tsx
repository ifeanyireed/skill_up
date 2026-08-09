// ============================================================================
// SkillUp Academy Website — PuzzlePro Gamified Coding Embed Page
// Route: /puzzlepro
// ============================================================================
import React from 'react'
import { Puzzle, ShieldCheck, Sparkles, Award } from 'lucide-react'

export function PuzzleProPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Hero Header */}
      <section
        style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '3.5rem 1.5rem 3rem',
          textAlign: 'center',
          borderBottom: '4px solid #DC2626',
        }}
      >
        <div className="container-nets" style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.4)',
              color: '#F87171',
              padding: '0.375rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={15} /> Gamified Coding Academy Portal
          </div>
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '0.75rem',
              color: '#FFFFFF',
            }}
          >
            SkillUp Academy <span style={{ color: '#F87171' }}>PuzzlePro</span>
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Master block coding, HTML, CSS, JavaScript, and Python through 636 gamified coding exercises and interactive challenges!
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginTop: '1.5rem',
              fontSize: '0.8125rem',
              color: 'rgba(255, 255, 255, 0.75)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <ShieldCheck size={16} color="#16A34A" /> Authenticated Embed Portal
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Award size={16} color="#F59E0B" /> 636 Coding Challenges
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Puzzle size={16} color="#3B82F6" /> Gamified Progress Tracking
            </div>
          </div>
        </div>
      </section>

      {/* Embedded iFrame Section */}
      <section style={{ marginTop: '2.5rem', padding: '0 1rem' }}>
        <div className="container-nets" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
            }}
          >
            <iframe
              src="https://learn2earnhq.com/embed?org_token=TOKEN_SKIL_9901"
              width="100%"
              height="750px"
              frameBorder="0"
              allowFullScreen
              title="PuzzlePro SkillUp Embed"
              style={{ display: 'block', width: '100%', minHeight: '750px', border: 'none' }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
