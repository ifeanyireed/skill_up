import { useState, useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'
import { LocationData } from '../../store/useJourneyStore'
import { MAPBOX_TOKEN } from '../../config/api'

interface MapboxAutocompleteProps {
  value: string | null
  onChange: (value: string) => void
  onLocationSelect: (location: LocationData) => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}

export function MapboxAutocomplete({ value, onChange, onLocationSelect, placeholder, className, style }: MapboxAutocompleteProps) {
  const [query, setQuery] = useState(value || '')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value && value !== query) setQuery(value)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!query || query.length < 3 || query === value) {
        setSuggestions([])
        return
      }
      try {
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=ng&types=poi,address,place,locality,neighborhood`)
        const data = await res.json()
        setSuggestions(data.features || [])
        setIsOpen(true)
      } catch (err) {
        console.error('Mapbox search failed', err)
      }
    }
    const timeoutId = setTimeout(fetchPlaces, 300)
    return () => clearTimeout(timeoutId)
  }, [query, value])

  const handleSelect = (feature: any) => {
    setQuery(feature.place_name)
    setIsOpen(false)
    onChange(feature.place_name)
    
    onLocationSelect({
      address: feature.place_name,
      lat: feature.center[1],
      lng: feature.center[0],
      country: feature.context?.find((c: any) => c.id.startsWith('country'))?.text || 'Nigeria'
    })
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onChange(e.target.value)
          if (!e.target.value) onLocationSelect(null as any)
        }}
        onFocus={() => { if (suggestions.length > 0) setIsOpen(true) }}
        placeholder={placeholder}
        className={className}
        style={style}
      />
      {isOpen && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'var(--color-nets-navy-dark)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '4px',
          marginTop: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          maxHeight: '240px',
          overflowY: 'auto'
        }}>
          {suggestions.map((s) => (
            <div
              key={s.id}
              onClick={() => handleSelect(s)}
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '0.875rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ color: 'var(--color-nets-text-3)', display: 'flex', alignItems: 'center' }}>
                <MapPin size={16} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.text}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.place_name.replace(s.text + ', ', '')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
