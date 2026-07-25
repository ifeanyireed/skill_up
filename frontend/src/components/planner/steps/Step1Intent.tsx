import { motion } from 'framer-motion'
import { Building2, Plane, PartyPopper, GraduationCap, Church, Presentation, Map, Users, RefreshCw, Navigation } from 'lucide-react'
import { useJourneyStore, JourneyIntent } from '../../../store/useJourneyStore'
import { fadeUp, staggerContainer, staggerItem } from '../../../lib/motion'

const INTENTS: { id: JourneyIntent, title: string, desc: string, icon: any }[] = [
  { id: 'General Transport', title: 'General Transport', desc: "Flexible transport for journeys that don't fall into a specific category.", icon: Navigation },
  { id: 'Corporate Staff Transport', title: 'Corporate Staff', desc: 'Executive teams and employee shuttles', icon: Building2 },
  { id: 'Airport Transfer', title: 'Airport Transfer', desc: 'Reliable pickup and drop-off', icon: Plane },
  { id: 'Wedding & Events', title: 'Weddings & Events', desc: 'Seamless guest transportation', icon: PartyPopper },
  { id: 'School Transport', title: 'School Transport', desc: 'Safe travel for students and staff', icon: GraduationCap },
  { id: 'Religious Groups', title: 'Religious Groups', desc: 'Conventions and pilgrimages', icon: Church },
  { id: 'Conference & Exhibitions', title: 'Conferences', desc: 'Large-scale delegate movement', icon: Presentation },
  { id: 'Tourism & Excursions', title: 'Tourism', desc: 'Comfortable sightseeing travel', icon: Map },
  { id: 'Private Group Travel', title: 'Private Group', desc: 'Custom trips for friends & family', icon: Users },
  { id: 'Recurring Staff Shuttle', title: 'Recurring Shuttle', desc: 'Contracted daily transport', icon: RefreshCw },
]

export function Step1Intent() {
  const { intent, setIntent, nextStep } = useJourneyStore()

  const handleSelect = (id: JourneyIntent) => {
    setIntent(id)
    // Small delay for the animation to play before transitioning
    setTimeout(() => nextStep(), 300)
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.h2 variants={fadeUp} style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
        What kind of journey are you planning today?
      </motion.h2>
      <motion.p variants={fadeUp} style={{ fontSize: '1rem', color: 'var(--color-nets-text-2)', marginBottom: '3rem' }}>
        Select the primary purpose of your trip so we can personalise your experience.
      </motion.p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {INTENTS.map((item) => {
          const isSelected = intent === item.id
          const Icon = item.icon
          
          return (
            <motion.button
              key={item.id}
              variants={staggerItem}
              onClick={() => handleSelect(item.id)}
              whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: '1.5rem',
                background: isSelected ? 'var(--color-nets-navy-dark)' : '#fff',
                border: isSelected ? '2px solid var(--color-nets-navy-dark)' : '2px solid var(--color-nets-border)',
                borderRadius: '0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '40px', height: '40px',
                background: isSelected ? 'rgba(255,255,255,0.1)' : 'var(--color-nets-light)',
                color: isSelected ? '#fff' : 'var(--color-nets-navy-dark)',
                marginBottom: '1rem'
              }}>
                <Icon size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: isSelected ? '#fff' : 'var(--color-nets-navy-dark)', marginBottom: '0.25rem' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.75rem', color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--color-nets-text-3)', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
