import { useState, useRef, useEffect } from 'react'
import Map, { Marker, Source, Layer, MapRef } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useJourneyStore } from '../../store/useJourneyStore'
import { MapPinOff } from 'lucide-react'
import { RouteIntelligence } from './RouteIntelligence'
import { MAPBOX_TOKEN } from '../../config/api'

function MapBoundsController({ mapRef }: { mapRef: React.RefObject<MapRef | null> }) {
  const { pickup, destination, stops, journeyBounds } = useJourneyStore()
  
  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current.getMap()

    if (journeyBounds) {
      map.fitBounds(journeyBounds as any, { padding: 50, duration: 1000 })
      return
    }

    // Fallback bounds calculation
    const points = [pickup, ...stops, destination].filter(p => p && p.lat && p.lng)
    
    if (points.length > 0) {
      let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90
      points.forEach(p => {
        if (!p) return
        minLng = Math.min(minLng, p.lng)
        maxLng = Math.max(maxLng, p.lng)
        minLat = Math.min(minLat, p.lat)
        maxLat = Math.max(maxLat, p.lat)
      })
      map.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 50, duration: 1000 })
    }
  }, [mapRef, pickup, destination, stops, journeyBounds])

  return null
}

export function InteractiveMap() {
  const { pickup, destination, stops, routePolyline } = useJourneyStore()
  const mapRef = useRef<MapRef>(null)
  
  // Basic Mapbox style representing the professional minimal aesthetic
  const mapStyle = 'mapbox://styles/mapbox/light-v11'

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, background: 'var(--color-nets-navy-dark)' }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: 3.3792,
          latitude: 6.5244,
          zoom: 11
        }}
        mapStyle={mapStyle}
        attributionControl={false}
      >
        <MapBoundsController mapRef={mapRef} />
        <RouteIntelligence />

        {/* Route Line */}
        {routePolyline && (
          <Source id="route" type="geojson" data={{ type: 'Feature', properties: {}, geometry: routePolyline as any }}>
            <Layer
              id="route-line"
              type="line"
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
              }}
              paint={{
                'line-color': '#C0272D',
                'line-width': 4,
                'line-opacity': 0.8
              }}
            />
          </Source>
        )}

        {/* Pickup Marker */}
        {pickup && pickup.lat && pickup.lng && (
          <Marker longitude={pickup.lng} latitude={pickup.lat} anchor="center">
            <div style={{ width: '16px', height: '16px', background: '#fff', border: '4px solid var(--color-nets-navy)', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
          </Marker>
        )}

        {/* Stops Markers */}
        {stops.map((stop, i) => {
          if (!stop.lat || !stop.lng) return null
          return (
            <Marker key={i} longitude={stop.lng} latitude={stop.lat} anchor="center">
              <div style={{ width: '16px', height: '16px', background: 'var(--color-nets-navy)', border: '2px solid #fff', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>
                {i + 1}
              </div>
            </Marker>
          )
        })}

        {/* Destination Marker */}
        {destination && destination.lat && destination.lng && (
          <Marker longitude={destination.lng} latitude={destination.lat} anchor="center">
            <div style={{ width: '20px', height: '20px', background: 'var(--color-nets-red)', border: '4px solid #fff', borderRadius: '50%', boxShadow: '0 4px 12px rgba(192,39,45,0.4)' }} />
          </Marker>
        )}

      </Map>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle at center, transparent 0%, rgba(13,16,96,0.1) 100%)' }} />
    </div>
  )
}
