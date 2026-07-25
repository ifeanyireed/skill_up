import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Users, Briefcase, Wind } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useJourneyStore } from '../../../store/useJourneyStore'
import { vehicles } from '../../../data/vehicles'
import { fadeUp, staggerContainer } from '../../../lib/motion'

export function Step7Recommendation() {
  const { passengers, recommendedVehicleId, setRecommendedVehicleId, selectedVehicleId, setSelectedVehicleId, nextStep, prevStep } = useJourneyStore()

  useEffect(() => {
    // Simple logic to recommend a vehicle based on passenger range
    let recommended = vehicles.find(v => v.id === 'hiace') // Default
    
    switch (passengers) {
      case '1-4': recommended = vehicles.find(v => v.id === 'suv') || recommended; break
      case '5-14': recommended = vehicles.find(v => v.id === 'hiace') || recommended; break
      case '15-30': recommended = vehicles.find(v => v.id === 'coaster') || recommended; break
      case '31-60': recommended = vehicles.find(v => v.id === 'coaster') || recommended; break
      case '60+': recommended = vehicles.find(v => v.id === 'coaster') || recommended; break
    }

    if (recommended && recommended.id !== recommendedVehicleId) {
      setRecommendedVehicleId(recommended.id)
    }
  }, [passengers, recommendedVehicleId, setRecommendedVehicleId])

  // Determine minimum passenger capacity required
  let minCapacity = 14 // default
  switch (passengers) {
    case '1-4': minCapacity = 4; break
    case '5-14': minCapacity = 14; break
    case '15-30': minCapacity = 30; break
    case '31-60': minCapacity = 50; break
    case '60+': minCapacity = 50; break
  }

  const activeVehicleId = selectedVehicleId || recommendedVehicleId
  const vehicle = vehicles.find(v => v.id === activeVehicleId)
  const recommendedVehicle = vehicles.find(v => v.id === recommendedVehicleId)
  const isCapacityWarning = vehicle && vehicle.capacity < minCapacity

  if (!vehicle) return null

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div style={{ flex: 1 }}>
        <motion.h2 variants={fadeUp} style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          Choose Your Vehicle
        </motion.h2>
        <motion.p variants={fadeUp} style={{ fontSize: '1rem', color: 'var(--color-nets-text-2)', marginBottom: '2.5rem' }}>
          Select the vehicle that best suits your journey requirements.
        </motion.p>

        <motion.div variants={fadeUp} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {vehicles.map((v) => {
            const isSelected = activeVehicleId === v.id;
            const isRecommended = recommendedVehicleId === v.id;

            return (
              <div 
                key={v.id} 
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  background: isSelected ? 'rgba(0, 31, 95, 0.02)' : '#fff', 
                  border: isSelected ? '2px solid var(--color-nets-navy-dark)' : '1px solid var(--color-nets-border)', 
                  borderRadius: '4px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--color-nets-light)' }}>
                  <img src={v.imageUrl} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {isRecommended && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--color-nets-red)', color: '#fff', padding: '0.25rem 0.75rem', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      Recommended
                    </div>
                  )}
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-navy)', marginBottom: '0.5rem' }}>
                    {v.category}
                  </div>
                  <h3 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--color-nets-navy-dark)', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                    {v.name}
                  </h3>

                  {/* Specs Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <Users size={16} color="var(--color-nets-red)" style={{ marginTop: '0.125rem' }} />
                      <div>
                        <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-nets-text-3)' }}>Capacity</div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{v.capacity} Passengers</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <Briefcase size={16} color="var(--color-nets-red)" style={{ marginTop: '0.125rem' }} />
                      <div>
                        <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-nets-text-3)' }}>Luggage</div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{v.luggageSpace?.split(' ')[0] || 'Standard'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <Wind size={16} color="var(--color-nets-red)" style={{ marginTop: '0.125rem' }} />
                      <div>
                        <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-nets-text-3)' }}>Climate</div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{v.airConditioning || 'A/C'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', gridColumn: 'span 2' }}>
                      <ShieldCheck size={16} color="var(--color-nets-red)" style={{ marginTop: '0.125rem' }} />
                      <div>
                        <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-nets-text-3)' }}>Recommended For</div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{v.bestFor}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedVehicleId(v.id)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isSelected ? 'var(--color-nets-navy-dark)' : 'transparent',
                      color: isSelected ? '#fff' : 'var(--color-nets-navy-dark)',
                      border: isSelected ? '1px solid var(--color-nets-navy-dark)' : '1px solid var(--color-nets-border)',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isSelected ? 'Selected' : 'Select Vehicle'}
                  </button>
                </div>
              </div>
            )
          })}
        </motion.div>

        {isCapacityWarning && recommendedVehicle && (
          <motion.div variants={fadeUp} style={{ 
            padding: '1rem', 
            background: 'rgba(255, 170, 0, 0.1)', 
            borderLeft: '4px solid #ffaa00',
            color: 'var(--color-nets-navy-dark)',
            fontSize: '0.875rem',
            lineHeight: 1.5
          }}>
            The selected <strong>{vehicle.name}</strong> may not comfortably accommodate your party size. We recommend choosing a <strong>{recommendedVehicle.name}</strong> instead.
          </motion.div>
        )}
      </div>

      <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-nets-border)' }}>
        <button
          onClick={prevStep}
          style={{ background: 'transparent', border: 'none', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-nets-text-2)', cursor: 'pointer' }}
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="btn btn-navy"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Continue <ArrowRight size={16} />
        </button>
      </motion.div>

    </motion.div>
  )
}
