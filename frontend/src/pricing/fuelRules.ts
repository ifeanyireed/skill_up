// ============================================================================
// NETS Pricing Engine — Fuel Rules Module
// ============================================================================
// Exact translation of the workbook's fuel sub-calculation.
//
// Daily Fuel Litres  = Distance (km) × Trips × Fuel Efficiency Ratio
// Fuel Usage (₦/day) = Daily Fuel Litres × Fuel Cost per Litre
//
// Verification:
//   Coaster: 60 × 2 × 0.5 = 60 litres → 60 × 1,300 = ₦78,000/day  ✓
//   Hiace:   24 × 2 × 0.35 = 16.8 litres → 16.8 × 1,120 = ₦18,816/day  ✓
// ============================================================================

import type { VehiclePricingConfig, FuelCalculation } from './pricing.types'

/**
 * Calculate daily fuel usage from the vehicle's pricing configuration.
 *
 * Uses the workbook's reference distance and trips by default.
 * When `overrideDistanceKm` is provided (from live Google Maps data),
 * it replaces the reference distance — subject to business decision.
 *
 * IMPORTANT: No intermediate rounding. All values are raw numbers.
 */
export function calculateFuel(
  config: VehiclePricingConfig,
  overrideDistanceKm?: number
): FuelCalculation {
  const distance = overrideDistanceKm ?? config.referenceDistanceKm
  const trips = config.trips

  const dailyFuelLitres = distance * trips * config.fuelEfficiencyRatio
  const fuelUsagePerDay = dailyFuelLitres * config.fuelCostPerLitre

  return {
    dailyFuelLitres,
    fuelUsagePerDay,
  }
}
