import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { useJourneyStore, TripType } from '../../../store/useJourneyStore'
import { fadeUp, staggerContainer, staggerItem } from '../../../lib/motion'

const TRIP_TYPES: TripType[] = ['One Way', 'Return', 'Multi-Day', 'Recurring']

export function Step5Schedule() {
  const state = useJourneyStore()
  const { travelDate, setTravelDate, departureTime, setDepartureTime, tripType, setTripType, returnDate, setReturnDate, nextStep, prevStep } = state

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, isReturn = false) => {
    if (e.target.value) {
      const d = new Date(e.target.value)
      isReturn ? setReturnDate(d) : setTravelDate(d)
    }
  }

  const isValid = !!travelDate && !!departureTime && (tripType !== 'Return' || !!returnDate)

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div style={{ flex: 1 }}>
        <motion.h2 variants={fadeUp} style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          When are you travelling?
        </motion.h2>
        <motion.p variants={fadeUp} style={{ fontSize: '1rem', color: 'var(--color-nets-text-2)', marginBottom: '3rem' }}>
          Let us know your schedule to ensure vehicle availability.
        </motion.p>

        {/* Trip Type Selector */}
        <motion.div variants={fadeUp} style={{ display: 'flex', background: 'var(--color-nets-light)', padding: '0.25rem', borderRadius: '4px', marginBottom: '2.5rem' }}>
          {TRIP_TYPES.map((type) => {
            const isSelected = tripType === type
            return (
              <button
                key={type}
                onClick={() => setTripType(type)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  background: isSelected ? '#fff' : 'transparent',
                  color: isSelected ? 'var(--color-nets-navy-dark)' : 'var(--color-nets-text-2)',
                  border: 'none',
                  borderRadius: '2px',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {type}
              </button>
            )
          })}
        </motion.div>

        {/* Date & Time Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          {/* Departure Date */}
          <motion.div variants={staggerItem} style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-navy)', marginBottom: '0.5rem' }}>
              Departure Date
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-nets-text-3)', pointerEvents: 'none' }}>
                <Calendar size={18} />
              </div>
              <input
                type="date"
                value={travelDate ? travelDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange(e, false)}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  fontSize: '1rem',
                  background: '#fff',
                  border: '2px solid var(--color-nets-border)',
                  outline: 'none',
                  color: 'var(--color-nets-navy-dark)',
                  transition: 'border-color 0.2s ease',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-nets-navy-dark)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-nets-border)'}
              />
            </div>
          </motion.div>

          {/* Departure Time */}
          <motion.div variants={staggerItem} style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-navy)', marginBottom: '0.5rem' }}>
              Pickup Time
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-nets-text-3)', pointerEvents: 'none' }}>
                <Clock size={18} />
              </div>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  fontSize: '1rem',
                  background: '#fff',
                  border: '2px solid var(--color-nets-border)',
                  outline: 'none',
                  color: 'var(--color-nets-navy-dark)',
                  transition: 'border-color 0.2s ease',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-nets-navy-dark)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-nets-border)'}
              />
            </div>
          </motion.div>

          {/* Return Date (if applicable) */}
          {(tripType === 'Return' || tripType === 'Multi-Day') && (
            <motion.div variants={fadeUp} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ gridColumn: 'span 2', position: 'relative', marginTop: '0.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-navy)', marginBottom: '0.5rem' }}>
                {tripType === 'Return' ? 'Return Date' : 'End Date'}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-nets-text-3)', pointerEvents: 'none' }}>
                  <Calendar size={18} />
                </div>
                <input
                  type="date"
                  value={returnDate ? returnDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateChange(e, true)}
                  min={travelDate ? travelDate.toISOString().split('T')[0] : ''}
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem',
                    fontSize: '1rem',
                    background: '#fff',
                    border: '2px solid var(--color-nets-border)',
                    outline: 'none',
                    color: 'var(--color-nets-navy-dark)',
                    transition: 'border-color 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-nets-navy-dark)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-nets-border)'}
                />
              </div>
            </motion.div>
          )}
        </div>
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
          disabled={!isValid}
          className="btn btn-navy"
          style={{ opacity: isValid ? 1 : 0.5, pointerEvents: isValid ? 'auto' : 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Continue <ArrowRight size={16} />
        </button>
      </motion.div>

    </motion.div>
  )
}
