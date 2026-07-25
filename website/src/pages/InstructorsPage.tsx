// ============================================================================
// SkillUp Academy Website — Instructors Page (NETS Swiss Enterprise Design System)
// Source UI Design System: ~/Downloads/nets-logistics/frontend
// ============================================================================
import React from 'react'
import { NavLink } from 'react-router-dom'
import { Linkedin, Mail, ArrowRight, ShieldCheck } from 'lucide-react'

const INSTRUCTORS = [
  {
    name: 'Coach Sarah Jenkins',
    role: 'Head of Tech & Lead Admin',
    bio: '10+ years software engineering experience. Specializes in Fullstack JavaScript, React, and CBT center operations.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    specialties: ['Web Development', 'React', 'Node.js', 'CBT Supervision']
  },
  {
    name: 'Coach Michael Davies',
    role: 'Lead UI/UX & Product Design Instructor',
    bio: 'Former senior product designer. Passionate about user-centered design, design systems, and Figma prototyping.',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    specialties: ['Figma Prototyping', 'User Research', 'Design Systems', 'Design Thinking']
  },
  {
    name: 'David O. Kovacs',
    role: 'Data Science & Python Instructor',
    bio: 'Data scientist & analyst focused on Python automation, machine learning models, and actionable business intelligence.',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    specialties: ['Python Data Analytics', 'Pandas & SQL', 'Machine Learning', 'Data Viz']
  },
  {
    name: 'Amina Patel',
    role: 'Cyber Security & Network Instructor',
    bio: 'Certified ethical hacker & network security specialist dedicated to training students in system security defense.',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    specialties: ['Network Security', 'Ethical Hacking', 'System Auditing', 'Firewall Config']
  }
]

export function InstructorsPage() {
  return (
    <div>
      <section className="section-py" style={{ background: 'var(--color-nets-navy-dark)', color: '#FFFFFF' }}>
        <div className="container-nets" style={{ textAlign: 'center', maxWidth: '720px' }}>
          <div className="overline-dark" style={{ justifyContent: 'center' }}>EXPERT MENTORS</div>
          <h1 className="text-d2" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>Meet Our Expert Instructors</h1>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255, 255, 255, 0.85)' }}>
            Learn from passionate instructors who bring real-world tech, design, and digital skills to life across Raji Rasaki Centre and CBT Centre.
          </p>
        </div>
      </section>

      <section className="section-py" style={{ background: 'var(--color-nets-light)' }}>
        <div className="container-nets">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.5rem' }}>
            {INSTRUCTORS.map((inst, i) => (
              <div key={i} className="card-nets" style={{ textAlign: 'center', borderTop: '3px solid var(--color-nets-red)' }}>
                <img
                  src={inst.photo}
                  alt={inst.name}
                  style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.25rem', border: '2px solid var(--color-nets-navy)' }}
                />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-nets-text)', marginBottom: '0.25rem' }}>{inst.name}</h3>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-nets-red)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  {inst.role}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)', marginBottom: '1.25rem', flex: 1 }}>
                  {inst.bio}
                </p>

                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  {inst.specialties.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        background: 'var(--color-nets-navy-10)',
                        borderRadius: '2px',
                        color: 'var(--color-nets-navy)',
                        fontWeight: 600
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--color-nets-border)' }}>
                  <a href="#linkedin" style={{ color: 'var(--color-nets-text-2)' }} aria-label="LinkedIn"><Linkedin size={16} /></a>
                  <a href="#mail" style={{ color: 'var(--color-nets-text-2)' }} aria-label="Email"><Mail size={16} /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-py" style={{ background: 'var(--color-nets-navy)', color: '#FFFFFF', textAlign: 'center' }}>
        <div className="container-nets" style={{ maxWidth: '640px' }}>
          <ShieldCheck size={36} color="var(--color-nets-red)" style={{ margin: '0 auto 1rem' }} />
          <h2 className="text-d3" style={{ color: '#FFFFFF', marginBottom: '0.75rem' }}>Want to Join Our Teaching Team?</h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', marginBottom: '1.75rem' }}>
            We are always looking for passionate industry professionals to instruct at our Raji Rasaki and CBT Centre locations.
          </p>
          <NavLink to="/contact" className="btn-nets btn-nets-red">
            Apply as Instructor <ArrowRight size={16} />
          </NavLink>
        </div>
      </section>
    </div>
  )
}
