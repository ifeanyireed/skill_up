/**
 * Centralized Environment & API Configuration
 */

export const API_URL = 
  import.meta.env.NEXT_PUBLIC_API_URL || 
  import.meta.env.VITE_API_URL || 
  'http://localhost:8080/api/v1'

export const MAPBOX_TOKEN = 
  import.meta.env.NEXT_PUBLIC_MAPBOX_TOKEN || 
  import.meta.env.VITE_MAPBOX_TOKEN || 
  'pk.eyJ1IjoiYmxlc3NlZG1hcHMiLCJhIjoiY2x4ZXZoNDRjMDBqMTJpcTFkYzdsdDF5aSJ9.placeholder'
