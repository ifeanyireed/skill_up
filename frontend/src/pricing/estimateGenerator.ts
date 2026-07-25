// ============================================================================
// NETS Pricing Engine — Estimate Generator (Pipeline Orchestrator)
// ============================================================================
// The MAIN PIPELINE that orchestrates the entire pricing calculation.
//
// Pipeline sequence:
//   1. Validate inputs
//   2. Resolve vehicle → engine type (Standard or Coaster)
//   3. Resolve pricing config
//   4. Calculate fuel
//   5. Calculate daily rate
//   6. Calculate 3-day rate (Coaster only)
//   7. Calculate monthly rate
//   8. Apply optional services
//   9. Apply minimum charge rules
//  10. Generate EstimatedInvestment result
//
// IMPORTANT: No intermediate rounding. Only round for on-screen display.
// ============================================================================

import type {
  JourneyPricingInput,
  EstimatedInvestment,
  DailyRateBreakdown,
  MonthlyRateBreakdown,
  ThreeDayTripBreakdown,
} from './pricing.types'
import { getVehiclePricingConfig } from './vehiclePricingConfig'
import { calculateDailyRate, calculateMonthlyRate } from './standardEngine'
import { calculateThreeDayTripRate } from './coasterEngine'
import { calculateOptionalServices, applyMinimumCharge } from './optionalServices'
import { PricingError, validatePricingInputs } from './pricingErrors'
import { PRICING_ENGINE_VERSION } from './crmPayloadBuilder'

/**
 * Generate a complete pricing estimate for a journey.
 *
 * This is the single entry point for all pricing calculations.
 * Returns a structured EstimatedInvestment containing both
 * customer-safe and internal data.
 *
 * @throws PricingError if inputs are invalid (catch and show customer message)
 */
export function generateEstimate(input: JourneyPricingInput): EstimatedInvestment {
  // ── Step 1: Validate inputs ──
  const validationErrors = validatePricingInputs({
    vehicleId: input.vehicleId,
    distanceKm: input.distanceKm,
  })

  if (validationErrors.length > 0) {
    throw new PricingError(
      `Pricing validation failed: ${validationErrors.join(', ')}`,
      'VALIDATION_ERROR'
    )
  }

  // ── Step 2 & 3: Resolve vehicle → config ──
  const config = getVehiclePricingConfig(input.vehicleId)

  // Determine if we should use live Google Maps distance or workbook reference
  const distanceOverride = input.useReferenceDistance ? undefined : input.distanceKm

  // ── Step 4 & 5: Calculate daily rate (includes fuel) ──
  const dailyBreakdown: DailyRateBreakdown = calculateDailyRate(config, distanceOverride)

  // ── Step 6: Calculate 3-day rate (Coaster only) ──
  let threeDayBreakdown: ThreeDayTripBreakdown | null = null
  if (config.engineType === 'coaster') {
    threeDayBreakdown = calculateThreeDayTripRate(config, distanceOverride)
  }

  // ── Step 7: Calculate monthly rate ──
  const monthlyBreakdown: MonthlyRateBreakdown = calculateMonthlyRate(config, distanceOverride)

  // ── Step 8: Apply optional services ──
  const durationHours = input.durationMinutes / 60
  const optionalServices = calculateOptionalServices(
    input.selectedExtras,
    input.distanceKm,
    durationHours
  )

  // ── Step 9: Determine which rate tier to use and apply minimum charge ──
  let baseEstimate: number
  let rateTier: EstimatedInvestment['rateTier']

  if (input.tripType === 'Multi-Day' && threeDayBreakdown) {
    // Coaster 3-Day Trip Rate
    baseEstimate = threeDayBreakdown.totalThreeDayTrip
    rateTier = 'three-day'
  } else if (input.tripType === 'Recurring') {
    // Monthly rate for recurring journeys
    baseEstimate = monthlyBreakdown.totalMonthly
    rateTier = 'monthly'
  } else {
    // Default: daily rate
    baseEstimate = dailyBreakdown.totalDaily
    rateTier = 'daily'
  }

  // Add optional service charges
  const totalWithOptionals = baseEstimate + optionalServices.totalOptionalCharges

  // Apply minimum charge
  const { total: finalTotal, minimumApplied } = applyMinimumCharge(totalWithOptionals)

  // ── Step 10: Generate single Estimated Investment ──
  // The TOTAL produced by the engine IS the Estimated Investment — no band or spread applied.
  const estimatedInvestment = finalTotal

  // ── Build pricing notes ──
  const pricingNotes: string[] = []

  if (input.useReferenceDistance) {
    pricingNotes.push(`Calculated using workbook reference distance (${config.referenceDistanceKm} km)`)
  } else {
    pricingNotes.push(`Calculated using live Google Maps distance (${input.distanceKm} km)`)
  }

  if (config.engineType === 'coaster') {
    pricingNotes.push('Coaster Engine applied')
    if (threeDayBreakdown) {
      pricingNotes.push('3-Day Trip Rate available')
    }
  } else {
    pricingNotes.push('Standard Engine applied')
  }

  if (minimumApplied) {
    pricingNotes.push('Minimum charge threshold applied')
  }

  if (optionalServices.appliedServices.length > 0) {
    pricingNotes.push(`${optionalServices.appliedServices.length} optional service(s) applied`)
  }

  if (input.journeyInsights.length > 0) {
    pricingNotes.push(...input.journeyInsights)
  }

  return {
    estimatedInvestment,
    rateTier,
    vehicleId: config.vehicleId,
    vehicleName: config.vehicleName,
    dailyBreakdown,
    monthlyBreakdown,
    threeDayBreakdown,
    optionalServices,
    minimumChargeApplied: minimumApplied,
    pricingNotes,
    pricingVersion: PRICING_ENGINE_VERSION,
    calculatedAt: new Date().toISOString(),
  }
}
