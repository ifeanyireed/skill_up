import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'

interface Props {
  categories: string[]
  activeCategory: string | null
  onSelectCategory: (category: string | null) => void
  totalResults: number
}

export function VehicleFilter({ categories, activeCategory, onSelectCategory, totalResults }: Props) {
  return (
    <div style={{
      borderBottom: '1px solid var(--color-nets-border)',
      background: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div className="container-nets" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1rem 0', overflowX: 'auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-nets-navy)', paddingRight: '2rem', borderRight: '1px solid var(--color-nets-border)', flexShrink: 0 }}>
          <Filter size={18} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Filter Fleet
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onSelectCategory(null)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: 500,
              background: activeCategory === null ? 'var(--color-nets-navy-dark)' : 'transparent',
              color: activeCategory === null ? '#fff' : 'var(--color-nets-text-2)',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            All Vehicles
          </button>
          
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: 500,
                background: activeCategory === cat ? 'var(--color-nets-navy-dark)' : 'transparent',
                color: activeCategory === cat ? '#fff' : 'var(--color-nets-text-2)',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--color-nets-text-2)', fontWeight: 500, whiteSpace: 'nowrap' }}>
          Showing {totalResults} {totalResults === 1 ? 'vehicle' : 'vehicles'}
        </div>
        
      </div>
    </div>
  )
}
