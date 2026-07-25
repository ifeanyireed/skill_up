import { useEffect } from 'react'
import { useJourneyStore, LocationData } from '../../store/useJourneyStore'
import { MAPBOX_TOKEN } from '../../config/api'

function getFallbackDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180) 
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)))
}

export function RouteIntelligence() {
  const { pickup, destination, stops, setRouteCalculations } = useJourneyStore()

  useEffect(() => {
    if (!pickup || !destination) {
      return
    }

    const calculateRoute = async () => {
      try {
        const waypoints = stops.filter((s: LocationData) => s.lat && s.lng)
        const coords = [
          `${pickup.lng},${pickup.lat}`,
          ...waypoints.map((s: LocationData) => `${s.lng},${s.lat}`),
          `${destination.lng},${destination.lat}`
        ].join(';')

        const res = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`)
        const data = await res.json()

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
          throw new Error('No route found')
        }

        const route = data.routes[0]
        
        let totalDistanceMeters = route.distance || 0
        let totalDurationSeconds = route.duration || 0

        const distanceKm = Math.round((totalDistanceMeters / 1000) * 10) / 10
        const durationMins = Math.round(totalDurationSeconds / 60)
        
        const insights: string[] = []
        if (distanceKm > 100) insights.push('Long Distance Journey')
        if (distanceKm > 300) insights.push('Interstate Journey')
        if (distanceKm <= 50) insights.push('Urban Journey')
        
        if (destination.country && destination.country !== 'Nigeria') {
          insights.push('International Border Crossing - Special Request')
        }

        // Calculate rudimentary bounds from the GeoJSON coordinates
        let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90
        route.geometry.coordinates.forEach((coord: [number, number]) => {
          minLng = Math.min(minLng, coord[0])
          maxLng = Math.max(maxLng, coord[0])
          minLat = Math.min(minLat, coord[1])
          maxLat = Math.max(maxLat, coord[1])
        })

        setRouteCalculations({
          distanceKm,
          distanceMeters: totalDistanceMeters,
          durationMins,
          durationSeconds: totalDurationSeconds,
          durationText: `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`,
          routePolyline: route.geometry, // GeoJSON
          journeyBounds: [[minLng, minLat], [maxLng, maxLat]], // Mapbox bounding box format
          journeyInsights: insights
        })

      } catch (err) {
        console.warn('Mapbox Directions failed, using Haversine fallback', err)
        
        // Fallback calculation
        let totalKm = 0
        const points = [pickup, ...stops, destination].filter(p => p && p.lat && p.lng) as any[]
        for (let i = 0; i < points.length - 1; i++) {
          totalKm += getFallbackDistanceKm(points[i].lat, points[i].lng, points[i+1].lat, points[i+1].lng)
        }
        totalKm = Math.max(1.5, Math.round(totalKm * 10) / 10)
        const totalMins = Math.round(totalKm * 2.5)

        const insights: string[] = []
        if (totalKm > 100) insights.push('Long Distance Journey')
        if (totalKm <= 50) insights.push('Urban Journey')

        setRouteCalculations({
          distanceKm: totalKm,
          distanceMeters: totalKm * 1000,
          durationMins: totalMins,
          durationSeconds: totalMins * 60,
          durationText: `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`,
          routePolyline: null,
          journeyBounds: null,
          journeyInsights: insights
        })
      }
    }

    calculateRoute()
  }, [pickup, destination, stops, setRouteCalculations])

  return null
}
