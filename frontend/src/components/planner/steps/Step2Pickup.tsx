import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'
import { useJourneyStore } from '../../../store/useJourneyStore'
import { fadeUp, staggerContainer } from '../../../lib/motion'
import { MapboxAutocomplete } from '../MapboxAutocomplete'

export function Step2Pickup() {
  const { pickup, setPickup, nextStep, prevStep } = useJourneyStore()
  const [inputValue, setInputValue] = useState(pickup?.address || '')

  // Fallback lat/lng for when Places API is disabled (no API key) but the user still types an address.
  // In a real production build with a key, onLocationSelect will return exact coordinates.
  const handleLocationSelect = (loc: any) => {
    if (loc) {
      setPickup(loc)
      setInputValue(loc.address)
    } else {
      // API unavailable or free-text entered without selecting suggestion
      if (inputValue.length > 3) {
        setPickup({ address: inputValue, lat: 6.5244, lng: 3.3792 }) // Default fallback to Lagos centre
      } else {
        setPickup(null)
      }
    }
  }

  const isValid = !!pickup && inputValue === pickup.address

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div style={{ flex: 1 }}>
        <motion.h2 variants={fadeUp} style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          Where are you travelling from?
        </motion.h2>
        <motion.p variants={fadeUp} style={{ fontSize: '1rem', color: 'var(--color-nets-text-2)', marginBottom: '3rem' }}>
          Enter your starting point. We'll automatically fetch intelligent route insights.
        </motion.p>

        <motion.div variants={fadeUp} style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', color: 'var(--color-nets-navy)' }}>
            <MapPin size={20} />
          </div>
          
          <MapboxAutocomplete
            value={inputValue}
            onChange={(val) => {
              setInputValue(val)
              if (pickup && val !== pickup.address) setPickup(null)
            }}
            onLocationSelect={handleLocationSelect}
            placeholder="Search for a pickup location or address..."
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
          
          {/* Note: In development mode without an API key, pressing Enter or blurring the input with valid text will trigger the fallback Lagos coordinates */}
          {!isValid && inputValue.length > 5 && (
             <div style={{ padding: '1rem 0.5rem', textAlign: 'left', color: 'var(--color-nets-text-3)', fontSize: '0.8125rem' }}>
               Press continue to use "{inputValue}" as a custom address.
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
