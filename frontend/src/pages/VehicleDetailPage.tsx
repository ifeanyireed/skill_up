import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Briefcase, Wind, ShieldCheck, Check } from 'lucide-react'
import { vehicleService } from '../services/vehicleService'
import { Vehicle } from '../types'
import { fadeUp, staggerContainer, staggerItem } from '../lib/motion'

export function VehicleDetailPage() {
  const { vehicleSlug } = useParams()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (vehicleSlug) {
      vehicleService.getVehicleBySlug(vehicleSlug).then((v) => {
        setVehicle(v || null)
        setIsLoading(false)
      })
    }
  }, [vehicleSlug])

  if (isLoading) {
    return (
      <div style={{ paddingTop: '200px', minHeight: '100vh', textAlign: 'center', background: 'var(--color-nets-navy)', color: '#fff' }}>
        <h2>Loading Vehicle Details...</h2>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div style={{ paddingTop: '200px', minHeight: '100vh', textAlign: 'center', background: 'var(--color-nets-navy)' }}>
        <h1 style={{ color: '#fff' }}>Vehicle not found</h1>
        <Link to="/fleet" className="btn btn-outline-white" style={{ marginTop: '2rem' }}>Back to Fleet</Link>
      </div>
    )
  }

  return (
    <article style={{ background: 'var(--color-nets-white)' }}>
      {/* Cinematic Hero */}
      <header style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'flex-end', paddingBottom: '4rem' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'var(--color-nets-navy-dark)' }}>
          <img
            src={vehicle.imageUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(13,16,96,0) 0%, var(--color-nets-navy-dark) 100%)',
          }} />
        </div>

        <div className="container-nets" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <Link
            to="/fleet"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 600,
              textDecoration: 'none', marginBottom: '4rem', transition: 'color 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          >
            <ArrowLeft size={16} /> Back to Fleet
          </Link>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={staggerItem} style={{ marginBottom: '1.5rem' }}>
              <span style={{
                background: 'var(--color-nets-red)',
                color: '#fff',
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                {vehicle.category}
              </span>
            </motion.div>
            
            <motion.h1
              variants={staggerItem}
              className="text-d1 fw-300"
              style={{ color: '#fff', marginBottom: '1.5rem' }}
            >
              {vehicle.name}
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="text-body-xl"
              style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px' }}
            >
              {vehicle.bestFor}
            </motion.p>
          </motion.div>
        </div>
      </header>

      <div className="container-nets section-py-lg">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4rem' }}>
          
          {/* Main Content (Left) */}
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-8">
            
            {/* Editorial Story */}
            <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} style={{ marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '1.5rem' }}>Overview</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--color-nets-text-2)', lineHeight: 1.8 }}>
                {vehicle.editorialStory}
              </p>
            </motion.section>

            {/* Specifications Grid */}
            <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} style={{ marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '2rem' }}>Vehicle Specifications</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                <div style={{ borderTop: '2px solid var(--color-nets-border)', paddingTop: '1.5rem' }}>
                  <Users size={24} color="var(--color-nets-red)" style={{ marginBottom: '1rem' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-text-3)', marginBottom: '0.5rem' }}>Capacity</div>
                  <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{vehicle.capacity} Passengers</div>
                </div>

                <div style={{ borderTop: '2px solid var(--color-nets-border)', paddingTop: '1.5rem' }}>
                  <ShieldCheck size={24} color="var(--color-nets-red)" style={{ marginBottom: '1rem' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-text-3)', marginBottom: '0.5rem' }}>Comfort Rating</div>
                  <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{vehicle.comfortRating || 'Standard'}</div>
                </div>

                <div style={{ borderTop: '2px solid var(--color-nets-border)', paddingTop: '1.5rem' }}>
                  <Wind size={24} color="var(--color-nets-red)" style={{ marginBottom: '1rem' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-text-3)', marginBottom: '0.5rem' }}>Climate Control</div>
                  <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{vehicle.airConditioning || 'Air Conditioning'}</div>
                </div>

                <div style={{ borderTop: '2px solid var(--color-nets-border)', paddingTop: '1.5rem' }}>
                  <Briefcase size={24} color="var(--color-nets-red)" style={{ marginBottom: '1rem' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-text-3)', marginBottom: '0.5rem' }}>Luggage</div>
                  <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{vehicle.luggageSpace || 'Standard Space'}</div>
                </div>
              </div>
            </motion.section>

            {/* Feature List */}
            <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} style={{ marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '2rem' }}>Key Features</h2>
              <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {vehicle.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem', color: 'var(--color-nets-navy-dark)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', background: 'var(--color-nets-light)', borderRadius: '50%' }}>
                      <Check size={14} color="var(--color-nets-red)" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Gallery */}
            {vehicle.gallery && vehicle.gallery.length > 0 && (
              <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '2rem' }}>Gallery</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {vehicle.gallery.map((img, i) => (
                    <div key={i} style={{ aspectRatio: '4/3', overflow: 'hidden', background: 'var(--color-nets-light)' }}>
                      <img src={img} alt={`${vehicle.name} view ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

          </div>

          {/* Sticky Sidebar (Right) */}
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-4">
            <div style={{ position: 'sticky', top: '120px' }}>
              
              {/* Intelligent Recommendation UI */}
              <div style={{ background: 'var(--color-nets-light)', padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-navy)', marginBottom: '1.5rem' }}>
                  Intelligent Recommendation
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Based on our operational data, this vehicle excels at:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {vehicle.recommendedFor?.map(use => (
                    <div key={use} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>
                      <div style={{ width: '4px', height: '4px', background: 'var(--color-nets-red)', borderRadius: '50%' }} />
                      {use}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Panel */}
              <div style={{ background: 'var(--color-nets-navy-dark)', padding: '2.5rem', color: '#fff', borderTop: '3px solid var(--color-nets-red)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 300, marginBottom: '1rem' }}>Ready to book?</h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', lineHeight: 1.6 }}>
                  Our transport specialists are ready to design a solution tailored to your exact requirements.
                </p>
                <Link to="/plan" className="btn btn-red" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                  Plan Your Journey
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </article>
  )
}
