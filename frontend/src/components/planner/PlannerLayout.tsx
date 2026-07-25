import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useJourneyStore } from '../../store/useJourneyStore'
import { JourneySummary } from './JourneySummary'
import { InteractiveMap } from './InteractiveMap'

interface Props {
  children: React.ReactNode
}

export function PlannerLayout({ children }: Props) {
  const { currentStep } = useJourneyStore()
  const progressPercentage = (currentStep / 10) * 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-nets-white)' }}>
      {/* Top Nav (Mobile only, desktop uses split) */}
      <div className="lg:hidden" style={{ padding: '1rem', background: '#fff', borderBottom: '1px solid var(--color-nets-border)' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-nets-navy-dark)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Exit Planner
        </Link>
      </div>

      <div style={{ display: 'flex', flex: 1 }} className="flex-col lg:flex-row">
        
        {/* Left Panel - Form Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', position: 'relative', zIndex: 10 }}>
          
          {/* Header & Progress (Desktop) */}
          <div className="hidden lg:flex" style={{ padding: '2rem 3rem', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-nets-border)' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-nets-navy-dark)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Exit Planner
            </Link>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-text-3)' }}>
                Step {currentStep} of 10
              </span>
              <div style={{ width: '120px', height: '4px', background: 'var(--color-nets-border)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'var(--color-nets-red)' }}
                />
              </div>
            </div>
          </div>

          {/* Progress (Mobile) */}
          <div className="lg:hidden" style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-nets-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-text-3)' }}>
                Step {currentStep} of 10
              </span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'var(--color-nets-border)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ height: '100%', background: 'var(--color-nets-red)' }}
              />
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem' }} className="lg:px-12 lg:py-8 h-[calc(100vh-130px)] lg:h-[calc(100vh-85px)]">
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              {children}
            </div>
          </div>

        </div>

        {/* Right Panel - Map & Summary */}
        <div style={{ flex: 1, position: 'relative', background: 'var(--color-nets-light)', display: 'flex', flexDirection: 'column' }} className="lg:border-l lg:border-[var(--color-nets-border)] h-[50vh] lg:h-[100vh] lg:sticky lg:top-0">
          
          <div style={{ flex: 1, position: 'relative', minHeight: '300px' }}>
            <InteractiveMap />
          </div>

          {/* Floating or docked Journey Summary */}
          <div style={{ padding: '1.5rem', background: '#fff', borderTop: '1px solid var(--color-nets-border)', zIndex: 20 }}>
            <JourneySummary />
          </div>

        </div>

      </div>
    </div>
  )
}
