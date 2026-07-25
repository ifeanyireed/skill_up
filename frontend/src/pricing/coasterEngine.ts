// ============================================================================
// NETS Pricing Engine — Coaster Engine
// ============================================================================
// Toyota Coaster uses the Standard Engine for Daily Rate and Monthly Rate,
// but adds its own independent 3-Day Trip Rate tier.
//
// 3-Day Trip Rate (Coaster only):
//   Fuel Usage (3-day)      = Fuel Usage (daily) — NOT multiplied
//   All other lines (3-day) = daily value × 3
//   Running Total (3-day)   = sum of the seven lines
//   Mark-Up (3-day)         = Running Total (3-day) × Mark-Up Percentage
//   TOTAL (3-Day Trip Rate) = Running Total (3-day) + Mark-Up (3-day)
//
// Verification:
//   Daily:  Running Total = 160,500 → Mark-Up = 38,520 → TOTAL = ₦199,020  ✓
//   Monthly: ₦199,020 × 31 = ₦6,169,620  ✓
//   3-Day:  Running Total = 325,500 → Mark-Up = 78,120 → TOTAL = ₦403,620  ✓
//
// IMPORTANT: No intermediate rounding. Only round for on-screen display.
// ============================================================================

import type { VehiclePricingConfig, DailyRateBreakdown, MonthlyRateBreakdown, ThreeDayTripBreakdown } from './pricing.types'
import { calculateDailyRate, calculateMonthlyRate } from './standardEngine'
import { calculateFuel } from './fuelRules'

// Re-export Standard Engine daily/monthly for Coaster — they share identical logic.
export { calculateDailyRate, calculateMonthlyRate }

/**
 * Calculate the Coaster-only 3-Day Trip Rate.
 *
 * This is a STANDALONE quote — not a simple ×3 of the Daily Rate.
 * Fuel Usage is charged ONCE (not per day).
 * Every other line item is multiplied by 3.
 */
export function calculateThreeDayTripRate(
  config: VehiclePricingConfig,
  overrideDistanceKm?: number
): ThreeDayTripBreakdown {
  const fuel = calculateFuel(config, overrideDistanceKm)

  // Fuel is charged ONCE — not multiplied
  const fuelUsage = fuel.fuelUsagePerDay

  // All other line items × 3
  const driverSalary = config.driverSalaryPerDay * 3
  const vehicleMaintenance = config.vehicleMaintenancePerDay * 3
  const securityFees = config.securityFeesPerDay * 3
  const governmentLevies = config.governmentLeviesPerDay * 3
  const driverOutstationAllowance = config.driverOutstationAllowancePerDay * 3
  const depreciationCost = config.depreciationCostPerDay * 3

  // Running Total = sum of the 7 lines
  const runningTotal =
    fuelUsage +
    driverSalary +
    vehicleMaintenance +
    securityFees +
    governmentLevies +
    driverOutstationAllowance +
    depreciationCost

  // Mark-Up = Running Total × Mark-Up Percentage
  const markup = runningTotal * config.markupPercentage

  // TOTAL = Running Total + Mark-Up
  const totalThreeDayTrip = runningTotal + markup

  return {
    fuelUsage,
    driverSalary,
    vehicleMaintenance,
    securityFees,
    governmentLevies,
    driverOutstationAllowance,
    depreciationCost,
    runningTotal,
    markup,
    totalThreeDayTrip,
  }
}
