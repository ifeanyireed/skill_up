// ============================================================================
// NETS Pricing Engine — Vehicle Pricing Configuration (Seed Data)
// ============================================================================
// This file is the SINGLE SOURCE OF TRUTH for all vehicle pricing parameters.
// Values are transcribed line-for-line from the official Excel workbook.
//
// Administrators can update any value here without modifying the engine logic.
// ============================================================================

import type { VehiclePricingConfig, PricingEngineType } from './pricing.types'

// ── Official Excel Workbook Seed Data ──

export const COASTER_CONFIG: VehiclePricingConfig = {
  vehicleId: 'coaster',
  vehicleName: 'Toyota Coaster',
  engineType: 'coaster',

  // Fuel parameters
  referenceDistanceKm: 60,
  trips: 2,
  fuelEfficiencyRatio: 0.5,
  fuelCostPerLitre: 1300,

  // Daily operational costs (₦/day)
  driverSalaryPerDay: 10000,
  vehicleMaintenancePerDay: 12500,
  securityFeesPerDay: 3000,
  governmentLeviesPerDay: 2000,
  driverOutstationAllowancePerDay: 10000,
  depreciationCostPerDay: 45000,
  vehicleDocumentsPerDay: 5000, // Record only — excluded from totals

  // Margin
  markupPercentage: 0.24,
}

export const HIACE_CONFIG: VehiclePricingConfig = {
  vehicleId: 'hiace',
  vehicleName: 'Toyota HiAce',
  engineType: 'standard',

  // Fuel parameters
  referenceDistanceKm: 24,
  trips: 2,
  fuelEfficiencyRatio: 0.35,
  fuelCostPerLitre: 1120,

  // Daily operational costs (₦/day)
  driverSalaryPerDay: 10000,
  vehicleMaintenancePerDay: 8500,
  securityFeesPerDay: 2500,
  governmentLeviesPerDay: 1000,
  driverOutstationAllowancePerDay: 0,
  depreciationCostPerDay: 55000,
  vehicleDocumentsPerDay: 5000, // Record only — excluded from totals

  // Margin
  markupPercentage: 0.10,
}

/**
 * SUV inherits Hiace's exact formula and seed values by default.
 * This is an explicit business rule — configurable.
 */
export const SUV_CONFIG: VehiclePricingConfig = {
  ...HIACE_CONFIG,
  vehicleId: 'suv',
  vehicleName: 'Executive SUV',
  engineType: 'standard',
}

/**
 * Executive Bus — Standard Engine. Rates to be configured by New Era Transport.
 * Currently uses Hiace seed values as placeholder.
 */
export const EXECUTIVE_BUS_CONFIG: VehiclePricingConfig = {
  ...HIACE_CONFIG,
  vehicleId: 'midibus-18',
  vehicleName: '18-Seater Executive Shuttle',
  engineType: 'standard',
}

/**
 * Luxury Coach — Standard Engine. Rates to be configured by New Era Transport.
 * Currently uses Hiace seed values as placeholder.
 */
export const LUXURY_COACH_CONFIG: VehiclePricingConfig = {
  ...HIACE_CONFIG,
  vehicleId: 'coach-50',
  vehicleName: '50-Seater Luxury Coach',
  engineType: 'standard',
}

/**
 * Executive Sedan — Standard Engine. Rates to be configured by New Era Transport.
 * Currently uses Hiace seed values as placeholder.
 */
export const EXECUTIVE_SEDAN_CONFIG: VehiclePricingConfig = {
  ...HIACE_CONFIG,
  vehicleId: 'sedan',
  vehicleName: 'Executive Sedan',
  engineType: 'standard',
}

// ── Vehicle Configuration Registry ──

const VEHICLE_CONFIGS: Record<string, VehiclePricingConfig> = {
  'coaster': COASTER_CONFIG,
  'hiace': HIACE_CONFIG,
  'suv': SUV_CONFIG,
  'midibus-18': EXECUTIVE_BUS_CONFIG,
  'coach-50': LUXURY_COACH_CONFIG,
  'sedan': EXECUTIVE_SEDAN_CONFIG,
}

/**
 * Look up the pricing configuration for a given vehicle ID.
 * Falls back to Hiace (Standard Engine) for any unknown vehicle — this ensures
 * future vehicles automatically use the Standard Engine as specified.
 */
export function getVehiclePricingConfig(vehicleId: string): VehiclePricingConfig {
  return VEHICLE_CONFIGS[vehicleId] ?? {
    ...HIACE_CONFIG,
    vehicleId,
    vehicleName: `Vehicle (${vehicleId})`,
  }
}

/**
 * Determine which engine type a vehicle uses.
 */
export function getEngineType(vehicleId: string): PricingEngineType {
  return getVehiclePricingConfig(vehicleId).engineType
}

/**
 * Get all registered vehicle pricing configs.
 * Useful for admin interfaces.
 */
export function getAllVehiclePricingConfigs(): VehiclePricingConfig[] {
  return Object.values(VEHICLE_CONFIGS)
}
