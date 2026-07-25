import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'
import { useJourneyStore } from '../../../store/useJourneyStore'
import { fadeUp, staggerContainer } from '../../../lib/motion'
import { MapboxAutocomplete } from '../MapboxAutocomplete'

export function Step3Destination() {
  const { pickup, destination, setDestination, nextStep, prevStep } = useJourneyStore()
  const [inputValue, setInputValue] = useState(destination?.address || '')

  const handleLocationSelect = (loc: any) => {
    if (loc) {
      setDestination(loc)
      setInputValue(loc.address)
    } else {
      // API unavailable fallback
      if (inputValue.length > 3) {
        setDestination({ address: inputValue, lat: 9.0765, lng: 7.3986 }) // Default fallback to Abuja centre
      } else {
        setDestination(null)
      }
    }
  }

  const isValid = !!destination && inputValue === destination.address

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div style={{ flex: 1 }}>
        <motion.h2 variants={fadeUp} style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          Where are you travelling to?
        </motion.h2>
        <motion.p variants={fadeUp} style={{ fontSize: '1rem', color: 'var(--color-nets-text-2)', marginBottom: '3rem' }}>
          Enter your final destination. You can add more stops in the extras section.
        </motion.p>

        <motion.div variants={fadeUp} style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', color: 'var(--color-nets-red)' }}>
            <MapPin size={20} />
          </div>
          
          <MapboxAutocomplete
            value={inputValue}
            onChange={(val) => {
              setInputValue(val)
              if (destination && val !== destination.address) setDestination(null)
            }}
            onLocationSelect={handleLocationSelect}
            placeholder="Search for a destination..."
            style={{
              width: '100%',
              padding: '1.25rem 1.25rem 1.25rem 3.5rem',
              fontSize: '1rem',
              background: '#fff',
              border: '2px solid var(--color-nets-border)',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
          />

          {!isValid && inputValue.length > 5 && (
             <div style={{ padding: '1rem 0.5rem', textAlign: 'left', color: 'var(--color-nets-text-3)', fontSize: '0.8125rem' }}>
               Press continue to use "{inputValue}" as a custom destination.
               <button 
                 onClick={() => handleLocationSelect(null)}
                 style={{ display: 'inline-block', marginLeft: '1rem', padding: '0.25rem 0.5rem', background: 'var(--color-nets-navy-dark)', color: '#fff', border: 'none', borderRadius: '2px', cursor: 'pointer' }}
               >
                 Confirm
               </button>
             </div>
          )}

        </motion.div>
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
