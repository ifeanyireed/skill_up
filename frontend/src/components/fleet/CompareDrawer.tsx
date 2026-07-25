import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import type { Vehicle } from '@/types'

interface Props {
  selectedVehicles: Vehicle[]
  onRemove: (id: string) => void
  onClear: () => void
}

export function CompareDrawer({ selectedVehicles, onRemove, onClear }: Props) {
  if (selectedVehicles.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--color-nets-navy-dark)',
          borderTop: '3px solid var(--color-nets-red)',
          zIndex: 100,
          padding: '2rem 0',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
        }}
      >
        <div className="container-nets">
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.125rem', fontWeight: 600 }}>Compare Vehicles</h3>
              <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.5rem', borderRadius: '2px', color: '#fff' }}>
                {selectedVehicles.length} / 3 Selected
              </span>
            </div>
            <button
              onClick={onClear}
              style={{
                background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
                fontSize: '0.8125rem', cursor: 'pointer', transition: 'color 0.15s ease',
              }}
            >
              Clear Comparison
            </button>
          </div>

          {/* Compare Table Area */}
          <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            
            {/* The Vehicles */}
            {selectedVehicles.map(vehicle => (
              <div key={vehicle.id} style={{
                flex: '0 0 320px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '1.5rem',
                position: 'relative',
              }}>
                <button
                  onClick={() => onRemove(vehicle.id)}
                  style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                  }}
                  aria-label={`Remove ${vehicle.name}`}
                >
                  <X size={16} />
                </button>
                
                <h4 style={{ color: '#fff', fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', paddingRight: '2rem' }}>{vehicle.name}</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-nets-red)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                  {vehicle.category}
                </div>

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>Capacity</span>
                    <span style={{ fontSize: '0.8125rem', color: '#fff', fontWeight: 500 }}>{vehicle.capacity}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>Comfort</span>
                    <span style={{ fontSize: '0.8125rem', color: '#fff', fontWeight: 500 }}>{vehicle.comfortRating || 'Standard'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>Luggage</span>
                    <span style={{ fontSize: '0.8125rem', color: '#fff', fontWeight: 500 }}>{vehicle.luggageSpace?.split(' ')[0] || 'Standard'}</span>
                  </div>
                </div>

              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 3 - selectedVehicles.length) }).map((_, i) => (
              <div key={i} style={{
                flex: '0 0 320px',
                border: '1px dashed rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem', fontWeight: 500,
              }}>
                Add vehicle to compare
              </div>
            ))}
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  )
}
