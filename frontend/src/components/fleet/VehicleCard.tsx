import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Briefcase, Plus, Check } from 'lucide-react'
import type { Vehicle } from '@/types'

interface Props {
  vehicle: Vehicle
  isCompared: boolean
  onToggleCompare: (id: string) => void
}

export function VehicleCard({ vehicle, isCompared, onToggleCompare }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        border: '1px solid var(--color-nets-border)',
        overflow: 'hidden',
      }}
    >
      {/* Image Container */}
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: 'var(--color-nets-light)' }}>
        <img
          src={vehicle.imageUrl}
          alt={vehicle.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(255,255,255,0.95)',
          padding: '0.25rem 0.75rem',
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-nets-navy)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          {vehicle.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
            {vehicle.name}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-nets-text-2)', lineHeight: 1.6 }}>
            {vehicle.bestFor}
          </p>
        </div>

        {/* Key Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--color-nets-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} color="var(--color-nets-red)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>
              {vehicle.capacity} Passengers
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={16} color="var(--color-nets-red)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>
              {vehicle.luggageSpace?.split(' ')[0] || 'Standard'} Luggage
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            to={`/fleet/${vehicle.slug}`}
            className="btn btn-navy"
            style={{ flex: 1, textAlign: 'center', padding: '0.875rem' }}
          >
            View Details
          </Link>
          <button
            onClick={() => onToggleCompare(vehicle.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              border: isCompared ? '1px solid var(--color-nets-navy-dark)' : '1px solid var(--color-nets-border)',
              background: isCompared ? 'var(--color-nets-navy-dark)' : 'transparent',
              color: isCompared ? '#fff' : 'var(--color-nets-navy-dark)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            aria-label={isCompared ? 'Remove from comparison' : 'Add to comparison'}
          >
            {isCompared ? <Check size={20} /> : <Plus size={20} />}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
