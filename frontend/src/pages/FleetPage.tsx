import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { vehicleService } from '../services/vehicleService'
import { Vehicle } from '../types'
import { VehicleCard } from '../components/fleet/VehicleCard'
import { VehicleFilter } from '../components/fleet/VehicleFilter'
import { CompareDrawer } from '../components/fleet/CompareDrawer'
import { staggerContainer, staggerItem } from '../lib/motion'

export function FleetPage() {
  const [vehicleList, setVehicleList] = useState<Vehicle[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    vehicleService.getVehicles().then((data) => {
      setVehicleList(data)
      setIsLoading(false)
    })
  }, [])

  const categories = useMemo(() => {
    const cats = new Set(vehicleList.map(v => v.category))
    return Array.from(cats).sort()
  }, [vehicleList])

  const filteredVehicles = useMemo(() => {
    if (!activeCategory) return vehicleList
    return vehicleList.filter(v => v.category === activeCategory)
  }, [activeCategory, vehicleList])

  const selectedVehicles = useMemo(() => {
    return vehicleList.filter(v => compareIds.includes(v.id))
  }, [compareIds, vehicleList])

  const handleToggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 3) {
        return [...prev.slice(1), id]
      }
      return [...prev, id]
    })
  }

  return (
    <>
      {/* Cinematic Hero */}
      <section
        style={{
          position: 'relative',
          paddingTop: '200px',
          paddingBottom: '8rem',
          background: 'var(--color-nets-navy-dark)',
          overflow: 'hidden',
        }}
      >
        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="/vehicles/coaster.jpg"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, var(--color-nets-navy-dark) 0%, rgba(13,16,96,0.7) 100%)',
          }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'var(--color-nets-red)', zIndex: 2 }} />
        </div>

        <div className="container-nets" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={staggerItem} className="overline-dark" style={{ marginBottom: '2rem' }}>
              The Fleet Experience
            </motion.div>
            
            <motion.h1
              variants={staggerItem}
              className="text-d1 fw-300"
              style={{ color: '#fff', marginBottom: '2rem', maxWidth: '800px' }}
            >
              Choose the right vehicle
              <br /><strong style={{ fontWeight: 700 }}>for every journey.</strong>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="text-body-xl text-muted-light"
              style={{ maxWidth: '540px' }}
            >
              Whether you're moving executives, employees, students, wedding guests or conference delegates, our modern fleet delivers comfort, safety and absolute reliability.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <VehicleFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        totalResults={filteredVehicles.length}
      />

      {/* Vehicle Grid */}
      <section style={{ padding: '6rem 0', background: 'var(--color-nets-white)', minHeight: '50vh' }}>
        <div className="container-nets">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-nets-navy)' }}>
              Loading Fleet Catalog...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
              {filteredVehicles.map(vehicle => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isCompared={compareIds.includes(vehicle.id)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Compare Drawer */}
      <CompareDrawer
        selectedVehicles={selectedVehicles}
        onRemove={(id) => handleToggleCompare(id)}
        onClear={() => setCompareIds([])}
      />
    </>
  )
}
