// ============================================================================
// NETS Pricing Engine — Optional Services Module
// ============================================================================
// Configurable surcharge modules. ALL default to ₦0 / disabled.
// None of these have source values in the official Excel workbook.
// Do NOT invent placeholder numbers — default to disabled until
// New Era Transport supplies official figures.
//
// Architecture supports future: seasonal pricing, holiday pricing,
// corporate contracts, promotional discounts, coupon codes, loyalty,
// partner rates, government pricing.
// ============================================================================

import type { OptionalServiceConfig, OptionalServicesResult, MinimumChargeConfig } from './pricing.types'

// ── Default Optional Service Configurations ──
// Every service defaults to disabled (₦0).

export const DEFAULT_OPTIONAL_SERVICES: OptionalServiceConfig[] = [
  {
    id: 'extra-stops',
    name: 'Extra Stops',
    enabled: false,
    fixedCharge: 0,
    perKmCharge: 0,
    perHourCharge: 0,
  },
  {
    id: 'waiting-time',
    name: 'Waiting Time',
    enabled: false,
    fixedCharge: 0,
    perKmCharge: 0,
    perHourCharge: 0,
  },
  {
    id: 'overnight-trip',
    name: 'Overnight Trip',
    enabled: false,
    fixedCharge: 0,
    perKmCharge: 0,
    perHourCharge: 0,
  },
  {
    id: 'executive-service',
    name: 'Executive Service',
    enabled: false,
    fixedCharge: 0,
    perKmCharge: 0,
    perHourCharge: 0,
  },
  {
    id: 'airport-pickup',
    name: 'Airport Pickup',
    enabled: false,
    fixedCharge: 0,
    perKmCharge: 0,
    perHourCharge: 0,
  },
  {
    id: 'extra-luggage',
    name: 'Extra Luggage',
    enabled: false,
    fixedCharge: 0,
    perKmCharge: 0,
    perHourCharge: 0,
  },
  {
    id: 'vip-request',
    name: 'VIP Request',
    enabled: false,
    fixedCharge: 0,
    perKmCharge: 0,
    perHourCharge: 0,
  },
  {
    id: 'accessibility',
    name: 'Accessibility Requirements',
    enabled: false,
    fixedCharge: 0,
    perKmCharge: 0,
    perHourCharge: 0,
  },
]

// ── Default Minimum Charge Configuration ──
// Disabled by default — no source value exists.

export const DEFAULT_MINIMUM_CHARGE: MinimumChargeConfig = {
  enabled: false,
  minimumAmount: 0,
}

// ── Future Pricing Modules (Placeholders) ──
// These do not affect current calculations but are supported by the architecture.

export interface FuturePricingModule {
  id: string
  name: string
  enabled: boolean
  /** Percentage modifier (e.g. 1.15 for +15% seasonal surge) */
  multiplier: number
  /** Fixed amount to add or subtract */
  fixedAdjustment: number
}

export const FUTURE_PRICING_MODULES: FuturePricingModule[] = [
  { id: 'dynamic-fuel', name: 'Dynamic Fuel Prices', enabled: false, multiplier: 1, fixedAdjustment: 0 },
  { id: 'seasonal', name: 'Seasonal Pricing', enabled: false, multiplier: 1, fixedAdjustment: 0 },
  { id: 'holiday', name: 'Holiday Pricing', enabled: false, multiplier: 1, fixedAdjustment: 0 },
  { id: 'corporate-contract', name: 'Corporate Contracts', enabled: false, multiplier: 1, fixedAdjustment: 0 },
  { id: 'promotional', name: 'Promotional Discounts', enabled: false, multiplier: 1, fixedAdjustment: 0 },
  { id: 'coupon', name: 'Coupon Codes', enabled: false, multiplier: 1, fixedAdjustment: 0 },
  { id: 'loyalty', name: 'Loyalty Pricing', enabled: false, multiplier: 1, fixedAdjustment: 0 },
  { id: 'partner', name: 'Partner Rates', enabled: false, multiplier: 1, fixedAdjustment: 0 },
  { id: 'government', name: 'Government Pricing', enabled: false, multiplier: 1, fixedAdjustment: 0 },
]

/**
 * Calculate the total optional service charges for a journey.
 *
 * @param selectedExtras - The extras selected by the customer (string IDs)
 * @param distanceKm - Journey distance (for per-km charges)
 * @param durationHours - Journey duration (for per-hour charges)
 * @param serviceConfigs - The optional service configurations (defaults to DEFAULT_OPTIONAL_SERVICES)
 */
export function calculateOptionalServices(
  selectedExtras: string[],
  distanceKm: number,
  durationHours: number,
  serviceConfigs: OptionalServiceConfig[] = DEFAULT_OPTIONAL_SERVICES,
): OptionalServicesResult {
  const appliedServices: OptionalServicesResult['appliedServices'] = []

  for (const extra of selectedExtras) {
    const config = serviceConfigs.find(s => s.id === extra || s.name === extra)

    if (!config || !config.enabled) continue

    let charge = config.fixedCharge
    charge += config.perKmCharge * distanceKm
    charge += config.perHourCharge * durationHours

    if (charge > 0) {
      appliedServices.push({
        serviceId: config.id,
        serviceName: config.name,
        charge,
      })
    }
  }

  const totalOptionalCharges = appliedServices.reduce((sum, s) => sum + s.charge, 0)

  return {
    appliedServices,
    totalOptionalCharges,
  }
}

/**
 * Apply minimum charge threshold.
 * If the calculated total is below the minimum, return the minimum instead.
 * Returns the original total if minimum charge is disabled.
 */
export function applyMinimumCharge(
  calculatedTotal: number,
  minimumConfig: MinimumChargeConfig = DEFAULT_MINIMUM_CHARGE,
): { total: number; minimumApplied: boolean } {
  if (!minimumConfig.enabled || calculatedTotal >= minimumConfig.minimumAmount) {
    return { total: calculatedTotal, minimumApplied: false }
  }

  return { total: minimumConfig.minimumAmount, minimumApplied: true }
}
