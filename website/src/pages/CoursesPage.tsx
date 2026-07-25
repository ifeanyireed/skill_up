// ============================================================================
// SkillUp Academy Website — Courses Page (NETS Swiss Enterprise Design System)
// Source UI Design System: ~/Downloads/nets-logistics/frontend
// ============================================================================
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ArrowRight, Search, Clock, CheckCircle2 } from 'lucide-react'

const COURSES = [
  {
    id: 'c-1',
    category: 'tech',
    title: 'Fullstack Web Development',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
    description: 'Learn modern web development using HTML, CSS, JavaScript, React, Node.js, and SQL databases.',
    duration: '12 Weeks',
    level: 'Beginner to Advanced',
    price: '$299',
    topics: ['Responsive Web Design', 'React & Hooks', 'REST API Architecture', 'Database Management']
  },
  {
    id: 'c-2',
    category: 'design',
    title: 'UI/UX & Digital Product Design',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=600',
    description: 'Master user research, wireframing, interactive prototyping in Figma, and design system building.',
    duration: '8 Weeks',
    level: 'Beginner Friendly',
    price: '$249',
    topics: ['User Persona & Journey Maps', 'Figma Mastery', 'Wireframing & Prototyping', 'Design Systems']
  },
  {
    id: 'c-3',
    category: 'tech',
    title: 'Python & Data Analytics',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    description: 'Analyze real-world data, build interactive dashboards, and master Pandas, NumPy, and Data Visualization.',
    duration: '10 Weeks',
    level: 'Intermediate',
    price: '$279',
    topics: ['Python Essentials', 'Data Cleaning with Pandas', 'Matplotlib & Seaborn', 'SQL Querying']
  },
  {
    id: 'c-4',
    category: 'tech',
    title: 'Cyber Security & Network Safety',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600',
    description: 'Understand network security fundamentals, threat analysis, ethical hacking techniques, and system hardening.',
    duration: '10 Weeks',
    level: 'Intermediate',
    price: '$320',
    topics: ['Network Protocols', 'Ethical Hacking Intro', 'Vulnerability Assessment', 'Data Encryption']
  },
  {
    id: 'c-5',
    category: 'design',
    title: 'Graphic Design & Brand Identity',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600',
    description: 'Create memorable logos, brand kits, typography, and visual assets for digital and print media.',
    duration: '6 Weeks',
    level: 'Beginner Friendly',
    price: '$199',
    topics: ['Color Theory', 'Typography Principles', 'Logo & Brand Identity', 'Photoshop & Illustrator']
  },
  {
    id: 'c-6',
    category: 'digital',
    title: 'Digital Marketing & Social Media Growth',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
    description: 'Drive traffic, run targeted ad campaigns, master SEO, and convert leads across social media platforms.',
    duration: '6 Weeks',
    level: 'All Levels',
    price: '$189',
    topics: ['Search Engine Optimization (SEO)', 'Content Strategy', 'Facebook & Google Ads', 'Analytics']
  }
]

export function CoursesPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = COURSES.filter((course) => {
    const matchesTab = activeTab === 'all' || course.category === activeTab
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div>
      <section className="section-py" style={{ background: 'var(--color-nets-navy-dark)', color: '#FFFFFF' }}>
        <div className="container-nets" style={{ textAlign: 'center', maxWidth: '720px' }}>
          <div className="overline-dark" style={{ justifyContent: 'center' }}>COURSE CATALOG</div>
          <h1 className="text-d2" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>Courses for Career Growth</h1>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255, 255, 255, 0.85)' }}>
            Explore beginner to intermediate courses in tech, design, and digital skills designed to boost your career at Raji Rasaki & CBT Centre.
          </p>

          <div
            style={{
              marginTop: '2rem',
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.625rem 1.25rem',
              maxWidth: '500px',
              margin: '2rem auto 0'
            }}
          >
            <Search size={18} color="rgba(255,255,255,0.7)" style={{ marginRight: '0.75rem' }} />
            <input
              type="text"
              placeholder="Search courses (e.g. Fullstack, Figma, Python)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                outline: 'none',
                fontSize: '0.9375rem'
              }}
            />
          </div>
        </div>
      </section>

      <section className="section-py" style={{ background: 'var(--color-nets-light)' }}>
        <div className="container-nets">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('all')}
              className={`btn-nets ${activeTab === 'all' ? 'btn-nets-primary' : 'btn-nets-outline'}`}
            >
              All Programs
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`btn-nets ${activeTab === 'tech' ? 'btn-nets-primary' : 'btn-nets-outline'}`}
            >
              Tech & Coding
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`btn-nets ${activeTab === 'design' ? 'btn-nets-primary' : 'btn-nets-outline'}`}
            >
              UI/UX & Design
            </button>
            <button
              onClick={() => setActiveTab('digital')}
              className={`btn-nets ${activeTab === 'digital' ? 'btn-nets-primary' : 'btn-nets-outline'}`}
            >
              Digital Skills
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
            {filteredCourses.map((course) => (
              <div key={course.id} className="card-nets" style={{ padding: 0, overflow: 'hidden' }}>
                <img src={course.image} alt={course.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-nets-red)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                    {course.category.toUpperCase()} • {course.level}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-nets-text)', marginBottom: '0.5rem' }}>{course.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)', marginBottom: '1.25rem', flex: 1 }}>{course.description}</p>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-nets-text)', marginBottom: '0.5rem' }}>Key Modules:</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {course.topics.map((t, idx) => (
                        <li key={idx} style={{ fontSize: '0.8125rem', color: 'var(--color-nets-text-2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={13} color="var(--color-nets-red)" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--color-nets-border)', fontSize: '0.875rem', color: 'var(--color-nets-text-2)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {course.duration}</span>
                    <strong style={{ color: 'var(--color-nets-navy)', fontSize: '1.125rem' }}>{course.price}</strong>
                  </div>

                  <NavLink
                    to="/contact"
                    className="btn-nets btn-nets-primary"
                    style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
                  >
                    Enroll in Course <ArrowRight size={15} />
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
