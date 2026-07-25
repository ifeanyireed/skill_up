import { API_URL } from '../config/api'
import { Vehicle } from '../types'
import { vehicles as fallbackVehicles } from '../data/vehicles'

export class VehicleService {
  /**
   * Normalize vehicle image paths (e.g. fix /images/vehicles/suv.jpg -> /vehicles/suv.png)
   */
  private normalizeVehicle(v: Vehicle): Vehicle {
    let img = v.imageUrl || ''
    if (img.includes('suv.jpg')) {
      img = img.replace('suv.jpg', 'suv.png')
    }
    if (img.startsWith('/images/')) {
      img = img.replace('/images/', '/')
    }

    const fallback = fallbackVehicles.find(
      (fb) => fb.slug === v.slug || fb.id === v.id || fb.slug.toLowerCase() === (v.slug || '').toLowerCase()
    )

    return {
      ...v,
      imageUrl: img || (fallback ? fallback.imageUrl : '/vehicles/suv.png'),
      editorialStory: v.editorialStory || (fallback ? fallback.editorialStory : ''),
      recommendedFor: v.recommendedFor || (fallback ? fallback.recommendedFor : []),
      gallery: v.gallery || (fallback ? fallback.gallery : [img]),
    }
  }

  /**
   * Fetch all vehicles from backend REST API (with static fallback).
   */
  public async getVehicles(): Promise<Vehicle[]> {
    try {
      const res = await fetch(`${API_URL}/vehicles`)
      if (res.ok) {
        const json = await res.json()
        if (json.data && Array.isArray(json.data.vehicles) && json.data.vehicles.length > 0) {
          return json.data.vehicles.map((v: Vehicle) => this.normalizeVehicle(v))
        }
      }
    } catch (err) {
      console.warn('⚠️ [VEHICLE SERVICE] Could not reach Go backend API, using local fallback:', err)
    }
    return fallbackVehicles.map((v) => this.normalizeVehicle(v))
  }

  /**
   * Fetch single vehicle by slug.
   */
  public async getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
    const targetSlug = slug.toLowerCase()
    try {
      const res = await fetch(`${API_URL}/vehicles/${slug}`)
      if (res.ok) {
        const json = await res.json()
        if (json.data && json.data.vehicle) {
          return this.normalizeVehicle(json.data.vehicle)
        }
      }
    } catch (err) {
      console.warn('⚠️ [VEHICLE SERVICE] Could not fetch vehicle detail from backend:', err)
    }

    const all = await this.getVehicles()
    return all.find(
      (v) =>
        v.slug.toLowerCase() === targetSlug ||
        v.id.toLowerCase() === targetSlug ||
        targetSlug.includes(v.slug.toLowerCase()) ||
        v.slug.toLowerCase().includes(targetSlug)
    )
  }
}

export const vehicleService = new VehicleService()
