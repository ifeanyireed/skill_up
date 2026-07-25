// ============================================================================
// SkillUp Academy Website — CBT Centre Image Slideshow Component
// ============================================================================
import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    url: '/cbt-centre.jpeg',
    title: 'Modern CBT Centre Facility',
    subtitle: 'State-of-the-art computer labs & digital training infrastructure'
  },
  {
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
    title: 'Hands-On Tech & Coding Workshops',
    subtitle: 'Learn frontend development, Python, & fullstack engineering'
  },
  {
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    title: 'Interactive Group Mentorship',
    subtitle: 'Collaborate with passionate instructors & fellow learners'
  },
  {
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1200',
    title: 'UI/UX & Product Design Studio',
    subtitle: 'Master Figma, design systems, and practical user research'
  }
]

export function ImageSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % SLIDES.length)
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)

  return (
    <div className="block-slideshow-container" style={{ position: 'relative', height: '440px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
      <img
        src={SLIDES[currentIndex].url}
        alt={SLIDES[currentIndex].title}
        className="slideshow-image"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Overlay Gradient & Caption */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(13, 16, 96, 0.92) 0%, rgba(13, 16, 96, 0.3) 50%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '2rem',
          zIndex: 5
        }}
      >
        <span className="overline-dark" style={{ width: 'fit-content', marginBottom: '0.5rem' }}>
          FACILITY HIGHLIGHT
        </span>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', marginBottom: '0.375rem' }}>
          {SLIDES[currentIndex].title}
        </h3>
        <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.85)' }}>
          {SLIDES[currentIndex].subtitle}
        </p>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: '#fff',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: '#fff',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === currentIndex ? '24px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: i === currentIndex ? 'var(--color-nets-red)' : 'rgba(255,255,255,0.5)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          />
        ))}
      </div>
    </div>
  )
}
