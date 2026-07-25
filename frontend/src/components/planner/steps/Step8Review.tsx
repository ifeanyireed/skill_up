import { motion } from 'framer-motion'
import { ArrowRight, Edit2, ShieldCheck, Users, Calendar, MapPin, CheckCircle } from 'lucide-react'
import { useJourneyStore } from '../../../store/useJourneyStore'
import { vehicles } from '../../../data/vehicles'
import { fadeUp, staggerContainer, staggerItem } from '../../../lib/motion'

export function Step8Review() {
  const state = useJourneyStore()
  const vehicle = vehicles.find(v => v.id === state.recommendedVehicleId)
  
  const formattedDate = state.travelDate ? state.travelDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
  const formattedReturn = state.returnDate ? state.returnDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div style={{ flex: 1 }}>
        <motion.h2 variants={fadeUp} style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          Executive Journey Summary
        </motion.h2>
        <motion.p variants={fadeUp} style={{ fontSize: '1rem', color: 'var(--color-nets-text-2)', marginBottom: '3rem' }}>
          Please review your detailed itinerary before we generate your personalised estimate.
        </motion.p>

        <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Route Section */}
          <div style={{ background: '#fff', border: '1px solid var(--color-nets-border)', padding: '2rem', position: 'relative' }}>
            <button onClick={() => state.setStep(2)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--color-nets-light)', border: 'none', color: 'var(--color-nets-navy-dark)', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
              <Edit2 size={14} /> Edit Route
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <MapPin size={18} color="var(--color-nets-red)" />
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-navy)' }}>Route Information</h3>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.25rem', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--color-nets-navy)' }} />
                <div style={{ width: '2px', height: '24px', background: 'var(--color-nets-border)' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-nets-red)' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-nets-text-3)', marginBottom: '0.25rem' }}>Pickup</div>
                  <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{state.pickup?.address}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-nets-text-3)', marginBottom: '0.25rem' }}>Destination</div>
                  <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{state.destination?.address}</div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-nets-border)' }}>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-nets-text-3)' }}>Distance</div>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{state.distanceKm} km</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-nets-text-3)' }}>Est. Duration</div>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{state.durationMins} mins</div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div style={{ background: '#fff', border: '1px solid var(--color-nets-border)', padding: '2rem', position: 'relative' }}>
            <button onClick={() => state.setStep(5)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--color-nets-light)', border: 'none', color: 'var(--color-nets-navy-dark)', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
              <Edit2 size={14} /> Edit Schedule
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Calendar size={18} color="var(--color-nets-red)" />
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-navy)' }}>Schedule</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-nets-text-3)', marginBottom: '0.25rem' }}>Departing</div>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{formattedDate} at {state.departureTime}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-nets-text-3)', marginBottom: '0.25rem' }}>Journey Type</div>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>
                  {state.tripType} {formattedReturn && `(Until ${formattedReturn})`}
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle & Passengers */}
          <div style={{ background: '#fff', border: '1px solid var(--color-nets-border)', padding: '2rem', position: 'relative' }}>
            <button onClick={() => state.setStep(4)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--color-nets-light)', border: 'none', color: 'var(--color-nets-navy-dark)', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
              <Edit2 size={14} /> Edit Group
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Users size={18} color="var(--color-nets-red)" />
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-navy)' }}>Vehicle & Group</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-nets-text-3)', marginBottom: '0.25rem' }}>Passengers</div>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{state.passengers} People</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-nets-text-3)', marginBottom: '0.25rem' }}>Recommended Vehicle</div>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{vehicle?.name || 'Pending'}</div>
              </div>
            </div>
          </div>

          {/* Extras */}
          {(state.extras.length > 0 || state.customRequest) && (
            <div style={{ background: '#fff', border: '1px solid var(--color-nets-border)', padding: '2rem', position: 'relative' }}>
              <button onClick={() => state.setStep(6)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--color-nets-light)', border: 'none', color: 'var(--color-nets-navy-dark)', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
                <Edit2 size={14} /> Edit Extras
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <CheckCircle size={18} color="var(--color-nets-red)" />
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-navy)' }}>Personalisation</h3>
              </div>
              {state.extras.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: state.customRequest ? '1rem' : 0 }}>
                  {state.extras.map(e => (
                    <span key={e} style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)', background: 'var(--color-nets-light)', padding: '0.375rem 0.75rem', borderRadius: '4px' }}>
                      {e}
                    </span>
                  ))}
                </div>
              )}
              {state.customRequest && (
                <div style={{ background: 'var(--color-nets-light)', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-nets-text-3)', marginBottom: '0.25rem' }}>Custom Instructions</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-navy-dark)', fontStyle: 'italic', margin: 0 }}>
                    "{state.customRequest}"
                  </p>
                </div>
              )}
            </div>
          )}

        </motion.div>
      </div>

      <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-nets-border)' }}>
        <button
          onClick={state.prevStep}
          style={{ background: 'transparent', border: 'none', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-nets-text-2)', cursor: 'pointer' }}
        >
          Back
        </button>
        <button
          onClick={state.nextStep}
          className="btn btn-navy"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Calculate Estimate <ArrowRight size={16} />
        </button>
      </motion.div>

    </motion.div>
  )
}
