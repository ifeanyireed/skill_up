import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, MapPin, Plus, Trash2 } from 'lucide-react'
import { useJourneyStore, LocationData } from '../../../store/useJourneyStore'
import { fadeUp, staggerContainer, staggerItem } from '../../../lib/motion'
import { MapboxAutocomplete } from '../MapboxAutocomplete'

const EXTRAS = [
  'Multiple Stops',
  'Airport Pickup / Drop-off',
  'Extra Luggage',
  'Executive / VIP Service',
  'Accessibility Requirements',
  'Wait-and-Return Service',
  'Overnight Trip',
  'Tour / Sightseeing',
  'Child-Friendly Transport',
  'Custom Request'
]

export function Step6Extras() {
  const { extras, toggleExtra, customRequest, setCustomRequest, stops, addStop, updateStop, removeStop, nextStep, prevStep } = useJourneyStore()
  const showCustom = extras.includes('Custom Request')
  const showStops = extras.includes('Multiple Stops')

  const handleStopLocationSelect = (index: number, loc: LocationData | null, fallbackText: string) => {
    if (loc) {
      updateStop(index, loc)
    } else {
      // Fallback
      if (fallbackText.length > 3) {
        updateStop(index, { address: fallbackText, lat: 6.5244, lng: 3.3792 })
      }
    }
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div style={{ flex: 1 }}>
        <motion.h2 variants={fadeUp} style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          Personalise your journey
        </motion.h2>
        <motion.p variants={fadeUp} style={{ fontSize: '1rem', color: 'var(--color-nets-text-2)', marginBottom: '3rem' }}>
          Select any additional services or routing requirements.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {EXTRAS.map((item) => {
            const isSelected = extras.includes(item)
            return (
              <motion.button
                key={item}
                variants={staggerItem}
                onClick={() => {
                  toggleExtra(item)
                  // If they deselect stops, we could clear them, but let's keep them in store just in case
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.5rem',
                  background: isSelected ? 'var(--color-nets-light)' : '#fff',
                  border: isSelected ? '2px solid var(--color-nets-red)' : '2px solid var(--color-nets-border)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '24px', height: '24px', flexShrink: 0,
                  background: isSelected ? 'var(--color-nets-red)' : 'transparent',
                  border: isSelected ? 'none' : '2px solid var(--color-nets-border)',
                  color: '#fff', borderRadius: '4px'
                }}>
                  {isSelected && <Check size={14} />}
                </div>
                <span style={{ fontSize: '0.9375rem', fontWeight: isSelected ? 600 : 500, color: 'var(--color-nets-navy-dark)' }}>
                  {item}
                </span>
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {showStops && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: '2rem' }}
            >
              <div style={{ background: 'var(--color-nets-light)', padding: '1.5rem', border: '1px solid var(--color-nets-border)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-navy)' }}>
                    Intermediate Stops
                  </label>
                  <button 
                    onClick={() => addStop({ address: '', lat: 0, lng: 0 })}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--color-nets-red)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    <Plus size={14} /> Add Stop
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stops.map((stop, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-nets-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <MapboxAutocomplete
                          value={stop.address}
                          onChange={(val) => updateStop(i, { ...stop, address: val })}
                          onLocationSelect={(loc) => handleStopLocationSelect(i, loc, stop.address)}
                          placeholder={`Search for stop ${i + 1}...`}
                          style={{
                            width: '100%', padding: '0.875rem 1rem', fontSize: '0.9375rem',
                            border: '1px solid var(--color-nets-border)', outline: 'none'
                          }}
                        />
                      </div>
                      <button onClick={() => removeStop(i)} style={{ background: 'transparent', border: 'none', color: 'var(--color-nets-text-3)', cursor: 'pointer', padding: '0.5rem' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {stops.length === 0 && (
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-3)', fontStyle: 'italic' }}>
                      No intermediate stops added yet. Click "Add Stop" to insert a destination along your route.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {showCustom && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-navy)', marginBottom: '0.5rem' }}>
                Custom Request Details
              </label>
              <textarea
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
                placeholder="Please describe your specific requirements..."
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1rem',
                  background: '#fff',
                  border: '2px solid var(--color-nets-border)',
                  outline: 'none',
                  color: 'var(--color-nets-navy-dark)',
                  transition: 'border-color 0.2s ease',
                  minHeight: '120px',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-nets-navy-dark)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-nets-border)'}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
