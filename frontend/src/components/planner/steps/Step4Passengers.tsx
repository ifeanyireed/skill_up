import { motion } from 'framer-motion'
import { ArrowRight, User } from 'lucide-react'
import { useJourneyStore } from '../../../store/useJourneyStore'
import { fadeUp, staggerContainer, staggerItem } from '../../../lib/motion'

const RANGES = [
  { id: '1-4', label: '1–4', sub: 'Executive' },
  { id: '5-14', label: '5–14', sub: 'Small Group' },
  { id: '15-30', label: '15–30', sub: 'Medium Group' },
  { id: '31-60', label: '31–60', sub: 'Large Group' },
  { id: '60+', label: '60+', sub: 'Large Event' },
]

export function Step4Passengers() {
  const { passengers, setPassengers, nextStep, prevStep } = useJourneyStore()

  const isValid = !!passengers

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div style={{ flex: 1 }}>
        <motion.h2 variants={fadeUp} style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          How many passengers?
        </motion.h2>
        <motion.p variants={fadeUp} style={{ fontSize: '1rem', color: 'var(--color-nets-text-2)', marginBottom: '3rem' }}>
          This helps us recommend the perfect vehicle for your group.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {RANGES.map((range) => {
            const isSelected = passengers === range.id
            return (
              <motion.button
                key={range.id}
                variants={staggerItem}
                onClick={() => setPassengers(range.id)}
                whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  padding: '2rem 1rem',
                  background: isSelected ? 'var(--color-nets-navy-dark)' : '#fff',
                  border: isSelected ? '2px solid var(--color-nets-navy-dark)' : '2px solid var(--color-nets-border)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                <div style={{ color: isSelected ? 'var(--color-nets-red)' : 'var(--color-nets-text-3)', marginBottom: '0.5rem' }}>
                  <User size={24} />
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: isSelected ? '#fff' : 'var(--color-nets-navy-dark)', marginBottom: '0.25rem' }}>
                  {range.label}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--color-nets-text-3)' }}>
                  {range.sub}
                </div>
              </motion.button>
            )
          })}
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
